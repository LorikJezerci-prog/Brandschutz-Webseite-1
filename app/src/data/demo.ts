/**
 * Erfundener Musterbetrieb zum Ausprobieren der App.
 * Alle Einträge tragen die Kennung "demo-", damit sie sich sauber wieder entfernen lassen.
 */
import type { Appointment, Customer, Finding, Inspection, Note } from '@/store/types';

export const DEMO_PREFIX = 'demo-';
export const isDemo = (id?: string) => !!id && id.startsWith(DEMO_PREFIX);

const iso = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const ok: Finding = { status: 'ok', note: '', photos: [] };
const na: Finding = { status: 'na', note: '', photos: [] };
const mangel = (note: string, priority: Finding['priority']): Finding => ({ status: 'mangel', note, priority, photos: [] });

export function buildDemo() {
  const now = new Date().toISOString();
  const customer: Customer = {
    id: 'demo-kunde',
    name: 'Muster Metallbau GmbH (Übung)',
    branche: 'Metallverarbeitung, 45 Mitarbeitende, Halle mit Büroanbau',
    contact: 'Frau Beispiel (Sicherheitsfachkraft)',
    phone: '06206 000000',
    email: 'info@muster-metallbau.example',
    address: 'Wormser Straße 1, 68623 Lampertheim',
    notes: 'Erfundener Übungsbetrieb. Schweißerei in Halle 2, Lacklager im Außenbereich, BMA nur im Büroteil.',
    createdAt: now,
  };

  const inspection: Inspection = {
    id: 'demo-begehung',
    customerId: customer.id,
    object: 'Produktionshalle 1 und 2, Büroanbau',
    date: iso(0),
    participants: 'Frau Beispiel (Sifa), Herr Muster (Hallenmeister)',
    customItems: [{ id: 'demo-cust-1', categoryId: 'elektro', title: 'Schweißarbeitsplätze mit Funkenschutz abgetrennt' }],
    summary: '',
    createdAt: now,
    results: {
      // Flucht- und Rettungswege
      'fw-frei': mangel('Halle 2: Gitterboxen stehen im Fluchtweg zum Notausgang Ost, Restbreite ca. 60 cm.', 'sofort'),
      'fw-notausgang': ok,
      'fw-zeichen': mangel('Rettungszeichen über Tor 3 fehlt, Richtungspfeil im Büroflur verdeckt.', 'kurzfristig'),
      'fw-licht': ok,
      'fw-plan': mangel('Flucht- und Rettungsplan von 2017, Umbau Halle 2 nicht eingezeichnet.', 'mittelfristig'),
      'fw-sammel': ok,
      // Türen
      'tu-keil': mangel('T30-Tür Treppenhaus Büro mit Holzkeil offen gehalten.', 'sofort'),
      'tu-schliessen': ok,
      'tu-fsa': ok,
      'tu-schaden': mangel('Dichtung T30-Tür Lager unten eingerissen.', 'kurzfristig'),
      'tu-schild': ok,
      // Feuerlöscher
      'lo-anzahl': ok,
      'lo-pruef': mangel('2 von 14 Löschern Prüfplakette 2023, überfällig.', 'kurzfristig'),
      'lo-zugang': mangel('Löscher an Säule B4 durch Palettenregal zugestellt.', 'sofort'),
      'lo-klasse': ok,
      'lo-hydrant': na,
      // Lagerung
      'la-treppe': ok,
      'la-gefahr': ok,
      'la-abfall': mangel('Container für Späne/Putzlappen direkt an der Hallenwand, kein Abstand.', 'kurzfristig'),
      // Rest bewusst offen zum Ausprobieren
    },
  };

  const appointments: Appointment[] = [
    {
      id: 'demo-termin-1',
      title: 'Nachbegehung Muster Metallbau',
      type: 'begehung',
      date: iso(28),
      time: '09:00',
      customerId: customer.id,
      location: customer.address,
      note: 'Sofort-Mängel prüfen: Fluchtweg Halle 2, Keil T30-Tür, Löscher B4.',
      remindBefore: 0,
    },
    {
      id: 'demo-termin-2',
      title: 'Brandschutzhelfer-Schulung (Übung)',
      type: 'schulung',
      date: iso(14),
      time: '13:30',
      customerId: customer.id,
      location: 'Schulungsraum Büroanbau',
      note: '3 Helfer fehlen noch (Bedarf ca. 5 % von 45 = 3 Personen).',
      remindBefore: 0,
    },
  ];

  const notes: Note[] = [
    {
      id: 'demo-notiz',
      title: 'Muster Metallbau: Angebot',
      text: 'Interesse an externem BSB-Mandat. Nach Begehung Angebot schicken: Mängelbericht + BSO Teil A/B + Helfer-Schulung.',
      updatedAt: now,
    },
  ];

  return { customer, inspection, appointments, notes };
}
