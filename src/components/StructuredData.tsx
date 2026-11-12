import { faqs } from "@/config/services";
import { isPlaceholder, site, type Value } from "@/config/site";

const real = (v: Value) => (isPlaceholder(v) ? undefined : v);

/** Strukturierte Daten für Suchmaschinen (lokales Unternehmen und häufige Fragen). Platzhalter werden ausgelassen. */
export function StructuredData() {
  const { phone, email, street, zip, city } = site.contact;
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: real(phone),
    email: real(email),
    address: {
      "@type": "PostalAddress",
      streetAddress: real(street),
      postalCode: real(zip),
      addressLocality: real(city),
      addressRegion: "Hessen",
      addressCountry: "DE",
    },
    areaServed: ["Lampertheim", "Bürstadt", "Biblis", "Viernheim", "Kreis Bergstraße"],
    founder: { "@type": "Person", name: real(site.founder.name) },
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(business) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
    </>
  );
}
