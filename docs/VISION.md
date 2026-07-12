# Kingdom of PAL

> Build a fleet of agents to operate an AI community business.

## Overview

Kingdom of PAL is a modular operating system for community-driven businesses.

It coordinates specialised AI agents that live in independent repositories but operate under one shared vision, common contracts, clear permissions, and human approval rules.

The main Kingdom repository is a **repository of repositories**. It does not contain every agent implementation. It defines how agents are discovered, configured, governed, and coordinated.

The initial kingdom contains four essential agents:

1. Orin — community intelligence and coordination
2. Scribe — website, blog, and content production
3. Rick — cybersecurity and policy enforcement
4. Bastion — agent and infrastructure diagnosis

---

## The Problem

Community founders often manage engagement, content, websites, security, infrastructure, support, and business operations alone.

Individual AI tools can help with isolated tasks, but they rarely behave like members of the same organisation. They may not:

* Share the founder's vision
* Exchange context through consistent contracts
* Respect permissions and operating boundaries
* Collaborate across business functions
* Escalate risky decisions to a human
* Remain observable and diagnosable
* Evolve independently without breaking the wider system

The founder remains the integration layer and eventually becomes the bottleneck.

---

## The Solution

Kingdom of PAL provides the organisational layer for a fleet of independently developed agents.

The founder defines the kingdom through a **Founder's Charter** containing:

* Vision and mission
* Community values
* Brand voice
* Current priorities
* Operating principles
* Approval requirements
* Prohibited actions
* Success metrics

Each agent is installed from its own repository and registered with the kingdom through a standard manifest.

Every agent declares:

* Capabilities
* Inputs and outputs
* Tools
* Permissions
* Memory access
* Boundaries
* Approval requirements
* Escalation rules
* Health checks

This allows agents to evolve independently while remaining compatible with the wider kingdom.

---

# The Essential Kingdom

## Orin

**Repository:** `pal-agent-orin`

### Role

Community Steward and Kingdom Coordinator

### Responsibilities

* Understand community conversations and recurring needs
* Answer routine community questions
* Retrieve relevant community context
* Translate founder intentions into structured tasks
* Route work to the appropriate agent
* Coordinate multi-agent workflows
* Escalate sensitive decisions to the founder

### Boundaries

* Must not make major business decisions
* Must not expose private community information
* Must not publish or execute high-risk actions without approval
* Must provide only the minimum required context to other agents

---

## Scribe

**Repository:** `pal-agent-scribe`

### Role

Website, Blog, and Content Agent

### Responsibilities

* Turn community insights into articles and educational resources
* Maintain website copy and documentation
* Repurpose long-form content for social and community channels
* Preserve brand voice and original meaning
* Organise published knowledge
* Prepare content changes for approval

### Boundaries

* Must not publish without approval
* Must verify factual claims
* Must not expose confidential information
* Must not create misleading or exaggerated content

Scribe includes content remixing, so a separate social-media agent is not required for the initial kingdom.

---

## Rick

**Repository:** `pal-agent-rick`

### Role

Cybersecurity and Policy Enforcement Agent

### Responsibilities

* Review agent permissions and requested actions
* Detect unsafe or suspicious behaviour
* Enforce approval and access policies
* Block actions outside an agent's permissions
* Protect credentials, files, and private information
* Maintain security audit records
* Escalate security incidents immediately

### Boundaries

* Must prioritise safety over execution speed
* Must not reveal credentials or sensitive architecture
* Must not grant itself or other agents additional permissions
* Must require explicit approval for consequential actions

Rick answers:

> Is this action permitted and safe?

---

## Bastion

**Repository:** `pal-agent-bastion`

### Role

Agent and Infrastructure Doctor

### Responsibilities

* Check agent and service health
* Diagnose failed workflows and integrations
* Review logs, errors, and health-check results
* Monitor the shared memory hub and agent memory spokes
* Detect failed memory reads, writes, indexing, and synchronisation
* Measure retrieval latency, index freshness, and storage health
* Identify stale, duplicated, or orphaned memory records
* Recommend reindexing, recovery, or cleanup actions
* Identify configuration and dependency problems
* Recommend recovery actions
* Report operational risks to the founder

### Boundaries

* Must not modify production systems without approval
* Must not perform destructive recovery actions automatically
* Must not expose credentials or private configuration
* Must inspect memory metadata and health signals by default, not private business content
* Must not alter or delete memory records without approval
* Must request temporary access through Rick when content-level diagnosis is required
* Must send security-related findings to Rick

Bastion answers:

> Is the system functioning correctly?

Rick governs memory access and safety. Bastion diagnoses memory and system reliability. Their responsibilities must not overlap.

---

# Repository-of-Repositories Architecture

## Kingdom Repository

The main repository owns the organisational layer:

```text
sleeping-prince-and-6-dwarfs/
├── founders-charter/
├── agent-registry.yaml
├── shared-contracts/
├── workflow-definitions/
├── approval-policies/
├── memory/
├── demo/
└── docs/
```

It should contain:

* The Founder's Charter
* Agent registry
* Shared input and output contracts
* Workflow definitions
* Approval policies
* Memory access rules
* Activity logs
* Hackathon demo configuration

It should not duplicate the internal implementation of each agent.

## Agent Repositories

Each agent repository owns:

* Agent implementation
* System instructions
* Tool integrations
* Tests
* Deployment instructions
* Health-check endpoint
* Versioned agent manifest

Example registry entry:

```yaml
name: orin
repository: https://github.com/promptalchemistlabs/pal-agent-orin
version: 0.1.0
capabilities:
  - community-question-analysis
  - workflow-routing
permissions:
  - read:community-knowledge
  - write:workflow-tasks
healthcheck: /health
```

The kingdom should depend on declared contracts and versions rather than agent internals.

---

# Core Architecture

The initial system consists of six components:

## 1. Founder's Charter

The source of vision, priorities, values, policies, and approval rules for every agent.

## 2. Agent Registry

The catalogue of installed agents, repositories, versions, capabilities, permissions, and health checks.

## 3. Shared Contracts

Standard request and response formats that allow independently developed agents to collaborate.

## 4. Shared Kingdom Memory

Kingdom memory follows a hub-and-spoke model:

* Each agent owns a private memory spoke
* The shared hub stores approved organisational knowledge and cross-agent summaries
* A memory broker enforces access rules and retrieves permitted context
* Agents do not receive unrestricted access to another agent's raw memory

Before starting a task, an agent retrieves:

* Pinned context such as the Founder's Charter and active policies
* Semantically relevant memories
* A small number of recent memories
* Explicitly referenced workflow state

The initial retrieval strategy should combine the top three relevant memories with the top two recent memories. Relevance, recency, importance, and source trust should determine ranking.

After completing a task, the agent:

1. Writes detailed task memory to its own spoke
2. Publishes a concise reusable summary to the shared hub
3. Records the source agent, task, timestamp, visibility, and importance

Rick controls which memories an agent may access. Bastion monitors whether memory retrieval, indexing, and writes are functioning correctly.

## 5. Kingdom Coordinator

Orin initially performs request routing, context selection, task assignment, and result collection.

## 6. Governance and Observability

Rick enforces security and memory-access policies. Bastion monitors agent, infrastructure, and memory health. Important actions are logged and reviewable.

---

# Core Workflows

## Community Content Workflow

```text
Founder request
      |
      v
Orin identifies a recurring community need
      |
      v
Scribe creates and repurposes the content
      |
      v
Rick reviews privacy, permissions, and policy
      |
      v
Founder approves publication
      |
      v
Decision and output are stored in memory
```

## Operational Diagnosis Workflow

```text
Agent, workflow, or memory operation fails
      |
      v
Bastion checks health, logs, indexes, and dependencies
      |
      v
Bastion recommends a recovery action
      |
      v
Rick reviews the action if it changes access or production
      |
      v
Founder approves consequential changes
```

---

# Governance Model

## Low-Risk Actions

Agents may perform these automatically:

* Drafting content
* Summarising discussions
* Organising knowledge
* Creating task plans
* Running read-only health checks

## Medium-Risk Actions

Agents may prepare these actions but require founder approval:

* Publishing content
* Updating website pages
* Sending community messages
* Changing workflows or configuration
* Applying recommended operational fixes

## High-Risk Actions

Agents must never perform these without explicit approval:

* Deleting data
* Modifying production infrastructure
* Spending money
* Accessing or exposing credentials
* Changing permissions
* Sharing private community information
* Making legal or financial commitments

---

# Minimum Viable Kingdom

## Required Agents

1. Orin — community context and orchestration
2. Scribe — content creation and repurposing
3. Rick — security and policy review
4. Bastion — health checks and diagnosis

The primary demo should use Orin, Scribe, and Rick. Bastion should support a separate operational-health scenario.

## Required Platform Components

* Founder's Charter
* Agent registry
* Shared request and response contracts
* Task router
* Approval mechanism
* Activity log
* Private agent memory spokes
* Shared memory hub
* Permission-aware memory broker
* Hybrid relevant-and-recent Top-K retrieval
* Agent health-check contract
* Memory health-check contract

## Hackathon Non-Goals

The first version does not need:

* More agent roles
* A public agent marketplace
* Fully autonomous publishing
* Automated production recovery
* Complex long-term memory
* Support for every community platform
* A general-purpose multi-agent framework

The objective is to prove that independent agent repositories can operate as one governed organisation.

---

# Hackathon Demo

## Demo One: Community Campaign

The founder enters:

```text
Create an educational campaign based on the most common questions from my community.
```

Flow:

1. Orin reviews the community knowledge base.
2. Orin identifies a recurring problem.
3. Scribe creates an article and channel-specific versions.
4. Rick reviews the outputs for privacy and policy risks.
5. The founder approves the final content.
6. The kingdom records the workflow and decision.

## Demo Two: Agent Doctor

1. One agent or integration is deliberately misconfigured.
2. Bastion detects the failed health check.
3. Bastion diagnoses the likely cause.
4. Bastion recommends a recovery action.
5. Rick checks the action if it affects production or permissions.

## What the Demo Proves

* Agents can live in separate repositories
* Agents can be discovered through a shared registry
* Agents collaborate through standard contracts
* All agents follow the same organisational vision
* Sensitive actions remain under human control
* Security and operational health have distinct owners
* New agents can be added without redesigning the kingdom

---

# Design Principles

## Repository Independence

Agents can be developed, versioned, tested, and deployed independently.

## Contract-First Integration

Agents collaborate through stable manifests and shared input/output schemas.

## Start Small

The system must demonstrate value with the four essential agents before adding more.

## Human-Controlled

The founder remains responsible for consequential decisions.

## Least Privilege

Agents receive only the access required for their responsibilities.

## Observable

Every important workflow, decision, failure, and approval is reviewable.

## Tool-Agnostic

The kingdom should not depend entirely on one model, framework, or platform.

---

# Competitive Differentiation

Kingdom of PAL is not a collection of AI chatbots and not simply several agents running on the same server.

It provides:

* A reusable organisational structure
* Independently deployable agent repositories
* A standard agent registry and contracts
* Shared organisational context
* Explicit permissions and boundaries
* Multi-agent workflow coordination
* Human approval mechanisms
* Security enforcement
* Operational diagnosis

The core innovation is that independently developed agents behave like accountable members of the same organisation.

---

# Long-Term Vision

Kingdom of PAL can evolve into an ecosystem of installable agent repositories.

```text
kingdom install pal-agent-orin
kingdom install pal-agent-scribe
kingdom install pal-agent-rick
kingdom install pal-agent-bastion
```

Future agents can cover events, research, finance, partnerships, customer success, education, and product feedback.

New agents should be installable through a standard manifest without changing the core architecture.

---

# Success Metrics

The initial version should measure:

* Successful cross-repository workflows
* Workflow completion time
* Founder time saved
* Percentage of tasks requiring intervention
* Unsafe actions blocked by Rick
* Failures diagnosed by Bastion
* Time required to install a new agent
* Contract compatibility across agent versions

---

# One-Line Pitch

Kingdom of PAL is a repository-of-repositories that coordinates independent AI agents into one governed operating team for community-driven businesses.

# Short Pitch

Community founders often manage engagement, content, websites, security, and infrastructure alone.

Kingdom of PAL gives them a modular AI operating team. Each agent lives in its own repository, owns a specialised responsibility, and integrates through shared contracts.

Orin understands and coordinates the community. Scribe creates and maintains content. Rick protects the kingdom. Bastion keeps the system healthy.

Together, they operate under the Founder's Charter while keeping consequential decisions under human control.
