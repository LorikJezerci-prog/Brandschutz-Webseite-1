import { About } from "@/components/About";
import { Approach } from "@/components/Approach";
import { ContactSection } from "@/components/ContactSection";
import { ServiceCards, ServicesIntro } from "@/components/ServiceCards";
import { Story } from "@/components/Story";

export default function Home() {
  return (
    <>
      <Story />
      <div className="rail-zone">
        <span className="rail-turn" data-draw="x" data-span="0.16" aria-hidden="true" />
        <span className="rail" data-draw="y" aria-hidden="true" />
        <section id="leistungen" className="section section--paper" aria-label="Leistungen">
          <div className="wrap">
            <ServicesIntro />
            <ServiceCards />
          </div>
        </section>
        <Approach />
        <About />
      </div>
      <ContactSection />
    </>
  );
}
