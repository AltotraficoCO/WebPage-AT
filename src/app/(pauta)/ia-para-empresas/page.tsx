import type { Metadata } from "next";
import PautaHero from "@/components/pauta/PautaHero";
import MetricsBar from "@/components/pauta/MetricsBar";
import CasesSection from "@/components/CasesSection";
import PautaQuiz from "@/components/pauta/PautaQuiz";
import PautaProcess from "@/components/pauta/PautaProcess";
import PautaCTA from "@/components/pauta/PautaCTA";
import { readCases } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Diagnóstico IA para Empresas | Alto Tráfico",
  description:
    "Descubre el potencial de la inteligencia artificial en tu empresa. Diagnóstico gratuito generado por IA con score de madurez, oportunidades y roadmap de 90 días.",
  robots: { index: false, follow: false },
};

export default async function IaParaEmpresasPage() {
  const casesData = await readCases();

  return (
    <main className="pt-20 min-h-screen relative overflow-hidden">
      <PautaHero />
      <MetricsBar />
      {casesData.cases.length > 0 && <CasesSection cases={casesData.cases} />}
      <PautaProcess />
      <PautaQuiz />
      <PautaCTA />
    </main>
  );
}
