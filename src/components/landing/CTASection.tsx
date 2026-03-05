"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

export default function CTASection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight text-gray-900 mb-6">
            Empieza tu transformacion
            <span
              className="block bg-clip-text text-transparent mt-2 animate-gradient-shift"
              style={{
                backgroundImage: "linear-gradient(135deg, #163336, #2c5f64, #163336, #163336)",
                backgroundSize: "300% 300%",
              }}
            >
              con inteligencia artificial
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Solicita tu diagnostico gratuito y descubre como la IA puede
            impulsar el crecimiento de tu empresa.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="#"
              className="relative inline-flex items-center px-8 py-4 rounded-full text-sm font-medium text-white bg-primary hover:bg-primary/90 overflow-hidden group transition-colors"
            >
              <span className="relative z-10">Solicitar Diagnostico</span>
              <span className="material-icons ml-2 relative z-10 group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center px-8 py-4 rounded-full text-sm font-medium text-gray-600 border border-gray-300 hover:border-primary hover:text-primary transition-all"
            >
              Contactar con nosotros
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
