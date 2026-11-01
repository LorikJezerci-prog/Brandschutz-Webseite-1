import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { TabHeader } from '@/components/tab-header';
import { Card, Pill, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { isQualified, profile } from '@/data/profile';
import { Group, groups, services } from '@/data/services';

export default function Wissen() {
  const qualified = isQualified();
  return (
    <Screen header={<TabHeader title="Wissen" subtitle="Schnellcheck für Erstgespräche und deine Leistungen zum Nachschlagen." />}>
      <Card onPress={() => router.push('/schnellcheck')} style={{ backgroundColor: colors.brandSoft, borderColor: colors.brandSoft }}>
        <Text style={[type.h2, { color: colors.brandDark }]}>⚡ Brandschutz-Schnellcheck</Text>
        <Text style={type.small}>
          Sechs Fragen im Erstgespräch, sofort eine grobe Einschätzung: Brandschutzhelfer, Unterweisung, Brandschutzordnung, Pläne.
        </Text>
      </Card>

      {(Object.keys(groups) as Group[]).map((g) => (
        <Section key={g} title={groups[g].title}>
          {services
            .filter((s) => s.group === g)
            .map((s) => (
              <Card key={s.slug} onPress={() => router.push(`/leistung/${s.slug}`)}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <Pill text={s.code} />
                  <Text style={[type.body, { fontWeight: '600', flex: 1 }]}>{s.title}</Text>
                </View>
                <Text style={type.small}>{s.short}</Text>
              </Card>
            ))}
        </Section>
      ))}

      <Section title="Dein Profil im Bericht">
        <Card>
          <Text style={type.body}>{profile.owner}</Text>
          <Text style={type.small}>{profile.address}</Text>
          <Text style={type.small}>{profile.phone}</Text>
          <Text style={[type.small, { color: profile.email ? colors.muted : colors.warn }]}>
            {profile.email || 'Geschäftsmail fehlt noch'}
          </Text>
          <Text style={[type.small, { color: qualified ? colors.brandDark : colors.warn }]}>
            {qualified
              ? profile.role
              : 'Titel „Brandschutzbeauftragter“ erscheint im Bericht erst ab dem 03.12.2026 (Lehrgangsabschluss).'}
          </Text>
        </Card>
      </Section>
    </Screen>
  );
}
