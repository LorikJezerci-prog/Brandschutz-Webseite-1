# Brandschutz Ried – Begehungs-App

Arbeitswerkzeug für Brandschutzbegehungen: Kunden verwalten, vor Ort 38 Prüfpunkte in 7 Bereichen abhaken,
Mängel mit Foto, Notiz und Dringlichkeit festhalten, daraus einen PDF-Mängelbericht im Firmenlayout erzeugen und teilen.
Dazu Termine mit Erinnerung als Benachrichtigung, ein Finanzamt-Bereich (Steuerdaten, Fristen), Notizen, Praxistipps
und Adressen direkt in der Karten-App (Karte und Route). Alles wird offline auf dem Gerät gespeichert, es gibt keinen Server und kein Konto.

Expo SDK 58, Expo Router, TypeScript.

## Auf dem eigenen Handy starten

1. Node.js (LTS) installieren.
2. Im Ordner `npm install`, dann `npx expo start`.
3. App **Expo Go** aus dem App Store / Play Store installieren und den QR-Code aus dem Terminal scannen.
   Handy und Computer müssen im selben WLAN sein.

Im Browser ansehen: `npx expo start --web` (ohne Kamera und Erinnerungen; Bericht nur als Vorschau).

## Aufbau

| Bereich | Datei |
| --- | --- |
| Prüfkatalog (Punkte, Grundlagen) | `src/data/checklist.ts` |
| Absenderdaten im Bericht | `src/data/profile.ts` |
| Leistungen und Schnellcheck (aus der Website) | `src/data/services.ts`, `src/data/quick-check.ts` |
| PDF-Bericht | `src/utils/report.ts` |
| Speicher (AsyncStorage) | `src/store/` |
| Erinnerungen (expo-notifications) | `src/utils/reminders.ts` |
| Karten-App | `src/utils/maps.ts` |
| Tipps | `src/data/tips.ts` |
| Screens | `src/app/` |

Der Titel „Brandschutzbeauftragter“ erscheint im Bericht erst für Begehungen ab dem 03.12.2026
(`profile.qualifiedFrom`).

## Bewusst noch nicht drin

- Keine Datensicherung/Cloud: geht das Handy verloren, sind die Daten weg. Vor dem echten Einsatz Export oder Backup ergänzen.
- Keine Store-Veröffentlichung, kein EAS-Projekt. Für eine installierbare App ohne Expo Go: `eas build` (kostenloser Expo-Account).

## Web-App (GitHub Pages)

Die Web-Version liegt auf dem Branch `gh-pages` und läuft unter
https://lorikjezerci-prog.github.io/Brandschutz-Webseite-1/ . Am iPhone in Safari öffnen,
Teilen → „Zum Home-Bildschirm“, dann startet sie im Vollbild. Neu bauen:
`npx expo export -p web`, danach Meta-Tags/404.html/.nojekyll ergänzen und auf `gh-pages` pushen.
Daten bleiben im Browser des Geräts. Erinnerungen und PDF-Teilen nur in der Handy-App.
