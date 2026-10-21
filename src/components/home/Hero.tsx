import { site } from "@/config/site";
import { Illustration } from "../Illustration";
import { ARROW } from "../Logo";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* Pfeil aus dem Logo als ruhiges Hintergrundmotiv */}
      <svg className="hero__arrow" viewBox="38 45 24 28" aria-hidden="true" focusable="false">
        <path d={ARROW} />
      </svg>
      <div className="wrap hero__grid">
        <div className="hero__text">
          <p className="hero__kicker">{site.name} · {site.region.label}</p>
          <h1 id="hero-title" className="hero__title">
            Brandschutz beginnt, bevor etwas passiert.
          </h1>
          <p className="hero__lead">
            Organisatorischer Brandschutz für Betriebe in Lampertheim und Umgebung: verständlich, praxisnah und mit
            klaren Grenzen, was ich übernehme und was nicht.
          </p>
          <div className="hero__actions">
            <a className="btn btn--white" href="#kontakt">
              Beratung anfragen
            </a>
            <a className="btn btn--outline-white" href="#leistungen">
              Leistungen entdecken
            </a>
          </div>
          <ul className="hero__facts" aria-label="Hintergrund">
            <li>Chemikant</li>
            <li>Werkfeuerwehr</li>
            <li>Brandschutzbeauftragter nach DGUV 205-003, Abschluss 12/2026</li>
          </ul>
        </div>
        <div className="hero__media">
          <Illustration motif="hero" />
        </div>
      </div>
    </section>
  );
}
