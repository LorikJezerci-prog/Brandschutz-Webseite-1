import { site } from "@/config/site";

/** Bildmarke von Brandschutz Ried: weiße Flamme mit Pfeil nach oben auf grünem Grund (nach Logodatei) */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="logo__mark">
      <rect width="100" height="100" rx="21" fill="var(--brand)" />
      <path fill="#fff" d={FLAME} />
      <path fill="var(--brand)" d={ARROW} />
    </svg>
  );
}

export const FLAME =
  "M50 19.5C54.5 29 68.5 39.5 68.5 57C68.5 70.5 60 79.2 50 79.2C40 79.2 31.5 70.5 31.5 57C31.5 48 35.5 42 40.5 36.8C41.3 42 43 45.6 45.8 47.6C44.8 38 46.3 28 50 19.5Z";
export const ARROW = "M50 47L59.8 57.8H54.4V71.2H45.6V57.8H40.2Z";

export function Logo() {
  const [first, ...rest] = site.name.split(" ");
  return (
    <a href="/" className="logo" aria-label={`${site.name}, zur Startseite`}>
      <LogoMark />
      <span className="logo__text">
        <span className="logo__name">{first}</span>
        {rest.length > 0 && <span className="logo__region">{rest.join(" ")}</span>}
      </span>
    </a>
  );
}
