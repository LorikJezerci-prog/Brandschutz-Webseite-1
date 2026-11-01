import { router } from 'expo-router';

import { CustomerForm } from '@/components/customer-form';
import { Screen } from '@/components/ui';
import { useStore } from '@/store';

export default function NeuerKunde() {
  const { addCustomer } = useStore();
  return (
    <Screen>
      <CustomerForm
        submitLabel="Kunden speichern"
        onSubmit={(c) => {
          addCustomer(c);
          router.back();
        }}
      />
    </Screen>
  );
}
