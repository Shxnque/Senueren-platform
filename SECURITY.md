# Security Policy

## Scope of this repository

This repository is **public and frontend-only**. It contains UI components,
styling and non-sensitive client-side logic. It does **not** contain:

- API keys, tokens, or credentials of any kind
- Database connection strings or database access code
- `.env` files
- Backend source, business logic, or SENRA intelligence services

All sensitive operations run server-side in a **private** backend repository
and are only reachable through authenticated HTTPS API endpoints.

## Reporting a vulnerability

If you believe you have found a security issue in this codebase (e.g. a leaked
secret slipping through, a dependency CVE, a client-side XSS, auth bypass,
CORS misconfiguration, etc.):

- Email: **senueren@senueren.co.za**
- Or open a GitHub issue with the label `security` — but **do not include the
  secret value** or a full exploit in the public issue. We will open a private
  advisory to continue.

Please give us reasonable time to respond before public disclosure.

## Supported versions

The `main` branch is the only supported version. The deployed site at
`senueren.co.za` always tracks `main`.

## Secret-handling policy

- `.env` / `.env.*` are ignored by `.gitignore` globally, including nested paths.
- All production secrets live in environment variables on the deployment
  platform (Render for the backend, GitHub Pages build for the frontend).
- Git history has been rewritten to remove all previously tracked env files
  and backend code. Any past commit SHA will no longer resolve.
- Secret-scanning (GitHub) and manual review are used before every push.
