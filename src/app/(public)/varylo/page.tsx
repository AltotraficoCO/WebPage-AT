import type { Metadata } from "next";
import Link from "next/link";
import FaqVarylo from "@/components/varylo/FaqVarylo";
import { VARYLO, CALCOM_DEMO_URL } from "@/data/varylo";

export const metadata: Metadata = {
  title: "Varylo — Agente de IA para WhatsApp, Instagram y WebChat | Altotrafico",
  description:
    "Varylo centraliza WhatsApp, Instagram y WebChat en una sola bandeja con IA que responde, califica y vende por ti 24/7. Agenda una demo de 20 minutos.",
  alternates: { canonical: "/varylo" },
};

export default function VaryloPage() {
  return (
    <main className="bg-white text-gray-900">
      <Hero />
      <Problemas />
      <ComoFunciona />
      <Features />
      <Negocios />
      <Planes />
      <Testimonios />
      <Faq />
      <CtaFinal />
    </main>
  );
}

/* ------------------------------------------------------------------ */

function Hero() {
  const { hero, chatMockup } = VARYLO;
  return (
    <section className="bg-primary pt-28 pb-20 text-white sm:pt-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="inline-block rounded-full border border-neon-2/40 bg-neon-2/10 px-4 py-1.5 text-sm font-medium text-neon-2">
            {hero.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {hero.titulo}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/70">{hero.subtitulo}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`${CALCOM_DEMO_URL}?utm_source=altotrafico&utm_medium=varylo&utm_campaign=hero`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-neon-2 px-7 py-3.5 font-semibold text-primary transition hover:scale-105 hover:bg-neon-4"
            >
              {hero.ctaPrimario}
            </a>
            <a
              href="#planes"
              className="rounded-full border border-white/25 px-7 py-3.5 font-semibold text-white transition hover:border-white/60"
            >
              {hero.ctaSecundario}
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50">
            {hero.canales.map((c) => (
              <span key={c} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-neon-2" />
                {c}
              </span>
            ))}
          </div>
        </div>

        <ChatMockup
          titulo={chatMockup.titulo}
          mensajes={chatMockup.mensajes}
        />
      </div>
    </section>
  );
}

function ChatMockup({
  titulo,
  mensajes,
}: {
  titulo: string;
  mensajes: typeof VARYLO.chatMockup.mensajes;
}) {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-dark-surface shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neon-2 text-primary">
          <span className="material-icons text-xl">smart_toy</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{titulo}</p>
          <p className="flex items-center gap-1 text-xs text-neon-2">
            <span className="h-1.5 w-1.5 rounded-full bg-neon-2" /> en línea · IA
          </p>
        </div>
      </div>
      {/* Mensajes */}
      <div className="space-y-3 px-5 py-6">
        {mensajes.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.de === "cliente" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.de === "cliente"
                  ? "rounded-tl-sm bg-white/10 text-white/90"
                  : "rounded-tr-sm bg-neon-2 text-primary"
              }`}
            >
              <p>{m.texto}</p>
              <span
                className={`mt-1 block text-right text-[10px] ${
                  m.de === "cliente" ? "text-white/40" : "text-primary/50"
                }`}
              >
                {m.hora}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Problemas() {
  const { problemas } = VARYLO;
  return (
    <section className="bg-surface-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">
          {problemas.titulo}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problemas.items.map((p) => (
            <div
              key={p.titulo}
              className="rounded-2xl border border-gray-200 bg-white p-8"
            >
              <span className="material-icons text-3xl text-primary">{p.icono}</span>
              <h3 className="mt-4 text-xl font-semibold text-primary">{p.titulo}</h3>
              <p className="mt-2 text-gray-600">{p.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComoFunciona() {
  const { comoFunciona } = VARYLO;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">
            {comoFunciona.titulo}
          </h2>
          <p className="mt-3 text-gray-600">{comoFunciona.subtitulo}</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {comoFunciona.pasos.map((paso) => (
            <div key={paso.numero}>
              <span className="text-5xl font-bold text-neon-3">{paso.numero}</span>
              <h3 className="mt-3 text-xl font-semibold text-primary">{paso.titulo}</h3>
              <p className="mt-2 text-gray-600">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { features } = VARYLO;
  return (
    <section className="bg-surface-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">
          {features.titulo}
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((f) => (
            <div key={f.titulo} className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5">
                <span className="material-icons text-2xl text-primary">{f.icono}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">{f.titulo}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Negocios() {
  const { negocios } = VARYLO;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">{negocios.titulo}</h2>
          <p className="mt-3 text-gray-600">{negocios.subtitulo}</p>
        </div>
        <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200">
          {negocios.items.map((n, i) => (
            <div
              key={n.tipo}
              className={`grid grid-cols-1 gap-1 px-6 py-5 sm:grid-cols-3 sm:gap-4 ${
                i % 2 === 1 ? "bg-surface-light" : "bg-white"
              }`}
            >
              <span className="font-semibold text-primary">{n.tipo}</span>
              <span className="text-gray-600 sm:col-span-2">{n.uso}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Planes() {
  const { planes } = VARYLO;
  return (
    <section id="planes" className="scroll-mt-24 bg-surface-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary sm:text-4xl">{planes.titulo}</h2>
          <p className="mt-3 text-gray-600">{planes.subtitulo}</p>
        </div>
        <div className="mx-auto mt-12 grid max-w-md items-start gap-6">
          {planes.items.map((plan) => (
            <div
              key={plan.nombre}
              className={`rounded-3xl border bg-white p-8 ${
                plan.destacado
                  ? "border-2 border-neon-3 shadow-xl"
                  : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-primary">{plan.nombre}</h3>
              <p className="mt-1 text-sm text-gray-500">{plan.descripcion}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-primary">{plan.precio}</span>
                <span className="text-gray-500">{plan.periodo}</span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{plan.setup}</p>
              <ul className="mt-6 space-y-3">
                {plan.incluye.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="material-icons mt-0.5 text-base text-neon-3">check_circle</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={`${CALCOM_DEMO_URL}?utm_source=altotrafico&utm_medium=varylo&utm_campaign=plan_${plan.nombre.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-8 block rounded-full px-6 py-3 text-center font-semibold transition ${
                  plan.destacado
                    ? "bg-primary text-white hover:bg-secondary"
                    : "border border-primary text-primary hover:bg-primary hover:text-white"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonios() {
  const { testimonios } = VARYLO;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">
          {testimonios.titulo}
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonios.items.map((t) => (
            <figure key={t.nombre} className="rounded-2xl border border-gray-200 bg-white p-7">
              <blockquote className="text-gray-700">“{t.texto}”</blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold text-primary">{t.nombre}</p>
                <p className="text-sm text-gray-500">{t.cargo}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const { faq } = VARYLO;
  return (
    <section className="bg-surface-light py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-primary sm:text-4xl">
          {faq.titulo}
        </h2>
        <FaqVarylo items={faq.items} />
      </div>
    </section>
  );
}

function CtaFinal() {
  const { ctaFinal } = VARYLO;
  return (
    <section className="bg-primary py-20 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold sm:text-4xl">{ctaFinal.titulo}</h2>
        <p className="mt-4 text-white/70">{ctaFinal.subtitulo}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={`${CALCOM_DEMO_URL}?utm_source=altotrafico&utm_medium=varylo&utm_campaign=cta_final`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-neon-2 px-8 py-4 font-semibold text-primary transition hover:scale-105 hover:bg-neon-4"
          >
            {ctaFinal.ctaPrimario}
          </a>
          <Link
            href="#planes"
            className="rounded-full border border-white/25 px-8 py-4 font-semibold text-white transition hover:border-white/60"
          >
            {ctaFinal.ctaSecundario}
          </Link>
        </div>
      </div>
    </section>
  );
}
