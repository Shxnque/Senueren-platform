# SENUEREN PLATFORM — Technical Documentation

> **Read this first.** This document is the single source of truth for the entire Senueren platform codebase. If you are an AI agent, developer, or contributor — start here.

**Last Updated:** 16 April 2026  
**Version:** 2.1.0  
**Owner:** Quelum Wilson — Senueren (Pty) Ltd  
**Domain:** senueren.co.za  
**Status:** Production — Live on Render + GitHub Pages

---

## 1. WHAT THIS IS

Senueren is a systems and automation company based in Cape Town, South Africa. This repo contains:

1. **Marketing Website** — Company website for Senueren (React, deployed to GitHub Pages)
2. **SENRA Intelligence API** — Government tender procurement intelligence backend (FastAPI + PostgreSQL, deployed to Render)
3. **SENRA Frontend** — Live tender search, filter, and detail interface embedded in the website

The SENRA system scrapes SA government tenders from eTenders.gov.za, scores them using a 6-component weighted intelligence algorithm, and serves them via API. The frontend displays live data including tender details, required documentation per sector, contact information, and source links.

---

## 2. ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                        SENUEREN PLATFORM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  FRONTEND (GitHub Pages)           BACKEND (Render)             │
│  ┌───────────────────┐            ┌───────────────────────┐    │
│  │ React 19 + CRA    │  ───API──▶ │ FastAPI 0.110         │    │
│  │ Tailwind CSS      │            │ asyncpg               │    │
│  │ HashRouter        │            │ Background Scraper    │    │
│  │                   │            │ (every 30 min)        │    │
│  └───────────────────┘            └──────────┬────────────┘    │
│  URL: senueren.co.za                         │                  │
│  Fallback: shxnque.github.io/                │                  │
│       Senueren-platform                      ▼                  │
│                                   ┌───────────────────────┐    │
│                                   │ PostgreSQL 16         │    │
│                                   │ Render Free Tier      │    │
│                                   │ Frankfurt Region      │    │
│                                   └───────────────────────┘    │
│                                              ▲                  │
│  DATA SOURCE                                 │                  │
│  ┌───────────────────┐            scrapes    │                  │
│  │ eTenders.gov.za   │  ─────────────────────┘                  │
│  │ (National API)    │  PaginatedTenderOpportunities            │
│  └───────────────────┘  endpoint (JSON, 50/batch)               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Live URLs

| Service | URL | Status |
|---------|-----|--------|
| Frontend | `https://senueren.co.za` (pending DNS) | Deployed to gh-pages |
| Frontend Fallback | `https://shxnque.github.io/Senueren-platform` | Live |
| Backend API | `https://senueren-api.onrender.com/api` | Live |
| Render Dashboard | `https://dashboard.render.com/web/srv-d7ggtfurnols73ber7v0` | Active |
| GitHub Repo | `https://github.com/Shxnque/Senueren-platform` | Public |

---

## 3. TECH STACK

### Frontend
- **Framework:** React 19.0 with Create React App (via craco)
- **Styling:** Tailwind CSS 3.4 + custom CSS (App.css)
- **Routing:** react-router-dom 7.5 (HashRouter for GitHub Pages compatibility)
- **Icons:** lucide-react 0.507
- **Fonts:** Outfit (headings) + Manrope (body) — Google Fonts
- **UI Components:** Radix UI primitives (in components/ui/)
- **Build:** `craco build` → deployed to `gh-pages` branch
- **Hosting:** GitHub Pages with CNAME for custom domain

### Backend
- **Framework:** FastAPI 0.110.1
- **Database:** PostgreSQL 16 via asyncpg 0.29
- **HTTP Client:** requests (for eTenders API)
- **Server:** Uvicorn 0.25
- **Hosting:** Render.com (free tier, Frankfurt region)
- **Background Tasks:** asyncio.create_task (30-minute scrape cycle)

### Infrastructure
- **Render Service ID:** `srv-d7ggtfurnols73ber7v0`
- **Render DB ID:** `dpg-d7gh6f0sfn5c738of2q0-a`
- **DB Name:** `senueren_db`
- **DB User:** `senueren_user`
- **Auto-deploy:** Yes (triggers on push to `main`)
- **Root Dir:** `backend/` (Render reads from this)

---

## 4. FILE STRUCTURE

```
Senueren-platform/
├── README.md                    ← YOU ARE HERE
├── Procfile                     # Render process definition
├── render.yaml                  # Render infrastructure-as-code
│
├── backend/
│   ├── server.py                # ENTIRE backend — API + scraper + intelligence + DB
│   ├── requirements.txt         # Python deps (7 packages, lean)
│   └── .env                     # Local environment variables
│
├── frontend/
│   ├── public/
│   │   ├── index.html           # SEO-optimized HTML (structured data, OG tags)
│   │   ├── CNAME                # Custom domain: senueren.co.za
│   │   ├── logo-sm.png          # Optimized navbar logo
│   │   ├── senueren-logo-brand.png  # Full brand logo
│   │   └── *.png, *.jpg         # Other logo variants + hero image
│   ├── src/
│   │   ├── App.js               # ALL pages and components (single file)
│   │   ├── App.css              # Custom CSS (gradients, animations, card-glow)
│   │   ├── index.css            # Tailwind imports + global styles
│   │   └── components/ui/       # Radix UI component library
│   ├── package.json             # Dependencies + gh-pages deploy scripts
│   ├── tailwind.config.js       # Tailwind theme extensions
│   ├── craco.config.js          # CRA overrides (webpack aliases, visual edits)
│   └── .env                     # Frontend env (REACT_APP_BACKEND_URL)
│
└── .github/workflows/
    └── deploy.yml               # GitHub Actions (legacy, Pages now via gh-pages branch)
```

### Key: `backend/server.py`

This single file contains the entire backend:
- **Lines 1-50:** Imports, PostgreSQL connection pool
- **Lines 51-90:** Database initialization (2 tables: `tenders`, `scrape_history`)
- **Lines 91-170:** Pydantic models (TenderSummary, TenderDetail, SearchResponse, StatsResponse)
- **Lines 170-300:** SENRA Intelligence Engine (sector classification, keyword scoring, urgency scoring, org weighting, size inference, insight generation, requirements mapping)
- **Lines 300-370:** eTenders API scraper (direct API, JSON, pagination, SSL fallback)
- **Lines 370-430:** Data storage (insert/update with hash dedup, archive expired)
- **Lines 430-470:** Background scraper (30-min asyncio loop, logs to scrape_history)
- **Lines 470-510:** Seed data (8 tenders for first boot)
- **Lines 510-600:** Query functions (top, urgent, high-value, search, detail, stats)
- **Lines 600-680:** FastAPI routes + startup/shutdown lifecycle

### Key: `frontend/src/App.js`

Single file with all pages and components:
- **Navbar** — Glassmorphism header, links: Home, SENRA, Systems, About, Contact
- **Footer** — "Ready to Scale?" CTA, company links, contact
- **HeroStats** — Pulls live stats from /api/stats
- **TenderCard** — Reusable card component for tender display
- **TenderDetailModal** — Full tender detail with requirements, contact, source link
- **HomeTenderFeed** — "Top High-Value" + "Urgent Closing Soon" sections
- **SenraPage** — Search, filter, paginate tenders (/#/senra)
- **HomePage** — Hero, What We Build, SENRA Flagship, Approach, Why, CTA
- **SystemsPage** — Detailed service descriptions
- **AboutPage** — Company story, founder bio, Cape Town
- **ContactPage** — Email, phone, WhatsApp, location

---

## 5. DATABASE SCHEMA

### Table: `tenders`

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | UUID |
| tender_hash | TEXT UNIQUE | SHA256(title + reference) — dedup key |
| title | TEXT | Tender description |
| organisation | TEXT | Department / organ of state |
| sector | TEXT | Classified sector (12 options) |
| reference | TEXT | Tender number (e.g., FIN/FEB/2026/03) |
| source | TEXT | Data source (eTenders, CIDB, etc.) |
| deadline | TEXT | Closing date (YYYY-MM-DD) |
| days_remaining | INTEGER | Days until deadline |
| score | INTEGER | Intelligence score (0-95) |
| urgency | TEXT | CRITICAL / URGENT / SOON / NORMAL |
| url | TEXT | Link to tender on source site |
| province | TEXT | South African province |
| contact_person | TEXT | Named contact |
| email | TEXT | Contact email |
| telephone | TEXT | Contact phone |
| category | TEXT | eTenders category |
| size_tier | TEXT | LARGE / MEDIUM / SMALL (inferred) |
| status | TEXT | active / archived |
| first_seen | TIMESTAMPTZ | When first scraped |
| last_seen | TIMESTAMPTZ | Most recent scrape that found this |
| seen_count | INTEGER | How many scrape runs found this |

### Table: `scrape_history`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL PK | Auto-increment |
| run_at | TIMESTAMPTZ | When the scrape ran |
| source | TEXT | Source name |
| tenders_found | INTEGER | Total tenders in API response |
| tenders_new | INTEGER | New tenders added |
| tenders_updated | INTEGER | Existing tenders refreshed |
| duration_seconds | REAL | How long the scrape took |
| status | TEXT | success / error message |

### Indexes
- `idx_tenders_score` — score DESC
- `idx_tenders_status` — status
- `idx_tenders_sector` — sector
- `idx_tenders_urgency` — urgency
- `idx_tenders_deadline` — deadline
- `idx_tenders_first_seen` — first_seen
- `idx_scrape_run_at` — run_at

---

## 6. API ENDPOINTS

Base URL: `https://senueren-api.onrender.com/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info + version |
| GET | `/health` | Health check + DB connection status |
| GET | `/stats` | Live stats: total, active, sectors, urgent, avg_score, last_scrape, tenders_today |
| GET | `/tenders/top?limit=10` | Top scored active tenders |
| GET | `/tenders/high-value?limit=5` | Tenders with score >= 75 |
| GET | `/tenders/urgent?limit=5` | Tenders closing soon (CRITICAL/URGENT/SOON) |
| GET | `/tenders/sectors` | Sector breakdown with counts |
| GET | `/tenders/search?q=&sector=&urgency=&limit=20&page=1` | Search + filter + paginate |
| GET | `/tenders/{id}` | Full tender detail + insight + required documentation |
| POST | `/scrape` | Trigger manual scrape (returns found/new/updated/duration) |
| GET | `/scrape/history?limit=10` | Scrape run history |

### Response: `GET /tenders/{id}`

```json
{
  "id": "uuid",
  "title": "Tender description...",
  "organisation": "Department Name",
  "sector": "IT & Technology",
  "deadline": "2026-04-23",
  "days_remaining": 6,
  "score": 95,
  "urgency": "URGENT",
  "source": "eTenders",
  "url": "https://www.etenders.gov.za/Home/opportunities",
  "reference": "FIN/FEB/2026/03",
  "province": "Limpopo",
  "contact_person": "Mathule Mothapo",
  "email": "Mothapo.mathule@gaal.co.za",
  "telephone": "087-291-1088",
  "size_tier": "LARGE",
  "category": "IT & Technology",
  "first_seen": "2026-04-16T...",
  "seen_count": 1,
  "insight": "Closing in 6 days — immediate attention required. Strong alignment with technology procurement demand. High relevance match.",
  "requirements": [
    "Valid Tax Clearance Certificate",
    "B-BBEE Certificate/Affidavit",
    "Company Registration (CIPC)",
    "Proof of similar IT/ICT project experience",
    "CVs of key technical personnel",
    "ISO 27001 or relevant IT security certification",
    "Professional Indemnity Insurance"
  ]
}
```

---

## 7. SENRA INTELLIGENCE ENGINE

### Scoring Algorithm (0-95 points, 6 components)

| Component | Points | Method |
|-----------|--------|--------|
| **Keyword Relevance** | 0-40 | Tier 1 (5pts each): software, ict, cloud, infrastructure, consulting, etc. Tier 2 (3pts each): computer, digital, maintenance, supply, etc. |
| **Urgency** | 0-25 | Exponential curve: ≤3d=25, ≤7d=20, ≤14d=15, ≤30d=10, else=5 |
| **Organisation Importance** | 5-20 | Weighted: Eskom 1.5x, Transnet 1.4x, SANRAL 1.3x, National 1.3x, Provincial 1.2x |
| **Tender Size Proxy** | 5-15 | Text signal inference: "infrastructure"/"enterprise" → LARGE(15), "quotation"/"rfq" → SMALL(5) |
| **Data Completeness** | 0-10 | URL(+5), Reference(+3), Contact(+2) |
| **Sector Multiplier** | 1.0-1.4x | IT/Construction/Professional: 1.4x, Healthcare/Education/Security: 1.3x |

**Final: `min(95, sum_of_components * sector_weight)`**

### 12 Sectors Classified
IT & Technology, Construction, Healthcare, Education, Social Development, Energy, Transport & Logistics, Financial Services, Agriculture, Environmental, Security Services, Professional Services, General

### Required Documentation (per sector)
Each sector has a specific list of typical SA government tender requirements (Tax Clearance, B-BBEE, CIPC, sector-specific certifications like CIDB for construction, PSIRA for security, SAHPRA for healthcare, etc.)

### Data Source
- **Primary:** eTenders National API — `https://www.etenders.gov.za/Home/PaginatedTenderOpportunities`
- **Method:** Direct JSON API (not web scraping — DataTables server-side endpoint)
- **Volume:** 100-200 tenders per scrape, 1,750+ available in API
- **Frequency:** Every 30 minutes (background asyncio task)
- **SSL:** Tries verified first, falls back to unverified for SA gov server issues

### Data Persistence Strategy
- **Deduplication:** SHA256 hash of (title + reference) — never double-count
- **Historical tracking:** `first_seen`, `last_seen`, `seen_count` on every tender
- **Archival:** Expired tenders (past deadline) get `status='archived'` — never deleted
- **Scrape history:** Every run logged with found/new/updated counts + duration
- **Analytics-ready:** All indexes in place for sector analysis, time-series queries, source performance

---

## 8. FRONTEND PAGES

| Route | Page | Key Features |
|-------|------|-------------|
| `/#/` | Home | Hero with live stats, What We Build (4 cards), SENRA Flagship (bento grid), "Top High-Value" + "Urgent Closing Soon" tender feed, Approach (5 steps), Why Senueren (6 cards), Work With Us CTA |
| `/#/senra` | SENRA | Search bar, urgency filters (4), sector filters (12), paginated tender list, click for detail modal |
| `/#/systems` | Systems | 4 detailed service descriptions with feature badges |
| `/#/about` | About | Cape Town hero image, founder bio (Quelum Wilson), company story |
| `/#/contact` | Contact | Email, phone, WhatsApp, location cards |

### Tender Detail Modal (appears on any page when clicking a tender)
- Score with urgency badge
- Full metadata grid (sector, deadline, reference, province, value tier, source)
- Contact information (name, email, phone)
- Intelligence Insight (AI-generated text)
- Required Documentation checklist (sector-specific)
- "View on Source" button (links to eTenders)

---

## 9. DEPLOYMENT CONFIGURATION

### Render Backend (`render.yaml`)
```yaml
services:
  - type: web
    name: senueren-api
    runtime: python
    region: frankfurt
    plan: free
    branch: main
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL  # Internal Render Postgres connection
      - key: CORS_ORIGINS
        value: https://senueren.co.za,https://shxnque.github.io
```

### GitHub Pages Frontend
- **Branch:** `gh-pages` (built output)
- **Source branch:** `main` (source code)
- **Build command:** `cd frontend && craco build`
- **Deploy command:** `npx gh-pages -d build`
- **Custom domain:** `senueren.co.za` (via CNAME file in public/)
- **Homepage in package.json:** `https://senueren.co.za`

### DNS Configuration (required at domain registrar)
```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
CNAME   www     shxnque.github.io
```

After DNS propagation: Enable HTTPS in GitHub repo → Settings → Pages.

---

## 10. DEVELOPMENT TIMELINE

| Date | Commit | What Changed |
|------|--------|-------------|
| 07 Apr 2026 | `1c50684` | Initial commit — blank CRA project |
| 08 Apr 2026 | `476c03e` | First deployment attempts (Vercel) |
| 09 Apr 2026 | `c61c10a` | First Senueren landing page content |
| 10 Apr 2026 | `a8ebca2` | SENRA revenue focus, contact section |
| 14 Apr 2026 | `37e8cfd` | GitHub Pages deployment + HashRouter |
| 14 Apr 2026 | `0cf65ad` | SENRA intelligence system, dark theme, brand assets |
| 15 Apr 2026 | `ce8b75f` | Major redesign — systems company positioning |
| 15 Apr 2026 | `2f77041` | Brand identity update + SEO optimization |
| **16 Apr 2026** | `34e7a46` | **Premium website redesign** — dark tech aesthetic, glassmorphism nav, hero backgrounds, Render deployment config |
| **16 Apr 2026** | `9081ddd` | Clean requirements.txt for Render |
| **16 Apr 2026** | `241f046` | Resilient MongoDB handling |
| **16 Apr 2026** | `3f3797c` | **PostgreSQL migration** — asyncpg, SENRA intelligence integration, eTenders API scraper, live tender feed on homepage |
| **16 Apr 2026** | `46a202d` | **SENRA page** — search/filter/pagination, tender detail with requirements, background scraper (30 min), data persistence (scrape_history, archival), high-value + urgent endpoints |

---

## 11. CURRENT STATE (as of 16 April 2026)

### Live Data
- **112 active tenders** in PostgreSQL (scraped from eTenders API)
- **12 sectors** classified
- **33 urgent** tenders (closing within 14 days)
- **Average intelligence score:** 61.8/95
- **6 data sources** identified
- **Background scraper:** Active, runs every 30 minutes

### What Works
- All API endpoints responding (tested 16/16 pass)
- All frontend pages and components (tested 100% pass)
- Tender detail modal with requirements, contact, source link
- Search by keyword, filter by urgency/sector, pagination
- Homepage live feed (high-value + urgent)
- Render backend auto-deploys on push to main
- GitHub Pages auto-deploys via gh-pages branch

### What Needs Setup
- DNS records for `senueren.co.za` (A + CNAME)
- HTTPS enforcement after DNS propagation

### Known Limitations (Render Free Tier)
- Backend sleeps after 15 min inactivity (wakes on first request, ~30s cold start)
- PostgreSQL database expires after 90 days (recreate or upgrade)
- Background scraper pauses when service sleeps

---

## 12. ENVIRONMENT VARIABLES

### Backend (`backend/.env`)
```
DATABASE_URL=postgresql://...    # Render internal Postgres URL
CORS_ORIGINS=*                   # Allowed origins (comma-separated)
```

### Frontend (`frontend/.env`)
```
REACT_APP_BACKEND_URL=...        # Backend API URL (not used in GH Pages build — hardcoded in App.js)
WDS_SOCKET_PORT=443
```

**Note:** The frontend API URL is hardcoded in `App.js` as `const API_URL = "https://senueren-api.onrender.com/api"` for GitHub Pages static deployment.

---

## 13. HOW TO WORK ON THIS

### Local Development (Frontend)
```bash
cd frontend
yarn install
yarn start      # runs on localhost:3000
```

### Local Development (Backend)
```bash
cd backend
pip install -r requirements.txt
# Set DATABASE_URL in .env (use external Render Postgres URL with ?sslmode=require)
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

### Deploy Frontend to GitHub Pages
```bash
cd frontend
npx craco build
npx gh-pages -d build
```

### Deploy Backend to Render
Push to `main` branch → Render auto-deploys from `backend/` directory.

### Trigger Manual Scrape
```bash
curl -X POST https://senueren-api.onrender.com/api/scrape
```

---

## 14. IMPORTANT DECISIONS & CONTEXT

1. **Single-file backend** (`server.py`) — intentional. Everything in one place. Easy to read, deploy, debug. No unnecessary abstraction.

2. **Single-file frontend** (`App.js`) — same reasoning. All pages and components in one file. Could be split later if it grows past 1500 lines.

3. **HashRouter, not BrowserRouter** — GitHub Pages serves static files. Hash routing (`/#/senra`) works without server-side config.

4. **API URL hardcoded in frontend** — GitHub Pages is a static build. No runtime environment variables. The Render API URL is hardcoded.

5. **PostgreSQL over MongoDB** — User requested. Better for relational queries, sector aggregation, and analytics. Render provides free PostgreSQL.

6. **No authentication** — This is a public marketing site + public tender data. No user accounts needed.

7. **Background scraper via asyncio** — Simpler than setting up a separate worker. Runs inside the FastAPI process. Good enough for this scale.

8. **Sector-specific requirements** — Not from the tender itself (eTenders doesn't provide this). Mapped from sector classification based on standard SA government procurement requirements.

---

**END OF DOCUMENTATION**

For questions or access: info@senueren.co.za | 067 326 7417
