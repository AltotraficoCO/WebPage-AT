import { fetchBlogPostBySlug } from "@/lib/hubspot";
import { notFound } from "next/navigation";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import BlogImage from "@/components/BlogImage";

export const revalidate = 3600;

function sanitizeHtml(html: string): string {
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr",
        "ul", "ol", "li", "a", "strong", "em", "b", "i", "u",
        "blockquote", "pre", "code", "img", "figure", "figcaption",
        "table", "thead", "tbody", "tr", "th", "td",
        "span", "div", "section",
      ],
      ALLOWED_ATTR: [
        "href", "target", "rel", "src", "alt", "width", "height",
        "class", "id",
      ],
      ALLOW_DATA_ATTR: false,
    });
  } catch {
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/\s*on\w+="[^"]*"/gi, "")
      .replace(/\s*on\w+='[^']*'/gi, "")
      .replace(/javascript:/gi, "");
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = await fetchBlogPostBySlug(slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const cleanHtml = sanitizeHtml(post.postBody);
  const summary = stripHtml(post.postSummary || post.metaDescription);

  return (
    <main className="pt-20 min-h-screen bg-white">
      {/* Hero header */}
      <header className="relative">
        {post.featuredImage && (
          <BlogImage
            src={post.featuredImage}
            alt={post.name}
            wrapperClassName="w-full h-[50vh] min-h-[400px] max-h-[560px] relative overflow-hidden"
            className="w-full h-full object-cover"
            overlay
          />
        )}

        <div className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 ${post.featuredImage ? "-mt-32 relative z-10" : "pt-16"}`}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-secondary transition-colors mb-8 group"
          >
            <span className="material-icons text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Volver al blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm text-gray-600 font-normal">
              {new Date(post.publishDate).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            {post.authorName && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600 font-normal">
                  {post.authorName}
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-primary leading-[1.15] mb-6">
            {post.name}
          </h1>

          {summary && (
            <p className="text-lg text-gray-500 leading-relaxed mb-8 font-normal">
              {summary}
            </p>
          )}

          <div className="w-16 h-px bg-gradient-to-r from-neon-1 to-neon-2 mb-12" />
        </div>
      </header>

      {/* Article body */}
      <article className="pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-primary prose-headings:font-medium prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-neon-1 prose-h2:pl-4
              prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-3
              prose-p:text-gray-600 prose-p:leading-[1.8] prose-p:font-normal
              prose-li:text-gray-600 prose-li:leading-[1.8]
              prose-strong:text-primary prose-strong:font-medium
              prose-a:text-secondary prose-a:underline prose-a:decoration-neon-1/50 prose-a:underline-offset-2 hover:prose-a:decoration-neon-1
              prose-blockquote:border-l-neon-1 prose-blockquote:bg-surface-light prose-blockquote:rounded-r-xl prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:text-gray-600
              prose-img:rounded-xl prose-img:shadow-md
              prose-pre:bg-primary prose-pre:rounded-xl prose-pre:text-sm
              prose-code:text-secondary prose-code:bg-surface-light prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
              prose-hr:border-gray-100
              prose-table:text-sm prose-th:text-primary prose-th:bg-surface-light"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>
      </article>

      {/* Bottom nav */}
      <div className="border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary transition-colors group"
          >
            <span className="material-icons text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Ver todos los artículos
          </Link>
        </div>
      </div>
    </main>
  );
}
