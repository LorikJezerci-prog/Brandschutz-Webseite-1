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

## Kontaktformular

`POST /api/contact` mit serverseitiger Validierung, Honeypot, Zeitfalle, Herkunftsprüfung
und Rate-Limit (5 Anfragen / 15 min je IP). Funktioniert auch ohne JavaScript (Weiterleitung).
Versand über SMTP des eigenen Mail-Anbieters oder Resend, siehe `.env.example`.
Ohne Konfiguration antwortet der Server in Produktion ehrlich mit „nicht eingerichtet“.

Hinweis: Das Rate-Limit liegt im Arbeitsspeicher. Auf Serverless-Hosting gilt es je Instanz.

## Erweiterungen

Buchbare Termine, Downloads und ein Schulungskatalog sind in `site.features` vorgesehen,
aber bewusst nicht als Attrappen eingebaut.
