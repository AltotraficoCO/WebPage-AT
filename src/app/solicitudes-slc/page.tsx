import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Solicitudes SLC | Alto Tráfico",
  description:
    "Envía tu solicitud a través de nuestro formulario. El equipo de Alto Tráfico te responderá a la brevedad.",
};

export default function SolicitudesSlcPage() {
  return (
    <main className="min-h-svh bg-background-dark pt-28 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          Solicitudes SLC
        </h1>
        <p className="text-white/60 text-center mb-10">
          Completa el formulario a continuación y nuestro equipo se pondrá en
          contacto contigo.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-2 sm:p-4">
          <iframe
            className="clickup-embed clickup-dynamic-height"
            src="https://forms.clickup.com/90131563007/f/2ky450fz-11053/Z9020YSG8HAQPNNAEW"
            width="100%"
            height="100%"
            style={{
              background: "transparent",
              border: "none",
              minHeight: "600px",
            }}
          />
        </div>
      </div>

      <Script
        src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
        strategy="afterInteractive"
      />
    </main>
  );
}
