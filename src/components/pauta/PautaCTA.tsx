"use client";

import { motion } from "framer-motion";

export default function PautaCTA() {
  const scrollToQuiz = () => {
    const el = document.getElementById("quiz-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 bg-surface-light relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-1/10 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-medium text-primary mb-4">
            ¿Listo para descubrir el potencial de la IA en tu empresa?
          </h2>
          <p className="text-lg text-gray-500 font-normal mb-8">
            Tu diagnóstico personalizado te espera. Solo toma 2 minutos y la IA hace el resto.
          </p>
          <button
            onClick={scrollToQuiz}
            className="cta-button-generative inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium"
          >
            Hacer mi Diagnóstico Ahora
            <span className="material-icons text-xl">arrow_upward</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
