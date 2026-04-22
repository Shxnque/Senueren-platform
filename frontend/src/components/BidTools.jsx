/**
 * SENRA Bid Tools — South African Contractor Decision Suite
 *
 * Four lightweight, pure-frontend tools for SA construction / facilities SMEs:
 *   1. BOQ Rough Estimator     — materials, labour, P&Gs, contingency, VAT
 *   2. Margin / Markup          — scenarios, break-even, VAT, retention
 *   3. Bid / No-Bid Viability   — weighted factors incl. cashflow + CIDB
 *   4. Past Decisions           — local history of viability verdicts
 *
 * All SA-specific:
 *   - ZAR currency, 15% VAT default
 *   - CIDB grade guidance
 *   - P&Gs / preliminaries and retention as first-class inputs
 *   - Cashflow risk factor (construction SMEs die from cashflow, not profit)
 *   - Travel / out-of-town factor
 *
 * No backend calls — everything runs in the browser. Inputs persist in
 * localStorage so a user can leave and come back without losing work.
 *
 * Rates are indicative 2025/26 SA market ranges. Meant as sanity-checks
 * before a proper estimator prices the job — NOT a replacement for Candy/CCS.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calculator, Scale, HardHat, ArrowRight, Info,
  ArrowLeft, AlertTriangle, CheckCircle2, XCircle, History,
  Copy, Check, Trash2, Plus, Minus,
} from "lucide-react";

const LS_KEY = "senra.bidtools.v2";
const VAT_RATE = 0.15;

const fmtZAR = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return "R " + Math.round(n).toLocaleString("en-ZA");
};
const pct = (n) => `${Math.round(n * 10) / 10}%`;

/* ── Indicative SA market rates (2025/26) ── */
// Each rate is low/high ZAR per unit. Editable at runtime by the user.
const DEFAULT_RATES = {
  concrete:   { label: "Concrete structural (supplied + poured)", unit: "m³", low: 1650, high: 2400 },
  paving:     { label: "Interlocking paving (material + lay)",    unit: "m²", low:  350, high:  520 },
  trenching:  { label: "Machine trenching (incl. backfill)",      unit: "m",  low:  120, high:  220 },
  brickwork:  { label: "Clay brick walling (single skin)",        unit: "m²", low:  520, high:  780 },
  roofing:    { label: "IBR sheet roofing (material + fit)",      unit: "m²", low:  420, high:  640 },
  plastering: { label: "Plaster + paint (interior, both sides)",  unit: "m²", low:  180, high:  280 },
  tiling:     { label: "Floor tiling (ceramic/porcelain)",        unit: "m²", low:  350, high:  620 },
  ceilings:   { label: "Suspended ceiling (T-grid + tiles)",      unit: "m²", low:  280, high:  440 },
  foundations:{ label: "Strip foundation (excavation + concrete)", unit: "m³", low: 1850, high: 2700 },
  electrical: { label: "Electrical rough-in (residential / light commercial)", unit: "point", low: 480, high: 820 },
  plumbing:   { label: "Plumbing rough-in (per fixture)",         unit: "fixture", low: 950, high: 1750 },
  windows:    { label: "Aluminium windows (supply + fit)",        unit: "m²", low:  950, high: 1650 },
};
const LABOUR_DAY = { low: 450, high: 850 }; // general labourer, ZAR/day

const defaultState = {
  boq: {
    quantities: Object.keys(DEFAULT_RATES).reduce((a, k) => ({ ...a, [k]: 0 }), {}),
    rates: {},  // only stores user *overrides*; fall through to DEFAULT_RATES
    labourers: 0, labourDays: 0,
    contingencyPct: 10, pgsPct: 12,
    includeVat: true,
  },
  margin: {
    cost: 0, overheadPct: 15, marginPct: 20, retentionPct: 0,
    includeVat: true,
  },
  bid: {
    fit: 5, location: 5, timeline: 5, effort: 5, value: 5, competition: 5,
    cashflow: 5, travel: 5, cidb: 5,
    weights: { fit: 2, cashflow: 2, value: 2 }, // default: these 3 count 2x
    tenderRef: "",
    notes: "",
  },
  history: [],
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      ...defaultState,
      ...parsed,
      boq: { ...defaultState.boq, ...(parsed.boq || {}),
             quantities: { ...defaultState.boq.quantities, ...((parsed.boq || {}).quantities || {}) },
             rates: { ...((parsed.boq || {}).rates || {}) } },
      margin: { ...defaultState.margin, ...(parsed.margin || {}) },
      bid: { ...defaultState.bid, ...(parsed.bid || {}),
             weights: { ...defaultState.bid.weights, ...((parsed.bid || {}).weights || {}) } },
      history: parsed.history || [],
    };
  } catch {
    return defaultState;
  }
};

const rateFor = (key, rates) => rates[key] || DEFAULT_RATES[key];

/* ── Copy helper ── */
const CopyButton = ({ text, label = "Copy summary", testid }) => {
  const [ok, setOk] = useState(false);
  const onClick = () => {
    try {
      navigator.clipboard.writeText(text);
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    } catch (_) { /* silent */ }
  };
  return (
    <button onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A2332] hover:bg-[#243049] text-[#E8EDF2] rounded-full text-xs font-bold border border-[#2A3A54] transition-all"
      data-testid={testid}>
      {ok ? <><Check size={12} className="text-[#00FFD4]"/>Copied</> : <><Copy size={12}/>{label}</>}
    </button>
  );
};


/* ── Tool 1: BOQ Rough Estimator (SA edition) ── */
const BOQEstimator = ({ state, setState }) => {
  const b = state.boq;
  const setB = (patch) => setState({ ...state, boq: { ...b, ...patch } });
  const setQty = (k, v) => setB({ quantities: { ...b.quantities, [k]: v } });
  const setRate = (k, bound, v) => {
    const cur = b.rates[k] || {};
    setB({ rates: { ...b.rates, [k]: { ...cur, [bound]: Number(v) || 0 } } });
  };
  const resetRate = (k) => {
    const next = { ...b.rates };
    delete next[k];
    setB({ rates: next });
  };
  const n = (v) => Number(v) || 0;

  // Calculate materials
  let matLow = 0, matHigh = 0;
  Object.keys(DEFAULT_RATES).forEach((key) => {
    const qty = n(b.quantities[key]);
    if (qty <= 0) return;
    const r = rateFor(key, b.rates);
    matLow += qty * r.low;
    matHigh += qty * r.high;
  });
  // Labour
  const labourTotal = n(b.labourers) * n(b.labourDays);
  const labLow = labourTotal * LABOUR_DAY.low;
  const labHigh = labourTotal * LABOUR_DAY.high;
  // Direct cost
  const directLow = matLow + labLow;
  const directHigh = matHigh + labHigh;
  // P&Gs (preliminaries & generals)
  const pgsLow  = directLow  * (n(b.pgsPct) / 100);
  const pgsHigh = directHigh * (n(b.pgsPct) / 100);
  const subLow = directLow + pgsLow;
  const subHigh = directHigh + pgsHigh;
  // Contingency
  const contLow  = subLow  * (n(b.contingencyPct) / 100);
  const contHigh = subHigh * (n(b.contingencyPct) / 100);
  const preVatLow = subLow + contLow;
  const preVatHigh = subHigh + contHigh;
  // VAT
  const vatLow  = b.includeVat ? preVatLow  * VAT_RATE : 0;
  const vatHigh = b.includeVat ? preVatHigh * VAT_RATE : 0;
  const totalLow = preVatLow + vatLow;
  const totalHigh = preVatHigh + vatHigh;
  // Labour vs material split (using midpoints)
  const matMid = (matLow + matHigh) / 2;
  const labMid = (labLow + labHigh) / 2;
  const directMid = matMid + labMid || 1;
  const matPct = (matMid / directMid) * 100;
  const labPct = (labMid / directMid) * 100;

  const summary = (() => {
    const line = (lbl, v) => `${lbl}: ${fmtZAR(v)}`;
    const items = Object.keys(DEFAULT_RATES)
      .filter(k => n(b.quantities[k]) > 0)
      .map(k => `  - ${DEFAULT_RATES[k].label}: ${b.quantities[k]} ${DEFAULT_RATES[k].unit}`);
    return [
      "SENRA BOQ Rough Estimate",
      "",
      "Scope items:",
      ...(items.length ? items : ["  (none entered)"]),
      labourTotal ? `  - Labour: ${b.labourers} labourers × ${b.labourDays} days` : "",
      "",
      `Materials:  ${fmtZAR(matLow)} – ${fmtZAR(matHigh)}`,
      `Labour:     ${fmtZAR(labLow)} – ${fmtZAR(labHigh)}`,
      line("Direct cost", (directLow + directHigh)/2),
      `P&Gs (${b.pgsPct}%):    ${fmtZAR(pgsLow)} – ${fmtZAR(pgsHigh)}`,
      `Contingency (${b.contingencyPct}%): ${fmtZAR(contLow)} – ${fmtZAR(contHigh)}`,
      b.includeVat ? `VAT (15%):  ${fmtZAR(vatLow)} – ${fmtZAR(vatHigh)}` : "VAT: excluded",
      "",
      `TOTAL (${b.includeVat ? "incl. VAT" : "ex VAT"}):  ${fmtZAR(totalLow)} – ${fmtZAR(totalHigh)}`,
      "",
      `Labour/material split: ${Math.round(labPct)}% labour · ${Math.round(matPct)}% material`,
      "",
      "— Indicative only. Not a quote.",
    ].filter(Boolean).join("\n");
  })();

  return (
    <div data-testid="tool-boq">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Quick SA market sanity check — not a replacement for a priced BOQ.
          Rates are editable per line (click "override"). Output includes P&amp;Gs,
          contingency, and 15% VAT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {Object.entries(DEFAULT_RATES).map(([key, def]) => {
          const r = rateFor(key, b.rates);
          const isOverridden = !!b.rates[key];
          return (
            <div key={key} className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">{def.label}</span>
                  <p className="text-[10px] text-[#8B9BB4] mt-0.5">
                    R{r.low}–R{r.high} per {def.unit}
                    {isOverridden && <span className="text-[#4A9FD8]"> (custom)</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input type="number" min="0" step="1"
                  value={b.quantities[key] || ""}
                  onChange={(e) => setQty(key, e.target.value)}
                  placeholder="0"
                  className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
                  data-testid={`boq-input-${key}`}
                />
                <span className="text-xs text-[#8B9BB4] w-14">{def.unit}</span>
              </div>
              <details className="mt-2">
                <summary className="text-[10px] text-[#8B9BB4] cursor-pointer hover:text-[#00FFD4]">
                  {isOverridden ? "Adjust rate (overridden)" : "Override rate"}
                </summary>
                <div className="flex items-center gap-2 mt-2">
                  <input type="number" placeholder={`low R${def.low}`}
                    defaultValue={b.rates[key]?.low || ""}
                    onBlur={(e) => e.target.value && setRate(key, "low", e.target.value)}
                    className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-2 py-1 text-xs text-white"
                    data-testid={`boq-rate-low-${key}`} />
                  <input type="number" placeholder={`high R${def.high}`}
                    defaultValue={b.rates[key]?.high || ""}
                    onBlur={(e) => e.target.value && setRate(key, "high", e.target.value)}
                    className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-2 py-1 text-xs text-white"
                    data-testid={`boq-rate-high-${key}`} />
                  {isOverridden && (
                    <button onClick={() => resetRate(key)} title="Reset to default"
                      className="text-[10px] text-[#8B9BB4] hover:text-red-400"
                      data-testid={`boq-rate-reset-${key}`}>reset</button>
                  )}
                </div>
              </details>
            </div>
          );
        })}

        <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 md:col-span-2">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">General Labour</span>
          <p className="text-[10px] text-[#8B9BB4] mt-0.5">R{LABOUR_DAY.low}–R{LABOUR_DAY.high} per labourer per day</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input type="number" min="0" value={b.labourers || ""}
              onChange={(e) => setB({ labourers: Number(e.target.value) || 0 })}
              placeholder="0 labourers"
              className="bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
              data-testid="boq-labourers" />
            <input type="number" min="0" value={b.labourDays || ""}
              onChange={(e) => setB({ labourDays: Number(e.target.value) || 0 })}
              placeholder="0 days"
              className="bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
              data-testid="boq-labour-days" />
          </div>
        </div>
      </div>

      {/* Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">P&amp;Gs (Preliminaries)</span>
          <div className="flex items-center gap-2 mt-2">
            <input type="number" min="0" max="40" value={b.pgsPct}
              onChange={(e) => setB({ pgsPct: Number(e.target.value) || 0 })}
              className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
              data-testid="boq-pgs" />
            <span className="text-xs text-[#8B9BB4]">%</span>
          </div>
          <p className="text-[10px] text-[#8B9BB4] mt-1">Site setup, supervision, plant hire. 8–15% typical.</p>
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Contingency</span>
          <div className="flex items-center gap-2 mt-2">
            <input type="number" min="0" max="30" value={b.contingencyPct}
              onChange={(e) => setB({ contingencyPct: Number(e.target.value) || 0 })}
              className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
              data-testid="boq-contingency" />
            <span className="text-xs text-[#8B9BB4]">%</span>
          </div>
          <p className="text-[10px] text-[#8B9BB4] mt-1">Unknowns, variations. 5–15% typical.</p>
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">VAT (15%)</span>
          <button type="button"
            onClick={() => setB({ includeVat: !b.includeVat })}
            className={`mt-2 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-bold border transition-all ${
              b.includeVat ? "bg-[#00FFD4]/10 text-[#00FFD4] border-[#00FFD4]/50" : "bg-[#0F1419] text-[#8B9BB4] border-[#1A2332]"
            }`}
            data-testid="boq-vat-toggle">
            {b.includeVat ? "Including VAT" : "Excluding VAT"}
          </button>
          <p className="text-[10px] text-[#8B9BB4] mt-1">SA standard rate 15%. Required for VAT-registered bidders.</p>
        </label>
      </div>

      {/* Output */}
      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6" data-testid="boq-output">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <div>
            <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">
              Quote Range {b.includeVat ? "(incl. VAT)" : "(ex VAT)"}
            </span>
            <div className="flex items-baseline gap-3 mt-1 flex-wrap">
              <span className="text-3xl font-bold text-white font-['Outfit']" data-testid="boq-total-low">{fmtZAR(totalLow)}</span>
              <span className="text-[#8B9BB4]">to</span>
              <span className="text-3xl font-bold text-white font-['Outfit']" data-testid="boq-total-high">{fmtZAR(totalHigh)}</span>
            </div>
          </div>
          <CopyButton text={summary} testid="boq-copy-summary" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5 text-xs">
          <div><p className="text-[#8B9BB4]">Materials</p><p className="text-white font-bold mt-0.5">{fmtZAR(matLow)} – {fmtZAR(matHigh)}</p></div>
          <div><p className="text-[#8B9BB4]">Labour</p><p className="text-white font-bold mt-0.5">{fmtZAR(labLow)} – {fmtZAR(labHigh)}</p></div>
          <div><p className="text-[#8B9BB4]">Direct (mid)</p><p className="text-white font-bold mt-0.5">{fmtZAR(directMid)}</p></div>
          <div><p className="text-[#8B9BB4]">P&amp;Gs ({b.pgsPct}%)</p><p className="text-white font-bold mt-0.5">{fmtZAR(pgsLow)} – {fmtZAR(pgsHigh)}</p></div>
          <div><p className="text-[#8B9BB4]">Contingency ({b.contingencyPct}%)</p><p className="text-white font-bold mt-0.5">{fmtZAR(contLow)} – {fmtZAR(contHigh)}</p></div>
          {b.includeVat && <div><p className="text-[#8B9BB4]">VAT (15%)</p><p className="text-white font-bold mt-0.5">{fmtZAR(vatLow)} – {fmtZAR(vatHigh)}</p></div>}
        </div>

        {/* Labour / Material / Plant split */}
        <div className="mt-5 pt-4 border-t border-[#1A2332]">
          <p className="text-[10px] text-[#8B9BB4] uppercase tracking-wider font-bold mb-2">Cost split</p>
          <div className="flex h-2 w-full rounded-full overflow-hidden bg-[#0A0E17]">
            <div className="h-full bg-[#00FFD4]" style={{ width: `${labPct}%` }} title={`Labour ${Math.round(labPct)}%`} />
            <div className="h-full bg-[#4A9FD8]" style={{ width: `${matPct}%` }} title={`Materials ${Math.round(matPct)}%`} />
          </div>
          <div className="flex gap-4 mt-2 text-[10px] text-[#8B9BB4]">
            <span><span className="inline-block w-2 h-2 bg-[#00FFD4] rounded-full mr-1"></span>Labour {pct(labPct)}</span>
            <span><span className="inline-block w-2 h-2 bg-[#4A9FD8] rounded-full mr-1"></span>Materials {pct(matPct)}</span>
          </div>
        </div>

        <p className="text-[10px] text-[#8B9BB4] mt-4 leading-relaxed">
          Excludes: site establishment fees, bonds, insurance premiums, specialist
          subcontractors, escalation. Always verify against a real priced BOQ.
        </p>
      </div>
    </div>
  );
};


/* ── Tool 2: Margin / Markup Calculator (SA edition) ── */
const MarginCalc = ({ state, setState }) => {
  const m = state.margin;
  const setM = (patch) => setState({ ...state, margin: { ...m, ...patch } });
  const n = (v) => Number(v) || 0;

  const cost = n(m.cost);
  const overhead = cost * (n(m.overheadPct) / 100);
  const totalCost = cost + overhead;

  // Scenarios — quote at 15, 20, 25% margin (on sell price)
  const scenarioFor = (mpct) => {
    const quote = mpct < 100 ? totalCost / (1 - mpct / 100) : 0;
    const profit = quote - totalCost;
    const vat = m.includeVat ? quote * VAT_RATE : 0;
    const quoteVat = quote + vat;
    const retention = quoteVat * (n(m.retentionPct) / 100);
    const cashOnDelivery = quoteVat - retention;
    // Break-even discount: how much % off can we go before profit = 0?
    const breakEven = totalCost && quote ? ((quote - totalCost) / quote) * 100 : 0;
    return { mpct, quote, quoteVat, profit, vat, retention, cashOnDelivery, breakEven };
  };
  const target = scenarioFor(n(m.marginPct));
  const scenarios = [15, 20, 25, 30].map(scenarioFor);

  return (
    <div data-testid="tool-margin">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Enter your <span className="text-white">direct cost</span>. We add overhead, apply target margin,
          add VAT, and subtract retention to show what actually lands in your bank account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Direct Cost (ZAR)</span>
          <input type="number" min="0" value={m.cost || ""}
            onChange={(e) => setM({ cost: Number(e.target.value) || 0 })}
            placeholder="e.g. 250000"
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-cost" />
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Overhead %</span>
          <input type="number" min="0" max="100" value={m.overheadPct}
            onChange={(e) => setM({ overheadPct: Number(e.target.value) || 0 })}
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-overhead" />
          <p className="text-[10px] text-[#8B9BB4] mt-1">15% typical.</p>
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Target Margin %</span>
          <input type="number" min="0" max="90" value={m.marginPct}
            onChange={(e) => setM({ marginPct: Number(e.target.value) || 0 })}
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-pct" />
          <p className="text-[10px] text-[#8B9BB4] mt-1">On sell price. 15–25% civils.</p>
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Retention %</span>
          <input type="number" min="0" max="20" value={m.retentionPct}
            onChange={(e) => setM({ retentionPct: Number(e.target.value) || 0 })}
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-retention" />
          <p className="text-[10px] text-[#8B9BB4] mt-1">5–10% typical (held 6–12 months).</p>
        </label>
      </div>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <button type="button"
          onClick={() => setM({ includeVat: !m.includeVat })}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
            m.includeVat ? "bg-[#00FFD4]/10 text-[#00FFD4] border-[#00FFD4]/50" : "bg-[#0F1419] text-[#8B9BB4] border-[#1A2332]"
          }`}
          data-testid="margin-vat-toggle">
          {m.includeVat ? "Prices incl. VAT (15%)" : "Prices ex VAT"}
        </button>
      </div>

      {/* Target scenario — the big number */}
      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6 mb-5" data-testid="margin-output">
        <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Your quote price (at {m.marginPct}% margin)</span>
        <div className="text-3xl font-bold text-white font-['Outfit'] mt-2" data-testid="margin-quote">
          {fmtZAR(m.includeVat ? target.quoteVat : target.quote)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 text-xs">
          <div><p className="text-[#8B9BB4]">Direct cost</p><p className="text-white font-bold mt-0.5">{fmtZAR(cost)}</p></div>
          <div><p className="text-[#8B9BB4]">Overhead</p><p className="text-white font-bold mt-0.5">{fmtZAR(overhead)}</p></div>
          <div><p className="text-[#8B9BB4]">Profit</p><p className="text-[#00FFD4] font-bold mt-0.5" data-testid="margin-profit">{fmtZAR(target.profit)}</p></div>
          {m.includeVat && <div><p className="text-[#8B9BB4]">VAT (15%)</p><p className="text-white font-bold mt-0.5">{fmtZAR(target.vat)}</p></div>}
          {n(m.retentionPct) > 0 && <div><p className="text-[#8B9BB4]">Retention held</p><p className="text-yellow-400 font-bold mt-0.5">{fmtZAR(target.retention)}</p></div>}
        </div>
        {n(m.retentionPct) > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1A2332] text-xs">
            <p className="text-[#8B9BB4]">Cash you actually see at completion:
              <span className="text-white font-bold ml-2" data-testid="margin-cash">{fmtZAR(target.cashOnDelivery)}</span>
            </p>
            <p className="text-[10px] text-yellow-400 mt-1 flex items-center gap-1">
              <AlertTriangle size={11}/>
              {fmtZAR(target.retention)} held for typically 6–12 months — factor this into cashflow.
            </p>
          </div>
        )}
      </div>

      {/* Break-even */}
      <div className="bg-[#0F1419] border border-[#1A2332] rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Break-even discount</span>
            <p className="text-[11px] text-[#8B9BB4] mt-0.5">Max % you can discount your quote before profit hits zero</p>
          </div>
          <span className="text-2xl font-bold text-yellow-400 font-['Outfit']" data-testid="margin-break-even">
            {pct(target.breakEven)}
          </span>
        </div>
      </div>

      {/* Scenario comparison */}
      <div className="bg-[#0F1419] border border-[#1A2332] rounded-xl p-5">
        <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Scenario comparison</span>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-xs" data-testid="margin-scenarios">
            <thead>
              <tr className="text-[#8B9BB4] text-left border-b border-[#1A2332]">
                <th className="py-2 pr-3">Margin</th>
                <th className="py-2 pr-3">Quote ({m.includeVat ? "incl VAT" : "ex VAT"})</th>
                <th className="py-2 pr-3">Profit</th>
                <th className="py-2">Break-even</th>
              </tr>
            </thead>
            <tbody>
              {scenarios.map((s) => (
                <tr key={s.mpct} className={`border-b border-[#1A2332] ${s.mpct === n(m.marginPct) ? "bg-[#00FFD4]/5" : ""}`}>
                  <td className="py-2 pr-3 text-white font-bold">{s.mpct}%</td>
                  <td className="py-2 pr-3 text-white">{fmtZAR(m.includeVat ? s.quoteVat : s.quote)}</td>
                  <td className="py-2 pr-3 text-[#00FFD4]">{fmtZAR(s.profit)}</td>
                  <td className="py-2 text-yellow-400">{pct(s.breakEven)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


/* ── Tool 3: Bid / No-Bid Viability (SA edition, weighted) ── */
const FACTORS = [
  { key: "fit",         label: "Industry fit",           help: "How closely does your core work match the scope?" },
  { key: "value",       label: "Contract value",         help: "Is the size worth chasing relative to your team?" },
  { key: "cashflow",    label: "Cashflow resilience",    help: "Can your business float 30–60 days of site costs?" },
  { key: "cidb",        label: "CIDB grade fit",         help: "Do you have the required CIDB grade (or the joint venture to bridge it)?" },
  { key: "timeline",    label: "Timeline feasibility",   help: "Can you realistically mobilise in the required timeframe?" },
  { key: "effort",      label: "Low prep effort",        help: "Inverse — low effort = high score. Massive RFPs score lower." },
  { key: "competition", label: "Competitive position",   help: "Strong prior experience / relationships = higher score." },
  { key: "travel",      label: "Location / travel",      help: "Local = 10. Same province = 7. Out of province = 3." },
  { key: "location",    label: "Site access",            help: "Known geography, access routes, local labour availability." },
];

const ViabilityScore = ({ state, setState }) => {
  const b = state.bid;
  const setB = (patch) => setState({ ...state, bid: { ...b, ...patch } });
  const setF = (k, v) => setB({ [k]: Number(v) });
  const toggleWeight = (k) => {
    const w = { ...b.weights, [k]: (b.weights[k] === 2 ? 1 : 2) };
    setB({ weights: w });
  };

  // Weighted score
  const weightedTotal = FACTORS.reduce((sum, f) => sum + (Number(b[f.key]) || 0) * (b.weights[f.key] || 1), 0);
  const maxTotal = FACTORS.reduce((sum, f) => sum + 10 * (b.weights[f.key] || 1), 0);
  const pctScore = Math.round((weightedTotal / maxTotal) * 100);

  // Risk detection
  const risks = [];
  if (Number(b.cashflow) <= 4) risks.push({ kind: "cashflow", msg: "Cashflow risk is high — this job could strangle your operations even if profitable." });
  if (Number(b.cidb) <= 4) risks.push({ kind: "cidb", msg: "CIDB grade mismatch — consider joint venture or skip." });
  if (Number(b.travel) <= 3) risks.push({ kind: "travel", msg: "Out-of-province travel cost will erode margin fast." });
  if (Number(b.effort) <= 4 && Number(b.value) <= 5) risks.push({ kind: "effort", msg: "High prep effort for modest value — opportunity cost on other bids." });

  const verdict = pctScore >= 70 ? "BID" : pctScore >= 50 ? "CONSIDER" : "PASS";
  const vColor = verdict === "BID" ? "text-[#00FFD4] border-[#00FFD4]/40 bg-[#00FFD4]/10"
    : verdict === "CONSIDER" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
    : "text-red-400 border-red-500/40 bg-red-500/10";
  const vIcon = verdict === "BID" ? <CheckCircle2 size={18}/> : verdict === "CONSIDER" ? <AlertTriangle size={18}/> : <XCircle size={18}/>;

  const saveVerdict = () => {
    const entry = {
      id: Date.now(),
      savedAt: new Date().toISOString(),
      tenderRef: b.tenderRef || "(no reference)",
      notes: b.notes || "",
      score: pctScore,
      verdict,
      snapshot: FACTORS.reduce((a, f) => ({ ...a, [f.key]: Number(b[f.key]) }), {}),
      risks: risks.map(r => r.msg),
    };
    const next = [entry, ...(state.history || [])].slice(0, 50);
    setState({ ...state, history: next });
  };

  return (
    <div data-testid="tool-viability">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Rate each factor 1–10. Mark factors <span className="text-white">2×</span> to double their weight.
          Cashflow, CIDB fit, and industry fit default to 2× — that's where most SA contractors die.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {FACTORS.map((f) => {
          const w = b.weights[f.key] || 1;
          return (
            <div key={f.key} className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4" data-testid={`viability-factor-${f.key}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] text-white font-bold uppercase tracking-wider">{f.label}</span>
                  <p className="text-[10px] text-[#8B9BB4] mt-0.5 leading-relaxed">{f.help}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleWeight(f.key)}
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition-all ${
                      w === 2 ? "text-[#00FFD4] border-[#00FFD4]/50 bg-[#00FFD4]/10" : "text-[#8B9BB4] border-[#1A2332]"
                    }`}
                    title="Toggle 2× weight"
                    data-testid={`viability-weight-${f.key}`}>
                    {w === 2 ? "2×" : "1×"}
                  </button>
                  <span className="text-lg font-bold text-[#00FFD4] font-['Outfit'] min-w-[3em] text-right" data-testid={`viability-value-${f.key}`}>{b[f.key]}/10</span>
                </div>
              </div>
              <input type="range" min="1" max="10" step="1" value={b[f.key]}
                onChange={(e) => setF(f.key, e.target.value)}
                className="w-full accent-[#00FFD4]"
                data-testid={`viability-slider-${f.key}`} />
            </div>
          );
        })}
      </div>

      {/* Tender metadata for the saved record */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Tender reference</span>
          <input type="text" value={b.tenderRef}
            onChange={(e) => setB({ tenderRef: e.target.value })}
            placeholder="e.g. SANRAL/ROAD/2026/022"
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="viability-ref" />
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Internal notes</span>
          <input type="text" value={b.notes}
            onChange={(e) => setB({ notes: e.target.value })}
            placeholder="Anything worth remembering"
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="viability-notes" />
        </label>
      </div>

      {/* Output */}
      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6" data-testid="viability-output">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Viability Score (weighted)</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-white font-['Outfit']" data-testid="viability-score">{pctScore}</span>
              <span className="text-lg text-[#8B9BB4]">/ 100</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${vColor}`} data-testid="viability-verdict">
            {vIcon}
            {verdict === "BID" ? "Bid it" : verdict === "CONSIDER" ? "Consider carefully" : "Pass on this one"}
          </span>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-[#0A0E17] overflow-hidden">
          <div className="h-full transition-all duration-500 rounded-full"
               style={{ width: `${pctScore}%`, backgroundColor: verdict === "BID" ? "#00FFD4" : verdict === "CONSIDER" ? "#eab308" : "#f87171" }} />
        </div>

        {/* Risk flags */}
        {risks.length > 0 && (
          <div className="mt-5 space-y-2" data-testid="viability-risks">
            <p className="text-[10px] text-yellow-400 uppercase tracking-wider font-bold">Risk flags</p>
            {risks.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-[#E8EDF2] bg-yellow-500/5 border border-yellow-500/20 rounded-md p-2.5">
                <AlertTriangle size={13} className="text-yellow-400 mt-0.5 flex-shrink-0"/>
                <span>{r.msg}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button onClick={saveVerdict}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold text-xs hover:shadow-[0_0_20px_rgba(0,255,212,0.3)] transition-all"
            data-testid="viability-save">
            <Plus size={12}/> Save this decision
          </button>
          <p className="text-[11px] text-[#8B9BB4]">Saved to <em>Past decisions</em> — stays on this device only.</p>
        </div>
      </div>
    </div>
  );
};


/* ── Tool 4: Past Decisions ── */
const PastDecisions = ({ state, setState }) => {
  const remove = (id) => setState({ ...state, history: state.history.filter(e => e.id !== id) });
  const clear = () => { if (window.confirm("Clear all saved decisions?")) setState({ ...state, history: [] }); };
  const h = state.history || [];

  const exportText = h.map(e =>
    `[${e.verdict}] ${e.tenderRef} — ${e.score}/100 (${e.savedAt.slice(0,10)})\n${e.notes ? `  notes: ${e.notes}\n` : ""}${e.risks?.length ? `  risks: ${e.risks.join("; ")}\n` : ""}`
  ).join("\n");

  const vColor = (v) => v === "BID" ? "text-[#00FFD4] border-[#00FFD4]/40 bg-[#00FFD4]/10"
    : v === "CONSIDER" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
    : "text-red-400 border-red-500/40 bg-red-500/10";

  return (
    <div data-testid="tool-history">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Your last 50 bid/no-bid verdicts. Local to this device — nothing
          leaves your browser. Use to track what you chased vs. what you won.
        </p>
      </div>

      {h.length === 0 ? (
        <div className="bg-[#0A0E17] border border-[#1A2332] rounded-xl p-10 text-center">
          <History size={36} className="text-[#8B9BB4] mx-auto mb-3 opacity-50"/>
          <p className="text-sm text-[#8B9BB4]">No saved decisions yet. Run the Bid / No-Bid tool then click "Save this decision".</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-xs text-[#8B9BB4]">{h.length} decision{h.length === 1 ? "" : "s"} saved</p>
            <div className="flex items-center gap-2">
              <CopyButton text={exportText} label="Copy list" testid="history-copy" />
              <button onClick={clear} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-full transition-all" data-testid="history-clear">
                <Trash2 size={11}/> Clear all
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {h.map(e => (
              <div key={e.id} className="bg-[#0A0E17] border border-[#1A2332] rounded-xl p-4" data-testid={`history-entry-${e.id}`}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${vColor(e.verdict)}`}>{e.verdict}</span>
                      <span className="text-sm text-white font-bold font-['Outfit']">{e.score}/100</span>
                      <span className="text-xs text-[#8B9BB4]">{e.tenderRef}</span>
                    </div>
                    {e.notes && <p className="text-xs text-[#E8EDF2] mt-2">{e.notes}</p>}
                    {e.risks?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {e.risks.map((r, i) => <li key={i} className="text-[11px] text-yellow-400/90 flex items-start gap-1"><AlertTriangle size={10} className="mt-0.5 flex-shrink-0"/>{r}</li>)}
                      </ul>
                    )}
                    <p className="text-[10px] text-[#8B9BB4]/70 mt-2">{new Date(e.savedAt).toLocaleString("en-ZA")}</p>
                  </div>
                  <button onClick={() => remove(e.id)} className="text-[#8B9BB4] hover:text-red-400 flex-shrink-0" title="Delete" data-testid={`history-delete-${e.id}`}>
                    <Minus size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


/* ── Main Bid Tools Page ── */

const TABS = [
  { id: "boq",       label: "BOQ Estimator",    icon: <HardHat size={14} /> },
  { id: "margin",    label: "Margin Calculator", icon: <Calculator size={14} /> },
  { id: "viability", label: "Bid / No-Bid",     icon: <Scale size={14} /> },
  { id: "history",   label: "Past Decisions",   icon: <History size={14} /> },
];

const BidToolsPage = () => {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("boq");

  // SEO — dynamic title + description + canonical for this route
  useEffect(() => {
    const title = "Free BOQ Calculator + Bid / No-Bid Tool South Africa | SENRA Bid Tools";
    const description = "Free South African contractor decision tools. BOQ rough estimator with 12 line items, editable rates, P&Gs, contingency and 15% VAT. Margin calculator with retention and break-even. Bid / no-bid viability score with cashflow risk, CIDB grade fit and travel factors. All ZAR, all SA-specific.";
    const url = "https://senueren.co.za/tools";
    document.title = title;
    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", url);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="bid-tools-page">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <Link to="/senra" className="inline-flex items-center gap-1.5 text-xs text-[#8B9BB4] hover:text-[#00FFD4] transition-colors mb-4" data-testid="tools-back-link">
            <ArrowLeft size={12} /> Back to SENRA
          </Link>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">Built for SA Contractors</p>
          <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">Bid Tools</h1>
          <p className="text-[#8B9BB4] mt-3 max-w-2xl leading-relaxed">
            Decide <span className="text-white">what to quote</span> before you spend
            estimator hours pricing it. South African rates, VAT, P&amp;Gs, CIDB
            guidance, retention and cashflow risk baked in.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap" data-testid="tools-tabs">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                tab === t.id
                  ? "bg-[#00FFD4]/10 text-[#00FFD4] border-[#00FFD4]/50"
                  : "text-[#8B9BB4] border-[#1A2332] hover:border-[#8B9BB4]"
              }`}
              data-testid={`tools-tab-${t.id}`}>
              {t.icon} {t.label}
              {t.id === "history" && state.history?.length > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 bg-[#00FFD4]/20 text-[#00FFD4] rounded-full text-[9px]">{state.history.length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 md:p-8">
          {tab === "boq" && <BOQEstimator state={state} setState={setState} />}
          {tab === "margin" && <MarginCalc state={state} setState={setState} />}
          {tab === "viability" && <ViabilityScore state={state} setState={setState} />}
          {tab === "history" && <PastDecisions state={state} setState={setState} />}
        </div>

        <div className="mt-10 bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-[#00FFD4] uppercase font-bold tracking-wider">Tip</p>
            <p className="text-sm text-[#E8EDF2] mt-1">Run the viability tool against any live tender from SENRA — the CIDB grade hint on the tender detail page tells you the likely grade requirement.</p>
          </div>
          <Link to="/senra" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold text-xs hover:shadow-[0_0_20px_rgba(0,255,212,0.3)] transition-all" data-testid="tools-open-senra">
            Browse live tenders <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BidToolsPage;
