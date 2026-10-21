import { ARROW } from "./Logo";

/** „Nach oben“ als Rettungszeichen: der Pfeil aus dem Logo auf grünem Grund */
export function ToTop() {
  return (
    <a href="#" className="totop" data-totop aria-label="Nach oben">
      <svg viewBox="36 43 28 32" aria-hidden="true" focusable="false">
        <path d={ARROW} fill="currentColor" />
      </svg>
    </a>
  );
}
