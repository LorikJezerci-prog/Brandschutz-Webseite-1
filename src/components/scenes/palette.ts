/** Farbwelt der Szenen. Entspricht den Tokens in tokens.css. */
export const C = {
  ink0: "#0e1012",
  ink1: "#14171a",
  ink2: "#1b1f23",
  ink3: "#242a2f",
  ink4: "#30363c",
  stone1: "#4a4b4b",
  stone2: "#6a6965",
  stone3: "#8e8a83",
  stone4: "#b7b1a6",
  stone5: "#d5cfc4",
  paper: "#e8e3da",
  paper2: "#f6f3ee",
  glass1: "#182027",
  glass2: "#27313a",
  warm: "#e2c697",
  red: "#b5362f",
  redSoft: "#cf5047",
  green: "#3d8a62",
  greenGlow: "#62b388",
  metal: "#9aa3ab",
  line: "#8f9ba5",
  lineDim: "#56616a",
} as const;

export interface SceneProps {
  /** Präfix für SVG-IDs, damit eine Szene mehrfach auf einer Seite stehen kann */
  id: string;
  /** Reduzierte Fassung ohne Beschriftungen, z. B. für Leistungskarten */
  mini?: boolean;
}

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);
