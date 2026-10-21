import { services } from "@/config/services";

export const OTHER_SERVICE = "sonstiges";

export interface ContactInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  message: string;
  privacy: boolean;
}

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

export const serviceOptions = [
  ...services.map((s) => ({ value: s.slug, label: s.title })),
  { value: OTHER_SERVICE, label: "Sonstiges oder noch offen" },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[0-9+()/\-.\s]{6,40}$/;

/** Entfernt Steuerzeichen; einzeilige Felder verlieren auch Zeilenumbrüche (Schutz vor Header-Injection). */
const clean = (v: unknown, multiline = false) => {
  if (typeof v !== "string") return "";
  const s = v.replace(multiline ? /[\u0000-\u0009\u000B\u000C\u000E-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, " ");
  return s.trim();
};

const truthy = (v: unknown) => v === true || v === "on" || v === "true" || v === "1";

export function validateContact(raw: Record<string, unknown>): { data?: ContactInput; errors: FieldErrors } {
  const data: ContactInput = {
    name: clean(raw.name),
    company: clean(raw.company),
    email: clean(raw.email).toLowerCase(),
    phone: clean(raw.phone),
    service: clean(raw.service),
    location: clean(raw.location),
    message: clean(raw.message, true),
    privacy: truthy(raw.privacy),
  };
  const e: FieldErrors = {};

  if (data.name.length < 2) e.name = "Bitte geben Sie Ihren Namen an.";
  else if (data.name.length > 100) e.name = "Der Name ist zu lang (höchstens 100 Zeichen).";

  if (data.company.length < 2) e.company = "Bitte geben Sie Ihr Unternehmen an.";
  else if (data.company.length > 150) e.company = "Der Firmenname ist zu lang (höchstens 150 Zeichen).";

  if (!EMAIL.test(data.email) || data.email.length > 200) e.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";

  if (data.phone && !PHONE.test(data.phone)) e.phone = "Die Telefonnummer enthält ungültige Zeichen.";

  if (!serviceOptions.some((o) => o.value === data.service)) e.service = "Bitte wählen Sie eine Leistung aus.";

  if (data.location.length < 2) e.location = "Bitte geben Sie den Standort des Objekts an.";
  else if (data.location.length > 150) e.location = "Die Ortsangabe ist zu lang (höchstens 150 Zeichen).";

  if (data.message.length < 10) e.message = "Bitte beschreiben Sie Ihr Anliegen in ein paar Sätzen.";
  else if (data.message.length > 4000) e.message = "Die Nachricht ist zu lang (höchstens 4000 Zeichen).";

  if (!data.privacy) e.privacy = "Bitte bestätigen Sie, dass Sie die Datenschutzhinweise gelesen haben.";

  return Object.keys(e).length ? { errors: e } : { data, errors: {} };
}

export const serviceLabel = (value: string) => serviceOptions.find((o) => o.value === value)?.label ?? value;
