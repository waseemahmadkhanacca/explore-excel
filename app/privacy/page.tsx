import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'What data Explore Excel collects, why, and how to get it removed.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">Legal</span>
      <h1>Privacy policy</h1>
      <p className="lede">
        Last updated 1 August 2026. This explains what is collected, why, and how to have it
        removed.
      </p>

      <h2 id="who">Who is responsible</h2>
      <p>
        Explore Excel is operated by Waseem, based in Pakistan. For any question about your
        data, or to have it removed, use the address on the{' '}
        <Link href="/contact/">contact page</Link>.
      </p>

      <h2 id="what">What is collected</h2>

      <h3>Your email address, if you give it</h3>
      <p>
        Entered only when you ask for a template. Alongside it we record the date, which
        template you asked for, and the exact wording of the consent you agreed to. That last
        item exists so that if you ever ask why you are receiving email, there is a precise
        answer.
      </p>
      <p>
        The address is used to send the file you requested and occasional emails about new
        templates and guides. It is never sold, rented or shared for marketing.
      </p>

      <h3>Analytics</h3>
      <p>
        Aggregate figures about which pages are read, roughly which country visitors are in,
        and which sites they arrived from. This is not tied to an identifiable person and is
        not used to build a profile of you.
      </p>

      <h3>AI assistant queries</h3>
      <p>
        Text you type into the formula assistant is sent to Google&apos;s Gemini API to
        generate a response. On the free tier Google may use those prompts to improve its
        models.{' '}
        <strong>
          Do not paste confidential information, personal data, or anything commercially
          sensitive into it.
        </strong>{' '}
        Describe the shape of your problem instead of pasting the real thing.
      </p>

      <h3>Server logs</h3>
      <p>
        Our host records IP addresses briefly for rate limiting and abuse prevention. These
        are not linked to your email address and are not retained long term.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>
        Analytics cookies, and — once advertising is switched on — cookies set by the
        advertising network to measure and target ads. Where the law requires it, you will be
        asked to consent before any non-essential cookie is set, and you can withdraw that
        consent through the same banner.
      </p>
      <p>
        The site itself does not require cookies. The formula library, the templates and the
        guides all work with cookies refused.
      </p>

      <h2 id="processors">Who else handles your data</h2>
      <table className="args">
        <thead>
          <tr>
            <th scope="col">Service</th>
            <th scope="col">What it handles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cloudflare</td>
            <td>Hosting, and the database holding subscriber addresses</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Sending the emails you asked for</td>
          </tr>
          <tr>
            <td>Google (Gemini API)</td>
            <td>Generating responses in the AI assistant</td>
          </tr>
          <tr>
            <td>Advertising network</td>
            <td>Serving ads, once enabled</td>
          </tr>
        </tbody>
      </table>
      <p>
        Each processes data under its own terms. Because these services operate
        internationally, your data may be processed outside your own country, including
        outside the UK and the European Economic Area. Where that happens, we rely on the
        safeguards those providers have in place — standard contractual clauses or an
        equivalent transfer mechanism set out in their own data processing terms.
      </p>

      <h2 id="retention">How long it is kept</h2>
      <p>
        Email addresses are kept until you unsubscribe. When you unsubscribe, the record is
        marked as unsubscribed rather than deleted — this is what allows us to prove we
        stopped, and to avoid re-adding you by accident. If you would rather it were erased
        entirely, ask and it will be.
      </p>

      <h2 id="rights">Your rights</h2>
      <p>
        If you are in the UK or the EU, the GDPR gives you specific rights. We apply them to
        everyone, wherever you are, because maintaining two standards would be worse for
        everybody.
      </p>
      <ul>
        <li>Ask what data is held about you</li>
        <li>Ask for it to be corrected</li>
        <li>Ask for it to be deleted</li>
        <li>Withdraw consent for marketing email at any time</li>
        <li>Ask for a copy of your data in a portable format</li>
        <li>Object to how it is being processed</li>
      </ul>
      <p>
        The unsubscribe link at the bottom of every email works in one click and requires no
        explanation. For anything else, use the contact address. Requests are answered within
        thirty days and usually much sooner.
      </p>

      <h3>Complaining to a regulator</h3>
      <p>
        If you are unhappy with how your data has been handled, you can complain to your data
        protection authority. In the UK that is the Information Commissioner&apos;s Office at{' '}
        <a href="https://ico.org.uk/" rel="noopener noreferrer" target="_blank">
          ico.org.uk
        </a>
        . In the EU it is the supervisory authority in the country where you live. You are not
        required to contact us first, though it is usually quicker if you do.
      </p>

      <h2 id="legal-basis">Why we are allowed to hold it</h2>
      <p>
        For email, the basis is your consent, given by ticking the box when you requested a
        file. For server logs and rate limiting, the basis is legitimate interest in keeping
        the site working and preventing abuse.
      </p>

      <h2 id="children">Children</h2>
      <p>
        This site is intended for working adults. It is not directed at children and we do not
        knowingly collect data from anyone under sixteen.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        Material changes will be noted by updating the date at the top of this page. If a
        change affects how your email address is used, subscribers will be told directly
        rather than expected to notice.
      </p>
    </div>
  );
}
