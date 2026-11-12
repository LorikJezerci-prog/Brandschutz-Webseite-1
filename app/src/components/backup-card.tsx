import { useState } from 'react';
import { ActivityIndicator, Platform, Text } from 'react-native';

import { colors, type } from '@/constants/theme';
import { useStore } from '@/store';
import { Backup, backupSummary, exportBackup, parseBackup, restoreBackup } from '@/utils/backup';
import { readPickedText } from '@/utils/files';
import { formatDate } from '@/utils/format';
import { pickDocument } from '@/utils/pick';
import { ConfirmButton } from './confirm-button';
import { Button, Card } from './ui';

const daysSince = (iso?: string) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 86400000) : Infinity);

/** Datensicherung: alles als eine Datei sichern und wieder laden */
export function BackupCard() {
  const { snapshot, replaceAll, markBackup, lastBackupAt, customers } = useStore();
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [pending, setPending] = useState<Backup | null>(null);
  const age = daysSince(lastBackupAt);
  const due = customers.length > 0 && age > 7;

  const save = async () => {
    setErr('');
    setMsg('');
    setBusy('Sicherung wird erstellt …');
    try {
      const r = await exportBackup(snapshot());
      markBackup();
      setMsg(
        `Sicherung erstellt (${(r.bytes / 1e6).toFixed(1).replace('.', ',')} MB, ${r.files} Dateien).` +
          (r.missing ? ` ${r.missing} Datei(en) waren nicht mehr auffindbar.` : '') +
          ' Leg sie in iCloud Drive oder schick sie dir per Mail.',
      );
    } catch (e) {
      setErr('Sicherung fehlgeschlagen: ' + String(e));
    } finally {
      setBusy('');
    }
  };

  const choose = async () => {
    setErr('');
    setMsg('');
    setPending(null);
    const p = await pickDocument(['application/json', 'text/plain', '*/*']);
    if (!p) return;
    setBusy('Datei wird gelesen …');
    try {
      setPending(parseBackup(await readPickedText(p.uri, p.file)));
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy('');
    }
  };

  const restore = async () => {
    if (!pending) return;
    setBusy('Daten werden geladen …');
    try {
      replaceAll(await restoreBackup(pending));
      setMsg(`Geladen: ${backupSummary(pending)}.` + (Platform.OS !== 'web' ? ' Erinnerungen bitte bei den Terminen neu speichern.' : ''));
      setPending(null);
    } catch (e) {
      setErr('Laden fehlgeschlagen: ' + String(e));
    } finally {
      setBusy('');
    }
  };

  return (
    <Card style={due ? { borderColor: colors.warn, borderWidth: 1 } : undefined}>
      <Text style={[type.body, { fontWeight: '600' }]}>Datensicherung</Text>
      <Text style={[type.small, due && { color: colors.warn, fontWeight: '600' }]}>
        {lastBackupAt
          ? `Letzte Sicherung: ${formatDate(lastBackupAt)}${age > 0 ? ` (vor ${age} Tag${age === 1 ? '' : 'en'})` : ' (heute)'}.`
          : 'Noch nie gesichert.'}{' '}
        {due ? 'Bitte jetzt sichern.' : ''}
      </Text>
      <Text style={type.small}>
        Alle Kunden, Begehungen mit Fotos, Unterlagen, Angebote und Rechnungen in einer Datei. Damit holst du alles zurück, wenn das Handy
        verloren geht oder Safari den Speicher leert.
      </Text>
      {busy ? (
        <>
          <ActivityIndicator color={colors.brand} />
          <Text style={[type.small, { textAlign: 'center' }]}>{busy}</Text>
        </>
      ) : (
        <>
          <Button title="Daten sichern" icon="cloud-upload-outline" onPress={save} />
          <Button title="Sicherung laden" icon="cloud-download-outline" kind="secondary" onPress={choose} />
        </>
      )}
      {pending && !busy && (
        <>
          <Text style={type.small}>
            Sicherung vom {formatDate(pending.exportedAt)}: {backupSummary(pending)}.
          </Text>
          <ConfirmButton
            title="Diese Sicherung laden"
            warning="Achtung: Alle Daten, die jetzt in der App sind, werden durch die Sicherung ersetzt."
            onConfirm={restore}
          />
        </>
      )}
      {!!msg && <Text style={[type.small, { color: colors.brandDark }]}>{msg}</Text>}
      {!!err && <Text style={[type.small, { color: colors.danger }]}>{err}</Text>}
    </Card>
  );
}
