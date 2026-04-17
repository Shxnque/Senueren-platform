# Senueren — Frontend

Public frontend for [senueren.co.za](https://senueren.co.za) — the Senueren platform
and the SENRA intelligence system.

> **This repository is frontend-only.** UI components, styling and non-sensitive
> client-side logic. The backend API, database access and SENRA intelligence
> services live in a **separate private repository** and are never exposed here.
> No API keys, tokens, database strings, or `.env` files are ever committed.

## Stack
- React 19 (CRA / CRACO)
- Tailwind CSS + shadcn/ui components
- Deployed to GitHub Pages (see `.github/workflows/deploy.yml`)

## Local development

```bash
cd frontend
yarn install
# Create a local .env (not committed) and point to a running backend:
echo "REACT_APP_BACKEND_URL=https://<your-backend-host>" > .env
yarn start
```

All runtime API calls go through `REACT_APP_BACKEND_URL`. That URL is the only
thing the frontend knows about the backend — no credentials, no database access.

## Security posture

- `.env` / `.env.*` are ignored globally (see `.gitignore`).
- Git history was rewritten to remove any previously tracked env files and all
  backend code. Past commit SHAs are no longer valid.
- Any sensitive operation (DB access, authenticated API calls, SENRA intelligence)
  is routed strictly through the backend API over HTTPS.
- If you find a potential secret in this repo, please open an issue with the
  label `security` (do **not** post the secret value).

## Contributing

PRs welcome for UI, accessibility, styling and client-side improvements.
Backend changes belong in the private backend repo and must not be proposed here.
