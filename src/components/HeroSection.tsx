"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const hint = hintRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let animationId: number;

    const config = {
      particleCount: 180,
      mouseRadius: 180,
      mouseForce: 0.15,
      friction: 0.95,
      colors: ["#B2FFB5", "#FFFA86", "#D9FD9E", "#ECFB92"],
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      angle: number;
      speed: number;
      isFragment: boolean;
      alpha: number;
      decay: number;

      constructor(x?: number, y?: number, isFragment = false) {
        this.x = x ?? Math.random() * width;
        this.y = y ?? Math.random() * height;
        this.vx = (Math.random() - 0.5) * (isFragment ? 8 : 1);
        this.vy = (Math.random() - 0.5) * (isFragment ? 8 : 1);
        this.radius = isFragment
          ? Math.random() * 2 + 1
          : Math.random() * 3 + 2;
        this.color =
          config.colors[Math.floor(Math.random() * config.colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.isFragment = isFragment;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
      }

      update() {
        if (!this.isFragment) {
          this.angle += 0.01;
          this.x += Math.cos(this.angle) * this.speed + this.vx;
          this.y += Math.sin(this.angle) * this.speed + this.vy;
        } else {
          this.x += this.vx;
          this.y += this.vy;
          this.vx *= config.friction;
          this.vy *= config.friction;
          this.alpha -= this.decay;
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < config.mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force =
            (config.mouseRadius - distance) / config.mouseRadius;
          this.vx -=
            forceDirectionX *
            force *
            config.mouseRadius *
            config.mouseForce *
            0.05;
          this.vy -=
            forceDirectionY *
            force *
            config.mouseRadius *
            config.mouseForce *
            0.05;
        }

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(c: CanvasRenderingContext2D) {
        if (this.alpha <= 0) return;
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        const oldAlpha = c.globalAlpha;
        c.globalAlpha = this.alpha;
        c.fill();
        if (this.radius > 3) {
          c.shadowColor = this.color;
          c.shadowBlur = 10;
          c.fill();
          c.shadowBlur = 0;
        }
        c.globalAlpha = oldAlpha;
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function burst(x: number, y: number) {
      if (hint) hint.style.opacity = "0";
      for (let i = 0; i < 20; i++) {
        particles.push(new Particle(x, y, true));
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].alpha <= 0) continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[j].alpha <= 0) continue;
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(178, 255, 181, ${1 - dist / 120})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(particles[j].x, particles[j].y);
            ctx!.stroke();
          }
        }
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);
      particles = particles.filter((p) => p.alpha > 0);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx!);
      });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas!.getBoundingClientRect();
      burst(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouch = (e: TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
      burst(mouse.x, mouse.y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("click", handleClick);
    section.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("click", handleClick);
      section.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <section id="generative-hero" ref={sectionRef}>
      <canvas ref={canvasRef} id="hero-canvas" />
      <div className="hero-content z-20 pointer-events-none w-full px-4">
        <h1
          className={`text-6xl md:text-8xl font-medium tracking-tighter text-text-light mb-8 leading-[1.05] max-w-5xl mx-auto hero-text-reveal ${
            revealed ? "is-visible" : ""
          }`}
        >
          Sistemas inteligentes
          <br />
          para crecimiento{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-800">
            real.
          </span>
        </h1>
        <p
          className={`mt-8 mb-10 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto hero-text-reveal font-normal ${
            revealed ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Consultoría estratégica de IA para empresas que buscan liderar la
          próxima era digital.
        </p>
        <div
          className={`flex justify-center hero-text-reveal ${
            revealed ? "is-visible" : ""
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <Link
            href="/diagnostico-ia"
            className="cta-button-generative px-8 py-4 rounded-full text-base flex items-center shadow-sm pointer-events-auto"
          >
            Iniciar Diagnostico
            <span className="material-icons ml-2 text-lg">arrow_forward</span>
          </Link>
        </div>
      </div>
      <div
        ref={hintRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 text-xs tracking-widest uppercase animate-pulse pointer-events-none transition-opacity duration-500"
      >
        Scroll to discover
      </div>
    </section>
  );
}
