import { randomUUID } from "node:crypto";
import { getRedis } from "@/lib/redis";
import { readHubSpotConfig } from "@/lib/storage";
import type { HubSpotBlogPost } from "@/types/admin";
import sanitizeHtml from "sanitize-html";

const INDEX = "site:blog:archive:v1";
type Summary = Omit<HubSpotBlogPost, "postBody">;
export interface BlogArchive {
  batch: string;
  importedAt: string;
  posts: Summary[];
}
export const cleanBlogHtml = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height", "loading"],
      a: ["href", "title", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
  });
export async function readBlogArchive() {
  return (await getRedis()?.get<BlogArchive>(INDEX)) ?? null;
}
export async function readArchivedPost(slug: string) {
  const archive = await readBlogArchive();
  const post = archive?.posts.find((p) => p.slug === slug);
  return archive && post
    ? ((await getRedis()?.get<HubSpotBlogPost>(
        `site:blog:${archive.batch}:${post.id}`,
      )) ?? null)
    : null;
}
export async function importHubSpotBlog() {
  const redis = getRedis();
  if (!redis) throw new Error("El almacenamiento no está configurado");
  const token =
    (await readHubSpotConfig()).accessToken || process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("Conecta HubSpot antes de importar");
  const lock = randomUUID();
  if (!(await redis.set("site:blog:import-lock", lock, { nx: true, ex: 300 })))
    throw new Error("Ya hay una importación en curso");
  try {
    const { mapPost } = await import("@/lib/hubspot");
    const all: HubSpotBlogPost[] = [];
    let after: string | undefined;
    const seen = new Set<string>();
    for (let page = 0; page < 1000; page++) {
      const params = new URLSearchParams({
        state: "PUBLISHED",
        limit: "100",
        sort: "-publishDate",
      });
      if (after) params.set("after", after);
      const response = await fetch(
        `https://api.hubapi.com/cms/v3/blogs/posts?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
          signal: AbortSignal.timeout(20000),
        },
      );
      if (!response.ok)
        throw new Error(
          `HubSpot respondió ${response.status}. No se reemplazó la copia anterior.`,
        );
      const data = await response.json();
      if (!Array.isArray(data.results))
        throw new Error("Respuesta inesperada de HubSpot");
      for (const raw of data.results) {
        if (raw.state && raw.state !== "PUBLISHED") continue;
        const post = mapPost(raw);
        if (!post.id || !post.slug || !post.name || seen.has(post.id))
          throw new Error(
            "La importación contiene artículos inválidos o repetidos",
          );
        seen.add(post.id);
        post.postBody = cleanBlogHtml(post.postBody);
        post.postSummary = cleanBlogHtml(post.postSummary);
        all.push(post);
      }
      const next = data.paging?.next?.after;
      if (next === undefined || next === null) {
        if (typeof data.total === "number" && all.length < data.total)
          throw new Error(
            "HubSpot devolvió un listado incompleto. Se conservó la copia anterior.",
          );
        break;
      }
      if (String(next) === after || page === 999)
        throw new Error("Paginación inválida de HubSpot");
      after = String(next);
    }
    if (!all.length)
      throw new Error("No hay artículos publicados para importar");
    const slugs = new Set<string>();
    for (const post of all) {
      if (slugs.has(post.slug))
        throw new Error(
          `Dos artículos comparten la URL ${post.slug}. Revisa sus slugs antes de importar.`,
        );
      slugs.add(post.slug);
    }
    const batch = randomUUID();
    // Store an independent snapshot first. The public index only changes after every write succeeds.
    for (const post of all)
      await redis.set(`site:blog:${batch}:${post.id}`, post);
    const archive: BlogArchive = {
      batch,
      importedAt: new Date().toISOString(),
      posts: all.map(({ postBody: _body, ...summary }) => summary),
    };
    const previous = await readBlogArchive();
    if (previous) await redis.set("site:blog:archive:previous", previous);
    await redis.set(INDEX, archive);
    return { total: all.length, importedAt: archive.importedAt };
  } finally {
    await redis.eval(
      "if redis.call('GET',KEYS[1])==ARGV[1] then return redis.call('DEL',KEYS[1]) end return 0",
      ["site:blog:import-lock"],
      [lock],
    );
  }
}
