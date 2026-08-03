import type { Sheet } from './formula-engine';
import { FORMULAS } from './content-data.generated';

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

// Parsed once, at module load, from the bundled data — no disk access here
// or anywhere below, which is what makes this safe to run inside a Worker.
const ALL_FORMULAS: Formula[] = FORMULAS.map((f) =>
  toFormula(f.slug, f.data as Record<string, unknown>, f.body)
).sort((a, b) => a.name.localeCompare(b.name));

const BY_SLUG = new Map(ALL_FORMULAS.map((f) => [f.slug, f]));

export function getFormulaSlugs(): string[] {
  return ALL_FORMULAS.map((f) => f.slug);
}

export function getFormula(slug: string): Formula | null {
  return BY_SLUG.get(slug) ?? null;
}

export function getAllFormulas(): Formula[] {
  return ALL_FORMULAS;
}

export function getCategories(): string[] {
  const set = new Set(ALL_FORMULAS.map((f) => f.category));
  return ['All', ...Array.from(set).sort()];
}
