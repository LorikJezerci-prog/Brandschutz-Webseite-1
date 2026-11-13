import type { IconName } from '@/components/icon';

export type Customer = {
  id: string;
  name: string;
  branche: string;
  contact: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
};

export type Status = 'ok' | 'mangel' | 'na';
export type Priority = 'sofort' | 'kurzfristig' | 'mittelfristig';

export const priorityLabel: Record<Priority, string> = {
  sofort: 'Sofort',
  kurzfristig: 'Bis 4 Wochen',
  mittelfristig: 'Bis 3 Monate',
};

export type Finding = {
  status?: Status;
  note: string;
  priority?: Priority;
  /** Was der Kunde tun soll (erscheint im Bericht) */
  measure?: string;
  /** Lokale Datei-URIs (nativ) oder Data-URIs (Web) */
  photos: string[];
};

export type CustomItem = { id: string; categoryId: string; title: string };

export type Inspection = {
  id: string;
  customerId: string;
  object: string;
  date: string; // YYYY-MM-DD
  participants: string;
  results: Record<string, Finding>;
  customItems: CustomItem[];
  summary: string;
  closedAt?: string;
  createdAt: string;
};

export const emptyFinding = (): Finding => ({ note: '', photos: [] });

export type AppointmentType = 'begehung' | 'schulung' | 'finanzamt' | 'sonstiges';

export const appointmentTypes: { value: AppointmentType; label: string; icon: IconName }[] = [
  { value: 'begehung', label: 'Begehung', icon: 'search-outline' },
  { value: 'schulung', label: 'Schulung', icon: 'school-outline' },
  { value: 'finanzamt', label: 'Finanzamt', icon: 'receipt-outline' },
  { value: 'sonstiges', label: 'Sonstiges', icon: 'bookmark-outline' },
];

export type Appointment = {
  id: string;
  title: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  customerId?: string;
  location: string;
  note: string;
  /** Minuten vor dem Termin; 0 = keine Erinnerung */
  remindBefore: number;
  notificationId?: string;
  done?: boolean;
};

export type Note = { id: string; title: string; text: string; updatedAt: string };

export type Tip = { id: string; category: string; title: string; text: string };

export type TaxProfile = {
  office: string;
  taxNumber: string;
  vatId: string;
  smallBusiness: boolean;
  advisor: string;
  notes: string;
};

export const emptyTax: TaxProfile = { office: '', taxNumber: '', vatId: '', smallBusiness: true, advisor: '', notes: '' };

/** Kundenakte: Unterlagen wie Brandschutzordnung, Berichte, Pläne, Nachweise */
export type DocCategory = 'bso' | 'bericht' | 'plan' | 'nachweis' | 'vertrag' | 'sonstiges';

export const docCategories: { value: DocCategory; label: string; icon: IconName }[] = [
  { value: 'bso', label: 'Brandschutzordnung', icon: 'book-outline' },
  { value: 'bericht', label: 'Bericht', icon: 'document-text-outline' },
  { value: 'plan', label: 'Plan', icon: 'map-outline' },
  { value: 'nachweis', label: 'Prüfnachweis', icon: 'ribbon-outline' },
  { value: 'vertrag', label: 'Vertrag', icon: 'create-outline' },
  { value: 'sonstiges', label: 'Sonstiges', icon: 'folder-outline' },
];

export type CustomerDoc = {
  id: string;
  customerId: string;
  title: string;
  category: DocCategory;
  date: string; // YYYY-MM-DD
  note: string;
  /** Verweis auf die gespeicherte Datei (Datei-URI oder "idb:…") */
  fileRef?: string;
  fileName?: string;
  mime?: string;
  size?: number;
};

/** Angebote und Rechnungen */
export type FinanceKind = 'angebot' | 'rechnung';
export type OfferStatus = 'offen' | 'angenommen' | 'abgelehnt';
export type InvoiceStatus = 'offen' | 'bezahlt' | 'storniert';

export type FinanceDoc = {
  id: string;
  customerId: string;
  kind: FinanceKind;
  number: string;
  title: string;
  date: string; // YYYY-MM-DD
  /** Gesamtbetrag in Euro (brutto bzw. Endbetrag) */
  amount: number;
  status: OfferStatus | InvoiceStatus;
  /** Rechnung: fällig am; Angebot: gültig bis */
  dueDate?: string;
  paidAt?: string;
  /** Rechnung, die aus einem Angebot entstanden ist */
  offerId?: string;
  note: string;
  /** Positionen (wenn in der App erstellt). amount ist dann der Endbetrag inkl. USt. */
  items?: LineItem[];
  /** USt-Satz in Prozent (0 bei Kleinunternehmer) */
  vatRate?: number;
  /** Rechnung: Leistungsdatum bzw. -zeitraum (Pflichtangabe) */
  serviceDate?: string;
  /** Einleitungstext im PDF */
  intro?: string;
  fileRef?: string;
  fileName?: string;
  mime?: string;
};

export const offerStatus: { value: OfferStatus; label: string }[] = [
  { value: 'offen', label: 'Offen' },
  { value: 'angenommen', label: 'Angenommen' },
  { value: 'abgelehnt', label: 'Abgelehnt' },
];

export const invoiceStatus: { value: InvoiceStatus; label: string }[] = [
  { value: 'offen', label: 'Offen' },
  { value: 'bezahlt', label: 'Bezahlt' },
  { value: 'storniert', label: 'Storniert' },
];

/** Firmendaten für Bericht, Angebot und Rechnung (in der App bearbeitbar) */
export type Company = {
  name: string;
  owner: string;
  street: string;
  zipCity: string;
  phone: string;
  email: string;
  website: string;
  iban: string;
  bic: string;
  bank: string;
  /** Netto-Stundensatz in € für Positionen nach Aufwand */
  hourlyRate: number;
  /** Zahlungsziel Rechnung in Tagen */
  paymentDays: number;
  /** Gültigkeit Angebot in Tagen */
  offerDays: number;
};

export const defaultCompany: Company = {
  name: 'Brandschutz Ried',
  owner: 'Lorik Jezerci',
  street: 'Friedrichstraße 42',
  zipCity: '68623 Lampertheim',
  phone: '0176 62974724',
  email: '',
  website: '',
  iban: '',
  bic: '',
  bank: '',
  hourlyRate: 80,
  paymentDays: 14,
  offerDays: 30,
};

/** Preisliste: Leistungen mit Netto-Preis */
export type CatalogItem = { id: string; code: string; title: string; desc: string; unit: string; price: number };

/** Position in Angebot oder Rechnung (Preise netto) */
export type LineItem = { id: string; title: string; desc: string; qty: number; unit: string; price: number };
