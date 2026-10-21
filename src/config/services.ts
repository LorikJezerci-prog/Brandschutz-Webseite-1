import { capabilities, type Capability } from "./site";

export type Motif = "facade" | "blueprint" | "plan" | "door" | "system" | "corridor";

export type Availability = "verfuegbar" | "nach-weiterbildung" | "perspektivisch";

export interface ScopeRow {
  item: string;
  mode: "Beratung" | "Erstellung" | "Überarbeitung" | "Prüfung";
  requires: Capability[];
}

export interface Service {
  slug: string;
  letter: string;
  title: string;
  short: string;
  motif: Motif;
  /** Layout in der Leistungsübersicht */
  size: "wide" | "narrow" | "compact";
  horizon: "kern" | "perspektivisch";
  requires: Capability[];
  summary: string;
  why: string;
  tasks: string[];
  benefit: string;
  scope?: ScopeRow[];
  boundaries: string[];
}

export const services: Service[] = [
  {
    slug: "brandschutzberatung",
    letter: "A",
    title: "Brandschutzberatung",
    short: "Organisatorische Brandschutzfragen strukturiert klären und in machbare Schritte übersetzen.",
    motif: "facade",
    size: "narrow",
    horizon: "kern",
    requires: ["bsb"],
    summary:
      "Bestehende Brandschutzabläufe werden aufgenommen, bewertet und in nachvollziehbare Verbesserungsschritte übersetzt.",
    why: "Viele Betriebe haben Feuerlöscher, Pläne und Aushänge, aber keinen Überblick, ob alles zusammenpasst. Eine strukturierte Beratung zeigt, wo der Betrieb steht und welche Maßnahmen zuerst sinnvoll sind.",
    tasks: [
      "Unterstützung bei organisatorischen Brandschutzfragen",
      "Analyse bestehender Brandschutzabläufe im Betrieb",
      "Beratung zur strukturierten Verbesserung betrieblicher Brandschutzmaßnahmen",
      "Unterstützung bei der Vorbereitung von Brandschutzmaßnahmen und Terminen mit Behörden, Versicherern oder Feuerwehr",
    ],
    benefit: "Sie wissen, wo Ihr Betrieb steht und welche Maßnahmen zuerst Wirkung haben.",
    boundaries: [
      "Brandschutzkonzepte und bauordnungsrechtliche Brandschutznachweise gehören nicht zum Leistungsumfang. Dafür sind entsprechend berechtigte Fachplaner und Sachverständige zuständig.",
    ],
  },
  {
    slug: "externer-brandschutzbeauftragter",
    letter: "B",
    title: "Externer Brandschutzbeauftragter",
    short: "Kontinuierliche Betreuung mit Begehungen, Dokumentation und einem festen Ansprechpartner.",
    motif: "blueprint",
    size: "wide",
    horizon: "kern",
    requires: ["bsb"],
    summary:
      "Als externer Brandschutzbeauftragter unterstützt ein qualifizierter Ansprechpartner das Unternehmen dauerhaft bei der Umsetzung des betrieblichen Brandschutzes.",
    why: "Ob ein Brandschutzbeauftragter erforderlich ist, ergibt sich je nach Betrieb zum Beispiel aus Auflagen der Baugenehmigung, Sonderbauvorschriften, Anforderungen des Sachversicherers oder der Gefährdungsbeurteilung. Für kleinere und mittlere Unternehmen ist eine externe Bestellung oft einfacher als die Ausbildung und Freistellung eigener Beschäftigter.",
    tasks: [
      "Regelmäßige Brandschutzbegehungen mit dokumentierten Ergebnissen",
      "Mängelberichte mit Prioritäten und Empfehlungen",
      "Unterstützung bei Brandschutzordnung, Unterweisungen und Räumungsübungen",
      "Beratung der Unternehmensleitung, Abstimmung mit der Fachkraft für Arbeitssicherheit",
      "Ansprechpartner für Behörden, Feuerwehr und Versicherer",
      "Laufende Dokumentation der Brandschutzorganisation",
    ],
    benefit: "Ein fester Ansprechpartner, der Ihren Betrieb kennt, und eine Dokumentation, die bei Nachfragen trägt.",
    boundaries: [
      "Die Verantwortung für den Brandschutz bleibt beim Unternehmer bzw. Betreiber. Der Brandschutzbeauftragte berät und unterstützt.",
      "Die Bestellung erfolgt schriftlich durch das Unternehmen und wird erst angeboten, wenn die Qualifikation nach DGUV Information 205-003 nachgewiesen ist.",
    ],
  },
  {
    slug: "brandschutzordnung-flucht-und-rettungsplaene",
    letter: "C",
    title: "Brandschutzordnung und Flucht- und Rettungspläne",
    short: "Klare Abläufe, verständliche Aushänge und Pläne, die zum Gebäude passen.",
    motif: "plan",
    size: "wide",
    horizon: "kern",
    requires: ["bsb"],
    summary:
      "Brandschutzordnung nach DIN 14096 und Flucht- und Rettungspläne nach DIN ISO 23601 machen sichtbar, was im Ernstfall zu tun ist.",
    why: "Im Brandfall bleibt keine Zeit zum Nachlesen. Eine aktuelle Brandschutzordnung und gut lesbare Pläne geben Beschäftigten und Besuchern Orientierung und sind für viele Betriebe ohnehin gefordert.",
    tasks: [
      "Brandschutzordnung Teil A (Aushang für alle Personen)",
      "Brandschutzordnung Teil B (für Beschäftigte ohne besondere Brandschutzaufgaben)",
      "Brandschutzordnung Teil C (für Personen mit besonderen Brandschutzaufgaben)",
      "Prüfung bestehender Flucht- und Rettungspläne auf Aktualität und Plausibilität",
    ],
    benefit: "Dokumente, die zum Gebäude und zum Betrieb passen, statt Vorlagen aus der Schublade.",
    scope: [
      { item: "Brandschutzordnung", mode: "Beratung", requires: ["bsb"] },
      { item: "Brandschutzordnung", mode: "Erstellung", requires: ["bsb"] },
      { item: "Brandschutzordnung", mode: "Überarbeitung", requires: ["bsb"] },
      { item: "Brandschutzordnung", mode: "Prüfung", requires: ["bsb"] },
      { item: "Flucht- und Rettungspläne", mode: "Beratung", requires: ["bsb"] },
      { item: "Flucht- und Rettungspläne", mode: "Prüfung", requires: ["bsb"] },
      { item: "Flucht- und Rettungspläne", mode: "Überarbeitung", requires: ["bsb", "frp"] },
      { item: "Flucht- und Rettungspläne", mode: "Erstellung", requires: ["bsb", "frp"] },
    ],
    boundaries: [
      "Die Erstellung neuer Flucht- und Rettungspläne wird erst angeboten, wenn Planerstellung und Werkzeuge dafür eingerichtet sind.",
    ],
  },
  {
    slug: "brandschutzunterweisungen",
    letter: "D",
    title: "Brandschutzunterweisungen",
    short: "Verständliche, praxisnahe Unterweisungen, die Beschäftigte wirklich erreichen.",
    motif: "corridor",
    size: "narrow",
    horizon: "kern",
    requires: ["bsb"],
    summary:
      "Praxisorientierte Unterweisungen sensibilisieren Beschäftigte für Brandrisiken und das richtige Verhalten im Brandfall.",
    why: "Technik schützt nur, wenn Menschen sie richtig nutzen: Wege freihalten, Türen nicht verkeilen, Feuerlöscher kennen. Gute Unterweisungen sind kurz, konkret und auf den eigenen Arbeitsplatz bezogen.",
    tasks: [
      "Unterweisung der Beschäftigten zum Verhalten im Brandfall",
      "Inhalte abgestimmt auf Brandschutzordnung und Gebäude",
      "Vorbereitung und Begleitung von Räumungsübungen",
      "Perspektivisch: Ausbildung von Brandschutzhelfern nach DGUV Information 205-023",
    ],
    benefit: "Beschäftigte, die wissen, was zu tun ist, und eine dokumentierte Unterweisung für Ihre Unterlagen.",
    boundaries: [
      "Praktische Löschübungen setzen geeignete Übungsausstattung voraus. Sie werden erst angeboten, wenn diese vorhanden ist oder über einen Partner gestellt wird.",
    ],
  },
  {
    slug: "brandschutztueren-feststellanlagen",
    letter: "E",
    title: "Brandschutztüren und Feststellanlagen",
    short: "Erfassen, Fristen im Blick behalten, Prüfungen mit Fachbetrieben organisieren.",
    motif: "door",
    size: "compact",
    horizon: "perspektivisch",
    requires: ["fsa"],
    summary:
      "Perspektivisches Geschäftsfeld: Organisation von Prüfung, Wartung und Dokumentation von Feuer- und Rauchschutzabschlüssen und Feststellanlagen.",
    why: "Eine Brandschutztür schützt nur, wenn sie zuverlässig schließt. Feststellanlagen müssen regelmäßig geprüft und gewartet werden, und genau diese Fristen gehen im Alltag oft unter.",
    tasks: [
      "Erfassung der Brandschutztüren und Feststellanlagen im Objekt",
      "Überwachung von Prüf- und Wartungsfristen",
      "Koordination qualifizierter Fachkräfte und Fachbetriebe",
      "Dokumentation der Ergebnisse für Betreiber und Versicherer",
    ],
    benefit: "Ein Überblick über alle Abschlüsse im Gebäude und keine vergessenen Prüftermine.",
    boundaries: [
      "Prüfung, Wartung und Instandsetzung von Feststellanlagen erfolgen nach den einschlägigen Regeln (u. a. DIN 14677) durch entsprechend qualifizierte Personen oder Fachbetriebe. Eigene Prüftätigkeiten werden erst angeboten, wenn die Qualifikation nachgewiesen ist.",
    ],
  },
  {
    slug: "brandmeldeanlagen",
    letter: "F",
    title: "Brandmeldeanlagen",
    short: "Schnittstellen verstehen, Betreiberpflichten organisieren, mit Fachfirmen zusammenarbeiten.",
    motif: "system",
    size: "compact",
    horizon: "perspektivisch",
    requires: ["bma"],
    summary:
      "Mögliche spätere Erweiterung: Unterstützung von Betreibern bei Organisation und Schnittstellen rund um Brandmeldeanlagen.",
    why: "Brandmeldeanlagen verbinden Technik, Organisation und Feuerwehr. Für Betreiber ist wichtig, die eigenen Pflichten zu kennen und die Zusammenarbeit mit Fachfirma und Feuerwehr sauber zu organisieren.",
    tasks: [
      "Erklärung von Betreiberpflichten und Abläufen",
      "Organisation von Inspektion und Wartung mit der Fachfirma",
      "Abstimmung von Schnittstellen zu Brandschutzordnung und Räumung",
    ],
    benefit: "Klare Zuständigkeiten zwischen Betreiber, Fachfirma und Feuerwehr.",
    boundaries: [
      "Planung, Errichtung, Prüfung und Instandhaltung von Brandmeldeanlagen erfolgen ausschließlich durch dafür zertifizierte Fachfirmen (DIN 14675). Diese Leistungen werden nicht selbst angeboten.",
    ],
  },
];

export const hasAll = (req: Capability[]) => req.every((c) => capabilities[c]);

export function availability(s: Service): Availability {
  if (hasAll(s.requires)) return "verfuegbar";
  return s.horizon === "perspektivisch" ? "perspektivisch" : "nach-weiterbildung";
}

export const availabilityLabel: Record<Availability, string> = {
  verfuegbar: "Anfrage möglich",
  "nach-weiterbildung": "Nach Abschluss der Weiterbildung",
  perspektivisch: "Perspektivisch, mit Fachpartnern",
};

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
