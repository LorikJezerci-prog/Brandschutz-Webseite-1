import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

import { ConfirmButton } from '@/components/confirm-button';
import { CustomerForm } from '@/components/customer-form';
import { financeTotals, FinanceRow } from '@/components/finance-row';
import { Icon, IconName } from '@/components/icon';
import { Button, Card, Empty, Screen, Section, Segmented } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { docCategories } from '@/store/types';
import { formatDate, formatEuro, formatSize, progress } from '@/utils/format';
import { openInMaps, routeTo } from '@/utils/maps';

type Tab = 'uebersicht' | 'akte' | 'finanzen';

function InfoRow({ icon, text, link, onPress }: { icon: IconName; text: string; link?: boolean; onPress?: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Icon name={icon} size={18} color={colors.muted} />
      <Text style={[type.body, link && { color: colors.brand }]} onPress={onPress}>
        {text}
      </Text>
    </View>
  );
}

function Kpi({ value, label, color = colors.text, onPress }: { value: string; label: string; color?: string; onPress?: () => void }) {
  return (
    <Card style={styles.kpi} onPress={onPress}>
      <Text style={[styles.kpiValue, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[type.small, { fontSize: 12 }]}>{label}</Text>
    </Card>
  );
}

export default function Kunde() {
  const { id, tab: tabParam } = useLocalSearchParams<{ id: string; tab?: Tab }>();
  const { customers, inspections, docs, finance, appointments, updateCustomer, removeCustomer } = useStore();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<Tab>(tabParam ?? 'uebersicht');
  const c = customers.find((x) => x.id === id);
  if (!c) return <Empty title="Kunde nicht gefunden" text="Er wurde vielleicht gelöscht." />;
  const mine = inspections.filter((i) => i.customerId === c.id);
  const myDocs = docs.filter((d) => d.customerId === c.id).sort((a, b) => b.date.localeCompare(a.date));
  const myFin = finance.filter((f) => f.customerId === c.id).sort((a, b) => b.date.localeCompare(a.date));
  const myAppts = appointments.filter((a) => a.customerId === c.id && !a.done).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const t = financeTotals(myFin);

  if (editing) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Bearbeiten' }} />
        <CustomerForm
          initial={c}
          submitLabel="Änderungen speichern"
          onSubmit={(patch) => {
            updateCustomer(c.id, patch);
            setEditing(false);
          }}
        />
        <Button title="Abbrechen" kind="secondary" onPress={() => setEditing(false)} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: c.name }} />
      <Segmented<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: 'uebersicht', label: 'Übersicht' },
          { value: 'akte', label: `Akte (${myDocs.length + mine.length})` },
          { value: 'finanzen', label: `Finanzen (${myFin.length})` },
        ]}
      />

      {tab === 'uebersicht' && (
        <>
          <Card>
            <Text style={type.title}>{c.name}</Text>
            {!!c.branche && <Text style={type.small}>{c.branche}</Text>}
            {!!c.address && <Text style={type.body}>{c.address}</Text>}
            {!!c.contact && <InfoRow icon="person-outline" text={c.contact} />}
            {!!c.phone && (
              <InfoRow icon="call-outline" text={c.phone} link onPress={() => Linking.openURL(`tel:${c.phone.replace(/\s/g, '')}`)} />
            )}
            {!!c.email && <InfoRow icon="mail-outline" text={c.email} link onPress={() => Linking.openURL(`mailto:${c.email}`)} />}
            {!!c.notes && <Text style={[type.small, { marginTop: 6 }]}>{c.notes}</Text>}
          </Card>

          <View style={styles.kpis}>
            <Kpi value={String(mine.length)} label="Begehungen" onPress={() => setTab('akte')} />
            <Kpi value={String(myDocs.length)} label="Unterlagen" onPress={() => setTab('akte')} />
            <Kpi
              value={t.openCount ? formatEuro(t.openSum) : '0 €'}
              label={t.overdueCount ? `offen, ${t.overdueCount} überfällig` : 'offen'}
              color={t.overdueCount ? colors.danger : t.openCount ? colors.warn : colors.text}
              onPress={() => setTab('finanzen')}
            />
          </View>

          {myAppts[0] && (
            <Card onPress={() => router.push(`/termin/${myAppts[0].id}`)}>
              <Text style={type.label}>NÄCHSTER TERMIN</Text>
              <Text style={[type.body, { fontWeight: '600' }]}>
                {formatDate(myAppts[0].date)}, {myAppts[0].time} Uhr · {myAppts[0].title}
              </Text>
            </Card>
          )}

          {!!c.address && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <Button title="Karte" icon="map-outline" kind="secondary" onPress={() => openInMaps(c.address)} />
              </View>
              <View style={{ flex: 1 }}>
                <Button title="Route" icon="navigate-outline" kind="secondary" onPress={() => routeTo(c.address)} />
              </View>
            </View>
          )}
          <Button
            title="Termin anlegen"
            icon="calendar-outline"
            kind="secondary"
            onPress={() => router.push({ pathname: '/termin/[id]', params: { id: 'neu', customerId: c.id, title: `Begehung ${c.name}` } })}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Button title="Begehung starten" onPress={() => router.push({ pathname: '/begehung/neu', params: { customerId: c.id } })} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="Bearbeiten" kind="secondary" onPress={() => setEditing(true)} />
            </View>
          </View>
          <ConfirmButton
            title="Kunden löschen"
            warning={`${c.name} mit ${mine.length} Begehung(en), ${myDocs.length} Unterlage(n) und ${myFin.length} Angebot(en)/Rechnung(en) wird entfernt.`}
            onConfirm={() => {
              removeCustomer(c.id);
              router.back();
            }}
          />
        </>
      )}

      {tab === 'akte' && (
        <>
          <Button
            title="Unterlage hinzufügen"
            icon="add-circle-outline"
            onPress={() => router.push({ pathname: '/unterlage/[id]', params: { id: 'neu', customerId: c.id } })}
          />
          {myDocs.length === 0 && mine.length === 0 && (
            <Card>
              <Text style={type.small}>
                Hier liegt alles zu diesem Kunden: Brandschutzordnung, Pläne, Prüfnachweise, Verträge und deine Begehungsberichte.
              </Text>
            </Card>
          )}
          {docCategories.map((cat) => {
            const list = myDocs.filter((d) => d.category === cat.value);
            if (!list.length) return null;
            return (
              <Section key={cat.value} title={`${cat.label} (${list.length})`}>
                {list.map((d) => (
                  <Card key={d.id} onPress={() => router.push(`/unterlage/${d.id}`)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Icon name={d.fileRef ? cat.icon : 'document-outline'} size={20} />
                      <Text style={[type.body, { fontWeight: '600', flex: 1 }]} numberOfLines={2}>
                        {d.title}
                      </Text>
                    </View>
                    <Text style={[type.small, { fontSize: 12 }]}>
                      {formatDate(d.date)}
                      {d.fileRef ? ` · ${d.fileName ?? 'Datei'}${d.size ? ' · ' + formatSize(d.size) : ''}` : ' · keine Datei'}
                    </Text>
                    {!!d.note && (
                      <Text style={type.small} numberOfLines={2}>
                        {d.note}
                      </Text>
                    )}
                  </Card>
                ))}
              </Section>
            );
          })}
          <Section title={`Begehungen aus der App (${mine.length})`}>
            {mine.length === 0 && <Text style={type.small}>Noch keine Begehung bei diesem Kunden.</Text>}
            {mine.map((i) => {
              const p = progress(i);
              return (
                <Card key={i.id} onPress={() => router.push(`/begehung/${i.id}`)}>
                  <Text style={[type.body, { fontWeight: '600' }]}>
                    {formatDate(i.date)} · {i.object || 'Gesamtes Objekt'}
                  </Text>
                  <Text style={type.small}>
                    {i.closedAt ? 'Abgeschlossen' : 'Laufend'} · {p.defects} Mängel
                  </Text>
                  <Text style={[type.small, { color: colors.brand, fontWeight: '600' }]} onPress={() => router.push(`/begehung/${i.id}/vorschau`)}>
                    Bericht ansehen
                  </Text>
                </Card>
              );
            })}
          </Section>
        </>
      )}

      {tab === 'finanzen' && (
        <>
          <View style={styles.kpis}>
            <Kpi value={formatEuro(t.openSum)} label={`${t.openCount} Rechnung(en) offen`} color={t.overdueCount ? colors.danger : colors.text} />
            <Kpi value={formatEuro(t.paidSum)} label="bezahlt" color={colors.brandDark} />
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1 }}>
              <Button
                title="Angebot"
                icon="add-outline"
                kind="secondary"
                onPress={() => router.push({ pathname: '/beleg/[id]', params: { id: 'neu', kind: 'angebot', customerId: c.id } })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Button
                title="Rechnung"
                icon="add-outline"
                onPress={() => router.push({ pathname: '/beleg/[id]', params: { id: 'neu', kind: 'rechnung', customerId: c.id } })}
              />
            </View>
          </View>
          {myFin.length === 0 && (
            <Card>
              <Text style={type.small}>
                Trag hier jedes Angebot und jede Rechnung ein, mit Nummer, Betrag und Status. Das PDF kannst du anhängen. So siehst du
                immer, was offen ist.
              </Text>
            </Card>
          )}
          {(['angebot', 'rechnung'] as const).map((k) => {
            const list = myFin.filter((f) => f.kind === k);
            if (!list.length) return null;
            return (
              <Section key={k} title={`${k === 'angebot' ? 'Angebote' : 'Rechnungen'} (${list.length})`}>
                {list.map((f) => (
                  <FinanceRow key={f.id} f={f} />
                ))}
              </Section>
            );
          })}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: space.s },
  kpi: { flex: 1, padding: space.m, gap: 2 },
  kpiValue: { fontSize: 20, fontWeight: '800' },
});
