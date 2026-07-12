# Hackathon build: Tembusu Circle

## Product boundary

Kingdom of PAL operates a fictitious terrarium-business enablement company named
Tembusu Circle. Orin is the Telegram-facing coordinator. Scribe, Rick, and
Bastion are background specialists. The Astro/React application is the founder's
control plane, while a separate Gatsby application is the managed customer site.

## Runtime flow

```text
Telegram or dashboard
        |
        v
      Orin
        |
        v
     Scribe ----> Markdown draft
        |
        v
      Rick -----> founder approval
        |
        v
Kingdom publisher ----> Gatsby write + local build
        |
        v
     Bastion ----> health and diagnosis
```

## Repository ownership

| Area | Responsibility |
| --- | --- |
| `agents/orin` | Telegram normalization, intent routing, workflow projection |
| `agents/scribe` | Tembusu Circle Markdown documents and artifact contract |
| `agents/rick` | Policy decision and founder approval boundary |
| `agents/bastion` | Agent, Turso, Telegram, and Gatsby diagnostics |
| `runtime` | Hono API, shared Turso state, dispatch, audit, publication |
| `website` | Astro landing site and React orchestration application |
| `tembusu-circle` | Separate Gatsby customer-facing demo site |

## Safety boundary

Drafting is automatic. Writing an approved artifact and running the local Gatsby
build requires founder approval. Public deployment, credential changes, and
permission changes remain outside the automatic hackathon workflow.

## Storage

The runtime uses one Turso database. Each agent owns its named memory table;
workflows, approvals, artifacts, shared memories, and audit events use shared
operational tables. With no Turso URL configured, local smoke tests use an
in-memory store without changing the contract.
