import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TemplateDownload from '@/components/TemplateDownload';
import { JsonLd } from '@/lib/json-ld';
import { TEMPLATES, getTemplate } from '@/lib/templates';
import { getAllFormulas } from '@/lib/content';
import { SITE, breadcrumbSchema } from '@/lib/schema';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TEMPLATES.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const t = getTemplate(slug);
  if (!t) return {};
  return {
    title: `${t.title} — free Excel template`,
    description: t.description,
    alternates: { canonical: `/templates/${t.slug}/` },
    openGraph: {
      title: t.title,
      description: t.description,
      type: 'article',
      images: ['/og-image.png'],
      locale: 'en_US',
    },
  };
}

export default async function TemplatePage({ params }: Params) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();

  const formulas = getAllFormulas().filter((f) => template.formulas.includes(f.name));
  const others = TEMPLATES.filter(
    (t) => t.slug !== template.slug && t.category === template.category
  ).slice(0, 3);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: template.title,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Microsoft Excel',
      description: template.description,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      author: { '@type': 'Person', name: SITE.author.name },
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Templates', path: '/templates/' },
      { name: template.title, path: `/templates/${template.slug}/` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <div className="crumbs-wrap">
        <nav className="shell crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/templates/">Templates</Link>
          <span aria-hidden="true">/</span>
          <span className="cur">{template.title}</span>
        </nav>
      </div>

      <div className="prose-wrap">
        <div className="art-tags" style={{ marginBottom: 15 }}>
          <span className="tg">{template.category}</span>
          <span className="tg">{template.difficulty}</span>
          <span className="tg">{template.sheets} sheets</span>
        </div>

        <h1>{template.title}</h1>
        <p className="lede">{template.description}</p>

        <TemplateDownload slug={template.slug} title={template.title} />

        <h2 id="whats-inside">What is inside</h2>
        <p>
          Every sheet is documented. Blue cells are the ones you fill in; everything else
          calculates. There is a Read me sheet explaining how the workbook is put together
          and, importantly, where its limits are.
        </p>
        <p>
          The color convention follows the standard used in financial models — blue for
          inputs, black for formulas, green shading for totals — so anyone in a finance or
          audit role will read it without being told.
        </p>

        <h2 id="formulas-used">Formulas it uses</h2>
        <p>
          Each of these has a page in the library with a live example you can edit, if you
          want to understand how the template works rather than just use it.
        </p>
        <div className="fgrid">
          {formulas.map((f) => (
            <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
              <div className="fn">{f.name}</div>
              <div className="fd">{f.summary}</div>
            </Link>
          ))}
        </div>

        <h2 id="compatibility">Compatibility</h2>
        <p>
          Built with functions that work in Excel 2007 and later, including INDEX and MATCH
          rather than XLOOKUP. That is deliberate — these files often go to clients and
          auditors, and XLOOKUP returns an error in Excel 2019 and earlier. It opens in
          LibreOffice and Google Sheets too, though conditional formatting sometimes needs
          adjusting there.
        </p>

        {others.length > 0 && (
          <>
            <h2 id="related">Other {template.category.toLowerCase()} templates</h2>
            <div className="tpl-grid">
              {others.map((t) => (
                <Link className="tpl" href={`/templates/${t.slug}/`} key={t.slug}>
                  <div className="tpl-top">
                    <span className="tpl-cat">{t.category}</span>
                    <span className="tpl-diff">{t.difficulty}</span>
                  </div>
                  <h3>{t.title}</h3>
                  <p>{t.summary}</p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
