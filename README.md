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

| Agent | Core role | Responsibility |
| --- | --- | --- |
| Orin | Community coordinator | Understand community needs, select context, and route work |
| Scribe | Content producer | Create website, blog, educational, and remixed content |
| Rick | Security governor | Enforce permissions, approvals, privacy, and policy |
| Bastion | System doctor | Diagnose agent, infrastructure, integration, and memory health |

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
├── agents/                           # Future Git submodule mount points
├── approval-policies/                # Risk and human-approval rules
├── demo/                             # Hackathon demo instructions and fixtures
├── docs/                             # Product vision and presentation
├── founders-charter/                 # Shared direction and operating principles
├── memory/                           # Shared-memory conventions (not runtime data)
├── shared-contracts/                 # Versioned JSON Schema contracts
└── workflow-definitions/             # Declarative multi-agent workflows
```

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

This repository is an early contract-first scaffold. It defines the initial
organisation and interfaces but does not yet run agents, persist memory, deploy
services, or provide the `kingdom` CLI.

The first milestone is a thin end-to-end community campaign demonstrating:

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
