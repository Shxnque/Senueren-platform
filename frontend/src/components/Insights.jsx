import { useState } from "react";
import { 
  Lightbulb, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Workflow, 
  Database,
  ArrowUpRight,
  Target,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  BarChart4
} from "lucide-react";
import { Link } from "react-router-dom";

const BRIEFS = [
  {
    id: "systems-gap",
    company: "Manufacturing & Growth SMEs",
    sector: "Manufacturing",
    location: "Gauteng / National",
    issue: "Scaling into Chaos",
    description: "Most SA SMEs reach a breaking point when they hit R10m-R50m revenue. Manual spreadsheets and founder-led decision making fail to handle the increased operational volume.",
    systemsGap: "Fragmentation of business systems—disconnected purchasing, inventory, and sales data preventing real-time visibility.",
    solution: "Implementation of an integrated Systems Architecture that consolidates finance, inventory, and production into a single 'source of truth.'",
    tag: "Systems Gap",
    fullContent: "The 'Systems Gap' is the invisible wall that stops a R5m business from becoming a R50m powerhouse. In 2026, South African manufacturers face dual pressures: fluctuating energy costs and the need for rapid digital maturity. When your accounting system doesn't talk to your warehouse, you're not just losing time—you're losing margin. Senueren bridges this gap by building the custom backends that turn manual chaos into a predictable growth machine."
  },
  {
    id: "procurement-intelligence",
    company: "Civil & Infrastructure Contractors",
    sector: "Construction",
    location: "Gauteng / KZN",
    issue: "The Procurement Lottery",
    description: "SMEs often spend 80% of their time finding the right tenders and only 20% on the actual bid. The eTenders portal is treated like a lottery rather than a data source.",
    systemsGap: "Lack of procurement intelligence to filter for 'Solid Match' tenders based on CIDB grade, relevance, and urgency.",
    solution: "Deployment of SENRA—a Procurement Intelligence layer that scores and triages 2,000+ active SA tenders in real-time.",
    tag: "SENRA Spotlight",
    fullContent: "With South Africa's R179bn infrastructure pipeline, the opportunity for Grade 1-6 contractors is massive. However, most SMEs are filtered out before they even bid because they lack 'Digital Maturity.' SENRA (Senueren Procurement Intelligence) removes the guesswork. We index live data from SANRAL, Transnet, and metros, scoring every opportunity on relevance and value. It's not just a list; it's the intelligence your bid team needs to win."
  },
  {
    id: "logistics-automation",
    company: "Last-Mile & Fleet Operators",
    sector: "Logistics",
    location: "Western Cape / Durban",
    issue: "Manual Dispatch Bottleneck",
    description: "Logistics SMEs frequently struggle with 'Manual Handling'—relying on phone-based dispatching and manual vehicle tracking for high-volume collections.",
    systemsGap: "Absence of real-time availability tracking and automated dispatch engines, leading to high administrative overhead per truck.",
    solution: "Building an Automated Logistics Engine for real-time booking, route optimization, and automated client notifications.",
    tag: "Logistics ROI",
    fullContent: "In the 2026 logistics market, 'reliability' is no longer enough—enterprise clients demand 'visibility.' If your dispatch process relies on phone calls and WhatsApp, your scaling capacity is capped. Senueren builds the automated infrastructure that handles the heavy lifting of logistics operations. From real-time route optimization to automated proof-of-delivery, we give local hauliers the tech stack of a global giant."
  },
  {
    id: "compliance-automation",
    company: "High-Value Service Providers",
    sector: "Professional Services",
    location: "Cape Town / National",
    issue: "Compliance Documentation Lag",
    description: "B-BBEE, Tax, and CIDB compliance management often consumes weeks of administrative time, slowing down the response time for high-value RFPs.",
    systemsGap: "Manual tracking of compliance certificates and lack of an automated 'Tender Vault' for documentation.",
    solution: "Creation of a Structured Compliance Engine that automates document alerts and pre-fills tender requirements.",
    tag: "Efficiency",
    fullContent: "Compliance in South Africa is a competitive requirement, not an option. For professional service firms, the 'Systems Gap' often manifests in the slow assembly of safety files and B-BBEE documentation. Senueren builds the systems that automate this documentation pipeline. We turn compliance from an administrative burden into a streamlined asset that lets you respond to corporate RFPs in hours, not days."
  }
];

const SENRA_ARTICLE = {
  title: "Beyond the Bid: Why 2026 is the Year of Procurement Intelligence",
  content: [
    {
      heading: "The R179 Billion Pipeline Problem",
      text: "South Africa's infrastructure drive is opening doors, but for many SMEs, those doors are locked by data fragmentation. Finding the right tender at the right time is no longer a manual task."
    },
    {
      heading: "Enter SENRA: The Decision Layer",
      text: "We didn't just build a tender list. We built a Decision Layer. SENRA analyzes thousands of government and private sector opportunities, scoring them across three axes: Relevance, Value, and Urgency."
    },
    {
      heading: "Digital Maturity vs. The Competition",
      text: "Enterprise clients are looking for 'Digital Maturity.' Using SENRA to automate your procurement intelligence proves that your firm has the infrastructure to handle large-scale contracts."
    }
  ]
};

const InsightsPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="insights-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="accent-bar w-12 mb-6"></div>
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">Technical Briefs & Sector Analysis</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">Systems Insights</h1>
            <p className="text-[#8B9BB4] mt-4 text-lg">
              We analyze the 'Systems Gap' in South African growth-stage companies. These briefs show how structured architecture and automation solve common scaling bottlenecks.
            </p>
          </div>
        </div>

        {/* Briefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {BRIEFS.map((brief) => (
            <div key={brief.id} 
              className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow flex flex-col h-full group hover:border-[#00FFD4]/30 transition-all cursor-pointer"
              onClick={() => setSelected(brief)}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1A2332] group-hover:border-[#00FFD4]/50 transition-colors">
                  {brief.sector === "Logistics" && <Workflow size={24} className="text-[#00FFD4]" />}
                  {brief.sector === "Manufacturing" && <Cpu size={24} className="text-[#4A9FD8]" />}
                  {brief.sector === "Construction" && <Target size={24} className="text-orange-400" />}
                  {brief.sector === "Professional Services" && <ShieldCheck size={24} className="text-purple-400" />}
                </div>
                <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest bg-[#0A0E17] px-3 py-1 rounded-full border border-[#1A2332]">
                  {brief.tag}
                </span>
              </div>
              
              <h3 className="text-2xl font-bold text-white font-['Outfit'] mb-2">{brief.issue}</h3>
              <p className="text-xs text-[#00FFD4] font-medium mb-4">{brief.sector} · {brief.location}</p>
              
              <div className="space-y-4 flex-1">
                <p className="text-sm text-[#8B9BB4] leading-relaxed line-clamp-3">{brief.description}</p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#00FFD4] group-hover:gap-3 transition-all">
                Read Full Insight <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* SENRA Spotlight Article */}
        <section className="mb-24 py-16 px-8 md:px-12 bg-[#0F1419] border border-[#1A2332] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00FFD4]/5 to-transparent"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-bold text-[#00FFD4] uppercase tracking-[0.2em] bg-[#00FFD4]/10 border border-[#00FFD4]/30 px-4 py-1.5 rounded-full mb-6 inline-block">
                SENRA Intelligence Deep Dive
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-6">{SENRA_ARTICLE.title}</h2>
              <div className="space-y-8">
                {SENRA_ARTICLE.content.map((section, i) => (
                  <div key={i}>
                    <h4 className="text-sm font-bold text-[#E8EDF2] mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-[#00FFD4] rounded-full"></div>
                      {section.heading}
                    </h4>
                    <p className="text-sm text-[#8B9BB4] leading-relaxed">{section.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/senra" className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all">
                  Explore SENRA Live <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Globe size={20} />, label: "2,000+ Active Tenders", desc: "Aggregated from 15 verified SA sources." },
                { icon: <Lock size={20} />, label: "Security & Compliance", desc: "Baked-in CIDB and B-BBEE documentation." },
                { icon: <BarChart4 size={20} />, label: "Weighted Scoring", desc: "Relevance, Value, and Urgency metrics." },
                { icon: <Zap size={20} />, label: "Urgent Alerts", desc: "Surface opportunities closing within 14 days." }
              ].map((stat, i) => (
                <div key={i} className="bg-[#0A0E17] border border-[#1A2332] p-6 rounded-2xl">
                  <div className="text-[#00FFD4] mb-3">{stat.icon}</div>
                  <h4 className="text-sm font-bold text-white mb-1">{stat.label}</h4>
                  <p className="text-[10px] text-[#8B9BB4]">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why this matters section */}
        <section className="mt-20 pt-16 border-t border-[#1A2332]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white font-['Outfit'] mb-6">Turning the 'Systems Gap' into Revenue</h2>
              <p className="text-[#8B9BB4] leading-relaxed mb-6">
                In 2026, digital maturity is the primary differentiator for SA SMEs. Those who move from manual handling to automated pipelines don't just save time—they win larger, more profitable contracts.
              </p>
              <div className="space-y-4">
                {[
                  "Automate tender documentation and matching (SENRA)",
                  "Eliminate manual data fragmentation between departments",
                  "Gain real-time operational oversight for distributed teams",
                  "Professionalize for Grade 7-9 and enterprise contracts"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-[#00FFD4]" />
                    <span className="text-sm text-[#E8EDF2] font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A9FD8] to-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all">
                  Request a Systems Audit <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00FFD4]/10 to-transparent blur-3xl rounded-full"></div>
              <div className="relative bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow">
                <div className="flex items-center gap-4 mb-8">
                  <TrendingUp size={32} className="text-[#00FFD4]" />
                  <h4 className="text-lg font-bold text-white">SA Market SEO Signal</h4>
                </div>
                <div className="space-y-6">
                  <div className="p-4 bg-[#0A0E17] rounded-xl border border-[#1A2332]">
                    <span className="text-[10px] text-[#8B9BB4] uppercase font-bold block mb-1">Trending Pain Point</span>
                    <p className="text-sm text-[#E8EDF2] font-medium">'Systems architecture for growth-stage SMEs'</p>
                  </div>
                  <div className="p-4 bg-[#0A0E17] rounded-xl border border-[#1A2332]">
                    <span className="text-[10px] text-[#8B9BB4] uppercase font-bold block mb-1">High-Intent Topic</span>
                    <p className="text-sm text-[#E8EDF2] font-medium">'Automating Grade 9 tender compliance'</p>
                  </div>
                  <div className="p-4 bg-[#0A0E17] rounded-xl border border-[#1A2332]">
                    <span className="text-[10px] text-[#8B9BB4] uppercase font-bold block mb-1">Procurement Signal</span>
                    <p className="text-sm text-[#E8EDF2] font-medium">'AI-driven tender matching for SA Logistics'</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Modal / Detail View */}
      {selected && (
        <div className="fixed inset-0 z-[70] bg-[#0A0E17]/95 backdrop-blur-md flex items-start justify-center pt-24 px-4 overflow-y-auto" onClick={() => setSelected(null)}>
          <div className="bg-[#0F1419] border border-[#1A2332] rounded-3xl max-w-3xl w-full p-8 md:p-12 mb-12 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-[#8B9BB4] hover:text-white p-2 rounded-full hover:bg-[#1A2332] transition-all">
              <Zap size={24} className="text-[#00FFD4]" />
            </button>
            
            <div className="mb-8">
              <span className="text-[10px] font-bold text-[#00FFD4] uppercase tracking-[0.2em] bg-[#00FFD4]/10 border border-[#00FFD4]/30 px-4 py-1.5 rounded-full mb-6 inline-block">
                Sector Insight: {selected.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-4">{selected.issue}</h2>
              <div className="flex items-center gap-4 text-sm text-[#8B9BB4]">
                <span className="flex items-center gap-1.5"><Target size={14} className="text-[#4A9FD8]" /> {selected.sector}</span>
                <span className="flex items-center gap-1.5 font-medium text-[#E8EDF2]"><Lightbulb size={14} className="text-[#00FFD4]" /> Systemic Analysis</span>
              </div>
            </div>

            <div className="space-y-6 py-8 border-y border-[#1A2332]">
              <p className="text-[#E8EDF2] leading-relaxed text-lg font-medium italic">
                "{selected.fullContent}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3">The Systems Gap</h4>
                  <p className="text-[#E8EDF2] leading-relaxed text-sm border-l-2 border-red-500/30 pl-4">{selected.systemsGap}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3 text-[#00FFD4]">The Architecture Fix</h4>
                  <p className="text-[#E8EDF2] leading-relaxed text-sm">{selected.solution}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#00FFD4]/10 rounded-lg">
                  <Database size={20} className="text-[#00FFD4]" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit']">Building the Revenue Infrastructure</h4>
              </div>
              <p className="text-[#8B9BB4] text-sm leading-relaxed mb-6">
                Senueren isn't just about software—it's about the infrastructure behind modern SA business. We fix the data gaps that stop you from scaling.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Scale Ready</span>
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Gauteng Pipeline</span>
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Operational ROI</span>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 text-[#00FFD4] font-bold hover:underline group">
                Schedule a Systems Audit for your firm <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
