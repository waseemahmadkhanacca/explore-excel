/**
 * Computes what every formula in personal-budget-planner.xlsx should return,
 * in plain JavaScript, from the same source arrays the workbook was built from.
 *
 * The point is that these numbers are arrived at independently of the
 * spreadsheet: JS arithmetic here, Excel formula evaluation there. Agreement
 * between the two is evidence. Reading a value back out of the file that
 * produced it is not.
 *
 * Writes JSON to stdout for verify-budget.ps1 to compare against.
 */

const { MONTHS, INCOME_LINES, EXPENSE_LINES, CATEGORIES, P } = require('./build-templates.js');

const colLetter = (n) => {
  let s = '';
  while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
  return s;
};
const monthCols = MONTHS.map((_, i) => colLetter(P.firstMonthCol + i));
const yearCol = colLetter(P.yearCol);

const expected = { Planner: {}, Summary: {} };
const put = (sheet, addr, value) => { expected[sheet][addr] = Math.round(value * 100) / 100; };

const sum = (a) => a.reduce((t, n) => t + n, 0);

// --- Planner: per-line year totals -------------------------------
INCOME_LINES.forEach(([, values], i) => {
  put('Planner', `${yearCol}${P.incomeFirst + i}`, sum(values));
});
EXPENSE_LINES.forEach(([, , values], i) => {
  put('Planner', `${yearCol}${P.expenseFirst + i}`, sum(values));
});

// --- Planner: monthly totals -------------------------------------
const incomeByMonth = MONTHS.map((_, m) => sum(INCOME_LINES.map(([, v]) => v[m])));
const expenseByMonth = MONTHS.map((_, m) => sum(EXPENSE_LINES.map(([, , v]) => v[m])));
const surplusByMonth = MONTHS.map((_, m) => incomeByMonth[m] - expenseByMonth[m]);

let carried = 0;
const runningByMonth = surplusByMonth.map((s) => (carried += s));

monthCols.forEach((L, m) => {
  put('Planner', `${L}${P.incomeTotal}`, incomeByMonth[m]);
  put('Planner', `${L}${P.expenseTotal}`, expenseByMonth[m]);
  put('Planner', `${L}${P.surplus}`, surplusByMonth[m]);
  put('Planner', `${L}${P.running}`, runningByMonth[m]);
});

put('Planner', `${yearCol}${P.incomeTotal}`, sum(incomeByMonth));
put('Planner', `${yearCol}${P.expenseTotal}`, sum(expenseByMonth));
put('Planner', `${yearCol}${P.surplus}`, sum(surplusByMonth));
put('Planner', `${yearCol}${P.running}`, runningByMonth[11]);

// --- Summary, for the month the file ships focused on -------------
const FOCUS = 'Mar';
const fi = MONTHS.indexOf(FOCUS);

const yearIncome = sum(incomeByMonth);
CATEGORIES.forEach((cat, i) => {
  const rows = EXPENSE_LINES.filter(([, c]) => c === cat);
  const thisMonth = sum(rows.map(([, , v]) => v[fi]));
  const yearTotal = sum(rows.map(([, , v]) => sum(v)));
  put('Summary', `B${7 + i}`, thisMonth);
  put('Summary', `C${7 + i}`, yearTotal);
  put('Summary', `D${7 + i}`, yearTotal / yearIncome);
});

const catLast = 6 + CATEGORIES.length;
const totRow = catLast + 1;
put('Summary', `B${totRow}`, expenseByMonth[fi]);
put('Summary', `C${totRow}`, sum(expenseByMonth));

const posRow = totRow + 2;
put('Summary', `B${posRow + 1}`, incomeByMonth[fi]);
put('Summary', `C${posRow + 1}`, yearIncome);
put('Summary', `B${posRow + 2}`, expenseByMonth[fi]);
put('Summary', `C${posRow + 2}`, sum(expenseByMonth));

const surRow = posRow + 3;
put('Summary', `B${surRow}`, surplusByMonth[fi]);
put('Summary', `C${surRow}`, sum(surplusByMonth));

const savingsMonth = sum(EXPENSE_LINES.filter(([, c]) => c === 'Savings').map(([, , v]) => v[fi]));
const savingsYear = sum(EXPENSE_LINES.filter(([, c]) => c === 'Savings').map(([, , v]) => sum(v)));
const rateRow = surRow + 1;
put('Summary', `B${rateRow}`, savingsMonth / incomeByMonth[fi]);
put('Summary', `C${rateRow}`, savingsYear / yearIncome);

expected.meta = {
  focusMonth: FOCUS,
  checkCell: `B${rateRow + 3}`,
  checkExpects: 'Agrees',
};

process.stdout.write(JSON.stringify(expected, null, 1));
