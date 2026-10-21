import { Sign } from "./Signs";
import { C, type SceneProps } from "./palette";

/** Fluchtpunkt und Stirnwand. Die Tür am Flurende entspricht der Tür aus Szene 4 im Maßstab 1:3. */
const VP = { x: 800, y: 470 };
const W = { x0: 680, x1: 920, y0: 330, y1: 610 };
const at = (f: number) => ({
  left: VP.x - 120 * f,
  right: VP.x + 120 * f,
  ceil: VP.y - 140 * f,
  floor: VP.y + 140 * f,
});
const K = 12;

const quad = (pts: [number, number][]) => `M${pts.map((p) => p.join(" ")).join(" L")} Z`;

function wallDoor(side: "left" | "right", f1: number, f2: number) {
  const a = at(f1);
  const b = at(f2);
  const x1 = side === "left" ? a.left : a.right;
  const x2 = side === "left" ? b.left : b.right;
  const top = (f: number) => VP.y - 78.4 * f;
  return quad([
    [x1, a.floor],
    [x1, top(f1)],
    [x2, top(f2)],
    [x2, b.floor],
  ]);
}

/** Szene 6: Flur mit freien Rettungswegen, Kennzeichnung und Feuerlöscher. */
export function Corridor({ id }: SceneProps) {
  const p = (n: string) => `${id}-${n}`;
  const far = at(K);
  const panels: [number, number][] = [
    [1.3, 1.45],
    [1.8, 2.05],
    [2.6, 3.0],
    [3.8, 4.6],
  ];

  return (
    <g>
      <defs>
        <linearGradient id={p("lw")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4c4a46" />
          <stop offset="1" stopColor="#3a3936" />
        </linearGradient>
        <linearGradient id={p("rw")} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#262624" />
          <stop offset="1" stopColor="#353431" />
        </linearGradient>
        <linearGradient id={p("fl")} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#151515" />
          <stop offset="1" stopColor="#2d2c2a" />
        </linearGradient>
        <radialGradient id={p("end")} cx="0.5" cy="0.4" r="0.7">
          <stop offset="0" stopColor="#6a6760" />
          <stop offset="1" stopColor="#45433f" />
        </radialGradient>
        <radialGradient id={p("lamp")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f4ead6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#f4ead6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p("exitglow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.greenGlow} stopOpacity="0.45" />
          <stop offset="1" stopColor={C.greenGlow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={p("ext")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9443b" />
          <stop offset="1" stopColor="#7a221d" />
        </linearGradient>
      </defs>

      <rect width="1600" height="1000" fill="#1c1c1b" />
      {/* Decke, Wände, Boden */}
      <path d={quad([[W.x0, W.y0], [W.x1, W.y0], [far.right, far.ceil], [far.left, far.ceil]])} fill="#262624" />
      <path d={quad([[W.x0, W.y0], [W.x0, W.y1], [far.left, far.floor], [far.left, far.ceil]])} fill={`url(#${p("lw")})`} />
      <path d={quad([[W.x1, W.y0], [W.x1, W.y1], [far.right, far.floor], [far.right, far.ceil]])} fill={`url(#${p("rw")})`} />
      <path d={quad([[W.x0, W.y1], [W.x1, W.y1], [far.right, far.floor], [far.left, far.floor]])} fill={`url(#${p("fl")})`} />

      {/* Deckenleuchten und Spiegelung im Boden */}
      {panels.map(([f1, f2]) => {
        const a = at(f1);
        const b = at(f2);
        return (
          <g key={f1}>
            <path d={quad([[800 - 35 * f1, a.ceil], [800 + 35 * f1, a.ceil], [800 + 35 * f2, b.ceil], [800 - 35 * f2, b.ceil]])} fill="#f1e8d6" opacity="0.9" />
            <ellipse cx={800} cy={(a.floor + b.floor) / 2} rx={60 * f2} ry={14 * f2} fill={`url(#${p("lamp")})`} />
          </g>
        );
      })}

      {/* Seitentüren */}
      <path d={wallDoor("left", 1.6, 2.0)} fill="#2d2d2b" stroke="#6c6a64" strokeWidth="2" />
      <path d={wallDoor("left", 2.8, 3.5)} fill="#2d2d2b" stroke="#6c6a64" strokeWidth="2" />
      <path d={wallDoor("right", 2.0, 2.5)} fill="#1f1f1e" stroke="#4e4d49" strokeWidth="2" />

      {/* Bodennahes Sicherheitsleitsystem */}
      <path className="draw" style={{ ["--d0" as string]: 0 }} pathLength={1} d={`M${far.left} ${far.floor} L${W.x0} ${W.y1}`} stroke={C.greenGlow} strokeOpacity="0.7" strokeWidth="3" fill="none" />
      <path className="draw" style={{ ["--d0" as string]: 0.05 }} pathLength={1} d={`M${far.right} ${far.floor} L${W.x1} ${W.y1}`} stroke={C.greenGlow} strokeOpacity="0.7" strokeWidth="3" fill="none" />

      {/* Stirnwand mit Ausgangstür (Maßstab 1:3 zur Szene 4) */}
      <rect x={W.x0} y={W.y0} width={W.x1 - W.x0} height={W.y1 - W.y0} fill={`url(#${p("end")})`} />
      <rect x={736.7} y={390} width={126.6} height={220} fill="#6d7275" />
      <rect x={742} y={395.3} width={57.4} height={214.7} fill="#9a9f9d" />
      <rect x={800.6} y={395.3} width={57.4} height={214.7} fill="#8a8f8d" />
      <rect x={760} y={423} width={20} height={80} fill="#27313a" />
      <rect x={819} y={423} width={20} height={80} fill="#27313a" />
      <rect x={750} y={555} width={44} height={5} rx={2} fill="#c8cbc9" />
      <rect x={806} y={555} width={44} height={5} rx={2} fill="#c8cbc9" />
      {/* Rettungszeichen mit Hinterleuchtung */}
      <ellipse cx={800} cy={362} rx={90} ry={40} fill={`url(#${p("exitglow")})`} />
      <rect x={758} y={350} width={84} height={26} rx={2} fill={C.green} />
      <Sign x={772} y={363} kind="exit" size={22} />
      <path d="M792 363 H830 M822 356 L830 363 L822 370" stroke="#f6f3ee" strokeWidth="2.5" fill="none" />

      {/* Feuerlöscher an der rechten Wand */}
      <Sign x={1170} y={640} kind="extinguisher" size={40} />
      <rect x={1150} y={700} width={36} height={170} rx={14} fill={`url(#${p("ext")})`} />
      <rect x={1154} y={690} width={26} height={16} rx={4} fill="#262626" />
      <ellipse cx={1168} cy={886} rx={44} ry={6} fill="#000" opacity="0.4" />

      {/* Lichtübergang zum Beratungstisch */}
      <rect className="flash" width="1600" height="1000" fill={C.paper} />
    </g>
  );
}
