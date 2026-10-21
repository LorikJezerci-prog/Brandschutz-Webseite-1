import { availability, services, type Service } from "@/config/services";
import { MotifImage } from "./scenes/Motif";
import { StatusBadge } from "./StatusBadge";

function Card({ s, idPrefix }: { s: Service; idPrefix: string }) {
  const status = availability(s);
  return (
    <article className={`card card--${s.size}`} aria-labelledby={`${idPrefix}-${s.slug}`}>
      <div className="card__media">
        <MotifImage motif={s.motif} id={`${idPrefix}-${s.slug}-m`} className="card__img" />
        <span className="card__letter" aria-hidden="true">
          {s.letter}
        </span>
      </div>
      <div className="card__body">
        <StatusBadge status={status} />
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

/** Leistungsübersicht als Raster, das der Endlage der Unterlagen auf dem Tisch entspricht */
export function ServiceCards({ idPrefix = "svc" }: { idPrefix?: string }) {
  const core = services.filter((s) => s.horizon === "kern");
  const later = services.filter((s) => s.horizon === "perspektivisch");
  return (
    <>
      <div className="cards">
        {core.map((s) => (
          <Card key={s.slug} s={s} idPrefix={idPrefix} />
        ))}
      </div>
      <div className="cards-later">
        <p className="cards-later__label">Perspektivische Geschäftsfelder</p>
        <div className="cards cards--compact">
          {later.map((s) => (
            <Card key={s.slug} s={s} idPrefix={idPrefix} />
          ))}
        </div>
      </div>
    </>
  );
}

export function ServicesIntro() {
  return (
    <div className="section-head">
      <p className="kicker">Leistungen</p>
      <h2 className="section-title">Aus der Geschichte werden konkrete Leistungen.</h2>
      <p className="section-lead">
        Jede Leistung ist nach ihrem tatsächlichen Stand gekennzeichnet: was angefragt werden kann, was mit dem
        Abschluss der laufenden Weiterbildung hinzukommt und welche Felder perspektivisch gemeinsam mit Fachpartnern
        entstehen.
      </p>
      <ul className="legend" aria-label="Bedeutung der Kennzeichnung">
        <li>
          <span className="badge badge--verfuegbar"><span className="badge__dot" aria-hidden="true" />Anfrage möglich</span>
        </li>
        <li>
          <span className="badge badge--nach-weiterbildung"><span className="badge__dot" aria-hidden="true" />Nach Abschluss der Weiterbildung</span>
        </li>
        <li>
          <span className="badge badge--perspektivisch"><span className="badge__dot" aria-hidden="true" />Perspektivisch, mit Fachpartnern</span>
        </li>
      </ul>
    </div>
  );
}
