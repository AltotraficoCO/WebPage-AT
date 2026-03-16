"use client";

import { useEffect, useRef } from "react";

export default function BotMascot() {
  const botRef = useRef<HTMLDivElement>(null);
  const eyeLRef = useRef<HTMLDivElement>(null);
  const eyeRRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const bot = botRef.current;
      const eyeL = eyeLRef.current;
      const eyeR = eyeRRef.current;
      if (!bot || !eyeL || !eyeR) return;

      const rect = bot.getBoundingClientRect();
      const botCenterX = rect.left + rect.width / 2;
      const botCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - botCenterX;
      const dy = e.clientY - botCenterY;
      const angle = Math.atan2(dy, dx);
      const maxMove = 3;
      const moveX = Math.cos(angle) * maxMove;
      const moveY = Math.sin(angle) * maxMove;

      const pupilTransform = `translate(${moveX}px, ${moveY}px)`;
      eyeL.style.transform = pupilTransform;
      eyeR.style.transform = pupilTransform;

      // Subtle body lean toward mouse
      const leanX = Math.max(-3, Math.min(3, dx / 200));
      const leanY = Math.max(-2, Math.min(2, dy / 300));
      bot.style.transform = `translate(${leanX}px, ${leanY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      <div
        ref={botRef}
        className="relative transition-transform duration-150 ease-out"
        style={{ width: 80, height: 90 }}
      >
        {/* Antenna */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 w-0.5 h-4 bg-primary/30 rounded-full" />
        <div className="absolute left-1/2 -translate-x-1/2 -top-5 w-3 h-3 rounded-full bg-neon-1 shadow-[0_0_8px_rgba(178,255,181,0.6)]" style={{ animation: "pulse 2s ease-in-out infinite" }} />

        {/* Head / Body */}
        <div className="absolute inset-0 bg-primary/[0.07] border-2 border-primary/20 rounded-2xl backdrop-blur-sm">
          {/* Face */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {/* Left eye */}
            <div className="w-5 h-5 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <div
                ref={eyeLRef}
                className="w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-75"
              />
            </div>
            {/* Right eye */}
            <div className="w-5 h-5 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center overflow-hidden">
              <div
                ref={eyeRRef}
                className="w-2.5 h-2.5 rounded-full bg-primary transition-transform duration-75"
              />
            </div>
          </div>

          {/* Mouth — small smile */}
          <div className="flex justify-center mt-2">
            <div className="w-6 h-2.5 border-b-2 border-primary/25 rounded-b-full" />
          </div>

          {/* Chest indicator */}
          <div className="flex justify-center mt-2">
            <div className="w-2 h-2 rounded-full bg-neon-1/60" style={{ animation: "pulse 3s ease-in-out infinite" }} />
          </div>
        </div>

        {/* Left arm */}
        <div className="absolute -left-2 top-10 w-2 h-6 bg-primary/10 border border-primary/15 rounded-full" style={{ animation: "botArmSwing 4s ease-in-out infinite" }} />

        {/* Right arm */}
        <div className="absolute -right-2 top-10 w-2 h-6 bg-primary/10 border border-primary/15 rounded-full" style={{ animation: "botArmSwing 4s ease-in-out infinite reverse" }} />

        {/* Legs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-3 h-3 bg-primary/10 border border-primary/15 rounded-b-lg rounded-t-sm" style={{ animation: "botWalk 2s ease-in-out infinite" }} />
          <div className="w-3 h-3 bg-primary/10 border border-primary/15 rounded-b-lg rounded-t-sm" style={{ animation: "botWalk 2s ease-in-out infinite 1s" }} />
        </div>
      </div>
    </div>
  );
}
