import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Menu, X, Mail, MapPin, MessageCircle,
  Shield, Brain, Network, Cpu, Lock,
  Eye, Layers, ChevronRight, Globe, Server
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

/* ── Home Page ── */

const HomePage = () => {
  useSEO({
    title: "Senueren — Sovereign Systems Bureau",
    description: "Proprietary research and execution bureau operating across protocol intelligence, risk engineering, strategic governance, and information architecture. Decentralized protocols and AI security tooling.",
    path: "/",
  });

  const pillars = [
    {
      icon: <Shield size={24} />,
      title: "Quesen",
      subtitle: "Risk Engineering · v1.5.0",
      desc: "The deterministic trust layer for autonomous agents. Same input in, same decision out. No LLM in the scoring loop. An expanding Conflict Matrix and on-chain enrichment across major EVM networks.",
      href: "/quesen",
    },
    {
      icon: <Brain size={24} />,
      title: "Shinren",
      subtitle: "Protocol Intelligence",
      desc: "Discipline-first security research infrastructure for on-chain autonomous systems. Composable analysis stack with an evidence-gated findings pipeline.",
      href: "/shinren",
    },
    {
      icon: <Network size={24} />,
      title: "Qarsar",
      subtitle: "Strategic Governance · MEV Research",
      desc: "Autonomous discovery and execution infrastructure for on-chain economic opportunities. Evidence-first hypothesis lifecycle with deterministic promotion gates.",
      href: "/qarsar",
    },
    {
      icon: <Cpu size={24} />,
      title: "Diosen",
      subtitle: "Quantitative Intelligence System",
      desc: "Institutional-grade quantitative intelligence infrastructure. Evidence-driven research, simulation, and decision-support flowing through a progressive validation lifecycle with explicit promotion criteria at every step.",
      href: "/diosen",
    },
    {
      icon: <Layers size={24} />,
      title: "Scrapling",
      subtitle: "Information Architecture",
      desc: "Adaptive scraping framework. Structured extraction and synthesis of unstructured protocol data. Intelligence feeds, documentation systems, and knowledge graph construction.",
      href: null,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-[#0A0E17]">
        {/* grid overlay removed — starfield in App.css handles the atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0A0E17]/95 to-[#0A0E17]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-[#00FFD4]/30 bg-[#00FFD4]/10 text-[#00FFD4] mb-8">
                Sovereign Systems Bureau
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight font-bold text-white mb-8 font-['Outfit'] leading-[1.05]">
                Proprietary Research<br />
                <span className="gradient-text">&amp; Execution</span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg text-[#8B9BB4] leading-relaxed mb-10 max-w-2xl">
                We build and operate closed-loop intelligence systems across decentralized protocols, AI security, and strategic infrastructure. Our tools are proprietary. Our work is deliberate.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex items-center gap-6 text-xs text-[#8B9BB4]/60 tracking-wide uppercase">
                <span>Protocol Intelligence</span>
                <span className="text-[#1A2332]">·</span>
                <span>Risk Engineering</span>
                <span className="text-[#1A2332]">·</span>
                <span>Strategic Governance</span>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Operational Primitives */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0E17] relative noise-texture">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="mb-16">
              <div className="accent-bar w-12 mb-6"></div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Operational Primitives</p>
              <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">Core Systems</h2>
              <p className="text-[#8B9BB4] mt-4 max-w-xl text-sm leading-relaxed">
                Four proprietary systems. Each operates independently. Each reinforces the others.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                {item.href ? (
                  <Link to={item.href} className="block bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow group h-full hover:border-[#00FFD4]/40 transition-all">
                    <div className="flex items-start gap-5 mb-5">
                      <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white font-['Outfit']">{item.title}</h3>
                          <ChevronRight size={16} className="text-[#8B9BB4] group-hover:text-[#00FFD4] group-hover:translate-x-1 transition-all" />
                        </div>
                        <p className="text-xs text-[#00FFD4] font-medium tracking-wide uppercase">{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                  </Link>
                ) : (
                  <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow group h-full">
                    <div className="flex items-start gap-5 mb-5">
                      <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-['Outfit']">{item.title}</h3>
                        <p className="text-xs text-[#00FFD4] font-medium tracking-wide uppercase">{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                  </div>
                )}
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Doctrine */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0F1419]">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="accent-bar w-12 mb-6"></div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Principles</p>
              <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">Operating Principles</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Lock size={22} />, title: "Closed-Loop", desc: "Our systems are built for internal operation. We do not sell SaaS. We do not license tooling. What we build, we control." },
              { icon: <Eye size={22} />, title: "Precision Over Volume", desc: "Every engagement is deliberate. We select problems with structural significance and deploy resources with zero waste." },
              { icon: <Cpu size={22} />, title: "Systems Autonomy", desc: "Each primitive is self-sustaining. No external dependencies for core operations. Sovereign infrastructure from first principles." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-[#0A0E17] border border-[#1A2332] rounded-2xl p-7 card-glow group">
                  <div className="w-11 h-11 rounded-lg bg-[#0F1419] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                  <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={200}>
            <div className="text-center max-w-3xl mx-auto mt-16">
              <blockquote className="text-xl md:text-2xl text-[#E8EDF2] font-medium leading-relaxed font-['Outfit']">
                "We do not build for the market. We build for the problem."
              </blockquote>
              <div className="accent-bar w-12 mx-auto mt-8"></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Foundational Infrastructure */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0E17] border-t border-[#1A2332]">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Server size={18} className="text-[#8B9BB4]" />
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B9BB4]">Foundational Infrastructure</p>
              </div>
              <p className="text-[#8B9BB4] leading-relaxed text-sm max-w-2xl">
                Senueren maintains active capacity for the engineering and deployment of operational infrastructure. These engagements are scoped, structured, and delivered to the same standard as our internal systems.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Digital Architecture", desc: "Web presence, UI/UX, and platform deployment." },
              { title: "Operational Systems", desc: "CRM integration, automated resource management, and internal business logic." },
              { title: "Connectivity Infrastructure", desc: "Enterprise email environments, DNS governance, and secure communication networks." },
              { title: "Data Systems", desc: "Information pipelines, database architecture, and analytics deployment." },
              { title: "Business Automation", desc: "Workflow optimization, custom tool development, and process scaling." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="bg-[#0F1419]/50 border border-[#1A2332] rounded-xl p-5 h-full">
                  <h4 className="text-sm font-bold text-[#E8EDF2] mb-2 font-['Outfit']">{item.title}</h4>
                  <p className="text-xs text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={350}>
            <div className="mt-8 text-center">
              <Link to="/contact" className="inline-flex items-center gap-2 text-sm text-[#8B9BB4] hover:text-[#00FFD4] transition-colors">
                Discuss requirements <ArrowRight size={14} />
              </Link>
            </div>
          </FadeIn>
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