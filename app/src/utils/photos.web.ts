import * as ImagePicker from 'expo-image-picker';

import { deleteFile, fileAsDataUri, storeFile } from './files';

/** Web: Fotos landen in IndexedDB (Verweis "idb:…"), nicht im knappen localStorage. */
export async function takePhoto(_source: 'camera' | 'library'): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.5 });
  if (res.canceled || !res.assets[0]) return null;
  const a = res.assets[0];
  const blob = await shrink(a.uri);
  return storeFile(a.uri, `foto-${Date.now()}.jpg`, 'image/jpeg', blob ?? a.file ?? undefined);
}

/** Verkleinert auf max. 1600 px, damit Bericht und Sicherung nicht riesig werden */
async function shrink(uri: string): Promise<Blob | null> {
  try {
    const img = new Image();
    img.src = uri;
    await img.decode();
    const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale);
    c.height = Math.round(img.height * scale);
    c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
    return await new Promise((r) => c.toBlob((b) => r(b), 'image/jpeg', 0.7));
  } catch {
    return null;
  }
}

export function deletePhoto(uri: string) {
  deleteFile(uri);
}

export async function photoAsDataUri(uri: string): Promise<string> {
  return fileAsDataUri(uri);
}
