import { useEffect, useState } from 'react';
import { Text } from 'react-native';

import { type } from '@/constants/theme';
import { Button } from './ui';

/**
 * Löschen in zwei Schritten direkt in der Oberfläche, ohne Systemdialog:
 * erster Tipp fragt nach, zweiter Tipp innerhalb von 5 Sekunden führt aus.
 */
export function ConfirmButton({ title, warning, onConfirm }: { title: string; warning: string; onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 5000);
    return () => clearTimeout(t);
  }, [armed]);

  return (
    <>
      {armed && <Text style={[type.small, { textAlign: 'center' }]}>{warning}</Text>}
      <Button
        title={armed ? 'Wirklich löschen? Nochmal tippen' : title}
        kind="danger"
        onPress={() => (armed ? onConfirm() : setArmed(true))}
      />
    </>
  );
}
