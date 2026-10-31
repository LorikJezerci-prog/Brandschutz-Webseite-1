import { groups, servicesIn, type Group } from "@/config/services";
import { Illustration } from "./Illustration";

const ownGroups: Group[] = ["betreuung", "dokumente", "schulung"];

/** Leistungen in drei Gruppen, jede mit Beispielbild und Links zu den Detailseiten */
export function ServiceGroups() {
  return (
    <div className="groups">
      {ownGroups.map((g) => (
        <article key={g} className="group" aria-labelledby={`grp-${g}`}>
          <Illustration motif={groups[g].motif} className="group__media" />
          <div className="group__body">
            <h3 id={`grp-${g}`} className="group__title">
              {groups[g].title}
            </h3>
            <p className="group__lead">{groups[g].lead}</p>
            <ul className="group__list">
              {servicesIn(g).map((s) => (
                <li key={s.slug}>
                  <a href={`/leistungen/${s.slug}`} className="group__link">
                    <span className="group__name">{s.title}</span>
                    <span className="group__short">{s.short}</span>
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}

export function ServicesIntro({ as: Tag = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <div className="section-head">
      <p className="kicker">Leistungen</p>
      <Tag className="section-title">Alles für den Brandschutz in Ihrem Betrieb.</Tag>
      <p className="section-lead">
        Von der einmaligen Begehung bis zur dauerhaften Betreuung als externer Brandschutzbeauftragter. Vor Ort, im
        Hessischen Ried und an der Bergstraße.
      </p>
    </div>
  );
}
