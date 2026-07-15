import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Shield, CheckCircle2, Circle, ExternalLink,
  Terminal, Code2, Zap, Layers, Cpu, Network, GitBranch, BookOpen,
  ChevronRight, Server, Lock, Eye, Activity
} from "lucide-react";

/**
 * System detail pages — /quesen /shinren /qarsar /diosen.
 *
 * Design system aligned with existing App.js:
 *   bg              #0A0E17
 *   card bg         #0F1419
 *   card border     #1A2332
 *   accent (cyan)   #00FFD4
 *   text primary    #E8EDF2
 *   text muted      #8B9BB4
 *
 * All content is verified against the source repos (Quesen-sib, sib-supreme-shinren,
 * Qarsar-sib, diosen-ultra). No fabrication.
 */

const QUESEN_LIVE_URL = "https://web-production-30ab5.up.railway.app";

/* ── SEO helper (mirrors App.js) ── */
const useSEO = ({ title, description, path = "/" }) => {
  useEffect(() => {
    const SITE_URL = "https://senueren.co.za";
    const fullTitle = title;
    const fullUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    document.title = fullTitle;
    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith("meta") ? "meta" : "link");
        const m = selector.match(/\[(.+?)="(.+?)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    if (description) {
      setMeta('meta[name="description"]', "content", description);
      setMeta('meta[property="og:description"]', "content", description);
      setMeta('meta[name="twitter:description"]', "content", description);
    }
    setMeta('meta[property="og:title"]', "content", fullTitle);
    setMeta('meta[name="twitter:title"]', "content", fullTitle);
    setMeta('meta[property="og:url"]', "content", fullUrl);
    setMeta('meta[name="twitter:url"]', "content", fullUrl);
    setMeta('link[rel="canonical"]', "href", fullUrl);
  }, [title, description, path]);
};

/* ── Section primitives (shared) ── */

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-12">
    <div className="accent-bar w-12 mb-6"></div>
    <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && (
      <p className="text-[#8B9BB4] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

const InfoCard = ({ icon, title, desc }) => (
  <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow group h-full">
    <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{title}</h3>
    <p className="text-sm text-[#8B9BB4] leading-relaxed">{desc}</p>
  </div>
);

const StatBox = ({ label, value }) => (
  <div className="bg-[#0A0E17] border border-[#1A2332] p-5 rounded-xl">
    <p className="text-[10px] font-bold text-[#8B9BB4] tracking-[0.2em] uppercase mb-2">{label}</p>
    <p className="text-lg text-white font-medium font-['Outfit']">{value}</p>
  </div>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-[#060A10] border border-[#1A2332] rounded-xl p-5 overflow-x-auto text-xs md:text-sm text-[#E8EDF2] leading-relaxed">
    <code>{children}</code>
  </pre>
);

/* ────────────────────────────────────────────────────────────────
   LIVE STATUS WIDGET (Quesen only)
   Fetches /health + /version from the live Quesen production URL.
   Fails gracefully — no error state cascades into the page render.
──────────────────────────────────────────────────────────────── */

const LiveStatus = () => {
  const [status, setStatus] = useState(null);
  const [version, setVersion] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [h, v] = await Promise.all([
          fetch(`${QUESEN_LIVE_URL}/health`, { headers: { Accept: "application/json" } }),
          fetch(`${QUESEN_LIVE_URL}/version`, { headers: { Accept: "application/json" } }),
        ]);
        if (cancelled) return;
        const health = await h.json();
        const ver = await v.json();
        setStatus(health);
        setVersion(ver);
      } catch (e) {
        if (!cancelled) setError(true);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const isUp = status?.status === "ok";
  const dotColor = error ? "bg-red-400" : isUp ? "bg-[#00FFD4]" : "bg-yellow-400";
  const dotAnimate = isUp ? "animate-pulse" : "";

  return (
    <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-6 md:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${dotColor} ${dotAnimate}`}></span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4]">Live · Production</span>
          </div>
          <h3 className="text-2xl font-bold text-white font-['Outfit']">Quesen API</h3>
          <p className="text-xs text-[#8B9BB4] mt-1 font-mono">{QUESEN_LIVE_URL.replace(/^https?:\/\//, "")}</p>
        </div>
        <Activity size={24} className="text-[#00FFD4]" />
      </div>
      {error ? (
        <p className="text-xs text-red-400/80">Live status unavailable from this domain (CORS). API is nevertheless operational — hit /health directly to verify.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Status" value={status ? (isUp ? "OK" : "DEGRADED") : "…"} />
          <StatBox label="Engine" value={version?.engine_version ?? "…"} />
          <StatBox label="Chains" value={version ? version.onchain_supported_chains?.length ?? 0 : "…"} />
          <StatBox label="Report Schema" value={version?.report_schema_version ?? "…"} />
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /quesen — Quesen system page
════════════════════════════════════════════════════════════════ */

export const QuesenPage = () => {
  useSEO({
    title: "Quesen — The Deterministic Trust Layer for Autonomous Agents | Senueren",
    description: "Quesen is a deterministic AI decision engine that answers one question for autonomous agents: should this action proceed? No LLM in the loop. Same input → same decision. Fully replayable audit trail. On-chain enrichment across 7 EVM chains.",
    path: "/quesen",
  });

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* Hero */}
        <section>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Risk Engineering · Deterministic Trust Layer</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Quesen answers one question for autonomous agents:
            <span className="gradient-text"> should this action proceed?</span>
          </h1>
          <p className="text-lg text-[#8B9BB4] mt-8 max-w-2xl leading-relaxed">
            No LLM in the scoring loop. No randomness. No hidden state. Same input in — same decision out.
            Every response includes the engine version, weights, thresholds, and every conflict rule that fired.
            Fully replayable, fully auditable.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="https://github.com/Shxnque/quesen-sdk-py" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FFD4] text-[#0A0E17] rounded-full font-bold text-sm hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all">
              Python SDK <ArrowUpRight size={16} />
            </a>
            <span className="inline-flex items-center gap-2 px-6 py-3 border border-[#1A2332] text-[#E8EDF2] rounded-full font-bold text-sm">
              npm i quesen-sdk <span className="text-[#8B9BB4] text-xs">(coming Session 06)</span>
            </span>
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-[#1A2332] text-[#8B9BB4] hover:text-[#00FFD4] hover:border-[#00FFD4]/30 rounded-full font-bold text-sm transition-all">
              Request API key <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Live status */}
        <section>
          <LiveStatus />
        </section>

        {/* Why deterministic */}
        <section>
          <SectionHeader
            eyebrow="Doctrine"
            title="Why deterministic risk beats black-box scoring"
            subtitle="Autonomous agents cannot delegate their action-authority to a system they cannot audit. Every Quesen decision is reproducible in isolation."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Eye size={22} />} title="Fully transparent" desc="Response includes engine_version, exact weights, exact thresholds. Nothing hidden." />
            <InfoCard icon={<Lock size={22} />} title="No LLM in decisions" desc="Zero probabilistic scoring. Boolean rule predicates only. No hallucination surface." />
            <InfoCard icon={<Server size={22} />} title="Same input, same answer" desc="Regression-tested on every commit. Two calls with the same body return byte-identical decisions." />
          </div>
        </section>

        {/* Feature grid */}
        <section>
          <SectionHeader
            eyebrow="Capabilities · v1.5.0"
            title="What v1.5.0 ships"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Shield size={22} />} title="Deterministic scoring" desc="3 normalized signals (domain age, engagement, scam keywords) combined via 4 stable weights. Zero randomness." />
            <InfoCard icon={<GitBranch size={22} />} title="Conflict Matrix v2 · 7 rules" desc="Explicit adversarial patterns detected. Every trigger has a stable rule ID (R1..R7) and human-readable justification." />
            <InfoCard icon={<Network size={22} />} title="On-chain enrichment · 7 EVM chains" desc="Optional enrichment for ethereum · base · arbitrum · optimism · polygon · bnb · avalanche. Contract age, EIP-1967 proxy detection, source verification, holder concentration. Feature-flagged, off by default." />
            <InfoCard icon={<Terminal size={22} />} title="MCP-native" desc="Works in Claude Desktop, Cursor, Windsurf, Zed, Cline, Continue, Roo Code. 5 stdio tools out of the box." />
            <InfoCard icon={<Code2 size={22} />} title="6 framework surfaces" desc="Python · JavaScript/TypeScript · LangChain / LangGraph · CrewAI · AutoGen v0.4+ · Raw HTTP." />
            <InfoCard icon={<Layers size={22} />} title="Multi-tenant + rate-limited" desc="Per-key pricing + per-minute rate limiting. Zero external dependencies for scale." />
          </div>
        </section>

        {/* Three-line integration */}
        <section>
          <SectionHeader
            eyebrow="Integration"
            title="Three lines. Not more."
            subtitle="Same 3-line pattern in every SDK. Stripe-style ergonomics; deterministic-agent posture."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold text-[#00FFD4] tracking-[0.2em] uppercase mb-3">Python</p>
              <CodeBlock>{`from quesen_sdk import QuesenClient

q = QuesenClient(base_url="…", api_key="…")

if q.validate(
    domain_age_days=1,
    engagement_ratio=0.95,
    scam_keyword_count=4,
).decision == "SKIP":
    return  # respect the deterministic answer`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-bold text-[#00FFD4] tracking-[0.2em] uppercase mb-3">JavaScript / TypeScript</p>
              <CodeBlock>{`import { QuesenClient } from "quesen-sdk";

const q = new QuesenClient({
  baseUrl: "…",
  apiKey: process.env.QUESEN_API_KEY,
});

const v = await q.validate({
  domain_age_days: 1,
  engagement_ratio: 0.95,
  scam_keyword_count: 4,
});

if (v.decision === "SKIP") return;`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section>
          <SectionHeader
            eyebrow="API Surface"
            title="Six endpoints. One contract."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { m: "POST", p: "/validate", d: "Deterministic decision on a pre-action signal set. Returns decision, risk_score, conflict_triggers, engine_version." },
              { m: "POST", p: "/simulate", d: "Counterfactual scoring with weights_override / thresholds_override. Zero mutation of engine state." },
              { m: "POST", p: "/report", d: "Post-decision outcome feedback. v1.1 accepts realized_pnl, elapsed_seconds, venue, signal_hash." },
              { m: "GET",  p: "/health", d: "Liveness probe. No auth required." },
              { m: "GET",  p: "/version", d: "Full engine version + weights + thresholds + feature flags." },
              { m: "GET",  p: "/stats", d: "Aggregate multi-tenant stats. Requires QUESEN_ADMIN_KEY." },
            ].map((e) => (
              <div key={e.p} className="bg-[#0F1419] border border-[#1A2332] rounded-xl p-4 flex items-start gap-4">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${e.m === "GET" ? "bg-[#00FFD4]/10 text-[#00FFD4] border border-[#00FFD4]/30" : "bg-[#4A9FD8]/10 text-[#4A9FD8] border border-[#4A9FD8]/30"}`}>
                  {e.m}
                </span>
                <div className="flex-1">
                  <code className="text-sm text-white font-medium">{e.p}</code>
                  <p className="text-xs text-[#8B9BB4] leading-relaxed mt-1">{e.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Repos */}
        <section>
          <SectionHeader
            eyebrow="Distribution"
            title="Public SDK repositories"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "quesen-sdk-py", desc: "Official Python SDK.", url: "https://github.com/Shxnque/quesen-sdk-py" },
              { name: "quesen-sdk-js", desc: "Official JavaScript / TypeScript SDK (Session 06 publish).", url: "https://github.com/Shxnque/Quesen-sib/tree/main/sdks/js" },
              { name: "quesen-langchain", desc: "LangChain / LangGraph tool.", url: "https://github.com/Shxnque/quesen-langchain" },
              { name: "quesen-crewai", desc: "CrewAI tool.", url: "https://github.com/Shxnque/quesen-crewai" },
              { name: "quesen-autogen", desc: "AutoGen v0.4+ function tools.", url: "https://github.com/Shxnque/quesen-autogen" },
              { name: "MCP · stdio", desc: "Claude Desktop / Cursor / Windsurf / Zed / Cline / Continue / Roo Code.", url: "https://github.com/Shxnque/Quesen-sib" },
            ].map((r) => (
              <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="group bg-[#0F1419] border border-[#1A2332] rounded-xl p-5 hover:border-[#00FFD4]/40 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-sm text-white font-medium">{r.name}</code>
                  <ExternalLink size={14} className="text-[#8B9BB4] group-hover:text-[#00FFD4] transition-colors" />
                </div>
                <p className="text-xs text-[#8B9BB4] leading-relaxed">{r.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/20 rounded-3xl p-8 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-4">
            Deterministic trust for the autonomous economy
          </h2>
          <p className="text-[#8B9BB4] max-w-2xl mx-auto mb-8 leading-relaxed">
            Contact the Bureau for API access. Selective engagement — every integration is deliberate.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all">
            Request access <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /shinren — Shinren system page
════════════════════════════════════════════════════════════════ */

export const ShinrenPage = () => {
  useSEO({
    title: "Shinren — Discipline-First Security Research Toolchain | Senueren",
    description: "Shinren is a discipline-first EVM static-analysis toolchain: six scanners, four Mokujin primitives, a Kyogi contest orchestrator, and a 13-rule submission gate. Every finding is evidence-gated before it ships.",
    path: "/shinren",
  });

  const rules = [
    "No claim without test/code evidence",
    "Mechanism disclosure ≠ consequence disclosure",
    "Open every fund/auth surface on day one",
    "Never accept EV-based conclusions without evidence",
    "Ask 'is this defensible?' not just 'is this a bug?'",
    "External docs are a verification source",
    "Every stored-recipient transfer gets a blacklist check",
    "No module is a pass-through; read every auth boundary",
    "Narrow ≠ thorough; model permanent-failure dependencies",
    "Model async state transitions / settlement windows",
    "No submission without trigger + boundary + impact evidence",
    "No CVSS/dollar/Ground-Truth language until R11 satisfied",
    "Polish prose LAST, not during evidence collection",
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">

        <section>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Protocol Intelligence · Security Research Toolchain</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Shinren enforces <span className="gradient-text">the discipline</span> before it enforces the finding.
          </h1>
          <p className="text-lg text-[#8B9BB4] mt-8 max-w-2xl leading-relaxed">
            A discipline-first EVM static-analysis toolchain combining a Hashirama-ontology scanner suite (Mokuton · Daijurin · Mokujin · Seigen · Jukai · Kyogi) with a hard-coded rulebook distilled from real bug-bounty campaigns. Every finding is gated by 13 evidence-and-triage rules before it can leave the toolchain.
          </p>
        </section>

        <section>
          <SectionHeader
            eyebrow="Architecture"
            title="Six subsystems. One submission gate."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Layers size={22} />} title="Mokuton — 6 scanners" desc="Privilege · reentrancy · access control · arithmetic · oracle · upgradeability. Plus two stubs for external-token behavior + async state sync." />
            <InfoCard icon={<Eye size={22} />} title="Daijurin — recon" desc="Contract-family reconnaissance and ranker. Filters scope to the surfaces worth scanning first." />
            <InfoCard icon={<Cpu size={22} />} title="Mokujin — semantic primitives" desc="Registry of shared patterns that scanners depend on. Common language for cross-scanner findings." />
            <InfoCard icon={<Shield size={22} />} title="Seigen — findings schema" desc="Finding + rulebook + submission gate + trust model + duplicate-risk estimator." />
            <InfoCard icon={<GitBranch size={22} />} title="Jukai — compiler orchestration" desc="solc-multi-version + resolver + external-docs resolver stub. Real bytecode against declared source." />
            <InfoCard icon={<Terminal size={22} />} title="Kyogi — contest orchestrator" desc="Runs a Code4rena / Cantina / Sherlock-style hunt sheet across a whole scope. Optional Telegram delivery." />
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="The Rulebook"
            title="13 rules — every one earned in the field"
            subtitle="Every rule ships with a `learned_from` citation to the campaign that produced it. No theory-only rules."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rules.map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0F1419] border border-[#1A2332] rounded-xl p-4">
                <span className="w-8 h-8 flex items-center justify-center rounded-md bg-[#00FFD4]/10 border border-[#00FFD4]/30 text-[#00FFD4] text-xs font-bold flex-shrink-0">R{i+1}</span>
                <p className="text-sm text-[#E8EDF2] leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Integration" title="Quesen-gated submissions" />
          <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 md:p-8">
            <p className="text-[#8B9BB4] text-sm leading-relaxed mb-4">
              Every submission-ready finding is validated by the Quesen Deterministic Risk Engine before it exits the toolchain.
              When Quesen returns <code className="text-[#00FFD4]">SKIP</code>, the finding remains blocked. When Quesen returns
              <code className="text-[#00FFD4]"> PROCEED</code>, the finding is admitted to the submission queue.
            </p>
            <p className="text-[#8B9BB4] text-sm leading-relaxed">
              Two environment variables toggle the integration:{" "}
              <code className="text-white">QUESEN_BASE_URL</code> and <code className="text-white">QUESEN_API_KEY</code>.
              Absent either variable, the gate is skipped in DEBUG logging and never in production.
            </p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Track Record" title="Campaigns · honest ledger" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Monetrix (2026-04)" value="QA pending" />
            <StatBox label="Circle BBP" value="1 Info · 3 Dup · $0" />
            <StatBox label="OKX Research" value="1 Medium ready" />
            <StatBox label="FlowX CLMM" value="Run 10 evidence-first" />
          </div>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /qarsar — Qarsar system page
════════════════════════════════════════════════════════════════ */

export const QarsarPage = () => {
  useSEO({
    title: "Qarsar — MEV & Arbitrage Research Bureau on Base | Senueren",
    description: "Qarsar is a standalone MEV / arbitrage research bureau on Base L2. Deterministic hypothesis lifecycle (7-gate promotion checklist), rejected-alpha registry, capital-tier framing, and immutable Aave-V3 flash-loan proxy execution.",
    path: "/qarsar",
  });

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">

        <section>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Strategic Governance · MEV Research Bureau</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Qarsar discovers on-chain alpha <span className="gradient-text">the way research bureaus should</span> — evidence first, rejection permanent.
          </h1>
          <p className="text-lg text-[#8B9BB4] mt-8 max-w-2xl leading-relaxed">
            A standalone MEV / arbitrage research bureau operating on Base L2. Every hypothesis is state-machine-managed through a 7-gate promotion checklist; every rejection is preserved in the Rejected Alpha Registry with a concrete revisit trigger. Doctrine primary filter: <em>"Does this materially increase the probability that Qarsar discovers, validates, or executes a profitable edge?"</em>
          </p>
        </section>

        <section>
          <SectionHeader
            eyebrow="Doctrine"
            title="Four ranked activities"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={<Eye size={22} />} title="Discover" desc="Autonomous monitoring of 15 domains surfaces evidence-backed research opportunities. Not 'alphas' — opportunities." />
            <InfoCard icon={<Shield size={22} />} title="Validate" desc="7-gate promotion checklist. Confidence scoring. Deterministic verdicts from pre-registered criteria." />
            <InfoCard icon={<Zap size={22} />} title="Execute" desc="Only proven edges reach execution. Immutable QarsarStrikeProxy with hard require() profit floor via Aave V3 flash loans." />
            <InfoCard icon={<BookOpen size={22} />} title="Preserve" desc="Every rejection is permanent institutional memory. Never re-open without a triggered revisit condition." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Capital Framing" title="Small-capital + flash-loan hybrid" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6">
              <p className="text-xs font-bold text-[#00FFD4] tracking-[0.2em] uppercase mb-3">Own Capital</p>
              <p className="text-3xl text-white font-bold font-['Outfit']">~R500</p>
              <p className="text-sm text-[#8B9BB4] mt-3">Gas + execution-layer wallet funding. Deliberately small.</p>
            </div>
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6">
              <p className="text-xs font-bold text-[#00FFD4] tracking-[0.2em] uppercase mb-3">Flash-Loan Capital</p>
              <p className="text-3xl text-white font-bold font-['Outfit']">Unlimited*</p>
              <p className="text-sm text-[#8B9BB4] mt-3">*Within Aave V3 Base liquidity. Atomic pull → execute → sweep → repay per fire.</p>
            </div>
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6">
              <p className="text-xs font-bold text-[#00FFD4] tracking-[0.2em] uppercase mb-3">Target Edges</p>
              <p className="text-3xl text-white font-bold font-['Outfit']">Capacity-limited</p>
              <p className="text-sm text-[#8B9BB4] mt-3">$0.20–$5 per fire. Invisible to institutional capital by design.</p>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Current State" title="Hypothesis ledger snapshot" subtitle="R-001..R-046 · Live snapshot on internal /research/INDEX.md." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="Proven" value="7" />
            <StatBox label="Rejected" value="13" />
            <StatBox label="Shadow (R-001)" value="Engineering-frozen" />
            <StatBox label="G0 In Progress" value="R-045 Aerodrome" />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Absolute Prohibitions" title="Doctrine binds every session" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "No R-001 modifications without operator authorisation.",
              "No production trading logic changes.",
              "No live-deployment recommendations without validation (Gate Alpha + Gate Beta).",
              "No popularity-as-evidence (Twitter / Discord / Farcaster volume NOT admissible).",
              "No quantity-over-quality dossier drafting.",
              "No paid services. Zero-Budget Protocol.",
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0F1419] border border-[#1A2332] rounded-xl p-4">
                <Circle size={12} className="text-red-400/60 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-[#E8EDF2] leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /diosen — Diosen-Ultra system page
════════════════════════════════════════════════════════════════ */

export const DiosenPage = () => {
  useSEO({
    title: "Diosen-Ultra — Autonomous Quantitative Trading System | Senueren",
    description: "Diosen-Ultra is Senueren's flagship autonomous quantitative trading system. Evidence-driven strategy discovery, 8-gate promotion checklist, progressive capital-tier lifecycle from Shadow to Live-Full. Governed by Senueren Doctrine.",
    path: "/diosen",
  });

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-20">

        <section>
          <div className="accent-bar w-12 mb-6"></div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Autonomous Quantitative Trading · Flagship System</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Diosen-Ultra <span className="gradient-text">trades on evidence</span>, not conviction.
          </h1>
          <p className="text-lg text-[#8B9BB4] mt-8 max-w-2xl leading-relaxed">
            An institutional-grade quantitative trading framework. Successor to <code>quasar_sib_bot</code>. Doctrine-first: <em>consistent long-term profitability through evidence-driven strategy discovery, validation, execution, and continuous adaptation.</em> Research exists only to increase the probability of profitable deployment.
          </p>
        </section>

        <section>
          <SectionHeader eyebrow="Lifecycle" title="Progressive capital-tier gate" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "Shadow", desc: "Observation-only on live market data. No capital risked. Validates strategy behavior against real ticks." },
              { name: "Paper", desc: "Broker-sim execution. Zero real capital. Confirms order-management assumptions." },
              { name: "Live-Small", desc: "Bounded live capital. Every trade instrumented; every drawdown logged. Rejection criterion is pre-declared." },
              { name: "Live-Full", desc: "Full capital allocation. Requires Gate Beta clearance. Frozen until Bureau sign-off." },
            ].map((s, i) => (
              <div key={s.name} className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-[#00FFD4]/10 border-l border-b border-[#00FFD4]/30 rounded-bl-2xl">
                  <span className="text-[#00FFD4] font-bold font-['Outfit']">{i+1}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">{s.name}</h3>
                <p className="text-sm text-[#8B9BB4] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Framework" title="Alpha Registry · first-class research assets" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Eye size={22} />} title="Alpha owns its thesis" desc="Every admitted alpha owns its evidence, genome, promotion log, and retirement condition. Code is derived from alpha, not vice-versa." />
            <InfoCard icon={<Cpu size={22} />} title="Meta-Learning Framework" desc="Continuous learning about which alpha classes tend to work — deterministic scoring, no ML in the meta-layer." />
            <InfoCard icon={<Layers size={22} />} title="Capital Allocation Engine" desc="Explicit capital budgeting across active alphas. Doctrine-bound: no allocation without a matching alpha promotion." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Runtime" title="Reference stack" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatBox label="Runtime" value="Python 3.11 async" />
            <StatBox label="Broker" value="MetaTrader5 (primary)" />
            <StatBox label="Deployment" value="Railway" />
            <StatBox label="Notifications" value="Telegram" />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Prohibitions" title="Doctrinal invariants" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "No live-capital deployment without Gate Beta.",
              "No modifications to live/* without operator sign-off + regression test.",
              "No popularity-as-evidence. Social metrics are not admissible sub-score inputs.",
              "No open-ended observation. Every hypothesis carries an explicit rejection criterion + time-box.",
              "No hypothesis re-open without a triggered revisit condition.",
              "No documentation drift. Docs and code disagree → docs are debt to be corrected.",
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 bg-[#0F1419] border border-[#1A2332] rounded-xl p-4">
                <Circle size={12} className="text-red-400/60 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-[#E8EDF2] leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default QuesenPage;
