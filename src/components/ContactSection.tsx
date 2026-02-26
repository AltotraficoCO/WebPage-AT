"use client";

import { useState, useRef } from "react";

const feedbackMessages: Record<number, string> = {
  1: "Analizando sector...",
  2: "Procesando desafío...",
  3: "Detectando integraciones...",
  4: "Finalizando reporte...",
};

const totalSteps = 4;

export default function ContactSection() {
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const challengeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [selectedChips, setSelectedChips] = useState<Set<string>>(new Set());

  const progressPercent = (currentStep / totalSteps) * 100;

  function updateFeedback(step: number) {
    setFeedbackVisible(false);
    setTimeout(() => {
      if (step <= totalSteps) {
        setFeedback(feedbackMessages[step]);
        setFeedbackVisible(true);
      }
    }, 300);
  }

  function nextStep(current: number) {
    if (current === 2) {
      const val = challengeRef.current?.value;
      if (!val) return;
    }
    if (current < totalSteps) {
      const next = current + 1;
      setCurrentStep(next);
      updateFeedback(next);
    }
  }

  function handleEnter(e: React.KeyboardEvent, step: number) {
    if (e.key === "Enter") {
      if (step === 4) finishForm();
      else nextStep(step);
    }
  }

  function toggleChip(name: string) {
    setSelectedChips((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function finishForm() {
    const email = emailRef.current?.value;
    if (!email) return;
    setShowSuccess(true);
    setFeedback("Completado");
    setFeedbackVisible(true);
  }

  function resetForm() {
    setCurrentStep(1);
    setShowSuccess(false);
    setSelectedChips(new Set());
    setFeedback("");
    setFeedbackVisible(false);
    if (challengeRef.current) challengeRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
  }

  const chips = [
    "Salesforce",
    "HubSpot",
    "SAP",
    "Shopify",
    "Slack/Teams",
    "Jira",
    "Excel/Sheets",
    "Otro",
  ];

  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="contact"
    >
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(178,255,181,0.08)_0%,rgba(236,251,146,0.05)_30%,transparent_70%)] blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-2xl overflow-hidden">
          {/* Header bar */}
          <div className="h-12 md:h-16 border-b border-gray-100 flex items-center px-4 md:px-8 justify-between relative">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              </div>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-widest ml-2 font-normal">
                Asistente de Estrategia
              </span>
            </div>
            <div
              className={`text-xs font-mono text-primary flex items-center form-feedback-text transition-opacity duration-300 font-normal ${
                feedbackVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {feedback}
            </div>
            <div
              className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-neon-1 to-neon-2 transition-all duration-500 ease-out"
              style={{
                width: showSuccess ? "100%" : `${progressPercent}%`,
              }}
            />
          </div>

          {/* Form content */}
          <div className="p-5 md:p-16 min-h-[320px] md:min-h-[400px] flex flex-col justify-center relative">
            {/* Success */}
            {showSuccess && (
              <div className="text-center animate-entrance-up">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-icons text-4xl text-green-500">
                    check
                  </span>
                </div>
                <h3 className="text-3xl font-medium text-gray-900 mb-4">
                  Análisis Completado
                </h3>
                <p className="text-gray-500 max-w-md mx-auto leading-relaxed font-normal">
                  Hemos recibido tus datos. Nuestro sistema está procesando la
                  información preliminar y uno de nuestros consultores senior te
                  contactará en breve con una propuesta inicial.
                </p>
                <button
                  className="mt-8 text-primary font-medium hover:underline text-sm"
                  onClick={resetForm}
                >
                  Iniciar nueva consulta
                </button>
              </div>
            )}

            {/* Form */}
            {!showSuccess && (
              <form
                className="w-full max-w-2xl mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                {/* Step 1 */}
                <div
                  className={`step-transition ${
                    currentStep === 1 ? "step-visible" : "step-hidden"
                  }`}
                >
                  <label className="block text-sm font-mono text-primary mb-4 opacity-70 font-normal">
                    01 / Industria
                  </label>
                  <h3 className="text-3xl md:text-4xl font-medium text-gray-900 mb-10 leading-tight">
                    ¿A qué industria pertenece <br /> tu negocio?
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: "storefront", label: "Retail" },
                      { icon: "design_services", label: "Servicios" },
                      { icon: "memory", label: "Tecnología" },
                      { icon: "more_horiz", label: "Otro" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        className="py-4 px-6 rounded-xl border border-gray-200 text-gray-600 hover:border-primary hover:text-primary transition-all duration-300 text-left md:text-center group font-medium"
                        onClick={() => nextStep(1)}
                        type="button"
                      >
                        <span className="material-icons block mb-2 text-gray-400 group-hover:text-primary transition-colors">
                          {item.icon}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  className={`step-transition ${
                    currentStep === 2 ? "step-visible" : "step-hidden"
                  }`}
                >
                  <label className="block text-sm font-mono text-primary mb-4 opacity-70 font-normal">
                    02 / Desafío Principal
                  </label>
                  <h3 className="text-3xl md:text-4xl font-medium text-gray-900 mb-8 leading-tight">
                    ¿Cuál es tu principal <br /> desafío hoy?
                  </h3>
                  <div className="relative group">
                    <input
                      ref={challengeRef}
                      className="ai-input text-gray-800 placeholder-gray-300 font-normal"
                      placeholder="Escribe aquí..."
                      type="text"
                      onKeyDown={(e) => handleEnter(e, 2)}
                    />
                    <button
                      className="absolute right-0 bottom-3 text-primary opacity-50 hover:opacity-100 transition-opacity"
                      onClick={() => nextStep(2)}
                      type="button"
                    >
                      <span className="material-icons text-3xl">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                  <p className="mt-4 text-sm text-gray-400 font-normal">
                    Ej: &quot;Reducir tiempos de respuesta en soporte&quot; o
                    &quot;Automatizar facturación&quot;
                  </p>
                </div>

                {/* Step 3 */}
                <div
                  className={`step-transition ${
                    currentStep === 3 ? "step-visible" : "step-hidden"
                  }`}
                >
                  <label className="block text-sm font-mono text-primary mb-4 opacity-70 font-normal">
                    03 / Ecosistema Actual
                  </label>
                  <h3 className="text-3xl md:text-4xl font-medium text-gray-900 mb-8 leading-tight">
                    ¿Qué sistemas utilizas <br /> actualmente?
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {chips.map((chip) => (
                      <button
                        key={chip}
                        className={`ai-chip px-4 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-gray-400 bg-transparent text-sm font-medium ${
                          selectedChips.has(chip) ? "selected" : ""
                        }`}
                        onClick={() => toggleChip(chip)}
                        type="button"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                  <div className="text-right">
                    <button
                      className="btn-tech bg-primary text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg shadow-primary/20 inline-flex items-center"
                      onClick={() => nextStep(3)}
                      type="button"
                    >
                      Continuar
                      <span className="material-icons ml-2 text-sm">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  className={`step-transition ${
                    currentStep === 4 ? "step-visible" : "step-hidden"
                  }`}
                >
                  <label className="block text-sm font-mono text-primary mb-4 opacity-70 font-normal">
                    04 / Contacto
                  </label>
                  <h3 className="text-3xl md:text-4xl font-medium text-gray-900 mb-8 leading-tight">
                    ¿Dónde te enviamos <br /> el análisis preliminar?
                  </h3>
                  <div className="relative group mb-8">
                    <input
                      ref={emailRef}
                      className="ai-input text-gray-800 placeholder-gray-300 font-normal"
                      placeholder="nombre@empresa.com"
                      type="email"
                      onKeyDown={(e) => handleEnter(e, 4)}
                    />
                  </div>
                  <div className="text-right">
                    <button
                      className="btn-tech bg-primary text-white px-8 py-3 rounded-full text-sm font-medium shadow-lg shadow-primary/20 inline-flex items-center"
                      onClick={finishForm}
                      type="button"
                    >
                      Enviar Datos
                      <span className="material-icons ml-2 text-sm">send</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
