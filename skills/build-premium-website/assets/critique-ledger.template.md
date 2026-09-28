# Rendered critique and defect ledger

## Review context

- Project/build:
- Reviewer:
- Reviewer independence:
- Brief/decision record:
- Coverage matrix:
- Evidence location:

## Surface critique

### Surface `[ID and name]`

- Job:
- Intended first read/action:
- Observed first read/action:
- Routes/states/conditions reviewed:
- Fact/claim source IDs:

| Review axis | Observable outcome | Evidence | Result |
| --- | --- | --- | --- |
| Content truth/specificity |  |  |  |
| Hierarchy and reading order |  |  |  |
| Geometry, spacing, and alignment |  |  |  |
| Typography and copy behavior |  |  |  |
| Color and contrast |  |  |  |
| Media content/crop/loading/fallback |  |  |  |
| Interaction, motion, and reduced motion |  |  |  |
| Responsive and input behavior |  |  |  |
| Accessibility |  |  |  |
| Performance and runtime failure |  |  |  |
| Reflex-registry signals |  |  |  |

## Slop sweep (required on every render pass)

Fill every row from the rendered screenshots at each tested width, not from intent or source. `PRESENT` rows become defects below. A row cannot be marked `ABSENT` without naming where you looked.

| ID | Check | Result `ABSENT / PRESENT / N/A` | Where checked (screenshot + region) |
| --- | --- | --- | --- |
| SW-01 | Number row: 2+ big numerals with small labels side by side (craft ban 4) |  |  |
| SW-02 | Uppercase eyebrow/kicker above most sections; decorative 01/02/03 (bans 6-7) |  |  |
| SW-03 | Identical card grid, card stack, or nested cards (bans 5, 11) |  |  |
| SW-04 | Section order: list each section's job in order. PRESENT if it reads hero → benefits/features → steps → pricing → FAQ → CTA band (or a subset in that order) without a content-driven merge or reorder, or if the product's real output never appears |  |  |
| SW-05 | Connector em-dashes in visible copy (max 1 per page), count: |  |  |
| SW-06 | Copy: list every heading in order. PRESENT if more than two share one grammatical template, or any AI-tone word, three-beat line, repeated fact, or brief-echo lede appears |  |  |
| SW-13 | Claims beyond the facts: derived claims not literally true, invented exact prices/terms/specs where the brief gave a range |  |  |
| SW-14 | Parallel-column filler, decorative diagrams, scroll-reveal on most blocks, stub navigation, sparkle AI glyph, zigzag rows + closing CTA band (bans 5, 13, 14, 15) |  |  |
| SW-07 | Unsourced proof: popularity badge, stat, quote, logo, "trusted by" (ban 10) |  |  |
| SW-08 | Fixtures (and derived statuses computed from them): read ten records end to end. PRESENT if any field contradicts another (note vs reason, dates out of order, person changes mid-history, totals do not sum) or anything reads as placeholder |  |  |
| SW-09 | Palette equals category reflex or saturated look (a)-(d); reject-list or reflex font |  |  |
| SW-10 | Generated image posing as client work, reused, or uncanny (ban 12) |  |  |
| SW-11 | Content hidden or covered when JS/animation fails; text under scrims or overlays |  |  |
| SW-12 | Narrowest width: every primary action reachable, charts/tables legible; `render-check` counts all 0 or dispositioned, including the slop signals (scroll_animated, nested_boxes, emoji_icons, warm_neutral_body) |  |  |
| SW-15 | Default state: the first load shows the state the brief asks for (a selected record in a split pane, real data in every panel), not an empty pane waiting for a click |  |  |

- `render-check.mjs` summary line (quoted verbatim):
- `audit-ai-slop.mjs` run (command, BLOCKER_CANDIDATE and ADVISORY counts):
- Disposition of every BLOCKER_CANDIDATE (fixed / false positive with reason):
- Fresh-eyes review: reviewer (subagent or person who did not build it), inputs given, verdict:

## Defects

| ID | Surface | Severity | Observable failure | Affected user/goal | Evidence | Fix or mitigation | Owner | Status | After evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `D-01` |  | `P0 | P1-N | P1-P | P2` |  |  |  |  |  | `OPEN | FIXED | EXTERNALLY_ACCEPTED` |  |

## Exceptions

| Rule ID | Severity | Evidence | Reason rule does not fit | Impact/mitigation | External owner | Review/expiry | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |

## Gate summary

- Open P0:
- Open P1-N:
- Unowned/unresolved P1-P:
- `LANDING_BRAND GATE`: `MET | NOT MET | NOT APPLICABLE`
- `DASHBOARD_PRODUCT GATE`: `MET | NOT MET | NOT APPLICABLE`
- `HYBRID CROSS-SURFACE GATE`: `MET | NOT MET | NOT APPLICABLE`
- Objective production gate: `BLOCKED | NOT PRODUCTION READY | PRODUCTION GATE MET`
- Creative artifact package complete: `YES | NO`
- AI status: `BLOCKED | IMPLEMENTATION INCOMPLETE | NOT PRODUCTION READY | PRODUCTION GATE MET | CREATIVE REVIEW READY`
- External release decision: `NOT REQUESTED | RELEASE READY WITH ACCEPTED RISKS | RELEASE READY`
- Next actions:
