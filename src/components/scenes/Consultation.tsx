import type { CSSProperties } from "react";
import type { Motif } from "@/config/services";
import { MotifImage } from "./Motif";
import { C, type SceneProps } from "./palette";

interface Doc {
  motif: Motif;
  w: number;
  h: number;
  compact?: boolean;
  /** Lage auf dem Tisch */
  from: [number, number, number];
  /** Endlage im Raster der Leistungskarten */
  to: [number, number];
}

/** Gleiche Reihenfolge und Proportionen wie die Leistungsübersicht */
const docs: Doc[] = [
  { motif: "facade", w: 440, h: 280, from: [430, 250, -7], to: [260, 140] },
  { motif: "blueprint", w: 610, h: 280, from: [690, 200, 4], to: [730, 140] },
  { motif: "plan", w: 610, h: 280, from: [360, 420, 3], to: [260, 450] },
  { motif: "corridor", w: 440, h: 280, from: [890, 410, -5], to: [900, 450] },
  { motif: "door", w: 525, h: 130, compact: true, from: [560, 650, 6], to: [260, 760] },
  { motif: "system", w: 525, h: 130, compact: true, from: [830, 670, -3], to: [815, 760] },
];

/**
 * Szene 7: Beratungstisch in der Aufsicht. Die Unterlagen zeigen die Motive
 * der Geschichte und ordnen sich zum Raster der Leistungskarten.
 */
export function Consultation({ id }: SceneProps) {
  const p = (n: string) => `${id}-${n}`;
  return (
    <g>
      <defs>
        <radialGradient id={p("light")} cx="0.25" cy="0.2" r="1">
          <stop offset="0" stopColor="#f8faf8" />
          <stop offset="1" stopColor="#e2e9e4" />
        </radialGradient>
        <linearGradient id={p("pen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3d40" />
          <stop offset="1" stopColor="#16181a" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill={`url(#${p("light")})`} />

      {/* Kaffeetasse und Stift, nur am Rand */}
      <g className="props">
        <circle cx={1470} cy={190} r={64} fill="#000" opacity="0.08" transform="translate(10 12)" />
        <circle cx={1470} cy={190} r={64} fill="#f7f4ee" />
        <circle cx={1470} cy={190} r={50} fill="#5b4330" />
        <circle cx={1470} cy={190} r={50} fill="none" stroke="#e7e1d6" strokeWidth="6" />
        <path d="M1534 190 h26" stroke="#f7f4ee" strokeWidth="14" strokeLinecap="round" />
        <g transform="translate(1390 520) rotate(62)">
          <rect x={4} y={6} width={260} height={14} rx={7} fill="#000" opacity="0.1" />
          <rect width={260} height={14} rx={7} fill={`url(#${p("pen")})`} />
          <rect x={200} width={6} height={14} fill="#b8b1a5" />
          <path d="M260 3 L282 7 L260 11 Z" fill="#9aa3ab" />
        </g>
        <g transform="translate(70 760) rotate(-8)">
          <rect width={150} height={34} fill="#000" opacity="0.06" transform="translate(6 8)" />
          <rect width={150} height={34} fill="#f1ede5" stroke="#c7c0b3" />
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${8 + i * 10} 0 V${i % 5 === 0 ? 14 : 8}`} stroke="#8e8a83" />
          ))}
        </g>
      </g>

      {docs.map((d, i) => {
        const inset = 12;
        const imgW = d.compact ? d.w * 0.42 : d.w - inset * 2;
        const imgH = d.compact ? d.h - inset * 2 : d.h - 66;
        const style = {
          "--x0": d.from[0],
          "--y0": d.from[1],
          "--r0": d.from[2],
          "--x1": d.to[0],
          "--y1": d.to[1],
          "--i": i,
        } as CSSProperties;
        return (
          <g key={d.motif} className="doc" style={style}>
            <rect x={8} y={14} width={d.w} height={d.h} fill="#000" opacity="0.1" />
            <rect width={d.w} height={d.h} fill={C.paper2} />
            <MotifImage motif={d.motif} id={`${id}-${d.motif}`} x={inset} y={inset} width={imgW} height={imgH} />
            {d.compact ? (
              <g>
                <rect x={imgW + 32} y={30} width={d.w * 0.34} height={10} fill="#3b3e41" opacity="0.8" />
                <rect x={imgW + 32} y={56} width={d.w * 0.44} height={6} fill="#a8a299" />
                <rect x={imgW + 32} y={72} width={d.w * 0.38} height={6} fill="#a8a299" />
              </g>
            ) : (
              <g>
                <rect x={inset} y={d.h - 40} width={d.w * 0.32} height={10} fill="#3b3e41" opacity="0.8" />
                <rect x={inset} y={d.h - 22} width={d.w * 0.56} height={6} fill="#a8a299" />
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
}
