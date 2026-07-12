# Kingdom of PAL website

Server-deployed product website built with Astro, React, and TypeScript. All website code and assets live in this directory.

## Setup

Requires Node.js 22 or later and npm.

```bash
cd website
npm install
```

## Development

```bash
npm run dev
```

Astro prints the local preview URL. The public routes are `/`, `/demo`,
`/agents`, `/security`, `/docs`, and `/early-access`.

The React orchestration application is mounted under `/app` with workflow,
agent, approval, and Tembusu Circle demo-management views. It consumes the live
Hono orchestration API and falls back to contract-compatible fixtures when the
API is unavailable.

Set `PUBLIC_ORCHESTRATION_API_URL` at build time when the Hono API is hosted on a
different origin. When omitted, the app requests same-origin `/api` routes and
falls back to fixtures if they are unavailable.

```text
/app
/app/workflows
/app/workflows/:id
/app/agents
/app/approvals
/app/demo
```

## Validation

```bash
npm run format:check
npm run lint
npm run typecheck
```

To apply formatting:

```bash
npm run format
```

## Production build

```bash
npm run build
```

The Node standalone server output is generated in `dist/`. To run that build:

```bash
HOST=0.0.0.0 PORT=4321 node dist/server/entry.mjs
```

## Pre-release limitations

- The early-access form is intentionally disabled until an approved form provider, privacy notice and submission endpoint are configured.
- No installer, command-line interface, analytics, or automatic public deployment is configured.
- The licence is not yet selected.
