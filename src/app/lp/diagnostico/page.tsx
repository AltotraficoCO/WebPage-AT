import LpHero from "@/components/lp/LpHero";
import LpDiagnosticCard from "@/components/lp/LpDiagnosticCard";
import LpTrustIndicators from "@/components/lp/LpTrustIndicators";
import LpFooter from "@/components/lp/LpFooter";

export const metadata = {
  title: "Diagnóstico IA Gratuito | Alto Tráfico",
  description:
    "Descubre en 3 minutos cómo la inteligencia artificial puede transformar tu negocio. Diagnóstico gratuito y sin compromiso.",
};

export default function LpDiagnosticoPage() {
  return (
    <div className="relative min-h-svh bg-background-dark text-white overflow-x-hidden">
      {/* Ambient glow blobs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-[30%] left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-neon-1/[0.07] blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] h-[400px] w-[400px] rounded-full bg-neon-1/[0.04] blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] h-[350px] w-[350px] rounded-full bg-neon-2/[0.03] blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <LpHero />
        <LpDiagnosticCard />
        <LpTrustIndicators />
        <LpFooter />
      </div>
    </div>
  );
}
