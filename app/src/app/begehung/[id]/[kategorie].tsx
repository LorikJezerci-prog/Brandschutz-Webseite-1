import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, Card, Empty, Screen, Segmented } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { categoryById, checklist } from '@/data/checklist';
import { newId, useStore } from '@/store';
import { emptyFinding, Priority, Status } from '@/store/types';
import { deletePhoto, takePhoto } from '@/utils/photos';

const statusOptions: { value: Status; label: string; color?: string; bg?: string }[] = [
  { value: 'ok', label: '✓ In Ordnung' },
  { value: 'mangel', label: '✗ Mangel', color: colors.danger, bg: colors.dangerSoft },
  { value: 'na', label: '– Entfällt', color: colors.muted, bg: colors.line },
];

const prioOptions: { value: Priority; label: string; color?: string; bg?: string }[] = [
  { value: 'sofort', label: 'Sofort', color: colors.danger, bg: colors.dangerSoft },
  { value: 'kurzfristig', label: '≤ 4 Wochen', color: colors.warn, bg: colors.warnSoft },
  { value: 'mittelfristig', label: '≤ 3 Monate', color: colors.brandDark, bg: colors.brandSoft },
];

export default function Kategorie() {
  const { id, kategorie } = useLocalSearchParams<{ id: string; kategorie: string }>();
  const { inspections, updateFinding, updateInspection } = useStore();
  const [newItem, setNewItem] = useState('');
  const i = inspections.find((x) => x.id === id);
  const cat = categoryById(kategorie);
  if (!i || !cat) return <Empty title="Nicht gefunden" text="Diese Begehung oder dieser Bereich existiert nicht." />;

  const items = [...cat.items, ...i.customItems.filter((c) => c.categoryId === cat.id)];
  const idx = checklist.findIndex((c) => c.id === cat.id);
  const next = checklist[idx + 1];

  const addPhoto = async (itemId: string, source: 'camera' | 'library') => {
    const uri = await takePhoto(source);
    if (!uri) return;
    const f = i.results[itemId] ?? emptyFinding();
    updateFinding(i.id, itemId, { photos: [...f.photos, uri] });
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: cat.title }} />
      {items.map((item) => {
        const f = i.results[item.id] ?? emptyFinding();
        const basis = 'basis' in item ? item.basis : undefined;
        const hint = 'hint' in item ? item.hint : undefined;
        return (
          <Card key={item.id} style={f.status === 'mangel' && { borderColor: colors.danger, borderWidth: 1 }}>
            <Text style={[type.body, { fontWeight: '600' }]}>{item.title}</Text>
            {(hint || basis) && <Text style={type.small}>{[hint, basis].filter(Boolean).join(' · ')}</Text>}
            <Segmented
              value={f.status}
              options={statusOptions}
              onChange={(status) =>
                updateFinding(i.id, item.id, {
                  status,
                  priority: status === 'mangel' ? (f.priority ?? 'kurzfristig') : f.priority,
                })
              }
            />
            {f.status === 'mangel' && (
              <View style={{ gap: space.s, marginTop: space.xs }}>
                <Text style={type.label}>DRINGLICHKEIT</Text>
                <Segmented value={f.priority} options={prioOptions} onChange={(priority) => updateFinding(i.id, item.id, { priority })} />
                <TextInput
                  value={f.note}
                  onChangeText={(note) => updateFinding(i.id, item.id, { note })}
                  placeholder="Was ist los, wo genau, was ist zu tun?"
                  placeholderTextColor="#98A69F"
                  multiline
                  style={styles.note}
                />
                <View style={styles.photos}>
                  {f.photos.map((uri) => (
                    <View key={uri}>
                      <Image source={{ uri }} style={styles.photo} contentFit="cover" />
                      <Pressable
                        accessibilityLabel="Foto entfernen"
                        hitSlop={8}
                        onPress={() => {
                          deletePhoto(uri);
                          updateFinding(i.id, item.id, { photos: f.photos.filter((p) => p !== uri) });
                        }}
                        style={styles.photoRemove}>
                        <Text style={styles.photoRemoveText}>✕</Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', gap: space.s }}>
                  {Platform.OS !== 'web' && (
                    <View style={{ flex: 1 }}>
                      <Button title="Foto" icon="camera-outline" kind="secondary" onPress={() => addPhoto(item.id, 'camera')} />
                    </View>
                  )}
                  <View style={{ flex: 1 }}>
                    <Button title="Aus Galerie" icon="images-outline" kind="secondary" onPress={() => addPhoto(item.id, 'library')} />
                  </View>
                </View>
              </View>
            )}
          </Card>
        );
      })}

      <Card>
        <Text style={type.label}>EIGENER PRÜFPUNKT</Text>
        <TextInput
          value={newItem}
          onChangeText={setNewItem}
          placeholder="z. B. Lackierkabine: Absaugung gereinigt"
          placeholderTextColor="#98A69F"
          style={styles.note}
        />
        <Button
          title="Hinzufügen"
          kind="secondary"
          disabled={!newItem.trim()}
          onPress={() => {
            updateInspection(i.id, {
              customItems: [...i.customItems, { id: 'custom-' + newId(), categoryId: cat.id, title: newItem.trim() }],
            });
            setNewItem('');
          }}
        />
      </Card>

      {next ? (
        <Button title={`Weiter: ${next.title}`} onPress={() => router.replace(`/begehung/${i.id}/${next.id}`)} />
      ) : (
        <Button title="Zur Übersicht" onPress={() => router.back()} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.s,
    padding: space.m,
    minHeight: 48,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.bg,
  },
  photos: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  photo: { width: 96, height: 72, borderRadius: radius.s, backgroundColor: colors.line },
  photoRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoRemoveText: { color: colors.white, fontSize: 13, fontWeight: '700' },
});
