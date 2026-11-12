import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Attached, Attachment } from '@/components/attachment';
import { ConfirmButton } from '@/components/confirm-button';
import { Button, Card, Empty, Field, Screen, Segmented, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { FinanceDoc, FinanceKind, invoiceStatus, offerStatus } from '@/store/types';
import { addDays, formatDate, formatEuro, parseDate, parseEuro, today } from '@/utils/format';

export default function Beleg() {
  const params = useLocalSearchParams<{ id: string; customerId?: string; kind?: FinanceKind; fromOffer?: string }>();
  const { finance, customers, saveFinance, removeFinance, nextNumber } = useStore();
  const existing = finance.find((f) => f.id === params.id);
  const offer = finance.find((f) => f.id === params.fromOffer);
  const kind: FinanceKind = existing?.kind ?? params.kind ?? 'rechnung';
  const cid = existing?.customerId ?? offer?.customerId ?? params.customerId;
  const customer = customers.find((c) => c.id === cid);
  const isInvoice = kind === 'rechnung';
  const start = existing?.date ?? today();

  const [number, setNumber] = useState(existing?.number ?? nextNumber(kind, Number(start.slice(0, 4))));
  const [title, setTitle] = useState(existing?.title ?? offer?.title ?? '');
  const [date, setDate] = useState(formatDate(start));
  const [amount, setAmount] = useState(
    existing ? String(existing.amount).replace('.', ',') : offer ? String(offer.amount).replace('.', ',') : '',
  );
  const [status, setStatus] = useState<FinanceDoc['status']>(existing?.status ?? 'offen');
  const [due, setDue] = useState(formatDate(existing?.dueDate ?? addDays(start, isInvoice ? 14 : 30)));
  const [paidAt, setPaidAt] = useState(existing?.paidAt ? formatDate(existing.paidAt) : '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [file, setFile] = useState<Attached>({ fileRef: existing?.fileRef, fileName: existing?.fileName, mime: existing?.mime });

  if (!customer) return <Empty title="Kunde fehlt" text="Lege Angebote und Rechnungen immer bei einem Kunden an." />;

  const isoDate = parseDate(date);
  const isoDue = parseDate(due);
  const sum = parseEuro(amount);
  const duplicate = finance.some((f) => f.kind === kind && f.number === number.trim() && f.id !== existing?.id);
  const canSave = !!isoDate && !!isoDue && sum !== null && !!number.trim() && !!title.trim() && !duplicate;
  const word = isInvoice ? 'Rechnung' : 'Angebot';

  const save = () => {
    const saved = saveFinance({
      id: existing?.id,
      customerId: customer.id,
      kind,
      number: number.trim(),
      title: title.trim(),
      date: isoDate!,
      amount: sum!,
      status,
      dueDate: isoDue!,
      paidAt: status === 'bezahlt' ? (parseDate(paidAt) ?? today()) : undefined,
      offerId: existing?.offerId ?? offer?.id,
      note: note.trim(),
      ...file,
    });
    // Angebot wird automatisch "angenommen", wenn daraus eine Rechnung entsteht
    if (offer && offer.status === 'offen') saveFinance({ ...offer, status: 'angenommen' });
    return saved;
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: existing ? `${word} ${existing.number}` : `Neue ${isInvoice ? 'Rechnung' : 'Angebot'}`.replace('Neue Angebot', 'Neues Angebot') }} />
      <Text style={type.small}>
        Für {customer.name}
        {offer ? ` · aus Angebot ${offer.number}` : ''}
      </Text>

      <Card>
        <Field label={`${word}snummer`} value={number} onChangeText={setNumber} autoCapitalize="characters" />
        {duplicate && <Text style={[type.small, { color: colors.danger }]}>Diese Nummer gibt es schon. Rechnungsnummern müssen eindeutig sein.</Text>}
        <Field label="Leistung / Betreff" value={title} onChangeText={setTitle} placeholder="z. B. Brandschutzbegehung mit Mängelbericht" />
        <Field
          label={isInvoice ? 'Rechnungsbetrag in € (Endbetrag)' : 'Angebotssumme in € (Endbetrag)'}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="z. B. 375,00"
        />
        {amount !== '' && sum === null && <Text style={[type.small, { color: colors.danger }]}>Bitte einen Betrag wie 375,00 eingeben.</Text>}
        <View style={{ flexDirection: 'row', gap: space.s }}>
          <View style={{ flex: 1 }}>
            <Field label="Datum" value={date} onChangeText={setDate} keyboardType="numbers-and-punctuation" />
          </View>
          <View style={{ flex: 1 }}>
            <Field label={isInvoice ? 'Fällig am' : 'Gültig bis'} value={due} onChangeText={setDue} keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        {isoDate && (
          <View style={{ flexDirection: 'row', gap: space.s, flexWrap: 'wrap' }}>
            {(isInvoice ? [7, 14, 30] : [14, 30, 60]).map((d) => (
              <Pressable
                key={d}
                onPress={() => {
                  tap();
                  setDue(formatDate(addDays(isoDate, d)));
                }}
                style={styles.chip}>
                <Text style={styles.chipText}>+{d} Tage</Text>
              </Pressable>
            ))}
          </View>
        )}
        {(!isoDate || !isoDue) && <Text style={[type.small, { color: colors.danger }]}>Bitte Datum wie 12.11.2026 eingeben.</Text>}
      </Card>

      <Card>
        <Text style={type.label}>STATUS</Text>
        <Segmented
          value={status}
          options={(isInvoice ? invoiceStatus : offerStatus).map((o) => ({
            ...o,
            ...(o.value === 'bezahlt' || o.value === 'angenommen'
              ? {}
              : o.value === 'offen'
                ? { color: colors.warn, bg: colors.warnSoft }
                : { color: colors.muted, bg: colors.line }),
          }))}
          onChange={(v) => {
            setStatus(v);
            if (v === 'bezahlt' && !paidAt) setPaidAt(formatDate(today()));
          }}
        />
        {status === 'bezahlt' && <Field label="Bezahlt am" value={paidAt} onChangeText={setPaidAt} keyboardType="numbers-and-punctuation" />}
      </Card>

      <Attachment value={file} onChange={setFile} label={`${word} als PDF`} />
      <Field label="Notiz" value={note} onChangeText={setNote} multiline placeholder="z. B. Positionen 1 und 3 beauftragt, Skonto vereinbart" />

      {sum !== null && <Text style={[type.body, { textAlign: 'center', fontWeight: '700' }]}>{formatEuro(sum)}</Text>}
      <Button
        title="Speichern"
        disabled={!canSave}
        onPress={() => {
          save();
          router.back();
        }}
      />
      {existing && !isInvoice && existing.status !== 'abgelehnt' && (
        <Button
          title="Rechnung aus diesem Angebot"
          icon="receipt-outline"
          kind="secondary"
          disabled={!canSave}
          onPress={() => {
            const saved = save();
            router.replace({ pathname: '/beleg/[id]', params: { id: 'neu', kind: 'rechnung', fromOffer: saved.id } });
          }}
        />
      )}
      {existing && (
        <ConfirmButton
          title={`${word} löschen`}
          warning={isInvoice ? 'Rechnungen besser stornieren statt löschen, damit die Nummernfolge lückenlos bleibt.' : 'Das Angebot wird entfernt.'}
          onConfirm={() => {
            removeFinance(existing.id);
            router.back();
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: space.m, paddingVertical: 6, borderRadius: radius.pill, backgroundColor: colors.brandSoft },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.brandDark },
});
