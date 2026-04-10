import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import { Database, Cpu, Send, Shield, Zap, ArrowRight, CheckCircle, Menu, X, BarChart3, Target, Users, MessageCircle, Lock, Code, Phone, Mail, Clock, TrendingUp, DollarSign, AlertCircle } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const WHATSAPP_NUMBER = "27673267417";
const CONTACT_EMAIL = "info@senueren.co.za";
const CONTACT_PHONE = "067 326 7417";

const Logo = ({ showText = true }) => (
  <Link to="/" className="flex items-center" data-testid="nav-logo">
    <span className="text-xl font-semibold tracking-[0.15em] logo-text">SENUEREN</span>
  </Link>
);

const WhatsAppButton = () => (
  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I'm%20interested%20in%20SENRA%20access.`}
    target="_blank" rel="noopener noreferrer"
    className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center z-50 hover:scale-105 transition-transform shadow-lg shadow-[#25D366]/30"
    data-testid="whatsapp-button">
    <MessageCircle size={24} color="white" fill="white" />
  </a>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'bg-[#0a0e17]/95 border-b border-white/5 backdrop-blur-sm' : ''}`} data-testid="navbar">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
            <a href="/#senra" className="text-sm text-gray-400 hover:text-white">SENRA</a>
            <a href="/#services" className="text-sm text-gray-400 hover:text-white">Services</a>
            <a href="/#contact" className="text-sm text-gray-400 hover:text-white">Contact</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I%20want%20SENRA%20access.`} target="_blank" rel="noopener noreferrer" className="flat-btn text-sm px-5 py-2" data-testid="nav-cta">Get SENRA Access</a>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-[#0a0e17] z-40">
          <div className="px-6 py-8 space-y-6">
            <a href="/#senra" className="block text-gray-300" onClick={() => setIsOpen(false)}>SENRA</a>
            <a href="/#services" className="block text-gray-300" onClick={() => setIsOpen(false)}>Services</a>
            <a href="/#contact" className="block text-gray-300" onClick={() => setIsOpen(false)}>Contact</a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I%20want%20SENRA%20access.`} target="_blank" rel="noopener noreferrer" className="flat-btn inline-block" onClick={() => setIsOpen(false)}>Get SENRA Access</a>
          </div>
        </div>
      )}
    </nav>
  );
};

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
      <textarea placeholder="Tell us about your business (optional)" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="flat-input min-h-[80px] resize-none" data-testid="waitlist-message-input" />
      <button type="submit" disabled={status.loading} className="flat-btn w-full" data-testid="waitlist-submit-button">
        {status.loading ? "Submitting..." : "Request Access"}
      </button>
      {status.message && <p className={`text-sm ${status.error ? "text-red-400" : "text-[#00ffcc]"}`} data-testid="waitlist-status">{status.message}</p>}
    </form>
  );
};

const Hero = () => (
  <section className="min-h-screen flex items-center bg-[#0a0e17] pt-16" data-testid="hero-section">
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#00ffcc]/10 border border-[#00ffcc]/20 px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-[#00ffcc]">SENRA SYSTEM ACTIVE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
            Stop Searching.<br/>Start <span className="logo-text">Winning</span><br/>Government Tenders.
          </h1>
          <p className="text-lg text-gray-400 mb-4 leading-relaxed">
            SENRA identifies high-value tender opportunities in South Africa before your competitors find them. No more manual searching. No more missed deadlines.
          </p>
          <p className="text-sm text-[#00ffcc] mb-8 font-medium">Limited onboarding capacity. Early users prioritized.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I%20want%20SENRA%20access%20to%20find%20government%20tenders.`} target="_blank" rel="noopener noreferrer" className="flat-btn flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Get SENRA Access Now
            </a>
            <a href="#how-it-works" className="flat-btn-outline">See How It Works</a>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="border border-white/10 bg-[#0d1117]">
            <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-500 tracking-wider">SENRA INTELLIGENCE</span>
              <span className="text-xs font-mono text-[#00ffcc] flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ffcc] rounded-full animate-pulse"></span>
                LIVE
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <p className="text-xs text-gray-500 mb-1">Example Pipeline Identified</p>
                <p className="text-4xl font-bold text-white">R79.8M<span className="text-[#00c6ff]">+</span></p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div>
                <p className="text-xs text-gray-500 mb-1">High-Value Opportunities</p>
                <p className="text-4xl font-bold text-white">Daily<span className="text-[#00c6ff]">.</span></p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Time Saved vs Manual Search</p>
                <p className="text-4xl font-bold text-white">12<span className="text-[#00c6ff]">x</span></p>
              </div>
              <div className="h-px bg-white/5"></div>
              <div className="bg-[#00ffcc]/5 border border-[#00ffcc]/20 p-4">
                <p className="text-sm text-[#00ffcc] font-medium">Example Result:</p>
                <p className="text-white font-bold text-xl mt-1">R11.4M Contract Secured</p>
                <p className="text-xs text-gray-400 mt-1">By early access user</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const SenraConversion = () => (
  <section id="senra" className="py-20 bg-[#080c14]" data-testid="senra-conversion">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <p className="text-[#00c6ff] text-sm font-mono mb-2">SENRA INTELLIGENCE SYSTEM</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Intelligence That Identifies Revenue</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Most businesses don't lose tenders because they're incapable. They lose because they see opportunities <span className="text-white">too late</span> — or chase the wrong ones.
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <h3 className="text-xl font-bold text-white mb-6">SENRA changes that.</h3>
          <p className="text-gray-400 mb-6">SENRA scans hundreds of government tenders daily and ranks them based on what actually matters to your business:</p>
          <ul className="space-y-4 mb-8">
            {[
              { icon: <Target size={18} />, text: "Relevance to your operations" },
              { icon: <DollarSign size={18} />, text: "Estimated contract value and scale" },
              { icon: <Clock size={18} />, text: "Deadline urgency — act before others" },
              { icon: <TrendingUp size={18} />, text: "Win probability scoring" }
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <span className="text-[#00c6ff]">{item.icon}</span>
                {item.text}
              </li>
            ))}
          </ul>
          <div className="bg-[#0d1117] border-l-4 border-[#00ffcc] p-6 mb-8">
            <h4 className="text-white font-bold mb-3">What This Means For You:</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#00ffcc] mt-0.5 flex-shrink-0" />Identify high-value tenders before competitors</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#00ffcc] mt-0.5 flex-shrink-0" />Focus only on opportunities worth your time</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#00ffcc] mt-0.5 flex-shrink-0" />Stop wasting hours on manual searching</li>
              <li className="flex items-start gap-2"><CheckCircle size={16} className="text-[#00ffcc] mt-0.5 flex-shrink-0" />Build a stronger, targeted pipeline</li>
            </ul>
          </div>
          <p className="text-white font-medium text-lg">Shift from searching to selecting.</p>
        </div>
        <div className="space-y-6">
          <div className="flat-card border-[#00ffcc]/30">
            <h4 className="text-sm font-mono text-gray-500 mb-6">EXAMPLE INTELLIGENCE OUTPUT</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-[#0a0e17]">
                <span className="text-gray-400">Pipeline Identified</span>
                <span className="text-2xl font-bold text-white">R79.8M+</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#0a0e17]">
                <span className="text-gray-400">Contract Secured</span>
                <span className="text-2xl font-bold text-[#00ffcc]">R11.4M</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-[#0a0e17]">
                <span className="text-gray-400">High-Value Opps</span>
                <span className="text-2xl font-bold text-white">Daily</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flat-card border-red-500/20 p-4">
              <p className="text-xs text-red-400 font-mono mb-3">TRADITIONAL</p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li className="flex items-center gap-2"><X size={12} className="text-red-400" />Manual searches</li>
                <li className="flex items-center gap-2"><X size={12} className="text-red-400" />React late</li>
                <li className="flex items-center gap-2"><X size={12} className="text-red-400" />Chase everything</li>
              </ul>
            </div>
            <div className="flat-card border-[#00ffcc]/20 p-4">
              <p className="text-xs text-[#00ffcc] font-mono mb-3">WITH SENRA</p>
              <ul className="space-y-2 text-xs text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00ffcc]" />Ranked daily</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00ffcc]" />Act early</li>
                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-[#00ffcc]" />Focus smart</li>
              </ul>
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#00c6ff]/10 to-[#00ffcc]/10 border border-[#00ffcc]/30 p-6">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle size={16} className="text-[#00ffcc]" />
              <p className="text-sm text-[#00ffcc] font-medium">Limited Access</p>
            </div>
            <p className="text-sm text-gray-400 mb-4">This system is not publicly distributed. Access is reviewed and granted selectively.</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I%20want%20access%20to%20SENRA%20for%20government%20tender%20intelligence.`} target="_blank" rel="noopener noreferrer" className="flat-btn w-full flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Request SENRA Access
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-20 bg-[#0a0e17]" data-testid="how-it-works">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-4 text-white">How SENRA Works</h2>
      <p className="text-gray-400 mb-12">From raw data to ranked opportunities in your hands.</p>
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { step: "01", title: "Aggregate", desc: "SENRA scans 50+ sources across South African government portals daily" },
          { step: "02", title: "Analyze", desc: "AI scores each opportunity based on value, relevance, and deadline" },
          { step: "03", title: "Rank", desc: "Only high-probability opportunities make the cut" },
          { step: "04", title: "Deliver", desc: "Receive curated opportunities via Telegram or direct feed" }
        ].map((item, i) => (
          <div key={i} className="flat-card relative">
            <span className="text-5xl font-bold text-[#00c6ff]/10 absolute top-4 right-4">{item.step}</span>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Services = () => (
  <section id="services" className="py-20 bg-[#080c14]" data-testid="services-section">
    <div className="max-w-6xl mx-auto px-6">
      <h2 className="text-3xl font-bold mb-4 text-white">Beyond SENRA: Custom Systems</h2>
      <p className="text-gray-400 mb-12 max-w-2xl">Need something built specifically for your business? Senueren develops digital infrastructure and custom software for SMEs.</p>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Database size={24} />, title: "Digital Infrastructure", desc: "Backend systems, automation pipelines, and scalable architectures." },
          { icon: <Code size={24} />, title: "Custom Software", desc: "Tailored solutions designed around your specific workflows." },
          { icon: <Cpu size={24} />, title: "Intelligence Systems", desc: "Systems that identify and prioritize real business opportunities." }
        ].map((item, i) => (
          <div key={i} className="flat-card" data-testid={`service-${i}`}>
            <div className="text-[#00c6ff] mb-4">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-white">{item.title}</h3>
            <p className="text-sm text-gray-400">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <a href="#contact" className="flat-btn-outline">Discuss Custom Project</a>
      </div>
    </div>
  </section>
);

const TrustSignals = () => (
  <section className="py-16 bg-[#0a0e17]" data-testid="trust-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Shield size={24} />, title: "Secure Systems", desc: "Enterprise-grade security" },
          { icon: <Zap size={24} />, title: "Real-Time", desc: "Daily opportunity updates" },
          { icon: <Target size={24} />, title: "SA Focused", desc: "Built for local market" },
          { icon: <Users size={24} />, title: "Controlled Access", desc: "Quality over quantity" }
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-4 p-4">
            <div className="text-[#00c6ff]">{item.icon}</div>
            <div>
              <h4 className="font-medium text-white">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Identity = () => (
  <section className="py-20 bg-[#080c14]" data-testid="identity-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Built in South Africa. For South Africa.</h2>
          <p className="text-gray-400 mb-4">Senueren is a Cape Town-based digital infrastructure company focused on building systems that help SMEs identify and capture real business opportunities.</p>
          <p className="text-gray-400 mb-6">Founded by <span className="text-white font-medium">Quelum Wilson</span>, we believe that access to structured intelligence should not be reserved for large corporations.</p>
          <div className="flex items-center gap-4 p-4 bg-[#0d1117] border border-white/5">
            <div className="w-12 h-12 bg-gradient-to-br from-[#00c6ff] to-[#00ffcc] flex items-center justify-center text-black font-bold">QW</div>
            <div>
              <p className="font-medium text-white">Quelum Wilson</p>
              <p className="text-sm text-gray-500">Founder - Cape Town</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <span className="text-5xl sm:text-6xl font-bold tracking-[0.15em] logo-text">SENUEREN</span>
        </div>
      </div>
    </div>
  </section>
);

const Contact = () => (
  <section id="contact" className="py-20 bg-[#0a0e17]" data-testid="contact-section">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-white">Get In Touch</h2>
          <p className="text-gray-400 mb-8">Whether you want SENRA access or need a custom system built, we are here to help.</p>
          <div className="space-y-6 mb-8">
            <a href={`mailto:${CONTACT_EMAIL}`} className="flex items-center gap-4 p-4 bg-[#0d1117] border border-white/5 hover:border-[#00c6ff]/30 transition-colors">
              <div className="w-12 h-12 bg-[#00c6ff]/10 flex items-center justify-center">
                <Mail size={20} className="text-[#00c6ff]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-white font-medium">{CONTACT_EMAIL}</p>
              </div>
            </a>
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="flex items-center gap-4 p-4 bg-[#0d1117] border border-white/5 hover:border-[#00c6ff]/30 transition-colors">
              <div className="w-12 h-12 bg-[#00c6ff]/10 flex items-center justify-center">
                <Phone size={20} className="text-[#00c6ff]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-white font-medium">{CONTACT_PHONE}</p>
              </div>
            </a>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I'd%20like%20to%20discuss%20working%20together.`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 bg-[#0d1117] border border-white/5 hover:border-[#25D366]/30 transition-colors">
              <div className="w-12 h-12 bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle size={20} className="text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm text-gray-500">WhatsApp (Fastest)</p>
                <p className="text-white font-medium">Message Us Directly</p>
              </div>
            </a>
          </div>
          <div className="border-l-2 border-[#00c6ff] pl-4">
            <p className="text-sm text-gray-500">Response Time</p>
            <p className="text-white">Within 24-48 hours</p>
          </div>
        </div>
        <div>
          <div className="flat-card">
            <h3 className="text-lg font-semibold mb-2 text-white">Request Access or Quote</h3>
            <p className="text-sm text-gray-500 mb-6">Fill out the form and we will get back to you.</p>
            <WaitlistForm source="contact" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-20 bg-[#080c14]" data-testid="final-cta">
    <div className="max-w-3xl mx-auto px-6 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Stop Searching and Start Winning?</h2>
      <p className="text-gray-400 mb-8">Join businesses already using SENRA to identify high-value government tender opportunities.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren,%20I'm%20ready%20to%20get%20SENRA%20access.`} target="_blank" rel="noopener noreferrer" className="flat-btn flex items-center justify-center gap-2 px-8">
          <MessageCircle size={18} /> Get SENRA Access
        </a>
        <a href="#contact" className="flat-btn-outline px-8">Enterprise / Custom</a>
      </div>
      <p className="text-xs text-gray-600 mt-6">Limited onboarding capacity. Applications reviewed within 48 hours.</p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-[#0a0e17] border-t border-white/5" data-testid="footer">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2">
          <Logo />
          <p className="text-sm text-gray-500 mt-4">Digital Infrastructure and Procurement Intelligence</p>
          <p className="text-xs text-gray-600 mt-2">Cape Town, South Africa</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#senra" className="hover:text-white">SENRA</a></li>
            <li><a href="#services" className="hover:text-white">Services</a></li>
            <li><a href="#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-white mb-4">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={`mailto:${CONTACT_EMAIL}`} className="text-[#00c6ff]">{CONTACT_EMAIL}</a></li>
            <li><a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className="text-gray-500 hover:text-white">{CONTACT_PHONE}</a></li>
            <li>
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-white">
                <MessageCircle size={14} /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs text-gray-600">
        <span>© {new Date().getFullYear()} Senueren. All rights reserved.</span>
        <span className="mt-2 md:mt-0">Government tenders South Africa | Procurement intelligence | SME solutions</span>
      </div>
    </div>
  </footer>
);

const Home = () => (
  <>
    <Hero />
    <SenraConversion />
    <HowItWorks />
    <Services />
    <TrustSignals />
    <Identity />
    <Contact />
    <FinalCTA />
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
