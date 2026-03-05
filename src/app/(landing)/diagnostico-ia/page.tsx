import type { Metadata } from "next";
import LandingCursor from "@/components/landing/LandingCursor";
import MeshGradientBg from "@/components/landing/MeshGradientBg";
import HeroLanding from "@/components/landing/HeroLanding";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HowItWorksLanding from "@/components/landing/HowItWorksLanding";
import CTASection from "@/components/landing/CTASection";

export const metadata: Metadata = {
  title: "Alto Trafico - Diagnostico IA",
  description:
    "Diagnostico estrategico de madurez en Inteligencia Artificial. Descubre el potencial de la IA en tu empresa.",
};

export default function DiagnosticoIAPage() {
  return (
    <>
      <LandingCursor />
      <MeshGradientBg />
      <main className="pt-20 min-h-screen relative overflow-hidden">
        <HeroLanding />
        <BenefitsSection />
        <HowItWorksLanding />
        <CTASection />
      </main>
    </>
  );
}
