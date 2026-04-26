import { useState, useEffect } from "react";
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
  BarChart4,
  Droplets,
  Coins
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

const ARTICLES = [
  {
    id: "procurement-2026",
    title: "Beyond the Bid: Why 2026 is the Year of Procurement Intelligence",
    tag: "SENRA Intelligence",
    icon: <Target className="text-[#00FFD4]" size={24} />,
    sections: [
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
  },
  {
    id: "infrastructure-resilience",
    title: "Infrastructure Resilience: Managing Water and Energy Systems at Scale",
    tag: "Systems Architecture",
    icon: <Droplets className="text-[#4A9FD8]" size={24} />,
    sections: [
      {
        heading: "The New Bottom Line: Resource Security",
        text: "In 2026, water security has surpassed energy as the primary infrastructure concern for SA SMEs. For manufacturers and service providers, managing these resources requires more than just hardware; it requires intelligent monitoring systems."
      },
      {
        heading: "Architecture for Scarcity",
        text: "We design systems that integrate sensor data with operational workflows. Knowing your water usage in real-time allows you to schedule production around constraints rather than reacting to shutdowns."
      },
      {
        heading: "The Senueren Approach to Resilience",
        text: "By building a data-first infrastructure, we help companies manage backup power and water storage as integrated business assets, not just emergency fixes. This is the difference between surviving a crisis and thriving through it."
      }
    ]
  },
  {
    id: "financial-maturity",
    title: "The Cashflow Engine: Automating Financial Maturity for SMEs",
    tag: "Business OS",
    icon: <Coins className="text-yellow-400" size={24} />,
    sections: [
      {
        heading: "91% of SA SMEs Face Late Payments",
        text: "Late payments are the leading cause of business failure for South African growth SMEs. Relying on manual follow-ups is an operational risk you can no longer afford."
      },
      {
        heading: "Structured Receivables Architecture",
        text: "We build the financial engines that automate the invoice-to-cash cycle. By integrating your accounting stack with automated reminders and instant settlement gateways, we reduce the 'cost of waiting' for your revenue."
      },
      {
        heading: "Scaling Profit, Not Just Revenue",
        text: "A R50m revenue business with R0 cashflow is a liability. Our Systems Architecture ensures that as your top line grows, your operational efficiency protects your bottom line."
      }
    ]
  }
];

const InsightsPage = () => {
  const [selectedBrief, setSelectedBrief] = useState(null);

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the 'Systems Gap' in South African SMEs?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Systems Gap is the disconnect between a company's scaling revenue and its manual operational infrastructure. It often manifests as a reliance on spreadsheets and manual dispatch, which becomes a bottleneck once revenue hits the R10m-R50m range."
          }
        },
        {
          "@type": "Question",
          "name": "How does procurement intelligence help contractors win tenders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Procurement intelligence like SENRA filters and scores live tenders based on relevance and value. This allows bid teams to focus on 'Solid Match' opportunities, increasing the win rate while reducing time spent on manual portal searching."
          }
        },
        {
          "@type": "Question",
          "name": "Why is logistics automation critical for SA fleet operators in 2026?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Enterprise clients now demand real-time visibility. Automating dispatch and fleet management eliminates manual errors and provides the digital maturity signals required to secure larger corporate and government logistics contracts."
          }
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);


  return (
    <div className="min-h-screen bg-[#0A0E17] pt-24 pb-16" data-testid="insights-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="accent-bar w-12 mb-6 mx-auto md:mx-0"></div>
          <div className="max-w-3xl mx-auto md:mx-0">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00FFD4] mb-2">Technical Briefs & Market Analysis</p>
            <h1 className="text-4xl md:text-5xl tracking-tight font-bold text-white font-['Outfit']">Systems Insights</h1>
            <p className="text-[#8B9BB4] mt-4 text-lg">
              Analyzing the 'Systems Gap' in South African growth-stage companies. We build the architecture that turns manual bottlenecks into scalable growth.
            </p>
          </div>
        </div>

        {/* Feature Articles */}
        <div className="space-y-24 mb-24">
          {ARTICLES.map((article, idx) => (
            <section key={article.id} className={`py-16 px-8 md:px-12 bg-[#0F1419] border border-[#1A2332] rounded-3xl relative overflow-hidden ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#00FFD4]/5 to-transparent"></div>
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <span className="text-[10px] font-bold text-[#00FFD4] uppercase tracking-[0.2em] bg-[#00FFD4]/10 border border-[#00FFD4]/30 px-4 py-1.5 rounded-full mb-6 inline-block">
                    {article.tag}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-6">{article.title}</h2>
                  <div className="space-y-8">
                    {article.sections.map((section, i) => (
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
                    <Link to={article.id === "procurement-2026" ? "/senra" : "/contact"} className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FFD4] text-[#0A0E17] rounded-full font-bold hover:shadow-[0_0_30px_rgba(0,255,212,0.4)] transition-all">
                      {article.id === "procurement-2026" ? "Explore SENRA Live" : "Discuss Resilience Systems"} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
                <div className={`grid grid-cols-2 gap-4 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                   <div className="col-span-2 flex justify-center mb-4">
                      <div className="p-6 bg-[#0A0E17] border border-[#1A2332] rounded-full">
                        {article.icon}
                      </div>
                   </div>
                  {[
                    { label: "Market Data", val: article.id === "procurement-2026" ? "2,000+ Tenders" : "Real-time Metrics" },
                    { label: "Design Philosophy", val: "Systems-First" },
                    { label: "Target Sector", val: "Growth SMEs" },
                    { label: "ROI Signal", val: "Operational Flow" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#0A0E17] border border-[#1A2332] p-6 rounded-2xl text-center">
                      <h4 className="text-xs font-bold text-[#00FFD4] mb-1 uppercase tracking-widest">{stat.label}</h4>
                      <p className="text-sm text-white font-medium">{stat.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* Briefs Section Header */}
        <div className="mb-12">
          <div className="accent-bar w-12 mb-6"></div>
          <h2 className="text-3xl font-bold text-white font-['Outfit']">Sector Bottleneck Analysis</h2>
          <p className="text-[#8B9BB4] mt-2">Deep-dives into the specific 'Systems Gaps' of South African industries.</p>
        </div>

        {/* Briefs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {BRIEFS.map((brief) => (
            <div key={brief.id} 
              className="bg-[#0F1419] border border-[#1A2332] rounded-2xl p-8 card-glow flex flex-col h-full group hover:border-[#00FFD4]/30 transition-all cursor-pointer"
              onClick={() => setSelectedBrief(brief)}>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-[#0A0E17] border border-[#1A2332] group-hover:border-[#00FFD4]/50 transition-colors">
                  {brief.sector === "Logistics" && <Workflow size={20} className="text-[#00FFD4]" />}
                  {brief.sector === "Manufacturing" && <Cpu size={20} className="text-[#4A9FD8]" />}
                  {brief.sector === "Construction" && <Target size={20} className="text-orange-400" />}
                  {brief.sector === "Professional Services" && <ShieldCheck size={20} className="text-purple-400" />}
                </div>
                <span className="text-[8px] font-bold text-[#8B9BB4] uppercase tracking-widest bg-[#0A0E17] px-2 py-1 rounded-full border border-[#1A2332]">
                  {brief.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-white font-['Outfit'] mb-2">{brief.issue}</h3>
              <p className="text-[10px] text-[#00FFD4] font-medium mb-4 uppercase tracking-wider">{brief.sector}</p>
              
              <div className="space-y-4 flex-1">
                <p className="text-xs text-[#8B9BB4] leading-relaxed line-clamp-3">{brief.description}</p>
              </div>

              <div className="mt-8 flex items-center gap-2 text-xs font-bold text-[#00FFD4] group-hover:gap-3 transition-all">
                Read Brief <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>

        
      </div>

      {/* Brief Detail Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-[70] bg-[#0A0E17]/95 backdrop-blur-md flex items-start justify-center pt-24 px-4 overflow-y-auto" onClick={() => setSelectedBrief(null)}>
          <div className="bg-[#0F1419] border border-[#1A2332] rounded-3xl max-w-3xl w-full p-8 md:p-12 mb-12 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedBrief(null)} className="absolute top-6 right-6 text-[#8B9BB4] hover:text-white p-2 rounded-full hover:bg-[#1A2332] transition-all">
              <Zap size={24} className="text-[#00FFD4]" />
            </button>
            
            <div className="mb-8">
              <span className="text-[10px] font-bold text-[#00FFD4] uppercase tracking-[0.2em] bg-[#00FFD4]/10 border border-[#00FFD4]/30 px-4 py-1.5 rounded-full mb-6 inline-block">
                Sector Insight: {selectedBrief.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Outfit'] mb-4">{selectedBrief.issue}</h2>
              <div className="flex items-center gap-4 text-sm text-[#8B9BB4]">
                <span className="flex items-center gap-1.5"><Target size={14} className="text-[#4A9FD8]" /> {selectedBrief.sector}</span>
                <span className="flex items-center gap-1.5 font-medium text-[#E8EDF2]"><Lightbulb size={14} className="text-[#00FFD4]" /> Systemic Analysis</span>
              </div>
            </div>

            <div className="space-y-6 py-8 border-y border-[#1A2332]">
              <p className="text-[#E8EDF2] leading-relaxed text-lg font-medium italic">
                "{selectedBrief.fullContent}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3">The Systems Gap</h4>
                  <p className="text-[#E8EDF2] leading-relaxed text-sm border-l-2 border-red-500/30 pl-4">{selectedBrief.systemsGap}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#8B9BB4] uppercase tracking-widest mb-3 text-[#00FFD4]">The Architecture Fix</h4>
                  <p className="text-[#E8EDF2] leading-relaxed text-sm">{selectedBrief.solution}</p>
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
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">Infrastructure Resilience</span>
                <span className="text-[10px] font-bold text-[#E8EDF2] bg-[#1A2332] px-3 py-1 rounded-lg border border-[#2A3A54]">SA Market Logic</span>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 text-[#00FFD4] font-bold hover:underline group">
                Schedule a briefing for your firm <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
