import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import CasesSection from "@/components/CasesSection";
import DiagnosisSection from "@/components/DiagnosisSection";
import ContactSection from "@/components/ContactSection";
import { readCases } from "@/lib/storage";
import type { Metadata } from "next";
import { conSeo } from "@/lib/atos-seo";
import { AtosFaq } from "@/components/AtosFaq";

export const metadata: Metadata = conSeo("/");

export default async function Home() {
  const casesData = await readCases();

  return (
    <>
      <AtosFaq ruta="/" />
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
