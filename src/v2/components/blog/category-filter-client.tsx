"use client";

import Link from "next/link";
import { cn } from "@/v2/lib/utils";

type CategoryFilterClientProps = {
  categories: string[];
  posts: { slug: string; title: string; category: string; date: string; excerpt: string; tags: string[]; readingTime: number }[];
  baseUrl: string;
};

export function CategoryFilterClient({
  categories,
  posts,
  baseUrl,
}: CategoryFilterClientProps) {
  const currentCategory = "";

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={baseUrl}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition",
          !currentCategory
            ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
            : "border-white/8 text-stone-400 hover:border-white/16 hover:text-stone-200"
        )}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat}
          href={`${baseUrl}?category=${encodeURIComponent(cat)}`}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition",
            currentCategory === cat
              ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
              : "border-white/8 text-stone-400 hover:border-white/16 hover:text-stone-200"
          )}
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
