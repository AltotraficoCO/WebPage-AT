import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";

const WEBHOOK_URL = "https://app.altotrafico.co/api/webhook/c/70ddc358-f9ef-4931-996f-b4092e45ea8b";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown";
    const { allowed } = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes" },
        { status: 429 }
      );
    }

    const body = await request.json();

    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...body,
        source: "ia-para-empresas",
        timestamp: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Webhook failed" }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
