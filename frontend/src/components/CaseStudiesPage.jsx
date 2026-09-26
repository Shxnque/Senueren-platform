import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, ShieldCheck, Cpu, FlaskConical, GitBranch, ChevronRight, Target, Microscope, CheckCircle2 } from "lucide-react";

/**
 * /case-studies — deep, public, rung-honest Shinren security case studies.
 * Every claim links to a public GitHub artifact. No fabricated metrics; each study
 * states the rung actually reached and the honest limitation.
 */
const SITE_URL = "https://senueren.co.za";
const useSEO = ({ title, description, path }) => {
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
    }
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:url"]', "content", fullUrl);
    setMeta('link[rel="canonical"]', "href", fullUrl);
  }, [title, description, path]);
};

const STUDIES = [
  {
    id: "zenith",
    repo: "Zenith-options/contracts", ref: "#120", rung: "Runtime-confirmed", rc: "#22D3EE", sev: "CRITICAL",
    stack: "Soroban / Rust",
    title: "Caller-supplied-authorizer vault drain in a Soroban options vault",
    context: "A pre-mainnet Soroban (Rust) options-vault protocol offered its contracts for public review. Vaults that custody collateral are the highest-consequence surface in DeFi: a single authority mistake is a total-loss event.",
    method: "Source-level review of the withdraw/settlement paths, tracing every authority check to the account it actually authenticates. The withdraw path accepted a caller-supplied authorizer rather than binding authorization to the vault owner — a classic authority-confusion pattern.",
    finding: "An attacker could supply their own authorizer and authorize a withdrawal of another account's collateral — draining the vault. Rated CRITICAL.",
    evidence: "Elevated from a source-level observation to Runtime-confirmed with a native same-Env cross-contract Soroban test that executes the drain against the real contracts (PoC PASS). Reported responsibly; source-level review only, nothing deployed was touched.",
    outcome: "Filed with the reproduction and a remediation direction (bind authorization to the vault owner / stored authority, never a caller-supplied one).",
    url: "https://github.com/Zenith-options/contracts/issues/120",
  },
  {
    id: "votechain",
    repo: "veracindarella/votechain-contracts", ref: "#92", rung: "Runtime-confirmed", rc: "#22D3EE", sev: "HIGH",
    stack: "Soroban / Rust",
    title: "Governance vote-weight recycling defeats quorum",
    context: "An on-chain governance system where token holders vote on proposals with weight proportional to stake. Governance integrity depends on one unit of stake counting once per proposal.",
    method: "Traced how voting power is measured at cast-time. Weight was read from live balance with no per-proposal snapshot and no spent-marking, so the same tokens could be counted repeatedly toward a single proposal.",
    finding: "A single 100-token stake drove 300 'Yes' votes and passed a proposal whose quorum was 250 — quorum defeated by recycling one stake.",
    evidence: "Confirmed with a cargo test that executes the recycling against the real governance + token contracts and asserts the inflated tally (PoC PASS) — the inverse assertion becomes the regression test once fixed.",
    outcome: "Reported with the PoC and a concrete remediation: snapshot voting power at proposal creation (or mark tokens spent per proposal), which prevents both recycling and mid-vote transfer inflation.",
    url: "https://github.com/veracindarella/votechain-contracts/issues/92",
  },
  {
    id: "zinz",
    repo: "CallistoSecurity/Smart-contract-auditing", ref: "#90", rung: "Retested", rc: "#34D399", sev: "CLEAN",
    stack: "EVM / ERC-20",
    title: "ZINZ ERC-20 pre-audit — VERIFIED CLEAN, reproducibly",
    context: "An inbound audit request on a deployed ERC-20 token. The disciplined outcome of an audit is often 'we found nothing exploitable' — but that verdict is only worth anything if it is reproducible and honest about what it did and did not cover.",
    method: "Cleared an explicit evidence gate before any 'clean' claim: recompiled the source with solc-js and structurally compared against the on-chain bytecode; enumerated the full external interface; checked for privileged/owner selectors and hidden mint/pause/blacklist paths.",
    finding: "Interface = standard ERC-20 + Burnable, with ZERO privileged selectors. Recompiled bytecode structurally matches the deployed contract. No hidden authority, no honeypot pattern.",
    evidence: "Delivered with a runnable verify.py so a third party recomputes the same result. The verdict is stated as VERIFIED CLEAN with its limitation named plainly (scope: the reviewed source/bytecode, not the deployment's directory listing).",
    outcome: "A clean bill that an auditor can defend — evidence, not assertion. No severity inflation to manufacture a finding.",
    url: "https://github.com/CallistoSecurity/Smart-contract-auditing/issues/90",
  },
];

const Row = ({ icon, label, children }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-[#22D3EE] flex-shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#64748B] mb-1">{label}</p>
      <p className="text-[13px] text-[#C7D2E0] leading-relaxed">{children}</p>
    </div>
  </div>
);

const CaseStudiesPage = () => {
  useSEO({
    title: "Shinren Security Case Studies — Reproducible, Rung-Honest Findings | Senueren",
    description: "Deep public case studies of Senueren's Shinren security research: a Soroban vault-drain (CRITICAL, PoC-confirmed), governance vote-weight recycling (PoC-confirmed), and a reproducibly VERIFIED-CLEAN ERC-20 pre-audit. Every claim links to a public artifact.",
    path: "/case-studies",
  });
  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <div className="flex items-center gap-2 mb-5 text-[11px] font-semibold tracking-[0.18em] uppercase">
          <Link to="/shinren" className="text-[#22D3EE] hover:text-[#34D399] transition-colors">Shinren</Link>
          <ChevronRight size={12} className="text-[#334155]" />
          <span className="text-[#64748B]">Case studies</span>
        </div>
        <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Security case studies</p>
        <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-3xl">
          Real findings, reproduced
          <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">at the rung we actually reached.</span>
        </h1>
        <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
          Each study below links to a public GitHub artifact you can open right now. We label every finding at the rung actually proven, disclose responsibly, and never inflate a severity to manufacture a result — including the honest &ldquo;verified clean&rdquo; outcome.
        </p>

        <div className="mt-16 space-y-8">
          {STUDIES.map((s) => (
            <article key={s.id} id={s.id} className="bg-[#0B1424]/70 border border-white/[0.06] rounded-3xl p-7 md:p-10 backdrop-blur" data-testid={`case-${s.id}`}>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase" style={{ color: s.rc, backgroundColor: `${s.rc}18`, border: `1px solid ${s.rc}44` }}>{s.rung}</span>
                <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#CBD5E1] font-mono">{s.sev}</span>
                <span className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#CBD5E1] font-mono">{s.stack}</span>
              </div>
              <code className="text-sm text-white font-semibold break-all">{s.repo}<span className="text-[#22D3EE]"> {s.ref}</span></code>
              <h2 className="text-2xl md:text-3xl font-bold text-white font-['Outfit'] mt-2 mb-6 leading-snug">{s.title}</h2>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                <Row icon={<Target size={16} />} label="Context">{s.context}</Row>
                <Row icon={<Microscope size={16} />} label="Method">{s.method}</Row>
                <Row icon={<ShieldCheck size={16} />} label="Finding">{s.finding}</Row>
                <Row icon={<FlaskConical size={16} />} label="Evidence">{s.evidence}</Row>
                <Row icon={<CheckCircle2 size={16} />} label="Outcome">{s.outcome}</Row>
              </div>
              <a href={s.url} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#22D3EE] hover:gap-2.5 transition-all">
                Read the public finding <ExternalLink size={13} />
              </a>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-4">
          <Link to="/evidence" className="inline-flex items-center gap-2 text-sm font-semibold text-[#22D3EE] hover:gap-3 transition-all">Full evidence record <ArrowRight size={16} /></Link>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_40px_rgba(34,211,238,0.35)] transition-all">Request a review <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesPage;
