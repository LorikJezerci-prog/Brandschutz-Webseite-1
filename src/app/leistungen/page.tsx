import type { Metadata } from "next";
import { ServiceCards, ServicesIntro } from "@/components/ServiceCards";

export const metadata: Metadata = {
  title: "Leistungen",
  description: "Brandschutzberatung, externer Brandschutzbeauftragter, Brandschutzordnung und Unterweisungen im Hessischen Ried und an der Bergstraße.",
  alternates: { canonical: "/leistungen" },
};

export default function ServicesPage() {
  return (
    <section className="section section--tint section--first" aria-label="Leistungen">
      <div className="wrap">
        <ServicesIntro as="h1" />
        <ServiceCards idPrefix="lst" />
      </div>
    </section>
  );
}
