import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Captura de lead de la Calculadora de Leads Perdidos.
 *
 * Reenvía el lead a at-saas. Define el endpoint exacto en la variable de
 * entorno AT_SAAS_CALCULADORA_WEBHOOK; mientras no esté definida, usa el
 * webhook genérico de leads que ya está en producción.
 *
 * TODO(at-saas): confirmar URL exacta y formato de campos del POST con Pedro
 * y ajustar `payload` abajo si el contrato difiere.
 */
const FALLBACK_WEBHOOK =
  "https://app.altotrafico.co/api/webhook/c/70ddc358-f9ef-4931-996f-b4092e45ea8b";
const WEBHOOK_URL =
  process.env.AT_SAAS_CALCULADORA_WEBHOOK || FALLBACK_WEBHOOK;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      email,
      nombre,
      empresa,
      telefono,
      industria,
      respuestas,
      resultado,
      utm,
    } = body ?? {};

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }

    const payload = {
      email,
      nombre: nombre ?? null,
      empresa: empresa ?? null,
      telefono: telefono ?? null,
      // Contexto de la calculadora
      industria: industria ?? "universal",
      respuestas: respuestas ?? null,
      perdidaMensual: resultado?.perdidaMensual ?? null,
      perdidaAnual: resultado?.perdidaAnual ?? null,
      recuperable: resultado?.recuperable ?? null,
      // Atribución
      source: `calculadora:${industria ?? "universal"}`,
      utm: utm ?? null,
      timestamp: new Date().toISOString(),
    };

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "no body");
      console.error(`Calculadora webhook failed: ${res.status} — ${text}`);
      return NextResponse.json({ error: "Webhook failed" }, { status: 502 });
    }

    const data = await res.json().catch(() => null);
    const leadId = data?.data?.id || data?.id || null;

    return NextResponse.json({ success: true, leadId });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
