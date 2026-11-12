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

export const formatEuro = (n: number) =>
  n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 });

/** "1.234,50" oder "1234.5" → 1234.5; leer/ungültig → null */
export const parseEuro = (s: string): number | null => {
  const t = s.replace(/[€\s]/g, '');
  if (!t) return null;
  // Deutsch: "1.930" = 1930, "1.930,50" = 1930,5; "375.5" bleibt 375,5
  const n = Number(t.includes(',') || /^\d{1,3}(\.\d{3})+$/.test(t) ? t.replace(/\./g, '').replace(',', '.') : t);
  return isFinite(n) ? Math.round(n * 100) / 100 : null;
};

export const addDays = (iso: string, days: number) => {
  const d = new Date(iso + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatSize = (bytes?: number) =>
  !bytes ? '' : bytes > 1e6 ? `${(bytes / 1e6).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1e3))} KB`;

/** Kalenderwoche nach ISO 8601 (wie in Deutschland üblich) */
export const isoWeek = (iso: string) => {
  const d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - y.getTime()) / 86400000 + 1) / 7);
};

export const weekdayShort = (iso: string) => ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][new Date(iso + 'T12:00:00').getDay()];

/** Montag der Woche als JJJJ-MM-TT */
export const weekStart = (iso: string) => {
  const day = new Date(iso + 'T12:00:00').getDay() || 7;
  return addDays(iso, 1 - day);
};
