export default function ServicesSection() {
  const services = [
    {
      title: (
        <>
          IA aplicada <br /> al negocio
        </>
      ),
      description:
        "Implementación táctica de modelos de lenguaje para resolver problemas reales.",
      delay: "delay-100",
    },
    {
      title: (
        <>
          Integraciones <br /> &amp; Auto
        </>
      ),
      description:
        "Conexión de sistemas dispares mediante flujos automatizados inteligentes.",
      delay: "delay-200",
    },
    {
      title: (
        <>
          Performance <br /> &amp; Resultados
        </>
      ),
      description:
        "Métricas claras y optimización constante orientada al ROI.",
      delay: "delay-300",
    },
    {
      title: (
        <>
          Estrategia <br /> Sistémica
        </>
      ),
      description:
        "Construcción de infraestructuras digitales escala y robustas.",
      delay: "delay-400",
    },
  ];

  return (
    <section
      className="py-24 bg-white relative overflow-hidden"
      id="services"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-12">
          {services.map((service, i) => (
            <div
              key={i}
              className={`service-minimal-item group animate-entrance-up ${service.delay}`}
            >
              <div className="service-minimal-glow" />
              <div className="service-minimal-accent" />
              <div className="flex flex-col h-full justify-start relative z-10">
                <h3 className="text-3xl font-medium text-text-light mb-6 service-minimal-title tracking-tight leading-tight group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-normal group-hover:text-gray-800 transition-colors duration-500">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
