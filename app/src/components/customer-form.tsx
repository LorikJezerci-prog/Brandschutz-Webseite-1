import { useState } from 'react';

import { Button, Card, Field } from '@/components/ui';
import { Customer } from '@/store/types';

export type CustomerInput = Omit<Customer, 'id' | 'createdAt'>;
const blank: CustomerInput = { name: '', branche: '', contact: '', phone: '', email: '', address: '', notes: '' };

export function CustomerForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: CustomerInput;
  submitLabel: string;
  onSubmit: (c: CustomerInput) => void;
}) {
  const [c, setC] = useState<CustomerInput>(initial ?? blank);
  const set = (k: keyof CustomerInput) => (v: string) => setC({ ...c, [k]: v });

  return (
    <>
      <Card style={{ gap: 14 }}>
        <Field label="Firma / Objekt *" value={c.name} onChangeText={set('name')} placeholder="z. B. Pflegeheim Sonnenhof" autoFocus={!initial} />
        <Field label="Branche" value={c.branche} onChangeText={set('branche')} placeholder="z. B. Pflege, Logistik, Metall" />
        <Field label="Adresse" value={c.address} onChangeText={set('address')} placeholder="Straße, PLZ Ort" />
      </Card>
      <Card style={{ gap: 14 }}>
        <Field label="Ansprechpartner" value={c.contact} onChangeText={set('contact')} />
        <Field label="Telefon" value={c.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
        <Field label="E-Mail" value={c.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" />
        <Field label="Notizen" value={c.notes} onChangeText={set('notes')} multiline placeholder="Besonderheiten, Schlüssel, Zugang …" />
      </Card>
      <Button title={submitLabel} disabled={!c.name.trim()} onPress={() => onSubmit({ ...c, name: c.name.trim() })} />
    </>
  );
}
