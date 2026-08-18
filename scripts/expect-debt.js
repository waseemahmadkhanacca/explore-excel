/**
 * Simulates both payoff methods in plain JavaScript and emits what every row of
 * debt-payoff-calculator.xlsx should contain.
 *
 * This is a reimplementation, not a reading of the spreadsheet. The workbook
 * computes its schedule with Excel formulas; this computes the same schedule
 * with a loop. Where they agree, the formulas are right. Where they disagree,
 * one of them is wrong and the difference says which row to look at.
 *
 * The rules modelled here are exactly the ones the workbook implements,
 * including its two documented simplifications: minimum payments stay fixed,
 * and leftover money in the month a debt clears waits for the next month.
 */

const { DEBTS, EXTRA_PAYMENT, START_SERIAL, HORIZON } = require('./build-templates.js');

/** Excel ROUND is half away from zero; JS Math.round is half toward +Infinity. */
const r2 = (x) => {
  const sign = x < 0 ? -1 : 1;
  return (sign * Math.round(Number((Math.abs(x) * 100).toFixed(6)))) / 100;
};

const EPOCH = Date.UTC(1899, 11, 30);
const toDate = (serial) => new Date(EPOCH + serial * 86400000);
const toSerial = (d) => Math.round((d.getTime() - EPOCH) / 86400000);

/** EDATE: n months on, with the day clamped to the shorter month if needed. */
function edate(serial, n) {
  const d = toDate(serial);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + n;
  const day = d.getUTCDate();
  const lastOfTarget = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return toSerial(new Date(Date.UTC(y, m, Math.min(day, lastOfTarget))));
}

/** Ranks reproduce the COUNTIF pair used on the Debts sheet: no ties. */
function ranks(key, direction) {
  return DEBTS.map((debt, i) => {
    const v = debt[key];
    const ahead = DEBTS.filter((o) => (direction === 'asc' ? o[key] < v : o[key] > v)).length;
    const equalBefore = DEBTS.slice(0, i + 1).filter((o) => o[key] === v).length;
    return ahead + equalBefore;
  });
}

const ORDERS = {
  Snowball: ranks(1, 'asc'), // smallest balance first
  Avalanche: ranks(2, 'desc'), // highest rate first
};

function simulate(order) {
  let balances = DEBTS.map((d) => d[1]);
  const mins = DEBTS.map((d) => d[3]);
  const aprs = DEBTS.map((d) => d[2]);
  const rows = [];

  for (let m = 1; m <= HORIZON; m++) {
    const opening = [...balances];

    // Freed-up minimums join the extra payment.
    const pool = EXTRA_PAYMENT
      + opening.reduce((t, b, i) => t + (b <= 0 ? mins[i] : 0), 0);

    // The target is the live debt no live debt outranks.
    const target = opening.map((b, i) =>
      b > 0 && !opening.some((ob, j) => ob > 0 && order[j] < order[i]) ? 1 : 0);

    const interest = opening.map((b, i) => (b <= 0 ? 0 : r2(b * aprs[i] / 12)));
    const payment = opening.map((b, i) =>
      b <= 0 ? 0 : Math.min(b + interest[i], mins[i] + target[i] * pool));
    balances = opening.map((b, i) => r2(b + interest[i] - payment[i]));

    rows.push({
      month: m,
      dateSerial: edate(START_SERIAL, m),
      interest,
      payment,
      balances: [...balances],
      totalPay: r2(payment.reduce((a, b) => a + b, 0)),
      totalInt: r2(interest.reduce((a, b) => a + b, 0)),
      remaining: r2(balances.reduce((a, b) => a + b, 0)),
    });
  }
  return rows;
}

const out = { meta: { horizon: HORIZON, debts: DEBTS.length }, methods: {}, comparison: {} };

for (const [name, order] of Object.entries(ORDERS)) {
  const rows = simulate(order);
  out.methods[name] = rows.map((r) => [
    r.month, r.dateSerial, ...r.balances, r.totalPay, r.totalInt, r.remaining,
  ]);

  const monthsToClear = rows.filter((r) => r.totalPay > 0).length;
  out.comparison[name] = {
    order,
    months: monthsToClear,
    payoffSerial: rows[monthsToClear - 1].dateSerial,
    totalInterest: r2(rows.reduce((t, r) => t + r.totalInt, 0)),
    totalPaid: r2(rows.reduce((t, r) => t + r.totalPay, 0)),
  };
}

// A schedule that never clears would invalidate the whole comparison.
for (const [name, c] of Object.entries(out.comparison)) {
  if (c.months >= HORIZON) {
    console.error(`${name} does not clear within ${HORIZON} months`);
    process.exit(1);
  }
}

process.stdout.write(JSON.stringify(out));
