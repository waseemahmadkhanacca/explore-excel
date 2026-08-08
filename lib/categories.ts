/**
 * Category landing pages.
 *
 * These exist for two reasons. They target head terms the flat library cannot
 * ("excel text functions", "excel lookup functions"), and they replace the
 * `/formulas/?category=X` links the header used to carry — query-string
 * variants of one page, which Search Console reported as duplicates.
 *
 * Every entry carries real copy. A category page that only lists links is a
 * thin page, and thin pages are a liability rather than an asset.
 *
 * `category` must match the `category:` value in the MDX frontmatter exactly.
 */

export interface FormulaCategory {
  slug: string;
  category: string;
  /** Page heading and the phrase people actually search for. */
  h1: string;
  title: string;
  description: string;
  /** Opening paragraphs. Written per category, never templated. */
  intro: string[];
  /** The mistake that costs people the most time in this category. */
  pitfall: { title: string; body: string };
  /** Where to go next, by formula name. Resolved against the library. */
  startWith: string[];
}

export const CATEGORIES: FormulaCategory[] = [
  {
    slug: 'lookup',
    category: 'Lookup',
    h1: 'Excel lookup functions',
    title: 'Excel Lookup Functions — XLOOKUP, VLOOKUP, INDEX and MATCH',
    description:
      'Every Excel lookup function with a live, editable example. When to use XLOOKUP over VLOOKUP, why INDEX and MATCH still matters, and how to fix a lookup returning #N/A.',
    intro: [
      'A lookup answers one question: given a value in one place, what is the matching value somewhere else. Almost every real spreadsheet does this, and almost every broken spreadsheet is broken here.',
      'The choice between them is mostly about which version of Excel your file has to open in. XLOOKUP is the best of them and needs Excel 365 or 2021. INDEX and MATCH does everything XLOOKUP does, works in every version ever shipped, and reads far worse. VLOOKUP is the one everybody learns first and the one most likely to fail quietly.',
      'If a file will go to a client, an auditor or anyone whose Excel version you do not control, use INDEX and MATCH. Otherwise use XLOOKUP and stop thinking about it.',
    ],
    pitfall: {
      title: 'Almost every failed lookup is a data problem, not a formula problem',
      body: 'When two values look identical and refuse to match, the cause is nearly always a trailing space or a number stored as text. Check with LEN and ISNUMBER before touching the formula — it resolves more lookup failures than every other fix combined.',
    },
    startWith: ['XLOOKUP', 'VLOOKUP', 'INDEX', 'MATCH'],
  },
  {
    slug: 'text',
    category: 'Text',
    h1: 'Excel text functions',
    title: 'Excel Text Functions — LEFT, MID, LEN, TRIM and CONCATENATE',
    description:
      'Every Excel text function with a live, editable example. Split codes apart, join names together, and find the invisible whitespace that breaks lookups.',
    intro: [
      'Text functions do two jobs: pull a piece out of a string, or build a string out of pieces. Between them they handle most of the cleanup that arrives with data from another system.',
      'The extraction functions — LEFT, MID and their relatives — take characters by position. That works until the position moves, which is why pairing them with FIND to locate a separator is worth learning early. The joining functions run the other way: CONCATENATE and the newer TEXTJOIN assemble values, and you supply every space and comma yourself.',
      'TRIM and LEN belong in a category of their own. Neither transforms anything interesting, and together they diagnose the single most common cause of a spreadsheet that will not behave.',
    ],
    pitfall: {
      title: 'A text function always returns text, even when the result looks numeric',
      body: 'MID on a product code gives you "1042" as a string, which will never match 1042 stored as a number. Wrap it in VALUE when the result feeds a lookup or a calculation, or the match fails with nothing on screen to explain why.',
    },
    startWith: ['TRIM', 'LEN', 'MID', 'CONCATENATE'],
  },
  {
    slug: 'math',
    category: 'Math',
    h1: 'Excel math and statistical functions',
    title: 'Excel Math Functions — SUMIF, SUMIFS, COUNTIF, ROUND and SUMPRODUCT',
    description:
      'Every Excel math and statistical function with a live, editable example. Conditional totals with SUMIFS, counting with COUNTIF, and why ROUND is not a formatting choice.',
    intro: [
      'This is the largest group in the library, and most of it is one idea repeated: total, count or average the rows that meet a condition. SUMIF and SUMIFS, COUNTIF and COUNTIFS, AVERAGEIF and AVERAGEIFS are the same question asked six ways.',
      'Learn the plural versions. SUMIFS takes many conditions where SUMIF takes one, and its arguments are in a different order — the range to add comes first rather than last. Writing the plural by default means never being caught by that difference, and it costs nothing on a single condition.',
      'ROUND is the outlier here and deserves its own attention. Number formatting changes what a cell displays; ROUND changes what it holds. Confusing the two is how a set of figures that each look right add up to something that is not.',
    ],
    pitfall: {
      title: 'A conditional total returning zero is telling you something useful',
      body: 'Run COUNTIFS with the same range and criteria before assuming the formula is wrong. A count of zero means the criteria never matched and the problem is in your data. A count above zero means the criteria are fine and the problem is in the range being totaled.',
    },
    startWith: ['SUMIFS', 'COUNTIF', 'SUMIF', 'ROUND'],
  },
  {
    slug: 'logical',
    category: 'Logical',
    h1: 'Excel logical functions',
    title: 'Excel Logical Functions — IF, IFS, AND and IFERROR',
    description:
      'Every Excel logical function with a live, editable example. Build readable conditions with IFS instead of nested IFs, and handle errors without hiding real ones.',
    intro: [
      'Logical functions decide something. IF is the whole category in miniature: test a condition, return one thing when it holds and another when it does not.',
      'The difficulty is never the first condition, it is the fifth. Nesting IF inside IF inside IF produces formulas nobody can read a month later, including the person who wrote them. IFS exists precisely for that, and a lookup table is usually better than either once there are more than a handful of outcomes.',
      'AND and OR do not decide anything on their own — they combine tests so that IF has one thing to evaluate. They also sit behind most useful conditional formatting rules, which is arguably where they earn their place.',
    ],
    pitfall: {
      title: 'IFERROR hides every error, not just the one you meant',
      body: 'Wrapping a formula in IFERROR to suppress a #N/A also suppresses #REF! and #DIV/0! — genuine faults you would want to know about. Use IFNA when you only mean "not found", and keep IFERROR for cases where any failure really does have the same answer.',
    },
    startWith: ['IF', 'IFS', 'AND', 'IFERROR'],
  },
  {
    slug: 'date',
    category: 'Date',
    h1: 'Excel date functions',
    title: 'Excel Date Functions — EOMONTH, DATEDIF, NETWORKDAYS and WEEKDAY',
    description:
      'Every Excel date function with a live, editable example. Month ends, working days, ages and durations — and why Excel stores every date as a number.',
    intro: [
      'One fact explains almost everything in this category: Excel does not store dates as dates. It stores a count of days since December 30, 1899, and applies a format that makes the number look like a date.',
      'Once that is clear, the functions make sense. Date arithmetic is ordinary arithmetic, which is why adding 30 to an invoice date gives you payment terms. EOMONTH and EDATE move by calendar months, which days cannot do reliably. NETWORKDAYS counts working days and takes a holiday list, because a working day is a business definition rather than a mathematical one.',
      'It also explains the errors. A date that will not sort or calculate is text that resembles a date, and no date function will accept it until it is converted.',
    ],
    pitfall: {
      title: 'A date function returns a number, and inherits no formatting',
      body: 'EOMONTH and EDATE hand back a serial like 46053, which appears as a bare number until you format the cell as a date. It looks broken and is not. Ctrl+Shift+3 applies a date format.',
    },
    startWith: ['EOMONTH', 'NETWORKDAYS', 'DATEDIF', 'WEEKDAY'],
  },
  {
    slug: 'dynamic-array',
    category: 'Dynamic array',
    h1: 'Excel dynamic array functions',
    title: 'Excel Dynamic Array Functions — FILTER, SORT and UNIQUE',
    description:
      'Every Excel dynamic array function with a live, editable example. Return whole sets of rows that update themselves, and understand what spilling means.',
    intro: [
      'These return many values from one formula. Type FILTER in a single cell and the matching rows appear beneath it, as many as there are — Excel calls that spilling, and it is the most useful change to formulas in twenty years.',
      'What makes them worth the switch is that the result stays live. A FILTER updates as the source data changes, where an AutoFilter is a manual action and a PivotTable needs refreshing. They also nest freely, so SORT wrapped around FILTER narrows a list and ranks it in one expression.',
      'The cost is compatibility. All of these need Excel 365 or 2021 and return #NAME? in Excel 2019 and earlier, with no equivalent that behaves the same way. For a file that leaves your organization, that is usually the deciding factor.',
    ],
    pitfall: {
      title: 'Spilling needs empty cells, and #SPILL! means it did not get them',
      body: 'Anything sitting in the way of the output blocks the whole formula rather than part of it. Because the size of the result changes with the data, leave more room below than you currently need.',
    },
    startWith: ['FILTER', 'SORT', 'UNIQUE'],
  },
];

export function getCategory(slug: string): FormulaCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

/** The slug for a frontmatter category value, for linking from a formula page. */
export function categorySlug(category: string): string | undefined {
  return CATEGORIES.find((c) => c.category === category)?.slug;
}
