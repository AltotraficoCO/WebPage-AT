/**
 * Configuración modular de la Calculadora de Leads Perdidos.
 *
 * Cada industria es una variante de la MISMA calculadora: cambia el copy, las
 * preguntas, los rangos y el caso de éxito, pero la estructura técnica y la
 * fórmula (ver src/lib/calculadora.ts) son comunes.
 *
 * Para agregar o ajustar una variante: edita SOLO este archivo. No hace falta
 * tocar el componente de flujo ni la lógica de cálculo.
 *
 * Rutas resultantes:
 *   /calculadora                 -> "universal"
 *   /calculadora/constructoras   -> "constructoras"
 *   /calculadora/servicios-b2b   -> "servicios-b2b"
 *   /calculadora/manufactura     -> "manufactura"
 *   /calculadora/tecnologia      -> "tecnologia"
 *   /calculadora/educacion       -> "educacion"
 *
 * NOTA: el copy de las 6 variantes es provisional (basado en el brief corto).
 * Reemplazar con el "Copy completo de las 6 variantes" cuando llegue.
 */

export type TipoInput = "slider" | "opciones";
export type FormatoValor = "numero" | "porcentaje" | "moneda";

export interface OpcionPregunta {
  label: string;
  /** Factor numérico usado en la fórmula (0..1 para retención de conversión). */
  value: number;
}

export interface Pregunta {
  /** Clave en el objeto de respuestas. */
  id: "leadsMes" | "tasaContacto" | "tiempoRespuesta" | "ticket" | "tasaCierre";
  titulo: string;
  ayuda?: string;
  tipo: TipoInput;
  formato: FormatoValor;
  /** Para sliders. */
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number;
  prefijo?: string;
  sufijo?: string;
  /** Para tipo "opciones" (radio buttons grandes). */
  opciones?: OpcionPregunta[];
}

export interface ResultCard {
  titulo: string;
  descripcion: string;
  /** Componente de la pérdida que representa esta card. */
  fuente: "noRespondidos" | "respuestaLenta" | "sinSeguimiento";
}

export interface CasoExito {
  titulo: string;
  resumen: string;
  url: string;
}

export interface FormulaConfig {
  /** Código ISO de moneda (ej: "COP"). */
  moneda: string;
  /** Locale para formateo (ej: "es-CO"). */
  locale: string;
  /**
   * Fracción de los leads contactados a tiempo pero NO cerrados que serían
   * recuperables con seguimiento/nurturing automático. 0..1
   */
  factorSinSeguimiento: number;
  /**
   * Fracción de la pérdida total que se podría recuperar implementando
   * automatización (respuesta inmediata + nurturing). 0..1
   */
  recuperableConAutomatizacion: number;
}

export interface IndustriaConfig {
  slug: string;
  nombre: string;
  meta: { title: string; description: string };
  hero: {
    eyebrow: string;
    titulo: string;
    subtitulo: string;
    cta: string;
  };
  /** Exactamente 5 preguntas. */
  preguntas: Pregunta[];
  formula: FormulaConfig;
  resultado: {
    titulo: string;
    subtitulo: string;
    /** Exactamente 3 cards. */
    cards: ResultCard[];
    proyeccion: { titulo: string; descripcion: string };
  };
  captura: {
    titulo: string;
    subtitulo: string;
    boton: string;
  };
  confirmacion: {
    titulo: string;
    descripcion: string;
    caso: CasoExito;
  };
}

/* ------------------------------------------------------------------ */
/*  Plantilla base de preguntas — se sobreescribe por industria       */
/* ------------------------------------------------------------------ */

const OPCIONES_TIEMPO: OpcionPregunta[] = [
  { label: "Menos de 5 minutos", value: 1.0 },
  { label: "Menos de 1 hora", value: 0.8 },
  { label: "El mismo día", value: 0.55 },
  { label: "1 día o más", value: 0.3 },
];

interface OverridePreguntas {
  leadsMes?: Partial<Pregunta>;
  tasaContacto?: Partial<Pregunta>;
  tiempoRespuesta?: Partial<Pregunta>;
  ticket?: Partial<Pregunta>;
  tasaCierre?: Partial<Pregunta>;
}

function crearPreguntas(ov: OverridePreguntas = {}): Pregunta[] {
  return [
    {
      id: "leadsMes",
      titulo: "¿Cuántos prospectos o consultas nuevas recibes al mes?",
      ayuda: "Cuenta todo: formularios, WhatsApp, llamadas, referidos.",
      tipo: "slider",
      formato: "numero",
      min: 10,
      max: 2000,
      step: 10,
      defaultValue: 150,
      sufijo: " / mes",
      ...ov.leadsMes,
    },
    {
      id: "tasaContacto",
      titulo: "¿A qué porcentaje de esos prospectos logras responder?",
      ayuda: "Sé honesto: los que se quedan sin respuesta cuentan.",
      tipo: "slider",
      formato: "porcentaje",
      min: 10,
      max: 100,
      step: 5,
      defaultValue: 70,
      sufijo: "%",
      ...ov.tasaContacto,
    },
    {
      id: "tiempoRespuesta",
      titulo: "¿Cuánto tarda tu equipo en dar la primera respuesta?",
      ayuda: "La velocidad de respuesta define la conversión.",
      tipo: "opciones",
      formato: "numero",
      defaultValue: 0.55,
      opciones: OPCIONES_TIEMPO,
      ...ov.tiempoRespuesta,
    },
    {
      id: "ticket",
      titulo: "¿Cuánto vale en promedio un cliente nuevo?",
      ayuda: "Valor del primer contrato o venta promedio.",
      tipo: "slider",
      formato: "moneda",
      min: 500_000,
      max: 50_000_000,
      step: 500_000,
      defaultValue: 3_000_000,
      prefijo: "$",
      ...ov.ticket,
    },
    {
      id: "tasaCierre",
      titulo: "De cada 100 prospectos bien atendidos, ¿cuántos se vuelven clientes?",
      ayuda: "Tu tasa de cierre cuando sí alcanzas a atenderlos bien.",
      tipo: "slider",
      formato: "porcentaje",
      min: 1,
      max: 80,
      step: 1,
      defaultValue: 20,
      sufijo: "%",
      ...ov.tasaCierre,
    },
  ];
}

const FORMULA_BASE: FormulaConfig = {
  moneda: "COP",
  locale: "es-CO",
  factorSinSeguimiento: 0.15,
  recuperableConAutomatizacion: 0.65,
};

/* ------------------------------------------------------------------ */
/*  Configuración por industria                                       */
/* ------------------------------------------------------------------ */

export const INDUSTRIAS: Record<string, IndustriaConfig> = {
  universal: {
    slug: "universal",
    nombre: "Universal B2B",
    meta: {
      title: "Calculadora de Leads Perdidos | Altotrafico",
      description:
        "Descubre en 2 minutos cuánto dinero pierde tu empresa al mes por leads sin responder. Cálculo gratis y reporte detallado por correo.",
    },
    hero: {
      eyebrow: "Calculadora gratuita · 2 minutos",
      titulo: "¿Cuánto dinero pierde tu empresa cada mes en leads que nunca cerraste?",
      subtitulo:
        "Responde 5 preguntas y te mostramos, en pesos, lo que se está fugando por leads sin responder, respuestas lentas y falta de seguimiento.",
      cta: "Empezar diagnóstico",
    },
    preguntas: crearPreguntas(),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es lo que tu empresa está dejando sobre la mesa cada mes",
      subtitulo: "Una estimación conservadora basada en tus propios números.",
      cards: [
        {
          titulo: "Leads que nunca respondes",
          descripcion:
            "Prospectos que levantaron la mano y se quedaron sin respuesta. Es la fuga más grande y la más fácil de tapar.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Respuestas que llegan tarde",
          descripcion:
            "Responder en minutos en vez de horas multiplica el cierre. Cada hora de demora enfría al prospecto.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Oportunidades sin seguimiento",
          descripcion:
            "Interesados que no compraron a la primera y nadie volvió a contactar. Con nurturing se recuperan.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con automatización podrías recuperar",
        descripcion:
          "Respondiendo en segundos las 24 horas y con seguimiento automático, este es el dinero recuperable de forma realista.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado a tu correo",
      subtitulo:
        "Recibe el desglose completo, cómo se calculó y un plan concreto para recuperar esa pérdida.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte detallado. Mientras llega, mira cómo una empresa como la tuya recuperó su pérdida.",
      caso: {
        titulo: "Caso de éxito",
        resumen: "Cómo recuperaron ventas tapando la fuga de leads.",
        url: "/blog",
      },
    },
  },

  constructoras: {
    slug: "constructoras",
    nombre: "Constructoras y Real Estate",
    meta: {
      title: "Calculadora de Leads Perdidos para Constructoras | Altotrafico",
      description:
        "Cada interesado en un proyecto vale millones. Calcula cuánto pierde tu constructora al mes por leads sin responder a tiempo.",
    },
    hero: {
      eyebrow: "Constructoras · Real Estate",
      titulo: "Cada interesado que no respondes a tiempo es un apartamento que vende tu competencia",
      subtitulo:
        "Responde 5 preguntas y calcula cuánto dinero deja de entrar a tu sala de ventas por leads mal atendidos.",
      cta: "Calcular mi pérdida",
    },
    preguntas: crearPreguntas({
      leadsMes: {
        titulo: "¿Cuántos interesados nuevos recibe tu sala de ventas al mes?",
        min: 5,
        max: 500,
        step: 5,
        defaultValue: 40,
      },
      ticket: {
        titulo: "¿Cuál es el valor promedio de una unidad vendida?",
        min: 50_000_000,
        max: 1_500_000_000,
        step: 10_000_000,
        defaultValue: 250_000_000,
      },
      tasaCierre: {
        titulo: "De cada 100 interesados bien atendidos, ¿cuántos compran?",
        defaultValue: 8,
        max: 50,
      },
    }),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es lo que tu sala de ventas pierde cada mes",
      subtitulo: "Con tickets de cientos de millones, cada lead mal atendido pesa.",
      cards: [
        {
          titulo: "Interesados sin respuesta",
          descripcion:
            "Personas que cotizaron un proyecto y nadie volvió a llamar. Se van con la primera constructora que sí contesta.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Respuestas lentas",
          descripcion:
            "En real estate la decisión es rápida y emocional. Responder al día siguiente es perder la venta.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Sin seguimiento de la base",
          descripcion:
            "Interesados que no compraron en el momento pero comprarían con seguimiento constante.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con un agente que atiende 24/7 podrías recuperar",
        descripcion:
          "Atención inmediata a cada interesado y seguimiento automático de toda la base de prospectos.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado de tu sala de ventas",
      subtitulo:
        "Desglose completo y un plan para no volver a perder un interesado por respuesta lenta.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte. Mira cómo una constructora recuperó ventas atendiendo cada lead al instante.",
      caso: {
        titulo: "Caso de éxito en real estate",
        resumen: "Constructora que dejó de perder interesados por respuesta lenta.",
        url: "/blog",
      },
    },
  },

  "servicios-b2b": {
    slug: "servicios-b2b",
    nombre: "Servicios Profesionales B2B",
    meta: {
      title: "Calculadora de Leads Perdidos para Servicios B2B | Altotrafico",
      description:
        "Agencias, consultoras y firmas: calcula cuánto facturación pierdes al mes por propuestas que nunca seguiste.",
    },
    hero: {
      eyebrow: "Servicios profesionales · Consultoras · Agencias",
      titulo: "¿Cuántos contratos se te escapan por no responder a tiempo una solicitud?",
      subtitulo:
        "Responde 5 preguntas y descubre cuánta facturación recurrente pierde tu firma al mes.",
      cta: "Calcular mi pérdida",
    },
    preguntas: crearPreguntas({
      leadsMes: {
        titulo: "¿Cuántas solicitudes o consultas nuevas recibes al mes?",
        min: 10,
        max: 500,
        step: 5,
        defaultValue: 80,
      },
      ticket: {
        titulo: "¿Cuánto vale en promedio un contrato nuevo?",
        min: 1_000_000,
        max: 100_000_000,
        step: 1_000_000,
        defaultValue: 8_000_000,
      },
      tasaCierre: {
        titulo: "De cada 100 prospectos bien atendidos, ¿cuántos contratan?",
        defaultValue: 25,
      },
    }),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es lo que tu firma deja de facturar cada mes",
      subtitulo: "Estimación conservadora con tus propios números.",
      cards: [
        {
          titulo: "Solicitudes sin responder",
          descripcion:
            "Empresas que pidieron una propuesta y nunca recibieron respuesta. Contratan a quien sí responde.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Propuestas que llegan tarde",
          descripcion:
            "En B2B la primera firma en responder con seriedad gana una ventaja enorme.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Pipeline sin seguimiento",
          descripcion:
            "Prospectos que dijeron 'después' y nadie volvió a tocar. Con seguimiento se cierran.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con automatización de respuesta y seguimiento podrías recuperar",
        descripcion:
          "Atención inmediata de cada solicitud y seguimiento sistemático de todo el pipeline.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado de tu firma",
      subtitulo: "Desglose completo y un plan para cerrar más con el mismo flujo de leads.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte. Mira cómo una firma de servicios aumentó cierres respondiendo al instante.",
      caso: {
        titulo: "Caso de éxito en servicios B2B",
        resumen: "Consultora que recuperó facturación con seguimiento automático.",
        url: "/blog",
      },
    },
  },

  manufactura: {
    slug: "manufactura",
    nombre: "Manufactura B2B",
    meta: {
      title: "Calculadora de Leads Perdidos para Manufactura | Altotrafico",
      description:
        "Cotizaciones sin responder son contratos perdidos. Calcula cuánto pierde tu empresa manufacturera al mes.",
    },
    hero: {
      eyebrow: "Manufactura B2B · Industria",
      titulo: "¿Cuántas cotizaciones se quedan sin responder mientras tu competencia sí contesta?",
      subtitulo:
        "Responde 5 preguntas y calcula cuánta venta industrial pierdes al mes por leads mal atendidos.",
      cta: "Calcular mi pérdida",
    },
    preguntas: crearPreguntas({
      leadsMes: {
        titulo: "¿Cuántas solicitudes de cotización recibes al mes?",
        min: 5,
        max: 400,
        step: 5,
        defaultValue: 60,
      },
      ticket: {
        titulo: "¿Cuál es el valor promedio de un pedido nuevo?",
        min: 5_000_000,
        max: 800_000_000,
        step: 5_000_000,
        defaultValue: 50_000_000,
      },
      tasaCierre: {
        titulo: "De cada 100 cotizaciones bien atendidas, ¿cuántas se vuelven pedido?",
        defaultValue: 18,
        max: 60,
      },
    }),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es lo que tu planta deja de vender cada mes",
      subtitulo: "Con pedidos de alto valor, cada cotización perdida cuesta caro.",
      cards: [
        {
          titulo: "Cotizaciones sin responder",
          descripcion:
            "Solicitudes que se quedan en una bandeja de entrada mientras el cliente compra a otro proveedor.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Cotizaciones lentas",
          descripcion:
            "Demorar días en cotizar manda la señal equivocada y abre la puerta a la competencia.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Clientes sin recompra",
          descripcion:
            "Compradores que no recibieron seguimiento para el siguiente pedido.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con respuesta inmediata a cada cotización podrías recuperar",
        descripcion:
          "Atención 24/7 a solicitudes y seguimiento automático de clientes para recompra.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado de tu operación",
      subtitulo: "Desglose completo y un plan para no perder un pedido por respuesta lenta.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte. Mira cómo una empresa industrial recuperó pedidos respondiendo al instante.",
      caso: {
        titulo: "Caso de éxito en manufactura",
        resumen: "Fabricante que dejó de perder cotizaciones por lentitud.",
        url: "/blog",
      },
    },
  },

  tecnologia: {
    slug: "tecnologia",
    nombre: "SaaS y Software B2B",
    meta: {
      title: "Calculadora de Leads Perdidos para SaaS y Software B2B | Altotrafico",
      description:
        "Cada trial o demo sin seguimiento es MRR que no entra. Calcula cuánto pierde tu SaaS al mes por leads mal atendidos.",
    },
    hero: {
      eyebrow: "SaaS · Software B2B",
      titulo: "¿Cuánto MRR pierdes al mes por demos y trials que nunca siguieron?",
      subtitulo:
        "Responde 5 preguntas y calcula la facturación recurrente que se fuga por leads sin atender.",
      cta: "Calcular mi pérdida",
    },
    preguntas: crearPreguntas({
      leadsMes: {
        titulo: "¿Cuántos signups, trials o demos solicitan al mes?",
        min: 20,
        max: 3000,
        step: 10,
        defaultValue: 300,
      },
      ticket: {
        titulo: "¿Cuál es el valor anual promedio de un cliente (ACV)?",
        min: 1_000_000,
        max: 300_000_000,
        step: 1_000_000,
        defaultValue: 18_000_000,
      },
      tasaCierre: {
        titulo: "De cada 100 leads bien atendidos, ¿cuántos se vuelven clientes pagos?",
        defaultValue: 15,
        max: 60,
      },
    }),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es el MRR que tu SaaS deja de capturar cada mes",
      subtitulo: "Estimación conservadora basada en tu propio funnel.",
      cards: [
        {
          titulo: "Trials y demos sin responder",
          descripcion:
            "Usuarios que mostraron intención y nadie activó. El momento de mayor intención se enfría en minutos.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Respuestas lentas en el momento de intención",
          descripcion:
            "Responder un 'request a demo' al día siguiente mata la conversión.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Onboarding y seguimiento sin automatizar",
          descripcion:
            "Trials que no convirtieron por falta de acompañamiento. Con nurturing activan.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con activación y seguimiento automático podrías recuperar",
        descripcion:
          "Respuesta inmediata a cada señal de intención y nurturing automatizado del trial.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado de tu funnel",
      subtitulo: "Desglose completo y un plan para convertir más del mismo tráfico.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte. Mira cómo un SaaS aumentó conversión activando cada lead al instante.",
      caso: {
        titulo: "Caso de éxito en SaaS",
        resumen: "Software B2B que recuperó MRR con activación automática.",
        url: "/blog",
      },
    },
  },

  educacion: {
    slug: "educacion",
    nombre: "Educación Premium",
    meta: {
      title: "Calculadora de Leads Perdidos para Educación | Altotrafico",
      description:
        "Cada aspirante sin seguimiento es una matrícula perdida. Calcula cuánto pierde tu institución al mes.",
    },
    hero: {
      eyebrow: "Educación premium · Instituciones",
      titulo: "¿Cuántas matrículas pierdes al mes por aspirantes que nunca recibieron seguimiento?",
      subtitulo:
        "Responde 5 preguntas y calcula los ingresos que se fugan por interesados mal atendidos.",
      cta: "Calcular mi pérdida",
    },
    preguntas: crearPreguntas({
      leadsMes: {
        titulo: "¿Cuántos aspirantes o interesados nuevos recibes al mes?",
        min: 20,
        max: 1500,
        step: 10,
        defaultValue: 200,
      },
      ticket: {
        titulo: "¿Cuánto vale en promedio una matrícula o programa?",
        min: 1_000_000,
        max: 80_000_000,
        step: 1_000_000,
        defaultValue: 12_000_000,
      },
      tasaCierre: {
        titulo: "De cada 100 aspirantes bien atendidos, ¿cuántos se matriculan?",
        defaultValue: 22,
      },
    }),
    formula: FORMULA_BASE,
    resultado: {
      titulo: "Esto es lo que tu institución deja de matricular cada mes",
      subtitulo: "Estimación conservadora con tus propios números de admisiones.",
      cards: [
        {
          titulo: "Aspirantes sin respuesta",
          descripcion:
            "Interesados que pidieron información y nadie los volvió a contactar. Se matriculan en otro lado.",
          fuente: "noRespondidos",
        },
        {
          titulo: "Respuestas lentas en admisiones",
          descripcion:
            "La decisión de estudiar es emocional y con ventana corta. La demora cuesta matrículas.",
          fuente: "respuestaLenta",
        },
        {
          titulo: "Aspirantes sin seguimiento",
          descripcion:
            "Interesados que no decidieron a la primera y se perdieron por falta de acompañamiento.",
          fuente: "sinSeguimiento",
        },
      ],
      proyeccion: {
        titulo: "Con atención y seguimiento automático podrías recuperar",
        descripcion:
          "Respuesta inmediata a cada aspirante y nurturing automatizado durante toda la temporada de admisiones.",
      },
    },
    captura: {
      titulo: "Te enviamos el reporte detallado de tu proceso de admisiones",
      subtitulo: "Desglose completo y un plan para aumentar matrículas con el mismo flujo.",
      boton: "Enviarme el reporte",
    },
    confirmacion: {
      titulo: "Listo — revisa tu correo",
      descripcion:
        "Te enviamos el reporte. Mira cómo una institución aumentó matrículas atendiendo cada aspirante al instante.",
      caso: {
        titulo: "Caso de éxito en educación",
        resumen: "Institución que recuperó matrículas con seguimiento automático.",
        url: "/blog",
      },
    },
  },
};

/** Slug de la variante universal (ruta /calculadora sin segmento). */
export const INDUSTRIA_UNIVERSAL = "universal";

/** Slugs de las variantes con ruta propia /calculadora/[industria]. */
export const SLUGS_VARIANTES = Object.keys(INDUSTRIAS).filter(
  (s) => s !== INDUSTRIA_UNIVERSAL
);

export function getIndustria(slug?: string): IndustriaConfig | null {
  return INDUSTRIAS[slug ?? INDUSTRIA_UNIVERSAL] ?? null;
}
