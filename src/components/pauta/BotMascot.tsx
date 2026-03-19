"use client";

import { useEffect, useRef, useState } from "react";

// Form repulsion zone — right half of screen where the quiz lives
function isInFormZone(x: number, y: number): boolean {
  const midX = window.innerWidth * 0.45;
  return x > midX && y > 80 && y < window.innerHeight - 100;
}

export default function BotMascot() {
  const botRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 120, y: 400 });
  const targetRef = useRef({ x: 120, y: 400 });
  const animFrameRef = useRef<number>(0);
  const [expression, setExpression] = useState<"idle" | "excited" | "looking" | "waiting">("idle");
  const expressionTimeout = useRef<NodeJS.Timeout>(undefined);
  const [bubble, setBubble] = useState("");
  const isMoving = useRef(false);

  useEffect(() => {
    const bubbleTexts = {
      waiting: ["Esperando...", "Quiero ver!", "Ya casi?", "Hmm..."],
      excited: ["Ooh!", "Eso!", "Wow!", "Siii!"],
    };

    // Throttle mousemove to ~30fps instead of every event
    let lastMoveTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMoveTime < 33) return; // ~30fps throttle
      lastMoveTime = now;

      const mouseInForm = isInFormZone(e.clientX, e.clientY);
      targetRef.current = { x: e.clientX, y: e.clientY };

      const dx = e.clientX - posRef.current.x;
      const dy = e.clientY - posRef.current.y;
      const distSq = dx * dx + dy * dy;

      if (mouseInForm) {
        setExpression("waiting");
        const texts = bubbleTexts.waiting;
        setBubble(texts[Math.floor(Math.random() * texts.length)]);
      } else if (distSq < 22500) { // 150^2
        setExpression("excited");
        const texts = bubbleTexts.excited;
        setBubble(texts[Math.floor(Math.random() * texts.length)]);
      } else {
        setExpression("looking");
        setBubble("");
      }

      clearTimeout(expressionTimeout.current);
      expressionTimeout.current = setTimeout(() => {
        setExpression("idle");
        setBubble("");
        isMoving.current = false;
      }, 2500);

      // Start animation loop if not already running
      if (!isMoving.current) {
        isMoving.current = true;
        startAnimation();
      }
    };

    function startAnimation() {
      const animate = () => {
        const bot = botRef.current;
        if (!bot || !isMoving.current) return;

        const tx = targetRef.current.x;
        const ty = targetRef.current.y;
        const mouseInForm = isInFormZone(tx, ty);

        let goalX: number;
        let goalY: number;

        if (mouseInForm) {
          const borderX = window.innerWidth * 0.42;
          goalX = borderX;
          goalY = ty;
          const jitterX = Math.sin(Date.now() / 150) * 3;
          const jitterY = Math.cos(Date.now() / 200) * 2;
          goalX += jitterX;
          goalY += jitterY;
        } else {
          goalX = tx - 50;
          goalY = ty + 35;
        }

        const speed = mouseInForm ? 0.05 : 0.03;
        posRef.current.x += (goalX - posRef.current.x) * speed;
        posRef.current.y += (goalY - posRef.current.y) * speed;

        const maxX = window.innerWidth - 70;
        const maxY = window.innerHeight - 70;
        const cx = Math.max(10, Math.min(maxX, posRef.current.x));
        const cy = Math.max(80, Math.min(maxY, posRef.current.y));

        const dx = tx - posRef.current.x;
        const lean = Math.max(-15, Math.min(15, dx * 0.025));

        bot.style.transform = `translate(${cx}px, ${cy}px) rotate(${lean}deg)`;

        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(expressionTimeout.current);
      isMoving.current = false;
    };
  }, []);

  const isWaiting = expression === "waiting";
  const isExcited = expression === "excited";

  return (
    <div
      ref={botRef}
      className="fixed top-0 left-0 z-30 pointer-events-none select-none"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    >
      <div className="relative" style={{ width: 56, height: 56 }}>
        {/* Glow */}
        <div className={`absolute inset-0 rounded-2xl blur-lg transition-colors duration-300 ${isWaiting ? "bg-neon-2/30" : "bg-neon-1/20"}`} />

        {/* Body */}
        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-neon-1/20 border shadow-lg backdrop-blur-sm overflow-hidden transition-all duration-300 ${isWaiting ? "border-neon-2/40 shadow-neon-2/20" : "border-primary/15 shadow-primary/10"}`}>
          {/* Shimmer */}
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
              {isWaiting ? (
                <>
                  <div className="w-3 h-3.5 rounded-full bg-primary transition-all duration-200 relative overflow-hidden">
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white/80" />
                  </div>
                  <div className="w-3 h-3.5 rounded-full bg-primary transition-all duration-200 relative overflow-hidden">
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 rounded-full bg-white/80" />
                  </div>
                </>
              ) : (
                <>
                  <div className={`w-2.5 h-3 rounded-full bg-primary transition-transform duration-200 ${isExcited ? "scale-110" : ""}`} style={{ borderRadius: "40% 40% 45% 45%" }} />
                  <div className={`w-2.5 h-3 rounded-full bg-primary transition-transform duration-200 ${isExcited ? "scale-110" : ""}`} style={{ borderRadius: "40% 40% 45% 45%" }} />
                </>
              )}
            </div>
            {/* Mouth */}
            <div className={`transition-all duration-300 ${
              isWaiting
                ? "w-3 h-3 rounded-full border-2 border-primary/30 bg-transparent"
                : isExcited
                ? "w-4 h-2.5 rounded-full bg-primary/40"
                : expression === "looking"
                ? "w-3 h-1.5 rounded-full bg-primary/30"
                : "w-3.5 h-1 rounded-full bg-primary/20"
            }`} />
          </div>

          {/* Status LED */}
          <div className={`absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full shadow-[0_0_6px_rgba(178,255,181,0.8)] ${isWaiting ? "bg-neon-2" : "bg-neon-1"}`} style={{ animation: "pulse 2s ease-in-out infinite" }} />
        </div>

        {/* Speech bubble */}
        {bubble && (
          <div
            className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white border border-primary/15 text-primary text-[9px] font-bold px-2.5 py-1 rounded-lg shadow-md"
            style={{ animation: "botBubblePop 0.3s ease-out" }}
          >
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-primary/15 rotate-45" />
            {bubble}
          </div>
        )}
      </div>
    </div>
  );
}
