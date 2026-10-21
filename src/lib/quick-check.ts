/**
 * Brandschutz-Schnellcheck: grobe Orientierung aus wenigen Angaben.
 * Wird auf dem Server für den Ausgangszustand und im Browser bei jeder
 * Änderung ausgewertet. Es wird nichts gesendet oder gespeichert.
 * Grundlage: ASR A2.2 (Brandschutzhelfer, in der Regel 5 %), ASR A2.3
 * (Flucht- und Rettungsplan), DGUV Vorschrift 1 § 4 (jährliche Unterweisung),
 * DIN 14096 (Brandschutzordnung).
 */

export type Answers = {
  staff: string;
  floors: boolean;
  visitors: boolean;
  hazard: boolean;
  bso: boolean;
  briefed: boolean;
};

export type Hint = { tone: "todo" | "check" | "ok"; title: string; text: string };

export function evaluate(a: Answers): Hint[] {
  const n = Math.max(0, Math.floor(Number(a.staff) || 0));
  const hints: Hint[] = [];

  if (n > 0) {
    const helpers = Math.max(1, Math.ceil(n * 0.05));
    hints.push({
      tone: "check",
      title: a.hazard ? `Brandschutzhelfer: mehr als ${helpers}` : `Brandschutzhelfer: mindestens ${helpers}`,
      text: a.hazard
        ? "Bei erhöhter Brandgefährdung reichen 5 % der Beschäftigten meist nicht. Die genaue Zahl ergibt sich aus der Gefährdungsbeurteilung."
        : "In der Regel 5 % der Beschäftigten, auch Urlaub, Schichten und Krankheit einplanen.",
    });
  }

  hints.push(
    a.briefed
      ? { tone: "ok", title: "Unterweisung aktuell", text: "Gut. Brandschutz gehört mindestens einmal im Jahr in die Unterweisung." }
      : { tone: "todo", title: "Unterweisung nachholen", text: "Beschäftigte müssen mindestens einmal jährlich unterwiesen werden, auch zum Verhalten im Brandfall." },
  );

  if (!a.bso) {
    hints.push({
      tone: a.hazard || a.visitors ? "todo" : "check",
      title: "Brandschutzordnung erstellen",
      text:
        a.hazard || a.visitors
          ? "Bei erhöhter Brandgefährdung oder Publikumsverkehr wird eine Brandschutzordnung nach DIN 14096 in der Regel erwartet."
          : "Auch ohne Pflicht sinnvoll: Teil A als Aushang zeigt allen in einer Minute, was im Brandfall zu tun ist.",
    });
  } else {
    hints.push({ tone: "ok", title: "Brandschutzordnung vorhanden", text: "Prüfen Sie, ob Ansprechpartner, Telefonnummern und Sammelstelle noch stimmen." });
  }

  if (a.floors || a.visitors) {
    hints.push({
      tone: "check",
      title: "Flucht- und Rettungsplan wahrscheinlich nötig",
      text: "Bei mehreren Geschossen, verwinkelten Gebäuden oder Besuchern verlangt die ASR A2.3 in der Regel einen Flucht- und Rettungsplan.",
    });
  }

  if (a.hazard || (a.visitors && n >= 50)) {
    hints.push({
      tone: "check",
      title: "Brandschutzbeauftragten prüfen",
      text: "Ob einer bestellt werden muss, steht oft in der Baugenehmigung, den Bedingungen des Versicherers oder der Gefährdungsbeurteilung.",
    });
  }

  return hints;
}

export const initialAnswers: Answers = { staff: "20", floors: false, visitors: false, hazard: false, bso: false, briefed: false };

export const questions: { key: Exclude<keyof Answers, "staff">; label: string }[] = [
  { key: "floors", label: "Mehr als ein Geschoss oder ein verwinkeltes Gebäude" },
  { key: "visitors", label: "Kunden, Besucher oder Bewohner im Gebäude" },
  { key: "hazard", label: "Brennbare Stoffe, Lager, Werkstatt oder Heißarbeiten" },
  { key: "bso", label: "Eine Brandschutzordnung ist vorhanden" },
  { key: "briefed", label: "Unterweisung in den letzten 12 Monaten" },
];
