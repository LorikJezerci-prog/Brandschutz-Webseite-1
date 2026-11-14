import { prelaunch, site } from "@/config/site";
import { Val } from "./Val";

const stateLabel = {
  vorhanden: "Nachgewiesen",
  "in-weiterbildung": "Abschluss 12/2026",
} as const;

export function About() {
  return (
    <section id="hintergrund" className="section" aria-labelledby="about-title">
      <div className="wrap about">
        <div className="about__text">
          <p className="kicker">Hintergrund</p>
          <h2 id="about-title" className="section-title">
            Aus dem Betrieb, für den Betrieb.
          </h2>
          <p>
            Hinter {site.name} steht <Val v={site.founder.name} />. Die Tätigkeit als Oberfeuerwehrmann in einer
            Werkfeuerwehr prägt den Blick auf Brandschutz: Er muss im laufenden Betrieb funktionieren, nicht nur auf dem
            Papier.
          </p>
          <p>
            {prelaunch
              ? "Die Ausbildung zum Brandschutzbeauftragten nach DGUV Information 205-003 schließe ich im Dezember 2026 ab. "
              : ""}
            Angeboten wird nur, wofür die Qualifikation nachgewiesen ist. Wo zusätzliche Sachkunde oder Zulassungen
            nötig sind, arbeite ich mit qualifizierten Fachbetrieben zusammen.
          </p>
        </div>
        <div className="about__facts">
          <h3 className="about__facts-title">Qualifikation</h3>
          <ul className="quals">
            {site.qualifications.map((q) => (
              <li key={q.label} className={`quals__item quals__item--${q.state}`}>
                <div>
                  <p className="quals__label">{q.label}</p>
                  <p className="quals__detail">{q.detail}</p>
                </div>
                <span className="quals__state">{stateLabel[q.state]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
