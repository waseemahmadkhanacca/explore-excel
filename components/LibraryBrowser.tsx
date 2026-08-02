'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Formula } from '@/lib/content';

interface Props {
  formulas: Formula[];
  categories: string[];
}

export default function LibraryBrowser({ formulas, categories }: Props) {
  const [active, setActive] = useState('All');

  // The header menu links here with ?category=Lookup and similar. Reading it on
  // mount rather than with useSearchParams keeps this page statically
  // prerendered — useSearchParams would force it behind a Suspense boundary.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get('category');
    if (wanted && categories.includes(wanted)) setActive(wanted);
  }, [categories]);

  /** Keeps the address bar in step so a filtered view can be linked to. */
  const choose = (category: string) => {
    setActive(category);
    const url = new URL(window.location.href);
    if (category === 'All') url.searchParams.delete('category');
    else url.searchParams.set('category', category);
    window.history.replaceState(null, '', url);
  };

  const visible =
    active === 'All' ? formulas : formulas.filter((f) => f.category === active);

  return (
    <>
      <div className="filters" role="group" aria-label="Filter formulas by category">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={c === active ? 'fbtn on' : 'fbtn'}
            aria-pressed={c === active}
            onClick={() => choose(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="fgrid" style={{ marginTop: 26 }}>
        {visible.map((f) => (
          <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
            <div className="fn">{f.name}</div>
            <div className="fd">{f.summary}</div>
          </Link>
        ))}
      </div>

      {visible.length === 0 && (
        <p style={{ marginTop: 26, color: 'var(--ink-500)' }}>
          No formulas in this category yet.
        </p>
      )}
    </>
  );
}
