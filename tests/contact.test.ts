import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { sendContact } from "@/lib/contact/send";
import { validateContact } from "@/lib/contact/validate";

const valid = {
  name: "Erika Muster",
  company: "Muster Logistik GmbH",
  email: "Erika@Example.de",
  phone: "+49 6206 123456",
  service: "brandschutzordnung-flucht-und-rettungsplaene",
  location: "Lampertheim",
  message: "Wir benötigen eine aktuelle Brandschutzordnung für unser Lager.",
  privacy: "on",
};

describe("validateContact", () => {
  it("akzeptiert eine vollständige Anfrage und normalisiert die E-Mail", () => {
    const { data, errors } = validateContact(valid);
    expect(errors).toEqual({});
    expect(data?.email).toBe("erika@example.de");
    expect(data?.privacy).toBe(true);
  });

  it("meldet fehlende Pflichtfelder einzeln", () => {
    const { data, errors } = validateContact({});
    expect(data).toBeUndefined();
    expect(Object.keys(errors).sort()).toEqual(["company", "email", "location", "message", "name", "privacy", "service"]);
  });

  it("lehnt unbekannte Leistungen und ungültige Telefonnummern ab", () => {
    const { errors } = validateContact({ ...valid, service: "shop", phone: "<script>" });
    expect(errors.service).toBeDefined();
    expect(errors.phone).toBeDefined();
  });

  it("entfernt Zeilenumbrüche aus einzeiligen Feldern (Header-Injection)", () => {
    const { data } = validateContact({ ...valid, company: "Firma\r\nBcc: x@y.de" });
    expect(data?.company).not.toMatch(/[\r\n]/);
  });

  it("behält Zeilenumbrüche in der Nachricht", () => {
    const { data } = validateContact({ ...valid, message: "Zeile eins\nZeile zwei ist auch da" });
    expect(data?.message).toContain("\n");
  });
});

describe("createRateLimiter", () => {
  it("begrenzt je Schlüssel und gibt nach dem Zeitfenster wieder frei", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("a", 0)).toBe(true);
    expect(check("a", 10)).toBe(true);
    expect(check("a", 20)).toBe(false);
    expect(check("b", 20)).toBe(true);
    expect(check("a", 1100)).toBe(true);
  });
});

describe("sendContact", () => {
  const data = validateContact(valid).data!;

  it("täuscht in Produktion ohne Konfiguration keinen Erfolg vor", async () => {
    const r = await sendContact(data, { NODE_ENV: "production" } as NodeJS.ProcessEnv);
    expect(r).toEqual({ ok: false, reason: "not-configured" });
  });

  it("protokolliert in der Entwicklung nur", async () => {
    const r = await sendContact(data, { NODE_ENV: "development" } as NodeJS.ProcessEnv);
    expect(r).toEqual({ ok: true, via: "log" });
  });
});
