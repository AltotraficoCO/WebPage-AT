"use client";

import ScrollReveal from "./ScrollReveal";

const benefits = [
  {
    icon: "psychology",
    title: "Analisis de Madurez IA",
    description:
      "Evaluamos el estado actual de tu empresa en adopcion de inteligencia artificial con metricas claras.",
  },
  {
    icon: "auto_awesome",
    title: "Oportunidades de Automatizacion",
    description:
      "Identificamos procesos que pueden optimizarse con IA para reducir costes y aumentar eficiencia.",
  },
  {
    icon: "route",
    title: "Hoja de Ruta Personalizada",
    description:
      "Diseno de un plan estrategico adaptado a tus recursos, objetivos y nivel de madurez digital.",
  },
  {
    icon: "speed",
    title: "ROI Proyectado",
    description:
      "Estimaciones de retorno de inversion basadas en benchmarks del sector y casos reales.",
  },
  {
    icon: "security",
    title: "Gobernanza y Etica IA",
    description:
      "Recomendaciones sobre uso responsable, privacidad de datos y cumplimiento normativo.",
  },
  {
    icon: "trending_up",
    title: "Ventaja Competitiva",
    description:
      "Posiciona a tu empresa por delante de la competencia con una estrategia de IA solida.",
  },
];

export default function BenefitsSection() {
  return (
    <section id="beneficios" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-mono text-accent-purple uppercase tracking-wider mb-4">
              Beneficios
            </p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              Todo lo que incluye el diagnostico
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, i) => (
            <ScrollReveal key={benefit.title} delay={i * 0.1}>
              <div className="group relative p-6 rounded-2xl bg-dark-surface border border-dark-border hover:border-accent-purple/40 transition-all duration-500 animate-glow-pulse h-full"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-purple/10 mb-5">
                  <span className="material-icons text-accent-purple">
                    {benefit.icon}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
