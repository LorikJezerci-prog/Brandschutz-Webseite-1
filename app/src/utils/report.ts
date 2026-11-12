import { checklist } from '@/data/checklist';
import { isQualified, profile } from '@/data/profile';
import { Company, Customer, Inspection, Priority, priorityLabel } from '@/store/types';
import { contactLine, esc, logoSvg, printHtml } from './print';
import { formatDate, itemsOf, progress } from './format';
import { photoAsDataUri } from './photos';

const prioOrder: Priority[] = ['sofort', 'kurzfristig', 'mittelfristig'];

export async function buildReportHtml(i: Inspection, c: Customer | undefined, co: Company) {
  const items = itemsOf(i);
  const p = progress(i);
  const defects = items
    .filter((x) => i.results[x.id]?.status === 'mangel')
    .sort(
      (a, b) =>
        prioOrder.indexOf(i.results[a.id]?.priority ?? 'mittelfristig') -
        prioOrder.indexOf(i.results[b.id]?.priority ?? 'mittelfristig'),
    );

  const defectRows = await Promise.all(
    defects.map(async (x, n) => {
      const f = i.results[x.id];
      const cat = checklist.find((k) => k.id === x.categoryId)?.title ?? '';
      const photos = (await Promise.all(f.photos.map(photoAsDataUri))).filter(Boolean);
      const prio = f.priority ?? 'mittelfristig';
      return `
      <div class="defect">
        <div class="dh"><span class="no">${n + 1}</span><b>${esc(x.title)}</b><span class="prio ${prio}">${priorityLabel[prio]}</span></div>
        <div class="meta">${esc(cat)}${x.basis ? ' · ' + esc(x.basis) : ''}</div>
        ${f.note ? `<p>${esc(f.note).replace(/\n/g, '<br>')}</p>` : ''}
        ${f.measure ? `<p class="measure"><b>Maßnahme:</b> ${esc(f.measure).replace(/\n/g, '<br>')}</p>` : ''}
        ${photos.length ? `<div class="photos">${photos.map((src) => `<img src="${src}">`).join('')}</div>` : ''}
      </div>`;
    }),
  );

  const overview = checklist
    .map((cat) => {
      const rows = items
        .filter((x) => x.categoryId === cat.id)
        .map((x) => {
          const s = i.results[x.id]?.status;
          const label = s === 'ok' ? '✓ in Ordnung' : s === 'mangel' ? '✗ Mangel' : s === 'na' ? '– entfällt' : 'nicht geprüft';
          return `<tr><td>${esc(x.title)}</td><td class="s ${s ?? 'open'}">${label}</td></tr>`;
        })
        .join('');
      return `<tr class="cat"><td colspan="2">${esc(cat.title)}</td></tr>${rows}`;
    })
    .join('');

  const counts = prioOrder.map((pr) => ({ pr, n: defects.filter((x) => (i.results[x.id].priority ?? 'mittelfristig') === pr).length }));

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
  @page { margin: 18mm 16mm; }
  body { font-family: -apple-system, Helvetica, Arial, sans-serif; color:#13201A; font-size:11pt; line-height:1.4; }
  header { display:flex; align-items:center; gap:12px; border-bottom:3px solid #0A6B44; padding-bottom:10px; margin-bottom:16px; }
  header .t { font-size:16pt; font-weight:700; color:#0A6B44; } header .s { color:#5B6B63; font-size:9.5pt; }
  h1 { font-size:18pt; margin:0 0 4px; } h2 { font-size:13pt; color:#0A6B44; margin:22px 0 8px; }
  .grid { display:grid; grid-template-columns: 140px 1fr; gap:3px 10px; font-size:10.5pt; }
  .grid div:nth-child(odd) { color:#5B6B63; }
  .kpi { display:flex; gap:10px; margin-top:12px; } .kpi div { flex:1; border:1px solid #DDE5E0; border-radius:8px; padding:8px; }
  .kpi b { font-size:16pt; display:block; }
  .defect { border:1px solid #DDE5E0; border-radius:8px; padding:10px 12px; margin-bottom:10px; page-break-inside: avoid; }
  .dh { display:flex; align-items:center; gap:8px; } .dh b { flex:1; }
  .no { background:#0A6B44; color:#fff; border-radius:50%; width:22px; height:22px; display:inline-flex; align-items:center; justify-content:center; font-size:9pt; }
  .prio { font-size:9pt; padding:2px 8px; border-radius:99px; font-weight:600; }
  .prio.sofort { background:#FDECEC; color:#C62828; } .prio.kurzfristig { background:#FFF3DF; color:#A15C00; } .prio.mittelfristig { background:#E7F2EC; color:#07502F; }
  .measure b { color:#0A6B44; } .meta { color:#5B6B63; font-size:9.5pt; margin:3px 0 0 30px; } .defect p { margin:6px 0 0 30px; }
  .photos { display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 0 30px; } .photos img { width:150px; height:112px; object-fit:cover; border-radius:6px; }
  table { width:100%; border-collapse:collapse; font-size:10pt; } td { padding:4px 6px; border-bottom:1px solid #EEF2F0; }
  tr.cat td { background:#E7F2EC; font-weight:700; color:#07502F; } td.s { width:120px; } td.s.mangel { color:#C62828; font-weight:600; } td.s.ok { color:#0A6B44; } td.s.open { color:#A15C00; }
  .note { color:#5B6B63; font-size:9pt; margin-top:24px; border-top:1px solid #DDE5E0; padding-top:8px; }
  .sign { display:flex; gap:40px; margin-top:40px; } .sign div { flex:1; border-top:1px solid #13201A; padding-top:4px; font-size:9pt; color:#5B6B63; }
  </style></head><body>
  <header>${logoSvg()}<div><div class="t">${esc(co.name)}</div><div class="s">${contactLine(co)}</div></div></header>
  <h1>Bericht zur Brandschutzbegehung</h1>
  <div class="grid">
    <div>Kunde</div><div>${esc(c?.name ?? '–')}</div>
    <div>Objekt / Bereich</div><div>${esc(i.object || '–')}</div>
    <div>Anschrift</div><div>${esc(c?.address || '–')}</div>
    <div>Datum</div><div>${formatDate(i.date)}</div>
    <div>Teilnehmer</div><div>${esc(i.participants || '–')}</div>
    <div>Durchgeführt von</div><div>${esc(co.owner)}${isQualified(new Date(i.date + 'T12:00:00')) ? ', ' + esc(profile.role) : ''}</div>
  </div>
  <div class="kpi">
    <div><b>${p.done}/${p.total}</b>Punkte geprüft</div>
    <div><b style="color:#C62828">${counts[0].n}</b>sofort beheben</div>
    <div><b style="color:#A15C00">${counts[1].n}</b>bis 4 Wochen</div>
    <div><b style="color:#07502F">${counts[2].n}</b>bis 3 Monate</div>
  </div>
  ${i.summary ? `<h2>Zusammenfassung</h2><p>${esc(i.summary).replace(/\n/g, '<br>')}</p>` : ''}
  <h2>Festgestellte Mängel und Maßnahmen</h2>
  ${defectRows.length ? defectRows.join('') : '<p>Bei dieser Begehung wurden keine Mängel festgestellt.</p>'}
  <h2>Übersicht aller Prüfpunkte</h2>
  <table>${overview}</table>
  <div class="note">Dieser Bericht dokumentiert den Zustand zum Zeitpunkt der Begehung. Er ist eine Empfehlung an die Unternehmensleitung; die Verantwortung für den Brandschutz und die Umsetzung der Maßnahmen bleibt beim Unternehmer. Er ersetzt keine Prüfungen durch Sachverständige oder Sachkundige.</div>
  <div class="sign"><div>Ort, Datum, ${esc(co.owner)}</div><div>Kenntnisnahme Unternehmen</div></div>
  </body></html>`;
}

export async function shareReport(i: Inspection, c: Customer | undefined, co: Company) {
  const html = await buildReportHtml(i, c, co);
  await printHtml(html, `Maengelbericht ${c?.name ?? ''} ${i.date}`.trim());
}
