# Hackathon demo

The first demo should prove one thin vertical slice rather than the complete
platform.

## Environment

Configure the demo once at the repository root:

```bash
cp .env.example .env
```

Fill in the OpenAI credentials and the single shared Turso database credentials
in that root file. All agent processes
must be launched from the kingdom root with `node --env-file=.env ...`; nested
agent `.env` files are not used.

Before adding model or database calls, verify the local assembly:

```bash
npm test
npm run hello
curl http://127.0.0.1:4000/hello
```

## Demo business

Tembusu Circle is a fictitious enablement business for people who want to start
and operate a terrarium business. It provides workshops, practical guides,
pricing templates, supplier guidance, and growth content. Its customer-facing
site is the separate Gatsby application in `tembusu-circle/`; the kingdom's
Astro/React application observes and controls the agents under `/app`.

## Primary scenario

Founder request:

> Create a blog post that teaches new terrarium founders how to price their first workshop.

Expected evidence:

1. The founder sends the request to Orin through Telegram or the dashboard.
2. Orin creates a workflow and routes a contract-valid task to Scribe.
3. Scribe returns a Gatsby-targeted Markdown artifact.
4. Rick classifies the Gatsby write and build as requiring founder approval.
5. The founder approves through the orchestration application.
6. The Markdown file is written into `tembusu-circle/content/blog/` and Gatsby
   rebuilds locally. Public deployment remains a separate approval boundary.
7. The workflow, approval, artifact, and audit events remain visible in the
   orchestration application.

## Secondary scenario

Deliberately misconfigure one agent health check. Bastion should diagnose the
failure and propose a recovery action. Rick should review the proposal if it
changes production or permissions.

## Non-goals

- Public agent marketplace
- Autonomous publishing
- Automated production recovery
- General-purpose multi-agent framework
- Complex long-term memory
