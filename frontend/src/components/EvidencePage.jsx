import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ExternalLink, GitMerge, GitPullRequest, Flag,
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

const HEALTH_BASE = "https://web-production-3df26.up.railway.app";
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

/* ── VERIFIED external contributions (live GitHub state @ 2026-09-18) ── */
const CONTRIBUTIONS = [
  {
    repo: "AgentOnRails/agent-on-rails", ref: "#3", bureau: "Quesen", status: "DISCUSSION",
    title: "Counterparty-risk decision hook before sign (PASS/REVIEW/BLOCK)",
    detail: "On AgentOnRails' local-first x402 payment control-plane, proposed an optional CounterpartyChecker seam at the existing require_approval_above_usd / pre-sign point: the daemon hands the pending payment (chain, to-address, token, amount) to a checker returning a typed PASS / REVIEW / BLOCK verdict with machine reason codes, default no-op so it stays vendor-neutral. Their guardrails gate amount / velocity / endpoint but not recipient risk — a payment under-cap to a freshly-deployed drainer contract still signs. Included a live recomputable Quesen receipt (engine 1.10.0, input_snapshot_hash) as one reference implementation.",
    metrics: ["issue #3 opened", "pluggable checker seam", "recomputable receipt"],
    url: "https://github.com/AgentOnRails/agent-on-rails/issues/3",
  },
  {
    repo: "x402-foundation/x402", ref: "#3506", bureau: "Quesen", status: "DISCUSSION",
    title: "Independent intent clearance on the x402 settle hook",
    detail: "On the x402 BeforeSettleHook seam, contributed the split between proving a payment is well-formed and proving the signer was authorized to move that value — an opaque receipt_id as a locator vs a recomputable intent_hash the counterparty can verify without trusting the payer. The author of XAPS (live pre-settle clearance at api.xaps.network) agreed and accepted the conformance-vector definition as the interoperable intent_hash (JCS canonicalisation, integer minor-units, CAIP-19 / CAIP-2). Provider-neutral conformance vector to follow.",
    metrics: ["intent_hash definition accepted", "XAPS design-partner", "canonicalisation pinned"],
    url: "https://github.com/x402-foundation/x402/issues/3506",
  },
  {
    repo: "Universal-Commerce-Protocol/ucp", ref: "#827", bureau: "Quesen", status: "DISCUSSION",
    title: "Lifecycle projection contract across Cart → Checkout",
    detail: "Formalised the #788 discussion into an Enhancement Proposal: one carrier-agnostic projection contract so an authorization established upstream is reproducible downstream instead of silently losing its basis at the boundary. Maintainer converged; folded in the no-silent-authority-upgrade invariant (N1: preservation is not elevation; N2: re-attestation is the only upgrade path) plus a six-row conformance-vector matrix — including the negative case where a byte-exact carrier is treated as stronger authority without a new attestation and must fail.",
    metrics: ["EP filed", "maintainer converged", "6 conformance vectors"],
    url: "https://github.com/Universal-Commerce-Protocol/ucp/issues/827",
  },
  {
    repo: "x402-agentic/x402agentic-firewall", ref: "#2", bureau: "Quesen", status: "DISCUSSION",
    title: "Recomputable decision receipt on the deterministic pre-flight gate",
    detail: "First-mover proposal on x402Agentic's deterministic firewall: emit a recomputable decision receipt (bind the normalised payment call by content hash) so an agent can prove which payment produced a given verdict, and offered a conformance-vector PR read against their engine core.",
    metrics: ["first-mover", "receipt seam", "conformance PR offered"],
    url: "https://github.com/x402-agentic/x402agentic-firewall/issues/2",
  },
  {
    repo: "Rul1an/assay", ref: "#2422", bureau: "Quesen", status: "ASSIST",
    title: "Declared-depth session-coverage invariant (assay-evidence)",
    detail: "Proposed the non-major “Option 2” shape for assay-evidence — a declared depth extent on the session-coverage sibling event so a compacted trace turns the completeness check red instead of silently reporting a whole trace. The maintainer implemented it as #3099 (merged 2026-09-17, reviewed adversarially), crediting the proposed shape. Filed as a design assist, not our commit.",
    metrics: ["#3099 merged 2026-09-17", "design credited"],
    url: "https://github.com/Rul1an/assay/issues/2422",
  },
  {
    repo: "google-agentic-commerce/AP2", ref: "#332", bureau: "Quesen", status: "DISCUSSION",
    title: "When does a checkout change require renewed authorization?",
    detail: "Contributed the two-invariant decomposition of mandate authority: closed→execution is an integrity check (recompute + compare the bound checkout hash), while open→closed is an authority-derivability check (typed constraints, fail-closed on any dimension the grant never named). Added the issuer/provenance angle and a three-outcome model (integrity-fail / out-of-envelope / underspecified), with a link to reproducible receipts.",
    metrics: ["two-invariant model", "3-outcome seam", "reproducible receipts"],
    url: "https://github.com/google-agentic-commerce/AP2/discussions/332",
  },
  {
    repo: "agentguard-ai/tealtiger", ref: "#443", bureau: "Quesen", status: "DISCUSSION",
    title: "TealTiger governance layer around the KYC decision agent",
    detail: "Follow-up to the merged decision agent (#453): proposed the concrete governance-wrapper seam (kill-switch → budget → tool-auth → decision), the key distinction between the governance admission decision (ALLOW/DENY) and the KYC business decision (approve/escalate/reject), and binding the governance receipt to the decision agent's existing input hash. Offered to author the wrapper PR.",
    metrics: ["governance seam design", "receipt binding", "PR offered"],
    url: "https://github.com/agentguard-ai/tealtiger/issues/443",
  },
  {
    repo: "aeoess/agent-governance-vocabulary", ref: "#151", bureau: "Quesen", status: "MERGED",
    title: "Crosswalk: map Quesen onto the canonical governance vocabulary",
    detail: "crosswalk/quesen.yaml — Quesen's deterministic decision receipt mapped onto the canonical agent-governance vocabulary, now living upstream alongside 30+ peer entries (a2a, agentid, payment_rail, signet…). Five maintainer review items resolved against the public repo + live engine (evidence re-grounded in the shipped API and real receipt fields commit_sha / input_snapshot_hash; match downgraded to non_equivalent_similar_label; role scoped to /tsc/validate); DCO linearised. Merged 2026-09-11 — our first contribution to reach an agent-governance standards vocabulary.",
    metrics: ["crosswalk/quesen.yaml live upstream", "5 review items resolved", "merged 2026-09-11"],
    url: "https://github.com/aeoess/agent-governance-vocabulary/pull/151",
  },
  {
    repo: "aeoess/agent-governance-vocabulary", ref: "#152", bureau: "Quesen", status: "DISCUSSION",
    title: "Proposal: provenance_tier as a context dimension",
    detail: "Filed the trust-tier-of-the-authority dimension as a proper vocabulary proposal (not smuggled through a crosswalk). Closes the permission-through-derivation-chain gap that MCP #2498 and UCP #724 independently converged on.",
    metrics: ["dimension proposal", "cross-refs #2498 / #724"],
    url: "https://github.com/aeoess/agent-governance-vocabulary/issues/152",
  },
  {
    repo: "Universal-Commerce-Protocol/ucp", ref: "#724", bureau: "Quesen", status: "DISCUSSION",
    title: "Commercial-intervention provenance across Cart → Checkout",
    detail: "Maintainer engaged directly. Contributed the 'derivation must not silently upgrade authority' invariant and published six live, reproducible cross-domain test vectors (PRESERVED / RECOVERED / DEGRADED / MISSING / MUTATED) with real receipts — including the honest observed boundary (fail-closed on an unattested claim, not on absence).",
    metrics: ["6 live test vectors", "maintainer engaged"],
    url: "https://github.com/Universal-Commerce-Protocol/ucp/discussions/724",
  },
  {
    repo: "modelcontextprotocol/modelcontextprotocol", ref: "#2498", bureau: "Quesen", status: "DISCUSSION",
    title: "Permission specification for MCP tool calls",
    detail: "Contributed the provenance-tier framing (authority tier ≠ attestation) and, on the APC execution-seam question, the exact-call-binding / TOCTOU point: a decision must bind a content hash of the normalized call so the enforcement boundary can prove the executed side effect is the authorized one.",
    metrics: ["provenance-tier framing", "PEP + receipt seam"],
    url: "https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498",
  },
  {
    repo: "dheerajjha/mcp-migrate", ref: "#246", bureau: "Quesen", status: "MERGED",
    title: "Warn on unrecognised top-level config keys (closes #235)",
    detail: "A linter whose proposition is a trustworthy grade silently dropped misspelled/mis-nested config keys. Reproduced three real failure shapes, converted silent drops into targeted warnings with difflib “did you mean” hints, and fixed a pre-existing Rich-markup escaping bug.",
    metrics: ["+123 / 3 files", "8 new tests", "698-test suite green"],
    url: "https://github.com/dheerajjha/mcp-migrate/pull/246",
  },
  {
    repo: "agentguard-ai/tealtiger", ref: "#453", bureau: "Quesen", status: "MERGED",
    title: "Deterministic KYC Decision Agent (Quesen-shaped)",
    detail: "A make_decision(identity, sanctions, risk) surface built to Quesen invariants: no LLM in the scoring loop, canonicalised inputs SHA-256 hashed onto the audit record, POLICY_VERSION stamped on every decision, sanctions veto, identity-confidence floor, and named escalation reasons. Merged into Agent Guard's agent-governance SDK (2026-08-17); governance-wrapper follow-up now in flight at #443.",
    metrics: ["+630 / 10 files", "15 offline tests (30ms)", "merged"],
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

/* ── Shinren evidence ladder (rung honesty — a source read is never sold as a runtime vuln) ── */
const LADDER = [
  { k: "Observed", d: "Issue seen in public source / design", c: "#94A3B8" },
  { k: "Reproduced", d: "Reproduced against the real code", c: "#FBBF24" },
  { k: "Runtime-confirmed", d: "Proof-of-concept executes the fault", c: "#22D3EE" },
  { k: "Reported", d: "Filed responsibly to the asset owner", c: "#A78BFA" },
  { k: "Remediated", d: "Fix landed", c: "#34D399" },
  { k: "Retested", d: "Fix verified against the PoC", c: "#34D399" },
];

/* ── VERIFIED Shinren security-research engagements (public, filed as Shxnque; rung = level actually proven) ── */
const SHINREN = [
  {
    repo: "Zenith-options/contracts", ref: "#120", rung: "Runtime-confirmed", rc: "#22D3EE",
    title: "Caller-supplied-authorizer vault drain (Soroban options vault)",
    detail: "Pre-mainnet source review of a Soroban (Rust) options vault surfaced a CRITICAL: the withdraw path trusted a caller-supplied authorizer, letting an attacker authorize a drain of another account's collateral. Reproduced with a native same-Env cross-contract Soroban test (PoC PASS), then reported. Source-level review only — nothing deployed was touched.",
    tags: ["Soroban/Rust", "CRITICAL", "PoC pass", "pre-mainnet"],
    url: "https://github.com/Zenith-options/contracts/issues/120",
  },
  {
    repo: "veracindarella/votechain-contracts", ref: "#92", rung: "Runtime-confirmed", rc: "#22D3EE",
    title: "Governance vote-weight recycling defeats quorum",
    detail: "A single 100-token stake drove 300 Yes votes and passed a 250-quorum proposal, because voting power was read from live balance at cast-time with no per-proposal snapshot or spent-marking. Elevated from source-level to L4 with a cargo test executing the fault against the real governance + token contracts (PoC PASS), then a remediation (snapshot-at-creation) was posted.",
    tags: ["Soroban/Rust", "governance", "PoC pass", "remediation posted"],
    url: "https://github.com/veracindarella/votechain-contracts/issues/92",
  },
  {
    repo: "Conrad-sudo/sh-protocol", ref: "#1 · PR#2", rung: "Merge-ready", rc: "#34D399",
    title: "Per-key (target, selector) session-key scope (EIP-712 SessionGrant)",
    detail: "For an ERC-4337/ERC-7579 smart account whose session keys were bare signers bounded only by a USD cap, contributed an owner-signed EIP-712 SessionGrant that makes the admission decision a validate-time, per-call, recomputable check — a merge-ready src/SessionGrantLib.sol (merkle (target,selector) scope, fail-closed, atomic batch revert) verified against the real Execution[] decode path. forge test 9/9 PASS on the maintainer's solc 0.8.33 + viaIR.",
    tags: ["ERC-4337/7579", "Solidity", "forge 9/9", "PR open"],
    url: "https://github.com/Conrad-sudo/sh-protocol/pull/2",
  },
  {
    repo: "CallistoSecurity/Smart-contract-auditing", ref: "#90", rung: "Retested", rc: "#34D399",
    title: "ZINZ ERC-20 pre-audit — VERIFIED CLEAN, reproducibly",
    detail: "Inbound audit request. Cleared an explicit evidence gate before any 'clean' claim: solc-js recompile structurally matches the on-chain bytecode, interface enumerated exhaustively (= ERC-20 + Burnable, 0 privileged selectors), delivered with a reproducible verify.py. Honest verdict = VERIFIED CLEAN with the directory-listing limitation stated plainly.",
    tags: ["ERC-20", "bytecode match", "verify.py", "no-inflation"],
    url: "https://github.com/CallistoSecurity/Smart-contract-auditing/issues/90",
  },
  {
    repo: "open-trust-layer/protocol", ref: "#35", rung: "Reported", rc: "#A78BFA",
    title: "Review-target source-binding inconsistency (invited external review)",
    detail: "On an invited external review of a frozen commit, found the in-tree SECURITY.md still names an older active target and routes reviewers to CLOSED trackers while the issue declares a newer target — so a reviewer following the frozen snapshot files against the wrong, closed gate (the same binding/identity-drift class the project already hit). Proposed a promotion-gate CI assertion. Non-sensitive, evidence-first.",
    tags: ["protocol spec", "source-binding", "process", "CI assertion"],
    url: "https://github.com/open-trust-layer/protocol/issues/35",
  },
  {
    repo: "Resomnium/cellos", ref: "#1", rung: "Reported", rc: "#A78BFA",
    title: "Capability scope: adversarially bypassable substring match + fail-open default",
    detail: "First-mover review of an agent capability layer: scope enforcement used substring containment (so a broader-named grant satisfies a narrower check) and defaulted fail-open on an unmatched scope. Proposed a typed, segment-exact, fail-closed matcher plus a recomputable AuditEntry so a third party can replay the PASS/DENY decision.",
    tags: ["agent capabilities", "authorization", "fail-closed", "recomputable"],
    url: "https://github.com/Resomnium/cellos/issues/1",
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

/* ── Cross-domain lifecycle test vectors (generated live @ /tsc/validate) ── */
const XDOMAIN_VECTORS = [
  { outcome: "PRESERVED", state: "Attested authority, survives the transition unchanged", decision: "PASS", reason: "NO_ADVERSE_SIGNAL", color: "#34D399" },
  { outcome: "RECOVERED", state: "Evidence reconstructed and re-attested after the boundary", decision: "PASS", reason: "NO_ADVERSE_SIGNAL", color: "#34D399" },
  { outcome: "DEGRADED", state: "Crossed a derivation boundary without re-attestation", decision: "REVIEW", reason: "UNVERIFIED_GRANT", color: "#FBBF24" },
  { outcome: "MISSING", state: "Required authority claimed but evidence unverifiable", decision: "REVIEW", reason: "UNVERIFIED_GRANT", color: "#FBBF24" },
  { outcome: "MUTATED", state: "Mutated flow exfiltrates a secret to an unverified sink", decision: "BLOCK", reason: "EGRESS_SECRET_UNTRUSTED", color: "#F87171" },
];
const XDOMAIN_COMMIT = "0095b6183a796ce678086a77e17de6eef9c6a263";
const XDOMAIN_DOC = "https://github.com/Shxnque/quesen/blob/main/evaluation/UCP724-LIFECYCLE-VECTORS.md";
const XDOMAIN_FIXTURE = "https://github.com/Shxnque/quesen/blob/main/evaluation/fixtures/ucp724_lifecycle_vectors.json";

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

        {/* Layer 1b: Shinren security research */}
        <section data-testid="evidence-shinren">
          <SectionHeader
            eyebrow="Shinren security research"
            title="Pre-audit review, proven at the rung we actually reached."
            subtitle="Evidence-first smart-contract & protocol security research — including niche VMs (Soroban/Rust), not only EVM. Every finding is filed responsibly and labelled at the rung actually proven: a source-level observation is never presented as a runtime vulnerability unless a proof-of-concept executes it."
          />

          {/* Evidence ladder — the differentiator */}
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 md:p-7 backdrop-blur mb-5" data-testid="evidence-ladder">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-[#22D3EE]" />
              <h3 className="text-sm font-bold text-white font-['Outfit'] tracking-wide">The evidence ladder</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {LADDER.map((l, i) => (
                <div key={l.k} className="flex items-center gap-2">
                  <span className="inline-flex flex-col px-3 py-2 rounded-xl bg-white/[0.03] border" style={{ borderColor: `${l.c}44` }}>
                    <span className="text-[12px] font-bold font-mono" style={{ color: l.c }}>{l.k}</span>
                    <span className="text-[10px] text-[#64748B] leading-tight max-w-[150px]">{l.d}</span>
                  </span>
                  {i < LADDER.length - 1 && <ChevronRight size={13} className="text-[#334155]" />}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SHINREN.map((f) => (
              <a
                key={`${f.repo}${f.ref}`}
                href={f.url}
                target="_blank"
                rel="noreferrer"
                className="group bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/40 transition-all backdrop-blur flex flex-col"
                data-testid={`evidence-shinren-${f.repo.split("/")[1]}-${f.ref.replace(/[#\s·]+/g, "")}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <code className="text-sm text-white font-semibold break-all">{f.repo}<span className="text-[#22D3EE]"> {f.ref}</span></code>
                    <span className="mt-1.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-[#64748B]">
                      <ShieldCheck size={11} className="text-[#22D3EE]" /> Shinren finding
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase whitespace-nowrap"
                    style={{ color: f.rc, backgroundColor: `${f.rc}18`, border: `1px solid ${f.rc}44` }}
                  >
                    {f.rung}
                  </span>
                </div>
                <h3 className="text-[15px] font-bold text-white font-['Outfit'] mb-2 leading-snug">{f.title}</h3>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed mb-4 flex-grow">{f.detail}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {f.tags.map((t) => (
                    <span key={t} className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#CBD5E1] font-mono">{t}</span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] group-hover:gap-2.5 transition-all">
                  View on GitHub <ExternalLink size={12} />
                </span>
              </a>
            ))}
          </div>
          <p className="mt-6 text-[12px] text-[#64748B] leading-relaxed max-w-3xl">
            Active assessment of any system begins only inside a published program scope or a signed authorization; discovery records a request, it never starts an audit. Sensitive exploit detail is disclosed privately to the asset owner, not published to look impressive.
          </p>
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

        {/* Layer 2b: Cross-domain test vectors */}
        <section data-testid="evidence-xdomain-vectors">
          <SectionHeader
            eyebrow="Cross-domain test vectors"
            title="The model, proven against live receipts."
            subtitle="Generated live against the canonical engine — not hand-written fixtures. Each row is reproducible without signup, and every verdict replays from its receipt. Published as evidence for the UCP #724 and MCP #2498 discussions."
          />
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6 text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-[#94A3B8]"><Cpu size={12} className="text-[#22D3EE]" /> POST /tsc/validate · tsc_version 2.0</span>
              <span className="inline-flex items-center gap-1.5 text-[#94A3B8]"><Hash size={12} className="text-[#22D3EE]" /> ruleset commit <code className="text-[#CBD5E1] font-mono">{XDOMAIN_COMMIT.slice(0, 12)}…</code></span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="text-[10px] tracking-[0.16em] uppercase text-[#64748B] border-b border-white/[0.08]">
                    <th className="py-2.5 pr-4 font-semibold">Lifecycle outcome</th>
                    <th className="py-2.5 pr-4 font-semibold">Modelled authority state</th>
                    <th className="py-2.5 pr-4 font-semibold">Decision</th>
                    <th className="py-2.5 font-semibold">Reason code</th>
                  </tr>
                </thead>
                <tbody>
                  {XDOMAIN_VECTORS.map((v) => (
                    <tr key={v.outcome} className="border-b border-white/[0.05] last:border-0" data-testid={`evidence-vector-${v.outcome.toLowerCase()}`}>
                      <td className="py-3 pr-4"><span className="text-[13px] font-bold text-white font-mono">{v.outcome}</span></td>
                      <td className="py-3 pr-4 text-[12px] text-[#94A3B8] leading-snug">{v.state}</td>
                      <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono" style={{ color: v.color, backgroundColor: `${v.color}18`, border: `1px solid ${v.color}44` }}>{v.decision}</span></td>
                      <td className="py-3"><code className="text-[11px] text-[#CBD5E1]">{v.reason}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-start gap-3">
              <ShieldCheck size={15} className="text-[#34D399] mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                <span className="text-[#E2E8F0] font-medium">Integrity binding:</span> mutating a single field flips the receipt&apos;s
                <code className="text-[#22D3EE] px-1">input_snapshot_hash</code>
                (<code className="text-[#CBD5E1] font-mono">2ae328…</code> → <code className="text-[#CBD5E1] font-mono">eaa8f6…</code>),
                so a prior authorization no longer binds the mutated call. And an honest boundary we state rather than hide: the engine
                fails closed on an <em>unattested claim</em>, not on the mere <em>absence</em> of one.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={XDOMAIN_DOC} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] hover:underline" data-testid="evidence-vector-doc"><ScrollText size={12} /> Vectors write-up</a>
              <a href={XDOMAIN_FIXTURE} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#22D3EE] hover:underline" data-testid="evidence-vector-fixture"><ExternalLink size={12} /> Machine-readable fixture</a>
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
