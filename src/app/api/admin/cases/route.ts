import { NextResponse } from "next/server";
import { readCases, writeCases } from "@/lib/storage";
import { validateCases } from "@/lib/validation";

export async function GET() {
  const data = await readCases();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = validateCases(body);
    if (!validated) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }
    await writeCases(validated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
