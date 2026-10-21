/**
 * Storyboard der Startseite.
 *
 * Die Zeitachse t läuft von 0 bis 8. Jede Einheit entspricht einem Kapitel.
 * Eine Szene ist von `start` bis zum `start` der nächsten Szene sichtbar und
 * wird in den letzten 20 % (mobil 10 %) vor ihrem Start eingeblendet.
 *
 * Match Cuts:
 *  facade → blueprint   identische Gebäudegeometrie, gleicher Zoom
 *  blueprint → plan     Gebäudekante wird zum Grundriss (Kippen in die Aufsicht)
 *  plan → door          Zoom auf die zweiflügelige Ausgangstür in Bildmitte
 *  door → system        dieselbe Tür als technische Zeichnung
 *  system → corridor    Türrahmen wird zur Tür am Ende des Flurs, Kamera fährt zurück
 *  corridor → table     Licht am Ende des Flurs blendet auf den hellen Tisch über
 *  table → Leistungen   Unterlagen ordnen sich zum Raster der Leistungskarten
 */

export const STORY_LENGTH = 8;

export const scenes = [
  { id: "facade", start: 0, end: 2 },
  { id: "blueprint", start: 2, end: 3 },
  { id: "plan", start: 3, end: 4 },
  { id: "door", start: 4, end: 5 },
  { id: "system", start: 5, end: 6 },
  { id: "corridor", start: 6, end: 7 },
  { id: "table", start: 7, end: 8 },
] as const;

export type SceneId = (typeof scenes)[number]["id"];

export interface Chapter {
  index: number;
  kicker: string;
  title: string;
  body: string;
  side: "left" | "right";
}

export const chapters: Chapter[] = [
  {
    index: 1,
    kicker: "01 · Gefahr erkennen",
    title: "Brandrisiken entstehen selten spektakulär.",
    body: "Sie stehen vor dem Notausgang, lagern im Treppenraum oder lehnen als Paletten an der Fassade. Wer sie erkennen will, muss genau hinsehen, bevor etwas passiert.",
    side: "right",
  },
  {
    index: 2,
    kicker: "02 · Risiken verstehen",
    title: "Aus dem Gebäude wird eine Zeichnung.",
    body: "Nutzung, Brandlasten, Zündquellen, Rauchwege: Erst wenn klar ist, wo und warum ein Risiko entsteht, lassen sich Maßnahmen ableiten, die zum Betrieb passen.",
    side: "left",
  },
  {
    index: 3,
    kicker: "03 · Schutz planen",
    title: "Im Ernstfall muss jeder wissen, wohin.",
    body: "Klare Flucht- und Rettungswege, eindeutige Kennzeichnung und eine verständliche Brandschutzordnung geben Orientierung, ohne dass jemand nachdenken muss.",
    side: "right",
  },
  {
    index: 4,
    kicker: "04 · Sicherheit umsetzen",
    title: "Eine Brandschutztür schützt nur, wenn sie schließt.",
    body: "Ein Feuerlöscher hilft nur, wenn er erreichbar ist. Ein Plan nur, wenn er aktuell ist. Brandschutz entscheidet sich in der Umsetzung im Alltag.",
    side: "left",
  },
  {
    index: 5,
    kicker: "05 · Systeme verbinden",
    title: "Hinter der Tür steht ein System.",
    body: "Rauchschalter, Haftmagnet, Auslösung: Baulicher, anlagentechnischer und organisatorischer Brandschutz greifen ineinander. Prüfung und Wartung gehören in die Hände qualifizierter Fachbetriebe.",
    side: "right",
  },
  {
    index: 6,
    kicker: "06 · Vertrauen schaffen",
    title: "Sicherheit, die man im Alltag sieht.",
    body: "Freie Wege, eindeutige Zeichen, informierte Beschäftigte. Und eine Dokumentation, die standhält, wenn Behörde, Versicherer oder Feuerwehr nachfragen.",
    side: "left",
  },
  {
    index: 7,
    kicker: "07 · Zusammenarbeit beginnen",
    title: "Am Tisch wird es konkret.",
    body: "Begehung, Bestandsaufnahme, ein verständlicher Bericht mit priorisierten Maßnahmen. Danach entscheiden Sie, was umgesetzt wird.",
    side: "right",
  },
];
