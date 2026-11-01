import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, space, type } from '@/constants/theme';

export const tap = () => {
  if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
};

export function Screen({ children, header, ...props }: ScrollViewProps & { children: ReactNode; header?: ReactNode }) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior={header ? 'never' : 'automatic'}
      keyboardShouldPersistTaps="handled"
      style={styles.screen}
      {...props}>
      {header}
      <View style={styles.screenContent}>{children}</View>
    </ScrollView>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (!onPress) return <View style={[styles.card, style]}>{children}</View>;
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.card, style, pressed && styles.pressed]}>
      {children}
    </Pressable>
  );
}

type ButtonKind = 'primary' | 'secondary' | 'danger';
export function Button({
  title,
  onPress,
  kind = 'primary',
  disabled,
  icon,
}: {
  title: string;
  onPress: () => void;
  kind?: ButtonKind;
  disabled?: boolean;
  icon?: string;
}) {
  const bg = kind === 'primary' ? colors.brand : kind === 'danger' ? colors.dangerSoft : colors.brandSoft;
  const fg = kind === 'primary' ? colors.white : kind === 'danger' ? colors.danger : colors.brandDark;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [styles.button, { backgroundColor: bg }, (pressed || disabled) && styles.pressed]}>
      <Text style={[styles.buttonText, { color: fg }]}>
        {icon ? `${icon}  ` : ''}
        {title}
      </Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: space.xs }}>
      <Text style={type.label}>{label.toUpperCase()}</Text>
      <TextInput
        placeholderTextColor="#98A69F"
        style={[styles.input, props.multiline && { minHeight: 88, textAlignVertical: 'top' }]}
        {...props}
      />
    </View>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value?: T;
  options: { value: T; label: string; color?: string; bg?: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.segment}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => {
              tap();
              onChange(o.value);
            }}
            style={[
              styles.segmentItem,
              active && { backgroundColor: o.bg ?? colors.brand, borderColor: o.color ?? colors.brand },
            ]}>
            <Text style={[styles.segmentText, active && { color: o.bg ? o.color : colors.white }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Progress({ value, danger }: { value: number; danger?: boolean }) {
  return (
    <View style={styles.track}>
      <View style={[styles.bar, { width: `${Math.round(value * 100)}%` }, danger && { backgroundColor: colors.danger }]} />
    </View>
  );
}

export function Empty({ title, text, action }: { title: string; text: string; action?: ReactNode }) {
  return (
    <View style={styles.empty}>
      <LogoMark size={64} />
      <Text style={[type.h2, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[type.small, { textAlign: 'center' }]}>{text}</Text>
      {action}
    </View>
  );
}

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <Image
      source={require('@/assets/images/logo-small.png')}
      style={{ width: size, height: size }}
      accessibilityLabel="Brandschutz Ried"
    />
  );
}

export function Section({ title, children, right }: { title: string; children: ReactNode; right?: ReactNode }) {
  return (
    <View style={{ gap: space.s }}>
      <View style={styles.sectionHead}>
        <Text style={type.label}>{title.toUpperCase()}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Pill({ text, color = colors.brandDark, bg = colors.brandSoft }: { text: string; color?: string; bg?: string }) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <Text style={[styles.pillText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  screenContent: { padding: space.l, gap: space.l, paddingBottom: 48, width: '100%', maxWidth: 720, alignSelf: 'center' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.m,
    padding: space.l,
    gap: space.s,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    borderCurve: 'continuous',
  },
  pressed: { opacity: 0.6 },
  button: { minHeight: 50, borderRadius: radius.m, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.l, borderCurve: 'continuous' },
  buttonText: { fontSize: 16, fontWeight: '600' },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.s,
    paddingHorizontal: space.m,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  segment: { flexDirection: 'row', gap: space.s },
  segmentItem: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.s,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 4,
  },
  segmentText: { fontSize: 14, fontWeight: '600', color: colors.muted, textAlign: 'center' },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  bar: { height: 6, borderRadius: 3, backgroundColor: colors.brand },
  empty: { alignItems: 'center', gap: space.m, paddingVertical: space.xxl, paddingHorizontal: space.l },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: space.xs },
  pill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.pill },
  pillText: { fontSize: 12, fontWeight: '700' },
});
