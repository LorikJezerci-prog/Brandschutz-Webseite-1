import { startPackages } from "@/config/services";

/** Die drei Start-Pakete plus die dauerhafte Betreuung als Ziel der Zusammenarbeit */
export function Packages() {
  return (
    <section id="leistungen" className="section" aria-labelledby="packages-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">So starten wir</p>
          <h2 id="packages-title" className="section-title">
            Drei klare Einstiege. Festpreis vorab.
          </h2>
          <p className="section-lead">
            Die meisten Betriebe beginnen mit einem dieser drei Angebote. Sie wissen vorher, was Sie bekommen und was es
            kostet.
          </p>
        </div>
        <ol className="packages">
          {startPackages.map((p, i) => (
            <li key={p.slug} className="package">
              <p className="package__label">
                <span aria-hidden="true">{i + 1}</span>
                {p.label}
              </p>
              <h3 className="package__title">{p.title}</h3>
              <p className="package__pitch">{p.pitch}</p>
              <p className="package__for">
                <span>Für wen</span>
                {p.forWhom}
              </p>
              <ul className="ticks package__list">
                {p.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="package__result">
                <span>Ergebnis</span>
                {p.result}
              </p>
              {p.next && <p className="package__next">{p.next}</p>}
              <div className="package__actions">
                <a className="btn btn--primary" href={`/kontakt/?leistung=${p.slug}#formular`}>
                  Angebot anfordern
                </a>
                <a className="package__more" href={`/leistungen/${p.slug}/`}>
                  Details
                </a>
              </div>
            </li>
          ))}
        </ol>

        <aside className="retainer" aria-labelledby="retainer-title">
          <div>
            <p className="kicker kicker--light">Dauerhafte Betreuung</p>
            <h3 id="retainer-title" className="retainer__title">
              Externer Brandschutzbeauftragter zum festen Jahresbetrag
            </h3>
            <p className="retainer__text">
              Regelmäßige Begehungen, Pflege von Brandschutzordnung und Unterweisungen, Fristen für Prüfungen im Blick und
              ein Ansprechpartner für Behörde, Feuerwehr und Versicherer. Sie müssen niemanden ausbilden und freistellen.
            </p>
          </div>
          <a className="btn btn--white" href="/kontakt/?leistung=externer-brandschutzbeauftragter#formular">
            Betreuung anfragen
          </a>
        </aside>
      </div>
    </section>
  );
}
