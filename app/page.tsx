import type { Metadata } from 'next';
import Link from 'next/link';
import InteractiveGrid from '@/components/InteractiveGrid';
import { JsonLd } from '@/lib/json-ld';
import { getAllFormulas } from '@/lib/content';
import { organizationSchema, websiteSchema } from '@/lib/schema';
import type { Sheet } from '@/lib/formula-engine';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const HERO_SHEET: Sheet = {
  columns: ['A', 'B', 'C', 'D'],
  headers: ['Order', 'Region', 'Status', 'Amount'],
  editable: [3],
  money: [3],
  rows: [
    ['#1041', 'North', 'Closed', 12400],
    ['#1042', 'South', 'Open', 8100],
    ['#1043', 'North', 'Open', 9600],
    ['#1044', 'North', 'Closed', 15250],
    ['#1045', 'East', 'Closed', 7300],
    ['#1046', 'North', 'Closed', 4880],
  ],
};

const FEATURES = [
  {
    icon: 'fx',
    title: 'Live formula pages',
    body: 'A real calculation engine on every page. Edit the data, edit the formula, see what breaks and why.',
  },
  {
    icon: '!',
    title: 'Common mistakes first',
    body: "Every page names the traps up front — mismatched ranges, text-formatted numbers, the errors you'll actually hit.",
  },
  {
    icon: 'AI',
    title: 'Formula assistant',
    body: 'Describe what you need in plain English. Get a working formula back, explained line by line.',
    ai: true,
  },
  {
    icon: '▤',
    title: 'Templates that work',
    body: 'Cash flow, budgets, reconciliations, dashboards. Built by a qualified auditor, not scraped from a stock library.',
  },
];

export default function HomePage() {
  const formulas = getAllFormulas();

  return (
    <>
      <JsonLd data={[websiteSchema(), organizationSchema()]} />

      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow">
              <span className="dot" aria-hidden="true" />
              Type in the cells — it actually calculates
            </span>
            <h1 className="hero-h">
              Stop reading about formulas. <em>Start using them.</em>
            </h1>
            <p className="hero-sub">
              Every formula on Explore Excel comes with a live spreadsheet you can edit right in
              the page. Change a number, watch the result update. No download, no sign-up.
            </p>
            <div className="hero-cta">
              <Link className="btn btn-p" href="/formulas/">
                Browse the formula library
              </Link>
              <Link className="btn btn-s" href="/templates/">
                Get free templates
              </Link>
            </div>
            <div className="hero-meta">
              <span>
                <b>{formulas.length > 0 ? `${formulas.length}` : '150+'}</b> formulas
              </span>
              <span>
                <b>30</b> free templates
              </span>
              <span>
                <b>Always</b> free to use
              </span>
            </div>
          </div>

          <InteractiveGrid
            sheet={HERO_SHEET}
            initialFormula={'=SUMIFS(D2:D7, B2:B7, "North", C2:C7, "Closed")'}
            fileName="Q3 regional sales.xlsx"
            functionName="SUMIFS"
            hint="Edit any outlined cell or the formula above."
          />
        </div>
      </section>

      <section className="sec">
        <div className="shell">
          <div className="sec-head">
            <span className="sec-lab">Why this is different</span>
            <h2>Reference material you can actually poke at</h2>
            <p>
              Most Excel sites show you a screenshot of a formula working. We give you the formula,
              working, with your hands on it.
            </p>
          </div>
          <div className="cards">
            {FEATURES.map((f) => (
              <div className={f.ai ? 'card ai' : 'card'} key={f.title}>
                <div className="ic" aria-hidden="true">
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {formulas.length > 0 && (
        <section className="sec sec-alt">
          <div className="shell">
            <div className="sec-head">
              <span className="sec-lab">Most searched</span>
              <h2>Start with the formulas people actually use</h2>
            </div>
            <div className="fgrid">
              {formulas.map((f) => (
                <Link className="fchip" href={`/formulas/${f.slug}/`} key={f.slug}>
                  <div className="fn">{f.name}</div>
                  <div className="fd">{f.summary}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
