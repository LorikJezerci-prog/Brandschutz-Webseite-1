import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, space, type } from '@/constants/theme';
import { newId } from '@/store';
import { CatalogItem, LineItem } from '@/store/types';
import { formatEuro, parseEuro } from '@/utils/format';
import { Icon } from './icon';
import { Button, Card, Field, tap } from './ui';

export const fromCatalog = (c: CatalogItem, qty = 1): LineItem => ({
  id: newId(),
  title: c.title,
  desc: c.desc,
  qty,
  unit: c.unit,
  price: c.price,
});

const num = (n: number) => String(n).replace('.', ',');

function ItemEditor({ item, index, onChange, onRemove }: { item: LineItem; index: number; onChange: (i: LineItem) => void; onRemove: () => void }) {
  const [qty, setQty] = useState(num(item.qty));
  const [price, setPrice] = useState(num(item.price));
  const [open, setOpen] = useState(false);
  const q = parseEuro(qty);
  const p = parseEuro(price);
  return (
    <Card>
      <Pressable onPress={() => setOpen(!open)} style={styles.head}>
        <Text style={styles.no}>{index + 1}</Text>
        <Text style={[type.body, { flex: 1, fontWeight: '600' }]} numberOfLines={open ? undefined : 2}>
          {item.title || 'Neue Position'}
        </Text>
        <Icon name={open ? 'chevron-up' : 'create-outline'} size={18} />
      </Pressable>
      <View style={{ flexDirection: 'row', gap: space.s }}>
        <View style={{ flex: 1 }}>
          <Field
            label={`Menge (${item.unit})`}
            value={qty}
            keyboardType="decimal-pad"
            onChangeText={(t) => {
              setQty(t);
              const v = parseEuro(t);
              if (v !== null) onChange({ ...item, qty: v });
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Field
            label="Einzelpreis netto €"
            value={price}
            keyboardType="decimal-pad"
            onChangeText={(t) => {
              setPrice(t);
              const v = parseEuro(t);
              if (v !== null) onChange({ ...item, price: v });
            }}
          />
        </View>
      </View>
      {(q === null || p === null) && <Text style={[type.small, { color: colors.danger }]}>Bitte Zahlen wie 2 oder 480,00 eingeben.</Text>}
      <Text style={[type.small, { textAlign: 'right' }]}>= {formatEuro(Math.round(item.qty * item.price * 100) / 100)} netto</Text>
      {open && (
        <>
          <Field label="Bezeichnung" value={item.title} onChangeText={(title) => onChange({ ...item, title })} />
          <Field label="Beschreibung" value={item.desc} multiline onChangeText={(desc) => onChange({ ...item, desc })} />
          <Field label="Einheit" value={item.unit} onChangeText={(unit) => onChange({ ...item, unit })} placeholder="psch., Std., TN, km" />
          <Text style={[styles.link, { color: colors.danger }]} onPress={onRemove}>
            Position entfernen
          </Text>
        </>
      )}
    </Card>
  );
}

export function LineItems({ items, catalog, onChange }: { items: LineItem[]; catalog: CatalogItem[]; onChange: (i: LineItem[]) => void }) {
  const [picking, setPicking] = useState(items.length === 0);
  return (
    <View style={{ gap: space.m }}>
      <Text style={type.label}>POSITIONEN</Text>
      {items.map((x, n) => (
        <ItemEditor
          key={x.id}
          item={x}
          index={n}
          onChange={(v) => onChange(items.map((y) => (y.id === x.id ? v : y)))}
          onRemove={() => onChange(items.filter((y) => y.id !== x.id))}
        />
      ))}
      {picking ? (
        <Card>
          <Text style={[type.body, { fontWeight: '600' }]}>Aus deiner Preisliste</Text>
          {catalog.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => {
                tap();
                onChange([...items, fromCatalog(c)]);
                setPicking(false);
              }}
              style={styles.pick}>
              <Text style={[type.body, { flex: 1 }]} numberOfLines={2}>
                {c.title}
              </Text>
              <Text style={[type.small, { fontWeight: '700', color: colors.brandDark }]}>
                {formatEuro(c.price)}/{c.unit}
              </Text>
            </Pressable>
          ))}
          <Button
            title="Freie Position"
            kind="secondary"
            icon="create-outline"
            onPress={() => {
              onChange([...items, { id: newId(), title: '', desc: '', qty: 1, unit: 'psch.', price: 0 }]);
              setPicking(false);
            }}
          />
          {items.length > 0 && (
            <Text style={styles.link} onPress={() => setPicking(false)}>
              Abbrechen
            </Text>
          )}
        </Card>
      ) : (
        <Button title="Position hinzufügen" icon="add" kind="secondary" onPress={() => setPicking(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.s },
  no: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand, color: '#fff', textAlign: 'center', lineHeight: 24, fontSize: 12, fontWeight: '700', overflow: 'hidden' },
  pick: { flexDirection: 'row', alignItems: 'center', gap: space.s, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line },
  link: { color: colors.brand, fontWeight: '600', fontSize: 14, textAlign: 'center', paddingVertical: 4 },
});
