"use client";

import { useEffect, useRef, useState } from "react";

export default function BotMascot() {
  const botRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 120, y: 500 });
  const targetRef = useRef({ x: 120, y: 500 });
  const animFrameRef = useRef<number>(0);
  const [expression, setExpression] = useState<"idle" | "excited" | "looking">("idle");
  const expressionTimeout = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };

      // Change expression when mouse moves near
      const dx = e.clientX - posRef.current.x;
      const dy = e.clientY - posRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        setExpression("excited");
      } else {
        setExpression("looking");
      }

      clearTimeout(expressionTimeout.current);
      expressionTimeout.current = setTimeout(() => setExpression("idle"), 2000);
    };

    const animate = () => {
      const bot = botRef.current;
      if (!bot) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const speed = 0.03; // Smooth follow speed
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;

      // Offset so bot doesn't sit right on cursor — stays nearby
      const offsetX = -60;
      const offsetY = 40;

      posRef.current.x += (tx + offsetX - posRef.current.x) * speed;
      posRef.current.y += (ty + offsetY - posRef.current.y) * speed;

      // Clamp to viewport
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;
      const cx = Math.max(10, Math.min(maxX, posRef.current.x));
      const cy = Math.max(80, Math.min(maxY, posRef.current.y));

      // Calculate lean based on movement direction
      const dx = tx - posRef.current.x;
      const lean = Math.max(-12, Math.min(12, dx * 0.02));

      bot.style.transform = `translate(${cx}px, ${cy}px) rotate(${lean}deg)`;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(expressionTimeout.current);
    };
  }, []);

  const eyeScale = expression === "excited" ? "scale-110" : "";
  const mouthClass =
    expression === "excited"
      ? "w-4 h-2.5 rounded-full bg-primary/40"
      : expression === "looking"
      ? "w-3 h-1.5 rounded-full bg-primary/30"
      : "w-3.5 h-1 rounded-full bg-primary/20";

  return (
    <div
      ref={botRef}
      className="fixed top-0 left-0 z-30 pointer-events-none select-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      {/* Bot body */}
      <div className="relative" style={{ width: 56, height: 56 }}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-neon-1/20 blur-lg" />

        {/* Main body — modern pill/blob */}
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-neon-1/20 border border-primary/15 shadow-lg shadow-primary/10 backdrop-blur-sm overflow-hidden">
          {/* Shimmer effect */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, transparent 40%, rgba(178,255,181,0.4) 50%, transparent 60%)",
              animation: "botShimmer 3s ease-in-out infinite",
            }}
          />

          {/* Face */}
          <div className="relative flex flex-col items-center justify-center h-full gap-1.5">
            {/* Eyes */}
            <div className="flex items-center gap-2.5">
              <div className={`w-2.5 h-3 rounded-full bg-primary transition-transform duration-200 ${eyeScale}`} style={{ borderRadius: "40% 40% 45% 45%" }} />
              <div className={`w-2.5 h-3 rounded-full bg-primary transition-transform duration-200 ${eyeScale}`} style={{ borderRadius: "40% 40% 45% 45%" }} />
            </div>
            {/* Mouth */}
            <div className={`transition-all duration-300 ${mouthClass}`} />
          </div>

          {/* Status indicator */}
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-neon-1 shadow-[0_0_6px_rgba(178,255,181,0.8)]" style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </div>

        {/* Speech bubble — appears when excited */}
        {expression === "excited" && (
          <div
            className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-primary/15 text-primary text-[9px] font-semibold px-2 py-1 rounded-lg shadow-md"
            style={{ animation: "botBubblePop 0.3s ease-out" }}
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-primary/15 rotate-45" />
            Hmm...
          </div>
        )}
      </div>
    </div>
  );
}
