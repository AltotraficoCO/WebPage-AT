import { isSameOrigin } from "@/lib/request-origin";
import { auth } from "@/auth";
import { readMarketing, saveMarketing } from "@/lib/marketing";
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await auth()))
    return Response.json({ error: "No autorizado" }, { status: 401 });
  try {
    return Response.json(await readMarketing(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { error: "No se pudo leer el contenido" },
      { status: 503 },
    );
  }
}
export async function PUT(request: Request) {
  if (!(await auth()))
    return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!isSameOrigin(request))
    return Response.json({ error: "Origen inválido" }, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 300000)
      return Response.json(
        { error: "Contenido demasiado extenso" },
        { status: 413 },
      );
    const body = JSON.parse(raw);
    if (
      !["draft", "publish", "restore"].includes(body.action) ||
      !Number.isInteger(body.version)
    )
      return Response.json({ error: "Acción inválida" }, { status: 400 });
    return Response.json(
      await saveMarketing(body.content, body.version, body.action),
    );
  } catch (e) {
    const conflict = e instanceof Error && e.message === "CONFLICT";
    return Response.json(
      {
        error: conflict
          ? "Otra persona guardó cambios. Recarga antes de continuar."
          : e instanceof Error
            ? e.message
            : "Error al guardar",
      },
      { status: conflict ? 409 : 400 },
    );
  }
}
