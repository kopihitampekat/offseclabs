"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/admin";
import { getDatabase } from "@/lib/db";

function toText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function redirectWithError(message: string): never {
  redirect(`/v2/admin?error=${encodeURIComponent(message)}`);
}

function formatDatabaseError(error: unknown, fallback: string) {
  if (!error || typeof error !== "object") return fallback;

  const code =
    "code" in error && typeof error.code === "string" ? error.code : null;
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : fallback;

  if (code === "23505") return "Slug already exists. Choose a different one.";
  if (code === "42P01") return "Table not found. Run the Neon schema first.";
  if (code === "42703")
    return "Schema mismatch. Re-run the Neon schema to update columns.";
  if (code === "42501") return "Database write permission denied.";

  return `${fallback} (${message})`;
}

export async function createPost(formData: FormData) {
  const session = await requireAdminSession();
  const sql = getDatabase();

  if (!sql) redirectWithError("DATABASE_URL is not configured.");
  if (!session.ok) redirectWithError(session.reason);

  const originalSlug = toText(formData.get("originalSlug"));
  const title = toText(formData.get("title"));
  const category = toText(formData.get("category")) || "Research";
  const excerpt = toText(formData.get("excerpt"));
  const content = toText(formData.get("content"));
  const tagsInput = toText(formData.get("tags"));
  const publishedAtInput = toText(formData.get("publishedAt"));
  const published = formData.get("published") === "on";

  if (!title || !excerpt || !content) {
    redirectWithError("Title, excerpt, and content are required.");
  }

  const slug = slugify(toText(formData.get("slug")) || title);
  if (!slug) redirectWithError("Could not generate a valid slug.");

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  let publishedAt = new Date().toISOString();
  if (publishedAtInput) {
    const parsed = new Date(publishedAtInput);
    if (Number.isNaN(parsed.getTime())) {
      redirectWithError("Invalid publish date.");
    }
    publishedAt = parsed.toISOString();
  }

  try {
    if (originalSlug) {
      await sql`
        UPDATE posts SET
          slug = ${slug}, title = ${title}, category = ${category},
          excerpt = ${excerpt}, content = ${content}, tags = ${tags},
          published = ${published}, published_at = ${publishedAt}, updated_at = NOW()
        WHERE slug = ${originalSlug}
      `;
    } else {
      await sql`
        INSERT INTO posts (slug, title, category, excerpt, content, tags, published, published_at)
        VALUES (${slug}, ${title}, ${category}, ${excerpt}, ${content}, ${tags}, ${published}, ${publishedAt})
      `;
    }
  } catch (error) {
    redirectWithError(
      formatDatabaseError(error, originalSlug ? "Update failed." : "Create failed.")
    );
  }

  revalidatePath("/v2/blog");
  revalidatePath("/v2/admin");
  revalidatePath(`/v2/blog/${slug}`);
  redirect(`/v2/blog/${slug}`);
}

export async function deletePost(formData: FormData) {
  const session = await requireAdminSession();
  const sql = getDatabase();

  if (!sql) redirectWithError("DATABASE_URL is not configured.");
  if (!session.ok) redirectWithError(session.reason);

  const slug = toText(formData.get("slug"));
  if (!slug) redirectWithError("Slug is required.");

  try {
    await sql`DELETE FROM posts WHERE slug = ${slug}`;
  } catch (error) {
    redirectWithError(formatDatabaseError(error, "Delete failed."));
  }

  revalidatePath("/v2/blog");
  revalidatePath("/v2/admin");
  revalidatePath(`/v2/blog/${slug}`);
  redirect("/v2/admin");
}
