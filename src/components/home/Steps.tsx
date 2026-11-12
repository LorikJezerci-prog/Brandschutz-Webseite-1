const steps = [
  ["Anrufen oder schreiben", "Sie schildern kurz Ihren Betrieb und den Anlass. Ich melde mich zeitnah zurück."],
  ["Vor Ort ansehen", "Gemeinsamer Rundgang: Wege, Türen, Feuerlöscher, Aushänge und Abläufe."],
  ["Bericht und Festpreis", "Was passt, was fehlt, was zuerst. Dazu ein schriftliches Angebot mit Festpreis."],
  ["Umsetzen und dranbleiben", "Ich unterstütze bei der Umsetzung oder betreue Ihren Betrieb dauerhaft zum festen Jahresbetrag."],
] as const;

export function Steps() {
  return (
    <section id="ablauf" className="section section--tint" aria-labelledby="steps-title">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Ablauf</p>
          <h2 id="steps-title" className="section-title">
            In vier Schritten zu mehr Sicherheit.
          </h2>
        </div>
        <ol className="steps">
          {steps.map(([t, d], i) => (
            <li key={t} className="step">
              <span className="step__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="step__title">{t}</h3>
              <p className="step__text">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
