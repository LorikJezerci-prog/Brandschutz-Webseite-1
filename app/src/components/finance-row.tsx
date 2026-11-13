import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { colors, type } from '@/constants/theme';
import { FinanceDoc } from '@/store/types';
import { formatDate, formatEuro, today } from '@/utils/format';
import { Icon } from './icon';
import { Card, Pill } from './ui';

export const isOverdue = (f: FinanceDoc) => f.kind === 'rechnung' && f.status === 'offen' && !!f.dueDate && f.dueDate < today();

export function statusPill(f: FinanceDoc) {
  if (isOverdue(f)) return { text: 'Überfällig', color: colors.danger, bg: colors.dangerSoft };
  switch (f.status) {
    case 'bezahlt':
      return { text: 'Bezahlt', color: colors.brandDark, bg: colors.brandSoft };
    case 'angenommen':
      return { text: 'Angenommen', color: colors.brandDark, bg: colors.brandSoft };
    case 'abgelehnt':
      return { text: 'Abgelehnt', color: colors.muted, bg: colors.line };
    case 'storniert':
      return { text: 'Storniert', color: colors.muted, bg: colors.line };
    default:
      return { text: 'Offen', color: colors.warn, bg: colors.warnSoft };
  }
}

export function FinanceRow({ f, customerName }: { f: FinanceDoc; customerName?: string }) {
  const p = statusPill(f);
  const inactive = f.status === 'abgelehnt' || f.status === 'storniert';
  return (
    <Card onPress={() => router.push(`/beleg/${f.id}`)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon name={f.kind === 'rechnung' ? 'receipt-outline' : 'pricetag-outline'} size={20} />
        <Text style={[type.body, { fontWeight: '600', flex: 1 }]} numberOfLines={1}>
          {f.kind === 'rechnung' ? 'Rechnung' : 'Angebot'} {f.number}
        </Text>
        <Text style={[type.body, { fontWeight: '700' }, inactive && { color: colors.muted, textDecorationLine: 'line-through' }]}>
          {formatEuro(f.amount)}
        </Text>
      </View>
      <Text style={type.small} numberOfLines={1}>
        {customerName ? `${customerName} · ` : ''}
        {f.title}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Pill text={p.text} color={p.color} bg={p.bg} />
        <Text style={[type.small, { fontSize: 12 }]}>
          {formatDate(f.date)}
          {f.status === 'bezahlt' && f.paidAt
            ? ` · bezahlt ${formatDate(f.paidAt)}`
            : f.dueDate && (f.status === 'offen')
              ? ` · ${f.kind === 'rechnung' ? 'fällig' : 'gültig bis'} ${formatDate(f.dueDate)}`
              : ''}
          {f.fileRef ? ' · PDF' : ''}
        </Text>
      </View>
    </Card>
  );
}

/** Summen für eine Liste von Belegen */
export function financeTotals(list: FinanceDoc[]) {
  const inv = list.filter((f) => f.kind === 'rechnung' && f.status !== 'storniert');
  const open = inv.filter((f) => f.status === 'offen');
  return {
    openSum: open.reduce((a, f) => a + f.amount, 0),
    openCount: open.length,
    overdueSum: open.filter(isOverdue).reduce((a, f) => a + f.amount, 0),
    overdueCount: open.filter(isOverdue).length,
    paidSum: inv.filter((f) => f.status === 'bezahlt').reduce((a, f) => a + f.amount, 0),
    offersOpen: list.filter((f) => f.kind === 'angebot' && f.status === 'offen').length,
    offersOpenSum: list.filter((f) => f.kind === 'angebot' && f.status === 'offen').reduce((a, f) => a + f.amount, 0),
  };
}
