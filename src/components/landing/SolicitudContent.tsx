"use client";

import Script from "next/script";
import ScrollReveal from "./ScrollReveal";

export default function SolicitudContent() {
  return (
    <>
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 min-h-screen relative">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm font-mono text-primary uppercase tracking-wider mb-4">
                Solicitudes
              </p>
              <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-gray-900 mb-4">
                Envia tu solicitud
              </h1>
              <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                Completa el formulario con los detalles de tu solicitud y
                nuestro equipo la atendera a la brevedad.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <div className="relative bg-white border border-gray-200 shadow-lg rounded-2xl p-2 sm:p-4 overflow-hidden">
              <iframe
                className="clickup-embed clickup-dynamic-height"
                src="https://forms.clickup.com/90131563007/f/2ky450fz-11053/Z9020YSG8HAQPNNAEW"
                width="100%"
                height="100%"
                style={{ background: "transparent", border: "1px solid #ccc", minHeight: "600px" }}
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
