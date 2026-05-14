import { notFound } from "next/navigation";
import Link from "next/link";
import { labs } from "@/lib/content";
import { MarkdownContent } from "@/lib/markdown";
import { DifficultyBadge } from "@/components/labs/difficulty-badge";
import { PlatformTag } from "@/components/labs/platform-tag";
import { TagChip } from "@/components/shared/tag-chip";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return labs.map((lab) => ({ slug: lab.slug }));
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;
  const lab = labs.find((l) => l.slug === slug);

  if (!lab) notFound();

  return (
    <main className="min-h-screen">
      <div className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
        <nav className="border-b border-white/[0.06] pb-6">
          <Link
            href="/labs"
            className="text-xs uppercase tracking-[0.24em] text-stone-500 transition hover:text-stone-200"
          >
            &larr; Back to labs
          </Link>
        </nav>

        <article className="py-10">
          <div className="flex items-center gap-3">
            <DifficultyBadge difficulty={lab.difficulty} />
            <PlatformTag platform={lab.platform} />
            <span className="text-xs uppercase tracking-[0.2em] text-stone-500">
              {lab.category}
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            {lab.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-400">
            {lab.excerpt}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {lab.tags.map((tag) => (
              <TagChip key={tag}>{tag}</TagChip>
            ))}
          </div>

          <div className="markdown-body mt-10 border-t border-white/[0.06] pt-10">
            <MarkdownContent>{lab.content}</MarkdownContent>
          </div>
        </article>
      </div>
    </main>
  );
}
