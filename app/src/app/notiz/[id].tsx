import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { ConfirmButton } from '@/components/confirm-button';
import { Button, Card, Screen } from '@/components/ui';
import { colors, space } from '@/constants/theme';
import { useStore } from '@/store';

export default function Notiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { notes, saveNote, removeNote } = useStore();
  const existing = notes.find((n) => n.id === id);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [text, setText] = useState(existing?.text ?? '');
  const empty = !title.trim() && !text.trim();

  return (
    <Screen>
      <Stack.Screen options={{ title: existing ? 'Notiz' : 'Neue Notiz' }} />
      <Card>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Titel"
          placeholderTextColor="#98A69F"
          style={styles.title}
          autoFocus={!existing}
        />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Notiz schreiben …"
          placeholderTextColor="#98A69F"
          multiline
          style={styles.text}
        />
      </Card>
      <Button
        title="Speichern"
        disabled={empty}
        onPress={() => {
          saveNote({ id: existing?.id, title: title.trim(), text: text.trim() });
          router.back();
        }}
      />
      {existing && (
        <ConfirmButton
          title="Notiz löschen"
          warning="Die Notiz wird endgültig entfernt."
          onConfirm={() => {
            removeNote(existing.id);
            router.back();
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '700', color: colors.text, paddingVertical: space.s },
  text: { fontSize: 16, lineHeight: 23, color: colors.text, minHeight: 240, textAlignVertical: 'top' },
});
