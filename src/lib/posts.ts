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
  readingTime: number;
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
    content: `# Executive Summary

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

That question matters because administrative systems often reveal more than intended:

| Surface | Common weak signal | Why it matters |
| --- | --- | --- |
| Admin portal | Distinct branding or role language | Confirms privileged workflow boundaries |
| Support console | Verbose error responses | Exposes stack behavior and identifier formats |
| Staging app | Drift from prod controls | Creates lower-friction entry points for testing |
| Static assets | Source maps or internal labels | Leaks implementation detail and route names |

## Methodology

### 1. Build The Surface Inventory

Start with a plain inventory of internet-facing hostnames that appear to belong to the target. The useful output is not a huge list. The useful output is a **labeled list** that separates probable public product surfaces from likely operational surfaces.

A practical labeling model:

- public-app
- auth
- admin
- support
- staging
- cdn
- docs
- unknown

The objective is pattern detection. If multiple properties share naming conventions like admin, ops, console, manage, or support, that usually indicates a real operational boundary worth reviewing.

### 2. Compare Public And Privileged Entry Points

Once the likely privileged surfaces are identified, compare them against the public application in four categories:

1. Response structure
2. Asset exposure
3. Authentication framing
4. Error handling

Useful questions:

- Does the admin surface identify the IdP or auth mode before login?
- Are role names or internal tenancy terms exposed in page copy?
- Do static JavaScript bundles include internal route names or feature flags?
- Do errors distinguish between unknown tenant, unknown user, and unauthorized role?

This stage is often where research quality is won or lost. Good notes here create strong defensive recommendations later.

### 3. Measure Drift

Surface drift is where many SaaS teams lose control. Production may be clean while adjacent environments lag behind.

Common drift categories:

- staging routes still indexed by search engines
- support tools using older asset pipelines
- retired subdomains still resolving through third-party platforms
- preview deployments inheriting different headers or auth behavior

A small amount of drift is normal. What matters is whether drift reveals **organizational truth** about how privileged systems are segmented.

## Key Findings Pattern

Across several authorized reviews, the same pattern keeps repeating:

### Finding 1: Admin Interfaces Leak Internal Vocabulary

Admin portals often expose terms that never appear in the customer-facing product:

- tenant classes
- support escalation labels
- region identifiers
- internal environment names

None of this is a breach by itself. But it lowers the cost of social engineering, credential targeting, and infrastructure correlation.

### Finding 2: Static Assets Reveal Hidden Route Structure

Bundled assets, source maps, or verbose client errors can expose route patterns such as:

~~~txt
/admin/audit
/admin/users
/support/tickets
/ops/feature-flags
~~~

Even when those routes are protected correctly, the route naming alone can reveal the shape of internal workflows.

### Finding 3: Error Handling Is Often More Revealing Than The UI

Many teams secure the interface and forget the negative paths. The highest-quality signals often come from:

- differences between 401, 403, and 404 behavior
- role-specific denial messages
- tenant enumeration through structured error text
- inconsistent redirect chains between environments

These patterns help defenders understand where trust assumptions are leaking into the external interface.

## Sample Analyst Notes

Below is an example of the kind of structured note worth preserving during research:

~~~md
Surface: support.example.tld
Classification: likely privileged operational interface
Observed auth pattern: third-party SSO redirect
Pre-auth leak: tenant identifier reflected in response copy
Static asset note: bundle references "case-management" and "agentQueue"
Risk: medium informational exposure
Defensive recommendation: standardize auth error responses and remove internal labels from public bundles
~~~

That kind of note is much more valuable than a noisy dump of URLs because it already translates observation into action.

## Defensive Recommendations

The best recommendations from this research theme are operational, not cosmetic.

### Standardize Pre-Auth Responses

Administrative and support surfaces should avoid returning different messages for:

- unknown tenant
- unknown user
- unauthorized user
- invalid session state

Uniform negative-path behavior reduces enumeration value significantly.

### Reduce Internal Terminology Exposure

Remove or abstract:

- internal role labels
- environment names
- operational route labels
- support queue terminology

This does not prevent a determined researcher from learning system shape, but it raises the cost meaningfully.

### Audit Environment Drift Monthly

A lightweight recurring review usually catches the majority of issues:

1. enumerate target-owned subdomains
2. verify ownership of third-party hosted properties
3. compare auth and header behavior across public, admin, and staging routes
4. review bundles for source maps and internal labels

### Treat Informational Leaks As Chainable Findings

Many organizations dismiss these observations because they are not immediately exploitable. That is the wrong model. Attackers rarely rely on a single catastrophic weakness. They compound small advantages until access becomes practical.

## What Good Looks Like

A mature SaaS deployment usually has these properties:

- privileged surfaces are difficult to distinguish pre-auth
- unauthorized and invalid states look nearly identical externally
- staging and support tools follow the same auth posture as production
- bundles and static assets do not reveal internal operational language
- retired properties are removed completely instead of left dormant

## Closing Notes

The most useful offensive security research is often the kind that narrows defender uncertainty. This topic is a good example. Exposed administrative surfaces are rarely one-bug stories. They are usually **signal-aggregation stories**.

That makes them ideal for long-form research posts:

- the methodology is reusable
- the observations are concrete
- the recommendations are high signal
- the outcome is actionable for engineering, security, and platform teams

For OffSecLabs, this is the kind of research note worth publishing: technically informed, operationally grounded, and immediately useful without crossing into reckless detail.`,
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
