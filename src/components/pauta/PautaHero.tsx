"use client";

import { motion } from "framer-motion";

export default function PautaHero() {
  const scrollToQuiz = () => {
    const el = document.getElementById("quiz-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-1/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-2/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 text-sm text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-neon-1 animate-pulse" />
            Diagnóstico impulsado por IA real
          </span>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-primary mb-6 leading-[1.1]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          Descubre el potencial de la{" "}
          <span className="neon-highlight">IA en tu empresa</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-normal leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Responde 6 preguntas y nuestra IA generará un informe ejecutivo personalizado
          con score de madurez, oportunidades y un roadmap de 90 días.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={scrollToQuiz}
            className="cta-button-generative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium"
          >
            Iniciar Diagnóstico Gratuito
            <span className="material-icons text-xl">arrow_downward</span>
          </button>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          {[
            { value: "2 min", label: "Tiempo del quiz" },
            { value: "IA Real", label: "Claude AI analiza tu caso" },
            { value: "100%", label: "Personalizado" },
          ].map((badge) => (
            <div key={badge.label} className="text-center">
              <span className="text-lg font-medium text-primary">{badge.value}</span>
              <span className="block text-xs text-gray-400 mt-1">{badge.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
