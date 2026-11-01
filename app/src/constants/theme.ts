/** Hausfarben Brandschutz Ried: Grün #0A6B44 und Weiß. Rot nur für Gefahren und Mängel. */
export const colors = {
  brand: '#0A6B44',
  brandDark: '#07502F',
  brandSoft: '#E7F2EC',
  bg: '#F5F7F6',
  card: '#FFFFFF',
  text: '#13201A',
  muted: '#5B6B63',
  line: '#DDE5E0',
  danger: '#C62828',
  dangerSoft: '#FDECEC',
  warn: '#A15C00',
  warnSoft: '#FFF3DF',
  white: '#FFFFFF',
} as const;

export const space = { xs: 4, s: 8, m: 12, l: 16, xl: 24, xxl: 32 } as const;
export const radius = { s: 8, m: 12, l: 16, pill: 999 } as const;

export const type = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 16, color: colors.text, lineHeight: 22 },
  small: { fontSize: 14, color: colors.muted, lineHeight: 19 },
  label: { fontSize: 13, fontWeight: '600' as const, color: colors.muted, letterSpacing: 0.4 },
};
