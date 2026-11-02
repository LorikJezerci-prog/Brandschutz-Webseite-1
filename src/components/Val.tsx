import { isPlaceholder, type Value } from "@/config/site";

/** Gibt einen Wert aus. Platzhalter werden sichtbar markiert, nie als echte Angabe ausgegeben. */
export function Val({ v }: { v: Value }) {
  if (isPlaceholder(v)) {
    return (
      <span className="ph" title="Platzhalter: vor Veröffentlichung ersetzen">
        [{v.placeholder}]
      </span>
    );
  }
  return <>{v}</>;
}
