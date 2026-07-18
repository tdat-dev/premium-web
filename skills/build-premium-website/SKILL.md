---
name: build-premium-website
description: Build, redesign, audit, or polish premium landing and brand sites, dashboard and product UI, or hybrid marketing-to-product experiences. Use for landing pages, campaigns, portfolios, editorial sites, SaaS dashboards, admin panels, analytics, navigation, tables, forms, charts, onboarding, settings, commerce, media-rich storytelling, animation, GSAP, Three.js/WebGL, responsive UI, UI/UX, accessibility, and anti-template review. Routes every task through LANDING_BRAND, DASHBOARD_PRODUCT, or HYBRID with route-specific evidence and production gates.
---

# Build Premium Website

Treat `100k-quality` as an aspirational level of care, not a valuation, award, revenue, conversion, or originality guarantee. Never promise that a site is worth $100,000 or will win Awwwards.

## Load the enforcement and routing contracts

For **every** build, redesign, audit, or polish task, read and apply both:

- [references/anti-slop-enforcement.md](references/anti-slop-enforcement.md), the authority for evidence, severity, statuses, exceptions, critique, and overall production gates;
- [references/route-dispatch.md](references/route-dispatch.md), the authority for choosing the surface route, work mode, route contract, and route-specific gate.

After dispatch, load the mandatory route contract:

- `LANDING_BRAND`: [references/landing-brand-contract.md](references/landing-brand-contract.md)
- `DASHBOARD_PRODUCT`: [references/dashboard-product-contract.md](references/dashboard-product-contract.md)
- `HYBRID`: both contracts above plus [references/hybrid-contract.md](references/hybrid-contract.md)

Before designing or critiquing any visual surface, also load [references/craft-rules.md](references/craft-rules.md) — the measurable floors and structural bans that make critique concrete. Its violations are severity-graded defects under the enforcement contract, not taste notes.

For greenfield work, creative art direction, or any task with substantial visual freedom, also read [references/reflex-registry-2026.md](references/reflex-registry-2026.md), [references/structure-catalog.md](references/structure-catalog.md), and [references/run-log.md](references/run-log.md). Treat the registry's dated patterns as review signals, never eternal bans; treat the catalog's macrostructure pick and the run-log diversification protocol as required steps.

Read the remaining references only when relevant:

- Use [references/awwwards-evidence-rubric.md](references/awwwards-evidence-rubric.md) when researching references or preparing a creative review package.
- Use [references/media-contract-prompts.md](references/media-contract-prompts.md) before approving a media-led direction or when an asset is missing.
- Use [references/motion-3d-decision.md](references/motion-3d-decision.md) before adding animation or 3D dependencies.
- Use [references/cross-ai-compatibility-install.md](references/cross-ai-compatibility-install.md) only for installation or adaptation across agents.

## Execute evidence-first

### 1. Classify the surface and work independently

Record two independent fields before discovery or design:

```yaml
surface_route: LANDING_BRAND | DASHBOARD_PRODUCT | HYBRID
work_mode: BUILD | REDESIGN | AUDIT | POLISH
```

Do not use `AUDIT` as a surface route. A repository containing both a marketing site and an application is not automatically `HYBRID`; choose it only when the scoped user journey materially crosses both. Record relevant modifiers such as `GREENFIELD`, `CONSTRAINED`, `HIGH_UNCERTAINTY`, `MEDIA_LED`, `NO_MEDIA`, `MOTION_LED`, `THREE_D`, `COMMERCE`, `CONTENT_HEAVY`, `APPLICATION`, or `LOCAL_CHANGE`.

**`LOCAL_CHANGE` fast path.** When the scope is a single component, section, or small visual fix, skip the full decision record, reference research, structure catalog, and coverage matrix. Still required: the route contract's relevant gates, [references/craft-rules.md](references/craft-rules.md), rendered evidence of the changed surface in its surrounding page at the affected breakpoints, and the severity rules. The fast path changes the paperwork, never the quality bar; if the "small" change turns out to alter page structure or journey, exit the fast path and classify again.

Build a fact/claim/source map from the user, repository, existing product, supplied assets, and verified URLs. Label assumptions. Never invent proof, customers, metrics, testimonials, capabilities, rights, or research.

Use [assets/decision-record.template.md](assets/decision-record.template.md) to record the route, work mode, constraints, alternatives, chosen direction, rejected defaults, risks, and exceptions. Also complete the route evidence template required by [references/route-dispatch.md](references/route-dispatch.md).

### 2. Research without copying

When web access exists, browse 3-5 recent references selected for the actual industry, content model, interaction, or technical problem. Prefer direct project pages and rendered evidence. Record the URL, access date, relevance, transferable principle, and originality boundary. Never copy a signature composition, interaction, identity, copy line, or asset bundle.

When browsing is unavailable, request links or screenshots and mark the evidence gap. Never fabricate references, dates, awards, or scores.

### 3. Diverge in proportion to uncertainty

- For greenfield or high-uncertainty work, compare 2-3 structurally different directions. They must differ in composition, content rhythm, media behavior, or interaction model rather than only color and font. Anchor each direction to a named macrostructure from [references/structure-catalog.md](references/structure-catalog.md), and check the pick against `.premium-web/log.json` per [references/run-log.md](references/run-log.md) before locking.
- For constrained redesign or polish, audit the rendered system, develop one direction, and log the meaningful alternatives rejected.
- For an audit, preserve the existing direction unless evidence supports changing it.

Do not auto-select the first plausible idea. Lock the direction only after its brand/product fit, content clarity, asset feasibility, originality risks, and production risks are recorded.

### 4. Lock assets and technology

Inventory every logo, font, icon, illustration, photo, video, 3D model, audio file, poster, caption, and content source. Record provenance, rights, technical fitness, intended placement, responsive behavior, fallback, and loading strategy.

Classify planned assets as `READY`, `GENERATE`, `REQUEST`, `OPTIONAL`, or `REMOVE`. A required asset may not be downgraded merely to claim completion. When a generation tool exists, generate and integrate the asset. Otherwise provide an exact production prompt/specification and set `BLOCKED ON ASSETS`.

Choose the least complex technology that preserves the approved idea. Three.js must carry intrinsic spatial meaning; GSAP must solve real choreography; CSS or Web Animations should handle local motion. Define reduced-motion, static, runtime-failure, and low-capability fallbacks before implementation.

### 5. Build, render, and critique by risk

Preserve the existing framework and product conventions unless the decision record justifies a change. Use real content and approved assets; do not substitute gradients, blobs, empty frames, or unrelated stock for required media.

Create a route/state/breakpoint coverage plan with [assets/coverage-matrix.template.md](assets/coverage-matrix.template.md). Every changed surface and every material risk must map to rendered evidence. Use representative browsers and viewports based on the layout, not fixed screenshot theater.

For each implementation slice:

1. Define its job, content, focal order, assets, states, responsive risks, motion, and failure behavior.
2. Build the smallest complete slice with semantic structure and progressive enhancement.
3. Run the real experience and capture the states required by the coverage matrix.
4. Critique observable outcomes in the order defined by the enforcement contract.
5. Record defects and before/after evidence in [assets/critique-ledger.template.md](assets/critique-ledger.template.md).
6. Repeat until no unhandled P0 or P1 defect remains.

Do not approve work from source code or a single beauty screenshot.

### 6. Verify production before creative review

Test the primary journey, keyboard operation, focus, labels, contrast, zoom/reflow, reduced motion, loading/error/empty states, slow network, missing media, animation failure, and responsive behavior where applicable. Measure performance with the environment labeled. Treat Lighthouse and Core Web Vitals as diagnostics, not proof of field performance or visual quality.

Run [scripts/audit-ai-slop.mjs](scripts/audit-ai-slop.mjs) when the project contains supported text-based frontend sources. Its findings are candidates for human review, not authority on originality or release.

Resolve severity using the enforcement contract:

- Any open `P0` means `BLOCKED`.
- Any unowned `P1-N` or unresolved `P1-P` means `NOT PRODUCTION READY`.
- Creative review cannot compensate for a production failure.
- The AI may reach `CREATIVE REVIEW READY`; it may never self-issue `RELEASE READY`, `award-winning`, or an equivalent creative verdict.

## Deliver the readiness package

Report:

1. surface route, work mode, fact/claim/source map, assumptions, and decision record;
2. reference evidence and originality boundaries;
3. completed routes, sections, states, and primary journey;
4. media manifest with rights, actual placement, loading, and fallbacks;
5. technology choices and rejected alternatives;
6. coverage matrix, rendered evidence, and critique ledger;
7. P0/P1/P2 defects, accepted exceptions, owners, and next actions;
8. accessibility, responsive, performance, and runtime-failure evidence;
9. each applicable route-specific gate and the cross-surface gate for `HYBRID`;
10. the advisory Awwwards-style review, clearly separated from production gates;
11. exact overall status from the enforcement contract.

State what was measured, what remains subjective, and what was not verifiable.

After delivering a build or redesign that locked a creative direction, append the run entry to `.premium-web/log.json` per [references/run-log.md](references/run-log.md).

## Compose with richer local tooling

When the host harness has a dedicated interactive design skill installed (palette generators, slop detectors, live browser iteration, focused single-verb commands), prefer its tools for *execution* of small refine tasks and palette seeding — it is usually faster and better instrumented. Two hard boundaries: this skill's enforcement contract, route gates, and [references/craft-rules.md](references/craft-rules.md) remain the acceptance authority over any tool's output; and on harnesses without such tooling (cross-AI installs), the references here must be applied directly — never skip a gate because a helper script was unavailable.

## Use across AI tools

Keep shared behavior in this Markdown package. Use [scripts/sync-global-skill.ps1](scripts/sync-global-skill.ps1) to copy the canonical folder to verified roots. Do not claim universal automatic discovery. Unknown products need their documented skill mechanism, a manual prompt, or an `AGENTS.md` adapter.
