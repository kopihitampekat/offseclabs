import Link from "next/link";
import type { Post } from "@/v2/lib/types";
import { TagChip } from "@/v2/components/shared/tag-chip";

type PostCardGridProps = {
  post: Post;
};

export function PostCardGrid({ post }: PostCardGridProps) {
  return (
    <Link href={`/v2/blog/${post.slug}`} className="group block">
      <article className="card p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-stone-500">
          <span>{post.category}</span>
          <span>{post.date}</span>
          <span className="text-stone-600">·</span>
          <span>{post.readingTime} min read</span>
        </div>

        <h3 className="mt-4 text-lg font-semibold text-stone-100 transition group-hover:text-lime-200">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-7 text-stone-400">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>
      </article>
    </Link>
  );
}
