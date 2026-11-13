"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/config/services";
import { contactMessages } from "@/lib/contact/messages";
import { OTHER_SERVICE, type FieldErrors } from "@/lib/contact/validate";

type State =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; devOnly: boolean }
  | { kind: "error"; message: string; errors: FieldErrors };

const options = [
  ...services.map((s) => ({
    value: s.slug,
    label: s.group === "partner" ? `${s.title} (über Fachbetrieb)` : s.title,
  })),
  { value: OTHER_SERVICE, label: "Sonstiges oder noch offen" },
];

interface Props {
  /** Fehler aus der Weiterleitung ohne JavaScript */
  initialError?: string;
  initialFields?: string[];
}

export function ContactForm({ initialError, initialFields = [] }: Props) {
  const [state, setState] = useState<State>(
    initialError
      ? { kind: "error", message: initialError, errors: Object.fromEntries(initialFields.map((f) => [f, "Bitte prüfen."])) }
      : { kind: "idle" },
  );
  const [service, setService] = useState("");
  const started = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
    const q = new URLSearchParams(window.location.search);
    const wanted = q.get("leistung");
    if (wanted && options.some((o) => o.value === wanted)) setService(wanted);
    // Rückmeldung von kontakt.php ohne JavaScript (Weiterleitung mit ?fehler=…)
    const code = q.get("fehler");
    if (code) {
      const fields = (q.get("felder") ?? "").split(",").filter(Boolean);
      setState({
        kind: "error",
        message: contactMessages[code] ?? contactMessages.failed,
        errors: Object.fromEntries(fields.map((f) => [f, "Bitte prüfen."])),
      });
    }
  }, []);

  useEffect(() => {
    if (state.kind === "success" || state.kind === "error") statusRef.current?.focus();
  }, [state.kind]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ kind: "sending" });
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.ok) {
        setState({ kind: "success", devOnly: body.via === "log" });
        form.reset();
        return;
      }
      setState({
        kind: "error",
        message: body.message ?? "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        errors: body.errors ?? {},
      });
    } catch {
      setState({
        kind: "error",
        message: "Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
        errors: {},
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div className="form-result form-result--ok" role="status" tabIndex={-1} ref={statusRef}>
        <p className="form-result__title">Vielen Dank, Ihre Anfrage ist eingegangen.</p>
        <p>Sie erhalten eine Antwort an die angegebene E-Mail-Adresse.</p>
        {state.devOnly && (
          <p className="form-result__dev">
            Entwicklungsmodus: Es ist noch kein E-Mail-Versand eingerichtet, die Anfrage wurde nur im Server-Log
            protokolliert.
          </p>
        )}
        <button type="button" className="btn btn--ghost" onClick={() => setState({ kind: "idle" })}>
          Weitere Anfrage stellen
        </button>
      </div>
    );
  }

  const errors = state.kind === "error" ? state.errors : {};
  const field = (name: keyof FieldErrors) => ({
    name,
    id: `f-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });
  const err = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p className="field__error" id={`e-${name}`}>
        {errors[name]}
      </p>
    ) : null;

  return (
    <form className="form" action="/kontakt.php" method="post" onSubmit={onSubmit} id="formular" noValidate={false}>
      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="form__status">
        {state.kind === "error" && <p className="form-result form-result--error">{state.message}</p>}
      </div>

      <div className="form__grid">
        <div className="field">
          <label htmlFor="f-name">Name</label>
          <input {...field("name")} type="text" autoComplete="name" required minLength={2} maxLength={100} />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="f-company">Unternehmen</label>
          <input {...field("company")} type="text" autoComplete="organization" required minLength={2} maxLength={150} />
          {err("company")}
        </div>
        <div className="field">
          <label htmlFor="f-email">E-Mail-Adresse</label>
          <input {...field("email")} type="email" autoComplete="email" required maxLength={200} />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="f-phone">
            Telefon <span className="field__opt">optional</span>
          </label>
          <input {...field("phone")} type="tel" autoComplete="tel" maxLength={40} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="f-service">Gewünschte Leistung</label>
          <select {...field("service")} required value={service} onChange={(e) => setService(e.target.value)}>
            <option value="" disabled>
              Bitte wählen
            </option>
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("service")}
        </div>
        <div className="field">
          <label htmlFor="f-location">Standort des Objekts</label>
          <input {...field("location")} type="text" placeholder="z. B. Lampertheim, Gewerbegebiet" required minLength={2} maxLength={150} />
          {err("location")}
        </div>
        <div className="field field--full">
          <label htmlFor="f-message">Nachricht</label>
          <textarea {...field("message")} rows={6} required minLength={10} maxLength={4000} placeholder="Worum geht es, welche Unterlagen gibt es bereits, gibt es einen Termin oder Anlass?" />
          {err("message")}
        </div>
      </div>

      {/* Spamschutz: für Menschen unsichtbar */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-website">Website</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="_t" ref={started} defaultValue="" />

      <div className="field field--check">
        <input {...field("privacy")} type="checkbox" required />
        <label htmlFor="f-privacy">
          Ich habe die <a href="/datenschutz/">Datenschutzhinweise</a> gelesen. Meine Angaben werden ausschließlich zur
          Bearbeitung dieser Anfrage verwendet.
        </label>
        {err("privacy")}
      </div>

      <div className="form__actions">
        <button className="btn btn--primary btn--large" type="submit" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Wird gesendet …" : "Unverbindliche Anfrage stellen"}
        </button>
      </div>
    </form>
  );
}
