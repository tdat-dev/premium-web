# Ambition gates: the demand side of premium

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

The craft rules and structural bans are floors — they delete the failures. A page that merely passes them converges on *tasteful and forgettable*: symmetric container-locked sections, timid type, flat vector placeholders, zero motion. That is the polished form of AI slop, and award-level references reject it on sight.

This file is the demand side. Load it for every `LANDING_BRAND` or `HYBRID` build/redesign with visual freedom (skip for `DASHBOARD_PRODUCT` and `LOCAL_CHANGE`). Each gate below must be **satisfied or explicitly waived in the decision record with a named reason**. An unsatisfied, unwaived gate caps the creative verdict: the readiness package may not claim more than `CLEAN BASELINE` — never "premium", "award-caliber", or equivalent.

## Gate A — Media mandate

A brand landing page without real art direction material is a wireframe wearing colors.

- If real assets exist, use them (media contract rules apply).
- If a generation tool is available in the harness, generating the key assets is **part of the build**, not optional polish: at minimum the hero's anchor visual and one supporting texture/detail per major section group.
- If no assets exist and no generation tool is available, choose one honestly:
  1. `BLOCKED ON ASSETS` — deliver exact production prompts/specs per media-contract-prompts.md; or
  2. a **deliberately media-free direction** — type-as-image, custom drawn SVG composition, generative CSS texture — executed as the *subject* of the design, and record the ceiling: "media-free by constraint, art direction carried by X".
- Never ship placeholder geometry (flat circles, generic blobs, empty tinted boxes) standing in the position where real media obviously belongs. A placeholder in the hero is an automatic gate failure.

## Gate B — Composition risk

At least **one deliberate grid-break moment** per page, named in the decision record:

- display type crossing a boundary (bleeding off-canvas, overlapping media, running vertically),
- an element spanning or breaking the container (full-bleed composition, not merely a full-width background color),
- asymmetry that carries meaning (offset hero, staggered rhythm, a section whose layout answers its content),
- or intentional scale collision (huge next to tiny).

A page where every section is `heading → content` inside the same centered container fails this gate regardless of how clean it looks. One risk executed precisely beats three gimmicks; if every section shouts, nothing does — the risk moment needs quiet around it.

## Gate C — Type bravery

- The page's **one hero display moment** must be sized as composition, not text: on `LANDING_BRAND`, target the viewport (roughly 7–12vw, or an equivalent clamp), with tightened leading and tested overflow at every breakpoint. The craft-rules 6rem ceiling governs *section headings*, not this moment — see the reconciliation note in craft-rules.md.
- At display scale, typography must be *worked*: weight/width contrast, deliberate line breaks that mean something, kerning attention, mixed scale within the composition where earned. A default-set font at large size is big text, not display typography.
- If the display face cannot carry this (no Vietnamese glyphs at display weights, poor rendering), pick one that can — this is a casting decision, not a styling one.

## Gate D — Motion floor

Zero-choreography is below the floor for `LANDING_BRAND`. Minimum, honoring every craft-rules motion rule (reduced-motion alternative, no visibility-gated entrances, exponential ease-out):

- one **orchestrated arrival** — a hero sequence with intentional order and stagger, transform/clip-based, content visible without it;
- **scroll-linked life** — at least one element whose state responds to scroll (reveal choreography, parallax layer, scroll-driven color/scale shift), not uniform fade-up on every section;
- micro-interactions on the primary CTA and one signature surface beyond default hover color swap.

CSS-only is fine; a motion library is justified only per motion-3d-decision.md.

## Gate E — Signature interaction

One interaction that exists **only on this page** — derived from the subject, impossible to paste into another brand's site without losing meaning. It should be the thing a visitor describes afterwards. Examples of the *kind* (never copy these literally): hovering a product row re-tints the scene to that product's real color; the page's scroll position steeps the hero from pale to full-strength; a pricing toggle that pours rather than switches.

Record it in the decision record as `signature:` with one sentence on why it belongs to this subject. Generic candidates (dark-mode toggle, marquee strip, cursor blob, tilt cards) do not satisfy the gate — several are already reflex-registry entries.

## Verdict interaction

- All five gates satisfied (or waived with cause) **and** all craft floors pass → the work may be presented for creative review as premium-intent.
- Any gate failed without waiver → cap at `CLEAN BASELINE`; say so plainly in the readiness package. Never let production cleanliness masquerade as creative achievement — that inversion is exactly how polished slop ships.
