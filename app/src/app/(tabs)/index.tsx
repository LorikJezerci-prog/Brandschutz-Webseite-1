import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TabHeader } from '@/components/tab-header';
import { Button, Card, Empty, Pill, Progress, Screen, Section } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { Inspection } from '@/store/types';
import { formatDate, progress } from '@/utils/format';

export default function Begehungen() {
  const { inspections, customers, ready } = useStore();
  const open = inspections.filter((i) => !i.closedAt);
  const closed = inspections.filter((i) => i.closedAt);
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? 'Unbekannter Kunde';

  const row = (i: Inspection) => {
    const p = progress(i);
    return (
      <Card key={i.id} onPress={() => router.push(`/begehung/${i.id}`)}>
        <View style={styles.rowHead}>
          <Text style={[type.h2, { flex: 1 }]} numberOfLines={1}>
            {customerName(i.customerId)}
          </Text>
          {p.defects > 0 ? (
            <Pill text={`${p.defects} Mängel`} color={colors.danger} bg={colors.dangerSoft} />
          ) : i.closedAt ? (
            <Pill text="Ohne Mängel" />
          ) : null}
        </View>
        <Text style={type.small}>
          {i.object || 'Gesamtes Objekt'} · {formatDate(i.date)}
        </Text>
        {!i.closedAt && (
          <View style={{ gap: 4, marginTop: 4 }}>
            <Progress value={p.total ? p.done / p.total : 0} />
            <Text style={type.small}>
              {p.done} von {p.total} Punkten geprüft
            </Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen header={<TabHeader title="Begehungen" subtitle="Vor Ort prüfen, Mängel festhalten, Bericht als PDF senden." />}>
      <Button title="Neue Begehung starten" icon="add" onPress={() => router.push('/begehung/neu')} />

      {ready && inspections.length === 0 ? (
        <Empty
          title="Noch keine Begehung"
          text="Leg zuerst einen Kunden an oder starte direkt. Alles bleibt auf diesem Gerät gespeichert, auch ohne Netz."
        />
      ) : null}

      {open.length > 0 && <Section title={`Laufend (${open.length})`}>{open.map(row)}</Section>}
      {closed.length > 0 && <Section title={`Abgeschlossen (${closed.length})`}>{closed.map(row)}</Section>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  rowHead: { flexDirection: 'row', alignItems: 'center', gap: space.s },
});
