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

const AA5BA = "https://web-production-aa5ba.up.railway.app";

// Shared, verifiable install / distribution block (crawlable text).
const distBlock = `
  <h2>Install Quesen</h2>
  <pre><code>pip install quesen-sdk        # Python
npm i quesen-sdk              # JavaScript / TypeScript
pip install quesen-langchain  # LangChain
pip install quesen-crewai     # CrewAI
pip install quesen-autogen    # AutoGen</code></pre>
  <p>Free sandbox key (no signup, no card): <code>curl -X POST ${AA5BA}/sandbox/keys</code></p>
  <ul>
    <li><a href="https://pypi.org/project/quesen-sdk/">Quesen SDK on PyPI</a></li>
    <li><a href="https://www.npmjs.com/package/quesen-sdk">Quesen SDK on npm</a></li>
    <li><a href="https://github.com/Shxnque/quesen">Quesen developer portal (docs, spec, fixtures)</a></li>
    <li><a href="${AA5BA}/mcp">MCP endpoint (Streamable HTTP)</a> · <a href="${AA5BA}/openapi.json">OpenAPI 3.1</a> · <a href="${AA5BA}/health">Health</a></li>
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
      <pre><code>curl -X POST ${AA5BA}/sandbox/keys</code></pre>
      <p>Then send a typed security context to <code>POST ${AA5BA}/tsc/validate</code> with header <code>X-API-Key: sk_sandbox_...</code> and gate your agent on the returned PASS/REVIEW/BLOCK/SKIP decision.</p>` + distBlock,
  },
  "evidence": {
    title: "Quesen Evidence — Live Production Verification",
    description: "Independently verifiable evidence for Quesen: live production engine, deterministic BLOCK/PASS behaviour, published SDKs on PyPI and npm, native MCP endpoint and OpenAPI. No customer traction, pilots or revenue are claimed.",
    canonical: `${ORIGIN}/evidence`,
    body: `
      <h1>Evidence you can verify yourself.</h1>
      <p>Every claim here is traceable to a live endpoint, a package registry or a public repository. We do not claim customer traction, pilots or revenue.</p>
      <ul>
        <li>Live engine: <a href="${AA5BA}/health">/health</a> and <a href="${AA5BA}/version">/version</a> report the current engine version.</li>
        <li>Deterministic behaviour: secret egress to an untrusted destination returns <code>BLOCK</code> (<code>EGRESS_SECRET_UNTRUSTED</code>); benign public egress returns <code>PASS</code>.</li>
        <li>Published, installable SDKs on <a href="https://pypi.org/project/quesen-sdk/">PyPI</a> and <a href="https://www.npmjs.com/package/quesen-sdk">npm</a>.</li>
        <li>Native MCP interface at <a href="${AA5BA}/mcp">/mcp</a> and OpenAPI 3.1 at <a href="${AA5BA}/openapi.json">/openapi.json</a>.</li>
        <li>Public standards engagement: a crosswalk mapping Quesen onto the <a href="https://github.com/aeoess/agent-governance-vocabulary/pull/151">Agent Governance Vocabulary (PR #151)</a>, plus contributions to <a href="https://github.com/Universal-Commerce-Protocol/ucp/discussions/724">UCP #724</a> and <a href="https://github.com/modelcontextprotocol/modelcontextprotocol/discussions/2498">MCP #2498</a>.</li>
        <li>Reproducible cross-domain lifecycle test vectors (PRESERVED / RECOVERED / DEGRADED / MISSING / MUTATED) with live receipts, published at <a href="https://github.com/Shxnque/quesen/blob/main/evaluation/UCP724-LIFECYCLE-VECTORS.md">evaluation/UCP724-LIFECYCLE-VECTORS.md</a>.</li>
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
      <p>Autonomous agents cannot delegate action-authority to a system they cannot audit. A deterministic decision — same input, same verdict, no model in the scoring path — is reproducible in isolation and replayable after the fact. That is the trust primitive the autonomous economy needs. <a href="/quesen">See Quesen.</a></p>`,
  },
  "shinren": { title: "Shinren — Protocol Intelligence & Security Research | Senueren", description: "Shinren is Senueren's discipline-first security research infrastructure for on-chain autonomous systems. Evidence-gated findings pipeline.", canonical: `${ORIGIN}/shinren`, body: `<h1>Shinren — protocol intelligence system.</h1><p>Discipline-first security research infrastructure for on-chain autonomous systems. Every finding is evidence-gated before it reaches a customer.</p>` },
  "qarsar": { title: "Qarsar — Strategic Intelligence System | Senueren", description: "Qarsar is Senueren's autonomous discovery and execution infrastructure for on-chain economic opportunities, built on an evidence-first hypothesis lifecycle with deterministic promotion gates.", canonical: `${ORIGIN}/qarsar`, body: `<h1>Qarsar — strategic intelligence system.</h1><p>Autonomous discovery and execution infrastructure for on-chain economic opportunities. Evidence-first hypothesis lifecycle with deterministic promotion gates.</p>` },
  "diosen": { title: "Diosen — Quantitative Intelligence System | Senueren", description: "Diosen is Senueren's institutional-grade quantitative intelligence system: research, simulation and decision-support flowing through a progressive validation lifecycle.", canonical: `${ORIGIN}/diosen`, body: `<h1>Diosen — quantitative intelligence system.</h1><p>Institutional-grade quantitative intelligence. Research, simulation and decision-support flowing through a progressive validation lifecycle.</p>` },
  "legacy": { title: "Legacy Infrastructure — Sites & Platforms for Founders | Senueren", description: "Senueren designs and builds bespoke legacy infrastructure — sites and platforms for founders, brands and operators — built and maintained end to end.", canonical: `${ORIGIN}/legacy`, body: `<h1>Legacy infrastructure.</h1><p>Bespoke sites and platforms for founders, brands and operators, designed and built end to end by the same team.</p>` },
  "about": { title: "About Senueren — Cape Town Sovereign Systems Studio", description: "Senueren is a small, hands-on studio based in Cape Town, South Africa, building deterministic infrastructure for the autonomous economy and bespoke platforms for founders.", canonical: `${ORIGIN}/about`, body: `<h1>About Senueren.</h1><p>A small, hands-on sovereign-systems studio based in Cape Town, South Africa. We build deterministic infrastructure for the autonomous economy, and bespoke platforms for founders and brands.</p>` },
  "contact": { title: "Contact Senueren", description: "Get in touch with Senueren for Quesen enterprise access, integrations and legacy-infrastructure engagements.", canonical: `${ORIGIN}/contact`, body: `<h1>Contact Senueren.</h1><p>Reach out about Quesen enterprise access, integrations, or a legacy-infrastructure engagement.</p>` },
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
