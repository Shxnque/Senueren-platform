# Security headers — senueren.co.za

> Status: **operator action required for full enforcement.** In-repo mitigations are
> already live; enforced HTTP headers require fronting the domain with Cloudflare.

## 1. Why this document exists

`senueren.co.za` is served by **GitHub Pages** (Fastly CDN, `server: GitHub.com`).
GitHub Pages **cannot emit custom HTTP response headers**. That means several
security controls that are *header-only* cannot be enforced from this repository,
no matter what we put in the HTML:

| Control | Delivered how | Works on GitHub Pages? |
|---|---|---|
| `Strict-Transport-Security` (HSTS) | header | ✅ GitHub Pages already sends `max-age=31556952` |
| `Content-Security-Policy` (page directives) | `<meta http-equiv>` | ✅ enforced (script-src, connect-src, object-src, base-uri, form-action…) |
| `Referrer-Policy` | `<meta>` | ✅ enforced |
| CSP `frame-ancestors` (anti-clickjacking) | header **only** | ❌ ignored in `<meta>` |
| `X-Frame-Options` | header only | ❌ |
| `X-Content-Type-Options: nosniff` | header only | ❌ |
| `Permissions-Policy` | header only | ❌ |
| `Cross-Origin-Opener-Policy` | header only | ❌ |

## 2. What is already mitigated in-repo (live now)

- **Content-Security-Policy** via `<meta>` in `frontend/public/index.html`:
  `default-src 'self'`, explicit `connect-src` allow-list (self + the Quesen API),
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`,
  `upgrade-insecure-requests`. (`script-src`/`style-src` allow `'unsafe-inline'`
  because JSON-LD structured data + the CRA runtime + Tailwind/Radix inject inline
  script/style; removing it would white-screen the site or strip SEO schema.)
- **Referrer-Policy** `strict-origin-when-cross-origin` via `<meta>`.
- **Clickjacking frame-buster** (JS) in `index.html`: if the site is loaded in a
  cross-origin frame it breaks out. This is the only enforceable clickjacking
  control available on GitHub Pages. Same-origin embedding is allowed.
- No committed secrets; `.env*`, keys, tokens are git-ignored.

## 3. Full enforcement — front the domain with Cloudflare (free plan)

This is the recommended "best path" and gives real, header-level enforcement
without moving off GitHub Pages hosting.

### 3.1 DNS
1. Add `senueren.co.za` as a zone in Cloudflare (free plan).
2. Recreate the GitHub Pages DNS records **proxied (orange cloud ON)**:
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - (and/or `AAAA` → `2606:50c0:8000::153` … `8003::153`)
   - `www` `CNAME` → `shxnque.github.io` (proxied)
3. Keep the repo `frontend/public/CNAME` = `senueren.co.za` unchanged.
4. Cloudflare **SSL/TLS mode: Full** (GitHub Pages already serves valid TLS).
5. Enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**.

### 3.2 Response-header Transform Rule
Rules → **Transform Rules → Modify Response Header → Create rule**
(If: `hostname eq "senueren.co.za"`). Add (Set) each header:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=(), payment=(), usb=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://*.up.railway.app https://api.senueren.co.za; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
```

> The CSP above is the `<meta>` policy **plus** `frame-ancestors 'none'` (which only
> works as a real header). Once this header is live you may delete the `<meta>` CSP
> and the JS frame-buster, but leaving them is harmless (defense-in-depth).

### 3.3 Verify
```
curl -sSI https://senueren.co.za/ | grep -iE "x-frame|x-content|permissions-policy|content-security|referrer|strict-transport|cross-origin"
```
Then re-scan with https://securityheaders.com/?q=senueren.co.za (target grade A).

## 4. Alternative: move hosting to a header-capable host
Netlify / Cloudflare Pages support a committed `public/_headers` file
(a no-op on GitHub Pages). If hosting ever moves, add `frontend/public/_headers`
with the same header set. Not added now because it is dead config on GitHub Pages.

---
_Last reviewed 2026-09-26. Owner: Shxnque. Evidence-first: every claim here was
checked against the live response headers, not assumed._
