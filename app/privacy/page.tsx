import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'What data Explore Excel collects, why, who it goes to, and how to access or delete it. Written for US state privacy laws including the CCPA.',
  alternates: { canonical: '/privacy/' },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="prose-wrap">
      <span className="sec-lab">Legal</span>
      <h1>Privacy policy</h1>
      <p className="lede">
        Last updated August 3, 2026. This explains what is collected, why, who it is shared
        with, and how to get it corrected or deleted.
      </p>

      <h2 id="summary">The short version</h2>
      <p>
        We collect an email address only if you give us one to receive a template. We do not
        sell or share personal information, and we never have. We do not use personal
        information for targeted advertising. There is a one-click unsubscribe in every email,
        and you can ask us to delete everything we hold at any time.
      </p>

      <h2 id="who">Who is responsible</h2>
      <p>
        Explore Excel is operated by Waseem, a sole operator. Explore Excel is the business
        responsible for deciding how personal information on this site is handled. For any
        privacy question, or to exercise any of the rights below, use the address on the{' '}
        <Link href="/contact/">contact page</Link>.
      </p>

      <h2 id="collected">What is collected</h2>

      <h3>Information you give us</h3>
      <p>
        <strong>Your email address</strong>, entered only when you ask for a template.
        Alongside it we record the date, which template you asked for, and the exact wording
        of the consent you agreed to. That last item exists so that if you ever ask why you
        are receiving email, there is a precise answer.
      </p>
      <p>
        <strong>Anything you write to us</strong>, if you send a message or a correction.
      </p>

      <h3>Information collected automatically</h3>
      <p>
        <strong>Analytics.</strong> Aggregate figures about which pages are read, roughly
        which country and region visitors are in, and which sites they arrived from. This is
        not tied to a named person and is not used to build a profile of you.
      </p>
      <p>
        <strong>Server logs.</strong> Our host records IP addresses briefly for rate limiting
        and abuse prevention. These are not linked to your email address and are not retained
        long term.
      </p>
      <p>
        <strong>AI assistant queries.</strong> Text you type into the formula assistant is
        sent to Google&apos;s Gemini API to generate a response. On the free tier Google may
        use those prompts to improve its models.{' '}
        <strong>
          Do not paste confidential information, personal information, or anything
          commercially sensitive into it.
        </strong>{' '}
        Describe the shape of your problem instead of pasting the real thing.
      </p>

      <h2 id="categories">Categories of personal information</h2>
      <p>
        US state privacy laws ask for this in a specific form. Over the past twelve months we
        have collected the following categories, as those laws define them.
      </p>
      <div className="table-scroll">
        <table className="args">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Collected</th>
              <th scope="col">Why</th>
              <th scope="col">Who it goes to</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Identifiers (email address, IP address)</td>
              <td>Yes</td>
              <td>To send the file you asked for, and to prevent abuse</td>
              <td>Email and hosting providers</td>
            </tr>
            <tr>
              <td>Internet activity (pages viewed, referring site)</td>
              <td>Yes</td>
              <td>To understand which pages are useful</td>
              <td>Analytics provider</td>
            </tr>
            <tr>
              <td>Commercial information (which template you requested)</td>
              <td>Yes</td>
              <td>To send the right file and avoid sending it twice</td>
              <td>Email provider</td>
            </tr>
            <tr>
              <td>Geolocation (approximate, country and region)</td>
              <td>Yes</td>
              <td>Aggregate analytics only</td>
              <td>Analytics provider</td>
            </tr>
            <tr>
              <td>Sensitive personal information</td>
              <td>No</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr>
              <td>Biometric, financial account, or precise geolocation data</td>
              <td>No</td>
              <td>—</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We do not collect Social Security numbers, driver&apos;s license numbers, payment card
        numbers, health information, or precise location. The site takes no payments.
      </p>

      <h2 id="no-sale">We do not sell or share your information</h2>
      <p>
        We have not sold personal information, and we have not shared it for cross-context
        behavioral advertising, in the past twelve months. We do not do either now, and we do
        not intend to. Because there is nothing to opt out of, there is no
        &ldquo;Do Not Sell or Share My Personal Information&rdquo; link on this site.
      </p>
      <p>
        If that ever changes, this page will say so before it happens, an opt-out link will
        appear in the footer, and subscribers will be told directly rather than expected to
        notice.
      </p>
      <p>
        We also honor the Global Privacy Control browser signal. Since we do not sell or share
        data, that signal changes nothing today, but it will be respected if that ever
        changes.
      </p>

      <h2 id="processors">Who else handles your information</h2>
      <p>
        These are service providers acting on our instructions. Each is bound by its own terms
        and may not use your information for its own purposes, with the one exception noted
        for the AI assistant.
      </p>
      <div className="table-scroll">
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
      </div>
      <p>
        We may also disclose information if required by law, to respond to lawful requests, or
        to protect the rights and safety of readers and the site.
      </p>

      <h2 id="transfers">Where your information is processed</h2>
      <p>
        The site is operated from outside the United States and these providers operate
        internationally, so your information may be processed in the United States and in
        other countries. Wherever it is processed, it is handled as described here.
      </p>

      <h2 id="rights">Your rights</h2>
      <p>
        Depending on where you live, state law gives you specific rights. We apply them to
        everyone in the United States, wherever you are, because maintaining two standards
        would be worse for everybody.
      </p>
      <ul>
        <li>
          <strong>Know.</strong> Ask what information is held about you, where it came from,
          why we have it, and who it has gone to.
        </li>
        <li>
          <strong>Access.</strong> Get a copy, in a portable format.
        </li>
        <li>
          <strong>Correct.</strong> Have inaccurate information fixed.
        </li>
        <li>
          <strong>Delete.</strong> Have it erased, subject to narrow legal exceptions.
        </li>
        <li>
          <strong>Opt out</strong> of sale, sharing, targeted advertising, and profiling. We do
          none of these, so there is nothing to opt out of today.
        </li>
        <li>
          <strong>Limit</strong> the use of sensitive personal information. We collect none.
        </li>
        <li>
          <strong>Withdraw consent</strong> for marketing email at any time.
        </li>
        <li>
          <strong>Not be discriminated against</strong> for exercising any of these rights. You
          will get the same site, the same templates and the same price, which is nothing.
        </li>
      </ul>

      <h3>How to exercise them</h3>
      <p>
        The unsubscribe link at the bottom of every email works in one click and requires no
        explanation. For anything else, email the address on the{' '}
        <Link href="/contact/">contact page</Link> and say what you want done.
      </p>
      <p>
        We will confirm receipt within 10 days and respond substantively within 45 days. If we
        genuinely need longer, we will tell you why and take at most another 45 days. To
        protect you, we verify a request by checking that it comes from the email address on
        the record — we will not act on a deletion request for an address we cannot match.
      </p>
      <p>
        You may use an authorized agent to make a request. We will ask the agent for written
        proof that you authorized them.
      </p>

      <h3>Appeals</h3>
      <p>
        If we refuse a request, we will explain why. Several states give you a right to appeal
        that decision — reply to the refusal and say you are appealing, and it will be
        reconsidered and answered within 45 days. If the appeal is denied you may complain to
        your state Attorney General.
      </p>

      <h3>California residents</h3>
      <p>
        California&apos;s &ldquo;Shine the Light&rdquo; law lets residents ask once a year for a
        list of any personal information disclosed to third parties for their direct marketing
        purposes. We disclose nothing for that purpose, so the answer is always none, but you
        are entitled to ask.
      </p>

      <h2 id="retention">How long it is kept</h2>
      <p>
        Email addresses are kept until you unsubscribe. When you unsubscribe, the record is
        marked as unsubscribed rather than deleted — this is what allows us to prove we
        stopped and to avoid re-adding you by accident. If you would rather it were erased
        entirely, ask and it will be. Server logs are kept briefly for abuse prevention and
        then discarded.
      </p>

      <h2 id="email">Marketing email</h2>
      <p>
        Every commercial email we send identifies who it is from, includes a working
        unsubscribe link that stays active for at least 30 days after sending, and carries a
        valid physical postal address, as US law requires. Unsubscribe requests are honored
        within 10 business days and in practice immediately.
      </p>

      <h2 id="cookies">Cookies and tracking</h2>
      <p>
        Analytics cookies, and — once advertising is switched on — cookies set by the
        advertising network to measure ads. The site itself does not require cookies. The
        formula library, the templates and the guides all work with cookies refused.
      </p>
      <p>
        Some browsers send a &ldquo;Do Not Track&rdquo; signal. There is no common standard for
        how to interpret it, so we do not respond to it specifically. We do honor the Global
        Privacy Control signal as described above.
      </p>

      <h2 id="security">Security</h2>
      <p>
        Data is held with reputable providers, transmitted over encrypted connections, and
        access is limited to what is needed to run the site. No method of transmission or
        storage is completely secure, and we cannot promise absolute security.
      </p>

      <h2 id="children">Children</h2>
      <p>
        This site is intended for working adults. It is not directed to children under 13 and
        we do not knowingly collect personal information from them. If you believe a child
        under 13 has given us information, contact us and it will be deleted promptly. We do
        not knowingly sell or share the personal information of anyone under 16.
      </p>

      <h2 id="changes">Changes</h2>
      <p>
        Material changes will be noted by updating the date at the top of this page. If a
        change affects how your email address is used, subscribers will be told directly
        rather than expected to notice.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions, requests and complaints all go to the same place — the{' '}
        <Link href="/contact/">contact page</Link>. A real person reads them.
      </p>
    </div>
  );
}
