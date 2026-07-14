# Modernization AI Lab Product Constitution

**Status:** Governing product document

**Applies to:** Product design, engineering, demonstrations, and roadmap decisions

**Primary near-term horizon:** OpenAI Build Week

This constitution defines the durable product direction for Modernization AI
Lab. It is the first reference for product and implementation decisions. When a
work packet conflicts with this document, the conflict must be made explicit
before implementation proceeds.

## 1. Product Vision

Modernization AI Lab is an AI modernization agency that helps enterprises
understand legacy estates, form defensible modernization decisions, and produce
implementation-ready outcomes.

The product turns modernization from a fragmented collection of assessments,
documents, dashboards, and chat sessions into visible, governed work. Users act
as **Mission Commander**: they set direction, inspect evidence, resolve high-risk
decisions, and remain accountable for consequential approvals. AI specialists
operate as an elite task force around shared modernization cases.

The near-term product must deliver a clear, reliable demonstration while
establishing concepts that can grow into a provider-agnostic enterprise
platform.

## 2. Product Principles

1. **Make work visible.** Show what is being worked on, who owns it, why it has
   paused, and what happens next.
2. **Center the work object.** Modernization cases, evidence, decisions, and
   artifacts are more important than chat transcripts or agent personalities.
3. **Preserve human accountability.** AI may investigate, explain, recommend,
   and produce artifacts; people approve high-risk decisions.
4. **Ground every outcome.** Recommendations must trace to synthetic enterprise
   evidence, deterministic calculations, and stored artifacts.
5. **Build an agency, not a chatbot.** Specialists have explicit mandates,
   boundaries, inputs, outputs, and handoffs.
6. **Prefer the smallest reliable path.** A working, understandable happy path
   is more valuable than broad but fragile capability.
7. **Keep the product approachable and serious.** The experience may feel alive
   and memorable without becoming childish, theatrical, or game-like.
8. **Design for graceful degradation.** Core workflows must remain useful when
   an AI provider is unavailable.
9. **Use only synthetic enterprise data.** Demonstrations must not expose real
   customer data, credentials, or secrets.
10. **Evolve without breaking the story.** New horizons extend the product; they
    do not invalidate its core objects, governance model, or user role.

## 3. Three Product Horizons

### Horizon 1: OpenAI Build Week

The current implementation is optimized for a compelling, stable OpenAI Build
Week submission. It must demonstrate one end-to-end modernization happy path
for Apex Aerospace Manufacturing, including portfolio discovery, assessment,
human-governed decision making, and an Oracle-to-BigQuery starter package for
the Customer Analytics Warehouse.

Priorities are demo clarity, deterministic fallback behavior, stored outputs,
visible specialist work, and production-quality execution within the existing
Python and Streamlit architecture. The standalone Mission Control prototype may
explore future interaction patterns without destabilizing the working product.

### Horizon 2: Google Hackathon

The second horizon adapts the same product model to Google-aligned services and
demonstrates portability rather than a separate product. Google models,
BigQuery, and relevant Google developer tooling may become first-class adapters,
while cases, workflows, evidence, decisions, and validation contracts remain
unchanged.

Compatibility is preserved by isolating provider integrations behind explicit
interfaces and keeping business rules outside model prompts.

### Horizon 3: Long-Term Product

The long-term product is a governed enterprise modernization operating system.
It supports multiple portfolios, repeatable assessment methods, configurable
specialist teams, durable audit trails, implementation factories, validation,
wave planning, and executive roadmaps.

Enterprise scale must be earned incrementally. Multi-tenancy, broad integration
catalogs, advanced orchestration, and cloud deployment are introduced only when
validated needs justify their complexity.

## 4. Provider-Agnostic Architecture

Product concepts must not depend on a single model provider. Providers supply
reasoning and language capabilities through replaceable adapters; they do not
own workflow state or product rules.

- Domain objects, workflow stages, scoring rules, and approvals remain
  provider-neutral.
- Numeric scores are calculated by deterministic application code, never
  invented by a language model.
- Prompts and responses use explicit, versioned schemas where practical.
- Provider failures trigger transparent deterministic fallbacks.
- Stored artifacts record relevant provenance without exposing secrets.
- OpenAI may be the optimized provider for Horizon 1, and Google may be added in
  Horizon 2, without forking the core product model.

Provider abstraction must remain proportionate. Introduce interfaces where a
real portability boundary exists; do not build speculative frameworks.

## 5. Mission Control Philosophy

Mission Control provides enterprise portfolio visibility. It is the command
surface for understanding the estate, evidence quality, dependencies,
priorities, risk, and workflow status.

Mission Control should answer:

- What is in the portfolio?
- Which products or capabilities require attention?
- Which evidence is ready, incomplete, or conflicting?
- Which decisions can proceed?
- Where should the Mission Commander focus next?

It should remain concise, legible, and consequence-led. It is not replaced by
immersive experiences; it provides the strategic overview they depend on.

## 6. Modernization HQ Philosophy

Modernization HQ provides immersive AI specialist collaboration. It makes the
relationships between specialists, workspaces, evidence, and decisions easier
to understand without changing the underlying workflow.

HQ is a connected rendering of shared product state, not an independent
simulation. Switching between Mission Control and HQ must preserve the same
portfolio, case, agent, evidence, and decision state. Professional spatial cues
may increase clarity, but rooms and personas must never become more important
than the modernization work.

## 7. Living Workspace Philosophy

The Living Workspace makes modernization work visible rather than hiding it
behind dashboards. Its primary object is the **Modernization Case**.

A case contains the products in scope, dependencies, evidence, business value,
technical urgency, current workflow stage, current owner, blockers,
recommendation, decisions, engineering outputs, and validation results.

The user follows the case as it progresses through work stages. Specialist
movement, evidence transfer, pauses, objections, and handoffs must communicate
responsibility. At any moment, the user should understand:

- who is working;
- what they are working on;
- where the case is;
- why progress has paused; and
- what happens next.

The workspace feels alive because meaningful work changes are visible, not
because decorative activity is always occurring.

## 8. AI Specialist Philosophy

AI specialists are bounded collaborators with distinct responsibilities. Each
specialist has a mandate, evidence access, expected output, confidence or
completion state, and governance boundary.

Specialists collaborate around one shared modernization case. They do not keep
private, contradictory copies of product state. Their contributions attach to
the case as evidence, analysis, recommendation, objection, decision support, or
artifact.

Personas make responsibility legible; they are not fictional employees or
entertainment characters. Free-form conversation is secondary to focused
actions on shared work objects.

## 9. Human-in-the-Loop Philosophy

The Mission Commander remains responsible for consequential choices. The
system must distinguish between actions AI can complete autonomously and
decisions that require human approval.

- High-risk or materially conflicting recommendations require explicit human
  approval.
- Missing or conflicting evidence is surfaced, not silently resolved.
- Approval prompts explain the decision, evidence, alternatives, risk, and
  expected consequence.
- Human decisions are stored with their resulting artifacts and provenance.
- The product supports informed control without forcing users to supervise
  every low-risk mechanical step.

## 10. Animation Philosophy

Animation communicates work, ownership, transfer, progress, or consequence.
Every motion must answer a product question.

Use event-driven, deterministic, one-shot movement for case progression,
specialist convergence, evidence transfer, handoffs, room activation, and focus
changes. Specialists may move to perform work and return, but they never wander.

Do not use continuous loops, random roaming, fake typing, bouncing, decorative
particles, pathfinding, physics, or long theatrical delays. Respect reduced
motion preferences and preserve the same information without animation.

## 11. GPT-5.6 Philosophy

GPT-5.6, when available and selected for a supported deployment, should be used
for work that benefits from strong reasoning, synthesis, explanation, and
structured generation. It is an implementation capability, not the product
architecture.

The model may explain deterministic results, compare evidence-grounded options,
produce structured recommendations, and assist with artifact generation. It
must not invent enterprise facts, numeric scores, approvals, or completed
validation. Model choice remains configurable and replaceable under the
provider-agnostic architecture.

## 12. Codex Philosophy

Codex is the modernization engineering capability: it turns an approved case
and implementation plan into inspectable code, configuration, tests, migration
assets, and documentation.

Codex operates within explicit repository and workflow boundaries. It reads the
current implementation, makes the smallest safe change, preserves architecture
and UX, validates its work, and reports limitations. Generated artifacts remain
attached to the modernization case and are never treated as validated merely
because they were generated.

## 13. Validation Philosophy

Validation is a first-class workflow stage, not a final badge. Every generated
output must have observable acceptance criteria and evidence of verification.

Validation may include automated tests, schema and reconciliation checks,
artifact inspection, deterministic rule evaluation, security controls, and
human approval. Results attach to the case with clear pass, fail, blocked, or
not-run states. Failures remain visible and route the case back to the
appropriate owner.

## 14. Community Edition

Community Edition should make the modernization method accessible with a
local-first, understandable experience. It emphasizes synthetic examples,
deterministic fallback behavior, transparent scoring, a focused specialist set,
and inspectable stored artifacts.

It should be easy to run and learn from without requiring enterprise
infrastructure. Community Edition must remain a genuine useful product, not a
crippled marketing shell.

## 15. Enterprise Edition

Enterprise Edition extends the same core model with organizational governance,
security, integration, scale, and operational control. Potential capabilities
include identity and role management, policy configuration, audit retention,
portfolio federation, enterprise connectors, approval routing, model controls,
deployment options, and support commitments.

Enterprise features must preserve transparency, human accountability,
provider choice, and shared case continuity. They should not create a separate
conceptual product.

## 16. Product Decision Rules

When choosing what to build or how to build it, apply these rules in order:

1. Protect the working end-to-end happy path.
2. Preserve the modernization case and its provenance as the system of record.
3. Prefer visible work and focused actions over additional chat.
4. Keep Mission Control, Modernization HQ, and future surfaces synchronized
   through shared state.
5. Calculate scores and workflow rules deterministically.
6. Require human approval for high-risk decisions.
7. Maintain provider portability at real integration boundaries.
8. Choose the smallest implementation that satisfies the current horizon.
9. Add infrastructure or architectural layers only for demonstrated needs.
10. Make blockers, limitations, and unvalidated outputs explicit.
11. Preserve accessibility, reduced-motion behavior, and professional trust.
12. Reject features that are outside the current work packet, even when they
    are attractive future ideas.

## 17. Success Criteria

Modernization AI Lab succeeds when:

- a viewer can understand the active case, owner, stage, blocker, and next
  action within 30 seconds;
- Mission Control provides credible enterprise portfolio visibility;
- Modernization HQ makes specialist collaboration understandable and useful;
- the Living Workspace shows work progressing around a shared case;
- specialists produce evidence-grounded, traceable contributions;
- high-risk decisions remain under meaningful human control;
- numeric results are deterministic and generated outputs are stored;
- the happy path works without an external model call;
- the OpenAI Build Week submission is compelling and reliable;
- the same product model can support a future Google implementation;
- Community and Enterprise editions share durable core concepts; and
- every release preserves a working path, handles error states, and validates
  its claimed outcomes.
