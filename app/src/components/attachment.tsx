import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { colors, space, type } from '@/constants/theme';
import { openFile, storeFile } from '@/utils/files';
import { formatSize } from '@/utils/format';
import { pickDocument } from '@/utils/pick';
import { Icon } from './icon';
import { Button, Card } from './ui';

export type Attached = { fileRef?: string; fileName?: string; mime?: string; size?: number };

/** Datei anhängen, öffnen, ersetzen oder entfernen */
export function Attachment({ value, onChange, label = 'Datei' }: { value: Attached; onChange: (v: Attached) => void; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async () => {
    setError('');
    const p = await pickDocument();
    if (!p) return;
    setBusy(true);
    try {
      const fileRef = await storeFile(p.uri, p.name, p.mime, p.file);
      onChange({ fileRef, fileName: p.name, mime: p.mime, size: p.size });
    } catch (e) {
      setError('Die Datei konnte nicht gespeichert werden: ' + String(e));
    } finally {
      setBusy(false);
    }
  };

  const open = async () => {
    setError('');
    try {
      await openFile(value.fileRef!, value.fileName ?? 'Datei', value.mime ?? '');
    } catch (e) {
      setError('Die Datei lässt sich nicht öffnen: ' + String(e));
    }
  };

  return (
    <Card>
      <Text style={type.label}>{label.toUpperCase()}</Text>
      {value.fileRef ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.s }}>
          <Icon name={value.mime?.startsWith('image/') ? 'image-outline' : 'document-attach-outline'} size={26} />
          <View style={{ flex: 1 }}>
            <Text style={[type.body, { fontWeight: '600' }]} numberOfLines={2}>
              {value.fileName}
            </Text>
            {!!value.size && <Text style={type.small}>{formatSize(value.size)}</Text>}
          </View>
        </View>
      ) : (
        <Text style={type.small}>Noch keine Datei. Du kannst ein PDF, Foto oder Word-Dokument aus Dateien, iCloud oder Fotos anhängen.</Text>
      )}
      {busy ? (
        <ActivityIndicator color={colors.brand} />
      ) : (
        <View style={{ flexDirection: 'row', gap: space.s }}>
          {value.fileRef && (
            <View style={{ flex: 1 }}>
              <Button title="Öffnen" icon="open-outline" onPress={open} />
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Button title={value.fileRef ? 'Ersetzen' : 'Datei anhängen'} icon="attach-outline" kind="secondary" onPress={pick} />
          </View>
        </View>
      )}
      {value.fileRef && !busy && (
        <Text style={[type.small, { color: colors.danger, textAlign: 'center' }]} onPress={() => onChange({})}>
          Datei entfernen
        </Text>
      )}
      {!!error && <Text style={[type.small, { color: colors.danger }]}>{error}</Text>}
    </Card>
  );
}
