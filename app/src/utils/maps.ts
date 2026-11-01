import { Linking, Platform } from 'react-native';

/** Öffnet die Adresse in der Karten-App des Geräts (Apple Karten, Google Maps). */
export async function openInMaps(address: string) {
  const q = encodeURIComponent(address.trim());
  if (!q) return;
  const google = `https://www.google.com/maps/search/?api=1&query=${q}`;
  const url = Platform.select({
    ios: `maps://?q=${q}`,
    android: `geo:0,0?q=${q}`,
    default: google,
  });
  try {
    await Linking.openURL(url);
  } catch {
    await Linking.openURL(google).catch(() => {});
  }
}

/** Startet direkt die Navigation zur Adresse. */
export async function routeTo(address: string) {
  const q = encodeURIComponent(address.trim());
  if (!q) return;
  const google = `https://www.google.com/maps/dir/?api=1&destination=${q}`;
  const url = Platform.select({
    ios: `maps://?daddr=${q}`,
    android: `google.navigation:q=${q}`,
    default: google,
  });
  try {
    await Linking.openURL(url);
  } catch {
    await Linking.openURL(google).catch(() => {});
  }
}
