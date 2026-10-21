import { B, fins, litLower, litUpper, mullions } from "./geometry";
import { Hotspot } from "./Annotation";
import { C, range, type SceneProps } from "./palette";

/**
 * Szene 1: Gewerbegebäude in der Dämmerung, frontal, mittig auf der Achse.
 * Licht von links, Schatten nach rechts. Der Mittelpfosten des Eingangs liegt
 * exakt auf der Sicherheitslinie.
 */
export function Facade({ id, mini }: SceneProps) {
  const p = (n: string) => `${id}-${n}`;
  const bays = fins.slice(0, -1).filter((x, i) => fins[i + 1] - x === 40);

  return (
    <g>
      <defs>
        <linearGradient id={p("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15181b" />
          <stop offset="0.62" stopColor="#2a2f34" />
          <stop offset="0.76" stopColor="#33373a" />
        </linearGradient>
        <radialGradient id={p("glow")} cx="0.18" cy="0.55" r="0.55">
          <stop offset="0" stopColor="#8a7a63" stopOpacity="0.32" />
          <stop offset="1" stopColor="#8a7a63" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={p("ground")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24272a" />
          <stop offset="1" stopColor="#101214" />
        </linearGradient>
        <linearGradient id={p("concrete")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b867d" />
          <stop offset="0.55" stopColor="#6c6962" />
          <stop offset="1" stopColor="#4b4a47" />
        </linearGradient>
        <linearGradient id={p("glass")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.glass2} />
          <stop offset="1" stopColor={C.glass1} />
        </linearGradient>
        <linearGradient id={p("refl")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#c9d3da" stopOpacity="0.11" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={p("lit")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.warm} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.warm} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={p("lobby")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9d3a8" stopOpacity="0.75" />
          <stop offset="1" stopColor="#8d7350" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={p("metal")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4d5256" />
          <stop offset="1" stopColor="#33373b" />
        </linearGradient>
        <pattern id={p("ribs")} width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 0.5 H8" stroke="#5c6165" strokeWidth="1" />
          <path d="M0 4.5 H8" stroke="#2a2e31" strokeWidth="1" />
        </pattern>
        <pattern id={p("vribs")} width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M0.5 0 V10" stroke="#565b5f" strokeWidth="1" />
          <path d="M5.5 0 V10" stroke="#272b2e" strokeWidth="1" />
        </pattern>
        <clipPath id={p("upper")}>
          <rect x={B.x0} y={B.attic} width={B.x1 - B.x0} height={B.slab0 - B.attic} />
        </clipPath>
        <radialGradient id={p("spot")} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor={C.warm} stopOpacity="0.5" />
          <stop offset="1" stopColor={C.warm} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Himmel und Umgebungslicht */}
      <rect width="1600" height="1000" fill={`url(#${p("sky")})`} />
      <rect width="1600" height="1000" fill={`url(#${p("glow")})`} />

      {/* Silhouette der Nachbarbebauung, sehr zurückhaltend */}
      <path d="M0 640 H70 V600 H150 V620 H240 V760 H0 Z" fill="#202427" />
      <path d="M1540 600 H1600 V760 H1540 Z" fill="#1e2225" />

      {/* Boden mit Fluchtlinien zur Achse */}
      <rect y={B.ground} width="1600" height={1000 - B.ground} fill={`url(#${p("ground")})`} />
      <g stroke="#ffffff" strokeOpacity="0.045" strokeWidth="1">
        {range(13).map((i) => {
          const bx = -800 + i * 266;
          return <path key={i} d={`M${800 + (bx - 800) * 0.09} ${B.ground} L${bx} 1000`} />;
        })}
        {[778, 802, 836, 884, 952].map((y) => (
          <path key={y} d={`M0 ${y} H1600`} />
        ))}
      </g>

      {/* Schlagschatten nach rechts */}
      <path
        d={`M${B.x0} ${B.ground} H${B.dock.x1} L${B.dock.x1 + 160} ${B.ground + 46} H${B.x0 + 90} Z`}
        fill="#07080a"
        opacity="0.45"
      />

      {/* Halle links mit Metallkassetten */}
      <rect x={B.hall.x0} y={B.hall.top} width={B.hall.x1 - B.hall.x0} height={B.ground - B.hall.top} fill="#3a3e41" />
      <rect x={B.hall.x0} y={B.hall.top} width={B.hall.x1 - B.hall.x0} height={B.ground - B.hall.top} fill={`url(#${p("ribs")})`} opacity="0.8" />
      <rect x={B.hall.x0 - 4} y={B.hall.top - 8} width={B.hall.x1 - B.hall.x0 + 4} height={8} fill="#6d6a64" />
      <rect x={B.hallExit.x0} y={B.hallExit.top} width={B.hallExit.x1 - B.hallExit.x0} height={B.ground - B.hallExit.top} fill="#25292c" stroke="#5a5f63" strokeWidth="2" />
      <rect x={B.hallExit.x0 + 6} y={B.hallExit.top - 18} width={32} height={12} fill={C.green} />
      <rect x={B.hallExit.x0 + 6} y={B.hallExit.top - 18} width={32} height={12} fill={C.greenGlow} opacity="0.35" />
      {/* Paletten vor dem Notausgang */}
      <g>
        <rect x={150} y={722} width={52} height={30} fill="#7a6853" />
        <rect x={150} y={722} width={52} height={30} fill="none" stroke="#5d4f3f" strokeWidth="1.5" />
        <path d="M150 737 H202" stroke="#a08b6c" strokeWidth="2" opacity="0.6" />
        <rect x={198} y={734} width={40} height={18} fill="#6c5c48" />
        <rect x={146} y={752} width={96} height={8} fill="#8c7a5f" />
        <path d="M150 756 H238" stroke="#4f4335" strokeWidth="2" strokeDasharray="10 6" />
      </g>

      {/* Hauptbaukörper: Attika */}
      <rect x={B.x0 - 10} y={B.top} width={B.x1 - B.x0 + 20} height={B.attic - B.top} fill={`url(#${p("concrete")})`} />
      <path d={`M${B.x0 - 10} ${B.top + 0.5} H${B.x1 + 10}`} stroke="#b4ada2" strokeOpacity="0.5" />

      {/* Obergeschosse: Glas, Reflexion, beleuchtete Felder */}
      <rect x={B.x0} y={B.attic} width={B.x1 - B.x0} height={B.slab0 - B.attic} fill={`url(#${p("glass")})`} />
      <g clipPath={`url(#${p("upper")})`}>
        <path d="M380 282 L560 282 L330 600 L150 600 Z" fill={`url(#${p("refl")})`} />
        <path d="M900 282 L1010 282 L820 600 L710 600 Z" fill={`url(#${p("refl")})`} opacity="0.7" />
        {bays.map((x, i) =>
          litUpper.includes(i) ? <rect key={`u${x}`} x={x + 6} y={B.attic + 8} width={28} height={B.slab1 - B.attic - 14} fill={`url(#${p("lit")})`} /> : null,
        )}
        {bays.map((x, i) =>
          litLower.includes(i) ? <rect key={`l${x}`} x={x + 6} y={B.slab1 + 18} width={28} height={B.slab0 - B.slab1 - 24} fill={`url(#${p("lit")})`} /> : null,
        )}
      </g>

      {/* Geschossdecken */}
      <rect x={B.x0} y={B.slab1} width={B.x1 - B.x0} height={12} fill={`url(#${p("concrete")})`} />
      <rect x={B.x0} y={B.slab0} width={B.x1 - B.x0} height={12} fill={`url(#${p("concrete")})`} />

      {/* Lisenen: Lichtkante links, Schattenseite rechts */}
      {fins.map((x) => (
        <g key={x}>
          <rect x={x - 6} y={B.attic} width={5} height={B.slab0 - B.attic} fill="#98928a" />
          <rect x={x - 1} y={B.attic} width={8} height={B.slab0 - B.attic} fill="#5a5853" />
        </g>
      ))}

      {/* Treppenhaus mit Laufplatten */}
      <rect x={B.stair.x0} y={B.attic} width={B.stair.x1 - B.stair.x0} height={B.ground - B.attic} fill="#2a333b" />
      <g stroke="#71808b" strokeOpacity="0.55" strokeWidth="3" fill="none">
        <path d={`M${B.stair.x0} 590 L${B.stair.x1} 520 M${B.stair.x0} 430 L${B.stair.x1} 360`} />
        <path d={`M${B.stair.x1} 520 L${B.stair.x0} 450 M${B.stair.x1} 360 L${B.stair.x0} 300`} strokeOpacity="0.35" />
      </g>
      <rect x={B.stair.x0} y={B.attic} width={6} height={B.ground - B.attic} fill="#8f897f" />
      <rect x={B.stair.x1 - 6} y={B.attic} width={6} height={B.ground - B.attic} fill="#4f4d49" />
      {/* Kartons im Treppenraum */}
      <rect x={1130} y={722} width={34} height={38} fill="#7a6853" opacity="0.9" />
      <rect x={1160} y={738} width={28} height={22} fill="#6c5c48" opacity="0.9" />

      {/* Erdgeschoss: Verglasung */}
      <rect x={B.x0} y={B.slab0 + 12} width={B.stair.x0 - B.x0} height={B.ground - B.slab0 - 12} fill="#141a1f" />
      <rect x={B.stair.x1} y={B.slab0 + 12} width={B.x1 - B.stair.x1} height={B.ground - B.slab0 - 12} fill="#141a1f" />
      <path d="M420 612 L520 612 L460 760 L360 760 Z" fill={`url(#${p("refl")})`} />
      {mullions.map((x) =>
        x > B.stair.x0 - 4 && x < B.stair.x1 + 4 ? null : (
          <rect key={x} x={x - 2} y={B.slab0 + 12} width={4} height={B.ground - B.slab0 - 12} fill="#3d444a" />
        ),
      )}
      <path d={`M${B.x0} 700 H${B.stair.x0} M${B.stair.x1} 700 H${B.x1}`} stroke="#3d444a" strokeWidth="3" />

      {/* Eingang: warmes Foyerlicht, Mittelpfosten auf der Achse */}
      <rect x={B.entrance.x0} y={B.slab0 + 12} width={B.entrance.x1 - B.entrance.x0} height={B.ground - B.slab0 - 12} fill={`url(#${p("lobby")})`} />
      <rect x={B.entrance.x0} y={B.entrance.top} width={B.entrance.x1 - B.entrance.x0} height={B.ground - B.entrance.top} fill="none" stroke="#2f3438" strokeWidth="5" />
      <rect x={798} y={B.entrance.top} width={4} height={B.ground - B.entrance.top} fill="#2f3438" />
      <path d={`M${B.entrance.x0} ${B.entrance.top} H${B.entrance.x1}`} stroke="#2f3438" strokeWidth="5" />

      {/* Vordach mit Downlights */}
      <rect x={B.canopy.x0} y={B.canopy.y} width={B.canopy.x1 - B.canopy.x0} height={B.canopy.h} fill="#77736c" />
      <path d={`M${B.canopy.x0} ${B.canopy.y + 0.5} H${B.canopy.x1}`} stroke="#c2bbaf" strokeOpacity="0.6" />
      {[690, 750, 850, 910].map((x) => (
        <ellipse key={x} cx={x} cy={B.canopy.y + B.canopy.h + 26} rx={22} ry={30} fill={`url(#${p("spot")})`} />
      ))}

      {/* Anlieferung rechts */}
      <rect x={B.dock.x0} y={B.dock.top} width={B.dock.x1 - B.dock.x0} height={B.ground - B.dock.top} fill="#303437" />
      <rect x={B.dock.x0} y={B.dock.top} width={B.dock.x1 - B.dock.x0} height={B.ground - B.dock.top} fill={`url(#${p("vribs")})`} opacity="0.6" />
      <rect x={B.dock.x0} y={B.dock.top - 6} width={B.dock.x1 - B.dock.x0 + 4} height={6} fill="#5d5a55" />
      <rect x={B.roller.x0} y={B.roller.top} width={B.roller.x1 - B.roller.x0} height={B.ground - B.roller.top} fill={`url(#${p("metal")})`} />
      <g stroke="#26292c" strokeWidth="1.2">
        {range(14).map((i) => (
          <path key={i} d={`M${B.roller.x0} ${B.roller.top + 8 + i * 8.4} H${B.roller.x1}`} />
        ))}
      </g>
      <rect x={B.roller.x0 - 6} y={B.roller.top - 6} width={B.roller.x1 - B.roller.x0 + 12} height={6} fill="#3e4245" />
      {/* Paletten und Container an der Fassade */}
      <rect x={B.pallets.x0} y={712} width={36} height={40} fill="#7a6853" />
      <rect x={B.pallets.x0 + 34} y={726} width={30} height={26} fill="#6c5c48" />
      <rect x={B.pallets.x0 - 4} y={752} width={72} height={8} fill="#8c7a5f" />
      <path d="M1480 718 L1550 718 L1544 760 L1486 760 Z" fill="#2c3330" />
      <path d="M1480 718 H1550" stroke="#4b5550" strokeWidth="3" />

      {/* Poller-Leuchten */}
      {[540, 640, 960, 1060].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={798} rx={30} ry={8} fill={C.warm} opacity="0.12" />
          <rect x={x - 3} y={770} width={6} height={28} fill="#2c2f32" />
          <rect x={x - 3} y={770} width={6} height={5} fill={C.warm} opacity="0.85" />
        </g>
      ))}

      {!mini && (
        <g>
          <Hotspot x={192} y={716} lx={150} ly={640} label="Notausgang zugestellt" d={0} />
          <Hotspot x={1150} y={724} lx={1062} ly={662} label="Treppenraum als Lager" anchor="end" d={1} />
          <Hotspot x={1438} y={718} lx={1460} ly={500} label="Brandlast an der Fassade" anchor="end" d={2} />
        </g>
      )}
    </g>
  );
}
