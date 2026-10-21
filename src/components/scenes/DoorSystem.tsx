import { Callout, TitleBlock } from "./Annotation";
import { DraftGrid, Vignette } from "./Blueprint";
import { D } from "./door";
import { C, type SceneProps } from "./palette";

/**
 * Szene 5: dieselbe Tür als Prinzipdarstellung einer Feststellanlage.
 * Die Türgeometrie bleibt stehen, Leitungen und Komponenten zeichnen sich ein.
 */
export function DoorSystem({ id, mini }: SceneProps) {
  const { frame: F, leafY: LY } = D;
  const s = { stroke: C.line, strokeWidth: 1.4, fill: "none" } as const;
  const signal = { stroke: C.redSoft, strokeWidth: 2, fill: "none", className: "draw", pathLength: 1 } as const;
  const ctrl = { x: 1180, y: 190, w: 120, h: 76 };

  return (
    <g>
      <DraftGrid id={id} />

      {/* Decke und Boden */}
      <path d="M0 64 H1600" stroke={C.lineDim} strokeDasharray="14 6" />
      <path d={`M0 ${D.floor} H1600`} stroke={C.stone4} strokeWidth="2.5" />

      {/* Tür, identisch zur Fotoszene */}
      <g {...s}>
        <rect x={F.x0} y={F.y0} width={F.x1 - F.x0} height={F.y1 - F.y0} />
        <rect x={F.x0 + 16} y={F.y0 + 16} width={F.x1 - F.x0 - 32} height={F.y1 - F.y0 - 16} />
        <rect x={D.leafL.x0} y={LY.y0} width={D.leafL.x1 - D.leafL.x0} height={LY.y1 - LY.y0} />
        <rect x={D.leafR.x0} y={LY.y0} width={D.leafR.x1 - D.leafR.x0} height={LY.y1 - LY.y0} />
        {[D.visionL, D.visionR].map((v) => (
          <rect key={v.x0} x={v.x0} y={D.visionY.y0} width={v.x1 - v.x0} height={D.visionY.y1 - D.visionY.y0} />
        ))}
        <rect x={650} y={D.bar.y} width={134} height={D.bar.h} rx={7} />
        <rect x={816} y={D.bar.y} width={134} height={D.bar.h} rx={7} />
        {[D.closerL, D.closerR].map((c) => (
          <rect key={c.x0} x={c.x0} y={D.closerY.y0} width={c.x1 - c.x0} height={D.closerY.y1 - D.closerY.y0} rx={3} />
        ))}
        {/* Öffnungswinkel der Flügel, gestrichelt */}
        <path d="M628 828 L560 900 M972 828 L1040 900" strokeDasharray="6 6" strokeOpacity="0.5" />
      </g>

      {/* Komponenten */}
      <g stroke={C.stone5} strokeWidth="1.6" fill={C.ink2}>
        <rect x={D.sturz.x0} y={D.sturz.y0} width={D.sturz.x1 - D.sturz.x0} height={D.sturz.y1 - D.sturz.y0} rx={5} />
        <path d="M520 64 V76 H600 V64" />
        <path d="M1000 64 V76 H1080 V64" />
        <rect x={D.magnetL.x - 16} y={D.magnetL.y - 16} width={32} height={32} rx={4} />
        <rect x={D.magnetR.x - 16} y={D.magnetR.y - 16} width={32} height={32} rx={4} />
        <rect x={D.release.x - 18} y={D.release.y - 22} width={36} height={44} rx={4} />
        <rect x={ctrl.x} y={ctrl.y} width={ctrl.w} height={ctrl.h} rx={4} />
      </g>
      <circle cx={826} cy={118} r={3} fill={C.redSoft} />
      <circle cx={D.magnetL.x} cy={D.magnetL.y} r={8} fill="none" stroke={C.stone5} />
      <circle cx={D.magnetR.x} cy={D.magnetR.y} r={8} fill="none" stroke={C.stone5} />

      {/* Signalwege von der Energieversorgung zu allen Komponenten */}
      <path {...signal} style={{ ["--d0" as string]: 0.05 }} d={`M${ctrl.x} ${ctrl.y + 20} H${D.sturz.x1 + 40} V118 H${D.sturz.x1}`} />
      <path {...signal} style={{ ["--d0" as string]: 0.12 }} d={`M${ctrl.x + 30} ${ctrl.y} V40 H560 V64`} />
      <path {...signal} style={{ ["--d0" as string]: 0.16 }} d={`M${ctrl.x + 60} ${ctrl.y} V50 H1040 V64`} />
      <path {...signal} style={{ ["--d0" as string]: 0.2 }} d={`M${ctrl.x} ${ctrl.y + 50} H${D.magnetR.x + 16}`} />
      <path {...signal} style={{ ["--d0" as string]: 0.26 }} d={`M${D.sturz.x0} 126 H${D.magnetL.x} V${D.magnetL.y - 16}`} />
      <path {...signal} style={{ ["--d0" as string]: 0.32 }} d={`M${ctrl.x + 20} ${ctrl.y + ctrl.h} V${D.release.y} H${D.release.x + 18}`} />

      {!mini && (
        <g>
          <Callout x={762} y={118} lx={640} ly={156} label="Sturzmelder (Rauchschalter)" anchor="end" d={1} />
          <Callout x={560} y={76} lx={430} ly={120} label="Deckenmelder" anchor="end" d={1.4} />
          <Callout x={D.magnetL.x} y={D.magnetL.y} lx={430} ly={300} label="Haftmagnet" anchor="end" d={1.8} />
          <Callout x={ctrl.x + ctrl.w} y={ctrl.y + 38} lx={1360} ly={330} label="Energieversorgung" d={2.2} />
          <Callout x={D.release.x + 18} y={D.release.y} lx={1160} ly={600} label="Handauslösetaster" d={2.6} />
          <Callout x={628} y={828} lx={520} ly={900} label="Selbstschließender Flügel" anchor="end" d={3} />
          <TitleBlock
            x={1310}
            y={866}
            d={3.4}
            lines={["FESTSTELLANLAGE", "Prinzipdarstellung, kein Plan", "Prüfung/Wartung: Fachkraft"]}
          />
        </g>
      )}
      <Vignette id={id} />
    </g>
  );
}
