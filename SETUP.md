# Setup — read this first

## What you have

A complete, working Next.js website. It has been built and tested, not just
written. `npm run dev` will work.

## Requirements

Node.js 18 or newer. You already have this working via the portable Node at
`E:\Node\node-v24.18.0-win-x64`.

## Steps

Open cmd and run these one at a time, pressing Enter after each.

**1. Go to the project folder**

```
cd /d "C:\path\to\explore-excel"
```

Use quotes if the path has spaces in it.

**2. Check the files are in the right place**

```
dir
```

You should see: `app`, `components`, `content`, `lib`, `public`, `styles`,
`package.json`, `tsconfig.json`, `next.config.mjs`.

If instead you see loose `.ts` and `.tsx` files with no folders, the zip was
extracted wrongly — extract it again keeping folders.

**3. Install the dependencies**

```
npm install
```

Takes one to two minutes. It creates a large `node_modules` folder, which is
normal. You may see warnings about deprecated packages — those are harmless.

**4. Check everything is consistent**

```
npm run typecheck
```

No output means it passed.

**5. Run the site**

```
npm run dev
```

Then open http://localhost:3000 in your browser.

Press Ctrl+C in cmd to stop the server.

## What works right now

- Homepage with the live spreadsheet hero
- Formula library index with category filters
- The XLOOKUP page, fully interactive
- 404 page
- Sitemap at /sitemap.xml
- AI assistant page (see below)

## The AI assistant

The page loads, but it will say it is not configured until you add a key.

1. Get a free key at https://aistudio.google.com/apikey
2. Create a file called `.env.local` in the project folder
3. Put this in it:

```
GEMINI_API_KEY=your_key_here
```

4. Stop the server (Ctrl+C) and run `npm run dev` again

## Adding your second formula page

Copy `content/formulas/xlookup.mdx` to a new file, for example
`content/formulas/sumifs.mdx`, and edit it. The page, the library entry, the
sitemap entry and the structured data all appear automatically.

That is the whole workflow. One file per formula.

## If something goes wrong

Run this and send me the output:

```
npm run typecheck
```

Error messages include the file and line number, which makes them quick to fix.
