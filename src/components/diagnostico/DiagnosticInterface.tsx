"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

// Step data
const step1Options = [
  {
    icon: "folder_off",
    title: "Analógica / Dispersa",
    desc: "Documentos físicos, Excel locales, emails no centralizados.",
    value: "Analógica/Manual",
  },
  {
    icon: "cloud_queue",
    title: "Digital Básica",
    desc: "Uso de Google Drive/Office 365, pero sin integraciones.",
    value: "Cloud Básica",
  },
  {
    icon: "hub",
    title: "Sistemas Integrados",
    desc: "CRM/ERP implementados, datos estructurados.",
    value: "Sistemas Integrados",
  },
  {
    icon: "insights",
    title: "Data-Driven",
    desc: "Dashboards en tiempo real, cultura de datos establecida.",
    value: "Data-Driven",
  },
];

const step2Options = [
  {
    title: "Exploración",
    desc: "Uso ocasional de ChatGPT o similar de forma individual.",
    value: "Nulo",
  },
  {
    title: "Experimental",
    desc: "Pequeños pilotos o pruebas de concepto aisladas.",
    value: "Pilotos",
  },
  {
    title: "Operativo",
    desc: "IA integrada en algunos procesos core (Atención cliente, Marketing).",
    value: "Operativo",
  },
  {
    title: "Estratégico",
    desc: "Modelos propios, automatización end-to-end.",
    value: "Estratégico",
  },
];

const step3Options = [
  {
    title: "Eficiencia Operativa",
    desc: "Reducir costes y tiempos de ejecución manual.",
    icon: "bolt",
    value: "Eficiencia",
  },
  {
    title: "Escalabilidad",
    desc: "Crecer en volumen sin aumentar proporcionalmente la estructura.",
    icon: "trending_up",
    value: "Escalabilidad",
  },
  {
    title: "Innovación de Producto",
    desc: "Crear nuevas líneas de negocio basadas en IA.",
    icon: "auto_awesome",
    value: "Innovación",
  },
];

function TiltCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <button
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export default function DiagnosticInterface() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [logs, setLogs] = useState<{ text: string; isUser?: boolean }[]>([
    { text: "Initializing system scan..." },
    { text: "Loading heuristic models..." },
  ]);

  const addLog = useCallback(
    (text: string, isUser = false) => {
      setLogs((prev) => {
        const next = [...prev, { text, isUser }];
        return next.length > 8 ? next.slice(-8) : next;
      });
    },
    []
  );

  const progressWidth =
    showResult
      ? "100%"
      : `${((currentStep - 1) / 3) * 100 + 33}%`;

  function nextStep(step: number, selection: string) {
    addLog(`Input received: "${selection}"`, true);
    addLog("Processing heuristic analysis...");

    setTimeout(() => {
      addLog("Data point registered.");

      if (step < 3) {
        const next = step + 1;
        setCurrentStep(next);
        addLog(`Initiating Phase 0${next}...`);
      } else {
        setShowResult(true);
        addLog("Analysis complete. Generating report...");
        addLog("Match found: High Potential.");
      }
    }, 600);
  }

  function prevStep() {
    if (currentStep > 1) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      addLog(`Reverting to Phase 0${prev}...`);
    }
  }

  // Scroll terminal to bottom
  const terminalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Terminal Panel */}
      <div className="lg:col-span-4 relative">
        <div className="sticky top-24 bg-surface-dark text-neon-3 p-6 rounded-xl border border-gray-800 shadow-2xl font-mono text-sm min-h-[400px] flex flex-col justify-between overflow-hidden">
          <div className="scanner-overlay" />
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
              <span className="uppercase tracking-widest text-xs opacity-70">
                Terminal Output
              </span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
            <div
              ref={terminalRef}
              className="space-y-2 opacity-90 max-h-[250px] overflow-y-auto"
            >
              {logs.map((log, i) => (
                <p key={i} className={log.isUser ? "text-neon-1" : ""}>
                  {log.isUser ? (
                    <span className="text-neon-1">&gt; </span>
                  ) : (
                    "&gt; "
                  )}
                  {log.text}
                </p>
              ))}
              <p className="text-white">
                &gt; Waiting for user input
                <span className="typing-cursor" />
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-800 pt-4">
            <div className="flex justify-between text-xs uppercase tracking-wider mb-2 text-gray-500">
              <span>System Status</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  showResult ? "bg-green-500" : "bg-neon-1"
                }`}
                style={{ width: progressWidth }}
              />
            </div>
            <div className="mt-2 text-right text-xs opacity-60">
              <span>{showResult ? 3 : currentStep}</span>/3 Completed
            </div>
          </div>
        </div>
      </div>

      {/* Steps Panel */}
      <div className="lg:col-span-8 relative">
        {/* Step 1 */}
        {!showResult && currentStep === 1 && (
          <div className="transition-all duration-500">
            <div className="mb-8">
              <span className="text-neon-1 font-mono text-sm bg-primary/5 px-2 py-1 rounded">
                Fase 01: Infraestructura
              </span>
              <h2 className="text-3xl font-medium mt-3 text-primary">
                Nivel de Digitalización Actual
              </h2>
              <p className="text-gray-500 mt-2">
                ¿Cómo describiría la gestión de datos en su organización
                actualmente?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step1Options.map((opt) => (
                <TiltCard
                  key={opt.value}
                  className="group relative p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => nextStep(1, opt.value)}
                >
                  <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 group-hover:bg-neon-1 group-hover:border-transparent transition-colors" />
                  <span className="material-icons text-3xl text-gray-400 mb-4 group-hover:text-primary transition-colors block">
                    {opt.icon}
                  </span>
                  <h3 className="font-medium text-lg text-primary mb-1">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {!showResult && currentStep === 2 && (
          <div className="transition-all duration-500">
            <div className="mb-8">
              <span className="text-primary/80 font-mono text-sm bg-primary/5 px-2 py-1 rounded">
                Fase 02: Adopción
              </span>
              <h2 className="text-3xl font-medium mt-3 text-primary">
                Uso Actual de IA
              </h2>
              <p className="text-gray-500 mt-2">
                ¿En qué grado se utiliza la inteligencia artificial en sus
                procesos?
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step2Options.map((opt) => (
                <TiltCard
                  key={opt.value}
                  className="group relative p-6 bg-white border border-gray-200 rounded-xl text-left hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() => nextStep(2, opt.value)}
                >
                  <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 group-hover:bg-neon-2 group-hover:border-transparent transition-colors" />
                  <h3 className="font-medium text-lg text-primary mb-1">
                    {opt.title}
                  </h3>
                  <p className="text-sm text-gray-500">{opt.desc}</p>
                </TiltCard>
              ))}
            </div>
            <button
              className="mt-6 text-sm text-gray-400 hover:text-primary flex items-center"
              onClick={prevStep}
            >
              <span className="material-icons text-sm mr-1">arrow_back</span>
              Atrás
            </button>
          </div>
        )}

        {/* Step 3 */}
        {!showResult && currentStep === 3 && (
          <div className="transition-all duration-500">
            <div className="mb-8">
              <span className="text-neon-1 font-mono text-sm bg-primary/5 px-2 py-1 rounded">
                Fase 03: Visión
              </span>
              <h2 className="text-3xl font-medium mt-3 text-primary">
                Objetivo Principal
              </h2>
              <p className="text-gray-500 mt-2">
                ¿Cuál es la meta prioritaria para los próximos 12 meses?
              </p>
            </div>
            <div className="space-y-3">
              {step3Options.map((opt) => (
                <TiltCard
                  key={opt.value}
                  className="w-full group relative p-5 bg-white border border-gray-200 rounded-xl text-left hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-between"
                  onClick={() => nextStep(3, opt.value)}
                >
                  <div>
                    <h3 className="font-medium text-lg text-primary">
                      {opt.title}
                    </h3>
                    <p className="text-sm text-gray-500">{opt.desc}</p>
                  </div>
                  <span className="material-icons text-gray-300 group-hover:text-neon-1 transition-colors">
                    {opt.icon}
                  </span>
                </TiltCard>
              ))}
            </div>
            <button
              className="mt-6 text-sm text-gray-400 hover:text-primary flex items-center"
              onClick={prevStep}
            >
              <span className="material-icons text-sm mr-1">arrow_back</span>
              Atrás
            </button>
          </div>
        )}

        {/* Results */}
        {showResult && (
          <div className="transition-all duration-500">
            <div className="bg-surface-light border border-gray-200 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-neon-1/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                {/* Circle chart */}
                <div className="relative w-48 h-48 flex-shrink-0">
                  <svg
                    className="circle-chart"
                    viewBox="0 0 33.83098862 33.83098862"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="16.91549431"
                      cy="16.91549431"
                      fill="none"
                      r="15.91549431"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <circle
                      className="circle-chart__circle"
                      cx="16.91549431"
                      cy="16.91549431"
                      fill="none"
                      r="15.91549431"
                      stroke="#163336"
                      strokeDasharray="67, 100"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-primary">67%</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">
                      Nivel Madurez
                    </span>
                  </div>
                </div>

                {/* Results text */}
                <div className="flex-grow">
                  <h2 className="text-3xl font-medium text-primary mb-2">
                    Potencial Alto Detectado
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Su organización muestra una base sólida para la integración
                    de sistemas autónomos. Hemos identificado 3 vectores clave
                    de aceleración:
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <span className="material-icons text-neon-1 bg-primary rounded-full p-1 text-xs mr-3 mt-1">
                        check
                      </span>
                      <span className="text-sm text-gray-700">
                        <strong className="text-primary block">
                          Automatización de Flujos de Datos
                        </strong>
                        Eliminación de silos de información mediante middleware
                        inteligente.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="material-icons text-neon-1 bg-primary rounded-full p-1 text-xs mr-3 mt-1">
                        check
                      </span>
                      <span className="text-sm text-gray-700">
                        <strong className="text-primary block">
                          Agentes de Atención 24/7
                        </strong>
                        Implementación de LLMs entrenados con su knowledge base.
                      </span>
                    </li>
                  </ul>
                  <Link
                    href="/contacto"
                    className="inline-flex items-center group bg-primary text-white px-8 py-4 rounded-full font-medium shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 overflow-hidden relative"
                  >
                    <span className="relative z-10">
                      Recibir Plan Estratégico
                    </span>
                    <span className="material-icons ml-2 relative z-10 group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
