import { groups, servicesIn, startPackages, type Group } from "@/config/services";

const order: Group[] = ["betreuung", "dokumente", "schulung", "partner"];
const featured = new Set(startPackages.map((p) => p.slug));

/** Kompakte Liste aller übrigen Leistungen unter den Start-Paketen */
export function MoreServices() {
  return (
    <section id="weitere-leistungen" className="section" aria-labelledby="more-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Weitere Leistungen</p>
          <h2 id="more-title" className="section-title">
            Alles Weitere rund um den betrieblichen Brandschutz.
          </h2>
        </div>
        <div className="more">
          {order.map((g) => {
            const list = servicesIn(g).filter((s) => !featured.has(s.slug));
            if (!list.length) return null;
            return (
              <div key={g} className={`more__col${g === "partner" ? " more__col--partner" : ""}`}>
                <h3 className="more__title">{groups[g].title}</h3>
                <ul className="more__list">
                  {list.map((s) => (
                    <li key={s.slug}>
                      <a href={`/leistungen/${s.slug}/`}>
                        <span className="more__name">{s.title}</span>
                        <span className="more__short">{s.short}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <p className="more__all">
          <a href="/leistungen/">Alle Leistungen im Detail →</a>
        </p>
      </div>
    </section>
  );
}
