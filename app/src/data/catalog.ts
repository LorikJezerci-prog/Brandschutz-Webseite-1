import type { CatalogItem } from '@/store/types';

/**
 * Start-Preisliste aus deiner Tabelle "Brandschutz_Ried_Akquise_und_Preise.xlsx", Blatt "Meine Preise"
 * (Stundensatz 80 € netto). Positionen ohne Preis dort: Aufwand aus Blatt "Leistungskatalog" × 80 €.
 * In der App unter Büro → Preisliste änderbar.
 */
export const defaultCatalog: CatalogItem[] = [
  { id: 'bsb-s', code: 'BSB', title: 'Externer Brandschutzbeauftragter – Jahresvertrag klein', desc: 'Bis 20 Beschäftigte, 1 Gebäude. 16 Std./Jahr inkl. 1–2 Begehungen, Beratung, Dokumentation, fester Ansprechpartner.', unit: 'Jahr', price: 1280 },
  { id: 'bsb-m', code: 'BSB', title: 'Externer Brandschutzbeauftragter – Jahresvertrag mittel', desc: '20–100 Beschäftigte. 32 Std./Jahr inkl. 1–2 Begehungen, Beratung, Dokumentation, fester Ansprechpartner.', unit: 'Jahr', price: 2560 },
  { id: 'bsb-l', code: 'BSB', title: 'Externer Brandschutzbeauftragter – Jahresvertrag groß', desc: 'Pflegeheim, Hotel oder über 100 Beschäftigte. 50 Std./Jahr inkl. Begehungen, Beratung, Dokumentation.', unit: 'Jahr', price: 4000 },
  { id: 'beg', code: 'BEG', title: 'Brandschutzbegehung mit Mängelbericht', desc: 'Begehung vor Ort, Fotodokumentation, Bericht mit Maßnahmen und Dringlichkeit.', unit: 'psch.', price: 240 },
  { id: 'nach', code: 'BEG', title: 'Nachbegehung der Sofort-Mängel', desc: 'Kontrolle der Sofort-Mängel vor Ort mit kurzer schriftlicher Bestätigung.', unit: 'psch.', price: 80 },
  { id: 'bso-ab', code: 'BSO', title: 'Brandschutzordnung Teil A und B nach DIN 14096', desc: 'Teil A als Aushang, Teil B für alle Beschäftigten, abgestimmt auf Ihren Betrieb, inkl. Ortstermin.', unit: 'psch.', price: 480 },
  { id: 'bso-c', code: 'BSO', title: 'Brandschutzordnung Teil C nach DIN 14096', desc: 'Aufgaben für Geschäftsleitung, Brandschutzhelfer und Personen mit besonderen Brandschutzaufgaben.', unit: 'psch.', price: 320 },
  { id: 'bsh', code: 'BSH', title: 'Brandschutzhelfer-Ausbildung inhouse bis 10 Teilnehmende', desc: 'Theorie und praktische Löschübung nach DGUV Information 205-023, inkl. Teilnahmebescheinigungen.', unit: 'psch.', price: 640 },
  { id: 'bsh-tn', code: 'BSH', title: 'Brandschutzhelfer-Ausbildung: jede weitere Person ab 11', desc: 'Höchstens 20 Teilnehmende je Kurs.', unit: 'TN', price: 45 },
  { id: 'unt', code: 'UNT', title: 'Brandschutzunterweisung aller Beschäftigten', desc: 'Unterweisung vor Ort nach DGUV Vorschrift 1 § 4 mit Teilnehmerliste zur Dokumentation.', unit: 'psch.', price: 120 },
  { id: 'evh', code: 'EVH', title: 'Evakuierungshelfer-Schulung', desc: 'Aufgaben im Alarmfall: Bereiche räumen, Personen zählen, Hilfsbedürftige begleiten (ASR A2.3).', unit: 'psch.', price: 280 },
  { id: 'rue', code: 'RÜ', title: 'Räumungsübung', desc: 'Planung, Durchführung mit Zeitmessung und schriftliche Auswertung mit Maßnahmen.', unit: 'psch.', price: 480 },
  { id: 'flb', code: 'FLB', title: 'Feuerlöscher-Bedarfsberechnung', desc: 'Löschmitteleinheiten nach ASR A2.2 berechnen, Art und Standorte der Feuerlöscher festlegen.', unit: 'psch.', price: 160 },
  { id: 'hei', code: 'HEI', title: 'Einführung Erlaubnisschein für Heißarbeiten', desc: 'Formular nach DGUV Regel 100-500 einführen und Verantwortliche einweisen.', unit: 'psch.', price: 200 },
  { id: 'gbu', code: 'GBU', title: 'Gefährdungsbeurteilung Brandschutz', desc: 'Brandgefahren bewerten und Schutzmaßnahmen festlegen, als Teil Ihrer Gefährdungsbeurteilung.', unit: 'psch.', price: 440 },
  { id: 'std', code: 'STD', title: 'Beratung nach Aufwand', desc: 'Abrechnung nach tatsächlichem Zeitaufwand.', unit: 'Std.', price: 80 },
  { id: 'km', code: 'KM', title: 'Fahrtkosten außerhalb 25 km', desc: 'Je gefahrenem Kilometer über 25 km Entfernung.', unit: 'km', price: 0.5 },
];

/** Welche Leistung zu welchem Mangel passt (für "Angebot aus Begehung") */
export const suggestFor: Record<string, string> = {
  'or-bso-a': 'bso-ab',
  'or-bso-bc': 'bso-c',
  'or-helfer': 'bsh',
  'or-unterweisung': 'unt',
  'or-uebung': 'rue',
  'lo-anzahl': 'flb',
  'el-heiss': 'hei',
  'lo-klasse': 'flb',
  // Verhaltensmängel: Ursache ist fast immer fehlendes Wissen → Unterweisung
  'fw-frei': 'unt',
  'tu-keil': 'unt',
  'lo-zugang': 'unt',
  'la-abfall': 'unt',
  'el-rauchen': 'unt',
};
