"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: "quiz",
    title: "Responde el quiz",
    desc: "6 preguntas sobre tu empresa en menos de 2 minutos.",
  },
  {
    number: "02",
    icon: "psychology",
    title: "Nuestra IA analiza tu caso",
    desc: "Claude AI procesa tus respuestas y genera un diagnóstico único.",
  },
  {
    number: "03",
    icon: "assessment",
    title: "Recibe tu informe ejecutivo",
    desc: "Score, oportunidades, roadmap de 90 días y ROI estimado.",
  },
];

export default function PautaProcess() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-medium tracking-wider text-primary uppercase mb-3 block">
            Cómo Funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-primary">
            Tu diagnóstico en 3 pasos
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-16 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-neon-1 via-neon-2 to-neon-1 opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center relative">
                <span className="material-icons text-2xl text-primary">{step.icon}</span>
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-1 text-primary text-xs font-medium flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-medium text-primary mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 font-normal max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
