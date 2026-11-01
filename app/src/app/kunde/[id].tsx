import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Linking, Text, View } from 'react-native';

import { CustomerForm } from '@/components/customer-form';
import { Button, Card, Empty, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { useStore } from '@/store';
import { confirm } from '@/utils/confirm';
import { formatDate, progress } from '@/utils/format';

export default function Kunde() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { customers, inspections, updateCustomer, removeCustomer } = useStore();
  const [editing, setEditing] = useState(false);
  const c = customers.find((x) => x.id === id);
  if (!c) return <Empty title="Kunde nicht gefunden" text="Er wurde vielleicht gelöscht." />;
  const mine = inspections.filter((i) => i.customerId === c.id);

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
      <Card>
        <Text style={type.title}>{c.name}</Text>
        {!!c.branche && <Text style={type.small}>{c.branche}</Text>}
        {!!c.address && <Text style={type.body}>{c.address}</Text>}
        {!!c.contact && <Text style={type.body}>👤 {c.contact}</Text>}
        {!!c.phone && (
          <Text style={[type.body, { color: colors.brand }]} onPress={() => Linking.openURL(`tel:${c.phone.replace(/\s/g, '')}`)}>
            📞 {c.phone}
          </Text>
        )}
        {!!c.email && (
          <Text style={[type.body, { color: colors.brand }]} onPress={() => Linking.openURL(`mailto:${c.email}`)}>
            ✉️ {c.email}
          </Text>
        )}
        {!!c.notes && <Text style={[type.small, { marginTop: 6 }]}>{c.notes}</Text>}
      </Card>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Button title="Begehung starten" onPress={() => router.push({ pathname: '/begehung/neu', params: { customerId: c.id } })} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title="Bearbeiten" kind="secondary" onPress={() => setEditing(true)} />
        </View>
      </View>
      <Section title={`Begehungen (${mine.length})`}>
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
            </Card>
          );
        })}
      </Section>
      <Button
        title="Kunden löschen"
        kind="danger"
        onPress={() =>
          confirm('Kunden löschen?', `${c.name} und ${mine.length} Begehung(en) mit Fotos werden entfernt.`, 'Löschen', () => {
            removeCustomer(c.id);
            router.back();
          })
        }
      />
    </Screen>
  );
}
