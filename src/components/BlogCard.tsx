"use client";

import Link from "next/link";

interface Props {
  slug: string;
  name: string;
  featuredImage: string;
  publishDate: string;
  authorName: string;
  summary: string;
  featured?: boolean;
  onBroken?: () => void;
}

export default function BlogCard({
  slug,
  name,
  featuredImage,
  publishDate,
  authorName,
  summary,
  featured,
  onBroken,
}: Props) {
  const date = new Date(publishDate).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (featured) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="group block bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-500"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {featuredImage && (
            <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
              <img
                src={featuredImage}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={onBroken}
              />
            </div>
          )}
          <div className="p-8 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-neon-1 bg-primary px-3 py-1 rounded-full">
                Más reciente
              </span>
              <span className="text-xs text-gray-400">{date}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-medium text-primary mb-4 group-hover:text-secondary transition-colors leading-tight">
              {name}
            </h2>
            <p className="text-gray-500 leading-relaxed line-clamp-3 mb-6">
              {summary}
            </p>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-3 transition-all">
              Leer artículo
              <span className="material-icons text-lg">arrow_forward</span>
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-300"
    >
      {featuredImage && (
        <div className="aspect-video overflow-hidden">
          <img
            src={featuredImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={onBroken}
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs text-gray-400">{date}</span>
          {authorName && (
            <>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-xs text-gray-400">{authorName}</span>
            </>
          )}
        </div>
        <h2 className="text-lg font-medium text-gray-900 mb-2 group-hover:text-primary transition-colors leading-snug">
          {name}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
          {summary}
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-4 group-hover:gap-2 transition-all">
          Leer más
          <span className="material-icons text-base">arrow_forward</span>
        </span>
      </div>
    </Link>
  );
}
