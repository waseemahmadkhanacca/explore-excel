import { Fragment, type ReactNode } from 'react';

/**
 * A deliberately small renderer for the formula body content.
 *
 * A full MDX pipeline (next-mdx-remote + remark + rehype) adds several
 * dependencies and a compile step for what is, in practice, five block
 * types. This handles those five and nothing else. If the content ever
 * needs real MDX features, swap this out — the content files are already
 * valid MDX, so nothing has to be rewritten.
 *
 * Supported:
 *   ## Heading            -> h2
 *   ### Heading           -> h3
 *   <Formula>...</Formula>            -> syntax block
 *   <Callout type="tip" title="...">  -> callout box
 *   anything else         -> paragraph, with `code` spans
 */

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'formula'; text: string }
  | { kind: 'callout'; level: string; title: string; text: string }
  | { kind: 'p'; text: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Renders `code` spans inside otherwise plain text. */
function inline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function parseBody(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: trimmed.slice(4).trim() });
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: trimmed.slice(3).trim() });
      i++;
      continue;
    }

    const formulaMatch = trimmed.match(/^<Formula>(.*)<\/Formula>$/);
    if (formulaMatch) {
      blocks.push({ kind: 'formula', text: formulaMatch[1] });
      i++;
      continue;
    }

    if (trimmed.startsWith('<Callout')) {
      const level = trimmed.match(/type="([^"]+)"/)?.[1] ?? 'tip';
      const title = trimmed.match(/title="([^"]+)"/)?.[1] ?? '';
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('</Callout>')) {
        body.push(lines[i].trim());
        i++;
      }
      i++; // skip closing tag
      blocks.push({
        kind: 'callout',
        level,
        title,
        text: body.filter(Boolean).join(' '),
      });
      continue;
    }

    // Gather consecutive non-empty lines into one paragraph.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('<')
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') });
  }

  return blocks;
}

export default function FormulaBody({ source }: { source: string }) {
  const blocks = parseBody(source);

  return (
    <>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'h2':
            return (
              <h2 key={i} id={slugify(b.text)}>
                {b.text}
              </h2>
            );
          case 'h3':
            return <h3 key={i}>{b.text}</h3>;
          case 'formula':
            return (
              <div className="syn sm" key={i}>
                {b.text}
              </div>
            );
          case 'callout':
            return (
              <div className={`cal cal-${b.level}`} key={i}>
                {b.title && <b>{b.title}</b>}
                {inline(b.text)}
              </div>
            );
          default:
            return <p key={i}>{inline(b.text)}</p>;
        }
      })}
    </>
  );
}
