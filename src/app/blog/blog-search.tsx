"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { Post } from "@/lib/posts";

type BlogSearchProps = {
  posts: Post[];
};

export function BlogSearch({ posts }: BlogSearchProps) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(
    () =>
      new Fuse(posts, {
        keys: ["title", "excerpt", "tags", "category"],
        threshold: 0.3,
        includeScore: true,
      }),
    [posts]
  );

  const filteredPosts = useMemo(() => {
    if (!query.trim()) return posts;
    const results = fuse.search(query);
    return results.map((result) => result.item);
  }, [fuse, posts, query]);

  return (
    <>
      <div className="mt-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts..."
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 pl-12 text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-lime-300/50"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-stone-500 transition hover:text-stone-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        <p className="mt-2 text-sm text-stone-500">
          {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} found
        </p>
      </div>

      <div className="mt-6 grid gap-5">
        {filteredPosts.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-stone-400">No posts match your search.</p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-lime-300/40 hover:bg-white/[0.06]"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-stone-500">
                <span>{post.category}</span>
                <span>{post.date}</span>
                <span className="text-stone-600">·</span>
                <span>{post.readingTime} min read</span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-stone-100">
                {post.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
                {post.excerpt}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-stone-200 transition hover:border-lime-300/40 hover:text-lime-200"
              >
                Read note
              </Link>
            </article>
          ))
        )}
      </div>
    </>
  );
}
