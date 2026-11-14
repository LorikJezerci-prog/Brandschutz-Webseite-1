import { evaluate, initialAnswers, questions, type Hint } from "@/lib/quick-check";

export function HintItem({ h }: { h: Hint }) {
  return (
    <li className={`hint hint--${h.tone}`}>
      <p className="hint__title">{h.title}</p>
      <p className="hint__text">{h.text}</p>
    </li>
  );
}

/** Schnellcheck. Das Verhalten steckt in site-runtime (initQuickCheck), damit es ohne React-Bundle läuft. */
export function QuickCheck() {
  return (
    <section id="schnellcheck" className="section" aria-labelledby="check-title">
      <div className="wrap check" data-quickcheck>
        <div className="check__intro">
          <p className="kicker">Schnellcheck</p>
          <h2 id="check-title" className="section-title">
            Wo steht Ihr Betrieb?
          </h2>
          <p className="section-lead">
            Sechs Angaben, sofort ein erster Überblick. Alles bleibt in Ihrem Browser, es wird nichts gesendet.
          </p>
          <form className="check__form" action="#schnellcheck">
            <label className="check__staff" htmlFor="qc-staff">
              <span>Anzahl Beschäftigte</span>
              <input id="qc-staff" name="staff" type="number" inputMode="numeric" min={1} max={5000} defaultValue={initialAnswers.staff} />
            </label>
            {questions.map((q) => (
              <label key={q.key} className="toggle">
                <input type="checkbox" name={q.key} defaultChecked={initialAnswers[q.key]} />
                <span className="toggle__box" aria-hidden="true" />
                <span>{q.label}</span>
              </label>
            ))}
          </form>
          <noscript>
            <p className="check__noscript">Der Schnellcheck benötigt JavaScript. Gern klären wir die Fragen im Erstgespräch.</p>
          </noscript>
        </div>
        <div className="check__result" aria-live="polite">
          <h3 className="check__result-title">Ihr Ergebnis</h3>
          <ul className="hints" data-hints>
            {evaluate(initialAnswers).map((h) => (
              <HintItem key={h.title} h={h} />
            ))}
          </ul>
          <p className="check__note">
            Orientierung, keine Rechtsberatung. Verbindlich ist die Gefährdungsbeurteilung für Ihren Betrieb.
          </p>
          <a className="btn btn--primary" href="#kontakt">
            Ergebnis gemeinsam besprechen
          </a>
        </div>
      </div>
    </section>
  );
}
