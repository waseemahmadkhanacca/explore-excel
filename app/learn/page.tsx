import type { Metadata } from 'next';
import Link from 'next/link';
import { getGuides } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Learn Excel',
  description:
    'Structured Excel guides from the basics through pivot tables, dashboards, Power Query and interview preparation. Written for people who use Excel at work.',
  alternates: { canonical: '/learn/' },
};

export default function LearnPage() {
  const guides = getGuides();

  return (
    <section className="sec">
      <div className="shell">
        <div className="sec-head">
          <span className="sec-lab">Learn</span>
          <h2>Guides that assume you are busy</h2>
          <p>
            Each one is written for someone who needs to get something done today, not someone
            studying for a certificate. Practical, and honest about what is worth learning and
            what is not.
          </p>
        </div>

        <div className="cards">
          {guides.map((g) => (
            <Link className="card" href={`/learn/${g.slug}/`} key={g.slug}>
              <span className="tg" style={{ marginBottom: 12, display: 'inline-block' }}>
                {g.level}
              </span>
              <h3>{g.title}</h3>
              <p>{g.summary}</p>
              <div className="card-meta">{g.readingTime} min read</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
