import {
  Show,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admin";

const pillars = [
  {
    title: "Research-first",
    description:
      "Writeups, tooling, and offensive notes focused on practical tradecraft instead of recycled security content.",
  },
  {
    title: "Built to ship",
    description:
      "A lean stack for publishing fast on Vercel, with Neon ready when the site needs persistence and structured data.",
  },
  {
    title: "Minimal surface",
    description:
      "Clear copy, strong hierarchy, and no unnecessary UI weight. The page is meant to load fast and stay readable.",
  },
];

const notes = [
  "Offensive security blog",
  "Research archive",
  "Neon-backed content layer",
];

export default async function Home() {
  const { userId } = await auth();
  const user = userId ? await currentUser() : null;
  const canAccessAdmin = isAdminEmail(
    user?.primaryEmailAddress?.emailAddress ?? null,
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/"
            className="text-sm font-medium uppercase tracking-[0.28em] text-stone-200"
          >
            OffSecLabs
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-400 sm:flex">
              <span>Vercel</span>
              <span className="h-1 w-1 rounded-full bg-lime-300" />
              <span>Neon</span>
            </div>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-full border border-white/14 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-200 transition hover:border-white/30 hover:bg-white/5">
                  Sign in
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                {canAccessAdmin ? (
                  <Link
                    href="/admin"
                    prefetch={false}
                    className="rounded-full border border-white/14 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-200 transition hover:border-white/30 hover:bg-white/5"
                  >
                    Admin
                  </Link>
                ) : null}
                <UserButton />
              </div>
            </Show>
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center py-16 lg:py-24">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs uppercase tracking-[0.32em] text-lime-300">
              offseclabs.xyz
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-stone-50 sm:text-6xl lg:text-7xl">
              A minimal home for offensive security research and experiments.
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              OffSecLabs is a focused landing page for publishing research,
              documenting lab work, and growing into a Vercel-hosted platform
              with Neon as the database layer when content and tooling expand.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:hello@offseclabs.xyz"
              className="inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-lime-200"
            >
              Contact
            </a>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/30 hover:bg-white/5"
            >
              Read research
            </Link>
            <a
              href="#stack"
              className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/30 hover:bg-white/5"
            >
              View structure
            </a>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-stone-300"
              >
                {note}
              </div>
            ))}
          </div>
        </div>

        <section
          id="stack"
          className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-3"
        >
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-3xl border border-white/10 bg-black/20 p-6"
            >
              <h2 className="text-lg font-semibold text-stone-100">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                {pillar.description}
              </p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
