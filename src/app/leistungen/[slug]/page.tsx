import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Illustration } from "@/components/Illustration";
import { StatusBadge } from "@/components/StatusBadge";
import { availability, hasAll, serviceBySlug, services } from "@/config/services";
import { site } from "@/config/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return {
    title: s.title,
    description: `${s.summary} ${site.region.label}.`,
    alternates: { canonical: `/leistungen/${s.slug}` },
  };
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const status = availability(s);
  const others = services.filter((o) => o.slug !== s.slug).slice(0, 3);

  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="wrap detail-hero__grid">
          <div>
            <p className="crumbs">
              <a href="/">Start</a> / <a href="/leistungen">Leistungen</a> / {s.letter}
            </p>
            <StatusBadge status={status} />
            <h1 id="detail-title">{s.title}</h1>
            <p className="detail-hero__lead">{s.summary}</p>
          </div>
          <div className="detail-hero__media">
            <Illustration motif={s.motif} />
          </div>
        </div>
      </section>

      <div className="detail-body">
        <div className="wrap detail-body__grid">
          <div>
            <section aria-labelledby="why">
              <h2 id="why">Worum es geht</h2>
              <p>{s.why}</p>
            </section>
            <section aria-labelledby="tasks">
              <h2 id="tasks">Mögliche Aufgaben</h2>
              <ul className="ticks">
                {s.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            {s.scope && (
              <section aria-labelledby="scope">
                <h2 id="scope">Leistungsumfang im Überblick</h2>
                <table className="scope">
                  <thead>
                    <tr>
                      <th scope="col">Gegenstand</th>
                      <th scope="col">Tätigkeit</th>
                      <th scope="col">Stand</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.scope.map((r) => (
                      <tr key={r.item + r.mode}>
                        <td>{r.item}</td>
                        <td>{r.mode}</td>
                        <td>{hasAll(r.requires) ? "Anfrage möglich" : r.requires.includes("frp") ? "In Vorbereitung" : "Nach Abschluss der Weiterbildung"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
            <section aria-labelledby="benefit">
              <h2 id="benefit">Ihr Nutzen</h2>
              <p>{s.benefit}</p>
            </section>
            <section aria-labelledby="bounds">
              <h2 id="bounds">Abgrenzung</h2>
              <div className="boundary">
                {s.boundaries.map((b) => (
                  <p key={b}>{b}</p>
                ))}
              </div>
            </section>
          </div>

          <aside className="aside-cta" aria-label="Anfrage">
            <h2>{status === "verfuegbar" ? "Anfrage stellen" : "Interesse vormerken"}</h2>
            <p>
              {status === "verfuegbar"
                ? "Beschreiben Sie kurz Ihr Objekt und Ihr Anliegen. Sie erhalten eine Rückmeldung mit dem möglichen Vorgehen."
                : "Diese Leistung ist noch nicht freigeschaltet. Sie können trotzdem Kontakt aufnehmen; ein Angebot gibt es erst, wenn die Voraussetzungen nachgewiesen sind."}
            </p>
            <a className="btn btn--primary" href={`/kontakt?leistung=${s.slug}#formular`}>
              Unverbindliche Anfrage stellen
            </a>
            <p>
              Weitere Leistungen:{" "}
              {others.map((o, i) => (
                <span key={o.slug}>
                  {i > 0 && ", "}
                  <a href={`/leistungen/${o.slug}`}>{o.title}</a>
                </span>
              ))}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
