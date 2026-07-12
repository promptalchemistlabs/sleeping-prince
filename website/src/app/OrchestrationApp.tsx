import { useCallback, useEffect, useMemo, useState } from "react";
import { agents, markdownArtifacts, workflows } from "./fixtures";
import type { Approval, MarkdownDocument, Workflow } from "./types";

type View =
  "dashboard" | "workflows" | "workflow" | "agents" | "approvals" | "demo";

type DemoDocument = MarkdownDocument & { path: string; workflowId: string };

const nav: Array<{ view: View; href: string; label: string }> = [
  { view: "dashboard", href: "/app", label: "Overview" },
  { view: "workflows", href: "/app/workflows", label: "Workflows" },
  { view: "agents", href: "/app/agents", label: "Agents" },
  { view: "approvals", href: "/app/approvals", label: "Approvals" },
  { view: "demo", href: "/app/demo", label: "Demo business" },
];

const time = (value: string) =>
  new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

function Badge({ value }: { value: string }) {
  return (
    <span className={`app-badge ${value}`}>{value.replace("-", " ")}</span>
  );
}

function Shell({
  view,
  source,
  children,
}: {
  view: View;
  source: "live" | "fixtures";
  children: React.ReactNode;
}) {
  const active = view === "workflow" ? "workflows" : view;
  return (
    <div className="app-shell">
      <header className="app-topbar">
        <div className="app-topbar-inner">
          <a className="app-brand" href="/app">
            <span className="app-brand-mark">KP</span>Kingdom Control
          </a>
          <nav className="app-nav" aria-label="Application navigation">
            {nav.map((item) => (
              <a
                key={item.view}
                href={item.href}
                aria-current={active === item.view ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <span className="app-live">
            {source === "live" ? "Live API connected" : "Fixture mode"}
          </span>
        </div>
      </header>
      <main className="app-main" id="main">
        {children}
      </main>
    </div>
  );
}

function Heading({
  title,
  copy,
  actions,
}: {
  title: string;
  copy: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="app-heading">
      <div>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      {actions && <div className="app-button-row">{actions}</div>}
    </div>
  );
}

function WorkflowList({ items = workflows }: { items?: Workflow[] }) {
  return (
    <ul className="app-list">
      {items.map((workflow) => (
        <li className="app-list-item" key={workflow.id}>
          <div>
            <a
              className="app-list-title"
              href={`/app/workflows/${workflow.id}`}
            >
              {workflow.title}
            </a>
            <div className="app-list-meta">
              <span className="app-mono">{workflow.id}</span> ·{" "}
              {workflow.currentAgent ?? "complete"} · {time(workflow.updatedAt)}
            </div>
          </div>
          <Badge value={workflow.status} />
        </li>
      ))}
    </ul>
  );
}

function AgentPanel() {
  return (
    <div className="app-agents">
      {agents.map((agent) => (
        <div className="app-agent" key={agent.id}>
          <span className="app-avatar">{agent.name.slice(0, 2)}</span>
          <div>
            <strong className="app-list-title">{agent.name}</strong>
            <div className="app-list-meta">{agent.current}</div>
          </div>
          <Badge value={agent.status} />
        </div>
      ))}
    </div>
  );
}

function Dashboard({ items }: { items: Workflow[] }) {
  const pending = items.filter(
    (workflow) => workflow.status === "awaiting-approval",
  ).length;
  return (
    <>
      <Heading
        title="Good morning, founder"
        copy="Your agent team is operating Tembusu Circle from Telegram."
        actions={
          <a className="app-button secondary" href="/app/demo">
            Open demo manager
          </a>
        }
      />
      <div className="app-grid stats">
        {[
          [
            "Active workflows",
            String(
              items.filter(
                (item) => !["completed", "failed"].includes(item.status),
              ).length,
            ),
            `${pending} awaiting your decision`,
          ],
          ["Agents online", "4/4", "All health checks passed"],
          ["Pending approvals", String(pending), "Publishing is paused"],
          ["Published this week", "6", "+2 from last week"],
        ].map(([label, value, note]) => (
          <section className="app-card app-card-pad" key={label}>
            <div className="app-stat-label">{label}</div>
            <div className="app-stat-value">{value}</div>
            <div className="app-stat-note">{note}</div>
          </section>
        ))}
      </div>
      <div className="app-grid two">
        <section className="app-card">
          <div className="app-card-header">
            <h2>Recent workflows</h2>
            <a className="app-link" href="/app/workflows">
              View all
            </a>
          </div>
          <WorkflowList items={items} />
        </section>
        <section className="app-card">
          <div className="app-card-header">
            <h2>Agent team</h2>
            <a className="app-link" href="/app/agents">
              Inspect
            </a>
          </div>
          <AgentPanel />
        </section>
      </div>
    </>
  );
}

function Workflows({ workflows: items }: { workflows: Workflow[] }) {
  const [filter, setFilter] = useState("all");
  const visibleItems =
    filter === "all"
      ? items
      : items.filter((workflow) => workflow.status === filter);
  return (
    <>
      <Heading
        title="Workflows"
        copy="Trace every request, handoff, decision and result."
      />
      <section className="app-card">
        <div className="app-toolbar">
          <label className="app-copy">
            Status{" "}
            <select
              className="app-select"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            >
              <option value="all">All workflows</option>
              <option value="running">Running</option>
              <option value="awaiting-approval">Awaiting approval</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <span className="app-copy">{visibleItems.length} workflows</span>
        </div>
        <WorkflowList items={visibleItems} />
      </section>
    </>
  );
}

function WorkflowDetail({
  workflowId,
  items,
}: {
  workflowId?: string;
  items: Workflow[];
}) {
  const workflow =
    items.find((item) => item.id === workflowId) ??
    workflows.find((item) => item.id === workflowId) ??
    items[0] ??
    workflows[0];
  return (
    <>
      <Heading
        title={workflow.title}
        copy={`${workflow.id} · ${workflow.request.channel} · updated ${time(workflow.updatedAt)}`}
        actions={<Badge value={workflow.status} />}
      />
      <div className="app-grid two">
        <section className="app-card">
          <div className="app-card-header">
            <h2>Execution timeline</h2>
            <span className="app-copy">Current: {workflow.currentAgent}</span>
          </div>
          <ol className="app-timeline">
            {workflow.steps.map((step) => (
              <li className={step.status} key={step.id}>
                <div className="app-step-top">
                  <span className="app-step-title">{step.title}</span>
                  <Badge value={step.status} />
                </div>
                <div className="app-list-meta">
                  {step.agent}
                  {step.timestamp ? ` · ${step.timestamp}` : ""}
                </div>
                {step.summary && <p className="app-copy">{step.summary}</p>}
              </li>
            ))}
          </ol>
        </section>
        <div className="app-grid">
          <section className="app-card app-card-pad">
            <div className="app-stat-label">
              {workflow.request.channel} request
            </div>
            <p>{workflow.request.text}</p>
            {workflow.request.externalChatId && (
              <div className="app-mono">
                chat: {workflow.request.externalChatId}
              </div>
            )}
          </section>
          {workflow.artifact && (
            <section className="app-card">
              <div className="app-card-header">
                <h2>Markdown artifact</h2>
                <Badge value={workflow.artifact.document.frontmatter.status} />
              </div>
              <div className="app-card-pad">
                <strong>{workflow.artifact.document.title}</strong>
                <p className="app-copy">
                  {workflow.artifact.document.description}
                </p>
                <div className="app-mono">{workflow.artifact.reference}</div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

function Agents() {
  return (
    <>
      <Heading
        title="Agents"
        copy="Capabilities, workload and private-memory activity."
      />
      <div className="app-grid stats">
        {agents.map((agent) => (
          <section className="app-card app-card-pad" key={agent.id}>
            <div className="app-agent" style={{ padding: 0 }}>
              <span className="app-avatar">{agent.name.slice(0, 2)}</span>
              <div>
                <strong>{agent.name}</strong>
                <div className="app-list-meta">{agent.role}</div>
              </div>
              <Badge value={agent.status} />
            </div>
            <p className="app-copy" style={{ marginTop: 16 }}>
              {agent.current}
            </p>
            <div className="app-stat-label">
              {agent.memory} private memory records
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function Approvals({
  items,
  approvals,
  apiUrl,
  onUpdated,
}: {
  items: Workflow[];
  approvals: Approval[] | null;
  apiUrl: string;
  onUpdated: () => Promise<void>;
}) {
  const [decision, setDecision] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string>();
  const pending = approvals
    ? approvals.filter((approval) => approval.status === "pending")
    : items
        .filter((workflow) => workflow.approvalId)
        .map((workflow) => ({
          id: workflow.approvalId!,
          workflowId: workflow.id,
          artifactId: workflow.artifact?.reference ?? "fixture-artifact",
          action: "write-gatsby-content",
          risk: "medium" as const,
          status: "pending" as const,
          reason:
            "Founder approval is required before writing the draft into Gatsby.",
          createdAt: workflow.createdAt,
          updatedAt: workflow.updatedAt,
        }));

  async function decide(
    approval: Approval,
    value: "approved" | "rejected" | "changes-requested",
  ) {
    setBusy(approval.id);
    try {
      if (approvals) {
        const baseUrl = apiUrl.replace(/\/$/, "");
        const response = await fetch(
          `${baseUrl}/api/approvals/${approval.id}/decision`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ decision: value }),
          },
        );
        if (!response.ok) throw new Error(`API returned ${response.status}`);
        await onUpdated();
      }
      setDecision((current) => ({ ...current, [approval.id]: value }));
    } finally {
      setBusy(undefined);
    }
  }
  return (
    <>
      <Heading
        title="Approvals"
        copy="Consequential actions stay paused until you decide."
      />
      {pending.map((approval) => {
        const workflow = items.find((item) => item.id === approval.workflowId);
        const title =
          workflow?.artifact?.document.title ??
          workflow?.title ??
          "Tembusu Circle content";
        return (
          <section className="app-card" key={approval.id}>
            <div className="app-card-header">
              <h2>Publish “{title}”</h2>
              <Badge value={decision[approval.id] ?? "awaiting-approval"} />
            </div>
            <div className="app-card-pad">
              <p>
                Rick requires founder approval before Scribe’s Markdown can be
                published to Tembusu Circle.
              </p>
              <p className="app-copy">
                <strong>Risk:</strong> {approval.risk} · Gatsby website change
                <br />
                <strong>Reason:</strong> {approval.reason}
              </p>
              <div className="app-button-row">
                <button
                  className="app-button"
                  disabled={busy === approval.id}
                  onClick={() => void decide(approval, "approved")}
                >
                  Approve publication
                </button>
                <button
                  className="app-button secondary"
                  disabled={busy === approval.id}
                  onClick={() => void decide(approval, "changes-requested")}
                >
                  Request changes
                </button>
                <button
                  className="app-button danger"
                  disabled={busy === approval.id}
                  onClick={() => void decide(approval, "rejected")}
                >
                  Reject
                </button>
              </div>
              {decision[approval.id] && (
                <p className="app-stat-note" role="status">
                  Decision recorded as “{decision[approval.id]}”.
                </p>
              )}
            </div>
          </section>
        );
      })}
      {pending.length === 0 && (
        <section className="app-card app-card-pad">
          <p>No pending approvals.</p>
        </section>
      )}
    </>
  );
}

function DemoManager({ documents }: { documents: DemoDocument[] }) {
  const [selected, setSelected] = useState(
    documents[0] ?? markdownArtifacts[0],
  );
  useEffect(() => {
    if (documents.length) setSelected(documents[0]);
  }, [documents]);
  const rendered = useMemo(() => selected.markdown.split("\n\n"), [selected]);
  return (
    <>
      <Heading
        title="Tembusu Circle"
        copy="Manage the Markdown-powered terrarium business demo."
        actions={
          <a className="app-button secondary" href="http://localhost:8000">
            Preview Gatsby site
          </a>
        }
      />
      <div className="app-grid two">
        <section className="app-card">
          <div className="app-card-header">
            <h2>Content artifacts</h2>
            <span className="app-copy">{documents.length} artifacts</span>
          </div>
          <ul className="app-list">
            {documents.map((artifact) => (
              <li className="app-list-item" key={artifact.slug}>
                <div>
                  <button
                    onClick={() => setSelected(artifact)}
                    className="app-list-title"
                    style={{
                      border: 0,
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {artifact.title}
                  </button>
                  <div className="app-list-meta app-mono">{artifact.path}</div>
                </div>
                <Badge value={artifact.frontmatter.status} />
              </li>
            ))}
          </ul>
        </section>
        <section className="app-card">
          <div className="app-card-header">
            <h2>Publication controls</h2>
            <Badge value={selected.frontmatter.status} />
          </div>
          <div className="app-card-pad">
            <div className="app-stat-label">Target</div>
            <p className="app-mono">tembusu-circle/{selected.path}</p>
            <div className="app-button-row">
              <button
                className="app-button"
                disabled={selected.frontmatter.status === "draft"}
              >
                Publish to Gatsby
              </button>
              <a
                className="app-button secondary"
                href={`/app/workflows/${selected.workflowId}`}
              >
                Review workflow
              </a>
            </div>
            <p className="app-copy">
              Rick must approve this artifact before publication is enabled.
            </p>
          </div>
        </section>
      </div>
      <section className="app-card" style={{ marginTop: 16 }}>
        <div className="app-card-header">
          <h2>Markdown preview</h2>
          <span className="app-mono">{selected.slug}.md</span>
        </div>
        <div className="app-grid two" style={{ padding: 20 }}>
          <pre className="app-code">{selected.markdown}</pre>
          <article className="app-preview">
            <h2>{selected.title}</h2>
            <p>{selected.description}</p>
            {rendered.map((block, index) =>
              block.startsWith("## ") ? (
                <h3 key={index}>{block.slice(3)}</h3>
              ) : (
                <p key={index}>{block}</p>
              ),
            )}
          </article>
        </div>
      </section>
    </>
  );
}

export default function OrchestrationApp({
  view,
  workflowId,
  apiUrl = "",
}: {
  view: View;
  workflowId?: string;
  apiUrl?: string;
}) {
  const [liveWorkflows, setLiveWorkflows] = useState<Workflow[] | null>(null);
  const [liveApprovals, setLiveApprovals] = useState<Approval[] | null>(null);
  const [liveDocuments, setLiveDocuments] = useState<DemoDocument[] | null>(
    null,
  );

  const refresh = useCallback(
    async (signal?: AbortSignal) => {
      const baseUrl = apiUrl.replace(/\/$/, "");
      try {
        const [workflowResponse, approvalResponse, artifactResponse] =
          await Promise.all([
            fetch(`${baseUrl}/api/workflows`, {
              headers: { accept: "application/json" },
              signal,
            }),
            fetch(`${baseUrl}/api/approvals`, {
              headers: { accept: "application/json" },
              signal,
            }),
            fetch(`${baseUrl}/api/demo/content`, {
              headers: { accept: "application/json" },
              signal,
            }),
          ]);
        for (const response of [
          workflowResponse,
          approvalResponse,
          artifactResponse,
        ]) {
          if (!response.ok) throw new Error(`API returned ${response.status}`);
        }
        const workflowPayload = (await workflowResponse.json()) as {
          workflows?: Workflow[];
        };
        const approvalPayload = (await approvalResponse.json()) as {
          approvals?: Approval[];
        };
        const artifactPayload = (await artifactResponse.json()) as {
          artifacts?: Array<{
            workflowId: string;
            targetPath: string;
            document: MarkdownDocument;
          }>;
        };
        setLiveWorkflows(workflowPayload.workflows ?? []);
        setLiveApprovals(approvalPayload.approvals ?? []);
        setLiveDocuments(
          (artifactPayload.artifacts ?? []).map((artifact) => ({
            ...artifact.document,
            path: artifact.targetPath,
            workflowId: artifact.workflowId,
          })),
        );
      } catch {
        if (!signal?.aborted) {
          setLiveWorkflows(null);
          setLiveApprovals(null);
          setLiveDocuments(null);
        }
      }
    },
    [apiUrl],
  );

  useEffect(() => {
    const controller = new AbortController();
    void refresh(controller.signal);
    return () => controller.abort();
  }, [refresh]);

  const visibleWorkflows = liveWorkflows ?? workflows;
  const content =
    view === "dashboard" ? (
      <Dashboard items={visibleWorkflows} />
    ) : view === "workflows" ? (
      <Workflows workflows={visibleWorkflows} />
    ) : view === "workflow" ? (
      <WorkflowDetail workflowId={workflowId} items={visibleWorkflows} />
    ) : view === "agents" ? (
      <Agents />
    ) : view === "approvals" ? (
      <Approvals
        items={visibleWorkflows}
        approvals={liveApprovals}
        apiUrl={apiUrl}
        onUpdated={refresh}
      />
    ) : (
      <DemoManager documents={liveDocuments ?? markdownArtifacts} />
    );
  return (
    <Shell view={view} source={liveWorkflows !== null ? "live" : "fixtures"}>
      {content}
    </Shell>
  );
}
