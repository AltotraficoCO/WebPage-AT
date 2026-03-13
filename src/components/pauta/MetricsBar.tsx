"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Metric {
  value: number;
  suffix: string;
  label: string;
}

const metrics: Metric[] = [
  { value: 85, suffix: "%", label: "Mejora promedio en eficiencia" },
  { value: 120, suffix: "h", label: "Horas ahorradas al mes" },
  { value: 40, suffix: "+", label: "Empresas diagnosticadas" },
  { value: 3, suffix: "x", label: "ROI promedio en 6 meses" },
];

function CountUp({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="text-4xl md:text-5xl font-medium text-primary tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function MetricsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-16 bg-surface-light border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <CountUp target={m.value} suffix={m.suffix} inView={inView} />
              <p className="text-sm text-gray-500 mt-2 font-normal">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
