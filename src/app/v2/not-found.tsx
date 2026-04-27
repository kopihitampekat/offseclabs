import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold tracking-[-0.06em] text-stone-800">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold text-stone-200">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-stone-500">
          This route does not exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/v2"
            className="rounded-full bg-lime-300 px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-lime-200"
          >
            Go home
          </Link>
          <Link
            href="/v2/blog"
            className="rounded-full border border-white/14 px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-white/24 hover:bg-white/5"
          >
            Research
          </Link>
        </div>
      </div>
    </main>
  );
}
