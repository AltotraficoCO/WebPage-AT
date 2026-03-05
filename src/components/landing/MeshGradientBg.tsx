"use client";

export default function MeshGradientBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-1/4 -left-1/4 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full opacity-20 blur-[120px] animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
          backgroundSize: "200% 200%",
        }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-[50vw] h-[50vw] md:w-[35vw] md:h-[35vw] rounded-full opacity-15 blur-[120px] animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          backgroundSize: "200% 200%",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] md:w-[20vw] md:h-[20vw] rounded-full opacity-10 blur-[100px] animate-gradient-shift"
        style={{
          background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
          backgroundSize: "200% 200%",
          animationDelay: "1.5s",
        }}
      />
    </div>
  );
}
