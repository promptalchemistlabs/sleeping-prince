export const navigation = [
  { href: "/demo", label: "Demo" },
  { href: "/agents", label: "Agents" },
  { href: "/security", label: "Security" },
  { href: "/docs", label: "Docs" },
];

export const agents = [
  {
    id: "orin",
    name: "Orin",
    monogram: "O",
    role: "Community coordinator",
    outcome: "Turns recurring community needs into routed, structured work.",
    boundary:
      "Does not make major business decisions or expose private community information.",
    accent: "var(--orin)",
  },
  {
    id: "scribe",
    name: "Scribe",
    monogram: "S",
    role: "Content producer",
    outcome: "Creates useful content and adapts it for community channels.",
    boundary: "Does not publish without approval or create misleading claims.",
    accent: "var(--scribe)",
  },
  {
    id: "rick",
    name: "Rick",
    monogram: "R",
    role: "Security governor",
    outcome: "Reviews permissions, privacy, policy and consequential actions.",
    boundary: "Cannot expand permissions or bypass required founder approval.",
    accent: "var(--rick)",
  },
  {
    id: "bastion",
    name: "Bastion",
    monogram: "B",
    role: "System doctor",
    outcome: "Diagnoses agent, integration, infrastructure and memory health.",
    boundary:
      "Does not perform destructive recovery or production changes automatically.",
    accent: "var(--bastion)",
  },
];

export const workflowSteps = [
  {
    actor: "Orin",
    title: "Identify the recurring need",
    detail: "Analyses community questions and routes a clear campaign brief.",
    risk: "Low risk · automatic",
  },
  {
    actor: "Scribe",
    title: "Create and remix content",
    detail: "Prepares an educational article and channel-specific versions.",
    risk: "Low risk · automatic draft",
  },
  {
    actor: "Rick",
    title: "Review privacy and policy",
    detail: "Checks the proposed content and permissions before publication.",
    risk: "Medium risk · review",
  },
  {
    actor: "Founder",
    title: "Approve publication",
    detail:
      "Makes the consequential decision; no publication is performed in this demo.",
    risk: "Medium risk · approval required",
  },
  {
    actor: "Orin",
    title: "Record the outcome",
    detail:
      "Creates a reviewable workflow summary with the decision and provenance.",
    risk: "Low risk · recorded",
  },
];

export const githubUrl =
  "https://github.com/promptalchemistlabs/sleeping-prince";
