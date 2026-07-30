export interface Template {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  sheets: number;
  formulas: string[];
  file: string;
}

/**
 * Templates are defined here rather than in MDX because they carry no long-form
 * body — they are a card, a description and a download. If they ever grow
 * write-ups, move them to content/templates/ and mirror the formula loader.
 */
export const TEMPLATES: Template[] = [
  {
    slug: 'cash-flow-forecast',
    title: 'Cash flow forecast',
    summary: '13-week rolling forecast with variance',
    description:
      'A rolling thirteen-week cash forecast with opening balance, receipts, payments and a running closing position. Includes a variance column against last week so you can see where the forecast drifted and why.',
    category: 'Finance',
    difficulty: 'Intermediate',
    sheets: 4,
    formulas: ['SUMIFS', 'EOMONTH', 'XLOOKUP'],
    file: '/downloads/cash-flow-forecast.xlsx',
  },
  {
    slug: 'budget-vs-actual',
    title: 'Budget vs actual',
    summary: 'Department-level tracking with variance analysis',
    description:
      'Compare budget against actual by department and month, with absolute and percentage variance, and conditional formatting that flags anything over a threshold you set.',
    category: 'Finance',
    difficulty: 'Intermediate',
    sheets: 3,
    formulas: ['SUMIFS', 'IFERROR', 'ROUND'],
    file: '/downloads/budget-vs-actual.xlsx',
  },
  {
    slug: 'bank-reconciliation',
    title: 'Bank reconciliation',
    summary: 'Match statement lines against your ledger',
    description:
      'Paste the bank statement on one sheet and the ledger on another. The template matches on amount and date, flags what did not match, and produces the reconciling items summary.',
    category: 'Accounting',
    difficulty: 'Advanced',
    sheets: 5,
    formulas: ['XLOOKUP', 'COUNTIFS', 'SUMIFS'],
    file: '/downloads/bank-reconciliation.xlsx',
  },
  {
    slug: 'inventory-tracker',
    title: 'Inventory tracker',
    summary: 'Stock levels, reorder points and valuation',
    description:
      'Track quantity on hand, reorder point and lead time by SKU. Highlights items below reorder level and calculates closing inventory value on a periodic basis.',
    category: 'Operations',
    difficulty: 'Beginner',
    sheets: 3,
    formulas: ['XLOOKUP', 'IF', 'SUMIFS'],
    file: '/downloads/inventory-tracker.xlsx',
  },
  {
    slug: 'invoice-register',
    title: 'Invoice register',
    summary: 'Ageing buckets and follow-up dates',
    description:
      'A receivables register with automatic ageing into current, 30, 60 and 90-plus day buckets, plus a follow-up date column that flags what needs chasing this week.',
    category: 'Accounting',
    difficulty: 'Beginner',
    sheets: 2,
    formulas: ['DATEDIF', 'IFS', 'SUMIFS'],
    file: '/downloads/invoice-register.xlsx',
  },
  {
    slug: 'kpi-dashboard',
    title: 'KPI dashboard',
    summary: 'Charts driven by a single data tab',
    description:
      'A one-page dashboard where every chart reads from one clean data sheet. Change the data, the whole dashboard updates. Built to be handed to someone else without breaking.',
    category: 'Reporting',
    difficulty: 'Advanced',
    sheets: 4,
    formulas: ['SUMIFS', 'FILTER', 'UNIQUE'],
    file: '/downloads/kpi-dashboard.xlsx',
  },
  {
    slug: 'timesheet',
    title: 'Timesheet and overtime',
    summary: 'Hours, overtime rules and cost by project',
    description:
      'Weekly timesheet that applies overtime rules automatically, splits hours by project code, and totals cost using a rate table.',
    category: 'HR',
    difficulty: 'Intermediate',
    sheets: 3,
    formulas: ['SUMIFS', 'IF', 'NETWORKDAYS'],
    file: '/downloads/timesheet.xlsx',
  },
  {
    slug: 'loan-amortisation',
    title: 'Loan amortisation',
    summary: 'Full repayment schedule with extra payments',
    description:
      'Generate a complete repayment schedule from principal, rate and term. Add extra payments at any point and see the effect on interest paid and payoff date.',
    category: 'Finance',
    difficulty: 'Intermediate',
    sheets: 2,
    formulas: ['PMT', 'IPMT', 'EOMONTH'],
    file: '/downloads/loan-amortisation.xlsx',
  },
];

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplateCategories(): string[] {
  return ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category))).sort()];
}
