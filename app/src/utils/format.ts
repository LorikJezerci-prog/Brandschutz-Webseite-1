import { allItems } from '@/data/checklist';
import { Inspection } from '@/store/types';

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatDate = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return y && m && d ? `${d}.${m}.${y}` : iso;
};

/** Akzeptiert TT.MM.JJJJ oder JJJJ-MM-TT, liefert JJJJ-MM-TT oder null */
export const parseDate = (input: string): string | null => {
  const s = input.trim();
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? s : null;
};

export function itemsOf(i: Inspection) {
  return [...allItems, ...i.customItems.map((c) => ({ ...c, hint: undefined, basis: undefined }))];
}

export function progress(i: Inspection, categoryId?: string) {
  const items = itemsOf(i).filter((x) => !categoryId || x.categoryId === categoryId);
  const done = items.filter((x) => i.results[x.id]?.status).length;
  const defects = items.filter((x) => i.results[x.id]?.status === 'mangel').length;
  return { total: items.length, done, defects };
}
