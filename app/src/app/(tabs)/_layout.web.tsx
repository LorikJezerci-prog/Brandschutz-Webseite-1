import { Tabs } from 'expo-router/js-tabs';
import { Text } from 'react-native';

import { colors } from '@/constants/theme';

const icon = (glyph: string) => () => <Text style={{ fontSize: 18 }}>{glyph}</Text>;

/** Web-Vorschau: einfache Tableiste statt nativer Tabs */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand,
        headerShown: false,
        headerTintColor: colors.brand,
        headerTitleStyle: { color: colors.text },
        sceneStyle: { backgroundColor: colors.bg },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Begehungen', tabBarIcon: icon('📋') }} />
      <Tabs.Screen name="kunden" options={{ title: 'Kunden', tabBarIcon: icon('🏢') }} />
      <Tabs.Screen name="wissen" options={{ title: 'Wissen', tabBarIcon: icon('📖') }} />
    </Tabs>
  );
}
