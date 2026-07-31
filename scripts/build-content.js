/**
 * Bundles every MDX content file into a single generated TypeScript module.
 *
 * Why this exists: lib/content.ts and lib/articles.ts used to read .mdx files
 * from disk with `fs.readFileSync` at request time. That works in local dev
 * and in `next build`, because both run in a real Node.js process with real
 * disk access. It does not work once the site is deployed to Cloudflare
 * Workers — the Workers runtime has no reliable access to arbitrary project
 * files at request time, so every lookup silently failed and every formula,
 * guide and blog page 404'd, while pages backed by plain data (templates)
 * worked fine.
 *
 * The fix is to remove the runtime dependency on the filesystem entirely.
 * This script runs once, before the Next.js build, reads every .mdx file
 * with real Node fs (safe here — this script only ever runs on a real
 * machine, never inside a Worker), and writes out plain JavaScript objects
 * containing everything content.ts and articles.ts need. Those modules then
 * import the generated data instead of touching disk, so there is nothing
 * left that can fail differently in one environment than another.
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = path.join(__dirname, '..');
const OUT_FILE = path.join(ROOT, 'lib', 'content-data.generated.ts');

function readDir(dir) {
  const full = path.join(ROOT, 'content', dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), 'utf8');
      const { data, content } = matter(raw);
      return { slug: file.replace(/\.mdx$/, ''), data, body: content };
    });
}

const formulas = readDir('formulas');
const guides = readDir('guides');
const blog = readDir('blog');

const banner =
  '// GENERATED FILE — do not edit by hand.\n' +
  '// Produced by scripts/build-content.js from the .mdx files in content/.\n' +
  '// Run `npm run build` (which runs this automatically) after editing any\n' +
  '// .mdx file to regenerate this.\n\n';

const body =
  `export const FORMULAS = ${JSON.stringify(formulas, null, 2)} as const;\n\n` +
  `export const GUIDES = ${JSON.stringify(guides, null, 2)} as const;\n\n` +
  `export const BLOG_POSTS = ${JSON.stringify(blog, null, 2)} as const;\n`;

fs.writeFileSync(OUT_FILE, banner + body);

console.log(
  `Bundled content: ${formulas.length} formulas, ${guides.length} guides, ${blog.length} blog posts -> lib/content-data.generated.ts`
);
