# Launch checklist

Everything in the codebase is done. This is what only you can do.

Work through it in order — each step depends on the one before.

---

## 1. Buy the domain

The only unavoidable cost. About $10–15 a year.

Cloudflare Registrar sells at cost with no markup and no first-year discount that jumps later. Since you are hosting on Cloudflare anyway, it also removes a DNS setup step.

Once bought, update `NEXT_PUBLIC_SITE_URL` in your environment and `SITE.url` in `lib/schema.ts` if the domain differs from `exploreexcel.com`.

---

## 2. Get the API keys

### Gemini — for the AI assistant

1. Go to https://aistudio.google.com/apikey
2. Sign in and create a key

**Pakistan is on Google's supported list** — verified against their official regions page. If you get redirected to a "not available in your region" page, the cause is almost always an unverified age on your Google account rather than geography. Verify it at https://support.google.com/accounts/answer/10071085 and try again.

**Do not enable billing on this project.** Unlike most Google Cloud services, switching billing on silently deletes the free tier entirely, and every call then bills from the first token — including calls that would have fitted inside the free quota.

The site uses `gemini-2.5-flash-lite`, which has the largest free daily allowance. Rate limiting is set to 5 requests per hour per visitor to protect that quota.

### Resend — for sending templates

1. Sign up at https://resend.com
2. Add your domain and complete the DNS verification
3. Create an API key

Free tier: 3,000 emails a month, capped at 100 a day, one domain. The daily cap is the one you will hit first.

Domain verification is not optional. Sending from an unverified domain either fails outright or lands in spam.

---

## 3. Create the database

```
npx wrangler login
npx wrangler d1 create explore-excel-subscribers
```

Copy the `database_id` it prints into `wrangler.toml`, replacing `REPLACE_WITH_YOUR_DATABASE_ID`.

Then create the table:

```
npx wrangler d1 execute explore-excel-subscribers --remote --file=schema.sql
```

Verify it worked:

```
npx wrangler d1 execute explore-excel-subscribers --remote --command="SELECT name FROM sqlite_master WHERE type='table'"
```

You should see `subscribers` listed.

---

## 4. Set the secrets

Locally, create `.env.local`:

```
GEMINI_API_KEY=your_key
RESEND_API_KEY=your_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

For production, secrets go to Cloudflare rather than into a file:

```
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put RESEND_API_KEY
```

Never commit `.env.local`. It is already in `.gitignore`.

---

## 5. Change the sending address

`lib/email.ts` has this near the top:

```ts
const FROM = 'Explore Excel <hello@exploreexcel.com>';
```

Change it to an address on your verified domain. Emails will not send otherwise.

Also update the contact address on `app/contact/page.tsx`.

---

## 6. Deploy

```
npm run deploy
```

Then connect your domain in the Cloudflare dashboard under Workers & Pages.

---

## 7. Test the live site properly

Do not skip this. Test on the real domain, not localhost.

- [ ] Request a template with your own email — does the file actually arrive?
- [ ] Click the unsubscribe link in that email — does it confirm?
- [ ] Check the database recorded the row and then the unsubscribe timestamp
- [ ] Ask the AI assistant for a formula — does it return one?
- [ ] Ask it six times in an hour — does the sixth get rate limited?
- [ ] Open a formula page and edit a cell in the grid
- [ ] Press Ctrl+K and search for something
- [ ] Open the site on your phone

---

## 8. Search Console

1. Add the property at https://search.google.com/search-console
2. Verify via DNS (Cloudflare makes this a two-click job)
3. Submit `https://yourdomain.com/sitemap.xml`

Then leave it alone. Indexing takes days to weeks. Checking daily changes nothing and is a good way to lose heart.

---

## 9. Analytics

Cloudflare Web Analytics is free, needs no cookie banner because it sets no cookies, and is enabled from the dashboard in one click. Start there.

Google Analytics gives more depth and requires a consent banner in the UK and EU. Add it later if you need the detail.

---

## 10. Before you take money or run ads

Three things need professional review. They are cheap now and expensive later.

**Privacy and Terms.** Both pages are written to be accurate about what the site does, and both carry a note explaining exactly what to get checked. A data protection consultant or an ICO-registered UK solicitor covers it in about an hour.

**Cookie consent.** Required once advertising is on. Your ad network will specify the wording and usually provides the banner.

**Tax.** VAT on digital goods sold to UK and EU consumers is owed where the customer is, not where you are. Using a merchant of record — Lemon Squeezy or Paddle — moves that obligation to them. This is the main reason to use one rather than taking card payments directly.

**Governing law.** The Terms page deliberately doesn't name a governing law and jurisdiction — that depends on where you're established and where you'd actually want to enforce a dispute, and a solicitor adds the correct clause in minutes once that's settled.

**Consumer rights on digital goods.** Once you sell anything, UK and EU consumer law gives buyers statutory rights including a cooling-off period for digital purchases, which needs to be addressed explicitly in your terms. A merchant of record such as Lemon Squeezy handles much of this for you.

---

## What happens next

**Months 1–3.** Very little traffic. This is normal and not a signal to change anything. Google is evaluating a new domain. Keep publishing.

**Months 4–6.** First rankings, usually on long-tail queries. Traffic starts compounding. YouTube may outperform the site at this stage.

**Months 7–12.** Ad revenue becomes meaningful and the early pages start ranking as domain authority builds.

The operating cadence document has the weekly rhythm. Five formula pages and three videos a week is the commitment; everything else is secondary.

The single biggest risk is stopping in month three, when the work feels like it is producing nothing. It is producing something — the results just arrive on a delay.
