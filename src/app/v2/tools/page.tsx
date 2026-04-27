import type { Metadata } from "next";
import { tools } from "@/v2/lib/content";
import { ToolCard } from "@/v2/components/tools/tool-card";
import { siteConfig } from "@/v2/lib/config";

export const metadata: Metadata = {
  title: "Tools",
  description: `Open-source security tools from ${siteConfig.name}.`,
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="border-b border-white/[0.06] pb-10">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            Tools
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-stone-400">
            Open-source tooling built for offensive security workflows. Each
            tool is designed to be small, composable, and easy to audit.
          </p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {tools.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/8 bg-surface p-8 text-center text-sm text-stone-500">
            No tools published yet.
          </div>
        )}
      </section>
    </main>
  );
}
