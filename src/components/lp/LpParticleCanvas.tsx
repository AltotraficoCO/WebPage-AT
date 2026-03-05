"use client";

import { useEffect, useRef } from "react";

export default function LpParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000 };
    let animationId: number;

    const isMobile = window.innerWidth < 768;
    const config = {
      particleCount: isMobile ? 40 : 120,
      mouseRadius: isMobile ? 100 : 180,
      mouseForce: 0.15,
      friction: 0.95,
      connectionDistance: 140,
      gridSpacing: 60,
    };

    const weightedColors = [
      "#00F0FF", "#00F0FF", "#00F0FF", "#00F0FF", "#00F0FF", "#00F0FF",
      "#A855F7", "#A855F7",
      "#B2FFB5", "#B2FFB5",
    ];

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
        this.vx = (Math.random() - 0.5) * (isFragment ? 8 : 0.5);
        this.vy = (Math.random() - 0.5) * (isFragment ? 8 : 0.5);
        this.radius = isFragment
          ? Math.random() * 2 + 1
          : Math.random() * 2 + 1.5;
        this.color =
          weightedColors[Math.floor(Math.random() * weightedColors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.3 + 0.1;
        this.isFragment = isFragment;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
      }

      update() {
        if (!this.isFragment) {
          this.angle += 0.008;
          this.x += Math.cos(this.angle) * this.speed + this.vx;
          this.y += Math.sin(this.angle) * this.speed + this.vy;
          this.vx *= 0.98;
          this.vy *= 0.98;
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
          const force =
            (config.mouseRadius - distance) / config.mouseRadius;
          this.vx -= (dx / distance) * force * config.mouseForce;
          this.vy -= (dy / distance) * force * config.mouseForce;
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
        c.globalAlpha = this.alpha * 0.8;
        c.fill();
        if (this.radius > 2) {
          c.shadowColor = this.color;
          c.shadowBlur = 8;
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
      const burstColors = ["#00F0FF", "#A855F7"];
      for (let i = 0; i < 20; i++) {
        const p = new Particle(x, y, true);
        p.color = burstColors[Math.floor(Math.random() * burstColors.length)];
        particles.push(p);
      }
    }

    function drawGrid() {
      ctx!.strokeStyle = "rgba(0, 240, 255, 0.03)";
      ctx!.lineWidth = 0.5;
      for (let x = 0; x < width; x += config.gridSpacing) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += config.gridSpacing) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].isFragment || particles[i].alpha <= 0) continue;
        for (let j = i + 1; j < particles.length; j++) {
          if (particles[j].isFragment || particles[j].alpha <= 0) continue;
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < config.connectionDistance) {
            const opacity = (1 - dist / config.connectionDistance) * 0.4;
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
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
      drawGrid();
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

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      burst(e.clientX, e.clientY);
    };

    const handleTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      burst(mouse.x, mouse.y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchstart", handleTouch, { passive: true });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchstart", handleTouch);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
