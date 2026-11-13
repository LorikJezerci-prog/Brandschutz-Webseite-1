import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Attached, Attachment } from '@/components/attachment';
import { ConfirmButton } from '@/components/confirm-button';
import { Icon } from '@/components/icon';
import { Button, Card, Empty, Field, Screen, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { DocCategory, docCategories } from '@/store/types';
import { formatDate, parseDate, today } from '@/utils/format';

export default function Unterlage() {
  const { id, customerId, category: catParam } = useLocalSearchParams<{ id: string; customerId?: string; category?: DocCategory }>();
  const { docs, customers, saveDoc, removeDoc } = useStore();
  const existing = docs.find((d) => d.id === id);
  const cid = existing?.customerId ?? customerId;
  const customer = customers.find((c) => c.id === cid);

  const [title, setTitle] = useState(existing?.title ?? '');
  const [category, setCategory] = useState<DocCategory>(existing?.category ?? catParam ?? 'bso');
  const [date, setDate] = useState(formatDate(existing?.date ?? today()));
  const [note, setNote] = useState(existing?.note ?? '');
  const [file, setFile] = useState<Attached>({
    fileRef: existing?.fileRef,
    fileName: existing?.fileName,
    mime: existing?.mime,
    size: existing?.size,
  });

  if (!customer) return <Empty title="Kunde fehlt" text="Lege Unterlagen immer bei einem Kunden an." />;
  const iso = parseDate(date);
  const label = docCategories.find((c) => c.value === category)?.label ?? '';
  const finalTitle = title.trim() || file.fileName?.replace(/\.[^.]+$/, '') || label;
  const canSave = !!iso && (!!title.trim() || !!file.fileRef);

  return (
    <Screen>
      <Stack.Screen options={{ title: existing ? 'Unterlage' : 'Neue Unterlage' }} />
      <Text style={type.small}>Für {customer.name}</Text>

      <Card>
        <Text style={type.label}>ART</Text>
        <View style={styles.chips}>
          {docCategories.map((c) => {
            const active = c.value === category;
            return (
              <Pressable
                key={c.value}
                onPress={() => {
                  tap();
                  setCategory(c.value);
                }}
                style={[styles.chip, active && styles.chipActive]}>
                <Icon name={c.icon} size={16} color={active ? colors.white : colors.brandDark} />
                <Text style={[styles.chipText, active && { color: colors.white }]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Attachment value={file} onChange={setFile} />

      <Field label="Titel" value={title} onChangeText={setTitle} placeholder={`z. B. ${label} Teil A, Stand 2026`} />
      <Field label="Datum (TT.MM.JJJJ)" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
      {!iso && <Text style={[type.small, { color: colors.danger }]}>Bitte ein Datum wie 12.11.2026 eingeben.</Text>}
      <Field label="Notiz" value={note} onChangeText={setNote} multiline placeholder="z. B. nächste Überarbeitung 2028, Teil B an alle verteilt" />

      <Button
        title="Speichern"
        disabled={!canSave}
        onPress={() => {
          saveDoc({ id: existing?.id, customerId: customer.id, title: finalTitle, category, date: iso!, note: note.trim(), ...file });
          router.back();
        }}
      />
      {existing && (
        <ConfirmButton
          title="Unterlage löschen"
          warning="Die Unterlage und die angehängte Datei werden entfernt."
          onConfirm={() => {
            removeDoc(existing.id);
            router.back();
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.m,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.brandSoft,
  },
  chipActive: { backgroundColor: colors.brand },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.brandDark },
});
