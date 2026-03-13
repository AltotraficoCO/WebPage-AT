import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit } from "@/lib/rate-limit";
import { buildPrompt } from "@/components/pauta/quizData";

const WEBHOOK_URL = "https://app.altotrafico.co/api/webhook/c/70ddc358-f9ef-4931-996f-b4092e45ea8b";

const REQUIRED_FIELDS = ["name", "email", "company", "role", "sector", "company_size", "data_maturity", "ai_usage", "ai_priority"] as const;

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

    // Validate required fields
    const answers: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
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

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Servicio de IA no configurado" },
        { status: 503 }
      );
    }

    // Build prompt and call Claude
    const prompt = buildPrompt(answers);

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

    let diagnosis;
    try {
      diagnosis = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json({ error: "Error al procesar respuesta de la IA" }, { status: 500 });
    }

    // Send lead to webhook (async, non-blocking)
    const leadPayload = {
      ...answers,
      diagnosis_score: diagnosis.maturity_score,
      diagnosis_label: diagnosis.maturity_label,
      source: "ia-para-empresas",
      utm_source: body.utm_source || "",
      utm_medium: body.utm_medium || "",
      utm_campaign: body.utm_campaign || "",
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
