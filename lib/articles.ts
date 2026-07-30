import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

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

function loadFrom(dir: string): Article[] {
  const full = path.join(process.cwd(), 'content', dir);
  if (!fs.existsSync(full)) return [];

  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), 'utf8'));
      const d = data as Record<string, unknown>;
      return {
        slug: String(d.slug ?? file.replace(/\.mdx$/, '')),
        title: String(d.title),
        summary: String(d.summary),
        description: String(d.description),
        updated: String(d.updated),
        readingTime: Number(d.readingTime ?? 5),
        related: (d.related as string[]) ?? [],
        level: d.level as string | undefined,
        category: d.category as string | undefined,
        body: content,
      };
    });
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

export function getGuides(): Article[] {
  const all = loadFrom('guides');
  return all.sort((a, b) => {
    const ai = GUIDE_ORDER.indexOf(a.slug);
    const bi = GUIDE_ORDER.indexOf(b.slug);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

export function getGuide(slug: string): Article | null {
  return getGuides().find((g) => g.slug === slug) ?? null;
}

export function getGuideSlugs(): string[] {
  return getGuides().map((g) => g.slug);
}

/** Posts are newest first. */
export function getPosts(): Article[] {
  return loadFrom('blog').sort((a, b) => b.updated.localeCompare(a.updated));
}

export function getPost(slug: string): Article | null {
  return getPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostSlugs(): string[] {
  return getPosts().map((p) => p.slug);
}
