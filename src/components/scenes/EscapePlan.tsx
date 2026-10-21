import { DraftGrid, Vignette } from "./Blueprint";
import { Sign, type SignKind } from "./Signs";
import { C, type SceneProps } from "./palette";

type Gap = [number, number];

const hseg = (y: number, x0: number, x1: number, gaps: Gap[] = []) => {
  let d = "";
  let x = x0;
  for (const [a, b] of gaps) {
    d += `M${x} ${y} H${a} `;
    x = b;
  }
  return d + `M${x} ${y} H${x1} `;
};
const vseg = (x: number, y0: number, y1: number, gaps: Gap[] = []) => {
  let d = "";
  let y = y0;
  for (const [a, b] of gaps) {
    d += `M${x} ${y} V${a} `;
    y = b;
  }
  return d + `M${x} ${y} V${y1} `;
};

const upperDoors: Gap[] = [[620, 650], [760, 790], [900, 930], [1040, 1070], [1140, 1180], [1230, 1260]];
const lowerDoors: Gap[] = [[680, 710], [900, 930], [1130, 1160]];

const outer =
  hseg(140, 300, 1300) +
  hseg(500, 300, 1300, [[768, 832]]) +
  vseg(300, 140, 500, [[420, 464]]) +
  vseg(1300, 140, 500, [[290, 334]]);

const inner =
  vseg(560, 140, 500, [[290, 330]]) +
  hseg(280, 560, 1300, upperDoors) +
  hseg(340, 560, 770, [[680, 710]]) +
  hseg(340, 830, 1300, [[900, 930], [1130, 1160]]) +
  vseg(770, 340, 500) +
  vseg(830, 340, 500) +
  vseg(1060, 340, 500) +
  [700, 840, 980].map((x) => vseg(x, 140, 280)).join("") +
  vseg(1120, 140, 280) +
  vseg(1200, 140, 280) +
  hseg(230, 1120, 1200, [[1145, 1185]]);

/** Türanschläge als Viertelkreise */
const swings = [
  ...upperDoors.map(([a, b]) => `M${a} 280 V${280 - (b - a)} A${b - a} ${b - a} 0 0 1 ${b} 280`),
  ...lowerDoors.map(([a, b]) => `M${a} 340 V${340 + (b - a)} A${b - a} ${b - a} 0 0 0 ${b} 340`),
  "M560 290 H600 A40 40 0 0 1 560 330",
  "M300 420 H262 A44 44 0 0 0 300 464",
  "M1300 290 H1344 A44 44 0 0 1 1300 334",
].join(" ");

/** Zweiflügelige Ausgangstür in Bildmitte (800 / 500): Zielpunkt für den Zoom */
const exitDoor = "M768 500 V532 A32 32 0 0 0 800 500 M832 500 V532 A32 32 0 0 1 800 500";

const chevron = (x: number, y: number, rot: number, k: number) => (
  <path
    key={`${x}-${y}`}
    className="anno"
    style={{ ["--d" as string]: k }}
    d="M-7 -8 L5 0 L-7 8"
    transform={`translate(${x} ${y}) rotate(${rot})`}
    stroke={C.greenGlow}
    strokeWidth="3"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const signs: { x: number; y: number; kind: SignKind; s?: number }[] = [
  { x: 800, y: 548, kind: "exit", s: 24 },
  { x: 270, y: 392, kind: "exit", s: 24 },
  { x: 1332, y: 262, kind: "exit", s: 24 },
  { x: 580, y: 302, kind: "extinguisher", s: 20 },
  { x: 1100, y: 302, kind: "extinguisher", s: 20 },
  { x: 430, y: 484, kind: "extinguisher", s: 20 },
  { x: 818, y: 470, kind: "extinguisher", s: 18 },
  { x: 782, y: 470, kind: "alarm", s: 18 },
  { x: 1240, y: 360, kind: "alarm", s: 18 },
  { x: 1080, y: 360, kind: "firstaid", s: 20 },
];

/** Szene 3: Flucht- und Rettungsplan in der Aufsicht. */
export function EscapePlan({ id, mini }: SceneProps) {
  return (
    <g>
      <DraftGrid id={id} />

      {/* Raumflächen, leicht aufgehellt */}
      <rect x={300} y={140} width={1000} height={360} fill="#1d2226" />
      <rect x={560} y={280} width={740} height={60} fill="#242a2f" />
      <rect x={770} y={340} width={60} height={160} fill="#242a2f" />

      {/* Regale in der Halle */}
      <g fill="none" stroke={C.lineDim} strokeWidth="1.2">
        {[168, 214, 260, 306].map((y) => (
          <rect key={y} x={330} y={y} width={200} height={22} />
        ))}
      </g>

      <path d={inner} stroke={C.stone3} strokeWidth="5" fill="none" strokeLinecap="square" />
      <path d={outer} stroke={C.stone5} strokeWidth="9" fill="none" strokeLinecap="square" />
      <path d={swings} stroke={C.stone3} strokeWidth="1.2" fill="none" />
      <path d={exitDoor} stroke={C.stone5} strokeWidth="2" fill="none" />
      {/* Treppe */}
      <g stroke={C.lineDim} strokeWidth="1">
        {[150, 162, 174, 186, 198, 210].map((y) => (
          <path key={y} d={`M1124 ${y} H1196`} />
        ))}
      </g>

      {/* Rettungswege */}
      <g fill="none" stroke={C.green} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path className="draw" style={{ ["--d0" as string]: 0.05 }} pathLength={1} d="M600 310 H800 V500" />
        <path className="draw" style={{ ["--d0" as string]: 0.12 }} pathLength={1} d="M1000 310 H800" />
        <path className="draw" style={{ ["--d0" as string]: 0.18 }} pathLength={1} d="M1050 310 H1340" />
        <path className="draw" style={{ ["--d0" as string]: 0.22 }} pathLength={1} d="M490 384 L340 442 H262" />
      </g>
      <path className="draw" style={{ ["--d0" as string]: 0.3 }} pathLength={1} d="M800 566 V664" stroke={C.green} strokeWidth="4" strokeDasharray="1 0" fill="none" />
      <g>
        {chevron(700, 310, 0, 1)}
        {chevron(900, 310, 180, 1.4)}
        {chevron(800, 420, 90, 1.8)}
        {chevron(1180, 310, 0, 2.2)}
        {chevron(410, 415, 158, 2.6)}
      </g>

      {signs.map((s, i) => (
        <g key={i} className="anno" style={{ ["--d" as string]: 1 + i * 0.25 }}>
          <Sign x={s.x} y={s.y} kind={s.kind} size={s.s} />
        </g>
      ))}

      {/* Standort */}
      <g className="anno" style={{ ["--d" as string]: 3 }}>
        <circle cx={915} cy={310} r={13} fill="none" stroke={C.paper2} strokeWidth="2" />
        <circle cx={915} cy={310} r={5} fill={C.paper2} />
      </g>

      {/* Sammelstelle */}
      <g className="anno" style={{ ["--d" as string]: 3.4 }}>
        <Sign x={800} y={694} kind="assembly" size={46} />
        {!mini && (
          <text x={800} y={740} textAnchor="middle" className="svg-mono" fontSize={13} fill={C.stone5} letterSpacing="1">
            SAMMELSTELLE
          </text>
        )}
      </g>

      {!mini && (
        <g>
          <g className="anno" style={{ ["--d" as string]: 0 }}>
            <text x={300} y={104} className="svg-sans" fontSize={24} fontWeight={600} fill={C.paper2}>
              Flucht- und Rettungsplan
            </text>
            <text x={1300} y={104} textAnchor="end" className="svg-mono" fontSize={13} fill={C.stone4}>
              Erdgeschoss · Musterobjekt
            </text>
            <path d="M300 120 H1300" stroke={C.lineDim} />
            <g transform="translate(1360 170)">
              <circle r="20" fill="none" stroke={C.lineDim} />
              <path d="M0 -16 L6 6 L0 2 L-6 6 Z" fill={C.stone4} />
              <text y={42} textAnchor="middle" className="svg-mono" fontSize={12} fill={C.stone4}>
                N
              </text>
            </g>
            <text x={940} y={300} className="svg-mono" fontSize={12} fill={C.paper2}>
              Standort
            </text>
          </g>

          {/* Brandschutzordnung Teil A, verkürzt */}
          <g className="anno" style={{ ["--d" as string]: 3.6 }}>
            <rect x={300} y={574} width={330} height={190} fill={C.ink0} stroke={C.lineDim} />
            <rect x={300} y={574} width={330} height={34} fill={C.red} />
            <text x={316} y={597} className="svg-sans" fontSize={15} fontWeight={600} fill={C.paper2}>
              Verhalten im Brandfall
            </text>
            {["Ruhe bewahren", "Brand melden · Notruf 112", "In Sicherheit bringen", "Löschversuch unternehmen"].map((l, i) => (
              <g key={l}>
                <rect x={318} y={628 + i * 33} width={12} height={12} fill={i === 3 ? C.red : C.green} />
                <text x={342} y={639 + i * 33} className="svg-sans" fontSize={15} fill={C.stone5}>
                  {l}
                </text>
              </g>
            ))}
          </g>

          {/* Legende */}
          <g className="anno" style={{ ["--d" as string]: 3.8 }}>
            <rect x={1000} y={574} width={300} height={190} fill={C.ink0} stroke={C.lineDim} />
            <text x={1016} y={600} className="svg-mono" fontSize={12} letterSpacing="1.5" fill={C.stone4}>
              LEGENDE
            </text>
            <path d="M1018 628 H1046" stroke={C.green} strokeWidth="6" strokeLinecap="round" />
            <text x={1060} y={633} className="svg-sans" fontSize={14} fill={C.stone5}>
              Rettungsweg
            </text>
            {(
              [
                ["exit", "Notausgang"],
                ["extinguisher", "Feuerlöscher"],
                ["alarm", "Brandmelder"],
                ["firstaid", "Erste Hilfe"],
              ] as [SignKind, string][]
            ).map(([k, l], i) => (
              <g key={k}>
                <Sign x={1032} y={660 + i * 27} kind={k} size={20} />
                <text x={1060} y={665 + i * 27} className="svg-sans" fontSize={14} fill={C.stone5}>
                  {l}
                </text>
              </g>
            ))}
          </g>
        </g>
      )}
      <Vignette id={id} />
    </g>
  );
}
