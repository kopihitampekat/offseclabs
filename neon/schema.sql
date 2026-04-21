CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Research',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_published_at_idx ON posts (published_at DESC);

INSERT INTO posts (slug, title, category, excerpt, content, tags, published, published_at)
VALUES
  (
    'building-offseclabs',
    'Building OffSecLabs',
    'Journal',
    'Why the site starts minimal, what belongs in the research archive, and where Neon fits once the content layer expands.',
    'OffSecLabs starts as a small publishing surface. The first goal is clarity: a fast homepage, a readable archive, and a stack that can grow without a redesign.

Vercel handles deployment and previews well for this kind of content site. Neon becomes useful once posts, tags, notes, and lab entries need structured storage and simple querying.

The initial version stays intentionally small so future changes are additive instead of corrective.',
    ARRAY['platform', 'notes', 'architecture'],
    TRUE,
    NOW()
  ),
  (
    'research-pipeline',
    'Research Pipeline',
    'Research',
    'A practical workflow for turning lab notes into publishable offensive security writeups with minimal friction.',
    'A useful research pipeline is mostly about consistency. Capture observations early, reduce them into repeatable notes, and only then shape them into public content.

For OffSecLabs, the content model is simple enough to start with posts, categories, excerpts, and tags. That keeps the first Neon schema small while leaving room for richer content later.

The point is not to overbuild the CMS. The point is to preserve useful research and ship it quickly.',
    ARRAY['workflow', 'publishing', 'research'],
    TRUE,
    NOW() - INTERVAL '3 days'
  )
ON CONFLICT (slug) DO NOTHING;
