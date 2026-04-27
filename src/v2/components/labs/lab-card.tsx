import Link from "next/link";
import type { Lab } from "@/v2/lib/types";
import { DifficultyBadge } from "@/v2/components/labs/difficulty-badge";
import { PlatformTag } from "@/v2/components/labs/platform-tag";
import { TagChip } from "@/v2/components/shared/tag-chip";

type LabCardProps = {
  lab: Lab;
};

export function LabCard({ lab }: LabCardProps) {
  return (
    <Link href={`/v2/labs/${lab.slug}`} className="group block">
      <article className="card p-6">
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={lab.difficulty} />
          <PlatformTag platform={lab.platform} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-stone-100 transition group-hover:text-lime-200">
          {lab.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-sm leading-7 text-stone-400">
          {lab.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {lab.tags.map((tag) => (
            <TagChip key={tag}>{tag}</TagChip>
          ))}
        </div>

        <div className="mt-4 text-[10px] uppercase tracking-[0.2em] text-stone-600">
          {lab.date}
        </div>
      </article>
    </Link>
  );
}
