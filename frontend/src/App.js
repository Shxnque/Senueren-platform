import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Menu, X, Phone, Mail, MapPin,
  Layers, BarChart3, Target, Zap, Database, Workflow,
  Shield, CheckCircle2, ArrowUpRight, Building2, Cpu, Network,
  Server, ChevronRight, Globe, Users, TrendingUp, Clock,
  Award, Code2, Cog, Eye, Brain, Wallet, Hourglass, Calculator,
  ClipboardList, Scale, HardHat, Info
} from "lucide-react";
import SenuerenLogo from "./components/SenuerenLogo";
import BidToolsPage from "./components/BidTools";

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CONTACT_EMAIL = "info@senueren.co.za";
const CONTACT_PHONE = "067 326 7417";
const WHATSAPP_NUMBER = "27673267417";

const HERO_BG = "https://static.prod-images.emergentagent.com/jobs/800278e9-c0cd-426b-9899-e892371f8b9d/images/e1893e5fd846cd62825f7f50b748b3b9b6ae05d857a621a5ec97ef242563cfb4.png";
const SENRA_IMG = "https://static.prod-images.emergentagent.com/jobs/800278e9-c0cd-426b-9899-e892371f8b9d/images/416d48f3c449e725c2a0cf6893ff74b76d8ae8cb2bbc6a36d2b162d96d753635.png";
const INFRA_IMG = "https://static.prod-images.emergentagent.com/jobs/800278e9-c0cd-426b-9899-e892371f8b9d/images/fd0b101f3767cbe92563726c8443992600aa69b57bbf7e9d3786eda9f2630df1.png";
const CAPETOWN_IMG = "https://static.prod-images.emergentagent.com/jobs/800278e9-c0cd-426b-9899-e892371f8b9d/images/748d820771ce8eed36c8353794ee56c33fcbc6b196859d0c9162c42caaf2e2de.png";

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
  <Link to="/" className="flex items-center" data-testid="nav-logo" aria-label="Senueren — Home">
    {/* Nav wordmark removed — SEN mark carries the brand at all breakpoints */}
    <SenuerenLogo className="h-12 md:h-14 w-auto" />
  </Link>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire-and-forget page-visit event. Never blocks rendering.
    try {
      fetch(`${API_URL}/page-visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname, referrer: document.referrer || "" }),
        keepalive: true,
      }).catch(() => {});
    } catch (_) { /* silent */ }
  }, [pathname]);
  return null;
};

// Fire-and-forget tender event helper. Use in onClick handlers.
const trackTender = (tenderId, type) => {
  try {
    fetch(`${API_URL}/tenders/${tenderId}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch (_) { /* silent */ }
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
    { to: "/senra", label: "SENRA" },
    { to: "/tools", label: "Bid Tools" },
    { to: "/systems", label: "Systems" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${(scrolled || isOpen) ? "bg-[#0A0E17] md:bg-[#0A0E17]/80 md:backdrop-blur-xl border-b border-[#1A2332]" : "bg-transparent"}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors duration-300 ${location.pathname === l.to ? "text-[#00FFD4]" : "text-[#E8EDF2] hover:text-[#00FFD4]"}`}
                data-testid={`nav-${l.label.toLowerCase()}-link`}>{l.label}</Link>
            ))}
            <Link to="/contact" className="text-sm font-bold px-7 py-3 rounded-full bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] hover:scale-105 transition-all duration-300" data-testid="nav-cta-button">
              Work With Us
            </Link>
          </div>
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-[#0A0E17] overflow-y-auto" data-testid="mobile-menu-drawer">
          <div className="px-6 py-10 space-y-6">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`block text-xl font-medium transition-colors ${location.pathname === l.to ? "text-[#00FFD4]" : "text-[#E8EDF2]"}`}
                data-testid={`mobile-${l.label.toLowerCase()}-link`}>{l.label}</Link>
            ))}
            <Link to="/contact" className="inline-block px-7 py-3 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold" data-testid="mobile-cta-button">Work With Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#060A10] py-24 md:py-32 border-t border-[#1A2332] relative" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {/* Big CTA */}
      <FadeIn>
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Outfit'] tracking-tight">
            Ready to Scale?
          </h2>
          <p className="text-[#8B9BB4] text-lg mb-8 max-w-xl mx-auto">
            Let us build the systems your business runs on.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] hover:scale-105 transition-all duration-300" data-testid="footer-cta">
            Get Started <ArrowRight size={18} />
          </Link>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-4 gap-10 mb-16">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <SenuerenLogo className="h-12 w-auto" />
            <span className="text-2xl logo-chrome">SENUEREN</span>
          </div>
          <p className="text-[#8B9BB4] text-sm leading-relaxed max-w-md mb-4">
            Building the infrastructure behind modern business operations. Systems, automation, and intelligence platforms for growth-stage SMEs.
          </p>
          <p className="text-[#1A2332] text-xs mt-6">Cape Town, South Africa</p>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-5 text-[#8B9BB4] tracking-[0.2em] uppercase font-['Outfit']">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-[#8B9BB4] hover:text-[#00FFD4] transition-colors" data-testid="footer-home-link">Home</Link></li>
            <li><Link to="/senra" className="text-[#8B9BB4] hover:text-[#00FFD4] transition-colors" data-testid="footer-senra-link">SENRA</Link></li>
            <li><Link to="/systems" className="text-[#8B9BB4] hover:text-[#00FFD4] transition-colors" data-testid="footer-systems-link">Systems</Link></li>
            <li><Link to="/about" className="text-[#8B9BB4] hover:text-[#00FFD4] transition-colors" data-testid="footer-about-link">About</Link></li>
            <li><Link to="/contact" className="text-[#8B9BB4] hover:text-[#00FFD4] transition-colors" data-testid="footer-contact-link">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold mb-5 text-[#8B9BB4] tracking-[0.2em] uppercase font-['Outfit']">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00FFD4] hover:underline" data-testid="footer-email">{CONTACT_EMAIL}</a></li>
            <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="text-[#8B9BB4] hover:text-white transition-colors" data-testid="footer-phone">{CONTACT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-[#1A2332]/50 flex flex-col md:flex-row justify-between text-xs text-[#1A2332]">
        <span>&copy; {new Date().getFullYear()} Senueren. All rights reserved.</span>
        <span className="mt-2 md:mt-0">CRM &middot; Automation &middot; Systems Architecture</span>
      </div>
    </div>
  </footer>
);

/* ── Hero Stats (Live) ── */
const HeroStats = () => {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); else setFailed(true); })
      .catch(() => setFailed(true));
  }, []);

  return (
    <div className="hidden lg:flex absolute right-12 xl:right-24 top-1/2 -translate-y-1/2 z-10 flex-col gap-4" data-testid="hero-stats">
      {stats ? (
        [
          { val: `${stats.active_tenders}`, label: "Active Tenders", color: "text-white" },
          { val: `${stats.sectors}`, label: "Sectors Covered", color: "text-[#00FFD4]" },
          { val: `${Math.round(stats.avg_score)}`, label: "Avg Intelligence Score", color: "text-white" },
        ].map((item, i) => (
          <FadeIn key={i} delay={500 + i * 100}>
            <div className="bg-[#0F1419]/80 backdrop-blur-lg border border-[#1A2332] rounded-2xl p-5 w-52">
              <div className={`text-3xl font-bold ${item.color} font-['Outfit'] mb-1`}>{item.val}</div>
              <div className="text-xs text-[#8B9BB4]">{item.label}</div>
            </div>
          </FadeIn>
        ))
      ) : (
        // Honest loading/cold-start state — no fabricated numbers
        [0, 1, 2].map((i) => (
          <div key={i} className="bg-[#0F1419]/80 backdrop-blur-lg border border-[#1A2332] rounded-2xl p-5 w-52">
            {failed ? (
              <>
                <div className="text-sm text-[#8B9BB4] font-['Outfit']">Live feed warming up…</div>
                <div className="text-[10px] text-[#8B9BB4]/60 mt-2">Backend spinning up — refresh in a moment.</div>
              </>
            ) : (
              <>
                <div className="h-8 w-20 bg-[#1A2332] rounded animate-pulse mb-2" />
                <div className="h-3 w-28 bg-[#1A2332]/70 rounded animate-pulse" />
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

/* ── Shared Tender Components ── */

const urgencyColor = (u) => {
  if (u === "CRITICAL") return "text-red-400 bg-red-500/10 border-red-500/30";
  if (u === "URGENT") return "text-orange-400 bg-orange-500/10 border-orange-500/30";
  if (u === "SOON") return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
  return "text-[#00FFD4] bg-[#00FFD4]/10 border-[#00FFD4]/30";
};

// Score → match label (mirrors backend match_label_for). Used on cards
// where we don't have the full /tenders/{id} payload yet.
const matchLabelFor = (score) => {
  if (score >= 80) return "Strong Match";
  if (score >= 65) return "Solid Match";
  if (score >= 50) return "Moderate Match";
  return "Weak Match";
};

const matchLabelColor = (score) => {
  if (score >= 80) return "text-[#00FFD4]";
  if (score >= 65) return "text-[#4A9FD8]";
  if (score >= 50) return "text-yellow-400";
  return "text-[#8B9BB4]";
};

// Small horizontal bar used inside the Tender Detail modal's
// Opportunity Quality Index breakdown.
const ScoreBar = ({ label, value, icon, color = "#00FFD4", testid }) => (
  <div data-testid={testid}>
    <div className="flex items-center justify-between mb-1.5">
      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#E8EDF2] font-medium">
        {icon}{label}
      </span>
      <span className="text-[11px] text-[#8B9BB4] font-bold font-['Outfit']">{value}/100</span>
    </div>
    <div className="h-1.5 w-full rounded-full bg-[#0A0E17] overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const TenderCard = ({ t, onClick }) => (
  <div onClick={() => onClick(t)} className="bg-[#0F1419] border border-[#1A2332] rounded-xl p-5 card-glow group cursor-pointer" data-testid={`tender-${t.id}`}>
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-bold text-white font-['Outfit'] line-clamp-2 group-hover:text-[#00FFD4] transition-colors">{t.title}</h3>
        <p className="text-xs text-[#8B9BB4] mt-1">{t.organisation}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-lg font-bold text-white font-['Outfit']">{t.score}</div>
        <div className={`text-[10px] font-semibold ${matchLabelColor(t.score)}`} data-testid="tender-match-label">
          {matchLabelFor(t.score)}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${urgencyColor(t.urgency)}`}>{t.urgency}</span>
      <span className="text-[10px] text-[#8B9BB4] bg-[#0A0E17] px-2 py-0.5 rounded-full border border-[#1A2332]">{t.sector}</span>
      {t.deadline && <span className="text-[10px] text-[#8B9BB4]">{t.deadline}</span>}
      {t.days_remaining != null && <span className="text-[10px] text-[#8B9BB4]">({t.days_remaining}d left)</span>}
    </div>
  </div>
);

/* ── Tender Detail Modal ── */

const TenderDetailModal = ({ tender, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tender) return;
    trackTender(tender.id, "view");
    fetch(`${API_URL}/tenders/${tender.id}`).then(r => r.ok ? r.json() : null).then(d => { setDetail(d); setLoading(false); }).catch(() => setLoading(false));
  }, [tender]);

  if (!tender) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#0A0E17]/90 backdrop-blur-sm flex items-start justify-center pt-24 px-4 overflow-y-auto" onClick={onClose} data-testid="tender-detail-modal">
      <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl max-w-2xl w-full p-8 mb-12" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${urgencyColor(tender.urgency)}`}>{tender.urgency}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-white font-bold font-['Outfit'] text-2xl">{tender.score}</span>
              <span className={`text-xs font-bold ${matchLabelColor(tender.score)}`} data-testid="tender-match-headline">
                {matchLabelFor(tender.score)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B9BB4] hover:text-white" data-testid="close-detail"><X size={20} /></button>
        </div>

        <h2 className="text-xl font-bold text-white font-['Outfit'] mb-3">{tender.title}</h2>
        <p className="text-[#8B9BB4] text-sm mb-6">{tender.organisation}</p>

        {loading ? <div className="animate-pulse text-[#8B9BB4] text-sm">Loading details...</div> : detail && (
          <>
            {/* Opportunity Quality Index — score transparency */}
            {detail.score_breakdown && (
              <div className="bg-[#0A0E17] border border-[#1A2332] rounded-xl p-5 mb-5" data-testid="score-breakdown">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Opportunity Quality Index</span>
                    <p className="text-[11px] text-[#8B9BB4] mt-0.5">Why this scored {tender.score}</p>
                  </div>
                  <div className="flex gap-1.5 flex-wrap justify-end max-w-[60%]">
                    {detail.value_label && <span className="inline-flex items-center gap-1 text-[10px] text-[#E8EDF2] bg-[#1A2332] border border-[#2A3A54] rounded-full px-2 py-0.5"><Wallet size={11} className="text-[#00FFD4]"/>{detail.value_label}</span>}
                    {detail.urgency_label && <span className="inline-flex items-center gap-1 text-[10px] text-[#E8EDF2] bg-[#1A2332] border border-[#2A3A54] rounded-full px-2 py-0.5"><Hourglass size={11} className="text-[#00FFD4]"/>{detail.urgency_label}</span>}
                  </div>
                </div>
                <div className="space-y-3">
                  <ScoreBar
                    label="Relevance (fit to sector)"
                    value={detail.score_breakdown.relevance}
                    icon={<Brain size={12} className="text-[#00FFD4]" />}
                    testid="score-bar-relevance"
                  />
                  <ScoreBar
                    label="Value potential (contract size)"
                    value={detail.score_breakdown.value}
                    icon={<Wallet size={12} className="text-[#4A9FD8]" />}
                    color="#4A9FD8"
                    testid="score-bar-value"
                  />
                  <ScoreBar
                    label="Urgency (time pressure)"
                    value={detail.score_breakdown.urgency}
                    icon={<Hourglass size={12} className="text-orange-400" />}
                    color="#f59e0b"
                    testid="score-bar-urgency"
                  />
                </div>
              </div>
            )}
            {/* Public engagement strip — anonymous viewer signal */}
            {(detail.view_count > 0 || detail.click_count > 0) && (
              <div className="flex items-center gap-4 mb-5 text-xs text-[#8B9BB4]" data-testid="tender-engagement">
                <span className="inline-flex items-center gap-1.5" title="Total views on SENRA"><Eye size={13} className="text-[#00FFD4]" />{detail.view_count} views</span>
                <span className="inline-flex items-center gap-1.5" title="Clicks to source"><ArrowUpRight size={13} className="text-[#00FFD4]" />{detail.click_count} clicks</span>
                {detail.unique_viewers_24h > 0 && (
                  <span className="inline-flex items-center gap-1.5" title="Unique viewers in the last 24h"><Users size={13} className="text-[#00FFD4]" />{detail.unique_viewers_24h} in 24h</span>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {detail.sector && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Sector</span><p className="text-sm text-white mt-1">{detail.sector}</p></div>}
              {detail.deadline && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Deadline</span><p className="text-sm text-white mt-1">{detail.deadline}{detail.days_remaining != null && ` (${detail.days_remaining}d)`}</p></div>}
              {detail.date_published && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Published</span><p className="text-sm text-white mt-1">{detail.date_published}</p></div>}
              {detail.reference && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Reference</span><p className="text-sm text-white mt-1">{detail.reference}</p></div>}
              {detail.province && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Province</span><p className="text-sm text-white mt-1">{detail.province}</p></div>}
              {(detail.town || detail.suburb) && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Location</span><p className="text-sm text-white mt-1 capitalize">{[detail.suburb, detail.town].filter(Boolean).filter((v,i,a) => a.indexOf(v) === i).join(", ").toLowerCase()}</p></div>}
              {detail.size_tier && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Value Tier</span><p className="text-sm text-white mt-1">{detail.size_tier}</p></div>}
              {detail.cidb_suggestion && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">CIDB hint</span><p className="text-sm text-white mt-1" data-testid="tender-cidb">{detail.cidb_suggestion}</p></div>}
              {detail.source && <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-3"><span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Source</span><p className="text-sm text-white mt-1">{detail.source}</p></div>}
            </div>

            {detail.contact_person && detail.contact_person !== "N/A" && (
              <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 mb-4">
                <span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Issuing Authority Contact</span>
                <p className="text-sm text-white mt-1">{detail.contact_person}</p>
                {detail.email && <p className="text-xs text-[#00FFD4] mt-1"><a href={`mailto:${detail.email}`} className="hover:underline">{detail.email}</a></p>}
                {detail.telephone && <p className="text-xs text-[#8B9BB4] mt-1">{detail.telephone}</p>}
              </div>
            )}

            {detail.description && detail.description.length > 50 && (
              <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 mb-4">
                <span className="text-[10px] text-[#8B9BB4] uppercase tracking-wider">Full Description</span>
                <p className="text-sm text-[#E8EDF2] mt-2 leading-relaxed max-h-40 overflow-y-auto">{detail.description}</p>
              </div>
            )}

            <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 mb-4">
              <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Intelligence Insight</span>
              <p className="text-sm text-[#E8EDF2] mt-2 leading-relaxed">{detail.insight}</p>
            </div>

            {detail.requirements && detail.requirements.length > 0 && (
              <div className="bg-[#0A0E17] border border-[#1A2332] rounded-lg p-4 mb-6">
                <span className="text-[10px] text-[#00FFD4] uppercase tracking-wider font-bold">Required Documentation</span>
                <ul className="mt-3 space-y-2">
                  {detail.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#8B9BB4]">
                      <CheckCircle2 size={14} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />{req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detail.url && (
              <div className="flex items-center gap-3 flex-wrap">
                {detail.reference && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      try { navigator.clipboard.writeText(detail.reference); } catch (_) {}
                      e.currentTarget.dataset.copied = "1";
                      e.currentTarget.innerText = "✓ Reference copied";
                      setTimeout(() => {
                        if (e.currentTarget) { e.currentTarget.innerText = `Copy reference: ${detail.reference}`; }
                      }, 1800);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-3 bg-[#1A2332] text-[#E8EDF2] rounded-full font-medium text-xs hover:bg-[#243049] transition-all border border-[#2A3A54]"
                    data-testid="copy-reference">
                    Copy reference: {detail.reference}
                  </button>
                )}
                <a href={detail.url} target="_blank" rel="noopener noreferrer"
                   onClick={() => trackTender(tender.id, "click")}
                   className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold text-sm hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all" data-testid="tender-link">
                  Open on eTenders Portal <ArrowUpRight size={16} />
                </a>
                {detail.reference && <p className="text-[10px] text-[#8B9BB4] w-full mt-1">Tip: paste the reference into the portal's <em>QuickFind</em> to jump straight to this tender.</p>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ── SENRA home-section live stats — no hardcoded numbers ── */
const SenraHomeStats = () => {
  const [stats, setStats] = useState(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setStats(d); else setFailed(true); })
      .catch(() => setFailed(true));
  }, []);

  const Card = ({ icon, label, value, caption, delay, valueClass = "text-white" }) => (
    <FadeIn delay={delay}>
      <div className="bg-[#0A0E17] border border-[#1A2332] rounded-2xl p-6 card-glow flex-1">
        <div className="flex items-center gap-3 mb-3">
          {icon}
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#8B9BB4]">{label}</span>
        </div>
        {value !== null && value !== undefined ? (
          <div className={`text-4xl font-bold ${valueClass} font-['Outfit'] mb-1`}>{value}</div>
        ) : failed ? (
          <div className="text-sm text-[#8B9BB4] font-['Outfit'] mb-1">Live feed warming up…</div>
        ) : (
          <div className="h-10 w-24 bg-[#1A2332] rounded animate-pulse mb-2" />
        )}
        <p className="text-sm text-[#8B9BB4]">{caption}</p>
      </div>
    </FadeIn>
  );

  return (
    <div className="col-span-12 lg:col-span-4 flex flex-col gap-6" data-testid="senra-home-stats">
      <Card
        icon={<div className="glow-dot"></div>}
        label="Live Data"
        value={stats ? stats.active_tenders : null}
        caption={stats
          ? `Active SA tenders indexed from ${stats.sources} source${stats.sources === 1 ? '' : 's'} — refreshed every 6 hours.`
          : `Active SA tenders indexed across multiple verified sources — refreshed every 6 hours.`}
        delay={100}
      />
      <Card
        icon={<Target size={16} className="text-[#00FFD4]" />}
        label="Intelligence"
        value={stats ? stats.sectors : null}
        caption="Industry sectors with weighted scoring, deadline pressure and organisation-importance signals."
        delay={200}
        valueClass="text-[#00FFD4]"
      />
      <Card
        icon={<Zap size={16} className="text-[#00FFD4]" />}
        label="Urgent Now"
        value={stats ? stats.urgent_count : null}
        caption="Tenders closing inside 14 days — triaged and surfaced at the top of every feed."
        delay={300}
      />
    </div>
  );
};

/* ── Homepage Tender Sections ── */

const HomeTenderFeed = () => {
  const [highValue, setHighValue] = useState([]);
  const [urgent, setUrgent] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [hv, ur] = await Promise.all([
          fetch(`${API_URL}/tenders/high-value?limit=5`).then(r => r.ok ? r.json() : []),
          fetch(`${API_URL}/tenders/urgent?limit=5`).then(r => r.ok ? r.json() : [])
        ]);
        setHighValue(hv);
        setUrgent(ur);
      } catch (e) { console.log(e); }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <section className="py-16 px-6 bg-[#0A0E17]"><div className="max-w-7xl mx-auto text-center animate-pulse text-[#8B9BB4]">Loading intelligence feed...</div></section>;
  if (!highValue.length && !urgent.length) return null;

  return (
    <>
      <section className="py-20 md:py-24 px-6 md:px-12 bg-[#0A0E17] relative" data-testid="home-tender-feed">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* High Value */}
            {highValue.length > 0 && (
              <FadeIn>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="glow-dot"></div>
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Top High-Value Tenders</h3>
                  </div>
                  <div className="space-y-3">
                    {highValue.map((t, i) => <TenderCard key={t.id} t={t} onClick={setSelected} />)}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Urgent */}
            {urgent.length > 0 && (
              <FadeIn delay={100}>
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <Clock size={16} className="text-orange-400" />
                    <h3 className="text-lg font-bold text-white font-['Outfit']">Urgent — Closing Soon</h3>
                  </div>
                  <div className="space-y-3">
                    {urgent.map((t, i) => <TenderCard key={t.id} t={t} onClick={setSelected} />)}
                  </div>
                </div>
              </FadeIn>
            )}
          </div>

          <FadeIn delay={200}>
            <div className="mt-10 text-center">
              <Link to="/senra" className="inline-flex items-center gap-2 text-sm font-bold text-[#00FFD4] hover:underline" data-testid="view-all-tenders">
                View all tenders on SENRA <ArrowRight size={16} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      {selected && <TenderDetailModal tender={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

/* ── SENRA Page — Search, Filter, Browse ── */

const SenraPage = () => {
  const [tenders, setTenders] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [stats, setStats] = useState(null);
  const [query, setQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [strictMode, setStrictMode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchTenders = async (p = 1, overrides = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "20", page: String(p) });
      const effQuery = overrides.query ?? query;
      const effSector = overrides.sector ?? sectorFilter;
      const effUrgency = overrides.urgency ?? urgencyFilter;
      const effStrict = overrides.strict ?? strictMode;
      if (effQuery) params.set("q", effQuery);
      if (effSector) params.set("sector", effSector);
      if (effUrgency) params.set("urgency", effUrgency);
      if (effStrict && effSector) params.set("strict", "1");
      const res = await fetch(`${API_URL}/tenders/search?${params}`);
      if (res.ok) {
        const data = await res.json();
        setTenders(data.results);
        setTotalPages(data.total_pages);
        setCount(data.count);
        setPage(data.page);
      }
    } catch (e) { console.log(e); }
    setLoading(false);
  };

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/tenders/sectors`).then(r => r.ok ? r.json() : []),
      fetch(`${API_URL}/stats`).then(r => r.ok ? r.json() : null)
    ]).then(([s, st]) => { setSectors(s); setStats(st); });
    fetchTenders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchTenders(1); };
  const handleSector = (s) => {
    const next = s === sectorFilter ? "" : s;
    setSectorFilter(next);
    fetchTenders(1, { sector: next });
  };
  const handleUrgency = (u) => {
    const next = u === urgencyFilter ? "" : u;
    setUrgencyFilter(next);
    fetchTenders(1, { urgency: next });
  };
  const handleStrictToggle = () => {
    const next = !strictMode;
    setStrictMode(next);
    // Strict only meaningful with a sector selected — if no sector, toggle
    // is visual only until user picks a category.
    fetchTenders(1, { strict: next });
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="senra-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-10">
          <div className="accent-bar w-12 mb-6"></div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">SA Procurement Intelligence for SMEs</p>
              <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">SENRA</h1>
              <p className="text-[#8B9BB4] mt-2">The decision layer for South African contractors. Live tenders, scored, filtered and ranked — so you stop chasing work and start selecting profitable opportunities.</p>
              <Link to="/tools" className="inline-flex items-center gap-1.5 mt-3 text-xs text-[#00FFD4] hover:underline" data-testid="senra-tools-link">
                <Calculator size={12} /> Open Bid Tools (BOQ, margin, bid/no-bid) <ArrowRight size={12} />
              </Link>
            </div>
            {stats && (
              <div className="flex gap-5 text-sm">
                <div className="text-center"><span className="text-white font-bold font-['Outfit'] text-xl">{stats.active_tenders}</span><br/><span className="text-[#8B9BB4] text-[10px]">Active</span></div>
                <div className="text-center"><span className="text-[#00FFD4] font-bold font-['Outfit'] text-xl">{stats.sectors}</span><br/><span className="text-[#8B9BB4] text-[10px]">Sectors</span></div>
                <div className="text-center"><span className="text-orange-400 font-bold font-['Outfit'] text-xl">{stats.urgent_count}</span><br/><span className="text-[#8B9BB4] text-[10px]">Urgent</span></div>
              </div>
            )}
          </div>
        </div>

        {/* What the SENRA score means — first-time user clarity */}
        <div className="bg-[#0F1419] border border-[#1A2332] rounded-xl p-4 mb-6 flex items-start gap-3" data-testid="senra-score-explainer">
          <Info size={16} className="text-[#00FFD4] mt-0.5 flex-shrink-0" />
          <div className="text-xs text-[#8B9BB4] leading-relaxed">
            <span className="text-white font-bold">Opportunity Quality Index</span> — every tender is scored out of 95 across three axes:
            <span className="text-[#E8EDF2]"> Relevance</span> (sector fit),
            <span className="text-[#E8EDF2]"> Value potential</span> (contract size signal) and
            <span className="text-[#E8EDF2]"> Urgency</span> (deadline pressure). Click any card to see the full breakdown.
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6" data-testid="senra-search-form">
          <div className="flex gap-3">
            <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tenders by keyword, organisation..." className="flex-1 bg-[#0F1419] border border-[#1A2332] rounded-xl px-5 py-3 text-sm text-white placeholder-[#8B9BB4]/50 focus:border-[#00FFD4]/50 focus:outline-none transition-colors" data-testid="senra-search-input" />
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,212,0.3)] transition-all" data-testid="senra-search-btn">Search</button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-3" data-testid="senra-filters">
          {["CRITICAL", "URGENT", "SOON", "NORMAL"].map(u => (
            <button key={u} onClick={() => handleUrgency(u)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-all ${urgencyFilter === u ? urgencyColor(u) : "text-[#8B9BB4] border-[#1A2332] hover:border-[#8B9BB4]"}`} data-testid={`filter-${u.toLowerCase()}`}>{u}</button>
          ))}
          <span className="text-[#1A2332] self-center">|</span>
          {sectors.slice(0, 8).map(s => (
            <button key={s.sector} onClick={() => handleSector(s.sector)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all ${sectorFilter === s.sector ? "text-[#00FFD4] border-[#00FFD4]/50 bg-[#00FFD4]/10" : "text-[#8B9BB4] border-[#1A2332] hover:border-[#8B9BB4]"}`} data-testid={`filter-sector-${s.sector.replace(/\s/g, '-').toLowerCase()}`}>
              {s.sector} <span className="opacity-50">({s.count})</span>
            </button>
          ))}
        </div>

        {/* Strict-vs-Expanded mode toggle */}
        <div className="flex items-center gap-3 mb-8 flex-wrap" data-testid="senra-strict-toggle-row">
          <button
            type="button"
            onClick={handleStrictToggle}
            aria-pressed={strictMode}
            data-testid="senra-strict-toggle"
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
              strictMode
                ? "bg-[#00FFD4]/10 text-[#00FFD4] border-[#00FFD4]/50"
                : "bg-[#0F1419] text-[#8B9BB4] border-[#1A2332] hover:border-[#8B9BB4]"
            }`}
          >
            <Shield size={13} />
            {strictMode ? "Strict mode: ON" : "Strict mode: OFF"}
          </button>
          <span className="text-[11px] text-[#8B9BB4]">
            {strictMode
              ? (sectorFilter
                  ? `Showing only core ${sectorFilter} tenders (exact-match whitelist).`
                  : "Pick a category above to apply strict filtering.")
              : "Expanded view: includes related ecosystem opportunities (engineering, consulting, supporting services)."}
          </span>
        </div>

        {/* Results */}
        <div className="mb-4 text-xs text-[#8B9BB4]">{count} tenders found &middot; Page {page}/{totalPages}</div>

        {loading ? (
          <div className="text-center py-12 text-[#8B9BB4] animate-pulse">Loading tenders...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {tenders.map(t => <TenderCard key={t.id} t={t} onClick={setSelected} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2" data-testid="senra-pagination">
            <button onClick={() => fetchTenders(Math.max(1, page - 1))} disabled={page <= 1} className="px-4 py-2 bg-[#0F1419] border border-[#1A2332] rounded-lg text-sm text-[#8B9BB4] hover:border-[#00FFD4] disabled:opacity-30 transition-all">Prev</button>
            <span className="px-4 py-2 text-sm text-white">{page} / {totalPages}</span>
            <button onClick={() => fetchTenders(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-4 py-2 bg-[#0F1419] border border-[#1A2332] rounded-lg text-sm text-[#8B9BB4] hover:border-[#00FFD4] disabled:opacity-30 transition-all">Next</button>
          </div>
        )}
      </div>
      {selected && <TenderDetailModal tender={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

/* ── Home Page ── */

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0E17]" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-bg relative min-h-screen flex items-center" style={{ backgroundImage: `url(${HERO_BG})` }} data-testid="hero-section">
        <div className="grid-overlay absolute inset-0 z-[2]"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-[#00FFD4]/30 bg-[#00FFD4]/10 text-[#00FFD4] mb-8" data-testid="hero-badge">
                Revenue Infrastructure for Growth SMEs
              </div>
            </FadeIn>

            <FadeIn delay={100}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl tracking-tight font-bold text-white mb-8 font-['Outfit'] leading-[1.05]">
                Systems Architecture<br />
                <span className="gradient-text">&amp; Data Intelligence</span>
              </h1>
            </FadeIn>

            <FadeIn delay={200}>
              <p className="text-lg text-[#8B9BB4] leading-relaxed mb-10 max-w-2xl">
                We build business operating systems, automation infrastructure, and custom backend engines that power efficiency, scale, and growth for modern enterprises.
              </p>
            </FadeIn>

            <FadeIn delay={300}>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold text-base hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] hover:scale-105 transition-all duration-300 group" data-testid="hero-cta-primary">
                  Work With Us <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <a href="#senra" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F1419] border border-[#1A2332] text-[#E8EDF2] rounded-full font-bold text-base hover:border-[#00FFD4] hover:text-[#00FFD4] transition-all duration-300" data-testid="hero-cta-secondary">
                  Explore SENRA
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <p className="text-xs text-[#8B9BB4]/60 tracking-wide uppercase mt-4">
                CRM &middot; Automation &middot; Systems Architecture
              </p>
            </FadeIn>
          </div>
        </div>

        {/* Floating stats on right side for larger screens */}
        <HeroStats />
      </section>

      {/* What We Build */}
      <section id="what-we-build" className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0E17] relative noise-texture" data-testid="what-we-build-section">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="mb-16">
              <div className="accent-bar w-12 mb-6"></div>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">What We Build</p>
                  <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">Operational Infrastructure<br />for Modern Business</h2>
                </div>
                <p className="text-[#8B9BB4] max-w-md text-sm leading-relaxed">
                  Internal systems that transform how companies manage operations, data, and workflows at scale.
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Building2 size={24} />, title: "Business OS", desc: "Centralized systems managing clients, projects, finances, and workflows. Built for control." },
              { icon: <Workflow size={24} />, title: "Automation", desc: "Workflow pipelines, notification systems, and data processing engines. Zero repetitive work." },
              { icon: <Database size={24} />, title: "Data Intelligence", desc: "Opportunity detection, filtering engines, and decision-support tools. Raw data to insight." },
              { icon: <Server size={24} />, title: "Custom Backends", desc: "Tailored architecture for scalability, integration, and operational control. Your business, your system." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow group h-full" data-testid={`system-card-${i}`}>
                  <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">{item.title}</h3>
                  <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* SENRA Flagship */}
      <section id="senra" className="py-24 md:py-32 px-6 md:px-12 bg-[#0F1419] relative" data-testid="flagship-section">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-12">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-[#00FFD4]/30 bg-[#00FFD4]/10 text-[#00FFD4] mb-4">
                Flagship System
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-12 gap-6">
            {/* Large image block */}
            <FadeIn className="col-span-12 lg:col-span-8">
              <div className="relative rounded-2xl overflow-hidden border border-[#1A2332] h-[320px] md:h-[420px]">
                <img src={SENRA_IMG} alt="SENRA Intelligence Platform visualization" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h2 className="text-4xl md:text-5xl font-bold text-white font-['Outfit'] tracking-tight mb-2">SENRA</h2>
                  <p className="text-[#00FFD4] text-lg font-medium">Procurement Intelligence Platform</p>
                </div>
              </div>
            </FadeIn>

            {/* Stats column — live from backend */}
            <SenraHomeStats />
          </div>

          {/* SENRA capabilities row */}
          <FadeIn delay={200}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { label: "Aggregates", desc: "Tender data from official sources" },
                { label: "Filters", desc: "Intelligent categorization & scoring" },
                { label: "Validates", desc: "Removes low-quality signals" },
                { label: "Delivers", desc: "Structured, actionable opportunities" }
              ].map((item, i) => (
                <div key={i} className="bg-[#0A0E17] border border-[#1A2332] rounded-xl p-5 card-glow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFD4]"></div>
                    <h4 className="text-white font-bold text-sm font-['Outfit']">{item.label}</h4>
                  </div>
                  <p className="text-xs text-[#8B9BB4]">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Live Tender Feed */}
      <HomeTenderFeed />

      {/* Our Approach */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0E17] relative noise-texture" data-testid="approach-section">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="mb-16">
              <div className="accent-bar w-12 mb-6"></div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Process</p>
              <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">Structured Engineering<br />From Design to Deployment</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { num: "01", title: "System Design", desc: "Architecture aligned with your business operations", icon: <Eye size={20} /> },
              { num: "02", title: "Infrastructure", desc: "Core backend systems and automation layers", icon: <Server size={20} /> },
              { num: "03", title: "Integration", desc: "Data, workflows, and operational tools connected", icon: <Network size={20} /> },
              { num: "04", title: "Deployment", desc: "Stable, scalable, production-ready systems", icon: <Globe size={20} /> },
              { num: "05", title: "Optimization", desc: "Continuous performance and efficiency improvements", icon: <TrendingUp size={20} /> }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="relative bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#00FFD4]/20 text-4xl font-bold font-['Outfit']">{item.num}</span>
                    <div className="text-[#00FFD4]">{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                  <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why Senueren */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-[#0F1419]" data-testid="why-section">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-16">
              <div className="accent-bar w-12 mb-6"></div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Why Us</p>
              <h2 className="text-3xl sm:text-4xl tracking-tight font-bold text-white font-['Outfit']">Built Different</h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: <Network size={22} />, title: "Systems-First", desc: "We think in systems, not features. Every component connects to a larger operational architecture." },
              { icon: <Target size={22} />, title: "Real Problems", desc: "We solve actual operational bottlenecks — not hypothetical ones. Production-grade from day one." },
              { icon: <Layers size={22} />, title: "Scalable", desc: "Infrastructure designed to grow with your business. No rework, no rebuilds, no limitations." },
              { icon: <Shield size={22} />, title: "Structured", desc: "Engineering-first approach with structured processes. Reliable, documented, maintainable." },
              { icon: <BarChart3 size={22} />, title: "Long-Term", desc: "We build infrastructure, not quick fixes. Systems that serve you for years, not months." },
              { icon: <Zap size={22} />, title: "Efficient", desc: "Automation eliminates repetitive work. Your team focuses on what matters — growth." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="bg-[#0A0E17] border border-[#1A2332] rounded-2xl p-7 card-glow group" data-testid={`why-card-${i}`}>
                  <div className="w-11 h-11 rounded-lg bg-[#0F1419] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                  <p className="text-sm text-[#8B9BB4] leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <blockquote className="text-xl md:text-2xl text-[#E8EDF2] font-medium leading-relaxed font-['Outfit']">
                "Businesses lack structured systems to operate efficiently at scale. We design and implement internal systems that transform how companies manage operations, data, and workflows."
              </blockquote>
              <div className="accent-bar w-12 mx-auto mt-8"></div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Work With Us CTA */}
      <section id="contact" className="py-24 md:py-32 px-6 md:px-12 bg-[#0A0E17] relative" data-testid="work-with-us-section">
        <div className="absolute inset-0 bg-gradient-to-b from-[#4A9FD8]/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <div className="accent-bar w-12 mx-auto mb-8"></div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-6 font-['Outfit']">Work With Us</h2>
            <p className="text-lg text-[#8B9BB4] leading-relaxed mb-10 max-w-2xl mx-auto">
              We partner with businesses that require structured internal systems, automation at scale, and data-driven operations. If your business needs systems that improve efficiency and unlock growth — we can deliver.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] hover:scale-105 transition-all duration-300" data-testid="cta-email">
                <Mail size={18} /> Email Us
              </a>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#0F1419] border border-[#1A2332] text-[#E8EDF2] rounded-full font-bold hover:border-[#00FFD4] hover:text-[#00FFD4] transition-all duration-300" data-testid="cta-phone">
                <Phone size={18} /> {CONTACT_PHONE}
              </a>
            </div>

            <div className="p-6 bg-[#0F1419]/50 border border-[#1A2332] rounded-2xl inline-block">
              <p className="text-[#8B9BB4] text-sm">
                <strong className="text-white">Senueren is not a service provider.</strong> It is a systems company building the infrastructure behind modern business operations.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

/* ── Systems Page ── */

const SystemsPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-16" data-testid="systems-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header with image */}
        <div className="relative rounded-2xl overflow-hidden mb-16 h-[240px] md:h-[320px] border border-[#1A2332]">
          <img src={INFRA_IMG} alt="Infrastructure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/70 to-[#0A0E17]/40"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <FadeIn>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">What We Build</p>
              <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">
                Systems We Build
              </h1>
              <p className="text-[#8B9BB4] mt-3 max-w-lg">Operational infrastructure designed for performance, scalability, and long-term value.</p>
            </FadeIn>
          </div>
        </div>

        <div className="space-y-6">
          {[
            {
              icon: <Building2 size={28} />,
              title: "Business Operating Systems",
              desc: "Centralized systems that manage clients, projects, finances, and internal workflows.",
              details: "We build comprehensive operating systems that serve as the central nervous system of your business. These systems integrate client management, project tracking, financial operations, and workflow automation into a single, cohesive platform.",
              features: ["Client Management", "Project Tracking", "Financial Operations", "Workflow Automation"]
            },
            {
              icon: <Workflow size={28} />,
              title: "Automation Infrastructure",
              desc: "Workflow automation pipelines, notification systems, and data processing engines.",
              details: "Our automation infrastructure eliminates repetitive manual work by building intelligent workflow orchestration, automated notification systems, and high-performance data processing engines that run reliably at scale.",
              features: ["Process Automation", "Workflow Orchestration", "Notification Systems", "Data Processing"]
            },
            {
              icon: <Database size={28} />,
              title: "Data Intelligence Platforms",
              desc: "Opportunity detection systems, filtering engines, and decision-support tools.",
              details: "We turn raw data into actionable intelligence through sophisticated opportunity detection algorithms, intelligent filtering and scoring engines, and decision-support tools that help you make informed business decisions.",
              features: ["Opportunity Detection", "Intelligent Filtering", "Scoring Engines", "Decision Support"]
            },
            {
              icon: <Server size={28} />,
              title: "Custom Backend Systems",
              desc: "Tailored system architecture designed for scalability, integration, and operational control.",
              details: "Every business has unique needs. We design and build custom backend systems with scalable architecture, seamless API integration, security-first approach, and performance optimization tailored for your requirements.",
              features: ["Scalable Architecture", "API Integration", "Security First", "Performance Optimized"]
            }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 md:p-10 card-glow" data-testid={`systems-detail-${i}`}>
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] flex-shrink-0 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 font-['Outfit']">{item.title}</h2>
                    <p className="text-[#8B9BB4]">{item.desc}</p>
                  </div>
                </div>
                <p className="text-[#8B9BB4] leading-relaxed mb-6">{item.details}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {item.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 bg-[#0A0E17] border border-[#1A2332] rounded-lg px-3 py-2">
                      <CheckCircle2 size={14} className="text-[#00FFD4] flex-shrink-0" />
                      <span className="text-xs text-[#E8EDF2]">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="mt-16 text-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] hover:scale-105 transition-all duration-300" data-testid="systems-cta">
              Discuss Your System Needs <ArrowRight size={18} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

/* ── About Page ── */

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-16" data-testid="about-page">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Hero with Cape Town image */}
        <div className="relative rounded-2xl overflow-hidden mb-16 h-[280px] md:h-[380px] border border-[#1A2332]">
          <img src={CAPETOWN_IMG} alt="Cape Town at night" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/60 to-[#0A0E17]/30"></div>
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <FadeIn>
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Our Story</p>
              <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">
                About Senueren
              </h1>
            </FadeIn>
          </div>
        </div>

        <div className="space-y-10">
          <FadeIn>
            <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 md:p-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 font-['Outfit']">
                Built from the belief that technology should create real progress
              </h2>
              <p className="text-[#8B9BB4] leading-relaxed mb-4">
                Through persistence, focused effort, and continuous growth, Senueren was established to build systems that help organisations operate smarter and move further.
              </p>
              <p className="text-[#8B9BB4] leading-relaxed">
                We do not build surface-level solutions. We build systems that become part of how a business functions.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            <FadeIn delay={100}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow h-full">
                <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                  <Target size={20} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">Our Focus</h3>
                <p className="text-[#8B9BB4] leading-relaxed">
                  Senueren exists to solve one problem: <strong className="text-white">Businesses lack structured systems to operate efficiently at scale.</strong>
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow h-full">
                <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                  <Cog size={20} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">Our Approach</h3>
                <p className="text-[#8B9BB4] leading-relaxed">
                  Engineering-first, focused on reliability, scalability, and long-term value. We build infrastructure, not quick fixes.
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Founder Section */}
          <FadeIn delay={150}>
            <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4A9FD8] to-[#00FFD4] flex items-center justify-center text-[#0A0E17] text-2xl font-bold flex-shrink-0 font-['Outfit']">
                  QW
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-['Outfit']">Quelum Wilson</h3>
                  <p className="text-[#00FFD4] text-sm font-medium mb-4">Founder, Senueren</p>
                  <p className="text-[#8B9BB4] leading-relaxed mb-3">
                    Senueren was founded by Quelum Wilson, a Cape Town entrepreneur with a commitment to building meaningful systems that create higher standards through persistence.
                  </p>
                  <p className="text-[#8B9BB4] leading-relaxed mb-3">
                    The company was established in June 2025 with a clear purpose: to create intelligent systems that help businesses operate smarter and access opportunities that would otherwise be missed.
                  </p>
                  <p className="text-[#8B9BB4] leading-relaxed">
                    Through discipline, resilience, and execution, Senueren is growing into a trusted technology company focused on delivering real value to South African businesses.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#8B9BB4]">
                    <span className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#00FFD4]" /> Cape Town, South Africa
                    </span>
                    <span className="text-[#1A2332]">|</span>
                    <span>Est. June 2025</span>
                    <span className="text-[#1A2332]">|</span>
                    <span className="text-[#00FFD4]">senueren.co.za</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="text-center py-12 bg-[#0F1419] border border-[#1A2332] rounded-2xl">
              <p className="text-xl md:text-2xl text-[#E8EDF2] font-medium leading-relaxed px-6 font-['Outfit']">
                The vision is to build a company that South African businesses rely on for systems that <span className="gradient-text font-bold">actually work</span>.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

/* ── Contact Page ── */

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0E17] pt-28 pb-16" data-testid="contact-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="mb-16">
            <div className="accent-bar w-12 mb-6"></div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-3">Get In Touch</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">
              Let's Build Something
            </h1>
            <p className="text-lg text-[#8B9BB4] max-w-2xl">
              Whether you have questions, want to discuss a custom project, or simply want to connect.
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: <Mail size={24} />, title: "Email", value: CONTACT_EMAIL, link: `mailto:${CONTACT_EMAIL}` },
            { icon: <Phone size={24} />, title: "Phone", value: CONTACT_PHONE, link: `tel:${CONTACT_PHONE.replace(/\s/g, "")}` },
            { icon: <MapPin size={24} />, title: "Location", value: "Cape Town, South Africa", link: null }
          ].map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 card-glow" data-testid={`contact-card-${i}`}>
                <div className="w-12 h-12 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#00FFD4] mb-5">
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-sm mb-2 font-['Outfit']">{item.title}</h3>
                {item.link ? (
                  <a href={item.link} className="text-[#00FFD4] text-sm hover:underline">{item.value}</a>
                ) : (
                  <p className="text-[#8B9BB4] text-sm">{item.value}</p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={200}>
          <div className="bg-gradient-to-br from-[#0F1419] to-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-white mb-4 font-['Outfit']">We typically respond within 24 to 48 hours</h2>
            <p className="text-[#8B9BB4] mb-6 leading-relaxed text-sm">
              For the fastest response, email us directly or reach out via WhatsApp. We are happy to discuss systems, custom development projects, or any other enquiries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren%2C%20I%27d%20like%20to%20discuss%20a%20system%20project.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#25D366]/20 hover:scale-105 transition-all duration-300"
                data-testid="whatsapp-button"
              >
                Message on WhatsApp <ArrowUpRight size={16} />
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F1419] border border-[#1A2332] text-[#E8EDF2] rounded-full font-bold text-sm hover:border-[#00FFD4] hover:text-[#00FFD4] transition-all duration-300"
                data-testid="email-button"
              >
                <Mail size={16} /> Send Email
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="mt-10 p-6 bg-[#0F1419]/50 border border-[#1A2332] rounded-2xl text-center">
            <p className="text-[#8B9BB4] text-sm">
              <strong className="text-white">Senueren is not a service provider.</strong> It is a systems company building the infrastructure behind modern business operations.
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
    <HashRouter>
      <div className="App">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/senra" element={<SenraPage />} />
          <Route path="/tools" element={<BidToolsPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;
