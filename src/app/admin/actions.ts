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
  redirect(`/admin?error=${encodeURIComponent(message)}`);
}

function formatDatabaseError(error: unknown, fallbackMessage: string) {
  if (!error || typeof error !== "object") {
    return fallbackMessage;
  }

  const code = "code" in error && typeof error.code === "string" ? error.code : null;
  const message =
    "message" in error && typeof error.message === "string"
      ? error.message
      : fallbackMessage;

  if (code === "23505") {
    return "That slug already exists. Choose a different slug.";
  }

  if (code === "42P01") {
    return "Neon table `posts` was not found. Run the SQL in neon/schema.sql first.";
  }

  if (code === "42703") {
    return "Neon schema is out of date. Re-run neon/schema.sql so the posts columns match the app.";
  }

  if (code === "42501") {
    return "Neon rejected the write due to database permissions.";
  }

  return `${fallbackMessage} (${message})`;
}

export async function createPost(formData: FormData) {
  const session = await requireAdminSession();
  const sql = getDatabase();

  if (!sql) {
    redirectWithError("DATABASE_URL is not configured.");
  }

  if (!session.ok) {
    redirectWithError(session.reason);
  }

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

  if (!slug) {
    redirectWithError("A valid slug could not be generated.");
  }

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  let publishedAt = new Date().toISOString();

  if (publishedAtInput) {
    const parsedDate = new Date(publishedAtInput);

    if (Number.isNaN(parsedDate.getTime())) {
      redirectWithError("Publish date must be a valid ISO date string.");
    }

    publishedAt = parsedDate.toISOString();
  }

  try {
    if (originalSlug) {
      await sql`
        UPDATE posts
        SET
          slug = ${slug},
          title = ${title},
          category = ${category},
          excerpt = ${excerpt},
          content = ${content},
          tags = ${tags},
          published = ${published},
          published_at = ${publishedAt},
          updated_at = NOW()
        WHERE slug = ${originalSlug}
      `;
    } else {
      await sql`
        INSERT INTO posts (
          slug,
          title,
          category,
          excerpt,
          content,
          tags,
          published,
          published_at
        )
        VALUES (
          ${slug},
          ${title},
          ${category},
          ${excerpt},
          ${content},
          ${tags},
          ${published},
          ${publishedAt}
        )
      `;
    }
  } catch (error) {
    redirectWithError(
      formatDatabaseError(
        error,
        originalSlug
          ? "Failed to update the post in Neon."
          : "Failed to create the post in Neon.",
      ),
    );
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}

export async function deletePost(formData: FormData) {
  const session = await requireAdminSession();
  const sql = getDatabase();

  if (!sql) {
    redirectWithError("DATABASE_URL is not configured.");
  }

  if (!session.ok) {
    redirectWithError(session.reason);
  }

  const slug = toText(formData.get("slug"));

  if (!slug) {
    redirectWithError("A slug is required to delete a post.");
  }

  try {
    await sql`
      DELETE FROM posts
      WHERE slug = ${slug}
    `;
  } catch (error) {
    redirectWithError(
      formatDatabaseError(error, "Failed to delete the post from Neon."),
    );
  }

  revalidatePath("/blog");
  revalidatePath("/admin");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin");
}
