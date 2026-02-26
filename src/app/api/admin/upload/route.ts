import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".ico", ".svg",
]);
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp",
  "image/avif", "image/x-icon", "image/svg+xml",
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande (máximo 5MB)" },
        { status: 400 }
      );
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo imágenes." },
        { status: 400 }
      );
    }

    // Validate extension
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXTENSIONS.has(`.${ext}`)) {
      return NextResponse.json(
        { error: "Extensión de archivo no permitida." },
        { status: 400 }
      );
    }

    // SVG additional check - strip script tags
    if (ext === "svg" || file.type === "image/svg+xml") {
      const text = await file.text();
      if (
        /<script/i.test(text) ||
        /on\w+\s*=/i.test(text) ||
        /javascript:/i.test(text)
      ) {
        return NextResponse.json(
          { error: "SVG contiene contenido no permitido." },
          { status: 400 }
        );
      }
    }

    const filename = `img-${Date.now()}.${ext}`;
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json(
      { error: "Error al subir archivo" },
      { status: 500 }
    );
  }
}
