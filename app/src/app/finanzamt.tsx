import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Button, Card, Field, Screen, Section, tap } from '@/components/ui';
import { colors, radius, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, today } from '@/utils/format';

const presets = [
  'Fragebogen steuerliche Erfassung (ELSTER)',
  'Umsatzsteuer-Voranmeldung',
  'Einkommensteuer-Vorauszahlung',
  'Belege an Steuerberater',
  'Einkommensteuererklärung',
];

export default function Finanzamt() {
  const { tax, updateTax, appointments } = useStore();
  const deadlines = appointments
    .filter((a) => a.type === 'finanzamt' && !a.done)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  const t = today();

  return (
    <Screen>
      <Section title="Steuerdaten">
        <Card style={{ gap: 14 }}>
          <Field
            label="Zuständiges Finanzamt"
            value={tax.office}
            onChangeText={(office) => updateTax({ office })}
            placeholder="steht im Schreiben mit der Steuernummer"
          />
          <Field label="Steuernummer" value={tax.taxNumber} onChangeText={(taxNumber) => updateTax({ taxNumber })} placeholder="kommt nach der Anmeldung" />
          <Field label="USt-IdNr. (falls vorhanden)" value={tax.vatId} onChangeText={(vatId) => updateTax({ vatId })} autoCapitalize="characters" />
          <Field label="Steuerberater" value={tax.advisor} onChangeText={(advisor) => updateTax({ advisor })} placeholder="Name, Telefon" />
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={type.body}>Kleinunternehmer (§ 19 UStG)</Text>
              <Text style={type.small}>
                {tax.smallBusiness ? 'Rechnungen ohne Umsatzsteuer, mit Hinweis auf § 19 UStG.' : 'Rechnungen mit 19 % Umsatzsteuer.'}
              </Text>
            </View>
            <Switch
              value={tax.smallBusiness}
              onValueChange={(smallBusiness) => updateTax({ smallBusiness })}
              trackColor={{ true: colors.brand, false: colors.line }}
              thumbColor={colors.white}
            />
          </View>
          <Field label="Notizen Finanzamt" value={tax.notes} onChangeText={(notes) => updateTax({ notes })} multiline placeholder="Sachbearbeiter, Aktenzeichen, offene Fragen …" />
        </Card>
        <Text style={type.small}>Wird automatisch gespeichert, nur auf diesem Gerät.</Text>
      </Section>

      <Section title="Fristen">
        {deadlines.length === 0 && <Text style={type.small}>Keine offenen Fristen. Leg eine an, die App erinnert dich vorher.</Text>}
        {deadlines.map((a) => (
          <Card key={a.id} onPress={() => router.push(`/termin/${a.id}`)}>
            <Text style={[type.body, { fontWeight: '600' }]}>{a.title}</Text>
            <Text style={[type.small, a.date < t && { color: colors.danger, fontWeight: '700' }]}>
              {a.date < t ? 'Überfällig seit ' : 'Fällig am '}
              {formatDate(a.date)}
              {a.remindBefore > 0 ? ' · 🔔' : ''}
            </Text>
          </Card>
        ))}
        <Text style={type.label}>FRIST ANLEGEN</Text>
        <View style={styles.chips}>
          {presets.map((p) => (
            <Pressable
              key={p}
              onPress={() => {
                tap();
                router.push({ pathname: '/termin/[id]', params: { id: 'neu', type: 'finanzamt', title: p } });
              }}
              style={styles.chip}>
              <Text style={styles.chipText}>＋ {p}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      <Button title="ELSTER öffnen" icon="🌐" kind="secondary" onPress={() => Linking.openURL('https://www.elster.de/eportal/start')} />
      <Text style={type.small}>
        Fristen und Steuerfragen bitte mit deinem Steuerberater abstimmen. Die App erinnert nur, sie berechnet keine Fristen.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: space.m },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.s },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  chipText: { fontSize: 14, fontWeight: '600', color: colors.brandDark },
});
