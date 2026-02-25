"use client";

import { useState, useEffect, useCallback } from "react";

const steps = [
  {
    id: "modal-1",
    number: 1,
    title: "Diagnostico IA",
    shortDesc: "Auditoría profunda de tus procesos actuales.",
    modalTitle: "1. Diagnostico IA",
    modalDesc:
      "Realizamos una inmersión completa en tu negocio. Analizamos flujos de datos, cuellos de botella operativos y stacks tecnológicos actuales para identificar dónde la IA tendrá el mayor impacto (ROI) inmediato.",
    checks: [
      "Auditoría de procesos manuales",
      "Análisis de infraestructura de datos",
      "Identificación de casos de uso de alto impacto",
    ],
    filled: true,
  },
  {
    id: "modal-2",
    number: 2,
    title: "Diseño del Sistema",
    shortDesc: "Arquitectura de la solución personalizada.",
    modalTitle: "2. Diseño del Sistema",
    modalDesc:
      "Diseñamos la arquitectura técnica y operativa. No solo seleccionamos modelos, sino que diseñamos cómo interactuarán con tus equipos y sistemas existentes para una adopción fluida.",
    checks: [
      "Arquitectura de agentes IA",
      "Diseño de flujos de automatización",
      "Plan de gestión del cambio",
    ],
    filled: false,
  },
  {
    id: "modal-3",
    number: 3,
    title: "Implementación",
    shortDesc: "Desarrollo y despliegue ágil.",
    modalTitle: "3. Implementación",
    modalDesc:
      "Desarrollo ágil e integración. Conectamos APIs, configuramos modelos LLM y entrenamos a tus sistemas con tus datos propietarios de forma segura y escalable.",
    checks: [
      "Desarrollo de integraciones custom",
      "Setup de seguridad y privacidad",
      "Pruebas de usuario y refinamiento",
    ],
    filled: false,
  },
  {
    id: "modal-4",
    number: 4,
    title: "Optimización",
    shortDesc: "Mejora continua basada en datos.",
    modalTitle: "4. Optimización",
    modalDesc:
      "La IA no es estática. Monitoreamos el rendimiento, ajustamos los prompts y refinamos los modelos basándonos en feedback real para mejorar la precisión y eficiencia continuamente.",
    checks: [
      "Dashboard de métricas de IA",
      "Ajuste fino (Fine-tuning) periódico",
      "Escalado a nuevos departamentos",
    ],
    filled: false,
  },
];

export default function HowWeWorkSection() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const section = document.getElementById("how-we-work");
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollPosition = window.scrollY + window.innerHeight;

    if (scrollPosition > sectionTop) {
      let percentage =
        ((scrollPosition - sectionTop) /
          (sectionHeight + window.innerHeight * 0.5)) *
        100;
      percentage = Math.max(0, Math.min(100, percentage));
      setProgress(percentage);
    } else {
      setProgress(0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <section
      className="py-24 bg-surface-light relative"
      id="how-we-work"
    >
      {/* Progress bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 z-20">
        <div
          className="h-full bg-neon-1 shadow-[0_0_10px_#B2FFB5] scroll-progress-bar"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-end mb-16">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-medium text-text-light">
              Cómo trabajamos
            </h2>
            <p className="mt-4 text-gray-500 font-normal">
              Un enfoque estructurado para garantizar resultados.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-4xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-neon-1 to-secondary">
              {Math.round(progress)}%
            </span>
            <span className="text-xs uppercase tracking-widest text-gray-400 font-normal">
              Progreso del viaje
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step) => (
              <div
                key={step.id}
                className="step-card bg-white p-8 rounded-xl border border-gray-100 text-center shadow-sm cursor-pointer relative group"
                onClick={() => setOpenModal(step.id)}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium mx-auto mb-6 border-4 border-white relative z-10 transition-transform duration-300 group-hover:scale-110 ${
                    step.filled
                      ? "bg-primary text-white"
                      : "bg-white text-primary border-2 !border-primary"
                  }`}
                >
                  {step.number}
                </div>
                <h3 className="font-medium text-lg mb-2 text-text-light">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 font-normal">
                  {step.shortDesc}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    Ver detalles +
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {steps.map((step) => (
        <div
          key={step.id}
          className={`fixed inset-0 z-[60] flex items-center justify-center px-4 step-modal backdrop-blur-sm bg-black/20 ${
            openModal === step.id ? "open" : ""
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenModal(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 border border-gray-100 relative overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setOpenModal(null)}
            >
              <span className="material-icons">close</span>
            </button>
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-neon-1 to-neon-2" />
            <h3 className="text-2xl font-medium text-primary mb-4">
              {step.modalTitle}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed font-normal">
              {step.modalDesc}
            </p>
            <ul className="space-y-3 mb-8 font-normal">
              {step.checks.map((check, j) => (
                <li
                  key={j}
                  className="flex items-center text-sm text-gray-500"
                >
                  <span className="material-icons text-green-500 text-base mr-2">
                    check_circle
                  </span>
                  {check}
                </li>
              ))}
            </ul>
            <div className="flex justify-end">
              <button
                className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                onClick={() => setOpenModal(null)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
