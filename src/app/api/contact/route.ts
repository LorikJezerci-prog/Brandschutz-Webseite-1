import { NextResponse } from "next/server";
import { site } from "@/config/site";
import { contactMessages as messages } from "@/lib/contact/messages";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { sendContact } from "@/lib/contact/send";
import { validateContact, type FieldErrors } from "@/lib/contact/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const perIp = createRateLimiter({ limit: 5, windowMs: 15 * 60 * 1000 });
const globalLimit = createRateLimiter({ limit: 60, windowMs: 60 * 60 * 1000 });

/** Mindestdauer zwischen Laden des Formulars und Absenden (Bots sind schneller) */
const MIN_FILL_MS = 2500;

type Outcome =
  | { status: 200; ok: true; via?: string }
  | { status: 400 | 403 | 413 | 415 | 422 | 429 | 502 | 503; ok: false; code: string; message: string; errors?: FieldErrors };


function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
}

function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // ältere Browser und Formular-POST ohne Origin
  try {
    const o = new URL(origin);
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    return o.host === host || o.origin === new URL(site.url).origin;
  } catch {
    return false;
  }
}

async function handle(req: Request): Promise<{ outcome: Outcome; isForm: boolean }> {
  const type = req.headers.get("content-type") ?? "";
  const isForm = type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");
  const fail = (status: Exclude<Outcome["status"], 200>, code: string, errors?: FieldErrors) => ({
    outcome: { status, ok: false as const, code, message: messages[code], errors },
    isForm,
  });

  if (!sameOrigin(req)) return fail(403, "origin");
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) return fail(413, "size");
  if (!isForm && !type.includes("application/json")) return fail(415, "format");

  let raw: Record<string, unknown>;
  try {
    raw = isForm ? Object.fromEntries((await req.formData()).entries()) : await req.json();
    if (!raw || typeof raw !== "object") throw new Error("kein Objekt");
  } catch {
    return fail(400, "format");
  }

  if (!perIp(clientIp(req)) || !globalLimit("all")) return fail(429, "rate");

  // Honeypot und Zeitfalle: Bots erhalten eine neutrale Erfolgsmeldung, es wird nichts versendet.
  const started = Number(raw._t);
  if ((typeof raw.website === "string" && raw.website.trim() !== "") || (started > 0 && Date.now() - started < MIN_FILL_MS)) {
    console.warn("[kontakt] Spam-Verdacht verworfen");
    return { outcome: { status: 200, ok: true }, isForm };
  }

  const { data, errors } = validateContact(raw);
  if (!data) return fail(422, "invalid", errors);

  const result = await sendContact(data);
  if (!result.ok) return fail(result.reason === "not-configured" ? 503 : 502, result.reason === "not-configured" ? "config" : "failed");
  return { outcome: { status: 200, ok: true, via: result.via }, isForm };
}

export async function POST(req: Request) {
  const { outcome, isForm } = await handle(req);

  // Ohne JavaScript: klassische Weiterleitung (Post/Redirect/Get)
  if (isForm) {
    const target = outcome.ok
      ? "/kontakt/danke"
      : `/kontakt?fehler=${outcome.code}${outcome.errors ? `&felder=${Object.keys(outcome.errors).join(",")}` : ""}#formular`;
    return NextResponse.redirect(new URL(target, req.url), 303);
  }

  const { status, ...body } = outcome;
  return NextResponse.json(body, { status });
}

export function GET() {
  return NextResponse.json({ ok: false, message: "Nur POST." }, { status: 405, headers: { Allow: "POST" } });
}
