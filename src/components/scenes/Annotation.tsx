import { C } from "./palette";

interface HotspotProps {
  x: number;
  y: number;
  label: string;
  /** Position des Beschriftungsankers */
  lx: number;
  ly: number;
  anchor?: "start" | "end";
  d: number;
  tone?: "red" | "green" | "stone";
}

/** Markierung mit Führungslinie und Beschriftung, blendet über --lp gestaffelt ein. */
export function Hotspot({ x, y, label, lx, ly, anchor = "start", d, tone = "red" }: HotspotProps) {
  const color = tone === "red" ? C.redSoft : tone === "green" ? C.greenGlow : C.stone4;
  const w = label.length * 8.1 + 22;
  const rx = anchor === "start" ? lx - 6 : lx - w + 6;
  return (
    <g className="anno" style={{ ["--d" as string]: d }}>
      <circle cx={x} cy={y} r={19} fill={color} fillOpacity={0.12} stroke={color} strokeWidth={1.5} />
      <circle cx={x} cy={y} r={3.5} fill={color} />
      <path d={`M${x} ${y - 19} L${x} ${ly + 12} L${lx} ${ly + 12}`} fill="none" stroke={color} strokeWidth={1} />
      <rect x={rx} y={ly - 10} width={w} height={26} fill={C.ink0} fillOpacity={0.82} />
      <text
        x={anchor === "start" ? lx + 5 : lx - 5}
        y={ly + 8}
        textAnchor={anchor}
        className="svg-mono"
        fontSize={13}
        fill={C.stone5}
      >
        {label}
      </text>
    </g>
  );
}

/** Kleine technische Beschriftung mit Linie, ohne Kreis */
export function Callout({
  x,
  y,
  lx,
  ly,
  label,
  anchor = "start",
  d,
  color = C.stone4,
}: {
  x: number;
  y: number;
  lx: number;
  ly: number;
  label: string;
  anchor?: "start" | "end";
  d: number;
  color?: string;
}) {
  return (
    <g className="anno" style={{ ["--d" as string]: d }}>
      <circle cx={x} cy={y} r={3} fill={color} />
      <path d={`M${x} ${y} L${lx} ${ly}`} stroke={color} strokeWidth={1} fill="none" />
      <text
        x={anchor === "start" ? lx + 8 : lx - 8}
        y={ly + 4}
        textAnchor={anchor}
        className="svg-mono"
        fontSize={13}
        fill={C.stone5}
      >
        {label}
      </text>
    </g>
  );
}

/** Schriftfeld rechts unten, wie auf einem Planblatt */
export function TitleBlock({ x, y, lines, d = 0 }: { x: number; y: number; lines: string[]; d?: number }) {
  const h = 22 + lines.length * 20;
  return (
    <g className="anno" style={{ ["--d" as string]: d }}>
      <rect x={x} y={y} width={240} height={h} fill="none" stroke={C.lineDim} strokeWidth={1} />
      <path d={`M${x} ${y + 30} H${x + 240}`} stroke={C.lineDim} strokeWidth={1} />
      {lines.map((l, i) => (
        <text
          key={l}
          x={x + 12}
          y={y + 20 + i * 20 + (i > 0 ? 8 : 0)}
          className="svg-mono"
          fontSize={i === 0 ? 12 : 11}
          letterSpacing={i === 0 ? 1.5 : 0.4}
          fill={i === 0 ? C.stone5 : C.stone3}
        >
          {l}
        </text>
      ))}
    </g>
  );
}
