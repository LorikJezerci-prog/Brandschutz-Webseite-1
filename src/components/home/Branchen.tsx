const branchen = [
  {
    title: "Pflegeheime und Senioreneinrichtungen",
    why: "Viele Bewohner können sich nicht selbst in Sicherheit bringen. Die Räumung braucht mehr Helfer, mehr Übung und eine Brandschutzordnung, die zum Haus passt.",
    start: "Evakuierungshelfer, Brandschutzordnung Teil B und C, Räumungsübung",
  },
  {
    title: "Logistik, Lager und Hallenmieter",
    why: "Große Brandlasten, Stapler und Akku-Ladezonen. Mieter in Mehrnutzer-Hallen haben oft keinen eigenen Brandschutzbeauftragten.",
    start: "Brandschutzhelfer-Ausbildung und Begehung der Ladezonen",
  },
  {
    title: "Metall, Möbel und Verpackung",
    why: "Schweißen, Späne, Holzstaub, Lacke und Kartonagen: typischer Mittelstand mit erhöhter Brandgefährdung und ohne eigenen Brandschutzbeauftragten.",
    start: "Begehung mit Mängelbericht und Erlaubnisschein für Heißarbeiten",
  },
  {
    title: "Betriebe mit Gefahrstoffen und Akkus",
    why: "Lösemittel, Gase, Lithium-Akkus und Gefahrstofflager. Hier zählt Erfahrung aus der Werkfeuerwehr, nicht nur aus dem Lehrbuch.",
    start: "Begehung der Lager und Unterstützung bei der Gefährdungsbeurteilung",
  },
  {
    title: "Autohäuser und Werkstätten",
    why: "Kraftstoffe, Öle, Schweißarbeiten und Akkus von E-Autos: auf engem Raum kommt viel zusammen.",
    start: "Begehung und Brandschutzhelfer mit Löschübung",
  },
  {
    title: "Praxen, Kitas und Büros",
    why: "Die Pflicht zu Brandschutzhelfern und jährlicher Unterweisung gilt für jeden Arbeitgeber, auch mit wenigen Beschäftigten.",
    start: "Brandschutzhelfer-Ausbildung und Unterweisung im Paket",
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
