import type { Metadata } from "next";
import { Val } from "@/components/Val";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function ImprintPage() {
  const { legal, contact } = site;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker kicker--light">Rechtliches</p>
          <h1>Impressum</h1>
        </div>
      </section>
      <div className="legal">
        <div className="wrap">
          <p className="notice">
            Vorbereitete Seite. Alle markierten Angaben sind Platzhalter und müssen vor der Veröffentlichung durch die
            tatsächlichen Daten ersetzt werden. Die Seite ersetzt keine Rechtsberatung.
          </p>

          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            {site.name}
            <br />
            Inhaber: <Val v={legal.owner} />
            <br />
            <Val v={contact.street} />
            <br />
            <Val v={contact.zip} /> <Val v={contact.city} />
          </p>
          <p>
            Rechtsform: <Val v={legal.legalForm} />
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <Val v={contact.phone} />
            <br />
            E-Mail: <Val v={contact.email} />
          </p>

          <h2>Umsatzsteuer</h2>
          <p>
            <Val v={legal.vatId} />
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            <Val v={legal.responsibleForContent} />
          </p>

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte und Links</h2>
          <p>
            Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Sie dienen der allgemeinen Information und ersetzen
            keine Beratung im Einzelfall. Für Inhalte externer Websites, auf die verwiesen wird, sind ausschließlich
            deren Betreiber verantwortlich.
          </p>
        </div>
      </div>
    </>
  );
}
