# Website Brandschutzbüro (Arbeitsname „Brandschutzbüro Südhessen“)

Next.js 16 (App Router), React 19, TypeScript, reines CSS mit Design-Tokens.
Keine Animationsbibliothek: Die Scroll-Engine (`src/lib/site-runtime.ts`, ca. 150 Zeilen)
schreibt nur eine Zahl `--t`; die gesamte Choreografie steht in `src/app/styles/story.css`.

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
| Kapiteltexte und Zeitachse der Geschichte | `src/config/story.ts` |
| Farben, Schrift, Abstände | `src/app/styles/tokens.css` |
| Szenen (SVG-Illustrationen) | `src/components/scenes/` |

Platzhalter werden mit `ph("…")` angelegt, auf der Seite gelb gestrichelt markiert und von
`npm run check:launch` gemeldet. Solange `site.indexable = false` ist, sperrt `robots.txt`
alle Suchmaschinen.

## Storyboard und Match Cuts

| t | Szene | Übergang zur nächsten |
| --- | --- | --- |
| 0–2 | Gewerbegebäude in der Dämmerung, Gefahrenstellen | gleiche Geometrie wird Bauzeichnung |
| 2–3 | Bauzeichnung mit Risikoanalyse | Ansicht kippt in den Grundriss |
| 3–4 | Flucht- und Rettungsplan | Zoom auf die Ausgangstür in Bildmitte |
| 4–5 | Zweiflügelige Brandschutztür mit Feststellanlage | dieselbe Tür als Systemzeichnung |
| 5–6 | Prinzip Feststellanlage, Leitungen zeichnen sich | Türrahmen wird Tür am Flurende, Kamera fährt zurück |
| 6–7 | Flur mit Rettungszeichen und Leitsystem | Licht blendet auf den hellen Tisch |
| 7–8 | Beratungstisch mit Unterlagen | Unterlagen ordnen sich zum Raster der Leistungskarten |

Die rote Sicherheitslinie liegt auf der Achse x = 800 aller Szenen (Eingangspfosten,
Bauachse, Fluchtweg, Türstoß, Flurmitte), wächst per `scaleY` mit dem Scrollen, knickt bei den
Leistungen nach links ab und endet am Kontaktformular. Mobil liegt sie am linken Rand.

Ohne JavaScript oder bei `prefers-reduced-motion` zeigt die Seite eine statische Fassung:
jede Szene als Bild mit ihrem Text, alles bedienbar.

## Kontaktformular

`POST /api/contact` mit serverseitiger Validierung, Honeypot, Zeitfalle, Herkunftsprüfung
und Rate-Limit (5 Anfragen / 15 min je IP). Funktioniert auch ohne JavaScript (Weiterleitung).
Versand über SMTP des eigenen Mail-Anbieters oder Resend, siehe `.env.example`.
Ohne Konfiguration antwortet der Server in Produktion ehrlich mit „nicht eingerichtet“.

Hinweis: Das Rate-Limit liegt im Arbeitsspeicher. Auf Serverless-Hosting gilt es je Instanz.

## Erweiterungen

Buchbare Termine, Downloads und ein Schulungskatalog sind in `site.features` vorgesehen,
aber bewusst nicht als Attrappen eingebaut.
