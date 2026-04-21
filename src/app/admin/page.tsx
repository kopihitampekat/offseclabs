import type { Metadata } from "next";
import Link from "next/link";
import { createPost } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin",
  description: "Minimal admin form for inserting OffSecLabs posts into Neon.",
};

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Detection Bypass Notes",
  },
  {
    name: "slug",
    label: "Slug",
    placeholder: "detection-bypass-notes",
  },
  {
    name: "category",
    label: "Category",
    placeholder: "Research",
  },
  {
    name: "publishedAt",
    label: "Publish date",
    placeholder: "2026-04-21T11:00:00.000Z",
  },
  {
    name: "tags",
    label: "Tags",
    placeholder: "neon, admin, publishing",
  },
];

export default function AdminPage() {
  const isConfigured = Boolean(
    process.env.DATABASE_URL && process.env.ADMIN_SECRET,
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-3xl px-6 py-10 sm:px-10 lg:px-12">
        <header className="border-b border-white/10 pb-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm uppercase tracking-[0.28em] text-stone-300 transition hover:text-stone-100"
            >
              OffSecLabs
            </Link>
            <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Admin
            </span>
          </div>
          <h1 className="mt-8 text-4xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-5xl">
            Create a post in Neon.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
            This is a minimal write path for private use. Every submission is
            checked against <code>ADMIN_SECRET</code> on the server before any
            insert runs.
          </p>
        </header>

        {!isConfigured ? (
          <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/[0.08] p-5 text-sm leading-7 text-amber-100">
            Set <code>DATABASE_URL</code> and <code>ADMIN_SECRET</code> before
            using this page.
          </div>
        ) : null}

        <form action={createPost} className="mt-8 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <label className="block text-sm font-medium text-stone-200">
              Admin secret
            </label>
            <input
              required
              type="password"
              name="adminSecret"
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
              placeholder="Configured in Vercel env"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.name}
                className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <span className="text-sm font-medium text-stone-200">
                  {field.label}
                </span>
                <input
                  name={field.name}
                  className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
                  placeholder={field.placeholder}
                />
              </label>
            ))}
          </div>

          <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <span className="text-sm font-medium text-stone-200">Excerpt</span>
            <textarea
              required
              name="excerpt"
              rows={4}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
              placeholder="Short summary shown in the archive."
            />
          </label>

          <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <span className="text-sm font-medium text-stone-200">Content</span>
            <textarea
              required
              name="content"
              rows={14}
              className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
              placeholder="Write paragraphs separated by blank lines."
            />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!isConfigured}
            >
              Publish to Neon
            </button>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/30 hover:bg-white/5"
            >
              View archive
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
