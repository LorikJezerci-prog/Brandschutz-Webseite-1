import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors } from '@/constants/theme';
import { StoreProvider } from '@/store';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: colors.brand, background: colors.bg, card: colors.card, text: colors.text, border: colors.line },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <StoreProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerTintColor: colors.brand,
            headerTitleStyle: { color: colors.text },
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: colors.bg },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="begehung/neu" options={{ title: 'Neue Begehung', presentation: 'modal' }} />
          <Stack.Screen name="kunde/neu" options={{ title: 'Neuer Kunde', presentation: 'modal' }} />
          <Stack.Screen name="begehung/[id]/index" options={{ title: 'Begehung' }} />
          <Stack.Screen name="begehung/[id]/[kategorie]" options={{ title: 'Prüfpunkte' }} />
          <Stack.Screen name="begehung/[id]/bericht" options={{ title: 'Mängelbericht' }} />
          <Stack.Screen name="kunde/[id]" options={{ title: 'Kunde' }} />
          <Stack.Screen name="leistung/[slug]" options={{ title: 'Leistung' }} />
          <Stack.Screen name="schnellcheck" options={{ title: 'Schnellcheck' }} />
        </Stack>
      </StoreProvider>
    </ThemeProvider>
  );
}
