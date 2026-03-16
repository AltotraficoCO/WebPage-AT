import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildPrompt, getArchetype, archetypes } from "@/components/pauta/quizData";

const WEBHOOK_URL = "https://app.altotrafico.co/api/webhook/c/70ddc358-f9ef-4931-996f-b4092e45ea8b";

const CONTACT_FIELDS = ["name", "email", "company", "role"] as const;
const QUESTION_FIELDS = [
  "q1_captacion", "q2_leads", "q3_contenido", "q4_postventa", "q5_metricas",
  "q6_procesos", "q7_documentacion", "q8_integracion", "q9_frustracion", "q10_adopcion",
] as const;

const VALID_ARCHETYPE_KEYS = archetypes.map((a) => a.key);

function sanitize(str: string): string {
  return String(str).replace(/<[^>]*>/g, "").trim().slice(0, 500);
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    // Rate limit
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate contact fields
    const answers: Record<string, string> = {};
    for (const field of CONTACT_FIELDS) {
      const val = body[field];
      if (!val || typeof val !== "string" || !val.trim()) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
      answers[field] = sanitize(val);
    }

    if (!validateEmail(answers.email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Validate question fields
    for (const field of QUESTION_FIELDS) {
      const val = body[field];
      if (!val || typeof val !== "string" || !val.trim()) {
        return NextResponse.json(
          { error: `Campo requerido: ${field}` },
          { status: 400 }
        );
      }
      answers[field] = sanitize(val);
    }

    // Validate score
    const score = Number(body.score);
    if (!Number.isInteger(score) || score < 10 || score > 40) {
      return NextResponse.json({ error: "Score inválido (debe ser 10-40)" }, { status: 400 });
    }

    // Validate archetype
    const archetypeKey = body.archetype;
    if (!archetypeKey || !VALID_ARCHETYPE_KEYS.includes(archetypeKey)) {
      return NextResponse.json({ error: "Arquetipo inválido" }, { status: 400 });
    }

    const archetype = getArchetype(score);

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Servicio de IA no configurado" },
        { status: 503 }
      );
    }

    // Build prompt and call Claude
    const prompt = buildPrompt(answers, score, archetype);

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract text
    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json({ error: "No se recibió respuesta de la IA" }, { status: 500 });
    }

    // Parse JSON from response (may have markdown fences)
    let jsonStr = textBlock.text.trim();
    const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) {
      jsonStr = fenceMatch[1].trim();
    }

    let aiResult;
    try {
      aiResult = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Error al procesar respuesta de la IA" }, { status: 500 });
    }

    // Compose final diagnosis result with archetype info
    const diagnosis = {
      archetype,
      score,
      ...aiResult,
    };

    // Send lead to webhook (async, non-blocking)
    const leadPayload = {
      ...answers,
      score,
      archetype: archetype.key,
      archetype_name: archetype.name,
      source: "ia-para-empresas",
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
      utm_term: body.utm_term || "",
      utm_content: body.utm_content || "",
      timestamp: new Date().toISOString(),
    };

    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
    }).catch(() => {
      // Silently fail — don't block user experience
    });

    return NextResponse.json(diagnosis);
  } catch (e) {
    console.error("Diagnosis API error:", e);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
