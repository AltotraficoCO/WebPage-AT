"use client";

export default function LpDiagnosticCard() {
  return (
    <section id="diagnostico" className="w-full px-6 py-12 md:py-20">
      <div className="mx-auto max-w-xl">
        <div className="lp-diagnostic-card p-8 md:p-12">
          {/* ===== [INTEGRATION POINT: DIAGNOSTIC AGENT] ===== */}
          {/* Replace this block with the AI diagnostic agent component */}
          <div className="flex flex-col items-center text-center">
            <span className="material-icons mb-4 text-4xl text-neon-1">
              smart_toy
            </span>
            <h2 className="mb-2 text-xl font-medium text-white md:text-2xl">
              Diagnóstico IA
            </h2>
            <p className="mb-8 text-sm text-white/50 md:text-base">
              Nuestro agente de IA analizará tu negocio y te dará
              recomendaciones personalizadas en minutos.
            </p>

            {/* CTA Fallback */}
            <a
              href="https://wa.me/34600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button-generative inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium md:text-base"
            >
              Hablar con experto
              <span className="material-icons text-base">arrow_forward</span>
            </a>
          </div>
          {/* ===== END INTEGRATION POINT ===== */}
        </div>
      </div>
    </section>
  );
}
