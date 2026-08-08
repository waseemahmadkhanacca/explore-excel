import type { MetadataRoute } from 'next';
import { getAllFormulas } from '@/lib/content';
import { getGuides, getPosts } from '@/lib/articles';
import { TEMPLATES } from '@/lib/templates';
import { CATEGORIES } from '@/lib/categories';
import { SITE } from '@/lib/schema';

export default function sitemap(): MetadataRoute.Sitemap {
  const formulas = getAllFormulas().map((f) => ({
    url: `${SITE.url}/formulas/${f.slug}/`,
    lastModified: new Date(f.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Priority sits above the individual formula pages: a category page targets a
  // broader term and is the better entry point into the library.
  const categories = CATEGORIES.map((c) => ({
    url: `${SITE.url}/formulas/category/${c.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  const staticPages = [
    { path: '/', priority: 1.0, freq: 'weekly' as const },
    { path: '/formulas/', priority: 0.9, freq: 'weekly' as const },
    { path: '/templates/', priority: 0.9, freq: 'weekly' as const },
    { path: '/ai/formula-assistant/', priority: 0.8, freq: 'monthly' as const },
    { path: '/learn/', priority: 0.7, freq: 'monthly' as const },
    { path: '/blog/', priority: 0.7, freq: 'weekly' as const },
    { path: '/about/', priority: 0.4, freq: 'yearly' as const },
    { path: '/contact/', priority: 0.4, freq: 'yearly' as const },
    { path: '/privacy/', priority: 0.2, freq: 'yearly' as const },
    { path: '/terms/', priority: 0.2, freq: 'yearly' as const },
  ].map((p) => ({
    url: `${SITE.url}${p.path}`,
    lastModified: new Date(),
    changeFrequency: p.freq,
    priority: p.priority,
  }));

  const guides = getGuides().map((g) => ({
    url: `${SITE.url}/learn/${g.slug}/`,
    lastModified: new Date(g.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const posts = getPosts().map((p) => ({
    url: `${SITE.url}/blog/${p.slug}/`,
    lastModified: new Date(p.updated),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const templates = TEMPLATES.map((t) => ({
    url: `${SITE.url}/templates/${t.slug}/`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categories, ...formulas, ...guides, ...posts, ...templates];
}
