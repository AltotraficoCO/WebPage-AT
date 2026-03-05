"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroLanding() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-surface-light border border-gray-200 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-1 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-1" />
          </span>
          <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
            Diagnostico Impulsado por IA
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-6 leading-[1.1]"
        >
          <span className="block text-gray-900">Descubre el potencial</span>
          <span
            className="block bg-clip-text text-transparent animate-gradient-shift"
            style={{
              backgroundImage: "linear-gradient(135deg, #163336, #2c5f64, #163336, #163336)",
              backgroundSize: "300% 300%",
            }}
          >
            de la IA en tu empresa
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10"
        >
          Analiza la madurez digital de tu organizacion, identifica oportunidades
          de automatizacion y obtiene una hoja de ruta personalizada.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="#"
            className="relative inline-flex items-center px-8 py-4 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 overflow-hidden group transition-colors"
          >
            <span className="relative z-10">Solicitar Diagnostico Gratuito</span>
            <span className="material-icons ml-2 relative z-10 group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </Link>
          <a
            href="#beneficios"
            className="inline-flex items-center px-8 py-4 rounded-full text-sm font-medium text-gray-600 border border-gray-300 hover:border-primary hover:text-primary transition-all"
          >
            Conocer mas
            <span className="material-icons ml-2">arrow_downward</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
