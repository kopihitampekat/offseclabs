import type { Metadata } from "next";
import { labs } from "@/v2/lib/content";
import { LabCard } from "@/v2/components/labs/lab-card";
import { DifficultyBadge } from "@/v2/components/labs/difficulty-badge";
import { siteConfig } from "@/v2/lib/config";

export const metadata: Metadata = {
  title: "Labs",
  description: `Lab writeups and walkthroughs from ${siteConfig.name}.`,
};

export default function LabsPage() {
  const difficulties = Array.from(new Set(labs.map((l) => l.difficulty)));
  const platforms = Array.from(new Set(labs.map((l) => l.platform)));

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="border-b border-white/[0.06] pb-10">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            Labs
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-stone-400">
            Walkthroughs and notes from CTF challenges,Hack The Box machines,
            TryHackMe rooms, and Proving Grounds labs.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
              Difficulty
            </span>
            {difficulties.map((d) => (
              <DifficultyBadge key={d} difficulty={d} />
            ))}
          </div>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab) => (
            <LabCard key={lab.slug} lab={lab} />
          ))}
        </div>

        {labs.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/8 bg-surface p-8 text-center text-sm text-stone-500">
            No lab writeups yet. Check back soon.
          </div>
        )}
      </section>
    </main>
  );
}
