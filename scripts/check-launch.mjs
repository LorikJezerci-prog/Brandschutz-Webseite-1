// Prüft vor dem Hochladen, ob die Seite veröffentlicht werden darf.
// Vorstart-Modus (courseCertificate: false): nur Platzhalter sind verboten.
// Endgültiger Start (courseCertificate: true): zusätzlich Datum, Versicherer und Umsatzsteuer-Entscheidung.
import { readFileSync } from "node:fs";

const site = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const problems = [];
const notes = [];

for (const m of site.matchAll(/ph\("([^"…]+)"\)/g)) problems.push(`Platzhalter: ${m[1]}`);

const certified = /courseCertificate:\s*true/.test(site);
const notBefore = site.match(/notBefore:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
const today = new Date().toISOString().slice(0, 10);

if (certified) {
  if (notBefore && today < notBefore) problems.push(`Zeugnis gesetzt, aber vor ${notBefore}`);
  if (/insurer:\s*null/.test(site)) problems.push("Berufshaftpflicht (Versicherer) fehlt im Impressum");
  if (/vatId:\s*null/.test(site) && !/kleinunternehmer:\s*true/.test(site))
    notes.push("USt-IdNr. leer: nur korrekt, wenn keine vorhanden ist (z. B. Kleinunternehmer)");
} else {
  notes.push("Vorstart-Modus aktiv: Starttermin sichtbar, Abschluss als 12/2026");
  if (/insurer:\s*null/.test(site)) notes.push("Versicherer bis zum Start nachtragen");
  if (/vatId:\s*null/.test(site)) notes.push("Umsatzsteuer-Status bis zum Start klären");
}
if (/indexable:\s*false/.test(site)) notes.push("Suchmaschinen gesperrt (site.indexable = false)");

for (const n of notes) console.log("  Hinweis: " + n);
if (problems.length) {
  console.log("\nNicht veröffentlichen:\n");
  for (const p of problems) console.log("  • " + p);
  process.exit(1);
}
console.log("\nBereit zum Hochladen.");
