import { availability, services, type Service } from "@/config/services";
import { Illustration } from "./Illustration";
import { StatusBadge } from "./StatusBadge";

function Card({ s, idPrefix }: { s: Service; idPrefix: string }) {
  return (
    <article className="card" aria-labelledby={`${idPrefix}-${s.slug}`}>
      <Illustration motif={s.motif} className="card__media" />
      <div className="card__body">
        <StatusBadge status={availability(s)} />
        <h3 id={`${idPrefix}-${s.slug}`} className="card__title">
          <a href={`/leistungen/${s.slug}`} className="card__link">
            {s.title}
          </a>
        </h3>
        <p className="card__text">{s.short}</p>
        <span className="card__more" aria-hidden="true">
          Mehr erfahren <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}

export function ServiceCards({ idPrefix = "svc" }: { idPrefix?: string }) {
  return (
    <div className="cards">
      {services.map((s) => (
        <Card key={s.slug} s={s} idPrefix={idPrefix} />
      ))}
    </div>
  );
}

export function ServicesIntro({ as: Tag = "h2" }: { as?: "h1" | "h2" }) {
  return (
    <div className="section-head">
      <p className="kicker">Leistungen</p>
      <Tag className="section-title">Leistungen für Ihren Betrieb.</Tag>
      <p className="section-lead">
        Jede Leistung zeigt ihren Stand: ab wann sie angeboten wird und wo Fachpartner gebraucht werden.
      </p>
    </div>
  );
}
