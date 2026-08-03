import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import InteractiveGrid from '@/components/InteractiveGrid';
import FormulaBody from '@/components/FormulaBody';
import { JsonLd } from '@/lib/json-ld';
import { getAllFormulas, getFormula, getFormulaSlugs } from '@/lib/content';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from '@/lib/schema';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getFormulaSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const f = getFormula(slug);
  if (!f) return {};

  return {
    title: `${f.name} function in Excel`,
    description: f.description,
    alternates: { canonical: `/formulas/${f.slug}/` },
    openGraph: {
      title: `${f.name} function in Excel`,
      description: f.description,
      type: 'article',
      modifiedTime: f.updated,
      // Defining openGraph here replaces the one in layout.tsx wholesale, so
      // the image has to be repeated. Without it every share is a bare link.
      images: ['/og-image.png'],
      locale: 'en_US',
    },
  };
}

export default async function FormulaPage({ params }: Params) {
  const { slug } = await params;
  const f = getFormula(slug);
  if (!f) notFound();

  const all = getAllFormulas();
  const related = all.filter((x) => f.related.includes(x.name));

  const schemas = [
    articleSchema(f),
    faqSchema(f.faq),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Formulas', path: '/formulas/' },
      { name: f.name, path: `/formulas/${f.slug}/` },
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
          <span className="cur">{f.name}</span>
        </nav>
      </div>

      <div className="art-wrap">
        <article className="art">
          <header className="art-head">
            <div className="art-tags">
              <span className="tg">{f.category}</span>
              {f.versions.map((v) => (
                <span className="tg" key={v}>
                  {v}
                </span>
              ))}
            </div>
            <h1>{f.name} function</h1>
            <p className="lede">{f.description}</p>
            <div className="art-meta">
              <span>
                Updated{' '}
                {new Date(f.updated).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span aria-hidden="true">·</span>
              <span>By Waseem, ACCA</span>
              <span aria-hidden="true">·</span>
              <span>{f.readingTime} min read</span>
            </div>
          </header>

          <div className="tryit">
            <div className="tryit-lab">Try it — this is a working spreadsheet</div>
            <InteractiveGrid
              sheet={f.demo}
              initialFormula={f.demo.presets[0]?.formula ?? ''}
              fileName={f.demo.file}
              functionName={f.name}
              hint="Change a value in the formula, or edit any outlined cell."
              presets={f.demo.presets}
            />
          </div>

          <h2 id="syntax">Syntax</h2>
          <div className="syn">{f.syntax}</div>

          <div className="table-scroll">
            <table className="args">
            <thead>
              <tr>
                <th scope="col">Argument</th>
                <th scope="col">Required</th>
                <th scope="col">What it does</th>
              </tr>
            </thead>
            <tbody>
              {f.arguments.map((a) => (
                <tr key={a.name}>
                  <td>{a.name}</td>
                  <td>{a.required ? 'Yes' : 'No'}</td>
                  <td>{a.description}</td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>

          <FormulaBody source={f.body} />

          <h2 id="mistakes">Common mistakes</h2>
          {f.mistakes.map((m) => (
            <div className={`cal cal-${m.level}`} key={m.title}>
              <b>{m.title}</b>
              {m.body}
            </div>
          ))}

          {f.practiceFile && (
            <div className="dl">
              <div>
                <div className="dl-t">Practice file — {f.name}</div>
                <div className="dl-s">
                  The same data as above, plus exercises with answers on a second sheet.
                </div>
              </div>
              <a className="btn btn-p" href={f.practiceFile}>
                Download free
              </a>
            </div>
          )}

          {related.length > 0 && (
            <>
              <h2 id="related">Related functions</h2>
              <div className="fgrid">
                {related.map((r) => (
                  <Link className="fchip" href={`/formulas/${r.slug}/`} key={r.slug}>
                    <div className="fn">{r.name}</div>
                    <div className="fd">{r.summary}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <h2 id="faq">Frequently asked questions</h2>
          <div className="faq">
            {f.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </article>

        <aside className="side">
          <nav className="side-card" aria-label="On this page">
            <div className="side-lab">On this page</div>
            <a href="#syntax">Syntax</a>
            <a href="#examples">Examples</a>
            <a href="#mistakes">Common mistakes</a>
            {related.length > 0 && <a href="#related">Related functions</a>}
            <a href="#faq">FAQ</a>
          </nav>
          <div className="side-card ai-card">
            <div className="side-lab" style={{ color: 'var(--blue)' }}>
              AI assistant
            </div>
            <p>Describe what you&apos;re trying to do and get a working formula back.</p>
            <Link
              className="btn btn-s btn-sm"
              style={{ width: '100%' }}
              href="/ai/formula-assistant/"
            >
              Open assistant
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
