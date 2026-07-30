import { Fragment, type ReactNode } from 'react';

/**
 * Renderer for long-form articles.
 *
 * Deliberately small: it covers the block types the content actually uses —
 * headings, paragraphs, lists, tables, fenced code and blockquotes — and
 * nothing else. A full MDX pipeline adds several dependencies and a compile
 * step for features nothing here needs. The content files are valid MDX, so
 * swapping this out later costs nothing.
 */

type Block =
  | { kind: 'h2' | 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'code'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'hr' };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** Handles `code`, **bold** and *italic* within a line. */
function inline(text: string): ReactNode {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function splitRow(line: string): string[] {
  return line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((c) => c.trim());
}

export function parseArticle(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.split('\n');
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      i++;
      continue;
    }

    if (line.startsWith('```')) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        body.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ kind: 'code', text: body.join('\n') });
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push({ kind: 'h3', text: line.slice(4).trim() });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (/^---+$/.test(line)) {
      blocks.push({ kind: 'hr' });
      i++;
      continue;
    }

    // Table: a header row, a separator row, then body rows.
    if (line.startsWith('|') && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1].trim())) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      blocks.push({ kind: 'table', head, rows });
      continue;
    }

    if (line.startsWith('> ')) {
      const body: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        body.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ kind: 'quote', text: body.join(' ') });
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push({ kind: 'ul', items });
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s*/, ''));
        i++;
      }
      blocks.push({ kind: 'ol', items });
      continue;
    }

    // Otherwise gather consecutive lines into one paragraph.
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#|```|\||>|[-*] |\d+\. |---+$)/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    if (para.length) blocks.push({ kind: 'p', text: para.join(' ') });
  }

  return blocks;
}

export default function ArticleBody({ source }: { source: string }) {
  const blocks = parseArticle(source);

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
          case 'code':
            return (
              <pre className="syn" key={i}>
                {b.text}
              </pre>
            );
          case 'quote':
            return (
              <blockquote className="pull" key={i}>
                {inline(b.text)}
              </blockquote>
            );
          case 'hr':
            return <hr className="rule" key={i} />;
          case 'ul':
            return (
              <ul key={i}>
                {b.items.map((item, k) => (
                  <li key={k}>{inline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i}>
                {b.items.map((item, k) => (
                  <li key={k}>{inline(item)}</li>
                ))}
              </ol>
            );
          case 'table':
            return (
              <div className="table-scroll" key={i}>
                <table className="args">
                  <thead>
                  <tr>
                    {b.head.map((h, k) => (
                      <th key={k} scope="col">
                        {inline(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, k) => (
                    <tr key={k}>
                      {row.map((cell, c) => (
                        <td key={c}>{inline(cell)}</td>
                      ))}
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return <p key={i}>{inline(b.text)}</p>;
        }
      })}
    </>
  );
}
