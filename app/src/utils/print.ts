import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import type { Company } from '@/store/types';

const FLAME =
  'M50 19.5C54.5 29 68.5 39.5 68.5 57C68.5 70.5 60 79.2 50 79.2C40 79.2 31.5 70.5 31.5 57C31.5 48 35.5 42 40.5 36.8C41.3 42 43 45.6 45.8 47.6C44.8 38 46.3 28 50 19.5Z';
const ARROW = 'M50 47L59.8 57.8H54.4V71.2H45.6V57.8H40.2Z';
export const logoSvg = (size = 44) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 100 100"><rect width="100" height="100" rx="21" fill="#0A6B44"/><path fill="#fff" d="${FLAME}"/><path fill="#0A6B44" d="${ARROW}"/></svg>`;

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>');

/** Briefkopf-Zeile mit Kontakt */
export const contactLine = (c: Company) =>
  [c.owner, [c.street, c.zipCity].filter(Boolean).join(', '), c.phone, c.email, c.website].filter(Boolean).map(esc).join(' · ');

/** PDF erzeugen und teilen (App) bzw. Druckdialog öffnen (Web/iPhone-Home-Bildschirm) */
export async function printHtml(html: string, title: string) {
  if (Platform.OS === 'web') {
    printInBrowser(html, title);
    return;
  }
  const { uri } = await Print.printToFileAsync({ html });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: title });
}

/**
 * Web: in einem unsichtbaren Rahmen drucken.
 * Im Druckdialog von iOS lässt sich das PDF über „Teilen“ sichern oder verschicken.
 */
function printInBrowser(html: string, title: string) {
  const old = document.getElementById('bericht-druck');
  if (old) old.remove();
  const frame = document.createElement('iframe');
  frame.id = 'bericht-druck';
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;';
  document.body.appendChild(frame);
  const doc = frame.contentWindow!.document;
  const clean = title.replace(/[<>&"]/g, '');
  doc.open();
  doc.write(html.replace('<head>', `<head><title>${clean}</title>`));
  doc.close();
  const go = () => {
    const prevTitle = document.title;
    document.title = clean;
    frame.contentWindow!.focus();
    frame.contentWindow!.print();
    setTimeout(() => (document.title = prevTitle), 1000);
  };
  const imgs = Array.from(doc.images);
  Promise.all(imgs.map((im) => (im.complete ? null : new Promise((r) => { im.onload = im.onerror = r; })))).then(() =>
    setTimeout(go, 150),
  );
}
