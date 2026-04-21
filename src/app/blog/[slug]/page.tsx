import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

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

  if (!post) {
    return {
      title: "Not found | OffSecLabs",
    };
  }

  return {
    title: `${post.title} | OffSecLabs`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

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
      </section>
    </main>
  );
}
