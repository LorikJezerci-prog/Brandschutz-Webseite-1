import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { BackupCard } from '@/components/backup-card';
import { ConfirmButton } from '@/components/confirm-button';
import { financeTotals } from '@/components/finance-row';
import { Icon, IconName } from '@/components/icon';
import { TabHeader } from '@/components/tab-header';
import { Button, Card, Screen, Section } from '@/components/ui';
import { colors, space, type } from '@/constants/theme';
import { useStore } from '@/store';
import { formatDate, formatEuro } from '@/utils/format';

function Tile({ icon, title, text, onPress }: { icon: IconName; title: string; text: string; onPress: () => void }) {
  return (
    <Card onPress={onPress} style={styles.tile}>
      <View style={styles.tileIcon}>
        <Icon name={icon} size={22} />
      </View>
      <Text style={[type.body, { fontWeight: '700' }]}>{title}</Text>
      <Text style={type.small} numberOfLines={2}>
        {text}
      </Text>
    </Card>
  );
}

export default function Buero() {
  const { notes, tax, finance, hasDemo, loadDemo, removeDemo, company, catalog } = useStore();
  const ft = financeTotals(finance);
  const companyMissing = [!company.email && 'Mail', !company.iban && 'IBAN'].filter(Boolean).join(', ');
  const taxMissing = !tax.taxNumber;

  return (
    <Screen header={<TabHeader title="Büro" subtitle="Finanzamt, Notizen, Tipps und dein Wissen an einem Ort." />}>
      <View style={styles.grid}>
        <Tile
          icon="receipt-outline"
          title="Finanzamt"
          text={taxMissing ? 'Steuernummer fehlt noch' : `St.-Nr. ${tax.taxNumber}`}
          onPress={() => router.push('/finanzamt')}
        />
        <Tile icon="bulb-outline" title="Tipps" text="Praxis, Bericht, Kunden, Gründung" onPress={() => router.push('/tipps')} />
        <Tile icon="flash-outline" title="Schnellcheck" text="Sechs Fragen fürs Erstgespräch" onPress={() => router.push('/schnellcheck')} />
        <Tile icon="library-outline" title="Leistungen" text="Deine 14 Leistungen zum Nachschlagen" onPress={() => router.push('/leistungen')} />
        <Tile
          icon="wallet-outline"
          title="Angebote & Rechnungen"
          text={ft.openCount ? `${formatEuro(ft.openSum)} offen${ft.overdueCount ? `, ${ft.overdueCount} überfällig` : ''}` : 'Alles bezahlt'}
          onPress={() => router.push('/finanzen')}
        />
        <Tile
          icon="business-outline"
          title="Firmendaten"
          text={companyMissing ? `Fehlt noch: ${companyMissing}` : 'Vollständig'}
          onPress={() => router.push('/firma')}
        />
        <Tile icon="pricetags-outline" title="Preisliste" text={`${catalog.length} Leistungen, netto`} onPress={() => router.push('/preisliste')} />
      </View>

      <BackupCard />

      <Section
        title={`Notizen (${notes.length})`}
        right={
          <Text style={styles.link} onPress={() => router.push('/notiz/neu')}>
            + Neue Notiz
          </Text>
        }>
        {notes.length === 0 && (
          <Card>
            <Text style={type.small}>Ideen, Telefonnotizen, offene Fragen. Alles, was nicht zu einem Kunden gehört.</Text>
            <Button title="Erste Notiz schreiben" kind="secondary" onPress={() => router.push('/notiz/neu')} />
          </Card>
        )}
        {notes.map((n) => (
          <Card key={n.id} onPress={() => router.push(`/notiz/${n.id}`)}>
            <Text style={[type.body, { fontWeight: '600' }]} numberOfLines={1}>
              {n.title || 'Ohne Titel'}
            </Text>
            <Text style={type.small} numberOfLines={2}>
              {n.text || '–'}
            </Text>
            <Text style={[type.small, { fontSize: 12 }]}>{formatDate(n.updatedAt)}</Text>
          </Card>
        ))}
      </Section>

      <Section title="Übung">
        <Card>
          <Text style={[type.body, { fontWeight: '600' }]}>Musterbetrieb zum Ausprobieren</Text>
          <Text style={type.small}>
            {hasDemo
              ? '„Muster Metallbau GmbH (Übung)“ ist geladen: unter Kunden, Begehungen und Termine. Die Begehung ist halb fertig, den Rest kannst du selbst prüfen und dann den Bericht ansehen.'
              : 'Lädt einen erfundenen Metallbaubetrieb mit halb fertiger Begehung, 8 Mängeln, zwei Terminen und einer Notiz. Deine echten Daten bleiben unberührt.'}
          </Text>
          {hasDemo ? (
            <>
              <Button title="Musterbegehung öffnen" icon="clipboard-outline" onPress={() => router.push('/begehung/demo-begehung')} />
              <ConfirmButton title="Musterbetrieb entfernen" warning="Nur die Übungsdaten werden gelöscht, deine echten bleiben." onConfirm={removeDemo} />
            </>
          ) : (
            <Button
              title="Musterbetrieb laden"
              icon="business-outline"
              onPress={() => {
                loadDemo();
                router.push('/begehung/demo-begehung');
              }}
            />
          )}
        </Card>
      </Section>

    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.m },
  tile: { flexBasis: '47%', flexGrow: 1, minHeight: 120 },
  tileIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.brandSoft, alignItems: 'center', justifyContent: 'center' },
  link: { color: colors.brand, fontWeight: '600', fontSize: 14 },
});
