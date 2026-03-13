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
      <div className="text-center mb-8">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Radar animation */}
          <div className="absolute inset-0 rounded-full border border-primary/10" />
          <div className="absolute inset-2 rounded-full border border-primary/15" />
          <div className="absolute inset-4 rounded-full border border-primary/20" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 270deg, rgba(178, 255, 181, 0.1) 330deg, rgba(178, 255, 181, 0.6) 360deg)",
              animation: "radarSpin 2s linear infinite",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-icons text-3xl text-primary animate-pulse">psychology</span>
          </div>
        </div>

        <h3 className="text-2xl font-medium text-primary mb-2">
          Analizando tu empresa con IA
        </h3>
        <p className="text-gray-500 font-normal text-sm">
          Claude AI está generando tu diagnóstico personalizado...
        </p>
      </div>

      {/* Terminal */}
      <div className="bg-surface-dark text-neon-3 p-6 rounded-xl border border-gray-800 font-mono text-sm relative overflow-hidden">
        <div className="scanner-overlay" />
        <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
          <span className="uppercase tracking-widest text-xs opacity-70">AI Processing</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>

        <div ref={terminalRef} className="space-y-2 opacity-90 max-h-[200px] overflow-y-auto">
          {logs.map((log, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-neon-1">&gt;</span> {log}
            </motion.p>
          ))}
          <p className="text-white">
            &gt; <span className="typing-cursor" />
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-6 border-t border-gray-800 pt-4">
          <div className="flex justify-between text-xs uppercase tracking-wider mb-2 text-gray-500">
            <span>Processing</span>
            <span className="text-neon-1">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-neon-1 rounded-full"
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
