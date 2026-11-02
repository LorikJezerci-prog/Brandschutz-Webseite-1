import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Field, Screen, Section, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, parseDate, today } from '@/utils/format';

export default function NeueBegehung() {
  const params = useLocalSearchParams<{ customerId?: string }>();
  const { customers, addInspection } = useStore();
  const [customerId, setCustomerId] = useState(params.customerId ?? customers[0]?.id ?? '');
  const [object, setObject] = useState('');
  const [date, setDate] = useState(formatDate(today()));
  const [participants, setParticipants] = useState('');

  // Neu angelegten Kunden direkt auswählen
  const count = useRef(customers.length);
  useEffect(() => {
    if (customers.length > count.current && customers[0]) setCustomerId(customers[0].id);
    count.current = customers.length;
  }, [customers]);

  const iso = parseDate(date);
  const canStart = !!customerId && !!iso;

  return (
    <Screen>
      <Section
        title="Kunde"
        right={
          <Text style={styles.link} onPress={() => router.push('/kunde/neu')}>
            + Neuer Kunde
          </Text>
        }>
        {customers.length === 0 ? (
          <Card>
            <Text style={type.body}>Lege zuerst den Kunden an. Das dauert eine halbe Minute.</Text>
            <Button title="Kunden anlegen" onPress={() => router.push('/kunde/neu')} />
          </Card>
        ) : (
          <View style={styles.chips}>
            {customers.map((c) => {
              const active = c.id === customerId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => {
                    tap();
                    setCustomerId(c.id);
                  }}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && { color: colors.white }]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Section>

      <Card style={{ gap: 14 }}>
        <Field label="Objekt / Bereich" value={object} onChangeText={setObject} placeholder="z. B. Halle 2 und Büro, EG" />
        <Field
          label="Datum (TT.MM.JJJJ)"
          value={date}
          onChangeText={setDate}
          keyboardType="numbers-and-punctuation"
        />
        {!iso && <Text style={[type.small, { color: colors.danger }]}>Bitte Datum als TT.MM.JJJJ eingeben.</Text>}
        <Field
          label="Teilnehmer"
          value={participants}
          onChangeText={setParticipants}
          placeholder="z. B. Hr. Müller (Betriebsleitung)"
        />
      </Card>

      <Button
        title="Begehung starten"
        disabled={!canStart}
        onPress={() => {
          const i = addInspection({ customerId, object: object.trim(), date: iso!, participants: participants.trim() });
          router.replace(`/begehung/${i.id}`);
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.brand, fontWeight: '600', fontSize: 14 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 15, fontWeight: '600', color: colors.text },
});
