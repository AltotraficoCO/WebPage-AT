"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setSubmitted(true);
    }, 2000);
  }

  const tags = [
    "IA Estratégica",
    "Automatización",
    "LLMs Corporativos",
    "Eficiencia Operativa",
    "Consultoría",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
      {/* Header */}
      <div className="text-center mb-16 relative">
        <div className="flex justify-center gap-6 mb-8 text-xs font-mono tracking-widest text-gray-500 uppercase flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-gray-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Canal seguro activo
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-light border border-gray-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Respuesta en menos de 24h
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-primary mb-6 leading-tight">
          Hablemos de tu <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            siguiente evolución
          </span>
        </h1>
        <p className="text-xl text-gray-500 font-normal max-w-2xl mx-auto">
          Cuéntanos tu objetivo. Diseñamos la estrategia.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Left column */}
        <div className="lg:pr-12 pt-8 space-y-12">
          <div>
            <h2 className="text-3xl font-medium text-primary mb-6 leading-snug">
              No vendemos herramientas. <br />
              <span className="text-gray-400">Diseñamos sistemas.</span>
            </h2>
            <p className="text-gray-500 leading-relaxed mb-8">
              Cada interacción es analizada por nuestro equipo de estrategas
              para determinar la viabilidad de implementación de modelos de IA
              en su infraestructura actual.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag}
                className="glow-tag px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 cursor-default bg-white/80 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-light border border-gray-200 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">
                  security
                </span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-primary">
                  Datos Encriptados
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Protocolo de seguridad End-to-End
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Form */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-1 to-primary rounded-2xl opacity-20 blur group-hover:opacity-40 transition duration-1000" />
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl shadow-gray-200/50 panel-morph overflow-hidden">
            {/* Success / Processing overlay */}
            <div
              className={`absolute inset-0 bg-primary z-20 flex flex-col items-center justify-center text-center transition-opacity duration-500 ${
                processing || submitted
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              }`}
            >
              {processing && (
                <>
                  <div className="w-16 h-16 border-4 border-neon-1 border-t-transparent rounded-full animate-spin mb-6" />
                  <h3 className="text-white text-2xl font-mono mb-2">
                    Transmitiendo información...
                  </h3>
                  <p className="text-neon-1 text-sm font-mono">
                    Conexión establecida.
                  </p>
                </>
              )}
              {submitted && !processing && (
                <>
                  <div className="w-16 h-16 bg-neon-1 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <span className="material-icons text-primary text-3xl">
                      check
                    </span>
                  </div>
                  <h3 className="text-white text-2xl font-mono mb-2">
                    Mensaje Recibido
                  </h3>
                  <p className="text-neon-1 text-sm font-mono">
                    Un estratega le contactará en breve.
                  </p>
                </>
              )}
            </div>

            {/* Form */}
            <form
              className="space-y-8 relative z-10"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="input-group">
                  <input
                    className="form-input focus:ring-0"
                    id="nombre"
                    placeholder=" "
                    required
                    type="text"
                  />
                  <label
                    className="absolute left-0 top-2 text-gray-400 text-sm transition-all pointer-events-none transform origin-left -translate-y-6 scale-75"
                    htmlFor="nombre"
                  >
                    Nombre Completo
                  </label>
                  <div className="input-underline" />
                </div>
                <div className="input-group">
                  <input
                    className="form-input focus:ring-0"
                    id="empresa"
                    placeholder=" "
                    required
                    type="text"
                  />
                  <label
                    className="absolute left-0 top-2 text-gray-400 text-sm transition-all pointer-events-none transform origin-left -translate-y-6 scale-75"
                    htmlFor="empresa"
                  >
                    Empresa
                  </label>
                  <div className="input-underline" />
                </div>
              </div>

              <div className="input-group">
                <input
                  className="form-input focus:ring-0"
                  id="email-contact"
                  placeholder=" "
                  required
                  type="email"
                />
                <label
                  className="absolute left-0 top-2 text-gray-400 text-sm transition-all pointer-events-none transform origin-left -translate-y-6 scale-75"
                  htmlFor="email-contact"
                >
                  Email Corporativo
                </label>
                <div className="input-underline" />
              </div>

              <div className="input-group">
                <textarea
                  className="form-input focus:ring-0 resize-none"
                  id="mensaje"
                  placeholder=" "
                  required
                  rows={3}
                />
                <label
                  className="absolute left-0 top-2 text-gray-400 text-sm transition-all pointer-events-none transform origin-left -translate-y-6 scale-75"
                  htmlFor="mensaje"
                >
                  ¿Cuál es tu desafío actual?
                </label>
                <div className="input-underline" />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <p className="text-xs text-gray-400 max-w-[200px]">
                  Al enviar, aceptas nuestra política de privacidad de datos.
                </p>
                <button
                  className="submit-btn relative px-8 py-4 rounded-full font-medium overflow-hidden group shadow-lg shadow-neon-1/30"
                  type="submit"
                >
                  <span className="relative z-10 flex items-center font-bold">
                    Iniciar Conversación
                    <span className="material-icons ml-2 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
