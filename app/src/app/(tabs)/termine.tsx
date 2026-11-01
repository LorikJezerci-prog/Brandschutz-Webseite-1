import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { TabHeader } from '@/components/tab-header';
import { Button, Card, Empty, Pill, Screen, Section } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { Appointment, appointmentTypes } from '@/store/types';
import { formatDate, today } from '@/utils/format';
import { remindersSupported } from '@/utils/reminders';

const weekday = (iso: string) =>
  ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'][new Date(iso + 'T12:00:00').getDay()];

export default function Termine() {
  const { appointments, customers, ready } = useStore();
  const t = today();
  const sorted = [...appointments].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const upcoming = sorted.filter((a) => !a.done && a.date >= t);
  const overdue = sorted.filter((a) => !a.done && a.date < t);
  const done = sorted.filter((a) => a.done).reverse().slice(0, 10);

  const row = (a: Appointment) => {
    const kind = appointmentTypes.find((x) => x.value === a.type);
    const customer = customers.find((c) => c.id === a.customerId);
    const isToday = a.date === t;
    return (
      <Card key={a.id} onPress={() => router.push(`/termin/${a.id}`)}>
        <View style={styles.row}>
          <View style={[styles.dateBox, isToday && { backgroundColor: colors.brand }]}>
            <Text style={[styles.dateDay, isToday && { color: colors.white }]}>{weekday(a.date)}</Text>
            <Text style={[styles.dateNum, isToday && { color: colors.white }]}>{a.date.slice(8, 10)}.{a.date.slice(5, 7)}.</Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[type.body, { fontWeight: '600' }, a.done && styles.doneText]} numberOfLines={2}>
              {kind?.icon} {a.title}
            </Text>
            <Text style={type.small} numberOfLines={1}>
              {a.time} Uhr{customer ? ` · ${customer.name}` : ''}
              {a.location ? ` · ${a.location}` : ''}
            </Text>
          </View>
          {a.remindBefore > 0 && !a.done && <Text style={{ fontSize: 16 }}>🔔</Text>}
        </View>
      </Card>
    );
  };

  return (
    <Screen header={<TabHeader title="Termine" subtitle="Begehungen, Schulungen und Fristen mit Erinnerung aufs Handy." />}>
      <Button title="Termin anlegen" icon="＋" onPress={() => router.push('/termin/neu')} />
      {!remindersSupported && (
        <Text style={type.small}>Erinnerungen kommen nur in der Handy-App, nicht in der Browser-Vorschau.</Text>
      )}
      {ready && appointments.length === 0 && (
        <Empty title="Keine Termine" text="Trag deinen nächsten Termin ein. Die App erinnert dich vorher per Benachrichtigung." />
      )}
      {overdue.length > 0 && (
        <Section title="Überfällig" right={<Pill text={String(overdue.length)} color={colors.danger} bg={colors.dangerSoft} />}>
          {overdue.map(row)}
        </Section>
      )}
      {upcoming.length > 0 && <Section title="Anstehend">{upcoming.map(row)}</Section>}
      {done.length > 0 && <Section title="Erledigt">{done.map(row)}</Section>}
      {ready && appointments.length > 0 && (
        <Text style={[type.small, { textAlign: 'center' }]}>Stand {formatDate(t)}</Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  dateBox: {
    width: 56,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.brandSoft,
    alignItems: 'center',
  },
  dateDay: { fontSize: 12, fontWeight: '700', color: colors.brandDark },
  dateNum: { fontSize: 15, fontWeight: '800', color: colors.brandDark, fontVariant: ['tabular-nums'] },
  doneText: { textDecorationLine: 'line-through', color: colors.muted },
});
