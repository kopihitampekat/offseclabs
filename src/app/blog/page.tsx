import type { Metadata } from "next";
import Link from "next/link";
import { BlogSearch } from "@/app/blog/blog-search";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Research",
  description:
    "Research archive for OffSecLabs, powered by a Neon-ready content layer.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-10 lg:px-12">
        <header className="border-b border-white/10 pb-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm uppercase tracking-[0.28em] text-stone-300 transition hover:text-stone-100"
            >
              OffSecLabs
            </Link>
            <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Research
            </span>
          </div>
          <h1 className="mt-8 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            A small research archive, ready to move from seed data to Neon.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400">
            This route reads from Neon when <code>DATABASE_URL</code> is set.
            Until then, it falls back to local seeded content so deployment and
            development stay simple.
          </p>
        </header>

        <BlogSearch posts={posts} />
      </section>
    </main>
  );
}
