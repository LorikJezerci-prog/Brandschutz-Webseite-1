import { Tip } from '@/store/types';

/**
 * Praxistipps zum Nachschlagen. Rechtliche Angaben sind Stand 2026 und vor
 * einer Entscheidung mit Steuerberater bzw. Versicherer zu prüfen.
 */
export const builtInTips: Tip[] = [
  {
    id: 'vor-ort-1',
    category: 'Vor Ort',
    title: 'Erst Rundgang, dann Details',
    text: 'Einmal komplett durchs Objekt gehen und den Gesamteindruck notieren. Danach Bereich für Bereich prüfen. So übersiehst du keine Nebengebäude, Keller oder Dachböden.',
  },
  {
    id: 'vor-ort-2',
    category: 'Vor Ort',
    title: 'Mängel mit Übersichts- und Detailfoto',
    text: 'Ein Foto zeigt, wo der Mangel ist (Tür mit Raumnummer), das zweite, was genau falsch ist (Keil, Plakette). Ohne Ortsbezug ist ein Foto im Bericht wertlos.',
  },
  {
    id: 'vor-ort-3',
    category: 'Vor Ort',
    title: 'Verantwortlichen mitnehmen',
    text: 'Gehe nie allein. Wer vom Betrieb dabei ist, sieht die Mängel selbst und setzt sie eher um. Namen im Feld „Teilnehmer“ eintragen.',
  },
  {
    id: 'bericht-1',
    category: 'Bericht',
    title: 'Dringlichkeit ehrlich setzen',
    text: '„Sofort“ nur für Gefahr für Leben: versperrte Notausgänge, verkeilte Brandschutztüren, fehlende Löscher. Wenn alles „sofort“ ist, nimmt der Kunde nichts mehr ernst.',
  },
  {
    id: 'bericht-2',
    category: 'Bericht',
    title: 'Bericht innerhalb von 48 Stunden',
    text: 'Je schneller der Bericht beim Kunden ist, desto eher wird umgesetzt. Am besten noch am selben Tag die Zusammenfassung schreiben, solange alles frisch ist.',
  },
  {
    id: 'bericht-3',
    category: 'Bericht',
    title: 'Verantwortung klar benennen',
    text: 'Der Bericht ist eine Empfehlung. Die Verantwortung für den Brandschutz bleibt beim Unternehmer. Das steht im PDF, und so solltest du es auch im Gespräch sagen.',
  },
  {
    id: 'kunden-1',
    category: 'Kunden',
    title: 'Nachtermin direkt vereinbaren',
    text: 'Am Ende der Begehung gleich den Termin zur Nachkontrolle festlegen und unter „Termine“ mit Erinnerung eintragen. Das ist der Einstieg in eine laufende Betreuung.',
  },
  {
    id: 'kunden-2',
    category: 'Kunden',
    title: 'Schnellcheck im Erstgespräch',
    text: 'Der Schnellcheck unter „Büro“ liefert in zwei Minuten eine grobe Einschätzung. Das zeigt dem Kunden, dass du strukturiert arbeitest, ohne schon Beratung zu verschenken.',
  },
  {
    id: 'gruendung-1',
    category: 'Gründung',
    title: 'Steuerliche Erfassung nach Gewerbeanmeldung',
    text: 'Nach der Gewerbeanmeldung den Fragebogen zur steuerlichen Erfassung über ELSTER abgeben, in der Regel innerhalb eines Monats. Danach kommt die Steuernummer per Post.',
  },
  {
    id: 'gruendung-2',
    category: 'Gründung',
    title: 'Kleinunternehmerregelung prüfen',
    text: 'Seit 2025: Vorjahresumsatz höchstens 25.000 €, laufendes Jahr höchstens 100.000 €. Dann keine Umsatzsteuer auf Rechnungen, aber auch kein Vorsteuerabzug. Mit Steuerberater durchrechnen.',
  },
  {
    id: 'gruendung-3',
    category: 'Gründung',
    title: 'Belege sofort ablegen',
    text: 'Rechnungen und Quittungen gleich fotografieren und ordnen. Buchungsbelege müssen 8 Jahre aufbewahrt werden. Geschäftliches und Privates auf getrennten Konten führen.',
  },
  {
    id: 'gruendung-4',
    category: 'Gründung',
    title: 'Haftpflicht vor dem ersten Auftrag',
    text: 'Ohne Berufshaftpflicht keine Begehung. Prüfen, ob sie auch Brandwachen und Heißarbeiten abdeckt, falls du das anbieten willst.',
  },
];
