"use client";

import { useState, useCallback } from "react";
import BlogCard from "@/components/BlogCard";

interface PostData {
  id: string;
  slug: string;
  name: string;
  featuredImage: string;
  publishDate: string;
  authorName: string;
  summary: string;
}

interface Props {
  posts: PostData[];
}

export default function BlogList({ posts }: Props) {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const handleBroken = useCallback((id: string) => {
    setHiddenIds((prev) => new Set(prev).add(id));
  }, []);

  const visible = posts.filter((p) => !hiddenIds.has(p.id));
  const featured = visible[0];
  const rest = visible.slice(1);

  if (visible.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">
          Próximamente publicaremos contenido aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {featured && (
        <BlogCard
          slug={featured.slug}
          name={featured.name}
          featuredImage={featured.featuredImage}
          publishDate={featured.publishDate}
          authorName={featured.authorName}
          summary={featured.summary}
          onBroken={() => handleBroken(featured.id)}
          featured
        />
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((post) => (
            <BlogCard
              key={post.id}
              slug={post.slug}
              name={post.name}
              featuredImage={post.featuredImage}
              publishDate={post.publishDate}
              authorName={post.authorName}
              summary={post.summary}
              onBroken={() => handleBroken(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
