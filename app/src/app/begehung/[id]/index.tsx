import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Card, Empty, Pill, Progress, Screen, Section } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { checklist } from '@/data/checklist';
import { useStore } from '@/store';
import { confirm } from '@/utils/confirm';
import { formatDate, progress } from '@/utils/format';

export default function Begehung() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inspections, customers, updateInspection, removeInspection } = useStore();
  const i = inspections.find((x) => x.id === id);
  if (!i) return <Empty title="Begehung nicht gefunden" text="Sie wurde vielleicht gelöscht." />;
  const c = customers.find((x) => x.id === i.customerId);
  const total = progress(i);

  return (
    <Screen>
      <Stack.Screen options={{ title: c?.name ?? 'Begehung' }} />
      <Card>
        <Text style={type.title}>{c?.name ?? 'Unbekannter Kunde'}</Text>
        <Text style={type.small}>
          {i.object || 'Gesamtes Objekt'} · {formatDate(i.date)}
          {i.participants ? ` · ${i.participants}` : ''}
        </Text>
        <View style={{ gap: 4, marginTop: 6 }}>
          <Progress value={total.total ? total.done / total.total : 0} />
          <Text style={type.small}>
            {total.done} von {total.total} geprüft · {total.defects} Mängel
          </Text>
        </View>
        {i.closedAt && <Pill text={`Abgeschlossen am ${formatDate(i.closedAt)}`} />}
      </Card>

      <Section title="Bereiche">
        {checklist.map((cat) => {
          const p = progress(i, cat.id);
          const done = p.done === p.total;
          return (
            <Card key={cat.id} onPress={() => router.push(`/begehung/${i.id}/${cat.id}`)}>
              <View style={styles.row}>
                <Text style={styles.icon}>{cat.icon}</Text>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[type.body, { fontWeight: '600' }]}>{cat.title}</Text>
                  <Progress value={p.total ? p.done / p.total : 0} />
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[type.small, done && { color: colors.brand, fontWeight: '700' }]}>
                    {done ? '✓' : `${p.done}/${p.total}`}
                  </Text>
                  {p.defects > 0 && <Pill text={`${p.defects} ✗`} color={colors.danger} bg={colors.dangerSoft} />}
                </View>
              </View>
            </Card>
          );
        })}
      </Section>

      <Button title="Bericht ansehen und senden" icon="📄" onPress={() => router.push(`/begehung/${i.id}/bericht`)} />
      {i.closedAt ? (
        <Button title="Wieder öffnen" kind="secondary" onPress={() => updateInspection(i.id, { closedAt: undefined })} />
      ) : (
        <Button
          title="Begehung abschließen"
          kind="secondary"
          onPress={() => updateInspection(i.id, { closedAt: new Date().toISOString() })}
        />
      )}
      <Button
        title="Begehung löschen"
        kind="danger"
        onPress={() =>
          confirm('Begehung löschen?', 'Alle Ergebnisse und Fotos dieser Begehung werden entfernt.', 'Löschen', () => {
            removeInspection(i.id);
            router.back();
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  icon: { fontSize: 26 },
});
