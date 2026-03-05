"use client";

import { useEffect, useRef, useCallback } from "react";

export default function RadarVisualization() {
  const planeRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const checkScannerContact = useCallback(() => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    const computedStyle = window.getComputedStyle(scanner);
    const matrix = new DOMMatrix(computedStyle.transform);
    let angle = Math.round(
      Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)
    );
    if (angle < 0) angle += 360;

    const blips = scanner.parentElement?.querySelectorAll(".radar-blip");
    blips?.forEach((blip) => {
      const blipAngle = parseInt(blip.getAttribute("data-angle") || "0");
      let diff = angle - blipAngle;
      if (diff < 0) diff += 360;
      if (diff >= 0 && diff < 20) {
        blip.classList.add("scanned");
        setTimeout(() => blip.classList.remove("scanned"), 500);
      }
    });

    requestAnimationFrame(checkScannerContact);
  }, []);

  useEffect(() => {
    const plane = planeRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!plane) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;
      const tiltX = -normY * 15;
      const tiltY = normX * 15;
      plane.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animId = requestAnimationFrame(checkScannerContact);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [checkScannerContact]);

  return (
    <div className="flex justify-center relative">
      <div className="radar-stage">
        <div className="radar-plane" ref={planeRef}>
          <div className="radar-grid" />
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="radar-ring" />
          <div className="radar-ring">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-neon-1 rounded-full animate-pulse shadow-[0_0_10px_#B2FFB5]" />
          </div>
          <div
            className="radar-scanner-arm"
            ref={scannerRef}
          />
          <div
            className="radar-blip"
            data-angle="320"
            style={{ top: "30%", left: "40%" }}
          />
          <div
            className="radar-blip"
            data-angle="210"
            style={{ top: "70%", left: "25%" }}
          />
          <div
            className="radar-blip"
            data-angle="130"
            style={{ top: "60%", left: "75%" }}
          />
          <div
            className="radar-blip"
            data-angle="45"
            style={{ top: "20%", left: "65%" }}
          />
          <div
            className="radar-particle"
            style={{ top: "15%", left: "80%", animationDelay: "0s" }}
          />
          <div
            className="radar-particle"
            style={{ top: "85%", left: "15%", animationDelay: "2s" }}
          />
          <div
            className="radar-particle"
            style={{ top: "45%", left: "90%", animationDelay: "4s" }}
          />
        </div>
      </div>
    </div>
  );
}
