import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/v2/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — mission, approach, and technology.`,
};

const stackItems = [
  { name: "Next.js 16", description: "App Router with React Server Components" },
  { name: "Neon", description: "Serverless Postgres for structured content" },
  { name: "Clerk", description: "Authentication and admin access control" },
  { name: "Vercel", description: "Deployment, previews, and edge functions" },
  { name: "Tailwind CSS 4", description: "Utility-first styling with design tokens" },
  { name: "Shiki", description: "Syntax highlighting for code blocks" },
];

const principles = [
  {
    title: "Research-first",
    description:
      "Every piece of content starts from actual lab work, assessments, or tooling development. No recycled security content.",
  },
  {
    title: "Practical over theoretical",
    description:
      "Writeups focus on methodology and decision-making, not just step-by-step instructions. The goal is building tradecraft.",
  },
  {
    title: "Minimal surface",
    description:
      "The site is intentionally lean. Fast to load, easy to read, and structured to grow without a redesign.",
  },
  {
    title: "Open where possible",
    description:
      "Tools and methodologies are shared openly when it does not conflict with responsible disclosure or engagement scope.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-4xl px-6 py-10 sm:px-10">
        <header className="border-b border-white/[0.06] pb-10">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            About
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-stone-400">
            {siteConfig.description}
          </p>
        </header>

        <section className="py-10">
          <h2 className="text-2xl font-semibold text-stone-100">
            Principles
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="card p-6">
                <h3 className="text-base font-semibold text-stone-200">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-10">
          <h2 className="text-2xl font-semibold text-stone-100">
            Technology
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            The site is built on a lean stack designed for speed and simplicity.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stackItems.map((item) => (
              <div
                key={item.name}
                className="rounded-xl border border-white/8 bg-surface p-4"
              >
                <p className="text-sm font-medium text-stone-200">
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.06] py-10">
          <h2 className="text-2xl font-semibold text-stone-100">Connect</h2>
          <p className="mt-3 text-sm leading-7 text-stone-400">
            Reach out for research collaboration, reporting, or general
            inquiries.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.social.email}`}
              className="inline-flex items-center rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-lime-200"
            >
              Contact
            </a>
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-white/24 hover:bg-white/5"
            >
              GitHub
            </a>
            <Link
              href="/v2/blog"
              className="inline-flex items-center rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-white/24 hover:bg-white/5"
            >
              Read research
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
