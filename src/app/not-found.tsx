export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: "70vh" }}>
      <div className="wrap">
        <p className="kicker kicker--light">Fehler 404</p>
        <h1>Dieser Weg führt nicht weiter.</h1>
        <p>Die Seite wurde nicht gefunden. Der sichere Weg zurück:</p>
        <p>
          <a className="btn btn--primary" href="/">
            Zur Startseite
          </a>
        </p>
      </div>
    </section>
  );
}
