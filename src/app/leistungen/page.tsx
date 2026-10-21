import type { Metadata } from "next";
import { ServiceCards, ServicesIntro } from "@/components/ServiceCards";

export const metadata: Metadata = {
  title: "Leistungen",
  description: "Brandschutzberatung, externer Brandschutzbeauftragter, Brandschutzordnung und Unterweisungen im Hessischen Ried und an der Bergstraße.",
  alternates: { canonical: "/leistungen" },
};

export default function ServicesPage() {
  return (
    <section className="section section--paper" style={{ paddingTop: "calc(var(--header-h) + 4rem)" }} aria-label="Leistungen">
      <div className="wrap">
        <ServicesIntro />
        <ServiceCards idPrefix="lst" />
      </div>
    </section>
  );
}
