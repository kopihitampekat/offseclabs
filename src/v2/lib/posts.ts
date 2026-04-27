import "server-only";

import { cache } from "react";
import { getDatabase } from "@/lib/db";
import type { Post, PaginatedResult } from "@/v2/lib/types";

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
    readingTime: 1,
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
    readingTime: 1,
  },
  {
    slug: "exposed-admin-surfaces-in-modern-saas",
    title: "Exposed Admin Surfaces In Modern SaaS: A Research Workflow",
    category: "Research",
    date: "2026-04-16",
    excerpt:
      "A sample long-form research note on how to evaluate exposed administrative surfaces, prioritize weak signals, and turn findings into concrete defensive recommendations.",
    tags: ["attack surface", "saas", "research", "defense"],
    content: `## Executive Summary

This research note documents a **safe and repeatable** workflow for evaluating exposed administrative surfaces in modern SaaS environments. The goal is not to publish exploit chains or bypass recipes. The goal is to show how offensive security research can identify weak operational patterns early enough for engineering teams to fix them.

In repeated assessments, the highest-value findings rarely come from a single critical bug. They usually come from **stacked weaknesses**:

- overly descriptive admin login interfaces
- inconsistent subdomain ownership and retirement
- weak segregation between public and privileged routes
- observability leaks in error messages, headers, and static assets
- support and staging workflows that drift away from production controls

Taken individually, each issue may look minor. Combined, they create a high-confidence map of internal operational structure.

## Scope And Assumptions

This post assumes an authorized research context such as:

- an internal attack surface review
- a sanctioned red team exercise
- a bug bounty program that explicitly permits reconnaissance on target-owned assets

The workflow below is designed to stay on the **identification and validation** side of testing. It avoids credential attacks, payload delivery, or steps that would move from research into intrusion.

## Research Question

The core question for this engagement pattern is simple:

> How much can an external observer learn about privileged SaaS surfaces before authentication?

That question matters because administrative systems often reveal more than intended.

## Methodology

### 1. Build The Surface Inventory

Start with a plain inventory of internet-facing hostnames that appear to belong to the target. The useful output is not a huge list. The useful output is a **labeled list** that separates probable public product surfaces from likely operational surfaces.

### 2. Compare Public And Privileged Entry Points

Once the likely privileged surfaces are identified, compare them against the public application in four categories:

1. Response structure
2. Asset exposure
3. Authentication framing
4. Error handling

### 3. Measure Drift

Surface drift is where many SaaS teams lose control. Production may be clean while adjacent environments lag behind.

## Key Findings Pattern

Across several authorized reviews, the same pattern keeps repeating:

### Finding 1: Admin Interfaces Leak Internal Vocabulary

Admin portals often expose terms that never appear in the customer-facing product.

### Finding 2: Static Assets Reveal Hidden Route Structure

Bundled assets, source maps, or verbose client errors can expose route patterns.

### Finding 3: Error Handling Is Often More Revealing Than The UI

Many teams secure the interface and forget the negative paths.

## Defensive Recommendations

The best recommendations from this research theme are operational, not cosmetic.

### Standardize Pre-Auth Responses

Administrative and support surfaces should avoid returning different messages for unknown tenant, unknown user, unauthorized user, and invalid session state.

### Reduce Internal Terminology Exposure

Remove or abstract internal role labels, environment names, operational route labels, and support queue terminology.

### Audit Environment Drift Monthly

A lightweight recurring review usually catches the majority of issues.

## Closing Notes

The most useful offensive security research is often the kind that narrows defender uncertainty. This topic is a good example. Exposed administrative surfaces are rarely one-bug stories. They are usually **signal-aggregation stories**.`,
    readingTime: 9,
  },
];

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/\W/g, " ");
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function normalizePost(row: PostRow): Post {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    date: row.date,
    excerpt: row.excerpt,
    tags: row.tags ?? [],
    content: row.content,
    readingTime: calculateReadingTime(row.content),
  };
}

const getSql = cache(() => {
  return getDatabase();
});

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

export const getPostBySlug = cache(
  async (slug: string): Promise<Post | null> => {
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
  }
);

export const getPostCount = cache(async (): Promise<number> => {
  const posts = await getAllPosts();
  return posts.length;
});

export const getAllCategories = cache(async (): Promise<string[]> => {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
});

export const getPostsByCategory = cache(
  async (category: string): Promise<Post[]> => {
    const posts = await getAllPosts();
    return posts.filter(
      (post) => post.category.toLowerCase() === category.toLowerCase()
    );
  }
);

export const getRelatedPosts = cache(
  async (slug: string, limit = 3): Promise<Post[]> => {
    const posts = await getAllPosts();
    const current = posts.find((p) => p.slug === slug);

    if (!current) {
      return posts.slice(0, limit);
    }

    const scored = posts
      .filter((p) => p.slug !== slug)
      .map((post) => {
        const sharedTags = post.tags.filter((tag) =>
          current.tags.includes(tag)
        ).length;
        const sameCategory = post.category === current.category ? 2 : 0;
        return { post, score: sharedTags + sameCategory };
      })
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, limit).map((s) => s.post);
  }
);

export const getPaginatedPosts = cache(
  async (options: {
    cursor?: string;
    limit?: number;
    category?: string;
  }): Promise<PaginatedResult<Post>> => {
    const limit = options.limit ?? 12;
    const posts = await getAllPosts();

    let filtered = options.category
      ? posts.filter(
          (p) => p.category.toLowerCase() === options.category!.toLowerCase()
        )
      : posts;

    if (options.cursor) {
      const cursorIndex = filtered.findIndex(
        (p) => p.date === options.cursor
      );
      if (cursorIndex >= 0) {
        filtered = filtered.slice(cursorIndex + 1);
      }
    }

    const hasMore = filtered.length > limit;
    const items = filtered.slice(0, limit);
    const nextCursor = hasMore
      ? items[items.length - 1]?.date ?? null
      : null;

    return { items, hasMore, nextCursor };
  }
);

export const getAdminPosts = cache(
  async (): Promise<
    (Post & { published: boolean })[]
  > => {
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

      return rows.map((row) => ({
        ...normalizePost(row),
        published: row.published ?? true,
      }));
    } catch {
      return fallbackPosts.map((post) => ({
        ...post,
        published: true,
      }));
    }
  }
);
