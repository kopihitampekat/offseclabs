import { cn } from "@/v2/lib/utils";

type DifficultyBadgeProps = {
  difficulty: "easy" | "medium" | "hard" | "insane";
};

const colors = {
  easy: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  medium: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  hard: "border-rose-400/30 bg-rose-400/10 text-rose-300",
  insane: "border-purple-400/30 bg-purple-400/10 text-purple-300",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em]",
        colors[difficulty]
      )}
    >
      {difficulty}
    </span>
  );
}
