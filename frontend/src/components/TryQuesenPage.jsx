import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, KeyRound, Loader2, Check, Copy, Terminal, BookOpen, Play, ShieldCheck } from "lucide-react";

/**
 * /try  Quesen developer activation + live interactive demo.
 *
 * Real end-to-end: self-serve a sandbox key, then run an actual action against
 * the live deterministic engine (/validate) and see the real verdict, risk
 * score, reason codes and a replayable, signed receipt. No signup, no card.
 */

const API_BASE = "https://api.senueren.co.za";
const SITE_URL = "https://senueren.co.za";

const VERDICT = {
  PROCEED: { c: "#34D399", bg: "rgba(52,211,153,0.10)", bd: "rgba(52,211,153,0.35)", label: "PROCEED" },
  REVIEW: { c: "#FBBF24", bg: "rgba(251,191,36,0.10)", bd: "rgba(251,191,36,0.35)", label: "REVIEW" },
  SKIP: { c: "#F87171", bg: "rgba(248,113,113,0.10)", bd: "rgba(248,113,113,0.35)", label: "SKIP" },
};

const PRESETS = [
  { k: "benign", label: "Established, trusted", v: { domain_age_days: 1400, engagement_ratio: 0.82, scam_keyword_count: 0 } },
  { k: "mixed", label: "Ambiguous", v: { domain_age_days: 60, engagement_ratio: 0.3, scam_keyword_count: 2 } },
  { k: "risky", label: "Fresh & scammy", v: { domain_age_days: 1, engagement_ratio: 0.02, scam_keyword_count: 9 } },
];

const useSEO = () => {
  useEffect(() => {
    document.title = "Try Quesen Live — Deterministic Agent Decisions | Senueren";
    const ensure = (sel, make) => {
      let el = document.head.querySelector(sel);
      if (!el) { el = make(); document.head.appendChild(el); }
      return el;
    };
    const desc = ensure('meta[name="description"]', () => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); return m;
    });
    desc.setAttribute("content",
      "Try Quesen live: self-serve a free sandbox key and run a real action against the deterministic engine — PROCEED / REVIEW / SKIP with reason codes and a signed, replayable receipt.");
    const canon = ensure('link[rel="canonical"]', () => {
      const l = document.createElement("link"); l.setAttribute("rel", "canonical"); return l;
    });
    canon.setAttribute("href", `${SITE_URL}/try`);
  }, []);
};

export default function TryQuesenPage() {
  useSEO();
  const [apiKey, setApiKey] = useState("");
  const [meta, setMeta] = useState(null);
  const [state, setState] = useState("idle"); // idle | issuing | ready | error
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  // interactive validate
  const [form, setForm] = useState({ domain_age_days: 1, engagement_ratio: 0.95, scam_keyword_count: 4 });
  const [runState, setRunState] = useState("idle"); // idle | running | done | error
  const [result, setResult] = useState(null);
  const [runError, setRunError] = useState("");

  const issueKey = async () => {
    setState("issuing"); setError("");
    try {
      const r = await fetch(`${API_BASE}/sandbox/keys`, { method: "POST" });
      if (r.status === 429) { setState("error"); setError("Rate limit reached from your network — try again shortly."); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const d = await r.json();
      setApiKey(d.api_key);
      setMeta({ rate: d.rate_limit_per_min, credits: d.starter_credits, engine: d.engine_version });
      setState("ready");
      return d.api_key;
    } catch (e) {
      setState("error"); setError(`Could not reach the live engine (${String(e.message || e)}).`);
    }
  };

  const runValidate = async () => {
    setRunState("running"); setRunError(""); setResult(null);
    try {
      let key = apiKey;
      if (!key) key = await issueKey();
      if (!key) { setRunState("error"); setRunError("Could not get a sandbox key to run the request."); return; }
      const r = await fetch(`${API_BASE}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": key },
        body: JSON.stringify({
          domain_age_days: Number(form.domain_age_days),
          engagement_ratio: Number(form.engagement_ratio),
          scam_keyword_count: Number(form.scam_keyword_count),
        }),
      });
      if (r.status === 429) { setRunState("error"); setRunError("Sandbox rate limit reached — wait a few seconds and try again."); return; }
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      setResult(await r.json());
      setRunState("done");
    } catch (e) {
      setRunState("error"); setRunError(`Live call failed (${String(e.message || e)}).`);
    }
  };

  const copy = (text, tag) => {
    navigator.clipboard?.writeText(text);
    setCopied(tag); setTimeout(() => setCopied(""), 1500);
  };

  const curlIssue = `curl -X POST ${API_BASE}/sandbox/keys`;
  const curlValidate = `curl -X POST ${API_BASE}/validate \\
  -H "X-API-Key: ${apiKey || "sk_sandbox_..."}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(form)}'`;

  const v = result && VERDICT[result.decision];
  const reasons = (result && (result.reasons || result.conflict_triggers || [])) || [];

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/25">
          Live demo · developer activation
        </span>
        <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[#E8EDF2] tracking-tight">Try Quesen, live</h1>
        <p className="mt-5 text-lg text-[#94A3B8] leading-relaxed">
          Quesen is a deterministic pre-decision engine for autonomous agents: before a high-impact action runs,
          it returns <span className="text-[#34D399] font-semibold">PROCEED</span>,{" "}
          <span className="text-[#FBBF24] font-semibold">REVIEW</span>, or <span className="text-[#F87171] font-semibold">SKIP</span> with
          reason codes and a signed, replayable receipt. Run a real action against the live engine below — no signup, no card.
        </p>

        {/* Step 1 — get a key */}
        <div className="mt-10 rounded-2xl border border-[#1A2332] bg-[#0B1220]/50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">
            <KeyRound size={15} className="text-[#22D3EE]" /> Step 1 · Get a free sandbox key
          </div>
          {state === "ready" ? (
            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-lg border border-[#1E2A3D] bg-[#0A0E17] px-4 py-3">
                <code className="text-[#34D399] text-sm break-all flex-1" data-testid="try-key-value">{apiKey}</code>
                <button onClick={() => copy(apiKey, "key")} data-testid="try-copy-key" className="text-[#22D3EE] hover:text-[#34D399] shrink-0">
                  {copied === "key" ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {meta && (
                <p className="mt-2 text-[12px] text-[#64748B]">
                  Free sandbox tier · {meta.rate}/min · {meta.credits} starter credits · engine {meta.engine}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-4">
              <button onClick={issueKey} disabled={state === "issuing"} data-testid="try-issue-key"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#0A0E17] bg-[#22D3EE] hover:bg-[#34D399] transition-colors disabled:opacity-60">
                {state === "issuing" ? <><Loader2 size={16} className="animate-spin" /> Issuing…</> : <>Get sandbox key <ArrowRight size={16} /></>}
              </button>
              {error && <p className="mt-3 text-[13px] text-[#F87171]" data-testid="try-key-error">{error}</p>}
              <p className="mt-3 text-[12px] text-[#64748B]">Or run it yourself:</p>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-[#1E2A3D] bg-[#0A0E17] px-4 py-2.5">
                <code className="text-[#CBD5E1] text-[12px] flex-1 overflow-x-auto">{curlIssue}</code>
                <button onClick={() => copy(curlIssue, "c1")} className="text-[#22D3EE] hover:text-[#34D399] shrink-0">
                  {copied === "c1" ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2 — interactive run */}
        <div className="mt-6 rounded-2xl border border-[#1A2332] bg-[#0B1220]/50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">
            <Terminal size={15} className="text-[#22D3EE]" /> Step 2 · Ask Quesen about an action
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button key={p.k} data-testid={`try-preset-${p.k}`} onClick={() => setForm(p.v)}
                className="px-3 py-1.5 rounded-full text-[12px] font-semibold border border-[#1E2A3D] text-[#94A3B8] hover:border-[#22D3EE]/50 hover:text-[#E8EDF2] transition-colors">
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { k: "domain_age_days", label: "Domain age (days)", step: 1 },
              { k: "engagement_ratio", label: "Engagement ratio", step: 0.01 },
              { k: "scam_keyword_count", label: "Scam keywords", step: 1 },
            ].map((f) => (
              <label key={f.k} className="block">
                <span className="text-[11px] uppercase tracking-[0.1em] text-[#64748B]">{f.label}</span>
                <input type="number" step={f.step} value={form[f.k]} data-testid={`try-input-${f.k}`}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-[#1E2A3D] bg-[#0A0E17] px-3 py-2 text-sm text-[#E8EDF2] focus:border-[#22D3EE] outline-none" />
              </label>
            ))}
          </div>

          <button onClick={runValidate} disabled={runState === "running"} data-testid="try-run-validate"
            className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-[#0A0E17] bg-[#34D399] hover:bg-[#22D3EE] transition-colors disabled:opacity-60">
            {runState === "running" ? <><Loader2 size={16} className="animate-spin" /> Asking the live engine…</> : <><Play size={15} /> Ask Quesen</>}
          </button>
          {runError && <p className="mt-3 text-[13px] text-[#F87171]" data-testid="try-run-error">{runError}</p>}

          {result && v && (
            <div className="mt-5 rounded-xl border p-5" data-testid="try-result"
              style={{ background: v.bg, borderColor: v.bd }}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} style={{ color: v.c }} />
                  <span className="text-2xl font-bold tracking-tight" data-testid="try-verdict" style={{ color: v.c }}>{v.label}</span>
                </div>
                <div className="text-right text-[12px] text-[#94A3B8]">
                  <div>risk_score <span className="text-[#E8EDF2] font-semibold">{result.risk_score ?? "—"}</span></div>
                  {result.confidence != null && <div>confidence <span className="text-[#E8EDF2] font-semibold">{result.confidence}</span></div>}
                </div>
              </div>

              {reasons.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {reasons.map((rc, i) => (
                    <li key={i} className="text-[13px] text-[#CBD5E1] flex gap-2">
                      <span style={{ color: v.c }}>•</span>
                      <span><code className="text-[#E8EDF2]">{typeof rc === "string" ? rc : rc.code}</code>{typeof rc === "object" && rc.message ? ` — ${rc.message}` : ""}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-[#64748B] space-y-1 break-all">
                {result.input_snapshot_hash && <div>input_snapshot_hash: <span className="text-[#94A3B8]">{result.input_snapshot_hash}</span></div>}
                {result.commit_sha && <div>commit_sha: <span className="text-[#94A3B8]">{result.commit_sha}</span></div>}
                <div>engine {result.engine_version} · deterministic · same inputs → same verdict, replayable offline</div>
              </div>
            </div>
          )}

          <details className="mt-4">
            <summary className="text-[12px] text-[#64748B] cursor-pointer hover:text-[#94A3B8]">Or run the same call yourself (curl)</summary>
            <div className="mt-2 relative">
              <pre className="overflow-x-auto rounded-lg border border-[#1E2A3D] bg-[#0A0E17] p-4 text-[12px] leading-relaxed text-[#CBD5E1]"><code>{curlValidate}</code></pre>
              <button onClick={() => copy(curlValidate, "c2")} className="absolute top-3 right-3 text-[#22D3EE] hover:text-[#34D399]">
                {copied === "c2" ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </details>
        </div>

        {/* Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="https://github.com/Shxnque/quesen/blob/main/docs/QUICKSTART.md" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#0A0E17] bg-[#22D3EE] hover:bg-[#34D399] transition-colors">
            <BookOpen size={15} /> Quickstart
          </a>
          <a href={`${API_BASE}/docs`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#E8EDF2] border border-[#1E2A3D] hover:border-[#334155] transition-colors">
            OpenAPI / Swagger
          </a>
          <Link to="/quesen"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#E8EDF2] border border-[#1E2A3D] hover:border-[#334155] transition-colors">
            How Quesen works
          </Link>
          <Link to="/quesen/servers" data-testid="try-servers-link"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#E8EDF2] border border-[#1E2A3D] hover:border-[#334155] transition-colors">
            Distribution &amp; Servers
          </Link>
        </div>
      </div>
    </div>
  );
}
