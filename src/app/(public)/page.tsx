import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import CasesSection from "@/components/CasesSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import ContactSection from "@/components/ContactSection";
import { readCases } from "@/lib/storage";

export default async function Home() {
  const casesData = await readCases();

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ShowcaseSection />
      <HowWeWorkSection />
      <CasesSection cases={casesData.cases} />
      <DiagnosisSection />
      <ContactSection />
    </>
  );
}
