import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, ShieldCheck, Cpu, Terminal, ScrollText, Clock, CheckCircle2,
  Lock, GitPullRequest, Radar, AlertTriangle, FileCheck2, ChevronRight, MessageCircle
} from "lucide-react";

/**
 * /services  Senueren productized engagements.
 *
 * PUBLIC, conversion-oriented. Lead offer = "Agent Surface Review" (the MCP /
 * agent-boundary security review). Honest: no fabricated clients, logos, or
 * metrics. Pricing shown as indicative, scoped-per-engagement bands. Proof is
 * pointed at /evidence (verified external work), never invented here.
 * Consent-first framing per BEA doctrine §17.1 (authorized scope only).
 */

const SITE_URL = "https://senueren.co.za";
const CONTACT_WHATSAPP_INTL = "27673267417";
const WA = `https://wa.me/${CONTACT_WHATSAPP_INTL}?text=${encodeURIComponent(
  "Hi Senueren — I'd like to book an Agent Surface Review."
)}`;

const useSEO = ({ title, description, path = "/services" }) => {
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

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-10">
    <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
    <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && <p className="text-[#94A3B8] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

/* The fixed checklist an Agent Surface Review runs against */
const SURFACE_CHECKS = [
  "MCP tool authorization", "Confused-deputy conditions", "Privilege escalation",
  "Secret exposure", "Token passthrough", "SSRF", "Tool poisoning / malicious tool descriptions",
  "Excessive permissions", "Cross-agent authority", "Unsafe filesystem access",
  "Command execution", "Data exfiltration", "Missing auditability",
  "Replayability", "Authorization-vs-execution mismatch",
];

const TIERS = [
  {
    name: "Focused Review", turnaround: "48 hours", price: "from R2,500",
    scope: "One MCP server or a single agent/tool boundary.",
    includes: ["Full checklist against one surface", "Prioritized findings + reproductions", "One-page remediation report"],
    accent: "#22D3EE",
  },
  {
    name: "Agent Surface Review", turnaround: "72 hours", price: "from R6,000",
    scope: "Agent + its tools + the authorization/execution seam.",
    includes: ["Everything in Focused", "Auth-vs-execution mismatch mapping", "Quesen policy-enforcement recommendation where it fits", "30-min findings walkthrough"],
    accent: "#34D399", featured: true,
  },
  {
    name: "Extended / Multi-Agent", turnaround: "Scoped", price: "Custom",
    scope: "Multi-agent systems, production hardening, or ongoing retainer.",
    includes: ["Multi-agent authority modelling", "Deterministic governance design (Quesen)", "Re-test after remediation"],
    accent: "#A78BFA",
  },
];

const PROCESS = [
  { icon: <FileCheck2 size={16} />, t: "1. Scope + authorization", d: "We agree the exact assets in scope and confirm you own them (or a published program scope). Consent-first — we never test outside authorization." },
  { icon: <Radar size={16} />, t: "2. Surface review", d: "We attack the agent/tool boundary against the fixed checklist, capturing reproductions and evidence, not severity theatre." },
  { icon: <ScrollText size={16} />, t: "3. Remediation report", d: "Prioritized, evidence-first findings with concrete fixes — and, where deterministic policy enforcement helps, a Quesen recommendation." },
  { icon: <GitPullRequest size={16} />, t: "4. Optional re-test", d: "After you remediate, we verify the fixes and (on request) wire a deterministic pre-action gate so the class of issue can't silently return." },
];

const OTHER = [
  { icon: <Cpu size={18} />, name: "Quesen integration", d: "Wire the deterministic PASS/REVIEW/BLOCK decision layer into your agent before it takes consequential actions.", to: "/quesen" },
  { icon: <ShieldCheck size={18} />, name: "Shinren security research", d: "Authorized, public-scope security research on on-chain and agent infrastructure.", to: "/shinren" },
  { icon: <Terminal size={18} />, name: "Legacy infrastructure", d: "Bespoke, properly-engineered sites and full-stack platforms for founders and brands.", to: "/legacy" },
];

const ServicesPage = () => {
  useSEO({
    title: "Services — Agent Surface Review & Deterministic Governance | Senueren",
    description:
      "Senueren's Agent Surface Review: a fixed-scope 48–72h security review of your MCP server or AI-agent tool boundary — authorization, confused-deputy, secret exposure, auth-vs-execution mismatch — with a concrete remediation report and, where it fits, a deterministic Quesen policy recommendation.",
    path: "/services",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* Hero */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981]" />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[11px] font-semibold tracking-[0.14em] uppercase text-[#10B981]">
              <Lock size={13} /> Consent-first · fixed scope
            </span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Services</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Your agent can act.
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              We find where it can be made to act wrongly.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            MCP servers, tools and autonomous agents are shipping faster than anyone is reviewing them.
            The <strong className="text-white">Agent Surface Review</strong> is a bounded, fixed-price attack on your
            agent&apos;s tool boundary — the gap between what a message <em>says</em> and what your agent is allowed
            to <em>do</em> — with a concrete remediation report at the end. Not a scanner. A hands-on review by the
            team that builds{" "}
            <Link to="/quesen" className="text-[#22D3EE] hover:text-[#34D399] font-medium">Quesen</Link>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={WA} target="_blank" rel="noreferrer" data-testid="services-hero-book"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
              Book a review <ArrowRight size={16} />
            </a>
            <Link to="/evidence" data-testid="services-hero-evidence"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-white border border-white/15 hover:border-[#22D3EE]/50 transition-all">
              See our verified work <ChevronRight size={15} />
            </Link>
          </div>
        </section>

        {/* What we check */}
        <section>
          <SectionHeader
            eyebrow="Agent Surface Review"
            title="What we attack, exactly."
            subtitle="A fixed checklist so you know precisely what a review covers. Findings are evidence-first — every issue ships with a reproduction, not a severity label."
          />
          <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 md:p-8 backdrop-blur">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {SURFACE_CHECKS.map((c) => (
                <div key={c} className="flex items-start gap-3" data-testid={`services-check-${c.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                  <CheckCircle2 size={16} className="text-[#34D399] mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-[#E2E8F0] leading-relaxed">{c}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 pt-6 border-t border-white/[0.06] flex items-start gap-3">
              <AlertTriangle size={15} className="text-[#FBBF24] mt-0.5 flex-shrink-0" />
              <p className="text-[12px] text-[#94A3B8] leading-relaxed">
                <span className="text-[#E2E8F0] font-medium">Authorized scope only.</span> We review assets you own,
                or that sit inside a published security program. We do not test third-party systems without written
                authorization — the same discipline we hold ourselves to on every public contribution.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing tiers */}
        <section>
          <SectionHeader
            eyebrow="Engagements"
            title="Fixed scope. Fixed price. Fast."
            subtitle="Indicative bands — final scope agreed before we start. Priced so a solo builder can afford a real review before their agent becomes production infrastructure."
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {TIERS.map((t) => (
              <div key={t.name}
                className={`relative bg-[#0B1424]/70 rounded-2xl p-6 backdrop-blur flex flex-col ${t.featured ? "border-2 border-[#34D399]/40" : "border border-white/[0.06]"}`}
                data-testid={`services-tier-${t.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                {t.featured && (
                  <span className="absolute -top-3 left-6 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.14em] uppercase text-[#050B1A] bg-[#34D399]">Most popular</span>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white font-['Outfit']">{t.name}</h3>
                </div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-2xl font-bold" style={{ color: t.accent }}>{t.price}</span>
                </div>
                <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#64748B] mb-4">
                  <Clock size={12} /> {t.turnaround}
                </p>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed mb-4">{t.scope}</p>
                <ul className="space-y-2 flex-grow">
                  {t.includes.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-[#E2E8F0]">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: t.accent }} /> {i}
                    </li>
                  ))}
                </ul>
                <a href={WA} target="_blank" rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all border border-white/15 text-white hover:border-[#22D3EE]/50"
                  data-testid={`services-tier-cta-${t.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                  Enquire <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section>
          <SectionHeader eyebrow="How it runs" title="Four steps, no theatre." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PROCESS.map((p) => (
              <div key={p.t} className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 backdrop-blur flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] flex-shrink-0">{p.icon}</div>
                <div>
                  <h3 className="text-[15px] font-bold text-white font-['Outfit'] mb-1.5">{p.t}</h3>
                  <p className="text-[13px] text-[#94A3B8] leading-relaxed">{p.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Other service lines */}
        <section>
          <SectionHeader eyebrow="Also from Senueren" title="Beyond the review." />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {OTHER.map((o) => (
              <Link key={o.name} to={o.to}
                className="group bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/40 transition-all backdrop-blur"
                data-testid={`services-other-${o.name.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}`}>
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4">{o.icon}</div>
                <h3 className="text-base font-bold text-white font-['Outfit'] mb-2">{o.name}</h3>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed">{o.d}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-10 md:p-16 text-center bg-gradient-to-br from-[#0B1424] via-[#0D1E3A] to-[#052E2E]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 60%)" }} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Ship your agent with confidence</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-5 max-w-3xl mx-auto">
              Get your agent&apos;s tool boundary reviewed before someone else finds the gap.
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <a href={WA} target="_blank" rel="noreferrer" data-testid="services-cta-whatsapp"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] transition-all">
                <MessageCircle size={16} /> Book on WhatsApp
              </a>
              <Link to="/contact" data-testid="services-cta-contact"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full font-semibold text-white border border-white/15 hover:border-[#22D3EE]/50 transition-all">
                Other ways to reach us <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
