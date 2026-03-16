"use client";

import { motion } from "framer-motion";

export default function MetricsBar() {
  return (
    <section className="py-6 bg-surface-light border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 md:gap-8 flex-wrap">
          {[
            { icon: "quiz", text: "10 preguntas" },
            { icon: "timer", text: "3 minutos" },
            { icon: "description", text: "Informe personalizado" },
          ].map((item, i) => (
            <motion.div
              key={item.text}
              className="flex items-center gap-2 text-sm text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="material-icons text-primary text-lg">{item.icon}</span>
              <span className="font-medium text-primary">{item.text}</span>
              {i < 2 && <span className="text-gray-300 ml-4 hidden md:inline">|</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
