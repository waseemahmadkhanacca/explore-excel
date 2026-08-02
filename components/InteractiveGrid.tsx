'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  evaluate,
  formatDate,
  formatValue,
  type CellValue,
  type Sheet,
} from '@/lib/formula-engine';

export interface Preset {
  label: string;
  formula: string;
}

interface Props {
  sheet: Sheet;
  initialFormula: string;
  fileName?: string;
  functionName?: string;
  hint?: string;
  presets?: Preset[];
}

export default function InteractiveGrid({
  sheet,
  initialFormula,
  fileName = 'Example.xlsx',
  functionName,
  hint = 'Edit any outlined cell or the formula above.',
  presets = [],
}: Props) {
  const [rows, setRows] = useState<CellValue[][]>(() =>
    sheet.rows.map((r) => [...r])
  );
  const [formula, setFormula] = useState(initialFormula);
  const [editing, setEditing] = useState<{ r: number; c: number } | null>(null);
  const [draft, setDraft] = useState('');
  const [flash, setFlash] = useState(0);
  const liveRef = useRef<HTMLSpanElement>(null);

  const editable = useMemo(() => new Set(sheet.editable ?? []), [sheet.editable]);
  const money = useMemo(() => new Set(sheet.money ?? []), [sheet.money]);
  const dates = useMemo(() => new Set(sheet.dates ?? []), [sheet.dates]);

  const result = useMemo(
    () => evaluate({ ...sheet, rows }, formula),
    [sheet, rows, formula]
  );

  const highlighted = useMemo(() => {
    const s = new Set<string>();
    result.cells.forEach((c) => s.add(`${c.r}:${c.c}`));
    return s;
  }, [result.cells]);

  const commitCell = useCallback(
    (r: number, c: number, raw: string) => {
      const n = parseFloat(raw);
      const next = rows.map((row) => [...row]);
      next[r][c] = raw.trim() !== '' && !isNaN(n) ? n : raw;
      setRows(next);
      setEditing(null);
      setFlash((f) => f + 1);
    },
    [rows]
  );

  const startEdit = (r: number, c: number) => {
    if (!editable.has(c)) return;
    setEditing({ r, c });
    setDraft(String(rows[r][c] ?? ''));
  };

  const applyPreset = (p: Preset) => {
    setFormula(p.formula);
    setFlash((f) => f + 1);
  };

  // How the result is displayed follows the formula, not the sheet: a count
  // should read "4", a currency total "42,130.00", and a date function a date.
  const display = (() => {
    if (result.error) return result.error;
    // FILTER, SORT and UNIQUE spill a column. Show every result, the way the
    // sheet would, rather than collapsing to the first one.
    if (result.spill) {
      const spillsMoney = money.size > 0 && result.spill.every((x) => typeof x === 'number');
      return result.spill.map((x) => formatValue(x, spillsMoney)).join('  ·  ');
    }
    const v = result.value ?? '';
    if (typeof v !== 'number') return formatValue(v);
    const fname = formula.replace(/^=\s*/, '').match(/^([A-Za-z]+)/)?.[1]?.toUpperCase() ?? '';
    if (['EOMONTH', 'EDATE', 'DATE'].includes(fname)) return formatDate(v);
    if (['COUNT', 'COUNTA', 'COUNTIF', 'COUNTIFS', 'COUNTBLANK', 'MATCH',
         'LEN', 'YEAR', 'MONTH', 'DAY', 'DATEDIF', 'NETWORKDAYS',
         'FIND', 'SEARCH', 'WEEKDAY'].includes(fname)) {
      return formatValue(v);
    }
    return formatValue(v, true);
  })();
  const footNote = result.note
    ? result.note
    : result.error
      ? `Excel would show ${result.error} here.`
      : hint;

  return (
    <div className="ee-grid">
      <div className="ee-grid__bar">
        <span className="ee-grid__file">{fileName}</span>
        <span className="ee-grid__live">
          <span className="ee-grid__pulse" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="ee-grid__fx">
        <span className="ee-grid__fxlabel" aria-hidden="true">
          fx
        </span>
        <input
          className="ee-grid__fxinput"
          value={formula}
          spellCheck={false}
          aria-label="Formula"
          onChange={(e) => setFormula(e.target.value)}
        />
      </div>

      <table className="ee-grid__table">
        <thead>
          <tr>
            <th className="ee-grid__rowhead" aria-label="Row numbers" />
            {sheet.columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="ee-grid__headerrow">
            <td className="ee-grid__rowhead">1</td>
            {sheet.headers.map((h) => (
              <td key={h}>{h}</td>
            ))}
          </tr>

          {rows.map((row, r) => (
            <tr key={r}>
              <td className="ee-grid__rowhead">{r + 2}</td>
              {row.map((v, c) => {
                const isEditing = editing?.r === r && editing?.c === c;
                const classes = [
                  typeof v === 'number' ? 'is-num' : '',
                  editable.has(c) ? 'is-editable' : '',
                  highlighted.has(`${r}:${c}`) ? 'is-selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <td
                    key={c}
                    className={classes}
                    onClick={() => startEdit(r, c)}
                    tabIndex={editable.has(c) ? 0 : -1}
                    onKeyDown={(e) => {
                      if (editable.has(c) && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        startEdit(r, c);
                      }
                    }}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        className="ee-grid__celledit"
                        value={draft}
                        aria-label={`Edit ${sheet.headers[c]} row ${r + 2}`}
                        onChange={(e) => setDraft(e.target.value)}
                        onBlur={() => commitCell(r, c, draft)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitCell(r, c, draft);
                          if (e.key === 'Escape') setEditing(null);
                        }}
                      />
                    ) : typeof v === 'number' ? (
                      dates.has(c) ? formatDate(v) : formatValue(v, money.has(c))
                    ) : (
                      v
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          <tr>
            <td className="ee-grid__rowhead" />
            <td colSpan={sheet.columns.length - 1} className="ee-grid__reslabel">
              Formula result
            </td>
            <td className="ee-grid__result is-num" key={flash}>
              <span ref={liveRef} aria-live="polite">
                {display}
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="ee-grid__foot">
        {functionName && <span className="ee-grid__tag">{functionName}</span>}
        <span className={result.error ? 'is-error' : undefined}>{footNote}</span>
      </div>

      {presets.length > 0 && (
        <div className="ee-grid__presets">
          <span className="ee-grid__presetlabel">Load an example:</span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={formula === p.formula ? 'is-active' : undefined}
              onClick={() => applyPreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
