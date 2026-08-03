import type { Metadata } from 'next';
import { JsonLd } from '@/lib/json-ld';
import { collectionSchema } from '@/lib/schema';
import TemplateBrowser from '@/components/TemplateBrowser';
import { TEMPLATES, getTemplateCategories } from '@/lib/templates';

export const metadata: Metadata = {
  title: 'Free Excel templates',
  description:
    'Free Excel templates for cash flow, budgeting, reconciliation, inventory and reporting. Built by a qualified auditor, not scraped from a stock library.',
  alternates: { canonical: '/templates/' },
};

export default function TemplatesPage() {
  return (
    <>
      <JsonLd
        data={[
          collectionSchema(
            'Free Excel templates',
            'Free Excel templates, built and verified, with every formula documented.',
            '/templates/'
          ),
        ]}
      />

      <section className="sec">
      <div className="shell">
        <div className="sec-head">
          <span className="sec-lab">Free templates</span>
          <h1>Templates that survive contact with real work</h1>
          <p>
            Every file here was built for an actual task, not as a download magnet. They are
            documented, they do not break when you add a row, and they are free.
          </p>
        </div>
        <TemplateBrowser templates={TEMPLATES} categories={getTemplateCategories()} />
      </div>
    </section>
    </>
  );
}
