import { isSameOrigin } from "@/lib/request-origin";
import { auth } from "@/auth";
import { fetchBlogPosts } from "@/lib/hubspot";
import { importHubSpotBlog, readBlogArchive } from "@/lib/blog-archive";
export const maxDuration = 300;
export const dynamic = "force-dynamic";
export async function GET() {
  if (!(await auth()))
    return Response.json({ error: "No autorizado" }, { status: 401 });
  try {
    const [data, archive] = await Promise.all([
      fetchBlogPosts(),
      readBlogArchive(),
    ]);
    return Response.json({ ...data, importedAt: archive?.importedAt ?? null });
  } catch {
    return Response.json(
      { error: "No se pudo leer el blog. Verifica la conexión con HubSpot." },
      { status: 500 },
    );
  }
}
export async function POST(request: Request) {
  if (!(await auth()))
    return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!isSameOrigin(request))
    return Response.json({ error: "Origen inválido" }, { status: 403 });
  try {
    return Response.json({ success: true, ...(await importHubSpotBlog()) });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Error al importar" },
      { status: 500 },
    );
  }
}
