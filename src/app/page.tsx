import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Hero } from "@/components/home/Hero";
import { QuickCheck } from "@/components/home/QuickCheck";
import { Scope } from "@/components/home/Scope";
import { Steps } from "@/components/home/Steps";
import { ServiceCards, ServicesIntro } from "@/components/ServiceCards";

export default function Home() {
  return (
    <>
      <Hero />
      <Scope />
      <section id="leistungen" className="section section--tint" aria-label="Leistungen">
        <div className="wrap">
          <ServicesIntro />
          <ServiceCards />
        </div>
      </section>
      <QuickCheck />
      <Steps />
      <About />
      <ContactSection />
    </>
  );
}
