import * as DocumentPicker from 'expo-document-picker';

export type Picked = { uri: string; name: string; mime: string; size?: number; file?: Blob };

/** PDF, Bild oder Word-Datei auswählen (iPhone: Dateien-App, iCloud, Fotos) */
export async function pickDocument(types: string[] = ['application/pdf', 'image/*', '*/*']): Promise<Picked | null> {
  const res = await DocumentPicker.getDocumentAsync({ type: types, copyToCacheDirectory: true, multiple: false });
  if (res.canceled || !res.assets?.[0]) return null;
  const a = res.assets[0];
  return { uri: a.uri, name: a.name, mime: a.mimeType ?? 'application/octet-stream', size: a.size ?? undefined, file: a.file ?? undefined };
}
