import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Cpu, Terminal, Layers, Globe, Server, Zap, Package } from 'lucide-react';

const SITE_URL = 'https://senueren.co.za';

const useSEO = ({ title, description, path = '/' }) => {
  useEffect(() => {
    document.title = title;
    const fullUrl = `${SITE_URL}${path}`;
    const setMeta = (selector, attr, value) => {
      let el = document.head.querySelector(selector);
      if (!el) {
        el = document.createElement(selector.startsWith('meta') ? 'meta' : 'link');
        const m = selector.match(/\[(.+?)="(.+?)"\]/);
        if (m) el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
      setMeta('meta[name="twitter:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[property="og:url"]', 'content', fullUrl);
    setMeta('link[rel="canonical"]', 'href', fullUrl);
  }, [title, description, path]);
};

const Eyebrow = ({ children }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur">
    <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_10px_#22D3EE]" />
    <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#CBD5E1]">{children}</span>
  </div>
);

const SERVERS = [
  {
    key: 'live',
    category: 'Live production engine',
    name: 'Quesen HTTP API',
    url: 'https://web-production-aa5ba.up.railway.app',
    tag: 'HTTPS · REST + OpenAPI',
    detail: 'The sovereign engine, live at all times. Every /validate response carries input_snapshot_hash + commit_sha (v1.10.0-rc1). Deterministic PROCEED / REVIEW / SKIP verdicts.',
    icon: <Server size={18} />,
    testId: 'servers-card-live-http',
  },
  {
    key: 'mcp',
    category: 'Live production engine',
    name: 'Quesen MCP server',
    url: 'https://web-production-aa5ba.up.railway.app/mcp',
    tag: 'MCP · streamable-HTTP',
    detail: 'Five tools exposed: validate, simulate, report, health, version. Speaks the Model Context Protocol natively, works with any MCP-compatible agent runtime.',
    icon: <Terminal size={18} />,
    testId: 'servers-card-live-mcp',
  },
  {
    key: 'smithery',
    category: 'MCP registries',
    name: 'Smithery',
    url: 'https://smithery.ai/servers/@shinque03/Quesen',
    tag: 'One-liner install',
    detail: 'Listed as @shinque03/Quesen with all 5 tools indexed and iconUrl set. Install in any MCP client with npx -y @smithery/cli mcp add shinque03/Quesen.',
    icon: <Package size={18} />,
    testId: 'servers-card-smithery',
  },
  {
    key: 'glama',
    category: 'MCP registries',
    name: 'Glama.ai',
    url: 'https://glama.ai/mcp/servers',
    tag: 'glama.json shipped',
    detail: 'Repository manifest live at github.com/Shxnque/quesen/blob/main/glama.json. Glama auto-indexes the repo and any operator-added Connector at glama.ai/mcp/connectors.',
    icon: <Layers size={18} />,
    testId: 'servers-card-glama',
  },
  {
    key: 'huggingface',
    category: 'Discovery surfaces',
    name: 'HuggingFace Space',
    url: 'https://huggingface.co/spaces/Qushxn/quesen-mcp',
    tag: 'Static Space',
    detail: 'Qushxn/quesen-mcp Space with the full API surface, install snippets, and receipt-provenance replay recipe. Tagged for discovery across mcp, agent-safety, deterministic, langchain, crewai, autogen, and a2a.',
    icon: <Globe size={18} />,
    testId: 'servers-card-huggingface',
  },
  {
    key: 'awesome-mcp',
    category: 'Discovery surfaces',
    name: 'Awesome MCP Servers',
    url: 'https://github.com/punkpeye/awesome-mcp-servers/pull/10402',
    tag: 'PR open',
    detail: 'Pull request 10402 open on punkpeye/awesome-mcp-servers proposing Quesen under Finance & Fintech. Merge routes ingestion into the Glama pipeline automatically.',
    icon: <Zap size={18} />,
    testId: 'servers-card-awesome-mcp',
  },
  {
    key: 'rapidapi',
    category: 'REST-API marketplaces',
    name: 'RapidAPI Hub',
    url: 'https://github.com/Shxnque/quesen/blob/main/docs/publishing-rapidapi.md',
    tag: 'Publishing prepared',
    detail: 'RapidAPI onboarding pack ready with provider metadata, endpoint list, and pricing plans pre-filled against v1.10.0-rc1. Operator submission at provider.rapidapi.com.',
    icon: <Package size={18} />,
    testId: 'servers-card-rapidapi',
  },
];

const SDKS = [
  { name: 'quesen-sdk (Python)', version: 'v0.4.1', install: 'pip install quesen-sdk', repo: 'https://github.com/Shxnque/quesen-sdk-py', registry: 'https://pypi.org/project/quesen-sdk/', registryLabel: 'PyPI', testId: 'servers-sdk-python' },
  { name: 'quesen-sdk (TypeScript / JS)', version: 'v0.4.0', install: 'npm i quesen-sdk', repo: 'https://github.com/Shxnque/quesen-sdk-js', registry: 'https://www.npmjs.com/package/quesen-sdk', registryLabel: 'npm', testId: 'servers-sdk-js' },
  { name: 'quesen-langchain', version: 'v0.3.0', install: 'pip install quesen-langchain', repo: 'https://github.com/Shxnque/quesen-langchain', registry: 'https://pypi.org/project/quesen-langchain/', registryLabel: 'PyPI', testId: 'servers-sdk-langchain' },
  { name: 'quesen-crewai', version: 'v0.3.0', install: 'pip install quesen-crewai', repo: 'https://github.com/Shxnque/quesen-crewai', registry: 'https://pypi.org/project/quesen-crewai/', registryLabel: 'PyPI', testId: 'servers-sdk-crewai' },
  { name: 'quesen-autogen', version: 'v0.3.0', install: 'pip install quesen-autogen', repo: 'https://github.com/Shxnque/quesen-autogen', registry: 'https://pypi.org/project/quesen-autogen/', registryLabel: 'PyPI', testId: 'servers-sdk-autogen' },
];

const grouped = SERVERS.reduce((acc, s) => {
  (acc[s.category] = acc[s.category] || []).push(s);
  return acc;
}, {});

export default function QuesenServersPage() {
  useSEO({
    title: 'Quesen Servers & Distribution, Senueren',
    description: 'Every live endpoint, MCP registry, marketplace and SDK for Quesen v1.10.0-rc1. Deterministic risk-verdict engine for autonomous agents, built and maintained by Senueren.',
    path: '/quesen/servers',
  });

  return (
    <div className="min-h-screen bg-[#0A0E17]">
      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-14 md:pb-20 px-6 md:px-12 overflow-hidden">
        <div className="aurora-glow" aria-hidden="true" />
        <div className="max-w-6xl mx-auto relative z-10">
          <Eyebrow>Quesen · Distribution</Eyebrow>
          <h1 className="mt-7 text-4xl sm:text-5xl lg:text-6xl font-bold text-white font-['Outfit'] leading-[1.02] tracking-tight max-w-4xl">
            Where Quesen lives.
          </h1>
          <p className="mt-6 text-[15px] md:text-lg text-[#94A3B8] leading-relaxed max-w-2xl">
            The complete map of Quesen production endpoints, MCP registries,
            discovery surfaces, and language SDKs, all currently tracking
            engine tag <code className="text-[#22D3EE] bg-white/[0.03] px-2 py-0.5 rounded text-sm">v1.10.0-rc1</code>.
            Deterministic risk verdicts. Same input in, same PROCEED / REVIEW
            / SKIP out. No LLM in the loop.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/quesen"
              data-testid="servers-cta-read-quesen"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_36px_rgba(34,211,238,0.35)] transition-shadow duration-500"
            >
              Read Quesen <ArrowRight size={15} />
            </Link>
            <a
              href="https://github.com/Shxnque/quesen"
              target="_blank"
              rel="noreferrer"
              data-testid="servers-cta-source"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#E2E8F0] border border-white/10 hover:border-[#22D3EE]/40 hover:text-white transition-colors duration-500"
            >
              Public source <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORISED SERVER CARDS */}
      <section className="py-8 md:py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-16">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="mb-6">
                <div className="accent-bar w-12 mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-white font-['Outfit'] tracking-tight">
                  {category}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    data-testid={s.testId}
                    className="group block bg-[#0F1419] border border-[#1A2332] rounded-2xl p-6 hover:border-[#22D3EE]/40 transition-colors duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-lg bg-[#0A0E17] border border-[#1A2332] flex items-center justify-center text-[#22D3EE]">
                        {s.icon}
                      </div>
                      <span className="text-[10px] tracking-[0.16em] uppercase text-[#64748B] mt-1">
                        {s.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 font-['Outfit'] flex items-center gap-2">
                      {s.name}
                      <ExternalLink size={13} className="text-[#64748B] group-hover:text-[#22D3EE] transition-colors" />
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed">{s.detail}</p>
                    <p className="mt-4 text-[11px] font-mono text-[#22D3EE]/80 break-all">{s.url}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SDKs */}
      <section className="py-16 md:py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="accent-bar w-12 mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white font-['Outfit'] tracking-tight">
              Official SDKs
            </h2>
            <p className="text-sm text-[#94A3B8] mt-3 max-w-2xl">
              Every SDK exposes <code className="text-[#22D3EE]">input_snapshot_hash</code> and{' '}
              <code className="text-[#22D3EE]">commit_sha</code> as typed fields on{' '}
              <code className="text-[#22D3EE]">ValidateResult</code>. Backwards compatible against pre-v1.10 engines.
            </p>
          </div>
          <div className="space-y-3">
            {SDKS.map((sdk) => (
              <div
                key={sdk.name}
                data-testid={sdk.testId}
                className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_260px_auto] gap-4 items-center bg-[#0F1419] border border-[#1A2332] rounded-xl px-5 py-4 hover:border-[#22D3EE]/30 transition-colors"
              >
                <div>
                  <span className="text-white font-semibold">{sdk.name}</span>
                  <span className="ml-3 text-[10px] tracking-[0.14em] uppercase text-[#22D3EE]">{sdk.version}</span>
                </div>
                <code className="text-xs font-mono text-[#94A3B8] bg-[#050B1A] px-3 py-1.5 rounded">{sdk.install}</code>
                <div className="inline-flex items-center gap-4 justify-self-start md:justify-self-end">
                  {sdk.registry && (
                    <a
                      href={sdk.registry}
                      target="_blank"
                      rel="noreferrer"
                      data-testid={`${sdk.testId}-registry`}
                      className="text-sm text-[#34D399] hover:underline inline-flex items-center gap-1.5"
                    >
                      {sdk.registryLabel} <ExternalLink size={12} />
                    </a>
                  )}
                  <a
                    href={sdk.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#22D3EE] hover:underline inline-flex items-center gap-1.5"
                  >
                    Source <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-['Outfit'] mb-4">
            Point Quesen at your stack.
          </h2>
          <p className="text-[#94A3B8] mb-8 max-w-xl mx-auto">
            Tell us the agent stack you&rsquo;re running and the risk axis
            you&rsquo;re gating. We&rsquo;ll respond within one working day
            with an API key, a scoped starter plan, and a direct line to
            engineering.
          </p>
          <Link
            to="/contact"
            data-testid="servers-cta-get-key"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#050B1A] bg-gradient-to-r from-[#22D3EE] to-[#34D399] hover:shadow-[0_0_36px_rgba(34,211,238,0.35)] transition-shadow duration-500"
          >
            Request an API key <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
