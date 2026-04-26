import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const revalidate = 300;

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const baseUrl = "https://offseclabs.xyz";

  if (!post) {
    return {
      title: "Not found | OffSecLabs",
    };
  }

  return {
    title: `${post.title} | OffSecLabs`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: ["OffSecLabs"],
      tags: post.tags,
      url: `${baseUrl}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getAllPosts()]);

  if (!post) {
    notFound();
  }

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10 lg:px-12">
        <nav className="border-b border-white/10 pb-6">
          <Link
            href="/blog"
            className="text-sm uppercase tracking-[0.24em] text-stone-400 transition hover:text-stone-100"
          >
            Back to research
          </Link>
        </nav>

        <article className="py-10">
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-stone-500">
            <span>{post.category}</span>
            <span>{post.date}</span>
            <span className="text-stone-600">·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400">
            {post.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="markdown-body mt-10 border-t border-white/10 pt-10 text-base leading-8 text-stone-300">
            <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
          </div>
        </article>

        {(previousPost || nextPost) && (
          <nav className="border-t border-white/10 py-10">
            <div className="grid gap-4 sm:grid-cols-2">
              {previousPost ? (
                <Link
                  href={`/blog/${previousPost.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    Previous
                  </span>
                  <p className="mt-2 text-lg font-semibold text-stone-100 transition group-hover:text-lime-200">
                    {previousPost.title}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {previousPost.readingTime} min read
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/20 hover:bg-white/[0.06] sm:text-right"
                >
                  <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
                    Next
                  </span>
                  <p className="mt-2 text-lg font-semibold text-stone-100 transition group-hover:text-lime-200">
                    {nextPost.title}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {nextPost.readingTime} min read
                  </p>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </nav>
        )}
      </section>
    </main>
  );
}
