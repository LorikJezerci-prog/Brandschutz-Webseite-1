import { useState } from 'react';
import { Switch, Text, View } from 'react-native';

import { Card, Field, Screen, Section } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { Answers, evaluate, initialAnswers, questions } from '@/data/quick-check';

const tone = {
  todo: { bg: colors.dangerSoft, fg: colors.danger, label: 'Handlungsbedarf' },
  check: { bg: colors.warnSoft, fg: colors.warn, label: 'Prüfen' },
  ok: { bg: colors.brandSoft, fg: colors.brandDark, label: 'In Ordnung' },
};

export default function Schnellcheck() {
  const [a, setA] = useState<Answers>(initialAnswers);
  const hints = evaluate(a);

  return (
    <Screen>
      <Text style={type.small}>
        Grobe Orientierung aus wenigen Angaben, ersetzt keine Gefährdungsbeurteilung. Es wird nichts gespeichert.
      </Text>
      <Card>
        <Field
          label="Beschäftigte"
          keyboardType="number-pad"
          value={a.staff}
          onChangeText={(staff) => setA({ ...a, staff: staff.replace(/\D/g, '') })}
        />
        {questions.map((q) => (
          <View key={q.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
            <Text style={[type.body, { flex: 1 }]}>{q.label}</Text>
            <Switch
              value={a[q.key]}
              onValueChange={(v) => setA({ ...a, [q.key]: v })}
              trackColor={{ true: colors.brand, false: colors.line }}
              thumbColor={colors.white}
            />
          </View>
        ))}
      </Card>
      <Section title="Einschätzung">
        {hints.map((h) => (
          <Card key={h.title} style={{ backgroundColor: tone[h.tone].bg, borderColor: tone[h.tone].bg }}>
            <Text style={[type.label, { color: tone[h.tone].fg }]}>{tone[h.tone].label.toUpperCase()}</Text>
            <Text style={type.h2}>{h.title}</Text>
            <Text style={type.body}>{h.text}</Text>
          </Card>
        ))}
      </Section>
    </Screen>
  );
}
