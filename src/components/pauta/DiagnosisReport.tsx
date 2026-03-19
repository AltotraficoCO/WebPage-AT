"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import type { DiagnosisResult } from "./quizData";

const WHATSAPP_NUMBER = "573045248141";

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
      className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 relative overflow-hidden"
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
    <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
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
  const handleDownload = useCallback(() => {
    window.print();
  }, []);

  const handleWhatsApp = useCallback(() => {
    const msg = encodeURIComponent(
      `Hola! Soy ${userName} de ${companyName}. Acabo de completar el diagnóstico de IA y mi perfil es "${result.archetype.name}" (${result.score}/40). Me gustaría agendar una sesión para profundizar en mi caso.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  }, [userName, companyName, result]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 print:space-y-4">
      {/* Header + Actions */}
      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-1/20 text-sm text-primary mb-2">
            <span className="material-icons text-sm">verified</span>
            Diagnóstico generado por IA
          </span>
          <h2 className="text-2xl md:text-3xl font-semibold text-primary">
            Informe para {companyName}
          </h2>
          <p className="text-gray-600 mt-1 text-sm">Preparado para {userName}</p>
        </div>
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-primary/20 text-primary rounded-full text-sm font-semibold hover:bg-primary/5 transition-all"
          >
            <span className="material-icons text-lg">download</span>
            Descargar PDF
          </button>
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-full text-sm font-semibold hover:bg-[#20BD5A] transition-all hover:-translate-y-0.5 shadow-lg shadow-[#25D366]/20"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Quiero iniciar
          </button>
        </div>
      </motion.div>

      {/* Top row: Profile + Areas side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile / Archetype */}
        <SectionCard delay={0.2}>
          <div className="absolute top-0 right-0 p-24 bg-neon-1/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="material-icons text-3xl text-primary">{result.archetype.icon}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-neon-1 font-mono font-bold">Tu perfil</span>
                <h3 className="text-xl font-semibold text-primary leading-tight">{result.archetype.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-primary">{result.score}/40</span>
                  <span className="text-xs text-gray-500">{result.archetype.tagline}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.profile_summary}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary font-medium">
                {result.archetype.focus}
              </span>
            </div>
          </div>
        </SectionCard>

        {/* Area Analysis */}
        <SectionCard delay={0.3}>
          <SectionTitle icon="analytics" title="Análisis por Áreas" />
          <div className="space-y-4">
            {/* Sales */}
            <div className="p-3 bg-surface-light border border-gray-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-primary text-base">storefront</span>
                  <h4 className="font-semibold text-primary text-xs">Ventas & Marketing</h4>
                </div>
                <StatusBadge status={result.area_analysis?.sales_marketing?.status || "En desarrollo"} />
              </div>
              <ul className="space-y-1.5">
                {(result.area_analysis?.sales_marketing?.insights || []).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
                    <span className="material-icons text-neon-1 text-[10px] mt-0.5 flex-shrink-0">arrow_right</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            {/* Operations */}
            <div className="p-3 bg-surface-light border border-gray-100 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-icons text-primary text-base">settings</span>
                  <h4 className="font-semibold text-primary text-xs">Operaciones</h4>
                </div>
                <StatusBadge status={result.area_analysis?.operations?.status || "En desarrollo"} />
              </div>
              <ul className="space-y-1.5">
                {(result.area_analysis?.operations?.insights || []).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
                    <span className="material-icons text-neon-1 text-[10px] mt-0.5 flex-shrink-0">arrow_right</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Web Analysis row: SEO + SEM + Social */}
      {(result.area_analysis?.seo || result.area_analysis?.sem || result.area_analysis?.social_media) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { key: "seo" as const, icon: "search", title: "SEO", data: result.area_analysis?.seo },
            { key: "sem" as const, icon: "ads_click", title: "SEM & Publicidad", data: result.area_analysis?.sem },
            { key: "social_media" as const, icon: "share", title: "Redes Sociales", data: result.area_analysis?.social_media },
          ].map((section, i) => (
            <SectionCard key={section.key} delay={0.35 + i * 0.05}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-icons text-neon-1 bg-primary rounded-lg p-1 text-sm">{section.icon}</span>
                  <h4 className="font-semibold text-primary text-sm">{section.title}</h4>
                </div>
                {section.data && <StatusBadge status={section.data.status} />}
              </div>
              {section.data ? (
                <div className="space-y-3">
                  <ul className="space-y-1.5">
                    {section.data.insights.map((insight, j) => (
                      <li key={j} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
                        <span className="material-icons text-neon-1 text-[10px] mt-0.5 flex-shrink-0">arrow_right</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                  {section.data.quick_wins.length > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-1.5">Quick Wins</p>
                      <ul className="space-y-1">
                        {section.data.quick_wins.map((win, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-[11px] text-primary/80 leading-relaxed font-medium">
                            <span className="material-icons text-neon-1 text-[10px] mt-0.5 flex-shrink-0">bolt</span>
                            {win}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Crear presencia digital desde cero</p>
              )}
            </SectionCard>
          ))}
        </div>
      )}

      {/* Middle row: Semaphore + Roadmap side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Semaphore */}
        <SectionCard delay={0.4}>
          <SectionTitle icon="traffic" title="Semáforo de Riesgo" />
          <p className="text-[10px] text-gray-500 mb-3 -mt-3 uppercase tracking-wider font-medium">Sin IA en 6 meses...</p>
          <div className="space-y-3">
            {[
              { color: "red", label: "Riesgo Alto", items: result.risk_semaphore?.red || [], icon: "warning", bg: "bg-red-50/60", border: "border-red-100", textColor: "text-red-600/80", iconColor: "text-red-400", dotColor: "bg-red-500", labelColor: "text-red-700" },
              { color: "yellow", label: "Monitorear", items: result.risk_semaphore?.yellow || [], icon: "info", bg: "bg-yellow-50/60", border: "border-yellow-100", textColor: "text-yellow-600/80", iconColor: "text-yellow-400", dotColor: "bg-yellow-500", labelColor: "text-yellow-700" },
              { color: "green", label: "Fortalezas", items: result.risk_semaphore?.green || [], icon: "check_circle", bg: "bg-green-50/60", border: "border-green-100", textColor: "text-green-600/80", iconColor: "text-green-400", dotColor: "bg-green-500", labelColor: "text-green-700" },
            ].map((group) => (
              <div key={group.color} className={`p-3 ${group.bg} border ${group.border} rounded-xl`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${group.dotColor}`} />
                  <span className={`text-xs font-semibold ${group.labelColor}`}>{group.label}</span>
                </div>
                <ul className="space-y-1">
                  {group.items.map((item, i) => (
                    <li key={i} className={`text-[11px] ${group.textColor} leading-relaxed flex items-start gap-1`}>
                      <span className={`material-icons ${group.iconColor} text-[10px] mt-0.5 flex-shrink-0`}>{group.icon}</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Tactical Roadmap */}
        <SectionCard delay={0.5}>
          <SectionTitle icon="route" title="Hoja de Ruta Táctica" />
          <p className="text-[10px] text-gray-500 mb-3 -mt-3 uppercase tracking-wider font-medium">Lo que podemos hacer juntos</p>
          <div className="space-y-3">
            {[
              { label: "Esta Semana", icon: "bolt", items: result.tactical_roadmap?.immediate || [] },
              { label: "30 Días", icon: "event", items: result.tactical_roadmap?.short_term || [] },
              { label: "60-90 Días", icon: "rocket_launch", items: result.tactical_roadmap?.medium_term || [] },
            ].map((phase, i) => (
              <div key={phase.label} className="p-3 bg-surface-light border border-gray-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    <span className="material-icons text-xs">{phase.icon}</span>
                  </span>
                  <span className="text-xs font-semibold text-primary">{phase.label}</span>
                </div>
                <ul className="space-y-1">
                  {phase.items.map((action, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-[11px] text-gray-600 leading-relaxed">
                      <span className="material-icons text-neon-1 text-[10px] mt-0.5 flex-shrink-0">check_circle</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* CTA: WhatsApp */}
      <motion.div
        className="bg-primary rounded-2xl p-6 md:p-10 relative overflow-hidden print:hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-1/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-2/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-grow text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
              {result.commercial_close?.headline || "Tu empresa tiene potencial sin explotar"}
            </h3>
            <p className="text-white/70 font-normal text-sm leading-relaxed max-w-lg">
              {result.commercial_close?.body ||
                "Agenda una sesión con nuestro equipo para revisar tu diagnóstico y definir un plan de acción concreto."}
            </p>
          </div>
          <div className="flex flex-col gap-3 flex-shrink-0">
            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20BD5A] transition-all hover:-translate-y-1 shadow-xl text-sm whitespace-nowrap"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Quiero iniciar
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-white/10 text-white/80 rounded-full text-xs font-medium hover:bg-white/20 transition-all"
            >
              <span className="material-icons text-sm">download</span>
              Guardar informe
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
