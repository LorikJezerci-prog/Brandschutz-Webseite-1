import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Card, Pill, Screen, Section } from '@/components/ui';
import { type } from '@/constants/theme';
import { Group, groups, services } from '@/data/services';

export default function Leistungen() {
  return (
    <Screen>
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
    </Screen>
  );
}
