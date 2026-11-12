import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/constants/theme';
import { isDemo } from '@/data/demo';
import { useStore } from '@/store';
import { addDays, formatDate, formatEuro, today } from '@/utils/format';
import { isOverdue } from './finance-row';
import { Icon, IconName } from './icon';
import { Card } from './ui';

type Row = { icon: IconName; text: string; color: string; go: () => void };

/** „Heute wichtig“: was Geld bringt oder Ärger spart, ganz oben */
export function TodayCard() {
  const { finance, appointments, customers, lastBackupAt, ready } = useStore();
  if (!ready) return null;
  const t = today();
  const name = (id?: string) => customers.find((c) => c.id === id)?.name ?? '';
  const rows: Row[] = [];

  const overdue = finance.filter(isOverdue);
  if (overdue.length)
    rows.push({
      icon: 'alert-circle-outline',
      color: colors.danger,
      text: `${overdue.length} Rechnung(en) überfällig: ${formatEuro(overdue.reduce((s, f) => s + f.amount, 0))}. Heute freundlich erinnern.`,
      go: () => router.push('/finanzen'),
    });

  const stale = finance.filter((f) => f.kind === 'angebot' && f.status === 'offen' && addDays(f.date, 7) <= t);
  stale.slice(0, 3).forEach((f) =>
    rows.push({
      icon: 'call-outline',
      color: colors.warn,
      text: `Nachfassen: Angebot ${f.number} an ${name(f.customerId)} (${formatEuro(f.amount)}) seit ${formatDate(f.date)} offen.`,
      go: () => router.push({ pathname: '/beleg/[id]', params: { id: f.id } }),
    }),
  );

  const soon = appointments
    .filter((a) => !a.done && a.date >= t && a.date <= addDays(t, 7))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  soon.slice(0, 3).forEach((a) =>
    rows.push({
      icon: 'calendar-outline',
      color: colors.brandDark,
      text: `${a.date === t ? 'Heute' : formatDate(a.date)} ${a.time}: ${a.title}${a.customerId ? ` (${name(a.customerId)})` : ''}`,
      go: () => router.push(`/termin/${a.id}`),
    }),
  );

  const hasData = customers.some((c) => !isDemo(c.id)) || finance.length > 0;
  if (hasData && (!lastBackupAt || addDays(lastBackupAt.slice(0, 10), 7) <= t))
    rows.push({
      icon: 'cloud-upload-outline',
      color: colors.warn,
      text: lastBackupAt ? `Letzte Sicherung ${formatDate(lastBackupAt.slice(0, 10))}. Jetzt sichern.` : 'Noch nie gesichert. Jetzt sichern.',
      go: () => router.push('/buero'),
    });

  if (!rows.length) return null;
  return (
    <Card>
      <Text style={type.label}>HEUTE WICHTIG</Text>
      {rows.map((r, n) => (
        <Pressable key={n} onPress={r.go} style={styles.row}>
          <Icon name={r.icon} size={20} color={r.color} />
          <Text style={[type.small, { flex: 1, color: colors.text }]}>{r.text}</Text>
          <Icon name="chevron-forward" size={16} color={colors.muted} />
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s, paddingVertical: 6 },
});
