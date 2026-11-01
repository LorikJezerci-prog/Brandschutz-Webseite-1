import { NativeTabs } from 'expo-router/native-tabs';

import { colors } from '@/constants/theme';

export default function TabLayout() {
  return (
    <NativeTabs tintColor={colors.brand} backgroundColor={colors.card} indicatorColor={colors.brandSoft}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Begehungen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'checklist', selected: 'checklist' }} md="fact_check" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="kunden">
        <NativeTabs.Trigger.Label>Kunden</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'building.2', selected: 'building.2.fill' }} md="apartment" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="wissen">
        <NativeTabs.Trigger.Label>Wissen</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'book', selected: 'book.fill' }} md="menu_book" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
