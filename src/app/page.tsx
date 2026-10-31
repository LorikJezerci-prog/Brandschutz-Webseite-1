import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Branchen } from "@/components/home/Branchen";
import { Hero } from "@/components/home/Hero";
import { QuickCheck } from "@/components/home/QuickCheck";
import { Scope } from "@/components/home/Scope";
import { Steps } from "@/components/home/Steps";
import { ServiceGroups, ServicesIntro } from "@/components/ServiceCards";

export default function Home() {
  return (
    <>
      <Hero />
      <section id="leistungen" className="section" aria-label="Leistungen">
        <div className="wrap">
          <ServicesIntro />
          <ServiceGroups />
        </div>
      </section>
      <Branchen />
      <QuickCheck />
      <Steps />
      <Scope />
      <About />
      <ContactSection />
    </>
  );
}
