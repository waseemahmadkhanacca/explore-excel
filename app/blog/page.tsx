import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Practical writing on Excel, spreadsheet design, and the habits that separate a workbook that lasts from one that breaks.',
  alternates: { canonical: '/blog/' },
};

export default function BlogPage() {
  const posts = getPosts();

  return (
    <section className="sec">
      <div className="shell">
        <div className="sec-head">
          <span className="sec-lab">Blog</span>
          <h2>Longer pieces on doing this properly</h2>
          <p>
            The formula library answers what a function does. This is for the questions
            underneath — how to structure work so it holds up after it leaves your hands.
          </p>
        </div>

        <div className="post-list">
          {posts.map((p) => (
            <Link className="post" href={`/blog/${p.slug}/`} key={p.slug}>
              <div className="post-meta">
                <span className="post-cat">{p.category}</span>
                <span>
                  {new Date(p.updated).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span>{p.readingTime} min read</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
