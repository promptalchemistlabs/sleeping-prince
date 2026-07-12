import { createClient } from "@libsql/client";

const TABLES = ["orin", "scribe", "rick", "bastion"];

function clone(value) {
  return value == null ? value : structuredClone(value);
}

export class MemoryStore {
  #workflows = new Map();
  #approvals = new Map();
  #artifacts = new Map();
  #audit = [];
  #memories = new Map(TABLES.map((agent) => [agent, []]));

  async init() {}

  async saveWorkflow(workflow) {
    this.#workflows.set(workflow.id, clone(workflow));
    return clone(workflow);
  }

  async listWorkflows() {
    return [...this.#workflows.values()]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .map(clone);
  }

  async getWorkflow(id) {
    return clone(this.#workflows.get(id) ?? null);
  }

  async saveApproval(approval) {
    this.#approvals.set(approval.id, clone(approval));
    return clone(approval);
  }

  async listApprovals() {
    return [...this.#approvals.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(clone);
  }

  async getApproval(id) {
    return clone(this.#approvals.get(id) ?? null);
  }

  async saveArtifact(artifact) {
    this.#artifacts.set(artifact.id, clone(artifact));
    return clone(artifact);
  }

  async listArtifacts() {
    return [...this.#artifacts.values()].map(clone);
  }

  async addAudit(event) {
    this.#audit.push(clone(event));
    return clone(event);
  }

  async listAudit() {
    return [...this.#audit].reverse().map(clone);
  }

  async saveMemory(agent, memory) {
    if (!this.#memories.has(agent)) throw new Error(`Unknown agent memory owner: ${agent}`);
    this.#memories.get(agent).push(clone(memory));
    return clone(memory);
  }

  async listMemories(agent) {
    if (!this.#memories.has(agent)) throw new Error(`Unknown agent memory owner: ${agent}`);
    return [...this.#memories.get(agent)].reverse().map(clone);
  }
}

export class TursoStore {
  constructor({ url, authToken }) {
    this.client = createClient({ url, authToken: authToken || undefined });
  }

  async init() {
    const statements = [
      `CREATE TABLE IF NOT EXISTS workflow_runs (
        id TEXT PRIMARY KEY,
        status TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        payload TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS approval_records (
        id TEXT PRIMARY KEY,
        workflow_id TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        payload TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS content_artifacts (
        id TEXT PRIMARY KEY,
        workflow_id TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        payload TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS audit_events (
        id TEXT PRIMARY KEY,
        workflow_id TEXT,
        created_at TEXT NOT NULL,
        payload TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS shared_memories (
        id TEXT PRIMARY KEY,
        source_agent TEXT NOT NULL,
        created_at TEXT NOT NULL,
        payload TEXT NOT NULL
      )`,
      ...TABLES.map(
        (agent) => `CREATE TABLE IF NOT EXISTS ${agent}_memories (
          id TEXT PRIMARY KEY,
          task_id TEXT,
          created_at TEXT NOT NULL,
          payload TEXT NOT NULL
        )`,
      ),
    ];
    await this.client.batch(statements.map((sql) => ({ sql })), "write");
  }

  async #save(table, record, columns) {
    const names = Object.keys(columns);
    const args = { ...columns, payload: JSON.stringify(record) };
    const placeholders = names.map((name) => `:${name}`).join(", ");
    const updates = names
      .filter((name) => name !== "id")
      .map((name) => `${name} = excluded.${name}`)
      .join(", ");
    await this.client.execute({
      sql: `INSERT INTO ${table} (${names.join(", ")}) VALUES (${placeholders})
            ON CONFLICT(id) DO UPDATE SET ${updates}`,
      args,
    });
    return clone(record);
  }

  async #list(table, orderColumn) {
    const result = await this.client.execute(
      `SELECT payload FROM ${table} ORDER BY ${orderColumn} DESC`,
    );
    return result.rows.map((row) => JSON.parse(String(row.payload)));
  }

  async #get(table, id) {
    const result = await this.client.execute({
      sql: `SELECT payload FROM ${table} WHERE id = ? LIMIT 1`,
      args: [id],
    });
    return result.rows[0] ? JSON.parse(String(result.rows[0].payload)) : null;
  }

  saveWorkflow(workflow) {
    return this.#save("workflow_runs", workflow, {
      id: workflow.id,
      status: workflow.status,
      updated_at: workflow.updatedAt,
      payload: JSON.stringify(workflow),
    });
  }

  listWorkflows() {
    return this.#list("workflow_runs", "updated_at");
  }

  getWorkflow(id) {
    return this.#get("workflow_runs", id);
  }

  saveApproval(approval) {
    return this.#save("approval_records", approval, {
      id: approval.id,
      workflow_id: approval.workflowId,
      status: approval.status,
      created_at: approval.createdAt,
      payload: JSON.stringify(approval),
    });
  }

  listApprovals() {
    return this.#list("approval_records", "created_at");
  }

  getApproval(id) {
    return this.#get("approval_records", id);
  }

  saveArtifact(artifact) {
    return this.#save("content_artifacts", artifact, {
      id: artifact.id,
      workflow_id: artifact.workflowId,
      status: artifact.status,
      created_at: artifact.createdAt,
      payload: JSON.stringify(artifact),
    });
  }

  listArtifacts() {
    return this.#list("content_artifacts", "created_at");
  }

  async addAudit(event) {
    await this.client.execute({
      sql: `INSERT INTO audit_events (id, workflow_id, created_at, payload)
            VALUES (?, ?, ?, ?)`,
      args: [event.id, event.workflowId ?? null, event.createdAt, JSON.stringify(event)],
    });
    return clone(event);
  }

  listAudit() {
    return this.#list("audit_events", "created_at");
  }

  async saveMemory(agent, memory) {
    if (!TABLES.includes(agent)) throw new Error(`Unknown agent memory owner: ${agent}`);
    await this.client.execute({
      sql: `INSERT INTO ${agent}_memories (id, task_id, created_at, payload) VALUES (?, ?, ?, ?)`,
      args: [memory.id, memory.taskId ?? null, memory.createdAt, JSON.stringify(memory)],
    });
    return clone(memory);
  }

  listMemories(agent) {
    if (!TABLES.includes(agent)) throw new Error(`Unknown agent memory owner: ${agent}`);
    return this.#list(`${agent}_memories`, "created_at");
  }
}

export function createStore(env = process.env) {
  if (!env.TURSO_DATABASE_URL) return new MemoryStore();
  return new TursoStore({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
}
