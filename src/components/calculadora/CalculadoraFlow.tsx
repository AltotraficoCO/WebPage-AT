"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { IndustriaConfig, Pregunta } from "@/data/calculadora";
import {
  calcularPerdida,
  formatearMoneda,
  respuestasIniciales,
  type RespuestasCalculadora,
  type ResultadoCalculo,
} from "@/lib/calculadora";

type Fase = "hero" | "preguntas" | "resultado" | "captura" | "confirmacion";

interface Props {
  config: IndustriaConfig;
}

export default function CalculadoraFlow({ config }: Props) {
  const { preguntas, formula } = config;

  const [fase, setFase] = useState<Fase>("hero");
  const [paso, setPaso] = useState(0); // índice de pregunta
  const [respuestas, setRespuestas] = useState<RespuestasCalculadora>(() =>
    respuestasIniciales(preguntas)
  );

  const resultado = useMemo<ResultadoCalculo>(
    () => calcularPerdida(respuestas, formula),
    [respuestas, formula]
  );

  const setValor = (id: keyof RespuestasCalculadora, valor: number) =>
    setRespuestas((prev) => ({ ...prev, [id]: valor }));

  const avanzarPregunta = () => {
    if (paso < preguntas.length - 1) setPaso(paso + 1);
    else setFase("resultado");
  };

  const retrocederPregunta = () => {
    if (paso > 0) setPaso(paso - 1);
    else setFase("hero");
  };

  return (
    <main className="min-h-screen bg-primary text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-10 sm:px-8">
        {fase === "hero" && (
          <Hero config={config} onStart={() => setFase("preguntas")} />
        )}

        {fase === "preguntas" && (
          <PreguntaPantalla
            key={paso}
            pregunta={preguntas[paso]}
            indice={paso}
            total={preguntas.length}
            valor={respuestas[preguntas[paso].id]}
            formula={formula}
            onChange={(v) => setValor(preguntas[paso].id, v)}
            onNext={avanzarPregunta}
            onBack={retrocederPregunta}
          />
        )}

        {fase === "resultado" && (
          <Resultado
            config={config}
            resultado={resultado}
            onContinue={() => setFase("captura")}
            onBack={() => {
              setFase("preguntas");
              setPaso(preguntas.length - 1);
            }}
          />
        )}

        {fase === "captura" && (
          <Captura
            config={config}
            respuestas={respuestas}
            resultado={resultado}
            onDone={() => setFase("confirmacion")}
          />
        )}

        {fase === "confirmacion" && <Confirmacion config={config} />}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

function Hero({
  config,
  onStart,
}: {
  config: IndustriaConfig;
  onStart: () => void;
}) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in-left">
      <span className="mb-6 inline-block rounded-full border border-neon-2/40 bg-neon-2/10 px-4 py-1.5 text-sm font-medium text-neon-2">
        {config.hero.eyebrow}
      </span>
      <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
        {config.hero.titulo}
      </h1>
      <p className="mt-6 max-w-xl text-lg text-white/70">
        {config.hero.subtitulo}
      </p>
      <button
        onClick={onStart}
        className="mt-10 rounded-full bg-neon-2 px-8 py-4 text-lg font-semibold text-primary transition hover:scale-105 hover:bg-neon-4"
      >
        {config.hero.cta} →
      </button>
      <p className="mt-4 text-sm text-white/40">
        Gratis · 5 preguntas · sin compromiso
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pantalla de pregunta                                             */
/* ------------------------------------------------------------------ */

function PreguntaPantalla({
  pregunta,
  indice,
  total,
  valor,
  formula,
  onChange,
  onNext,
  onBack,
}: {
  pregunta: Pregunta;
  indice: number;
  total: number;
  valor: number;
  formula: IndustriaConfig["formula"];
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const progreso = ((indice + 1) / total) * 100;

  return (
    <section className="flex flex-1 flex-col">
      {/* Progreso */}
      <div className="mb-12">
        <div className="mb-3 flex items-center justify-between text-sm text-white/50">
          <button onClick={onBack} className="transition hover:text-white">
            ← Atrás
          </button>
          <span>
            {indice + 1} / {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-neon-2 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <div key={indice} className="flex flex-1 flex-col justify-center animate-fade-in-left">
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
          {pregunta.titulo}
        </h2>
        {pregunta.ayuda && (
          <p className="mt-3 text-white/60">{pregunta.ayuda}</p>
        )}

        <div className="mt-10">
          {pregunta.tipo === "slider" ? (
            <SliderInput pregunta={pregunta} valor={valor} formula={formula} onChange={onChange} />
          ) : (
            <OpcionesInput pregunta={pregunta} valor={valor} onChange={onChange} />
          )}
        </div>
      </div>

      <button
        onClick={onNext}
        className="mt-10 self-end rounded-full bg-neon-2 px-8 py-4 text-lg font-semibold text-primary transition hover:scale-105 hover:bg-neon-4"
      >
        {indice === total - 1 ? "Ver mi resultado" : "Siguiente"} →
      </button>
    </section>
  );
}

function SliderInput({
  pregunta,
  valor,
  formula,
  onChange,
}: {
  pregunta: Pregunta;
  valor: number;
  formula: IndustriaConfig["formula"];
  onChange: (v: number) => void;
}) {
  const texto =
    pregunta.formato === "moneda"
      ? formatearMoneda(valor, formula)
      : `${(pregunta.prefijo ?? "")}${valor.toLocaleString(formula.locale)}${pregunta.sufijo ?? ""}`;

  return (
    <div>
      <div className="mb-8 text-center">
        <span className="text-5xl font-bold text-neon-2 sm:text-6xl">{texto}</span>
      </div>
      <input
        type="range"
        min={pregunta.min}
        max={pregunta.max}
        step={pregunta.step}
        value={valor}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-3 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-neon-2"
      />
      <div className="mt-3 flex justify-between text-sm text-white/40">
        <span>
          {(pregunta.prefijo ?? "")}
          {(pregunta.min ?? 0).toLocaleString(formula.locale)}
        </span>
        <span>
          {(pregunta.prefijo ?? "")}
          {(pregunta.max ?? 0).toLocaleString(formula.locale)}
          {pregunta.sufijo ?? ""}
        </span>
      </div>
    </div>
  );
}

function OpcionesInput({
  pregunta,
  valor,
  onChange,
}: {
  pregunta: Pregunta;
  valor: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {pregunta.opciones?.map((op) => {
        const activo = op.value === valor;
        return (
          <button
            key={op.label}
            onClick={() => onChange(op.value)}
            className={`flex items-center justify-between rounded-2xl border-2 px-6 py-5 text-left text-lg font-medium transition ${
              activo
                ? "border-neon-2 bg-neon-2/10 text-white"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/40"
            }`}
          >
            <span>{op.label}</span>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                activo ? "border-neon-2 bg-neon-2 text-primary" : "border-white/30"
              }`}
            >
              {activo && "✓"}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Resultado + proyección                                           */
/* ------------------------------------------------------------------ */

function Resultado({
  config,
  resultado,
  onContinue,
  onBack,
}: {
  config: IndustriaConfig;
  resultado: ResultadoCalculo;
  onContinue: () => void;
  onBack: () => void;
}) {
  const { formula, resultado: copy } = config;
  const montoPorFuente: Record<string, number> = {
    noRespondidos: resultado.desglose.noRespondidos,
    respuestaLenta: resultado.desglose.respuestaLenta,
    sinSeguimiento: resultado.desglose.sinSeguimiento,
  };

  return (
    <section className="flex flex-1 flex-col justify-center py-10 animate-fade-in-left">
      <button
        onClick={onBack}
        className="mb-8 self-start text-sm text-white/50 transition hover:text-white"
      >
        ← Ajustar respuestas
      </button>

      <p className="text-white/60">{copy.titulo}</p>
      <div className="mt-2">
        <span className="block text-5xl font-bold leading-none text-neon-2 sm:text-7xl">
          {formatearMoneda(resultado.perdidaMensual, formula)}
        </span>
        <span className="mt-2 block text-lg text-white/50">al mes</span>
      </div>
      <p className="mt-3 text-white/60">
        Equivale a{" "}
        <strong className="text-white">
          {formatearMoneda(resultado.perdidaAnual, formula)}
        </strong>{" "}
        al año. {copy.subtitulo}
      </p>

      {/* 3 cards de dónde sale la pérdida */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {copy.cards.map((card) => (
          <div
            key={card.titulo}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <span className="block text-2xl font-bold text-neon-2">
              {formatearMoneda(montoPorFuente[card.fuente] ?? 0, formula)}
            </span>
            <h3 className="mt-3 font-semibold">{card.titulo}</h3>
            <p className="mt-2 text-sm text-white/60">{card.descripcion}</p>
          </div>
        ))}
      </div>

      {/* Proyección */}
      <div className="mt-8 rounded-2xl border border-neon-2/40 bg-neon-2/10 p-6 sm:p-8">
        <p className="text-white/70">{copy.proyeccion.titulo}</p>
        <span className="mt-1 block text-3xl font-bold text-neon-2 sm:text-4xl">
          {formatearMoneda(resultado.recuperable, formula)} / mes
        </span>
        <p className="mt-3 text-sm text-white/60">{copy.proyeccion.descripcion}</p>
      </div>

      <button
        onClick={onContinue}
        className="mt-10 rounded-full bg-neon-2 px-8 py-4 text-center text-lg font-semibold text-primary transition hover:scale-105 hover:bg-neon-4"
      >
        Quiero el reporte detallado →
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Captura de email                                                 */
/* ------------------------------------------------------------------ */

/** Lee UTMs / ref de la URL para atribución (al momento del submit). */
function leerUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const captured: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.toLowerCase().startsWith("utm_") || key === "ref") {
      captured[key] = value;
    }
  });
  return Object.keys(captured).length ? captured : null;
}

function Captura({
  config,
  respuestas,
  resultado,
  onDone,
}: {
  config: IndustriaConfig;
  respuestas: RespuestasCalculadora;
  resultado: ResultadoCalculo;
  onDone: () => void;
}) {
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      const res = await fetch("/api/calculadora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          nombre,
          empresa,
          industria: config.slug,
          respuestas,
          resultado,
          utm: leerUtm(),
        }),
      });
      if (!res.ok) throw new Error("No se pudo enviar");
      onDone();
    } catch {
      setError("No pudimos enviar el reporte. Inténtalo de nuevo.");
      setEnviando(false);
    }
  };

  return (
    <section className="flex flex-1 flex-col justify-center animate-fade-in-left">
      <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
        {config.captura.titulo}
      </h2>
      <p className="mt-3 text-white/60">{config.captura.subtitulo}</p>

      <form onSubmit={enviar} className="mt-8 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-white placeholder-white/40 outline-none transition focus:border-neon-2"
        />
        <input
          type="text"
          placeholder="Empresa"
          value={empresa}
          onChange={(e) => setEmpresa(e.target.value)}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-white placeholder-white/40 outline-none transition focus:border-neon-2"
        />
        <input
          type="email"
          required
          placeholder="Tu correo de trabajo *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border border-white/15 bg-white/5 px-5 py-4 text-white placeholder-white/40 outline-none transition focus:border-neon-2"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={enviando}
          className="mt-2 rounded-full bg-neon-2 px-8 py-4 text-lg font-semibold text-primary transition hover:scale-105 hover:bg-neon-4 disabled:opacity-60 disabled:hover:scale-100"
        >
          {enviando ? "Enviando…" : `${config.captura.boton} →`}
        </button>
        <p className="text-center text-xs text-white/40">
          Sin spam. Solo el reporte y contenido útil. Puedes darte de baja cuando quieras.
        </p>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Confirmación                                                     */
/* ------------------------------------------------------------------ */

function Confirmacion({ config }: { config: IndustriaConfig }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center animate-fade-in-left">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neon-2 text-4xl text-primary">
        ✓
      </div>
      <h2 className="mt-8 text-3xl font-bold sm:text-4xl">
        {config.confirmacion.titulo}
      </h2>
      <p className="mt-4 max-w-md text-white/60">
        {config.confirmacion.descripcion}
      </p>

      <Link
        href={config.confirmacion.caso.url}
        className="mt-10 block w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-neon-2/40"
      >
        <span className="text-sm text-neon-2">{config.confirmacion.caso.titulo}</span>
        <p className="mt-2 font-medium">{config.confirmacion.caso.resumen}</p>
        <span className="mt-2 inline-block text-sm text-white/50">Ver caso →</span>
      </Link>
    </section>
  );
}
