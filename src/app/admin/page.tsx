import type { Metadata } from "next";
import Link from "next/link";
import { createPost, deletePost } from "@/app/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { getAdminPosts } from "@/lib/posts";
import { SubmitButton } from "@/app/admin/submit-button";

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
    placeholder: "",
    type: "datetime-local",
  },
  {
    name: "tags",
    label: "Tags",
    placeholder: "neon, admin, publishing",
  },
];

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
    edit?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await requireAdminSession();
  const isConfigured = Boolean(process.env.DATABASE_URL);
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error;
  const editSlug = params?.edit;
  const posts = await getAdminPosts();
  const draftPosts = posts.filter((post) => !post.published);
  const publishedPosts = posts.filter((post) => post.published);
  const editingPost = editSlug
    ? posts.find((post) => post.slug === editSlug) ?? null
    : null;
  const unauthorized = !session.ok;
  const primaryEmail =
    session.ok ? session.email ?? session.user.id : "unknown user";

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
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
            {editingPost ? "Edit post in Neon." : "Create a post in Neon."}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
            This route is protected by Clerk sign-in and an admin email
            allowlist. Only approved accounts can create, edit, publish, or
            delete posts.
          </p>
        </header>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-stone-300">
          Signed in as{" "}
          <span className="font-medium text-stone-100">
            {primaryEmail}
          </span>
          .
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Total entries
            </p>
            <p className="mt-3 text-3xl font-semibold text-stone-100">
              {posts.length}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Drafts
            </p>
            <p className="mt-3 text-3xl font-semibold text-amber-300">
              {draftPosts.length}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
              Published
            </p>
            <p className="mt-3 text-3xl font-semibold text-lime-300">
              {publishedPosts.length}
            </p>
          </div>
        </div>

        {unauthorized ? (
          <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/[0.08] p-5 text-sm leading-7 text-rose-100">
            {session.reason} Add your email to <code>ADMIN_EMAILS</code> to use
            this route.
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-3xl border border-rose-400/20 bg-rose-400/[0.08] p-5 text-sm leading-7 text-rose-100">
            {error}
          </div>
        ) : null}

        {!isConfigured ? (
          <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/[0.08] p-5 text-sm leading-7 text-amber-100">
            Set <code>DATABASE_URL</code> before using this page.
          </div>
        ) : null}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form action={createPost} className="space-y-6">
            <input
              type="hidden"
              name="originalSlug"
              value={editingPost?.slug ?? ""}
            />

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
                    type={field.type ?? "text"}
                    defaultValue={
                      field.name === "title"
                        ? editingPost?.title
                        : field.name === "slug"
                          ? editingPost?.slug
                          : field.name === "category"
                            ? editingPost?.category
                            : field.name === "publishedAt"
                              ? `${editingPost?.date ?? ""}T09:00`
                              : field.name === "tags"
                                ? editingPost?.tags.join(", ")
                                : ""
                    }
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>

            <label className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <div>
                <span className="block text-sm font-medium text-stone-200">
                  Publish now
                </span>
                <span className="mt-2 block text-sm leading-7 text-stone-400">
                  Turn this off to keep the entry as a draft in Neon.
                </span>
              </div>
              <input
                type="checkbox"
                name="published"
                defaultChecked={editingPost ? editingPost.published : true}
                className="h-5 w-5 rounded border-white/20 bg-black/20 accent-lime-300"
              />
            </label>

            <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <span className="text-sm font-medium text-stone-200">Excerpt</span>
              <textarea
                required
                name="excerpt"
                rows={4}
                defaultValue={editingPost?.excerpt}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
                placeholder="Short summary shown in the archive."
              />
            </label>

            <label className="block rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <span className="text-sm font-medium text-stone-200">Content</span>
              <span className="mt-2 block text-sm leading-7 text-stone-400">
                Markdown is supported for headings, lists, code blocks, tables,
                and links.
              </span>
              <textarea
                required
                name="content"
                rows={14}
                defaultValue={editingPost?.content}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-stone-100 outline-none transition placeholder:text-stone-500 focus:border-lime-300/50"
                placeholder={"## Research note\n\nWrite paragraphs, lists, and code blocks in Markdown."}
              />
            </label>

            <div className="flex flex-col gap-4 sm:flex-row">
              <SubmitButton
                pendingLabel={editingPost ? "Saving changes..." : "Creating post..."}
                className="inline-flex items-center justify-center rounded-full bg-lime-300 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!isConfigured || unauthorized}
              >
                {editingPost ? "Save changes" : "Create post"}
              </SubmitButton>
              <Link
                href={editingPost ? "/admin" : "/blog"}
                className="inline-flex items-center justify-center rounded-full border border-white/14 px-6 py-3 text-sm font-semibold text-stone-100 transition hover:border-white/30 hover:bg-white/5"
              >
                {editingPost ? "New post" : "View archive"}
              </Link>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-lg font-semibold text-stone-100">
                Existing posts
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Drafts and published notes are split out so the content queue is
                easier to review.
              </p>
            </div>

            <section className="space-y-4">
              <div className="rounded-3xl border border-amber-300/20 bg-amber-300/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-amber-200">
                  Drafts
                </p>
              </div>
              {draftPosts.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-stone-400">
                  No drafts right now.
                </div>
              ) : (
                draftPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                          <span>{post.category}</span>
                          <span>{post.date}</span>
                          <span className="text-amber-300">Draft</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-stone-100">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-stone-400">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/admin?edit=${post.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-white/30 hover:bg-white/5"
                      >
                        Edit
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="slug" value={post.slug} />
                        <SubmitButton
                          pendingLabel="Deleting..."
                          className="inline-flex items-center justify-center rounded-full border border-rose-400/20 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={unauthorized || !isConfigured}
                        >
                          Delete
                        </SubmitButton>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </section>

            <section className="space-y-4">
              <div className="rounded-3xl border border-lime-300/20 bg-lime-300/[0.06] p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-lime-200">
                  Published
                </p>
              </div>
              {publishedPosts.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-7 text-stone-400">
                  No published posts yet.
                </div>
              ) : (
                publishedPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.24em] text-stone-500">
                          <span>{post.category}</span>
                          <span>{post.date}</span>
                          <span className="text-lime-300">Published</span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-stone-100">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-stone-400">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/admin?edit=${post.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-white/30 hover:bg-white/5"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-white/14 px-4 py-2 text-sm font-medium text-stone-100 transition hover:border-white/30 hover:bg-white/5"
                      >
                        View
                      </Link>
                      <form action={deletePost}>
                        <input type="hidden" name="slug" value={post.slug} />
                        <SubmitButton
                          pendingLabel="Deleting..."
                          className="inline-flex items-center justify-center rounded-full border border-rose-400/20 px-4 py-2 text-sm font-medium text-rose-100 transition hover:border-rose-300/40 hover:bg-rose-400/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={unauthorized || !isConfigured}
                        >
                          Delete
                        </SubmitButton>
                      </form>
                    </div>
                  </article>
                ))
              )}
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
