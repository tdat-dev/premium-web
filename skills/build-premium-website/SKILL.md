---
name: build-premium-website
description: Build, redesign, audit, or polish premium landing and brand sites, product UI, or hybrid marketing-to-product experiences, grounded in human factors, usability heuristics, and WCAG 2.2 AA. Use for landing pages, campaigns, portfolios, editorial and docs sites, pricing pages, SaaS dashboards, admin panels, internal tools, back-office and ops consoles, CRM, helpdesk and inbox, project and task tools, analytics, billing and finance, commerce and POS, HR, scheduling, CMS and wiki, canvas editors, AI chat and agent UI, LMS, storefronts and checkout, navigation, tables, forms, charts, onboarding, settings, permissions, animation, GSAP, Three.js/WebGL, responsive UI, accessibility, UX psychology and usability review, user research plans, UX writing, and anti-template review. Routes every task through LANDING_BRAND, DASHBOARD_PRODUCT, or HYBRID with archetype pattern defaults, route-specific evidence, and production gates.
license: Apache-2.0. Copyright (c) 2026 ByteWaker. Redistribution must retain LICENSE, NOTICE, and copyright notices. Canonical source github.com/tdat-dev/premium-web
---

# Build Premium Website

Treat `100k-quality` as an aspirational level of care, not a valuation, award, revenue, conversion, or originality guarantee. Never promise that a site is worth $100,000 or will win Awwwards.

## Before reporting any status (non-negotiable)

A status report is invalid unless it quotes, from the final build:

1. the `RENDER-CHECK` summary line of [scripts/render-check.mjs](scripts/render-check.mjs) with every non-zero count fixed or dispositioned (the `a11y:` group follows the dispositions in [references/accessibility-inclusive.md](references/accessibility-inclusive.md)) (for craft counts, text over media and intentionally closed menus are the only accepted dispositions; slop signals need a project fact from the decision record), or `render-check: unavailable (reason)` with status capped at `NOT PRODUCTION READY`;
2. the `BLOCKER_CANDIDATE` / `ADVISORY` counts of [scripts/audit-ai-slop.mjs](scripts/audit-ai-slop.mjs) with each blocker candidate dispositioned;
3. the filled Slop sweep from the critique ledger;
4. the fresh-eyes reviewer's verdict (or `fresh-eyes: unavailable` and the cap);
5. the filled Human-factors pass and heuristic evaluation, and the manual accessibility script results, each UX claim carrying its evidence level (`MEASURED`, `OBSERVED`, `SIMULATED`, `USER-TESTED`, `ANALYTICS`, `ASSUMED`).

Every control a build renders as interactive (buttons, tabs, toggles, map nodes, accordions) must be pressed at least once in a real browser before reporting; `render-check` lists controls with no listener as `dead_controls`, but a listener that does the wrong thing is only caught by using it. Counting by eye does not replace the scripts: builders' manual counts of em-dashes and contrast have been wrong by a factor of three.

## Load the enforcement and routing contracts

For **every** build, redesign, audit, or polish task, read and apply both:

- [references/anti-slop-enforcement.md](references/anti-slop-enforcement.md), the authority for evidence, severity, statuses, exceptions, critique, and overall production gates;
- [references/route-dispatch.md](references/route-dispatch.md), the authority for choosing the surface route, work mode, route contract, and route-specific gate.

After dispatch, load the mandatory route contract:

- `LANDING_BRAND`: [references/landing-brand-contract.md](references/landing-brand-contract.md)
- `DASHBOARD_PRODUCT`: [references/dashboard-product-contract.md](references/dashboard-product-contract.md)
- `HYBRID`: both contracts above plus [references/hybrid-contract.md](references/hybrid-contract.md)

For every `DASHBOARD_PRODUCT` task and the product side of every `HYBRID` task, load [references/patterns/index.md](references/patterns/index.md), classify the product archetype there, and load the primary archetype file plus the cross-cutting pattern files for the surfaces in scope. For `LANDING_BRAND` work that includes pricing, feature, customers, changelog, contact, blog, legal, status, or docs pages, load the matching `references/patterns/landing/` file. Pattern files are the default anatomy, screen set, signature patterns, and archetype anti-patterns; deviations are recorded decisions, and adopted signature patterns need rendered evidence like any other gate item.

Before designing or critiquing any visual surface, also load [references/craft-rules.md](references/craft-rules.md): the measurable floors and structural bans that make critique concrete. Its violations are severity-graded defects under the enforcement contract, not taste notes.

Before designing or critiquing any surface on any route, also load the human-factors layer. It is the authority for whether people can actually use what was built, and its failures are graded defects like any other:

- [references/human-factors.md](references/human-factors.md): perception, attention and scanning, cognitive load, mental models, memory, decision-making and deceptive patterns, trust, motivation, motor limits, response times; the four lines to write before designing a surface, the Human-factors pass (HF-01 to HF-14), and the heuristic evaluation.
- [references/accessibility-inclusive.md](references/accessibility-inclusive.md): WCAG 2.2 AA as an automated floor, a manual test script, and a complete A/AA checklist, plus inclusive design, cognitive accessibility, and Vietnamese-language specifics. Production gate 4 is judged against it.

Before writing or reviewing any copy (headlines, body, CTAs, labels, empty/error states, alt text) on any route, load [references/copy-voice.md](references/copy-voice.md). It is the authority for human-sounding words (Vietnamese and English): the AI word/structure ban lists, punctuation rules, and the cadence-loop rule that stops every heading and CTA from sharing one template. Hero-level or looping AI-tone copy is a defect, not a style preference.

For every `LANDING_BRAND` or `HYBRID` build/redesign with visual freedom, also load [references/ambition-gates.md](references/ambition-gates.md): the demand side. Floors delete failures; the five gates (media, composition risk, type bravery, motion, signature interaction) demand the excellence that floors alone never produce. A page that passes every floor but fails an unwaived gate is capped at `CLEAN BASELINE` and must be reported as such.

For greenfield work, creative art direction, or any task with substantial visual freedom, also read [references/reflex-registry-2026.md](references/reflex-registry-2026.md), [references/structure-catalog.md](references/structure-catalog.md), and [references/run-log.md](references/run-log.md). Treat the registry's dated patterns as review signals, never eternal bans; treat the catalog's macrostructure pick and the run-log diversification protocol as required steps.

Read the remaining references only when relevant:

- Use [references/ux-research-validation.md](references/ux-research-validation.md) when choosing evidence for the critique, when the brief asks for research or testing, or before writing any usability claim; it defines the evidence levels and the agent-run evaluations (cognitive walkthrough, task scripts, simulated five-second, first-click, and tree tests) and the research plan to hand the owner for what only real users can answer.
- Use [references/source-library.md](references/source-library.md) to verify a rule or number at its source, to pick the design system to study for a component, or to choose reference galleries in step 2.

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

For `DASHBOARD_PRODUCT` and the product side of `HYBRID`, also record `archetype: <primary> (+ secondaries)` per [references/patterns/index.md](references/patterns/index.md).

Do not use `AUDIT` as a surface route. A repository containing both a marketing site and an application is not automatically `HYBRID`; choose it only when the scoped user journey materially crosses both. Record relevant modifiers such as `GREENFIELD`, `CONSTRAINED`, `HIGH_UNCERTAINTY`, `MEDIA_LED`, `NO_MEDIA`, `MOTION_LED`, `THREE_D`, `COMMERCE`, `CONTENT_HEAVY`, `APPLICATION`, or `LOCAL_CHANGE`.

**`LOCAL_CHANGE` fast path.** When the scope is a single component, section, or small visual fix, skip the full decision record, reference research, structure catalog, and coverage matrix. Still required: the route contract's relevant gates, [references/craft-rules.md](references/craft-rules.md), rendered evidence of the changed surface in its surrounding page at the affected breakpoints, and the severity rules. The fast path changes the paperwork, never the quality bar. A change stops being local (exit the fast path and classify again) when it adds, removes, or reorders sections; changes the page grid, hero form, or navigation; or alters a step in a user journey. Adjusting values inside an existing element (spacing, color, type size, copy, one component's internal layout) stays local.

Write the four human-factors lines for each primary surface (who and where, the one job, what they already know, what makes them quit) per [references/human-factors.md](references/human-factors.md). Build a fact/claim/source map from the user, repository, existing product, supplied assets, and verified URLs. Label assumptions. Never invent proof, customers, metrics, testimonials, capabilities, rights, or research.

Use [assets/decision-record.template.md](assets/decision-record.template.md) to record the route, work mode, constraints, alternatives, chosen direction, rejected defaults, risks, and exceptions. Also complete the route evidence template required by [references/route-dispatch.md](references/route-dispatch.md).

### 2. Research without copying

When web access exists, browse 3-5 recent references (choose galleries and design systems with [references/source-library.md](references/source-library.md)) selected for the actual industry, content model, interaction, or technical problem. Prefer direct project pages and rendered evidence. Record the URL, access date, relevance, transferable principle, and originality boundary. Never copy a signature composition, interaction, identity, copy line, or asset bundle.

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
4. Critique observable outcomes in the order defined by the enforcement contract, run [scripts/render-check.mjs](scripts/render-check.mjs) (screenshots at 1440 and 390, overflow, contrast, word stacking, no-JS visibility, broken images, JS errors, target size, accessible names, and a real Tab pass for focus visibility and obscuring) and [scripts/audit-ai-slop.mjs](scripts/audit-ai-slop.mjs) on the build, and fill the **Slop sweep** and the **Human-factors pass** in the critique ledger from the screenshots. Once per journey, run the heuristic evaluation and the cognitive walkthrough from [references/ux-research-validation.md](references/ux-research-validation.md).
5. Record defects and before/after evidence in [assets/critique-ledger.template.md](assets/critique-ledger.template.md).
6. Repeat until no unhandled P0 or P1 defect remains.

Do not approve work from source code or a single beauty screenshot.

**Fresh-eyes review before any status above `IMPLEMENTATION INCOMPLETE`.** The builder's own sweep is not enough: builders consistently mark their own tells absent. When the host can start a subagent, give a fresh one only the brief, the screenshots, the audit output, and the Slop sweep table with results blanked, and ask it to fill the sweep and list P0/P1 defects. Frame it adversarially: "assume this page was generated by an AI with no designer; name the three most template-like elements with screenshot evidence, then fill the sweep". A reviewer that returns no finding must justify each `ABSENT` row with where it looked. Its `PRESENT` rows become defects even if the builder disagrees; a disagreement is resolved by changing the build or recording an exception, not by overruling the reviewer. When no subagent or second person is available, record `fresh-eyes: unavailable` and cap the status at `NOT PRODUCTION READY`.

### 6. Verify production before creative review

Test the primary journey, run the manual accessibility script in [references/accessibility-inclusive.md](references/accessibility-inclusive.md) (keyboard, zoom and reflow, text spacing, screen reader smoke test, color, motion, hover content, forms and authentication, media, forced colors), and check focus, labels, contrast, reduced motion, loading/error/empty states, slow network, missing media, animation failure, and responsive behavior where applicable. Measure performance with the environment labeled. Treat Lighthouse and Core Web Vitals as diagnostics, not proof of field performance or visual quality.

Run [scripts/audit-ai-slop.mjs](scripts/audit-ai-slop.mjs) on every build that contains supported text-based frontend sources, on every render pass. Its findings are candidates, not authority on originality or release, but every `BLOCKER_CANDIDATE` must be dispositioned in the critique ledger (fixed, or false positive with reason); an undispositioned one is an open `P1`.

Resolve severity using the enforcement contract:

- Any open `P0` means `BLOCKED`.
- Any unowned `P1-N` or unresolved `P1-P` means `NOT PRODUCTION READY`.
- Creative review cannot compensate for a production failure.
- The AI may reach `CREATIVE REVIEW READY`; it may never self-issue `RELEASE READY`, `award-winning`, or an equivalent creative verdict.

## Deliver the readiness package

Report:

1. surface route, work mode, product archetype when applicable, fact/claim/source map, assumptions, and decision record;
2. reference evidence and originality boundaries;
3. completed routes, sections, states, and primary journey;
4. media manifest with rights, actual placement, loading, and fallbacks;
5. technology choices and rejected alternatives;
6. coverage matrix, rendered evidence, and critique ledger;
7. P0/P1/P2 defects, accepted exceptions, owners, and next actions;
8. accessibility (automated counts plus the manual script), human-factors pass, heuristic evaluation, responsive, performance, and runtime-failure evidence, with every usability claim labeled by evidence level and a research plan for what only real users can confirm;
9. each applicable route-specific gate and the cross-surface gate for `HYBRID`;
10. the advisory Awwwards-style review, clearly separated from production gates;
11. ambition-gate results (A-E: satisfied / waived-with-reason / failed) and the resulting creative cap, when the gates applied;
12. exact overall status from the enforcement contract;
13. confirmation that the run-log entry was appended (or why not). An unmentioned run-log is an incomplete package;
14. the quoted `RENDER-CHECK` and audit summary lines, the Slop sweep, and the fresh-eyes verdict.

State what was measured, what remains subjective, and what was not verifiable.

After delivering a build or redesign that locked a creative direction, append the run entry to `.premium-web/log.json` per [references/run-log.md](references/run-log.md).

## Compose with richer local tooling

When the host harness has a dedicated interactive design skill installed (palette generators, slop detectors, live browser iteration, focused single-verb commands), prefer its tools for *execution* of small refine tasks and palette seeding. It is usually faster and better instrumented. Two hard boundaries: this skill's enforcement contract, route gates, and [references/craft-rules.md](references/craft-rules.md) remain the acceptance authority over any tool's output; and on harnesses without such tooling (cross-AI installs), the references here must be applied directly. Never skip a gate because a helper script was unavailable.

## Use across AI tools

Keep shared behavior in this Markdown package. Use [scripts/sync-global-skill.ps1](scripts/sync-global-skill.ps1) to copy the canonical folder to verified roots. Do not claim universal automatic discovery. Unknown products need their documented skill mechanism, a manual prompt, or an `AGENTS.md` adapter.
