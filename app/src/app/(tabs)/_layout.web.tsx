import { Tabs } from 'expo-router/js-tabs';
import type { ViewStyle } from 'react-native';

import { Icon, IconName } from '@/components/icon';
import { colors } from '@/constants/theme';

const icon =
  (name: IconName) =>
  ({ color }: { color: unknown }) => <Icon name={name} size={24} color={String(color)} />;

/** Unterer Rand + Home-Balken des iPhones (CSS env), damit die Leiste frei bedienbar bleibt */
const tabBarStyle = {
  height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
  paddingTop: 6,
  paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
  backgroundColor: colors.card,
  borderTopColor: colors.line,
} as unknown as ViewStyle;

/** Web-Version: Tableiste mit Icons statt nativer Tabs */
export default function TabLayout() {
  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle,
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Begehungen', tabBarIcon: icon('clipboard-outline') }} />
      <Tabs.Screen name="termine" options={{ title: 'Termine', tabBarIcon: icon('calendar-outline') }} />
      <Tabs.Screen name="kunden" options={{ title: 'Kunden', tabBarIcon: icon('business-outline') }} />
      <Tabs.Screen name="buero" options={{ title: 'Büro', tabBarIcon: icon('briefcase-outline') }} />
    </Tabs>
  );
}
