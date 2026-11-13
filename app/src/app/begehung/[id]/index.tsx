import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ConfirmButton } from '@/components/confirm-button';
import { Icon } from '@/components/icon';
import { Button, Card, Empty, Pill, Progress, Screen, Section } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { checklist } from '@/data/checklist';
import { useStore } from '@/store';
import { formatDate, progress } from '@/utils/format';
import { routeTo } from '@/utils/maps';

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
                <View style={styles.icon}>
                  <Icon name={cat.icon} size={22} />
                </View>
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

      <View style={{ flexDirection: 'row', gap: space.s }}>
        {!!c?.address && (
          <View style={{ flex: 1 }}>
            <Button title="Route" icon="navigate-outline" kind="secondary" onPress={() => routeTo(c.address)} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Button
            title="Nachtermin"
            icon="calendar-outline"
            kind="secondary"
            onPress={() =>
              router.push({
                pathname: '/termin/[id]',
                params: { id: 'neu', customerId: i.customerId, title: `Nachkontrolle ${c?.name ?? ''}`.trim() },
              })
            }
          />
        </View>
      </View>
      <Button title="Bericht ansehen und senden" icon="document-text-outline" onPress={() => router.push(`/begehung/${i.id}/bericht`)} />
      {i.closedAt ? (
        <Button title="Wieder öffnen" kind="secondary" onPress={() => updateInspection(i.id, { closedAt: undefined })} />
      ) : (
        <Button
          title="Begehung abschließen"
          kind="secondary"
          onPress={() => updateInspection(i.id, { closedAt: new Date().toISOString() })}
        />
      )}
      <ConfirmButton
        title="Begehung löschen"
        warning="Alle Ergebnisse und Fotos dieser Begehung werden entfernt."
        onConfirm={() => {
          removeInspection(i.id);
          router.back();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  icon: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
});
