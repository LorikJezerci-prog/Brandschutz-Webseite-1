import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

/** Fotos liegen dauerhaft im App-Ordner, damit sie nach Neustart noch da sind. */
function photoDir() {
  const dir = new Directory(Paths.document, 'fotos');
  if (!dir.exists) dir.create({ intermediates: true });
  return dir;
}

export async function takePhoto(source: 'camera' | 'library'): Promise<string | null> {
  const perm =
    source === 'camera'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Kein Zugriff', 'Bitte in den Einstellungen den Zugriff auf Kamera bzw. Fotos erlauben.');
    return null;
  }
  const opts: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.5 };
  const res =
    source === 'camera' ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
  if (res.canceled || !res.assets[0]) return null;

  const picked = new File(res.assets[0].uri);
  const target = new File(photoDir(), `${Date.now()}.jpg`);
  await picked.copy(target);
  return target.uri;
}

export function deletePhoto(uri: string) {
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {}
}

export async function photoAsDataUri(uri: string): Promise<string> {
  try {
    return 'data:image/jpeg;base64,' + (await new File(uri).base64());
  } catch {
    return '';
  }
}
