/**
 * Geometrie der zweiflügeligen Brandschutztür. Tür und Systemzeichnung nutzen
 * dieselben Werte. Der Stoß der beiden Flügel liegt auf der Achse x = 800,
 * die Türmitte bei y = 500 (Zielpunkt des Zooms aus dem Fluchtplan).
 */
export const D = {
  frame: { x0: 610, x1: 990, y0: 170, y1: 830 },
  leafL: { x0: 628, x1: 799 },
  leafR: { x0: 801, x1: 972 },
  leafY: { y0: 188, y1: 828 },
  visionL: { x0: 682, x1: 742 },
  visionR: { x0: 858, x1: 918 },
  visionY: { y0: 280, y1: 520 },
  bar: { y: 556, h: 14 },
  closerL: { x0: 650, x1: 742 },
  closerR: { x0: 858, x1: 950 },
  closerY: { y0: 200, y1: 222 },
  sturz: { x0: 762, x1: 838, y0: 104, y1: 132 },
  magnetL: { x: 572, y: 236 },
  magnetR: { x: 1028, y: 236 },
  release: { x: 1072, y: 520 },
  floor: 830,
} as const;
