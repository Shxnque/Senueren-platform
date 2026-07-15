import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Eye, Compass, Sparkles, Layers, Cpu, Network, Server,
  Boxes, Zap, Radar, Binary, Building2, Users, LineChart, Lock
} from "lucide-react";

/**
 * /why — Why Senueren.
 *
 * NOT a company history. Answers three audiences in one page:
 *   Developers: "Can I integrate this today?"
 *   Investors:  "Is there a scalable business here?"
 *   Enterprise: "Can we trust this in production?"
 *
 * Every claim is measurable or refuses to be made.
 */

const useSEO = ({ title, description, path }) => {
  useEffect(() => {
    const SITE_URL = "https://senueren.co.za";
    const fullUrl = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
    }
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:url"]', "content", fullUrl);
    set('link[rel="canonical"]', "href", fullUrl);
  }, [title, description, path]);
};

const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="mb-14">
    <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
    <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">{eyebrow}</p>
    <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">{title}</h2>
    {subtitle && <p className="text-[#94A3B8] mt-4 max-w-2xl text-sm leading-relaxed">{subtitle}</p>}
  </div>
);

const Card = ({ icon, title, desc }) => (
  <div className="bg-[#0B1424]/70 border border-white/[0.06] rounded-2xl p-6 hover:border-[#22D3EE]/30 transition-colors duration-300 backdrop-blur h-full">
    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E3A8A]/40 to-[#065F46]/30 border border-white/10 flex items-center justify-center text-[#22D3EE] mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{title}</h3>
    <p className="text-sm text-[#94A3B8] leading-relaxed">{desc}</p>
  </div>
);

export const WhyPage = () => {
  useSEO({
    title: "Why Senueren — Engineering Autonomous Infrastructure",
    description: "Senueren is an autonomous infrastructure company. Four reinforcing systems — Quesen, Shinren, Qarsar, Diosen — engineered to serve the autonomous economy: deterministic, auditable, and defensible under scrutiny.",
    path: "/why",
  });

  return (
    <div className="min-h-screen pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-24">

        {/* Hero */}
        <section>
          <div className="h-px w-14 bg-gradient-to-r from-[#22D3EE] to-[#10B981] mb-6" />
          <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Why Senueren</p>
          <h1 className="text-4xl md:text-6xl tracking-tight font-bold text-white font-['Outfit'] leading-[1.05] max-w-4xl">
            Engineering the infrastructure
            <span className="block bg-gradient-to-r from-[#4F8CFF] via-[#22D3EE] to-[#34D399] bg-clip-text text-transparent">
              autonomous systems depend on.
            </span>
          </h1>
          <p className="text-lg text-[#94A3B8] mt-8 max-w-2xl leading-relaxed">
            The next generation of software will operate without humans in the loop. Autonomous agents, protocols, and trading systems will act
            on the world at machine speed. The infrastructure they rely on cannot be probabilistic — it has to be reproducible,
            auditable, and defensible under scrutiny. Senueren builds that layer.
          </p>
        </section>

        {/* Three audiences */}
        <section>
          <SectionHeader eyebrow="Audiences" title="Built for three readers at once." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card icon={<Cpu size={22} />} title="For developers" desc="A small, opinionated integration surface. Framework-neutral SDKs. Three lines to your first deterministic decision. No LLM, no vendor lock-in." />
            <Card icon={<LineChart size={22} />} title="For investors" desc="One platform, four reinforcing products. A single deterministic engine feeds risk, security, discovery, and trading — with a public developer surface driving distribution." />
            <Card icon={<Building2 size={22} />} title="For enterprise buyers" desc="Auditable, reproducible, framework-neutral. Every response is versioned. Every decision is defensible under scrutiny. Deploy where it matters." />
          </div>
        </section>

        {/* The four products */}
        <section>
          <SectionHeader
            eyebrow="Platform"
            title="One platform. Four reinforcing products."
            subtitle="Each product stands alone commercially. Together they form a coherent trust layer for autonomous systems — with the Quesen decision engine as the shared spine."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: <Shield size={22} />, name: "Quesen", tag: "Deterministic trust infrastructure", desc: "The decision layer. Every autonomous action passes through it. Same input, same decision." },
              { icon: <Radar size={22} />, name: "Shinren", tag: "Autonomous protocol intelligence", desc: "The security research spine. Every finding is evidence-gated before it reaches a customer." },
              { icon: <Network size={22} />, name: "Qarsar", tag: "Strategic intelligence & discovery", desc: "The opportunity engine. Continuous survey of the on-chain landscape. Deterministic promotion gates." },
              { icon: <Binary size={22} />, name: "Diosen", tag: "Autonomous quantitative execution", desc: "The trading spine. Evidence-driven strategy discovery. Progressive deployment lifecycle." },
            ].map((p) => (
              <Card key={p.name} icon={p.icon} title={`${p.name} — ${p.tag}`} desc={p.desc} />
            ))}
          </div>
        </section>

        {/* Principles */}
        <section>
          <SectionHeader eyebrow="Philosophy" title="Non-negotiable principles." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card icon={<Lock size={22} />} title="Determinism over probability" desc="Every decision-path invariant: same input, same output. No probabilistic scoring where autonomy is at stake." />
            <Card icon={<Eye size={22} />} title="Evidence over conviction" desc="Nothing ships on intuition. Every promotion, every deployment, every rule requires reproducible evidence." />
            <Card icon={<Compass size={22} />} title="Selective over scale" desc="We do not pursue volume. Every partnership is deliberate. Every engagement is chosen." />
            <Card icon={<Sparkles size={22} />} title="Sovereign over dependent" desc="Systems must stand alone before they integrate. No external dependencies at the core of any product." />
          </div>
        </section>

        {/* Positioning */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-10 md:p-16 bg-gradient-to-br from-[#0B1424] via-[#0D1E3A] to-[#052E2E]">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "radial-gradient(circle at 30% 20%, rgba(34,211,238,0.15), transparent 60%), radial-gradient(circle at 80% 80%, rgba(16,185,129,0.12), transparent 60%)" }} />
          <div className="relative">
            <p className="text-[11px] font-semibold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Positioning</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-['Outfit'] mb-6 max-w-3xl">
              Not another AI product. Deterministic infrastructure.
            </h2>
            <p className="text-[#94A3B8] max-w-2xl leading-relaxed mb-8">
              The market is crowded with probabilistic tools. Senueren occupies a different position — the layer beneath them, providing the
              reproducible decisions and auditable evidence they cannot supply on their own.
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

export default WhyPage;
