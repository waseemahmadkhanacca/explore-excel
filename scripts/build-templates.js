/**
 * Generates the downloadable .xlsx templates into public/downloads/.
 *
 * Built from code rather than hand-edited in Excel so a formatting decision is
 * made once and every workbook inherits it.
 *
 * Run with:  npm run build:templates
 * Verify with: npm run verify:templates   (opens each one in real Excel)
 *
 * House rules, enforced by the helpers below:
 *   - the palette matches the original templates exactly (see PALETTE)
 *   - gridlines are off on every sheet
 *   - no merged cells anywhere; centerAcross does the same job without the
 *     damage (see content/blog/merged-cells.mdx)
 *   - every column has an explicit width wide enough for its contents, so
 *     nothing ever renders as ####
 *   - data validation is applied ONCE per contiguous range. Applying it cell by
 *     cell produced overlapping sqref regions, which is invalid in xlsx and is
 *     what made Excel offer to repair these files.
 *   - conditional formatting fills use bgColor, which is what a differential
 *     format (dxf) expects; fgColor there is silently wrong.
 */

const ExcelJS = require('exceljs');
const path = require('node:path');
const fs = require('node:fs');

const OUT = path.join(__dirname, '..', 'public', 'downloads');

// ---------------------------------------------------------------
// Palette — lifted from the original templates so the new ones match
// ---------------------------------------------------------------

const GREEN = 'FF0F6E56'; // primary, header fills
const GREEN_DK = 'FF0A4A3A'; // headings on light backgrounds
const MINT = 'FFE1F5EE'; // banding, secondary fills
const MINT_PALE = 'FFC6E4D9'; // rules inside green areas
const CREAM = 'FFFFFDF0'; // cells the reader is meant to type in
const PAPER = 'FFFAFAF8'; // page background tint
const WHITE = 'FFFFFFFF';
const INK = 'FF141414'; // body text
const MUTED = 'FF4A4A48'; // secondary text
const RED = 'FF7A2020'; // over budget, absent, overdue
const AMBER = 'FF7A5410'; // approaching a limit
const LINE = 'FFE4E4E0'; // borders

/**
 * The financial-modeling convention the original templates already follow and
 * the website documents: blue for cells you type into, black for calculated
 * cells, green shading for totals. Keep it — finance and audit readers rely on
 * it without being told.
 */
const INPUT = 'FF0000FF';

// The originals are Arial 10 throughout. Nothing uses Calibri.
const HEAD_FONT = 'Arial';
const BODY_FONT = 'Arial';

/**
 * Accounting formats, taken from the original workbooks rather than invented.
 * Negatives in parentheses and a dash for zero is what a finance reader
 * expects, and it keeps a column of figures aligned on the decimal point where
 * a currency symbol in each cell does not.
 */
const USD = '#,##0;(#,##0);-'; // whole dollars, the default here
const USD2 = '#,##0.00;(#,##0.00);"-"'; // where cents matter
const DATE = 'dd-mmm-yy';
const PCT = '0.0%;(0.0%);-';

const thin = { style: 'thin', color: { argb: LINE } };
const box = { top: thin, left: thin, bottom: thin, right: thin };

const fill = (argb) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
/** Conditional-format fills live in a dxf, where solid fills use bgColor. */
const cfFill = (argb) => ({ type: 'pattern', pattern: 'solid', bgColor: { argb } });

const body = (opts = {}) => ({ name: BODY_FONT, size: 10, color: { argb: INK }, ...opts });
const head = (opts = {}) => ({ name: HEAD_FONT, size: 10, bold: true, color: { argb: WHITE }, ...opts });

/**
 * Sets column widths, freezes panes, turns gridlines off and configures print.
 * Must be called before any cell is written -- assigning ws.columns afterwards
 * rebuilds the column collection.
 */
function setup(ws, { widths, freeze = [0, 0], landscape = false }) {
  ws.columns = widths.map((w) => ({ width: w }));
  ws.views = [
    {
      state: freeze[0] || freeze[1] ? 'frozen' : 'normal',
      xSplit: freeze[0] || undefined,
      ySplit: freeze[1] || undefined,
      showGridLines: false,
      zoomScale: 100,
    },
  ];
  ws.pageSetup = {
    orientation: landscape ? 'landscape' : 'portrait',
    paperSize: 1, // US Letter
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    horizontalCentered: true,
    margins: { left: 0.4, right: 0.4, top: 0.6, bottom: 0.6, header: 0.3, footer: 0.3 },
  };
  ws.headerFooter = { oddFooter: '&L&9Explore Excel&R&9Page &P of &N' };
}

/**
 * The green banner every original sheet opens with: white 16pt title on row 1,
 * a pale-green byline on row 2, both running the full width of the sheet.
 *
 * The originals merge those rows. This fills each cell and lets the text
 * overflow instead, which looks identical and keeps the no-merged-cells rule
 * intact — merging a header is harmless, but the rule is easier to hold to
 * without exceptions.
 */
function titleBlock(ws, row, text, subtitle, lastCol) {
  for (let c = 1; c <= lastCol; c++) {
    const cell = ws.getCell(row, c);
    cell.fill = fill(GREEN);
    cell.font = { name: HEAD_FONT, size: 16, bold: true, color: { argb: WHITE } };
    cell.alignment = { vertical: 'middle' };
  }
  ws.getCell(row, 1).value = text;
  ws.getRow(row).height = 25.5;

  const byline = subtitle
    ? `Explore Excel  ·  exploreexcel.com  ·  ${subtitle}`
    : 'Explore Excel  ·  exploreexcel.com';
  for (let c = 1; c <= lastCol; c++) {
    const cell = ws.getCell(row + 1, c);
    cell.fill = fill(GREEN);
    cell.font = { name: BODY_FONT, size: 9, color: { argb: MINT_PALE } };
  }
  ws.getCell(row + 1, 1).value = byline;
  ws.getRow(row + 1).height = 15;
}

/** A bold dark-green run-in heading, as used on the Read me and summaries. */
function sectionHeading(ws, row, col, text) {
  const c = ws.getCell(row, col);
  c.value = text;
  c.font = { name: HEAD_FONT, size: 11, bold: true, color: { argb: GREEN_DK } };
  ws.getRow(row).height = 15;
  return c;
}

function headerRow(ws, row, labels, startCol = 1) {
  labels.forEach((label, i) => {
    const cell = ws.getCell(row, startCol + i);
    cell.value = label;
    cell.font = head();
    cell.fill = fill(GREEN);
    cell.border = box;
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
  });
  ws.getRow(row).height = 24;
}

function bodyBlock(ws, firstRow, lastRow, firstCol, lastCol, formats = {}) {
  for (let r = firstRow; r <= lastRow; r++) {
    for (let c = firstCol; c <= lastCol; c++) {
      const cell = ws.getCell(r, c);
      cell.border = box;
      if (!cell.font) cell.font = body();
      if ((r - firstRow) % 2 === 1) cell.fill = fill(PAPER);
      if (formats[c]) cell.numFmt = formats[c];
    }
  }
}

function totalRow(ws, row, firstCol, lastCol, formats = {}) {
  for (let c = firstCol; c <= lastCol; c++) {
    const cell = ws.getCell(row, c);
    cell.font = head({ size: 10 });
    cell.fill = fill(GREEN);
    cell.border = box;
    if (formats[c]) cell.numFmt = formats[c];
  }
  ws.getRow(row).height = 20;
}

/** A cell the reader is meant to change: blue text on a cream fill. */
function inputCell(ws, row, col, value, numFmt) {
  const c = ws.getCell(row, col);
  c.value = value;
  c.fill = fill(CREAM);
  c.border = box;
  c.font = { name: BODY_FONT, size: 11, bold: true, color: { argb: INPUT } };
  if (numFmt) c.numFmt = numFmt;
  return c;
}

/** Marks an already-written cell as an input without changing its value. */
function markInput(ws, row, col) {
  const c = ws.getCell(row, col);
  c.fill = fill(CREAM);
  c.font = { name: BODY_FONT, size: 10, color: { argb: INPUT } };
  return c;
}

function caption(ws, row, col, text) {
  const c = ws.getCell(row, col);
  c.value = text;
  c.font = { name: BODY_FONT, size: 9, bold: true, color: { argb: MUTED } };
  return c;
}

/**
 * The Read me sheet, laid out the way the originals do it: three columns at
 * 40/30/30, the banner on rows 1 and 2, then heading and body alternating with
 * a blank row between each pair. Headings are prefixed with # by the caller.
 */
function readMe(wb, title, lines) {
  const ws = wb.addWorksheet('Read me', { properties: { tabColor: { argb: MUTED } } });
  setup(ws, { widths: [40, 30, 30] });
  titleBlock(ws, 1, 'How this workbook works', null, 3);

  let r = 4;
  sectionHeading(ws, r, 1, 'What this is');
  r++;
  ws.getCell(r, 1).value = title;
  ws.getCell(r, 1).font = body();
  ws.getCell(r, 1).alignment = { wrapText: true, vertical: 'top' };
  ws.getRow(r).height = 33.75;
  r += 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;
    if (line.startsWith('#')) {
      sectionHeading(ws, r, 1, line.slice(1).trim());
      r++;
    } else {
      const cell = ws.getCell(r, 1);
      cell.value = line;
      cell.font = body();
      cell.alignment = { wrapText: true, vertical: 'top' };
      ws.getRow(r).height = line.length > 150 ? 48 : 33.75;
      r += 2;
    }
  }

  sectionHeading(ws, r, 1, 'Reading the colors');
  r++;
  const key = ws.getCell(r, 1);
  key.value =
    'Blue figures are yours to type over. Black figures are calculated — typing over one replaces the formula. Green shading is a heading or a total. This is the standard financial-modeling convention, so anyone in a finance or audit role will read it without being told.';
  key.font = body();
  key.alignment = { wrapText: true, vertical: 'top' };
  ws.getRow(r).height = 48;
  return ws;
}

async function save(wb, filename) {
  wb.creator = 'Explore Excel';
  wb.company = 'Explore Excel';
  wb.created = new Date();
  const file = path.join(OUT, filename);
  await wb.xlsx.writeFile(file);
  console.log(`  ${filename.padEnd(34)} ${(fs.statSync(file).size / 1024).toFixed(1)} KB`);
}

// ---------------------------------------------------------------
// 1. Monthly budget planner
// ---------------------------------------------------------------

async function budgetPlanner() {
  const wb = new ExcelJS.Workbook();

  readMe(wb, 'Monthly budget planner', [
    '#What this does',
    'Tracks what you planned to spend against what you actually spent, by category, for one month.',
    '',
    '#Using it',
    '1. On the Categories sheet, change the category names to ones that match your life.',
    '2. On the Budget sheet, type what you plan to spend into the Budgeted column.',
    '3. Log every payment on the Transactions sheet. Pick the category from the dropdown.',
    '4. Actual, Variance and Used fill in on their own. Nothing else needs touching.',
    '',
    '#Reading the result',
    'Variance is Budgeted minus Actual, so a positive number means you underspent and had money left over.',
    'Used turns amber at ninety per cent of a category and red once you pass it — ninety being the point where it is still possible to do something about it.',
    '',
    '#If you add categories',
    'Add the name on the Categories sheet, then copy the last row of the Budget table down. The SUMIFS formula adjusts itself.',
  ]);

  const cats = ['Rent or mortgage', 'Utilities', 'Groceries', 'Transport', 'Insurance',
                'Phone and internet', 'Subscriptions', 'Eating out', 'Health', 'Clothing',
                'Savings', 'Other'];

  // --- Categories -------------------------------------------------
  const cs = wb.addWorksheet('Categories', { properties: { tabColor: { argb: MUTED } } });
  setup(cs, { widths: [32, 46], freeze: [0, 4] });
  titleBlock(cs, 1, 'Categories', 'Rename these to match how you actually spend', 2);
  headerRow(cs, 4, ['Category', 'Notes']);
  cats.forEach((c, i) => {
    cs.getCell(5 + i, 1).value = c;
    markInput(cs, 5 + i, 1);
  });
  bodyBlock(cs, 5, 4 + cats.length, 1, 2);
  const CAT_FIRST = 5;
  const CAT_LAST = 4 + cats.length;

  // --- Transactions -----------------------------------------------
  const ts = wb.addWorksheet('Transactions', { properties: { tabColor: { argb: GREEN } } });
  setup(ts, { widths: [15, 36, 24, 14, 20], freeze: [0, 5] });
  titleBlock(ts, 1, 'Transactions', 'Log every payment here. The Budget sheet reads from it.', 5);
  headerRow(ts, 4, ['Date', 'Description', 'Category', 'Amount', 'Paid by']);

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
  sample.forEach((row, i) => row.forEach((v, c) => (ts.getCell(5 + i, c + 1).value = v)));

  const TX_FIRST = 5;
  const TX_LAST = 204;
  bodyBlock(ts, TX_FIRST, TX_LAST, 1, 5, { 1: DATE, 4: USD });

  // One validation, one range. Cell-by-cell produced overlapping regions.
  ts.dataValidations.add(`C${TX_FIRST}:C${TX_LAST}`, {
    type: 'list',
    allowBlank: true,
    formulae: [`=Categories!$A$${CAT_FIRST}:$A$${CAT_LAST}`],
    showErrorMessage: true,
    errorStyle: 'stop',
    errorTitle: 'Unknown category',
    error: 'Pick a category from the list, or add it on the Categories sheet first.',
  });
  ts.autoFilter = { from: { row: 4, column: 1 }, to: { row: 4, column: 5 } };

  // --- Budget -----------------------------------------------------
  const bs = wb.addWorksheet('Budget', { properties: { tabColor: { argb: GREEN_DK } } });
  setup(bs, { widths: [32, 16, 16, 16, 12], freeze: [0, 7] });
  titleBlock(bs, 1, 'Monthly budget', 'Type into Budgeted. Everything else calculates.', 5);

  // Headline figures, so the sheet answers its own question at a glance.
  const B_FIRST = 8;
  const B_LAST = B_FIRST + cats.length - 1;
  const kpis = [
    ['Budgeted', { formula: `SUM(B${B_FIRST}:B${B_LAST})` }],
    ['Spent', { formula: `SUM(C${B_FIRST}:C${B_LAST})` }],
    ['Left', { formula: `SUM(D${B_FIRST}:D${B_LAST})` }],
  ];
  kpis.forEach(([label, f], i) => {
    const col = 1 + i * 2;
    caption(bs, 4, col, label.toUpperCase());
    const c = bs.getCell(5, col);
    c.value = f;
    c.numFmt = USD;
    c.font = { name: HEAD_FONT, size: 14, bold: true, color: { argb: GREEN_DK } };
    c.fill = fill(MINT);
    c.border = box;
    bs.getCell(4, col).fill = fill(MINT);
  });
  bs.getRow(5).height = 24;

  headerRow(bs, 7, ['Category', 'Budgeted', 'Actual', 'Variance', 'Used']);
  const planned = [875, 130, 260, 140, 62, 45, 25, 90, 30, 40, 200, 50];
  cats.forEach((c, i) => {
    const r = B_FIRST + i;
    bs.getCell(r, 1).value = { formula: `Categories!A${CAT_FIRST + i}` };
    const bcell = bs.getCell(r, 2);
    bcell.value = planned[i];
    bcell.fill = fill(CREAM);
    bs.getCell(r, 3).value = {
      formula: `SUMIFS(Transactions!$D$${TX_FIRST}:$D$${TX_LAST},Transactions!$C$${TX_FIRST}:$C$${TX_LAST},$A${r})`,
    };
    bs.getCell(r, 4).value = { formula: `B${r}-C${r}` };
    bs.getCell(r, 5).value = { formula: `IFERROR(C${r}/B${r},0)` };
  });
  bodyBlock(bs, B_FIRST, B_LAST, 1, 5, { 2: USD, 3: USD, 4: USD, 5: PCT });
  // Re-apply the cream on the input column, which banding overwrote.
  for (let r = B_FIRST; r <= B_LAST; r++) markInput(bs, r, 2);

  const tRow = B_LAST + 1;
  bs.getCell(tRow, 1).value = 'Total';
  bs.getCell(tRow, 2).value = { formula: `SUM(B${B_FIRST}:B${B_LAST})` };
  bs.getCell(tRow, 3).value = { formula: `SUM(C${B_FIRST}:C${B_LAST})` };
  bs.getCell(tRow, 4).value = { formula: `SUM(D${B_FIRST}:D${B_LAST})` };
  bs.getCell(tRow, 5).value = { formula: `IFERROR(C${tRow}/B${tRow},0)` };
  totalRow(bs, tRow, 1, 5, { 2: USD, 3: USD, 4: USD, 5: PCT });

  bs.addConditionalFormatting({
    ref: `D${B_FIRST}:D${B_LAST}`,
    rules: [{
      type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1,
      style: { font: { color: { argb: RED }, bold: true } },
    }],
  });
  bs.addConditionalFormatting({
    ref: `E${B_FIRST}:E${B_LAST}`,
    rules: [
      { type: 'cellIs', operator: 'greaterThan', formulae: ['1'], priority: 1,
        style: { fill: cfFill('FFF6DEDE'), font: { color: { argb: RED }, bold: true } } },
      { type: 'cellIs', operator: 'greaterThan', formulae: ['0.9'], priority: 2,
        style: { fill: cfFill(CREAM), font: { color: { argb: AMBER }, bold: true } } },
    ],
  });

  await save(wb, 'monthly-budget-planner.xlsx');
}

// ---------------------------------------------------------------
// 2. Invoice
// ---------------------------------------------------------------

async function invoice() {
  const wb = new ExcelJS.Workbook();

  readMe(wb, 'Invoice template', [
    '#What this does',
    'Produces one printable invoice that totals itself and calculates sales tax, plus a log of what you have sent.',
    '',
    '#Using it',
    '1. Fill in your own details once on the Settings sheet. They flow onto every invoice.',
    '2. On the Invoice sheet, fill the cream cells: client block, invoice number and date.',
    '3. Enter the line items. Amount, subtotal, sales tax and total all calculate.',
    '4. Print to PDF. The page is already set to fit one sheet of US Letter portrait.',
    '',
    '#Sales tax',
    'The rate comes from the Settings sheet. The 8.25% shown is a placeholder only — sales tax varies by state and often by city, so set the rate that applies where you are. Set it to 0 if you do not collect sales tax; the line then shows zero rather than disappearing, which is the correct thing to show a client.',
    '',
    '#Keeping a record',
    'Add a row to the Invoice log as you send each one. The outstanding figure at the top totals everything still marked Unpaid.',
  ]);

  // --- Settings ---------------------------------------------------
  const st = wb.addWorksheet('Settings', { properties: { tabColor: { argb: MUTED } } });
  setup(st, { widths: [26, 44], freeze: [0, 4] });
  titleBlock(st, 1, 'Your details', 'Entered once, used on every invoice', 2);
  headerRow(st, 4, ['Field', 'Value']);
  const settings = [
    ['Business name', 'Your Business LLC'],
    ['Address line 1', '1200 Market Street'],
    ['Address line 2', 'Suite 400'],
    ['City, State ZIP', 'Austin, TX 78701'],
    ['Email', 'hello@yourbusiness.com'],
    ['Phone', '(512) 555-0100'],
    ['EIN or Tax ID', '00-0000000'],
    ['Sales tax rate', 0.0825],
    ['Bank account name', 'Your Business LLC'],
    ['Routing number', '000000000'],
    ['Account number', '00000000'],
    ['Payment terms (days)', 30],
  ];
  const S_FIRST = 5;
  settings.forEach(([k, v], i) => {
    const r = S_FIRST + i;
    st.getCell(r, 1).value = k;
    st.getCell(r, 1).font = { name: BODY_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
    st.getCell(r, 2).value = v;
    st.getCell(r, 2).fill = fill(CREAM);
  });
  bodyBlock(st, S_FIRST, S_FIRST + settings.length - 1, 1, 2);
  for (let i = 0; i < settings.length; i++) markInput(st, S_FIRST + i, 2);
  const TAX_CELL = `Settings!$B$${S_FIRST + 7}`;
  const TERMS_CELL = `Settings!$B$${S_FIRST + 11}`;
  st.getCell(S_FIRST + 7, 2).numFmt = '0.000%'; // US rates carry decimals, e.g. 8.25%

  // --- Invoice ----------------------------------------------------
  const inv = wb.addWorksheet('Invoice', { properties: { tabColor: { argb: GREEN } } });
  setup(inv, { widths: [44, 12, 15, 17] });

  const name = inv.getCell(1, 1);
  name.value = { formula: `Settings!B${S_FIRST}` };
  name.font = { name: HEAD_FONT, size: 17, bold: true, color: { argb: GREEN_DK } };
  inv.getRow(1).height = 24;
  [1, 2, 3, 4].forEach((n, i) => {
    const c = inv.getCell(2 + i, 1);
    c.value = { formula: `Settings!B${S_FIRST + n}` };
    c.font = { name: BODY_FONT, size: 10, color: { argb: MUTED } };
  });

  const word = inv.getCell(1, 4);
  word.value = 'INVOICE';
  word.font = { name: HEAD_FONT, size: 17, bold: true, color: { argb: GREEN } };
  word.alignment = { horizontal: 'right' };

  const meta = [
    ['Invoice number', 'INV-0001', null],
    ['Invoice date', 46030, DATE],
    ['Due date', { formula: `D3+${TERMS_CELL}` }, DATE],
  ];
  meta.forEach(([k, v, fmt], i) => {
    const r = 2 + i;
    const kc = inv.getCell(r, 3);
    kc.value = k;
    kc.font = { name: BODY_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
    kc.alignment = { horizontal: 'right' };
    const vc = inv.getCell(r, 4);
    vc.value = v;
    vc.alignment = { horizontal: 'right' };
    vc.font = body();
    vc.border = box;
    if (fmt) vc.numFmt = fmt;
    if (i < 2) vc.fill = fill(CREAM);
  });

  const billTo = inv.getCell(7, 1);
  billTo.value = 'Bill to';
  billTo.font = head();
  billTo.fill = fill(GREEN);
  billTo.border = box;
  ['Client name', 'Client address', 'City, State ZIP', 'Country'].forEach((v, i) => {
    const c = inv.getCell(8 + i, 1);
    c.value = v;
    c.font = body();
    c.fill = fill(CREAM);
    c.border = box;
  });

  const L_HEAD = 13;
  const L_FIRST = 14;
  const L_LAST = 26;
  headerRow(inv, L_HEAD, ['Description', 'Quantity', 'Unit price', 'Amount']);
  const lines = [
    ['Consultancy, October', 12, 65],
    ['Spreadsheet build and handover', 1, 900],
    ['Training session, half day', 2, 350],
  ];
  for (let i = 0; i <= L_LAST - L_FIRST; i++) {
    const r = L_FIRST + i;
    if (lines[i]) {
      inv.getCell(r, 1).value = lines[i][0];
      inv.getCell(r, 2).value = lines[i][1];
      inv.getCell(r, 3).value = lines[i][2];
    }
    inv.getCell(r, 4).value = { formula: `IF(B${r}="","",B${r}*C${r})` };
  }
  bodyBlock(inv, L_FIRST, L_LAST, 1, 4, { 3: USD, 4: USD });
  for (let r = L_FIRST; r <= L_LAST; r++) {
    [1, 2, 3].forEach((c) => markInput(inv, r, c));
  }

  const SUB = L_LAST + 1;
  [
    ['Subtotal', { formula: `SUM(D${L_FIRST}:D${L_LAST})` }],
    ['Sales tax', { formula: `ROUND(D${SUB}*${TAX_CELL},2)` }],
    ['Total due', { formula: `D${SUB}+D${SUB + 1}` }],
  ].forEach(([label, v], i) => {
    const r = SUB + i;
    const lc = inv.getCell(r, 3);
    lc.value = label;
    lc.alignment = { horizontal: 'right' };
    lc.font = i === 2 ? head({ color: { argb: WHITE } }) : { name: BODY_FONT, size: 10, color: { argb: INK } };
    lc.border = box;
    if (i === 2) lc.fill = fill(GREEN);
    const vc = inv.getCell(r, 4);
    vc.value = v;
    vc.numFmt = USD;
    vc.border = box;
    vc.font = i === 2 ? head({ size: 12 }) : body();
    if (i === 2) vc.fill = fill(GREEN);
  });

  const PAY = SUB + 4;
  const payHead = inv.getCell(PAY, 1);
  payHead.value = 'Payment details';
  payHead.font = { name: HEAD_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
  [['Account name', 8], ['Routing number', 9], ['Account number', 10]].forEach(([k, n], i) => {
    inv.getCell(PAY + 1 + i, 1).value = k;
    inv.getCell(PAY + 1 + i, 1).font = { name: BODY_FONT, size: 9, color: { argb: MUTED } };
    inv.getCell(PAY + 1 + i, 2).value = { formula: `Settings!B${S_FIRST + n}` };
    inv.getCell(PAY + 1 + i, 2).font = { name: BODY_FONT, size: 9, color: { argb: INK } };
  });
  const terms = inv.getCell(PAY + 5, 1);
  terms.value = { formula: `"Payment due within "&${TERMS_CELL}&" days of the invoice date."` };
  terms.font = { name: BODY_FONT, size: 9, italic: true, color: { argb: MUTED } };

  // --- Invoice log ------------------------------------------------
  const log = wb.addWorksheet('Invoice log', { properties: { tabColor: { argb: GREEN_DK } } });
  setup(log, { widths: [18, 32, 15, 15, 15, 14], freeze: [0, 7] });
  titleBlock(log, 1, 'Invoice log', 'One row per invoice sent', 6);

  const LOG_FIRST = 8;
  const LOG_LAST = 107;
  caption(log, 4, 1, 'OUTSTANDING');
  const outstanding = log.getCell(5, 1);
  outstanding.value = { formula: `SUMIFS(E${LOG_FIRST}:E${LOG_LAST},F${LOG_FIRST}:F${LOG_LAST},"Unpaid")` };
  outstanding.numFmt = USD;
  outstanding.font = { name: HEAD_FONT, size: 14, bold: true, color: { argb: RED } };
  outstanding.fill = fill(MINT);
  outstanding.border = box;
  log.getCell(4, 1).fill = fill(MINT);
  log.getRow(5).height = 24;

  headerRow(log, 7, ['Invoice number', 'Client', 'Issued', 'Due', 'Amount', 'Status']);
  [
    ['INV-0001', 'Northaero Inc', 46030, 46060, 2020, 'Unpaid'],
    ['INV-0002', 'Southend Components', 46033, 46063, 780, 'Paid'],
  ].forEach((row, i) => row.forEach((v, c) => (log.getCell(LOG_FIRST + i, c + 1).value = v)));

  bodyBlock(log, LOG_FIRST, LOG_LAST, 1, 6, { 3: DATE, 4: DATE, 5: USD });
  log.dataValidations.add(`F${LOG_FIRST}:F${LOG_LAST}`, {
    type: 'list', allowBlank: true,
    formulae: ['"Unpaid,Paid,Overdue,Written off"'],
    showErrorMessage: true, errorStyle: 'stop',
    errorTitle: 'Unknown status',
    error: 'Choose Unpaid, Paid, Overdue or Written off.',
  });
  log.addConditionalFormatting({
    ref: `F${LOG_FIRST}:F${LOG_LAST}`,
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Paid"'], priority: 1,
        style: { fill: cfFill(MINT), font: { color: { argb: GREEN_DK }, bold: true } } },
      { type: 'cellIs', operator: 'equal', formulae: ['"Overdue"'], priority: 2,
        style: { fill: cfFill('FFF6DEDE'), font: { color: { argb: RED }, bold: true } } },
    ],
  });
  log.autoFilter = { from: { row: 7, column: 1 }, to: { row: 7, column: 6 } };

  await save(wb, 'invoice-template.xlsx');
}

// ---------------------------------------------------------------
// 3. Project tracker with Gantt
// ---------------------------------------------------------------

async function projectTracker() {
  const wb = new ExcelJS.Workbook();

  readMe(wb, 'Project tracker with Gantt', [
    '#What this does',
    'Tracks tasks, owners, dates and progress, and draws a Gantt chart from those dates without a single manual bar.',
    '',
    '#Using it',
    '1. Set the chart start date in the cream cell B3 on the Tasks sheet. The timeline runs from there.',
    '2. Enter each task with an owner, a start date and a duration in days.',
    '3. End date, Status and the chart bars all calculate themselves.',
    '4. Update the Progress column as work proceeds.',
    '',
    '#How the chart works',
    'There are no shapes and nothing is drawn. Each timeline cell carries a conditional formatting rule that fills it when its date falls between the task start and end. Change a date and the chart redraws instantly.',
    'Completed tasks fill dark green, work in progress fills light green, and weekends are shaded so the working week stays readable.',
    '',
    '#Extending the timeline',
    'The timeline covers 42 days. Move the window by changing the start date, or widen it by copying the last timeline column to the right.',
  ]);

  const ws = wb.addWorksheet('Tasks', { properties: { tabColor: { argb: GREEN } } });
  const DAYS = 42;
  const TL = 9; // timeline starts at column I
  setup(ws, {
    widths: [5, 36, 16, 14, 8, 14, 10, 13].concat(Array(DAYS).fill(3)),
    freeze: [8, 6],
    landscape: true,
  });

  titleBlock(ws, 1, 'Project tracker', 'Dates drive the chart. Nothing is drawn by hand.', 8);

  // The control cell sits in a wide column so the date is never truncated.
  caption(ws, 3, 1, 'Chart starts');
  const startCell = inputCell(ws, 3, 2, 46027, DATE);
  startCell.alignment = { horizontal: 'left' };

  const H = 6;
  const FIRST = 7;
  headerRow(ws, H, ['#', 'Task', 'Owner', 'Start', 'Days', 'End', 'Progress', 'Status']);

  for (let d = 0; d < DAYS; d++) {
    const c = ws.getCell(H, TL + d);
    c.value = { formula: `$B$3+${d}` };
    c.numFmt = 'd';
    c.font = head({ size: 8 });
    c.fill = fill(GREEN);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  }

  const tasks = [
    ['Scope and requirements', 'Adams', 46027, 4, 1],
    ['Data audit', 'Brennan', 46031, 3, 1],
    ['Build data model', 'Adams', 46034, 6, 0.6],
    ['Reporting layer', 'Raman', 46040, 5, 0.2],
    ['User testing', 'Okafor', 46045, 4, 0],
    ['Fixes and polish', 'Adams', 46049, 3, 0],
    ['Training and handover', 'Raman', 46052, 2, 0],
  ];
  const LAST = FIRST + tasks.length - 1;

  tasks.forEach((t, i) => {
    const r = FIRST + i;
    ws.getCell(r, 1).value = i + 1;
    ws.getCell(r, 2).value = t[0];
    ws.getCell(r, 3).value = t[1];
    ws.getCell(r, 4).value = t[2];
    ws.getCell(r, 5).value = t[3];
    ws.getCell(r, 6).value = { formula: `IF(OR(D${r}="",E${r}=""),"",D${r}+E${r}-1)` };
    ws.getCell(r, 7).value = t[4];
    ws.getCell(r, 8).value = {
      formula: `IF(D${r}="","",IF(G${r}>=1,"Done",IF(G${r}>0,"In progress",IF(D${r}<TODAY(),"Late","Not started"))))`,
    };
  });

  bodyBlock(ws, FIRST, LAST, 1, 8, { 4: DATE, 6: DATE, 7: PCT });
  for (let r = FIRST; r <= LAST; r++) {
    [1, 5, 7, 8].forEach((c) => (ws.getCell(r, c).alignment = { horizontal: 'center' }));
    [2, 3, 4, 5, 7].forEach((c) => markInput(ws, r, c));
    for (let d = 0; d < DAYS; d++) {
      ws.getCell(r, TL + d).border = { top: thin, left: thin, bottom: thin, right: thin };
    }
  }

  const first = ws.getColumn(TL).letter;
  const last = ws.getColumn(TL + DAYS - 1).letter;

  ws.addConditionalFormatting({
    ref: `${first}${FIRST}:${last}${LAST}`,
    rules: [
      { type: 'expression', priority: 1,
        formulae: [`AND($D${FIRST}<>"",${first}$${H}>=$D${FIRST},${first}$${H}<=$F${FIRST},$G${FIRST}>=1)`],
        style: { fill: cfFill(GREEN) } },
      { type: 'expression', priority: 2,
        formulae: [`AND($D${FIRST}<>"",${first}$${H}>=$D${FIRST},${first}$${H}<=$F${FIRST})`],
        style: { fill: cfFill(MINT_PALE) } },
      { type: 'expression', priority: 3,
        formulae: [`WEEKDAY(${first}$${H},2)>5`],
        style: { fill: cfFill(PAPER) } },
    ],
  });

  ws.addConditionalFormatting({
    ref: `H${FIRST}:H${LAST}`,
    rules: [
      { type: 'cellIs', operator: 'equal', formulae: ['"Done"'], priority: 1,
        style: { fill: cfFill(MINT), font: { color: { argb: GREEN_DK }, bold: true } } },
      { type: 'cellIs', operator: 'equal', formulae: ['"Late"'], priority: 2,
        style: { fill: cfFill('FFF6DEDE'), font: { color: { argb: RED }, bold: true } } },
    ],
  });

  ws.dataValidations.add(`G${FIRST}:G${LAST}`, {
    type: 'decimal', operator: 'between', allowBlank: true,
    formulae: [0, 1], showErrorMessage: true, errorStyle: 'stop',
    errorTitle: 'Progress is a percentage',
    error: 'Enter a value between 0% and 100%.',
  });

  // --- Summary ----------------------------------------------------
  const sm = wb.addWorksheet('Summary', { properties: { tabColor: { argb: GREEN_DK } } });
  setup(sm, { widths: [30, 16, 44], freeze: [0, 4] });
  titleBlock(sm, 1, 'Project summary', 'Everything here reads from the Tasks sheet', 3);
  headerRow(sm, 4, ['Measure', 'Value', 'Notes']);
  const measures = [
    ['Tasks total', { formula: `COUNTA(Tasks!B${FIRST}:B${LAST})` }, 'Rows with a task name', null],
    ['Done', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Done")` }, 'Progress at 100%', null],
    ['In progress', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"In progress")` }, '', null],
    ['Not started', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Not started")` }, '', null],
    ['Late', { formula: `COUNTIF(Tasks!H${FIRST}:H${LAST},"Late")` }, 'Started before today with no progress', null],
    ['Overall progress', { formula: `IFERROR(AVERAGE(Tasks!G${FIRST}:G${LAST}),0)` }, 'Average of the progress column', PCT],
    ['Earliest start', { formula: `MIN(Tasks!D${FIRST}:D${LAST})` }, '', DATE],
    ['Latest finish', { formula: `MAX(Tasks!F${FIRST}:F${LAST})` }, '', DATE],
    ['Calendar days', { formula: `MAX(Tasks!F${FIRST}:F${LAST})-MIN(Tasks!D${FIRST}:D${LAST})+1` }, '', null],
    ['Working days', { formula: `NETWORKDAYS(MIN(Tasks!D${FIRST}:D${LAST}),MAX(Tasks!F${FIRST}:F${LAST}))` }, 'Excludes weekends', null],
  ];
  measures.forEach(([k, v, n, fmt], i) => {
    const r = 5 + i;
    sm.getCell(r, 1).value = k;
    sm.getCell(r, 2).value = v;
    sm.getCell(r, 3).value = n;
    if (fmt) sm.getCell(r, 2).numFmt = fmt;
  });
  bodyBlock(sm, 5, 4 + measures.length, 1, 3);
  measures.forEach(([, , , fmt], i) => { if (fmt) sm.getCell(5 + i, 2).numFmt = fmt; });

  await save(wb, 'project-tracker-gantt.xlsx');
}

// ---------------------------------------------------------------
// 4. Attendance and leave tracker
// ---------------------------------------------------------------

async function attendance() {
  const wb = new ExcelJS.Workbook();

  readMe(wb, 'Attendance and leave tracker', [
    '#What this does',
    'Records daily attendance for a team across one month and totals every code automatically.',
    '',
    '#Using it',
    '1. Set the month in the cream cell B3 on the Attendance sheet. Every column heading follows from it.',
    '2. Replace the names in column B with your team.',
    '3. Each day, pick a code from the dropdown. The totals on the right count themselves.',
    '4. The Summary sheet totals the whole team.',
    '',
    '#The codes',
    'P present, V vacation, S sick, L late, R remote, U unpaid leave, X company holiday. Each one colours its own cell so a month reads at a glance.',
    '',
    '#Why the dropdown matters',
    'A tracker breaks the moment someone types "p" one day and "Present" the next, because COUNTIF treats them as different values. The dropdown makes that impossible, which is why the whole grid carries one.',
  ]);

  const codes = [
    ['P', 'Present', GREEN, 'Working days'],
    ['V', 'Vacation', 'FF2E6E8E', 'Paid time off entitlement'],
    ['S', 'Sick', RED, 'Sickness absence'],
    ['L', 'Late', AMBER, 'Working days, flagged'],
    ['R', 'Remote', GREEN_DK, 'Working days'],
    ['U', 'Unpaid leave', MUTED, 'Unpaid absence'],
    ['X', 'Company holiday', 'FF6E6E6C', 'Not counted as absence'],
  ];

  const cs = wb.addWorksheet('Codes', { properties: { tabColor: { argb: MUTED } } });
  setup(cs, { widths: [10, 28, 44], freeze: [0, 4] });
  titleBlock(cs, 1, 'Codes', 'The only values the grid accepts', 3);
  headerRow(cs, 4, ['Code', 'Meaning', 'Counts towards']);
  codes.forEach(([c, m, colour, counts], i) => {
    const r = 5 + i;
    const cc = cs.getCell(r, 1);
    cc.value = c;
    cc.alignment = { horizontal: 'center' };
    cc.font = head();
    cc.fill = fill(colour);
    cs.getCell(r, 2).value = m;
    cs.getCell(r, 3).value = counts;
  });
  bodyBlock(cs, 5, 4 + codes.length, 2, 3);
  for (let i = 0; i < codes.length; i++) cs.getCell(5 + i, 1).border = box;

  // --- Grid --------------------------------------------------------
  const ws = wb.addWorksheet('Attendance', { properties: { tabColor: { argb: GREEN } } });
  const DAYS = 31;
  const D1 = 3; // day columns start at C
  const names = ['Adams, R', 'Brennan, T', 'Fischer, L', 'Okafor, J', 'Pritchard, O',
                 'Raman, P', 'Whitfield, S', 'Zhang, M'];
  const H = 6;
  const FIRST = 7;
  const LAST = FIRST + names.length - 1;
  const T1 = D1 + DAYS;

  setup(ws, {
    widths: [5, 22].concat(Array(DAYS).fill(3.1)).concat(Array(codes.length).fill(5)),
    freeze: [2, 6],
    landscape: true,
  });

  titleBlock(ws, 1, 'Attendance and leave', 'Set the month, then fill the grid from the dropdowns', 10);

  // Control cell in column B, which is wide enough for "January 2026".
  caption(ws, 3, 1, 'Month');
  const monthCell = inputCell(ws, 3, 2, 46023, 'mmmm yyyy');
  monthCell.alignment = { horizontal: 'left' };

  ws.getCell(H, 1).value = '#';
  ws.getCell(H, 2).value = 'Name';
  [1, 2].forEach((c) => {
    const cell = ws.getCell(H, c);
    cell.font = head();
    cell.fill = fill(GREEN);
    cell.border = box;
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });
  ws.getRow(H).height = 26;

  for (let d = 0; d < DAYS; d++) {
    const c = ws.getCell(H, D1 + d);
    c.value = { formula: `IF(MONTH($B$3+${d})=MONTH($B$3),$B$3+${d},"")` };
    c.numFmt = 'd';
    c.font = head({ size: 8 });
    c.fill = fill(GREEN);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  }

  codes.forEach(([code, , colour], i) => {
    const c = ws.getCell(H, T1 + i);
    c.value = code;
    c.font = head();
    c.fill = fill(colour);
    c.border = box;
    c.alignment = { horizontal: 'center' };
  });

  const firstDay = ws.getColumn(D1).letter;
  const lastDay = ws.getColumn(D1 + DAYS - 1).letter;

  names.forEach((n, i) => {
    const r = FIRST + i;
    ws.getCell(r, 1).value = i + 1;
    ws.getCell(r, 1).alignment = { horizontal: 'center' };
    ws.getCell(r, 1).border = box;
    ws.getCell(r, 1).font = body();
    const nc = ws.getCell(r, 2);
    nc.value = n;
    nc.border = box;
    nc.font = body();
    nc.font = { name: BODY_FONT, size: 10, color: { argb: INPUT } };
    nc.fill = fill(CREAM);

    for (let d = 0; d < DAYS; d++) {
      const cell = ws.getCell(r, D1 + d);
      cell.alignment = { horizontal: 'center' };
      cell.font = { name: BODY_FONT, size: 9, bold: true, color: { argb: INK } };
      cell.border = box;
    }
    codes.forEach(([code], ci) => {
      const cell = ws.getCell(r, T1 + ci);
      cell.value = { formula: `COUNTIF($${firstDay}${r}:$${lastDay}${r},"${code}")` };
      cell.alignment = { horizontal: 'center' };
      cell.font = { name: BODY_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
      cell.border = box;
      cell.fill = fill(MINT);
    });
  });

  // One validation covering the whole grid, not one per cell.
  ws.dataValidations.add(`${firstDay}${FIRST}:${lastDay}${LAST}`, {
    type: 'list', allowBlank: true,
    formulae: [`"${codes.map((c) => c[0]).join(',')}"`],
    showErrorMessage: true, errorStyle: 'stop',
    errorTitle: 'Unknown code',
    error: 'Use one of the codes listed on the Codes sheet.',
  });

  ws.addConditionalFormatting({
    ref: `${firstDay}${FIRST}:${lastDay}${LAST}`,
    rules: codes
      .map(([code, , colour], i) => ({
        type: 'cellIs', operator: 'equal', formulae: [`"${code}"`], priority: i + 1,
        style: { fill: cfFill(colour), font: { color: { argb: WHITE }, bold: true } },
      }))
      .concat([{
        type: 'expression', priority: codes.length + 1,
        formulae: [`AND(${firstDay}$${H}<>"",WEEKDAY(${firstDay}$${H},2)>5)`],
        style: { fill: cfFill(PAPER) },
      }]),
  });

  // --- Summary ----------------------------------------------------
  const sm = wb.addWorksheet('Summary', { properties: { tabColor: { argb: GREEN_DK } } });
  setup(sm, { widths: [12, 26, 14, 40], freeze: [0, 4] });
  titleBlock(sm, 1, 'Month summary', 'Totals across the whole team', 4);
  headerRow(sm, 4, ['Code', 'Meaning', 'Days', 'Counts towards']);
  codes.forEach(([code, meaning, colour, counts], i) => {
    const r = 5 + i;
    const col = ws.getColumn(T1 + i).letter;
    const cc = sm.getCell(r, 1);
    cc.value = code;
    cc.alignment = { horizontal: 'center' };
    cc.font = head();
    cc.fill = fill(colour);
    cc.border = box;
    sm.getCell(r, 2).value = meaning;
    sm.getCell(r, 3).value = { formula: `SUM(Attendance!${col}${FIRST}:${col}${LAST})` };
    sm.getCell(r, 3).alignment = { horizontal: 'center' };
    sm.getCell(r, 4).value = counts;
  });
  bodyBlock(sm, 5, 4 + codes.length, 2, 4);
  for (let i = 0; i < codes.length; i++) sm.getCell(5 + i, 1).border = box;

  const tr = 5 + codes.length;
  sm.getCell(tr, 1).value = '';
  sm.getCell(tr, 2).value = 'Total entries';
  sm.getCell(tr, 3).value = { formula: `SUM(C5:C${tr - 1})` };
  sm.getCell(tr, 3).alignment = { horizontal: 'center' };
  sm.getCell(tr, 4).value = 'Every code entered this month';
  totalRow(sm, tr, 1, 4);

  await save(wb, 'attendance-tracker.xlsx');
}

// ---------------------------------------------------------------
// 5. Personal budget planner
// ---------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Twelve monthly figures from a base, with named months overridden. */
const year = (base, overrides = {}) =>
  MONTHS.map((m) => (m in overrides ? overrides[m] : base));

const INCOME_LINES = [
  ['Take-home pay', year(4200)],
  ['Second income', year(1150)],
  ['Other income', year(0, { Jun: 300, Dec: 250 })],
];

const EXPENSE_LINES = [
  // Utilities swing with the seasons, which is the point of a 12-month view.
  ['Rent or mortgage', 'Housing', year(1450)],
  ['Utilities', 'Housing', year(180, { Jan: 265, Feb: 250, Jul: 230, Aug: 235, Dec: 240 })],
  ['Home insurance', 'Housing', year(95)],
  ['Repairs and maintenance', 'Housing', year(60, { Apr: 400, Sep: 220 })],
  ['Groceries', 'Food', year(620, { Nov: 700, Dec: 760 })],
  ['Eating out', 'Food', year(180, { Dec: 260 })],
  ['Car payment', 'Transport', year(340)],
  ['Fuel', 'Transport', year(145, { Jul: 190, Aug: 185 })],
  ['Auto insurance', 'Transport', year(120)],
  ['Credit card payment', 'Debt', year(250)],
  ['Student loan', 'Debt', year(310)],
  ['Emergency fund', 'Savings', year(300)],
  ['Retirement', 'Savings', year(450)],
  ['Subscriptions', 'Discretionary', year(55)],
  ['Entertainment', 'Discretionary', year(140, { Jul: 320 })],
  ['Clothing', 'Discretionary', year(90, { Sep: 240 })],
  ['Gifts and giving', 'Discretionary', year(75, { Dec: 480 })],
];

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Debt', 'Savings', 'Discretionary'];

// Row map for the Planner sheet. Kept here so the Summary formulas and the
// verification script both reference one definition rather than magic numbers.
const P = {
  head: 4,
  incomeBand: 5,
  incomeFirst: 6,
  incomeLast: 5 + INCOME_LINES.length,
  get incomeTotal() { return this.incomeLast + 1; },
  get expenseBand() { return this.incomeTotal + 2; },
  get expenseFirst() { return this.expenseBand + 1; },
  get expenseLast() { return this.expenseFirst + EXPENSE_LINES.length - 1; },
  get expenseTotal() { return this.expenseLast + 1; },
  get surplus() { return this.expenseTotal + 2; },
  get running() { return this.surplus + 1; },
  firstMonthCol: 3, // C
  get lastMonthCol() { return this.firstMonthCol + 11; }, // N
  get yearCol() { return this.lastMonthCol + 1; }, // O
};

function bandRow(ws, row, label, lastCol) {
  for (let c = 1; c <= lastCol; c++) {
    const cell = ws.getCell(row, c);
    cell.fill = fill(MINT);
    cell.font = { name: HEAD_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
    cell.border = box;
  }
  ws.getCell(row, 1).value = label;
  ws.getRow(row).height = 18;
}

async function personalBudgetPlanner() {
  const wb = new ExcelJS.Workbook();
  const LAST = P.yearCol;
  const colLetter = (n) => {
    let s = '';
    while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; }
    return s;
  };
  const C = colLetter(P.firstMonthCol);
  const N = colLetter(P.lastMonthCol);
  const O = colLetter(P.yearCol);

  readMe(wb,
    'A twelve-month personal budget. Income and spending by category for every month of the year, with the surplus or deficit each month and the running balance that follows from it.',
    [
      '#Filling it in',
      'Type over the blue figures on the Planner sheet. Every line runs across twelve months, so a cost that changes with the season — utilities, gifts in December — can be entered month by month rather than averaged into something that is wrong all year.',
      '#The two rows that matter',
      'Surplus or deficit is that month on its own: income less everything you spent. Running balance carries it forward, so it answers the question the monthly figure cannot — whether a good January is still covering you by June.',
      '#The Summary sheet',
      'Pick any month in the blue cell and the whole sheet re-reads for that month. It finds the column with MATCH and pulls the figures with INDEX, which is why it works in every version of Excel rather than only the recent ones.',
      '#Savings is an expense here',
      'Money moved to an emergency fund or a retirement account sits in the expense block deliberately. Treating it as something left over at the end is how it stops happening; treating it as a bill you pay yourself is how it does not.',
      '#The check at the foot of the Summary',
      'It adds the six category totals and compares them against the planner. It should always say Agrees. If it does not, a line has been given a category that is not one of the six.',
    ]);

  // ---------------- Planner ----------------
  const ws = wb.addWorksheet('Planner', { properties: { tabColor: { argb: GREEN } } });
  setup(ws, {
    widths: [30, 15].concat(Array(12).fill(10)).concat([12]),
    freeze: [2, P.head],
    landscape: true,
  });

  titleBlock(ws, 1, 'Personal Budget Planner', 'Twelve months, income against spending', LAST);
  headerRow(ws, P.head, ['Line', 'Category', ...MONTHS, 'Year']);

  bandRow(ws, P.incomeBand, 'INCOME', LAST);
  INCOME_LINES.forEach(([label, values], i) => {
    const r = P.incomeFirst + i;
    ws.getCell(r, 1).value = label;
    ws.getCell(r, 2).value = 'Income';
    values.forEach((v, m) => { ws.getCell(r, P.firstMonthCol + m).value = v; });
    ws.getCell(r, P.yearCol).value = { formula: `SUM(${C}${r}:${N}${r})` };
  });

  bandRow(ws, P.expenseBand, 'EXPENSES', LAST);
  EXPENSE_LINES.forEach(([label, cat, values], i) => {
    const r = P.expenseFirst + i;
    ws.getCell(r, 1).value = label;
    ws.getCell(r, 2).value = cat;
    values.forEach((v, m) => { ws.getCell(r, P.firstMonthCol + m).value = v; });
    ws.getCell(r, P.yearCol).value = { formula: `SUM(${C}${r}:${N}${r})` };
  });

  // Body styling, then the input columns marked blue over the top.
  bodyBlock(ws, P.incomeFirst, P.incomeLast, 1, LAST,
    Object.fromEntries(Array.from({ length: 13 }, (_, i) => [P.firstMonthCol + i, USD])));
  bodyBlock(ws, P.expenseFirst, P.expenseLast, 1, LAST,
    Object.fromEntries(Array.from({ length: 13 }, (_, i) => [P.firstMonthCol + i, USD])));
  for (const [first, last] of [[P.incomeFirst, P.incomeLast], [P.expenseFirst, P.expenseLast]]) {
    for (let r = first; r <= last; r++) {
      for (let c = P.firstMonthCol; c <= P.lastMonthCol; c++) {
        const cell = ws.getCell(r, c);
        cell.font = { name: BODY_FONT, size: 10, color: { argb: INPUT } };
        cell.numFmt = USD;
      }
      ws.getCell(r, P.yearCol).font = { name: BODY_FONT, size: 10, bold: true, color: { argb: INK } };
    }
  }

  // Totals.
  const totalLine = (row, label, perMonth) => {
    ws.getCell(row, 1).value = label;
    for (let c = P.firstMonthCol; c <= P.lastMonthCol; c++) {
      ws.getCell(row, c).value = { formula: perMonth(colLetter(c)) };
    }
    ws.getCell(row, P.yearCol).value = { formula: `SUM(${C}${row}:${N}${row})` };
    totalRow(ws, row, 1, LAST,
      Object.fromEntries(Array.from({ length: 13 }, (_, i) => [P.firstMonthCol + i, USD])));
  };

  totalLine(P.incomeTotal, 'Total income',
    (L) => `SUM(${L}${P.incomeFirst}:${L}${P.incomeLast})`);
  totalLine(P.expenseTotal, 'Total spending',
    (L) => `SUM(${L}${P.expenseFirst}:${L}${P.expenseLast})`);
  totalLine(P.surplus, 'Surplus / (deficit)',
    (L) => `${L}${P.incomeTotal}-${L}${P.expenseTotal}`);

  // Running balance: this month's surplus added to last month's position. The
  // year column shows where December leaves you, not a sum of the row.
  ws.getCell(P.running, 1).value = 'Running balance';
  for (let c = P.firstMonthCol; c <= P.lastMonthCol; c++) {
    const L = colLetter(c);
    ws.getCell(P.running, c).value = {
      formula: c === P.firstMonthCol
        ? `${L}${P.surplus}`
        : `${colLetter(c - 1)}${P.running}+${L}${P.surplus}`,
    };
  }
  ws.getCell(P.running, P.yearCol).value = { formula: `${N}${P.running}` };
  for (let c = 1; c <= LAST; c++) {
    const cell = ws.getCell(P.running, c);
    cell.font = { name: HEAD_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
    cell.fill = fill(MINT);
    cell.border = box;
    if (c >= P.firstMonthCol) cell.numFmt = USD;
  }
  ws.getRow(P.running).height = 18;

  // A month in deficit reads red wherever it appears.
  for (const row of [P.surplus, P.running]) {
    ws.addConditionalFormatting({
      ref: `${C}${row}:${O}${row}`,
      rules: [{
        type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1,
        style: { font: { color: { argb: RED }, bold: true } },
      }],
    });
  }

  // ---------------- Summary ----------------
  const sm = wb.addWorksheet('Summary', { properties: { tabColor: { argb: GREEN_DK } } });
  setup(sm, { widths: [30, 16, 16, 16] });
  titleBlock(sm, 1, 'Summary', 'One month in focus, and the year behind it', 4);

  sm.getCell(4, 1).value = 'Month in focus';
  sm.getCell(4, 1).font = { name: BODY_FONT, size: 10, bold: true, color: { argb: INK } };
  const pick = inputCell(sm, 4, 2, 'Mar');
  pick.alignment = { horizontal: 'center' };
  sm.dataValidations.add('B4:B4', {
    type: 'list', allowBlank: false,
    formulae: [`"${MONTHS.join(',')}"`],
    showErrorMessage: true, errorStyle: 'stop',
    errorTitle: 'Pick a month',
    error: 'Choose one of the twelve month abbreviations, for example Mar.',
  });

  // MATCH finds the column for the chosen month; INDEX pulls from it. Passing 0
  // as the row argument returns the whole column, which is what lets SUMPRODUCT
  // total one category within a single month. No XLOOKUP, so this opens
  // anywhere.
  const monthCol = `MATCH($B$4,Planner!$${C}$${P.head}:$${N}$${P.head},0)`;

  headerRow(sm, 6, ['Category', 'This month', 'Year total', 'Share of income']);
  CATEGORIES.forEach((cat, i) => {
    const r = 7 + i;
    sm.getCell(r, 1).value = cat;
    sm.getCell(r, 2).value = {
      formula: `SUMPRODUCT((Planner!$B$${P.expenseFirst}:$B$${P.expenseLast}=$A${r})*INDEX(Planner!$${C}$${P.expenseFirst}:$${N}$${P.expenseLast},0,${monthCol}))`,
    };
    sm.getCell(r, 3).value = {
      formula: `SUMIF(Planner!$B$${P.expenseFirst}:$B$${P.expenseLast},$A${r},Planner!$${O}$${P.expenseFirst}:$${O}$${P.expenseLast})`,
    };
    sm.getCell(r, 4).value = { formula: `IFERROR(C${r}/Planner!$${O}$${P.incomeTotal},0)` };
  });
  const catLast = 6 + CATEGORIES.length;
  bodyBlock(sm, 7, catLast, 1, 4, { 2: USD, 3: USD, 4: PCT });

  const totRow = catLast + 1;
  sm.getCell(totRow, 1).value = 'Total spending';
  sm.getCell(totRow, 2).value = { formula: `SUM(B7:B${catLast})` };
  sm.getCell(totRow, 3).value = { formula: `SUM(C7:C${catLast})` };
  sm.getCell(totRow, 4).value = { formula: `SUM(D7:D${catLast})` };
  totalRow(sm, totRow, 1, 4, { 2: USD, 3: USD, 4: PCT });

  const posRow = totRow + 2;
  sectionHeading(sm, posRow, 1, 'Where the month lands');
  const lines = [
    ['Income', `INDEX(Planner!$${C}$${P.incomeTotal}:$${N}$${P.incomeTotal},${monthCol})`,
      `Planner!$${O}$${P.incomeTotal}`, USD],
    ['Spending', `INDEX(Planner!$${C}$${P.expenseTotal}:$${N}$${P.expenseTotal},${monthCol})`,
      `Planner!$${O}$${P.expenseTotal}`, USD],
  ];
  lines.forEach(([label, m, y, fmt], i) => {
    const r = posRow + 1 + i;
    sm.getCell(r, 1).value = label;
    sm.getCell(r, 2).value = { formula: m };
    sm.getCell(r, 3).value = { formula: y };
    sm.getCell(r, 2).numFmt = fmt;
    sm.getCell(r, 3).numFmt = fmt;
  });
  const surRow = posRow + 3;
  sm.getCell(surRow, 1).value = 'Surplus / (deficit)';
  sm.getCell(surRow, 2).value = { formula: `B${posRow + 1}-B${posRow + 2}` };
  sm.getCell(surRow, 3).value = { formula: `C${posRow + 1}-C${posRow + 2}` };
  const rateRow = surRow + 1;
  sm.getCell(rateRow, 1).value = 'Savings rate';
  sm.getCell(rateRow, 2).value = { formula: `IFERROR(B${7 + CATEGORIES.indexOf('Savings')}/B${posRow + 1},0)` };
  sm.getCell(rateRow, 3).value = { formula: `IFERROR(C${7 + CATEGORIES.indexOf('Savings')}/C${posRow + 1},0)` };
  bodyBlock(sm, posRow + 1, rateRow, 1, 3, { 2: USD, 3: USD });
  sm.getCell(rateRow, 2).numFmt = PCT;
  sm.getCell(rateRow, 3).numFmt = PCT;
  for (const c of [1, 2, 3]) {
    sm.getCell(surRow, c).font = { name: HEAD_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
  }
  sm.addConditionalFormatting({
    ref: `B${surRow}:C${surRow}`,
    rules: [{
      type: 'cellIs', operator: 'lessThan', formulae: ['0'], priority: 1,
      style: { font: { color: { argb: RED }, bold: true } },
    }],
  });

  const chkRow = rateRow + 2;
  sectionHeading(sm, chkRow, 1, 'Check');
  sm.getCell(chkRow + 1, 1).value = 'Categories against the planner';
  sm.getCell(chkRow + 1, 1).font = body();
  sm.getCell(chkRow + 1, 2).value = {
    formula: `IF(ROUND(C${totRow}-Planner!$${O}$${P.expenseTotal},2)=0,"Agrees","Out by "&TEXT(C${totRow}-Planner!$${O}$${P.expenseTotal},"#,##0"))`,
  };
  sm.getCell(chkRow + 1, 2).font = { name: HEAD_FONT, size: 10, bold: true, color: { argb: GREEN_DK } };
  sm.getCell(chkRow + 1, 2).alignment = { horizontal: 'center' };
  sm.getCell(chkRow + 1, 2).fill = fill(MINT);
  sm.getCell(chkRow + 1, 2).border = box;

  await save(wb, 'personal-budget-planner.xlsx');
}

// ---------------------------------------------------------------

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  console.log('Building templates:');
  await budgetPlanner();
  await invoice();
  await projectTracker();
  await attendance();
  await personalBudgetPlanner();
  console.log("Done.");
}

// Exported so the verification script can compute expected values from the same
// source arrays, rather than from the formulas it is supposed to be checking.
module.exports = { MONTHS, INCOME_LINES, EXPENSE_LINES, CATEGORIES, P };

if (require.main === module) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
