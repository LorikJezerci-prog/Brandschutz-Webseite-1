import { groups, servicesIn } from "@/config/services";

const notOffered = [
  "Brandschutzkonzepte und Nachweise für den Bauantrag",
  "Planung, Errichtung und Prüfung von Brandmeldeanlagen",
  "Wartung von Feuerlöschern, Türen und Anlagen in Eigenregie",
  "Übernahme der Verantwortung des Unternehmers",
];

export function Scope() {
  return (
    <section id="abgrenzung" className="section" aria-labelledby="scope-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Klare Grenzen</p>
          <h2 id="scope-title" className="section-title">
            Was ich vermittle und was ich nicht mache.
          </h2>
          <p className="section-lead">
            Ich biete nur an, wofür ich qualifiziert bin. Alles andere übernehmen Fachleute, die dafür zugelassen sind.
          </p>
        </div>
        <div className="scope-grid scope-grid--two">
          <div className="scope-col scope-col--later">
            <h3 className="scope-col__title">
              <span className="scope-col__icon" aria-hidden="true" />
              {groups.partner.title}
            </h3>
            <p className="scope-col__note">{groups.partner.lead}</p>
            <ul className="scope-col__list">
              {servicesIn("partner").map((s) => (
                <li key={s.slug}>
                  <a href={`/leistungen/${s.slug}`}>{s.title}</a>
                </li>
              ))}
              <li>Zeichnen neuer Flucht- und Rettungspläne</li>
            </ul>
          </div>
          <div className="scope-col scope-col--no">
            <h3 className="scope-col__title">
              <span className="scope-col__icon" aria-hidden="true" />
              Mache ich nicht
            </h3>
            <p className="scope-col__note">Dafür gibt es Fachplaner, Sachverständige und zertifizierte Fachfirmen.</p>
            <ul className="scope-col__list">
              {notOffered.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
