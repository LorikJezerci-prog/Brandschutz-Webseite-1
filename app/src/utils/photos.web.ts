import * as ImagePicker from 'expo-image-picker';

/** Web-Vorschau: Fotos als verkleinerte Data-URI, da es kein Dateisystem gibt. */
export async function takePhoto(_source: 'camera' | 'library'): Promise<string | null> {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.4, base64: true });
  if (res.canceled || !res.assets[0]) return null;
  const a = res.assets[0];
  return a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri;
}

export function deletePhoto(_uri: string) {}

export async function photoAsDataUri(uri: string): Promise<string> {
  return uri;
}
