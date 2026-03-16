"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { QuizStep as QuizStepType } from "./quizData";

function TiltCard({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const handleMouseLeave = () => {
    const card = ref.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
  };

  return (
    <button
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

interface QuizStepProps {
  step: QuizStepType;
  stepIndex: number;
  totalSteps: number;
  formData: Record<string, string>;
  onSelect: (value: string) => void;
  onFormSubmit: (data: Record<string, string>) => void;
  onBack: () => void;
  direction: number;
}

export default function QuizStepComponent({
  step,
  stepIndex,
  totalSteps,
  formData,
  onSelect,
  onFormSubmit,
  onBack,
  direction,
}: QuizStepProps) {
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const field of step.fields || []) {
      data[field.name] = (fd.get(field.name) as string) || "";
    }
    onFormSubmit(data);
  };

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={step.id}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        {/* Step indicator pills */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < stepIndex
                  ? "bg-neon-1 flex-1"
                  : i === stepIndex
                  ? "bg-primary flex-[2]"
                  : "bg-gray-200 flex-1"
              }`}
            />
          ))}
        </div>

        <div className="mb-8">
          <motion.span
            className="inline-flex items-center gap-2 text-neon-1 font-mono text-xs bg-primary/5 border border-primary/10 px-4 py-1.5 rounded-full tracking-wider uppercase"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neon-1 animate-pulse" />
            {step.phase}
          </motion.span>
          <motion.h2
            className="text-2xl md:text-3xl font-medium mt-4 text-primary leading-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {step.title}
          </motion.h2>
          <motion.p
            className="text-gray-400 mt-2 font-normal text-sm md:text-base"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {step.subtitle}
          </motion.p>
        </div>

        {step.type === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
            {step.fields?.map((field, i) => (
              <motion.div
                key={field.name}
                className="group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
              >
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium group-focus-within:text-primary transition-colors">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    defaultValue={formData[field.name] || ""}
                    className="form-input w-full text-primary bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-gray-300"
                  />
                </div>
              </motion.div>
            ))}
            <motion.button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20 group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Continuar
              <span className="material-icons text-lg group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </motion.button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {step.options?.map((opt, i) => (
              <motion.div
                key={opt.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <TiltCard
                  className="group relative p-5 bg-white border border-gray-100 rounded-2xl text-left hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 w-full"
                  onClick={() => onSelect(opt.value)}
                >
                  {/* Selection indicator */}
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-primary group-hover:bg-neon-1 transition-all duration-300 flex items-center justify-center">
                    <span className="material-icons text-[11px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">check</span>
                  </div>
                  {opt.icon && (
                    <div className="w-10 h-10 rounded-xl bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center mb-3 transition-colors">
                      <span className="material-icons text-xl text-gray-400 group-hover:text-primary transition-colors">
                        {opt.icon}
                      </span>
                    </div>
                  )}
                  <h3 className="font-medium text-sm text-primary mb-1">{opt.title}</h3>
                  <p className="text-xs text-gray-400 font-normal leading-relaxed">{opt.desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          {stepIndex > 0 ? (
            <button
              className="text-sm text-gray-400 hover:text-primary flex items-center gap-1 transition-colors group"
              onClick={onBack}
              type="button"
            >
              <span className="material-icons text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
              Atrás
            </button>
          ) : (
            <div />
          )}
          <span className="text-xs text-gray-300 font-mono">
            {String(stepIndex + 1).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
