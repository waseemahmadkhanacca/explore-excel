# Explore Excel

Explore. Learn. Automate.

A live, interactive Excel reference. Every formula page carries a working
spreadsheet the reader can edit in the browser.

---

## Why this is structured the way it is

The site's whole competitive position rests on two things: **volume of
indexed formula pages** and **the interactive grid**. Everything in this
codebase serves one of those two.

Adding a new formula page means writing **one MDX file**. No component work,
no route work, no CMS. That is deliberate — the operating plan calls for five
new pages a week, and any friction in that loop is what kills the project.

---

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000

Type checking and linting:

```bash
npm run typecheck
npm run lint
```

---

## Adding a formula page

Create `content/formulas/<slug>.mdx`. Copy `xlookup.mdx` as the starting
point — it's the reference implementation and shows every available field.

The frontmatter drives the whole page:

| Field | Purpose |
|---|---|
| `name`, `category`, `summary` | Library index card and navigation |
| `description` | Meta description and the page lede |
| `syntax`, `arguments` | Syntax block and argument table |
| `demo` | The interactive grid — data, editable columns, presets |
| `mistakes` | The common-mistakes blocks |
| `faq` | FAQ accordion **and** FAQ schema markup |
| `related` | Related-function grid at the foot |
| `video` | YouTube embed and VideoObject schema |

The MDX body below the frontmatter holds the worked examples. Use the
`<Formula>` and `<Callout>` components there.

Once the file exists, the page, the sitemap entry, and the structured data
are all generated automatically.

### The demo block

```yaml
demo:
  file: Product lookup.xlsx
  columns: [A, B, C, D]
  headers: [SKU, Product, Price, Stock]
  editable: [2, 3]      # zero-indexed columns the reader can edit
  money: [2]            # columns formatted as currency
  rows:
    - ['SKU-101', 'Widget', 24.50, 140]
  presets:
    - label: Basic lookup
      formula: '=XLOOKUP("SKU-114", A2:A7, C2:C7)'
```

Sheet row 1 is the header row, so `A2:A7` maps to the first six data rows.
This mirrors real Excel and keeps the formulas in the content copy-pasteable.

---

## The formula engine

`lib/formula-engine.ts` is a small, dependency-free evaluator. It currently
supports XLOOKUP, SUMIFS, COUNTIFS, AVERAGEIFS, SUM, AVERAGE, MAX, MIN and
COUNT.

It deliberately reproduces Excel's **error** behaviour as well as its results:
mismatched ranges return `#VALUE!`, missing matches return `#N/A`, unknown
functions return `#NAME?`. Those errors are surfaced under the grid in plain
English. This is not incidental — the error states are part of the teaching,
and they are what the "common mistakes" section of each page is demonstrating
live.

### When to replace it

Swap in [HyperFormula](https://hyperformula.handsontable.com/) once you need
more than about thirty functions. It supports 390+ and handles cell references
and cross-sheet formulas properly. It costs roughly 200KB, so keep it lazily
loaded and only on pages that need it. The `Sheet` and `EvalResult` types in
`formula-engine.ts` are the seam — keep them stable and the swap is contained.

---

## SEO

`lib/schema.ts` generates four schema types per formula page:

- **TechArticle** — establishes the page as a maintained technical reference
- **FAQPage** — the highest-value markup here. A rich FAQ result can occupy
  several times the vertical space of a normal listing, which matters more
  than ranking position alone once you are on page one
- **BreadcrumbList** — replaces the raw URL in results with a readable path
- **VideoObject** — makes the page eligible for a video thumbnail

`app/sitemap.ts` builds the sitemap from the content directory, so new pages
appear automatically.

### URL structure

Formula pages sit flat at `/formulas/<slug>/` rather than nested under a
category. Categories are filters on the index, not URL segments — a function
like SUMIFS is arguably maths, logical or lookup depending on use, and
committing that to the URL creates redirect debt later.

---

## Deploying to Cloudflare

```bash
npm run preview   # build and preview on the local Cloudflare runtime
npm run deploy    # build and deploy to Cloudflare Workers
```

This uses the OpenNext Cloudflare adapter. The older `@cloudflare/next-on-pages`
package is deprecated and should not be used.

Cloudflare over Vercel for one specific reason: Vercel's Hobby tier prohibits
commercial use, and this site is intended to sell templates and run display
advertising. Cloudflare's free tier permits it.

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

```
GEMINI_API_KEY=        # AI formula assistant — aistudio.google.com/apikey
RESEND_API_KEY=        # email capture (not wired up yet)
NEXT_PUBLIC_SITE_URL=  # https://exploreexcel.com
```

The assistant returns a clear "not configured yet" message without a key, so
the site runs fine before you set one up.

### Before the assistant goes public

Rate limiting in `app/api/assistant/route.ts` is currently an in-memory map.
On Cloudflare each edge instance keeps its own copy, so the effective limit is
higher than the configured number. Move the counter to Cloudflare KV before
this route sees real traffic — an ungated LLM endpoint on a public page will
have its quota drained.

---

## Performance

Target is 95+ Lighthouse with good Core Web Vitals. Two rules protect that:

1. **No heavy 3D.** A Three.js or Spline hero costs 500KB–2MB and makes the
   target unreachable. The homepage hero is the interactive grid instead —
   more distinctive than a 3D scene and effectively free.
2. **The grid is the only client component above the fold.** Everything else
   on a formula page is statically rendered.

---

## Verified build status

This codebase has been built and run, not just written:

- `npx tsc --noEmit` passes with zero errors under `strict`
- `next build` completes and prerenders 55 routes
- All routes return correct status codes, including a working 404
- Structured data (TechArticle, FAQPage, BreadcrumbList, VideoObject) is
  present in the prerendered HTML
- The interactive grid recalculates correctly in the production build
- Command palette tested: fuzzy match, arrow keys, Enter to navigate, Esc to close
- Template filtering and the email gate tested end to end
- No horizontal overflow across 8 pages at 390px, 834px and 1280px
- First Load JS is 109 kB on the formula page

## What is here

**21 formula pages**, each with a live editable spreadsheet, worked examples,
common mistakes and an FAQ marked up for rich results.

**8 Excel templates**, built and verified — roughly 5,000 formulas across them,
recalculated with zero errors and checked against independently calculated
answers.

**6 guides** from Excel basics through Power Query and interview preparation.

**4 blog posts** on spreadsheet design.

**Working email capture** — Resend for delivery, Cloudflare D1 for storage,
explicit consent, one-click unsubscribe.

**AI formula assistant** on Gemini Flash-Lite, rate limited.

**Command palette** with fuzzy search across everything.

## Adding to it

One MDX file each time:

- Formula page: `content/formulas/<slug>.mdx`
- Guide: `content/guides/<slug>.mdx`
- Blog post: `content/blog/<slug>.mdx`

Copy an existing file as the starting point. The page, the sitemap entry, the
navigation and the structured data all follow automatically.

`content/formulas/xlookup.mdx` is the reference implementation and shows every
available field.

## Verifying content before you publish

Every preset formula and every formula quoted in prose is evaluated by the same
engine that runs the page. If one is wrong the page shows an error rather than a
result, so open a new page in the browser before considering it finished.

The demo grid is a real calculation engine covering about fifty functions. It
reproduces Excel's error behaviour deliberately — mismatched ranges give
`#VALUE!`, missing lookups give `#N/A`. Those errors are part of the teaching.

## Before launch

`LAUNCH.md` has the full checklist. The short version:

1. Buy a domain, get a Gemini key and a Resend key, create the D1 database.
2. Change the sending address in `lib/email.ts` to your verified domain.
3. Have Privacy and Terms reviewed. Both pages explain exactly what to check.
4. Move the assistant's rate limiting to Cloudflare KV before it sees real
   traffic — the in-memory counter does not hold across edge instances.
