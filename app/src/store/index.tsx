import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { defaultCatalog } from '@/data/catalog';
import { buildDemo, isDemo } from '@/data/demo';
import { deleteFile, requestPersistentStorage } from '@/utils/files';
import { deletePhoto } from '@/utils/photos';
import { cancelReminder, scheduleReminder } from '@/utils/reminders';
import {
  Appointment,
  CatalogItem,
  Company,
  Customer,
  CustomerDoc,
  defaultCompany,
  emptyFinding,
  FinanceDoc,
  emptyTax,
  Finding,
  Inspection,
  Note,
  TaxProfile,
  Tip,
} from './types';

const KEY = 'brandschutz-ried/v1';

export type Data = {
  customers: Customer[];
  inspections: Inspection[];
  appointments: Appointment[];
  notes: Note[];
  tips: Tip[];
  tax: TaxProfile;
  docs: CustomerDoc[];
  finance: FinanceDoc[];
  company: Company;
  catalog: CatalogItem[];
  /** Zeitpunkt der letzten Datensicherung (ISO) */
  lastBackupAt?: string;
};

export const initial: Data = {
  customers: [],
  inspections: [],
  appointments: [],
  notes: [],
  tips: [],
  tax: emptyTax,
  docs: [],
  finance: [],
  company: defaultCompany,
  catalog: defaultCatalog,
};

type Store = Data & {
  ready: boolean;
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addInspection: (i: Pick<Inspection, 'customerId' | 'object' | 'date' | 'participants'>) => Inspection;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  updateFinding: (id: string, itemId: string, patch: Partial<Finding>) => void;
  removeInspection: (id: string) => void;
  saveAppointment: (a: Omit<Appointment, 'id' | 'notificationId'> & { id?: string }) => Promise<Appointment>;
  setAppointmentDone: (id: string, done: boolean) => void;
  removeAppointment: (id: string) => void;
  saveNote: (n: Omit<Note, 'id' | 'updatedAt'> & { id?: string }) => Note;
  removeNote: (id: string) => void;
  addTip: (t: Omit<Tip, 'id'>) => void;
  removeTip: (id: string) => void;
  updateTax: (patch: Partial<TaxProfile>) => void;
  saveDoc: (d: Omit<CustomerDoc, 'id'> & { id?: string }) => CustomerDoc;
  removeDoc: (id: string) => void;
  saveFinance: (f: Omit<FinanceDoc, 'id'> & { id?: string }) => FinanceDoc;
  removeFinance: (id: string) => void;
  nextNumber: (kind: FinanceDoc['kind'], year: number) => string;
  updateCompany: (patch: Partial<Company>) => void;
  saveCatalogItem: (c: Omit<CatalogItem, 'id'> & { id?: string }) => void;
  removeCatalogItem: (id: string) => void;
  resetCatalog: () => void;
  /** Für die Datensicherung */
  snapshot: () => Data;
  replaceAll: (d: Data) => void;
  markBackup: () => void;
  hasDemo: boolean;
  loadDemo: () => void;
  removeDemo: () => void;
};

const Ctx = createContext<Store | null>(null);

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>(initial);
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);
  const latest = useRef(data);
  latest.current = data;

  useEffect(() => {
    requestPersistentStorage();
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        // Ältere Stände ergänzen, damit neue Bereiche nicht fehlen
        if (raw) {
          const saved = JSON.parse(raw);
          setData({ ...initial, ...saved, company: { ...defaultCompany, ...saved.company } });
        }
      })
      .catch(() => {})
      .finally(() => {
        loaded.current = true;
        setReady(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {});
  }, [data]);

  const mapInspection = (id: string, fn: (i: Inspection) => Inspection) =>
    setData((d) => ({ ...d, inspections: d.inspections.map((i) => (i.id === id ? fn(i) : i)) }));

  const upsertAppointment = (a: Appointment) =>
    setData((d) => ({
      ...d,
      appointments: d.appointments.some((x) => x.id === a.id)
        ? d.appointments.map((x) => (x.id === a.id ? a : x))
        : [...d.appointments, a],
    }));

  const store: Store = {
    ...data,
    ready,
    addCustomer: (c) => {
      const customer: Customer = { ...c, id: newId(), createdAt: new Date().toISOString() };
      setData((d) => ({ ...d, customers: [customer, ...d.customers] }));
      return customer;
    },
    updateCustomer: (id, patch) =>
      setData((d) => ({ ...d, customers: d.customers.map((c) => (c.id === id ? { ...c, ...patch } : c)) })),
    removeCustomer: (id) =>
      setData((d) => {
        d.inspections.filter((i) => i.customerId === id).forEach(removePhotosOf);
        [...d.docs, ...d.finance].filter((x) => x.customerId === id && x.fileRef).forEach((x) => deleteFile(x.fileRef!));
        return {
          ...d,
          docs: d.docs.filter((x) => x.customerId !== id),
          finance: d.finance.filter((x) => x.customerId !== id),
          customers: d.customers.filter((c) => c.id !== id),
          inspections: d.inspections.filter((i) => i.customerId !== id),
          appointments: d.appointments.map((a) => (a.customerId === id ? { ...a, customerId: undefined } : a)),
        };
      }),
    addInspection: (i) => {
      const inspection: Inspection = {
        ...i,
        id: newId(),
        results: {},
        customItems: [],
        summary: '',
        createdAt: new Date().toISOString(),
      };
      setData((d) => ({ ...d, inspections: [inspection, ...d.inspections] }));
      return inspection;
    },
    updateInspection: (id, patch) => mapInspection(id, (i) => ({ ...i, ...patch })),
    updateFinding: (id, itemId, patch) =>
      mapInspection(id, (i) => ({
        ...i,
        results: { ...i.results, [itemId]: { ...(i.results[itemId] ?? emptyFinding()), ...patch } },
      })),
    removeInspection: (id) =>
      setData((d) => {
        const target = d.inspections.find((i) => i.id === id);
        if (target) removePhotosOf(target);
        return { ...d, inspections: d.inspections.filter((i) => i.id !== id) };
      }),

    saveAppointment: async (input) => {
      const previous = input.id ? latest.current.appointments.find((x) => x.id === input.id) : undefined;
      const a: Appointment = { ...input, id: input.id ?? newId(), notificationId: previous?.notificationId };
      a.notificationId = await scheduleReminder(a);
      upsertAppointment(a);
      return a;
    },
    setAppointmentDone: (id, done) => {
      const a = latest.current.appointments.find((x) => x.id === id);
      if (!a) return;
      const next = { ...a, done };
      upsertAppointment(next);
      scheduleReminder(next).then((notificationId) => upsertAppointment({ ...next, notificationId }));
    },
    removeAppointment: (id) => {
      const a = latest.current.appointments.find((x) => x.id === id);
      cancelReminder(a?.notificationId);
      setData((d) => ({ ...d, appointments: d.appointments.filter((x) => x.id !== id) }));
    },

    saveNote: (input) => {
      const n: Note = { ...input, id: input.id ?? newId(), updatedAt: new Date().toISOString() };
      setData((d) => ({ ...d, notes: [n, ...d.notes.filter((x) => x.id !== n.id)] }));
      return n;
    },
    removeNote: (id) => setData((d) => ({ ...d, notes: d.notes.filter((x) => x.id !== id) })),

    addTip: (t) => setData((d) => ({ ...d, tips: [{ ...t, id: 'own-' + newId() }, ...d.tips] })),
    removeTip: (id) => setData((d) => ({ ...d, tips: d.tips.filter((x) => x.id !== id) })),

    updateTax: (patch) => setData((d) => ({ ...d, tax: { ...d.tax, ...patch } })),

    saveDoc: (input) => {
      const doc: CustomerDoc = { ...input, id: input.id ?? newId() };
      setData((d) => {
        const old = d.docs.find((x) => x.id === doc.id);
        if (old?.fileRef && old.fileRef !== doc.fileRef) deleteFile(old.fileRef);
        return { ...d, docs: [doc, ...d.docs.filter((x) => x.id !== doc.id)] };
      });
      return doc;
    },
    removeDoc: (id) =>
      setData((d) => {
        const old = d.docs.find((x) => x.id === id);
        if (old?.fileRef) deleteFile(old.fileRef);
        return { ...d, docs: d.docs.filter((x) => x.id !== id) };
      }),
    saveFinance: (input) => {
      const f: FinanceDoc = { ...input, id: input.id ?? newId() };
      setData((d) => {
        const old = d.finance.find((x) => x.id === f.id);
        if (old?.fileRef && old.fileRef !== f.fileRef) deleteFile(old.fileRef);
        return { ...d, finance: [f, ...d.finance.filter((x) => x.id !== f.id)] };
      });
      return f;
    },
    removeFinance: (id) =>
      setData((d) => {
        const old = d.finance.find((x) => x.id === id);
        if (old?.fileRef) deleteFile(old.fileRef);
        return { ...d, finance: d.finance.filter((x) => x.id !== id) };
      }),
    nextNumber: (kind, year) => {
      const prefix = kind === 'angebot' ? `A-${year}-` : `${year}-`;
      const max = latest.current.finance
        .filter((x) => x.kind === kind && x.number.startsWith(prefix))
        .map((x) => parseInt(x.number.slice(prefix.length), 10))
        .filter((n) => !isNaN(n))
        .reduce((a, b) => Math.max(a, b), 0);
      return prefix + String(max + 1).padStart(3, '0');
    },
    updateCompany: (patch) => setData((d) => ({ ...d, company: { ...d.company, ...patch } })),
    saveCatalogItem: (input) => {
      const item: CatalogItem = { ...input, id: input.id ?? newId() };
      setData((d) => ({
        ...d,
        catalog: d.catalog.some((x) => x.id === item.id) ? d.catalog.map((x) => (x.id === item.id ? item : x)) : [...d.catalog, item],
      }));
    },
    removeCatalogItem: (id) => setData((d) => ({ ...d, catalog: d.catalog.filter((x) => x.id !== id) })),
    resetCatalog: () => setData((d) => ({ ...d, catalog: defaultCatalog })),
    snapshot: () => latest.current,
    replaceAll: (next) => setData({ ...initial, ...next, company: { ...defaultCompany, ...next.company } }),
    markBackup: () => setData((d) => ({ ...d, lastBackupAt: new Date().toISOString() })),

    hasDemo: data.customers.some((c) => isDemo(c.id)),
    loadDemo: () => {
      const demo = buildDemo();
      setData((d) => {
        const clean = withoutDemo(d);
        return {
          ...clean,
          customers: [demo.customer, ...clean.customers],
          inspections: [demo.inspection, ...clean.inspections],
          appointments: [...clean.appointments, ...demo.appointments],
          notes: [...demo.notes, ...clean.notes],
        };
      });
    },
    removeDemo: () =>
      setData((d) => {
        d.inspections.filter((i) => isDemo(i.id) || isDemo(i.customerId)).forEach(removePhotosOf);
        d.appointments.filter((a) => isDemo(a.id)).forEach((a) => cancelReminder(a.notificationId));
        return withoutDemo(d);
      }),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

function withoutDemo(d: Data): Data {
  return {
    ...d,
    customers: d.customers.filter((c) => !isDemo(c.id)),
    inspections: d.inspections.filter((i) => !isDemo(i.id) && !isDemo(i.customerId)),
    appointments: d.appointments
      .filter((a) => !isDemo(a.id))
      .map((a) => (isDemo(a.customerId) ? { ...a, customerId: undefined } : a)),
    notes: d.notes.filter((n) => !isDemo(n.id)),
    docs: d.docs.filter((x) => !isDemo(x.customerId)),
    finance: d.finance.filter((x) => !isDemo(x.customerId)),
  };
}

function removePhotosOf(i: Inspection) {
  Object.values(i.results).forEach((f) => f.photos.forEach(deletePhoto));
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore außerhalb von StoreProvider');
  return s;
}
