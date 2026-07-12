# Kingdom of PAL

> A governed operating team of independent AI agents for community-driven businesses.

Kingdom of PAL coordinates specialised agents that live in separate repositories but
operate under one Founder's Charter, shared contracts, explicit permissions, and
human approval rules.

This repository owns the organisational layer. Agent implementations remain
independently versioned and can later be assembled under `agents/` as Git
submodules or accessed as deployed services.

## The essential kingdom

Kingdom of PAL starts with four mandatory roles:

| Agent   | Core role             | Responsibility                                                 |
| ------- | --------------------- | -------------------------------------------------------------- |
| Orin    | Community coordinator | Understand community needs, select context, and route work     |
| Scribe  | Content producer      | Create website, blog, educational, and remixed content         |
| Rick    | Security governor     | Enforce permissions, approvals, privacy, and policy            |
| Bastion | System doctor         | Diagnose agent, infrastructure, integration, and memory health |

These core roles cannot be removed through the normal lifecycle. Their current
implementations may be upgraded or replaced by contract-compatible agents.
Additional agents are extensions and may be installed, disabled, upgraded, or
removed.

## How the kingdom fits together

```text
Founder request
      |
      v
Founder's Charter + approval policies
      |
      v
Orin selects context and coordinates the workflow
      |
      +--------> Scribe produces content
      +--------> Bastion diagnoses system failures
      |
      v
Rick checks consequential actions
      |
      v
Founder approval -> execution -> audit and memory
```

The registry describes who is installed. Contracts describe how agents
collaborate. Policies determine what they may do. Workflows compose those pieces
without depending on agent internals.

## Repository structure

```text
.
├── agent-registry.yaml              # Installed agents and lifecycle rules
├── .env.example                     # Shared runtime configuration contract
├── agents/                           # Four independently versioned agent submodules
├── approval-policies/                # Risk and human-approval rules
├── demo/                             # Hackathon demo instructions and fixtures
├── docs/                             # Product vision and presentation
├── founders-charter/                 # Shared direction and operating principles
├── memory/                           # Shared-memory conventions (not runtime data)
├── runtime/                          # Hono orchestration API and Turso persistence
├── scripts/                          # Safe build, sync, redeploy and serve commands
├── shared-contracts/                 # Versioned JSON Schema contracts
├── tembusu-circle/                   # Gatsby Markdown demo business
├── website/                          # Astro landing site + React control room
└── workflow-definitions/             # Declarative multi-agent workflows
```

## Operations

The repository includes fail-closed operational scripts for local and Zo
Computer checkouts:

```bash
./scripts/build.sh
./scripts/sync.sh
./scripts/redeploy.sh
./scripts/redeploy-zo.sh
```

`sync.sh` fast-forwards the parent and restores the four submodules to their
reviewed pins. `redeploy.sh` validates the website before atomically activating
a versioned static release. See [`docs/OPERATIONS.md`](docs/OPERATIONS.md) for
hosting, health-check, rollback and the public Zo managed-service setup.

## Hackathon environment

All four agents use the single `.env` file at the kingdom root. Start from
`.env.example`; do not create agent-local environment files. Agent runtimes read
their assigned values from `process.env` and are launched from the root with
Node's `--env-file=.env` option.

See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for variable ownership and the
launch convention.

## Local hello world

The first executable slice is a dependency-free local kingdom runtime. It does
not call OpenAI or Turso; it verifies configuration loading, HTTP routing and
the identity of the four essential agents.

```bash
npm test
npm run hello
curl http://127.0.0.1:4000/hello
```

Available routes are `/health`, `/hello`, `/agents`, and
`/agents/:id/health`.

## Full hackathon demo

Run the Hono orchestration API from the root:

```bash
npm start
```

Build and serve the Astro/React control room and Gatsby business site from their
respective directories. Set `PUBLIC_ORCHESTRATION_API_URL` when the API is on a
different origin; a reverse proxy can expose all three processes on one domain.

The demo flow is Telegram or dashboard request → Orin routing → Scribe Markdown
draft → Rick approval gate → founder approval → Gatsby write/build → Bastion
diagnostics. See [`docs/HACKATHON_BUILD.md`](docs/HACKATHON_BUILD.md).

## Agent lifecycle

An installed agent must declare its source, version, capabilities, permissions,
contracts, and health check in `agent-registry.yaml`.

The intended lifecycle is:

```text
install -> validate -> approve permissions -> health-check -> enable
disable -> drain work -> revoke access -> archive memory -> uninstall
```

Rules:

- A core role must always have one enabled implementation in a healthy kingdom.
- A core implementation cannot be uninstalled until a compatible replacement is ready.
- Extension agents may be added and removed without redesigning the kingdom.
- Disabled agents receive no new tasks.
- Removing an agent preserves audit history and archives its memory provenance.
- Consequential permission changes require founder approval.

The future CLI should expose commands such as:

```bash
kingdom agent list
kingdom agent install <repository>
kingdom agent disable <agent-id>
kingdom agent upgrade <agent-id> --version <version>
kingdom agent replace <core-agent-id> --with <repository>
kingdom agent uninstall <extension-agent-id>
kingdom agent doctor <agent-id>
```

These commands are a target interface; they are not implemented yet.

## Initial workflows

### Community campaign

Orin identifies a recurring community need, Scribe creates the campaign, Rick
reviews it, and the founder approves publication.

### Operational diagnosis

Bastion diagnoses a failed agent, integration, or memory operation. Rick reviews
any recovery action affecting production or permissions before founder approval.

## Current status

The hackathon vertical slice now runs all four bounded agents, persists workflow
and per-agent memory through one Turso database, exposes an orchestration API,
and provides the Astro/React founder control room plus the separate Gatsby demo
business. Telegram operates through Orin when a bot token is configured and
falls back to deterministic local/API mode otherwise.

The implemented milestone demonstrates:

1. Registry-based agent discovery
2. Contract-compatible task handoffs
3. Risk classification and founder approval
4. Reviewable activity and memory records

See [`docs/VISION.md`](docs/VISION.md) for the product vision.

## Design principles

- Contract-first integration
- Independent agent repositories
- Protected core roles, replaceable implementations
- Least-privilege access
- Human control of consequential actions
- Observable workflows and decisions
- Tool- and model-agnostic architecture

## Licence

No licence has been selected yet.
