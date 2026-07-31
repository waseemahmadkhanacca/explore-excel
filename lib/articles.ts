import { GUIDES, BLOG_POSTS } from './content-data.generated';

export interface Article {
  slug: string;
  title: string;
  summary: string;
  description: string;
  updated: string;
  readingTime: number;
  related: string[];
  body: string;
  /** Guides only. */
  level?: string;
  /** Blog posts only. */
  category?: string;
}

function toArticle(slug: string, data: Record<string, unknown>, body: string): Article {
  return {
    slug: String(data.slug ?? slug),
    title: String(data.title),
    summary: String(data.summary),
    description: String(data.description),
    updated: String(data.updated),
    readingTime: Number(data.readingTime ?? 5),
    related: (data.related as string[]) ?? [],
    level: data.level as string | undefined,
    category: data.category as string | undefined,
    body,
  };
}

/** Guides keep a deliberate order — beginner to advanced, not alphabetical. */
const GUIDE_ORDER = [
  'excel-basics',
  'formulas',
  'pivot-tables',
  'dashboards',
  'power-query',
  'interview-prep',
];

// Parsed once, at module load, from the bundled data — no disk access, which
// is what makes this safe to run inside a Cloudflare Worker. See
// scripts/build-content.js for why runtime fs reads do not work there.
const ALL_GUIDES: Article[] = GUIDES.map((g) =>
  toArticle(g.slug, g.data as Record<string, unknown>, g.body)
).sort((a, b) => {
  const ai = GUIDE_ORDER.indexOf(a.slug);
  const bi = GUIDE_ORDER.indexOf(b.slug);
  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
});

const ALL_POSTS: Article[] = BLOG_POSTS.map((p) =>
  toArticle(p.slug, p.data as Record<string, unknown>, p.body)
).sort((a, b) => b.updated.localeCompare(a.updated));

const GUIDES_BY_SLUG = new Map(ALL_GUIDES.map((g) => [g.slug, g]));
const POSTS_BY_SLUG = new Map(ALL_POSTS.map((p) => [p.slug, p]));

export function getGuides(): Article[] {
  return ALL_GUIDES;
}

export function getGuide(slug: string): Article | null {
  return GUIDES_BY_SLUG.get(slug) ?? null;
}

export function getGuideSlugs(): string[] {
  return ALL_GUIDES.map((g) => g.slug);
}

export function getPosts(): Article[] {
  return ALL_POSTS;
}

export function getPost(slug: string): Article | null {
  return POSTS_BY_SLUG.get(slug) ?? null;
}

export function getPostSlugs(): string[] {
  return ALL_POSTS.map((p) => p.slug);
}
