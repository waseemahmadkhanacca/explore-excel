/**
 * Computes what purchase-order.xlsx should contain, independently of the
 * workbook's own formulas.
 *
 * Ageing on the log runs from TODAY(), so it is different every day. Rather
 * than freeze a date and test something the user will never see, the verifier
 * reads the workbook's own TODAY() cell and passes it in here as argv[2]. The
 * arithmetic below is then checked against the same day Excel used.
 *
 * Usage: node expect-po.js <todaySerial>
 */

const { PO_SETTINGS, PO_LINES, PO_LOG, PO_BUCKETS, PO } = require('./build-templates.js');

const today = Number(process.argv[2]);
if (!Number.isFinite(today)) {
  console.error('expect-po.js needs today\'s date serial as an argument');
  process.exit(1);
}

const r2 = (x) => {
  const sign = x < 0 ? -1 : 1;
  return (sign * Math.round(Number((Math.abs(x) * 100).toFixed(6)))) / 100;
};

const taxRate = PO_SETTINGS[6][1];
const leadDays = PO_SETTINGS[7][1];

// --- the printable order ------------------------------------------
const lineTotals = PO_LINES.map(([, qty, price]) => r2(qty * price));
const subtotal = r2(lineTotals.reduce((a, b) => a + b, 0));
const tax = r2(subtotal * taxRate);
const total = r2(subtotal + tax);

const order = {
  lines: lineTotals,
  subtotal,
  tax,
  total,
  // D5 is the raised date input; expected delivery is that plus the lead time.
  expectedDelivery: 46238 + leadDays,
};

// --- the log ------------------------------------------------------
const bucketFor = (outstanding, daysLate) => {
  if (outstanding <= 0) return 'Received';
  if (daysLate === 0) return 'On schedule';
  if (daysLate <= 30) return '1-30 days';
  if (daysLate <= 60) return '31-60 days';
  if (daysLate <= 90) return '61-90 days';
  return '90+ days';
};

const rows = PO_LOG.map(([po, vendor, raised, expected, value, received]) => {
  const outstanding = r2(value - received);
  const daysLate = outstanding <= 0 ? 0 : Math.max(0, today - expected);
  const status = bucketFor(outstanding, daysLate);
  const action = outstanding <= 0
    ? 'Complete'
    : daysLate > 0
      ? 'Chase vendor'
      : expected - today <= 7 ? 'Due soon' : 'Open';
  return { po, vendor, raised, expected, value, received, outstanding, daysLate, status, action };
});

// --- the summary --------------------------------------------------
const buckets = PO_BUCKETS.map((b) => ({
  bucket: b,
  count: rows.filter((r) => r.status === b).length,
  outstanding: r2(rows.filter((r) => r.status === b).reduce((t, r) => t + r.outstanding, 0)),
}));
const totalOutstandingAged = r2(buckets.reduce((t, b) => t + b.outstanding, 0));

const summary = {
  buckets,
  totalOutstandingAged,
  totalBucketCount: buckets.reduce((t, b) => t + b.count, 0),
  ordersRaised: rows.length,
  fullyReceived: rows.filter((r) => r.action === 'Complete').length,
  needingChase: rows.filter((r) => r.action === 'Chase vendor').length,
  totalCommitted: r2(rows.reduce((t, r) => t + r.value, 0)),
  stillToArrive: r2(rows.reduce((t, r) => t + r.outstanding, 0)),
  overdueValue: r2(rows.filter((r) => r.daysLate > 0).reduce((t, r) => t + r.outstanding, 0)),
};

process.stdout.write(JSON.stringify({
  today, order, rows, summary,
  geometry: { logFirst: PO.logFirst, lineFirst: PO.lineFirst, subtotal: PO.subtotal },
}));
