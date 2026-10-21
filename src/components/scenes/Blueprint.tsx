import { B, fins, mullions } from "./geometry";
import { Callout, TitleBlock } from "./Annotation";
import { C, type SceneProps } from "./palette";

/** Zeichenraster, das alle technischen Szenen teilen */
export function DraftGrid({ id }: { id: string }) {
  return (
    <>
      <defs>
        <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0 H0 V40" fill="none" stroke="#ffffff" strokeOpacity="0.035" />
        </pattern>
        <pattern id={`${id}-grid5`} width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M200 0 H0 V200" fill="none" stroke="#ffffff" strokeOpacity="0.06" />
        </pattern>
        <radialGradient id={`${id}-vig`} cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill={C.ink1} />
      <rect width="1600" height="1000" fill={`url(#${id}-grid)`} />
      <rect width="1600" height="1000" fill={`url(#${id}-grid5)`} />
    </>
  );
}

export function Vignette({ id }: { id: string }) {
  return <rect width="1600" height="1000" fill={`url(#${id}-vig)`} pointerEvents="none" />;
}

/**
 * Szene 2: dieselbe Fassade als Bauzeichnung. Die Gebäudelinien stehen sofort
 * (Match Cut), Analyse, Bemaßung und Risiken zeichnen sich danach ein.
 */
export function Blueprint({ id, mini }: SceneProps) {
  const s = { stroke: C.line, strokeWidth: 1.4, fill: "none" } as const;
  const axes = [300, 500, 700, 900, 1100, 1300];

  return (
    <g>
      <DraftGrid id={id} />
      <defs>
        <pattern id={`${id}-hatch`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0 V12" stroke={C.redSoft} strokeWidth="1.5" strokeOpacity="0.55" />
        </pattern>
      </defs>

      {/* Achsen */}
      <g className="anno" style={{ ["--d" as string]: 0 }}>
        {axes.map((x, i) => (
          <g key={x}>
            <path d={`M${x} 214 V820`} stroke={C.lineDim} strokeDasharray="18 5 3 5" strokeWidth="1" />
            <circle cx={x} cy={196} r={14} fill={C.ink1} stroke={C.lineDim} />
            <text x={x} y={201} textAnchor="middle" className="svg-mono" fontSize={13} fill={C.stone4}>
              {String.fromCharCode(65 + i)}
            </text>
          </g>
        ))}
      </g>

      {/* Baukörper: identische Geometrie wie die Fassade */}
      <g {...s}>
        <rect x={B.x0 - 10} y={B.top} width={B.x1 - B.x0 + 20} height={B.attic - B.top} />
        <rect x={B.x0} y={B.attic} width={B.x1 - B.x0} height={B.ground - B.attic} />
        <rect x={B.x0} y={B.slab1} width={B.x1 - B.x0} height={12} />
        <rect x={B.x0} y={B.slab0} width={B.x1 - B.x0} height={12} />
        {fins.map((x) => (
          <path key={x} d={`M${x - 6} ${B.attic} V${B.slab0} M${x + 7} ${B.attic} V${B.slab0}`} strokeOpacity="0.55" strokeWidth="1" />
        ))}
        <rect x={B.stair.x0} y={B.attic} width={B.stair.x1 - B.stair.x0} height={B.ground - B.attic} />
        <path d={`M${B.stair.x0} 590 L${B.stair.x1} 520 L${B.stair.x0} 450 M${B.stair.x0} 430 L${B.stair.x1} 360 L${B.stair.x0} 300`} strokeOpacity="0.6" />
        {mullions.map((x) =>
          x > B.stair.x0 - 4 && x < B.stair.x1 + 4 ? null : <path key={x} d={`M${x} ${B.slab0 + 12} V${B.ground}`} strokeOpacity="0.6" />,
        )}
        <rect x={B.entrance.x0} y={B.entrance.top} width={B.entrance.x1 - B.entrance.x0} height={B.ground - B.entrance.top} />
        <path d={`M800 ${B.entrance.top} V${B.ground}`} />
        <rect x={B.canopy.x0} y={B.canopy.y} width={B.canopy.x1 - B.canopy.x0} height={B.canopy.h} />
        <rect x={B.hall.x0} y={B.hall.top} width={B.hall.x1 - B.hall.x0} height={B.ground - B.hall.top} />
        <rect x={B.hallExit.x0} y={B.hallExit.top} width={B.hallExit.x1 - B.hallExit.x0} height={B.ground - B.hallExit.top} />
        <rect x={B.dock.x0} y={B.dock.top} width={B.dock.x1 - B.dock.x0} height={B.ground - B.dock.top} />
        <rect x={B.roller.x0} y={B.roller.top} width={B.roller.x1 - B.roller.x0} height={B.ground - B.roller.top} />
        <rect x={150} y={722} width={52} height={30} strokeOpacity="0.6" />
        <rect x={198} y={734} width={40} height={18} strokeOpacity="0.6" />
        <rect x={B.pallets.x0} y={712} width={36} height={40} strokeOpacity="0.6" />
        <rect x={1130} y={722} width={34} height={38} strokeOpacity="0.6" />
      </g>
      <path d={`M40 ${B.ground} H1560`} stroke={C.stone4} strokeWidth="2.5" />

      {/* Analyse: Brandlasten, Rauchwege, Zündquellen */}
      <g className="anno" style={{ ["--d" as string]: 1 }}>
        <rect x={B.hall.x0} y={B.hall.top} width={B.hall.x1 - B.hall.x0} height={B.ground - B.hall.top} fill={`url(#${id}-hatch)`} />
        <rect x={B.hall.x0} y={B.hall.top} width={B.hall.x1 - B.hall.x0} height={B.ground - B.hall.top} fill="none" stroke={C.redSoft} strokeWidth="1.5" />
      </g>
      <g className="anno" style={{ ["--d" as string]: 2 }}>
        <path d="M1160 740 V310" stroke={C.redSoft} strokeWidth="2" strokeDasharray="10 7" fill="none" />
        <path d="M1150 326 L1160 304 L1170 326" stroke={C.redSoft} strokeWidth="2" fill="none" />
        <path d="M1160 304 C1160 270 1210 262 1250 262" stroke={C.redSoft} strokeWidth="1.5" strokeDasharray="4 5" fill="none" />
      </g>
      <g className="anno" style={{ ["--d" as string]: 3 }}>
        <circle cx={1436} cy={730} r={30} fill="none" stroke={C.redSoft} strokeWidth="1.5" />
        <circle cx={1436} cy={730} r={46} fill="none" stroke={C.redSoft} strokeWidth="1" strokeDasharray="3 5" />
      </g>
      <g className="anno" style={{ ["--d" as string]: 3 }}>
        <rect x={B.hallExit.x0 - 6} y={B.hallExit.top - 6} width={B.hallExit.x1 - B.hallExit.x0 + 12} height={B.ground - B.hallExit.top + 6} fill="none" stroke={C.greenGlow} strokeWidth="1.5" strokeDasharray="6 4" />
      </g>

      {!mini && (
        <g>
          {/* Bemaßung */}
          <g className="anno" style={{ ["--d" as string]: 0.5 }}>
            <path d={`M${B.x0} 812 H${B.x1} M${B.x0} 804 V820 M${B.x1} 804 V820`} stroke={C.stone3} strokeWidth="1" />
            <path d={`M${B.x0} 806 L${B.x0 + 8} 818 M${B.x1 - 8} 806 L${B.x1} 818`} stroke={C.stone3} strokeWidth="1" />
            <text x={800} y={840} textAnchor="middle" className="svg-mono" fontSize={13} fill={C.stone4}>
              54,00
            </text>
            {[
              [B.top, "+11,40"],
              [B.slab1, "+6,90"],
              [B.slab0, "+3,30"],
              [B.ground, "±0,00"],
            ].map(([y, l]) => (
              <g key={String(l)}>
                <path d={`M${B.x1 + 24} ${y} H${B.x1 + 70} M${B.x1 + 30} ${Number(y) - 9} L${B.x1 + 38} ${y} L${B.x1 + 46} ${Number(y) - 9} Z`} stroke={C.stone3} fill="none" strokeWidth="1" />
                <text x={B.x1 + 52} y={Number(y) - 6} className="svg-mono" fontSize={12} fill={C.stone4}>
                  {l}
                </text>
              </g>
            ))}
          </g>
          <Callout x={205} y={560} lx={260} ly={470} label="Brandlast hoch · Lager" d={1.2} color={C.redSoft} />
          <Callout x={1250} y={262} lx={1240} ly={226} label="Rauchausbreitung über Treppenraum" anchor="end" d={2.2} color={C.redSoft} />
          <Callout x={1466} y={700} lx={1500} ly={640} label="Zündquelle Ladezone" anchor="end" d={3.2} color={C.redSoft} />
          <Callout x={192} y={684} lx={140} ly={880} label="Notausgang freihalten" d={3.4} color={C.greenGlow} />
          <TitleBlock x={1310} y={866} d={4} lines={["MUSTEROBJEKT", "Ansicht Süd · Risikoanalyse", "M 1:200 · Blatt 02"]} />
        </g>
      )}
      <Vignette id={id} />
    </g>
  );
}
