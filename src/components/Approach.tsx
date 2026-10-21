import { site } from "@/config/site";

const values = [
  ["Prävention statt Improvisation", "Risiken werden erkannt und bearbeitet, bevor sie zum Problem werden."],
  ["Verständlich statt kompliziert", "Empfehlungen, die ohne Fachwörterbuch umsetzbar sind."],
  ["Praxisorientiert", "Maßnahmen, die zum Betriebsablauf passen und im Alltag funktionieren."],
  ["Zuverlässige Kommunikation", "Klare Absprachen, erreichbare Ansprechpartner, eingehaltene Termine."],
  ["Strukturierte Dokumentation", "Nachvollziehbare Unterlagen für Betreiber, Behörden und Versicherer."],
  ["Regional", "Kurze Wege im Ried, an der Bergstraße und in Südhessen, Termine vor Ort."],
  ["Langfristig", "Betreuung, die den Betrieb kennt, statt einmaliger Momentaufnahmen."],
] as const;

const steps = [
  ["Erstgespräch", "Telefonisch oder vor Ort: Was ist der Anlass, welche Unterlagen gibt es bereits?"],
  ["Begehung", "Bestandsaufnahme im Objekt: Wege, Türen, Kennzeichnung, Organisation."],
  ["Bericht", "Verständlicher Bericht mit Fotos, Bewertung und priorisierten Maßnahmen."],
  ["Umsetzung", "Begleitung bei der Umsetzung oder kontinuierliche Betreuung, nach Ihrem Bedarf."],
] as const;

export function Approach() {
  return (
    <section id="arbeitsweise" className="section section--dark" aria-labelledby="approach-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker kicker--light">Arbeitsweise</p>
          <h2 id="approach-title" className="section-title">
            Wofür {site.name} steht.
          </h2>
        </div>
        <ol className="values">
          {values.map(([t, d], i) => (
            <li key={t} className="values__item">
              <span className="values__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="values__title">{t}</h3>
              <p className="values__text">{d}</p>
            </li>
          ))}
        </ol>

        <h3 className="process__title">So beginnt eine Zusammenarbeit</h3>
        <div className="process-wrap">
          <span className="process__line" data-draw="x" data-span="0.35" aria-hidden="true" />
          <ol className="process">
          {steps.map(([t, d], i) => (
            <li key={t} className="process__step">
              <span className="process__node" data-node aria-hidden="true" />
              <span className="process__num">Schritt {i + 1}</span>
              <h4 className="process__name">{t}</h4>
              <p className="process__text">{d}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
