/**
 * SENRA Bid Tools — Construction Module MVP
 *
 * Three lightweight, pure-frontend calculators for SA contractors:
 *   1. BOQ Rough Estimator     — indicative material + labour cost range
 *   2. Margin / Markup          — cost + overhead + margin → quote price
 *   3. Bid / No-Bid Viability   — 6-factor "should we chase this?" score
 *
 * No backend calls — everything runs in the browser. Inputs persist in
 * localStorage so a user can leave and come back without losing work.
 *
 * All rates are indicative ZAR ranges for South African market (2026).
 * Rates are conservative — meant as rough sanity-checks before a proper
 * estimator prices the job.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calculator, ClipboardList, Scale, HardHat, ArrowRight, Info,
  ArrowLeft, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react";

const LS_KEY = "senra.bidtools.v1";

const fmtZAR = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return "R " + Math.round(n).toLocaleString("en-ZA");
};

/* ── Indicative rate table ── */
// Ranges are rough low/high per unit based on typical SA market 2025-26.
// Not a substitute for a real BOQ priced in Candy / CCS — just a sanity check.
const RATES = {
  concrete:  { label: "Concrete structural (supplied + poured)", unit: "m³",
               low: 1650, high: 2400 },
  paving:    { label: "Interlocking paving (material + lay)",     unit: "m²",
               low:  350, high:  520 },
  trenching: { label: "Machine trenching (incl. backfill)",       unit: "m",
               low:  120, high:  220 },
  brickwork: { label: "Clay brick walling (single skin)",         unit: "m²",
               low:  520, high:  780 },
  roofing:   { label: "IBR sheet roofing (material + fit)",       unit: "m²",
               low:  420, high:  640 },
};
const LABOUR_DAY = { low: 450, high: 850 }; // per general labourer per day, ZAR

const defaultState = {
  boq: {
    concrete: 0, paving: 0, trenching: 0, brickwork: 0, roofing: 0,
    labourDays: 0, labourers: 0,
  },
  margin: { cost: 0, overheadPct: 15, marginPct: 20 },
  bid: {
    fit: 5, location: 5, timeline: 5, effort: 5, value: 5, competition: 5,
  },
};

const loadState = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};


/* ── Tool 1: BOQ Rough Estimator ── */
const BOQEstimator = ({ state, setState }) => {
  const set = (k, v) => setState({ ...state, boq: { ...state.boq, [k]: v } });
  const n = (v) => Number(v) || 0;
  const b = state.boq;

  let low = 0, high = 0;
  Object.entries(RATES).forEach(([key, r]) => {
    const qty = n(b[key]);
    low += qty * r.low;
    high += qty * r.high;
  });
  const labourTotal = n(b.labourers) * n(b.labourDays);
  const labourLow = labourTotal * LABOUR_DAY.low;
  const labourHigh = labourTotal * LABOUR_DAY.high;
  const totalLow = low + labourLow;
  const totalHigh = high + labourHigh;

  return (
    <div data-testid="tool-boq">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Enter quantities for the scope items that apply. You get an indicative
          ZAR range — useful for a 5-minute sanity check before you commit an
          estimator to a full priced BOQ. Rates are market-indicative, 2025/26.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {Object.entries(RATES).map(([key, r]) => (
          <label key={key} className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
            <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">{r.label}</span>
            <p className="text-[10px] text-[#8B9BB4] mt-0.5">R{r.low}–R{r.high} per {r.unit}</p>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number" min="0" step="1"
                value={b[key] || ""}
                onChange={(e) => set(key, e.target.value)}
                placeholder="0"
                className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
                data-testid={`boq-input-${key}`}
              />
              <span className="text-xs text-[#8B9BB4] w-10">{r.unit}</span>
            </div>
          </label>
        ))}

        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block md:col-span-2">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">General Labour</span>
          <p className="text-[10px] text-[#8B9BB4] mt-0.5">R{LABOUR_DAY.low}–R{LABOUR_DAY.high} per labourer per day</p>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div>
              <span className="text-[10px] text-[#8B9BB4]">Number of labourers</span>
              <input
                type="number" min="0" value={b.labourers || ""}
                onChange={(e) => set("labourers", e.target.value)}
                placeholder="0"
                className="mt-1 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
                data-testid="boq-labourers"
              />
            </div>
            <div>
              <span className="text-[10px] text-[#8B9BB4]">Days on site</span>
              <input
                type="number" min="0" value={b.labourDays || ""}
                onChange={(e) => set("labourDays", e.target.value)}
                placeholder="0"
                className="mt-1 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
                data-testid="boq-labour-days"
              />
            </div>
          </div>
        </label>
      </div>

      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6" data-testid="boq-output">
        <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Indicative Cost Range</span>
        <div className="flex items-baseline gap-3 mt-2 flex-wrap">
          <span className="text-3xl font-bold text-white font-['Outfit']" data-testid="boq-total-low">{fmtZAR(totalLow)}</span>
          <span className="text-[#8B9BB4]">to</span>
          <span className="text-3xl font-bold text-white font-['Outfit']" data-testid="boq-total-high">{fmtZAR(totalHigh)}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
          <div className="text-[#8B9BB4]">Materials: <span className="text-white">{fmtZAR(low)} – {fmtZAR(high)}</span></div>
          <div className="text-[#8B9BB4]">Labour: <span className="text-white">{fmtZAR(labourLow)} – {fmtZAR(labourHigh)}</span></div>
        </div>
        <p className="text-[10px] text-[#8B9BB4] mt-4 leading-relaxed">
          Excludes: prelims, plant hire, site establishment, P&amp;Gs, contingency,
          VAT, preliminaries and risk. Use as a gut-check, not a quote.
        </p>
      </div>
    </div>
  );
};


/* ── Tool 2: Margin / Markup Calculator ── */
const MarginCalc = ({ state, setState }) => {
  const set = (k, v) => setState({ ...state, margin: { ...state.margin, [k]: v } });
  const n = (v) => Number(v) || 0;
  const m = state.margin;

  const cost = n(m.cost);
  const overheadAmt = cost * (n(m.overheadPct) / 100);
  const withOverhead = cost + overheadAmt;
  const marginPct = n(m.marginPct);
  // Markup (sell = cost / (1 - margin%)) — gives the margin on the SELL price.
  const quote = marginPct < 100 ? withOverhead / (1 - marginPct / 100) : 0;
  const profit = quote - withOverhead;

  return (
    <div data-testid="tool-margin">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Enter your <span className="text-white">direct cost</span>, add overhead and target margin — we'll work backwards to the quote price.
          Margin is calculated on the sell price (the way accountants read it), so a 20% margin means R20 profit on every R100 quoted.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Direct Cost (ZAR)</span>
          <input
            type="number" min="0" value={m.cost || ""}
            onChange={(e) => set("cost", e.target.value)}
            placeholder="e.g. 250000"
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-cost"
          />
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Overhead %</span>
          <input
            type="number" min="0" max="100" value={m.overheadPct}
            onChange={(e) => set("overheadPct", e.target.value)}
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-overhead"
          />
          <p className="text-[10px] text-[#8B9BB4] mt-1">Default 15%. Covers admin, transport, PM time.</p>
        </label>
        <label className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 block">
          <span className="text-[11px] text-[#00FFD4] uppercase tracking-wider font-bold">Target Margin %</span>
          <input
            type="number" min="0" max="90" value={m.marginPct}
            onChange={(e) => set("marginPct", e.target.value)}
            className="mt-2 w-full bg-[#0F1419] border border-[#1A2332] rounded-md px-3 py-2 text-sm text-white focus:border-[#00FFD4] focus:outline-none"
            data-testid="margin-pct"
          />
          <p className="text-[10px] text-[#8B9BB4] mt-1">On the sell price. 15–25% typical for civils.</p>
        </label>
      </div>

      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6" data-testid="margin-output">
        <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Quote Price</span>
        <div className="text-3xl font-bold text-white font-['Outfit'] mt-2" data-testid="margin-quote">{fmtZAR(quote)}</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 text-xs">
          <div>
            <p className="text-[#8B9BB4]">Direct cost</p>
            <p className="text-white font-bold mt-0.5">{fmtZAR(cost)}</p>
          </div>
          <div>
            <p className="text-[#8B9BB4]">Overhead</p>
            <p className="text-white font-bold mt-0.5">{fmtZAR(overheadAmt)}</p>
          </div>
          <div>
            <p className="text-[#8B9BB4]">Total cost</p>
            <p className="text-white font-bold mt-0.5">{fmtZAR(withOverhead)}</p>
          </div>
          <div>
            <p className="text-[#8B9BB4]">Profit</p>
            <p className="text-[#00FFD4] font-bold mt-0.5" data-testid="margin-profit">{fmtZAR(profit)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ── Tool 3: Bid / No-Bid Viability Score ── */
const FACTORS = [
  { key: "fit",         label: "Industry fit",         help: "How closely does your core work match the scope?" },
  { key: "location",    label: "Location fit",         help: "Is the project within your delivery radius?" },
  { key: "timeline",    label: "Timeline feasibility", help: "Can you realistically mobilise in the required timeframe?" },
  { key: "effort",      label: "Effort to prepare",    help: "Inverse — low effort = high score. Massive RFPs score lower." },
  { key: "value",       label: "Contract value",       help: "Is the size worth chasing relative to your team?" },
  { key: "competition", label: "Competitive position", help: "Strong prior experience / relationships = higher score." },
];

const ViabilityScore = ({ state, setState }) => {
  const set = (k, v) => setState({ ...state, bid: { ...state.bid, [k]: Number(v) } });
  const total = FACTORS.reduce((sum, f) => sum + (Number(state.bid[f.key]) || 0), 0);
  const maxTotal = FACTORS.length * 10;
  const pct = Math.round((total / maxTotal) * 100);
  const verdict = pct >= 70 ? "BID" : pct >= 50 ? "CONSIDER" : "PASS";
  const verdictColor = verdict === "BID" ? "text-[#00FFD4] border-[#00FFD4]/40 bg-[#00FFD4]/10"
    : verdict === "CONSIDER" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
    : "text-red-400 border-red-500/40 bg-red-500/10";
  const verdictIcon = verdict === "BID" ? <CheckCircle2 size={18} />
    : verdict === "CONSIDER" ? <AlertTriangle size={18} />
    : <XCircle size={18} />;

  return (
    <div data-testid="tool-viability">
      <div className="flex items-start gap-3 mb-6 bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4">
        <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#8B9BB4] leading-relaxed">
          Rate each factor from 1 (poor) to 10 (excellent). Best used before
          you commit estimator time — most firms lose money on bids they
          shouldn't have chased.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {FACTORS.map(f => (
          <div key={f.key} className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4" data-testid={`viability-factor-${f.key}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[11px] text-white font-bold uppercase tracking-wider">{f.label}</span>
                <p className="text-[10px] text-[#8B9BB4] mt-0.5">{f.help}</p>
              </div>
              <span className="text-lg font-bold text-[#00FFD4] font-['Outfit']" data-testid={`viability-value-${f.key}`}>
                {state.bid[f.key]}/10
              </span>
            </div>
            <input
              type="range" min="1" max="10" step="1"
              value={state.bid[f.key]}
              onChange={(e) => set(f.key, e.target.value)}
              className="w-full accent-[#00FFD4]"
              data-testid={`viability-slider-${f.key}`}
            />
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/30 rounded-xl p-6" data-testid="viability-output">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Viability Score</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-4xl font-bold text-white font-['Outfit']" data-testid="viability-score">{pct}</span>
              <span className="text-lg text-[#8B9BB4]">/ 100</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${verdictColor}`} data-testid="viability-verdict">
            {verdictIcon}
            {verdict === "BID" ? "Bid it" : verdict === "CONSIDER" ? "Consider carefully" : "Pass on this one"}
          </span>
        </div>
        <div className="mt-4 h-2 w-full rounded-full bg-[#0A0E17] overflow-hidden">
          <div className="h-full transition-all duration-500 rounded-full"
               style={{ width: `${pct}%`,
                        backgroundColor: verdict === "BID" ? "#00FFD4" : verdict === "CONSIDER" ? "#eab308" : "#f87171" }} />
        </div>
        <p className="text-[11px] text-[#8B9BB4] mt-4 leading-relaxed">
          <span className="text-white font-bold">{verdict === "BID" ? "Recommended:" : verdict === "CONSIDER" ? "Proceed with caution:" : "Recommended:"}</span>{" "}
          {verdict === "BID" && "Strong fit across the board — prioritise and mobilise a full bid team."}
          {verdict === "CONSIDER" && "Mixed signals — only proceed if you have spare estimator capacity or a strategic reason."}
          {verdict === "PASS" && "Save your time. Estimator hours here will likely produce a losing bid."}
        </p>
      </div>
    </div>
  );
};


/* ── Main Bid Tools Page ── */

const TABS = [
  { id: "boq",       label: "BOQ Estimator",    icon: <HardHat size={14} /> },
  { id: "margin",    label: "Margin Calculator", icon: <Calculator size={14} /> },
  { id: "viability", label: "Bid / No-Bid",     icon: <Scale size={14} /> },
];

const BidToolsPage = () => {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("boq");

  // Persist on every change
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="bid-tools-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <Link to="/senra" className="inline-flex items-center gap-1.5 text-xs text-[#8B9BB4] hover:text-[#00FFD4] transition-colors mb-4" data-testid="tools-back-link">
            <ArrowLeft size={12} /> Back to SENRA
          </Link>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">Construction Module</p>
          <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">Bid Tools</h1>
          <p className="text-[#8B9BB4] mt-3 max-w-2xl leading-relaxed">
            Decide <span className="text-white">what to quote</span> before you spend
            estimator hours pricing it. Three lightweight tools — rough cost
            range, quote-price builder, and a bid/no-bid viability score.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8 flex-wrap" data-testid="tools-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                tab === t.id
                  ? "bg-[#00FFD4]/10 text-[#00FFD4] border-[#00FFD4]/50"
                  : "text-[#8B9BB4] border-[#1A2332] hover:border-[#8B9BB4]"
              }`}
              data-testid={`tools-tab-${t.id}`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Active tool */}
        <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 md:p-8">
          {tab === "boq" && <BOQEstimator state={state} setState={setState} />}
          {tab === "margin" && <MarginCalc state={state} setState={setState} />}
          {tab === "viability" && <ViabilityScore state={state} setState={setState} />}
        </div>

        {/* Linkback */}
        <div className="mt-10 bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs text-[#00FFD4] uppercase font-bold tracking-wider">Tip</p>
            <p className="text-sm text-[#E8EDF2] mt-1">Run the viability score against any live tender you find on SENRA.</p>
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
