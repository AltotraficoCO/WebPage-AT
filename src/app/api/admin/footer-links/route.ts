import { NextResponse } from "next/server";
import { readFooterLinks, writeFooterLinks } from "@/lib/storage";
import { validateFooterLinks } from "@/lib/validation";

export async function GET() {
  const data = await readFooterLinks();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = validateFooterLinks(body);
    if (!validated) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }
    await writeFooterLinks(validated);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}
