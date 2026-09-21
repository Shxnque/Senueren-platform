// scripts/prerender.mjs
// Real prerender for GitHub Pages SPA. Replaces the previous "copy index.html"
// step. For each route we:
//   1. Set a route-specific <title>, meta description, canonical + OG tags.
//   2. Inject a crawlable static HTML representation INSIDE <div id="root"> so
//      non-JS crawlers and LLM retrieval systems see real content and correct
//      per-page metadata.
// Safe by construction: src/index.js uses ReactDOM.createRoot(...).render(),
// which REPLACES the container's children on mount — so the injected markup is
// discarded for real browsers (no hydration mismatch) and only ever seen by
// crawlers / no-JS clients.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD = process.env.PRERENDER_BUILD_DIR || join(__dirname, "..", "build");
const ORIGIN = "https://senueren.co.za";
const OG_IMAGE = `${ORIGIN}/logo-full.png`;

// Quesen production API base (Railway). Named plainly to avoid confusion with the
// decommissioned aa5ba host — value is the CURRENT live 3df26 deployment.
const API_BASE = "https://web-production-3df26.up.railway.app";

// Shared, verifiable install / distribution block (crawlable text).
const distBlock = `
  <h2>Install Quesen</h2>
  <pre><code>pip install quesen-sdk        # Python
npm i quesen-sdk              # JavaScript / TypeScript
pip install quesen-langchain  # LangChain
pip install quesen-crewai     # CrewAI
pip install quesen-autogen    # AutoGen</code></pre>
  <p>Free sandbox key (no signup, no card): <code>curl -X POST ${API_BASE}/sandbox/keys</code></p>
  <ul>
    <li><a href="https://pypi.org/project/quesen-sdk/">Quesen SDK on PyPI</a></li>
    <li><a href="https://www.npmjs.com/package/quesen-sdk">Quesen SDK on npm</a></li>
    <li><a href="https://github.com/Shxnque/quesen">Quesen developer portal (docs, spec, fixtures)</a></li>
    <li><a href="${API_BASE}/mcp">MCP endpoint (Streamable HTTP)</a> · <a href="${API_BASE}/openapi.json">OpenAPI 3.1</a> · <a href="${API_BASE}/health">Health</a></li>
  </ul>`;

const routes = {
  "": {
    title: "Senueren — Sovereign Systems & Legacy Infrastructure",
    description: "Senueren is a Cape Town studio building deterministic infrastructure for the autonomous economy: Quesen (agent risk decisions), Shinren, Qarsar, Diosen — plus bespoke legacy infrastructure for founders and brands.",
    canonical: `${ORIGIN}/`,
    body: `
      <h1>Deterministic infrastructure for the autonomous economy.</h1>
      <p>Senueren is a Cape Town studio. On the sovereign-systems side we build <a href="/quesen">Quesen</a> (deterministic risk decisions for autonomous agents), <a href="/shinren">Shinren</a>, <a href="/qarsar">Qarsar</a> and <a href="/diosen">Diosen</a>. On the legacy-infrastructure side we design and build bespoke sites and platforms for founders and brands — same team, end to end.</p>
      <p>Same input, same decision. Same evidence, same conclusion.</p>
      <ul>
        <li><a href="/quesen">Quesen — the deterministic decision layer</a></li>
        <li><a href="/try">Try Quesen free (sandbox key)</a></li>
        <li><a href="/evidence">Evidence & live production verification</a></li>
        <li><a href="/quesen/servers">Distribution, SDKs & MCP servers</a></li>
      </ul>` + distBlock,
  },
  "quesen": {
    title: "Quesen — Deterministic AI Decision Engine & Agent Firewall",
    description: "Quesen is the deterministic AI decision engine for autonomous-agent risk evaluation. A typed security context in → PASS/REVIEW/BLOCK/SKIP out, with reason codes and replayable receipts. No LLM in the scoring path. Native MCP server + SDKs.",
    canonical: `${ORIGIN}/quesen`,
    body: `
      <h1>Quesen — the deterministic decision layer for autonomous agents.</h1>
      <p>Quesen answers one question before every high-risk agent action: <em>should this proceed?</em> You describe the attempted operation as a <strong>typed security context</strong> — subject, action, target, tool (requested vs granted scopes), data classes + egress destination, and provenance — and a deterministic checker returns <strong>PASS / REVIEW / BLOCK / SKIP</strong> with reason codes and a replayable receipt (SHA-256 over the canonical input + the pinned ruleset commit). No model inference in the decision path, so the same input always yields the same verdict.</p>
      <p>Canonical example: an agent tricked into POSTing a secret to an untrusted endpoint returns <code>BLOCK</code> (<code>EGRESS_SECRET_UNTRUSTED</code>); a benign public egress returns <code>PASS</code>. An unattested client-asserted payment grant returns <code>REVIEW</code> (<code>UNVERIFIED_GRANT</code>).</p>
      <p>Works over direct HTTP (<code>POST /validate</code>, <code>POST /tsc/validate</code>), as a native MCP server, and via official SDKs for Python, TypeScript, LangChain, CrewAI and AutoGen.</p>` + distBlock,
  },
  "try": {
    title: "Try Quesen — Free Sandbox Key, No Signup",
    description: "Get a free Quesen sandbox key with one HTTP call — no signup, email or card. 1000 starter credits. Run the deterministic agent firewall in under a minute.",
    canonical: `${ORIGIN}/try`,
    body: `
      <h1>Try Quesen free.</h1>
      <p>Self-serve, instant, no signup. One call returns a sandbox key with 1000 starter credits:</p>
      <pre><code>curl -X POST ${API_BASE}/sandbox/keys</code></pre>
      <p>Then send a typed security context to <code>POST ${API_BASE}/tsc/validate</code> with header <code>X-API-Key: sk_sandbox_...</code> and gate your agent on the returned PASS/REVIEW/BLOCK/SKIP decision.</p>` + distBlock,
  },
  "services": {
    title: "Services — Agent Surface Review & Deterministic Governance | Senueren",
    description: "Senueren's Agent Surface Review: a fixed-scope 48–72h security review of your MCP server or AI-agent tool boundary — authorization, confused-deputy, secret exposure, SSRF, tool poisoning, authorization-vs-execution mismatch — with a concrete remediation report and, where it fits, a deterministic Quesen policy recommendation. From R2,500.",
    canonical: `${ORIGIN}/services`,
    body: `
      <h1>Agent Surface Review — find where your agent can be made to act wrongly.</h1>
      <p>MCP servers, tools and autonomous agents ship faster than anyone reviews them. Senueren's Agent Surface Review is a bounded, fixed-price review of your agent's tool boundary — the gap between what a message says and what your agent is allowed to do.</p>
      <p>Fixed checklist: MCP tool authorization, confused-deputy, privilege escalation, secret exposure, token passthrough, SSRF, tool poisoning / malicious tool descriptions, excessive permissions, cross-agent authority, unsafe filesystem access, command execution, data exfiltration, missing auditability, replayability, and authorization-vs-execution mismatch.</p>
      <p>Engagements: Focused Review (one MCP server / boundary, 48h, from R2,500); Agent Surface Review (agent + tools + auth seam, 72h, from R6,000); Extended / multi-agent (custom). Consent-first — authorized scope only. Findings are evidence-first with reproductions, and where deterministic policy enforcement fits we recommend <a href="/quesen">Quesen</a>. Proof of our engineering: <a href="/evidence">verified external work</a>.</p>` + distBlock,
    jsonld: [{
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI agent & MCP server security review",
      "name": "Senueren Agent Surface Review",
      "provider": { "@type": "Organization", "name": "Senueren", "url": `${ORIGIN}/` },
      "areaServed": "Worldwide",
      "url": `${ORIGIN}/services`,
      "description": "Fixed-scope 48-72h security review of an MCP server or AI-agent tool boundary: authorization, confused-deputy, privilege escalation, secret exposure, token passthrough, SSRF, tool poisoning, excessive permissions, cross-agent authority, command execution, data exfiltration, auditability, replayability and authorization-vs-execution mismatch, with a concrete remediation report.",
      "offers": [
        { "@type": "Offer", "name": "Focused Review (48h)", "price": "2500", "priceCurrency": "ZAR", "description": "One MCP server / tool boundary." },
        { "@type": "Offer", "name": "Agent Surface Review (72h)", "price": "6000", "priceCurrency": "ZAR", "description": "Agent + tools + auth seam." }
      ]
    }],
  },
  "evidence": {
    title: "Quesen Evidence — Independently Verifiable Production Proof",
    description: "Independently verifiable evidence for Quesen: live production engine (/health, /version), deterministic BLOCK/PASS behaviour, recomputable receipts (input_snapshot_hash + commit_sha), published SDKs on PyPI and npm, native MCP endpoint, OpenAPI 3.1, and public standards engagement. No customer traction, pilots or revenue are claimed.",
    canonical: `${ORIGIN}/evidence`,
    body: `
      <h1>Evidence you can verify yourself.</h1>
      <p>Every claim on this page resolves to a live endpoint, a package registry, or a public repository you can open right now. We deliberately do <strong>not</strong> claim customer traction, pilots, or revenue — only what is independently checkable. Quesen's thesis is deterministic authorization and independently recomputable evidence for consequential autonomous actions.</p>
      <h2>Live production engine</h2>
      <ul>
        <li>Health &amp; version: <a href="${API_BASE}/health">/health</a> and <a href="${API_BASE}/version">/version</a> report the current engine version and configuration.</li>
        <li>Deterministic decision: a high-risk input returns <code>SKIP</code>/<code>BLOCK</code> with named conflict rules; the same input always yields the same verdict (no LLM in the scoring path).</li>
        <li>Recomputable receipt: every <code>/validate</code> response embeds <code>input_snapshot_hash</code> (SHA-256 over the canonical request) and <code>commit_sha</code> (the exact ruleset commit), so any decision is replayable byte-for-byte offline.</li>
        <li>Secret-egress firewall: a secret POSTed to an untrusted destination returns <code>BLOCK</code> (<code>EGRESS_SECRET_UNTRUSTED</code>); a benign public egress returns <code>PASS</code>.</li>
      </ul>
      <h2>Published, installable distribution</h2>
      <ul>
        <li>Python + framework SDKs on <a href="https://pypi.org/project/quesen-sdk/">PyPI</a> (<code>quesen-sdk</code>, <code>quesen-langchain</code>, <code>quesen-crewai</code>, <code>quesen-autogen</code>) and JavaScript/TypeScript on <a href="https://www.npmjs.com/package/quesen-sdk">npm</a>.</li>
        <li>Native MCP interface at <a href="${API_BASE}/mcp">/mcp</a> (Streamable HTTP) and OpenAPI 3.1 at <a href="${API_BASE}/openapi.json">/openapi.json</a>.</li>
        <li>Developer portal, spec and conformance fixtures: <a href="https://github.com/Shxnque/quesen">github.com/Shxnque/quesen</a>.</li>
      </ul>
      <h2>Public standards &amp; ecosystem engagement</h2>
      <ul>
        <li>Agent Governance Vocabulary crosswalk: <a href="https://github.com/aeoess/agent-governance-vocabulary/pull/151">PR #151</a>.</li>
        <li>Universal Commerce Protocol: <a href="https://github.com/Universal-Commerce-Protocol/ucp/discussions/724">UCP #724</a>. Model Context Protocol: <a href="https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498">MCP #2498</a>.</li>
        <li>Reproducible cross-domain lifecycle vectors (PRESERVED / RECOVERED / DEGRADED / MISSING / MUTATED) with live receipts: <a href="https://github.com/Shxnque/quesen/blob/main/evaluation/UCP724-LIFECYCLE-VECTORS.md">evaluation/UCP724-LIFECYCLE-VECTORS.md</a>.</li>
        <li>Merged upstream contributions include <a href="https://github.com/dheerajjha/mcp-migrate/pull/246">mcp-migrate #246</a> and <a href="https://github.com/agentguard-ai/tealtiger/pull/453">tealtiger #453</a>.</li>
      </ul>` + distBlock,
  },
  "quesen/servers": {
    title: "Quesen Distribution — SDKs, Packages & MCP Servers",
    description: "Where Quesen is published and callable: Python + TypeScript SDKs, LangChain / CrewAI / AutoGen integrations on PyPI and npm, and a native MCP server. Discover, install, create a sandbox key, run the firewall.",
    canonical: `${ORIGIN}/quesen/servers`,
    body: `<h1>Quesen distribution & servers.</h1>
      <p>Discover → install → create a sandbox key → run the firewall → receive a deterministic decision.</p>` + distBlock,
  },
  "why": {
    title: "Why Deterministic Trust Matters — Senueren",
    description: "Autonomous agents cannot delegate action-authority to a system they cannot audit. Why deterministic, reproducible, provenance-aware decisions are the right trust primitive for the autonomous economy.",
    canonical: `${ORIGIN}/why`,
    body: `<h1>Why deterministic trust matters.</h1>
      <p>Autonomous agents increasingly take consequential actions — moving money, calling privileged tools, touching sensitive data. You cannot delegate action-authority to a system you cannot audit. A deterministic decision — same input, same verdict, no model in the scoring path — is reproducible in isolation and replayable after the fact.</p>
      <p>That is the trust primitive the autonomous economy needs: not another probabilistic guardrail, but an independently recomputable authorization boundary with reason codes and a signed, replayable receipt. Quesen answers <em>should this action proceed?</em> with <strong>PASS / REVIEW / BLOCK / SKIP</strong> before execution.</p>
      <ul>
        <li><a href="/quesen">Quesen — the deterministic decision layer</a></li>
        <li><a href="/evidence">Evidence you can verify yourself</a></li>
        <li><a href="/try">Try Quesen free (sandbox key)</a></li>
      </ul>` + distBlock,
  },
  "shinren": {
    title: "Shinren — Protocol Intelligence & Security Research | Senueren",
    description: "Shinren is Senueren's discipline-first security-research system for autonomous and on-chain systems: authorized, evidence-gated findings with responsible disclosure — never speculative.",
    canonical: `${ORIGIN}/shinren`,
    body: `<h1>Shinren — protocol intelligence &amp; security research.</h1>
      <p>Shinren is Senueren's discipline-first security-research system for autonomous, MCP and on-chain infrastructure. It investigates real systems under authorized or public scope, and every finding must survive a hostile quality gate — technical correctness, scope, impact, severity, reproduction and responsible-disclosure correctness — before it reaches a maintainer or a customer.</p>
      <p>Findings feed a defensible credibility loop: research → verified finding → responsible disclosure → maintainer relationship → (where the architecture genuinely fits) a <a href="/quesen">Quesen</a> deterministic-governance conversation. No manufactured vulnerabilities, no unauthorized testing, no spam. Evidence decides.</p>
      <ul>
        <li><a href="/quesen">How Quesen governs consequential actions</a></li>
        <li><a href="/evidence">Verifiable engineering evidence</a></li>
        <li><a href="/contact">Engage Shinren</a></li>
      </ul>`,
  },
  "qarsar": {
    title: "Qarsar — Strategic On-Chain Intelligence System | Senueren",
    description: "Qarsar is Senueren's autonomous discovery-and-execution system for on-chain economic opportunities, built on an evidence-first hypothesis lifecycle with deterministic promotion gates.",
    canonical: `${ORIGIN}/qarsar`,
    body: `<h1>Qarsar — strategic intelligence system.</h1>
      <p>Qarsar is Senueren's autonomous discovery-and-execution infrastructure for on-chain economic opportunities. Every candidate moves through an evidence-first hypothesis lifecycle — observed, back-tested, validated — with deterministic promotion gates, so nothing reaches execution on a hunch.</p>
      <p>Qarsar shares the Senueren spine: the same reproducibility and evidence discipline that powers <a href="/quesen">Quesen</a>'s decision layer governs which strategies are allowed to act.</p>
      <ul>
        <li><a href="/why">Why deterministic trust matters</a></li>
        <li><a href="/evidence">Evidence &amp; verification</a></li>
      </ul>`,
  },
  "diosen": {
    title: "Diosen — Quantitative Intelligence System | Senueren",
    description: "Diosen is Senueren's institutional-grade quantitative intelligence system: research, simulation and decision-support flowing through a progressive validation lifecycle with pre-registered thresholds.",
    canonical: `${ORIGIN}/diosen`,
    body: `<h1>Diosen — quantitative intelligence system.</h1>
      <p>Diosen is Senueren's institutional-grade quantitative intelligence system. Research, simulation and decision-support flow through a progressive validation lifecycle with pre-registered thresholds and statistical confidence — the same evidence-over-opinion culture that governs every Senueren system.</p>
      <p>Diosen consumes market and research data and produces decision-support; it does not act without passing its promotion gates. It is a sibling to <a href="/qarsar">Qarsar</a> and shares the <a href="/quesen">Quesen</a> discipline of reproducible, auditable conclusions.</p>
      <ul>
        <li><a href="/why">The deterministic-trust thesis</a></li>
        <li><a href="/about">About Senueren</a></li>
      </ul>`,
  },
  "legacy": {
    title: "Legacy Infrastructure — Bespoke Sites & Platforms for Founders | Senueren",
    description: "Senueren designs and builds bespoke legacy infrastructure — production websites and platforms for founders, brands and operators — architected, built and maintained end to end by the same team.",
    canonical: `${ORIGIN}/legacy`,
    body: `<h1>Legacy infrastructure — sites &amp; platforms, built end to end.</h1>
      <p>Alongside the sovereign systems, Senueren designs and builds bespoke production infrastructure for founders, brands and operators: marketing sites, web platforms and internal tools — architected, engineered, deployed and maintained by the same small team that ships our own systems.</p>
      <p>Same engineering discipline, same evidence-first culture, applied to your product. If you need a platform built properly rather than assembled from templates, <a href="/contact">start a conversation</a>.</p>
      <ul>
        <li><a href="/about">About the studio</a></li>
        <li><a href="/contact">Start a project</a></li>
      </ul>`,
  },
  "about": {
    title: "About Senueren — Cape Town Sovereign-Systems Studio",
    description: "Senueren is a small, hands-on studio in Cape Town, South Africa building deterministic infrastructure for the autonomous economy — Quesen, Shinren, Qarsar, Diosen — and bespoke platforms for founders.",
    canonical: `${ORIGIN}/about`,
    body: `<h1>About Senueren.</h1>
      <p>Senueren is a small, hands-on sovereign-systems studio based in Cape Town, South Africa. We build deterministic infrastructure for the autonomous economy — <a href="/quesen">Quesen</a> (agent decision layer), <a href="/shinren">Shinren</a> (security research), <a href="/qarsar">Qarsar</a> (on-chain intelligence) and <a href="/diosen">Diosen</a> (quantitative intelligence) — and, on the legacy-infrastructure side, bespoke <a href="/legacy">sites and platforms</a> for founders and brands.</p>
      <p>Our institutional culture is fixed: evidence over assumptions, data over opinions, reproducibility, honest retirement of weak ideas, and no popularity-as-evidence. Same team, end to end.</p>
      <ul>
        <li><a href="/why">Why deterministic trust matters</a></li>
        <li><a href="/evidence">What we can prove today</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>`,
  },
  "contact": {
    title: "Contact Senueren — Quesen Access, Integrations & Engagements",
    description: "Contact Senueren for Quesen sandbox/enterprise access, agent-governance integrations, Shinren security research, or a legacy-infrastructure engagement. Cape Town, South Africa.",
    canonical: `${ORIGIN}/contact`,
    body: `<h1>Contact Senueren.</h1>
      <p>Reach out about <a href="/quesen">Quesen</a> access (start free with a <a href="/try">sandbox key</a>), agent-governance integrations, <a href="/shinren">Shinren</a> security-research engagements, or a <a href="/legacy">legacy-infrastructure</a> project. We are a small Cape Town team and reply directly.</p>
      <ul>
        <li><a href="/quesen">Quesen — deterministic decision layer</a></li>
        <li><a href="/evidence">Evidence &amp; verification</a></li>
      </ul>`,
  },
};

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function apply(template, cfg) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(cfg.title)}</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${esc(cfg.description)}" />`);
  html = html.replace(/<link rel="canonical" href="[\s\S]*?"\s*\/>/, `<link rel="canonical" href="${cfg.canonical}" />`);
  html = html.replace(/<meta property="og:title" content="[\s\S]*?"\s*\/>/, `<meta property="og:title" content="${esc(cfg.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[\s\S]*?"\s*\/>/, `<meta property="og:description" content="${esc(cfg.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[\s\S]*?"\s*\/>/, `<meta property="og:url" content="${cfg.canonical}" />`);
  html = html.replace(/<meta name="twitter:title" content="[\s\S]*?"\s*\/>/, `<meta name="twitter:title" content="${esc(cfg.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[\s\S]*?"\s*\/>/, `<meta name="twitter:description" content="${esc(cfg.description)}" />`);
  // JSON-LD structured data: WebPage + publisher Organization graph (rich indexing).
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": cfg.title,
    "description": cfg.description,
    "url": cfg.canonical,
    "inLanguage": "en",
    "isPartOf": { "@type": "WebSite", "name": "Senueren", "url": `${ORIGIN}/` },
    "publisher": {
      "@type": "Organization",
      "name": "Senueren",
      "url": `${ORIGIN}/`,
      "logo": OG_IMAGE,
      "foundingLocation": { "@type": "Place", "address": { "@type": "PostalAddress", "addressLocality": "Cape Town", "addressCountry": "ZA" } },
      "sameAs": ["https://github.com/Shxnque", "https://twitter.com/SenuerenGroup"]
    }
  };
  html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(ld)}</script>\n</head>`);
  // Optional route-specific structured data (e.g. Service on /services). Injected
  // post-build so it is never stripped by the HTML minifier (see craco.config.js).
  if (Array.isArray(cfg.jsonld)) {
    for (const block of cfg.jsonld) {
      html = html.replace("</head>", `  <script type="application/ld+json">${JSON.stringify(block)}</script>\n</head>`);
    }
  }
  // Inject crawlable content into the (empty) root container.
  const seo = `<div data-prerender="seo" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${cfg.body || ""}</div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${seo}</div>`);
  return html;
}

function writeRoute(route, html) {
  if (route === "") { writeFileSync(join(BUILD, "index.html"), html); return; }
  writeFileSync(join(BUILD, `${route}.html`), html);
  const dir = join(BUILD, route);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html);
}

const template = readFileSync(join(BUILD, "index.html"), "utf8");
let n = 0;
for (const [route, cfg] of Object.entries(routes)) { writeRoute(route, apply(template, cfg)); n++; }
console.log(`prerender: wrote ${n} routes into ${BUILD}`);
