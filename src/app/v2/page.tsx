import Link from "next/link";
import { getAllPosts, getPostCount } from "@/v2/lib/posts";
import { PostCardFeatured } from "@/v2/components/blog/post-card-featured";
import { PostCardGrid } from "@/v2/components/blog/post-card-grid";
import { AnimatedCounter } from "@/v2/components/shared/animated-counter";
import { SectionReveal } from "@/v2/components/shared/section-reveal";
import { siteConfig } from "@/v2/lib/config";
import { labs } from "@/v2/lib/content";

export default async function HomePage() {
  const [posts, postCount] = await Promise.all([
    getAllPosts(),
    getPostCount(),
  ]);

  const featured = posts[0];
  const recent = posts.slice(1, 4);

  return (
    <main className="hero-gradient min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10 lg:py-28">
        <SectionReveal>
          <p className="text-xs uppercase tracking-[0.32em] text-lime-300">
            {siteConfig.url.replace("https://", "")}
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-6xl lg:text-7xl">
            Offensive security research, published clearly.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
            {siteConfig.description} Research notes, lab writeups, and
            open-source tooling — all in one place.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/v2/blog"
              className="inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-lime-200"
            >
              Read research
            </Link>
            <Link
              href="/v2/labs"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/24 hover:bg-white/5"
            >
              Lab writeups
            </Link>
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/24 hover:bg-white/5"
            >
              Contact
            </a>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            <div className="card p-6 text-center">
              <p className="text-4xl font-semibold text-stone-100">
                <AnimatedCounter value={postCount} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">
                Research posts
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-4xl font-semibold text-stone-100">
                <AnimatedCounter value={labs.length} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">
                Lab writeups
              </p>
            </div>
            <div className="card p-6 text-center">
              <p className="text-4xl font-semibold text-lime-300">
                <AnimatedCounter value={categories(posts).length} />
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">
                Categories
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {featured && (
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
          <SectionReveal>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
                Latest research
              </h2>
              <Link
                href="/v2/blog"
                className="text-xs text-stone-500 transition hover:text-stone-200"
              >
                View all &rarr;
              </Link>
            </div>
            <div className="mt-6">
              <PostCardFeatured post={featured} />
            </div>
          </SectionReveal>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10">
          <SectionReveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((post) => (
                <PostCardGrid key={post.slug} post={post} />
              ))}
            </div>
          </SectionReveal>
        </section>
      )}

      <section className="mx-auto w-full max-w-6xl px-6 pb-20 sm:px-10">
        <SectionReveal>
          <div className="card flex flex-col items-center gap-6 p-12 text-center lg:flex-row lg:text-left">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-stone-100">
                Stay current with new research
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                New writeups, tools, and methodology notes are published
                regularly. Follow along through RSS or GitHub.
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/v2/feed.xml"
                className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-white/24 hover:bg-white/5"
              >
                RSS Feed
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-stone-100 transition hover:border-white/24 hover:bg-white/5"
              >
                GitHub
              </a>
            </div>
          </div>
        </SectionReveal>
      </section>
    </main>
  );
}

function categories(posts: { category: string }[]) {
  return Array.from(new Set(posts.map((p) => p.category)));
}
