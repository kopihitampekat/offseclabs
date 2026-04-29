import type { Metadata } from "next";
import Link from "next/link";
import { MarkdownEditor } from "@/app/v2/admin/markdown-editor";
import { createPost, deletePost } from "@/app/v2/admin/actions";
import { requireAdminSession } from "@/lib/admin";
import { getAdminPosts } from "@/v2/lib/posts";
import { StatsCard } from "@/v2/components/admin/stats-card";
import { DeleteButton } from "@/v2/components/admin/delete-button";
import { siteConfig } from "@/v2/lib/config";
import { TagChip } from "@/v2/components/shared/tag-chip";

export const metadata: Metadata = {
  title: "Admin",
  description: `Admin panel for ${siteConfig.name}.`,
};

const fields = [
  { name: "title", label: "Title", placeholder: "Detection Bypass Notes" },
  { name: "slug", label: "Slug", placeholder: "detection-bypass-notes" },
  { name: "category", label: "Category", placeholder: "Research" },
  {
    name: "publishedAt",
    label: "Publish date",
    placeholder: "",
    type: "datetime-local",
  },
  { name: "tags", label: "Tags", placeholder: "neon, admin, publishing" },
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
  const primaryEmail = session.ok
    ? session.email ?? session.user.id
    : "unknown";

  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-10">
        <header className="border-b border-white/[0.06] pb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-stone-50">
              {editingPost ? "Edit post" : "Admin"}
            </h1>
            <span className="text-xs text-stone-500">
              Signed in as <span className="text-stone-300">{primaryEmail}</span>
            </span>
          </div>
        </header>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatsCard label="Total entries" value={posts.length} />
          <StatsCard label="Drafts" value={draftPosts.length} color="text-amber-300" />
          <StatsCard
            label="Published"
            value={publishedPosts.length}
            color="text-lime-300"
          />
        </div>

        {unauthorized && (
          <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200">
            {session.reason} Add your email to <code>ADMIN_EMAILS</code> to
            access this panel.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200">
            {error}
          </div>
        )}

        {!isConfigured && (
          <div className="mt-6 rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-4 text-sm text-amber-200">
            Set <code>DATABASE_URL</code> before using this panel.
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form action={createPost} className="space-y-5">
            <input
              type="hidden"
              name="originalSlug"
              value={editingPost?.slug ?? ""}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <label
                  key={field.name}
                  className="block rounded-xl border border-white/8 bg-surface p-5"
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
                    className="mt-2 w-full rounded-lg border border-white/8 bg-black/20 px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-lime-300/40"
                    placeholder={field.placeholder}
                  />
                </label>
              ))}
            </div>

            <label className="flex items-center justify-between rounded-xl border border-white/8 bg-surface p-5">
              <div>
                <span className="block text-sm font-medium text-stone-200">
                  Publish now
                </span>
                <span className="mt-1 block text-xs text-stone-500">
                  Turn off to save as draft
                </span>
              </div>
              <input
                type="checkbox"
                name="published"
                defaultChecked={editingPost ? editingPost.published : true}
                className="h-5 w-5 rounded accent-lime-300"
              />
            </label>

            <label className="block rounded-xl border border-white/8 bg-surface p-5">
              <span className="text-sm font-medium text-stone-200">Excerpt</span>
              <textarea
                required
                name="excerpt"
                rows={3}
                defaultValue={editingPost?.excerpt}
                className="mt-2 w-full rounded-lg border border-white/8 bg-black/20 px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-lime-300/40"
                placeholder="Short summary for the archive."
              />
            </label>

            <MarkdownEditor defaultValue={editingPost?.content} />

            <div className="flex gap-3">
              <DeleteButton
                
                disabled={!isConfigured || unauthorized}
                className="rounded-full bg-lime-300 px-6 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {editingPost ? "Save changes" : "Create post"}
              </DeleteButton>
              <Link
                href={editingPost ? "/v2/admin" : "/v2/blog"}
                className="rounded-full border border-white/14 px-6 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-white/24 hover:bg-white/5"
              >
                {editingPost ? "Cancel" : "View archive"}
              </Link>
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-xl border border-white/8 bg-surface p-5">
              <h2 className="text-base font-semibold text-stone-100">
                Existing posts
              </h2>
              <p className="mt-2 text-xs text-stone-500">
                Drafts and published notes.
              </p>
            </div>

            {draftPosts.length > 0 && (
              <section className="space-y-3">
                <div className="rounded-xl border border-amber-300/20 bg-amber-300/[0.06] p-3">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-amber-200">
                    Drafts ({draftPosts.length})
                  </p>
                </div>
                {draftPosts.map((post) => (
                  <article key={post.slug} className="card p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                      <span className="text-amber-300">Draft</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-stone-100">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/v2/admin?edit=${post.slug}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 transition hover:bg-white/5"
                      >
                        Edit
                      </Link>
                      <form action={deletePost} key={post.slug}>
                        <input type="hidden" name="slug" value={post.slug} />
                        <DeleteButton
                          
                          disabled={unauthorized || !isConfigured}
                          className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:opacity-50"
                        >
                          Delete
                        </DeleteButton>
                      </form>
                    </div>
                  </article>
                ))}
              </section>
            )}

            <section className="space-y-3">
              <div className="rounded-xl border border-lime-300/20 bg-lime-300/[0.06] p-3">
                <p className="text-[10px] uppercase tracking-[0.24em] text-lime-200">
                  Published ({publishedPosts.length})
                </p>
              </div>
              {publishedPosts.length === 0 ? (
                <div className="rounded-xl border border-white/8 bg-surface p-4 text-sm text-stone-500">
                  No published posts yet.
                </div>
              ) : (
                publishedPosts.map((post) => (
                  <article key={post.slug} className="card p-4">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      <span>{post.category}</span>
                      <span>{post.date}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-stone-100">
                      {post.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <TagChip key={tag}>{tag}</TagChip>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/v2/admin?edit=${post.slug}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 transition hover:bg-white/5"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/v2/blog/${post.slug}`}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-stone-300 transition hover:bg-white/5"
                      >
                        View
                      </Link>
                      <form action={deletePost} key={post.slug}>
                        <input type="hidden" name="slug" value={post.slug} />
                        <DeleteButton
                          
                          disabled={unauthorized || !isConfigured}
                          className="rounded-lg border border-rose-400/20 px-3 py-1.5 text-xs text-rose-200 transition hover:bg-rose-400/[0.06] disabled:opacity-50"
                        >
                          Delete
                        </DeleteButton>
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
