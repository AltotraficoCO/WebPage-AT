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
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
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
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
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
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full"
      >
        <div className="mb-8">
          <span className="text-neon-1 font-mono text-sm bg-primary/5 px-3 py-1 rounded">
            {step.phase}
          </span>
          <h2 className="text-2xl md:text-3xl font-medium mt-3 text-primary">
            {step.title}
          </h2>
          <p className="text-gray-500 mt-2 font-normal">{step.subtitle}</p>
        </div>

        {step.type === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
            {step.fields?.map((field) => (
              <div key={field.name} className="input-group">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  defaultValue={formData[field.name] || ""}
                  className="form-input w-full text-primary"
                />
                <div className="input-underline" />
              </div>
            ))}
            <button
              type="submit"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-lg shadow-primary/20"
            >
              Continuar
              <span className="material-icons text-lg">arrow_forward</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {step.options?.map((opt) => (
              <TiltCard
                key={opt.value}
                className="group relative p-5 bg-white border border-gray-200 rounded-xl text-left hover:border-primary transition-all duration-300 shadow-sm hover:shadow-md w-full"
                onClick={() => onSelect(opt.value)}
              >
                <div className="absolute top-4 right-4 w-4 h-4 rounded-full border border-gray-300 group-hover:bg-neon-1 group-hover:border-transparent transition-colors" />
                {opt.icon && (
                  <span className="material-icons text-2xl text-gray-400 mb-3 group-hover:text-primary transition-colors block">
                    {opt.icon}
                  </span>
                )}
                <h3 className="font-medium text-base text-primary mb-1">{opt.title}</h3>
                <p className="text-sm text-gray-500 font-normal">{opt.desc}</p>
              </TiltCard>
            ))}
          </div>
        )}

        {stepIndex > 0 && (
          <button
            className="mt-6 text-sm text-gray-400 hover:text-primary flex items-center transition-colors"
            onClick={onBack}
            type="button"
          >
            <span className="material-icons text-sm mr-1">arrow_back</span>
            Atrás
          </button>
        )}

        <div className="mt-8 text-xs text-gray-400">
          {stepIndex + 1} de {totalSteps}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
