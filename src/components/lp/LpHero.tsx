"use client";

export default function LpHero() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-16 text-center">
      {/* Badge */}
      <div
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs text-white/70 backdrop-blur-sm"
        style={{ opacity: 0, animation: "entranceUp 0.6s ease-out 0s forwards" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-cyan opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-cyan" />
        </span>
        IA Activada
      </div>

      {/* H1 */}
      <h1
        className="max-w-3xl text-4xl font-medium leading-[1.1] text-white md:text-6xl lg:text-7xl"
        style={{ opacity: 0, animation: "entranceUp 0.8s ease-out 0.1s forwards" }}
      >
        Tu negocio merece{" "}
        <span className="lp-animated-gradient-text">inteligencia real</span>
      </h1>

      {/* Subtítulo */}
      <p
        className="mt-5 max-w-lg text-base text-white/50 md:text-lg"
        style={{ opacity: 0, animation: "entranceUp 0.8s ease-out 0.2s forwards" }}
      >
        Descubre en{" "}
        <span className="font-mono text-cyber-cyan">3 minutos</span>{" "}
        cómo la IA puede transformar tus resultados.
        Sin compromiso, sin coste.
      </p>

      {/* CTA */}
      <a
        href="#diagnostico"
        className="cta-button-generative lp-dark mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium md:text-base"
        style={{ opacity: 0, animation: "entranceUp 0.8s ease-out 0.3s forwards" }}
      >
        Comenzar diagnóstico gratis
        <span className="material-icons text-base">arrow_downward</span>
      </a>
    </section>
  );
}
