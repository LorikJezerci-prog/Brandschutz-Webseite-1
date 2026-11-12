import { Company, Customer, FinanceDoc, LineItem, TaxProfile } from '@/store/types';
import { formatDate, formatEuro } from './format';
import { contactLine, esc, logoSvg, nl2br, printHtml } from './print';

const r2 = (n: number) => Math.round(n * 100) / 100;

export function totals(items: LineItem[], vatRate: number) {
  const net = r2(items.reduce((s, x) => s + r2(x.qty * x.price), 0));
  const vat = r2((net * vatRate) / 100);
  return { net, vat, gross: r2(net + vat) };
}

const qtyText = (n: number) => n.toLocaleString('de-DE', { maximumFractionDigits: 2 });

/** Was für eine ordnungsgemäße Rechnung (§ 14 UStG) bzw. ein sauberes Angebot noch fehlt */
export function missingFor(f: Pick<FinanceDoc, 'kind' | 'serviceDate' | 'items'>, co: Company, tax: TaxProfile, c?: Customer) {
  const m: string[] = [];
  if (!co.name || !co.street || !co.zipCity) m.push('deine Anschrift (Büro → Firmendaten)');
  if (!c?.address) m.push('Anschrift des Kunden');
  if (!f.items?.length) m.push('mindestens eine Position');
  if (f.kind === 'rechnung') {
    if (!tax.taxNumber && !tax.vatId) m.push('Steuernummer (Büro → Finanzamt)');
    if (!f.serviceDate) m.push('Leistungsdatum');
    if (!co.iban) m.push('IBAN (Büro → Firmendaten)');
  }
  return m;
}

export function buildBelegHtml(f: FinanceDoc, c: Customer | undefined, co: Company, tax: TaxProfile) {
  const isInvoice = f.kind === 'rechnung';
  const items = f.items ?? [];
  const rate = f.vatRate ?? 0;
  const t = totals(items, rate);
  const word = isInvoice ? 'Rechnung' : 'Angebot';
  const sender = [co.name, co.street, co.zipCity].filter(Boolean).map(esc).join(' · ');
  const addr = (c?.address ?? '').split(/,\s*|\n/).filter(Boolean).map(esc).join('<br>');

  const rows = items
    .map(
      (x, n) => `<tr>
      <td class="n">${n + 1}</td>
      <td><b>${esc(x.title)}</b>${x.desc ? `<div class="d">${nl2br(x.desc)}</div>` : ''}</td>
      <td class="r">${qtyText(x.qty)} ${esc(x.unit)}</td>
      <td class="r">${formatEuro(x.price)}</td>
      <td class="r">${formatEuro(r2(x.qty * x.price))}</td></tr>`,
    )
    .join('');

  const sumRows =
    rate > 0
      ? `<tr><td>Summe netto</td><td class="r">${formatEuro(t.net)}</td></tr>
         <tr><td>zzgl. ${rate} % Umsatzsteuer</td><td class="r">${formatEuro(t.vat)}</td></tr>
         <tr class="g"><td>${isInvoice ? 'Rechnungsbetrag' : 'Angebotssumme'}</td><td class="r">${formatEuro(t.gross)}</td></tr>`
      : `<tr class="g"><td>${isInvoice ? 'Rechnungsbetrag' : 'Angebotssumme'}</td><td class="r">${formatEuro(t.net)}</td></tr>`;

  const vatNote =
    rate > 0
      ? ''
      : tax.smallBusiness
        ? '<p class="small">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet (Kleinunternehmerregelung).</p>'
        : '';

  const terms = isInvoice
    ? `<p>Bitte überweisen Sie den Betrag von <b>${formatEuro(t.gross)}</b> bis zum <b>${f.dueDate ? formatDate(f.dueDate) : '–'}</b> ohne Abzug
       unter Angabe der Rechnungsnummer <b>${esc(f.number)}</b>.</p>`
    : `<p>Dieses Angebot ist gültig bis zum <b>${f.dueDate ? formatDate(f.dueDate) : '–'}</b>. Zur Beauftragung genügt eine kurze Antwort per E-Mail
       oder Ihre Unterschrift unten. Termine stimmen wir nach Auftragseingang gemeinsam ab.</p>`;

  const intro =
    f.intro ||
    (isInvoice
      ? 'vielen Dank für Ihren Auftrag. Für die erbrachten Leistungen berechne ich Ihnen:'
      : 'vielen Dank für Ihr Interesse. Gern biete ich Ihnen folgende Leistungen an:');
  const who = (c?.contact ?? '').replace(/\s*\(.*\)\s*/g, '').trim();
  const greet = who ? `Guten Tag ${esc(who)},` : 'Sehr geehrte Damen und Herren,';

  const bank = [co.bank, co.iban && `IBAN ${co.iban}`, co.bic && `BIC ${co.bic}`].filter(Boolean).map((s) => esc(String(s))).join('<br>');
  const taxLine = [tax.taxNumber && `Steuernummer ${tax.taxNumber}`, tax.vatId && `USt-IdNr. ${tax.vatId}`].filter(Boolean).map((s) => esc(String(s))).join('<br>');

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
  @page { margin: 16mm 18mm 22mm; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color:#13201A; font-size:10.5pt; line-height:1.45; }
  header { display:flex; align-items:center; gap:12px; border-bottom:3px solid #0A6B44; padding-bottom:10px; }
  header .t { font-size:16pt; font-weight:700; color:#0A6B44; } header .s { color:#5B6B63; font-size:9pt; }
  .top { display:flex; justify-content:space-between; margin:26px 0 22px; gap:20px; }
  .sender { font-size:7.5pt; color:#5B6B63; text-decoration:underline; margin-bottom:6px; }
  .meta { font-size:9.5pt; } .meta td { padding:1px 0 1px 12px; } .meta td:first-child { color:#5B6B63; padding-left:0; }
  h1 { font-size:16pt; margin:0 0 4px; } h1 small { font-weight:400; color:#5B6B63; font-size:11pt; }
  table.items { width:100%; border-collapse:collapse; margin-top:14px; }
  table.items th { text-align:left; font-size:8.5pt; color:#5B6B63; border-bottom:1.5px solid #13201A; padding:5px 6px; }
  table.items td { vertical-align:top; padding:7px 6px; border-bottom:1px solid #E3E9E5; }
  td.n { width:18px; color:#5B6B63; } .r { text-align:right; white-space:nowrap; } .d { color:#5B6B63; font-size:9pt; margin-top:2px; }
  table.sum { margin:10px 0 0 auto; min-width:260px; border-collapse:collapse; } table.sum td { padding:3px 6px; }
  table.sum tr.g td { font-weight:700; font-size:12pt; border-top:1.5px solid #13201A; padding-top:6px; }
  .small { font-size:9pt; color:#5B6B63; }
  .sign { display:flex; gap:40px; margin-top:36px; } .sign div { flex:1; border-top:1px solid #13201A; padding-top:4px; font-size:8.5pt; color:#5B6B63; }
  footer { margin-top:34px; border-top:1px solid #DDE5E0; padding-top:8px; display:flex; gap:18px; font-size:8pt; color:#5B6B63; }
  footer div { flex:1; }
  </style></head><body>
  <header>${logoSvg(40)}<div><div class="t">${esc(co.name)}</div><div class="s">${contactLine(co)}</div></div></header>
  <div class="top">
    <div><div class="sender">${sender}</div><b>${esc(c?.name ?? '–')}</b>${c?.contact ? `<br>${esc(c.contact)}` : ''}${addr ? `<br>${addr}` : ''}</div>
    <table class="meta">
      <tr><td>${word}snr.</td><td><b>${esc(f.number)}</b></td></tr>
      <tr><td>Datum</td><td>${formatDate(f.date)}</td></tr>
      ${isInvoice && f.serviceDate ? `<tr><td>Leistungsdatum</td><td>${esc(f.serviceDate)}</td></tr>` : ''}
      ${isInvoice ? `<tr><td>Fällig am</td><td>${f.dueDate ? formatDate(f.dueDate) : '–'}</td></tr>` : `<tr><td>Gültig bis</td><td>${f.dueDate ? formatDate(f.dueDate) : '–'}</td></tr>`}
    </table>
  </div>
  <h1>${word} ${esc(f.number)}${f.title ? ` <small>· ${esc(f.title)}</small>` : ''}</h1>
  <p>${greet}</p><p>${nl2br(intro)}</p>
  <table class="items"><tr><th>Pos.</th><th>Leistung</th><th class="r">Menge</th><th class="r">Einzelpreis</th><th class="r">Gesamt</th></tr>${rows}</table>
  <table class="sum">${sumRows}</table>
  ${vatNote}
  ${terms}
  <p>Freundliche Grüße<br>${esc(co.owner)}</p>
  ${isInvoice ? '' : '<div class="sign"><div>Ort, Datum</div><div>Auftrag erteilt: Unterschrift, Stempel</div></div>'}
  <footer>
    <div><b>${esc(co.name)}</b><br>${esc(co.owner)}<br>${esc(co.street)}<br>${esc(co.zipCity)}</div>
    <div>${[co.phone && `Tel. ${co.phone}`, co.email, co.website].filter(Boolean).map((s) => esc(String(s))).join('<br>')}</div>
    <div>${bank || '<span style="color:#C62828">Bankverbindung fehlt</span>'}</div>
    <div>${taxLine || (isInvoice ? '<span style="color:#C62828">Steuernummer fehlt</span>' : '')}</div>
  </footer>
  </body></html>`;
}

export async function shareBeleg(f: FinanceDoc, c: Customer | undefined, co: Company, tax: TaxProfile) {
  const word = f.kind === 'rechnung' ? 'Rechnung' : 'Angebot';
  await printHtml(buildBelegHtml(f, c, co, tax), `${word} ${f.number} ${c?.name ?? ''}`.trim());
}
