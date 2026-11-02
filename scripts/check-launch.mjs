// Prüft vor der Veröffentlichung, ob noch Platzhalter oder Vorabschalter aktiv sind.
import { readFileSync } from "node:fs";

const site = readFileSync(new URL("../src/config/site.ts", import.meta.url), "utf8");
const problems = [];

for (const m of site.matchAll(/ph\("([^"]+)"\)/g)) problems.push(`Platzhalter: ${m[1]}`);
if (/indexable:\s*false/.test(site)) problems.push("Suchmaschinen sind gesperrt (site.indexable = false)");
// Die Seite beschreibt den Stand nach bestandenem Lehrgang. Vorher wäre das irreführende Werbung.
const notBefore = site.match(/notBefore:\s*"(\d{4}-\d{2}-\d{2})"/)?.[1];
if (notBefore && new Date().toISOString().slice(0, 10) < notBefore)
  problems.push(`Lehrgang noch nicht abgeschlossen: frühestens ab ${notBefore} veröffentlichen`);
if (/courseCertificate:\s*false/.test(site))
  problems.push("Zeugnis Brandschutzbeauftragter nicht bestätigt (launch.courseCertificate = false)");
if (!process.env.NEXT_PUBLIC_SITE_URL) problems.push("NEXT_PUBLIC_SITE_URL ist nicht gesetzt");
if (!process.env.CONTACT_TO_EMAIL) problems.push("CONTACT_TO_EMAIL ist nicht gesetzt (Formular kann nicht versenden)");
if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) problems.push("Kein Versandweg konfiguriert (SMTP_HOST oder RESEND_API_KEY)");

if (problems.length) {
  console.log("Noch nicht bereit für die Veröffentlichung:\n");
  for (const p of problems) console.log("  • " + p);
  process.exit(1);
}
console.log("Keine offenen Platzhalter gefunden.");
