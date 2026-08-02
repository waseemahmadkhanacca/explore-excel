import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleBody from '@/components/ArticleBody';
import { JsonLd } from '@/lib/json-ld';
import { getPost, getPostSlugs, getPosts } from '@/lib/articles';
import { getAllFormulas } from '@/lib/content';
import { articleSchema, breadcrumbSchema } from '@/lib/schema';

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}/` },
    openGraph: {
      title: p.title,
      description: p.description,
      type: 'article',
      publishedTime: p.updated,
      // Replaces layout.tsx's openGraph entirely, so the image must repeat.
      images: ['/og-image.png'],
      locale: 'en_GB',
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const formulas = getAllFormulas();
  const related = formulas.filter((f) => post.related.includes(f.name));
  const others = getPosts().filter((p) => p.slug !== post.slug).slice(0, 2);

  const schemas = [
    articleSchema({
      slug: post.slug,
      name: post.title,
      description: post.description,
      updated: post.updated,
    }),
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog/' },
      { name: post.title, path: `/blog/${post.slug}/` },
    ]),
  ];

  return (
    <>
      <JsonLd data={schemas} />

      <div className="crumbs-wrap">
        <nav className="shell crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog/">Blog</Link>
          <span aria-hidden="true">/</span>
          <span className="cur">{post.title}</span>
        </nav>
      </div>

      <div className="prose-wrap">
        <article>
          <span className="tg" style={{ display: 'inline-block', marginBottom: 14 }}>
            {post.category}
          </span>
          <h1>{post.title}</h1>
          <p className="lede">{post.summary}</p>
          <div className="art-meta" style={{ marginBottom: 34 }}>
            <span>
              {new Date(post.updated).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span aria-hidden="true">·</span>
            <span>By Waseem, ACCA</span>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>

          <ArticleBody source={post.body} />

          {related.length > 0 && (
            <>
              <h2 id="formulas-mentioned">Formulas mentioned here</h2>
              <div className="fgrid">
                {related.map((f) => (
                  <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
                    <div className="fn">{f.name}</div>
                    <div className="fd">{f.summary}</div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {others.length > 0 && (
            <>
              <h2 id="more">More from the blog</h2>
              <div className="post-list">
                {others.map((p) => (
                  <Link className="post" href={`/blog/${p.slug}/`} key={p.slug}>
                    <div className="post-meta">
                      <span className="post-cat">{p.category}</span>
                      <span>{p.readingTime} min read</span>
                    </div>
                    <h3>{p.title}</h3>
                    <p>{p.summary}</p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </article>
      </div>
    </>
  );
}
