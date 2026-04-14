import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Search, ArrowRight, ArrowUpRight, Clock, Shield, Zap,
  Target, BarChart3, Menu, X, Phone, Mail, MapPin, ChevronDown,
  ChevronLeft, ChevronRight, Layers, TrendingUp, Eye, Users,
  Globe, Code, Database
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const CONTACT_EMAIL = "info@senueren.co.za";
const CONTACT_PHONE = "067 326 7417";
const WHATSAPP_NUMBER = "27673267417";

/* ── Shared ── */

const Logo = () => (
  <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
    <span className="text-xl font-semibold tracking-[0.14em] font-['Outfit'] logo-gradient">SENUEREN</span>
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
    { to: "/senra", label: "SENRA" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A1D30]/95 border-b border-[#1A3148] glass-nav" : "bg-transparent"}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors ${location.pathname === l.to ? "text-white" : "text-gray-400 hover:text-white"}`}
                data-testid={`nav-${l.label.toLowerCase()}-link`}>{l.label}</Link>
            ))}
            <Link to="/senra" className="text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#0077CC]/50 text-[#00D0FF] hover:bg-[#0077CC]/10 transition-all duration-300" data-testid="nav-cta-button">
              Open SENRA
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-40 bg-[#0A1D30]">
          <div className="px-6 py-8 space-y-6">
            {links.map((l) => <Link key={l.to} to={l.to} className="block text-lg font-medium text-gray-300" data-testid={`mobile-${l.label.toLowerCase()}-link`}>{l.label}</Link>)}
            <Link to="/senra" className="inline-block px-6 py-3 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg font-semibold" data-testid="mobile-cta-button">Open SENRA</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-[#061222] py-16 border-t border-[#1A3148]" data-testid="footer">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo-native.png" alt="Senueren" className="h-8 rounded" />
    <span className="text-xl font-semibold tracking-[0.14em] font-['Outfit'] logo-gradient">SENUEREN</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-md">Building intelligent systems designed to improve how businesses operate and access opportunities across South Africa.</p>
          <p className="text-gray-600 text-xs mt-3">Cape Town, South Africa</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gray-300 tracking-wide uppercase font-['Outfit']">Platform</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-home-link">Home</Link></li>
            <li><Link to="/senra" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-senra-link">SENRA</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-about-link">About</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-contact-link">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gray-300 tracking-wide uppercase font-['Outfit']">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00D0FF] hover:underline" data-testid="footer-email">{CONTACT_EMAIL}</a></li>
            <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="text-gray-400 hover:text-white transition-colors" data-testid="footer-phone">{CONTACT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-[#1A3148] flex flex-col md:flex-row justify-between text-xs text-gray-600">
        <span>&copy; {new Date().getFullYear()} Senueren. All rights reserved.</span>
        <span className="mt-2 md:mt-0">South African tenders &middot; Procurement intelligence &middot; SME solutions</span>
      </div>
    </div>
  </footer>
);


/* ── Landing Page ── */

const LandingPage = () => {
  const [topTenders, setTopTenders] = useState([]);
  useEffect(() => { axios.get(`${API}/tenders/top?limit=5`).then(r => setTopTenders(r.data)).catch(() => {}); }, []);

  return (
    <div className="min-h-screen bg-[#0A1D30]" data-testid="landing-page">
      <section className="pt-28 pb-20 px-6" data-testid="hero-section">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="opacity-0 fade-up">
            <div className="accent-bar w-12 mb-6"></div>
            <h1 className="text-5xl md:text-6xl tracking-tighter font-medium text-white mb-6 font-['Outfit'] leading-[1.08]">
              Intelligent Systems for Business Growth
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
              Senueren builds digital infrastructure and intelligent systems that help South African businesses discover stronger opportunities and operate more efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/senra" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg font-semibold text-sm hover:bg-[#0077CC]/10 transition-all duration-300" data-testid="hero-cta-button">
                Explore SENRA <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-[#1A3148] text-gray-300 rounded-lg font-medium text-sm hover:border-gray-500 transition-all duration-300" data-testid="hero-about-button">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hidden lg:block opacity-0 fade-up d2">
            <div className="card-dark overflow-hidden">
              <div className="px-6 py-4 border-b border-[#1A3148] flex items-center justify-between">
                <span className="text-xs tracking-[0.15em] uppercase text-gray-500 font-['Outfit'] font-medium">SENRA Intelligence</span>
                <span className="flex items-center gap-2 text-xs text-[#00FF99]"><span className="w-1.5 h-1.5 bg-[#00FF99] rounded-full animate-pulse"></span>Live</span>
              </div>
              <div className="p-5 space-y-3">
                {topTenders.slice(0, 4).map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 bg-[#0A1D30]/60 rounded-lg hover:bg-[#0A1D30] transition-colors">
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-white text-sm font-medium truncate">{t.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{t.organisation}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${t.urgency === "URGENT" ? "badge-urgent" : t.urgency === "SOON" ? "badge-soon" : "badge-normal"}`}>{t.urgency}</span>
                  </div>
                ))}
                {topTenders.length === 0 && <div className="text-center py-10 text-gray-500 text-sm">Loading intelligence...</div>}
              </div>
              <div className="px-5 pb-5">
                <Link to="/senra" className="flex items-center justify-center gap-2 w-full py-3 border border-[#0077CC]/30 rounded-lg text-[#00D0FF] text-sm font-medium hover:bg-[#0077CC]/10 transition-colors" data-testid="hero-preview-cta">
                  View All Opportunities <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0F2035]" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="accent-bar w-12 mb-4"></div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-4 font-['Outfit']">What SENRA does</h2>
          <p className="text-gray-400 mb-16 max-w-xl">Manual tender searching is time consuming and fragmented. SENRA centralises opportunities and presents them in a structured, ranked, and actionable format.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Layers size={22} />, title: "Aggregate", desc: "Collects tender data from across South African government portals and procurement sources daily." },
              { icon: <BarChart3 size={22} />, title: "Analyse", desc: "Each opportunity is scored and ranked based on value, relevance, sector alignment, and deadline urgency." },
              { icon: <Target size={22} />, title: "Prioritise", desc: "Only high quality opportunities make the cut. Focus on what matters, skip the noise." },
              { icon: <Zap size={22} />, title: "Deliver", desc: "Access curated results instantly through the SENRA interface. Updated and ranked continuously." },
            ].map((item, i) => (
              <div key={i} className={`p-7 card-dark hover:border-[#0077CC]/30 transition-all duration-300 opacity-0 fade-up d${i+1}`} data-testid={`feature-card-${i}`}>
                <div className="w-10 h-10 rounded-lg bg-[#0077CC]/10 flex items-center justify-center text-[#00D0FF] mb-5">{item.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2 font-['Outfit']">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0A1D30]" data-testid="why-free-section">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-16 items-center">
          <div className="lg:col-span-3">
            <div className="accent-bar w-12 mb-4"></div>
            <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-6 font-['Outfit']">Why SENRA is free</h2>
            <p className="text-gray-400 leading-relaxed mb-4">SENRA is made freely accessible so more businesses can benefit from improved opportunity access. The immediate objective is impact, accessibility, and business enablement. Not short term monetisation.</p>
            <p className="text-gray-400 leading-relaxed mb-8">We believe that access to structured intelligence should not be reserved for large corporations. Every business deserves the tools to compete and grow.</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[{ l: "Tenders", v: "Updated Daily" }, { l: "Access", v: "Free" }, { l: "Market", v: "South Africa" }, { l: "Built For", v: "SMEs" }].map((s, i) => (
                <div key={i} className="p-4 card-dark-sm"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{s.l}</p><p className="text-sm font-semibold text-white mt-1 font-['Outfit']">{s.v}</p></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 flex justify-center">
            <div className="card-dark p-12 flex items-center justify-center"><img src="/logo-native.png" alt="Senueren" className="w-40 h-40 object-contain rounded-lg" /></div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#0F2035]" data-testid="who-section">
        <div className="max-w-7xl mx-auto text-center">
          <div className="accent-bar w-12 mx-auto mb-4"></div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-4 font-['Outfit']">Built for businesses that want to grow</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-16">SENRA serves South African businesses, SMEs, contractors, suppliers, consultants, and growth focused organisations seeking procurement opportunities.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Users size={22} />, title: "SMEs and Startups", desc: "Small businesses looking to access government procurement for the first time." },
              { icon: <Shield size={22} />, title: "Contractors and Suppliers", desc: "Established contractors seeking to expand their pipeline with new tender opportunities." },
              { icon: <TrendingUp size={22} />, title: "Growth Focused Organisations", desc: "Companies ready to scale through strategic government and public sector contracts." },
            ].map((item, i) => (
              <div key={i} className="text-left p-8 card-dark hover:border-[#0077CC]/30 transition-all duration-300" data-testid={`audience-card-${i}`}>
                <div className="w-10 h-10 rounded-lg bg-[#0077CC]/10 flex items-center justify-center text-[#00D0FF] mb-5">{item.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2 font-['Outfit']">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-[#061222]" data-testid="cta-section">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-4 font-['Outfit']">Discover opportunities that matter</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">SENRA is an intelligent opportunity platform built by Senueren to help South African businesses discover tenders faster, act smarter, and grow stronger.</p>
          <Link to="/senra" className="inline-flex items-center gap-2 px-8 py-4 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg font-semibold text-sm hover:bg-[#0077CC]/10 transition-all duration-300" data-testid="cta-explore-button">
            Open SENRA Platform <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};


/* ── SENRA Intelligence Page ── */

const SenraPage = () => {
  const [tenders, setTenders] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedUrgency, setSelectedUrgency] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedTender, setSelectedTender] = useState(null);

  const fetchTenders = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (searchQuery) p.append("q", searchQuery);
      if (selectedSector) p.append("sector", selectedSector);
      if (selectedUrgency) p.append("urgency", selectedUrgency);
      p.append("page", page.toString());
      p.append("limit", "20");
      const res = await axios.get(`${API}/tenders/search?${p}`);
      setTenders(res.data.results); setTotalPages(res.data.total_pages); setTotalCount(res.data.count);
    } catch { setTenders([]); }
    setLoading(false);
  }, [searchQuery, selectedSector, selectedUrgency, page]);

  useEffect(() => { axios.get(`${API}/tenders/sectors`).then(r => setSectors(r.data)).catch(() => {}); }, []);
  useEffect(() => { fetchTenders(); }, [fetchTenders]);

  const openDetail = async (id) => { try { const r = await axios.get(`${API}/tenders/${id}`); setSelectedTender(r.data); } catch {} };
  const handleSearch = (e) => { e.preventDefault(); setPage(1); };
  const resetFilters = () => { setSearchQuery(""); setSelectedSector(""); setSelectedUrgency(""); setPage(1); };

  return (
    <div className="min-h-screen bg-[#0A1D30] pt-16" data-testid="senra-page">
      <div className="border-b border-[#1A3148] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="accent-bar w-8"></div>
            <span className="text-xs tracking-[0.2em] uppercase font-bold text-[#0077CC] font-['Outfit']">SENRA Intelligence</span>
            <span className="flex items-center gap-1.5 text-xs text-[#00FF99]"><span className="w-1.5 h-1.5 bg-[#00FF99] rounded-full animate-pulse"></span>Live</span>
          </div>
          <h1 className="text-3xl md:text-4xl tracking-tight font-medium text-white font-['Outfit']">Tender Opportunities</h1>
          <p className="text-gray-400 mt-2 max-w-xl">Search, filter, and discover ranked procurement opportunities across South Africa.</p>
        </div>
      </div>

      <div className="border-b border-[#1A3148] px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3" data-testid="senra-search-form">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="text" placeholder="Search tenders by title or organisation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0F2035] border border-[#1A3148] rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#0077CC]/60 transition-colors" data-testid="senra-search-input" />
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <select value={selectedSector} onChange={(e) => { setSelectedSector(e.target.value); setPage(1); }}
                  className="appearance-none px-4 py-2.5 pr-9 bg-[#0F2035] border border-[#1A3148] rounded-lg text-sm text-white focus:outline-none focus:border-[#0077CC]/60 cursor-pointer" data-testid="senra-sector-filter">
                  <option value="" className="bg-[#0F2035]">All Sectors</option>
                  {sectors.map((s) => <option key={s.sector} value={s.sector} className="bg-[#0F2035]">{s.sector} ({s.count})</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <div className="relative">
                <select value={selectedUrgency} onChange={(e) => { setSelectedUrgency(e.target.value); setPage(1); }}
                  className="appearance-none px-4 py-2.5 pr-9 bg-[#0F2035] border border-[#1A3148] rounded-lg text-sm text-white focus:outline-none focus:border-[#0077CC]/60 cursor-pointer" data-testid="senra-urgency-filter">
                  <option value="" className="bg-[#0F2035]">All Urgency</option>
                  <option value="URGENT" className="bg-[#0F2035]">Urgent</option>
                  <option value="SOON" className="bg-[#0F2035]">Soon</option>
                  <option value="NORMAL" className="bg-[#0F2035]">Normal</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <button type="submit" className="px-5 py-2.5 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg text-sm font-semibold hover:bg-[#0077CC]/10 transition-colors" data-testid="senra-search-button">Search</button>
              {(searchQuery || selectedSector || selectedUrgency) && (
                <button type="button" onClick={resetFilters} className="px-4 py-2.5 border border-[#1A3148] rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-500 transition-colors" data-testid="senra-reset-button">Reset</button>
              )}
            </div>
          </form>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span data-testid="senra-result-count">{totalCount} opportunities found</span>
            {selectedSector && <span className="px-2.5 py-0.5 bg-[#0077CC]/10 text-[#00D0FF] rounded-full border border-[#0077CC]/20">{selectedSector}</span>}
            {selectedUrgency && <span className="px-2.5 py-0.5 bg-[#0077CC]/10 text-[#00D0FF] rounded-full border border-[#0077CC]/20">{selectedUrgency}</span>}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          {loading ? <div className="text-center py-20 text-gray-500" data-testid="senra-loading">Loading intelligence...</div>
          : tenders.length === 0 ? <div className="text-center py-20 text-gray-500" data-testid="senra-empty">No opportunities match your criteria.</div>
          : <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full" data-testid="senra-table">
                <thead><tr className="border-b border-[#1A3148] text-[10px] text-gray-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-bold">Tender</th><th className="text-left py-3 px-4 font-bold">Sector</th><th className="text-left py-3 px-4 font-bold">Deadline</th><th className="text-left py-3 px-4 font-bold">Score</th><th className="text-left py-3 px-4 font-bold">Urgency</th><th className="text-right py-3 px-4"></th>
                </tr></thead>
                <tbody>{tenders.map((t) => (
                  <tr key={t.id} className="border-b border-[#1A3148]/50 tender-row cursor-pointer" onClick={() => openDetail(t.id)} data-testid={`tender-row-${t.id}`}>
                    <td className="py-4 px-4"><p className="text-white text-sm font-medium">{t.title}</p><p className="text-gray-500 text-xs mt-0.5">{t.organisation}</p></td>
                    <td className="py-4 px-4"><span className="text-xs text-gray-400 px-2.5 py-1 bg-[#0A1D30] rounded-full border border-[#1A3148]">{t.sector}</span></td>
                    <td className="py-4 px-4"><div className="text-sm text-gray-300">{t.deadline || "Open"}</div>{t.days_remaining !== null && <div className="text-xs text-gray-500 mt-0.5">{t.days_remaining} days left</div>}</td>
                    <td className="py-4 px-4"><div className="flex items-center gap-2"><span className="text-sm text-white font-medium w-6">{t.score}</span><div className="score-bar w-16"><div className={`score-fill ${t.score >= 80 ? "score-high" : t.score >= 60 ? "score-mid" : "score-low"}`} style={{ width: `${t.score}%` }}></div></div></div></td>
                    <td className="py-4 px-4"><span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${t.urgency === "URGENT" ? "badge-urgent" : t.urgency === "SOON" ? "badge-soon" : "badge-normal"}`}>{t.urgency}</span></td>
                    <td className="py-4 px-4 text-right"><Eye size={15} className="text-gray-600 hover:text-[#00D0FF] transition-colors inline" /></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">{tenders.map((t) => (
              <div key={t.id} className="p-4 card-dark-sm cursor-pointer hover:border-[#0077CC]/30 transition-colors" onClick={() => openDetail(t.id)} data-testid={`tender-card-${t.id}`}>
                <div className="flex items-start justify-between mb-2"><div className="flex-1 mr-3"><p className="text-white text-sm font-medium">{t.title}</p><p className="text-gray-500 text-xs mt-0.5">{t.organisation}</p></div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${t.urgency === "URGENT" ? "badge-urgent" : t.urgency === "SOON" ? "badge-soon" : "badge-normal"}`}>{t.urgency}</span></div>
                <div className="flex items-center gap-4 text-xs text-gray-500"><span>{t.sector}</span><span>Score: {t.score}</span>{t.days_remaining !== null && <span>{t.days_remaining}d left</span>}</div>
              </div>
            ))}</div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#1A3148]">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors" data-testid="senra-prev-page"><ChevronLeft size={16} /> Previous</button>
                <span className="text-sm text-gray-500" data-testid="senra-page-info">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors" data-testid="senra-next-page">Next <ChevronRight size={16} /></button>
              </div>
            )}
          </>}
        </div>
      </div>

      {selectedTender && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedTender(null)} data-testid="tender-detail-modal">
          <div className="bg-[#0F2035] border border-[#1A3148] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${selectedTender.urgency === "URGENT" ? "badge-urgent" : selectedTender.urgency === "SOON" ? "badge-soon" : "badge-normal"}`}>{selectedTender.urgency}</span>
                <h2 className="text-xl font-medium text-white mt-3 font-['Outfit']" data-testid="tender-detail-title">{selectedTender.title}</h2>
                <p className="text-gray-400 text-sm mt-1">{selectedTender.organisation}</p>
              </div>
              <button onClick={() => setSelectedTender(null)} className="text-gray-500 hover:text-white transition-colors p-1" data-testid="tender-detail-close"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[{ l: "Sector", v: selectedTender.sector }, { l: "Score", v: `${selectedTender.score}/100` }, { l: "Deadline", v: selectedTender.deadline || "Open" }, { l: "Days Left", v: selectedTender.days_remaining ?? "N/A" }].map((d, i) => (
                <div key={i} className="p-3 bg-[#0A1D30] rounded-lg border border-[#1A3148]"><p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{d.l}</p><p className="text-sm text-white mt-0.5 font-medium">{d.v}</p></div>
              ))}
            </div>
            {selectedTender.insight && (
              <div className="p-5 bg-[#0077CC]/[0.06] border border-[#0077CC]/15 rounded-lg mb-6">
                <p className="text-[10px] tracking-[0.15em] uppercase text-[#0077CC] mb-2 font-['Outfit'] font-bold">SENRA Insight</p>
                <p className="text-sm text-gray-300 leading-relaxed" data-testid="tender-detail-insight">{selectedTender.insight}</p>
              </div>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500"><span>Source: {selectedTender.source}</span>{selectedTender.reference && <span>Ref: {selectedTender.reference}</span>}</div>
            {selectedTender.url && (
              <a href={selectedTender.url} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 w-full py-3 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg font-semibold text-sm hover:bg-[#0077CC]/10 transition-colors" data-testid="tender-detail-source-link">
                View Original Source <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      )}

      <section className="px-6 py-16 border-t border-[#1A3148]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-medium text-white mb-6 font-['Outfit']">About SENRA</h2>
          <div className="grid md:grid-cols-3 gap-8 text-sm text-gray-400 leading-relaxed">
            <div><h3 className="text-white font-medium mb-2 font-['Outfit']">What is SENRA</h3><p>SENRA is a system that helps businesses discover, filter, and prioritise tender opportunities more effectively. It centralises procurement data from across South Africa into a single, ranked interface.</p></div>
            <div><h3 className="text-white font-medium mb-2 font-['Outfit']">Why was it created</h3><p>Manual tender searching is time consuming, fragmented, and inconsistent. Important opportunities are often missed. SENRA solves this by aggregating and ranking opportunities so businesses can make better decisions faster.</p></div>
            <div><h3 className="text-white font-medium mb-2 font-['Outfit']">Who is it for</h3><p>SENRA serves South African businesses, SMEs, contractors, suppliers, consultants, and growth focused organisations seeking procurement opportunities in both government and private sectors.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
};


/* ── About Page ── */

const AboutPage = () => (
  <div className="min-h-screen bg-[#0A1D30] pt-16" data-testid="about-page">
    <section className="py-20 px-6" data-testid="about-hero">
      <div className="max-w-7xl mx-auto">
        <div className="card-dark overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center">
              <div className="accent-bar w-10 mb-6"></div>
              <h1 className="text-4xl md:text-5xl tracking-tighter font-medium text-white mb-6 font-['Outfit'] leading-[1.1]">Built from the belief that technology should create real progress</h1>
              <p className="text-gray-400 leading-relaxed text-lg">Through persistence, focused effort, and continuous growth, Senueren was established to build systems that help organisations operate smarter and move further.</p>
            </div>
            <div className="flex items-center justify-center p-0 lg:p-0 overflow-hidden">
              <img src="/hero-brand.jpg" alt="Senueren" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 px-6" data-testid="founder-section">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12 items-start">
        <div className="lg:col-span-2">
          <div className="card-dark p-8 sticky top-24">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0077CC] to-[#00FF99] flex items-center justify-center text-[#0A1D30] font-bold text-2xl font-['Outfit'] mb-6">QW</div>
            <h3 className="text-white text-xl font-medium font-['Outfit'] mb-1">Quelum Wilson</h3>
            <p className="text-gray-400 text-sm mb-4">Founder, Senueren</p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400"><MapPin size={14} className="text-[#0077CC] flex-shrink-0" /><span>Cape Town, South Africa</span></div>
              <div className="flex items-center gap-3 text-gray-400"><Clock size={14} className="text-[#0077CC] flex-shrink-0" /><span>Established June 2025</span></div>
              <div className="flex items-center gap-3 text-gray-400"><Globe size={14} className="text-[#0077CC] flex-shrink-0" /><span>senueren.co.za</span></div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="accent-bar w-10 mb-4"></div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-8 font-['Outfit']">The Founder</h2>
          <div className="space-y-5 text-gray-400 leading-relaxed">
            <p>Senueren was founded by Quelum Wilson, a Cape Town entrepreneur with a commitment to building meaningful systems that create higher standards through persistence.</p>
            <p>The company was established in June 2025 with a clear purpose: to create intelligent systems that help businesses operate smarter and access opportunities that would otherwise be missed.</p>
            <p>Through discipline, resilience, and execution, Senueren is growing into a trusted technology company focused on delivering real value to South African businesses. The approach is grounded in practical results, not hype.</p>
            <p>The vision is to build a company that South African businesses rely on for systems that actually work. Systems that save time, surface value, and create competitive advantage for companies that deserve better tools.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="py-20 px-6 bg-[#0F2035]" data-testid="mission-section">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
        <div>
          <div className="accent-bar w-10 mb-4"></div>
          <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-6 font-['Outfit']">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed mb-4 text-lg">The mission of Senueren is to help companies operate more efficiently, discover stronger opportunities, and use intelligent systems to grow sustainably.</p>
          <p className="text-gray-400 leading-relaxed">Senueren builds digital infrastructure and intelligent systems designed to improve how businesses operate and access opportunities. Every system we create is purpose built, grounded in practical business value, and designed for long term impact.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 content-start">
          {[{ icon: <Target size={20} />, title: "Focused", desc: "Purpose built systems, not generic solutions" }, { icon: <Shield size={20} />, title: "Reliable", desc: "Built for stability and long term performance" }, { icon: <TrendingUp size={20} />, title: "Growth", desc: "Designed to scale with your business" }, { icon: <Globe size={20} />, title: "Local", desc: "Built in South Africa, for South Africa" }].map((v, i) => (
            <div key={i} className="p-5 card-dark-sm"><div className="text-[#00D0FF] mb-3">{v.icon}</div><h4 className="font-medium text-white text-sm font-['Outfit'] mb-1">{v.title}</h4><p className="text-xs text-gray-400 leading-relaxed">{v.desc}</p></div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20 px-6 bg-[#0A1D30]" data-testid="what-we-do-section">
      <div className="max-w-7xl mx-auto">
        <div className="accent-bar w-10 mb-4"></div>
        <h2 className="text-3xl md:text-4xl tracking-tight font-medium text-white mb-12 font-['Outfit']">What we build</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ icon: <Database size={22} />, title: "Digital Infrastructure", desc: "Backend systems, automation pipelines, and scalable architectures designed for reliable business operations." }, { icon: <BarChart3 size={22} />, title: "Intelligence Systems", desc: "Systems that identify, rank, and prioritise real business opportunities. SENRA is our flagship platform." }, { icon: <Code size={22} />, title: "Custom Solutions", desc: "Tailored software and digital tools designed around specific business workflows and requirements." }].map((item, i) => (
            <div key={i} className="p-8 card-dark hover:border-[#0077CC]/30 transition-all duration-300" data-testid={`service-card-${i}`}>
              <div className="w-10 h-10 rounded-lg bg-[#0077CC]/10 flex items-center justify-center text-[#00D0FF] mb-5">{item.icon}</div>
              <h3 className="text-lg font-medium text-white mb-2 font-['Outfit']">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);


/* ── Contact Page ── */

const ContactPage = () => (
  <div className="min-h-screen bg-[#0A1D30] pt-16" data-testid="contact-page">
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <div className="accent-bar w-10 mb-6"></div>
          <h1 className="text-5xl md:text-6xl tracking-tighter font-medium text-white mb-6 font-['Outfit'] leading-[1.08]">Get in touch</h1>
          <p className="text-lg text-gray-400 leading-relaxed">Whether you have questions about SENRA, want to discuss a custom project, or simply want to connect.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <a href={`mailto:${CONTACT_EMAIL}`} className="p-8 card-dark hover:border-[#0077CC]/30 transition-all duration-300 group" data-testid="contact-email-card">
            <div className="w-12 h-12 rounded-xl bg-[#0077CC]/10 flex items-center justify-center mb-5 group-hover:bg-[#0077CC]/20 transition-all duration-300"><Mail size={22} className="text-[#00D0FF]" /></div>
            <h3 className="text-lg font-medium text-white mb-1 font-['Outfit']">Email</h3>
            <p className="text-[#00D0FF] text-sm font-medium">{CONTACT_EMAIL}</p>
          </a>
          <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="p-8 card-dark hover:border-[#0077CC]/30 transition-all duration-300 group" data-testid="contact-phone-card">
            <div className="w-12 h-12 rounded-xl bg-[#0077CC]/10 flex items-center justify-center mb-5 group-hover:bg-[#0077CC]/20 transition-all duration-300"><Phone size={22} className="text-[#00D0FF]" /></div>
            <h3 className="text-lg font-medium text-white mb-1 font-['Outfit']">Phone</h3>
            <p className="text-gray-400 text-sm">{CONTACT_PHONE}</p>
          </a>
          <div className="p-8 card-dark" data-testid="contact-location-card">
            <div className="w-12 h-12 rounded-xl bg-[#0077CC]/10 flex items-center justify-center mb-5"><MapPin size={22} className="text-[#00D0FF]" /></div>
            <h3 className="text-lg font-medium text-white mb-1 font-['Outfit']">Location</h3>
            <p className="text-gray-400 text-sm">Cape Town, South Africa</p>
          </div>
        </div>
        <div className="card-dark overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-12">
              <div className="accent-bar w-8 mb-4"></div>
              <h3 className="text-2xl font-medium text-white mb-3 font-['Outfit']">We typically respond within 24 to 48 hours</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">For the fastest response, email us directly or reach out via WhatsApp. We are happy to discuss SENRA, custom development projects, or any other enquiries.</p>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I'd%20like%20to%20get%20in%20touch.`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#0077CC]/50 text-[#00D0FF] rounded-lg font-semibold text-sm hover:bg-[#0077CC]/10 transition-all duration-300" data-testid="contact-whatsapp-button">
                Message on WhatsApp <ArrowUpRight size={14} />
              </a>
            </div>
            <div className="hidden lg:flex items-center justify-center p-12 bg-[#061222]">
              <img src="/logo-native.png" alt="Senueren" className="w-24 h-24 object-contain rounded-lg opacity-30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);


/* ── App ── */

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/senra" element={<SenraPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;
