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
 * Frühester Tag, an dem die Seite öffentlich gehen darf: Tag der Abschlussprüfung
 * zum Brandschutzbeauftragten. Die Seite beschreibt den Stand nach bestandenem
 * Lehrgang; vorher wäre das irreführende Werbung (§ 5 UWG).
 * `npm run check:launch` schlägt fehl, solange dieses Datum nicht erreicht ist
 * oder `courseCertificate` nicht auf true steht.
 */
export const launch = {
  notBefore: "2026-12-03",
  /** Erst auf true setzen, wenn das Zeugnis tatsächlich vorliegt */
  courseCertificate: false,
  /** Sichtbarer Starttermin im Vorstart-Modus */
  startLabel: "4. Dezember 2026",
} as const;

/**
 * Vorstart-Modus: Die Seite ist online, zeigt aber den Starttermin, die Ausbildung als
 * „Abschluss Dezember 2026“ und keine Titel. Endet automatisch, sobald
 * `launch.courseCertificate` auf true steht.
 */
export const prelaunch = !launch.courseCertificate;

export const site = {
  name: "Brandschutz Ried",
  shortName: "Brandschutz Ried",
  /** Öffentliche Adresse, wird über NEXT_PUBLIC_SITE_URL gesetzt */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.brandschutz-ried.de",
  description:
    "Organisatorischer Brandschutz für Betriebe in Lampertheim, im Hessischen Ried und an der Bergstraße: Brandschutzhelfer-Ausbildung, Brandschutzordnung, Begehungen mit Mängelbericht und Betreuung als externer Brandschutzbeauftragter.",
  region: {
    label: "Hessisches Ried · Bergstraße",
    areas: ["Lampertheim", "Hessisches Ried", "Kreis Bergstraße"],
    later: ["Rhein-Neckar"],
  },

  /**
   * Suchmaschinen erst zulassen, wenn alle Platzhalter ersetzt sind und das
   * Gewerbe angemeldet ist.
   */
  indexable: true,


  founder: {
    name: "Lorik Jezerci" as Value,
    /** Ab Zeugnis (03.12.2026): "Brandschutzbeauftragter (DGUV 205-003)" */
    role: "Inhaber",
  },

  contact: {
    email: "info@brandschutz-ried.de" as Value,
    phone: "0176 62974724" as Value,
    street: "Friedrichstraße 42" as Value,
    zip: "68623" as Value,
    city: "Lampertheim" as Value,
  },

  legal: {
    owner: "Lorik Jezerci" as Value,
    /** USt-IdNr. nur angeben, wenn vorhanden. Bis zur Entscheidung (Kleinunternehmer ja/nein) null = Abschnitt ausgeblendet. Bis 04.12.2026 nachtragen. */
    vatId: null as Value | null,
    // Wirtschafts-Identifikationsnummer (§ 5 Abs. 1 Nr. 6 DDG), sobald vom BZSt zugeteilt
    economicId: null as Value | null,
    hostingProvider: "ALL-INKL.COM – Neue Medien Münnich, Hauptstraße 68, 02742 Friedersdorf" as Value,
    mailProvider: "ALL-INKL.COM – Neue Medien Münnich (eigener Mailserver der Domain, Deutschland)" as Value,
    /** § 2 Abs. 1 Nr. 11 DL-InfoV */
    /** Pflicht, sobald die Versicherung besteht. null = Abschnitt ausgeblendet. Bis 04.12.2026 nachtragen. */
    insurer: null as Value | null,
    insuranceScope: null as Value | null,
  },

  /**
   * Nachgewiesene Qualifikationen und laufende Weiterbildung. Nur eintragen,
   * was durch Zeugnis oder Bescheinigung belegbar ist.
   */
  qualifications: [
    {
      label: "Werkfeuerwehr",
      detail: "Oberfeuerwehrmann in einer Werkfeuerwehr",
      state: "vorhanden" as "vorhanden" | "in-weiterbildung",
    },
    {
      label: "Brandschutzbeauftragter",
      detail: "Ausbildung nach DGUV Information 205-003, 64 Unterrichtseinheiten mit Projektarbeit, Objektbegehung, Löschübung und Prüfung",
      state: launch.courseCertificate ? "vorhanden" : "in-weiterbildung",
    },
  ],

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
  { href: "/#leistungen", label: "Leistungen" },
  { href: "/#branchen", label: "Branchen" },
  { href: "/#schnellcheck", label: "Schnellcheck" },
  { href: "/#hintergrund", label: "Über mich" },
  { href: "/#fragen", label: "Fragen" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;
