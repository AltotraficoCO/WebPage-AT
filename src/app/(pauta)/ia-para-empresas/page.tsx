import type { Metadata } from "next";
import PautaQuiz from "@/components/pauta/PautaQuiz";

export const metadata: Metadata = {
  title: "Diagnóstico IA para Empresas | Alto Tráfico",
  description:
    "10 preguntas, 3 minutos: descubre tu perfil de IA empresarial. Diagnóstico gratuito con arquetipo, análisis por áreas, semáforo de riesgo y hoja de ruta táctica.",
  robots: { index: false, follow: false },
};

export default function IaParaEmpresasPage() {
  return (
    <main className="pt-20 min-h-screen relative overflow-hidden">
      <PautaQuiz />
    </main>
  );
}
