import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ExternalLink, Code2, Search, Rocket, Sparkles,
  Globe, ShieldCheck, Smartphone, Gauge, LineChart, Layers,
  CheckCircle2, MessageCircle,
} from 'lucide-react';

/* Small helper for the eyebrow badge Senueren uses across the site */
const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
    <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
    <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#CBD5E1]">
      {children}
    </span>
  </div>
);

const Stat = ({ v, label }) => (
  <div>
    <div className="text-2xl md:text-3xl font-bold text-white font-['Outfit']">{v}</div>
    <div className="text-[11px] tracking-[0.18em] uppercase text-[#64748B] mt-1">{label}</div>
  </div>
);

const SERVICES = [
  {
    icon: <Globe size={20} />,
    title: 'Brand & Marketing Sites',
    desc: 'Full brand builds that read premium and load fast, crafted, not templated. Every section written and designed for the story it needs to carry.',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Custom Platform Builds',
    desc: 'React + Node/FastAPI applications for teams that have outgrown off-the-shelf tools. Bespoke where it counts, standard where it should be.',
  },
  {
    icon: <Smartphone size={20} />,
    title: 'Mobile-first, Everywhere',
    desc: 'Every build ships mobile-first with responsive layouts tuned across phone, tablet and desktop. No dead zones, no clipped text, no horizontal scroll.',
  },
  {
    icon: <Search size={20} />,
    title: 'SEO, Baked In',
    desc: 'Structured data (JSON-LD), sitemap, canonicals, Open Graph, per-page meta, and clean semantic markup on every page. Not an add-on, the way we build.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Security & Compliance',
    desc: 'HTTPS, CSP, HSTS, POPIA-aware cookie handling, and secrets kept out of the codebase. The boring stuff, done properly.',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Performance & Care',
    desc: 'Sub-second first paint targets, image optimisation, code-splitting, and honest post-launch care so the site keeps performing months in.',
  },
];

/* Feature-list checkmark row */
const Check = ({ children }) => (
  <li className="flex items-start gap-3 text-sm text-[#CBD5E1] leading-relaxed">
    <CheckCircle2 size={16} className="text-[#34D399] mt-0.5 shrink-0" />
    <span>{children}</span>
  </li>
);

export default function LegacyPage() {
  const [tab, setTab] = useState('desktop'); // 'desktop' | 'projects' | 'mobile'

  const shot =
    tab === 'desktop'  ? '/portfolio/nehemia/hero-desktop.jpg'
  : tab === 'projects' ? '/portfolio/nehemia/projects-desktop.jpg'
  :                      '/portfolio/nehemia/hero-mobile.jpg';

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* ============ HERO ============ */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-20 px-6 md:px-12 overflow-hidden">
        <div className="aurora-glow" aria-hidden="true" />
        <div className="max-w-6xl mx-auto relative z-10">
          <Eyebrow>Legacy Infrastructure</Eyebrow>
          <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-['Outfit'] leading-[1.02] tracking-tight max-w-4xl">
            Legacy infrastructure
            <span className="block gradient-text">built to feel real.</span>
          </h1>
          <p className="mt-7 text-[15px] md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            Alongside the sovereign systems work, Senueren designs and builds
            legacy infrastructure for founders, brands and operators.
            Bespoke sites and applications, engineered end-to-end, fast,
            secure, mobile-first, and shipped with the same care we put into
            the rest of our stack. If you have a project in mind, we’d love to
            hear about it.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/contact" data-testid="legacy-cta-start-project"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_36px_rgba(34,211,238,0.35)] transition-shadow duration-500">
              Start a project <ArrowRight size={15} />
            </Link>
            <a href="#nehemia" data-testid="legacy-cta-see-work"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#E2E8F0] border border-white/10 hover:border-[#22D3EE]/40 hover:text-white transition-colors duration-500">
              See recent work
            </a>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] tracking-[0.18em] uppercase text-[#64748B]">
            <span className="flex items-center gap-2"><Rocket size={12} className="text-[#22D3EE]" /> Ground-up builds</span>
            <span className="text-[#1A2332]">·</span>
            <span className="flex items-center gap-2"><Sparkles size={12} className="text-[#34D399]" /> Design + engineering under one roof</span>
            <span className="text-[#1A2332]">·</span>
            <span className="flex items-center gap-2"><LineChart size={12} className="text-[#4F8CFF]" /> Cape Town · remote-friendly</span>
          </div>
        </div>
      </section>

      {/* ============ WHAT WE BUILD ============ */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <div className="accent-bar w-12 mb-6" />
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">What we build</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] tracking-tight">
              Web platforms, done carefully.
            </h2>
            <p className="text-[#94A3B8] mt-4 text-sm md:text-base leading-relaxed">
              Everything under one roof, design, build, deploy, and the SEO,
              security and performance work that makes a site actually last.
              Small enough to move fast, technical enough to build serious things.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 hover:border-[#22D3EE]/30 transition-colors">
                <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#22D3EE] mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{s.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CASE STUDY, NEHEMIA / MLNI ============ */}
      <section id="nehemia" className="py-16 md:py-24 px-6 md:px-12 border-t border-[#1A2332]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
            <div className="max-w-2xl">
              <div className="accent-bar w-12 mb-6" />
              <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Featured build</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-['Outfit'] tracking-tight leading-[1.05]">
                Nehemia, <span className="gradient-text">MLNI Holdings</span>
              </h2>
              <p className="mt-4 text-[#94A3B8] text-sm md:text-base leading-relaxed">
                A premium construction and property development brand website
                for MLNI Holdings, based in Grabouw, Western Cape. Replaced
                their older WordPress site with a modern React platform,
                custom-built end-to-end, design, engineering, SEO and deploy.
              </p>
            </div>
            <a
              href="https://mlni-holdings.co.za"
              target="_blank"
              rel="noopener"
              data-testid="legacy-nehemia-visit-live"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#E2E8F0] border border-white/10 hover:border-[#22D3EE]/40 hover:text-white transition-colors duration-500"
            >
              Visit mlni-holdings.co.za <ExternalLink size={14} />
            </a>
          </div>

          {/* Fact strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-[#1A2332]">
            <Stat v="React SPA"    label="Framework" />
            <Stat v="7 projects"   label="Portfolio system" />
            <Stat v="~293 ms"      label="DOM ready (live)" />
            <Stat v="HTTPS / CSP"  label="Security posture" />
          </div>

          {/* Browser mock frame with switchable screenshots */}
          <div className="rounded-2xl border border-[#1A2332] bg-gradient-to-b from-[#0F1419] to-[#080B12] p-3 md:p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F87171]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399]/70" />
                <span className="ml-3 text-[11px] font-mono text-[#64748B]">mlni-holdings.co.za</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { k: 'desktop',  label: 'Home' },
                  { k: 'projects', label: 'Projects' },
                  { k: 'mobile',   label: 'Mobile' },
                ].map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setTab(t.k)}
                    data-testid={`legacy-nehemia-tab-${t.k}`}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                      tab === t.k
                        ? 'bg-[#22D3EE] text-[#050B1A]'
                        : 'bg-white/[0.03] text-[#94A3B8] border border-white/10 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden bg-[#050B1A]">
              {/* Center the mobile shot inside a wider viewport frame */}
              {tab === 'mobile' ? (
                <div className="flex justify-center py-10 md:py-14 bg-gradient-to-b from-[#0F1419] to-[#080B12]">
                  <div className="rounded-3xl overflow-hidden border border-[#1A2332] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]" style={{ width: 260 }}>
                    <img src={shot} alt="MLNI Holdings on mobile" className="w-full h-auto block" loading="lazy" />
                  </div>
                </div>
              ) : (
                <img
                  src={shot}
                  alt={tab === 'projects' ? 'MLNI Holdings projects page' : 'MLNI Holdings homepage'}
                  className="w-full h-auto block"
                  loading="lazy"
                />
              )}
            </div>
          </div>

          {/* What we built */}
          <div className="grid md:grid-cols-2 gap-8 mt-14">
            <div>
              <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#22D3EE] mb-4">What we built</p>
              <ul className="space-y-3">
                <Check>Full React single-page app replacing a legacy WordPress site, with a 7-project portfolio system that Que and the team can extend.</Check>
                <Check>Design system built around MLNI’s navy + gold brand, hero art direction, custom project cards, sticky mobile action bar (Call / WhatsApp / Quote).</Check>
                <Check>Contact and quote endpoints via PHP on xneelo shared hosting, with server-side validation and honeypot spam protection.</Check>
                <Check>Google Maps embed, WhatsApp float, POPIA-aware cookie consent, and a compliance-ready /trust page.</Check>
                <Check>Custom SEO layer: per-page titles + descriptions, canonical + sitemap, Open Graph and Twitter cards.</Check>
                <Check>Structured data (JSON-LD): GeneralContractor, ItemList of projects, CreativeWork per project, BreadcrumbList, FAQPage on the quote form, all the shapes Google likes.</Check>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#34D399] mb-4">Engineering & delivery</p>
              <ul className="space-y-3">
                <Check>GitHub Actions CI/CD: every push to <span className="font-mono text-[#CBD5E1]">main</span> rebuilds and FTP-deploys to xneelo automatically.</Check>
                <Check>Proper 404 status codes via Apache <span className="font-mono text-[#CBD5E1]">.htaccess</span> whitelist so Google stops indexing phantom URLs.</Check>
                <Check>Content-Security-Policy, HSTS, X-Frame-Options, Referrer-Policy, the full security-header set.</Check>
                <Check>Sub-300 ms DOM ready on the live site, images compressed and progressive JPEG, gzip on all text assets.</Check>
                <Check>Custom monogram logo lockup and cropped favicon set generated from the source mark.</Check>
                <Check>Ongoing care, iterating on copy, portfolio pages and SEO after the initial launch.</Check>
              </ul>
            </div>
          </div>

          {/* Tech chips */}
          <div className="mt-14">
            <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#64748B] mb-3">Stack</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'React Router', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'react-helmet-async',
                'PHP (form endpoints)', 'Apache / xneelo', 'GitHub Actions', 'Sonner (toasts)', 'Lucide icons'].map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-mono text-[#CBD5E1] bg-white/[0.03] border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="pb-28 md:pb-36 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="cta-lane cta-lane-partners">
            <div className="cta-lane-eyebrow">
              <MessageCircle size={14} />
              <span>Have a project in mind?</span>
            </div>
            <h3 className="cta-lane-title">Let’s build something you’ll be proud of.</h3>
            <p className="cta-lane-desc">
              From a single-page brand site to a full platform, tell us
              what you need. We respond within one working day with a
              scoped proposal and a price. Straight talk, no jargon.
            </p>
            <div className="cta-lane-actions">
              <Link to="/contact" data-testid="legacy-cta-footer-contact" className="cta-primary">
                Get in touch <ArrowRight size={14} />
              </Link>
              <a
                href="https://mlni-holdings.co.za"
                target="_blank"
                rel="noopener"
                data-testid="legacy-cta-footer-visit"
                className="cta-secondary"
              >
                Visit MLNI live <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
