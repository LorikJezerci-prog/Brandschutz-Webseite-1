import type { Metadata } from "next";
import { Val } from "@/components/Val";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum/" } };

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
          <h2>Angaben gemäß § 5 DDG</h2>
          <p>
            <Val v={legal.owner} />
            <br />
            {site.name}
            <br />
            <Val v={contact.street} />
            <br />
            <Val v={contact.zip} /> <Val v={contact.city} />
          </p>

          <h2>Kontakt</h2>
          <p>
            Telefon: <Val v={contact.phone} />
            <br />
            E-Mail: <Val v={contact.email} />
          </p>

          {legal.vatId && (
            <>
              <h2>Umsatzsteuer</h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: <Val v={legal.vatId} />
              </p>
            </>
          )}

          {legal.economicId && (
            <>
              <h2>Wirtschafts-Identifikationsnummer</h2>
              <p>
                <Val v={legal.economicId} />
              </p>
            </>
          )}
          {legal.insurer && (
            <>
              <h2>Berufshaftpflichtversicherung</h2>
              <p>
                Angaben nach § 2 Abs. 1 Nr. 11 DL-InfoV:
                <br />
                <Val v={legal.insurer} />
                <br />
                Räumlicher Geltungsbereich: {legal.insuranceScope && <Val v={legal.insuranceScope} />}
              </p>
            </>
          )}

          <h2>Verbraucherstreitbeilegung</h2>
          <p>
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte und Links</h2>
          <p>
            Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Sie dienen der allgemeinen Information und ersetzen
            keine Beratung im Einzelfall. Das gilt auch für den Schnellcheck: Er gibt eine erste Orientierung und
            ersetzt nicht die Gefährdungsbeurteilung. Für Inhalte externer Websites, auf die verwiesen wird, sind
            ausschließlich deren Betreiber verantwortlich.
          </p>

          <h2>Bildnachweis</h2>
          <p>Alle Grafiken auf dieser Website sind eigene Darstellungen von {site.name}.</p>
        </div>
      </div>
    </>
  );
}
