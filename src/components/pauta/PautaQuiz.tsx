"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { quizSteps, terminalLogs, type DiagnosisResult } from "./quizData";
import QuizStepComponent from "./QuizStep";
import ProcessingAnimation from "./ProcessingAnimation";
import DiagnosisReport from "./DiagnosisReport";

type Phase = "quiz" | "processing" | "report";

export default function PautaQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [direction, setDirection] = useState(1);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ text: string; isUser?: boolean }[]>([
    { text: "Initializing diagnostic protocol..." },
    { text: "Loading heuristic models..." },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const diagnosisPromise = useRef<Promise<DiagnosisResult> | null>(null);

  const addLog = useCallback((text: string, isUser = false) => {
    setLogs((prev) => {
      const next = [...prev, { text, isUser }];
      return next.length > 12 ? next.slice(-12) : next;
    });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchDiagnosis = useCallback(async (allAnswers: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }

    const res = await fetch("/api/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...allAnswers, ...utm }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Error al generar diagnóstico" }));
      throw new Error(err.error || "Error al generar diagnóstico");
    }
    return res.json() as Promise<DiagnosisResult>;
  }, []);

  const handleSelect = useCallback((stepId: string, value: string) => {
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);
    addLog(`Input: "${value}"`, true);
    addLog("Processing...");

    const nextIndex = currentStep + 1;

    if (nextIndex >= quizSteps.length) {
      setPhase("processing");
      diagnosisPromise.current = fetchDiagnosis(newAnswers);
      return;
    }

    const nextStep = quizSteps[nextIndex];
    const nextLogs = terminalLogs[nextStep.id] || [];
    setTimeout(() => {
      nextLogs.forEach((l, i) => {
        setTimeout(() => addLog(l), i * 200);
      });
    }, 300);

    setDirection(1);
    setCurrentStep(nextIndex);
  }, [answers, currentStep, addLog, fetchDiagnosis]);

  const handleFormSubmit = useCallback((data: Record<string, string>) => {
    const newAnswers = { ...answers, ...data };
    setAnswers(newAnswers);

    addLog(`User identified: ${data.name}`, true);
    addLog("Profile registered.");

    const nextIndex = currentStep + 1;
    const nextStep = quizSteps[nextIndex];
    const nextLogs = terminalLogs[nextStep.id] || [];
    setTimeout(() => {
      nextLogs.forEach((l, i) => {
        setTimeout(() => addLog(l), i * 200);
      });
    }, 300);

    setDirection(1);
    setCurrentStep(nextIndex);
  }, [answers, currentStep, addLog]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
      addLog(`Reverting to Phase ${String(currentStep).padStart(2, "0")}...`);
    }
  }, [currentStep, addLog]);

  const handleProcessingComplete = useCallback(async () => {
    try {
      const result = await diagnosisPromise.current;
      if (result) {
        setDiagnosis(result);
        setPhase("report");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setPhase("quiz");
      setCurrentStep(quizSteps.length - 1);
    }
  }, []);

  const progressWidth = phase === "report"
    ? "100%"
    : `${((currentStep) / quizSteps.length) * 100}%`;

  const step = quizSteps[currentStep];

  return (
    <section id="quiz-section" className="py-24 relative overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-1/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-primary uppercase mb-4 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-1 animate-pulse" />
            Diagnóstico IA
          </span>
          <h2 className="text-3xl md:text-5xl font-medium text-primary leading-tight">
            Tu diagnóstico personalizado
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base max-w-lg mx-auto">
            Responde las preguntas y nuestra IA analizará tu empresa en tiempo real
          </p>
        </motion.div>

        {phase === "report" && diagnosis ? (
          <DiagnosisReport
            result={diagnosis}
            userName={answers.name || ""}
            companyName={answers.company || ""}
          />
        ) : phase === "processing" ? (
          <div className="flex justify-center">
            <ProcessingAnimation
              sector={answers.sector || "tu sector"}
              onComplete={handleProcessingComplete}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Terminal Panel */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <motion.div
                className="sticky top-24"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="bg-[#0a0f14] text-neon-3 p-6 rounded-2xl border border-gray-800/60 shadow-2xl shadow-black/20 font-mono text-sm min-h-[420px] flex flex-col justify-between overflow-hidden backdrop-blur-sm">
                  <div className="scanner-overlay" />
                  <div>
                    <div className="flex justify-between items-center mb-5 border-b border-gray-800 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-[10px] text-gray-600 ml-2 uppercase tracking-widest">
                          alto_trafico_diagnostic.sh
                        </span>
                      </div>
                      <span className="text-[10px] text-green-500/60 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                    <div
                      ref={terminalRef}
                      className="space-y-1.5 opacity-90 max-h-[260px] overflow-y-auto scrollbar-thin"
                    >
                      {logs.map((log, i) => (
                        <p key={i} className={`text-xs leading-relaxed ${log.isUser ? "text-neon-1" : "text-gray-400"}`}>
                          <span className={log.isUser ? "text-neon-1" : "text-gray-600"}>
                            {log.isUser ? "$ " : "> "}
                          </span>
                          {log.text}
                        </p>
                      ))}
                      <p className="text-white text-xs">
                        $ <span className="typing-cursor" />
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-800/60 pt-4">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider mb-2">
                      <span className="text-gray-600">System Status</span>
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-green-400" />
                        Active
                      </span>
                    </div>
                    <div className="w-full bg-gray-800/60 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-1 to-neon-2 transition-all duration-700 ease-out rounded-full"
                        style={{ width: progressWidth }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between text-[10px] text-gray-600">
                      <span>Phase {currentStep + 1}/{quizSteps.length}</span>
                      <span className="font-mono">{Math.round(((currentStep) / quizSteps.length) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Steps Panel */}
            <div className="lg:col-span-8 order-1 lg:order-2 relative min-h-[500px]">
              {error && (
                <motion.div
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="material-icons text-sm">error</span>
                  {error}
                </motion.div>
              )}
              <QuizStepComponent
                step={step}
                stepIndex={currentStep}
                totalSteps={quizSteps.length}
                formData={answers}
                onSelect={(value) => handleSelect(step.id, value)}
                onFormSubmit={handleFormSubmit}
                onBack={handleBack}
                direction={direction}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
