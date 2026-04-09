import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { Database, Cpu, Send, Shield, Zap, ArrowRight, CheckCircle, Menu, X, BarChart3, Target, Users, MessageCircle, Lock, Code } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WHATSAPP_NUMBER = "27673267417";

// Logo using the exact SVG code user provided - two interlocking rings
const LogoMark = ({ size = 48 }) => {
  const scale = size / 512;
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00c6ff"/>
          <stop offset="100%" stopColor="#00ffcc"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      {/* LEFT INTERLOCKING RING */}
      <path d="M 150 260 A 120 120 0 1 1 270 140 A 120 120 0 0 1 360 240"
        fill="none" stroke="url(#grad)" strokeWidth="14" strokeLinecap="round" filter="url(#glow)" transform="rotate(-18 256 256)"/>
      {/* RIGHT INTERLOCKING RING */}
      <path d="M 360 250 A 120 120 0 1 1 240 370 A 120 120 0 0 1 150 270"
        fill="none" stroke="url(#grad)" strokeWidth="14" strokeLinecap="round" filter="url(#glow)" transform="rotate(18 256 256)"/>
      {/* INNER TECH LINES */}
      <path d="M180 256 L230 230 L290 230 L330 256" stroke="url(#grad)" strokeWidth="4" fill="none" opacity="0.7"/>
      <path d="M180 256 L230 282 L290 282 L330 256" stroke="url(#grad)" strokeWidth="4" fill="none" opacity="0.5"/>
      {/* LIGHT NODES */}
      <circle cx="150" cy="260" r="5" fill="#00eaff"/>
      <circle cx="360" cy="250" r="5" fill="#00ffcc"/>
    </svg>
  );
};

const Logo = ({ showText = true }) => (
  <Link to="/" className="flex items-center" data-testid="nav-logo">
    <span className="text-xl font-semibold tracking-[0.15em] logo-text">SENUEREN</span>
  </Link>
);

// WhatsApp Button
const WhatsAppButton = () => (
  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I'm%20interested%20in%20your%20services.`}
    target="_blank" rel="noopener noreferrer"
    className="fixed bottom-24 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center z-50 hover:scale-105 transition-transform"
    data-testid="whatsapp-button">
    <MessageCircle size={24} color="white" fill="white" />
  </a>
);

// Navbar
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-[#0a0e17]/95 border-b border-white/5' : ''}`} data-testid="navbar">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
            <a href="/#services" className="text-sm text-gray-400 hover:text-white">Services</a>
            <a href="/#senra" className="text-sm text-gray-400 hover:text-white">SENRA</a>
            <a href="/#ecosystem" className="text-sm text-gray-400 hover:text-white">Ecosystem</a>
            <a href="/#access" className="flat-btn text-sm px-5 py-2" data-testid="nav-cta">Request Access</a>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#0a0e17] z-40">
          <div className="px-6 py-8 space-y-6">
            <a href="/#services" className="block text-gray-300" onClick={() => setIsOpen(false)}>Services</a>
            <a href="/#senra" className="block text-gray-300" onClick={() => setIsOpen(false)}>SENRA</a>
            <a href="/#ecosystem" className="block text-gray-300" onClick={() => setIsOpen(false)}>Ecosystem</a>
            <a href="/#access" className="flat-btn inline-block" onClick={() => setIsOpen(false)}>Request Access</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Waitlist Form
const WaitlistForm = ({ source = "main" }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ loading: false, message: "", error: false });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", error: false });
    try {
      const response = await axios.post(`${API}/waitlist`, { ...formData, source });
      setStatus({ loading: false, message: response.data.message, error: false });
      if (response.data.status === "success") setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus({ loading: false, message: "Error. Please try again.", error: true });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="waitlist-form">
      <div className="grid sm:grid-cols-2 gap-4">
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="flat-input" required data-testid="waitlist-name-input" />
        <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="flat-input" required data-testid="waitlist-email-input" />
      </div>
      <textarea placeholder="Tell us about your project (optional)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="flat-input min-h-[80px] resize-none" data-testid="waitlist-message-input" />
      <button type="submit" disabled={status.loading} className="flat-btn w-full" data-testid="waitlist-submit-button">
        {status.loading ? "Submitting..." : "Request Access"}
      </button>
      {status.message && <p className={`text-sm ${status.error ? "text-red-400" : "text-[#00ffcc]"}`} data-testid="waitlist-status">{status.message}</p>}
    </form>
  );
};

// 1. HERO - With System Stats Panel (not decorative logo)
const Hero = () => (
  <section className="min-h-screen flex items-center bg-[#0a0e17] pt-16" data-testid="hero-section">
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            Build Systems.<br/>Extract Intelligence.<br/><span className="logo-text">Capture Opportunity.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            Senueren builds digital infrastructure, custom systems, and intelligence platforms that transform data into actionable business opportunities.
          </p>
          <p className="text-sm text-gray-500 mb-8">Built in South Africa. Designed for high-performance environments.</p>
          <div className="flex gap-4">
            <a href="#senra" className="flat-btn">Explore SENRA</a>
            <a href="#access" className="flat-btn-outline">Request Access</a>
          </div>
        </div>
        
        {/* System Stats Panel - replaces decorative logo */}
        <div className="hidden lg:block">
          <div className="border border-white/10 bg-[#0d1117]">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 tracking-wider">SYSTEM STATUS</span>
              <span className="text-xs font-mono text-[#00ffcc] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse"></span>
                OPERATIONAL
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-4xl font-bold text-white mb-1">847<span className="text-[#00c6ff]">+</span></p>
                <p className="text-sm text-gray-500">Opportunities Analyzed This Month</p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div>
                <p className="text-4xl font-bold text-white mb-1">94<span className="text-[#00c6ff]">%</span></p>
                <p className="text-sm text-gray-500">Signal Accuracy Rate</p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div>
                <p className="text-4xl font-bold text-white mb-1">12<span className="text-[#00c6ff]">x</span></p>
                <p className="text-sm text-gray-500">Faster Than Manual Discovery</p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Region</span>
                <span className="text-white font-mono">SOUTH AFRICA</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Processing</span>
                <span className="text-white font-mono">CONTINUOUS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 2. MARKET REALITY
const MarketReality = () => (
  <section className="py-20 bg-[#080c14]">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        <h2 className="text-3xl font-bold text-white">The Market Has Shifted</h2>
        <div className="space-y-4 text-gray-400">
          <p>Businesses are no longer competing on effort—they are competing on intelligence and infrastructure.</p>
          <p>Manual processes, fragmented data, and delayed decisions are no longer sustainable.</p>
          <p className="text-white font-medium">The gap between companies with structured systems and those relying on ad-hoc solutions is widening rapidly.</p>
        </div>
      </div>
    </div>
  </section>
);

// 3. IDENTITY - Updated per ChatGPT (Cape Town, broader positioning)
const Identity = () => (
  <section className="py-20 bg-[#0a0e17]" data-testid="identity-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Built for Systems, Not Trends</h2>
          <p className="text-gray-400 mb-4">
            Senueren is a <span className="text-white">South African digital infrastructure company</span> focused on building systems, custom software, and intelligence layers for SMEs operating in complex, data-heavy environments.
          </p>
          <p className="text-gray-400 mb-4">
            Founded by <span className="text-white font-medium">Quelum Wilson</span> and based in <span className="text-white">Cape Town</span>, Senueren develops scalable infrastructure that enables businesses to move from fragmented data to structured decision-making.
          </p>
          <p className="text-[#00c6ff] text-sm mb-6 border-l-2 border-[#00c6ff] pl-4">
            The company operates as a digital infrastructure layer—positioned between raw data, business operations, and decision systems.
          </p>
          <p className="text-gray-500 text-sm">
            SENRA is one of several systems developed within this infrastructure.
          </p>
          <div className="flex items-center gap-4 p-4 bg-[#0d1117] border border-white/5 mt-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00c6ff] to-[#00ffcc] flex items-center justify-center text-black font-bold">QW</div>
            <div>
              <p className="font-medium text-white">Quelum Wilson</p>
              <p className="text-sm text-gray-500">Founder · Cape Town, South Africa</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-6xl font-bold tracking-[0.15em] logo-text">SENUEREN</span>
        </div>
      </div>
    </div>
  </section>
);

// 4. SERVICES/CAPABILITIES - Broader (not just intelligence)
const Services = () => (
  <section id="services" className="py-20 bg-[#080c14]" data-testid="services-section">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-4 text-white">What We Build</h2>
      <p className="text-gray-400 mb-12 max-w-2xl">Digital infrastructure and systems for SMEs operating in complex environments.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Database size={24} />, title: "Digital Infrastructure", desc: "Backend systems, automation pipelines, and scalable architectures for SMEs." },
          { icon: <Code size={24} />, title: "Custom Systems & Software", desc: "Tailored software solutions designed around specific operational workflows." },
          { icon: <Cpu size={24} />, title: "Intelligence Systems", desc: "Data aggregation, scoring, and decision-support frameworks like SENRA." }
        ].map((item, i) => (
          <div key={i} className="flat-card" data-testid={`service-${i}`}>
            <div className="text-[#00c6ff] mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 5. INFRASTRUCTURE ASSURANCE
const InfrastructureAssurance = () => (
  <section className="py-20 bg-[#0a0e17]" data-testid="infrastructure-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Built for Reliability and Trust</h2>
          <p className="text-gray-400 mb-6">
            Senueren systems are designed with integrity at the core—ensuring data reliability, communication security, and operational consistency.
          </p>
          <ul className="space-y-3 mb-6">
            {["Secure system architecture", "Data pipeline integrity", "Communication authentication using DMARC", "Controlled deployment environments"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                <Shield size={16} className="text-[#00c6ff]" />{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: <Shield size={24} />, label: "Secure Architecture" },
            { icon: <Database size={24} />, label: "Data Integrity" },
            { icon: <Lock size={24} />, label: "DMARC Protected" },
            { icon: <Target size={24} />, label: "Controlled Deploy" }
          ].map((item, i) => (
            <div key={i} className="flat-card text-center py-8">
              <div className="text-[#00c6ff] mb-3 flex justify-center">{item.icon}</div>
              <p className="text-sm text-gray-300">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// 6. SENRA
const SenraSection = () => (
  <section id="senra" className="py-20 bg-[#080c14]" data-testid="senra-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <p className="text-[#00c6ff] text-sm mb-2">Deployed System</p>
          <h2 className="text-3xl font-bold mb-6 text-white">SENRA — Procurement Intelligence System</h2>
          <p className="text-gray-400 mb-4">
            SENRA is a procurement intelligence system developed within Senueren's infrastructure layer, designed to identify and rank high-value tender opportunities across South Africa.
          </p>
          <p className="text-gray-400 mb-4">
            Instead of exposing raw data or automated feeds, SENRA delivers <span className="text-white">curated, decision-ready opportunities</span> directly to clients.
          </p>
          
          <div className="bg-[#0d1117] border border-[#00c6ff]/20 p-4 mb-6">
            <p className="text-sm text-white font-medium mb-2">Why this matters:</p>
            <p className="text-sm text-gray-400 mb-2">
              Automated systems flood users with raw data. SENRA removes that noise by delivering only filtered, high-signal opportunities.
            </p>
            <p className="text-sm text-white">
              SENRA does not prioritize volume. It enforces selection—ensuring only opportunities with real operational value are delivered.
            </p>
          </div>
          
          <div className="border-l-2 border-[#00c6ff] pl-4 mb-6">
            <p className="text-gray-300 text-sm mb-3">Delivery Layer:</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ffcc]" />Personalized opportunity posts</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ffcc]" />Premium Telegram intelligence channel</li>
              <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#00ffcc]" />Direct operator-facing distribution</li>
            </ul>
          </div>
          
          <p className="text-white font-medium">Businesses stop searching and start selecting.</p>
        </div>
        
        <div className="space-y-4">
          <div className="flat-card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">System Status</span>
              <span className="text-xs text-[#00ffcc] font-mono bg-[#00ffcc]/10 px-2 py-1">OPERATIONAL</span>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-400">Data Sources</span><span className="text-white">50+</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Processing</span><span className="text-white">Continuous</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Delivery</span><span className="text-white">Telegram + Direct</span></div>
            </div>
          </div>
          <div className="flat-card">
            <h4 className="text-sm font-medium text-white mb-3">Intelligence Pipeline</h4>
            <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
              <span className="bg-[#0a0e17] px-3 py-1">Aggregate</span>
              <ArrowRight size={12} className="text-[#00c6ff]" />
              <span className="bg-[#0a0e17] px-3 py-1">Score</span>
              <ArrowRight size={12} className="text-[#00c6ff]" />
              <span className="bg-[#0a0e17] px-3 py-1">Rank</span>
              <ArrowRight size={12} className="text-[#00c6ff]" />
              <span className="bg-[#0a0e17] px-3 py-1">Deliver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// 7. COMPETITIVE ADVANTAGE
const CompetitiveAdvantage = () => (
  <section className="py-20 bg-[#0a0e17]">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-12 text-white">From Manual Discovery to Ranked Intelligence</h2>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flat-card border-red-500/20">
          <h3 className="text-lg font-medium text-gray-400 mb-4">Traditional Approach</h3>
          <ul className="space-y-3">
            {["Manual tender searches", "Time-consuming filtering", "Low signal-to-noise ratio", "Delayed decision-making"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-500"><X size={14} className="text-red-400" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="flat-card border-[#00ffcc]/20">
          <h3 className="text-lg font-medium text-white mb-4">Senueren Systems</h3>
          <ul className="space-y-3">
            {["Ranked opportunities", "Structured intelligence", "Reduced decision time", "High-probability targeting"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle size={14} className="text-[#00ffcc]" />{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// 8. ECOSYSTEM
const Ecosystem = () => (
  <section id="ecosystem" className="py-20 bg-[#080c14]" data-testid="ecosystem-section">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-4 text-white">Expanding Infrastructure</h2>
      <p className="text-gray-400 mb-12">Systems designed to evolve into a unified infrastructure layer.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: "SENRA", status: "Active", desc: "Procurement Intelligence", active: true },
          { name: "Quasar", status: "Development", desc: "Financial Intelligence", active: false },
          { name: "Custom Projects", status: "Available", desc: "Client Systems & Software", active: true }
        ].map((sys, i) => (
          <div key={i} className={`flat-card ${sys.active ? 'border-[#00c6ff]/30' : ''}`} data-testid={`ecosystem-${i}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{sys.name}</h3>
              <span className={`text-xs font-mono px-2 py-1 ${sys.active ? 'text-[#00ffcc] bg-[#00ffcc]/10' : 'text-gray-500 bg-gray-800'}`}>{sys.status}</span>
            </div>
            <p className="text-sm text-gray-400">{sys.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// 9. PROOF
const Proof = () => (
  <section className="py-20 bg-[#0a0e17]" data-testid="proof-section">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Active System Deployment</h2>
      <p className="text-gray-400 mb-8">Systems are actively operating within controlled environments and evolving toward full-scale deployment.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <Zap size={20} />, text: "Active intelligence processing" },
          { icon: <BarChart3 size={20} />, text: "Continuous opportunity analysis" },
          { icon: <Users size={20} />, text: "Controlled client delivery" },
          { icon: <Target size={20} />, text: "Early access users onboarded" }
        ].map((item, i) => (
          <div key={i} className="flat-card flex items-center gap-3">
            <span className="text-[#00c6ff]">{item.icon}</span>
            <span className="text-sm text-gray-300">{item.text}</span>
          </div>
        ))}
      </div>
      <p className="text-white font-medium">Built for scale. Deployed with precision.</p>
    </div>
  </section>
);

// 10. ACCESS
const Access = () => (
  <section id="access" className="py-20 bg-[#080c14]" data-testid="access-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Work With Senueren</h2>
          <p className="text-gray-400 mb-6">Whether you need custom software, infrastructure systems, or access to SENRA intelligence.</p>
          
          <div className="mb-8">
            <p className="text-sm text-gray-500 mb-4">How it works:</p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-mono">1</span>
                <span className="text-gray-300">Submit your request via form</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-mono">2</span>
                <span className="text-gray-300">We review and respond within 24-48 hours</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-mono">3</span>
                <span className="text-gray-300">Discovery call to understand your needs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-[#00c6ff]/20 text-[#00c6ff] flex items-center justify-center text-xs font-mono">4</span>
                <span className="text-gray-300">Custom proposal or SENRA onboarding</span>
              </li>
            </ol>
          </div>
          
          <p className="text-sm text-gray-500 italic">Access is controlled. Submissions are reviewed and selectively onboarded.</p>
        </div>
        
        <div className="flat-card">
          <h3 className="text-lg font-semibold mb-6 text-white">Request Access</h3>
          <WaitlistForm source="main" />
        </div>
      </div>
    </div>
  </section>
);

// 11. FOOTER - Updated per ChatGPT
const Footer = () => (
  <footer className="py-12 bg-[#0a0e17] border-t border-white/5" data-testid="footer">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-sm text-gray-500 mt-4">Digital Infrastructure & Intelligence Systems</p>
          <p className="text-xs text-gray-600 mt-2">Cape Town, South Africa</p>
          <p className="text-xs text-gray-600">Founded by Quelum Wilson</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Systems</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#senra" className="hover:text-white">SENRA</a></li>
            <li><span className="text-gray-600">Quasar (Coming)</span></li>
            <li><a href="#services" className="hover:text-white">Custom Projects</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Contact</h4>
          <a href="mailto:info@senueren.com" className="text-sm text-[#00c6ff]">info@senueren.com</a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-500 mt-2 hover:text-white">
            <MessageCircle size={14} /> WhatsApp
          </a>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-gray-600">
        <span>© {new Date().getFullYear()} Senueren. All rights reserved.</span>
        <span>Government tenders South Africa | Procurement intelligence | SME digital infrastructure | Custom software South Africa</span>
      </div>
    </div>
  </footer>
);

// Home Page
const Home = () => (
  <>
    <Hero />
    <MarketReality />
    <Identity />
    <Services />
    <InfrastructureAssurance />
    <SenraSection />
    <CompetitiveAdvantage />
    <Ecosystem />
    <Proof />
    <Access />
    <Footer />
  </>
);

function App() {
  return (
    <div className="bg-[#0a0e17] min-h-screen text-white">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/senra" element={<Home />} />
        </Routes>
        <WhatsAppButton />
      </BrowserRouter>
    </div>
  );
}

export default App;
