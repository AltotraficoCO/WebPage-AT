"use client";

import { useEffect, useRef, useCallback } from "react";

export default function DiagnosisSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<HTMLSpanElement>(null);

  const runAnimation = useCallback(() => {
    const textElement = typingRef.current;
    const blocks = containerRef.current?.querySelectorAll(".ai-message-block");
    if (!textElement || !blocks) return;

    const textToType = "Detecta oportunidades de automatización.";

    textElement.textContent = "";
    textElement.classList.remove("typing-effect");
    blocks.forEach((b) => b.classList.remove("visible"));

    // Trigger reflow
    void textElement.offsetWidth;

    textElement.textContent = textToType;
    textElement.classList.add("typing-effect");

    setTimeout(() => {
      blocks.forEach((block, index) => {
        setTimeout(() => {
          block.classList.add("visible");
        }, index * 800);
      });
    }, 3500);
  }, []);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [runAnimation]);

  return (
    <section
      className="py-20 lg:py-32 bg-white relative overflow-hidden"
      id="diagnosis"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-b from-[#f0fff1] to-transparent rounded-full blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-gradient-to-t from-[#fcfde9] to-transparent rounded-full blur-3xl opacity-40 transform -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium tracking-widest text-gray-400 uppercase">
                Sistema Activo
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-medium tracking-tight text-gray-900 mb-8 leading-tight">
              AT Assistant: <br />
              <span className="font-normal text-gray-400">
                Inteligencia aplicada a tu negocio
              </span>
            </h2>
            <p className="text-lg text-gray-500 font-normal mb-10 max-w-lg leading-relaxed">
              Un sistema diseñado para escanear tu estructura operativa, detectar
              ineficiencias y proponer soluciones automatizadas en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative px-8 py-4 bg-primary text-white rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-900/10 font-medium">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <span className="relative z-10 font-medium flex items-center">
                  Iniciar Análisis
                  <span className="material-icons ml-2 text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </span>
              </button>
            </div>
          </div>

          {/* Right - Interactive Terminal */}
          <div className="relative w-full aspect-square md:aspect-[4/3] max-w-lg mx-auto lg:mr-0">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-neon-1 to-transparent rounded-full blur-xl opacity-40 animate-float delay-100" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tr from-neon-2 to-transparent rounded-full blur-xl opacity-30 animate-float delay-300" />

            <div
              ref={containerRef}
              className="w-full h-full bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl overflow-hidden relative group"
            >
              {/* Top bar */}
              <div className="h-12 border-b border-gray-100 flex items-center px-6 justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                  <div className="w-3 h-3 rounded-full bg-gray-200" />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-normal">
                  System Ready
                </div>
              </div>

              <div className="p-8 h-[calc(100%-3rem)] flex flex-col">
                <div className="mb-8 font-mono text-sm md:text-base text-gray-800">
                  <span className="text-green-500 mr-2">{"\u279C"}</span>
                  <span ref={typingRef} className="inline-block font-normal" />
                </div>

                <div className="space-y-4 flex-1">
                  <div className="ai-message-block flex items-center p-4 bg-surface-light rounded-lg border-l-4 border-green-400 shadow-sm">
                    <span className="material-icons text-green-500 mr-3 text-lg">
                      check_circle_outline
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Procesos repetitivos detectados
                    </span>
                  </div>
                  <div className="ai-message-block flex items-center p-4 bg-surface-light rounded-lg border-l-4 border-neon-2 shadow-sm">
                    <span className="material-icons text-neon-2 mr-3 text-lg">
                      hub
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Integraciones posibles
                    </span>
                  </div>
                  <div className="ai-message-block flex items-center p-4 bg-surface-light rounded-lg border-l-4 border-primary shadow-sm">
                    <span className="material-icons text-primary mr-3 text-lg">
                      trending_up
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      Métricas de impacto
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-normal">
                  <span>AI Core v2.4</span>
                  <span className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                    Online
                  </span>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-[20%] w-full animate-scan pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
