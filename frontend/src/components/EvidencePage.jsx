import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ExternalLink, GitMerge, GitPullRequest, Flag, Eye,
  ShieldCheck, Cpu, Terminal, Boxes, Network, ScrollText, Activity,
  CheckCircle2, Hash, GitBranch, MessageSquare, ChevronRight
} from "lucide-react";

/**
 * /evidence  Senueren External Engineering & Ecosystem Evidence.
 *
 * PUBLIC surface. Every entry here is EVIDENCE-BASED and verified against live
 * GitHub state before publication. Statuses use a controlled, deterministic
 * vocabulary (Merged / PR Open / Claimed / Discussion / Assist), never
 * collapsed or inflated. Mirrors Quesen's own doctrine: the reputation layer
 * is itself auditable. Source of truth: BEA (sib-bureau-external-affairs)
 * portfolio records.
 *
 * NO customer traction, pilots, or revenue are claimed. We do not pretend to
 * have adoption we have not earned.
 */

const HEALTH_BASE = "https://web-production-aa5ba.up.railway.app";
const SITE_URL = "https://senueren.co.za";

/* ── SEO ── */
const useSEO = ({ title, description, path = "/evidence" }) => {
  useEffect(() => {
    const fullUrl = `${SITE_URL}${path}`;
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

/* Controlled status vocabulary: deterministic, never collapsed */
const STATUS = {
  MERGED:      { label: "Merged",        color: "#34D399", bg: "rgba(52,211,153,0.10)", border: "rgba(52,211,153,0.30)", icon: <GitMerge size={13} /> },
  PR_OPEN:     { label: "PR Open",       color: "#22D3EE", bg: "rgba(34,211,238,0.10)", border: "rgba(34,211,238,0.30)", icon: <GitPullRequest size={13} /> },
  CLAIMED:     { label: "Claimed",       color: "#FBBF24", bg: "rgba(251,191,36,0.10)", border: "rgba(251,191,36,0.30)", icon: <Flag size={13} /> },
  ASSIST:      { label: "Design Assist", color: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.30)", icon: <CheckCircle2 size={13} /> },
  DISCUSSION:  { label: "Discussion",    color: "#94A3B8", bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.28)", icon: <MessageSquare size={13} /> },
};

const StatusChip = ({ s }) => {
  const cfg = STATUS[s];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase"
      style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
      data-testid={`evidence-status-${cfg.label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {cfg.icon}{cfg.label}
    </span>
  );
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10">
    <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
    <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && <p className="text-[#94A3B8] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

/* ── VERIFIED external contributions (live GitHub state @ 2026-08-16) ── */
const CONTRIBUTIONS = [
  {
    repo: "dheerajjha/mcp-migrate", ref: "#246", bureau: "Quesen", status: "MERGED",
    title: "Warn on unrecognised top-level config keys (closes #235)",
    detail: "A linter whose proposition is a trustworthy grade silently dropped misspelled/mis-nested config keys. Reproduced three real failure shapes, converted silent drops into targeted warnings with difflib “did you mean” hints, and fixed a pre-existing Rich-markup escaping bug.",
    metrics: ["+123 / 3 files", "8 new tests", "698-test suite green"],
    url: "https://github.com/dheerajjha/mcp-migrate/pull/246",
  },
  {
    repo: "agentguard-ai/tealtiger", ref: "#453", bureau: "Quesen", status: "PR_OPEN",
    title: "Deterministic KYC Decision Agent (Quesen-shaped)",
    detail: "A make_decision(identity, sanctions, risk) surface built to Quesen invariants: no LLM in the scoring loop, canonicalised inputs SHA-256 hashed onto the audit record, POLICY_VERSION stamped on every decision, sanctions veto, identity-confidence floor, and named escalation reasons. Submitted into Agent Guard’s agent-governance SDK.",
    metrics: ["+630 / 10 files", "15 offline tests (30ms)", "review-gated"],
    url: "https://github.com/agentguard-ai/tealtiger/pull/453",
  },
  {
    repo: "codexbt/cortex", ref: "#27", bureau: "Quesen", status: "MERGED",
    title: "MCP TransportInterface + Stdio / SSE / StreamableHTTP",
    detail: "Introduced a clean transport abstraction for the MCP client stack, the foundation for closing the upstream transport tracking issue.",
    metrics: ["+1,141 / 9 files", "merged from draft"],
    url: "https://github.com/codexbt/cortex/pull/27",
  },
  {
    repo: "codexbt/cortex", ref: "#28", bureau: "Quesen", status: "MERGED",
    title: "MCPClientManager refactor + spec conformance",
    detail: "Refactored MCPClientManager onto the TransportInterface and fixed MCP-spec notifications/initialized conformance. Closed upstream issue #3 via the merge.",
    metrics: ["+522 / -135", "closed issue #3"],
    url: "https://github.com/codexbt/cortex/pull/28",
  },
  {
    repo: "thingctx/thingctx", ref: "#98", bureau: "Quesen", status: "CLAIMED",
    title: "Cover untested retry paths in reliability.py",
    detail: "Reliability path coverage claimed with the maintainer. Held at claim per protocol. No PR is published until the maintainer confirms, so the public status stays exactly “Claimed.”",
    metrics: ["issue open", "PR intentionally held"],
    url: "https://github.com/thingctx/thingctx/issues/98",
  },
  {
    repo: "omnigent-ai/omnigent", ref: "#4191", bureau: "Quesen", status: "ASSIST",
    title: "MCP initialize.instructions → system prompt",
    detail: "Our design (#4038) was implemented upstream by the maintainer, crediting Senueren; we delivered the invited code review. Filed as an assist, not claimed as our commit.",
    metrics: ["design credited", "review delivered"],
    url: "https://github.com/omnigent-ai/omnigent/pull/4191",
  },
];

/* ── Quesen live decision model ── */
const VERDICTS = [
  { k: "PROCEED", color: "#34D399", desc: "Risk below the review threshold. The action may execute." },
  { k: "REVIEW",  color: "#FBBF24", desc: "Risk between thresholds. Route to a human / secondary gate before execution." },
  { k: "SKIP",    color: "#F87171", desc: "Risk at or above the skip threshold. Do not execute the proposed action." },
];

const RESPONSE_FIELDS = [
  { f: "decision", d: "PROCEED · REVIEW · SKIP" },
  { f: "risk_score", d: "0.0 to 1.0, deterministic" },
  { f: "confidence", d: "0.0 to 1.0" },
  { f: "conflict_triggers[]", d: "stable rule IDs that fired" },
  { f: "engine_version", d: "e.g. 1.10.0" },
  { f: "weights / thresholds", d: "exact snapshot used" },
  { f: "input_snapshot_hash", d: "SHA-256 canonical JSON, replays any verdict" },
  { f: "request_id / commit_sha", d: "traceable to engine build" },
];

/* ── Live engine probe (real /health + /version) ── */
const EngineProbe = () => {
  const [state, setState] = useState({ status: "loading", version: null, schema: null, thresholds: null, weights: null, latency: null });
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    (async () => {
      try {
        const t0 = performance.now();
        const h = await fetch(`${HEALTH_BASE}/health`, { signal: controller.signal, cache: "no-store" });
        const t1 = performance.now();
        if (!h.ok) throw new Error("health");
        let version = null, schema = null, thresholds = null, weights = null;
        try {
          const v = await fetch(`${HEALTH_BASE}/version`, { signal: controller.signal, cache: "no-store" });
          if (v.ok) {
            const j = await v.json();
            version = j.engine_version || null;
            schema = j.report_schema_version || null;
            thresholds = j.thresholds || null;
            weights = j.weights || null;
          }
        } catch { /* /version decorative */ }
        if (!alive) return;
        setState({ status: "live", version, schema, thresholds, weights, latency: Math.max(1, Math.round(t1 - t0)) });
      } catch {
        if (!alive) return;
        setState((s) => ({ ...s, status: "unreachable" }));
      }
    })();
    return () => { alive = false; controller.abort(); };
  }, []);

  const dot = state.status === "live" ? "#34D399" : state.status === "unreachable" ? "#F87171" : "#94A3B8";
  const label = state.status === "live" ? "Live" : state.status === "unreachable" ? "Unreachable" : "Checking";

  return (
    <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 md:p-7 backdrop-blur" data-testid="evidence-engine-probe">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />
            {state.status === "live" && <span className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: dot, opacity: 0.5 }} />}
          </span>
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#64748B]">Canonical engine</p>
            <p className="text-white font-semibold text-sm" data-testid="evidence-engine-status">{label}{state.version ? ` · v${state.version}` : ""}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-right">
          <div><p className="text-[10px] tracking-[0.2em] uppercase text-[#64748B]">Schema</p><p className="text-[#E2E8F0] text-sm font-medium">{state.schema ? `v${state.schema}` : "…"}</p></div>
          <div><p className="text-[10px] tracking-[0.2em] uppercase text-[#64748B]">Latency</p><p className="text-[#E2E8F0] text-sm font-medium">{state.latency ? `${state.latency} ms` : "…"}</p></div>
        </div>
      </div>
      {(state.thresholds || state.weights) && (
        <div className="mt-5 pt-5 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          {state.thresholds && (
            <div><p className="text-[10px] tracking-[0.18em] uppercase text-[#64748B] mb-1">Thresholds</p><p className="text-[#CBD5E1] font-mono">skip {state.thresholds.skip} · review {state.thresholds.review}</p></div>
          )}
          {state.weights && Object.entries(state.weights).map(([k, v]) => (
            <div key={k}><p className="text-[10px] tracking-[0.18em] uppercase text-[#64748B] mb-1">{k.replace(/_/g, " ")}</p><p className="text-[#CBD5E1] font-mono">{v}</p></div>
          ))}
        </div>
      )}
      <p className="mt-4 text-[11px] text-[#64748B] leading-relaxed">
        Fetched live from the canonical Quesen deployment in your browser. Same inputs return the same decision. These weights and thresholds are the exact snapshot the engine reports.
      </p>
    </div>
  );
};

/* ── Ecosystem distribution surfaces ── */
const ECOSYSTEM = [
  { name: "GitHub", icon: <GitBranch size={18} />, detail: "Public developer portal + 5 SDK / framework repos.", url: "https://github.com/Shxnque/quesen" },
  { name: "MCP Registry", icon: <Terminal size={18} />, detail: "Published to the official MCP registry as io.github.Shxnque/quesen (v1.10.0).", url: "https://glama.ai/mcp/connectors/io.github.Shxnque/quesen" },
  { name: "Glama", icon: <Boxes size={18} />, detail: "Listed as a Glama MCP connector with per-tool quality grades.", url: "https://glama.ai/mcp/connectors/io.github.Shxnque/quesen" },
  { name: "Smithery", icon: <Network size={18} />, detail: "MCP registry manifest (smithery.yaml) published in the portal.", url: "https://smithery.ai/servers/@shinque03/Quesen" },
  { name: "Hugging Face", icon: <Network size={18} />, detail: "Quesen MCP integration space (Qushxn/quesen-mcp).", url: "https://huggingface.co/Qushxn" },
  { name: "Awesome MCP Servers", icon: <GitBranch size={18} />, detail: "Submitted to the community index under Finance & Fintech.", url: "https://github.com/punkpeye/awesome-mcp-servers" },
];

/* ── Governance research themes (Quesen's model, tested against real systems) ── */
const GOVERNANCE = [
  "Authorization before action",
  "Decision / effect boundary",
  "Pre-action snapshots",
  "Claim scope & remedy semantics",
  "Caller-side companion receipts",
  "Reproducible pre-execution verdicts",
];

const EvidencePage = () => {
  useSEO({
    title: "Engineering Evidence, Verified External Work | Senueren",
    description: "Senueren’s verified external engineering: merged upstream contributions, open PRs, and Quesen’s live deterministic decision layer. Every status audited against live GitHub state. No inflated claims.",
    path: "/evidence",
  });

  const merged = CONTRIBUTIONS.filter((c) => c.status === "MERGED").length;
  const open = CONTRIBUTIONS.filter((c) => c.status === "PR_OPEN").length;

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* Hero */}
        <section>
          {/* Breadcrumb ties this page to the Quesen system */}
          <div className="flex items-center gap-2 mb-5 text-[11px] font-semibold tracking-[0.18em] uppercase" data-testid="evidence-breadcrumb">
            <Link to="/quesen" className="text-[#22D3EE] hover:text-[#34D399] transition-colors">Quesen</Link>
            <ChevronRight size={12} className="text-[#334155]" />
            <span className="text-[#64748B]">Evidence</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#10B981]">
              <ScrollText size={13} /> Evidence first
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Engineering Evidence</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            We don’t just ship internal systems.
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              We contribute, audit, and prove it in the open.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            This is the public record behind{" "}
            <Link to="/quesen" className="text-[#22D3EE] hover:text-[#34D399] transition-colors font-medium">Quesen</Link>{" "}
            and{" "}
            <Link to="/shinren" className="text-[#22D3EE] hover:text-[#34D399] transition-colors font-medium">Shinren</Link>,
            the deterministic decision and security research systems built by Senueren. We harden them against real
            world failure modes by fixing upstream agent infrastructure, reviewing implementations, and testing
            governance in public. Every entry below is verified against live GitHub state, with a controlled status
            that is never inflated.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-testid="evidence-summary-chips">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[#34D399] bg-[#34D399]/10 border border-[#34D399]/25"><GitMerge size={13} /> {merged} merged upstream</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[#22D3EE] bg-[#22D3EE]/10 border border-[#22D3EE]/25"><GitPullRequest size={13} /> {open} open PRs</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[#94A3B8] bg-white/[0.03] border border-white/10"><Eye size={13} /> No customer traction claimed</span>
          </div>
        </section>

        {/* Layer 1: External contributions */}
        <section>
          <SectionHeader
            eyebrow="External contributions"
            title="Upstream engineering, verified."
            subtitle="Merged work, open PRs, and honestly held claims across the autonomous agent ecosystem. Statuses mirror live GitHub, so audit any link yourself."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {CONTRIBUTIONS.map((c) => (
              <a
                key={`${c.repo}${c.ref}`}
                href={c.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/40 transition-all backdrop-blur flex flex-col"
                data-testid={`evidence-contribution-${c.repo.split("/")[1]}-${c.ref.replace("#", "")}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <code className="text-sm text-white font-semibold break-all">{c.repo}<span className="text-[#22D3EE]">{c.ref}</span></code>
                    <span className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#64748B]">
                      <Cpu size={11} className="text-[#22D3EE]" /> {c.bureau} contribution
                    </span>
                  </div>
                  <StatusChip s={c.status} />
                </div>
                <h3 className="text-[15px] font-bold text-white font-['Outfit'] mb-2 leading-snug">{c.title}</h3>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed mb-4 flex-grow">{c.detail}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {c.metrics.map((m) => (
                    <span key={m} className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#CBD5E1] font-mono">{m}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] group-hover:gap-2.5 transition-all">
                  View on GitHub <ExternalLink size={12} />
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* Layer 2: Quesen evidence */}
        <section>
          <SectionHeader
            eyebrow="Quesen evidence"
            title="A live, deterministic decision layer."
            subtitle="Quesen answers one question before an agent executes a consequential action: should it proceed? The answer is reproducible and evidence bound, not a probability."
          />
          <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
            <div className="space-y-5">
              <EngineProbe />
              <div className="grid grid-cols-1 gap-3" data-testid="evidence-verdicts">
                {VERDICTS.map((v) => (
                  <div key={v.k} className="flex items-start gap-4 bg-[#0B1424]/70 border border-white/[0.06] rounded-xl p-4 backdrop-blur">
                    <span className="mt-0.5 px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide font-mono" style={{ color: v.color, backgroundColor: `${v.color}18`, border: `1px solid ${v.color}44` }}>{v.k}</span>
                    <p className="text-[13px] text-[#94A3B8] leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 md:p-7 backdrop-blur">
              <div className="flex items-center gap-2 mb-4">
                <Hash size={16} className="text-[#22D3EE]" />
                <h3 className="text-sm font-bold text-white font-['Outfit'] tracking-wide">Every decision returns a receipt</h3>
              </div>
              <p className="text-[13px] text-[#94A3B8] leading-relaxed mb-5">
                The production contract embeds the evidence to reconstruct any verdict in isolation. This is the
                shape of every <code className="text-[#22D3EE] px-1">/validate</code> response:
              </p>
              <div className="space-y-2.5">
                {RESPONSE_FIELDS.map((r) => (
                  <div key={r.f} className="flex items-baseline justify-between gap-4 border-b border-white/[0.05] pb-2.5 last:border-0">
                    <code className="text-[12px] text-[#E2E8F0] font-medium">{r.f}</code>
                    <span className="text-[11px] text-[#64748B] text-right">{r.d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <a href={`${HEALTH_BASE}/version`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] hover:underline"><Activity size={12} /> /version</a>
                <a href={`${HEALTH_BASE}/docs`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] hover:underline"><ExternalLink size={12} /> OpenAPI docs</a>
                <Link to="/quesen" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#94A3B8] hover:text-white"><Cpu size={12} /> Read Quesen</Link>
              </div>
            </div>
          </div>
        </section>

        {/* Layer 3: Ecosystem distribution */}
        <section>
          <SectionHeader
            eyebrow="Ecosystem distribution"
            title="Where Quesen is reachable."
            subtitle="Distribution surfaces where the deterministic decision layer is published and callable."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ECOSYSTEM.map((e) => (
              <a key={e.name} href={e.url} target="_blank" rel="noreferrer"
                className="group bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/40 transition-all backdrop-blur"
                data-testid={`evidence-ecosystem-${e.name.toLowerCase().replace(/\s+/g, "-")}`}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4">{e.icon}</div>
                <div className="flex items-center gap-1.5 mb-2">
                  <h3 className="text-base font-bold text-white font-['Outfit']">{e.name}</h3>
                  <ExternalLink size={12} className="text-[#64748B] group-hover:text-[#22D3EE] transition-colors" />
                </div>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed">{e.detail}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Layer 4: Governance research */}
        <section>
          <SectionHeader
            eyebrow="Governance research"
            title="The model, challenged in public."
            subtitle="Quesen’s governance model is refined through interaction with external technical actors. These are the boundaries we investigate and defend."
          />
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-8 md:p-10 backdrop-blur">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {GOVERNANCE.map((g) => (
                <div key={g} className="flex items-start gap-3">
                  <ShieldCheck size={16} className="text-[#34D399] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">{g}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 pt-6 border-t border-white/[0.06] text-[13px] text-[#94A3B8] leading-relaxed">
              These are research directions grounded in real engineering, not marketing claims. Where a public
              discussion exists, it is filed in Senueren’s Bureau of External Affairs as auditable evidence.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-10 md:p-16 text-center bg-gradient-to-br from-[#0B1424] via-[#0D1E3A] to-[#052E2E]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 60%)" }} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Have a consequential agent action?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-5 max-w-3xl mx-auto">
              If a bad action has real consequences, Quesen is worth a conversation.
            </h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
              We’re looking for autonomous workflows where a wrong action costs money, security, or trust. That is the exact boundary Quesen governs.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all" data-testid="evidence-cta-contact">
              Start a conversation <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EvidencePage;
