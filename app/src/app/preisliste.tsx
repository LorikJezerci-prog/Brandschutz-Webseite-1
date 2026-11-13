import { useState } from 'react';
import { Text, View } from 'react-native';

import { ConfirmButton } from '@/components/confirm-button';
import { Button, Card, Field, Screen } from '@/components/ui';
import { colors, type } from '@/constants/theme';
import { useStore } from '@/store';
import { CatalogItem } from '@/store/types';
import { formatEuro, parseEuro } from '@/utils/format';

function Editor({ item, onDone }: { item?: CatalogItem; onDone: () => void }) {
  const { saveCatalogItem, removeCatalogItem } = useStore();
  const [title, setTitle] = useState(item?.title ?? '');
  const [desc, setDesc] = useState(item?.desc ?? '');
  const [unit, setUnit] = useState(item?.unit ?? 'psch.');
  const [price, setPrice] = useState(item ? String(item.price).replace('.', ',') : '');
  const p = parseEuro(price);
  return (
    <Card style={{ borderColor: colors.brand }}>
      <Field label="Bezeichnung" value={title} onChangeText={setTitle} />
      <Field label="Beschreibung (steht im Angebot)" value={desc} onChangeText={setDesc} multiline />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <Field label="Preis netto €" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
        </View>
        <View style={{ flex: 1 }}>
          <Field label="Einheit" value={unit} onChangeText={setUnit} />
        </View>
      </View>
      <Button
        title="Übernehmen"
        disabled={!title.trim() || p === null}
        onPress={() => {
          saveCatalogItem({ id: item?.id, code: item?.code ?? '', title: title.trim(), desc: desc.trim(), unit: unit.trim() || 'psch.', price: p! });
          onDone();
        }}
      />
      {item && (
        <ConfirmButton
          title="Aus Preisliste löschen"
          warning="Bestehende Angebote und Rechnungen bleiben unverändert."
          onConfirm={() => {
            removeCatalogItem(item.id);
            onDone();
          }}
        />
      )}
      <Text style={{ color: colors.muted, textAlign: 'center' }} onPress={onDone}>
        Abbrechen
      </Text>
    </Card>
  );
}

export default function Preisliste() {
  const { catalog, company, resetCatalog } = useStore();
  const [edit, setEdit] = useState<string | null>(null);
  return (
    <Screen>
      <Text style={type.small}>
        Alle Preise netto. Sie werden beim Hinzufügen in Angebot oder Rechnung übernommen und lassen sich dort pro Kunde anpassen. Richtwert:{' '}
        {formatEuro(company.hourlyRate)} pro Stunde.
      </Text>
      {edit === 'neu' ? <Editor onDone={() => setEdit(null)} /> : <Button title="Neue Leistung" icon="add" onPress={() => setEdit('neu')} />}
      {catalog.map((c) =>
        edit === c.id ? (
          <Editor key={c.id} item={c} onDone={() => setEdit(null)} />
        ) : (
          <Card key={c.id} onPress={() => setEdit(c.id)}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
              <Text style={[type.body, { flex: 1, fontWeight: '600' }]}>{c.title}</Text>
              <Text style={[type.body, { fontWeight: '700', color: colors.brandDark }]}>{formatEuro(c.price)}</Text>
            </View>
            <Text style={type.small} numberOfLines={2}>
              pro {c.unit} · {c.desc}
            </Text>
          </Card>
        ),
      )}
      <ConfirmButton title="Preisliste zurücksetzen" warning="Stellt die Startpreise aus deiner Tabelle wieder her. Eigene Änderungen gehen verloren." onConfirm={resetCatalog} />
    </Screen>
  );
}
