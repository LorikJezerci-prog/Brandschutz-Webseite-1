/**
 * Prüfpunkte für die Brandschutzbegehung, gruppiert nach Bereich.
 * Grundlagen stehen jeweils dabei, damit der Bericht nachvollziehbar bleibt.
 * Die Liste ist eine Arbeitshilfe und ersetzt nicht den Blick auf das konkrete Objekt.
 */

export type ChecklistItem = { id: string; title: string; hint?: string; basis?: string };
import type { IconName } from '@/components/icon';

export type ChecklistCategory = { id: string; title: string; icon: IconName; items: ChecklistItem[] };

export const checklist: ChecklistCategory[] = [
  {
    id: 'fluchtwege',
    title: 'Flucht- und Rettungswege',
    icon: 'exit-outline',
    items: [
      { id: 'fw-frei', title: 'Fluchtwege frei, nicht eingeengt', hint: 'Keine Lagerung, Mindestbreite eingehalten', basis: 'ASR A2.3' },
      { id: 'fw-notausgang', title: 'Notausgänge von innen ohne Hilfsmittel zu öffnen', basis: 'ASR A2.3' },
      { id: 'fw-zeichen', title: 'Rettungszeichen vorhanden und gut sichtbar', basis: 'ASR A1.3' },
      { id: 'fw-licht', title: 'Sicherheitsbeleuchtung funktionsfähig (falls vorhanden)', basis: 'ASR A3.4/7' },
      { id: 'fw-plan', title: 'Flucht- und Rettungspläne aktuell, lagerichtig ausgehängt', basis: 'ASR A2.3, DIN ISO 23601' },
      { id: 'fw-sammel', title: 'Sammelstelle festgelegt und gekennzeichnet', basis: 'ASR A2.3' },
    ],
  },
  {
    id: 'tueren',
    title: 'Brand- und Rauchschutztüren',
    icon: 'shield-checkmark-outline',
    items: [
      { id: 'tu-keil', title: 'Nicht verkeilt oder unzulässig offengehalten', hint: 'Keile, Haken, Kabelbinder' },
      { id: 'tu-schliessen', title: 'Schließen selbsttätig und vollständig' },
      { id: 'tu-fsa', title: 'Feststellanlagen frei, Handauslöser gekennzeichnet', basis: 'DIN 14677' },
      { id: 'tu-schaden', title: 'Türblatt, Zarge und Dichtungen unbeschädigt' },
      { id: 'tu-schild', title: 'Kennzeichnungsschild vorhanden' },
    ],
  },
  {
    id: 'loescher',
    title: 'Feuerlöscher und Löscheinrichtungen',
    icon: 'flame-outline',
    items: [
      { id: 'lo-anzahl', title: 'Ausreichende Löschmitteleinheiten je Bereich', basis: 'ASR A2.2' },
      { id: 'lo-pruef', title: 'Prüfplakette gültig (höchstens 2 Jahre)', basis: 'ASR A2.2, DIN 14406-4' },
      { id: 'lo-zugang', title: 'Frei zugänglich und gekennzeichnet', basis: 'ASR A1.3' },
      { id: 'lo-klasse', title: 'Löschmittel passt zur Brandklasse (z. B. F in Küchen)' },
      { id: 'lo-hydrant', title: 'Wandhydranten zugänglich und geprüft (falls vorhanden)', basis: 'DIN 14462' },
    ],
  },
  {
    id: 'lagerung',
    title: 'Brandlasten und Lagerung',
    icon: 'cube-outline',
    items: [
      { id: 'la-treppe', title: 'Keine brennbaren Stoffe in Treppenräumen und Fluren' },
      { id: 'la-gefahr', title: 'Gefahrstoffe in geeigneten Schränken oder Räumen', basis: 'TRGS 510' },
      { id: 'la-abfall', title: 'Abfall regelmäßig entsorgt, Container mit Abstand zum Gebäude' },
      { id: 'la-abstand', title: 'Abstand von Lagergut zu Leuchten und Sprinklern' },
      { id: 'la-technik', title: 'Technik- und Heizräume ohne Fremdlagerung' },
    ],
  },
  {
    id: 'elektro',
    title: 'Elektrik und Zündquellen',
    icon: 'flash-outline',
    items: [
      { id: 'el-steckdose', title: 'Keine hintereinander gesteckten Mehrfachsteckdosen' },
      { id: 'el-pruef', title: 'Prüfung elektrischer Geräte dokumentiert', basis: 'DGUV Vorschrift 3' },
      { id: 'el-verteiler', title: 'Verteiler frei zugänglich und verschlossen' },
      { id: 'el-rauchen', title: 'Rauchen geregelt, Raucherbereich mit sicherem Ascher' },
      { id: 'el-heiss', title: 'Heißarbeiten nur mit Erlaubnisschein', basis: 'DGUV Regel 100-500' },
    ],
  },
  {
    id: 'technik',
    title: 'Melde- und Anlagentechnik',
    icon: 'notifications-outline',
    items: [
      { id: 'te-bma', title: 'Brandmeldeanlage ohne Störung, Wartung aktuell', basis: 'DIN 14675' },
      { id: 'te-melder', title: 'Melder nicht abgedeckt oder verstellt' },
      { id: 'te-rwa', title: 'Rauchabzug frei, Auslöser gekennzeichnet' },
      { id: 'te-fsd', title: 'Feuerwehrlaufkarten und Schlüsseldepot aktuell', basis: 'DIN 14675, TAB' },
      { id: 'te-schott', title: 'Abschottungen von Leitungsdurchführungen intakt' },
    ],
  },
  {
    id: 'organisation',
    title: 'Organisation',
    icon: 'clipboard-outline',
    items: [
      { id: 'or-bso-a', title: 'Brandschutzordnung Teil A ausgehängt', basis: 'DIN 14096' },
      { id: 'or-bso-bc', title: 'Teil B und C vorhanden und bekannt', basis: 'DIN 14096' },
      { id: 'or-helfer', title: 'Genug Brandschutzhelfer bestellt (in der Regel 5 %)', basis: 'ASR A2.2' },
      { id: 'or-unterweisung', title: 'Jährliche Unterweisung dokumentiert', basis: 'DGUV Vorschrift 1 § 4' },
      { id: 'or-uebung', title: 'Räumungsübung durchgeführt', basis: 'ASR A2.3' },
      { id: 'or-zufahrt', title: 'Feuerwehrzufahrt und Aufstellflächen frei', basis: 'DIN 14090' },
      { id: 'or-nachweise', title: 'Prüfnachweise (Löscher, Anlagen, Türen) vorliegend' },
    ],
  },
];

export const allItems = checklist.flatMap((c) => c.items.map((i) => ({ ...i, categoryId: c.id })));
export const categoryById = (id: string) => checklist.find((c) => c.id === id);
