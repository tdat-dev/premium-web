# Craft rules: measurable floors and structural bans

Copyright (c) 2026 tdat-dev. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

This file is the visual-craft authority for `LANDING_BRAND` and `HYBRID`, and the typography/color/motion authority for `DASHBOARD_PRODUCT`. Load it in full before designing or critiquing any surface. Rules here are floors and bans, not taste suggestions; a violation is at least a `P1` defect under the enforcement contract unless a recorded exception in the decision record justifies it.

When the host agent has a richer interactive design skill available (for example a dedicated craft skill with palette or detector scripts), it may use those tools for execution — but this file remains the acceptance authority, and cross-AI installs without such tools must apply it directly.

## Measurable floors

### Contrast and color

- Body text contrast ≥ 4.5:1 against its real rendered background; large text (≥ 18px, or bold ≥ 14px) ≥ 3:1. Placeholder text obeys the same 4.5:1 — the muted-gray placeholder default fails.
- Gray text on a colored background is a defect. Use a darker shade of the background's own hue, or a transparency of the ink color.
- Express colors in OKLCH (or another perceptual space) in tokens. Tinted neutrals take 0.005–0.015 chroma toward the brand's own hue — never a generic warm or cool tint "because the brand feels warm."
- Choose a color strategy before choosing colors, and record it: `RESTRAINED` (neutrals + one accent ≤ 10% of surface), `COMMITTED` (one saturated color carries 30–60%), `FULL_PALETTE` (3–4 named roles used deliberately), or `DRENCHED` (the surface is the color). Product surfaces default to `RESTRAINED`; identity-led landing surfaces should justify staying below `COMMITTED`.
- Dark vs light is never a default. Write one sentence describing the physical scene of use (who, where, ambient light, mood) and let it force the answer; if it doesn't force the answer, the sentence is not concrete enough yet.

### Typography

- Body line length 65–75ch.
- Display/hero size ceiling: `clamp()` max ≤ 6rem. Letter-spacing floor on display type: ≥ -0.04em.
- Pair typefaces on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights. Never pair two similar-but-not-identical faces.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long prose.
- Display and heading type is roman (`font-style: normal`). Italic display headers are a generation tell.
- Test real heading copy at every planned breakpoint; overflowing headlines are a `P1`, fixed by reducing the clamp max or rewriting copy — the viewport is part of the design.

### Layout and tokens

- Every color, font, radius, shadow, and z-index value flows from a named token. No inline one-off values that bypass the token block; improvising a new color mid-build is a defect.
- Semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never 999/9999.
- Flexbox for one-dimensional layout, Grid for two-dimensional; `repeat(auto-fit, minmax(Npx, 1fr))` before writing breakpoints.
- Cards only when a card is genuinely the best affordance. Nested cards are always wrong.

### Motion

- Every animation ships with a `@media (prefers-reduced-motion: reduce)` alternative — crossfade or instant.
- Ease out on exponential-family curves; no bounce or elastic on UI transitions.
- Never gate content visibility on a class-triggered entrance transition; if the trigger fails the section ships blank. Entrances move or scale an already-visible element.
- Don't animate CSS layout properties unless the effect requires it.

## Structural bans

Match-and-refuse. If about to produce any of these, rewrite the element with a different structure; do not restyle it.

1. **Side-stripe accents** — `border-left`/`border-right` > 1px as a colored accent on cards, callouts, or alerts.
2. **Gradient text** — `background-clip: text` over a gradient. Emphasis comes from weight or size, in one solid color.
3. **Glassmorphism as default** — decorative blur/glass cards. Rare and purposeful, or absent.
4. **The hero-metric template** — big number, small label, supporting stats, gradient accent.
5. **Identical card grids** — same-sized icon + heading + text cards repeated as section filler.
6. **An uppercase tracked eyebrow above every section** — one named kicker as a deliberate brand system is voice; an eyebrow on each section is scaffold grammar.
7. **Numbered section markers as scaffold (01 / 02 / 03)** — numbers earn their place only when the content is a real sequence whose order the reader needs.
8. **The warm-neutral default body** — cream/sand/paper backgrounds (roughly OKLCH L 0.84–0.97, C < 0.06, hue 40–100) chosen to signal "warm" or "editorial". Token names like `--cream`, `--sand`, `--parchment`, `--linen` are tells in themselves. Carry warmth in accent, typography, and imagery; the body background is either the brand's own saturated color, a true off-white tinted toward the brand hue, or a committed mid-tone.
9. **Re-drawn interface chrome** — fake browser bars, phone frames, IDE windows, or terminal mockups drawn as decoration around content.
10. **Fabricated proof** — invented metrics, customers, testimonials, awards, or logos (already a `P0` under the enforcement contract; repeated here because it is also a visual-template tell).

## Saturated-look calibration

Current AI-generated design clusters around three looks that appear regardless of brief: (a) warm cream background + high-contrast serif display + terracotta accent; (b) near-black background + one acid-green or vermilion accent; (c) broadsheet layout with hairline rules, zero radius, dense columns. All three are legitimate when the brief demands them; none may be chosen as a default. If the brief pins the direction, the brief wins — including when it asks for one of these.

**Category-reflex check, two orders.** First order: if the theme and palette are guessable from the product category alone, it is the first training-data reflex — rework. Second order: if the aesthetic family is guessable from category-plus-avoidance ("fintech but not navy-gold → terminal dark"), it is the reflex one tier deeper — rework again. Record both checks in the decision record for greenfield work. Cross-check chosen directions against [reflex-registry-2026.md](reflex-registry-2026.md) for dated pattern signals.
