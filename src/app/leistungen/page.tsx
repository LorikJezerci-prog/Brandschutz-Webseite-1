import type { Metadata } from "next";
import { Scope } from "@/components/home/Scope";
import { ServiceGroups, ServicesIntro } from "@/components/ServiceCards";

export const metadata: Metadata = {
  title: "Leistungen",
  description: "Externer Brandschutzbeauftragter, Brandschutzbegehung, Brandschutzordnung, Brandschutzhelfer-Ausbildung und Räumungsübungen im Hessischen Ried und an der Bergstraße.",
  alternates: { canonical: "/leistungen/" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="section section--tint section--first" aria-label="Leistungen">
        <div className="wrap">
          <ServicesIntro as="h1" />
          <ServiceGroups />
        </div>
      </section>
      <Scope />
    </>
  );
}
