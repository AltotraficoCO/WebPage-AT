"use client";

import Script from "next/script";
import MeshGradientBg from "./MeshGradientBg";
import ScrollReveal from "./ScrollReveal";

export default function SolicitudContent() {
  return (
    <>
      <MeshGradientBg />
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen relative">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-accent-purple uppercase tracking-wider mb-4">
                Formulario
              </p>
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-4">
                Solicita tu diagnostico
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
                Completa el formulario y nuestro equipo se pondra en contacto
                contigo para iniciar el analisis de tu empresa.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative bg-white/5 backdrop-blur-xl border border-dark-border rounded-2xl p-2 sm:p-4 overflow-hidden">
              {/* Glow accent */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />

              <div
                className="clickup-embed clickup-dynamic-height"
                data-options-t="d89l5hs"
                style={{ width: "100%", minHeight: "600px" }}
              />
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Script
        src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
        strategy="afterInteractive"
      />
    </>
  );
}
