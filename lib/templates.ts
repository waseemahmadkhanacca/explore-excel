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
    slug: 'debt-payoff-calculator',
    title: 'Debt payoff calculator',
    summary: 'Snowball against avalanche, with the interest each one costs',
    description:
      'Enter up to five debts with balance, rate and minimum payment, then the extra you can afford each month. Two full schedules build themselves — snowball paying the smallest balance first, avalanche the highest rate first — and the comparison shows months to clear, the debt-free date and the interest each method costs. Cleared minimums roll into the next debt automatically, which is what makes either method finish years early.',
    category: 'Personal finance',
    difficulty: 'Intermediate',
    sheets: 5,
    formulas: ['SUMPRODUCT', 'COUNTIF', 'EOMONTH', 'ROUND'],
    file: '/downloads/debt-payoff-calculator.xlsx',
  },
  {
    slug: 'personal-budget-planner',
    title: 'Personal budget planner',
    summary: 'A full year of income against spending, month by month',
    description:
      'Twelve months across, income and seventeen spending lines down, grouped into housing, food, transport, debt, savings and discretionary. Each month shows its own surplus or deficit, and a running balance carries it forward so a good January is visibly still covering you in June. The summary re-reads for any month you pick, using INDEX and MATCH rather than XLOOKUP so it opens in every version of Excel.',
    category: 'Personal finance',
    difficulty: 'Beginner',
    sheets: 3,
    formulas: ['INDEX', 'MATCH', 'SUMIF', 'SUMPRODUCT'],
    file: '/downloads/personal-budget-planner.xlsx',
  },
  {
    slug: 'monthly-budget-planner',
    title: 'Monthly budget tracker',
    summary: 'Track one month against plan, from a logged transaction list',
    description:
      'Enter what you plan to spend by category, then log transactions as they happen. Budgeted, actual, variance and percentage used fill in on their own, and a category turns amber at ninety percent and red once you pass it. Category names come from a dropdown, so a typo cannot quietly split one category into two.',
    category: 'Personal finance',
    difficulty: 'Beginner',
    sheets: 4,
    formulas: ['SUMIFS', 'IFERROR', 'COUNTIF'],
    file: '/downloads/monthly-budget-planner.xlsx',
  },
  {
    slug: 'invoice-template',
    title: 'Invoice template',
    summary: 'Printable invoice with sales tax and an outstanding-balance log',
    description:
      'Your business details go in once on the Settings sheet and flow onto every invoice. Line items total themselves, sales tax calculates from a rate you control, and the due date follows your payment terms. A separate log tracks what has been sent and shows what you are still owed.',
    category: 'Accounting',
    difficulty: 'Beginner',
    sheets: 4,
    formulas: ['SUMIFS', 'ROUND', 'IF'],
    file: '/downloads/invoice-template.xlsx',
  },
  {
    slug: 'project-tracker-gantt',
    title: 'Project tracker with Gantt',
    summary: 'A Gantt chart drawn entirely by conditional formatting',
    description:
      'Tasks, owners, dates and progress on the left; a six-week timeline on the right. There are no shapes and nothing is drawn by hand — each timeline cell fills itself when its date falls inside a task, so changing a date redraws the chart instantly. Weekends shade automatically and completed tasks turn green.',
    category: 'Operations',
    difficulty: 'Intermediate',
    sheets: 3,
    formulas: ['NETWORKDAYS', 'COUNTIF', 'WEEKDAY'],
    file: '/downloads/project-tracker-gantt.xlsx',
  },
  {
    slug: 'attendance-tracker',
    title: 'Attendance and leave tracker',
    summary: 'A month of attendance codes that count themselves',
    description:
      'One row per person, one column per day, and seven attendance codes entered from a dropdown so nothing is ever mistyped. Each code totals per person on the right and across the team on the summary sheet. Change the month in one cell and every column heading follows.',
    category: 'HR',
    difficulty: 'Beginner',
    sheets: 4,
    formulas: ['COUNTIF', 'WEEKDAY', 'SUM'],
    file: '/downloads/attendance-tracker.xlsx',
  },
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
    summary: 'Aging buckets and follow-up dates',
    description:
      'A receivables register with automatic aging into current, 30, 60 and 90-plus day buckets, plus a follow-up date column that flags what needs chasing this week.',
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
    slug: 'loan-amortization',
    title: 'Loan amortization',
    summary: 'Full repayment schedule with extra payments',
    description:
      'Generate a complete repayment schedule from principal, rate and term. Add extra payments at any point and see the effect on interest paid and payoff date.',
    category: 'Finance',
    difficulty: 'Intermediate',
    sheets: 2,
    formulas: ['PMT', 'IPMT', 'EOMONTH'],
    file: '/downloads/loan-amortization.xlsx',
  },
];

export function getTemplate(slug: string): Template | undefined {
  return TEMPLATES.find((t) => t.slug === slug);
}

export function getTemplateCategories(): string[] {
  return ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category))).sort()];
}
