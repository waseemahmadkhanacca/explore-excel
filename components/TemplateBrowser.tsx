'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Template } from '@/lib/templates';

interface Props {
  templates: Template[];
  categories: string[];
}

export default function TemplateBrowser({ templates, categories }: Props) {
  const [active, setActive] = useState('All');
  const [wanted, setWanted] = useState<Template | null>(null);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const visible =
    active === 'All' ? templates : templates.filter((t) => t.category === active);

  function requestDownload(t: Template) {
    setWanted(t);
    setStatus('idle');
    setError('');
  }

  const canSubmit = email.includes('@') && consent && status !== 'sending';

  async function submit() {
    if (!canSubmit || !wanted) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, template: wanted.slug, consent: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
        setError(data.error ?? 'Something went wrong.');
      }
    } catch {
      setStatus('error');
      setError('Could not reach the server. Please try again.');
    }
  }

  return (
    <>
      <div className="filters" role="group" aria-label="Filter templates by category">
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

      <div className="tpl-grid">
        {visible.map((t) => (
          <article className="tpl" key={t.slug}>
            <div className="tpl-top">
              <span className="tpl-cat">{t.category}</span>
              <span className="tpl-diff">{t.difficulty}</span>
            </div>
            <h3>{t.title}</h3>
            <p>{t.description}</p>
            <div className="tpl-meta">
              <span>{t.sheets} sheets</span>
              <span aria-hidden="true">·</span>
              <span className="mono">{t.formulas.join(' · ')}</span>
            </div>
            <div className="tpl-actions">
              <Link className="btn btn-s btn-sm" href={`/templates/${t.slug}/`}>
                What is inside
              </Link>
              <button
                type="button"
                className="btn btn-p btn-sm"
                onClick={() => requestDownload(t)}
              >
                Download free
              </button>
            </div>
          </article>
        ))}
      </div>

      {wanted && (
        <div className="cmdk-overlay" onClick={() => setWanted(null)} role="presentation">
          <div
            className="gate"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Download ${wanted.title}`}
          >
            {status === 'sent' ? (
              <>
                <h3>Check your inbox</h3>
                <p>
                  {wanted.title} is on its way to {email}. If it has not arrived within a few
                  minutes, look in your spam folder — and mark it as not spam so the next one
                  reaches you.
                </p>
                <button
                  type="button"
                  className="btn btn-p"
                  style={{ width: '100%' }}
                  onClick={() => setWanted(null)}
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <h3>{wanted.title}</h3>
                <p>
                  Enter your email and the file comes straight back. The template itself is
                  free and always will be.
                </p>

                <input
                  type="email"
                  className="gate-input"
                  placeholder="you@company.com"
                  value={email}
                  aria-label="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submit();
                  }}
                />

                <label className="gate-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>
                    Send me the file, plus occasional emails about new templates and guides.
                    I can unsubscribe at any time.
                  </span>
                </label>

                {status === 'error' && <div className="ai-err">{error}</div>}

                <div className="gate-actions">
                  <button
                    type="button"
                    className="btn btn-p"
                    disabled={!canSubmit}
                    onClick={submit}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send it to me'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-s"
                    onClick={() => setWanted(null)}
                  >
                    Cancel
                  </button>
                </div>

                <p className="gate-note">
                  We store your address to send what you asked for and to keep you updated.
                  Nothing else, and never sold.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
