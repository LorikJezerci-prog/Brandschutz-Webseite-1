import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Illustration } from "@/components/Illustration";
import { groups, serviceBySlug, services } from "@/config/services";
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
  const partner = s.group === "partner";
  const others = services.filter((o) => o.group === s.group && o.slug !== s.slug).slice(0, 4);

  return (
    <>
      <section className="detail-hero" aria-labelledby="detail-title">
        <div className="wrap detail-hero__grid">
          <div>
            <p className="crumbs">
              <a href="/">Start</a> / <a href="/leistungen">Leistungen</a> / {groups[s.group].title}
            </p>
            {partner && (
              <span className="badge badge--partner">
                <span className="badge__dot" aria-hidden="true" />
                Prüfung durch Fachbetrieb
              </span>
            )}
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
              <h2 id="tasks">{partner ? "Was ich übernehme" : "Was dazugehört"}</h2>
              <ul className="ticks">
                {s.tasks.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="benefit">
              <h2 id="benefit">Ihr Nutzen</h2>
              <p>{s.benefit}</p>
            </section>
            <p className="basis">
              <span>Grundlage</span>
              {s.basis}
            </p>
            {s.boundaries.length > 0 && (
              <section aria-labelledby="bounds">
                <h2 id="bounds">Abgrenzung</h2>
                <div className="boundary">
                  {s.boundaries.map((b) => (
                    <p key={b}>{b}</p>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="aside-cta" aria-label="Anfrage">
            <h2>Anfrage stellen</h2>
            <p>Beschreiben Sie kurz Ihren Betrieb und Ihr Anliegen. Sie erhalten eine Rückmeldung mit dem möglichen Vorgehen.</p>
            <a className="btn btn--primary" href={`/kontakt?leistung=${s.slug}#formular`}>
              Unverbindlich anfragen
            </a>
            {others.length > 0 && (
              <p>
                Passt dazu:{" "}
                {others.map((o, i) => (
                  <span key={o.slug}>
                    {i > 0 && ", "}
                    <a href={`/leistungen/${o.slug}`}>{o.title}</a>
                  </span>
                ))}
              </p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
