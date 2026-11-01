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
