import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, View } from 'react-native';

import { Button, Card, Empty, Field, Pill, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { checklist } from '@/data/checklist';
import { useStore } from '@/store';
import { priorityLabel } from '@/store/types';
import { itemsOf, progress } from '@/utils/format';
import { shareReport } from '@/utils/report';

export default function Bericht() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inspections, customers, updateInspection } = useStore();
  const [busy, setBusy] = useState(false);
  const i = inspections.find((x) => x.id === id);
  if (!i) return <Empty title="Nicht gefunden" text="Diese Begehung existiert nicht." />;
  const c = customers.find((x) => x.id === i.customerId);
  const p = progress(i);
  const defects = itemsOf(i).filter((x) => i.results[x.id]?.status === 'mangel');
  const unchecked = p.total - p.done;

  const create = async () => {
    setBusy(true);
    try {
      await shareReport(i, c);
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
            </Card>
          );
        })}
      </Section>

      <Button title="Bericht ansehen" icon="👁" kind="secondary" onPress={() => router.push(`/begehung/${i.id}/vorschau`)} />
      {Platform.OS === 'web' ? (
        <Text style={type.small}>
          Das PDF zum Teilen erstellt die App auf dem Handy. Im Browser kannst du den Bericht nur ansehen.
        </Text>
      ) : busy ? (
        <ActivityIndicator color={colors.brand} size="large" />
      ) : (
        <Button title="PDF erstellen und teilen" icon="📄" onPress={create} />
      )}
      <Text style={type.small}>
        Das PDF enthält Kopf mit Logo, Kundendaten, Mängel nach Dringlichkeit mit Fotos, die Übersicht aller Prüfpunkte und ein
        Unterschriftsfeld. Teilen geht per Mail, WhatsApp oder in Dateien.
      </Text>
    </Screen>
  );
}
