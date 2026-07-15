import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ArrowUpRight, Shield, ExternalLink, Layers,
  Terminal, Code2, Zap, Cpu, Network, GitBranch, BookOpen,
  ChevronRight, Server, Lock, Eye, Activity, LineChart, Compass,
  Radar, Binary, Boxes, Sparkles
} from "lucide-react";

/**
 * System detail pages — /quesen /shinren /qarsar /diosen.
 *
 * PUBLIC surface. Every string in this file has been reviewed against the
 * public-safe whitelist. Internal doctrine language, production endpoints,
 * capital figures, campaign names, broker names, and enshrine internals are
 * kept in the sovereign repo and never rendered here.
 *
 * Aesthetic: deep navy background, blue-to-emerald gradient accents,
 * institutional restraint. No mascots, no exposed URLs.
 */

/* ── SEO helper ── */
const useSEO = ({ title, description, path = "/" }) => {
  useEffect(() => {
    const SITE_URL = "https://senueren.co.za";
    const fullUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
    document.title = title;
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
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[property="og:url"]', "content", fullUrl);
    setMeta('meta[name="twitter:url"]', "content", fullUrl);
    setMeta('link[rel="canonical"]', "href", fullUrl);
  }, [title, description, path]);
};

/* ── Section primitives ── */

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-14">
    <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
    <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && (
      <p className="text-[#94A3B8] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>
    )}
  </div>
);

const InfoCard = ({ icon, title, desc }) => (
  <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/30 transition-colors duration-300 h-full backdrop-blur">
    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{title}</h3>
    <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
  </div>
);

const CodeBlock = ({ children }) => (
  <pre className="bg-[#050B1A]/80 border border-white/[0.06] rounded-xl p-5 overflow-x-auto text-xs md:text-sm text-[#E2E8F0] leading-relaxed backdrop-blur">
    <code>{children}</code>
  </pre>
);

const StatusBadge = () => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#10B981]">
    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
    Operational
  </div>
);

const PillGroup = ({ items }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((it) => (
      <span key={it} className="px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#CBD5E1]">
        {it}
      </span>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════════
   /quesen
════════════════════════════════════════════════════════════════ */

export const QuesenPage = () => {
  useSEO({
    title: "Quesen — Deterministic Risk Infrastructure for Autonomous Agents | Senueren",
    description: "Quesen is a deterministic decision infrastructure for autonomous agents. Same input, same decision — no LLM in the scoring path, fully replayable audit trail. Trusted by autonomous systems that cannot afford probabilistic risk.",
    path: "/quesen",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* Hero */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <StatusBadge />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Risk Engineering</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            The deterministic decision layer
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              for autonomous systems.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            Quesen answers one question for every autonomous agent — <em>should this action proceed?</em>
            No LLM in the scoring path. No randomness. Every response is fully reproducible and audit-ready.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all">
              Request enterprise access <ArrowRight size={16} />
            </Link>
            <a href="https://github.com/Shxnque?tab=repositories&q=quesen" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-[#22D3EE]/40 text-[#E2E8F0] rounded-full font-semibold text-sm transition-all">
              View SDKs <ArrowUpRight size={14} />
            </a>
          </div>
        </section>

        {/* Why deterministic */}
        <section>
          <SectionHeader
            eyebrow="Positioning"
            title="Why deterministic trust matters."
            subtitle="Autonomous agents cannot delegate action-authority to a system they cannot audit. Every Quesen decision is reproducible in isolation."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Eye size={22} />} title="Fully transparent" desc="Every response includes the engine version and the exact decision parameters. Nothing hidden, nothing implied." />
            <InfoCard icon={<Lock size={22} />} title="No LLM in decisions" desc="Zero probabilistic scoring. Boolean predicates only. No hallucination surface, no drift, no silent regressions." />
            <InfoCard icon={<Server size={22} />} title="Byte-identical replays" desc="Regression-tested on every commit. Two calls with the same input return the same decision. Always." />
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <SectionHeader
            eyebrow="Capabilities"
            title="What ships today."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Shield size={22} />} title="Deterministic scoring" desc="Normalized-input decision engine combining structural, behavioural, and semantic signals via versioned rules." />
            <InfoCard icon={<GitBranch size={22} />} title="Conflict matrix" desc="An explicit, expanding set of adversarial-pattern predicates. Every trigger carries a stable ID and human-readable justification." />
            <InfoCard icon={<Network size={22} />} title="On-chain enrichment" desc="Optional, chain-agnostic enrichment across major EVM networks. Deterministic contract-state signals wired into the decision path." />
            <InfoCard icon={<Terminal size={22} />} title="MCP-native" desc="Native stdio server. Works out of the box with Claude Desktop, Cursor, Windsurf, Zed, Cline, Continue, and Roo Code." />
            <InfoCard icon={<Code2 size={22} />} title="Framework surfaces" desc="Python · JavaScript / TypeScript · LangChain / LangGraph · CrewAI · AutoGen · raw HTTP." />
            <InfoCard icon={<Layers size={22} />} title="Multi-tenant + metered" desc="Per-key pricing, per-minute rate limiting, isolated key registries. Zero external dependencies for scale." />
          </div>
        </section>

        {/* Three-line integration */}
        <section>
          <SectionHeader eyebrow="Integration" title="Three lines. Not more." subtitle="Identical pattern in every SDK. Stripe-style ergonomics, deterministic-agent posture." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-[#22D3EE] tracking-[0.2em] uppercase mb-3">Python</p>
              <CodeBlock>{`from quesen_sdk import QuesenClient

q = QuesenClient(api_key="…")

if q.validate(**signals).decision == "SKIP":
    return  # respect the deterministic answer`}</CodeBlock>
            </div>
            <div>
              <p className="text-xs font-semibold text-[#22D3EE] tracking-[0.2em] uppercase mb-3">JavaScript / TypeScript</p>
              <CodeBlock>{`import { QuesenClient } from "quesen-sdk";

const q = new QuesenClient({ apiKey: process.env.QUESEN_API_KEY });

if ((await q.validate(signals)).decision === "SKIP") return;`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Public SDK repos */}
        <section>
          <SectionHeader eyebrow="Distribution" title="Public SDK repositories." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: "quesen-sdk-py", desc: "Official Python SDK.", url: "https://github.com/Shxnque/quesen-sdk-py" },
              { name: "quesen-langchain", desc: "LangChain / LangGraph tool integration.", url: "https://github.com/Shxnque/quesen-langchain" },
              { name: "quesen-crewai", desc: "CrewAI tool integration.", url: "https://github.com/Shxnque/quesen-crewai" },
              { name: "quesen-autogen", desc: "AutoGen v0.4+ function-tool integration.", url: "https://github.com/Shxnque/quesen-autogen" },
              { name: "quesen-sdk-js", desc: "JavaScript / TypeScript SDK — public release upcoming. Enterprise early-access available on request.", url: "/contact" },
              { name: "MCP · stdio", desc: "Native server for Claude Desktop, Cursor, Windsurf, Zed, Cline, Continue, Roo Code.", url: "https://github.com/Shxnque/quesen-sdk-py" },
            ].map((r) => (
              <a key={r.name} href={r.url} target={r.url.startsWith("http") ? "_blank" : undefined} rel={r.url.startsWith("http") ? "noreferrer" : undefined} className="group bg-[#0B1424]/70 border border-white/[0.06] rounded-xl p-5 hover:border-[#22D3EE]/40 transition-all backdrop-blur">
                <div className="flex items-start justify-between mb-2">
                  <code className="text-sm text-white font-medium">{r.name}</code>
                  <ExternalLink size={14} className="text-[#94A3B8] group-hover:text-[#22D3EE] transition-colors" />
                </div>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{r.desc}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-10 md:p-16 text-center bg-gradient-to-br from-[#0B1424] via-[#0D1E3A] to-[#052E2E]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 60%)" }} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Selective engagement</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-['Outfit'] mb-5 max-w-3xl mx-auto">
              Enterprise & institutional access is by conversation.
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
              Every integration is deliberate. We prioritise partners whose autonomous systems cannot afford probabilistic risk.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
              Start a conversation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /shinren
════════════════════════════════════════════════════════════════ */

export const ShinrenPage = () => {
  useSEO({
    title: "Shinren — Security Research Infrastructure for On-Chain Systems | Senueren",
    description: "Shinren is Senueren's security research infrastructure for autonomous on-chain systems. Evidence-first analysis, discipline-driven findings pipeline, gated on-chain triage.",
    path: "/shinren",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <StatusBadge />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Protocol Intelligence</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Security research infrastructure
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              for the autonomous on-chain economy.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            Shinren is Senueren's discipline-first analysis toolchain for on-chain protocols and autonomous smart-contract systems.
            Every finding is evidence-gated before it reaches a customer.
          </p>
        </section>

        <section>
          <SectionHeader eyebrow="Architecture" title="An analysis stack, not a scanner." subtitle="Composable subsystems that plug into a single, evidence-first findings pipeline." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Radar size={22} />} title="Reconnaissance" desc="Automated scope profiling — contract family recognition and surface prioritisation before any deep analysis." />
            <InfoCard icon={<Binary size={22} />} title="Static analysis" desc="Multi-domain scanner suite covering privilege, reentrancy, access control, arithmetic, oracle exposure, and upgradeability." />
            <InfoCard icon={<Boxes size={22} />} title="Shared primitives" desc="Registry of semantic patterns so every scanner speaks a common language and findings compose cleanly." />
            <InfoCard icon={<Shield size={22} />} title="Findings schema" desc="Structured finding format with trust modelling and duplication-risk estimation. No noise reaches the report." />
            <InfoCard icon={<GitBranch size={22} />} title="Compilation orchestration" desc="Multi-version compiler management with source-vs-bytecode verification. Real bytecode against declared source." />
            <InfoCard icon={<Terminal size={22} />} title="Campaign orchestrator" desc="Runs a full-scope research campaign end-to-end. Optional operator notifications; discipline stays inside the toolchain." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Discipline" title="Every finding is earned." subtitle="Findings are gated by a fixed evidence rulebook before they enter the submission queue. Claim without evidence is not admissible." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={<Compass size={22} />} title="Evidence over conviction" desc="No finding ships without on-chain trigger, boundary condition, and impact evidence. Theory-only claims are rejected inside the toolchain." />
            <InfoCard icon={<Sparkles size={22} />} title="Defensibility gate" desc="Every submission passes a defensibility review — 'is this defensible to a protocol team?' — before it leaves." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Integration" title="Wired to Quesen." subtitle="Every submission-ready finding is validated by Quesen's deterministic decision engine before it exits the toolchain." />
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-8 backdrop-blur">
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Findings that Quesen returns <code className="text-[#22D3EE] px-1">SKIP</code> stay blocked pending revision.
              Findings that clear the gate enter the submission queue with a full audit trail. The result: fewer, higher-signal deliverables.
            </p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Engagement" title="Who this is for." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<Shield size={22} />} title="Protocol teams" desc="Pre-audit surface mapping, ongoing safety monitoring, deployment-gate reviews." />
            <InfoCard icon={<Eye size={22} />} title="Security consortia" desc="Discipline-first triage layer between raw findings and public disclosure." />
            <InfoCard icon={<Layers size={22} />} title="Autonomous agent operators" desc="Pre-flight validation on any contract an agent is about to interact with." />
          </div>
          <div className="mt-10">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all">
              Request briefing <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /qarsar
════════════════════════════════════════════════════════════════ */

export const QarsarPage = () => {
  useSEO({
    title: "Qarsar — Autonomous On-Chain Opportunity Discovery | Senueren",
    description: "Qarsar is Senueren's autonomous discovery and execution infrastructure for on-chain economic opportunities. Evidence-first hypothesis lifecycle. Deterministic promotion gates. Selective deployment.",
    path: "/qarsar",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <StatusBadge />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Strategic Governance</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Discovery infrastructure
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              for the on-chain economy.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            Qarsar continuously surveys the on-chain landscape for measurable economic opportunities.
            Every candidate is processed through a deterministic hypothesis lifecycle. Deployment is selective, evidence-gated, and reversible.
          </p>
        </section>

        <section>
          <SectionHeader eyebrow="Method" title="Discover · Validate · Execute · Preserve." subtitle="A closed-loop research process. Rejected candidates are preserved permanently to prevent institutional memory loss." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InfoCard icon={<Radar size={22} />} title="Discover" desc="Autonomous monitoring surfaces evidence-backed candidates from a broad landscape of on-chain domains." />
            <InfoCard icon={<Shield size={22} />} title="Validate" desc="Multi-gate promotion checklist. Deterministic verdicts from pre-registered criteria. Confidence is measured, not asserted." />
            <InfoCard icon={<Zap size={22} />} title="Execute" desc="Only cleared opportunities reach deployment. Execution paths are atomic and profit-floor gated." />
            <InfoCard icon={<BookOpen size={22} />} title="Preserve" desc="Every rejection carries an explicit revisit condition. No hypothesis is ever silently re-opened." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Discipline" title="Evidence, not conviction." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoCard icon={<Eye size={22} />} title="No popularity signals" desc="Social-media volume is not admissible evidence. Every promotion requires reproducible on-chain data." />
            <InfoCard icon={<Compass size={22} />} title="Bounded exploration" desc="Every hypothesis carries a rejection criterion and a time-box. Open-ended observation is not permitted." />
            <InfoCard icon={<Lock size={22} />} title="Deterministic gates" desc="Promotion criteria are declared before evidence is collected. No moving targets, no post-hoc rationalisation." />
            <InfoCard icon={<Sparkles size={22} />} title="Institutional memory" desc="The rejection ledger is permanent. Institutional forgetting is treated as a bug." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Positioning" title="Where Qarsar operates." />
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-8 md:p-10 backdrop-blur">
            <p className="text-[#94A3B8] text-sm md:text-base leading-relaxed">
              Qarsar targets the capacity-limited edges that are structurally invisible to large capital pools.
              Its edge is discipline: evidence-first hypothesis management, permanent rejection registry, and deterministic promotion gates —
              not raw throughput or capital scale.
            </p>
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Access" title="Institutional partnerships only." />
          <p className="text-[#94A3B8] max-w-2xl mb-8 leading-relaxed">
            Qarsar is not a retail product. Partnerships are limited to institutional research programmes and internal Senueren operations.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all">
            Enquire about partnership <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════
   /diosen
════════════════════════════════════════════════════════════════ */

export const DiosenPage = () => {
  useSEO({
    title: "Diosen — Quantitative Intelligence System | Senueren",
    description: "Diosen is Senueren's institutional-grade quantitative intelligence system. Evidence-driven research, simulation, optimisation, and decision support. Progressive validation lifecycle with deterministic promotion gates at every step.",
    path: "/diosen",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <StatusBadge />
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Quantitative Intelligence System</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Institutional quantitative intelligence
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              built to reason on evidence.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            Diosen is Senueren's institutional-grade quantitative intelligence infrastructure.
            Research, simulation, optimisation, and decision-support flow through a progressive validation lifecycle with explicit promotion criteria at every stage. Every conclusion is reproducible; every deployment is reversible.
          </p>
        </section>

        <section>
          <SectionHeader eyebrow="Lifecycle" title="Progressive validation gates." subtitle="No hypothesis skips a stage. Every promotion requires pre-declared, reproducible evidence." />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: "Observation", desc: "Hypotheses run against live market data with no capital exposure. Behavioural evidence and signal quality are measured before commitment." },
              { name: "Simulation", desc: "Broker-simulated execution and full-stack replay. Zero real capital. Confirms operational assumptions, latency, and order-management behaviour." },
              { name: "Bounded operation", desc: "Limited capital-committed operation with pre-declared exit thresholds. Every action instrumented and audit-logged." },
              { name: "Full deployment", desc: "Full capital allocation under continuous monitoring. Reversible on any material deviation from pre-declared invariants." },
            ].map((s, i) => (
              <div key={s.name} className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden backdrop-blur">
                <div className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/10 text-[#22D3EE] text-xs font-bold">{i + 1}</div>
                <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">{s.name}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Framework" title="A hypothesis is a research asset." subtitle="Every hypothesis owns its evidence, promotion history, and retirement condition. Implementation follows research — never the reverse." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoCard icon={<LineChart size={22} />} title="Evidence-owned" desc="Every hypothesis carries its full research provenance. Nothing advances on intuition." />
            <InfoCard icon={<Cpu size={22} />} title="Meta-learning" desc="Continuous learning about which hypothesis classes tend to persist. Deterministic scoring; no black-box models in the meta-layer." />
            <InfoCard icon={<Layers size={22} />} title="Explicit allocation" desc="Capital and compute allocation is explicit, versioned, and gated on promotion. No implicit exposure." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Capabilities" title="What Diosen produces." subtitle="Quantitative intelligence has many faces. Diosen is designed to occupy the space where measurable evidence meets institutional decision-making." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <InfoCard icon={<Radar size={22} />} title="Market research" desc="Continuous quantitative research across mandate-relevant markets. Findings are structured, reproducible, and versioned." />
            <InfoCard icon={<Compass size={22} />} title="Forecasting & simulation" desc="Scenario simulation, stress testing, and forward-looking modelling grounded in reproducible data pipelines." />
            <InfoCard icon={<Zap size={22} />} title="Portfolio & strategy" desc="Portfolio construction, strategy discovery, and capital-allocation intelligence with explicit promotion criteria." />
            <InfoCard icon={<Shield size={22} />} title="Execution intelligence" desc="When execution is in scope, operational behaviour is instrumented end-to-end and gated on the same evidence rubric." />
            <InfoCard icon={<BookOpen size={22} />} title="Decision support" desc="Institutional decision packets — evidence, uncertainty, and recommendations rendered in a format built for review, not for hype." />
            <InfoCard icon={<Eye size={22} />} title="Observability" desc="Every stage is inspectable. Every deployment produces a signal trail. Documentation drift is treated as a defect." />
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Discipline" title="Non-negotiable invariants." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "No capital deployment without full-gate clearance.",
              "No popularity signals — social metrics are not admissible research inputs.",
              "No open-ended observation. Every hypothesis has an explicit rejection criterion.",
              "No hypothesis re-opens without a triggered revisit condition.",
              "Documentation drift is a defect, not a nuisance.",
              "Every deployment is reversible on material deviation.",
            ].map((r) => (
              <div key={r} className="flex items-start gap-3 bg-[#0B1424]/70 border border-white/[0.06] rounded-xl p-4 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] mt-2 flex-shrink-0" />
                <p className="text-sm text-[#E2E8F0] leading-relaxed">{r}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader eyebrow="Access" title="Selective institutional engagement." />
          <p className="text-[#94A3B8] max-w-2xl mb-8 leading-relaxed">
            Diosen is not a licensable retail product. It operates under selective institutional engagement and inside the Senueren research portfolio. Enterprise access is by conversation.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all">
            Discuss a partnership <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default QuesenPage;
