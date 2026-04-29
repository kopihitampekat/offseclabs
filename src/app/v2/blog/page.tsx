import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/v2/lib/posts";
import { PostCardFeatured } from "@/v2/components/blog/post-card-featured";
import { PostCardGrid } from "@/v2/components/blog/post-card-grid";
import { CategoryFilterClient } from "@/v2/components/blog/category-filter-client";
import { SearchDialog } from "@/v2/components/blog/search-dialog";
import { siteConfig } from "@/v2/lib/config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research",
  description: `Research archive for ${siteConfig.name}.`,
};

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>;
};

const PAGE_SIZE = 9;

export default async function BlogPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const category = params.category ?? null;

  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  // Filter
  let filtered = category
    ? allPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    : allPosts;

  const totalCount = filtered.length;
  const offset = (page - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(offset, offset + PAGE_SIZE);
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  const featured = page === 1 && !category ? allPosts[0] : null;

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="border-b border-white/[0.06] pb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
                Research
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-stone-400">
                Offensive security writeups, methodology notes, and tradecraft
                research.
              </p>
            </div>
            <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 sm:flex">
              <span>{totalCount} posts</span>
              <kbd className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px]">
                Ctrl+K
              </kbd>
            </div>
          </div>
        </header>

        {featured && (
          <div className="mt-8">
            <PostCardFeatured post={featured} />
          </div>
        )}

        <div className="mt-8">
          <CategoryFilterClient
            categories={categories}
            posts={filtered}
            baseUrl="/v2/blog"
          />
        </div>

        {pagePosts.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pagePosts.map((post) => (
              <PostCardGrid key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-white/8 bg-surface p-8 text-center text-sm text-stone-500">
            No posts in this category.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {hasPrev ? (
              <Link
                href={buildPageUrl(page - 1, category)}
                className="rounded-full border border-white/14 px-4 py-2 text-sm text-stone-200 transition hover:border-white/24 hover:bg-white/5"
              >
                &larr; Prev
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 px-4 py-2 text-sm text-stone-600">
                &larr; Prev
              </span>
            )}

            <span className="text-sm text-stone-500">
              {page} / {totalPages}
            </span>

            {hasNext ? (
              <Link
                href={buildPageUrl(page + 1, category)}
                className="rounded-full border border-white/14 px-4 py-2 text-sm text-stone-200 transition hover:border-white/24 hover:bg-white/5"
              >
                Next &rarr;
              </Link>
            ) : (
              <span className="rounded-full border border-white/5 px-4 py-2 text-sm text-stone-600">
                Next &rarr;
              </span>
            )}
          </div>
        )}

        <SearchDialog posts={allPosts} />
      </section>
    </main>
  );
}

function buildPageUrl(page: number, category: string | null) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  if (category) params.set("category", category);
  return `/v2/blog?${params.toString()}`;
}
