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
      return next.length > 10 ? next.slice(-10) : next;
    });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchDiagnosis = useCallback(async (allAnswers: Record<string, string>) => {
    // Capture UTM params from URL
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
      // Last step — start API call and show processing animation
      setPhase("processing");
      diagnosisPromise.current = fetchDiagnosis(newAnswers);
      return;
    }

    // Add terminal logs for next step
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
    <section id="quiz-section" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-medium tracking-wider text-primary uppercase mb-3 block">
            Diagnóstico IA
          </span>
          <h2 className="text-3xl md:text-4xl font-medium text-primary">
            Tu diagnóstico personalizado
          </h2>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Terminal Panel */}
            <div className="lg:col-span-4 order-2 lg:order-1">
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
                          <span>&gt; </span>
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
                      className="h-full bg-neon-1 transition-all duration-500"
                      style={{ width: progressWidth }}
                    />
                  </div>
                  <div className="mt-2 text-right text-xs opacity-60">
                    <span>{currentStep + 1}</span>/{quizSteps.length} Completed
                  </div>
                </div>
              </div>
            </div>

            {/* Steps Panel */}
            <div className="lg:col-span-8 order-1 lg:order-2 relative min-h-[500px]">
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  <span className="material-icons text-sm mr-1 align-text-bottom">error</span>
                  {error}
                </div>
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
