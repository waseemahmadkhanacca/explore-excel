'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface SearchItem {
  label: string;
  sub: string;
  href: string;
  group: string;
  keywords?: string;
}

/** Simple subsequence match — "xlk" finds "XLOOKUP". */
function fuzzyScore(needle: string, haystack: string): number {
  const n = needle.toLowerCase();
  const h = haystack.toLowerCase();
  if (!n) return 1;

  const exact = h.indexOf(n);
  if (exact === 0) return 1000;
  if (exact > 0) return 500 - exact;

  let score = 0;
  let hi = 0;
  for (const ch of n) {
    const found = h.indexOf(ch, hi);
    if (found === -1) return 0;
    score += found === hi ? 3 : 1;
    hi = found + 1;
  }
  return score;
}

export default function CommandPalette({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    return items
      .map((item) => ({
        item,
        score: Math.max(
          fuzzyScore(query, item.label) * 2,
          fuzzyScore(query, item.sub),
          fuzzyScore(query, item.keywords ?? '')
        ),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((r) => r.item);
  }, [query, items]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const go = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      go(results[active].href);
    }
  }

  return (
    <>
      <button
        type="button"
        className="searchbtn"
        onClick={() => setOpen(true)}
        aria-label="Search formulas and pages"
      >
        <span>Search formulas</span>
        <span className="kbd">⌘K</span>
      </button>

      {open && (
        <div className="cmdk-overlay" onClick={close} role="presentation">
          <div
            className="cmdk"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
          >
            <div className="cmdk-input">
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                placeholder="Search formulas, templates, guides…"
                aria-label="Search query"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
              />
              <span className="kbd">Esc</span>
            </div>

            <div className="cmdk-list" ref={listRef}>
              {results.length === 0 && (
                <div className="cmdk-empty">
                  Nothing found for &ldquo;{query}&rdquo;.
                </div>
              )}
              {results.map((r, i) => (
                <button
                  key={r.href + r.label}
                  type="button"
                  className="cmdk-item"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r.href)}
                >
                  <span className="cmdk-group">{r.group}</span>
                  <span className="cmdk-label">{r.label}</span>
                  <span className="cmdk-sub">{r.sub}</span>
                </button>
              ))}
            </div>

            <div className="cmdk-foot">
              <span>
                <span className="kbd">↑</span> <span className="kbd">↓</span> to navigate
              </span>
              <span>
                <span className="kbd">↵</span> to open
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
