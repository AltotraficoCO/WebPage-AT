import type { HubSpotBlogPost } from "@/types/admin";
import { readHubSpotConfig } from "@/lib/storage";

const HUBSPOT_API_URL = "https://api.hubapi.com/cms/v3/blogs/posts";

async function getAccessToken(): Promise<string> {
  // Try config file first, then env fallback
  const config = await readHubSpotConfig();
  if (config.accessToken) return config.accessToken;

  const envToken = process.env.HUBSPOT_ACCESS_TOKEN;
  if (envToken) return envToken;

  throw new Error("HUBSPOT_ACCESS_TOKEN is not configured");
}

export async function testConnection(token: string): Promise<{ ok: boolean; total: number; error?: string }> {
  try {
    const params = new URLSearchParams({
      state: "PUBLISHED",
      limit: "1",
    });

    const res = await fetch(`${HUBSPOT_API_URL}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) return { ok: false, total: 0, error: "Token inválido o expirado" };
      if (res.status === 403) return { ok: false, total: 0, error: "El token no tiene el scope 'content' habilitado. Ve a HubSpot → Settings → Integrations → Private Apps, edita tu app y activa el scope 'CMS > Blog > Read'." };
      return { ok: false, total: 0, error: `Error de HubSpot: ${res.status}` };
    }

    const data = await res.json();
    return { ok: true, total: data.total ?? 0 };
  } catch {
    return { ok: false, total: 0, error: "No se pudo conectar con HubSpot" };
  }
}

export async function fetchBlogPosts(
  limit = 20,
  offset = 0
): Promise<{ results: HubSpotBlogPost[]; total: number }> {
  const token = await getAccessToken();
  const params = new URLSearchParams({
    state: "PUBLISHED",
    limit: String(limit),
    offset: String(offset),
    sort: "-publishDate",
  });

  const res = await fetch(`${HUBSPOT_API_URL}?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`HubSpot API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return {
    results: data.results.map(mapPost),
    total: data.total,
  };
}

export async function fetchBlogPostBySlug(
  slug: string
): Promise<HubSpotBlogPost | null> {
  // HubSpot slugs include a path prefix (e.g. "blog/my-post") which we strip
  // in mapPost. To find by clean slug, fetch all and match.
  const data = await fetchBlogPosts(100, 0);
  return data.results.find((p) => p.slug === slug) || null;
}

function cleanSlug(slug: string): string {
  // HubSpot slugs may include path prefix like "blog/my-post"
  const parts = slug.split("/");
  const lastPart = parts[parts.length - 1];
  // Normalize accented chars to ASCII (ó→o, á→a, etc.) for clean URLs
  return lastPart
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(raw: any): HubSpotBlogPost {
  return {
    id: raw.id,
    slug: cleanSlug(raw.slug ?? ""),
    name: raw.name,
    postBody: raw.postBody ?? "",
    postSummary: raw.postSummary ?? "",
    featuredImage: raw.featuredImage ?? "",
    publishDate: raw.publishDate ?? "",
    authorName: raw.authorName ?? "",
    metaDescription: raw.metaDescription ?? "",
  };
}
