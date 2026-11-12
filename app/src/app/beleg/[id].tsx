import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Attached, Attachment } from '@/components/attachment';
import { ConfirmButton } from '@/components/confirm-button';
import { fromCatalog, LineItems } from '@/components/line-items';
import { Button, Card, Empty, Field, Screen, Segmented, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { FinanceDoc, FinanceKind, invoiceStatus, LineItem, offerStatus } from '@/store/types';
import { missingFor, shareBeleg, totals } from '@/utils/beleg-pdf';
import { followUpMail } from '@/utils/mail';
import { addDays, formatDate, formatEuro, parseDate, parseEuro, today } from '@/utils/format';

export default function Beleg() {
  const params = useLocalSearchParams<{
    id: string;
    customerId?: string;
    kind?: FinanceKind;
    fromOffer?: string;
    /** Komma-Liste von Preislisten-IDs, z. B. "bso-ab,nach" */
    preset?: string;
    title?: string;
    serviceDate?: string;
  }>();
  const { finance, customers, saveFinance, removeFinance, nextNumber, catalog, company, tax } = useStore();
  const existing = finance.find((f) => f.id === params.id);
  const offer = finance.find((f) => f.id === params.fromOffer);
  const kind: FinanceKind = existing?.kind ?? params.kind ?? 'rechnung';
  const cid = existing?.customerId ?? offer?.customerId ?? params.customerId;
  const customer = customers.find((c) => c.id === cid);
  const isInvoice = kind === 'rechnung';
  const start = existing?.date ?? today();

  const [number, setNumber] = useState(existing?.number ?? nextNumber(kind, Number(start.slice(0, 4))));
  const presetItems = useMemo<LineItem[]>(
    () =>
      (params.preset ?? '')
        .split(',')
        .map((id) => catalog.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => !!c)
        .map((c) => fromCatalog(c)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [items, setItems] = useState<LineItem[]>(
    existing?.items ?? (offer?.items ? offer.items.map((x) => ({ ...x })) : presetItems),
  );
  const [vatRate, setVatRate] = useState<number>(existing?.vatRate ?? offer?.vatRate ?? (tax.smallBusiness ? 0 : 19));
  const [serviceDate, setServiceDate] = useState(existing?.serviceDate ?? params.serviceDate ?? '');
  const [intro, setIntro] = useState(existing?.intro ?? '');
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const [title, setTitle] = useState(existing?.title ?? offer?.title ?? params.title ?? '');
  const [date, setDate] = useState(formatDate(start));
  const [amount, setAmount] = useState(
    existing ? String(existing.amount).replace('.', ',') : offer ? String(offer.amount).replace('.', ',') : '',
  );
  const [status, setStatus] = useState<FinanceDoc['status']>(existing?.status ?? 'offen');
  const [due, setDue] = useState(formatDate(existing?.dueDate ?? addDays(start, isInvoice ? company.paymentDays : company.offerDays)));
  const [paidAt, setPaidAt] = useState(existing?.paidAt ? formatDate(existing.paidAt) : '');
  const [note, setNote] = useState(existing?.note ?? '');
  const [file, setFile] = useState<Attached>({ fileRef: existing?.fileRef, fileName: existing?.fileName, mime: existing?.mime });

  if (!customer) return <Empty title="Kunde fehlt" text="Lege Angebote und Rechnungen immer bei einem Kunden an." />;

  const isoDate = parseDate(date);
  const isoDue = parseDate(due);
  const useItems = items.length > 0;
  const t = totals(items, vatRate);
  const sum = useItems ? t.gross : parseEuro(amount);
  const duplicate = finance.some((f) => f.kind === kind && f.number === number.trim() && f.id !== savedId);
  const canSave = !!isoDate && !!isoDue && sum !== null && !!number.trim() && !!title.trim() && !duplicate;
  const word = isInvoice ? 'Rechnung' : 'Angebot';

  const draft = (): Omit<FinanceDoc, 'id'> & { id?: string } => ({
      id: savedId,
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
      items: useItems ? items : undefined,
      vatRate: useItems ? vatRate : undefined,
      serviceDate: serviceDate.trim() || undefined,
      intro: intro.trim() || undefined,
      ...file,
  });
  const missing = missingFor({ kind, serviceDate: serviceDate.trim(), items }, company, tax, customer);

  const save = () => {
    const saved = saveFinance(draft());
    setSavedId(saved.id);
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
      </Card>

      <LineItems items={items} catalog={catalog} onChange={setItems} />

      {useItems ? (
        <Card>
          <Text style={type.label}>UMSATZSTEUER</Text>
          <Segmented
            value={String(vatRate)}
            options={[
              { value: '0', label: tax.smallBusiness ? 'Keine (§ 19)' : '0 %' },
              { value: '19', label: '19 %' },
            ]}
            onChange={(v) => setVatRate(Number(v))}
          />
          {tax.smallBusiness && vatRate > 0 && (
            <Text style={[type.small, { color: colors.warn }]}>
              Unter Finanzamt ist „Kleinunternehmer“ eingestellt. Dann keine Umsatzsteuer ausweisen, sonst schuldest du sie trotzdem.
            </Text>
          )}
          {!tax.smallBusiness && vatRate === 0 && (
            <Text style={[type.small, { color: colors.warn }]}>Du bist nicht als Kleinunternehmer eingestellt. Normal sind 19 %.</Text>
          )}
          <View style={styles.sumRow}><Text style={type.small}>Netto</Text><Text style={type.small}>{formatEuro(t.net)}</Text></View>
          {vatRate > 0 && <View style={styles.sumRow}><Text style={type.small}>USt {vatRate} %</Text><Text style={type.small}>{formatEuro(t.vat)}</Text></View>}
          <View style={styles.sumRow}><Text style={[type.body, { fontWeight: '700' }]}>Endbetrag</Text><Text style={[type.body, { fontWeight: '700' }]}>{formatEuro(t.gross)}</Text></View>
        </Card>
      ) : (
      <Card>
        <Text style={type.small}>Ohne Positionen: nur den Endbetrag erfassen (z. B. für ein Angebot, das du anders erstellt hast).</Text>
        <Field
          label={isInvoice ? 'Rechnungsbetrag in € (Endbetrag)' : 'Angebotssumme in € (Endbetrag)'}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="z. B. 375,00"
        />
        {amount !== '' && sum === null && <Text style={[type.small, { color: colors.danger }]}>Bitte einen Betrag wie 375,00 eingeben.</Text>}
      </Card>
      )}

      <Card>
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
        {isInvoice && (
          <Field
            label="Leistungsdatum (Pflicht auf der Rechnung)"
            value={serviceDate}
            onChangeText={setServiceDate}
            placeholder="z. B. 12.11.2026 oder November 2026"
          />
        )}
        {useItems && (
          <Field
            label="Einleitungssatz im PDF (optional)"
            value={intro}
            onChangeText={setIntro}
            multiline
            placeholder={isInvoice ? 'vielen Dank für Ihren Auftrag. Für die erbrachten Leistungen berechne ich Ihnen:' : 'vielen Dank für Ihr Interesse. Gern biete ich Ihnen folgende Leistungen an:'}
          />
        )}
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

      {!useItems && <Attachment value={file} onChange={setFile} label={`${word} als PDF`} />}
      <Field label="Notiz" value={note} onChangeText={setNote} multiline placeholder="z. B. Positionen 1 und 3 beauftragt, Skonto vereinbart" />

      {!useItems && sum !== null && <Text style={[type.body, { textAlign: 'center', fontWeight: '700' }]}>{formatEuro(sum)}</Text>}
      {useItems && missing.length > 0 && (
        <Card style={{ backgroundColor: colors.warnSoft, borderColor: colors.warnSoft }}>
          <Text style={[type.body, { color: colors.warn, fontWeight: '600' }]}>Für das PDF fehlt noch:</Text>
          {missing.map((m) => (
            <Text key={m} style={type.small}>• {m}</Text>
          ))}
          {isInvoice && <Text style={type.small}>Ohne diese Angaben ist die Rechnung nicht ordnungsgemäß (§ 14 UStG), der Kunde darf sie zurückweisen.</Text>}
        </Card>
      )}
      {useItems &&
        (busy ? (
          <ActivityIndicator color={colors.brand} size="large" />
        ) : (
          <Button
            title={`${word} als PDF erstellen und teilen`}
            icon="document-text-outline"
            disabled={!canSave}
            onPress={async () => {
              setBusy(true);
              try {
                const saved = save();
                await shareBeleg(saved, customer, company, tax);
              } catch (e) {
                Alert.alert('PDF konnte nicht erstellt werden', String(e));
              } finally {
                setBusy(false);
              }
            }}
          />
        ))}
      {useItems && Platform.OS === 'web' && (
        <Text style={type.small}>Es wird zuerst gespeichert. Im Druckdialog oben auf Teilen tippen: als PDF sichern, per Mail oder WhatsApp senden.</Text>
      )}
      <Button
        title="Speichern"
        kind={useItems ? 'secondary' : 'primary'}
        disabled={!canSave}
        onPress={() => {
          save();
          router.back();
        }}
      />
      {existing && existing.status === 'offen' && (isInvoice ? !!existing.dueDate && existing.dueDate < today() : true) && (
        <Card>
          <Text style={type.small}>
            {isInvoice
              ? 'Die Rechnung ist überfällig. Eine freundliche Erinnerung bringt in den meisten Fällen das Geld.'
              : 'Angebote ohne Nachfassen gehen meist verloren. Kurze Mail schreiben, am besten nach 7 Tagen.'}
          </Text>
          <Button
            title={isInvoice ? 'Zahlungserinnerung per Mail' : 'Nachfassen per Mail'}
            icon="mail-outline"
            kind="secondary"
            disabled={!customer.email}
            onPress={() => Linking.openURL(followUpMail(existing, customer, company))}
          />
          {!customer.email && <Text style={[type.small, { color: colors.warn }]}>Beim Kunden ist keine E-Mail hinterlegt.</Text>}
        </Card>
      )}
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
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
