"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { processingLogs } from "./quizData";

interface ProcessingAnimationProps {
  sector: string;
  onComplete: () => void;
}

export default function ProcessingAnimation({ sector, onComplete }: ProcessingAnimationProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    const filledLogs = processingLogs.map((l) => l.replace("{sector}", sector));
    let i = 0;

    const interval = setInterval(() => {
      if (i < filledLogs.length) {
        setLogs((prev) => [...prev, filledLogs[i]]);
        setProgress(((i + 1) / filledLogs.length) * 100);
        i++;
      } else {
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          setTimeout(onComplete, 800);
        }
      }
    }, 400);

    return () => clearInterval(interval);
  }, [sector, onComplete]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        {/* Radar animation */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border border-primary/8" />
          <div className="absolute inset-3 rounded-full border border-primary/12" />
          <div className="absolute inset-6 rounded-full border border-primary/18" />
          <div className="absolute inset-9 rounded-full border border-primary/25" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 270deg, rgba(178, 255, 181, 0.08) 330deg, rgba(178, 255, 181, 0.5) 360deg)",
              animation: "radarSpin 2s linear infinite",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons text-3xl text-primary animate-pulse">psychology</span>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-medium text-primary mb-2">
          Analizando tu empresa con IA
        </h3>
        <p className="text-gray-400 font-normal text-sm">
          Claude AI está generando tu diagnóstico personalizado...
        </p>
      </div>

      {/* Terminal */}
      <div className="bg-[#0a0f14] text-neon-3 p-6 rounded-2xl border border-gray-800/60 font-mono text-sm relative overflow-hidden shadow-2xl shadow-black/20">
        <div className="scanner-overlay" />
        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-[10px] text-gray-600 ml-2 uppercase tracking-widest">
              ai_processing.sh
            </span>
          </div>
          <span className="text-[10px] text-green-500/60 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Processing
          </span>
        </div>

        <div ref={terminalRef} className="space-y-1.5 opacity-90 max-h-[200px] overflow-y-auto">
          {logs.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-gray-400"
            >
              <span className="text-neon-1">$</span> {log}
            </motion.p>
          ))}
          <p className="text-white text-xs">
            $ <span className="typing-cursor" />
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 border-t border-gray-800/60 pt-4">
          <div className="flex justify-between text-[10px] uppercase tracking-wider mb-2">
            <span className="text-gray-600">Processing</span>
            <span className="text-neon-1 font-mono">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800/60 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-1 to-neon-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
