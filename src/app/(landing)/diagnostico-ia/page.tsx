import type { Metadata } from "next";
import HeroLanding from "@/components/landing/HeroLanding";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksLanding from "@/components/landing/HowItWorksLanding";
import CTASection from "@/components/landing/CTASection";
import { conSeo } from "@/lib/atos-seo";
import { AtosFaq } from "@/components/AtosFaq";

export const metadata: Metadata = conSeo("/diagnostico-ia", {
  title: "Diagnostico IA",
  description:
    "Diagnostico estrategico de madurez en Inteligencia Artificial. Descubre el potencial de la IA en tu empresa.",
});

export default function DiagnosticoIAPage() {
  return (
    <>
      <AtosFaq ruta="/diagnostico-ia" />
      <main className="pt-20 min-h-screen relative overflow-hidden">
        <HeroLanding />
        <BenefitsSection />
        <HowItWorksLanding />
        <CTASection />
      </main>
    </>
  );
}
