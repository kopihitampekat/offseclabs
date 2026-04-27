import Link from "next/link";
import type { Post } from "@/v2/lib/types";
import { TagChip } from "@/v2/components/shared/tag-chip";

type PostCardFeaturedProps = {
  post: Post;
};

export function PostCardFeatured({ post }: PostCardFeaturedProps) {
  return (
    <Link href={`/v2/blog/${post.slug}`} className="group block">
      <article className="card overflow-hidden">
        <div className="relative p-8 lg:p-10">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
            <span className="rounded-full bg-lime-300/10 px-2.5 py-1 text-lime-300">
              Featured
            </span>
            <span>{post.category}</span>
            <span>{post.date}</span>
            <span className="text-stone-600">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <h2 className="mt-5 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-stone-50 transition group-hover:text-lime-200 lg:text-3xl">
            {post.title}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">
            {post.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
