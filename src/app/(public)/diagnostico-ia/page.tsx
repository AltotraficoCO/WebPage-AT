import type { Metadata } from "next";
import CustomCursor from "@/components/diagnostico/CustomCursor";
import RadarVisualization from "@/components/diagnostico/RadarVisualization";
import DiagnosticInterface from "@/components/diagnostico/DiagnosticInterface";

export const metadata: Metadata = {
  title: "Alto Tráfico - Diagnóstico IA",
  description:
    "Diagnóstico estratégico de madurez en Inteligencia Artificial.",
};

export default function DiagnosticoIAPage() {
  return (
    <>
      <CustomCursor />
      <main className="pt-20 min-h-screen relative overflow-hidden flex flex-col selection:bg-neon-1 selection:text-primary">
        {/* Background gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-neon-1/10 to-transparent blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-neon-2/10 to-transparent blur-3xl -z-10" />

        {/* Hero with radar behind */}
        <div className="relative w-full py-24 md:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Radar behind title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 md:opacity-40">
            <RadarVisualization />
          </div>

          {/* Content on top */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                System Online v2.4.0
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-primary mb-4 leading-tight">
              Diagnóstico Estratégico<br className="hidden sm:block" /> de IA
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Analice la madurez digital de su organización y descubra
              oportunidades de automatización en tiempo real.
            </p>
            <a
              href="#diagnostico"
              className="inline-flex items-center group bg-primary text-white px-8 py-4 rounded-full font-medium shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
            >
              <span>Iniciar Diagnóstico</span>
              <span className="material-icons ml-2 group-hover:translate-y-0.5 transition-transform">
                arrow_downward
              </span>
            </a>
          </div>
        </div>

        {/* Diagnostic Interface */}
        <div id="diagnostico" className="scroll-mt-24">
          <DiagnosticInterface />
        </div>
      </main>
    </>
  );
}
