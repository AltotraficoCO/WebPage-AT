"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const outline = outlineRef.current;
    const particlesContainer = particlesRef.current;
    if (!dot || !outline || !particlesContainer) return;

    function createParticle(x: number, y: number) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      const destX = (Math.random() - 0.5) * 50;
      const destY = (Math.random() - 0.5) * 50;

      particle.animate(
        [
          { transform: "translate(0, 0)", opacity: "0.8" },
          {
            transform: `translate(${destX}px, ${destY}px)`,
            opacity: "0",
          },
        ],
        { duration: 1000, easing: "ease-out", fill: "forwards" }
      );

      particlesContainer!.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }

    const handleMouseMove = (e: MouseEvent) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      outline.style.left = `${e.clientX}px`;
      outline.style.top = `${e.clientY}px`;

      if (Math.random() > 0.8) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleEnter = () => {
      outline.style.width = "60px";
      outline.style.height = "60px";
      outline.style.backgroundColor = "rgba(178, 255, 181, 0.1)";
      outline.style.borderColor = "rgba(178, 255, 181, 0.5)";
    };

    const handleLeave = () => {
      outline.style.width = "40px";
      outline.style.height = "40px";
      outline.style.backgroundColor = "transparent";
      outline.style.borderColor = "rgba(22, 51, 54, 0.3)";
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    // Add cursor class to body
    document.body.classList.add("diag-cursor-page");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
      document.body.classList.remove("diag-cursor-page");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={outlineRef} className="cursor-dot-outline hidden md:block" />
      <div ref={particlesRef} className="cursor-particles" />
    </>
  );
}
