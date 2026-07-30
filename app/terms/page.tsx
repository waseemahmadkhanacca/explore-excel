import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The terms governing use of Explore Excel and its templates.',
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: false },
};

export default function TermsPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">Legal</span>
      <h1>Terms of use</h1>
      <p className="lede">
        Last updated 23 July 2026. Short, and written to be read rather than skipped.
      </p>

      <div className="cal cal-warning">
        <b>Have this reviewed before launch</b>
        Written to be accurate about how the site works, but not legal advice. Terms need to
        reflect where you are established and where you sell. See the note at the end.
      </div>

      <h2 id="using">Using the site</h2>
      <p>
        The formula library, the guides and the free templates are yours to use, at work or
        personally. You may use anything you learn here in your own workbooks with no
        restriction and no attribution required. Nothing here is licensed per seat and nothing
        requires an account.
      </p>

      <h2 id="templates">The templates</h2>
      <p>
        Download them, edit them, rename them, use them commercially, give them to colleagues.
        They are provided so people can get work done.
      </p>
      <p>What you may not do is redistribute them as a competing collection — that is,</p>
      <ul>
        <li>republish them as your own template library</li>
        <li>sell them, either individually or bundled</li>
        <li>use them as the substance of a paid course or product</li>
      </ul>
      <p>
        Using a template inside a paid engagement with your own client is entirely fine. That
        is what they are for.
      </p>

      <h2 id="content">The written content</h2>
      <p>
        Quote from it with a link back. Do not republish whole articles, and do not feed the
        library into a scraper to reproduce it elsewhere.
      </p>

      <h2 id="ai">The AI assistant</h2>
      <p>
        The assistant produces formulas from a description. It is a language model and it can
        be confidently wrong. Check what it gives you before relying on it, particularly for
        anything financial.
      </p>
      <p>
        Do not paste confidential or personal data into it. Queries are sent to Google&apos;s
        API, and on the free tier those prompts may be used to improve their models. The{' '}
        <Link href="/privacy/">privacy policy</Link> covers this in more detail.
      </p>
      <p>
        Use is rate limited so that one person cannot exhaust the shared daily quota.
        Attempting to circumvent that limit is not permitted.
      </p>

      <h2 id="warranty">No warranty</h2>
      <p>
        Everything here is provided as is. The formulas and templates are tested — the
        templates are checked with real data and the formula examples are verified to
        evaluate correctly — but spreadsheets get used in circumstances nobody can anticipate.
      </p>
      <p>
        Check anything before relying on it for a decision that matters. Nothing on this site
        is accounting, tax, legal, audit or financial advice, and no professional relationship
        is created by using it.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p>
        To the extent permitted by law, Explore Excel is not liable for loss arising from use
        of this site or its files, including loss of data, profit, business or goodwill. If
        you are in a jurisdiction that does not allow some of these exclusions, they apply to
        you only to the extent permitted there.
      </p>

      <h2 id="availability">Availability</h2>
      <p>
        No uptime is guaranteed. The site may be unavailable for maintenance, and features may
        change or be withdrawn. If a paid product is ever introduced, it will have its own
        terms covering refunds and support.
      </p>

      <h2 id="microsoft">Microsoft and Excel</h2>
      <p>
        Microsoft and Excel are trademarks of Microsoft Corporation. This site is independent
        and is not affiliated with, endorsed by, or sponsored by Microsoft. Function
        behaviour described here reflects testing, not official documentation, and Microsoft
        may change it.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        These terms may be updated. The date at the top reflects the current version.
        Continuing to use the site after a change means accepting it.
      </p>

      <h2 id="contact">Questions</h2>
      <p>
        If something here is unclear or you think a template is wrong, say so on the{' '}
        <Link href="/contact/">contact page</Link>. Corrections are welcome and get acted on.
      </p>

      <div className="cal cal-tip">
        <b>For the site owner: what to get reviewed</b>
        Two things. First, the governing law and jurisdiction clause, which this draft
        deliberately omits because it depends on where you are established and where you
        intend to enforce — a solicitor will add the right one in minutes. Second, if you
        start selling, consumer law in the UK and EU gives buyers statutory rights including a
        cooling-off period for digital goods, which has to be addressed explicitly. A merchant
        of record such as Lemon Squeezy handles much of that for you, which is a good reason
        to use one rather than taking card payments directly.
      </div>
    </div>
  );
}
