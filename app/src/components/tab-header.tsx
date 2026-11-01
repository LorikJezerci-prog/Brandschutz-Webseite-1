import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, space } from '@/constants/theme';
import { LogoMark } from './ui';

/** Grüner Kopf mit Logo, wie der Hero der Website */
export function TabHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: (Platform.OS === 'web' ? 0 : insets.top) + space.m }]}>
      <View style={styles.row}>
        <View style={styles.logoBox}>
          <LogoMark size={36} />
        </View>
        <Text style={styles.brand}>Brandschutz Ried</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.brand, paddingHorizontal: space.l, paddingBottom: space.xl, gap: space.s },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  logoBox: { backgroundColor: colors.white, borderRadius: 10, padding: 2 },
  brand: { color: colors.white, fontWeight: '700', fontSize: 15, opacity: 0.95 },
  title: { color: colors.white, fontSize: 28, fontWeight: '800', marginTop: space.s },
  subtitle: { color: '#D6EADF', fontSize: 15, lineHeight: 20 },
});
