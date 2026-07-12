# Kingdom of PAL website

Static pre-release product website built with Astro and TypeScript. All website code and assets live in this directory.

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

Astro prints the local preview URL. The six routes are `/`, `/demo`, `/agents`, `/security`, `/docs`, and `/early-access`.

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

The static output is generated in `dist/`. To inspect that build locally:

```bash
npm run preview
```

## Pre-release limitations

- The demo is an interactive narrative; it does not run agents or call a backend.
- The early-access form is intentionally disabled until an approved form provider, privacy notice and submission endpoint are configured.
- No installer, download, command-line interface, hosted services, persistent memory, analytics or external community integration is configured.
- The licence is not yet selected.
