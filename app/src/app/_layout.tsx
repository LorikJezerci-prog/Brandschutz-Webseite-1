import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';
import { StoreProvider } from '@/store';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.brand, background: colors.bg, card: colors.card, text: colors.text, border: colors.line },
};

/** Im Web reicht das Grün bis unter die Statusleiste des iPhones */
const frame = {
  flex: 1,
  backgroundColor: colors.brand,
  paddingTop: Platform.OS === 'web' ? 'env(safe-area-inset-top, 0px)' : 0,
} as unknown as ViewStyle;

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <StoreProvider>
        <StatusBar style="light" />
        <View style={frame}>
        <Stack
          screenOptions={{
            headerTintColor: colors.white,
            headerStyle: { backgroundColor: colors.brand },
            headerShadowVisible: false,
            headerTitleStyle: { color: colors.white, fontWeight: '700' },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="begehung/neu" options={{ title: 'Neue Begehung', presentation: 'modal' }} />
          <Stack.Screen name="kunde/neu" options={{ title: 'Neuer Kunde', presentation: 'modal' }} />
          <Stack.Screen name="begehung/[id]/index" options={{ title: 'Begehung' }} />
          <Stack.Screen name="begehung/[id]/[kategorie]" options={{ title: 'Prüfpunkte' }} />
          <Stack.Screen name="begehung/[id]/bericht" options={{ title: 'Mängelbericht' }} />
          <Stack.Screen name="begehung/[id]/vorschau" options={{ title: 'Berichtsvorschau' }} />
          <Stack.Screen name="termin/[id]" options={{ title: 'Termin', presentation: 'modal' }} />
          <Stack.Screen name="finanzamt" options={{ title: 'Finanzamt' }} />
          <Stack.Screen name="notiz/[id]" options={{ title: 'Notiz' }} />
          <Stack.Screen name="tipps" options={{ title: 'Tipps' }} />
          <Stack.Screen name="leistungen" options={{ title: 'Leistungen' }} />
          <Stack.Screen name="kunde/[id]" options={{ title: 'Kunde' }} />
          <Stack.Screen name="leistung/[slug]" options={{ title: 'Leistung' }} />
          <Stack.Screen name="schnellcheck" options={{ title: 'Schnellcheck' }} />
          <Stack.Screen name="unterlage/[id]" options={{ title: 'Unterlage', presentation: 'modal' }} />
          <Stack.Screen name="beleg/[id]" options={{ title: 'Beleg', presentation: 'modal' }} />
          <Stack.Screen name="finanzen" options={{ title: 'Angebote & Rechnungen' }} />
        </Stack>
        </View>
      </StoreProvider>
    </ThemeProvider>
  );
}
