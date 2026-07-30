'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Formula } from '@/lib/content';

interface Props {
  formulas: Formula[];
  categories: string[];
}

export default function LibraryBrowser({ formulas, categories }: Props) {
  const [active, setActive] = useState('All');

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
            onClick={() => setActive(c)}
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
