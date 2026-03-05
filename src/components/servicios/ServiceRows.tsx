const services = [
  {
    number: "01",
    title: "IA Aplicada",
    description:
      "Implementamos modelos de lenguaje de última generación adaptados a la realidad operativa de tu negocio, transformando datos no estructurados en activos estratégicos.",
    tagLabel: "Module",
    tags: [
      "Fine-tuning LLMs",
      "Análisis Predictivo",
      "Generación de Contenidos",
      "NLP Processing",
    ],
    delay: "100ms",
  },
  {
    number: "02",
    title: "Integraciones & Arquitectura",
    description:
      "Construimos puentes inteligentes entre tus herramientas actuales (CRM, ERP, Bases de Datos) creando un ecosistema fluido donde la información viaja sin fricción.",
    tagLabel: "System",
    tags: [
      "Desarrollo de APIs",
      "Middleware Inteligente",
      "Data Warehousing",
      "Seguridad de Datos",
    ],
    delay: "200ms",
  },
  {
    number: "03",
    title: "Performance & Automatización",
    description:
      "Diseñamos flujos de trabajo autónomos que eliminan la redundancia operativa, liberando a tu equipo humano para enfocarse en tareas de alto valor cognitivo.",
    tagLabel: "Core",
    tags: [
      "RPA Automation",
      "Optimización Workflows",
      "Dashboards Real-time",
      "Auditoría Procesos",
    ],
    delay: "300ms",
  },
  {
    number: "04",
    title: "Consultoría Estratégica",
    description:
      "Acompañamos a la dirección en la toma de decisiones tecnológicas, definiendo una hoja de ruta clara para la adopción de inteligencia artificial a escala corporativa.",
    tagLabel: "Strategy",
    tags: [
      "Roadmap Digital",
      "Gestión del Cambio",
      "Capacitación Ejecutiva",
      "Evaluación ROI",
    ],
    delay: "400ms",
  },
  {
    number: "05",
    title: "AT Assistant",
    description:
      "Nuestro producto insignia: un asistente virtual corporativo entrenado exclusivamente con tu conocimiento empresarial para dar soporte 24/7 a clientes y empleados.",
    tagLabel: "AI Agent",
    tags: [
      "Chatbots Conversacionales",
      "Knowledge Base",
      "Soporte Multicanal",
      "Sentiment Analysis",
    ],
    delay: "500ms",
    isLast: true,
  },
];

export default function ServiceRows() {
  return (
    <main className="w-full bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {services.map((service, i) => (
          <div
            key={i}
            className={`service-row-interactive animate-entrance-up group ${
              service.isLast ? "border-b-0" : ""
            }`}
            style={{ animationDelay: service.delay }}
          >
            {/* Scan overlay */}
            <div className="scan-overlay">
              <div className="scan-line-svc" />
            </div>

            {/* Data bars (desktop only) */}
            <div className="data-viz-absolute hidden md:flex">
              <div className="data-bar" />
              <div className="data-bar" />
              <div className="data-bar" />
              <div className="data-bar" />
            </div>

            {/* Number */}
            <div className="flex flex-col items-center md:items-start pt-2 relative z-10">
              <span className="outline-number-interactive">
                {service.number}
              </span>
            </div>

            {/* Content */}
            <div className="relative z-10 w-full">
              <h2 className="service-title-interactive">{service.title}</h2>
              <p className="service-description-interactive">
                {service.description}
                <span className="blinking-cursor" />
              </p>

              <div className="intelligence-blocks-container">
                {service.tags.map((tag, j) => (
                  <div
                    key={j}
                    className="intelligence-block group-hover:text-primary"
                  >
                    <span className="text-xs font-mono uppercase tracking-wider block mb-1 opacity-50">
                      {service.tagLabel}
                    </span>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
