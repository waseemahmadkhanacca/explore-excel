import Link from 'next/link';
import CommandPalette, { type SearchItem } from './CommandPalette';
import { getAllFormulas } from '@/lib/content';
import { TEMPLATES } from '@/lib/templates';
import { getGuides } from '@/lib/articles';
import { CATEGORIES } from '@/lib/categories';

/**
 * The search index is assembled on the server and passed to the client
 * component as props. At 150 formulas this is a few kilobytes — far cheaper
 * than a search API round trip, and it works instantly with no network call.
 * Revisit if the index ever passes ~500 entries.
 */
function buildSearchIndex(): SearchItem[] {
  const formulas = getAllFormulas().map((f) => ({
    label: f.name,
    sub: f.summary,
    href: `/formulas/${f.slug}/`,
    group: 'Formula',
    keywords: `${f.category} ${f.description}`,
  }));

  const templates = TEMPLATES.map((t) => ({
    label: t.title,
    sub: t.summary,
    href: `/templates/${t.slug}/`,
    group: 'Template',
    keywords: `${t.category} ${t.formulas.join(' ')}`,
  }));

  const guides = getGuides().map((g) => ({
    label: g.title,
    sub: g.summary,
    href: `/learn/${g.slug}/`,
    group: 'Guide',
    keywords: `${g.level ?? ''} ${g.description}`,
  }));

  const allFormulas = getAllFormulas();
  const categories = CATEGORIES.map((c) => ({
    label: c.h1,
    sub: `${allFormulas.filter((f) => f.category === c.category).length} functions`,
    href: `/formulas/category/${c.slug}/`,
    group: 'Category',
    keywords: c.description,
  }));

  const pages: SearchItem[] = [
    { label: 'Formula library', sub: 'Every formula with a live example', href: '/formulas/', group: 'Page' },
    { label: 'Free templates', sub: 'Cash flow, budgets, reconciliation', href: '/templates/', group: 'Page' },
    { label: 'AI formula assistant', sub: 'Describe it, get a formula', href: '/ai/formula-assistant/', group: 'Page' },
    { label: 'Learn', sub: 'Structured guides', href: '/learn/', group: 'Page' },
    { label: 'Blog', sub: 'Longer pieces', href: '/blog/', group: 'Page' },
    { label: 'About', sub: 'Why this site exists', href: '/about/', group: 'Page' },
    { label: 'Contact', sub: 'Corrections and requests', href: '/contact/', group: 'Page' },
  ];

  return [...formulas, ...categories, ...guides, ...templates, ...pages];
}

function Chevron() {
  return (
    <svg className="chev" viewBox="0 0 10 10" fill="none" aria-hidden="true">
      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

/**
 * Built from the content rather than hardcoded, so a new formula page appears
 * in the menu on its own.
 *
 * Each entry links to a real category page. They used to point at
 * /formulas/?category=X, which was one page behind six query strings — Search
 * Console reported all six as duplicates, and none of them could rank.
 */
function buildFormulaGroups() {
  const byCategory = new Map<string, string[]>();
  for (const f of getAllFormulas()) {
    const list = byCategory.get(f.category) ?? [];
    list.push(f.name);
    byCategory.set(f.category, list);
  }

  return CATEGORIES.map((c) => {
    const names = byCategory.get(c.category) ?? [];
    return {
      slug: c.slug,
      category: c.category,
      label: c.h1.replace('Excel ', ''),
      fns: names.slice(0, 3).join(' · '),
      count: names.length,
    };
  })
    .filter((g) => g.count > 0)
    .sort((a, b) => b.count - a.count);
}

export default function Header() {
  const searchItems = buildSearchIndex();
  const formulaGroups = buildFormulaGroups();

  return (
    <header className="nav">
      <nav className="nav-in" aria-label="Main">
        <Link className="brand" href="/">
          <BrandMark />
          <span className="brand-txt">
            Explore<b>Excel</b>
          </span>
        </Link>

        <div className="nav-links">
          <div className="ni">
            <Link href="/formulas/">
              Formulas <Chevron />
            </Link>
            <div className="dd dd-wide">
              {formulaGroups.map((g) => (
                <Link key={g.category} href={`/formulas/category/${g.slug}/`}>
                  <div className="dm">{g.fns}</div>
                  <div className="ds">
                    {g.label} · {g.count} formula{g.count === 1 ? '' : 's'}
                  </div>
                </Link>
              ))}
              <div className="dd-foot">
                <Link href="/formulas/">
                  Browse all formulas <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="ni">
            <Link href="/templates/">
              Templates <Chevron />
            </Link>
            <div className="dd dd-wide">
              {TEMPLATES.slice(0, 6).map((t) => (
                <Link key={t.slug} href={`/templates/${t.slug}/`}>
                  <div className="dt">{t.title}</div>
                  <div className="ds">{t.summary}</div>
                </Link>
              ))}
              <div className="dd-foot">
                <Link href="/templates/">
                  All free templates <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="ni">
            <Link href="/learn/">
              Learn <Chevron />
            </Link>
            <div className="dd dd-nar">
              {getGuides().map((g) => (
                <Link key={g.slug} href={`/learn/${g.slug}/`}>
                  <div className="dt">{g.title}</div>
                  <div className="ds">{g.summary}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="ni">
            <Link href="/ai/formula-assistant/">
              AI tools <Chevron />
            </Link>
            <div className="dd dd-nar">
              <Link href="/ai/formula-assistant/">
                <div className="dt">
                  Formula assistant <span className="dd-new">New</span>
                </div>
                <div className="ds">Describe it, get a formula</div>
              </Link>
              <Link href="/ai/formula-assistant/">
                <div className="dt">Formula explainer</div>
                <div className="ds">Paste a formula, read it in English</div>
              </Link>
              <Link href="/ai/formula-assistant/">
                <div className="dt">Error debugger</div>
                <div className="ds">Find out why it returns #N/A</div>
              </Link>
            </div>
          </div>

          <Link href="/blog/">Blog</Link>
        </div>

        <div className="nav-right">
          <CommandPalette items={searchItems} />
          <Link className="btn btn-p btn-sm" href="/templates/">
            <span className="cta-long">Free templates</span>
            <span className="cta-short">Templates</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
