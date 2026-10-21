import { site } from "@/config/site";

const course = site.qualifications.find((q) => q.state === "in-weiterbildung");

const columns = [
  {
    key: "now",
    title: "Schon jetzt",
    note: "Ohne Kosten und unverbindlich",
    items: ["Erstgespräch zu Ihrem Betrieb", "Fragen sortieren und Unterlagen sichten", "Interesse für die Leistungen ab Dezember vormerken"],
  },
  {
    key: "soon",
    title: "Ab Dezember 2026",
    note: "Nach Abschluss der Ausbildung zum Brandschutzbeauftragten",
    items: [
      "Brandschutzberatung für den Betrieb",
      "Externer Brandschutzbeauftragter",
      "Brandschutzordnung Teil A, B und C",
      "Unterweisungen und Räumungsübungen",
      "Prüfung bestehender Flucht- und Rettungspläne",
    ],
  },
  {
    key: "later",
    title: "Später, mit Fachpartnern",
    note: "Erst wenn Sachkunde, Werkzeuge oder Partner nachgewiesen sind",
    items: [
      "Neue Flucht- und Rettungspläne erstellen",
      "Ausbildung von Brandschutzhelfern",
      "Fristen für Brandschutztüren und Feststellanlagen",
      "Betreiberorganisation rund um Brandmeldeanlagen",
    ],
  },
  {
    key: "no",
    title: "Mache ich nicht",
    note: "Dafür gibt es zugelassene Fachleute",
    items: [
      "Brandschutzkonzepte und Nachweise für den Bauantrag",
      "Planung, Prüfung und Wartung von Brandmeldeanlagen",
      "Wartung von Feuerlöschern",
      "Übernahme der Verantwortung des Unternehmers",
    ],
  },
] as const;

export function Scope() {
  return (
    <section id="angebot" className="section" aria-labelledby="scope-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Auf einen Blick</p>
          <h2 id="scope-title" className="section-title">
            Was ich anbiete und was nicht.
          </h2>
          <p className="section-lead">
            Ich biete nur an, wofür ich die Qualifikation nachweisen kann. So wissen Sie vorher, woran Sie sind.
          </p>
        </div>
        <div className="scope-grid">
          {columns.map((c) => (
            <div key={c.key} className={`scope-col scope-col--${c.key}`}>
              <h3 className="scope-col__title">
                <span className="scope-col__icon" aria-hidden="true" />
                {c.title}
              </h3>
              <p className="scope-col__note">
                {c.note}
                {c.key === "soon" && course && "date" in course && (
                  <>
                    {" "}
                    <span className="countdown" data-countdown={course.date}>
                      Prüfung am 3.12.2026
                    </span>
                  </>
                )}
              </p>
              <ul className="scope-col__list">
                {c.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
