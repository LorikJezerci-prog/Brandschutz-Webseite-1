import type { Metadata } from "next";

export const metadata: Metadata = { title: "Anfrage gesendet", robots: { index: false } };

export default function ThanksPage() {
  return (
    <section className="page-hero" style={{ minHeight: "70vh" }}>
      <div className="wrap">
        <p className="kicker kicker--light">Kontakt</p>
        <h1>Vielen Dank, Ihre Anfrage ist eingegangen.</h1>
        <p>Sie erhalten eine Antwort an die angegebene E-Mail-Adresse.</p>
        <p>
          <a className="btn btn--ghost" href="/">
            Zur Startseite
          </a>
        </p>
      </div>
    </section>
  );
}
