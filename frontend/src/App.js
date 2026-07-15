import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Menu, X, Mail, MapPin, MessageCircle,
  Shield, Brain, Network, Cpu, Lock,
  Eye, Layers, ChevronRight, Globe, Server,
  Activity, Radar, Sparkles, GitBranch, Terminal, LineChart, Zap
} from "lucide-react";
import SenuerenLogo from "./components/SenuerenLogo";
import { SenuerenLogoFull } from "./components/SenuerenLogo";
import { QuesenPage, ShinrenPage, QarsarPage, DiosenPage } from "./components/SystemPages";
import WhyPage from "./components/WhyPage";

const CONTACT_EMAIL = "info@senueren.co.za";
const CONTACT_WHATSAPP_DISPLAY = "067 326 7417";
const CONTACT_WHATSAPP_INTL = "27673267417"; // +27 (South Africa), no leading 0
const SITE_URL = "https://senueren.co.za";

const useSEO = ({ title, description, path = "/" }) => {
  useEffect(() => {
    const fullTitle = title || "Senueren — Sovereign Systems Bureau";
    const fullUrl = `${SITE_URL}${path.startsWith("#") ? path : `/${path.replace(/^\//, "")}`}`;
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

/* ── Intersection Observer Hook ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, isVisible];
};

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const [ref, isVisible] = useInView();
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

/* ── Shared Components ── */

const Logo = () => (
  <Link to="/" className="flex items-center" aria-label="Senueren — Home">
    <SenuerenLogo className="h-12 md:h-14 w-auto" />
  </Link>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => { setIsOpen(false); }, [location]);

  const links = [
    { to: "/", label: "Home" },
    { to: "/why", label: "Why" },
    { to: "/quesen", label: "Quesen" },
    { to: "/shinren", label: "Shinren" },
    { to: "/qarsar", label: "Qarsar" },
    { to: "/diosen", label: "Diosen" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(scrolled || isOpen) ? "bg-[#0A0E17] md:bg-[#0A0E17]/80 md:backdrop-blur-xl border-b border-[#1A2332]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors duration-300 ${location.pathname === l.to ? "text-[#00FFD4]" : "text-[#E8EDF2] hover:text-[#00FFD4]"}`}>{l.label}</Link>
            ))}
          </div>
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-[#0A0E17] overflow-y-auto">
          <div className="px-6 py-10 space-y-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`block text-xl font-medium transition-colors ${location.pathname === l.to ? "text-[#00FFD4]" : "text-[#E8EDF2]"}`}>{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#060A10] py-24 md:py-32 border-t border-[#1A2332] relative">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      <div className="grid md:grid-cols-3 gap-10 mb-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <SenuerenLogo className="h-12 w-auto" />
            <span className="text-2xl logo-chrome">SENUEREN</span>
          </div>
          <p className="text-[#8B9BB4] text-sm leading-relaxed max-w-md mb-4">
            Sovereign Systems Bureau. Proprietary research and execution across protocol intelligence, risk engineering, strategic governance, and information architecture.
          </p>
          <p className="text-[#1A2332] text-xs mt-6">Cape Town, South Africa</p>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-5 text-[#8B9BB4] tracking-[0.2em] uppercase font-['Outfit']">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00FFD4] hover:underline" data-testid="footer-email-link">{CONTACT_EMAIL}</a></li>
            <li>
              <a
                href={`https://wa.me/${CONTACT_WHATSAPP_INTL}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00FFD4] hover:underline inline-flex items-center gap-2"
                data-testid="footer-whatsapp-link"
              >
                <MessageCircle size={14} /> WhatsApp · {CONTACT_WHATSAPP_DISPLAY}
              </a>
            </li>
            <li><span className="text-[#8B9BB4]">Cape Town, South Africa</span></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-[#1A2332]/50 flex flex-col md:flex-row justify-between text-xs text-[#8B9BB4]/60">
        <span>&copy; {new Date().getFullYear()} Senueren. All rights reserved.</span>
        <span className="mt-2 md:mt-0">Sovereign Systems Bureau</span>
      </div>
    </div>
  </footer>
);

/* ── Home Page primitives ────────────────────────────────────────── */

// Internal health endpoint constant. NEVER rendered in visible copy.
const HEALTH_BASE = "https://web-production-30ab5.up.railway.app";

/* Orbital systems diagram — SVG core + 4 orbiting nodes.
   Container rotates slowly; each node counter-rotates to keep labels legible.
   Respects prefers-reduced-motion via the CSS class .orbit-container. */
const OrbitalDiagram = () => {
  const nodes = [
    { key: "quesen",  label: "Quesen",  hue: "#22D3EE", accent: "#4F8CFF", angle:   0, icon: <Cpu size={14} />,     to: "/quesen"  },
    { key: "shinren", label: "Shinren", hue: "#22D3EE", accent: "#22D3EE", angle:  90, icon: <Eye size={14} />,     to: "/shinren" },
    { key: "qarsar",  label: "Qarsar",  hue: "#34D399", accent: "#34D399", angle: 180, icon: <Shield size={14} />,  to: "/qarsar"  },
    { key: "diosen",  label: "Diosen",  hue: "#4F8CFF", accent: "#34D399", angle: 270, icon: <Network size={14} />, to: "/diosen"  },
  ];
  return (
    <div className="orbital-panel" data-testid="home-hero-orbital-diagram">
      <div className="orbital-inner">
        <svg viewBox="0 0 300 300" className="orbital-svg" aria-hidden="true">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%"  stopColor="#22D3EE" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#4F8CFF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#050B1A" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="orbitStroke" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"  stopColor="#4F8CFF" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#22D3EE" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#34D399" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          {/* Core glow halo */}
          <circle cx="150" cy="150" r="120" fill="url(#coreGlow)" />
          {/* Orbit rings */}
          <circle cx="150" cy="150" r="110" fill="none" stroke="url(#orbitStroke)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="150" cy="150" r="82"  fill="none" stroke="url(#orbitStroke)" strokeOpacity="0.20" strokeWidth="1" />
          <circle cx="150" cy="150" r="55"  fill="none" stroke="url(#orbitStroke)" strokeOpacity="0.14" strokeWidth="1" />
          {/* Signal ticks along the outer orbit */}
          <g className="orbital-signal-ticks">
            {[0, 60, 120, 180, 240, 300].map((a) => {
              const rad = (a * Math.PI) / 180;
              return (
                <circle key={a}
                  cx={150 + 110 * Math.cos(rad)}
                  cy={150 + 110 * Math.sin(rad)}
                  r="1.4" fill="#22D3EE" opacity="0.7" />
              );
            })}
          </g>
          {/* Central core */}
          <circle cx="150" cy="150" r="26" fill="#0B1424" stroke="url(#orbitStroke)" strokeWidth="1.2" />
          <circle cx="150" cy="150" r="6"  fill="#22D3EE" opacity="0.9">
            <animate attributeName="r" values="6;7.5;6" dur="3.6s" repeatCount="indefinite" />
          </circle>
          <text x="150" y="196" textAnchor="middle" fontSize="10" letterSpacing="4"
            fill="#94A3B8" fontFamily="Outfit, sans-serif">SENUEREN</text>
        </svg>

        {/* Rotating layer with 4 orbiting nodes */}
        <div className="orbit-container">
          {nodes.map((n) => (
            <Link
              key={n.key}
              to={n.to}
              data-testid={`home-hero-orbital-node-${n.key}`}
              className="orbit-node"
              style={{
                transform: `rotate(${n.angle}deg) translate(110px) rotate(-${n.angle}deg)`,
                borderColor: `${n.hue}66`,
                boxShadow: `0 0 24px -8px ${n.accent}55`,
              }}
              aria-label={`Open ${n.label}`}
            >
              <span className="orbit-node-icon" style={{ color: n.hue }}>{n.icon}</span>
              <span className="orbit-node-label">{n.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

/* Live proof strip — real /health + /version fetch with client-measured latency.
   Never renders the production URL. Respects Page Visibility API. */
const LiveProof = () => {
  const [state, setState] = useState({
    status: "loading",           // loading | operational | degraded | offline
    lastCheck: null,             // Date
    latencyMs: null,             // number
    version: null,               // string
    reportSchema: null,          // string
  });

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const probe = async () => {
      try {
        const t0 = performance.now();
        const healthRes = await fetch(`${HEALTH_BASE}/health`, { signal: controller.signal, cache: "no-store" });
        const t1 = performance.now();
        const healthOk = healthRes.ok;
        let version = null, reportSchema = null;
        if (healthOk) {
          try {
            const versionRes = await fetch(`${HEALTH_BASE}/version`, { signal: controller.signal, cache: "no-store" });
            if (versionRes.ok) {
              const j = await versionRes.json();
              version = j.engine_version || null;
              reportSchema = j.report_schema_version || null;
            }
          } catch { /* silent — /version is decorative */ }
        }
        if (!alive) return;
        setState({
          status: healthOk ? "operational" : "degraded",
          lastCheck: new Date(),
          latencyMs: Math.max(1, Math.round(t1 - t0)),
          version,
          reportSchema,
        });
      } catch {
        if (!alive) return;
        setState({ status: "offline", lastCheck: new Date(), latencyMs: null, version: null, reportSchema: null });
      }
    };

    probe();
    const iv = setInterval(() => {
      if (document.visibilityState === "visible") probe();
    }, 45000);
    return () => {
      alive = false;
      controller.abort();
      clearInterval(iv);
    };
  }, []);

  const statusMap = {
    loading:      { label: "Checking",   dot: "#94A3B8", ring: "" },
    operational:  { label: "Operational", dot: "#34D399", ring: "heartbeat-ring" },
    degraded:     { label: "Degraded",   dot: "#FBBF24", ring: "" },
    offline:      { label: "Unreachable", dot: "#F87171", ring: "" },
  };
  const s = statusMap[state.status];

  const relative = (d) => {
    if (!d) return "—";
    const diff = Math.round((Date.now() - d.getTime()) / 1000);
    if (diff < 5) return "just now";
    if (diff < 60) return `${diff}s ago`;
    return `${Math.round(diff / 60)}m ago`;
  };

  const frameworks = [
    { label: "MCP",         icon: <Terminal size={12} /> },
    { label: "LangChain",   icon: <GitBranch size={12} /> },
    { label: "CrewAI",      icon: <Layers size={12} /> },
    { label: "AutoGen",     icon: <Cpu size={12} /> },
    { label: "Python",      icon: <Server size={12} /> },
    { label: "TypeScript",  icon: <Sparkles size={12} /> },
  ];

  return (
    <div className="live-proof-card" data-testid="home-live-proof">
      <div className="live-proof-row">
        <div className="live-proof-status">
          <span className={`live-proof-dot ${s.ring}`} style={{ backgroundColor: s.dot }} data-testid="home-proof-status-dot" />
          <div className="live-proof-status-text">
            <span className="live-proof-eyebrow">Production posture</span>
            <span className="live-proof-status-label" data-testid="home-proof-status">{s.label}</span>
          </div>
        </div>
        <div className="live-proof-meta">
          <div className="live-proof-meta-item" data-testid="home-proof-last-check">
            <span className="live-proof-eyebrow">Last check</span>
            <span className="live-proof-value">{relative(state.lastCheck)}</span>
          </div>
          <div className="live-proof-meta-item" data-testid="home-proof-latency">
            <span className="live-proof-eyebrow">Latency</span>
            <span className="live-proof-value">{state.latencyMs == null ? "—" : `${state.latencyMs} ms`}</span>
          </div>
          <div className="live-proof-meta-item" data-testid="home-proof-version">
            <span className="live-proof-eyebrow">Engine</span>
            <span className="live-proof-value">{state.version ? `v${state.version}` : "—"}</span>
          </div>
        </div>
      </div>
      <div className="live-proof-frameworks" data-testid="home-proof-framework-badges">
        {frameworks.map((f) => (
          <span key={f.label} className="framework-badge">
            <span className="framework-badge-icon">{f.icon}</span>
            {f.label}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Home Page ── */

const HomePage = () => {
  useSEO({
    title: "Senueren — Sovereign Systems Bureau",
    description: "Sovereign infrastructure firm building deterministic systems for the autonomous economy. Quesen, Shinren, Qarsar, Diosen — engineered, evidence-first, quietly formidable.",
    path: "/",
  });

  const pillars = [
    {
      key: "quesen",
      icon: <Cpu size={22} />,
      title: "Quesen",
      subtitle: "Deterministic Trust Infrastructure",
      desc: "The decision layer for autonomous agents. Same input, same decision — no LLM in the scoring loop. Chain-neutral, framework-neutral, versioned by design.",
      href: "/quesen",
      signatureClass: "sys-quesen",
    },
    {
      key: "shinren",
      icon: <Eye size={22} />,
      title: "Shinren",
      subtitle: "Protocol Intelligence System",
      desc: "Discipline-first security research infrastructure for on-chain autonomous systems. Every finding evidence-gated before it reaches a customer.",
      href: "/shinren",
      signatureClass: "sys-shinren",
    },
    {
      key: "qarsar",
      icon: <Shield size={22} />,
      title: "Qarsar",
      subtitle: "Strategic Intelligence System",
      desc: "Autonomous discovery and execution infrastructure for on-chain economic opportunities. Evidence-first hypothesis lifecycle with deterministic promotion gates.",
      href: "/qarsar",
      signatureClass: "sys-qarsar",
    },
    {
      key: "diosen",
      icon: <Network size={22} />,
      title: "Diosen",
      subtitle: "Quantitative Intelligence System",
      desc: "Institutional-grade quantitative intelligence. Research, simulation, and decision-support flowing through a progressive validation lifecycle.",
      href: "/diosen",
      signatureClass: "sys-diosen",
    },
  ];

  const principles = [
    { icon: <Lock size={20} />,     title: "Closed-Loop",         line: "We do not sell tooling. We build and control what our systems require.", promise: "Every primitive is internally sufficient." },
    { icon: <Eye size={20} />,      title: "Precision Over Volume", line: "Every engagement is deliberate. Selective scale over noisy growth.",     promise: "Structural problems only." },
    { icon: <Sparkles size={20} />, title: "Systems Autonomy",    line: "Sovereign by construction. No external dependencies at the core.",       promise: "Stand alone before integrating." },
  ];

  return (
    <div className="min-h-screen">
      {/* ══════════════════════ HERO ══════════════════════ */}
      <section className="relative pt-28 md:pt-36 pb-20 md:pb-28 px-6 md:px-12 overflow-hidden">
        {/* Decorative aurora glow */}
        <div className="aurora-glow" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_460px] gap-14 lg:gap-20 items-center">
            {/* Left — copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
                  <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#CBD5E1]">
                    Sovereign Systems Bureau
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={80}>
                <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-['Outfit'] leading-[1.02] tracking-tight">
                  Deterministic infrastructure
                  <span className="block gradient-text">for the autonomous economy.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={160}>
                <p className="mt-7 text-[15px] md:text-lg text-[#94A3B8] leading-relaxed max-w-xl">
                  Four reinforcing systems engineered from first principles.
                  Same input, same decision. Same evidence, same conclusion.
                  Built to reason, defend, and act at institutional scale.
                </p>
              </FadeIn>
              <FadeIn delay={240}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <a href="#systems" data-testid="home-hero-explore-systems-button"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_36px_rgba(34,211,238,0.35)] transition-shadow duration-500">
                    Explore the systems <ArrowRight size={15} />
                  </a>
                  <Link to="/quesen" data-testid="home-hero-integration-surface-button"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#E2E8F0] border border-white/10 hover:border-[#22D3EE]/40 hover:text-white transition-colors duration-500">
                    Integration surface <ChevronRight size={15} />
                  </Link>
                </div>
              </FadeIn>
              <FadeIn delay={320}>
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] tracking-[0.18em] uppercase text-[#64748B]">
                  <span className="flex items-center gap-2"><Activity size={12} className="text-[#22D3EE]" /> Operational posture</span>
                  <span className="text-[#1A2332]">·</span>
                  <span className="flex items-center gap-2"><Shield size={12} className="text-[#34D399]" /> Institutional-grade</span>
                  <span className="text-[#1A2332]">·</span>
                  <span className="flex items-center gap-2"><Radar size={12} className="text-[#4F8CFF]" /> Built for agents</span>
                </div>
              </FadeIn>
            </div>

            {/* Right — orbital diagram */}
            <FadeIn delay={140}>
              <OrbitalDiagram />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════ LIVING PROOF ══════════════════════ */}
      <section className="px-6 md:px-12 pb-6 md:pb-10">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <LiveProof />
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════ SYSTEMS GRID ══════════════════════ */}
      <section id="systems" className="py-24 md:py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
            {/* Left legend */}
            <div className="lg:sticky lg:top-32">
              <FadeIn>
                <div className="accent-bar w-12 mb-6" />
                <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Operational Primitives</p>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] tracking-tight">The four systems.</h2>
                <p className="text-[#94A3B8] mt-4 text-sm leading-relaxed">
                  Each system stands alone commercially.
                  Together they form the deterministic trust layer of the autonomous economy — with Quesen as the shared spine.
                </p>
                <Link to="/why" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#22D3EE] hover:text-[#34D399] transition-colors" data-testid="home-systems-interlock-cta">
                  See how they interlock <ArrowRight size={13} />
                </Link>
              </FadeIn>
            </div>

            {/* Right cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {pillars.map((p, i) => (
                <FadeIn key={p.key} delay={i * 80}>
                  <Link to={p.href} className={`system-card ${p.signatureClass}`} data-testid={`home-system-card-${p.key}`}>
                    <div className="system-card-inner">
                      <div className="system-card-header">
                        <div className="system-card-icon">{p.icon}</div>
                        <ChevronRight size={16} className="system-card-chev" />
                      </div>
                      <h3 className="system-card-title">{p.title}</h3>
                      <p className="system-card-subtitle">{p.subtitle}</p>
                      <p className="system-card-desc">{p.desc}</p>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ OPERATING PRINCIPLES ══════════════════════ */}
      <section id="principles" className="py-24 md:py-32 px-6 md:px-12 relative">
        <div className="section-radial-halo" aria-hidden="true" />
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="mb-14 md:mb-16 max-w-2xl">
              <div className="accent-bar w-12 mb-6" />
              <p className="text-[11px] font-bold tracking-[0.24em] uppercase text-[#22D3EE] mb-3">Principles</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] tracking-tight">
                Non-negotiable invariants.
              </h2>
              <p className="text-[#94A3B8] mt-4 text-sm md:text-base leading-relaxed">
                Every system operates under the same three commitments. They govern what we build, what we ship, and what we refuse.
              </p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {principles.map((p, i) => (
              <FadeIn key={p.title} delay={i * 100}>
                <div className="plaque" data-testid={`home-principle-${i}`}>
                  <div className="plaque-notch" aria-hidden="true" />
                  <div className="plaque-icon">{p.icon}</div>
                  <div className="plaque-hairline" aria-hidden="true" />
                  <h3 className="plaque-title">{p.title}</h3>
                  <p className="plaque-body">{p.line}</p>
                  <p className="plaque-promise">— {p.promise}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Manifest blockquote */}
          <FadeIn delay={240}>
            <div className="manifest-block">
              <div className="manifest-halo" aria-hidden="true" />
              <blockquote className="manifest-quote">
                <span aria-hidden="true" className="manifest-marks">"</span>
                We do not build for the market.
                <span className="block gradient-text">We build for the problem.</span>
              </blockquote>
              <div className="manifest-underline" aria-hidden="true" />
              <p className="manifest-signature">— Senueren · Sovereign Systems Bureau</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════ CTA RAIL ══════════════════════ */}
      <section className="pb-28 md:pb-36 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Developers */}
            <div className="cta-lane cta-lane-dev">
              <div className="cta-lane-eyebrow">
                <Terminal size={14} />
                <span>Developers / Integrators</span>
              </div>
              <h3 className="cta-lane-title">Integrate deterministic risk in three lines.</h3>
              <p className="cta-lane-desc">
                Python · JavaScript / TypeScript · LangChain · CrewAI · AutoGen · native MCP stdio server.
                Same interface, deterministic responses, versioned by construction.
              </p>
              <div className="cta-lane-actions">
                <Link to="/quesen" data-testid="home-cta-rail-read-quesen-button"
                  className="cta-primary">
                  Read Quesen <ArrowRight size={14} />
                </Link>
                <a href="https://github.com/Shxnque?tab=repositories&q=quesen" target="_blank" rel="noreferrer"
                  data-testid="home-cta-rail-sdks-button" className="cta-secondary">
                  View SDKs <ChevronRight size={14} />
                </a>
              </div>
            </div>

            {/* Investors / Partners */}
            <div className="cta-lane cta-lane-partners">
              <div className="cta-lane-eyebrow">
                <LineChart size={14} />
                <span>Investors / Partners</span>
              </div>
              <h3 className="cta-lane-title">Selective institutional engagement.</h3>
              <p className="cta-lane-desc">
                Enterprise, protocol teams, and institutional partners only.
                Every conversation is deliberate. Every partnership is chosen.
              </p>
              <div className="cta-lane-actions">
                <Link to="/contact" data-testid="home-cta-rail-contact-button"
                  className="cta-primary">
                  Start a conversation <ArrowRight size={14} />
                </Link>
                <Link to="/why" data-testid="home-cta-rail-why-button" className="cta-secondary">
                  Why Senueren <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── About Page ── */

const AboutPage = () => {
  useSEO({
    title: "About — Senueren | Sovereign Systems Bureau",
    description: "Senueren is a sovereign systems bureau operating from Cape Town. Proprietary AI and decentralized protocol tooling. Founded by Quelum Wilson.",
    path: "/about",
  });
  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="mb-16">
            <div className="accent-bar w-12 mb-6"></div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Bureau</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">
              About Senueren
            </h1>
          </div>
        </FadeIn>

        <div className="space-y-10">
          <FadeIn>
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-['Outfit']">
                A research and execution bureau
              </h2>
              <p className="text-[#8B9BB4] leading-relaxed mb-4">
                Senueren operates as a sovereign systems bureau — building proprietary intelligence and security tooling across decentralized protocols and AI infrastructure. We do not pursue volume. We do not seek visibility. The work speaks through its outputs.
              </p>
              <p className="text-[#8B9BB4] leading-relaxed">
                Our operational primitives — Shinren, Quesen, Qarsar, and Scrapling — represent closed-loop systems designed to identify, model, govern, and structure information across complex protocol environments.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow h-full">
                <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                  <Globe size={20} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">Domain</h3>
                <p className="text-[#8B9BB4] leading-relaxed">
                  Decentralized protocol security, AI reasoning systems, governance mechanism design, and structured intelligence extraction.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow h-full">
                <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                  <Shield size={20} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">Posture</h3>
                <p className="text-[#8B9BB4] leading-relaxed">
                  Proprietary by default. We build tools for controlled deployment — not open-market distribution. Precision, discretion, structural integrity.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Founder Section */}
          <FadeIn delay={150}>
            <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4A9FD8] to-[#00FFD4] flex items-center justify-center text-[#00FFD4] text-2xl font-bold flex-shrink-0 font-['Outfit']">
                  QW
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Quelum Wilson</h3>
                  <p className="text-[#00FFD4] text-sm font-medium mb-4">Founder</p>
                  <p className="text-[#8B9BB4] leading-relaxed mb-3">
                    Senueren was established by Quelum Wilson in Cape Town with a singular orientation: build systems of consequence. The bureau operates at the intersection of AI, decentralized protocols, and security infrastructure.
                  </p>
                  <p className="text-[#8B9BB4] leading-relaxed">
                    Prior to the bureau's current configuration, foundational work in systems architecture and operational engineering informed the development of each proprietary primitive.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#8B9BB4]">
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#00FFD4]" /> Cape Town, South Africa
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

/* ── Contact Page ── */

const ContactPage = () => {
  useSEO({
    title: "Contact — Senueren | Sovereign Systems Bureau",
    description: "Contact Senueren for strategic infrastructure enquiries. Cape Town, South Africa.",
    path: "/contact",
  });
  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="mb-16">
            <div className="accent-bar w-12 mb-6"></div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Contact</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">
              Enquiries
            </h1>
            <p className="text-lg text-[#8B9BB4] max-w-2xl">
              For matters relating to strategic infrastructure, protocol security, or foundational engineering capacity.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <FadeIn delay={100}>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="block bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow hover:border-[#00FFD4]/40 transition-colors"
              data-testid="contact-email-card"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                <Mail size={24} />
              </div>
              <h3 className="text-white font-bold text-sm mb-2 font-['Outfit']">Email</h3>
              <span className="text-[#00FFD4] text-sm hover:underline break-all">{CONTACT_EMAIL}</span>
            </a>
          </FadeIn>
          <FadeIn delay={150}>
            <a
              href={`https://wa.me/${CONTACT_WHATSAPP_INTL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow hover:border-[#00FFD4]/40 transition-colors"
              data-testid="contact-whatsapp-card"
            >
              <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-white font-bold text-sm mb-2 font-['Outfit']">WhatsApp</h3>
              <span className="text-[#00FFD4] text-sm hover:underline">{CONTACT_WHATSAPP_DISPLAY}</span>
              <p className="text-[11px] text-[#8B9BB4] mt-2">Direct line for aligned enquiries.</p>
            </a>
          </FadeIn>
          <FadeIn delay={200}>
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow" data-testid="contact-location-card">
              <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                <MapPin size={24} />
              </div>
              <h3 className="text-white font-bold text-sm mb-2 font-['Outfit']">Location</h3>
              <p className="text-[#8B9BB4] text-sm">Cape Town, South Africa</p>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={300}>
          <div className="mt-10 p-6 bg-[#0F1419]/50 border border-[#1A2332] rounded-2xl text-center">
            <p className="text-[#8B9BB4] text-sm">
              Senueren does not operate as a service provider. Engagement is selective and by alignment only.
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

/* ── Main App ── */

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/why" element={<WhyPage />} />
          <Route path="/quesen" element={<QuesenPage />} />
          <Route path="/shinren" element={<ShinrenPage />} />
          <Route path="/qarsar" element={<QarsarPage />} />
          <Route path="/diosen" element={<DiosenPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;