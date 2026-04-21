import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

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

        <div className="mt-10 grid gap-5">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-lime-300/40 hover:bg-white/[0.06]"
            >
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-stone-500">
                <span>{post.category}</span>
                <span>{post.date}</span>
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
          ))}
        </div>
      </section>
    </main>
  );
}
