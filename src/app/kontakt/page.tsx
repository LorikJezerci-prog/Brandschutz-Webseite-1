import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Unverbindliche Anfrage zu Brandschutzhelfer-Ausbildung, Brandschutzordnung und Begehungen im Hessischen Ried und an der Bergstraße.",
  alternates: { canonical: "/kontakt/" },
};

export default function ContactPage() {
  return <ContactSection />;
}
