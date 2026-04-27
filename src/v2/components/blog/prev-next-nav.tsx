import Link from "next/link";
import type { Post } from "@/v2/lib/types";

type PrevNextNavProps = {
  previous: Post | null;
  next: Post | null;
};

export function PrevNextNav({ previous, next }: PrevNextNavProps) {
  if (!previous && !next) return null;

  return (
    <nav className="border-t border-white/[0.06] py-10">
      <div className="grid gap-4 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/v2/blog/${previous.slug}`}
            className="group card p-6"
          >
            <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Previous
            </span>
            <p className="mt-2 text-base font-semibold text-stone-200 transition group-hover:text-lime-200">
              {previous.title}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {previous.readingTime} min read
            </p>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link href={`/v2/blog/${next.slug}`} className="group card p-6 sm:text-right">
            <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Next
            </span>
            <p className="mt-2 text-base font-semibold text-stone-200 transition group-hover:text-lime-200">
              {next.title}
            </p>
            <p className="mt-1 text-xs text-stone-500">
              {next.readingTime} min read
            </p>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
