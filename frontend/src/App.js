import { useState, useEffect } from "react";
import "@/App.css";
import { HashRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Menu, X, Phone, Mail, MapPin,
  Layers, BarChart3, Target, Zap, Database, Workflow,
  Shield, CheckCircle2, ArrowUpRight, Building2, Cpu, Network
} from "lucide-react";

const CONTACT_EMAIL = "info@senueren.co.za";
const CONTACT_PHONE = "067 326 7417";
const WHATSAPP_NUMBER = "27673267417";

/* ── Shared Components ── */

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
    { to: "/systems", label: "Systems" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A1D30]/95 backdrop-blur-lg border-b border-[#1A3148]" : "bg-transparent"}`} data-testid="navbar">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Logo />
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link key={l.to} to={l.to}
                className={`text-sm font-medium transition-colors ${location.pathname === l.to ? "text-white" : "text-gray-400 hover:text-white"}`}
                data-testid={`nav-${l.label.toLowerCase()}-link`}>{l.label}</Link>
            ))}
            <a href="#contact" className="text-sm font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-[#0077CC] to-[#00A3E0] text-white hover:shadow-lg hover:shadow-[#0077CC]/20 transition-all duration-300" data-testid="nav-cta-button">
              Work With Us
            </a>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} data-testid="mobile-menu-toggle">
            {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40 bg-[#0A1D30] backdrop-blur-lg">
          <div className="px-6 py-8 space-y-6">
            {links.map((l) => <Link key={l.to} to={l.to} className="block text-lg font-medium text-gray-300 hover:text-white" data-testid={`mobile-${l.label.toLowerCase()}-link`}>{l.label}</Link>)}
            <a href="#contact" className="inline-block px-6 py-3 bg-gradient-to-r from-[#0077CC] to-[#00A3E0] text-white rounded-lg font-semibold" data-testid="mobile-cta-button">Work With Us</a>
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
          <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-4">
            Senueren is not a service provider. It is a systems company building the infrastructure behind modern business operations.
          </p>
          <p className="text-gray-600 text-xs">Cape Town, South Africa</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-gray-300 tracking-wide uppercase font-['Outfit']">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-home-link">Home</Link></li>
            <li><Link to="/systems" className="text-gray-400 hover:text-[#00D0FF] transition-colors" data-testid="footer-systems-link">Systems</Link></li>
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
        <span className="mt-2 md:mt-0">Systems · Automation · Intelligence</span>
      </div>
    </div>
  </footer>
);

/* ── Home Page ── */

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A1D30]" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0077CC]/5 to-transparent"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#0077CC]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00D0FF]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-[#0077CC]/10 border border-[#0077CC]/30 rounded-full mb-6">
              <span className="text-[#00D0FF] text-sm font-medium">Systems · Automation · Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl tracking-tight font-bold text-white mb-8 font-['Outfit'] leading-[1.1]">
              We Build Systems That<br />
              <span className="bg-gradient-to-r from-[#00D0FF] to-[#0077CC] bg-clip-text text-transparent">Businesses Run On</span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-3xl mx-auto">
              Senueren is a systems and automation company focused on designing and deploying operational infrastructure for modern businesses. 
              We build the backend engines, automation pipelines, and intelligence platforms that power efficiency, scale, and growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0077CC] to-[#00A3E0] text-white rounded-lg font-semibold text-base hover:shadow-xl hover:shadow-[#0077CC]/30 transition-all duration-300 group" data-testid="hero-cta-primary">
                Work With Us <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a href="#what-we-build" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#1A3148] text-gray-300 rounded-lg font-semibold text-base hover:border-[#0077CC]/50 hover:bg-[#0077CC]/5 transition-all duration-300" data-testid="hero-cta-secondary">
                View Systems
              </a>
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Building2 size={24} />, label: "Business Operating Systems" },
                { icon: <Workflow size={24} />, label: "Automation Infrastructure" },
                { icon: <Database size={24} />, label: "Data Intelligence" },
                { icon: <Cpu size={24} />, label: "Custom Backend Systems" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-4 rounded-lg bg-[#0F2035]/50 border border-[#1A3148]/50">
                  <div className="text-[#00D0FF]">{item.icon}</div>
                  <span className="text-xs text-gray-400 text-center">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Build */}
      <section id="what-we-build" className="py-24 px-6 bg-[#0F2035]" data-testid="what-we-build-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar w-16 mx-auto mb-4"></div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">What We Build</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We design and implement internal systems that transform how companies manage operations, data, and workflows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Building2 size={28} />,
                title: "Business Operating Systems",
                desc: "Centralized systems that manage clients, projects, finances, and internal workflows. Built for efficiency and control.",
                features: ["Client Management", "Project Tracking", "Financial Operations", "Workflow Automation"]
              },
              {
                icon: <Workflow size={28} />,
                title: "Automation Infrastructure",
                desc: "We eliminate repetitive work by building workflow automation pipelines, notification systems, and data processing engines.",
                features: ["Process Automation", "Workflow Orchestration", "Notification Systems", "Data Processing"]
              },
              {
                icon: <Database size={28} />,
                title: "Data Intelligence Platforms",
                desc: "We turn raw data into actionable insight through opportunity detection systems, filtering engines, and decision-support tools.",
                features: ["Opportunity Detection", "Intelligent Filtering", "Scoring Engines", "Decision Support"]
              },
              {
                icon: <Cpu size={28} />,
                title: "Custom Backend Systems",
                desc: "Tailored system architecture designed for scalability, integration, and operational control specific to your business needs.",
                features: ["Scalable Architecture", "API Integration", "Security First", "Performance Optimized"]
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 bg-[#0A1D30] border border-[#1A3148] rounded-xl hover:border-[#0077CC]/50 hover:shadow-xl hover:shadow-[#0077CC]/10 transition-all duration-300" data-testid={`system-card-${i}`}>
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0077CC]/20 to-[#00D0FF]/20 flex items-center justify-center text-[#00D0FF] flex-shrink-0 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 font-['Outfit']">{item.title}</h3>
                  </div>
                </div>
                <p className="text-gray-400 leading-relaxed mb-6">{item.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {item.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#00D0FF] flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship System - SENRA */}
      <section className="py-24 px-6 bg-[#0A1D30] relative overflow-hidden" data-testid="flagship-section">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#0077CC]/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-[#00D0FF]/10 border border-[#00D0FF]/30 rounded-full mb-4">
              <span className="text-[#00D0FF] text-sm font-semibold">Flagship System</span>
            </div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">SENRA</h2>
            <p className="text-xl text-gray-400">Procurement Intelligence Platform</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#0F2035] to-[#0A1D30] border border-[#0077CC]/30 rounded-2xl p-10 shadow-2xl">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                SENRA is a data intelligence system designed to help businesses identify and act on high-value government tender opportunities. 
                It represents Senueren's approach to building real-world systems that solve economic problems at scale.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  { label: "Aggregates", desc: "Tender data from official sources" },
                  { label: "Filters", desc: "Opportunities using intelligent categorization" },
                  { label: "Validates", desc: "Removes low-quality signals" },
                  { label: "Delivers", desc: "Structured, actionable opportunities" }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-[#0A1D30]/50 rounded-lg border border-[#1A3148]/50">
                    <div className="w-2 h-2 rounded-full bg-[#00D0FF] mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{item.label}</h4>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#1A3148]">
                <p className="text-sm text-gray-500 italic">
                  SENRA demonstrates our capability in building production-grade intelligence systems. Integration available for business clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 px-6 bg-[#0F2035]" data-testid="approach-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar w-16 mx-auto mb-4"></div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">Our Approach</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We follow a structured engineering process to deliver reliable, scalable systems.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              { num: "01", title: "System Design", desc: "Define architecture aligned with business operations" },
              { num: "02", title: "Infrastructure Build", desc: "Develop core backend systems and automation layers" },
              { num: "03", title: "Integration", desc: "Connect data, workflows, and operational tools" },
              { num: "04", title: "Deployment", desc: "Deliver a stable, scalable system" },
              { num: "05", title: "Optimization", desc: "Continuously improve performance and efficiency" }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="p-6 bg-[#0A1D30] border border-[#1A3148] rounded-xl hover:border-[#0077CC]/50 transition-all duration-300 h-full">
                  <div className="text-5xl font-bold text-[#0077CC]/20 mb-4 font-['Outfit']">{item.num}</div>
                  <h3 className="text-xl font-bold text-white mb-3 font-['Outfit']">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-[#0077CC]/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Senueren */}
      <section className="py-24 px-6 bg-[#0A1D30]" data-testid="why-section">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="accent-bar w-16 mx-auto mb-4"></div>
            <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-4 font-['Outfit']">Why Senueren</h2>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: <Network size={24} />, label: "Systems-First Thinking" },
              { icon: <Target size={24} />, label: "Real Operational Problems" },
              { icon: <Layers size={24} />, label: "Built for Scalability" },
              { icon: <Shield size={24} />, label: "Structured Engineering" },
              { icon: <BarChart3 size={24} />, label: "Long-Term Infrastructure" }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#0F2035] border border-[#1A3148] rounded-xl hover:border-[#0077CC]/50 hover:bg-[#0F2035]/80 transition-all duration-300 text-center group">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-br from-[#0077CC]/20 to-[#00D0FF]/20 flex items-center justify-center text-[#00D0FF] group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold">{item.label}</h3>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto text-center">
            <blockquote className="text-2xl text-gray-300 font-medium italic leading-relaxed">
              "Businesses lack structured systems to operate efficiently at scale. We design and implement internal systems that transform how companies manage operations, data, and workflows."
            </blockquote>
          </div>
        </div>
      </section>

      {/* Work With Us */}
      <section id="contact" className="py-24 px-6 bg-[#0F2035]" data-testid="work-with-us-section">
        <div className="max-w-4xl mx-auto text-center">
          <div className="accent-bar w-16 mx-auto mb-6"></div>
          <h2 className="text-4xl md:text-5xl tracking-tight font-bold text-white mb-6 font-['Outfit']">Work With Us</h2>
          <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto">
            We partner with businesses that require structured internal systems, automation at scale, and data-driven operations.
          </p>
          <p className="text-lg text-gray-400 mb-12">
            If your business needs systems that improve efficiency and unlock growth, we can design and deploy the solution.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0077CC] to-[#00A3E0] text-white rounded-lg font-semibold text-base hover:shadow-xl hover:shadow-[#0077CC]/30 transition-all duration-300">
              <Mail size={20} /> Email Us
            </a>
            <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`} className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#1A3148] text-gray-300 rounded-lg font-semibold text-base hover:border-[#0077CC]/50 hover:bg-[#0077CC]/5 transition-all duration-300">
              <Phone size={20} /> {CONTACT_PHONE}
            </a>
          </div>

          <div className="mt-12 p-8 bg-[#0A1D30]/50 border border-[#1A3148] rounded-xl">
            <p className="text-gray-400 text-sm">
              <strong className="text-white">Senueren is not a service provider.</strong><br />
              It is a systems company building the infrastructure behind modern business operations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ── Systems Page ── */

const SystemsPage = () => {
  return (
    <div className="min-h-screen bg-[#0A1D30] pt-28 pb-16" data-testid="systems-page">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="accent-bar w-16 mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-white mb-6 font-['Outfit']">
            Systems We Build
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our focus areas in building operational infrastructure for modern businesses.
          </p>
        </div>

        <div className="space-y-8">
          {[
            {
              icon: <Building2 size={32} />,
              title: "Business Operating Systems",
              desc: "Centralized systems that manage clients, projects, finances, and internal workflows.",
              details: "We build comprehensive operating systems that serve as the central nervous system of your business. These systems integrate client management, project tracking, financial operations, and workflow automation into a single, cohesive platform."
            },
            {
              icon: <Workflow size={32} />,
              title: "Automation Infrastructure",
              desc: "Workflow automation pipelines, notification systems, and data processing engines.",
              details: "Our automation infrastructure eliminates repetitive manual work by building intelligent workflow orchestration, automated notification systems, and high-performance data processing engines that run reliably at scale."
            },
            {
              icon: <Database size={32} />,
              title: "Data Intelligence Platforms",
              desc: "Opportunity detection systems, filtering engines, and decision-support tools.",
              details: "We turn raw data into actionable intelligence through sophisticated opportunity detection algorithms, intelligent filtering and scoring engines, and decision-support tools that help you make informed business decisions."
            },
            {
              icon: <Cpu size={32} />,
              title: "Custom Backend Systems",
              desc: "Tailored system architecture designed for scalability, integration, and operational control.",
              details: "Every business has unique needs. We design and build custom backend systems with scalable architecture, seamless API integration, security-first approach, and performance optimization tailored specifically for your operational requirements."
            }
          ].map((item, i) => (
            <div key={i} className="p-8 md:p-10 bg-[#0F2035] border border-[#1A3148] rounded-2xl hover:border-[#0077CC]/50 hover:shadow-xl hover:shadow-[#0077CC]/10 transition-all duration-300">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0077CC]/20 to-[#00D0FF]/20 flex items-center justify-center text-[#00D0FF] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2 font-['Outfit']">{item.title}</h2>
                  <p className="text-lg text-gray-400">{item.desc}</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{item.details}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="#contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0077CC] to-[#00A3E0] text-white rounded-lg font-semibold text-base hover:shadow-xl hover:shadow-[#0077CC]/30 transition-all duration-300">
            Discuss Your System Needs <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
};

/* ── About Page ── */

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0A1D30] pt-28 pb-16" data-testid="about-page">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="accent-bar w-16 mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-white mb-6 font-['Outfit']">
            About Senueren
          </h1>
        </div>

        <div className="space-y-12">
          <div className="p-8 bg-[#0F2035] border border-[#1A3148] rounded-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 font-['Outfit']">
              Built from the belief that technology should create real progress
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              Through persistence, focused effort, and continuous growth, Senueren was established to build systems that help organisations operate smarter and move further.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We do not build surface-level solutions. We build systems that become part of how a business functions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-[#0F2035] border border-[#1A3148] rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">Our Focus</h3>
              <p className="text-gray-300 leading-relaxed">
                Senueren exists to solve one problem: <strong className="text-white">Businesses lack structured systems to operate efficiently at scale.</strong>
              </p>
            </div>

            <div className="p-8 bg-[#0F2035] border border-[#1A3148] rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-4 font-['Outfit']">Our Approach</h3>
              <p className="text-gray-300 leading-relaxed">
                Engineering-first, focused on reliability, scalability, and long-term value. We build infrastructure, not quick fixes.
              </p>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-[#0F2035] to-[#0A1D30] border border-[#0077CC]/30 rounded-2xl">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0077CC] to-[#00D0FF] flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                QW
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 font-['Outfit']">Quelum Wilson</h3>
                <p className="text-[#00D0FF] mb-4">Founder, Senueren</p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Senueren was founded by Quelum Wilson, a Cape Town entrepreneur with a commitment to building meaningful systems that create higher standards through persistence.
                </p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  The company was established in June 2025 with a clear purpose: to create intelligent systems that help businesses operate smarter and access opportunities that would otherwise be missed.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Through discipline, resilience, and execution, Senueren is growing into a trusted technology company focused on delivering real value to South African businesses.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#00D0FF]" />
                    Cape Town, South Africa
                  </span>
                  <span>•</span>
                  <span>Established June 2025</span>
                  <span>•</span>
                  <span>senueren.co.za</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-12 bg-[#0F2035] border border-[#1A3148] rounded-2xl">
            <p className="text-2xl text-gray-300 font-medium leading-relaxed">
              The vision is to build a company that South African businesses rely on for systems that <span className="text-white font-bold">actually work</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Contact Page ── */

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0A1D30] pt-28 pb-16" data-testid="contact-page">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="accent-bar w-16 mx-auto mb-6"></div>
          <h1 className="text-5xl md:text-6xl tracking-tight font-bold text-white mb-6 font-['Outfit']">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Whether you have questions, want to discuss a custom project, or simply want to connect.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Mail size={28} />,
              title: "Email",
              value: CONTACT_EMAIL,
              link: `mailto:${CONTACT_EMAIL}`,
              color: "from-[#0077CC] to-[#00A3E0]"
            },
            {
              icon: <Phone size={28} />,
              title: "Phone",
              value: CONTACT_PHONE,
              link: `tel:${CONTACT_PHONE.replace(/\s/g, "")}`,
              color: "from-[#00A3E0] to-[#00D0FF]"
            },
            {
              icon: <MapPin size={28} />,
              title: "Location",
              value: "Cape Town, South Africa",
              link: null,
              color: "from-[#00D0FF] to-[#0077CC]"
            }
          ].map((item, i) => (
            <div key={i} className="p-6 bg-[#0F2035] border border-[#1A3148] rounded-xl hover:border-[#0077CC]/50 transition-all duration-300">
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${item.color} bg-opacity-20 flex items-center justify-center text-white mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{item.title}</h3>
              {item.link ? (
                <a href={item.link} className="text-[#00D0FF] hover:underline">{item.value}</a>
              ) : (
                <p className="text-gray-400">{item.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="p-10 bg-gradient-to-br from-[#0F2035] to-[#0A1D30] border border-[#0077CC]/30 rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4 font-['Outfit']">We typically respond within 24 to 48 hours</h2>
          <p className="text-gray-300 mb-6 leading-relaxed">
            For the fastest response, email us directly or reach out via WhatsApp. We are happy to discuss systems, custom development projects, or any other enquiries.
          </p>
          <a 
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Senueren%2C%20I%27d%20like%20to%20discuss%20a%20system%20project.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#20C55C] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#25D366]/20 transition-all duration-300"
          >
            Message on WhatsApp <ArrowUpRight size={18} />
          </a>
        </div>
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
