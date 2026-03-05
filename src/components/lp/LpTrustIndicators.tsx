const stats = [
  { value: "+120", label: "Proyectos IA", icon: "rocket_launch" },
  { value: "3 min", label: "Diagnóstico", icon: "timer" },
  { value: "100%", label: "Sin coste", icon: "verified" },
];

export default function LpTrustIndicators() {
  return (
    <section className="w-full px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 md:gap-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="lp-stat-item flex flex-col items-center text-center"
            style={{
              opacity: 0,
              animation: `entranceUp 0.7s ease-out ${0.4 + i * 0.1}s forwards`,
            }}
          >
            <span className="material-icons text-cyber-cyan mb-2 text-2xl md:text-3xl">
              {s.icon}
            </span>
            <span className="lp-stat-value lp-animated-gradient-text text-2xl font-medium md:text-3xl">
              {s.value}
            </span>
            <span className="mt-1 text-xs text-white/50 md:text-sm">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
