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
| SW-04 | Section order a generator would produce regardless of content (structure-catalog default) |  |  |
| SW-05 | Connector em-dashes in visible copy (max 1 per page), count: |  |  |
| SW-06 | AI-tone words, three-beat lines, repeated fact or phrase, brief-echo lede (copy-voice) |  |  |
| SW-07 | Unsourced proof: popularity badge, stat, quote, logo, "trusted by" (ban 10) |  |  |
| SW-08 | Placeholder or self-contradicting fixture data (names, counts, dates, totals) |  |  |
| SW-09 | Palette equals category reflex or saturated look (a)-(d); reject-list or reflex font |  |  |
| SW-10 | Generated image posing as client work, reused, or uncanny (ban 12) |  |  |
| SW-11 | Content hidden or covered when JS/animation fails; text under scrims or overlays |  |  |
| SW-12 | Narrowest width: every primary action reachable, charts/tables legible, no overflow |  |  |

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
