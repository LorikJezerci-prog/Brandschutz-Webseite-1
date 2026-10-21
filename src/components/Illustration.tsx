import type { ReactNode } from "react";
import type { Motif } from "@/config/services";

/**
 * Schlichte Beispielbilder im Stil der Marke. Sie zeigen Situationen, keine
 * echten Objekte oder Kunden, und sind deshalb als Beispielbild gekennzeichnet.
 * Sobald eigene Fotos vorliegen, können sie hier ersetzt werden.
 */

const G = {
  bg: "#e7f3ed",
  bg2: "#d4eadf",
  brand: "#0a6b44",
  dark: "#06402a",
  mid: "#3f9c70",
  soft: "#a9d6bf",
  white: "#ffffff",
  red: "#c8352c",
  grey: "#c9d6cf",
};

/** Rettungszeichen „Notausgang“ in vereinfachter Form */
function ExitSign({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect width="64" height="34" rx="3" fill={G.brand} />
      <rect x="5" y="5" width="18" height="24" fill="none" stroke={G.white} strokeWidth="2.5" />
      <circle cx="35" cy="9" r="3.2" fill={G.white} />
      <path d="M33 13 L29 21 L33 22 L31 30 M33 13 L38 20 L43 19 M31 21 L25 24" stroke={G.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M46 17 H58 M53 12 L58 17 L53 22" stroke={G.white} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  );
}

function Extinguisher({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="0" y="14" width="26" height="62" rx="9" fill={G.red} />
      <rect x="7" y="4" width="12" height="12" rx="2" fill={G.dark} />
      <path d="M19 8 C34 8 36 18 36 30" stroke={G.dark} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <rect x="4" y="34" width="18" height="16" rx="2" fill={G.white} opacity="0.9" />
    </g>
  );
}

function Person({ x, y, s = 1, tone = G.dark }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="20" cy="12" r="11" fill={tone} />
      <path d="M0 62 C0 36 8 28 20 28 C32 28 40 36 40 62 Z" fill={tone} />
    </g>
  );
}

function Check({ x, y, s = 1, fill = G.brand }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="12" cy="12" r="12" fill={fill} />
      <path d="M6.5 12.5 L10.5 16.5 L17.5 8.5" stroke={G.white} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Lines({ x, y, w, n, gap = 14 }: { x: number; y: number; w: number; n: number; gap?: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x} y={y + i * gap} width={i % 3 === 2 ? w * 0.6 : w} height="5" rx="2.5" fill={G.grey} />
      ))}
    </g>
  );
}

const scenes: Record<Motif | "hero", ReactNode> = {
  /** Beratung: Unterlagen und Checkliste auf dem Tisch, zwei Gesprächspartner */
  beratung: (
    <g>
      <rect x="0" y="210" width="480" height="110" fill={G.bg2} />
      <Person x={70} y={128} s={1.5} tone={G.mid} />
      <Person x={350} y={128} s={1.5} />
      <rect x="40" y="206" width="400" height="14" rx="4" fill={G.brand} />
      <g transform="rotate(-4 200 170)">
        <rect x="150" y="120" width="120" height="90" rx="4" fill={G.white} />
        <Check x={162} y={134} s={0.7} />
        <rect x="186" y="138" width="70" height="6" rx="3" fill={G.grey} />
        <Check x={162} y={158} s={0.7} />
        <rect x="186" y="162" width="58" height="6" rx="3" fill={G.grey} />
        <circle cx="170" cy="190" r="8.4" fill="none" stroke={G.grey} strokeWidth="2.5" />
        <rect x="186" y="186" width="64" height="6" rx="3" fill={G.grey} />
      </g>
      <rect x="282" y="168" width="22" height="30" rx="3" fill={G.white} />
      <path d="M304 176 C314 176 314 190 304 190" stroke={G.white} strokeWidth="4" fill="none" />
    </g>
  ),

  /** Externer Brandschutzbeauftragter: Begehung mit Klemmbrett vor dem Gebäude */
  bsb: (
    <g>
      <rect x="0" y="250" width="480" height="70" fill={G.bg2} />
      <rect x="150" y="70" width="290" height="180" fill={G.white} />
      <rect x="150" y="70" width="290" height="16" fill={G.soft} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => <rect key={`${r}-${c}`} x={170 + c * 52} y={100 + r * 42} width="36" height="26" rx="2" fill={G.bg2} />),
      )}
      <rect x="262" y="200" width="56" height="50" fill={G.brand} />
      <ExitSign x={258} y={168} s={1} />
      <Person x={50} y={150} s={1.6} />
      <g transform="rotate(8 120 205)">
        <rect x="96" y="176" width="56" height="72" rx="4" fill={G.white} stroke={G.dark} strokeWidth="3" />
        <rect x="112" y="170" width="24" height="10" rx="3" fill={G.dark} />
        <Check x={104} y={190} s={0.55} />
        <rect x="122" y="193" width="22" height="5" rx="2.5" fill={G.grey} />
        <Check x={104} y={210} s={0.55} />
        <rect x="122" y="213" width="22" height="5" rx="2.5" fill={G.grey} />
        <rect x="104" y="232" width="40" height="5" rx="2.5" fill={G.grey} />
      </g>
    </g>
  ),

  /** Brandschutzordnung und Pläne: Aushang mit Teil A und Plan an der Wand */
  ordnung: (
    <g>
      <rect x="54" y="40" width="170" height="240" rx="4" fill={G.white} />
      <rect x="54" y="40" width="170" height="34" rx="4" fill={G.red} />
      <rect x="54" y="62" width="170" height="12" fill={G.red} />
      <rect x="70" y="52" width="110" height="9" rx="4" fill={G.white} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="70" y={92 + i * 44} width="26" height="26" rx="3" fill={i === 3 ? G.red : G.brand} />
          <rect x="106" y={96 + i * 44} width="100" height="6" rx="3" fill={G.grey} />
          <rect x="106" y={108 + i * 44} width="70" height="6" rx="3" fill={G.grey} />
        </g>
      ))}
      <rect x="250" y="60" width="190" height="200" rx="4" fill={G.white} />
      <g fill="none" stroke={G.dark} strokeWidth="3">
        <rect x="268" y="80" width="154" height="130" />
        <path d="M268 140 H330 M360 140 H422 M330 80 V140 M376 140 V210" />
      </g>
      <path d="M300 116 V160 H345 V196" stroke={G.brand} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M335 188 L345 200 L355 188" stroke={G.brand} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="300" cy="112" r="7" fill={G.white} stroke={G.dark} strokeWidth="3" />
      <rect x="268" y="226" width="60" height="8" rx="4" fill={G.grey} />
      <rect x="390" y="222" width="32" height="18" rx="2" fill={G.brand} />
    </g>
  ),

  /** Unterweisung: Gruppe vor einer Tafel mit Feuerlöscher */
  unterweisung: (
    <g>
      <rect x="0" y="262" width="480" height="58" fill={G.bg2} />
      <rect x="150" y="38" width="250" height="150" rx="6" fill={G.white} />
      <Extinguisher x={182} y={66} s={1.2} />
      <Lines x={250} y={78} w={120} n={5} gap={20} />
      <Person x={70} y={88} s={1.7} tone={G.brand} />
      <Person x={160} y={214} s={1.1} tone={G.mid} />
      <Person x={230} y={210} s={1.15} />
      <Person x={300} y={214} s={1.1} tone={G.mid} />
      <Person x={370} y={210} s={1.15} />
    </g>
  ),

  /** Brandschutztür mit Obentürschließer und Rettungszeichen */
  tuer: (
    <g>
      <rect x="0" y="270" width="480" height="50" fill={G.bg2} />
      <rect x="150" y="70" width="180" height="200" fill={G.dark} />
      <rect x="160" y="80" width="78" height="190" fill={G.soft} />
      <rect x="242" y="80" width="78" height="190" fill={G.soft} />
      <rect x="180" y="110" width="38" height="56" fill={G.white} opacity="0.7" />
      <rect x="262" y="110" width="38" height="56" fill={G.white} opacity="0.7" />
      <rect x="170" y="86" width="40" height="8" rx="2" fill={G.dark} />
      <rect x="270" y="86" width="40" height="8" rx="2" fill={G.dark} />
      <rect x="218" y="186" width="16" height="6" rx="3" fill={G.dark} />
      <rect x="246" y="186" width="16" height="6" rx="3" fill={G.dark} />
      <ExitSign x={208} y={26} s={1} />
      <circle cx="380" cy="200" r="16" fill={G.white} />
      <rect x="372" y="192" width="16" height="16" rx="2" fill={G.red} />
      <Extinguisher x={80} y={190} s={0.9} />
    </g>
  ),

  /** Brandmeldeanlage: Rauchmelder an der Decke, Handmelder an der Wand */
  bma: (
    <g>
      <rect x="0" y="0" width="480" height="40" fill={G.bg2} />
      <path d="M210 40 H270 V50 C270 58 210 58 210 50 Z" fill={G.white} />
      <circle cx="240" cy="54" r="5" fill={G.red} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${206 - i * 18} ${72 + i * 16} Q240 ${92 + i * 22} ${274 + i * 18} ${72 + i * 16}`} stroke={G.mid} strokeWidth="4" fill="none" strokeLinecap="round" opacity={1 - i * 0.25} />
      ))}
      <rect x="320" y="150" width="70" height="80" rx="6" fill={G.red} />
      <rect x="332" y="162" width="46" height="46" rx="3" fill={G.white} />
      <path d="M346 196 L355 176 L364 196" stroke={G.red} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="70" y="140" width="120" height="110" rx="6" fill={G.white} />
      <rect x="84" y="156" width="92" height="30" rx="3" fill={G.dark} />
      <circle cx="98" cy="208" r="7" fill={G.brand} />
      <circle cx="122" cy="208" r="7" fill={G.soft} />
      <circle cx="146" cy="208" r="7" fill={G.soft} />
      <rect x="84" y="226" width="92" height="8" rx="4" fill={G.grey} />
    </g>
  ),

  /** Startseite: helles Gewerbegebäude mit Fluchtweg und Sammelstelle */
  hero: (
    <g>
      <rect x="0" y="252" width="480" height="68" fill={G.bg2} />
      <rect x="60" y="70" width="300" height="182" fill={G.white} />
      <rect x="60" y="70" width="300" height="18" fill={G.soft} />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => <rect key={`${r}-${c}`} x={80 + c * 56} y={104 + r * 44} width="40" height="28" rx="2" fill={G.bg2} />),
      )}
      <rect x="186" y="200" width="50" height="52" fill={G.brand} />
      <ExitSign x={179} y={168} s={1} />
      <path d="M236 276 H370 V230" stroke={G.brand} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 16" />
      <rect x="350" y="170" width="76" height="60" rx="4" fill={G.brand} />
      <g fill="none" stroke={G.white} strokeWidth="3">
        <rect x="362" y="180" width="52" height="40" rx="2" />
      </g>
      {[[376, 192], [400, 192], [388, 206]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill={G.white} />
      ))}
    </g>
  ),
};

export function Illustration({ motif, className, label = true }: { motif: Motif | "hero"; className?: string; label?: boolean }) {
  return (
    <figure className={`illu ${className ?? ""}`}>
      <svg viewBox="0 0 480 320" role="img" aria-label="Beispielbild" focusable="false">
        <rect width="480" height="320" fill={G.bg} />
        {scenes[motif]}
      </svg>
      {label && <figcaption className="illu__tag">Beispielbild</figcaption>}
    </figure>
  );
}
