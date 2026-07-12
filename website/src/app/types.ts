export type AgentId = "orin" | "scribe" | "rick" | "bastion";
export type WorkflowStatus =
  "queued" | "running" | "awaiting-approval" | "completed" | "failed";

export interface WorkflowStep {
  id: string;
  agent: AgentId | "founder";
  status: "pending" | "running" | "completed" | "blocked" | "failed";
  title: string;
  summary?: string;
  timestamp?: string;
}

export interface MarkdownDocument {
  kind: "blog-post" | "website-page";
  slug: string;
  title: string;
  description: string;
  frontmatter: {
    date?: string;
    status: "draft" | "approved" | "published";
    author: string;
    tags: string[];
    hero?: string;
  };
  markdown: string;
}

export interface Workflow {
  id: string;
  title: string;
  request: { channel: string; text: string; externalChatId: string | null };
  status: WorkflowStatus;
  currentAgent: AgentId | null;
  createdAt: string;
  updatedAt: string;
  steps: WorkflowStep[];
  approvalId?: string;
  artifact?: {
    type: "markdown";
    reference: string;
    document: MarkdownDocument;
  };
}

export interface Approval {
  id: string;
  workflowId: string;
  artifactId: string;
  action: string;
  risk: "medium" | "high";
  status: "pending" | "approved" | "rejected" | "changes-requested";
  reason: string;
  createdAt: string;
  updatedAt: string;
}
