import { NextResponse } from "next/server";
import { readSettings, writeSettings } from "@/lib/storage";
import { validateSettings } from "@/lib/validation";

export async function GET() {
  const settings = await readSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = validateSettings(body);
    if (!validated) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }
    await writeSettings(validated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
