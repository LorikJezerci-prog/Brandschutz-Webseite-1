import { Alert, Platform } from 'react-native';

export function confirm(title: string, text: string, ok: string, onOk: () => void) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${text}`)) onOk();
    return;
  }
  Alert.alert(title, text, [
    { text: 'Abbrechen', style: 'cancel' },
    { text: ok, style: 'destructive', onPress: onOk },
  ]);
}
