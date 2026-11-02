import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { contactMessages as errorText } from "@/lib/contact/messages";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Unverbindliche Anfrage zu Brandschutzberatung, Brandschutzordnung und Unterweisungen im Hessischen Ried und an der Bergstraße.",
  alternates: { canonical: "/kontakt" },
};


export default async function ContactPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const error = sp.fehler ? (errorText[sp.fehler] ?? errorText.failed) : undefined;
  const fields = sp.felder?.split(",").filter(Boolean);
  return (
    <div>
      <ContactSection initialError={error} initialFields={fields} />
    </div>
  );
}
