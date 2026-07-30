import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Sheet } from './formula-engine';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'formulas');

export interface Mistake {
  level: 'error' | 'warning' | 'tip';
  title: string;
  body: string;
}

export interface Argument {
  name: string;
  required: boolean;
  description: string;
}

export interface Preset {
  label: string;
  formula: string;
}

export interface DemoConfig extends Sheet {
  file: string;
  presets: Preset[];
}

export interface Formula {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  versions: string[];
  updated: string;
  readingTime: number;
  video?: string;
  practiceFile?: string;
  related: string[];
  syntax: string;
  arguments: Argument[];
  demo: DemoConfig;
  mistakes: Mistake[];
  faq: { q: string; a: string }[];
  body: string;
}

/** Raw frontmatter uses `columns`/`headers` naming that maps onto Sheet. */
function toFormula(slug: string, data: Record<string, unknown>, body: string): Formula {
  const demo = data.demo as Record<string, unknown>;
  return {
    slug,
    name: String(data.name),
    category: String(data.category),
    summary: String(data.summary),
    description: String(data.description),
    versions: (data.versions as string[]) ?? [],
    updated: String(data.updated),
    readingTime: Number(data.readingTime ?? 5),
    video: data.video as string | undefined,
    practiceFile: data.practiceFile as string | undefined,
    related: (data.related as string[]) ?? [],
    syntax: String(data.syntax),
    arguments: (data.arguments as Argument[]) ?? [],
    demo: {
      file: String(demo.file),
      columns: demo.columns as string[],
      headers: demo.headers as string[],
      rows: demo.rows as Sheet['rows'],
      editable: demo.editable as number[] | undefined,
      money: demo.money as number[] | undefined,
      dates: demo.dates as number[] | undefined,
      presets: (demo.presets as Preset[]) ?? [],
    },
    mistakes: (data.mistakes as Mistake[]) ?? [],
    faq: (data.faq as { q: string; a: string }[]) ?? [],
    body,
  };
}

export function getFormulaSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

export function getFormula(slug: string): Formula | null {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return toFormula(slug, data as Record<string, unknown>, content);
}

export function getAllFormulas(): Formula[] {
  return getFormulaSlugs()
    .map((s) => getFormula(s))
    .filter((f): f is Formula => f !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategories(): string[] {
  const set = new Set(getAllFormulas().map((f) => f.category));
  return ['All', ...Array.from(set).sort()];
}
