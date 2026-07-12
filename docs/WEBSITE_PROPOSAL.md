# Kingdom of PAL Website Proposal

Status: Draft for founder review

Audience: Community founders, technical operators, and early agent builders
Reference: [Hermes Agent](https://hermes-agent.nousresearch.com/)

## 1. Executive proposal

Build a product-led website that makes Kingdom of PAL feel installable,
understandable, and trustworthy.

The website should borrow the strongest conversion pattern from Hermes Agent:

1. Lead with one differentiated outcome.
2. Put the primary action above the fold.
3. Demonstrate capabilities as concrete jobs, not abstract architecture.
4. Make installation and first success feel short.
5. Reinforce trust with open-source, security, version, and documentation signals.

Kingdom of PAL is not another personal agent, so the message should not imitate
Hermes. Hermes sells one agent that grows with the user. Kingdom of PAL should
sell a governed operating team that grows with the founder's business.

Recommended positioning:

> Install the AI operating team your community needs.

Supporting line:

> Four specialised agents coordinate community insight, content, security, and
> system health—under your rules and approval.

## 2. Product-readiness constraint

The current repository defines the organisation and contracts but does not yet
provide a runnable platform, installer, or CLI. A prominent "Install" call to
action would therefore create expectation debt.

Use a staged conversion strategy:

### Pre-release website

- Primary CTA: **Watch the demo**
- Secondary CTA: **Join early access**
- Technical CTA: **View on GitHub**
- Show proposed install commands only as a labelled preview.

### Installable release website

- Primary CTA: **Install Kingdom**
- Secondary CTA: **Read the quickstart**
- Detect the visitor's platform and display the correct command.
- Promise a measurable first outcome, such as "Run your first governed workflow
  in five minutes," only after the onboarding flow achieves it reliably.

## 3. Target audience

### Primary: community founder-operator

Someone running a creator community, professional network, membership group,
education cohort, or open-source community without a full operating team.

Their problem is not a shortage of AI tools. It is that they remain responsible
for connecting context, delegating work, checking quality, and approving risk.

Desired outcome:

> Turn recurring community needs into consistent, governed execution without
> becoming the integration layer.

### Secondary: technical operator

A developer or automation lead who wants independently deployable agents,
versioned contracts, explicit permissions, observable workflows, and freedom to
replace implementations.

### Tertiary: agent builder

A developer who may eventually publish an extension agent compatible with the
Kingdom registry and contracts.

The first website should optimise for the founder-operator. Architecture exists
to create trust, not to dominate the homepage.

## 4. Homepage narrative

### Section 1: Hero

Eyebrow:

> Open architecture · Human governed

Headline:

> Install the AI operating team your community needs.

Subheadline:

> Orin coordinates. Scribe creates. Rick protects. Bastion keeps the kingdom
> healthy. You remain in control of every consequential decision.

Pre-release actions:

- **Watch the demo**
- **Join early access**
- View on GitHub

Release-state actions:

- **Install Kingdom**
- Read the quickstart
- View on GitHub

Hero visual:

A live-looking workflow, not a generic chatbot screenshot:

```text
Community question
        ↓
Orin finds a recurring need
        ↓
Scribe creates a campaign
        ↓
Rick requests approval
        ↓
Founder approves
```

### Section 2: The founder bottleneck

Headline:

> Your tools can generate. You still have to operate.

Copy:

> Community conversations, content, websites, security, and infrastructure live
> in different places. The founder carries context between them, checks every
> handoff, and becomes the operating system.

Contrast the current state with the Kingdom outcome:

| Disconnected tools | Kingdom of PAL |
| --- | --- |
| Repeated prompting | Shared organisational context |
| Manual handoffs | Contract-based workflows |
| Unclear permissions | Bounded agent access |
| Hidden failures | Health checks and audit history |
| Founder checks everything | Risk-based human approval |

### Section 3: Meet the essential kingdom

Headline:

> Four roles. One accountable operating team.

Each agent should be presented through an outcome and one boundary:

- **Orin — Community Coordinator:** turns recurring community needs into routed
  work. Does not make major business decisions.
- **Scribe — Content Producer:** creates and repurposes useful content. Does not
  publish without approval.
- **Rick — Security Governor:** reviews permissions, privacy, and consequential
  actions. Cannot grant additional permissions autonomously.
- **Bastion — System Doctor:** diagnoses agent, integration, and memory health.
  Does not perform destructive recovery automatically.

Primary message:

> The four roles are permanent. Their implementations can evolve.

### Section 4: Show one complete outcome

Headline:

> One community question becomes a governed campaign.

Use a short animated or interactive workflow:

1. Orin finds the repeated question.
2. Scribe produces an article and channel-specific versions.
3. Rick checks privacy and policy.
4. The founder approves publication.
5. The outcome and decision become reusable memory.

CTA: **See the workflow**

This should be the central proof of value. Avoid presenting every possible use
case before this workflow is operational.

### Section 5: Governance as a product feature

Headline:

> Autonomy increases only when risk is explicit.

Present the three risk levels:

- **Low risk:** agents draft, summarise, organise, and diagnose automatically.
- **Medium risk:** agents prepare; the founder approves publishing, messaging,
  website changes, and operational fixes.
- **High risk:** security review and explicit founder approval protect data,
  production, money, credentials, and permissions.

CTA: **Read the security model**

### Section 6: Install and extend

Pre-release headline:

> The first kingdom is being assembled.

Pre-release content:

- Demonstration status
- Supported workflow
- Early-access form
- Links to the registry and contracts

Release headline:

> Start with the essential kingdom. Add capability when you need it.

Future install experience:

```bash
kingdom init
kingdom demo community-campaign
kingdom agent list
kingdom agent install <extension-repository>
```

Explain that core roles cannot be removed through the normal lifecycle, while
extension agents can be installed, disabled, upgraded, or uninstalled.

### Section 7: Open architecture and trust

Show verifiable signals rather than invented testimonials:

- Public source repository
- Current release version
- Licence once selected
- Registry and contract documentation
- Security and approval model
- Changelog
- Health status when hosted components exist

Do not show vanity counters, customer logos, or time-saved claims until they are
real and attributable.

### Section 8: Final CTA

Pre-release:

> See what a governed AI team can do for your community.

Actions: **Watch the demo** · Join early access

Release:

> Build your first kingdom.

Actions: **Install Kingdom** · Read the quickstart

## 5. Information architecture

### MVP routes

```text
/
├── /demo                 # Primary community-campaign walkthrough
├── /agents               # Four core roles and extension model
├── /security             # Permissions, approvals, and trust model
├── /docs                 # Quickstart and architecture entry point
└── /early-access         # Pre-release conversion
```

External links:

- GitHub repository
- Issue tracker
- Community channel when available

### Release routes

```text
/install                  # Platform-aware installer and verification
/docs/quickstart          # Install to first successful workflow
/docs/registry            # Agent lifecycle and manifest reference
/docs/contracts           # Task and approval schemas
/docs/memory              # Hub-and-spoke memory model
/docs/workflows           # Workflow authoring
/changelog                # Release history
```

An agent marketplace should not appear in the first navigation. Introduce it
only after third-party or internally independent extension agents can actually be
installed and validated.

## 6. Visual direction

Recommended theme: **Modern technical kingdom**.

The interface should feel like an operating system with character—not a fantasy
game and not a generic SaaS dashboard.

Principles:

- Strong typographic headline and immediate CTA
- Warm parchment or pale stone background with near-black text
- One royal accent colour, supported by restrained agent-specific colours
- Simple line illustrations or symbolic portraits for the four agents
- Workflow motion that demonstrates delegation, review, and approval
- Monospace treatment for commands, manifests, and activity records
- Generous spacing and minimal navigation
- Subtle heraldic cues; avoid castles, crowns, and medieval decoration everywhere

Accessibility requirements:

- WCAG AA contrast
- Full keyboard navigation
- Reduced-motion mode for workflow animations
- Semantic headings and labelled controls
- No critical information encoded only through agent colour

## 7. Conversion and onboarding

The website should optimise for one activation event:

> A visitor completes the community-campaign demo or successfully runs it locally.

Pre-release funnel:

```text
Homepage -> demo -> early-access signup -> founder interview
```

Release funnel:

```text
Homepage -> install -> quickstart -> first workflow -> optional extension
```

Early-access form fields should remain minimal:

- Email
- Community type
- Current operational bottleneck
- Technical or non-technical setup preference

The bottleneck response is more valuable than company size at this stage because
it supports problem discovery and positioning.

## 8. Proposed technical approach

Recommended MVP:

- Static-first website using Astro and TypeScript
- Component styling with CSS variables and a small token system
- Markdown/MDX documentation sourced from the repository
- Deploy previews for every pull request
- Privacy-respecting analytics
- Accessible, progressively enhanced workflow animation
- No account system in the website MVP

Suggested repository location:

```text
website/
├── src/
│   ├── components/
│   ├── content/docs/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
└── package.json
```

Astro is recommended because the initial product surface is content-heavy,
performance-sensitive, and mostly static. Reconsider the stack only when the
website must become an authenticated control plane.

## 9. Content and asset requirements

Required before implementation:

- Final product name and domain
- Logo or wordmark direction
- One-sentence positioning approval
- Early-access destination or form provider
- GitHub visibility decision
- Licence decision
- A recorded or interactive community-campaign demo
- Accurate release status

Useful later:

- Agent portraits or symbols
- Product screenshots
- Install verification instructions
- Real founder feedback
- Security disclosure and contribution policies

## 10. Delivery phases

### Phase 0 — Foundation

- Approve positioning, audience, CTA, and domain
- Produce low-fidelity homepage wireframe
- Define visual system and agent identities
- Decide early-access workflow

### Phase 1 — Pre-release website

- Build homepage and demo narrative
- Publish agents and security pages
- Add early-access conversion
- Connect GitHub and initial docs
- Add basic analytics

### Phase 2 — Installable launch

- Replace early-access CTA with platform-aware installation
- Publish quickstart and release verification
- Add version, changelog, and support paths
- Measure install-to-first-workflow completion

### Phase 3 — Extension ecosystem

- Publish manifest and contract authoring guides
- Add extension discovery only after validation and uninstall flows work
- Introduce compatibility, provenance, and security-review signals

## 11. Success metrics

Pre-release:

- Demo completion rate
- Early-access conversion rate
- Number of qualified founder interviews
- Most frequently reported operational bottlenecks
- GitHub visits from the product website

Release:

- Installer start and completion rate
- Time to first successful workflow
- First-workflow completion rate
- Approval completion and abandonment rate
- Seven-day return rate
- Extension install success rate when extensions launch

Avoid optimising for raw page views. The useful signal is whether visitors reach
and understand the governed workflow.

## 12. Recommendation

Proceed with a pre-release website centred on one demonstrable outcome: the
governed community campaign.

Do not lead with "multi-agent operating system," repository structure, or shared
memory. Those are supporting mechanisms. Lead with the founder outcome:

> A coordinated AI team turns community needs into approved execution while you
> remain in control.

Once the installer and first-run experience are reliable, change the primary CTA
from **Watch the demo** to **Install Kingdom**. That is the point where the
Hermes-style download experience becomes credible and commercially useful.

## Reference notes

The Hermes Agent homepage currently places desktop and terminal installation
directly below its promise, then demonstrates six specific capabilities and
finishes with product/version and open-source signals. Its public repository also
provides a quick installer, getting-started commands, documentation, licence, and
release history. These patterns informed this proposal; Kingdom of PAL's copy,
information architecture, and product positioning remain distinct.

Sources:

- [Hermes Agent homepage](https://hermes-agent.nousresearch.com/)
- [Hermes Agent GitHub repository](https://github.com/NousResearch/hermes-agent)
- [Kingdom of PAL vision](VISION.md)
