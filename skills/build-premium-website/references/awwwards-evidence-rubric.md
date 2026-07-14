# Awwwards evidence and advisory creative rubric

Use this file to collect references and prepare an independent creative review. It is not an official Awwwards score, award prediction, monetary valuation, production gate, or self-release mechanism.

Read [anti-slop-enforcement.md](anti-slop-enforcement.md) first. Its P0/P1 production gates and status authority override every creative score in this file.

## Evidence collection

Browse 3-5 recent Awwwards entries relevant to the actual brief. Prefer direct project pages and rendered project evidence over list thumbnails.

| Field | Required evidence |
| --- | --- |
| Project | Name and direct URL |
| Access | Date accessed and, when visible, award/publication date |
| Relevance | Industry, audience, content model, interaction, or technical similarity |
| Principle | A transferable design or implementation principle |
| Originality boundary | What must not be copied and how the project will transform the principle |

Use references to answer concrete questions:

- What establishes hierarchy before motion begins?
- How do type, grid, media, and negative space serve the content?
- Which interaction carries the concept, and which interactions remain conventional?
- How does the experience preserve orientation and primary actions during expressive moments?
- What changes for narrow screens, touch, reduced motion, low capability, or missing media?

Do not use Awwwards as a component library. Do not reproduce a signature hero, transition, copy line, identity system, or asset language. If browsing is unavailable, report the evidence gap and request links/screenshots. Never fabricate references, dates, awards, or scores.

## Advisory creative review

Awwwards publicly describes the following weighting: Design 40%, Usability 30%, Creativity 20%, Content 10%. The weighted view may help organize critique, but a self-assigned number does not prove quality.

| Dimension | Weight | Review evidence |
| --- | ---: | --- |
| Design | 40% | art direction, type roles, composition, color/media behavior, consistency, craft, rendered detail |
| Usability | 30% | orientation, navigation, comprehension, feedback, responsive and accessible operation |
| Creativity | 20% | project-specific concept, meaningful novelty, memorability, fit between idea and medium, originality boundary |
| Content | 10% | truth, clarity, voice, hierarchy, credibility, relevance, asset/content quality |

For each dimension record:

- evidence artifacts reviewed;
- observed strengths and weaknesses;
- disagreement or uncertainty;
- the smallest meaningful next improvement;
- reviewer identity and independence.

If numbers are used, preserve raw reviewer scores and weighting math, but do not invent score anchors or round a weak result into confidence. A builder's self-score is diagnostic only. Prefer an independent reviewer who receives the brief and rendered artifacts without the builder's self-score.

The creative review may conclude only:

- `NOT READY FOR CREATIVE REVIEW`: evidence package or objective production gate is incomplete;
- `CREATIVE REVIEW READY`: objective production gate is met and artifacts are ready for independent judgment;
- `EXTERNAL CREATIVE REVIEW RECORDED`: an identified external reviewer has returned observations.

It may not conclude `PASS`, `AWWWARDS READY`, `AWARD-WINNING`, `100K`, or `RELEASE READY`.

## Objective production gate remains separate

Use the severities and release gates in [anti-slop-enforcement.md](anti-slop-enforcement.md):

- any open P0 means `BLOCKED`;
- any P1-N or unowned/unresolved P1-P means `NOT PRODUCTION READY`;
- only an external release authority may issue `RELEASE READY` or `RELEASE READY WITH ACCEPTED RISKS`.

Creative distinction never cancels a truth, rights, primary-journey, evidence, accessibility, responsive, runtime, or production failure.

## Diagnostics, not guarantees

When relevant, measure and label the environment for:

- Lighthouse Performance, Accessibility, Best Practices, and SEO;
- Core Web Vitals lab or field evidence;
- WCAG 2.2 AA checks;
- responsive media, font, JavaScript, third-party, CPU/GPU, and loading budgets agreed for the project.

Use current authoritative thresholds when the task requires them and browsing is available. Distinguish lab from field data. If measurement is impossible, report `NOT MEASURED`; never manufacture a score.

## Review record

```text
Production status: BLOCKED | NOT PRODUCTION READY | PRODUCTION GATE MET

Creative evidence
Design: evidence __ | strengths __ | weaknesses __ | uncertainty __
Usability: evidence __ | strengths __ | weaknesses __ | uncertainty __
Creativity: evidence __ | strengths __ | weaknesses __ | uncertainty __
Content: evidence __ | strengths __ | weaknesses __ | uncertainty __

Builder self-review: __
Independent reviewer: __
Reviewer disagreement: __
Open P0/P1: __
Next meaningful improvement: __
Creative status: NOT READY FOR CREATIVE REVIEW | CREATIVE REVIEW READY | EXTERNAL CREATIVE REVIEW RECORDED
```
