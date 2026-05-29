/**
 * Contenido de la landing de Varylo (/varylo).
 *
 * Basado en el sitio real https://varylo.app + el brief de Pedro.
 * Todo el copy y los planes viven acá para editarlos sin tocar componentes.
 *
 * PENDIENTE (datos de Pedro):
 *  - URL exacta de Cal.com (event-type de demo de 20 min) -> CALCOM_DEMO_URL
 *  - Confirmar precios finales y si aplica setup fee (el sitio real no cobra
 *    setup; el brief mencionaba setup + mensualidad). Hoy se usan los precios
 *    públicos de varylo.app como base.
 */

/** CTA "Agendar demo" — reemplazar con el event-type real de 20 min. */
export const CALCOM_DEMO_URL =
  process.env.NEXT_PUBLIC_VARYLO_DEMO_URL || "https://cal.com/altotrafico/varylo-demo";

export interface MensajeChat {
  de: "cliente" | "bot";
  texto: string;
  hora: string;
}

export interface Problema {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface Paso {
  numero: string;
  titulo: string;
  descripcion: string;
}

export interface Feature {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface Negocio {
  tipo: string;
  uso: string;
}

export interface Plan {
  nombre: string;
  precio: string;
  periodo: string;
  setup: string;
  destacado?: boolean;
  descripcion: string;
  incluye: string[];
  cta: string;
}

export interface Testimonio {
  nombre: string;
  cargo: string;
  texto: string;
}

export interface FaqItem {
  pregunta: string;
  respuesta: string;
}

export const VARYLO = {
  hero: {
    eyebrow: "Varylo · Agente de IA para mensajería",
    titulo: "El agente de IA que atiende a tus clientes en WhatsApp 24/7",
    subtitulo:
      "El 79% de los clientes abandonan si no reciben respuesta en menos de 5 minutos. Varylo centraliza WhatsApp, Instagram y WebChat en una sola bandeja con IA que responde, califica y vende por ti — todo el día.",
    ctaPrimario: "Agendar demo (20 min)",
    ctaSecundario: "Ver planes",
    canales: ["WhatsApp", "Instagram", "Messenger", "WebChat"],
  },

  chatMockup: {
    titulo: "Atención al cliente",
    mensajes: [
      { de: "cliente", texto: "Hola, ¿tienen disponible el plan anual?", hora: "9:41" },
      {
        de: "bot",
        texto: "¡Hola! 👋 Sí, el plan anual tiene 2 meses gratis. ¿Te comparto los detalles?",
        hora: "9:41",
      },
      { de: "cliente", texto: "Sí, por favor", hora: "9:41" },
      {
        de: "bot",
        texto:
          "Genial. Son $450/año (ahorras $90). Te puedo activar la cuenta ahora mismo o agendar una demo. ¿Qué prefieres?",
        hora: "9:42",
      },
    ] as MensajeChat[],
  },

  problemas: {
    titulo: "Lo que te está costando ventas hoy",
    items: [
      {
        icono: "schedule",
        titulo: "No atiendes 24/7",
        descripcion:
          "Tus clientes escriben fuera de horario, de noche y fines de semana. Si no respondes en minutos, compran en otro lado.",
      },
      {
        icono: "filter_alt",
        titulo: "No calificas los leads",
        descripcion:
          "Tu equipo se ahoga respondiendo a curiosos mientras los leads con intención real de compra esperan.",
      },
      {
        icono: "repeat",
        titulo: "Respondes lo mismo 100 veces",
        descripcion:
          "Precios, horarios, disponibilidad… tu equipo gasta el día en preguntas repetidas en vez de cerrar ventas.",
      },
    ] as Problema[],
  },

  comoFunciona: {
    titulo: "Cómo funciona",
    subtitulo: "En marcha en menos de una hora, sin tocar código.",
    pasos: [
      {
        numero: "01",
        titulo: "Conectamos tus canales",
        descripcion:
          "WhatsApp, Instagram y WebChat en una sola bandeja. La conexión a la API de Meta toma menos de 10 minutos.",
      },
      {
        numero: "02",
        titulo: "Entrenamos tu agente",
        descripcion:
          "Cargamos la info de tu negocio (productos, precios, FAQ) y el agente aprende a responder como tu mejor vendedor.",
      },
      {
        numero: "03",
        titulo: "Atiende y escala lo importante",
        descripcion:
          "La IA resuelve la mayoría de consultas sola y transfiere a un humano solo lo que lo necesita. Nadie queda sin respuesta.",
      },
    ] as Paso[],
  },

  features: {
    titulo: "Todo lo que necesitas para vender por mensajería",
    items: [
      {
        icono: "inbox",
        titulo: "Bandeja unificada",
        descripcion: "WhatsApp, Instagram y WebChat en un solo lugar. Se acabó saltar entre apps.",
      },
      {
        icono: "smart_toy",
        titulo: "Agentes de IA 24/7",
        descripcion: "Responden, califican y venden automáticamente, día y noche.",
      },
      {
        icono: "account_tree",
        titulo: "Chatbots con flujos",
        descripcion: "Menús y flujos inteligentes sin código para guiar a cada cliente.",
      },
      {
        icono: "groups",
        titulo: "Gestión de equipos",
        descripcion: "Asignación automática de conversaciones y control de tiempos de respuesta.",
      },
      {
        icono: "monitoring",
        titulo: "Analíticas y SLA",
        descripcion: "Métricas de conversaciones, desempeño por agente y cumplimiento de SLA.",
      },
      {
        icono: "verified",
        titulo: "ValerIA",
        descripcion: "Análisis de calidad con IA: tono, claridad y sentimiento de cada conversación.",
      },
    ] as Feature[],
  },

  negocios: {
    titulo: "Para quién funciona",
    subtitulo: "Si vendes o atiendes por mensajería, Varylo es para ti.",
    items: [
      { tipo: "E-commerce", uso: "Responde dudas de productos y recupera carritos al instante." },
      { tipo: "Inmobiliarias", uso: "Califica interesados y agenda visitas sin perder un lead." },
      { tipo: "Clínicas y salud", uso: "Agenda citas y resuelve dudas frecuentes 24/7." },
      { tipo: "Delivery y restaurantes", uso: "Toma pedidos y responde en picos de demanda." },
      { tipo: "Educación", uso: "Atiende aspirantes y guía el proceso de inscripción." },
      { tipo: "Servicios y agencias", uso: "Califica solicitudes y agenda reuniones automáticamente." },
    ] as Negocio[],
  },

  planes: {
    titulo: "Un plan, todo incluido",
    subtitulo: "Sin permanencia ni costos de setup. Cancela cuando quieras.",
    items: [
      {
        nombre: "Plan Pro",
        precio: "$45",
        periodo: "/mes",
        setup: "Sin costo de setup",
        destacado: true,
        descripcion: "Todo lo que necesitas para vender por mensajería.",
        incluye: [
          "Canales WhatsApp + Instagram + WebChat",
          "Agentes ilimitados",
          "Agentes de IA ilimitados",
          "Chatbots ilimitados",
          "Bandeja unificada",
          "Métricas avanzadas + SLA",
          "ValerIA (análisis de calidad)",
          "Soporte prioritario",
        ],
        cta: "Agendar demo",
      },
    ] as Plan[],
  },

  testimonios: {
    titulo: "Más de 1.200 empresas ya venden con Varylo",
    items: [
      {
        nombre: "María González",
        cargo: "CEO, TechStore",
        texto: "Bajamos el tiempo de respuesta a minutos y los clientes lo notan. Vendemos más con el mismo equipo.",
      },
      {
        nombre: "Carlos Ramírez",
        cargo: "Director de Operaciones, FastDelivery",
        texto: "El agente de IA resuelve el 60% de las consultas sin intervención humana.",
      },
      {
        nombre: "Laura Martínez",
        cargo: "Fundadora, BeautyBox",
        texto: "Los chatbots con IA nos evitaron contratar 2 personas más. El ROI fue inmediato.",
      },
    ] as Testimonio[],
  },

  faq: {
    titulo: "Preguntas frecuentes",
    items: [
      {
        pregunta: "¿Funciona con mi número de WhatsApp actual?",
        respuesta:
          "Varylo se conecta a la API Cloud de Meta. Te guiamos paso a paso en la configuración; toma menos de 10 minutos.",
      },
      {
        pregunta: "¿Cuánto tarda el setup?",
        respuesta:
          "Menos de 10 minutos para conectar WhatsApp. Puedes tener tu primer chatbot funcionando en menos de una hora.",
      },
      {
        pregunta: "¿Qué pasa si la IA no sabe responder?",
        respuesta:
          "Se transfiere automáticamente a un agente humano de tu equipo. El cliente nunca queda sin atención.",
      },
      {
        pregunta: "¿La IA lee todos mis mensajes?",
        respuesta:
          "Solo cuando activas las funciones de análisis. Tus datos están encriptados y nunca se comparten con terceros.",
      },
      {
        pregunta: "¿Puedo cambiar de plan después?",
        respuesta:
          "Sí, puedes subir o bajar de plan en cualquier momento desde tu panel, sin penalizaciones.",
      },
      {
        pregunta: "¿Cómo se cobra?",
        respuesta:
          "Suscripción mensual sin permanencia. Cancelas cuando quieras. Los planes Starter y Pro no tienen costo de setup.",
      },
    ] as FaqItem[],
  },

  ctaFinal: {
    titulo: "¿Listo para que la IA atienda a tus clientes?",
    subtitulo: "Agenda una demo de 20 minutos y mira a Varylo respondiendo en tus canales.",
    ctaPrimario: "Agendar demo (20 min)",
    ctaSecundario: "Ver planes",
  },
};
