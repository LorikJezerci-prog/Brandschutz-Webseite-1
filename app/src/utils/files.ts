/**
 * Handy (Expo Go / App): Dateien liegen dauerhaft im App-Ordner "akte".
 * Ein Verweis ist die Datei-URI.
 */
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

function dir() {
  const d = new Directory(Paths.document, 'akte');
  if (!d.exists) d.create({ intermediates: true });
  return d;
}

const safe = (name: string) => name.replace(/[^\w.\-äöüÄÖÜß ]/g, '_');

export function requestPersistentStorage() {}

export async function storeFile(uri: string, name: string, _mime: string, _file?: Blob): Promise<string> {
  const target = new File(dir(), `${Date.now()}-${safe(name)}`);
  await new File(uri).copy(target);
  return target.uri;
}

export async function deleteFile(ref: string) {
  try {
    const f = new File(ref);
    if (f.exists) f.delete();
  } catch {}
}

export async function fileUrl(ref: string): Promise<string> {
  return ref;
}

export async function fileAsDataUri(ref: string): Promise<string> {
  if (ref.startsWith('data:')) return ref;
  try {
    return 'data:image/jpeg;base64,' + (await new File(ref).base64());
  } catch {
    return '';
  }
}

export async function fileAsBase64(ref: string): Promise<{ base64: string; name: string; mime: string } | null> {
  try {
    const f = new File(ref);
    if (!f.exists) return null;
    return { base64: await f.base64(), name: f.name, mime: f.type ?? 'application/octet-stream' };
  } catch {
    return null;
  }
}

export async function fileFromBase64(base64: string, name: string, _mime: string): Promise<string> {
  const target = new File(dir(), `${Date.now()}-${safe(name)}`);
  target.create();
  target.write(base64, { encoding: 'base64' });
  return target.uri;
}

export async function openFile(ref: string, _name: string, mime: string) {
  await Sharing.shareAsync(ref, { mimeType: mime || undefined });
}

export async function shareText(text: string, name: string, mime: string) {
  const f = new File(Paths.cache, safe(name));
  if (f.exists) f.delete();
  f.create();
  f.write(text);
  await Sharing.shareAsync(f.uri, { mimeType: mime, dialogTitle: name });
}

export async function readPickedText(uri: string, _file?: Blob): Promise<string> {
  return new File(uri).text();
}
