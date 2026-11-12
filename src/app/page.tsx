import { About } from "@/components/About";
import { ContactSection } from "@/components/ContactSection";
import { Branchen } from "@/components/home/Branchen";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { MoreServices } from "@/components/home/MoreServices";
import { Packages } from "@/components/home/Packages";
import { QuickCheck } from "@/components/home/QuickCheck";
import { Scope } from "@/components/home/Scope";
import { Steps } from "@/components/home/Steps";
import { StructuredData } from "@/components/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Hero />
      <Packages />
      <Branchen />
      <QuickCheck />
      <Steps />
      <MoreServices />
      <Scope tint />
      <About />
      <Faq />
      <ContactSection />
    </>
  );
}
