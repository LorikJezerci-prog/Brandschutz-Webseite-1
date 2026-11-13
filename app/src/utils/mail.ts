import { Company, Customer, FinanceDoc } from '@/store/types';
import { formatDate, formatEuro } from './format';

/** mailto-Link für Zahlungserinnerung (Rechnung) oder Nachfassen (Angebot) */
export function followUpMail(f: FinanceDoc, c: Customer, co: Company) {
  const who = c.contact.replace(/\s*\(.*\)\s*/g, '').trim();
  const hello = who ? `Guten Tag ${who},` : 'Sehr geehrte Damen und Herren,';
  const isInvoice = f.kind === 'rechnung';
  const subject = isInvoice ? `Zahlungserinnerung Rechnung ${f.number}` : `Ihr Angebot ${f.number}: kurze Rückfrage`;
  const body = isInvoice
    ? `${hello}

sicher ist es im Alltag untergegangen: Meine Rechnung ${f.number} vom ${formatDate(f.date)} über ${formatEuro(f.amount)} war am ${f.dueDate ? formatDate(f.dueDate) : '–'} fällig. Ich bitte Sie, den Betrag in den nächsten 7 Tagen zu überweisen.${co.iban ? `\n\nIBAN: ${co.iban}${co.bank ? ` (${co.bank})` : ''}` : ''}

Sollte sich die Zahlung mit dieser Nachricht überschnitten haben, betrachten Sie sie bitte als gegenstandslos.

Freundliche Grüße
${co.owner}
${co.name} · ${co.phone}`
    : `${hello}

vor einigen Tagen habe ich Ihnen mein Angebot ${f.number}${f.title ? ` (${f.title})` : ''} über ${formatEuro(f.amount)} geschickt. Haben Sie noch Fragen dazu, oder soll ich etwas anpassen?

Gern stimme ich einen Termin mit Ihnen ab. Sie erreichen mich auch telefonisch unter ${co.phone}.

Freundliche Grüße
${co.owner}
${co.name}`;
  return `mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
