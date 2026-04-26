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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const BRIEFS = [
  {
    id: "skipit-green",
    company: "SkipIt Green",
    sector: "Waste Management & Logistics",
    location: "Cape Town",
    issue: "Manual Scaling Bottleneck",
    description: "Reputable brand since 2014 but currently managing logistics with 1990s technology. Relying on manual phone-based dispatch and quote requests.",
    systemsGap: "Lack of real-time availability tracking, automated dispatch engines, and customer self-service portals.",
    solution: "Implementation of an Automated Logistics Engine for real-time bookings, fleet tracking, and automated customer notifications.",
    tag: "Logistics Automation"
  },
  {
    id: "zenitec",
    company: "Zenitec",
    sector: "IT & Managed Services",
    location: "Cape Town",
    issue: "Digital Footprint Disconnect",
    description: "An IT firm whose own digital infrastructure lags behind its service quality. Reliance on manual WhatsApp links for support instead of professional portals.",
    systemsGap: "Absence of an integrated CRM/Ticketing backend that proves operational maturity to enterprise clients.",
    solution: "Building a Structured Business OS with a centralized client dashboard to manage tickets, contracts, and IT health metrics.",
    tag: "Business OS"
  },
  {
    id: "initiate-international",
    company: "Initiate International",
    sector: "Recruitment",
    location: "Cape Town",
    issue: "Data Intelligence Lag",
    description: "Fragmented candidate intake journey and manual screening processes in high-speed sectors like iGaming and FinTech.",
    systemsGap: "Broken time-to-match pipelines and technical fragmentation in backend data intake.",
    solution: "Deployment of a Custom Data Intelligence Engine to automate candidate screening and intake workflows, accelerating placement speed.",
    tag: "Data Intelligence"
  }
];

const InsightsPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="insights-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <div className="accent-bar w-12 mb-6"></div>
          <div className="max-w-3xl">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">Technical Briefs & Case Studies</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">Systems Insights</h1>
            <p className="text-[#8B9BB4] mt-4 text-lg">
              We analyze the 'Systems Gap' in South African SMEs. These briefs highlight how custom architecture and automation turn operational chaos into scalable growth.
            </p>
          </div>
        </div>

        {/* Briefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {BRIEFS.map((brief) => (
            <div key={brief.id} 
              className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow flex flex-col h-full group hover:border-[#00FFD4]/30 transition-all cursor-pointer"
              onClick={() => setSelected(brief)}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1A2332] group-hover:border-[#00FFD4]/50 transition-colors">
                  {brief.id === "skipit-green" && <Workflow size={24} className="text-[#00FFD4]" />}
                  {brief.id === "zenitec" && <Cpu size={24} className="text-[#4A9FD8]" />}
                  {brief.id === "initiate-international" && <Database size={24} className="text-purple-400" />}
                </div>
                <span className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest bg-[#0A0E17] px-3 py-1 rounded-full border border-[#1A2332]">
                  {brief.tag}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-white font-['Outfit'] mb-2">{brief.company}</h3>
              <p className="text-xs text-[#00FFD4] font-medium mb-4">{brief.sector} · {brief.location}</p>
              
              <div className="space-y-4 flex-1">
                <div>
                  <span className="text-[10px] text-[#8B9BB4] uppercase font-bold tracking-wider block mb-1">Primary Issue</span>
                  <p className="text-sm text-[#E8EDF2] leading-relaxed">{brief.issue}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#00FFD4] group-hover:gap-3 transition-all">
                Read Technical Brief <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Why this matters section */}
        <section className="mt-20 pt-16 border-t border-[#1A2332]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white font-['Outfit'] mb-6">Is your business 'Scaling into Chaos'?</h2>
              <p className="text-[#8B9BB4] leading-relaxed mb-6">
                Most growth-stage SMEs in South Africa have the market and the talent, but their internal infrastructure is reaching a breaking point. 
                Gmail accounts for business, manual spreadsheets for dispatch, and fragmented data are the "silent killers" of profitability.
              </p>
              <div className="space-y-4">
                {[
                  "Reduce admin time by up to 80%",
                  "Eliminate manual data entry errors",
                  "Gain real-time operational visibility",
                  "Professionalize for enterprise-grade contracts"
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
                  <BarChart3 size={32} className="text-[#00FFD4]" />
                  <h4 className="text-lg font-bold text-white">The Systems ROI</h4>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#8B9BB4]">Operational Efficiency</span>
                      <span className="text-sm text-[#00FFD4] font-bold">+65%</span>
                    </div>
                    <div className="h-2 w-full bg-[#0A0E17] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00FFD4] w-[65%] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#8B9BB4]">Manual Work Reduction</span>
                      <span className="text-sm text-[#4A9FD8] font-bold">-80%</span>
                    </div>
                    <div className="h-2 w-full bg-[#0A0E17] rounded-full overflow-hidden">
                      <div className="h-full bg-[#4A9FD8] w-[80%] rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#8B9BB4] mt-6 italic">
                    *Based on average performance improvements following Senueren systems implementation.
                  </p>
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
              <ShieldAlert size={24} className="rotate-180" />
            </button>
            
            <div className="mb-8">
              <span className="text-[10px] font-bold text-[#00FFD4] uppercase tracking-[0.2em] bg-[#00FFD4]/10 border border-[#00FFD4]/30 px-4 py-1.5 rounded-full mb-6 inline-block">
                Technical Brief: {selected.company}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-4">{selected.issue}</h2>
              <div className="flex items-center gap-4 text-sm text-[#8B9BB4]">
                <span className="flex items-center gap-1.5"><Target size={14} className="text-[#4A9FD8]" /> {selected.sector}</span>
                <span className="flex items-center gap-1.5 font-medium text-[#E8EDF2]"><Lightbulb size={14} className="text-[#00FFD4]" /> Systemic Fix</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-[#1A2332]">
              <div>
                <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3">The Problem</h4>
                <p className="text-[#E8EDF2] leading-relaxed text-sm">{selected.description}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3 text-red-400/80">The Systems Gap</h4>
                <p className="text-[#E8EDF2] leading-relaxed text-sm italic border-l-2 border-red-500/30 pl-4">{selected.systemsGap}</p>
              </div>
            </div>

            <div className="mt-8 bg-[#0A0E17] border border-[#00FFD4]/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#00FFD4]/10 rounded-lg">
                  <Cpu size={20} className="text-[#00FFD4]" />
                </div>
                <h4 className="text-lg font-bold text-white font-['Outfit']">The Senueren Architecture</h4>
              </div>
              <p className="text-[#8B9BB4] text-sm leading-relaxed mb-6">
                {selected.solution}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Infrastructure</span>
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Automation</span>
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Scale Ready</span>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 text-[#00FFD4] font-bold hover:underline group">
                Schedule a briefing for your company <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
