import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, View } from 'react-native';

import { Button, Card, Empty, Field, Pill, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { suggestFor } from '@/data/catalog';
import { checklist } from '@/data/checklist';
import { useStore } from '@/store';
import { priorityLabel } from '@/store/types';
import { addDays, formatDate, isoWeek, itemsOf, progress } from '@/utils/format';
import { shareReport } from '@/utils/report';

export default function Bericht() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inspections, customers, updateInspection, company } = useStore();
  const [busy, setBusy] = useState(false);
  const i = inspections.find((x) => x.id === id);
  if (!i) return <Empty title="Nicht gefunden" text="Diese Begehung existiert nicht." />;
  const c = customers.find((x) => x.id === i.customerId);
  const p = progress(i);
  const defects = itemsOf(i).filter((x) => i.results[x.id]?.status === 'mangel');
  const unchecked = p.total - p.done;
  const suggested = [...new Set(defects.map((x) => suggestFor[x.id]).filter(Boolean))];
  if (defects.some((x) => i.results[x.id]?.priority === 'sofort')) suggested.push('nach');
  const sofort = defects.filter((x) => i.results[x.id]?.priority === 'sofort');
  const planVisit = (days: number, title: string, note: string) =>
    router.push({ pathname: '/termin/[id]', params: { id: 'neu', type: 'begehung', customerId: i.customerId, title, date: addDays(i.date, days), note } });
  const offerFor = (preset: string[], title: string) =>
    router.push({ pathname: '/beleg/[id]', params: { id: 'neu', kind: 'angebot', customerId: i.customerId, preset: preset.join(','), title } });

  const create = async () => {
    setBusy(true);
    try {
      await shareReport(i, c, company);
    } catch (e) {
      Alert.alert('Bericht konnte nicht erstellt werden', String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      {unchecked > 0 && (
        <Card style={{ backgroundColor: colors.warnSoft, borderColor: colors.warnSoft }}>
          <Text style={[type.body, { color: colors.warn, fontWeight: '600' }]}>
            {unchecked} Punkte sind noch nicht geprüft.
          </Text>
          <Text style={type.small}>Sie erscheinen im Bericht als „nicht geprüft“. Setze sie auf „Entfällt“, wenn sie nicht zutreffen.</Text>
        </Card>
      )}

      <Field
        label="Zusammenfassung für die Leitung"
        value={i.summary}
        onChangeText={(summary) => updateInspection(i.id, { summary })}
        multiline
        placeholder="Gesamteindruck in zwei, drei Sätzen und die wichtigste Maßnahme."
      />

      <Section title={`Mängel (${defects.length})`}>
        {defects.length === 0 && <Text style={type.small}>Keine Mängel erfasst.</Text>}
        {defects.map((x) => {
          const f = i.results[x.id];
          const cat = checklist.find((k) => k.id === x.categoryId);
          const prio = f.priority ?? 'mittelfristig';
          const colorsFor = {
            sofort: [colors.danger, colors.dangerSoft],
            kurzfristig: [colors.warn, colors.warnSoft],
            mittelfristig: [colors.brandDark, colors.brandSoft],
          }[prio];
          return (
            <Card key={x.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={[type.body, { fontWeight: '600', flex: 1 }]}>{x.title}</Text>
                <Pill text={priorityLabel[prio]} color={colorsFor[0]} bg={colorsFor[1]} />
              </View>
              <Text style={type.small}>
                {cat?.title} · {f.photos.length} Foto(s)
              </Text>
              {f.note ? <Text style={type.body}>{f.note}</Text> : <Text style={[type.small, { color: colors.warn }]}>Noch keine Beschreibung</Text>}
              {f.measure ? (
                <Text style={type.body}>
                  <Text style={{ fontWeight: '700', color: colors.brand }}>Maßnahme: </Text>
                  {f.measure}
                </Text>
              ) : (
                <Text style={[type.small, { color: colors.warn }]}>Noch keine Maßnahme für den Kunden</Text>
              )}
            </Card>
          );
        })}
      </Section>

      <Button title="Bericht ansehen" icon="eye-outline" kind="secondary" onPress={() => router.push(`/begehung/${i.id}/vorschau`)} />
      {busy ? (
        <ActivityIndicator color={colors.brand} size="large" />
      ) : (
        <Button title="PDF erstellen und teilen" icon="document-text-outline" onPress={create} />
      )}
      {Platform.OS === 'web' && (
        <Text style={type.small}>
          Auf dem iPhone öffnet sich der Druckdialog. Tippe dort oben auf das Teilen-Symbol: Dann kannst du das PDF in Dateien
          sichern, per Mail oder WhatsApp schicken.
        </Text>
      )}
      {c && (
        <Section title="Wiedervorlage">
          <Card>
            <Text style={type.small}>Trag den nächsten Termin gleich jetzt ein. Was nicht im Kalender steht, passiert nicht.</Text>
            {sofort.length > 0 && (
              <Button
                title={`Nachbegehung in 2 Wochen (KW ${isoWeek(addDays(i.date, 14))})`}
                icon="calendar-outline"
                onPress={() =>
                  planVisit(14, `Nachbegehung ${c.name}`, `Sofort-Mängel kontrollieren:\n${sofort.map((x) => `• ${x.title}`).join('\n')}`)
                }
              />
            )}
            <Button
              title={`Nächste Jahresbegehung (KW ${isoWeek(addDays(i.date, 357))})`}
              icon="repeat-outline"
              kind="secondary"
              onPress={() => planVisit(357, `Jahresbegehung ${c.name}`, `Letzte Begehung ${formatDate(i.date)} mit ${defects.length} Mängeln.`)}
            />
          </Card>
        </Section>
      )}
      {c && (
        <Section title="Geld aus dieser Begehung">
          <Card>
            <Text style={type.small}>
              {suggested.length
                ? `Aus den Mängeln passen ${suggested.length} Leistung(en) aus deiner Preisliste. Das Angebot ist vorausgefüllt, du prüfst nur noch.`
                : 'Keine Mängel, die zu einer Leistung aus deiner Preisliste passen. Biete trotzdem den Jahresvertrag an.'}
            </Text>
            {suggested.length > 0 && (
              <Button title="Angebot aus den Mängeln" icon="pricetag-outline" onPress={() => offerFor(suggested, `Maßnahmen aus der Begehung vom ${formatDate(i.date)}`)} />
            )}
            <Button
              title="Angebot Jahresvertrag"
              icon="repeat-outline"
              kind="secondary"
              onPress={() => offerFor(['bsb-s'], 'Externer Brandschutzbeauftragter')}
            />
            <Button
              title="Rechnung für diese Begehung"
              icon="receipt-outline"
              kind="secondary"
              onPress={() =>
                router.push({
                  pathname: '/beleg/[id]',
                  params: { id: 'neu', kind: 'rechnung', customerId: i.customerId, preset: 'beg', title: `Brandschutzbegehung ${i.object || ''}`.trim(), serviceDate: formatDate(i.date) },
                })
              }
            />
            <Text style={type.small}>
              Tipp: Ein Jahresvertrag bringt planbares Geld und spart dir jedes Mal ein neues Angebot. Größe (klein, mittel, groß) wählst du im Angebot über die Preisliste.
            </Text>
          </Card>
        </Section>
      )}
      <Text style={type.small}>
        Das PDF enthält Kopf mit Logo, Kundendaten, Mängel nach Dringlichkeit mit Fotos, die Übersicht aller Prüfpunkte und ein
        Unterschriftsfeld. Teilen geht per Mail, WhatsApp oder in Dateien.
      </Text>
    </Screen>
  );
}
