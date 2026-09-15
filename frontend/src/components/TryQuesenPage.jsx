import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, KeyRound, Loader2, Check, Copy, Terminal, BookOpen } from "lucide-react";

/**
 * /try  Quesen developer activation surface.
 *
 * Intentionally minimal. This is NOT a demo/calculator — it is the entry point
 * for a developer to self-serve a free sandbox key and start integrating.
 * A first-class interactive experience (agent action -> deterministic
 * PROCEED/REVIEW/SKIP -> replayable receipt) will be rebuilt here separately,
 * around the real Quesen architecture.
 */

const API_BASE = "https://web-production-3df26.up.railway.app";
const SITE_URL = "https://senueren.co.za";

const useSEO = () => {
  useEffect(() => {
    document.title = "Start with Quesen — Developer Activation | Senueren";
    const ensure = (sel, make) => {
      let el = document.head.querySelector(sel);
      if (!el) { el = make(); document.head.appendChild(el); }
      return el;
    };
    const desc = ensure('meta[name="description"]', () => {
      const m = document.createElement("meta"); m.setAttribute("name", "description"); return m;
    });
    desc.setAttribute("content",
      "Start building with Quesen: self-serve a free sandbox API key and run deterministic decisions against the live engine.");
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
    } catch (e) {
      setState("error"); setError(`Could not reach the live engine (${String(e.message || e)}).`);
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
  -d '{"domain_age_days":1,"engagement_ratio":0.95,"scam_keyword_count":4}'`;

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-[0.12em] uppercase text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/25">
          Developer activation
        </span>
        <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[#E8EDF2] tracking-tight">Start with Quesen</h1>
        <p className="mt-5 text-lg text-[#94A3B8] leading-relaxed">
          Quesen is a deterministic pre-decision engine for autonomous agents: before a
          high-impact action runs, it returns <span className="text-[#E8EDF2]">PROCEED</span>,{" "}
          <span className="text-[#E8EDF2]">REVIEW</span>, or <span className="text-[#E8EDF2]">SKIP</span> with
          a replayable, evidence-backed receipt. Get a free sandbox key and start integrating in minutes —
          no signup, no card.
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
              {error && <p className="mt-3 text-[13px] text-[#F87171]">{error}</p>}
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

        {/* Step 2 — use it */}
        <div className="mt-6 rounded-2xl border border-[#1A2332] bg-[#0B1220]/50 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.12em] uppercase text-[#94A3B8]">
            <Terminal size={15} className="text-[#22D3EE]" /> Step 2 · Ask Quesen about an action
          </div>
          <div className="mt-4 relative">
            <pre className="overflow-x-auto rounded-lg border border-[#1E2A3D] bg-[#0A0E17] p-4 text-[12px] leading-relaxed text-[#CBD5E1]"><code>{curlValidate}</code></pre>
            <button onClick={() => copy(curlValidate, "c2")} className="absolute top-3 right-3 text-[#22D3EE] hover:text-[#34D399]">
              {copied === "c2" ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <p className="mt-3 text-[12px] text-[#64748B]">
            Returns a deterministic verdict with <code className="text-[#94A3B8]">risk_score</code>, the rules
            that fired, and an <code className="text-[#94A3B8]">input_snapshot_hash</code> you can replay.
          </p>
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
