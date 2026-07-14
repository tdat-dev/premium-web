---
name: build-premium-website
description: Build, redesign, audit, or polish distinctive production websites with evidence-led art direction. Use for premium landing pages, product and brand sites, portfolios, media-rich experiences, animation, GSAP, Three.js/WebGL, editorial interfaces, responsive UI, and any frontend request where originality, real assets, browser verification, accessibility, performance, and anti-template enforcement matter.
---

# Build Premium Website

Treat `100k-quality` as an aspirational level of care, not a valuation, award, revenue, conversion, or originality guarantee. Never promise that a site is worth $100,000 or will win Awwwards.

## Load the enforcement contract

For **every** build, redesign, audit, or polish task, read and apply [references/anti-slop-enforcement.md](references/anti-slop-enforcement.md) before choosing a direction or editing UI. It is the authoritative contract for scope, evidence, severity, statuses, exceptions, critique, and production gates.

For greenfield work, creative art direction, or any task with substantial visual freedom, also read [references/reflex-registry-2026.md](references/reflex-registry-2026.md). Treat its dated patterns as review signals, never eternal bans.

Read the remaining references only when relevant:

- Use [references/awwwards-evidence-rubric.md](references/awwwards-evidence-rubric.md) when researching references or preparing a creative review package.
- Use [references/media-contract-prompts.md](references/media-contract-prompts.md) before approving a media-led direction or when an asset is missing.
- Use [references/motion-3d-decision.md](references/motion-3d-decision.md) before adding animation or 3D dependencies.
- Use [references/cross-ai-compatibility-install.md](references/cross-ai-compatibility-install.md) only for installation or adaptation across agents.

## Execute evidence-first

### 1. Classify and ground the task

Classify the work as `BRAND`, `PRODUCT`, `HYBRID`, or `AUDIT`, then record relevant modifiers such as `GREENFIELD`, `CONSTRAINED`, `MEDIA_LED`, `NO_MEDIA`, `MOTION_LED`, `THREE_D`, `COMMERCE`, or `CONTENT_HEAVY`.

Build a fact/claim/source map from the user, repository, existing product, supplied assets, and verified URLs. Label assumptions. Never invent proof, customers, metrics, testimonials, capabilities, rights, or research.

Use [assets/decision-record.template.md](assets/decision-record.template.md) to record the scope route, constraints, alternatives, chosen direction, rejected defaults, risks, and exceptions.

### 2. Research without copying

When web access exists, browse 3-5 recent references selected for the actual industry, content model, interaction, or technical problem. Prefer direct project pages and rendered evidence. Record the URL, access date, relevance, transferable principle, and originality boundary. Never copy a signature composition, interaction, identity, copy line, or asset bundle.

When browsing is unavailable, request links or screenshots and mark the evidence gap. Never fabricate references, dates, awards, or scores.

### 3. Diverge in proportion to uncertainty

- For greenfield or high-uncertainty work, compare 2-3 structurally different directions. They must differ in composition, content rhythm, media behavior, or interaction model rather than only color and font.
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

1. scope classification, fact/claim/source map, assumptions, and decision record;
2. reference evidence and originality boundaries;
3. completed routes, sections, states, and primary journey;
4. media manifest with rights, actual placement, loading, and fallbacks;
5. technology choices and rejected alternatives;
6. coverage matrix, rendered evidence, and critique ledger;
7. P0/P1/P2 defects, accepted exceptions, owners, and next actions;
8. accessibility, responsive, performance, and runtime-failure evidence;
9. the advisory Awwwards-style review, clearly separated from production gates;
10. exact status from the enforcement contract.

State what was measured, what remains subjective, and what was not verifiable.

## Use across AI tools

Keep shared behavior in this Markdown package. Use [scripts/sync-global-skill.ps1](scripts/sync-global-skill.ps1) to copy the canonical folder to verified roots. Do not claim universal automatic discovery. Unknown products need their documented skill mechanism, a manual prompt, or an `AGENTS.md` adapter.
