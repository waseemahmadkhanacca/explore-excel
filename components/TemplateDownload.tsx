'use client';

import { useState } from 'react';

export default function TemplateDownload({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const canSubmit = email.includes('@') && consent && status !== 'sending';

  async function submit() {
    if (!canSubmit) return;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, template: slug, consent: true }),
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

  if (status === 'sent') {
    return (
      <div className="dl-panel dl-panel--done">
        <div className="dl-t">Check your inbox</div>
        <p>
          {title} is on its way to {email}. If it has not arrived in a few minutes, look in
          your spam folder and mark it as not spam so the next one reaches you.
        </p>
      </div>
    );
  }

  return (
    <div className="dl-panel">
      <div className="dl-t">Get this template free</div>
      <p>Enter your email and the file comes straight back.</p>

      <div className="dl-row">
        <input
          type="email"
          className="gate-input"
          style={{ marginBottom: 0 }}
          placeholder="you@company.com"
          value={email}
          aria-label="Email address"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit();
          }}
        />
        <button type="button" className="btn btn-p" disabled={!canSubmit} onClick={submit}>
          {status === 'sending' ? 'Sending…' : 'Send it to me'}
        </button>
      </div>

      <label className="gate-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Send me the file, plus occasional emails about new templates and guides. I can
          unsubscribe at any time.
        </span>
      </label>

      {status === 'error' && <div className="ai-err">{error}</div>}
    </div>
  );
}
