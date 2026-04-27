import Link from "next/link";
import type { Post } from "@/v2/lib/types";

type RelatedPostsProps = {
  posts: Post[];
};

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-white/[0.06] py-10">
      <h2 className="text-xs font-medium uppercase tracking-[0.24em] text-stone-500">
        Related research
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/v2/blog/${post.slug}`}
            className="group"
          >
            <article className="card p-5">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                <span>{post.category}</span>
                <span className="text-stone-600">·</span>
                <span>{post.readingTime} min</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-stone-200 transition group-hover:text-lime-200">
                {post.title}
              </h3>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
