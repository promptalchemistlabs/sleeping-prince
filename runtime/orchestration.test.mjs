import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createKingdomApp } from "./src/server.mjs";
import { MemoryStore } from "./src/store.mjs";
import { createPublisher } from "./src/publisher.mjs";

async function setup() {
  const publications = [];
  const store = new MemoryStore();
  const { app } = await createKingdomApp({
    env: {},
    store,
    publisher: {
      async publish(artifact) {
        publications.push(artifact);
        return { targetPath: artifact.targetPath, built: true };
      },
    },
  });
  return { app, store, publications };
}

test("creates an approval-gated Tembusu Circle content workflow", async () => {
  const { app } = await setup();
  const response = await app.request("/api/workflows", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ objective: "Write a blog about pricing terrarium workshops" }),
  });
  assert.equal(response.status, 201);
  const workflow = await response.json();
  assert.equal(workflow.status, "awaiting-approval");
  assert.equal(workflow.currentAgent, "rick");
  assert.equal(workflow.artifact.kind, "blog-post");
  assert.match(workflow.artifact.targetPath, /^content\/blog\/.+\.md$/);
});

test("founder approval writes and builds the Gatsby artifact", async () => {
  const { app, publications } = await setup();
  const createResponse = await app.request("/api/workflows", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ objective: "Create a website page for terrarium business coaching" }),
  });
  const workflow = await createResponse.json();
  const approvalResponse = await app.request(`/api/approvals/${workflow.approvalId}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "approved" }),
  });
  assert.equal(approvalResponse.status, 200);
  const outcome = await approvalResponse.json();
  assert.equal(outcome.workflow.status, "completed");
  assert.equal(outcome.artifact.status, "published");
  assert.equal(publications.length, 1);
});

test("accepts a Telegram update without a live bot token", async () => {
  const { app } = await setup();
  const response = await app.request("/webhooks/telegram", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      update_id: 1,
      message: {
        message_id: 2,
        date: 1_700_000_000,
        from: { id: 10 },
        chat: { id: 20 },
        text: "Write a blog about choosing terrarium plants",
      },
    }),
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
  assert.equal(body.workflow.request.channel, "telegram");
});

test("keeps Orin, Scribe, and Rick workflow memories separate", async () => {
  const { app } = await setup();
  await app.request("/api/workflows", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ objective: "Write a blog about terrarium workshop kits" }),
  });
  for (const agent of ["orin", "scribe", "rick"]) {
    const response = await app.request(`/api/agents/${agent}/memories`);
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.memories.length, 1);
    assert.match(body.memories[0].type, /summary|decision/);
  }
  const bastionResponse = await app.request("/api/agents/bastion/memories");
  assert.deepEqual(await bastionResponse.json(), { memories: [] });
});

test("records Bastion diagnostics in Bastion's own memory", async () => {
  const store = new MemoryStore();
  const diagnostic = {
    id: "diagnostic-1",
    status: "healthy",
    summary: "All injected checks passed.",
    checks: [],
    counts: { healthy: 0, degraded: 0, unhealthy: 0, unknown: 0 },
    recommendations: [],
    escalateToRick: false,
  };
  const { app } = await createKingdomApp({
    env: {},
    store,
    publisher: { publish: async () => ({ built: true }) },
    orchestration: {
      diagnose: async () => {
        await store.saveMemory("bastion", {
          id: "memory-1",
          type: "diagnostic-summary",
          content: diagnostic.summary,
          createdAt: new Date().toISOString(),
        });
        return diagnostic;
      },
    },
  });
  const response = await app.request("/api/diagnostics");
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, "healthy");
  assert.equal((await store.listMemories("bastion")).length, 1);
});

test("publisher writes Gatsby kind and published status into approved Markdown", async () => {
  const siteRoot = await mkdtemp(path.join(tmpdir(), "tembusu-circle-"));
  try {
    const publisher = createPublisher({ siteRoot, build: false });
    await publisher.publish({
      kind: "blog-post",
      targetPath: "content/blog/test-post.md",
      markdown: '---\ntitle: "Test"\nstatus: "draft"\n---\n\n# Test',
    });
    const markdown = await readFile(path.join(siteRoot, "content/blog/test-post.md"), "utf8");
    assert.match(markdown, /^---\nkind: "blog-post"/);
    assert.match(markdown, /status: "published"/);
  } finally {
    await rm(siteRoot, { recursive: true, force: true });
  }
});
