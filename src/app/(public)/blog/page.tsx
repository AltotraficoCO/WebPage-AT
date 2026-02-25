import type { Metadata } from "next";
import { fetchBlogPosts } from "@/lib/hubspot";
import BlogList from "@/components/BlogList";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export const metadata: Metadata = {
  title: "Alto Tráfico - Blog",
  description: "Artículos sobre IA, automatización y estrategia empresarial.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof fetchBlogPosts>>["results"] = [];
  let error = false;

  try {
    const data = await fetchBlogPosts();
    posts = data.results;
  } catch {
    error = true;
  }

  const postsData = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    featuredImage: p.featuredImage,
    publishDate: p.publishDate,
    authorName: p.authorName,
    summary: stripHtml(p.postSummary || p.metaDescription),
  }));

  return (
    <main className="pt-20 min-h-screen">
      <section className="py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-primary mb-6">
              Blog
            </h1>
            <p className="text-xl text-gray-500 font-normal max-w-2xl mx-auto">
              Insights sobre IA, automatización y transformación digital.
            </p>
          </div>

          {error ? (
            <div className="text-center py-16">
              <p className="text-gray-400">
                No se pudieron cargar los artículos. Intenta más tarde.
              </p>
            </div>
          ) : (
            <BlogList posts={postsData} />
          )}
        </div>
      </section>
    </main>
  );
}
