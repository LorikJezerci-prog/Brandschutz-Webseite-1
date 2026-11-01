import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field, Screen, Section, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { builtInTips } from '@/data/tips';
import { useStore } from '@/store';

const OWN = 'Eigene';

export default function Tipps() {
  const { tips, addTip, removeTip } = useStore();
  const all = [...tips, ...builtInTips];
  const categories = [...new Set(all.map((t) => t.category))];
  const [filter, setFilter] = useState<string>('Alle');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const shown = all.filter((t) => filter === 'Alle' || t.category === filter);

  return (
    <Screen>
      <View style={styles.chips}>
        {['Alle', ...categories].map((c) => (
          <Pressable key={c} onPress={() => (tap(), setFilter(c))} style={[styles.chip, filter === c && styles.chipActive]}>
            <Text style={[styles.chipText, filter === c && { color: colors.white }]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      {open ? (
        <Card style={{ gap: 12 }}>
          <Field label="Eigener Tipp" value={title} onChangeText={setTitle} placeholder="Kurz und knackig" autoFocus />
          <Field label="Details" value={text} onChangeText={setText} multiline />
          <Button
            title="Tipp speichern"
            disabled={!title.trim()}
            onPress={() => {
              addTip({ category: OWN, title: title.trim(), text: text.trim() });
              setTitle('');
              setText('');
              setOpen(false);
              setFilter(OWN);
            }}
          />
          <Button title="Abbrechen" kind="secondary" onPress={() => setOpen(false)} />
        </Card>
      ) : (
        <Button title="Eigenen Tipp hinzufügen" icon="add" kind="secondary" onPress={() => setOpen(true)} />
      )}

      <Section title={`${shown.length} Tipps`}>
        {shown.map((t) => (
          <Card key={t.id}>
            <Text style={type.label}>{t.category.toUpperCase()}</Text>
            <Text style={type.h2}>{t.title}</Text>
            {!!t.text && <Text style={type.body}>{t.text}</Text>}
            {t.category === OWN && (
              <Text style={styles.remove} onPress={() => removeTip(t.id)}>
                Entfernen
              </Text>
            )}
          </Card>
        ))}
      </Section>
      <Text style={type.small}>
        Steuer- und Rechtsangaben sind Stand 2026 und ersetzen keine Beratung durch Steuerberater oder Versicherer.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
  remove: { color: colors.danger, fontWeight: '600', marginTop: 4 },
});
