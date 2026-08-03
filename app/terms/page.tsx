import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of use',
  description:
    'The terms governing use of Explore Excel, its templates and its AI assistant, including the license, disclaimers, and the DMCA process.',
  alternates: { canonical: '/terms/' },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">Legal</span>
      <h1>Terms of use</h1>
      <p className="lede">
        Last updated August 3, 2026. Short, and written to be read rather than skipped.
      </p>

      <h2 id="acceptance">Accepting these terms</h2>
      <p>
        Using this site means accepting these terms. If you do not accept them, please do not
        use the site. They form the agreement between you and Explore Excel, operated by
        Waseem as a sole operator.
      </p>

      <h2 id="eligibility">Who may use the site</h2>
      <p>
        You must be at least 13 years old. If you are under 18, you may use the site only with
        the involvement of a parent or guardian. By using it you confirm you meet this.
      </p>

      <h2 id="using">Using the site</h2>
      <p>
        The formula library, the guides and the free templates are yours to use, at work or
        personally. You may use anything you learn here in your own workbooks with no
        restriction and no attribution required. Nothing here is licensed per seat and nothing
        requires an account.
      </p>

      <h2 id="templates">The templates</h2>
      <p>
        You get a worldwide, royalty-free, non-exclusive license to download, edit, rename and
        use the templates, including commercially and including inside paid work for your own
        clients. That is what they are for.
      </p>
      <p>What the license does not permit is redistributing them as a competing collection:</p>
      <ul>
        <li>republishing them as your own template library</li>
        <li>selling them, either individually or bundled</li>
        <li>using them as the substance of a paid course or product</li>
      </ul>
      <p>
        The distinction is between using a template to do work and reselling the template
        itself.
      </p>

      <h2 id="content">The written content</h2>
      <p>
        The text, structure and examples on this site are owned by Explore Excel and protected
        by copyright. Quote from it with a link back. Do not republish whole articles, and do
        not scrape the library to reproduce it elsewhere, including to train a model or to
        populate a competing reference.
      </p>

      <h2 id="conduct">What you may not do</h2>
      <ul>
        <li>Break the site, or try to — no scraping at volume, no denial of service</li>
        <li>Circumvent the rate limit on the AI assistant</li>
        <li>Use the site to do anything unlawful, or to infringe anyone&apos;s rights</li>
        <li>Misrepresent yourself as connected with Explore Excel</li>
      </ul>

      <h2 id="ai">The AI assistant</h2>
      <p>
        The assistant produces formulas from a description. It is a language model and it can
        be confidently wrong. Check what it gives you before relying on it, particularly for
        anything financial. Output is provided as is, with no warranty of accuracy, and you are
        responsible for verifying it before use.
      </p>
      <p>
        Do not paste confidential or personal information into it. Queries are sent to
        Google&apos;s API, and on the free tier those prompts may be used to improve their
        models. The <Link href="/privacy/">privacy policy</Link> covers this in more detail.
      </p>
      <p>
        Use is rate limited so that one person cannot exhaust the shared daily quota.
        Attempting to circumvent that limit is not permitted.
      </p>

      <h2 id="warranty">Disclaimer of warranties</h2>
      <p>
        Everything here is tested — the templates are checked with real data and the formula
        examples are verified to evaluate correctly — but spreadsheets get used in
        circumstances nobody can anticipate.
      </p>
      <p style={{ textTransform: 'uppercase' }}>
        The site, the templates, the guides and the AI assistant are provided &ldquo;as
        is&rdquo; and &ldquo;as available,&rdquo; without warranty of any kind, express or
        implied. To the fullest extent permitted by law, Explore Excel disclaims all
        warranties, including the implied warranties of merchantability, fitness for a
        particular purpose, title, and non-infringement, and any warranty that the site will
        be uninterrupted, error free, or free of harmful components.
      </p>
      <p>
        Check anything before relying on it for a decision that matters. Nothing on this site
        is accounting, tax, legal, audit, investment or financial advice, and no professional
        relationship is created by using it.
      </p>

      <h2 id="liability">Limitation of liability</h2>
      <p style={{ textTransform: 'uppercase' }}>
        To the fullest extent permitted by law, Explore Excel will not be liable for any
        indirect, incidental, special, consequential, exemplary or punitive damages, or for any
        loss of profits, revenue, data, business or goodwill, arising out of or relating to
        your use of this site or its files, whether based in contract, tort, strict liability
        or any other theory, even if advised of the possibility of such damages. Explore
        Excel&apos;s total liability for all claims relating to the site will not exceed one
        hundred US dollars ($100).
      </p>
      <p>
        Some states do not allow the exclusion of certain warranties or the limitation of
        certain damages. Where that applies to you, the exclusions and limitations above apply
        only to the extent permitted, and nothing here limits liability for fraud or for
        anything else that cannot lawfully be limited.
      </p>

      <h2 id="indemnity">Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Explore Excel from any claim, loss or expense,
        including reasonable legal fees, arising from your misuse of the site, your breach of
        these terms, or your infringement of anyone else&apos;s rights.
      </p>

      <h2 id="dmca">Copyright complaints</h2>
      <p>
        If you believe material on this site infringes your copyright, send a notice under the
        Digital Millennium Copyright Act to the address on the{' '}
        <Link href="/contact/">contact page</Link>, marked for the attention of the copyright
        agent, including:
      </p>
      <ul>
        <li>your signature, physical or electronic</li>
        <li>identification of the work you say is infringed</li>
        <li>the URL of the material you want removed</li>
        <li>your name, address, telephone number and email address</li>
        <li>
          a statement that you believe in good faith the use is not authorized by the owner,
          its agent, or the law
        </li>
        <li>
          a statement, under penalty of perjury, that the information is accurate and that you
          are the owner or authorized to act for them
        </li>
      </ul>
      <p>
        Valid notices are acted on promptly. If your material is removed you may send a
        counter-notice with the same particulars. Repeat infringers are blocked.
      </p>

      <h2 id="availability">Availability and changes</h2>
      <p>
        No uptime is guaranteed. The site may be unavailable for maintenance, and features may
        change or be withdrawn. These terms may be updated; the date at the top reflects the
        current version, and continuing to use the site after a change means accepting it. If a
        paid product is ever introduced, it will have its own terms covering payment, refunds
        and support.
      </p>

      <h2 id="microsoft">Microsoft and Excel</h2>
      <p>
        Microsoft and Excel are trademarks of Microsoft Corporation. This site is independent
        and is not affiliated with, endorsed by, or sponsored by Microsoft. Function behavior
        described here reflects testing, not official documentation, and Microsoft may change
        it.
      </p>

      <h2 id="law">Governing law</h2>
      <p>
        These terms are governed by the laws of the Islamic Republic of Pakistan, where the
        site is operated, without regard to conflict-of-law rules, and the courts of Pakistan
        will have jurisdiction over any dispute.
      </p>
      <p>
        This does not take away rights you have where you live. If you are a consumer in the
        United States, you keep the protection of any mandatory consumer law of your own state,
        and nothing in these terms prevents you from bringing a claim in a small claims court
        in your own area.
      </p>

      <h2 id="general">General</h2>
      <p>
        If any part of these terms is found unenforceable, the rest stays in force. Not
        enforcing a term on one occasion does not waive it. You may not assign your rights
        under these terms; Explore Excel may assign them in connection with a transfer of the
        site. These terms, together with the{' '}
        <Link href="/privacy/">privacy policy</Link>, are the entire agreement between us about
        the site.
      </p>

      <h2 id="contact">Questions</h2>
      <p>
        If something here is unclear or you think a template is wrong, say so on the{' '}
        <Link href="/contact/">contact page</Link>. Corrections are welcome and get acted on.
      </p>
    </div>
  );
}
