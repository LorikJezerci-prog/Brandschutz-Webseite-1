import { faqs } from "@/config/services";

export function Faq() {
  return (
    <section id="fragen" className="section section--tint" aria-labelledby="faq-title">
      <div className="wrap faq">
        <div className="section-head">
          <p className="kicker">Häufige Fragen</p>
          <h2 id="faq-title" className="section-title">
            Was Betriebe vorher wissen wollen.
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
