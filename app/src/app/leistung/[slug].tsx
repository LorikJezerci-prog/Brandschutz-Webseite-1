import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

import { Card, Empty, Pill, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { groups, serviceBySlug } from '@/data/services';

export default function Leistung() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const s = serviceBySlug(slug);
  if (!s) return <Empty title="Nicht gefunden" text="Diese Leistung gibt es nicht." />;

  return (
    <Screen>
      <Stack.Screen options={{ title: s.code }} />
      <Pill text={groups[s.group].title} />
      <Text style={type.title}>{s.title}</Text>
      <Text style={type.body}>{s.summary}</Text>
      <Section title="Warum">
        <Card>
          <Text style={type.body}>{s.why}</Text>
        </Card>
      </Section>
      <Section title="Umfang">
        <Card>
          {s.tasks.map((t) => (
            <Text key={t} style={type.body}>
              ✓ {t}
            </Text>
          ))}
        </Card>
      </Section>
      <Section title="Nutzen für den Kunden">
        <Card>
          <Text style={type.body}>{s.benefit}</Text>
        </Card>
      </Section>
      <Section title="Grundlage">
        <Card>
          <Text style={type.body}>{s.basis}</Text>
        </Card>
      </Section>
      {s.boundaries.length > 0 && (
        <Section title="Grenzen">
          <Card style={{ backgroundColor: colors.warnSoft, borderColor: colors.warnSoft }}>
            {s.boundaries.map((b) => (
              <Text key={b} style={type.body}>
                {b}
              </Text>
            ))}
          </Card>
        </Section>
      )}
    </Screen>
  );
}
