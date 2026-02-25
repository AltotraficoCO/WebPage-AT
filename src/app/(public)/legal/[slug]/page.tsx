import { readFooterLinkBySlug } from "@/lib/storage";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await readFooterLinkBySlug(slug);

  if (!page || !page.content) {
    notFound();
  }

  return (
    <main className="pt-20 min-h-screen">
      <article className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary transition-colors mb-8"
          >
            <span className="material-icons text-lg">arrow_back</span>
            Volver al inicio
          </Link>

          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-primary mb-10 leading-tight">
            {page.label}
          </h1>

          <div className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-medium prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-secondary whitespace-pre-line">
            {page.content}
          </div>
        </div>
      </article>
    </main>
  );
}
