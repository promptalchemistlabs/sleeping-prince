# Kingdom memory

This directory defines memory conventions. Runtime memory and private business
data must not be committed to Git.

Kingdom memory uses a hub-and-spoke model:

- Every agent owns a private memory spoke.
- The shared hub stores approved organisational knowledge and concise reusable
  summaries.
- A memory broker enforces visibility and permission rules.
- Rick governs access; Bastion diagnoses memory-system health.

Each shared record should include:

```yaml
id: memory-id
sourceAgent: agent-id
taskId: task-id
createdAt: 2026-01-01T00:00:00Z
visibility: shared
importance: 0.5
summary: Concise reusable organisational knowledge.
```

The initial retrieval policy combines up to three relevant records and two
recent records, plus pinned charter and policy context.
