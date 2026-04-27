import type { Metadata } from "next";
import { getAllPosts, getAllCategories } from "@/v2/lib/posts";
import { PostCardFeatured } from "@/v2/components/blog/post-card-featured";
import { PostCardGrid } from "@/v2/components/blog/post-card-grid";
import { SearchDialog } from "@/v2/components/blog/search-dialog";
import { CategoryFilterClient } from "@/v2/components/blog/category-filter-client";
import { siteConfig } from "@/v2/lib/config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research",
  description: `Research archive for ${siteConfig.name}.`,
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
  ]);

  const featured = posts[0];
  const rest = posts.slice(1);

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
              <span>{posts.length} posts</span>
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
          <CategoryFilterClient categories={categories} posts={rest} />
        </div>

        <SearchDialog posts={posts} />
      </section>
    </main>
  );
}
