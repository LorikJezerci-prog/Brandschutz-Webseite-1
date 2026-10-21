import { isPlaceholder, site } from "@/config/site";
import { ContactForm } from "./ContactForm";
import { Val } from "./Val";

export function ContactSection({ initialError, initialFields }: { initialError?: string; initialFields?: string[] }) {
  const { email, phone, street, zip, city } = site.contact;
  return (
    <section id="kontakt" className="section section--contact" aria-labelledby="contact-title">
      <div className="wrap contact">
        <div className="contact__intro">
          <p className="kicker kicker--light">Kontakt</p>
          <h2 id="contact-title" className="section-title">
            Lassen Sie uns Brandschutz strukturiert angehen.
          </h2>
          <p className="section-lead">
            Sie möchten den Brandschutz in Ihrem Unternehmen weiterentwickeln oder benötigen Unterstützung bei einer
            konkreten Fragestellung? Lassen Sie uns über Ihr Vorhaben sprechen.
          </p>
          <dl className="contact__details">
            <div>
              <dt>E-Mail</dt>
              <dd>{isPlaceholder(email) ? <Val v={email} /> : <a href={`mailto:${email}`}>{email}</a>}</dd>
            </div>
            <div>
              <dt>Telefon</dt>
              <dd>
                {isPlaceholder(phone) ? <Val v={phone} /> : <a href={`tel:${phone.replace(/[^0-9+]/g, "")}`}>{phone}</a>}
              </dd>
            </div>
            <div>
              <dt>Standort</dt>
              <dd>
                <Val v={street} />, <Val v={zip} /> <Val v={city} />
              </dd>
            </div>
            <div>
              <dt>Einsatzgebiet</dt>
              <dd>{site.region.areas.join(", ")}</dd>
            </div>
          </dl>
        </div>
        <div className="contact__form">
          <ContactForm initialError={initialError} initialFields={initialFields} />
        </div>
      </div>
    </section>
  );
}
