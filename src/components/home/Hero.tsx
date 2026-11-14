import { isPlaceholder, launch, prelaunch, site } from "@/config/site";
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
          <p className="hero__kicker">
            {prelaunch ? `Start am ${launch.startLabel} · ${site.region.label}` : `${site.name} · ${site.region.label}`}
          </p>
          <h1 id="hero-title" className="hero__title">
            Brandschutz beginnt, bevor etwas passiert.
          </h1>
          <p className="hero__lead">
            Brandschutzhelfer-Ausbildung, Brandschutzordnung und Begehungen für Betriebe in Lampertheim, Bürstadt
            und Umgebung. Auf Wunsch dauerhaft als externer Brandschutzbeauftragter. Mit Festpreis vorab.
          </p>
          <div className="hero__actions">
            <a className="btn btn--white" href="#kontakt">
              Erstgespräch vereinbaren
            </a>
            {!isPlaceholder(site.contact.phone) && (
              <a className="btn btn--outline-white" href={`tel:${site.contact.phone.replace(/[^0-9+]/g, "")}`}>
                Anrufen: {site.contact.phone}
              </a>
            )}
          </div>
          <ul className="hero__facts" aria-label="Hintergrund">
            <li>Werkfeuerwehr</li>
            <li>{prelaunch ? "Ausbildung Brandschutzbeauftragter (DGUV 205-003), Abschluss 12/2026" : "Brandschutzbeauftragter nach DGUV 205-003"}</li>
            <li>Festpreis vorab</li>
          </ul>
        </div>
        <div className="hero__media">
          <Illustration motif="hero" />
        </div>
      </div>
    </section>
  );
}
