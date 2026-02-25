"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

interface FooterProps {
  logoUrl: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  legalLinks: FooterLinkItem[];
}

export default function Footer({ logoUrl, logoAlt, logoWidth, logoHeight, legalLinks }: FooterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number, height: number;
    let particles: Particle[] = [];
    let mouse = { x: -1000, y: -1000 };
    let animationId: number;

    const config = {
      particleCount: 80,
      mouseRadius: 150,
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
      alpha: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
        this.radius = Math.random() * 3 + 2;
        this.color =
          config.colors[Math.floor(Math.random() * config.colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.alpha = 1;
      }

      update() {
        this.angle += 0.01;
        this.x += Math.cos(this.angle) * this.speed + this.vx;
        this.y += Math.sin(this.angle) * this.speed + this.vy;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < config.mouseRadius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force =
            (config.mouseRadius - distance) / config.mouseRadius;
          this.vx -=
            forceDirectionX * force * config.mouseRadius * config.mouseForce * 0.05;
          this.vy -=
            forceDirectionY * force * config.mouseRadius * config.mouseForce * 0.05;
        }

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        if (this.radius > 3) {
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }

    function resize() {
      width = canvas!.width = container!.offsetWidth;
      height = canvas!.height = container!.offsetHeight;
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
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
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      } else {
        mouse.x = -1000;
        mouse.y = -1000;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <footer className="bg-background-light pt-0 pb-8 text-gray-800 border-t border-gray-100 relative z-20">
      <div
        ref={containerRef}
        className="footer-cta-container relative w-full pt-16 pb-16 overflow-hidden border-b border-gray-100 mb-16"
      >
        <canvas ref={canvasRef} id="footer-interactive-canvas" />
        <div className="footer-cta-block relative z-10 w-full mb-0">
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-8">
            Diseña sistemas que <br />
            realmente escalen.
          </h2>
          <Link
            href="/diagnostico-ia"
            className="cta-button-generative px-8 py-3 rounded-full text-base font-medium inline-flex items-center justify-center shadow-sm"
          >
            Diagnostico IA
            <span className="material-icons ml-2 text-sm">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          <div className="col-span-1">
            <Link href="/" className="mb-4 block">
              <Image
                alt={logoAlt}
                className="h-6 md:h-8 w-auto object-contain"
                src={logoUrl}
                width={logoWidth}
                height={logoHeight}
              />
            </Link>
            <p className="text-sm font-normal text-gray-900 mb-6">
              AT Sistemas inteligentes para crecimiento real.
            </p>
            <ul className="space-y-1 text-xs text-gray-500 font-mono tracking-wide font-normal">
              <li>• AI Strategy</li>
              <li>• Process Automation</li>
              <li>• Custom Agents</li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
              Explorar
            </h4>
            <ul className="space-y-4 text-sm font-normal text-gray-500">
              <li>
                <Link href="/" className="footer-link">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="footer-link">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/#how-we-work" className="footer-link">
                  Metodologia
                </Link>
              </li>
              <li>
                <Link href="/blog" className="footer-link">
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
              Soluciones
            </h4>
            <ul className="space-y-4 text-sm font-normal text-gray-500">
              <li>
                <Link href="#" className="footer-link">
                  Consultoria Estrategica
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  AT Assistant{" "}
                  <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full ml-1 font-medium">
                    NEW
                  </span>
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  Automatizacion de Procesos
                </Link>
              </li>
              <li>
                <Link href="#" className="footer-link">
                  Integraciones Custom
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-medium text-gray-900 mb-6 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-4 text-sm font-normal text-gray-500">
              <li>
                <a
                  className="flex items-center footer-link"
                  href="mailto:hola@altotrafico.ai"
                >
                  <span className="material-icons text-base mr-2">email</span>
                  hola@altotrafico.ai
                </a>
              </li>
              <li>
                <a className="flex items-center footer-link" href="#">
                  <span className="material-icons text-base mr-2">
                    location_on
                  </span>
                  Madrid, España
                </a>
              </li>
              <li>
                <a className="flex items-center footer-link" href="#">
                  <span className="material-icons text-base mr-2">share</span>
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-normal">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 items-center">
            <span>&copy; 2024 Alto Tráfico.</span>
            {legalLinks
              .sort((a, b) => a.order - b.order)
              .map((link) => (
                <a
                  key={link.id}
                  className="hover:text-gray-800 transition-colors"
                  href={link.url}
                >
                  {link.label}
                </a>
              ))}
          </div>
          <div className="mt-4 md:mt-0 opacity-50 font-mono">Version 2.0</div>
        </div>
      </div>
    </footer>
  );
}
