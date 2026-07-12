import { createOrin } from "../../agents/orin/src/orin.mjs";
import {
  normalizeTelegramUpdate,
  telegramRequestToTask,
} from "../../agents/orin/src/telegram.mjs";
import { createConfiguredScribe } from "../../agents/scribe/src/scribe.mjs";
import { createRick } from "../../agents/rick/src/rick.mjs";
import { createBastion } from "../../agents/bastion/src/bastion.mjs";

function timestamp(now) {
  return now().toISOString();
}

export async function createOrchestration({
  store,
  publisher,
  now = () => new Date(),
  id = () => crypto.randomUUID(),
  specialistOverrides = {},
} = {}) {
  const scribe = specialistOverrides.scribe ?? (await createConfiguredScribe());
  const rick = specialistOverrides.rick ?? createRick();
  const bastion = specialistOverrides.bastion ?? createBastion();
  const specialists = { scribe, rick, bastion, ...specialistOverrides };

  async function dispatch(task) {
    const specialist = specialists[task.recipient];
    if (!specialist) throw new Error(`Specialist ${task.recipient} is unavailable`);
    if (typeof specialist.execute === "function") return specialist.execute(task);
    if (typeof specialist.handleTask === "function") {
      const normalizedTask = task.recipient === "rick" && !task.inputs?.action
        ? { ...task, inputs: { ...task.inputs, action: task.inputs?.requestedAction ?? "review-request" } }
        : task;
      return specialist.handleTask(normalizedTask);
    }
    throw new Error(`Specialist ${task.recipient} has no task entrypoint`);
  }

  const orin = createOrin({ dispatch, id });

  async function audit(type, workflowId, details = {}) {
    return store.addAudit({
      id: `audit-${id()}`,
      type,
      workflowId,
      details,
      createdAt: timestamp(now),
    });
  }

  async function submitTask(task) {
    const result = await orin.handleTask(task);
    const workflow = result.outputs?.workflow;
    if (!workflow) return result;

    await store.saveMemory("orin", {
      id: `memory-${id()}`,
      taskId: task.taskId,
      workflowId: task.workflowId,
      type: "routing-summary",
      content: result.summary,
      createdAt: timestamp(now),
    });

    const specialistResult = result.outputs.dispatchedResult;
    const specialistStep = workflow.steps.at(-1);
    specialistStep.status = specialistResult?.status === "completed" ? "completed" : "failed";
    specialistStep.summary = specialistResult?.summary;
    specialistStep.timestamp = timestamp(now);

    if (specialistResult?.agentId === "scribe" && specialistResult.status === "completed") {
      const document = specialistResult.outputs.document;
      const artifact = {
        id: specialistResult.artifacts[0].reference,
        workflowId: workflow.id,
        status: "draft",
        kind: document.kind,
        slug: document.slug,
        title: document.title,
        document,
        markdown: document.markdown,
        targetPath: specialistResult.outputs.publication.targetPath.replace(/^tembusu-circle\//, ""),
        createdAt: timestamp(now),
      };
      const governanceTask = {
        contractVersion: "v1alpha1",
        taskId: `task-${id()}`,
        workflowId: workflow.id,
        parentTaskId: specialistResult.taskId,
        sender: "scribe",
        recipient: "rick",
        objective: `Review Gatsby publication for ${document.title}`,
        inputs: {
          action: "write-gatsby-content",
          payloadReference: artifact.id,
        },
        contextReferences: [artifact.id],
        risk: "medium",
        approvalId: null,
        requestedAt: timestamp(now),
      };
      const governanceResult = await rick.handleTask(governanceTask);
      const approvalRequest = governanceResult.outputs?.approvalRequest;
      if (!approvalRequest) {
        throw new Error(`Rick did not create the required approval: ${governanceResult.summary}`);
      }
      const approval = {
        id: approvalRequest.approvalId,
        workflowId: workflow.id,
        artifactId: artifact.id,
        requestedBy: "scribe",
        reviewedBy: "rick",
        action: approvalRequest.action,
        risk: approvalRequest.risk,
        status: "pending",
        reason: approvalRequest.reason,
        request: approvalRequest,
        createdAt: timestamp(now),
        updatedAt: timestamp(now),
      };
      await store.saveArtifact(artifact);
      await store.saveApproval(approval);
      await store.saveMemory("scribe", {
        id: `memory-${id()}`,
        taskId: specialistResult.taskId,
        workflowId: workflow.id,
        type: "content-summary",
        content: specialistResult.memorySummary,
        artifactId: artifact.id,
        createdAt: timestamp(now),
      });
      await store.saveMemory("rick", {
        id: `memory-${id()}`,
        taskId: governanceResult.taskId,
        workflowId: workflow.id,
        type: "governance-decision",
        content: governanceResult.memorySummary,
        approvalId: approval.id,
        createdAt: timestamp(now),
      });
      workflow.status = "awaiting-approval";
      workflow.currentAgent = "rick";
      workflow.approvalId = approval.id;
      workflow.artifact = {
        ...artifact,
        type: "markdown",
        reference: artifact.id,
        document,
      };
      workflow.steps.push(
        {
          id: `step-rick-${id()}`,
          agent: "rick",
          status: "completed",
          title: "Review publishing permission",
          summary: governanceResult.summary,
          timestamp: timestamp(now),
        },
        {
          id: `step-founder-${id()}`,
          agent: "founder",
          status: "pending",
          title: "Approve Gatsby publication",
        },
      );
    } else {
      workflow.status = specialistResult?.status === "completed" ? "completed" : "failed";
      workflow.currentAgent = null;
    }

    workflow.updatedAt = timestamp(now);
    await store.saveWorkflow(workflow);
    await audit("workflow.updated", workflow.id, { status: workflow.status });
    return { ...result, outputs: { ...result.outputs, workflow } };
  }

  async function submitTelegramUpdate(update) {
    const request = normalizeTelegramUpdate(update);
    return submitTask(telegramRequestToTask(request, { id }));
  }

  async function createWorkflow({ objective, contentType = "blog", channel = "dashboard" }) {
    const createdAt = timestamp(now);
    return submitTask({
      contractVersion: "v1alpha1",
      taskId: `task-${id()}`,
      workflowId: `workflow-${id()}`,
      parentTaskId: null,
      sender: channel,
      recipient: "orin",
      objective,
      inputs: { contentType },
      contextReferences: [],
      risk: "low",
      approvalId: null,
      requestedAt: createdAt,
    });
  }

  async function decideApproval(approvalId, decision) {
    if (!new Set(["approved", "rejected", "changes-requested"]).has(decision)) {
      throw new TypeError("decision must be approved, rejected, or changes-requested");
    }
    const approval = await store.getApproval(approvalId);
    if (!approval) throw new Error("Approval not found");
    if (approval.status !== "pending") throw new Error("Approval has already been decided");
    const workflow = await store.getWorkflow(approval.workflowId);
    const artifacts = await store.listArtifacts();
    const artifact = artifacts.find((candidate) => candidate.id === approval.artifactId);
    if (!workflow || !artifact) throw new Error("Approval references missing workflow data");

    approval.status = decision;
    approval.updatedAt = timestamp(now);
    approval.decidedBy = "founder";
    const approvalDecision = {
      contractVersion: "v1alpha1",
      approvalId: approval.id,
      decision,
      decidedBy: "founder",
      reason: decision === "rejected" ? "Founder rejected the publication." : null,
      conditions: [],
      decidedAt: approval.updatedAt,
    };
    const governanceReview = await rick.reviewApproval({
      request: approval.request,
      decision: approvalDecision,
    });
    approval.governance = governanceReview.governance;
    workflow.steps.find((step) => step.agent === "founder").status =
      decision === "approved" ? "completed" : decision === "rejected" ? "failed" : "blocked";

    if (decision === "approved") {
      if (governanceReview.governance.outcome !== "allow") {
        throw new Error("Rick did not allow the approved Gatsby publication");
      }
      const publication = await publisher.publish(artifact);
      artifact.status = "published";
      artifact.publication = publication;
      artifact.document = {
        ...artifact.document,
        frontmatter: { ...artifact.document.frontmatter, status: "published" },
      };
      workflow.status = "completed";
      workflow.currentAgent = null;
      workflow.artifact = {
        ...artifact,
        type: "markdown",
        reference: artifact.id,
      };
      await audit("artifact.published", workflow.id, publication);
    } else if (decision === "rejected") {
      artifact.status = "rejected";
      workflow.status = "failed";
      workflow.currentAgent = null;
      await audit("approval.rejected", workflow.id, { approvalId });
    } else {
      artifact.status = "draft";
      workflow.status = "awaiting-approval";
      workflow.currentAgent = "scribe";
      await audit("approval.changes-requested", workflow.id, { approvalId });
    }

    workflow.updatedAt = timestamp(now);
    await Promise.all([
      store.saveApproval(approval),
      store.saveArtifact(artifact),
      store.saveWorkflow(workflow),
    ]);
    return { approval, workflow, artifact };
  }

  async function diagnose() {
    const diagnostic = await bastion.diagnose();
    await store.saveMemory("bastion", {
      id: `memory-${id()}`,
      taskId: null,
      workflowId: null,
      type: "diagnostic-summary",
      content: diagnostic.summary,
      diagnosticId: diagnostic.id,
      status: diagnostic.status,
      createdAt: timestamp(now),
    });
    await audit("diagnostic.completed", null, {
      diagnosticId: diagnostic.id,
      status: diagnostic.status,
      escalateToRick: diagnostic.escalateToRick,
    });
    return diagnostic;
  }

  return {
    orin,
    submitTask,
    submitTelegramUpdate,
    createWorkflow,
    decideApproval,
    diagnose,
  };
}
