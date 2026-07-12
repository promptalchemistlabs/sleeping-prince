# Multi-Repository Architecture

## Repository map

| Repository | Ownership |
| --- | --- |
| `sleeping-prince` | Charter, registry, contracts, policies, workflows, and integration demo |
| `pal-agent-orin` | Orin implementation, tests, manifest, deployment and health check |
| `pal-agent-scribe` | Scribe implementation, tests, manifest, deployment and health check |
| `pal-agent-rick` | Rick implementation, tests, manifest, deployment and health check |
| `pal-agent-bastion` | Bastion implementation, tests, manifest, deployment and health check |

The kingdom repository must not import private implementation modules from an
agent repository. Integration happens through versioned contracts and declared
runtime endpoints.

## Required files in every agent repository

```text
agent.yaml          # Machine-readable identity and operating contract
README.md           # Human-facing purpose, status and development entry point
AGENTS.md           # Instructions for contributors and coding agents
docs/ROLE.md        # Responsibilities, boundaries and escalation rules
```

Runtime-specific source, tests, packaging, deployment and CI are added only when
the implementation stack is selected.

## Sources of truth

- The agent repository owns its `agent.yaml` manifest.
- `sleeping-prince/agent-registry.yaml` pins the installed version and location.
- `sleeping-prince/shared-contracts/` owns collaboration schemas.
- `sleeping-prince/approval-policies/` owns kingdom-wide risk rules.
- The Founder's Charter overrides agent-local preferences.

The registry may repeat selected manifest fields for discovery, but automated
validation must reject material differences in identity, role, version,
capabilities, permissions, contracts, or health-check configuration.

## Versioning

Each agent uses semantic versions independently.

- Patch: compatible implementation fix
- Minor: backward-compatible capability addition
- Major: contract-breaking behaviour or interface change

During the scaffold phase, agent versions begin at `0.1.0`. Contracts are pinned
separately using their own version, initially `v1alpha1`.

The registry should pin an exact agent version for reproducible kingdom releases.
Git submodules, when used, should pin the corresponding source commit.

## Core-role replacement

The four core roles are mandatory, but their implementations are replaceable.

A replacement must:

1. Declare the same core role.
2. Support every contract required by active workflows.
3. Request no undeclared permissions.
4. Pass health, compatibility and policy checks.
5. Be registered before the previous implementation is disabled.
6. Preserve or explicitly migrate required workflow and memory state.

## Local development

Keep agent repositories as siblings for ordinary development:

```text
workspace/
├── sleeping-prince/
├── pal-agent-orin/
├── pal-agent-scribe/
├── pal-agent-rick/
└── pal-agent-bastion/
```

Use `sleeping-prince/agents/` as Git submodule mount points only when assembling a
reproducible all-in-one demo. The kingdom must also support remote deployed agents
so submodules do not become the runtime integration mechanism.

## Pull-request compatibility checks

Every agent repository should eventually run:

1. Manifest schema validation
2. Unit and integration tests
3. Shared contract fixtures
4. Permission-diff review
5. Health-check contract test
6. Security and dependency checks

The kingdom repository should run a matrix test against the exact agent versions
pinned in the registry.

## Initial build order

1. Freeze the manifest, task, result, approval and health contracts.
2. Implement the thin community-campaign workflow using Orin, Scribe and Rick.
3. Add Bastion's deliberately broken health-check demonstration.
4. Add submodule-based demo assembly only after each repository runs alone.
5. Build install, upgrade, replacement and removal tooling after one manual
   lifecycle succeeds end to end.
