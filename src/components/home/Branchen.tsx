const branchen = [
  {
    title: "Pflegeheime und Senioreneinrichtungen",
    why: "Viele Bewohner können sich nicht selbst in Sicherheit bringen. Die Räumung braucht mehr Helfer und Übung.",
    start: "Brandschutzhelfer, Evakuierungshelfer und Räumungsübung",
  },
  {
    title: "Autohäuser und Werkstätten",
    why: "Kraftstoffe, Öle, Schweißarbeiten und Akkus von E-Autos: auf engem Raum kommt viel zusammen.",
    start: "Begehung und Brandschutzhelfer mit Löschübung",
  },
  {
    title: "Hotels und Gastronomie",
    why: "Gäste kennen die Fluchtwege nicht, nachts ist wenig Personal da, in der Küche droht Fettbrand.",
    start: "Brandschutzordnung und Unterweisung des Personals, auch für den Nachtdienst",
  },
  {
    title: "Logistik und Lager",
    why: "Große Brandlasten, Fahrzeuge und Ladeinfrastruktur in weiten Hallen.",
    start: "Begehung und Feuerlöscher-Bedarfsberechnung",
  },
  {
    title: "Produktion, Bäckereien und Handwerk",
    why: "Holz- und Mehlstaub, Lacke, Öfen und Heißarbeiten erhöhen die Brandgefährdung.",
    start: "Brandschutzhelfer je Standort und Regeln für Heißarbeiten",
  },
] as const;

export function Branchen() {
  return (
    <section id="branchen" className="section section--tint" aria-labelledby="branchen-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Für wen</p>
          <h2 id="branchen-title" className="section-title">
            Jede Branche brennt anders.
          </h2>
          <p className="section-lead">Darum beginnt die Zusammenarbeit dort, wo in Ihrem Betrieb das größte Risiko liegt.</p>
        </div>
        <ul className="branchen">
          {branchen.map((b) => (
            <li key={b.title} className="branche">
              <h3 className="branche__title">{b.title}</h3>
              <p className="branche__why">{b.why}</p>
              <p className="branche__start">
                <span>Guter Einstieg</span>
                {b.start}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
