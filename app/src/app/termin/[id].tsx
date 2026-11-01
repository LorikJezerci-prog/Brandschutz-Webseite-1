import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ConfirmButton } from '@/components/confirm-button';
import { Button, Card, Field, Section, Screen, Segmented, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { AppointmentType, appointmentTypes } from '@/store/types';
import { formatDate, parseDate, today } from '@/utils/format';
import { routeTo } from '@/utils/maps';
import { remindersSupported } from '@/utils/reminders';

const reminderOptions = [
  { value: '0', label: 'Keine' },
  { value: '60', label: '1 Std.' },
  { value: '1440', label: '1 Tag' },
  { value: '10080', label: '1 Woche' },
];

const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return formatDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
};

export default function Termin() {
  const params = useLocalSearchParams<{ id: string; type?: AppointmentType; customerId?: string; title?: string }>();
  const { appointments, customers, saveAppointment, removeAppointment, setAppointmentDone } = useStore();
  const existing = appointments.find((a) => a.id === params.id);
  const isNew = !existing;

  const [title, setTitle] = useState(existing?.title ?? params.title ?? '');
  const [kind, setKind] = useState<AppointmentType>(existing?.type ?? params.type ?? 'begehung');
  const [date, setDate] = useState(existing ? formatDate(existing.date) : plusDays(1));
  const [time, setTime] = useState(existing?.time ?? '09:00');
  const [customerId, setCustomerId] = useState(existing?.customerId ?? params.customerId ?? '');
  const [location, setLocation] = useState(existing?.location ?? '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [remind, setRemind] = useState(String(existing?.remindBefore ?? 1440));

  const iso = parseDate(date);
  const timeOk = /^([01]?\d|2[0-3]):[0-5]\d$/.test(time.trim());
  const customer = customers.find((c) => c.id === customerId);
  const place = location || customer?.address || '';

  const save = async () => {
    const t = time.trim().padStart(5, '0');
    await saveAppointment({
      id: existing?.id,
      title: title.trim() || appointmentTypes.find((x) => x.value === kind)!.label,
      type: kind,
      date: iso!,
      time: t,
      customerId: customerId || undefined,
      location: location.trim(),
      note: note.trim(),
      remindBefore: Number(remind),
      done: existing?.done,
    });
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: isNew ? 'Neuer Termin' : 'Termin' }} />
      <Section title="Art">
        <Segmented
          value={kind}
          options={appointmentTypes.map((a) => ({ value: a.value, label: a.label }))}
          onChange={setKind}
        />
      </Section>

      <Card style={{ gap: 14 }}>
        <Field label="Titel" value={title} onChangeText={setTitle} placeholder="z. B. Begehung Halle 2" />
        <View style={{ flexDirection: 'row', gap: space.s }}>
          <View style={{ flex: 3 }}>
            <Field label="Datum" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
          </View>
          <View style={{ flex: 2 }}>
            <Field label="Uhrzeit" value={time} onChangeText={setTime} keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        <View style={styles.chips}>
          {[
            ['Heute', formatDate(today())],
            ['Morgen', plusDays(1)],
            ['In 1 Woche', plusDays(7)],
          ].map(([label, value]) => (
            <Pressable key={label} onPress={() => (tap(), setDate(value))} style={[styles.chip, date === value && styles.chipActive]}>
              <Text style={[styles.chipText, date === value && { color: colors.white }]}>{label}</Text>
            </Pressable>
          ))}
        </View>
        {(!iso || !timeOk) && (
          <Text style={[type.small, { color: colors.danger }]}>Datum als TT.MM.JJJJ und Uhrzeit als HH:MM eingeben.</Text>
        )}
      </Card>

      {customers.length > 0 && (
        <Section title="Kunde (optional)">
          <View style={styles.chips}>
            {customers.map((c) => {
              const active = c.id === customerId;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => (tap(), setCustomerId(active ? '' : c.id))}
                  style={[styles.chip, active && styles.chipActive]}>
                  <Text style={[styles.chipText, active && { color: colors.white }]}>{c.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      )}

      <Card style={{ gap: 14 }}>
        <Field
          label="Ort"
          value={location}
          onChangeText={setLocation}
          placeholder={customer?.address || 'Adresse, leer = Adresse des Kunden'}
        />
        {!!place && <Button title="Route in Karten-App" icon="map-outline" kind="secondary" onPress={() => routeTo(place)} />}
        <Field label="Notiz" value={note} onChangeText={setNote} multiline placeholder="Was mitnehmen, wer ist Ansprechpartner …" />
      </Card>

      <Section title="Erinnerung vorher">
        <Segmented value={remind} options={reminderOptions} onChange={setRemind} />
        {!remindersSupported && Number(remind) > 0 && (
          <Text style={type.small}>Die Erinnerung kommt in der Handy-App als Benachrichtigung.</Text>
        )}
      </Section>

      <Button title={isNew ? 'Termin speichern' : 'Änderungen speichern'} disabled={!iso || !timeOk} onPress={save} />
      {existing && (
        <>
          <Button
            title={existing.done ? 'Wieder offen' : 'Als erledigt markieren'}
            kind="secondary"
            onPress={() => {
              setAppointmentDone(existing.id, !existing.done);
              router.back();
            }}
          />
          <ConfirmButton
            title="Termin löschen"
            warning="Der Termin und seine Erinnerung werden entfernt."
            onConfirm={() => {
              removeAppointment(existing.id);
              router.back();
            }}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.brand, borderColor: colors.brand },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.text },
});
