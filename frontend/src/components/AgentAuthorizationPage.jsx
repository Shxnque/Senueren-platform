import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, KeyRound, GitCompareArrows, Fingerprint,
  FileCheck2, Ban, CheckCircle2, AlertTriangle, ChevronRight, Layers, Boxes
} from "lucide-react";

/**
 * /agent-authorization — substantive technical explainer (BEA anti-slop gate).
 *
 * Structure: problem → primitive → implementation → REPRODUCIBLE Quesen example.
 * Every claim here is independently checkable against the live engine or a public
 * repo. No customers, pilots, revenue or metrics are invented. Category language
 * ("AI agent authorization", "MCP tool authorization", "runtime authorization")
 * makes Quesen's EXISTING identity discoverable — it does not reposition Senueren.
 */

const SITE_URL = "https://senueren.co.za";
const API_BASE = "https://web-production-3df26.up.railway.app";

const useSEO = ({ title, description, path }) => {
  useEffect(() => {
    const fullUrl = `${SITE_URL}${path}`;
    document.title = title;
    const set = (sel, attr, val) => {
      let el = document.head.querySelector(sel);
      if (!el) {
        el = document.createElement(sel.startsWith("meta") ? "meta" : "link");
        const m = sel.match(/\[(.+?)="(.+?)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, val);
    };
    if (description) {
      set('meta[name="description"]', "content", description);
      set('meta[property="og:description"]', "content", description);
      set('meta[name="twitter:description"]', "content", description);
    }
    set('meta[property="og:title"]', "content", title);
    set('meta[name="twitter:title"]', "content", title);
    set('meta[property="og:url"]', "content", fullUrl);
    set('link[rel="canonical"]', "href", fullUrl);
  }, [title, description, path]);
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10">
    <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
    <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && <p className="text-[#94A3B8] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

const CodeBlock = ({ children, label, testid }) => (
  <div className="rounded-2xl border border-white/[0.08] bg-[#070E1C] overflow-hidden" data-testid={testid}>
    {label && (
      <div className="px-4 py-2.5 border-b border-white/[0.06] bg-[#0B1424]/60 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]/70" />
        <span className="ml-2 text-[11px] font-mono tracking-wide text-[#64748B]">{label}</span>
      </div>
    )}
    <pre className="p-4 md:p-5 overflow-x-auto text-[12.5px] leading-relaxed font-mono text-[#CBD5E1]">
      <code>{children}</code>
    </pre>
  </div>
);

const VERDICTS = [
  { v: "PASS", color: "#34D399", icon: <CheckCircle2 size={16} />, d: "The action is within granted authority and provenance checks hold. Proceed." },
  { v: "REVIEW", color: "#FBBF24", icon: <AlertTriangle size={16} />, d: "Authority is plausible but unverified. Escalate to a human or a stronger grant." },
  { v: "BLOCK", color: "#F87171", icon: <Ban size={16} />, d: "A conflict rule fired (e.g. secret egress to an untrusted destination). Refuse." },
  { v: "SKIP", color: "#94A3B8", icon: <ShieldCheck size={16} />, d: "The engine could not decide safely (timeout / transport error). Fail closed — do not act." },
];

const AgentAuthorizationPage = () => {
  useSEO({
    title: "AI Agent Authorization — Runtime Authority, Governance & MCP Tool Authorization | Quesen",
    description:
      "A technical explainer on AI agent authorization: the gap MCP leaves after authentication, why runtime authorization must be deterministic and auditable, and a reproducible Quesen example (typed security context → PASS/REVIEW/BLOCK/SKIP with reason codes and a replayable receipt).",
    path: "/agent-authorization",
  });

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="agent-authorization-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12 space-y-20">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-[#64748B]" aria-label="Breadcrumb" data-testid="agent-auth-breadcrumb">
          <Link to="/" className="hover:text-[#22D3EE] transition-colors">Home</Link>
          <ChevronRight size={13} />
          <Link to="/quesen" className="hover:text-[#22D3EE] transition-colors">Quesen</Link>
          <ChevronRight size={13} />
          <span className="text-[#94A3B8]">Agent authorization</span>
        </nav>

        {/* Hero */}
        <section>
          <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Technical explainer</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.06] max-w-3xl">
            AI agent authorization,
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              the decision that comes after authentication.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 leading-relaxed">
            Authentication answers <em className="text-white not-italic font-medium">who is calling</em>. Authorization answers
            the harder question an autonomous agent faces before every consequential action: <em className="text-white not-italic font-medium">is this
            specific action allowed, right now, given what it touches and where the data goes?</em> This page explains the problem,
            the trust primitive it needs, and a Quesen example you can reproduce in under a minute.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/try" data-testid="agent-auth-hero-try"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
              Reproduce it free <ArrowRight size={16} />
            </Link>
            <Link to="/evidence" data-testid="agent-auth-hero-evidence"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-white border border-white/15 hover:border-[#22D3EE]/50 transition-all">
              Verify the evidence <ChevronRight size={15} />
            </Link>
          </div>
        </section>

        {/* The gap */}
        <section>
          <SectionHeader
            eyebrow="The problem"
            title="MCP standardises authentication. It does not decide authority."
            subtitle="The Model Context Protocol gives agents a clean way to connect to tools and prove identity. What it deliberately leaves to you is the runtime question: once a tool call is authenticated, should it be permitted to execute?"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Fingerprint size={20} />, t: "Confused-deputy", d: "An agent with legitimate credentials is tricked, via a crafted message or tool description, into using its authority on an attacker's behalf." },
              { icon: <KeyRound size={20} />, t: "Over-permissioned tokens", d: "The token grants far more scope than the current action needs. Nothing at runtime checks requested-vs-granted." },
              { icon: <GitCompareArrows size={20} />, t: "Authorization-vs-execution mismatch", d: "What a message says and what the agent is allowed to do drift apart. Execution proceeds on the say-so of untrusted text." },
              { icon: <AlertTriangle size={20} />, t: "Unbounded egress", d: "A secret or sensitive data class is sent to an untrusted destination because no policy sat between intent and action." },
            ].map((c) => (
              <div key={c.t} className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 backdrop-blur"
                data-testid={`agent-auth-gap-${c.t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4">{c.icon}</div>
                <h3 className="text-base font-bold text-white mb-2 font-['Outfit']">{c.t}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#94A3B8] leading-relaxed mt-6">
            Probabilistic guardrails can flag some of these, but a model that scores an action cannot be replayed, audited, or
            trusted to return the <em className="text-white not-italic">same verdict</em> for the same input months later. Runtime authorization for
            autonomous action needs a different primitive.
          </p>
        </section>

        {/* The primitive */}
        <section>
          <SectionHeader
            eyebrow="The primitive"
            title="Typed security context in → a deterministic verdict out."
            subtitle="Instead of asking a model to judge free text, you describe the attempted action as structured, typed fields. A deterministic checker evaluates them against a pinned ruleset and returns one of four verdicts with machine reason codes."
          />
          <CodeBlock label="typed security context (TSC) — request shape" testid="agent-auth-tsc-shape">{`{
  "subject":   { "principal_id": "svc-agent-14", "agent_id": "orchestrator" },
  "action":    { "type": "tool.call", "name": "http.post" },
  "target":    { "url": "https://unknown-collector.example", "data_classes": ["secret"] },
  "tool":      { "scopes_requested": ["net.egress"], "scopes_granted": ["net.egress.public"] },
  "provenance":{ "grant": "client_asserted", "attested": false }
}`}</CodeBlock>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            {VERDICTS.map((x) => (
              <div key={x.v} className="flex items-start gap-3 bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-5"
                data-testid={`agent-auth-verdict-${x.v.toLowerCase()}`}>
                <span className="mt-0.5 flex-shrink-0" style={{ color: x.color }}>{x.icon}</span>
                <div>
                  <p className="font-mono text-sm font-bold" style={{ color: x.color }}>{x.v}</p>
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed mt-1">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Implementation */}
        <section>
          <SectionHeader
            eyebrow="How Quesen implements it"
            title="Deterministic, fail-closed, and replayable by construction."
            subtitle="Quesen is a portable decision + authority + evidence layer. It sits after authentication and interoperates with identity, MCP, payment and execution systems — it does not replace them."
          />
          <div className="space-y-3">
            {[
              { icon: <Boxes size={18} />, t: "No LLM in the scoring path", d: "The verdict is computed by explicit rules over the typed context, so the same input always yields the same output. No inference, no drift." },
              { icon: <FileCheck2 size={18} />, t: "Machine reason codes", d: "Every verdict carries named codes (e.g. EGRESS_SECRET_UNTRUSTED, UNVERIFIED_GRANT) and the conflict rule that fired — not a score you have to interpret." },
              { icon: <Layers size={18} />, t: "Replayable receipt", d: "Each response embeds input_snapshot_hash (SHA-256 over the canonical request) and commit_sha (the exact ruleset commit), so any decision is recomputable byte-for-byte, offline, later." },
              { icon: <ShieldCheck size={18} />, t: "Fail-closed defaults", d: "Timeouts and transport errors surface as SKIP. The recommended integration refuses the action rather than proceeding blind." },
            ].map((r) => (
              <div key={r.t} className="flex items-start gap-4 bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 backdrop-blur"
                data-testid={`agent-auth-impl-${r.t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] flex-shrink-0">{r.icon}</div>
                <div>
                  <h3 className="text-[15px] font-bold text-white font-['Outfit'] mb-1.5">{r.t}</h3>
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed">{r.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Reproducible example */}
        <section>
          <SectionHeader
            eyebrow="Reproduce it yourself"
            title="A secret-egress block, in three calls."
            subtitle="Self-serve, no signup. One call gets a sandbox key; the next two show the same engine returning BLOCK for an untrusted secret egress and PASS for a benign public one — deterministically."
          />
          <div className="space-y-5">
            <CodeBlock label="1 · get a sandbox key (no signup, no card)" testid="agent-auth-repro-key">{`curl -X POST ${API_BASE}/sandbox/keys
# → { "api_key": "sk_sandbox_…", "credits": 1000, "next": "POST /tsc/validate" }`}</CodeBlock>

            <CodeBlock label="2 · secret → untrusted destination → BLOCK" testid="agent-auth-repro-block">{`curl -X POST ${API_BASE}/tsc/validate \\
  -H "X-API-Key: sk_sandbox_…" -H "Content-Type: application/json" \\
  -d '{ "action":{"type":"tool.call","name":"http.post"},
        "target":{"url":"https://unknown-collector.example","data_classes":["secret"]} }'
# → { "decision": "BLOCK",
#     "reason_codes": ["EGRESS_SECRET_UNTRUSTED"],
#     "input_snapshot_hash": "sha256:…", "commit_sha": "…" }`}</CodeBlock>

            <CodeBlock label="3 · same shape, benign public egress → PASS" testid="agent-auth-repro-pass">{`curl -X POST ${API_BASE}/tsc/validate \\
  -H "X-API-Key: sk_sandbox_…" -H "Content-Type: application/json" \\
  -d '{ "action":{"type":"tool.call","name":"http.get"},
        "target":{"url":"https://api.publicdata.example/status","data_classes":["public"]} }'
# → { "decision": "PASS", "reason_codes": [],
#     "input_snapshot_hash": "sha256:…", "commit_sha": "…" }`}</CodeBlock>
          </div>
          <div className="mt-6 flex items-start gap-3 bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6">
            <AlertTriangle size={15} className="text-[#FBBF24] mt-0.5 flex-shrink-0" />
            <p className="text-[12.5px] text-[#94A3B8] leading-relaxed">
              <span className="text-[#E2E8F0] font-medium">Honest scope.</span> The verdicts above are the engine's documented behaviour
              for these inputs; run the calls to confirm them against the live deployment. We publish no customer counts, pilots or
              revenue — only what you can independently check at{" "}
              <Link to="/evidence" className="text-[#22D3EE] hover:text-[#34D399]">/evidence</Link>.
            </p>
          </div>
        </section>

        {/* Interoperability */}
        <section>
          <SectionHeader
            eyebrow="Where it fits"
            title="A layer, not a replacement."
            subtitle="Quesen decides what an agent may do after it is authenticated, and interoperates with the systems you already run."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["Identity / auth (Okta, Auth0, OIDC)", "They establish who the agent is. Quesen decides whether this action is authorised."],
              ["MCP servers & tools", "MCP standardises connection and authentication. Quesen adds the runtime tool-call authorization decision."],
              ["Payment / commerce rails (x402, AP2, UCP)", "They move value and enforce amount/velocity. Quesen adds counterparty and provenance authority checks."],
              ["Execution / orchestration", "Frameworks run the action. Quesen gates it beforehand with a replayable verdict. SDKs for Python, TypeScript, LangChain, CrewAI, AutoGen."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-5"
                data-testid={`agent-auth-interop-${t.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "").slice(0, 24)}`}>
                <h3 className="text-[14px] font-bold text-white font-['Outfit'] mb-1.5">{t}</h3>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-10 md:p-14 bg-gradient-to-br from-[#0B1424] via-[#0D1E3A] to-[#052E2E]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 60%)" }} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Start here</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-5 max-w-2xl">
              Gate your agent's next consequential action.
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/try" data-testid="agent-auth-cta-try"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
                Get a sandbox key <ArrowRight size={16} />
              </Link>
              <Link to="/quesen" data-testid="agent-auth-cta-quesen"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-white border border-white/15 hover:border-[#22D3EE]/50 transition-all">
                Read the Quesen overview <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export { AgentAuthorizationPage };
export default AgentAuthorizationPage;
