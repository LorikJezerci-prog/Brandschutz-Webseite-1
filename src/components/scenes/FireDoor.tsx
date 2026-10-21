import { D } from "./door";
import { Sign } from "./Signs";
import { C, type SceneProps } from "./palette";

/**
 * Szene 4: zweiflügelige Brandschutztür mit Feststellanlage, frontal.
 * Seitenlicht von links, Lichtkante wandert beim Scrollen über die Flügel.
 */
export function FireDoor({ id }: SceneProps) {
  const p = (n: string) => `${id}-${n}`;
  const { frame: F, leafY: LY } = D;

  return (
    <g>
      <defs>
        <linearGradient id={p("wall")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#56544f" />
          <stop offset="0.45" stopColor="#3f3e3b" />
          <stop offset="1" stopColor="#262624" />
        </linearGradient>
        <linearGradient id={p("floor")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a28" />
          <stop offset="1" stopColor="#121212" />
        </linearGradient>
        <linearGradient id={p("leaf")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a5a9a7" />
          <stop offset="1" stopColor="#7f8482" />
        </linearGradient>
        <linearGradient id={p("leafR")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#959a98" />
          <stop offset="1" stopColor="#6f7472" />
        </linearGradient>
        <linearGradient id={p("frame")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c8285" />
          <stop offset="1" stopColor="#50565a" />
        </linearGradient>
        <linearGradient id={p("glass")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a4650" />
          <stop offset="0.5" stopColor="#1d252b" />
          <stop offset="1" stopColor="#2b353d" />
        </linearGradient>
        <radialGradient id={p("pool")} cx="0.5" cy="0.35" r="0.6">
          <stop offset="0" stopColor={C.warm} stopOpacity="0.16" />
          <stop offset="1" stopColor={C.warm} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={p("sheen")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={p("refl")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9da2a0" stopOpacity="0.16" />
          <stop offset="1" stopColor="#9da2a0" stopOpacity="0" />
        </linearGradient>
        <clipPath id={p("leaves")}>
          <rect x={D.leafL.x0} y={LY.y0} width={D.leafR.x1 - D.leafL.x0} height={LY.y1 - LY.y0} />
        </clipPath>
        <linearGradient id={p("ext")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9443b" />
          <stop offset="0.6" stopColor="#9c2c26" />
          <stop offset="1" stopColor="#6e1f1b" />
        </linearGradient>
      </defs>

      {/* Wand, Decke, Boden */}
      <rect width="1600" height="1000" fill={`url(#${p("wall")})`} />
      <rect width="1600" height="1000" fill={`url(#${p("pool")})`} />
      <rect width="1600" height="64" fill="#1e1e1d" />
      <path d="M0 64 H1600" stroke="#5f5d58" strokeOpacity="0.5" />
      <rect y={D.floor} width="1600" height={1000 - D.floor} fill={`url(#${p("floor")})`} />
      <rect y={D.floor - 14} width="1600" height="14" fill="#2f2f2d" />
      <rect x={F.x0} y={D.floor} width={F.x1 - F.x0} height="120" fill={`url(#${p("refl")})`} />

      {/* Zarge */}
      <rect x={F.x0} y={F.y0} width={F.x1 - F.x0} height={F.y1 - F.y0} fill={`url(#${p("frame")})`} />
      <rect x={F.x0 + 16} y={F.y0 + 16} width={F.x1 - F.x0 - 32} height={F.y1 - F.y0 - 16} fill="#1b1d1e" />

      {/* Türflügel */}
      <rect x={D.leafL.x0} y={LY.y0} width={D.leafL.x1 - D.leafL.x0} height={LY.y1 - LY.y0} fill={`url(#${p("leaf")})`} />
      <rect x={D.leafR.x0} y={LY.y0} width={D.leafR.x1 - D.leafR.x0} height={LY.y1 - LY.y0} fill={`url(#${p("leafR")})`} />
      <path d="M800 188 V828" stroke="#2c2f30" strokeWidth="2" />

      {/* Wandernde Lichtkante */}
      <g clipPath={`url(#${p("leaves")})`}>
        <rect className="sheen" x={480} y={LY.y0} width={160} height={LY.y1 - LY.y0} fill={`url(#${p("sheen")})`} />
      </g>

      {/* Brandschutzverglasung */}
      {[D.visionL, D.visionR].map((v) => (
        <g key={v.x0}>
          <rect x={v.x0 - 6} y={D.visionY.y0 - 6} width={v.x1 - v.x0 + 12} height={D.visionY.y1 - D.visionY.y0 + 12} fill="#6c7173" />
          <rect x={v.x0} y={D.visionY.y0} width={v.x1 - v.x0} height={D.visionY.y1 - D.visionY.y0} fill={`url(#${p("glass")})`} />
          <path d={`M${v.x0 + 10} ${D.visionY.y0 + 40} L${v.x0 + 40} ${D.visionY.y0 + 10}`} stroke="#fff" strokeOpacity="0.12" strokeWidth="6" />
        </g>
      ))}

      {/* Panikstangen */}
      {[
        [650, 784],
        [816, 950],
      ].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={D.bar.y} width={b - a} height={D.bar.h} rx={7} fill="#c3c7c6" />
          <rect x={a} y={D.bar.y + D.bar.h - 4} width={b - a} height={4} rx={2} fill="#7b7f7e" />
          <rect x={a + 4} y={D.bar.y - 8} width={14} height={30} rx={3} fill="#5d6163" />
          <rect x={b - 18} y={D.bar.y - 8} width={14} height={30} rx={3} fill="#5d6163" />
        </g>
      ))}

      {/* Obentürschließer mit Gleitschiene */}
      {[D.closerL, D.closerR].map((c) => (
        <g key={c.x0}>
          <rect x={c.x0} y={D.closerY.y0} width={c.x1 - c.x0} height={D.closerY.y1 - D.closerY.y0} rx={3} fill="#3e4244" />
          <rect x={c.x0} y={D.closerY.y0} width={c.x1 - c.x0} height={4} fill="#5c6164" />
        </g>
      ))}
      <rect x={F.x0 + 16} y={F.y0 + 16} width={F.x1 - F.x0 - 32} height={8} fill="#2f3335" />

      {/* Feststellanlage: Sturzmelder, Haftmagnete, Handauslösetaster */}
      <rect x={D.sturz.x0} y={D.sturz.y0} width={D.sturz.x1 - D.sturz.x0} height={D.sturz.y1 - D.sturz.y0} rx={5} fill="#e4e1da" />
      <rect x={D.sturz.x0} y={D.sturz.y1 - 5} width={D.sturz.x1 - D.sturz.x0} height={5} fill="#a9a59e" />
      <circle cx={826} cy={118} r={3} fill={C.redSoft} />
      {[D.magnetL, D.magnetR].map((m) => (
        <g key={m.x}>
          <rect x={m.x - 16} y={m.y - 16} width={32} height={32} rx={4} fill="#d8d5ce" />
          <circle cx={m.x} cy={m.y} r={10} fill="#8e8b85" />
          <circle cx={m.x} cy={m.y} r={5} fill="#5d5b57" />
        </g>
      ))}
      <rect x={D.release.x - 18} y={D.release.y - 22} width={36} height={44} rx={4} fill="#c8873a" />
      <rect x={D.release.x - 10} y={D.release.y - 10} width={20} height={20} rx={2} fill="#efe9de" />
      <path d={`M${D.sturz.x0} 118 H${D.magnetL.x} V${D.magnetL.y - 16} M${D.sturz.x1} 118 H${D.magnetR.x} V${D.magnetR.y - 16} M${D.magnetR.x} ${D.magnetR.y + 16} V${D.release.y - 60} H${D.release.x} V${D.release.y - 22}`} stroke="#d8d5ce" strokeOpacity="0.35" strokeWidth="3" fill="none" />

      {/* Hinweisschild */}
      <rect x={1010} y={380} width={88} height={52} rx={3} fill="#efe9de" />
      <rect x={1010} y={380} width={88} height={14} rx={3} fill={C.red} />
      <path d="M1020 406 H1088 M1020 416 H1076" stroke="#58554f" strokeWidth="3" />

      {/* Feuerlöscher mit Zeichen F001 */}
      <Sign x={1270} y={470} kind="extinguisher" size={44} />
      <rect x={1258} y={510} width={24} height={14} fill="#4b4c4c" />
      <rect x={1250} y={540} width={40} height={150} rx={14} fill={`url(#${p("ext")})`} />
      <rect x={1254} y={530} width={30} height={18} rx={4} fill="#2b2b2b" />
      <path d="M1284 536 C1306 548 1304 600 1292 640" stroke="#1d1d1d" strokeWidth="5" fill="none" />
      <rect x={1256} y={580} width={28} height={40} rx={3} fill="#efe9de" opacity="0.85" />
      <ellipse cx={1270} cy={D.floor + 4} rx={60} ry={6} fill="#000" opacity="0.35" />
    </g>
  );
}
