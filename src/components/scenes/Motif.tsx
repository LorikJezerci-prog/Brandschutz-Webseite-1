import type { CSSProperties } from "react";
import type { Motif } from "@/config/services";
import { Blueprint } from "./Blueprint";
import { Corridor } from "./Corridor";
import { DoorSystem } from "./DoorSystem";
import { EscapePlan } from "./EscapePlan";
import { Facade } from "./Facade";
import { FireDoor } from "./FireDoor";

const scenes = {
  facade: Facade,
  blueprint: Blueprint,
  plan: EscapePlan,
  door: FireDoor,
  system: DoorSystem,
  corridor: Corridor,
} as const;

/** Bildausschnitte der Szenen für Karten und Unterlagen */
export const crops: Record<Motif, string> = {
  facade: "160 180 1300 650",
  blueprint: "100 170 1440 720",
  plan: "240 70 1120 720",
  door: "380 60 840 820",
  system: "380 20 1000 900",
  corridor: "300 150 1000 760",
};

const settled = { "--lp": 1, "--out": 0 } as CSSProperties;

interface MotifProps {
  motif: Motif;
  id: string;
  className?: string;
  /** Für die Verwendung innerhalb einer anderen SVG */
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;
}

/** Ein wiedererkennbares Motiv aus der Geschichte, im Endzustand der Szene */
export function MotifImage({ motif, id, className, ...box }: MotifProps) {
  const Scene = scenes[motif];
  return (
    <svg
      className={className}
      viewBox={crops[motif]}
      preserveAspectRatio="xMidYMid slice"
      style={settled}
      aria-hidden="true"
      focusable="false"
      {...box}
    >
      <Scene id={id} mini />
    </svg>
  );
}
