export type CellValue = string | number | boolean | null;

export interface Sheet {
  columns: string[];
  headers: string[];
  rows: CellValue[][];
  editable?: number[];
  money?: number[];
  /** Columns holding Excel date serials, rendered as dates rather than numbers. */
  dates?: number[];
}

export interface CellRef {
  c: number;
  r: number;
}

export interface EvalResult {
  value?: CellValue;
  error?: string;
  note?: string;
  cells: CellRef[];
}

const colIdx = (letter: string) => letter.toUpperCase().charCodeAt(0) - 65;

interface Range {
  c: number;
  c2: number;
  r1: number;
  r2: number;
}

export function parseRange(s: string): Range | null {
  const m = String(s).trim().match(/^\$?([A-Za-z])\$?(\d+):\$?([A-Za-z])\$?(\d+)$/);
  if (!m) return null;
  return { c: colIdx(m[1]), c2: colIdx(m[3]), r1: parseInt(m[2], 10), r2: parseInt(m[4], 10) };
}

function parseCell(s: string): CellRef | null {
  const m = String(s).trim().match(/^\$?([A-Za-z])\$?(\d+)$/);
  if (!m) return null;
  return { c: colIdx(m[1]), r: parseInt(m[2], 10) - 2 };
}

/** Sheet row 1 is the header row, so data row index = sheet row - 2. */
function rangeValues(sheet: Sheet, rg: Range | null): CellValue[] | null {
  if (!rg) return null;
  const out: CellValue[] = [];
  if (rg.c2 !== rg.c) {
    for (let r = rg.r1; r <= rg.r2; r++) {
      const i = r - 2;
      for (let c = rg.c; c <= rg.c2; c++) {
        out.push(i >= 0 && i < sheet.rows.length ? sheet.rows[i][c] : null);
      }
    }
    return out;
  }
  for (let r = rg.r1; r <= rg.r2; r++) {
    const i = r - 2;
    out.push(i >= 0 && i < sheet.rows.length ? sheet.rows[i][rg.c] : null);
  }
  return out;
}

function normalise(v: CellValue): string | number | boolean {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number' || typeof v === 'boolean') return v;
  const s = String(v).trim();
  const n = parseFloat(s);
  return s !== '' && !isNaN(n) && /^-?[\d.,]+$/.test(s) ? n : s.toLowerCase();
}

const equal = (a: CellValue, b: CellValue) => normalise(a) === normalise(b);

function num(v: CellValue): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return isNaN(n) ? 0 : n;
}

function truthy(v: CellValue): boolean {
  const n = normalise(v);
  return n === true || (typeof n === 'number' && n !== 0);
}

/** Split on commas that are not inside quotes or nested parentheses. */
function splitArgs(s: string): string[] {
  if (s.trim() === '') return [];
  const out: string[] = [];
  let depth = 0;
  let quoted = false;
  let cur = '';
  for (const ch of s) {
    if (ch === '"') quoted = !quoted;
    if (!quoted) {
      if (ch === '(') depth++;
      if (ch === ')') depth--;
      if (ch === ',' && depth === 0) {
        out.push(cur);
        cur = '';
        continue;
      }
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((x) => x.trim());
}

function wildcardToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  return new RegExp(`^${escaped}$`, 'i');
}

class FormulaError extends Error {
  constructor(public code: string, public note?: string) {
    super(code);
  }
}

/**
 * Criteria may be a bare value or carry an operator prefix
 * (">100", "<>North"). Excel also allows wildcards.
 */
function matchesCriteria(cell: CellValue, criteria: CellValue): boolean {
  const raw = String(criteria ?? '').trim();
  const opMatch = raw.match(/^(<=|>=|<>|<|>|=)(.*)$/);

  if (opMatch) {
    const op = opMatch[1];
    const cellN = normalise(cell);
    const opN = normalise(opMatch[2].trim());

    if (op === '=') return cellN === opN;
    if (op === '<>') return cellN !== opN;

    const a = typeof cellN === 'number' ? cellN : NaN;
    const b = typeof opN === 'number' ? opN : NaN;
    if (isNaN(a) || isNaN(b)) return false;

    if (op === '<') return a < b;
    if (op === '>') return a > b;
    if (op === '<=') return a <= b;
    return a >= b;
  }

  if (raw.includes('*') || raw.includes('?')) {
    return wildcardToRegExp(raw).test(String(cell ?? ''));
  }
  return equal(cell, criteria);
}

// ---------------------------------------------------------------
// Expression parsing
// ---------------------------------------------------------------

interface Ctx {
  sheet: Sheet;
  cells: CellRef[];
}

function literal(s: string, ctx: Ctx): CellValue {
  const t = s.trim();
  if (t === '') return '';
  if (/^".*"$/.test(t)) return t.slice(1, -1).replace(/""/g, '"');
  if (/^TRUE$/i.test(t)) return true;
  if (/^FALSE$/i.test(t)) return false;

  const cellRef = parseCell(t);
  if (cellRef) {
    const { c, r } = cellRef;
    if (r >= 0 && r < ctx.sheet.rows.length) {
      ctx.cells.push({ c, r });
      return ctx.sheet.rows[r][c];
    }
    return null;
  }

  const n = parseFloat(t);
  return isNaN(n) ? t : n;
}

const COMPARATORS = ['<=', '>=', '<>', '=', '<', '>'];

function splitComparison(expr: string): [string, string, string] | null {
  let depth = 0;
  let quoted = false;
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === '"') quoted = !quoted;
    if (quoted) continue;
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (depth !== 0) continue;
    for (const op of COMPARATORS) {
      if (expr.startsWith(op, i)) return [expr.slice(0, i), op, expr.slice(i + op.length)];
    }
  }
  return null;
}

/** Right-to-left scan gives left-associativity for - and /. */
function splitArith(expr: string, ops: string[]): [string, string, string] | null {
  let depth = 0;
  let quoted = false;
  for (let i = expr.length - 1; i >= 0; i--) {
    const ch = expr[i];
    if (ch === '"') quoted = !quoted;
    if (quoted) continue;
    if (ch === ')') depth++;
    if (ch === '(') depth--;
    if (depth !== 0) continue;
    if (ops.includes(ch)) {
      if (i === 0) continue;
      const prev = expr[i - 1];
      if ('+-*/^&<>=('.includes(prev)) continue;
      return [expr.slice(0, i), ch, expr.slice(i + 1)];
    }
  }
  return null;
}

function isWrapped(t: string): boolean {
  if (!t.startsWith('(') || !t.endsWith(')')) return false;
  let depth = 0;
  for (let i = 0; i < t.length; i++) {
    if (t[i] === '(') depth++;
    if (t[i] === ')') depth--;
    if (depth === 0 && i < t.length - 1) return false;
  }
  return true;
}

function evaluateExpr(expr: string, ctx: Ctx): CellValue {
  const t = expr.trim();
  if (t === '') return '';

  if (isWrapped(t)) return evaluateExpr(t.slice(1, -1), ctx);

  const cmp = splitComparison(t);
  if (cmp) {
    const a = normalise(evaluateExpr(cmp[0], ctx));
    const b = normalise(evaluateExpr(cmp[2], ctx));
    switch (cmp[1]) {
      case '=': return a === b;
      case '<>': return a !== b;
      case '<': return (a as number) < (b as number);
      case '>': return (a as number) > (b as number);
      case '<=': return (a as number) <= (b as number);
      default: return (a as number) >= (b as number);
    }
  }

  const concat = splitArith(t, ['&']);
  if (concat) {
    const a = evaluateExpr(concat[0], ctx);
    const b = evaluateExpr(concat[2], ctx);
    return `${a ?? ''}${b ?? ''}`;
  }

  const addSub = splitArith(t, ['+', '-']);
  if (addSub) {
    const a = num(evaluateExpr(addSub[0], ctx));
    const b = num(evaluateExpr(addSub[2], ctx));
    return addSub[1] === '+' ? a + b : a - b;
  }

  const mulDiv = splitArith(t, ['*', '/']);
  if (mulDiv) {
    const a = num(evaluateExpr(mulDiv[0], ctx));
    const b = num(evaluateExpr(mulDiv[2], ctx));
    if (mulDiv[1] === '/') {
      if (b === 0) throw new FormulaError('#DIV/0!');
      return a / b;
    }
    return a * b;
  }

  if (t.startsWith('-')) return -num(evaluateExpr(t.slice(1), ctx));
  if (t.startsWith('+')) return evaluateExpr(t.slice(1), ctx);

  const fn = t.match(/^([A-Za-z][A-Za-z0-9_.]*)\s*\((.*)\)$/s);
  if (fn) return callFunction(fn[1].toUpperCase(), splitArgs(fn[2]), ctx);

  return literal(t, ctx);
}

// ---------------------------------------------------------------
// Date helpers — Excel serial dates
// ---------------------------------------------------------------

const EPOCH = Date.UTC(1899, 11, 30);
function fromSerial(n: number): Date {
  return new Date(EPOCH + n * 86400000);
}
function toSerial(d: Date): number {
  return Math.round((d.getTime() - EPOCH) / 86400000);
}

// ---------------------------------------------------------------
// Function library
// ---------------------------------------------------------------

function conditional(fn: string, rawArgs: string[], ctx: Ctx): CellValue {
  // SUMIF and AVERAGEIF take (range, criteria, [sum_range]) — the opposite
  // order to SUMIFS. Normalise to the plural form before processing.
  let args = rawArgs;
  if (fn === 'SUMIF' || fn === 'AVERAGEIF') {
    const sumRange = rawArgs.length > 2 ? rawArgs[2] : rawArgs[0];
    args = [sumRange, rawArgs[0], rawArgs[1]];
    fn = fn === 'SUMIF' ? 'SUMIFS' : 'AVERAGEIFS';
  }

  const isCount = fn === 'COUNTIFS' || fn === 'COUNTIF';
  const sumRange = isCount ? null : parseRange(args[0]);
  const sumValues = isCount ? null : rangeValues(ctx.sheet, sumRange);
  const start = isCount ? 0 : 1;

  if (!isCount && !sumValues) throw new FormulaError('#REF!');

  const firstCriteria = rangeValues(ctx.sheet, parseRange(args[start]));
  if (!firstCriteria) throw new FormulaError('#REF!');

  const n = sumValues ? sumValues.length : firstCriteria.length;
  if (sumValues && firstCriteria.length !== n) {
    throw new FormulaError('#VALUE!', 'ranges are different sizes');
  }

  const hits: number[] = [];
  for (let i = 0; i < n; i++) {
    let ok = true;
    for (let k = start; k < args.length; k += 2) {
      const cr = rangeValues(ctx.sheet, parseRange(args[k]));
      if (!cr || cr.length !== n) {
        throw new FormulaError('#VALUE!', 'ranges are different sizes');
      }
      const crit = evaluateExpr(args[k + 1], { sheet: ctx.sheet, cells: [] });
      if (!matchesCriteria(cr[i], crit)) {
        ok = false;
        break;
      }
    }
    if (ok) hits.push(i);
  }

  if (isCount) {
    const c = parseRange(args[0])?.c ?? 0;
    hits.forEach((r) => ctx.cells.push({ c, r }));
    return hits.length;
  }

  const c = sumRange!.c;
  hits.forEach((r) => ctx.cells.push({ c, r }));
  const total = hits.reduce((s, i) => s + num(sumValues![i]), 0);

  if (fn === 'SUMIFS' || fn === 'SUMIF') return total;
  if (fn === 'AVERAGEIFS' || fn === 'AVERAGEIF') {
    if (!hits.length) throw new FormulaError('#DIV/0!');
    return total / hits.length;
  }
  const vals = hits.map((i) => num(sumValues![i]));
  if (fn === 'MAXIFS') return vals.length ? Math.max(...vals) : 0;
  return vals.length ? Math.min(...vals) : 0;
}

function collectValues(args: string[], ctx: Ctx): CellValue[] {
  const out: CellValue[] = [];
  for (const a of args) {
    const rg = parseRange(a);
    if (rg) {
      const vs = rangeValues(ctx.sheet, rg);
      if (vs) {
        out.push(...vs);
        for (let i = 0; i < vs.length; i++) ctx.cells.push({ c: rg.c, r: i });
      }
    } else {
      out.push(evaluateExpr(a, ctx));
    }
  }
  return out;
}


/**
 * Evaluate an argument as an array of per-row values.
 *
 * A bare range yields its cells directly. Anything else is evaluated once per
 * row, with range references replaced by that row's single cell — except inside
 * a function that genuinely wants a whole range as an argument.
 *
 * That exception is what makes SUMPRODUCT(1/COUNTIFS(r,r)) work: COUNTIFS needs
 * its first argument to stay a range (the population being counted) while its
 * second becomes the current row's value (the thing being counted).
 */
const RANGE_RE = /\$?([A-Za-z])\$?(\d+):\$?([A-Za-z])\$?(\d+)/g;

/**
 * Which argument positions of a function must stay whole ranges.
 * Everything else in the call is substituted with the current row's cell.
 *
 * COUNTIFS is the interesting case: its ranges and criteria alternate, so the
 * range positions are the even indices and the criteria are the odd ones. That
 * is precisely what lets COUNTIFS(r, r) mean "count how many times this row's
 * value appears in the whole column".
 */
function rangeArgPositions(fn: string, argCount: number): Set<number> {
  const all = new Set<number>();
  for (let i = 0; i < argCount; i++) all.add(i);

  switch (fn) {
    case 'COUNTIFS':
    case 'COUNTIF':
      // range, criteria, range, criteria...
      return new Set([...all].filter((i) => i % 2 === 0));
    case 'SUMIFS':
    case 'AVERAGEIFS':
    case 'MAXIFS':
    case 'MINIFS':
      // sum_range, range, criteria, range, criteria...
      return new Set([...all].filter((i) => i === 0 || i % 2 === 1));
    case 'SUMIF':
    case 'AVERAGEIF':
      // range, criteria, [sum_range]
      return new Set([...all].filter((i) => i !== 1));
    case 'MATCH':
    case 'XLOOKUP':
    case 'VLOOKUP':
      // lookup_value is a value; the rest are ranges
      return new Set([...all].filter((i) => i !== 0));
    case 'INDEX':
      return new Set([0]);
    case 'TEXTJOIN':
      return new Set([...all].filter((i) => i >= 2));
    case 'SUM':
    case 'AVERAGE':
    case 'MAX':
    case 'MIN':
    case 'COUNT':
    case 'COUNTA':
      return all;
    default:
      return new Set();
  }
}

const RANGE_ARG_FUNCTIONS = new Set([
  'COUNTIFS', 'COUNTIF', 'SUMIFS', 'SUMIF', 'AVERAGEIFS', 'AVERAGEIF',
  'MAXIFS', 'MINIFS', 'SUM', 'AVERAGE', 'MAX', 'MIN', 'COUNT', 'COUNTA',
  'MATCH', 'INDEX', 'XLOOKUP', 'VLOOKUP', 'TEXTJOIN',
]);

function substituteRow(expr: string, offset: number): string {
  // Walk the expression once. Segments outside a protected call have their
  // ranges substituted immediately; protected calls are recursed into and then
  // emitted verbatim. Doing the substitution per segment rather than over the
  // finished string is what preserves the protection — a blanket replace at the
  // end would undo it.
  let out = '';
  let plain = '';
  let i = 0;

  const flushPlain = () => {
    out += plain.replace(RANGE_RE, (_whole, c1: string, r1: string) =>
      `${c1}${parseInt(r1, 10) + offset}`
    );
    plain = '';
  };

  while (i < expr.length) {
    const fnMatch = expr.slice(i).match(/^([A-Za-z][A-Za-z0-9_.]*)\s*\(/);
    const isProtected =
      fnMatch &&
      RANGE_ARG_FUNCTIONS.has(fnMatch[1].toUpperCase()) &&
      // Only treat it as a function name if what precedes it is not part of one.
      (i === 0 || !/[A-Za-z0-9_.]/.test(expr[i - 1]));

    if (isProtected && fnMatch) {
      flushPlain();
      const fnName = fnMatch[1].toUpperCase();
      const openAt = i + fnMatch[0].length - 1;
      let depth = 0;
      let close = expr.length - 1;
      for (let k = openAt; k < expr.length; k++) {
        if (expr[k] === '(') depth++;
        if (expr[k] === ')') {
          depth--;
          if (depth === 0) { close = k; break; }
        }
      }
      const rawArgs = splitArgs(expr.slice(openAt + 1, close));
      const keep = rangeArgPositions(fnName, rawArgs.length);
      const parts = rawArgs.map((arg, idx) =>
        keep.has(idx) && parseRange(arg.trim()) ? arg : substituteRow(arg, offset)
      );
      out += expr.slice(i, openAt + 1) + parts.join(',') + ')';
      i = close + 1;
      continue;
    }

    plain += expr[i];
    i++;
  }

  flushPlain();
  return out;
}

function evaluateArray(expr: string, ctx: Ctx): CellValue[] {
  const t = expr.trim();

  const direct = parseRange(t);
  if (direct) {
    const vs = rangeValues(ctx.sheet, direct);
    if (!vs) throw new FormulaError('#REF!');
    for (let i = 0; i < vs.length; i++) ctx.cells.push({ c: direct.c, r: i });
    return vs;
  }

  const refs = [...t.matchAll(RANGE_RE)].map((m) => m[0]);
  if (!refs.length) return [evaluateExpr(t, ctx)];

  const lengths = refs
    .map((r) => rangeValues(ctx.sheet, parseRange(r))?.length ?? 0)
    .filter((n) => n > 0);
  if (!lengths.length) throw new FormulaError('#REF!');
  const len = Math.max(...lengths);

  const out: CellValue[] = [];
  for (let i = 0; i < len; i++) {
    out.push(evaluateExpr(substituteRow(t, i), ctx));
  }
  return out;
}

function callFunction(fn: string, args: string[], ctx: Ctx): CellValue {
  const val = (i: number) => evaluateExpr(args[i] ?? '', ctx);
  const sheet = ctx.sheet;

  switch (fn) {
    // ---------- lookup ----------
    case 'XLOOKUP': {
      if (args.length < 3) throw new FormulaError('#VALUE!');
      const lookupValue = val(0);
      const lookupRange = parseRange(args[1]);
      const returnRange = parseRange(args[2]);
      const lookupArray = rangeValues(sheet, lookupRange);
      const returnArray = rangeValues(sheet, returnRange);
      if (!lookupArray || !returnArray || !lookupRange || !returnRange) {
        throw new FormulaError('#REF!');
      }
      if (lookupArray.length !== returnArray.length) {
        throw new FormulaError('#VALUE!', 'lookup_array and return_array are different sizes');
      }
      const ifNotFound = args.length > 3 ? val(3) : null;
      const matchMode = args.length > 4 ? num(val(4)) : 0;
      const searchMode = args.length > 5 ? num(val(5)) : 1;

      const order = [...lookupArray.keys()];
      if (searchMode === -1) order.reverse();
      const target = normalise(lookupValue);
      let idx = -1;

      if (matchMode === 0) {
        for (const i of order) if (equal(lookupArray[i], lookupValue)) { idx = i; break; }
      } else if (matchMode === -1 || matchMode === 1) {
        const wantSmaller = matchMode === -1;
        let best = wantSmaller ? -Infinity : Infinity;
        for (const i of order) {
          const v = normalise(lookupArray[i]);
          if (typeof v !== 'number' || typeof target !== 'number') continue;
          const fits = wantSmaller ? v <= target && v > best : v >= target && v < best;
          if (fits) { best = v; idx = i; }
        }
      } else if (matchMode === 2) {
        const rx = wildcardToRegExp(String(lookupValue));
        for (const i of order) if (rx.test(String(lookupArray[i]))) { idx = i; break; }
      }

      if (idx < 0) {
        if (ifNotFound !== null) return ifNotFound;
        throw new FormulaError('#N/A');
      }
      ctx.cells.push({ c: lookupRange.c, r: idx }, { c: returnRange.c, r: idx });
      return returnArray[idx];
    }

    case 'VLOOKUP': {
      if (args.length < 3) throw new FormulaError('#VALUE!');
      const lookupValue = val(0);
      const table = parseRange(args[1]);
      if (!table) throw new FormulaError('#REF!');
      const colNum = num(val(2));
      const approx = args.length > 3 ? truthy(val(3)) : true;
      const firstCol = rangeValues(sheet, { ...table, c2: table.c });
      if (!firstCol) throw new FormulaError('#REF!');
      const targetCol = table.c + colNum - 1;
      if (colNum < 1 || targetCol > table.c2) throw new FormulaError('#REF!');

      let idx = -1;
      if (!approx) {
        for (let i = 0; i < firstCol.length; i++) {
          if (equal(firstCol[i], lookupValue)) { idx = i; break; }
        }
      } else {
        const target = normalise(lookupValue);
        let best = -Infinity;
        for (let i = 0; i < firstCol.length; i++) {
          const v = normalise(firstCol[i]);
          if (typeof v !== 'number' || typeof target !== 'number') continue;
          if (v <= target && v > best) { best = v; idx = i; }
        }
      }
      if (idx < 0) throw new FormulaError('#N/A');
      const rowOffset = table.r1 - 2 + idx;
      ctx.cells.push({ c: table.c, r: rowOffset }, { c: targetCol, r: rowOffset });
      const row = sheet.rows[rowOffset];
      return row ? row[targetCol] : null;
    }

    case 'HLOOKUP':
      throw new FormulaError('#NAME?', 'HLOOKUP is not supported in this demo');

    case 'INDEX': {
      const rg = parseRange(args[0]);
      if (!rg) throw new FormulaError('#REF!');
      const rowNum = num(val(1));
      if (rowNum < 1) throw new FormulaError('#VALUE!');
      const colNum = args.length > 2 ? num(val(2)) : 1;
      const r = rg.r1 - 2 + rowNum - 1;
      const c = rg.c + colNum - 1;
      if (r < 0 || r >= sheet.rows.length || c > rg.c2) throw new FormulaError('#REF!');
      ctx.cells.push({ c, r });
      return sheet.rows[r][c];
    }

    case 'MATCH': {
      const lookupValue = val(0);
      const rg = parseRange(args[1]);
      const arr = rangeValues(sheet, rg);
      if (!arr || !rg) throw new FormulaError('#REF!');
      const type = args.length > 2 ? num(val(2)) : 1;
      const target = normalise(lookupValue);

      if (type === 0) {
        for (let i = 0; i < arr.length; i++) {
          if (equal(arr[i], lookupValue)) {
            ctx.cells.push({ c: rg.c, r: rg.r1 - 2 + i });
            return i + 1;
          }
        }
        throw new FormulaError('#N/A');
      }
      let idx = -1;
      let best = type === 1 ? -Infinity : Infinity;
      for (let i = 0; i < arr.length; i++) {
        const v = normalise(arr[i]);
        if (typeof v !== 'number' || typeof target !== 'number') continue;
        const fits = type === 1 ? v <= target && v > best : v >= target && v < best;
        if (fits) { best = v; idx = i; }
      }
      if (idx < 0) throw new FormulaError('#N/A');
      ctx.cells.push({ c: rg.c, r: rg.r1 - 2 + idx });
      return idx + 1;
    }

    // ---------- logical ----------
    case 'IF':
      return truthy(val(0))
        ? (args.length > 1 ? val(1) : true)
        : (args.length > 2 ? val(2) : false);

    case 'IFS': {
      for (let i = 0; i + 1 < args.length; i += 2) {
        if (truthy(val(i))) return val(i + 1);
      }
      throw new FormulaError('#N/A');
    }

    case 'SWITCH': {
      const target = val(0);
      for (let i = 1; i + 1 < args.length; i += 2) {
        if (equal(val(i), target)) return val(i + 1);
      }
      // odd trailing argument is the default
      return (args.length - 1) % 2 === 1 ? val(args.length - 1) : (() => {
        throw new FormulaError('#N/A');
      })();
    }

    case 'IFERROR':
    case 'IFNA': {
      try {
        return val(0);
      } catch {
        return val(1);
      }
    }

    case 'AND': {
      for (let i = 0; i < args.length; i++) if (!truthy(val(i))) return false;
      return true;
    }
    case 'OR': {
      for (let i = 0; i < args.length; i++) if (truthy(val(i))) return true;
      return false;
    }
    case 'NOT':
      return !truthy(val(0));

    // ---------- conditional aggregates ----------
    case 'SUMIF':
    case 'SUMIFS':
    case 'COUNTIF':
    case 'COUNTIFS':
    case 'AVERAGEIF':
    case 'AVERAGEIFS':
    case 'MAXIFS':
    case 'MINIFS':
      return conditional(fn, args, ctx);

    // ---------- aggregates ----------
    case 'SUM':
    case 'AVERAGE':
    case 'MAX':
    case 'MIN':
    case 'COUNT':
    case 'COUNTA':
    case 'COUNTBLANK': {
      const collected = collectValues(args, ctx);
      if (fn === 'COUNTA') return collected.filter((v) => v !== null && v !== '').length;
      if (fn === 'COUNTBLANK') return collected.filter((v) => v === null || v === '').length;
      const nums = collected
        .filter((v) => v !== null && v !== '' && !isNaN(parseFloat(String(v))))
        .map(num);
      if (fn === 'COUNT') return nums.length;
      if (!nums.length) return 0;
      const sum = nums.reduce((s, x) => s + x, 0);
      if (fn === 'SUM') return sum;
      if (fn === 'AVERAGE') return sum / nums.length;
      if (fn === 'MAX') return Math.max(...nums);
      return Math.min(...nums);
    }

    case 'SUMPRODUCT': {
      // Each argument may be a plain range or an expression over ranges, such as
      // (D2:D7="North")*B2:B7 or 1/COUNTIFS(B2:B7,B2:B7). Expressions are
      // evaluated once per row, which is how Excel's array semantics behave.
      const arrays = args.map((a) => evaluateArray(a, ctx));
      const len = Math.max(...arrays.map((a) => a.length));
      if (arrays.some((a) => a.length !== len && a.length !== 1)) {
        throw new FormulaError('#VALUE!', 'ranges are different sizes');
      }
      let total = 0;
      for (let i = 0; i < len; i++) {
        total += arrays.reduce((p, a) => p * num(a.length === 1 ? a[0] : a[i]), 1);
      }
      return total;
    }

    case 'ROUND':
    case 'ROUNDUP':
    case 'ROUNDDOWN': {
      const v = num(val(0));
      const digits = args.length > 1 ? num(val(1)) : 0;
      const f = Math.pow(10, digits);
      if (fn === 'ROUND') return Math.round(v * f) / f;
      const sign = v < 0 ? -1 : 1;
      if (fn === 'ROUNDUP') return (sign * Math.ceil(Math.abs(v) * f)) / f;
      return (sign * Math.floor(Math.abs(v) * f)) / f;
    }

    case 'ABS': return Math.abs(num(val(0)));
    case 'INT': return Math.floor(num(val(0)));
    case 'MOD': {
      const b = num(val(1));
      if (b === 0) throw new FormulaError('#DIV/0!');
      return num(val(0)) % b;
    }

    // ---------- text ----------
    case 'TEXTJOIN': {
      const delim = String(val(0) ?? '');
      const ignoreEmpty = truthy(val(1));
      const parts = collectValues(args.slice(2), ctx).map((v) => String(v ?? ''));
      return (ignoreEmpty ? parts.filter((p) => p !== '') : parts).join(delim);
    }

    case 'CONCAT':
    case 'CONCATENATE':
      return collectValues(args, ctx).map((v) => String(v ?? '')).join('');

    case 'LEFT': return String(val(0) ?? '').slice(0, args.length > 1 ? num(val(1)) : 1);
    case 'RIGHT': {
      const s = String(val(0) ?? '');
      const n = args.length > 1 ? num(val(1)) : 1;
      return n >= s.length ? s : s.slice(s.length - n);
    }
    case 'MID': {
      const s = String(val(0) ?? '');
      return s.substring(num(val(1)) - 1, num(val(1)) - 1 + num(val(2)));
    }
    case 'LEN': return String(val(0) ?? '').length;
    case 'TRIM': return String(val(0) ?? '').trim().replace(/\s+/g, ' ');
    case 'UPPER': return String(val(0) ?? '').toUpperCase();
    case 'LOWER': return String(val(0) ?? '').toLowerCase();
    case 'PROPER':
      return String(val(0) ?? '').toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());

    case 'SUBSTITUTE': {
      const s = String(val(0) ?? '');
      const find = String(val(1) ?? '');
      const rep = String(val(2) ?? '');
      if (find === '') return s;
      if (args.length > 3) {
        const nth = num(val(3));
        let count = 0;
        let pos = -1;
        let from = 0;
        while (count < nth) {
          pos = s.indexOf(find, from);
          if (pos === -1) return s;
          from = pos + find.length;
          count++;
        }
        return s.slice(0, pos) + rep + s.slice(pos + find.length);
      }
      return s.split(find).join(rep);
    }

    case 'FIND': {
      const idx = String(val(1) ?? '').indexOf(String(val(0) ?? ''));
      if (idx === -1) throw new FormulaError('#VALUE!');
      return idx + 1;
    }
    case 'SEARCH': {
      const idx = String(val(1) ?? '')
        .toLowerCase()
        .indexOf(String(val(0) ?? '').toLowerCase());
      if (idx === -1) throw new FormulaError('#VALUE!');
      return idx + 1;
    }
    case 'VALUE': {
      const n = parseFloat(String(val(0) ?? '').replace(/[^0-9.\-]/g, ''));
      if (isNaN(n)) throw new FormulaError('#VALUE!');
      return n;
    }

    // ---------- date ----------
    case 'DATE':
      return toSerial(new Date(Date.UTC(num(val(0)), num(val(1)) - 1, num(val(2)))));
    case 'YEAR': return fromSerial(num(val(0))).getUTCFullYear();
    case 'MONTH': return fromSerial(num(val(0))).getUTCMonth() + 1;
    case 'DAY': return fromSerial(num(val(0))).getUTCDate();
    case 'EOMONTH': {
      const d = fromSerial(num(val(0)));
      return toSerial(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + num(val(1)) + 1, 0)));
    }
    case 'EDATE': {
      const d = fromSerial(num(val(0)));
      return toSerial(
        new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + num(val(1)), d.getUTCDate()))
      );
    }
    case 'DATEDIF': {
      const a = fromSerial(num(val(0)));
      const b = fromSerial(num(val(1)));
      const unit = String(val(2) ?? 'd').toLowerCase();
      if (unit === 'd') return Math.round((b.getTime() - a.getTime()) / 86400000);
      let months =
        (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth());
      if (b.getUTCDate() < a.getUTCDate()) months--;
      if (unit === 'm') return months;
      if (unit === 'y') return Math.floor(months / 12);
      throw new FormulaError('#NUM!');
    }
    case 'NETWORKDAYS': {
      const a = fromSerial(num(val(0)));
      const b = fromSerial(num(val(1)));
      let count = 0;
      const cur = new Date(a.getTime());
      while (cur.getTime() <= b.getTime()) {
        const day = cur.getUTCDay();
        if (day !== 0 && day !== 6) count++;
        cur.setUTCDate(cur.getUTCDate() + 1);
      }
      return count;
    }
    case 'WEEKDAY': {
      const d = fromSerial(num(val(0)));
      return d.getUTCDay() + 1;
    }

    // ---------- information ----------
    case 'ISNUMBER': return typeof normalise(val(0)) === 'number';
    case 'ISTEXT': {
      const v = normalise(val(0));
      return typeof v === 'string' && v !== '';
    }
    case 'ISBLANK': {
      const v = val(0);
      return v === null || v === '';
    }
    case 'N': return num(val(0));

    default:
      throw new FormulaError('#NAME?', `This demo does not support ${fn}`);
  }
}

export function evaluate(sheet: Sheet, input: string): EvalResult {
  const f = String(input).trim();
  if (!f.startsWith('=')) {
    return { error: 'Formula must start with =', cells: [] };
  }

  const ctx: Ctx = { sheet, cells: [] };
  try {
    const value = evaluateExpr(f.slice(1), ctx);
    return { value, cells: ctx.cells };
  } catch (e) {
    if (e instanceof FormulaError) {
      return { error: e.code, note: e.note, cells: [] };
    }
    return { error: '#VALUE!', cells: [] };
  }
}

/** Excel stores dates as a serial count of days; render one as a readable date. */
export function formatDate(serial: number): string {
  const d = fromSerial(serial);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatValue(v: CellValue, money = false): string {
  if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
  if (typeof v !== 'number') return String(v ?? '');
  const rounded = Math.round(v * 100) / 100;
  return money
    ? rounded.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : rounded.toLocaleString('en-US', { maximumFractionDigits: 2 });
}
