# Craft rules: measurable floors and structural bans

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

This file is the visual-craft authority for `LANDING_BRAND` and `HYBRID`, and the typography/color/motion authority for `DASHBOARD_PRODUCT`. Load it in full before designing or critiquing any surface. Rules here are floors and bans, not taste suggestions; a violation is at least a `P1` defect under the enforcement contract unless a recorded exception in the decision record justifies it.

When the host agent has a richer interactive design skill available (for example a dedicated craft skill with palette or detector scripts), it may use those tools for execution, but this file remains the acceptance authority, and cross-AI installs without such tools must apply it directly.

## Measurable floors

### Contrast and color

- Body text contrast ≥ 4.5:1 against its real rendered background; large text (≥ 18px, or bold ≥ 14px) ≥ 3:1. Placeholder text obeys the same 4.5:1: the muted-gray placeholder default fails.
- Gray text on a colored background is a defect. Use a darker shade of the background's own hue, or a transparency of the ink color.
- Express colors in OKLCH (or another perceptual space) in tokens. Tinted neutrals take 0.005–0.015 chroma toward the brand's own hue, never a generic warm or cool tint "because the brand feels warm."
- Choose a color strategy before choosing colors, and record it: `RESTRAINED` (neutrals + one accent ≤ 10% of surface), `COMMITTED` (one saturated color carries 30–60%), `FULL_PALETTE` (3–4 named roles used deliberately), or `DRENCHED` (the surface is the color). Product surfaces default to `RESTRAINED`; identity-led landing surfaces should justify staying below `COMMITTED`.
- Dark vs light is never a default. Write one sentence describing the physical scene of use (who, where, ambient light, mood) and let it force the answer; if it doesn't force the answer, the sentence is not concrete enough yet.
- **Generic material stories are not provenance.** "Ink", "clay", "soil", "brick", "stone", "paper", "denim", "blueprint" can justify almost any hue for almost any brand, which is why ink-blue/indigo and terracotta accents keep reappearing across unrelated projects. Provenance must name something only this client has (their shop sign, their product, their street, their uniform, a document they issue); if the same sentence would justify the same color for a different client, pick again and check the result against the last runs in the run log.
- **The category's own color is a reflex, not a palette.** Tea → green, coffee → brown, finance → navy, eco → leaf, luxury → black-gold, cosmetics → blush/nude/rose, AI → violet, legal → navy/burgundy, architecture → concrete-grey + terracotta: if the dominant surface family OR the accent equals the color anyone would guess from the category, that choice needs a recorded justification tied to a *specific* project fact, and the category color may never take both roles at once. Prefer provenance one step sideways: the brand's material world (ceramic glaze, dye, packaging paper, machinery, place) rather than the product's literal color.

### Type casting (before any typography rule below)

Fonts are the strongest single AI fingerprint. The model's "tasteful" reflex picks rotate within one small set; cycling inside it is still slop.

**Reflex-reject list: never cast these on greenfield work** (they are training-data defaults, not choices): Fraunces, Newsreader, Lora, Crimson (all variants), Playfair Display, Cormorant (all variants), Syne, IBM Plex (all), Space Mono, Space Grotesk, Inter, DM Sans, DM Serif (all), Outfit, Plus Jakarta Sans, Instrument Sans, Instrument Serif. An existing brand that already ships one keeps it (identity preservation); everything else looks further.

**Casting procedure (record it in the decision record):**
1. Write three concrete brand-voice words, physical-object words ("mộc, chậm, đằm"), never "modern/elegant".
2. Name the fonts you'd reach for by reflex; if any is on the list above, discard it explicitly.
3. Cast for the brand as a *physical object* (a tea-wrapper label, a 1970s manual, a shop receipt), browsing a real catalog when web access exists.
4. Cross-check: if the final pick equals the initial reflex, restart. "Elegant" is not automatically serif; "technical" is not automatically mono.
5. **Language coverage is a casting gate**: verify the chosen faces actually cover the content language (e.g. full Vietnamese diacritics at display weights, rendered, not assumed) before locking.

### Typography

- Body line length 65–75ch.
- Section-heading size ceiling: `clamp()` max ≤ 6rem. A page of shouting headings designs nothing. Exception, one per page: the hero display moment on `LANDING_BRAND`/`HYBRID` is sized as composition under Gate C of [ambition-gates.md](ambition-gates.md) (viewport-scale, overflow tested); the ceiling returns for everything after it. Letter-spacing floor on display type: ≥ -0.04em.
- Pair typefaces on a contrast axis (serif + sans, geometric + humanist) or use one family in multiple weights. Never pair two similar-but-not-identical faces.
- `text-wrap: balance` on h1–h3; `text-wrap: pretty` on long prose.
- Display and heading type is roman (`font-style: normal`). Italic display headers are a generation tell.
- Test real heading copy at every planned breakpoint; overflowing headlines are a `P1`, fixed by reducing the clamp max or rewriting copy. The viewport is part of the design.

### Layout and tokens

- At the primary desktop width, decision columns of a data table are visible without horizontal scrolling: drop or merge low-value columns, wrap long cells, or pin the decision columns. `render-check` reports a table that needs horizontal scrolling at 1440px as `clipped_content`.

- Every color, font, radius, shadow, and z-index value flows from a named token. No inline one-off values that bypass the token block; improvising a new color mid-build is a defect.
- Semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip). Never 999/9999.
- Flexbox for one-dimensional layout, Grid for two-dimensional; `repeat(auto-fit, minmax(Npx, 1fr))` before writing breakpoints.
- Cards only when a card is genuinely the best affordance. Nested cards are always wrong.

### Motion

- Every animation ships with a `@media (prefers-reduced-motion: reduce)` alternative: crossfade or instant.
- Ease out on exponential-family curves; no bounce or elastic on UI transitions.
- Never gate content visibility on a class-triggered entrance transition; if the trigger fails the section ships blank. Entrances move or scale an already-visible element.
- Don't animate CSS layout properties unless the effect requires it.

## Structural bans

Match-and-refuse. If about to produce any of these, rewrite the element with a different structure; do not restyle it.

1. **Side-stripe accents**: `border-left`/`border-right` > 1px as a colored accent on cards, callouts, or alerts.
2. **Gradient text**: `background-clip: text` over a gradient. Emphasis comes from weight or size, in one solid color.
3. **Glassmorphism as default**: decorative blur/glass cards. Rare and purposeful, or absent.
4. **The number row**: two or more big numerals with small labels set side by side ("2014 · 38 homes · 6 people", "10k+ / 99.9% / 24/7"). It is the hero-metric template whether or not the numbers are true, styled, or gradient-free. True numbers go inside a sentence, a ledger/table where they are compared, or a chart that answers a question. Product KPI tiles are exempt only on `DASHBOARD_PRODUCT` surfaces where each tile drives a decision.
5. **Parallel-column filler**: three or four same-shaped columns of (icon +) heading + short text, with or without boxes: "why us", "how it works", "benefits", "features". Boxes are not the tell; the parallel slots are. Say the points in prose, a ledger, a sequence the reader actually follows, or cut them.
6. **An uppercase tracked eyebrow above every section**: one named kicker as a deliberate brand system is voice; an eyebrow on each section is scaffold grammar.
7. **Numbered section markers as scaffold (01 / 02 / 03)**: numbers earn their place only when the content is a real sequence whose order the reader needs.
8. **The warm-neutral default body**: cream/sand/paper backgrounds (roughly OKLCH L 0.84–0.97, C < 0.06, hue 40–100) chosen to signal "warm" or "editorial". Token names like `--cream`, `--sand`, `--parchment`, `--linen` are tells in themselves. Carry warmth in accent, typography, and imagery; the body background is either the brand's own saturated color, a true off-white tinted toward the brand hue, or a committed mid-tone.
9. **Re-drawn interface chrome**: fake browser bars, phone frames, IDE windows, or terminal mockups drawn as decoration around content.
10. **Fabricated proof**: invented metrics, customers, testimonials, awards, or logos, and **popularity badges without a data source** ("Most popular", "Best seller", "Được chọn nhiều nhất", "Bán chạy nhất" on a new product). Already a `P0` under the enforcement contract; repeated here because it is also a visual-template tell. An honest alternative states fit, not popularity: "Hợp với cửa hàng xuất trên 20 hoá đơn mỗi tháng".
11. **Card stacks as structure**: a record, detail pane, form, or page built as a column of bordered boxes, one box per section. Sections are separated by headings, spacing, and at most hairline dividers; a box is reserved for something the user can act on or compare as a unit.
12. **Generated imagery posing as the client's work**: AI images that read as the client's own buildings, products, interiors, staff, or customers. Generated media may show materials, place, process, or abstract context, captioned as such; each generated image appears once unless it is a deliberate identity element.
13. **Decorative diagrams**: maps, timelines, steppers, or charts whose geometry encodes nothing (evenly spaced dots for places or years, a progress line for a non-sequence). A diagram's positions and lengths must come from real data (geography, dates, quantities) or it is decoration posing as information.
14. **Scroll-reveal everywhere**: the same entrance animation on most blocks (RR-15). Budget: at most one entrance choreography per page, tied to a named content relationship; everything else is simply present.
15. **Zigzag rows and the closing band**: image-left/text-right then swapped, repeated down the page, ending in a full-width "ready to start?" CTA band. Alternation is not rhythm. Vary the section forms (a full-bleed image with a caption, a list, a table, a quote, a map) and let the last section be the real next step in context, not a banner restating the hero.

## Saturated-look calibration

Current AI-generated design clusters around four looks that appear regardless of brief: (a) warm cream background + high-contrast serif display + terracotta accent; (b) near-black background + one acid-green or vermilion accent; (c) broadsheet layout with hairline rules, zero radius, dense columns; (d) cool or warm neutral body with a single terracotta / rust / clay / burnt-orange accent justified by "soil", "brick", or "clay", the default "tasteful" accent across every category. When one look is banned, agents migrate to the next safe accent: ink-blue/indigo (RR-19) and amber/honey (RR-20) are the current substitutes. Treat any single-accent-on-neutral scheme as a reflex until the decision record names a client-only source and the run log shows it differs from recent runs. All three are legitimate when the brief demands them; none may be chosen as a default. If the brief pins the direction, the brief wins, including when it asks for one of these.

**Category-reflex check, two orders.** First order: if the theme and palette are guessable from the product category alone, it is the first training-data reflex: rework. Second order: if the aesthetic family is guessable from category-plus-avoidance ("fintech but not navy-gold → terminal dark"), it is the reflex one tier deeper: rework again. Record both checks in the decision record for greenfield work. Cross-check chosen directions against [reflex-registry-2026.md](reflex-registry-2026.md) for dated pattern signals.
