"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  const sql = getDatabase();

  if (!sql) {
    redirectWithError("DATABASE_URL is not configured.");
  }

  if (!userId) {
    redirectWithError("Your session is not authorized for this action.");
  }

  const title = toText(formData.get("title"));
  const category = toText(formData.get("category")) || "Research";
  const excerpt = toText(formData.get("excerpt"));
  const content = toText(formData.get("content"));
  const tagsInput = toText(formData.get("tags"));
  const publishedAtInput = toText(formData.get("publishedAt"));

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
        TRUE,
        ${publishedAt}
      )
    `;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "23505"
    ) {
      redirectWithError("That slug already exists. Choose a different slug.");
    }

    redirectWithError("Failed to create the post in Neon.");
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}
