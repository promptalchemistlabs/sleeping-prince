# Website Implementation Brief

## Assignment

Design and implement the first pre-release website for Kingdom of PAL.

The website must explain the product through one concrete outcome, earn trust,
and convert interested community founders into demo viewers or early-access
leads. It must not imply that Kingdom of PAL is installable before a working
installer and runnable release exist.

## Read first

Treat these files as the source of truth, in this order:

1. [`WEBSITE_PROPOSAL.md`](WEBSITE_PROPOSAL.md)
2. [`../README.md`](../README.md)
3. [`VISION.md`](VISION.md)
4. [`../agent-registry.yaml`](../agent-registry.yaml)
5. [`../founders-charter/CHARTER.md`](../founders-charter/CHARTER.md)
6. [`../approval-policies/default.yaml`](../approval-policies/default.yaml)
7. [`../workflow-definitions/community-campaign.yaml`](../workflow-definitions/community-campaign.yaml)

The presentation in `docs/presentation/` reflects an older six-agent model. Do
not copy its agent list or names. The current essential kingdom contains Orin,
Scribe, Rick, and Bastion.

## Product model

Kingdom of PAL is a governed operating team of independent AI agents for
community-driven businesses.

The four mandatory roles are:

- Orin — community coordination
- Scribe — content production
- Rick — security governance
- Bastion — system diagnosis

Core roles cannot be removed through the normal lifecycle. Their implementations
may be replaced by contract-compatible agents. Future extension agents may be
installed, disabled, upgraded, or removed.

## Approved positioning direction

Primary headline:

> Install the AI operating team your community needs.

Pre-release supporting line:

> Orin coordinates. Scribe creates. Rick protects. Bastion keeps the kingdom
> healthy. You remain in control of every consequential decision.

Until installation is real, the primary CTA must be:

> Watch the demo

Secondary CTAs:

- Join early access
- View on GitHub

Do not use **Install Kingdom**, download buttons, platform installers, pricing,
customer logos, testimonials, usage counters, or performance claims unless the
repository contains working evidence and the founder has approved the change.

## Reference website

Study the conversion structure of the official
[Hermes Agent website](https://hermes-agent.nousresearch.com/): clear promise,
immediate action, capability previews, and open-source trust signals.

Do not reproduce its visual design, assets, copy, code, branding, or single-agent
positioning. Kingdom of PAL must remain recognisably distinct and focused on a
governed multi-agent operating team.

## Required MVP

Create a static-first website under `website/` with these routes:

```text
/
/demo
/agents
/security
/docs
/early-access
```

The homepage must contain:

1. Hero with pre-release CTA
2. Founder-bottleneck problem
3. Four essential agents
4. Community-campaign workflow
5. Risk-based governance model
6. Extension-agent explanation
7. Verifiable open-architecture trust signals
8. Final demo or early-access CTA

The demo page must walk through:

```text
Community question
  -> Orin identifies a recurring need
  -> Scribe creates a campaign
  -> Rick reviews privacy and policy
  -> Founder approves
  -> Outcome and decision are recorded
```

The first version may be an interactive narrative. Do not simulate a functioning
backend or label mocked output as live.

## Technical direction

Preferred stack:

- Astro
- TypeScript
- Static-first rendering
- CSS variables and a small design-token system
- Markdown or MDX for documentation content
- Minimal dependencies

If the repository already contains a website stack when work begins, inspect it
before deciding whether to preserve or replace it. Do not introduce a second web
framework without a concrete reason.

Keep all website code inside `website/`. Do not modify the registry, contracts,
policies, or vision merely to make website copy easier.

## Visual direction

Theme: **Modern technical kingdom**.

The site should feel like an operating system with character, not a fantasy game
or generic SaaS dashboard.

Use:

- Strong typography and a clear first-screen action
- Warm parchment or pale stone surfaces
- Near-black primary text
- One restrained royal accent colour
- Subtle individual colours or symbols for the four agents
- Monospace styling for commands, manifests, and activity records
- A workflow visual demonstrating delegation, review, and approval
- Generous spacing and minimal navigation

Avoid:

- Excessive crowns, castles, shields, or medieval decoration
- Stock AI imagery, glowing brains, robots, and generic chat bubbles
- Dense dashboard card grids
- Unverifiable social proof
- Decorative animation that obscures the workflow

## Accessibility and performance

Required:

- WCAG AA colour contrast
- Semantic page landmarks and heading hierarchy
- Keyboard-accessible navigation and controls
- Visible focus states
- Reduced-motion support
- Useful alternative text
- No critical meaning communicated through colour alone
- Responsive layouts at mobile, tablet, and desktop widths
- No avoidable layout shift
- Optimised assets and sensible page weight

## Early-access behaviour

If no form provider or backend is configured, implement the early-access page as
an honest placeholder with a clearly marked configuration point. Do not silently
discard submissions.

Preferred fields once submission is functional:

- Email
- Community type
- Current operational bottleneck
- Technical or non-technical setup preference

Never commit API keys or service credentials.

## Content rules

- Write for community founders first and technical operators second.
- Lead with outcomes; use architecture to support credibility.
- Explain specialist agents through jobs and boundaries.
- Keep terminology consistent with the registry.
- Use British English to match the current vision.
- Distinguish current functionality, demonstrations, and future direction.
- Do not describe roadmap items as shipped features.

## Verification

Before handoff:

1. Install dependencies using the repository's selected package manager.
2. Run formatting, linting, type checks, and production build.
3. Test every route and CTA.
4. Inspect mobile and desktop layouts visually.
5. Check keyboard navigation and reduced-motion behaviour.
6. Confirm no stale agent names appear: Barik, Durik, or Keldor.
7. Confirm no install or download claim appears in the pre-release UI.
8. Confirm all product claims trace back to the source-of-truth files.
9. Report any mocked, placeholder, or unconfigured integration explicitly.

## Acceptance criteria

The implementation is complete when:

- All required routes build and render without errors.
- A first-time visitor can explain the product and four agent roles after viewing
  the homepage.
- The governed community-campaign workflow is the central product demonstration.
- The primary CTA is **Watch the demo**.
- Early-access behaviour is functional or explicitly labelled unconfigured.
- Core-versus-extension lifecycle rules are explained accurately.
- Accessibility and responsive checks pass.
- No unsupported product, customer, security, or performance claims are present.
- Setup and development commands are documented in `website/README.md`.

## Handoff expectations

At completion, provide:

- A concise summary of the implemented experience
- Paths to the main website entry points
- Commands used for validation
- Validation results
- Known limitations and unconfigured integrations
- Screenshots of the homepage and demo page at desktop and mobile sizes

Do not deploy, purchase a domain, connect a paid service, or publish externally
without explicit founder approval.
