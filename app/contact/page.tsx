import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch about Explore Excel — corrections, requests, or consulting work.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">Contact</span>
      <h1>Get in touch</h1>

      <p className="lede">
        Corrections and formula requests are genuinely welcome. So is telling me something on
        the site is wrong.
      </p>

      <h2>Requesting a formula page</h2>
      <p>
        If a function you need is not covered yet, say so. Requests get priority over whatever
        was next on the list, because a request means at least one person is actually looking
        for it.
      </p>

      <h2>Corrections</h2>
      <p>
        If a page is wrong, point at the specific line. It gets fixed and the page notes the
        update date. No defensiveness.
      </p>

      <h2>Consulting</h2>
      <p>
        I take a small amount of work building dashboards, cleaning up inherited workbooks,
        and reconciliation models — usually for finance and audit teams. If your workbook has
        become something nobody wants to touch, that is the kind of problem this is for.
      </p>

      <div className="dl" style={{ marginTop: 36 }}>
        <div>
          <div className="dl-t">Email</div>
          <div className="dl-s">Replies usually within two working days.</div>
        </div>
        <a className="btn btn-p" href="mailto:hello@exploreexcel.com">
          hello@exploreexcel.com
        </a>
      </div>
    </div>
  );
}
