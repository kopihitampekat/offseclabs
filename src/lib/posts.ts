import "server-only";

import { cache } from "react";
import { getDatabase } from "@/lib/db";

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: string;
};

export type AdminPost = Post & {
  published: boolean;
};

const fallbackPosts: Post[] = [
  {
    slug: "building-offseclabs",
    title: "Building OffSecLabs",
    category: "Journal",
    date: "2026-04-21",
    excerpt:
      "Why the site starts minimal, what belongs in the research archive, and where Neon fits once the content layer expands.",
    tags: ["platform", "notes", "architecture"],
    content: `OffSecLabs starts as a small publishing surface. The first goal is clarity: a fast homepage, a readable archive, and a stack that can grow without a redesign.

Vercel handles deployment and previews well for this kind of content site. Neon becomes useful once posts, tags, notes, and lab entries need structured storage and simple querying.

The initial version stays intentionally small so future changes are additive instead of corrective.`,
  },
  {
    slug: "research-pipeline",
    title: "Research Pipeline",
    category: "Research",
    date: "2026-04-18",
    excerpt:
      "A practical workflow for turning lab notes into publishable offensive security writeups with minimal friction.",
    tags: ["workflow", "publishing", "research"],
    content: `A useful research pipeline is mostly about consistency. Capture observations early, reduce them into repeatable notes, and only then shape them into public content.

For OffSecLabs, the content model is simple enough to start with posts, categories, excerpts, and tags. That keeps the first Neon schema small while leaving room for richer content later.

The point is not to overbuild the CMS. The point is to preserve useful research and ship it quickly.`,
  },
];

type PostRow = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  tags: string[] | null;
  content: string;
  published?: boolean;
};

const getSql = cache(() => {
  return getDatabase();
});

function normalizePost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.date,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    content: row.content,
  };
}

function normalizeAdminPost(row: PostRow): AdminPost {
  return {
    ...normalizePost(row),
    published: row.published ?? true,
  };
}

const getPostsFromDatabase = cache(async (): Promise<Post[] | null> => {
  const sql = getSql();

  if (!sql) {
    return null;
  }

  try {
    const rows = (await sql`
      SELECT
        slug,
        title,
        category,
        TO_CHAR(published_at, 'YYYY-MM-DD') AS date,
        excerpt,
        COALESCE(tags, ARRAY[]::TEXT[]) AS tags,
        content
      FROM posts
      WHERE published = TRUE
      ORDER BY published_at DESC
    `) as PostRow[];

    return rows.map(normalizePost);
  } catch {
    return null;
  }
});

export const getAllPosts = cache(async (): Promise<Post[]> => {
  const dbPosts = await getPostsFromDatabase();
  return dbPosts && dbPosts.length > 0 ? dbPosts : fallbackPosts;
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const sql = getSql();

  if (!sql) {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }

  try {
    const rows = (await sql`
      SELECT
        slug,
        title,
        category,
        TO_CHAR(published_at, 'YYYY-MM-DD') AS date,
        excerpt,
        COALESCE(tags, ARRAY[]::TEXT[]) AS tags,
        content
      FROM posts
      WHERE slug = ${slug} AND published = TRUE
      LIMIT 1
    `) as PostRow[];

    const post = rows[0];
    return post ? normalizePost(post) : null;
  } catch {
    return fallbackPosts.find((post) => post.slug === slug) ?? null;
  }
});

export const getAdminPosts = cache(async (): Promise<AdminPost[]> => {
  const sql = getSql();

  if (!sql) {
    return fallbackPosts.map((post) => ({
      ...post,
      published: true,
    }));
  }

  try {
    const rows = (await sql`
      SELECT
        slug,
        title,
        category,
        TO_CHAR(published_at, 'YYYY-MM-DD') AS date,
        excerpt,
        COALESCE(tags, ARRAY[]::TEXT[]) AS tags,
        content,
        published
      FROM posts
      ORDER BY published_at DESC
    `) as PostRow[];

    return rows.map(normalizeAdminPost);
  } catch {
    return fallbackPosts.map((post) => ({
      ...post,
      published: true,
    }));
  }
});
