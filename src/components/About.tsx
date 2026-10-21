import { site } from "@/config/site";
import { Val } from "./Val";

const stateLabel = {
  vorhanden: "Vorhanden",
  "in-weiterbildung": "In Weiterbildung",
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
            Hinter {site.name} steht <Val v={site.founder.name} />. Der berufliche Alltag als Chemikant im
            chemischen Produktionsumfeld und die Tätigkeit in der Werkfeuerwehr prägen den Blick auf Brandschutz: Er
            muss im laufenden Betrieb funktionieren, nicht nur auf dem Papier.
          </p>
          <p>
            {site.name} wird Schritt für Schritt aufgebaut. Angeboten wird nur, wofür die Qualifikation
            nachgewiesen ist. Wo zusätzliche Zulassungen oder Technik nötig sind, erfolgt die Arbeit gemeinsam mit
            qualifizierten Fachbetrieben.
          </p>
        </div>
        <div className="about__facts">
          <h3 className="about__facts-title">Qualifikation und Stand</h3>
          <ul className="quals">
            {site.qualifications.map((q) => (
              <li key={q.label} className={`quals__item quals__item--${q.state}`}>
                <div>
                  <p className="quals__label">{q.label}</p>
                  <p className="quals__detail">{q.detail}</p>
                  {q.state === "in-weiterbildung" && "expected" in q && <p className="quals__detail">{q.expected}</p>}
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
