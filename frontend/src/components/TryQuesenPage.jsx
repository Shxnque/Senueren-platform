import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Activity, Hash, Copy, Check, Loader2,
  KeyRound, Play, AlertTriangle, ChevronRight,
} from "lucide-react";

/**
 * /try  Live Try Quesen.
 *
 * PUBLIC, zero-friction demonstration. The page self-serves a FREE sandbox API
 * key from the live production engine (POST /sandbox/keys — no signup, no card)
 * and runs real /validate calls against it. Every result shows the deterministic
 * decision (PROCEED / REVIEW / SKIP), the exact conflict rules that fired, and
 * the full replayable receipt (input_snapshot_hash + engine_version + weights +
 * thresholds). This is the "put Quesen in front of a real workflow" proof —
 * nothing is mocked; it hits web-production-aa5ba.up.railway.app directly.
 */

const API_BASE = "https://web-production-aa5ba.up.railway.app";
const SITE_URL = "https://senueren.co.za";

const useSEO = () => {
  useEffect(() => {
    document.title = "Try Quesen — Live Deterministic Decision Engine | Senueren";
    const path = "/try";
    const set = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.startsWith("link") ? "link" : "meta");
        if (sel.startsWith('meta[name'))
          el.setAttribute("name", sel.match(/name="([^"]+)"/)[1]);
        if (sel.startsWith('meta[property'))
          el.setAttribute("property", sel.match(/property="([^"]+)"/)[1]);
        if (sel.startsWith("link")) el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    set('meta[name="description"]', "content",
      "Try Quesen live: self-serve a free sandbox key and run a real deterministic PROCEED/REVIEW/SKIP decision with conflict rules and a replayable receipt.");
    set('link[rel="canonical"]', "href", `${SITE_URL}${path}`);
  }, []);
};

const SCENARIOS = [
  {
    id: "safe",
    label: "Established, low-risk action",
    expect: "PROCEED",
    input: { domain_age_days: 900, engagement_ratio: 0.18, scam_keyword_count: 0 },
    blurb: "A mature counterparty, normal engagement, no scam signals.",
  },
  {
    id: "ambiguous",
    label: "Ambiguous / needs a human",
    expect: "REVIEW",
    input: { domain_age_days: 45, engagement_ratio: 0.55, scam_keyword_count: 1 },
    blurb: "Youngish domain, elevated engagement, one weak signal.",
  },
  {
    id: "scam",
    label: "Fresh domain + scam pattern",
    expect: "SKIP",
    input: { domain_age_days: 1, engagement_ratio: 0.95, scam_keyword_count: 4 },
    blurb: "Brand-new domain, pumped engagement, multiple scam keywords.",
  },
];

const DECISION_STYLE = {
  PROCEED: { c: "#34D399", bg: "rgba(52,211,153,0.10)", bd: "rgba(52,211,153,0.35)" },
  REVIEW: { c: "#F59E0B", bg: "rgba(245,158,11,0.10)", bd: "rgba(245,158,11,0.35)" },
  SKIP: { c: "#F87171", bg: "rgba(248,113,113,0.10)", bd: "rgba(248,113,113,0.35)" },
};

const Field = ({ label, children, hint }) => (
  <label className="block">
    <span className="block text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-2">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-[#64748B] mt-1">{hint}</span>}
  </label>
);

export default function TryQuesenPage() {
  useSEO();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("quesen_sandbox_key") || "");
  const [keyState, setKeyState] = useState(apiKey ? "ready" : "idle"); // idle | issuing | ready | error
  const [keyMeta, setKeyMeta] = useState(null);
  const [keyError, setKeyError] = useState("");

  const [input, setInput] = useState(SCENARIOS[2].input);
  const [activeScenario, setActiveScenario] = useState("scam");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [runError, setRunError] = useState("");
  const [copied, setCopied] = useState(false);

  const issueKey = async () => {
    setKeyState("issuing"); setKeyError("");
    try {
      const r = await fetch(`${API_BASE}/sandbox/keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: "senueren-web-try" }),
      });
      if (r.status === 429) {
        setKeyState("error");
        setKeyError("Rate limit: max sandbox keys per hour reached from your network. Try again later or reuse an existing key.");
        return;
      }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      localStorage.setItem("quesen_sandbox_key", d.api_key);
      setApiKey(d.api_key);
      setKeyMeta({ rate: d.rate_limit_per_min, credits: d.starter_credits, engine: d.engine_version });
      setKeyState("ready");
    } catch (e) {
      setKeyState("error");
      setKeyError(`Could not reach the live engine (${String(e.message || e)}).`);
    }
  };

  const applyScenario = (s) => { setActiveScenario(s.id); setInput(s.input); setResult(null); setRunError(""); };

  const run = async () => {
    setRunning(true); setRunError(""); setResult(null);
    try {
      let key = apiKey;
      if (!key) {
        await issueKey();
        key = localStorage.getItem("quesen_sandbox_key");
        if (!key) { setRunning(false); return; }
      }
      const r = await fetch(`${API_BASE}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": key },
        body: JSON.stringify(input),
      });
      if (r.status === 401) {
        // key expired/rotated on a redeploy — reissue once
        localStorage.removeItem("quesen_sandbox_key"); setApiKey("");
        await issueKey();
        const key2 = localStorage.getItem("quesen_sandbox_key");
        const r2 = await fetch(`${API_BASE}/validate`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-API-Key": key2 },
          body: JSON.stringify(input),
        });
        if (!r2.ok) throw new Error(`HTTP ${r2.status}`);
        setResult(await r2.json()); setRunning(false); return;
      }
      if (r.status === 429) { setRunError("Rate limit hit (sandbox is 30 calls/min). Wait a moment and retry."); setRunning(false); return; }
      if (r.status === 402) { setRunError("Sandbox credits exhausted — that is the ASP HTTP-402 settlement flow. Reissue a key to continue."); setRunning(false); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setResult(await r.json());
    } catch (e) {
      setRunError(`Request failed: ${String(e.message || e)}`);
    } finally {
      setRunning(false);
    }
  };

  const ds = result ? (DECISION_STYLE[result.decision] || DECISION_STYLE.REVIEW) : null;

  const receiptJSON = useMemo(() => (result ? JSON.stringify(result, null, 2) : ""), [result]);
  const copyReceipt = () => {
    navigator.clipboard?.writeText(receiptJSON);
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

  const inputField = (name, step, min, max) => (
    <input
      type="number" step={step} min={min} max={max}
      value={input[name]}
      data-testid={`try-input-${name}`}
      onChange={(e) => { setInput({ ...input, [name]: e.target.value === "" ? "" : Number(e.target.value) }); setActiveScenario(""); }}
      className="w-full bg-[#0B1220] border border-[#1E2A3D] rounded-lg px-3 py-2.5 text-[#E8EDF2] text-sm focus:outline-none focus:border-[#22D3EE]"
    />
  );

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/25">
            <Activity size={13} /> Live · hits production
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[#E8EDF2] tracking-tight">Try Quesen</h1>
          <p className="mt-5 text-lg text-[#94A3B8] leading-relaxed">
            Self-serve a free sandbox key and run a real decision against the live engine.
            Same inputs always return the same verdict — <span className="text-[#E8EDF2]">PROCEED</span>,{" "}
            <span className="text-[#E8EDF2]">REVIEW</span>, or <span className="text-[#E8EDF2]">SKIP</span> — with the
            exact conflict rules that fired and a replayable receipt. Nothing here is mocked.
          </p>
        </div>

        {/* Key strip */}
        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-[#1A2332] bg-[#0B1220]/60 p-4">
          <KeyRound size={16} className="text-[#22D3EE]" />
          {keyState === "ready" ? (
            <span className="text-sm text-[#94A3B8]">
              Sandbox key active <code className="text-[#34D399]">{apiKey.slice(0, 14)}…</code>
              {keyMeta && <span className="text-[#64748B]"> · {keyMeta.rate}/min · {keyMeta.credits} starter credits · engine {keyMeta.engine}</span>}
            </span>
          ) : keyState === "issuing" ? (
            <span className="text-sm text-[#94A3B8] inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Issuing a sandbox key…</span>
          ) : (
            <>
              <span className="text-sm text-[#94A3B8]">No key yet — get one free, instantly.</span>
              <button data-testid="try-issue-key" onClick={issueKey}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0A0E17] bg-[#22D3EE] hover:bg-[#34D399] transition-colors">
                Get sandbox key <ArrowRight size={15} />
              </button>
            </>
          )}
          {keyError && <span className="w-full text-[13px] text-[#F87171] inline-flex items-center gap-2"><AlertTriangle size={13} /> {keyError}</span>}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Left: input */}
          <div className="rounded-2xl border border-[#1A2332] bg-[#0B1220]/40 p-6">
            <h2 className="text-sm font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">1 · Choose an action to evaluate</h2>
            <div className="mt-4 space-y-2">
              {SCENARIOS.map((s) => (
                <button key={s.id} data-testid={`try-scenario-${s.id}`} onClick={() => applyScenario(s)}
                  className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${activeScenario === s.id ? "border-[#22D3EE] bg-[#22D3EE]/5" : "border-[#1E2A3D] hover:border-[#334155]"}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#E8EDF2]">{s.label}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border" style={{ color: DECISION_STYLE[s.expect].c, borderColor: DECISION_STYLE[s.expect].bd, background: DECISION_STYLE[s.expect].bg }}>{s.expect}</span>
                  </div>
                  <span className="block text-[12px] text-[#64748B] mt-1">{s.blurb}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <Field label="Domain age (days)" hint="0 = brand new">{inputField("domain_age_days", 1, 0)}</Field>
              <Field label="Engagement" hint="0.0 – 1.0">{inputField("engagement_ratio", 0.01, 0, 1)}</Field>
              <Field label="Scam keywords" hint="count">{inputField("scam_keyword_count", 1, 0)}</Field>
            </div>

            <button data-testid="try-evaluate" onClick={run} disabled={running}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#0A0E17] bg-[#22D3EE] hover:bg-[#34D399] transition-colors disabled:opacity-60">
              {running ? <><Loader2 size={16} className="animate-spin" /> Evaluating…</> : <><Play size={16} /> Evaluate with Quesen</>}
            </button>
            {runError && <p className="mt-3 text-[13px] text-[#F87171] inline-flex items-start gap-2"><AlertTriangle size={14} className="mt-0.5" /> {runError}</p>}
          </div>

          {/* Right: result */}
          <div className="rounded-2xl border border-[#1A2332] bg-[#0B1220]/40 p-6">
            <h2 className="text-sm font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">2 · Deterministic verdict + evidence</h2>
            {!result ? (
              <div className="mt-6 h-full min-h-[280px] flex flex-col items-center justify-center text-center text-[#475569]">
                <ShieldCheck size={40} className="opacity-40" />
                <p className="mt-4 text-sm text-[#64748B] max-w-xs">Run an evaluation to see the verdict, the exact rules that fired, and the replayable receipt.</p>
              </div>
            ) : (
              <div className="mt-5" data-testid="try-result">
                <div className="rounded-xl border p-5" style={{ borderColor: ds.bd, background: ds.bg }}>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold tracking-tight" style={{ color: ds.c }} data-testid="try-decision">{result.decision}</span>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-wide text-[#94A3B8]">Risk / Confidence</div>
                      <div className="text-sm font-mono text-[#E8EDF2]">{Number(result.risk_score).toFixed(2)} / {Number(result.confidence).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-[#0A0E17] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.round(result.risk_score * 100)}%`, background: ds.c }} />
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-2">Conflict rules that fired</div>
                  {result.conflict_triggers?.length ? (
                    <ul className="space-y-1.5">
                      {result.conflict_triggers.map((t, i) => (
                        <li key={i} className="text-[13px] text-[#CBD5E1] flex items-start gap-2"><ChevronRight size={14} className="mt-0.5 text-[#F59E0B]" /> {t}</li>
                      ))}
                    </ul>
                  ) : <p className="text-[13px] text-[#64748B]">No conflict rules fired.</p>}
                </div>

                <div className="mt-5 rounded-lg border border-[#1E2A3D] bg-[#0A0E17] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[#94A3B8] inline-flex items-center gap-2"><Hash size={13} /> Replayable receipt</span>
                    <button onClick={copyReceipt} data-testid="try-copy-receipt" className="inline-flex items-center gap-1.5 text-[11px] text-[#22D3EE] hover:text-[#34D399]">
                      {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy JSON</>}
                    </button>
                  </div>
                  <dl className="grid grid-cols-1 gap-1.5 text-[12px] font-mono">
                    <div className="flex justify-between gap-3"><dt className="text-[#64748B]">engine_version</dt><dd className="text-[#E8EDF2]">{result.engine_version}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-[#64748B]">request_id</dt><dd className="text-[#E8EDF2] truncate max-w-[60%]" title={result.request_id}>{result.request_id}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-[#64748B]">input_snapshot_hash</dt><dd className="text-[#34D399] truncate max-w-[60%]" title={result.input_snapshot_hash}>{result.input_snapshot_hash}</dd></div>
                    {result.commit_sha && <div className="flex justify-between gap-3"><dt className="text-[#64748B]">commit_sha</dt><dd className="text-[#E8EDF2] truncate max-w-[60%]">{result.commit_sha}</dd></div>}
                    {result.latency_ms != null && <div className="flex justify-between gap-3"><dt className="text-[#64748B]">latency_ms</dt><dd className="text-[#E8EDF2]">{result.latency_ms}</dd></div>}
                  </dl>
                </div>
                <p className="mt-3 text-[11px] text-[#64748B]">Re-run the same inputs and the decision and <code className="text-[#94A3B8]">input_snapshot_hash</code> are byte-identical — that is the deterministic replay guarantee.</p>
              </div>
            )}
          </div>
        </div>

        {/* Integrate CTA */}
        <div className="mt-10 rounded-2xl border border-[#1A2332] bg-gradient-to-br from-[#0B1220] to-[#0A0E17] p-8">
          <h3 className="text-lg font-semibold text-[#E8EDF2]">Integrate it in minutes</h3>
          <p className="mt-2 text-sm text-[#94A3B8]">The sandbox key you just used is a normal Quesen key. Point any client at the production base URL.</p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-[#1E2A3D] bg-[#0A0E17] p-5 text-[12px] leading-relaxed text-[#CBD5E1]"><code>{`# 1 · get a free sandbox key
curl -X POST ${API_BASE}/sandbox/keys

# 2 · evaluate an action (use the key from step 1)
curl -X POST ${API_BASE}/validate \\
  -H "X-API-Key: sk_sandbox_..." \\
  -H "Content-Type: application/json" \\
  -d '{"domain_age_days":1,"engagement_ratio":0.95,"scam_keyword_count":4}'`}</code></pre>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`${API_BASE}/docs`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0A0E17] bg-[#22D3EE] hover:bg-[#34D399] transition-colors">OpenAPI / Swagger <ArrowRight size={15} /></a>
            <a href="https://github.com/Shxnque/quesen/blob/main/docs/QUICKSTART.md" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#E8EDF2] border border-[#1E2A3D] hover:border-[#334155] transition-colors">Quickstart</a>
            <Link to="/quesen" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#E8EDF2] border border-[#1E2A3D] hover:border-[#334155] transition-colors">How Quesen works</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
