import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact/validate";

const valid = {
  name: "Erika Muster",
  company: "Muster Logistik GmbH",
  email: "Erika@Example.de",
  phone: "+49 6206 123456",
  service: "brandschutzordnung",
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
