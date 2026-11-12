/**
 * Web/iPhone-Home-Bildschirm: Dateien (PDFs, Fotos) liegen in IndexedDB.
 * localStorage ist auf ca. 5 MB begrenzt und würde mit Dateien schnell volllaufen.
 * Ein Verweis sieht so aus: "idb:<id>".
 */
const DB = 'brandschutz-ried-dateien';
const STORE = 'dateien';

type Rec = { blob: Blob; name: string; mime: string };

function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await db();
  return new Promise((resolve, reject) => {
    const r = fn(d.transaction(STORE, mode).objectStore(STORE));
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

const newKey = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/** Bittet den Browser, die Daten nicht automatisch zu löschen. */
export function requestPersistentStorage() {
  try {
    navigator.storage?.persist?.();
  } catch {}
}

export async function saveBlob(blob: Blob, name: string, mime: string): Promise<string> {
  const key = newKey();
  await tx('readwrite', (s) => s.put({ blob, name, mime } as Rec, key));
  return 'idb:' + key;
}

/** uri: was der Picker liefert (blob:, data: oder http) */
export async function storeFile(uri: string, name: string, mime: string, file?: Blob): Promise<string> {
  const blob = file ?? (await (await fetch(uri)).blob());
  return saveBlob(blob, name, mime || blob.type);
}

async function getRec(ref: string): Promise<Rec | undefined> {
  if (!ref.startsWith('idb:')) return undefined;
  return tx<Rec | undefined>('readonly', (s) => s.get(ref.slice(4)) as IDBRequest<Rec | undefined>);
}

export async function deleteFile(ref: string) {
  if (!ref.startsWith('idb:')) return;
  try {
    await tx('readwrite', (s) => s.delete(ref.slice(4)));
  } catch {}
}

const blobToDataUri = (b: Blob) =>
  new Promise<string>((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => resolve('');
    r.readAsDataURL(b);
  });

/** Liefert eine anzeigbare Adresse (für Bilder) */
export async function fileUrl(ref: string): Promise<string> {
  if (!ref.startsWith('idb:')) return ref;
  const rec = await getRec(ref);
  return rec ? URL.createObjectURL(rec.blob) : '';
}

export async function fileAsDataUri(ref: string): Promise<string> {
  if (!ref.startsWith('idb:')) return ref;
  const rec = await getRec(ref);
  return rec ? blobToDataUri(rec.blob) : '';
}

export async function fileAsBase64(ref: string): Promise<{ base64: string; name: string; mime: string } | null> {
  const rec = await getRec(ref);
  if (!rec) return null;
  const uri = await blobToDataUri(rec.blob);
  return { base64: uri.slice(uri.indexOf(',') + 1), name: rec.name, mime: rec.mime };
}

export async function fileFromBase64(base64: string, name: string, mime: string): Promise<string> {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return saveBlob(new Blob([bytes], { type: mime }), name, mime);
}

/** Öffnet die Datei. Auf dem iPhone kommt das Teilen-Menü (Dateien, Mail, WhatsApp). */
export async function openFile(ref: string, name: string, mime: string) {
  const rec = await getRec(ref);
  const blob = rec?.blob ?? (ref.startsWith('data:') ? await (await fetch(ref)).blob() : null);
  if (!blob) throw new Error('Datei nicht gefunden');
  await shareOrDownload(blob, name, mime || blob.type);
}

export async function shareOrDownload(blob: Blob, name: string, mime: string) {
  const file = new File([blob], name, { type: mime });
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], title: name });
      return;
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

/** Textdatei (z. B. Sicherung) teilen oder herunterladen */
export async function shareText(text: string, name: string, mime: string) {
  await shareOrDownload(new Blob([text], { type: mime }), name, mime);
}

export async function readPickedText(uri: string, file?: Blob): Promise<string> {
  if (file) return file.text();
  return (await fetch(uri)).text();
}
