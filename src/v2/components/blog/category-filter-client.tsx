"use client";

import { useState } from "react";
import { CategoryFilter } from "@/v2/components/blog/category-filter";
import type { Post } from "@/v2/lib/types";
import { PostCardGrid } from "@/v2/components/blog/post-card-grid";

type CategoryFilterClientProps = {
  categories: string[];
  posts: Post[];
};

export function CategoryFilterClient({
  categories,
  posts,
}: CategoryFilterClientProps) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? posts.filter((p) => p.category.toLowerCase() === active!.toLowerCase())
    : posts;

  return (
    <>
      <CategoryFilter
        categories={categories}
        active={active}
        onChange={setActive}
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <PostCardGrid key={post.slug} post={post} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/8 bg-surface p-8 text-center text-sm text-stone-500">
          No posts in this category.
        </div>
      )}
    </>
  );
}
