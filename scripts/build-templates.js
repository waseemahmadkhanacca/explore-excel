/**
 * Generates the downloadable .xlsx templates into public/downloads/.
 *
 * Templates are built from code rather than hand-edited in Excel so that a
 * formatting decision is made once, in one place, and every workbook inherits
 * it. A binary checked into git cannot be reviewed, diffed or corrected without
 * opening Excel; this script can.
 *
 * Run with: npm run build:templates
 *
 * House rules, applied by the helpers below:
 *   - no merged cells anywhere (centreAcross does the same job without the
 *     damage -- see content/blog/merged-cells.mdx)
 *   - every column has an explicit width, so nothing shows as ####
 *   - header rows are frozen, so scrolling never loses context
 *   - every sheet has print setup, because these get printed
 *   - currency, date and percent cells carry a real number format
 */

const ExcelJS = require('exceljs');
const path = require('node:path');
const fs = require('node:fs');

const OUT = path.join(__dirname, '..', 'public', 'downloads');

// ---------------------------------------------------------------
// Design system
// ---------------------------------------------------------------

const INK = 'FF16324F'; // deep navy, headers
const ACCENT = 'FF2E7D5B'; // green, totals and positive emphasis
const WARN = 'FFB4232B'; // red, overspend and absence
const BAND = 'FFF4F7F9'; // subtle row banding
const RULE = 'FFD8DEE4'; // borders
const MUTED = 'FF5A6B7B'; // secondary text
const PAPER = 'FFFFFFFF';

const GBP = '"£"#,##0.00';
const GBP0 = '"£"#,##0';
const DATE = 'dd mmm yyyy';
const PCT = '0%';

const thin = { style: 'thin', color: { argb: RULE } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

function fill(argb) {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } };
}

/** The big title at the top of a sheet. Centred across columns, never merged. */
function titleBlock(ws, row, text, subtitle, lastCol) {
  const t = ws.getCell(row, 1);
  t.value = text;
  t.font = { name: 'Calibri', size: 16, bold: true, color: { argb: INK } };
  for (let c = 1; c <= lastCol; c++) ws.getCell(row, c).alignment = { horizontal: 'centerContinuous' };
  ws.getRow(row).height = 24;

  if (subtitle) {
    const s = ws.getCell(row + 1, 1);
    s.value = subtitle;
    s.font = { name: 'Calibri', size: 10, italic: true, color: { argb: MUTED } };
    for (let c = 1; c <= lastCol; c++) {
      ws.getCell(row + 1, c).alignment = { horizontal: 'centerContinuous' };
    }
    ws.getRow(row + 1).height = 16;
  }
}

/** A table header row: dark fill, white bold text, boxed. */
function headerRow(ws, row, labels, startCol = 1) {
  labels.forEach((label, i) => {
    const cell = ws.getCell(row, startCol + i);
    cell.value = label;
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    cell.fill = fill(INK);
    cell.border = box;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  ws.getRow(row).height = 28;
}

/** Applies borders, banding and a number format down a block of body cells. */
function bodyBlock(ws, firstRow, lastRow, firstCol, lastCol, formats = {}) {
  for (let r = firstRow; r <= lastRow; r++) {
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(r, c);
      cell.border = box;
      cell.font = cell.font?.bold
        ? cell.font
        : { name: 'Calibri', size: 10, color: { argb: INK } };
      if ((r - firstRow) % 2 === 1) cell.fill = fill(BAND);
      if (formats[c]) cell.numFmt = formats[c];
    }
  }
}

function totalRow(ws, row, firstCol, lastCol, formats = {}) {
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(row, c);
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    cell.fill = fill(ACCENT);
    cell.border = box;
    if (formats[c]) cell.numFmt = formats[c];
  }
  ws.getRow(row).height = 20;
}

function setup(ws, { freeze, widths, landscape = false, fitWidth = 1 }) {
  if (widths) ws.columns = widths.map((w) => ({ width: w }));
  if (freeze) ws.views = [{ state: 'frozen', xSplit: freeze[0], ySplit: freeze[1] }];
  ws.pageSetup = {
    orientation: landscape ? 'landscape' : 'portrait',
    fitToPage: true,
    fitToWidth: fitWidth,
    fitToHeight: 0,
    margins: { left: 0.4, right: 0.4, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
  };
  ws.headerFooter = { oddFooter: '&L&"Calibri,Italic"Explore Excel&R&"Calibri,Italic"Page &P of &N' };
}

/** Every workbook opens on a short how-to sheet rather than dropping you in cold. */
function readMe(wb, title, lines) {
  const ws = wb.addWorksheet('Read me', { properties: { tabColor: { argb: MUTED } } });
  setup(ws, { widths: [3, 96], freeze: [0, 0] });
  titleBlock(ws, 2, title, 'How to use this template', 2);

  let r = 5;
  for (const line of lines) {
    const cell = ws.getCell(r, 2);
    cell.value = line.startsWith('#') ? line.slice(1).trim() : line;
    if (line.startsWith('#')) {
      cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: INK } };
      ws.getRow(r).height = 22;
    } else {
      cell.font = { name: 'Calibri', size: 10, color: { argb: INK } };
      cell.alignment = { wrapText: true, vertical: 'top' };
      ws.getRow(r).height = line.length > 95 ? 28 : 16;
    }
    r++;
  }

  const note = ws.getCell(r + 1, 2);
  note.value = 'Cells with a white background are for you to fill in. Shaded cells hold formulas — changing one replaces the calculation with whatever you typed.';
  note.font = { name: 'Calibri', size: 9, italic: true, color: { argb: MUTED } };
  note.alignment = { wrapText: true, vertical: 'top' };
  ws.getRow(r + 1).height = 28;
  return ws;
}

async function save(wb, filename) {
  const file = path.join(OUT, filename);
  await wb.xlsx.writeFile(file);
  const kb = (fs.statSync(file).size / 1024).toFixed(1);
  console.log(`  ${filename.padEnd(34)} ${kb} KB`);
}

// ---------------------------------------------------------------
// 1. Monthly budget planner
// ---------------------------------------------------------------

async function budgetPlanner() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Explore Excel';
  wb.created = new Date();

  readMe(wb, 'Monthly budget planner', [
    '#What this does',
    'Tracks what you planned to spend against what you actually spent, by category, for one month.',
    '',
    '#Using it',
    '1. On the Categories sheet, change the category names to ones that match your life.',
    '2. On the Budget sheet, enter what you plan to spend in each category in the Budgeted column.',
    '3. Log every transaction on the Transactions sheet as it happens. Pick the category from the dropdown.',
    '4. The Budget sheet fills in Actual, Variance and Used automatically. Nothing else needs touching.',
    '',
    '#Reading the result',
    'Variance is Budgeted minus Actual, so a positive number means you underspent and had money left.',
    'Used turns red once you pass 90 per cent of a category, which is the point at which it is still possible to do something about it.',
    '',
    '#A note on the totals',
    'The Actual column uses SUMIFS to pull from the Transactions sheet. If you add categories, extend the Budget table and the formulas copy down with it.',
  ]);

  // --- Categories -------------------------------------------------
  const cats = ['Rent or mortgage', 'Utilities', 'Groceries', 'Transport', 'Insurance',
                'Phone and internet', 'Subscriptions', 'Eating out', 'Health', 'Clothing',
                'Savings', 'Other'];

  const cs = wb.addWorksheet('Categories', { properties: { tabColor: { argb: MUTED } } });
  setup(cs, { widths: [30, 40], freeze: [0, 3] });
  titleBlock(cs, 1, 'Categories', 'Rename these to match how you actually spend', 2);
  headerRow(cs, 3, ['Category', 'Notes']);
  cats.forEach((c, i) => {
    cs.getCell(4 + i, 1).value = c;
    cs.getCell(4 + i, 2).value = '';
  });
  bodyBlock(cs, 4, 3 + cats.length, 1, 2);

  const catRange = `Categories!$A$4:$A$${3 + cats.length}`;

  // --- Transactions -----------------------------------------------
  const ts = wb.addWorksheet('Transactions', { properties: { tabColor: { argb: INK } } });
  setup(ts, { widths: [14, 34, 24, 14, 20], freeze: [0, 4] });
  titleBlock(ts, 1, 'Transactions', 'Log every payment here. The Budget sheet reads from it.', 5);
  headerRow(ts, 3, ['Date', 'Description', 'Category', 'Amount', 'Payment method']);

  const sample = [
    [46023, 'Monthly rent', 'Rent or mortgage', 875, 'Bank transfer'],
    [46024, 'Weekly shop', 'Groceries', 62.4, 'Debit card'],
    [46025, 'Train season ticket', 'Transport', 118, 'Debit card'],
    [46026, 'Electricity', 'Utilities', 74.2, 'Direct debit'],
    [46028, 'Mobile phone', 'Phone and internet', 21, 'Direct debit'],
    [46030, 'Weekly shop', 'Groceries', 58.15, 'Debit card'],
    [46031, 'Dinner out', 'Eating out', 44.5, 'Credit card'],
    [46033, 'Streaming service', 'Subscriptions', 10.99, 'Credit card'],
  ];
  sample.forEach((row, i) => {
    row.forEach((v, c) => (ts.getCell(4 + i, c + 1).value = v));
  });

  const TX_LAST = 203; // room to grow without touching formulas
  bodyBlock(ts, 4, TX_LAST, 1, 5, { 1: DATE, 4: GBP });
  for (let r = 4; r <= TX_LAST; r++) {
    ts.getCell(r, 3).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [catRange],
      showErrorMessage: true,
      errorTitle: 'Unknown category',
      error: 'Pick a category from the list, or add it on the Categories sheet first.',
    };
  }
  ts.autoFilter = { from: { row: 3, column: 1 }, to: { row: 3, column: 5 } };

  // --- Budget -----------------------------------------------------
  const bs = wb.addWorksheet('Budget', { properties: { tabColor: { argb: ACCENT } } });
  setup(bs, { widths: [30, 16, 16, 16, 12] });
  titleBlock(bs, 1, 'Monthly budget', 'Enter the Budgeted column. Everything else calculates.', 5);
  headerRow(bs, 3, ['Category', 'Budgeted', 'Actual', 'Variance', 'Used']);

  const planned = [875, 130, 260, 140, 62, 45, 25, 90, 30, 40, 200, 50];
  cats.forEach((c, i) => {
    const r = 4 + i;
    bs.getCell(r, 1).value = { formula: `Categories!A${4 + i}` };
    bs.getCell(r, 2).value = planned[i];
    bs.getCell(r, 3).value = { formula: `SUMIFS(Transactions!$D$4:$D$${TX_LAST},Transactions!$C$4:$C$${TX_LAST},$A${r})` };
    bs.getCell(r, 4).value = { formula: `B${r}-C${r}` };
    bs.getCell(r, 5).value = { formula: `IFERROR(C${r}/B${r},0)` };
  });

  const bLast = 3 + cats.length;
  bodyBlock(bs, 4, bLast, 1, 5, { 2: GBP, 3: GBP, 4: GBP, 5: PCT });

  const tRow = bLast + 1;
  bs.getCell(tRow, 1).value = 'Total';
  bs.getCell(tRow, 2).value = { formula: `SUM(B4:B${bLast})` };
  bs.getCell(tRow, 3).value = { formula: `SUM(C4:C${bLast})` };
  bs.getCell(tRow, 4).value = { formula: `SUM(D4:D${bLast})` };
  bs.getCell(tRow, 5).value = { formula: `IFERROR(C${tRow}/B${tRow},0)` };
  totalRow(bs, tRow, 1, 5, { 2: GBP, 3: GBP, 4: GBP, 5: PCT });

  // Overspend goes red; approaching the limit goes amber.
  bs.addConditionalFormatting({
    ref: `D4:D${bLast}`,
    rules: [{
      type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1,
      style: { font: { color: { argb: WARN }, bold: true } },
    }],
  });
  bs.addConditionalFormatting({
    ref: `E4:E${bLast}`,
    rules: [
      {
        type: 'cellIs', operator: 'greaterThan', formulae: ['1'], priority: 1,
        style: { fill: fill('FFFAD5D3'), font: { color: { argb: WARN }, bold: true } },
      },
      {
        type: 'cellIs', operator: 'greaterThan', formulae: ['0.9'], priority: 2,
        style: { fill: fill('FFFDF0CE') },
      },
    ],
  });

  await save(wb, 'monthly-budget-planner.xlsx');
}

// ---------------------------------------------------------------
// 2. Invoice
// ---------------------------------------------------------------

async function invoice() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Explore Excel';

  readMe(wb, 'Invoice template', [
    '#What this does',
    'Produces a single, printable invoice that totals itself and calculates VAT.',
    '',
    '#Using it',
    '1. Fill in your own details once on the Settings sheet. They flow onto every invoice.',
    '2. On the Invoice sheet, fill in the client block, the invoice number and the dates.',
    '3. Enter the line items. Amount, subtotal, VAT and total all calculate themselves.',
    '4. Print to PDF. The page is already set up to fit one sheet of A4 portrait.',
    '',
    '#VAT',
    'The rate comes from the Settings sheet. Set it to 0 if you are not VAT registered, and the VAT line will show zero rather than disappearing — which is the correct thing to show a client.',
    '',
    '#Keeping a record',
    'Log each invoice on the Invoice log sheet as you send it. The outstanding total at the top tells you what you are owed.',
  ]);

  // --- Settings ---------------------------------------------------
  const st = wb.addWorksheet('Settings', { properties: { tabColor: { argb: MUTED } } });
  setup(st, { widths: [26, 42] });
  titleBlock(st, 1, 'Your details', 'Entered once, used on every invoice', 2);
  const settings = [
    ['Business name', 'Your Business Ltd'],
    ['Address line 1', '12 Example Street'],
    ['Address line 2', 'Leeds'],
    ['Postcode', 'LS1 1AA'],
    ['Email', 'hello@yourbusiness.co.uk'],
    ['Phone', '0113 000 0000'],
    ['VAT number', 'GB000000000'],
    ['VAT rate', 0.2],
    ['Bank account name', 'Your Business Ltd'],
    ['Sort code', '00-00-00'],
    ['Account number', '00000000'],
    ['Payment terms (days)', 30],
  ];
  headerRow(st, 3, ['Field', 'Value']);
  settings.forEach(([k, v], i) => {
    st.getCell(4 + i, 1).value = k;
    st.getCell(4 + i, 2).value = v;
  });
  bodyBlock(st, 4, 3 + settings.length, 1, 2);
  st.getCell(11, 2).numFmt = PCT; // VAT rate
  for (let r = 4; r <= 3 + settings.length; r++) {
    st.getCell(r, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
  }

  // --- Invoice ----------------------------------------------------
  const inv = wb.addWorksheet('Invoice', { properties: { tabColor: { argb: INK } } });
  setup(inv, { widths: [38, 12, 14, 16], fitWidth: 1 });

  inv.getCell(1, 1).value = { formula: 'Settings!B4' };
  inv.getCell(1, 1).font = { name: 'Calibri', size: 18, bold: true, color: { argb: INK } };
  inv.getRow(1).height = 26;
  [['Settings!B5', 2], ['Settings!B6', 3], ['Settings!B7', 4], ['Settings!B8', 5]].forEach(([f, r]) => {
    inv.getCell(r, 1).value = { formula: f };
    inv.getCell(r, 1).font = { name: 'Calibri', size: 10, color: { argb: MUTED } };
  });

  const title = inv.getCell(1, 4);
  title.value = 'INVOICE';
  title.font = { name: 'Calibri', size: 18, bold: true, color: { argb: ACCENT } };
  title.alignment = { horizontal: 'right' };

  const meta = [['Invoice number', 'INV-0001'], ['Invoice date', 46030], ['Due date', { formula: 'D3+Settings!B15' }]];
  meta.forEach(([k, v], i) => {
    const r = 2 + i;
    const kc = inv.getCell(r, 3);
    kc.value = k;
    kc.font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
    kc.alignment = { horizontal: 'right' };
    const vc = inv.getCell(r, 4);
    vc.value = v;
    vc.font = { name: 'Calibri', size: 10, color: { argb: INK } };
    vc.alignment = { horizontal: 'right' };
    if (i > 0) vc.numFmt = DATE;
  });

  inv.getCell(7, 1).value = 'Bill to';
  inv.getCell(7, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
  inv.getCell(7, 1).fill = fill(INK);
  inv.getCell(7, 1).border = box;
  ['Client name', 'Client address', 'Town', 'Postcode'].forEach((v, i) => {
    const c = inv.getCell(8 + i, 1);
    c.value = v;
    c.font = { name: 'Calibri', size: 10, color: { argb: INK } };
    c.border = box;
  });

  headerRow(inv, 13, ['Description', 'Quantity', 'Unit price', 'Amount']);
  const lines = [
    ['Consultancy, October', 12, 65],
    ['Spreadsheet build and handover', 1, 900],
    ['Training session, half day', 2, 350],
  ];
  const LINE_LAST = 26;
  for (let i = 0; i < LINE_LAST - 13; i++) {
    const r = 14 + i;
    if (lines[i]) {
      inv.getCell(r, 1).value = lines[i][0];
      inv.getCell(r, 2).value = lines[i][1];
      inv.getCell(r, 3).value = lines[i][2];
    }
    inv.getCell(r, 4).value = { formula: `IF(B${r}="","",B${r}*C${r})` };
  }
  bodyBlock(inv, 14, LINE_LAST, 1, 4, { 3: GBP, 4: GBP });

  const sub = LINE_LAST + 1;
  const rows = [
    ['Subtotal', { formula: `SUM(D14:D${LINE_LAST})` }],
    ['VAT', { formula: `ROUND(D${sub}*Settings!$B$11,2)` }],
    ['Total due', { formula: `D${sub}+D${sub + 1}` }],
  ];
  rows.forEach(([label, v], i) => {
    const r = sub + i;
    const lc = inv.getCell(r, 3);
    lc.value = label;
    lc.alignment = { horizontal: 'right' };
    lc.font = { name: 'Calibri', size: 10, bold: i === 2, color: { argb: INK } };
    lc.border = box;
    const vc = inv.getCell(r, 4);
    vc.value = v;
    vc.numFmt = GBP;
    vc.border = box;
    vc.font = { name: 'Calibri', size: i === 2 ? 12 : 10, bold: i === 2, color: { argb: i === 2 ? PAPER : INK } };
    if (i === 2) vc.fill = fill(ACCENT);
  });

  const pay = sub + 4;
  inv.getCell(pay, 1).value = 'Payment details';
  inv.getCell(pay, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
  [['Account name', 'Settings!B12'], ['Sort code', 'Settings!B13'], ['Account number', 'Settings!B14']]
    .forEach(([k, f], i) => {
      inv.getCell(pay + 1 + i, 1).value = k;
      inv.getCell(pay + 1 + i, 1).font = { name: 'Calibri', size: 9, color: { argb: MUTED } };
      inv.getCell(pay + 1 + i, 2).value = { formula: f };
      inv.getCell(pay + 1 + i, 2).font = { name: 'Calibri', size: 9, color: { argb: INK } };
    });

  // --- Invoice log ------------------------------------------------
  const log = wb.addWorksheet('Invoice log', { properties: { tabColor: { argb: ACCENT } } });
  setup(log, { widths: [16, 30, 14, 14, 14, 14], freeze: [0, 5] });
  titleBlock(log, 1, 'Invoice log', 'One row per invoice sent', 6);
  log.getCell(2, 1).value = 'Outstanding';
  log.getCell(2, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
  log.getCell(2, 2).value = { formula: 'SUMIFS(E6:E105,F6:F105,"Unpaid")' };
  log.getCell(2, 2).numFmt = GBP;
  log.getCell(2, 2).font = { name: 'Calibri', size: 12, bold: true, color: { argb: WARN } };

  headerRow(log, 5, ['Invoice number', 'Client', 'Issued', 'Due', 'Amount', 'Status']);
  const logRows = [
    ['INV-0001', 'Northaero Ltd', 46030, 46060, 2020, 'Unpaid'],
    ['INV-0002', 'Southend Components', 46033, 46063, 780, 'Paid'],
  ];
  logRows.forEach((row, i) => row.forEach((v, c) => (log.getCell(6 + i, c + 1).value = v)));
  bodyBlock(log, 6, 105, 1, 6, { 3: DATE, 4: DATE, 5: GBP });
  for (let r = 6; r <= 105; r++) {
    log.getCell(r, 6).dataValidation = {
      type: 'list', allowBlank: true, formulae: ['"Unpaid,Paid,Overdue,Written off"'],
    };
  }
  log.addConditionalFormatting({
    ref: 'F6:F105',
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Paid"'], priority: 1,
        style: { font: { color: { argb: ACCENT }, bold: true } } },
      { type: 'cellIs', operator: 'equal', formulae: ['"Overdue"'], priority: 2,
        style: { fill: fill('FFFAD5D3'), font: { color: { argb: WARN }, bold: true } } },
    ],
  });
  log.autoFilter = { from: { row: 5, column: 1 }, to: { row: 5, column: 6 } };

  await save(wb, 'invoice-template.xlsx');
}

// ---------------------------------------------------------------
// 3. Project tracker with Gantt
// ---------------------------------------------------------------

async function projectTracker() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Explore Excel';

  readMe(wb, 'Project tracker with Gantt', [
    '#What this does',
    'Tracks tasks, owners, dates and progress, and draws a Gantt chart from the dates without a single manual bar.',
    '',
    '#Using it',
    '1. Set the chart start date in cell N3 on the Tasks sheet. The timeline runs from there.',
    '2. Enter each task with a start date, a duration in days, and an owner.',
    '3. The End date and the Gantt bars calculate themselves.',
    '4. Update Progress as work proceeds. The Status column follows it automatically.',
    '',
    '#How the Gantt works',
    'There are no shapes and no drawing. Each timeline cell holds a conditional formatting rule that fills it when that day falls between the task start and end. Change a date and the chart redraws instantly.',
    '',
    '#Extending the timeline',
    'The timeline is 28 days wide. To cover longer projects, change the chart start date to move the window, or widen the block by copying the last timeline column to the right.',
  ]);

  const ws = wb.addWorksheet('Tasks', { properties: { tabColor: { argb: INK } } });
  const TIMELINE_START = 15; // column O
  const DAYS = 28;
  const widths = [6, 34, 16, 13, 10, 13, 11, 13, 0, 0, 0, 0, 0, 0];
  const allWidths = widths.slice(0, 8).concat([2, 2, 2, 2, 2, 2], Array(DAYS).fill(3.2));
  setup(ws, { widths: allWidths, freeze: [8, 6], landscape: true });

  titleBlock(ws, 1, 'Project tracker', 'Dates drive the chart. Nothing is drawn by hand.', 8);

  ws.getCell(3, 13).value = 'Chart starts';
  ws.getCell(3, 13).font = { name: 'Calibri', size: 9, bold: true, color: { argb: INK } };
  ws.getCell(3, 13).alignment = { horizontal: 'right' };
  const startCell = ws.getCell(3, 14);
  startCell.value = 46027;
  startCell.numFmt = DATE;
  startCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
  startCell.fill = fill('FFFDF0CE');
  startCell.border = box;

  headerRow(ws, 5, ['#', 'Task', 'Owner', 'Start', 'Days', 'End', 'Progress', 'Status']);

  // Timeline header: each column is one day, derived from the start cell.
  for (let d = 0; d < DAYS; d++) {
    const col = TIMELINE_START + d;
    const c = ws.getCell(5, col);
    c.value = { formula: `$N$3+${d}` };
    c.numFmt = 'd';
    c.font = { name: 'Calibri', size: 8, bold: true, color: { argb: PAPER } };
    c.fill = fill(INK);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  }

  const tasks = [
    ['Scope and requirements', 'Adams', 46027, 4],
    ['Data audit', 'Brennan', 46031, 3],
    ['Build data model', 'Adams', 46034, 6],
    ['Reporting layer', 'Raman', 46040, 5],
    ['User testing', 'Okafor', 46045, 4],
    ['Fixes and polish', 'Adams', 46049, 3],
    ['Training and handover', 'Raman', 46052, 2],
  ];
  const FIRST = 6;
  const LAST = FIRST + tasks.length - 1;

  tasks.forEach((t, i) => {
    const r = FIRST + i;
    ws.getCell(r, 1).value = i + 1;
    ws.getCell(r, 2).value = t[0];
    ws.getCell(r, 3).value = t[1];
    ws.getCell(r, 4).value = t[2];
    ws.getCell(r, 5).value = t[3];
    ws.getCell(r, 6).value = { formula: `IF(D${r}="","",D${r}+E${r}-1)` };
    ws.getCell(r, 7).value = [1, 1, 0.6, 0.2, 0, 0, 0][i];
    ws.getCell(r, 8).value = {
      formula: `IF(G${r}=1,"Done",IF(G${r}>0,"In progress",IF(D${r}<TODAY(),"Late","Not started")))`,
    };
  });

  bodyBlock(ws, FIRST, LAST, 1, 8, { 4: DATE, 6: DATE, 7: PCT });
  for (let r = FIRST; r <= LAST; r++) {
    ws.getCell(r, 1).alignment = { horizontal: 'center' };
    ws.getCell(r, 5).alignment = { horizontal: 'center' };
    ws.getCell(r, 7).alignment = { horizontal: 'center' };
    ws.getCell(r, 8).alignment = { horizontal: 'center' };
    for (let d = 0; d < DAYS; d++) ws.getCell(r, TIMELINE_START + d).border = box;
  }

  const firstColLetter = ws.getColumn(TIMELINE_START).letter;
  const lastColLetter = ws.getColumn(TIMELINE_START + DAYS - 1).letter;

  // The Gantt bar itself: fill the cell when its date sits inside the task.
  ws.addConditionalFormatting({
    ref: `${firstColLetter}${FIRST}:${lastColLetter}${LAST}`,
    rules: [
      {
        type: 'expression',
        priority: 1,
        formulae: [`AND(${firstColLetter}$5>=$D${FIRST},${firstColLetter}$5<=$F${FIRST},$G${FIRST}=1)`],
        style: { fill: fill(ACCENT) },
      },
      {
        type: 'expression',
        priority: 2,
        formulae: [`AND(${firstColLetter}$5>=$D${FIRST},${firstColLetter}$5<=$F${FIRST})`],
        style: { fill: fill('FF7FA8C4') },
      },
      {
        type: 'expression',
        priority: 3,
        formulae: [`WEEKDAY(${firstColLetter}$5,2)>5`],
        style: { fill: fill('FFEDF1F4') },
      },
    ],
  });

  ws.addConditionalFormatting({
    ref: `H${FIRST}:H${LAST}`,
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Done"'], priority: 1,
        style: { font: { color: { argb: ACCENT }, bold: true } } },
      { type: 'cellIs', operator: 'equal', formulae: ['"Late"'], priority: 2,
        style: { fill: fill('FFFAD5D3'), font: { color: { argb: WARN }, bold: true } } },
    ],
  });

  // --- Summary ----------------------------------------------------
  const sm = wb.addWorksheet('Summary', { properties: { tabColor: { argb: ACCENT } } });
  setup(sm, { widths: [30, 16, 16] });
  titleBlock(sm, 1, 'Project summary', 'Everything here reads from the Tasks sheet', 3);
  headerRow(sm, 3, ['Measure', 'Value', 'Notes']);
  const measures = [
    ['Tasks total', { formula: `COUNTA(Tasks!B${FIRST}:B${LAST})` }, 'Rows with a task name'],
    ['Done', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Done")` }, 'Progress at 100%'],
    ['In progress', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"In progress")` }, ''],
    ['Not started', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Not started")` }, ''],
    ['Late', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Late")` }, 'Started before today, no progress'],
    ['Overall progress', { formula: `IFERROR(AVERAGE(Tasks!G${FIRST}:G${LAST}),0)` }, 'Average of the progress column'],
    ['Earliest start', { formula: `MIN(Tasks!D${FIRST}:D${LAST})` }, ''],
    ['Latest finish', { formula: `MAX(Tasks!F${FIRST}:F${LAST})` }, ''],
    ['Calendar days', { formula: `MAX(Tasks!F${FIRST}:F${LAST})-MIN(Tasks!D${FIRST}:D${LAST})+1` }, ''],
    ['Working days', { formula: `NETWORKDAYS(MIN(Tasks!D${FIRST}:D${LAST}),MAX(Tasks!F${FIRST}:F${LAST}))` }, 'Excludes weekends'],
  ];
  measures.forEach(([k, v, n], i) => {
    sm.getCell(4 + i, 1).value = k;
    sm.getCell(4 + i, 2).value = v;
    sm.getCell(4 + i, 3).value = n;
  });
  bodyBlock(sm, 4, 3 + measures.length, 1, 3);
  sm.getCell(9, 2).numFmt = PCT;
  sm.getCell(10, 2).numFmt = DATE;
  sm.getCell(11, 2).numFmt = DATE;

  await save(wb, 'project-tracker-gantt.xlsx');
}

// ---------------------------------------------------------------
// 4. Attendance and leave tracker
// ---------------------------------------------------------------

async function attendance() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Explore Excel';

  readMe(wb, 'Attendance and leave tracker', [
    '#What this does',
    'Records daily attendance for a team across one month and totals each code automatically.',
    '',
    '#Using it',
    '1. Set the month start date in cell C3. Every column heading follows from it.',
    '2. Replace the names in column B with your team.',
    '3. Each day, enter a code in the grid. Pick from the dropdown so nothing is mistyped.',
    '4. The totals on the right count themselves, and the Summary sheet totals the whole team.',
    '',
    '#The codes',
    'P present, H holiday, S sick, L late, R remote, U unpaid leave, X public holiday. The Codes sheet lists them and the dropdown enforces them.',
    '',
    '#Why the dropdown matters',
    'A tracker breaks when someone types "p" one day and "Present" the next, because COUNTIF counts them as different things. The dropdown makes that impossible, which is why every cell in the grid carries one.',
  ]);

  const codes = [
    ['P', 'Present', ACCENT],
    ['H', 'Holiday', 'FF3D7EA6'],
    ['S', 'Sick', WARN],
    ['L', 'Late', 'FFD08700'],
    ['R', 'Remote', 'FF6B5BA6'],
    ['U', 'Unpaid leave', MUTED],
    ['X', 'Public holiday', 'FF8A8F94'],
  ];

  const cs = wb.addWorksheet('Codes', { properties: { tabColor: { argb: MUTED } } });
  setup(cs, { widths: [10, 30, 46] });
  titleBlock(cs, 1, 'Codes', 'The only values the grid accepts', 3);
  headerRow(cs, 3, ['Code', 'Meaning', 'Counts towards']);
  const meanings = ['Working days', 'Annual leave entitlement', 'Sickness absence',
                    'Working days, flagged', 'Working days', 'Unpaid absence', 'Not counted as absence'];
  codes.forEach(([c, m], i) => {
    cs.getCell(4 + i, 1).value = c;
    cs.getCell(4 + i, 2).value = m;
    cs.getCell(4 + i, 3).value = meanings[i];
    cs.getCell(4 + i, 1).alignment = { horizontal: 'center' };
    cs.getCell(4 + i, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    cs.getCell(4 + i, 1).fill = fill(codes[i][2]);
  });
  bodyBlock(cs, 4, 3 + codes.length, 2, 3);

  // --- Attendance grid --------------------------------------------
  const ws = wb.addWorksheet('Attendance', { properties: { tabColor: { argb: INK } } });
  const DAYS = 31;
  const FIRST_DAY_COL = 3;
  const names = ['Adams, R', 'Brennan, T', 'Fischer, L', 'Okafor, J', 'Pritchard, O',
                 'Raman, P', 'Whitfield, S', 'Zhang, M'];
  const FIRST = 6;
  const LAST = FIRST + names.length - 1;
  const totalStart = FIRST_DAY_COL + DAYS;

  setup(ws, {
    widths: [4, 20].concat(Array(DAYS).fill(3.4)).concat(Array(codes.length).fill(5.5)),
    freeze: [2, 5],
    landscape: true,
  });

  titleBlock(ws, 1, 'Attendance and leave', 'Set the month below, then fill the grid from the dropdowns', 10);

  ws.getCell(3, 2).value = 'Month starts';
  ws.getCell(3, 2).font = { name: 'Calibri', size: 9, bold: true, color: { argb: INK } };
  const monthCell = ws.getCell(3, 3);
  monthCell.value = 46023; // 1 January 2026
  monthCell.numFmt = 'mmmm yyyy';
  monthCell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: INK } };
  monthCell.fill = fill('FFFDF0CE');
  monthCell.border = box;

  ws.getCell(5, 1).value = '#';
  ws.getCell(5, 2).value = 'Name';
  [1, 2].forEach((c) => {
    const cell = ws.getCell(5, c);
    cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    cell.fill = fill(INK);
    cell.border = box;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  ws.getRow(5).height = 28;

  // Day headings derive from the month cell, so changing the month is enough.
  for (let d = 0; d < DAYS; d++) {
    const col = FIRST_DAY_COL + d;
    const c = ws.getCell(5, col);
    c.value = { formula: `IF(MONTH($C$3+${d})=MONTH($C$3),$C$3+${d},"")` };
    c.numFmt = 'd';
    c.font = { name: 'Calibri', size: 8, bold: true, color: { argb: PAPER } };
    c.fill = fill(INK);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  }

  codes.forEach(([code], i) => {
    const c = ws.getCell(5, totalStart + i);
    c.value = code;
    c.font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    c.fill = fill(codes[i][2]);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  });

  const firstDayLetter = ws.getColumn(FIRST_DAY_COL).letter;
  const lastDayLetter = ws.getColumn(FIRST_DAY_COL + DAYS - 1).letter;

  names.forEach((n, i) => {
    const r = FIRST + i;
    ws.getCell(r, 1).value = i + 1;
    ws.getCell(r, 1).alignment = { horizontal: 'center' };
    ws.getCell(r, 2).value = n;
    for (let d = 0; d < DAYS; d++) {
      const cell = ws.getCell(r, FIRST_DAY_COL + d);
      cell.alignment = { horizontal: 'center' };
      cell.font = { name: 'Calibri', size: 9, bold: true, color: { argb: INK } };
      cell.border = box;
      cell.dataValidation = {
        type: 'list', allowBlank: true,
        formulae: [`"${codes.map((c) => c[0]).join(',')}"`],
        showErrorMessage: true,
        errorTitle: 'Unknown code',
        error: 'Use one of the codes listed on the Codes sheet.',
      };
    }
    codes.forEach(([code], ci) => {
      const cell = ws.getCell(r, totalStart + ci);
      cell.value = { formula: `COUNTIF($${firstDayLetter}${r}:$${lastDayLetter}${r},"${code}")` };
      cell.alignment = { horizontal: 'center' };
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: INK } };
      cell.border = box;
      cell.fill = fill(BAND);
    });
  });

  // Colour each code where it is typed, and shade weekends.
  const gridRef = `${firstDayLetter}${FIRST}:${lastDayLetter}${LAST}`;
  ws.addConditionalFormatting({
    ref: gridRef,
    rules: codes.map(([code, , colour], i) => ({
      type: 'cellIs', operator: 'equal', formulae: [`"${code}"`], priority: i + 1,
      style: { fill: fill(colour), font: { color: { argb: PAPER }, bold: true } },
    })).concat([{
      type: 'expression',
      priority: codes.length + 1,
      formulae: [`AND(${firstDayLetter}$5<>"",WEEKDAY(${firstDayLetter}$5,2)>5)`],
      style: { fill: fill('FFEDF1F4') },
    }]),
  });

  // --- Summary ----------------------------------------------------
  const sm = wb.addWorksheet('Summary', { properties: { tabColor: { argb: ACCENT } } });
  setup(sm, { widths: [24, 12, 40] });
  titleBlock(sm, 1, 'Month summary', 'Totals across the whole team', 3);
  headerRow(sm, 3, ['Code', 'Days', 'Meaning']);
  codes.forEach(([code, meaning], i) => {
    const r = 4 + i;
    const totalCol = ws.getColumn(totalStart + i).letter;
    sm.getCell(r, 1).value = code;
    sm.getCell(r, 1).alignment = { horizontal: 'center' };
    sm.getCell(r, 1).font = { name: 'Calibri', size: 10, bold: true, color: { argb: PAPER } };
    sm.getCell(r, 1).fill = fill(codes[i][2]);
    sm.getCell(r, 2).value = { formula: `SUM(Attendance!${totalCol}${FIRST}:${totalCol}${LAST})` };
    sm.getCell(r, 3).value = meaning;
  });
  bodyBlock(sm, 4, 3 + codes.length, 2, 3);

  const tr = 4 + codes.length;
  sm.getCell(tr, 1).value = 'Total';
  sm.getCell(tr, 2).value = { formula: `SUM(B4:B${tr - 1})` };
  sm.getCell(tr, 3).value = 'Every code entered this month';
  totalRow(sm, tr, 1, 3);

  await save(wb, 'attendance-tracker.xlsx');
}

// ---------------------------------------------------------------

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  console.log('Building templates:');
  await budgetPlanner();
  await invoice();
  await projectTracker();
  await attendance();
  console.log('Done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
