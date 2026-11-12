import { Text } from 'react-native';

import { Card, Field, Screen } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { isQualified, profile } from '@/data/profile';
import { useStore } from '@/store';

/** Firmendaten: erscheinen im Mängelbericht, im Angebot und in der Rechnung */
export default function Firma() {
  const { company: c, updateCompany } = useStore();
  const num = (s: string) => {
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : 0;
  };
  return (
    <Screen>
      <Text style={type.small}>Diese Angaben stehen im Kopf und Fuß von Bericht, Angebot und Rechnung. Änderungen gelten sofort.</Text>
      <Card>
        <Field label="Firmenname" value={c.name} onChangeText={(name) => updateCompany({ name })} />
        <Field label="Inhaber" value={c.owner} onChangeText={(owner) => updateCompany({ owner })} />
        <Field label="Straße und Hausnummer" value={c.street} onChangeText={(street) => updateCompany({ street })} />
        <Field label="PLZ und Ort" value={c.zipCity} onChangeText={(zipCity) => updateCompany({ zipCity })} />
        <Field label="Telefon" value={c.phone} onChangeText={(phone) => updateCompany({ phone })} keyboardType="phone-pad" />
        <Field
          label="Geschäftsmail"
          value={c.email}
          onChangeText={(email) => updateCompany({ email })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="info@brandschutz-ried.de"
        />
        {!c.email && <Text style={[type.small, { color: colors.warn }]}>Ohne Geschäftsmail wirkt das PDF unfertig. Eine private Mail besser nicht eintragen.</Text>}
        <Field label="Website" value={c.website} onChangeText={(website) => updateCompany({ website })} autoCapitalize="none" placeholder="brandschutz-ried.de" />
      </Card>

      <Card>
        <Text style={type.label}>BANKVERBINDUNG (FÜR RECHNUNGEN)</Text>
        <Field label="Bank" value={c.bank} onChangeText={(bank) => updateCompany({ bank })} placeholder="z. B. N26" />
        <Field
          label="IBAN"
          value={c.iban}
          onChangeText={(iban) => updateCompany({ iban: iban.toUpperCase() })}
          autoCapitalize="characters"
          placeholder="DE.."
        />
        <Field label="BIC" value={c.bic} onChangeText={(bic) => updateCompany({ bic: bic.toUpperCase() })} autoCapitalize="characters" />
        <Text style={type.small}>Nimm das Geschäftskonto, nicht dein privates. Steuernummer trägst du unter Büro → Finanzamt ein.</Text>
      </Card>

      <Card>
        <Text style={type.label}>STANDARDS</Text>
        <Field label="Stundensatz netto €" value={String(c.hourlyRate)} onChangeText={(s) => updateCompany({ hourlyRate: num(s) })} keyboardType="decimal-pad" />
        <Field label="Zahlungsziel Rechnung (Tage)" value={String(c.paymentDays)} onChangeText={(s) => updateCompany({ paymentDays: Math.round(num(s)) })} keyboardType="number-pad" />
        <Field label="Angebot gültig (Tage)" value={String(c.offerDays)} onChangeText={(s) => updateCompany({ offerDays: Math.round(num(s)) })} keyboardType="number-pad" />
        <Text style={type.small}>Der Stundensatz ist nur dein Richtwert. Die Preise selbst stehen in der Preisliste.</Text>
      </Card>

      <Card>
        <Text style={type.label}>TITEL IM BERICHT</Text>
        <Text style={[type.small, { color: isQualified() ? colors.brandDark : colors.warn }]}>
          {isQualified()
            ? profile.role
            : '„Brandschutzbeauftragter“ erscheint im Bericht automatisch erst bei Begehungen ab dem 03.12.2026 (Lehrgangsabschluss).'}
        </Text>
      </Card>
    </Screen>
  );
}
