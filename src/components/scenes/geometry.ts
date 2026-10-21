/**
 * Gemeinsame Gebäudegeometrie für Fassade und Bauzeichnung.
 * Beide Szenen lesen dieselben Koordinaten, damit der Match Cut exakt sitzt.
 * Die zentrale Achse liegt bei x = 800.
 */
export const B = {
  x0: 300,
  x1: 1300,
  top: 250,
  attic: 282,
  slab1: 440, // Decke über 1. OG
  slab0: 600, // Decke über EG
  ground: 760,
  stair: { x0: 1120, x1: 1200 },
  entrance: { x0: 740, x1: 860, top: 650 },
  canopy: { x0: 650, x1: 950, y: 596, h: 14 },
  hall: { x0: 110, x1: 300, top: 520 },
  hallExit: { x0: 170, x1: 214, top: 690 },
  dock: { x0: 1300, x1: 1520, top: 560 },
  roller: { x0: 1320, x1: 1392, top: 640 },
  pallets: { x0: 1404, x1: 1468 },
} as const;

/** Lisenen der Obergeschosse, im Raster von 40, ohne Treppenhaus */
export const fins = Array.from({ length: 25 }, (_, i) => 320 + i * 40).filter(
  (x) => x < B.stair.x0 - 10 || x > B.stair.x1 + 10,
);

/** EG-Pfosten im Raster von 80 */
export const mullions = Array.from({ length: 12 }, (_, i) => B.x0 + 80 + i * 80).filter(
  (x) => x < B.entrance.x0 || x > B.entrance.x1,
);

/** Einzelne beleuchtete Fensterfelder (Index zwischen zwei Lisenen) */
export const litUpper = [1, 4, 5, 9, 13, 14, 18, 21];
export const litLower = [2, 6, 7, 11, 16, 20];
