"use client";

import { useEffect, useRef } from "react";

export default function ContactCursor() {
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
          { transform: `translate(${destX}px, ${destY}px)`, opacity: "0" },
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
      if (Math.random() > 0.9) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const handleEnter = (el: Element) => {
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") {
        document.body.classList.add("input-focused");
      } else {
        outline.style.width = "60px";
        outline.style.height = "60px";
        outline.style.backgroundColor = "rgba(178, 255, 181, 0.1)";
        outline.style.borderColor = "rgba(178, 255, 181, 0.5)";
      }
    };

    const handleLeave = () => {
      document.body.classList.remove("input-focused");
      outline.style.width = "40px";
      outline.style.height = "40px";
      outline.style.backgroundColor = "transparent";
      outline.style.borderColor = "rgba(22, 51, 54, 0.3)";
      outline.style.borderRadius = "50%";
      outline.style.border = "1px solid rgba(22, 51, 54, 0.3)";
      outline.style.boxShadow = "none";
    };

    // Focus particles on form inputs
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          createParticle(
            rect.left + Math.random() * rect.width,
            rect.bottom
          );
        }, i * 100);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    const interactives = document.querySelectorAll(
      "a, button, input, textarea"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", () => handleEnter(el));
      el.addEventListener("mouseleave", handleLeave);
    });

    const formInputs = document.querySelectorAll(".form-input");
    formInputs.forEach((input) => {
      input.addEventListener("focus", handleFocus as EventListener);
    });

    document.body.classList.add("diag-cursor-page");

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", () => handleEnter(el));
        el.removeEventListener("mouseleave", handleLeave);
      });
      formInputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus as EventListener);
      });
      document.body.classList.remove("diag-cursor-page");
      document.body.classList.remove("input-focused");
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div
        ref={outlineRef}
        className="cursor-dot-outline hidden md:block"
        style={{
          background:
            "radial-gradient(circle, rgba(178, 255, 181, 0.1) 0%, rgba(255, 255, 255, 0) 70%)",
        }}
      />
      <div ref={particlesRef} className="cursor-particles" />
    </>
  );
}
