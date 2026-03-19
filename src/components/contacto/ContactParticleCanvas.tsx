"use client";

import { useEffect, useRef } from "react";

export default function ContactParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    const mouse: { x: number | null; y: number | null } = {
      x: null,
      y: null,
    };
    let animationId: number;
    const colors = ["#B2FFB5", "#FFFA86", "#D9FD9E", "#ECFB92"];

    // Reduce particles on mobile
    const isMobile = window.innerWidth < 768;

    class Particle {
      x: number;
      y: number;
      r: number;
      color: string;
      vx: number;
      vy: number;
      density: number;

      constructor(x?: number, y?: number, r?: number, c?: string) {
        this.x = x ?? Math.random() * width;
        this.y = y ?? Math.random() * height;
        this.r = r ?? Math.random() * 3 + 1;
        this.color = c ?? colors[Math.floor(Math.random() * colors.length)];
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.density = Math.random() * 20 + 1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = 0.6;
        ctx!.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        if (mouse.x != null && mouse.y != null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          const maxDistance = 200;
          const maxDistanceSq = maxDistance * maxDistance;
          if (distSq < maxDistanceSq) {
            const distance = Math.sqrt(distSq);
            const force = (maxDistance - distance) / maxDistance;
            const dirX = (dx / distance) * force * this.density;
            const dirY = (dy / distance) * force * this.density;
            this.x -= dirX * 2;
            this.y -= dirY * 2;
          }
        }
      }

      burst() {
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
    }

    function initParticles() {
      particles = [];
      // Reduced count: mobile gets fewer particles
      const count = isMobile
        ? Math.min(30, (width * height) / 30000)
        : Math.min(60, (width * height) / 20000);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, width, height);

      const connectionDist = isMobile ? 100 : 150;
      const connectionDistSq = connectionDist * connectionDist;

      // Use squared distances to avoid Math.sqrt in the hot loop
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < connectionDistSq) {
            ctx!.strokeStyle = "#B2FFB5";
            ctx!.lineWidth = 0.5;
            ctx!.globalAlpha = 0.1;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
        particles[a].update();
        particles[a].draw();
      }
      animationId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
        initParticles();
      }, 200);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Limit burst particles from 8 to 4
      for (let i = 0; i < 4; i++) {
        const p = new Particle(
          e.clientX,
          e.clientY,
          Math.random() * 2,
          "#fff"
        );
        p.vx = (Math.random() - 0.5) * 5;
        p.vy = (Math.random() - 0.5) * 5;
        particles.push(p);
        setTimeout(() => {
          const idx = particles.indexOf(p);
          if (idx > -1) particles.splice(idx, 1);
        }, 1000);
      }
      particles.forEach((p) => {
        const dx = e.clientX - p.x;
        const dy = e.clientY - p.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 40000) p.burst(); // 200^2 = 40000
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return <canvas ref={canvasRef} id="contact-particle-canvas" />;
}
