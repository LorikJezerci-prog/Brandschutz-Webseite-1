import { site } from "@/config/site";
import { serviceLabel, type ContactInput } from "./validate";

export type SendResult = { ok: true; via: "smtp" | "resend" | "log" } | { ok: false; reason: "not-configured" | "failed" };

function compose(d: ContactInput) {
  const subject = `Anfrage über die Website: ${serviceLabel(d.service)} · ${d.company}`.slice(0, 180);
  const text = [
    `Neue Anfrage über ${site.name}`,
    "",
    `Name:        ${d.name}`,
    `Unternehmen: ${d.company}`,
    `E-Mail:      ${d.email}`,
    `Telefon:     ${d.phone || "nicht angegeben"}`,
    `Leistung:    ${serviceLabel(d.service)}`,
    `Objekt:      ${d.location}`,
    "",
    "Nachricht:",
    d.message,
    "",
    `Datenschutzhinweise bestätigt: ja (${new Date().toISOString()})`,
  ].join("\n");
  return { subject, text };
}

/**
 * Versand an CONTACT_TO_EMAIL. Reihenfolge: SMTP (eigener Mail-Anbieter), dann Resend.
 * Ohne Konfiguration wird in der Entwicklung nur protokolliert; in Produktion
 * schlägt der Versand ehrlich fehl, statt Erfolg vorzutäuschen.
 */
export async function sendContact(d: ContactInput, env = process.env): Promise<SendResult> {
  const to = env.CONTACT_TO_EMAIL;
  const from = env.CONTACT_FROM_EMAIL || to;
  const { subject, text } = compose(d);

  if (to && env.SMTP_HOST) {
    try {
      const nodemailer = await import("nodemailer");
      const transport = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT || 587),
        secure: env.SMTP_SECURE === "true",
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      });
      await transport.sendMail({ from, to, replyTo: d.email, subject, text });
      return { ok: true, via: "smtp" };
    } catch (err) {
      console.error("[kontakt] SMTP-Versand fehlgeschlagen", err);
      return { ok: false, reason: "failed" };
    }
  }

  if (to && env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [to], reply_to: d.email, subject, text }),
      });
      if (!res.ok) {
        console.error("[kontakt] Resend antwortet mit", res.status, await res.text());
        return { ok: false, reason: "failed" };
      }
      return { ok: true, via: "resend" };
    } catch (err) {
      console.error("[kontakt] Resend nicht erreichbar", err);
      return { ok: false, reason: "failed" };
    }
  }

  if (env.NODE_ENV !== "production") {
    console.info("[kontakt] Kein Versand konfiguriert. Anfrage nur protokolliert:\n" + text);
    return { ok: true, via: "log" };
  }
  return { ok: false, reason: "not-configured" };
}
