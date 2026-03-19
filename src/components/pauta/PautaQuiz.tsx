"use client";

import { useState, useCallback, useRef, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { quizSteps, terminalLogs, getArchetype, getProcessingLogs, type DiagnosisResult, type ScrapeResult } from "./quizData";
import QuizStepComponent from "./QuizStep";

// Lazy load heavy components — only needed when quiz reaches those phases
const ProcessingAnimation = lazy(() => import("./ProcessingAnimation"));
const DiagnosisReport = lazy(() => import("./DiagnosisReport"));
const BotMascot = lazy(() => import("./BotMascot"));

type Phase = "quiz" | "processing" | "report";

export default function PautaQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("quiz");
  const [direction, setDirection] = useState(1);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [logs, setLogs] = useState<{ text: string; isUser?: boolean }[]>([
    { text: "Initializing diagnostic protocol..." },
    { text: "Loading heuristic models..." },
  ]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const diagnosisPromise = useRef<Promise<DiagnosisResult> | null>(null);
  const scrapePromise = useRef<Promise<{ site: ScrapeResult; competitor: ScrapeResult | null } | null> | null>(null);
  const leadIdRef = useRef<string | null>(null);

  const addLog = useCallback((text: string, isUser = false) => {
    setLogs((prev) => {
      const next = [...prev, { text, isUser }];
      return next.length > 14 ? next.slice(-14) : next;
    });
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchDiagnosis = useCallback(async (allAnswers: Record<string, string>, totalScore: number) => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const val = params.get(key);
      if (val) utm[key] = val;
    }

    const archetype = getArchetype(totalScore);

    // Await scrape data if available
    let scrapeData = null;
    if (scrapePromise.current) {
      try {
        scrapeData = await scrapePromise.current;
      } catch {
        // Scrape failed — continue without web analysis
        console.log("Scrape failed, continuing without web analysis");
      }
    }

    const res = await fetch("/api/diagnosis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...allAnswers,
        score: totalScore,
        archetype: archetype.key,
        website: allAnswers.website || "",
        competitor: allAnswers.competitor || "",
        scrapeData,
        leadId: leadIdRef.current || "",
        ...utm,
      }),
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

    const currentStepData = quizSteps[currentStep];
    const selectedOption = currentStepData.options?.find((o) => o.value === value);
    const optionScore = selectedOption?.score || 0;
    const newScore = score + optionScore;
    setScore(newScore);

    addLog(`Input: "${selectedOption?.letter || ""} — ${selectedOption?.title || value}"`, true);
    if (optionScore > 0) {
      addLog(`> Score +${optionScore} → Total: ${newScore}/40`);
    }

    const nextIndex = currentStep + 1;

    if (nextIndex >= quizSteps.length) {
      setPhase("processing");
      diagnosisPromise.current = fetchDiagnosis(newAnswers, newScore);
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
  }, [answers, currentStep, addLog, fetchDiagnosis, score]);

  const handleFormSubmit = useCallback((data: Record<string, string>) => {
    const newAnswers = { ...answers, ...data };
    setAnswers(newAnswers);

    addLog(`User identified: ${data.name}`, true);
    addLog("Profile registered.");

    // Send early lead webhook — capture contact even if user abandons quiz
    const params = new URLSearchParams(window.location.search);
    const nameParts = (data.name || "").trim().split(/\s+/);
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: nameParts[0] || "",
        last_name: nameParts.slice(1).join(" ") || "",
        email: data.email || "",
        empresa: data.company || "",
        cargo: data.role || "",
        fuente: "ia-para-empresas",
        estado: "inicio_quiz",
        website: data.website || "",
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.leadId) leadIdRef.current = json.leadId;
      })
      .catch(() => {});

    // Launch scrape in background if website provided
    if (data.website && data.website.trim()) {
      addLog(`Scanning website: ${data.website}...`);
      scrapePromise.current = fetch("/api/scrape-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.website.trim(),
          competitorUrl: data.competitor?.trim() || undefined,
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null);
    } else {
      scrapePromise.current = null;
    }

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
      const currentStepData = quizSteps[currentStep];
      const prevAnswer = answers[currentStepData.id];
      if (prevAnswer && currentStepData.options) {
        const prevOption = currentStepData.options.find((o) => o.value === prevAnswer);
        if (prevOption?.score) {
          setScore((s) => s - prevOption.score);
        }
      }
      setAnswers((prev) => {
        const next = { ...prev };
        delete next[currentStepData.id];
        return next;
      });

      setDirection(-1);
      setCurrentStep(currentStep - 1);
      addLog(`Reverting to Phase ${String(currentStep).padStart(2, "0")}...`);
    }
  }, [currentStep, addLog, answers]);

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

  const archetype = getArchetype(score);

  const progressWidth = phase === "report"
    ? "100%"
    : `${((currentStep) / quizSteps.length) * 100}%`;

  const step = quizSteps[currentStep];

  // Show report full-width
  if (phase === "report" && diagnosis) {
    return (
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Suspense fallback={<div className="text-center py-20 text-gray-400">Cargando informe...</div>}>
            <DiagnosisReport
              result={diagnosis}
              userName={answers.name || ""}
              companyName={answers.company || ""}
            />
          </Suspense>
        </div>
      </section>
    );
  }

  // Show processing centered
  if (phase === "processing") {
    return (
      <section className="py-16 relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/80 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="flex justify-center">
            <Suspense fallback={<div className="text-center py-20 text-gray-400">Procesando...</div>}>
              <ProcessingAnimation
                score={score}
                archetype={archetype}
                hasWebsite={!!answers.website}
                onComplete={handleProcessingComplete}
              />
            </Suspense>
          </div>
        </div>
      </section>
    );
  }

  // Main: Hero + Quiz integrated
  return (
    <section id="quiz-section" className="relative min-h-screen bg-white overflow-x-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-20" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-1/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-2/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      {/* Bot mascot that follows cursor — desktop only */}
      <div className="hidden lg:block">
        <Suspense fallback={null}>
          <BotMascot />
        </Suspense>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* Left: Hero Copy + Terminal */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
                <span className="w-2 h-2 rounded-full bg-neon-1 animate-pulse" />
                Diagnóstico impulsado por IA real
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-primary mb-4 leading-[1.1]">
                Descubre tu perfil de{" "}
                <span className="neon-highlight">IA empresarial</span>
              </h1>

              <p className="text-base lg:text-lg text-gray-700 max-w-lg mb-6 font-normal leading-relaxed">
                10 preguntas, 3 minutos — nuestra IA analizará tu empresa y generará un informe
                ejecutivo con tu arquetipo, análisis de riesgo y hoja de ruta personalizada.
              </p>

              {/* Trust badges inline */}
              <div className="flex flex-wrap gap-4 mb-8">
                {[
                  { icon: "quiz", text: "10 preguntas" },
                  { icon: "timer", text: "3 minutos" },
                  { icon: "description", text: "Informe IA" },
                ].map((badge) => (
                  <span
                    key={badge.text}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-3 py-1.5 rounded-full"
                  >
                    <span className="material-icons text-sm text-primary">{badge.icon}</span>
                    {badge.text}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Terminal — hidden on mobile, shown on lg */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-[#0a0f14] text-neon-3 p-5 rounded-2xl border border-gray-800/60 shadow-2xl shadow-black/20 font-mono text-sm overflow-hidden backdrop-blur-sm">
                <div className="scanner-overlay" />
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <span className="text-[10px] text-gray-500 ml-2 uppercase tracking-widest">
                        alto_trafico_diagnostic.sh
                      </span>
                    </div>
                    <span className="text-[10px] text-green-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  </div>
                  <div
                    ref={terminalRef}
                    className="space-y-1.5 opacity-90 max-h-[180px] overflow-y-auto scrollbar-thin"
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

                {/* Score bar */}
                {score > 0 && (
                  <div className="mt-3 border-t border-gray-800/60 pt-3">
                    <div className="flex justify-between text-[10px] uppercase tracking-wider mb-1.5">
                      <span className="text-gray-500">Score</span>
                      <span className="text-neon-1 font-mono font-bold">{score}/40</span>
                    </div>
                    <div className="w-full bg-gray-800/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-neon-1 to-neon-2 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${(score / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 border-t border-gray-800/60 pt-3">
                  <div className="flex justify-between text-[10px] uppercase tracking-wider mb-2">
                    <span className="text-gray-500">Progress</span>
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
                  <div className="mt-2 flex justify-between text-[10px] text-gray-500">
                    <span>Phase {currentStep + 1}/{quizSteps.length}</span>
                    <span className="font-mono">{Math.round(((currentStep) / quizSteps.length) * 100)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Quiz Steps */}
          <div className="relative min-h-[500px]">
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
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <QuizStepComponent
                step={step}
                stepIndex={currentStep}
                totalSteps={quizSteps.length}
                formData={answers}
                currentScore={score}
                onSelect={(value) => handleSelect(step.id, value)}
                onFormSubmit={handleFormSubmit}
                onBack={handleBack}
                direction={direction}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
