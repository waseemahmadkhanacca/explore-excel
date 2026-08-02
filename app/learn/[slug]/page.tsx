import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleBody from '@/components/ArticleBody';
import { JsonLd } from '@/lib/json-ld';
import { getGuide, getGuideSlugs, getGuides } from '@/lib/articles';
import { getAllFormulas } from '@/lib/content';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/learn/${g.slug}/` },
    openGraph: {
      title: g.title,
      description: g.description,
      type: 'article',
      images: ['/og-image.png'],
      locale: 'en_GB',
    },
  };
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const formulas = getAllFormulas();
  const related = formulas.filter((f) => guide.related.includes(f.name));
  const all = getGuides();
  const idx = all.findIndex((g) => g.slug === guide.slug);
  const next = all[idx + 1];

  const schemas = [
    articleSchema({
      slug: guide.slug,
      name: guide.title,
      description: guide.description,
      updated: guide.updated,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Learn', path: '/learn/' },
      { name: guide.title, path: `/learn/${guide.slug}/` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <div className="crumbs-wrap">
        <nav className="shell crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/learn/">Learn</Link>
          <span aria-hidden="true">/</span>
          <span className="cur">{guide.title}</span>
        </nav>
      </div>

      <div className="prose-wrap">
        <article>
          <span className="tg" style={{ display: 'inline-block', marginBottom: 14 }}>
            {guide.level}
          </span>
          <h1>{guide.title}</h1>
          <p className="lede">{guide.summary}</p>
          <div className="art-meta" style={{ marginBottom: 34 }}>
            <span>
              Updated{' '}
              {new Date(guide.updated).toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span>By Waseem, ACCA</span>
            <span aria-hidden="true">·</span>
            <span>{guide.readingTime} min read</span>
          </div>

          <ArticleBody source={guide.body} />

          {related.length > 0 && (
            <>
              <h2 id="formulas-mentioned">Formulas mentioned here</h2>
              <div className="fgrid">
                {related.map((f) => (
                  <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
                    <div className="fn">{f.name}</div>
                    <div className="fd">{f.summary}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {next && (
            <div className="next-up">
              <div className="next-lab">Next in this series</div>
              <Link href={`/learn/${next.slug}/`}>
                <strong>{next.title}</strong>
                <span>{next.summary}</span>
              </Link>
            </div>
          )}
        </article>
      </div>
    </>
  );
}
