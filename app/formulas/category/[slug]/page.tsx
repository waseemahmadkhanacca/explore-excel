import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/lib/json-ld';
import { CATEGORIES, getCategory } from '@/lib/categories';
import { getAllFormulas } from '@/lib/content';
import { breadcrumbSchema, collectionSchema } from '@/lib/schema';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) return {};
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: `/formulas/category/${c.slug}/` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: 'website',
      images: ['/og-image.png'],
      locale: 'en_US',
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const all = getAllFormulas();
  const inCategory = all.filter((f) => f.category === category.category);
  const featured = category.startWith
    .map((name) => inCategory.find((f) => f.name === name))
    .filter((f): f is (typeof inCategory)[number] => f !== undefined);
  const others = inCategory.filter((f) => !category.startWith.includes(f.name));

  const schemas = [
    collectionSchema(category.h1, category.description, `/formulas/category/${category.slug}/`),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Formulas', path: '/formulas/' },
      { name: category.h1, path: `/formulas/category/${category.slug}/` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <div className="crumbs-wrap">
        <nav className="shell crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/formulas/">Formulas</Link>
          <span aria-hidden="true">/</span>
          <span className="cur">{category.h1}</span>
        </nav>
      </div>

      <section className="sec">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-lab">
              {inCategory.length} function{inCategory.length === 1 ? '' : 's'}
            </span>
            <h1>{category.h1}</h1>
          </div>

          <div className="cat-intro">
            {category.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}

            <div className="cal cal-warning">
              <b>{category.pitfall.title}</b>
              {category.pitfall.body}
            </div>
          </div>

          {featured.length > 0 && (
            <>
              <h2 id="start-here">Start here</h2>
              <div className="fgrid">
                {featured.map((f) => (
                  <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
                    <div className="fn">{f.name}</div>
                    <div className="fd">{f.summary}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {others.length > 0 && (
            <>
              <h2 id="all">
                The rest of the {category.category.toLowerCase()} functions
              </h2>
              <div className="fgrid">
                {others.map((f) => (
                  <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
                    <div className="fn">{f.name}</div>
                    <div className="fd">{f.summary}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 id="other-categories">Other categories</h2>
          <div className="fgrid">
            {CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
              <Link className="fchip" href={`/formulas/category/${c.slug}/`} key={c.slug}>
                <div className="fn">{c.h1.replace('Excel ', '')}</div>
                <div className="fd">
                  {all.filter((f) => f.category === c.category).length} functions
                </div>
              </Link>
            ))}
          </div>

          <p style={{ marginTop: 30 }}>
            <Link href="/formulas/">Browse all {all.length} formulas →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
