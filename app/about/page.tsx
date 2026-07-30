import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Explore Excel is built by Waseem, an ACCA-qualified internal auditor. Interactive formula reference, free templates, no filler.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">About</span>
      <h1>Why this site exists</h1>

      <p className="lede">
        Most Excel sites show you a screenshot of a formula working. That is a strange way to
        teach something interactive.
      </p>

      <p>
        I am Waseem, an ACCA-qualified internal auditor. I spend my working life in
        spreadsheets — reconciliations, stock counts, variance analysis, the kind of work
        where a formula returning the wrong number quietly is worse than one that errors
        loudly.
      </p>

      <p>
        When I needed to look something up, the options were a wall of text with no working
        example, or a video where I had to scrub through four minutes to find thirty seconds
        of substance. Neither respects the fact that you are usually mid-task and slightly
        annoyed.
      </p>

      <h2>What is different here</h2>

      <p>
        Every formula page has a real spreadsheet in it. Not a picture of one — an actual
        calculation engine. Change a value, the result updates. Break the formula on purpose
        and you get the same error Excel would give you, with an explanation of why.
      </p>

      <p>
        That last part matters more than it sounds. Most of the time you are not searching
        for what a function does. You are searching for why yours returned{' '}
        <code>#N/A</code> when it clearly should have worked. So every page names the traps
        up front rather than burying them at the bottom.
      </p>

      <h2>What it costs</h2>

      <p>
        The formula library and the templates are free, permanently. Not free-until-we-have-
        enough-users. The site is paid for by advertising and by premium template packs for
        people who want more depth. The reference layer stays open.
      </p>

      <h2>Where it is going</h2>

      <p>
        Right now: the formula library, free templates, and an AI assistant that writes
        formulas from a plain-English description. Later: dashboards, Power Query guides,
        financial modelling. Deliberately not: a forum, a course platform, or a marketplace,
        until there are enough people here to justify them.
      </p>

      <p>
        If something on the site is wrong, tell me. Audit work makes you comfortable being
        corrected — it is cheaper than being wrong for six months.
      </p>

      <p style={{ marginTop: 32 }}>
        <Link className="btn btn-p" href="/formulas/">
          Browse the formula library
        </Link>
      </p>
    </div>
  );
}
