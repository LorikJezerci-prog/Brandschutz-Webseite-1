import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

import { deletePhoto } from '@/utils/photos';
import { Customer, emptyFinding, Finding, Inspection } from './types';

const KEY = 'brandschutz-ried/v1';

type Data = { customers: Customer[]; inspections: Inspection[] };

type Store = Data & {
  ready: boolean;
  addCustomer: (c: Omit<Customer, 'id' | 'createdAt'>) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addInspection: (i: Pick<Inspection, 'customerId' | 'object' | 'date' | 'participants'>) => Inspection;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  updateFinding: (id: string, itemId: string, patch: Partial<Finding>) => void;
  removeInspection: (id: string) => void;
};

const Ctx = createContext<Store | null>(null);

export const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({ customers: [], inspections: [] });
  const [ready, setReady] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setData(JSON.parse(raw));
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
        return {
          customers: d.customers.filter((c) => c.id !== id),
          inspections: d.inspections.filter((i) => i.customerId !== id),
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
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

function removePhotosOf(i: Inspection) {
  Object.values(i.results).forEach((f) => f.photos.forEach(deletePhoto));
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore außerhalb von StoreProvider');
  return s;
}
