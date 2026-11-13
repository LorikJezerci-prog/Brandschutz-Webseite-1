import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { financeTotals, FinanceRow, isOverdue } from '@/components/finance-row';
import { Card, Empty, Screen, Section, Segmented } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { formatEuro, today } from '@/utils/format';

type Filter = 'offen' | 'angebote' | 'alle';

export default function Finanzen() {
  const { finance, customers } = useStore();
  const [filter, setFilter] = useState<Filter>('offen');
  const year = today().slice(0, 4);
  const name = (id: string) => customers.find((c) => c.id === id)?.name;
  const all = [...finance].sort((a, b) => b.date.localeCompare(a.date));
  const t = financeTotals(all);
  const paidThisYear = all
    .filter((f) => f.kind === 'rechnung' && f.status === 'bezahlt' && (f.paidAt ?? f.date).startsWith(year))
    .reduce((a, f) => a + f.amount, 0);

  const list =
    filter === 'offen'
      ? all.filter((f) => f.kind === 'rechnung' && f.status === 'offen').sort((a, b) => Number(isOverdue(b)) - Number(isOverdue(a)))
      : filter === 'angebote'
        ? all.filter((f) => f.kind === 'angebot')
        : all;

  return (
    <Screen>
      <View style={styles.kpis}>
        <Card style={styles.kpi}>
          <Text style={[styles.v, { color: t.overdueCount ? colors.danger : colors.text }]} adjustsFontSizeToFit numberOfLines={1}>
            {formatEuro(t.openSum)}
          </Text>
          <Text style={type.small}>offen{t.overdueCount ? `, davon ${formatEuro(t.overdueSum)} überfällig` : ''}</Text>
        </Card>
        <Card style={styles.kpi}>
          <Text style={[styles.v, { color: colors.brandDark }]} adjustsFontSizeToFit numberOfLines={1}>
            {formatEuro(paidThisYear)}
          </Text>
          <Text style={type.small}>eingenommen {year}</Text>
        </Card>
      </View>
      <Text style={type.small}>
        {t.offersOpen} offene(s) Angebot(e) über {formatEuro(t.offersOpenSum)}. Neue Angebote und Rechnungen legst du beim jeweiligen Kunden
        unter „Finanzen“ an.
      </Text>
      <Segmented<Filter>
        value={filter}
        onChange={setFilter}
        options={[
          { value: 'offen', label: 'Offene Rechn.' },
          { value: 'angebote', label: 'Angebote' },
          { value: 'alle', label: 'Alle' },
        ]}
      />
      {list.length === 0 ? (
        <Empty title="Nichts offen" text={filter === 'offen' ? 'Alle Rechnungen sind bezahlt.' : 'Noch keine Einträge.'} />
      ) : (
        <Section title={`${list.length} Einträge`}>
          {list.map((f) => (
            <FinanceRow key={f.id} f={f} customerName={name(f.customerId)} />
          ))}
        </Section>
      )}
      <Text style={[type.small, { fontSize: 12 }]}>
        Das ist deine Übersicht, keine Buchhaltung. Rechnungen und Belege musst du zusätzlich nach den Aufbewahrungsfristen ablegen. Kläre das mit
        deinem Steuerberater.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: space.s },
  kpi: { flex: 1, padding: space.m, gap: 2 },
  v: { fontSize: 20, fontWeight: '800' },
});
