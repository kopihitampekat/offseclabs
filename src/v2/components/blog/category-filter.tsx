"use client";

import { cn } from "@/v2/lib/utils";

type CategoryFilterProps = {
  categories: string[];
  active: string | null;
  onChange: (category: string | null) => void;
};

export function CategoryFilter({
  categories,
  active,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition",
          active === null
            ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
            : "border-white/8 text-stone-400 hover:border-white/16 hover:text-stone-200"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] transition",
            active === cat
              ? "border-lime-300/30 bg-lime-300/10 text-lime-200"
              : "border-white/8 text-stone-400 hover:border-white/16 hover:text-stone-200"
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
