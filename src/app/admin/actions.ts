"use server";

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

export async function createPost(formData: FormData) {
  const adminSecret = process.env.ADMIN_SECRET;
  const sql = getDatabase();

  if (!adminSecret) {
    throw new Error("ADMIN_SECRET is not configured.");
  }

  if (!sql) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const submittedSecret = toText(formData.get("adminSecret"));

  if (submittedSecret !== adminSecret) {
    throw new Error("Unauthorized.");
  }

  const title = toText(formData.get("title"));
  const category = toText(formData.get("category")) || "Research";
  const excerpt = toText(formData.get("excerpt"));
  const content = toText(formData.get("content"));
  const tagsInput = toText(formData.get("tags"));
  const publishedAtInput = toText(formData.get("publishedAt"));

  if (!title || !excerpt || !content) {
    throw new Error("Title, excerpt, and content are required.");
  }

  const slug = slugify(toText(formData.get("slug")) || title);

  if (!slug) {
    throw new Error("A valid slug could not be generated.");
  }

  const tags = tagsInput
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const publishedAt = publishedAtInput
    ? new Date(publishedAtInput).toISOString()
    : new Date().toISOString();

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

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect(`/blog/${slug}`);
}
