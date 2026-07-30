'use client';

import { useState } from 'react';

interface Result {
  formula: string | null;
  explanation: string;
  caution: string | null;
}

const EXAMPLES = [
  'Sum sales for the North region where status is Closed',
  'Count how many invoices are more than 30 days overdue',
  'Look up a price by product code and show a message if not found',
  'Get the last day of the month three months from today',
];

export default function AssistantForm() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function submit() {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/assistant/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
      } else {
        setResult(data as Result);
      }
    } catch {
      setError('Could not reach the assistant. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    if (!result?.formula) return;
    navigator.clipboard.writeText(result.formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <div className="ai-box">
        <textarea
          className="ai-input"
          placeholder="Describe what you need. For example: add up the amounts where the region is North and the status is closed."
          value={prompt}
          maxLength={500}
          aria-label="Describe the formula you need"
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit();
          }}
        />
        <div className="ai-bar">
          <button
            type="button"
            className="btn btn-p btn-sm"
            onClick={submit}
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" /> Thinking
              </>
            ) : (
              'Get the formula'
            )}
          </button>
          <span className="ai-count">{prompt.length} / 500</span>
        </div>
      </div>

      <div className="ai-examples">
        {EXAMPLES.map((e) => (
          <button key={e} type="button" onClick={() => setPrompt(e)}>
            {e}
          </button>
        ))}
      </div>

      <div className="ai-out" aria-live="polite">
        {error && <div className="ai-err">{error}</div>}

        {result && (
          <>
            {result.formula && (
              <div className="ai-formula">
                <button type="button" className="ai-copy" onClick={copy}>
                  {copied ? 'Copied' : 'Copy'}
                </button>
                {result.formula}
              </div>
            )}
            <p style={{ marginTop: 16, color: 'var(--ink-600)' }}>{result.explanation}</p>
            {result.caution && (
              <div className="cal cal-warning">
                <b>Watch out for</b>
                {result.caution}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
