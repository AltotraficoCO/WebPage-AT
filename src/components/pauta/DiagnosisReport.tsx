"use client";

import { motion } from "framer-motion";
import type { DiagnosisResult } from "./quizData";

interface DiagnosisReportProps {
  result: DiagnosisResult;
  userName: string;
  companyName: string;
}

function AnimatedCircle({ score, label }: { score: number; label: string }) {
  return (
    <div className="relative w-48 h-48 flex-shrink-0 mx-auto">
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
          strokeDasharray={`${score}, 100`}
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-primary">{score}%</span>
        <span className="text-xs text-gray-500 uppercase tracking-wide mt-1">{label}</span>
      </div>
    </div>
  );
}

function DimensionBar({ name, score, insight, delay }: { name: string; score: number; insight: string; delay: number }) {
  return (
    <motion.div
      className="mb-5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium text-primary">{name}</span>
        <span className="text-sm text-gray-500 font-mono">{score}%</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #B2FFB5, #163336)" }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1 font-normal">{insight}</p>
    </motion.div>
  );
}

export default function DiagnosisReport({ result, userName, companyName }: DiagnosisReportProps) {
  const scrollToContact = () => {
    window.open("/contacto", "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-1/20 text-sm text-primary mb-4">
          <span className="material-icons text-sm">verified</span>
          Diagnóstico generado por IA
        </span>
        <h2 className="text-3xl md:text-4xl font-medium text-primary">
          Informe Ejecutivo para {companyName}
        </h2>
        <p className="text-gray-500 mt-2 font-normal">
          Preparado para {userName}
        </p>
      </motion.div>

      {/* Section 1: Maturity Score */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute top-0 right-0 p-32 bg-neon-1/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <AnimatedCircle score={result.maturity_score} label={result.maturity_label} />
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-2xl font-medium text-primary mb-2">Score de Madurez IA</h3>
            <p className="text-gray-500 font-normal mb-4">
              Tu empresa está en nivel <strong className="text-primary">{result.maturity_label}</strong>.
              El promedio de tu sector es <strong className="text-primary">{result.sector_average}%</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-light border border-gray-100 text-sm">
              <span className="material-icons text-sm text-primary">
                {result.maturity_score >= result.sector_average ? "trending_up" : "trending_down"}
              </span>
              <span className="text-gray-600">
                {result.maturity_score >= result.sector_average
                  ? `${result.maturity_score - result.sector_average} puntos por encima del promedio`
                  : `${result.sector_average - result.maturity_score} puntos por debajo del promedio`}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section 2: Dimensions */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">analytics</span>
          Análisis por Dimensión
        </h3>
        {result.dimensions.map((dim, i) => (
          <DimensionBar
            key={dim.name}
            name={dim.name}
            score={dim.score}
            insight={dim.insight}
            delay={0.5 + i * 0.15}
          />
        ))}
      </motion.div>

      {/* Section 3: Opportunities */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">lightbulb</span>
          Oportunidades Detectadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.opportunities.map((opp, i) => (
            <motion.div
              key={i}
              className="p-5 bg-surface-light border border-gray-100 rounded-xl hover:border-neon-1/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
            >
              <div className="flex items-start gap-3">
                <span className="material-icons text-primary bg-neon-1/20 rounded-lg p-2 text-lg flex-shrink-0">
                  {opp.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-primary text-sm">{opp.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      opp.impact === "Alto"
                        ? "bg-neon-1/20 text-primary"
                        : "bg-neon-2/20 text-primary"
                    }`}>
                      {opp.impact}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-normal leading-relaxed">{opp.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 4: Roadmap */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">timeline</span>
          Roadmap 90 Días
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-neon-1 via-primary/20 to-neon-1 opacity-30" />

          {(["month1", "month2", "month3"] as const).map((month, i) => {
            const data = result.roadmap[month];
            const icons = ["rocket_launch", "build", "trending_up"];
            const labels = ["Mes 1", "Mes 2", "Mes 3"];
            return (
              <motion.div
                key={month}
                className="relative bg-surface-light border border-gray-100 rounded-xl p-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <span className="material-icons text-sm">{icons[i]}</span>
                  </span>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{labels[i]}</span>
                    <h4 className="text-sm font-medium text-primary">{data.title}</h4>
                  </div>
                </div>
                <ul className="space-y-2">
                  {data.actions.map((action, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-600 font-normal">
                      <span className="material-icons text-neon-1 text-xs mt-0.5 flex-shrink-0">check_circle</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Section 5: ROI */}
      <motion.div
        className="bg-white border border-gray-200 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
          <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">payments</span>
          ROI Estimado
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "schedule", label: "Horas ahorradas", value: result.roi_estimate.hours_saved },
            { icon: "savings", label: "Reducción de costos", value: result.roi_estimate.cost_reduction },
            { icon: "speed", label: "Mejora en eficiencia", value: result.roi_estimate.efficiency_gain },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="text-center p-5 bg-surface-light border border-gray-100 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.1 + i * 0.1 }}
            >
              <span className="material-icons text-3xl text-primary mb-2 block">{item.icon}</span>
              <span className="text-lg font-medium text-primary block">{item.value}</span>
              <span className="text-xs text-gray-500 mt-1 block">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section 6: CTA */}
      <motion.div
        className="bg-primary rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-1/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
            ¿Quieres profundizar en tu diagnóstico?
          </h3>
          <p className="text-white/70 font-normal mb-6 max-w-lg mx-auto">
            Agenda una sesión estratégica gratuita con nuestro equipo para revisar tu informe
            y definir los próximos pasos concretos.
          </p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-medium hover:bg-neon-1 transition-all hover:-translate-y-1 shadow-xl"
          >
            Agendar Sesión Estratégica
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
