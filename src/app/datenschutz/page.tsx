import type { Metadata } from "next";
import { Val } from "@/components/Val";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Datenschutz", alternates: { canonical: "/datenschutz" } };

export default function PrivacyPage() {
  const { legal, contact } = site;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <p className="kicker kicker--light">Rechtliches</p>
          <h1>Datenschutzerklärung</h1>
        </div>
      </section>
      <div className="legal">
        <div className="wrap">
          <h2>1. Verantwortlicher</h2>
          <p>
            <Val v={legal.owner} />, {site.name}
            <br />
            <Val v={contact.street} />, <Val v={contact.zip} /> <Val v={contact.city} />
            <br />
            Telefon: <Val v={contact.phone} />
            <br />
            E-Mail: <Val v={contact.email} />
          </p>
          <p>
            Ein Datenschutzbeauftragter ist nicht benannt, da die gesetzlichen Voraussetzungen dafür nicht vorliegen.
          </p>

          <h2>2. Bereitstellung der Website und Server-Logfiles</h2>
          <p>
            Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (IP-Adresse, Datum und
            Uhrzeit, aufgerufene Seite, Browser-Informationen), um die Website auszuliefern und ihre Sicherheit zu
            gewährleisten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; unser berechtigtes Interesse ist eine
            sichere und funktionierende Website. Die Logdaten werden vom Hosting-Anbieter nach kurzer Zeit automatisch
            gelöscht.
          </p>
          <p>
            Hosting-Anbieter: <Val v={legal.hostingProvider} />. Mit dem Anbieter besteht ein Vertrag zur
            Auftragsverarbeitung (Art. 28 DSGVO). Sitzt der Anbieter in den USA, erfolgt die Übermittlung auf Grundlage
            des Angemessenheitsbeschlusses der EU-Kommission zum EU-US Data Privacy Framework (Art. 45 DSGVO), sofern der
            Anbieter danach zertifiziert ist.
          </p>

          <h2>3. Kontaktformular und E-Mail</h2>
          <p>
            Wenn Sie das Kontaktformular nutzen, werden Ihre Angaben (Name, Unternehmen, E-Mail-Adresse, optional
            Telefonnummer, gewünschte Leistung, Standort des Objekts und Ihre Nachricht) ausschließlich zur Bearbeitung
            Ihrer Anfrage verarbeitet und per E-Mail an uns übermittelt. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO
            (Anbahnung eines Vertrags) sowie Art. 6 Abs. 1 lit. f DSGVO (Beantwortung von Anfragen).
          </p>
          <p>
            Zum Schutz vor Missbrauch wird Ihre IP-Adresse kurzzeitig im Arbeitsspeicher des Servers verwendet, um die
            Anzahl der Anfragen zu begrenzen. Sie wird nicht dauerhaft gespeichert.
          </p>
          <p>
            Für den Versand nutzen wir: <Val v={legal.mailProvider} />. Ihre Anfrage wird gelöscht, sobald sie
            abschließend bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </p>

          <h2>4. Cookies, Tracking und externe Dienste</h2>
          <p>
            Diese Website setzt keine Cookies und speichert keine Informationen auf Ihrem Gerät. Deshalb gibt es auch
            keinen Cookie-Banner. Wir verwenden keine Analyse- oder Marketingdienste und binden keine Inhalte von
            Drittanbietern ein, etwa Karten oder Videos. Schriften werden vom eigenen Server ausgeliefert; beim Besuch
            wird keine Verbindung zu Google oder anderen Schriftanbietern aufgebaut.
          </p>
          <p>
            Der Brandschutz-Schnellcheck rechnet ausschließlich in Ihrem Browser. Ihre Angaben werden weder übertragen
            noch gespeichert.
          </p>

          <h2>5. Pflicht zur Bereitstellung</h2>
          <p>
            Sie sind nicht verpflichtet, uns Daten zu geben. Ohne die Pflichtangaben im Kontaktformular können wir Ihre
            Anfrage jedoch nicht bearbeiten. Eine automatisierte Entscheidungsfindung findet nicht statt.
          </p>

          <h2>6. Ihre Rechte</h2>
          <ul>
            <li>Auskunft über Ihre gespeicherten Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung und Löschung (Art. 16 und 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21 DSGVO)</li>
          </ul>
          <p>
            Sie haben außerdem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren (Art. 77 DSGVO).
            Zuständig ist der Hessische Beauftragte für Datenschutz und Informationsfreiheit, Postfach 31 63,
            65021 Wiesbaden.
          </p>

          <h2>7. Stand</h2>
          <p>Oktober 2026</p>
        </div>
      </div>
    </>
  );
}
