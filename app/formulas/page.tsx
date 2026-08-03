import type { Metadata } from 'next';
import { JsonLd } from '@/lib/json-ld';
import { collectionSchema } from '@/lib/schema';
import LibraryBrowser from '@/components/LibraryBrowser';
import { getAllFormulas, getCategories } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Excel formula library',
  description:
    'Every Excel formula with a live, editable example. Syntax, worked examples, common mistakes and practice files. Free to use.',
  alternates: { canonical: '/formulas/' },
};

export default function FormulaIndexPage() {
  const formulas = getAllFormulas();
  const categories = getCategories();

  return (
    <>
      <JsonLd
        data={[
          collectionSchema(
            'Excel formula library',
            'Every Excel formula with a live, editable example.',
            '/formulas/'
          ),
        ]}
      />

      <section className="sec">
      <div className="shell">
        <div className="sec-head">
          <span className="sec-lab">Formula library</span>
          <h1>Every formula, with a live example</h1>
          <p>
            Filter by what you&apos;re trying to do. Each page includes an editable spreadsheet,
            three worked examples, and the mistakes to avoid.
          </p>
        </div>
        <LibraryBrowser formulas={formulas} categories={categories} />
      </div>
    </section>
    </>
  );
}
