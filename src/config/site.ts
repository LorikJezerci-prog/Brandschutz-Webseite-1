/**
 * Zentrale Unternehmensdaten.
 *
 * Alles, was noch nicht feststeht, ist mit ph("…") als Platzhalter markiert.
 * Platzhalter werden auf der Website sichtbar hervorgehoben und von
 * `npm run check:launch` gemeldet. Vor der Veröffentlichung müssen alle
 * Platzhalter durch echte, belegbare Angaben ersetzt sein.
 */

export type Placeholder = { placeholder: string };
export type Value = string | Placeholder;

export const ph = (label: string): Placeholder => ({ placeholder: label });
export const isPlaceholder = (v: unknown): v is Placeholder =>
  typeof v === "object" && v !== null && "placeholder" in v;
export const text = (v: Value) => (isPlaceholder(v) ? `[Platzhalter: ${v.placeholder}]` : v);

/**
 * Freischaltung von Leistungen. Ein Schalter wird erst auf `true` gesetzt,
 * wenn die Voraussetzung tatsächlich nachgewiesen ist (Zeugnis, Zertifikat,
 * Vertrag mit Fachpartner).
 */
export const capabilities = {
  /** Lehrgang Brandschutzbeauftragter nach DGUV Information 205-003 bestanden */
  bsb: false,
  /** Software, Vorlagen und Routine für die Erstellung von Flucht- und Rettungsplänen */
  frp: false,
  /** Sachkunde für Feststellanlagen (z. B. Herstellerschulung) oder Vertrag mit Fachbetrieb */
  fsa: false,
  /** Kooperation mit einer nach DIN 14675 zertifizierten Fachfirma für Brandmeldeanlagen */
  bma: false,
} as const;

export type Capability = keyof typeof capabilities;

export const site = {
  name: "Brandschutz Ried",
  shortName: "Brandschutz Ried",
  /** Öffentliche Adresse, wird über NEXT_PUBLIC_SITE_URL gesetzt */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Organisatorischer Brandschutz für Unternehmen im Hessischen Ried und an der Bergstraße: Beratung, Brandschutzordnung, Unterweisungen und perspektivisch die Betreuung als externer Brandschutzbeauftragter.",
  region: {
    label: "Hessisches Ried · Bergstraße",
    areas: ["Lampertheim", "Hessisches Ried", "Kreis Bergstraße"],
    later: ["Rhein-Neckar"],
  },

  /**
   * Suchmaschinen erst zulassen, wenn alle Platzhalter ersetzt sind und das
   * Gewerbe angemeldet ist.
   */
  indexable: false,

  /** Aktueller Unternehmensstatus, wird im Footer und im Abschnitt „Hintergrund“ gezeigt */
  status: {
    founded: false,
    note: "Brandschutz Ried befindet sich im Aufbau. Leistungen werden schrittweise freigeschaltet, sobald die jeweiligen Voraussetzungen nachgewiesen sind.",
  },

  founder: {
    name: ph("Vor- und Nachname des Inhabers"),
    role: "Inhaber",
  },

  contact: {
    email: ph("Geschäftliche E-Mail-Adresse") as Value,
    phone: ph("Telefonnummer") as Value,
    street: ph("Straße und Hausnummer") as Value,
    zip: ph("PLZ") as Value,
    city: "Lampertheim" as Value,
  },

  legal: {
    owner: ph("Vor- und Nachname (Inhaber)") as Value,
    legalForm: ph("Rechtsform, z. B. Einzelunternehmen") as Value,
    vatId: ph("USt-IdNr. oder Hinweis auf Kleinunternehmerregelung") as Value,
    responsibleForContent: ph("Name und Anschrift nach § 18 Abs. 2 MStV") as Value,
    hostingProvider: ph("Hosting-Anbieter mit Anschrift") as Value,
    mailProvider: ph("E-Mail-Anbieter für das Kontaktformular") as Value,
  },

  /**
   * Nachgewiesene Qualifikationen und laufende Weiterbildung. Nur eintragen,
   * was durch Zeugnis oder Bescheinigung belegbar ist.
   */
  qualifications: [
    {
      label: "Chemikant",
      detail: "Berufsausbildung, tätig im chemischen Produktionsumfeld",
      state: "vorhanden",
    },
    {
      label: "Werkfeuerwehr",
      detail: "Aktive Tätigkeit in einer Werkfeuerwehr",
      state: "vorhanden",
    },
    {
      label: "Brandschutzbeauftragter",
      detail: "Lehrgang nach DGUV Information 205-003, 64 Unterrichtseinheiten mit Projektarbeit, Objektbegehung, Löschübung und Prüfung",
      state: capabilities.bsb ? "vorhanden" : "in-weiterbildung",
      expected: "Abschluss geplant im Dezember 2026",
      /** Datum der Abschlussprüfung, für den Countdown auf der Startseite */
      date: "2026-12-03",
    },
  ] as const,

  /**
   * Spätere Erweiterungen. Sie bleiben ausgeblendet, bis sie wirklich
   * umgesetzt sind; es gibt keine Attrappen.
   */
  features: {
    booking: false,
    downloads: false,
    trainingCatalog: false,
  },
} as const;

export const nav = [
  { href: "/#angebot", label: "Angebot" },
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#schnellcheck", label: "Schnellcheck" },
  { href: "/#hintergrund", label: "Hintergrund" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;
