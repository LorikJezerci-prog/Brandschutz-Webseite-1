import { site } from "@/config/site";

/** Bildmarke von Brandschutz Ried: weiße Flamme mit Pfeil nach oben auf grünem Grund */
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="logo__mark">
      <rect width="100" height="100" rx="18" fill="var(--brand)" />
      <path
        fill="#fff"
        d="M50 19.5C53 27 60 33 64 40C67 45 68.6 51 68.6 57C68.6 70 60 79.5 50 79.5C40 79.5 31.4 70 31.4 57C31.4 49 35 43 39.9 37.6C41 42 43 45 46 47C45.6 38 47 27 50 19.5Z"
      />
      <path fill="var(--brand)" d="M50 47L61.3 58.4H54.3V70.6H45.7V58.4H38.7Z" />
    </svg>
  );
}

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
