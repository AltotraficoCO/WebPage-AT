import { marketingRoutes } from "@/lib/marketing-render";
import { readBlogArchive } from "@/lib/blog-archive";
export const dynamic = "force-dynamic";
const escape = (s: string) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
export async function GET() {
  const archive = await readBlogArchive();
  const paths = [
    ...Object.values(marketingRoutes).flatMap((pages) => Object.values(pages)),
    "/blog",
    ...(archive?.posts.map((p) => `/blog/${p.slug}`) ?? []),
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map(
          (p) =>
            `<url><loc>${escape("https://www.altotrafico.co" + p)}</loc></url>`,
        )
        .join("") +
      "</urlset>",
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}
