import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import { cors } from "hono/cors";
import { createOrchestration } from "./orchestration.mjs";
import { createPublisher } from "./publisher.mjs";
import { createStore } from "./store.mjs";

export async function createKingdomApp({
  env = process.env,
  store = createStore(env),
  publisher = createPublisher(),
  orchestration,
} = {}) {
  await store.init();
  const kingdom = orchestration ?? (await createOrchestration({ store, publisher }));
  const app = new Hono();
  app.use("/api/*", cors({ origin: "*" }));
  app.use("/events", cors({ origin: "*" }));

  app.get("/health", async (c) =>
    c.json({
      status: "ok",
      service: "kingdom-of-pal",
      agents: 4,
      storage: env.TURSO_DATABASE_URL ? "turso" : "memory",
    }),
  );

  app.get("/api/agents", (c) =>
    c.json({
      agents: [
        { id: "orin", name: "Orin", role: "community-coordinator", status: "healthy", channel: "telegram" },
        { id: "scribe", name: "Scribe", role: "content-producer", status: "healthy", channel: "background" },
        { id: "rick", name: "Rick", role: "security-governor", status: "healthy", channel: "background" },
        { id: "bastion", name: "Bastion", role: "system-doctor", status: "healthy", channel: "background" },
      ],
    }),
  );
  app.get("/api/agents/:id/memories", async (c) => {
    try {
      return c.json({ memories: await store.listMemories(c.req.param("id")) });
    } catch (error) {
      return c.json({ error: error.message }, 404);
    }
  });

  app.get("/api/workflows", async (c) => c.json({ workflows: await store.listWorkflows() }));
  app.post("/api/workflows", async (c) => {
    const body = await c.req.json();
    if (typeof body.objective !== "string" || !body.objective.trim()) {
      return c.json({ error: "objective is required" }, 400);
    }
    const result = await kingdom.createWorkflow(body);
    return c.json(result.outputs.workflow, result.status === "failed" ? 500 : 201);
  });
  app.get("/api/workflows/:id", async (c) => {
    const workflow = await store.getWorkflow(c.req.param("id"));
    return workflow ? c.json(workflow) : c.json({ error: "Workflow not found" }, 404);
  });

  app.get("/api/approvals", async (c) => c.json({ approvals: await store.listApprovals() }));
  app.post("/api/approvals/:id/decision", async (c) => {
    try {
      const { decision } = await c.req.json();
      return c.json(await kingdom.decideApproval(c.req.param("id"), decision));
    } catch (error) {
      return c.json({ error: error.message }, /not found/i.test(error.message) ? 404 : 400);
    }
  });

  app.get("/api/demo/content", async (c) => c.json({ artifacts: await store.listArtifacts() }));
  app.get("/api/audit", async (c) => c.json({ events: await store.listAudit() }));
  app.get("/api/diagnostics", async (c) => c.json(await kingdom.diagnose()));
  app.post("/api/diagnostics", async (c) => c.json(await kingdom.diagnose(), 201));

  app.post("/webhooks/telegram", async (c) => {
    const configuredSecret = env.TELEGRAM_WEBHOOK_SECRET;
    const providedSecret = c.req.header("x-telegram-bot-api-secret-token");
    if (configuredSecret && providedSecret !== configuredSecret) {
      return c.json({ error: "Invalid Telegram webhook secret" }, 401);
    }
    try {
      const result = await kingdom.submitTelegramUpdate(await c.req.json());
      const chatId = result.outputs?.workflow?.request?.externalChatId;
      if (env.TELEGRAM_BOT_TOKEN && chatId) {
        await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `Workflow ${result.outputs.workflow.id} is ${result.outputs.workflow.status}.`,
          }),
        });
      }
      return c.json({ ok: true, workflow: result.outputs?.workflow });
    } catch (error) {
      return c.json({ ok: false, error: error.message }, 400);
    }
  });

  app.get("/events", (c) =>
    streamSSE(c, async (stream) => {
      const workflows = await store.listWorkflows();
      await stream.writeSSE({
        event: "snapshot",
        id: String(Date.now()),
        data: JSON.stringify({ workflows }),
      });
    }),
  );

  app.notFound((c) => c.json({ error: "Not found" }, 404));
  return { app, store, kingdom };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.KINGDOM_PORT ?? 4000);
  const { app } = await createKingdomApp();
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" });
  console.log(`Kingdom orchestration API listening on http://0.0.0.0:${port}`);
}
