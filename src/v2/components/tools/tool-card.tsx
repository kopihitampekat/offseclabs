import type { Tool } from "@/v2/lib/types";
import { TagChip } from "@/v2/components/shared/tag-chip";

type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-stone-100">{tool.name}</h3>
        {tool.githubUrl && (
          <a
            href={tool.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-400 transition hover:border-white/20 hover:text-white"
          >
            GitHub
          </a>
        )}
      </div>
      <p className="mt-3 text-sm leading-7 text-stone-400">
        {tool.description}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((tag) => (
          <TagChip key={tag}>{tag}</TagChip>
        ))}
      </div>
    </article>
  );
}
