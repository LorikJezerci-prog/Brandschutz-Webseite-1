import { router } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

import { TabHeader } from '@/components/tab-header';
import { Button, Card, Empty, Screen } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate } from '@/utils/format';

export default function Kunden() {
  const { customers, inspections, ready } = useStore();
  const [q, setQ] = useState('');
  const list = customers
    .filter((c) => (c.name + c.branche + c.address).toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, 'de'));

  return (
    <Screen header={<TabHeader title="Kunden" subtitle="Betriebe und Objekte, die du betreust." />}>
      <Button title="Kunden anlegen" icon="add" onPress={() => router.push('/kunde/neu')} />
      {customers.length > 3 && (
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Suchen nach Name, Branche, Ort"
          placeholderTextColor="#98A69F"
          style={styles.search}
        />
      )}
      {ready && customers.length === 0 && (
        <Empty
          title="Noch keine Kunden"
          text="Lege Betriebe mit Ansprechpartner und Adresse an. Die Daten erscheinen später im Mängelbericht."
        />
      )}
      {list.map((c) => {
        const mine = inspections.filter((i) => i.customerId === c.id);
        const last = mine.map((i) => i.date).sort().at(-1);
        return (
          <Card key={c.id} onPress={() => router.push(`/kunde/${c.id}`)}>
            <Text style={type.h2}>{c.name}</Text>
            <Text style={type.small}>
              {[c.branche, c.address].filter(Boolean).join(' · ') || 'Keine weiteren Angaben'}
            </Text>
            <Text style={[type.small, { color: colors.brandDark }]}>
              {mine.length === 0 ? 'Noch keine Begehung' : `${mine.length} Begehung(en), zuletzt ${formatDate(last!)}`}
            </Text>
          </Card>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: colors.card,
    borderRadius: radius.m,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.m,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
});
