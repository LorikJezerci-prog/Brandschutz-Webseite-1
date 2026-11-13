# Website Brandschutz Ried

Next.js 16 (App Router), React 19, TypeScript, reines CSS mit Design-Tokens.
Schlicht in Rettungsgrün (#0A6B44, Logofarbe) und Weiß. Kein Animations-Framework;
die kleinen Verhaltensweisen (Menü, Fluchtweg-Leiste, „nach oben“, Countdown,
Schnellcheck) stehen in `src/lib/site-runtime.ts`.

## Starten

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Unit-Tests Formular (Validierung, Rate-Limit, Versand)
npm run build && npm start
npm run check:launch   # listet alle offenen Platzhalter vor der Veröffentlichung
```

## Wo was geändert wird

| Was | Datei |
| --- | --- |
| Firmenname, Kontakt, Impressumsdaten, Qualifikationen | `src/config/site.ts` |
| Leistungen freischalten (Lehrgang bestanden usw.) | `capabilities` in `src/config/site.ts` |
| Texte und Inhalte der Leistungen | `src/config/services.ts` |
| Farben, Schrift, Abstände | `src/app/styles/tokens.css` |
| Beispielbilder (SVG, später durch Fotos ersetzbar) | `src/components/Illustration.tsx` |
| Logo | `src/components/Logo.tsx`, `src/app/icon.svg` |
| „Was ich anbiete und was nicht“ | `src/components/home/Scope.tsx` |
| Schnellcheck (Regeln) | `src/lib/quick-check.ts` |

Platzhalter werden mit `ph("…")` angelegt, auf der Seite gelb gestrichelt markiert und von
`npm run check:launch` gemeldet. Solange `site.indexable = false` ist, sperrt `robots.txt`
alle Suchmaschinen.

## Hosting und Kontaktformular

Statischer Export (`output: "export"`) für all-inkl. `npm run build` erzeugt den Ordner `out/`.
Das Formular schickt an `public/kontakt.php` (Validierung, Honeypot, Zeitfalle, Herkunftsprüfung,
Rate-Limit über gehashte IP, Versand per PHP `mail()` vom Absender `website@brandschutz-ried.de`).
Sicherheits-Header und HTTPS/www-Weiterleitung: `public/.htaccess`.

Hochladen: GitHub Action `.github/workflows/deploy-allinkl.yml` nach jedem Push (FTPS, Secrets
`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`).

Vorstart-Modus: Solange `launch.courseCertificate = false` ist, zeigt die Seite den Starttermin,
die Ausbildung als „Abschluss 12/2026“ und blendet Versicherer und USt-IdNr. aus, wenn sie `null` sind.

## Erweiterungen

Buchbare Termine, Downloads und ein Schulungskatalog sind in `site.features` vorgesehen,
aber bewusst nicht als Attrappen eingebaut.
