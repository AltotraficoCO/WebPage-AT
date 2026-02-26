export default function ShowcaseSection() {
  return (
    <section className="py-0 bg-background-light overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 pt-24 text-center z-10 relative">
        <h2 className="text-3xl font-medium text-text-light mb-2">
          Lo que suele frenar el crecimiento
        </h2>
        <p className="text-gray-500 font-normal">
          Identificamos y neutralizamos los cuellos de botella digitales.
        </p>
      </div>

      <div className="showcase-stage">
        <div className="showcase-bg-lines" />
        <div className="orbit-circle w-[300px] h-[300px] md:w-[600px] md:h-[600px] animate-spin-slow" />
        <div
          className="orbit-circle w-[200px] h-[200px] md:w-[400px] md:h-[400px] border-dashed opacity-30"
          style={{ animationDirection: "reverse" }}
        />

        <div className="relative w-full max-w-3xl h-64 flex items-center justify-center">
          {/* Item 1 */}
          <div className="cycle-item-1 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white neon-glow-box flex items-center justify-center mb-4 md:mb-8 border border-gray-100">
              <span
                className="material-symbols-outlined text-4xl neon-highlight"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                timer_off
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-medium text-gray-900 mb-3 md:mb-4 tracking-tight">
              Procesos <span className="neon-highlight">Manuales</span>
            </h3>
            <p className="text-gray-500 max-w-md text-center text-sm md:text-lg font-normal px-4">
              Equipos talentosos perdiendo horas en tareas repetitivas que no
              generan valor estratégico.
            </p>
          </div>

          {/* Item 2 */}
          <div className="cycle-item-2 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white neon-glow-box flex items-center justify-center mb-4 md:mb-8 border border-gray-100">
              <span
                className="material-symbols-outlined text-4xl neon-highlight"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                cloud_off
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-medium text-gray-900 mb-3 md:mb-4 tracking-tight">
              Datos <span className="neon-highlight">Dispersos</span>
            </h3>
            <p className="text-gray-500 max-w-md text-center text-sm md:text-lg font-normal px-4">
              Información vital fragmentada en múltiples herramientas sin fuente
              única de verdad.
            </p>
          </div>

          {/* Item 3 */}
          <div className="cycle-item-3 absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-white neon-glow-box flex items-center justify-center mb-4 md:mb-8 border border-gray-100">
              <span
                className="material-symbols-outlined text-4xl neon-highlight"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                extension_off
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-medium text-gray-900 mb-3 md:mb-4 tracking-tight">
              Falta de <span className="neon-highlight">Adopción</span>
            </h3>
            <p className="text-gray-500 max-w-md text-center text-sm md:text-lg font-normal px-4">
              Herramientas potentes que el equipo no utiliza por complejidad o
              falta de capacitación.
            </p>
          </div>
        </div>

        <div className="absolute bottom-12 flex space-x-3">
          <div className="h-1 bg-gray-200 w-12 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-1 to-neon-2 animate-[pulse_12s_infinite]" />
          </div>
          <div className="h-1 bg-gray-200 w-12 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-2 to-neon-3 animate-[pulse_12s_4s_infinite] opacity-0" />
          </div>
          <div className="h-1 bg-gray-200 w-12 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-neon-3 to-neon-4 animate-[pulse_12s_8s_infinite] opacity-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
