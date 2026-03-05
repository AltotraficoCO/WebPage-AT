"use client";

import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    number: "01",
    title: "Solicita tu diagnostico",
    description:
      "Completa el formulario con la informacion basica de tu empresa y tus objetivos de IA.",
  },
  {
    number: "02",
    title: "Analisis estrategico",
    description:
      "Nuestro equipo analiza tu caso, evalua tu madurez digital y detecta oportunidades clave.",
  },
  {
    number: "03",
    title: "Recibe tu hoja de ruta",
    description:
      "Te entregamos un plan personalizado con recomendaciones, prioridades y proyeccion de ROI.",
  },
];

export default function HowItWorksLanding() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-sm font-mono text-accent-purple uppercase tracking-wider mb-4">
              Proceso
            </p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white">
              Como funciona
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-purple/50 via-accent-blue/30 to-transparent hidden sm:block" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.15}>
                <div className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  {/* Step number */}
                  <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-dark-surface border-2 border-accent-purple text-accent-purple font-mono font-bold text-sm shrink-0 md:mx-auto">
                    {step.number}
                  </div>

                  {/* Card */}
                  <div className="flex-1 p-6 rounded-2xl bg-dark-surface border border-dark-border">
                    <h3 className="text-xl font-medium text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
