import type { Data } from '@/store';
import { fileAsBase64, fileFromBase64, shareText } from './files';
import { today } from './format';

const APP = 'brandschutz-ried';

type BackupFile = { base64: string; name: string; mime: string };
export type Backup = { app: typeof APP; version: 1; exportedAt: string; data: Data; files: Record<string, BackupFile> };

/** Alle Datei-Verweise in den Daten (Fotos, Unterlagen, Belege) */
function refsOf(d: Data): string[] {
  const refs = new Set<string>();
  d.inspections.forEach((i) => Object.values(i.results).forEach((f) => f.photos.forEach((p) => refs.add(p))));
  d.docs.forEach((x) => x.fileRef && refs.add(x.fileRef));
  d.finance.forEach((x) => x.fileRef && refs.add(x.fileRef));
  return [...refs].filter((r) => !r.startsWith('data:'));
}

export async function buildBackup(d: Data): Promise<{ json: string; missing: number; files: number }> {
  const files: Record<string, BackupFile> = {};
  let missing = 0;
  for (const ref of refsOf(d)) {
    const f = await fileAsBase64(ref);
    if (f) files[ref] = f;
    else missing++;
  }
  const backup: Backup = { app: APP, version: 1, exportedAt: new Date().toISOString(), data: d, files };
  return { json: JSON.stringify(backup), missing, files: Object.keys(files).length };
}

export async function exportBackup(d: Data) {
  const { json, missing, files } = await buildBackup(d);
  await shareText(json, `Brandschutz-Ried-Sicherung-${today()}.json`, 'application/json');
  return { missing, files, bytes: json.length };
}

export function parseBackup(text: string): Backup {
  let b: Backup;
  try {
    b = JSON.parse(text);
  } catch {
    throw new Error('Die Datei ist keine gültige Sicherung.');
  }
  if (b?.app !== APP || !b.data || !Array.isArray(b.data.customers)) {
    throw new Error('Diese Datei ist keine Sicherung der Brandschutz-Ried-App.');
  }
  return b;
}

/** Dateien zurückschreiben und Verweise in den Daten auf die neuen Orte umstellen */
export async function restoreBackup(b: Backup): Promise<Data> {
  const map: Record<string, string> = {};
  for (const [oldRef, f] of Object.entries(b.files ?? {})) {
    map[oldRef] = await fileFromBase64(f.base64, f.name, f.mime);
  }
  const fix = (r?: string) => (r && map[r]) || r;
  const d = b.data;
  return {
    ...d,
    inspections: d.inspections.map((i) => ({
      ...i,
      results: Object.fromEntries(
        Object.entries(i.results).map(([k, f]) => [k, { ...f, photos: f.photos.map((p) => fix(p)!) }]),
      ),
    })),
    docs: (d.docs ?? []).map((x) => ({ ...x, fileRef: fix(x.fileRef) })),
    finance: (d.finance ?? []).map((x) => ({ ...x, fileRef: fix(x.fileRef) })),
    appointments: d.appointments.map((a) => ({ ...a, notificationId: undefined })),
  };
}

export function backupSummary(b: Backup) {
  const d = b.data;
  return `${d.customers.length} Kunden, ${d.inspections.length} Begehungen, ${(d.docs ?? []).length} Unterlagen, ${(d.finance ?? []).length} Angebote/Rechnungen, ${Object.keys(b.files ?? {}).length} Dateien`;
}
