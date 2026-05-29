/**
 * Motor de cálculo de la Calculadora de Leads Perdidos.
 *
 * Toda la matemática vive acá; el copy y los rangos viven en
 * src/data/calculadora.ts. Para ajustar el modelo, edita las fórmulas de este
 * archivo o los multiplicadores en FormulaConfig.
 *
 * MODELO (estimación mensual, conservadora)
 * ------------------------------------------------------------------
 *  Entradas del usuario:
 *    L = leadsMes          prospectos nuevos por mes
 *    c = tasaContacto/100  fracción que SÍ se responde (0..1)
 *    r = tiempoRespuesta   retención de conversión por velocidad (0..1)
 *    t = ticket            valor promedio de un cliente
 *    k = tasaCierre/100    cierre cuando el lead está bien atendido (0..1)
 *
 *  Potencial total si atendieras el 100% al instante:
 *    potencial = L * k * t
 *
 *  Pérdida = potencial − capturado, descompuesta en 3 fuentes:
 *    1) noRespondidos  = L * (1 − c) * k * t
 *         Leads que nunca se responden.
 *    2) respuestaLenta = L * c * (1 − r) * k * t
 *         Leads respondidos pero tarde: pierden conversión.
 *    3) sinSeguimiento = L * c * r * (1 − k) * f * t
 *         Leads bien atendidos que no cerraron y son recuperables con
 *         nurturing. f = factorSinSeguimiento.
 *
 *  Pérdida total = noRespondidos + respuestaLenta + sinSeguimiento
 *
 *  Recuperable con automatización:
 *    recuperable = perdidaTotal * recuperableConAutomatizacion
 * ------------------------------------------------------------------
 */

import type { FormulaConfig, Pregunta } from "@/data/calculadora";

export interface RespuestasCalculadora {
  leadsMes: number;
  tasaContacto: number; // %
  tiempoRespuesta: number; // factor 0..1
  ticket: number; // moneda
  tasaCierre: number; // %
}

export interface DesglosePerdida {
  noRespondidos: number;
  respuestaLenta: number;
  sinSeguimiento: number;
}

export interface ResultadoCalculo {
  /** Pérdida mensual estimada. */
  perdidaMensual: number;
  /** Pérdida anual (mensual × 12). */
  perdidaAnual: number;
  /** Dinero recuperable con automatización. */
  recuperable: number;
  /** Desglose por fuente. */
  desglose: DesglosePerdida;
  /** Potencial total mensual de referencia. */
  potencial: number;
}

/** Respuestas iniciales a partir de los defaults de las preguntas. */
export function respuestasIniciales(preguntas: Pregunta[]): RespuestasCalculadora {
  const base: Record<string, number> = {};
  for (const p of preguntas) base[p.id] = p.defaultValue;
  return base as unknown as RespuestasCalculadora;
}

export function calcularPerdida(
  r: RespuestasCalculadora,
  formula: FormulaConfig
): ResultadoCalculo {
  const L = Math.max(0, r.leadsMes);
  const c = clamp01(r.tasaContacto / 100);
  const velocidad = clamp01(r.tiempoRespuesta);
  const t = Math.max(0, r.ticket);
  const k = clamp01(r.tasaCierre / 100);

  const potencial = L * k * t;

  const noRespondidos = L * (1 - c) * k * t;
  const respuestaLenta = L * c * (1 - velocidad) * k * t;
  const sinSeguimiento =
    L * c * velocidad * (1 - k) * formula.factorSinSeguimiento * t;

  const perdidaMensual = noRespondidos + respuestaLenta + sinSeguimiento;
  const recuperable = perdidaMensual * formula.recuperableConAutomatizacion;

  return {
    perdidaMensual: redondear(perdidaMensual),
    perdidaAnual: redondear(perdidaMensual * 12),
    recuperable: redondear(recuperable),
    desglose: {
      noRespondidos: redondear(noRespondidos),
      respuestaLenta: redondear(respuestaLenta),
      sinSeguimiento: redondear(sinSeguimiento),
    },
    potencial: redondear(potencial),
  };
}

/** Formatea un monto como moneda según el config de la industria. */
export function formatearMoneda(valor: number, formula: FormulaConfig): string {
  return new Intl.NumberFormat(formula.locale, {
    style: "currency",
    currency: formula.moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

/** Redondea a miles para no mostrar precisión falsa. */
function redondear(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n / 1000) * 1000;
}
