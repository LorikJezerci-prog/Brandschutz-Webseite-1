import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { HtmlView } from '@/components/html-view';
import { Empty } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useStore } from '@/store';
import { buildReportHtml } from '@/utils/report';

export default function Vorschau() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { inspections, customers } = useStore();
  const i = inspections.find((x) => x.id === id);
  const c = customers.find((x) => x.id === i?.customerId);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (i) buildReportHtml(i, c).then(setHtml);
  }, [i, c]);

  if (!i) return <Empty title="Nicht gefunden" text="Diese Begehung existiert nicht." />;
  if (!html)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.brand} size="large" />
      </View>
    );
  return <HtmlView html={html} />;
}
