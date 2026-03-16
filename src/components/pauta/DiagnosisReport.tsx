"use client";

import { motion } from "framer-motion";
import type { DiagnosisResult } from "./quizData";

interface DiagnosisReportProps {
  result: DiagnosisResult;
  userName: string;
  companyName: string;
}

function SectionCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-2xl p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <h3 className="text-xl font-medium text-primary mb-6 flex items-center gap-2">
      <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">{icon}</span>
      {title}
    </h3>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    "Crítico": "bg-red-100 text-red-700 border-red-200",
    "En desarrollo": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Competente": "bg-blue-100 text-blue-700 border-blue-200",
    "Avanzado": "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${colors[status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {status}
    </span>
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

      {/* Section 1: Profile / Archetype */}
      <SectionCard delay={0.2}>
        <div className="absolute top-0 right-0 p-32 bg-neon-1/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Archetype icon + score */}
            <div className="flex-shrink-0 text-center">
              <div className="w-28 h-28 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-3">
                <span className="material-icons text-5xl text-primary">{result.archetype.icon}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-1/20 border border-neon-1/30">
                <span className="text-2xl font-bold text-primary">{result.score}</span>
                <span className="text-sm text-gray-500">/40</span>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-neon-1 font-mono font-medium">Tu perfil</span>
              <h3 className="text-2xl md:text-3xl font-medium text-primary mt-1">
                {result.archetype.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1 font-medium">{result.archetype.tagline}</p>
              <p className="text-gray-500 font-normal mt-4 leading-relaxed">
                {result.profile_summary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary">
                  Foco: {result.archetype.focus}
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary">
                  {result.archetype.proposal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Section 2: Area Analysis */}
      <SectionCard delay={0.4}>
        <SectionTitle icon="analytics" title="Análisis por Áreas" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sales & Marketing */}
          <motion.div
            className="p-5 bg-surface-light border border-gray-100 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary text-lg">storefront</span>
                <h4 className="font-medium text-primary text-sm">Ventas & Marketing</h4>
              </div>
              <StatusBadge status={result.area_analysis?.sales_marketing?.status || "En desarrollo"} />
            </div>
            <ul className="space-y-2.5">
              {(result.area_analysis?.sales_marketing?.insights || []).map((insight, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-xs text-gray-600 font-normal leading-relaxed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="material-icons text-neon-1 text-xs mt-0.5 flex-shrink-0">arrow_right</span>
                  {insight}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Operations */}
          <motion.div
            className="p-5 bg-surface-light border border-gray-100 rounded-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-icons text-primary text-lg">settings</span>
                <h4 className="font-medium text-primary text-sm">Operaciones</h4>
              </div>
              <StatusBadge status={result.area_analysis?.operations?.status || "En desarrollo"} />
            </div>
            <ul className="space-y-2.5">
              {(result.area_analysis?.operations?.insights || []).map((insight, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-xs text-gray-600 font-normal leading-relaxed"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="material-icons text-neon-1 text-xs mt-0.5 flex-shrink-0">arrow_right</span>
                  {insight}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </SectionCard>

      {/* Section 3: Risk Semaphore */}
      <SectionCard delay={0.6}>
        <SectionTitle icon="traffic" title="Semáforo de Riesgo" />
        <p className="text-xs text-gray-400 mb-5 -mt-4">Sin IA en los próximos 6 meses...</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Red */}
          <motion.div
            className="p-4 bg-red-50/50 border border-red-100 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-medium text-red-700">Riesgo Alto</span>
            </div>
            <ul className="space-y-2">
              {(result.risk_semaphore?.red || []).map((item, i) => (
                <li key={i} className="text-xs text-red-600/80 font-normal leading-relaxed flex items-start gap-1.5">
                  <span className="material-icons text-red-400 text-xs mt-0.5 flex-shrink-0">warning</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Yellow */}
          <motion.div
            className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">Monitorear</span>
            </div>
            <ul className="space-y-2">
              {(result.risk_semaphore?.yellow || []).map((item, i) => (
                <li key={i} className="text-xs text-yellow-600/80 font-normal leading-relaxed flex items-start gap-1.5">
                  <span className="material-icons text-yellow-400 text-xs mt-0.5 flex-shrink-0">info</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Green */}
          <motion.div
            className="p-4 bg-green-50/50 border border-green-100 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm font-medium text-green-700">Fortalezas</span>
            </div>
            <ul className="space-y-2">
              {(result.risk_semaphore?.green || []).map((item, i) => (
                <li key={i} className="text-xs text-green-600/80 font-normal leading-relaxed flex items-start gap-1.5">
                  <span className="material-icons text-green-400 text-xs mt-0.5 flex-shrink-0">check_circle</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </SectionCard>

      {/* Section 4: Tactical Roadmap */}
      <SectionCard delay={0.8}>
        <SectionTitle icon="route" title="Hoja de Ruta Táctica" />
        <p className="text-xs text-gray-400 mb-5 -mt-4">Lo que podemos hacer juntos</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-neon-1 via-primary/20 to-neon-1 opacity-30" />

          {[
            { key: "immediate" as const, label: "Esta Semana", icon: "bolt", items: result.tactical_roadmap?.immediate || [] },
            { key: "short_term" as const, label: "30 Días", icon: "event", items: result.tactical_roadmap?.short_term || [] },
            { key: "medium_term" as const, label: "60-90 Días", icon: "rocket_launch", items: result.tactical_roadmap?.medium_term || [] },
          ].map((phase, i) => (
            <motion.div
              key={phase.key}
              className="relative bg-surface-light border border-gray-100 rounded-xl p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.15 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-icons text-sm">{phase.icon}</span>
                </span>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">{phase.label}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {phase.items.map((action, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-600 font-normal leading-relaxed">
                    <span className="material-icons text-neon-1 text-xs mt-0.5 flex-shrink-0">check_circle</span>
                    {action}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </SectionCard>

      {/* Section 5: Commercial Close */}
      <motion.div
        className="bg-primary rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-1/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-2/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-white/80 mb-4">
            <span className="material-icons text-xs text-neon-1">event_available</span>
            Sesión de Auditoría Profunda
          </span>
          <h3 className="text-2xl md:text-3xl font-medium text-white mb-3">
            {result.commercial_close?.headline || "¿Listo para transformar tu empresa con IA?"}
          </h3>
          <p className="text-white/70 font-normal mb-6 max-w-lg mx-auto leading-relaxed">
            {result.commercial_close?.body ||
              "Agenda una sesión estratégica gratuita con nuestro equipo para revisar tu informe y definir los próximos pasos concretos."}
          </p>
          <button
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary rounded-full font-medium hover:bg-neon-1 transition-all hover:-translate-y-1 shadow-xl"
          >
            {result.commercial_close?.cta_text || "Agendar Sesión Estratégica"}
            <span className="material-icons">arrow_forward</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
