import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/v2/lib/posts";
import { MarkdownContent } from "@/v2/lib/markdown";
import { siteConfig } from "@/v2/lib/config";
import { TagChip } from "@/v2/components/shared/tag-chip";
import { JsonLd } from "@/v2/components/shared/json-ld";
import { ReadingProgress } from "@/v2/components/blog/reading-progress";
import { TableOfContents } from "@/v2/components/blog/table-of-contents";
import { ShareButtons } from "@/v2/components/blog/share-buttons";
import { RelatedPosts } from "@/v2/components/blog/related-posts";
import { PrevNextNav } from "@/v2/components/blog/prev-next-nav";
import { CodeBlockWrapper } from "@/v2/components/blog/code-block";

export const revalidate = 300;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [siteConfig.name],
      tags: post.tags,
      url: `${siteConfig.url}/v2/blog/${slug}`,
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
  const [post, allPosts] = await Promise.all([
    getPostBySlug(slug),
    getAllPosts(),
  ]);

  if (!post) notFound();

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const related = await getRelatedPosts(slug);

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: siteConfig.name },
          publisher: { "@type": "Organization", name: siteConfig.name },
          url: `${siteConfig.url}/v2/blog/${slug}`,
          keywords: post.tags.join(", "),
        }}
      />

      <main className="min-h-screen">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
          <nav className="border-b border-white/[0.06] pb-6">
            <Link
              href="/v2/blog"
              className="text-xs uppercase tracking-[0.24em] text-stone-500 transition hover:text-stone-200"
            >
              &larr; Back to research
            </Link>
          </nav>

          <div className="mt-10 grid gap-10 xl:grid-cols-[1fr_14rem]">
            <article>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em] text-stone-500">
                <span>{post.category}</span>
                <span>{post.date}</span>
                <span className="text-stone-600">&middot;</span>
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
                  <TagChip key={tag}>{tag}</TagChip>
                ))}
              </div>

              <div className="mt-6">
                <ShareButtons title={post.title} slug={slug} />
              </div>

              <div className="markdown-body mt-10 border-t border-white/[0.06] pt-10">
                <MarkdownContent>{post.content}</MarkdownContent>
              </div>
            </article>

            <TableOfContents />
          </div>

          <RelatedPosts posts={related} />
          <PrevNextNav previous={previousPost} next={nextPost} />
        </div>
      </main>
    </>
  );
}
