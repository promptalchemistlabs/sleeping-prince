import type { AgentId, MarkdownDocument, Workflow } from "./types";

const workshopPost: MarkdownDocument = {
  kind: "blog-post",
  slug: "price-your-first-terrarium-workshop",
  title: "How to price your first terrarium workshop",
  description: "A practical pricing guide for new terrarium founders.",
  frontmatter: {
    date: "2026-07-12",
    status: "draft",
    author: "Tembusu Circle",
    tags: ["pricing", "workshops", "getting-started"],
  },
  markdown:
    "## Start with the experience\n\nYour customer is not only buying a glass vessel and plants. They are buying a guided, calming experience.\n\n## Build your floor price\n\nAdd materials, venue, facilitation time, payment fees and a 15% contingency before setting your margin.",
};

export const workflows: Workflow[] = [
  {
    id: "wf-1042",
    title: "First workshop pricing guide",
    request: {
      channel: "telegram",
      text: "Create a practical blog post that helps members price their first terrarium workshop.",
      externalChatId: "chat-demo-001",
    },
    status: "awaiting-approval",
    currentAgent: "rick",
    createdAt: "2026-07-12T02:14:00Z",
    updatedAt: "2026-07-12T02:22:00Z",
    approvalId: "apr-289",
    artifact: {
      type: "markdown",
      reference:
        "artifact://scribe/wf-1042/price-your-first-terrarium-workshop.md",
      document: workshopPost,
    },
    steps: [
      {
        id: "s1",
        agent: "orin",
        status: "completed",
        title: "Interpret Telegram request",
        summary: "Routed a blog brief to Scribe.",
        timestamp: "02:14",
      },
      {
        id: "s2",
        agent: "scribe",
        status: "completed",
        title: "Draft Markdown article",
        summary: "Produced a 640-word pricing guide.",
        timestamp: "02:20",
      },
      {
        id: "s3",
        agent: "rick",
        status: "blocked",
        title: "Review publishing action",
        summary: "Founder approval required before publication.",
        timestamp: "02:22",
      },
      {
        id: "s4",
        agent: "bastion",
        status: "pending",
        title: "Verify Gatsby build",
      },
    ],
  },
  {
    id: "wf-1041",
    title: "Corporate terrarium services page",
    request: {
      channel: "telegram",
      text: "Refresh our corporate workshop services page.",
      externalChatId: "chat-demo-001",
    },
    status: "running",
    currentAgent: "scribe",
    createdAt: "2026-07-12T01:42:00Z",
    updatedAt: "2026-07-12T02:06:00Z",
    steps: [
      {
        id: "s1",
        agent: "orin",
        status: "completed",
        title: "Create website brief",
        timestamp: "01:42",
      },
      {
        id: "s2",
        agent: "scribe",
        status: "running",
        title: "Draft services page",
        summary: "Writing benefits and package structure.",
        timestamp: "02:06",
      },
      { id: "s3", agent: "rick", status: "pending", title: "Review claims" },
    ],
  },
  {
    id: "wf-1038",
    title: "Beginner moss care article",
    request: {
      channel: "telegram",
      text: "Publish our beginner moss care notes as a blog post.",
      externalChatId: "chat-demo-002",
    },
    status: "completed",
    currentAgent: "bastion",
    createdAt: "2026-07-11T09:12:00Z",
    updatedAt: "2026-07-11T09:31:00Z",
    steps: [
      {
        id: "s1",
        agent: "orin",
        status: "completed",
        title: "Route content request",
        timestamp: "09:12",
      },
      {
        id: "s2",
        agent: "scribe",
        status: "completed",
        title: "Create article",
        timestamp: "09:23",
      },
      {
        id: "s3",
        agent: "rick",
        status: "completed",
        title: "Approve safe content",
        timestamp: "09:27",
      },
      {
        id: "s4",
        agent: "bastion",
        status: "completed",
        title: "Verify build health",
        timestamp: "09:31",
      },
    ],
  },
];

export const agents: Array<{
  id: AgentId;
  name: string;
  role: string;
  status: "online" | "working";
  current: string;
  memory: number;
}> = [
  {
    id: "orin",
    name: "Orin",
    role: "Telegram coordinator",
    status: "online",
    current: "Watching Telegram",
    memory: 24,
  },
  {
    id: "scribe",
    name: "Scribe",
    role: "Content producer",
    status: "working",
    current: "Drafting services page",
    memory: 18,
  },
  {
    id: "rick",
    name: "Rick",
    role: "Security governor",
    status: "working",
    current: "Waiting for approval",
    memory: 31,
  },
  {
    id: "bastion",
    name: "Bastion",
    role: "System doctor",
    status: "online",
    current: "All checks healthy",
    memory: 12,
  },
];

export const markdownArtifacts = [
  {
    ...workshopPost,
    path: "content/blog/price-your-first-terrarium-workshop.md",
    workflowId: "wf-1042",
  },
  {
    kind: "website-page" as const,
    slug: "corporate-workshops",
    title: "Corporate terrarium workshops",
    description: "Team experiences made tangible.",
    frontmatter: {
      status: "draft" as const,
      author: "Tembusu Circle",
      tags: ["services", "teams"],
    },
    markdown:
      "## Grow something together\n\nA hands-on team experience built around focus, care and living systems.",
    path: "content/pages/corporate-workshops.md",
    workflowId: "wf-1041",
  },
];
