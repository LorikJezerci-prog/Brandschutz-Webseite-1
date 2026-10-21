import { C } from "./palette";

export type SignKind = "exit" | "extinguisher" | "alarm" | "firstaid" | "assembly";

/**
 * Vereinfachte Sicherheitszeichen in der Farbsystematik nach DIN EN ISO 7010:
 * Rettungszeichen grün, Brandschutzzeichen rot. Keine Originalpiktogramme.
 */
export function Sign({ x, y, size = 26, kind }: { x: number; y: number; size?: number; kind: SignKind }) {
  const green = kind === "exit" || kind === "firstaid" || kind === "assembly";
  const s = size;
  const h = s / 2;
  return (
    <g transform={`translate(${x - h} ${y - h})`}>
      <rect width={s} height={s} rx={s * 0.08} fill={green ? C.green : C.red} />
      <g fill="#f6f3ee" stroke="#f6f3ee">
        {kind === "exit" && (
          <>
            <rect x={s * 0.56} y={s * 0.18} width={s * 0.26} height={s * 0.64} fill="none" strokeWidth={s * 0.06} />
            <circle cx={s * 0.36} cy={s * 0.26} r={s * 0.07} stroke="none" />
            <path d={`M${s * 0.2} ${s * 0.78} L${s * 0.36} ${s * 0.5} L${s * 0.5} ${s * 0.62} M${s * 0.36} ${s * 0.5} L${s * 0.3} ${s * 0.38} L${s * 0.46} ${s * 0.36}`} fill="none" strokeWidth={s * 0.08} strokeLinecap="round" />
          </>
        )}
        {kind === "extinguisher" && (
          <>
            <rect x={s * 0.38} y={s * 0.3} width={s * 0.26} height={s * 0.52} rx={s * 0.08} stroke="none" />
            <path d={`M${s * 0.46} ${s * 0.3} V${s * 0.2} H${s * 0.6} L${s * 0.72} ${s * 0.3}`} fill="none" strokeWidth={s * 0.06} />
          </>
        )}
        {kind === "alarm" && (
          <>
            <path d={`M${s * 0.3} ${s * 0.68} Q${s * 0.3} ${s * 0.28} ${s * 0.5} ${s * 0.26} Q${s * 0.7} ${s * 0.28} ${s * 0.7} ${s * 0.68} Z`} stroke="none" />
            <rect x={s * 0.24} y={s * 0.68} width={s * 0.52} height={s * 0.08} stroke="none" />
          </>
        )}
        {kind === "firstaid" && (
          <path d={`M${s * 0.42} ${s * 0.2} H${s * 0.58} V${s * 0.42} H${s * 0.8} V${s * 0.58} H${s * 0.58} V${s * 0.8} H${s * 0.42} V${s * 0.58} H${s * 0.2} V${s * 0.42} H${s * 0.42} Z`} stroke="none" />
        )}
        {kind === "assembly" && (
          <>
            <rect x={s * 0.16} y={s * 0.16} width={s * 0.68} height={s * 0.68} fill="none" strokeWidth={s * 0.05} />
            <circle cx={s * 0.5} cy={s * 0.44} r={s * 0.06} stroke="none" />
            <circle cx={s * 0.4} cy={s * 0.58} r={s * 0.05} stroke="none" />
            <circle cx={s * 0.6} cy={s * 0.58} r={s * 0.05} stroke="none" />
            <path d={`M${s * 0.5} ${s * 0.06} V${s * 0.24} M${s * 0.5} ${s * 0.94} V${s * 0.76} M${s * 0.06} ${s * 0.5} H${s * 0.24} M${s * 0.94} ${s * 0.5} H${s * 0.76}`} strokeWidth={s * 0.05} />
          </>
        )}
      </g>
    </g>
  );
}
