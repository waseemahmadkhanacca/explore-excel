import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="sec">
      <div className="shell" style={{ maxWidth: 620 }}>
        <span className="sec-lab">404</span>
        <h1 style={{ fontSize: 40, letterSpacing: '-0.03em', margin: '0 0 14px' }}>
          That page does not exist
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ink-600)', marginBottom: 28 }}>
          The formula or page you were looking for is not here. It may have moved, or it may
          not be written yet.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="btn btn-p" href="/formulas/">
            Browse the formula library
          </Link>
          <Link className="btn btn-s" href="/">
            Back to the homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
