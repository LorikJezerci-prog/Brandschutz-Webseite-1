# Brandschutz Ried – Begehungs-App

Arbeitswerkzeug für Brandschutzbegehungen: Kunden verwalten, vor Ort 38 Prüfpunkte in 7 Bereichen abhaken,
Mängel mit Foto, Notiz und Dringlichkeit festhalten, daraus einen PDF-Mängelbericht im Firmenlayout erzeugen und teilen.
Alles wird offline auf dem Gerät gespeichert, es gibt keinen Server und kein Konto.

Expo SDK 58, Expo Router, TypeScript.

## Auf dem eigenen Handy starten

1. Node.js (LTS) installieren.
2. Im Ordner `npm install`, dann `npx expo start`.
3. App **Expo Go** aus dem App Store / Play Store installieren und den QR-Code aus dem Terminal scannen.
   Handy und Computer müssen im selben WLAN sein.

Im Browser ansehen: `npx expo start --web` (ohne Kamera; PDF öffnet den Druckdialog).

## Aufbau

| Bereich | Datei |
| --- | --- |
| Prüfkatalog (Punkte, Grundlagen) | `src/data/checklist.ts` |
| Absenderdaten im Bericht | `src/data/profile.ts` |
| Leistungen und Schnellcheck (aus der Website) | `src/data/services.ts`, `src/data/quick-check.ts` |
| PDF-Bericht | `src/utils/report.ts` |
| Speicher (AsyncStorage) | `src/store/` |
| Screens | `src/app/` |

Der Titel „Brandschutzbeauftragter“ erscheint im Bericht erst für Begehungen ab dem 03.12.2026
(`profile.qualifiedFrom`).

## Bewusst noch nicht drin

- Keine Datensicherung/Cloud: geht das Handy verloren, sind die Daten weg. Vor dem echten Einsatz Export oder Backup ergänzen.
- Keine Store-Veröffentlichung, kein EAS-Projekt. Für eine installierbare App ohne Expo Go: `eas build` (kostenloser Expo-Account).
