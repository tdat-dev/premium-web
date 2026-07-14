# Anti-slop enforcement contract

Use this contract for every website build, redesign, audit, or polish task. It replaces vague instructions such as "make it premium" or "avoid AI slop" with observable evidence and explicit release authority.

## 1. Authority and limits

- Production correctness is authoritative. Creative scoring is advisory.
- Rendered behavior outranks source-code intent.
- A detector may surface candidates; it cannot decide originality, beauty, brand fit, Awwwards caliber, or release.
- Do not claim certainty where judgment is required. Record evidence, uncertainty, reviewer, and next decision.
- An AI may prepare a site for creative review. It may not approve its own creative work for release.

## 2. Scope classification

Choose one base scope and all relevant modifiers before proposing a visual direction.

| Base scope | Use when | Required route |
| --- | --- | --- |
| `BRAND` | Identity, campaign, portfolio, cultural, editorial, or story is the primary value | Ground the brand voice and recognizable design devices before layout |
| `PRODUCT` | A task, workflow, product capability, commerce action, or utility is primary | Ground the primary journey, states, data, and interaction outcomes before styling |
| `HYBRID` | Brand expression and product comprehension are both material | Keep separate brand and product evidence, then resolve conflicts explicitly |
| `AUDIT` | The request is to inspect or polish an existing experience | Preserve working intent; change direction only when rendered evidence justifies it |

Modifiers:

- `GREENFIELD`: no reliable existing visual system;
- `CONSTRAINED`: established system, framework, or user-locked direction;
- `HIGH_UNCERTAINTY`: audience, offer, hierarchy, or visual mechanism is unresolved;
- `MEDIA_LED` or `NO_MEDIA`;
- `MOTION_LED`, `THREE_D`, or `STATIC_FIRST`;
- `CONTENT_HEAVY`, `COMMERCE`, `APPLICATION`, or `EXPERIMENTAL`;
- `LOCAL_CHANGE`: a bounded component or section change rather than a site-wide direction.

Record evidence for the classification. Do not label work `CONSTRAINED`, `AUDIT`, or `LOCAL_CHANGE` merely to skip discovery or divergence.

## 3. Evidence-first state machine

```text
SCOPE_CLASSIFICATION
  -> CONTEXT_EVIDENCE
  -> RESEARCH_BOUNDARY
  -> GREENFIELD_DIVERGENCE | CONSTRAINED_AUDIT
  -> DIRECTION_LOCK
  -> ASSET_RIGHTS_LOCK
  -> IMPLEMENTATION
  -> RISK_COVERAGE_MAP
  -> RENDER_TEST_CRITIQUE
       -> REVISE -> RENDER_TEST_CRITIQUE
  -> OBJECTIVE_PRODUCTION_GATE
       -> BLOCKED | NOT_PRODUCTION_READY -> REVISE
  -> PRODUCTION_GATE_MET
  -> INDEPENDENT_ARTIFACT_REVIEW
  -> CREATIVE_REVIEW_READY
  -> EXTERNAL_RELEASE_DECISION
```

Transition evidence:

| Transition | Minimum evidence |
| --- | --- |
| `CONTEXT_EVIDENCE` | scope classification, fact/claim/source map, primary journey or message, constraints, assumptions |
| `RESEARCH_BOUNDARY` | direct references or a declared evidence gap; transferable principles and do-not-copy boundaries |
| `DIRECTION_LOCK` | direction comparison appropriate to scope, rejected alternatives, originality risks, feasibility |
| `ASSET_RIGHTS_LOCK` | asset states, provenance/rights, placement, delivery, fallback, unresolved blockers |
| `RISK_COVERAGE_MAP` | every changed surface and material risk mapped to a route/state/viewport/test |
| `OBJECTIVE_PRODUCTION_GATE` | rendered evidence, primary journey results, defect ledger, accessibility/responsive/runtime/performance evidence |
| `INDEPENDENT_ARTIFACT_REVIEW` | brief plus rendered artifacts given to a reviewer without the builder's self-score |

If a transition lacks evidence, remain in the earlier state and report the gap. Do not narrate progress as proof.

## 4. Severity and status

Severity is authoritative over creative scores.

| Severity | Meaning | Examples | Handling |
| --- | --- | --- | --- |
| `P0` | Truth, rights, safety, evidence, or primary-journey blocker | fabricated claim; unknown media rights; broken primary action; required asset missing while claimed complete; core content hidden after runtime failure; copied signature bundle | Must resolve. No exception may be self-issued by the AI. Status is `BLOCKED`. |
| `P1-N` | Non-negotiable production defect | keyboard path cannot complete; essential labels/focus/contrast/reflow fail; changed surface has no rendered evidence; destructive responsive crop; required fallback absent | Must resolve before production gate. External release authority may not relabel it as polish. |
| `P1-P` | Project-dependent production risk | agreed performance budget missed; degraded secondary state; material inconsistency; important but non-primary browser risk | Fix or obtain a named external owner, rationale, impact, expiry/review date, and follow-up. |
| `P2` | Polish or advisory issue | weak rhythm, familiar treatment, minor copy friction, non-blocking inconsistency | Record and prioritize; it cannot hide a P0/P1. |

Exact statuses:

- `BLOCKED`: at least one P0 is open, or required authority/input is unavailable.
- `IMPLEMENTATION INCOMPLETE`: planned surfaces or required assets are unfinished.
- `NOT PRODUCTION READY`: no P0 is open, but a P1-N or unowned/unresolved P1-P remains.
- `PRODUCTION GATE MET`: objective production gates have evidence and no disqualifying defect remains.
- `CREATIVE REVIEW READY`: production gate is met and the artifact/evidence package is ready for independent creative judgment. This is the highest status an AI may issue.
- `RELEASE READY WITH ACCEPTED RISKS`: external-only decision with documented P1-P ownership.
- `RELEASE READY`: external-only release decision. Never self-issue it.

Do not use `PASS`, `100K PASS`, `AWWWARDS READY`, or `AWARD-WINNING` as statuses.

## 5. Fact, claim, and source map

Maintain a compact map before writing prominent copy:

| ID | Fact or proposed claim | Source type | Source locator | Confidence | Allowed use |
| --- | --- | --- | --- | --- | --- |
| `F-01` | Exact factual statement | `USER`, `REPO`, `PRODUCT`, `ASSET`, `URL`, or `ASSUMPTION` | File, URL, message, screen, or owner | Known or provisional | Headline, body, proof, metadata, or internal-only |

Rules:

- Link every metric, testimonial, customer logo, award, comparison, capability, and superiority claim to a source.
- Never turn an assumption into public copy without user confirmation.
- Never invent missing proof to make a layout feel complete.
- If content is provisional, label it in the decision record and readiness package.
- Apply the competitor-swap review: if most prominent copy could describe a direct competitor without changing meaning, flag a specificity defect. This is a review signal, not a numeric originality proof.

## 6. Concept divergence by scope

### Greenfield or high uncertainty

Compare two or three structurally different directions. Each direction must specify:

- message hierarchy and opening topology;
- content rhythm and page shape;
- media or no-media behavior;
- type and color role, not only font/color names;
- interaction model and static/reduced-motion behavior;
- brand/product facts it expresses;
- asset, accessibility, performance, and implementation risks;
- saturated reflex signals it may trigger.

Directions that share the same wireframe and differ only in styling count as one direction.

### Constrained redesign or polish

Use the existing rendered system as evidence. Develop one coherent direction and log meaningful rejected interventions. Do not create ceremonial concepts that ignore the constraints.

### Audit or local change

Diagnose the existing outcome first. Preserve the direction unless a defect or user goal requires change. Mark unrelated creative exploration out of scope.

The first plausible idea may be selected only after comparison with a credible alternative or a recorded reason that the existing system constrains the choice.

## 7. Reference originality boundary

For every external reference record direct URL, access date, relevance, transferable principle, and prohibited imitation.

Treat the following as a `P0` copy risk when reproduced as a bundle: a reference's recognizable composition plus its signature interaction, identity treatment, copy structure, or distinctive asset language. A single conventional pattern is not ownership.

Test originality by comparing rendered artifacts, not intentions:

1. List the recognizable traits transferred from each reference.
2. Identify which project facts transformed each trait.
3. Remove the reference name from the rationale; if the direction no longer has a project-specific explanation, redesign it.
4. Request independent comparison when similarity remains plausible.

## 8. Asset and rights lock

Every planned asset needs an ID, state, source, rights/provenance, placement, technical spec, crop/focal handling, accessible alternative, delivery strategy, and failure fallback.

- A required `GENERATE` or `REQUEST` asset blocks the affected surface.
- Do not downgrade a required asset to `OPTIONAL` or `REMOVE` simply to claim completion.
- Repository presence is not proof of use. Verify the network/DOM path and rendered placement.
- Do not substitute gradients, decorative blobs, empty mockups, or unrelated stock for a required asset.
- Do not imply that generated media has automatic or universal commercial rights.

### No-media floor

When the user declines image, video, and 3D, do not equate empty minimalism with art direction. Build distinction from project-specific content and at least several cooperating mechanisms, such as expressive type behavior, editorial composition, data or domain-derived SVG, procedural 2D graphics, deliberate color fields, information rhythm, or useful micro-interaction. The exact count is not a quality score; reviewers judge whether the mechanisms form a coherent system.

## 9. Observable taste rules

Every rule below defines a tell, a legitimate exception, a replacement, and a test. A familiar pattern is not automatically bad. Unexamined accumulation is the risk.

### Typography and copy

| Rule | Observable tell | Evidence-based exception | Replacement | Test |
| --- | --- | --- | --- | --- |
| Default typography | A generic font stack is used without brand inheritance, language coverage, or a recorded reason | Existing product/brand system mandates it, or performance/language constraints make it the best fit | Define a type role system from actual content: display, reading, data, label, emphasis | Render real heading/body/data content at risk viewports; inspect hierarchy, glyphs, wrap, loading, and fallback |
| Decorative typography | Italic serif, mono labels, outline type, condensed display, or oversized words act as costume unrelated to meaning | The treatment derives from brand history, product material, content genre, or a documented editorial convention | Use typography to encode information role, voice, pacing, or contrast | Remove the decorative treatment; if no project-specific information is lost, it was probably costume |
| Generic copy | Headlines rely on transferable superlatives, three-beat slogans, or vague transformation language | A verified campaign line or established brand voice requires it | State the audience problem, concrete capability, proof, or outcome in the customer's vocabulary | Competitor-swap review; source every proof claim; read CTA plus destination without surrounding art |
| Copy wall or slogan wall | Text wraps awkwardly, a body block dominates without scan structure, or a huge slogan displaces necessary information | Editorial/story format intentionally asks for sustained reading and supplies navigation/rhythm | Edit hierarchy, width, sequence, subheads, and evidence rather than shrinking text to fit | Test representative narrow/wide viewports, zoom/reflow, and a five-second first-read description |

### Media

| Rule | Observable tell | Evidence-based exception | Replacement | Test |
| --- | --- | --- | --- | --- |
| Mood-only media | Image/video could be swapped with unrelated premium stock without changing the message | Atmospheric identity is an explicit campaign goal and rights/brand fit are documented | Use product, process, people, place, evidence, or a domain-specific visual system | Asset-swap review; verify focal crop, provenance, placement, responsive variants, poster, fallback, and accessible alternative |
| Fake product frame | A floating browser/device mockup contains illegible, fabricated, or non-functional UI | The frame is clearly illustrative and approved as campaign art | Use a real product state, truthful prototype, diagram, or omit the frame | Zoom the rendered capture; compare claims and controls with the real product/source |
| Generated imagery artifacts | Anatomy, text, logos, reflections, continuity, or lighting are visibly unstable or uncanny | Deliberate surrealism is part of the approved concept and does not misrepresent reality | Regenerate, retouch, crop, commission, or use a non-photoreal system | Inspect full resolution and intended crops; test mobile; record tool/provenance and disclosure needs |

### Motion and 3D

| Rule | Observable tell | Evidence-based exception | Replacement | Test |
| --- | --- | --- | --- | --- |
| Repeated entrance preset | Most sections use the same fade/slide/stagger regardless of content | A restrained product system intentionally uses one transition for continuity | Assign motion only to hierarchy, feedback, causality, continuity, or narrative moments | Disable entrances; check reading remains correct, then inspect reduced motion, interruption, resize, and route replay |
| Cursor, magnetic, tilt, or parallax garnish | Effect follows input but communicates no state or content relationship | Experimental brand interaction is explicitly approved and does not damage input parity | Use conventional feedback or a content-linked interaction | Compare mouse, touch, keyboard, reduced-motion, slow CPU, and accidental activation behavior |
| Decorative 3D | WebGL scene could be replaced by a still without losing product/story meaning | Visual spectacle is the product or commissioned campaign objective, with budget and fallback approved | Use optimized video, SVG, CSS, or a still; reserve 3D for intrinsic depth, material, light, or spatial interaction | Record why 2D fails; test load, device capability, context loss, reduced motion, static fallback, CPU/GPU cost, and primary-action availability |
| Runtime-hidden content | Essential content starts hidden and depends on animation initialization or a trigger | None for essential information or primary actions | Render the final content visible; animate transform or progressive layers without gating access | Disable JS/animation runtime and force reduced motion; verify content and action remain visible and operable |

### Components and composition

| Rule | Observable tell | Evidence-based exception | Replacement | Test |
| --- | --- | --- | --- | --- |
| Generic split hero | Eyebrow, large claim, two CTAs, and media occupy a predictable left/right shell without project-specific causality | Product comprehension genuinely requires immediate copy/action beside a real state or media object | Let message hierarchy, interaction, product evidence, or narrative determine the opening topology | Describe why each region must be adjacent; compare with a stacked, product-first, or narrative alternative |
| Repeated card anatomy | Multiple sections repeat identical icon/title/body containers despite different information relationships | The content is genuinely a comparable collection and consistent scanning is useful | Choose tables, sequences, lists, diagrams, editorial modules, or mixed density based on semantics | Remove card chrome and inspect whether grouping or comparison meaning is lost; test scan order and responsiveness |
| Bento as decoration | Unequal cards simulate variety but contain interchangeable marketing fragments | Dashboard/data relationships or a content hierarchy genuinely determine span and order | Derive spans, density, and sequence from importance, workflow, or data shape | Map every span/order decision to content importance; reorder at mobile and test meaning |
| Surface-effect accumulation | Large radii, blur, glass, glow, gradients, grain, and shadows accumulate without hierarchy | A documented visual material system assigns each effect a consistent semantic role | Reduce to the smallest set that distinguishes levels, actions, or atmosphere | Temporarily remove each effect; keep only those whose removal loses a named role |
| Template page rhythm | Sections repeat centered heading, short paragraph, equal grid, and uniform vertical spacing | Repetition supports a catalog, documentation, or task flow | Vary density and composition according to narrative or functional role while maintaining a stable grid | Create a page silhouette/blur test; verify focal order and rhythm without reading copy |

### Responsive and interaction outcomes

| Rule | Observable tell | Evidence-based exception | Replacement | Test |
| --- | --- | --- | --- | --- |
| Shrink-only mobile | Desktop composition is merely scaled, producing tiny type, crushed media, overflow, or wrong order | A simple component genuinely reflows without structural change | Recompose order, crop, controls, density, and motion for the narrow context | Test the actual breakpoint transitions, long content, landscape, zoom/reflow, and touch target behavior |
| Breakpoint theater | Only a favorite desktop and mobile screenshot exist while intermediate transitions are untested | A bounded local change has no intermediate behavior and evidence explains why | Select viewports from layout failure risks and content changes | Resize through transition points and capture the states where topology, navigation, crop, or controls change |
| Interaction without parity | Hover/cursor reveals information or control unavailable to keyboard/touch | The effect is purely decorative and the content is already present | Use explicit controls, focus-visible states, and touch-compatible disclosure | Complete the primary journey with keyboard and touch; verify focus order matches visual order |
| Automatic theme surprise | OS preference changes the visual system without an approved, tested theme | Product requirements explicitly include both themes | Ship one deliberate theme or fully specify both | Test contrast, media, controls, metadata, and persistence in every supported theme |

## 10. Risk-based coverage matrix

Map evidence to risk, not to arbitrary screenshot counts.

| Surface ID | Route/component | State/data | Changed area | Material risks | Browser/input | Viewport or condition | Evidence | Result |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Coverage requirements:

- Every changed surface appears in at least one rendered artifact.
- Every unique layout class and breakpoint transition is exercised.
- Every primary-path state, error/loading/empty state affected by the work, and required media fallback is covered.
- Motion-led work covers reduced motion, interruption, resize/navigation replay, and runtime failure.
- 3D covers low capability and context failure.
- High-risk areas receive focused evidence; low-risk areas may share a route capture.
- Mark untested items explicitly. Absence of evidence is not a pass.

## 11. Section critique and defect ledger

Critique rendered evidence in this order: job and five-second read, content truth, hierarchy, geometry, typography, color/contrast, media, interaction/motion, responsive behavior, accessibility, performance/failure behavior.

```yaml
section:
  id: string
  job: string
  evidence:
    - route: string
      state: string
      viewport_or_condition: string
      artifact: path-or-url
  observations:
    intended_first_read: string
    observed_first_read: string
    content_sources: [F-01]
    hierarchy: observed outcome
    geometry: observed outcome
    typography: observed outcome
    media: observed outcome
    interaction_motion: observed outcome
    responsive_accessibility: observed outcome
  defects:
    - id: D-01
      severity: P0|P1-N|P1-P|P2
      observable_failure: string
      affected_user_or_goal: string
      evidence: path-or-url
      proposed_fix: string
      owner: string
      status: OPEN|FIXED|EXTERNALLY_ACCEPTED
      after_evidence: path-or-url
  gate: BLOCKED|REVISE|READY_FOR_INTEGRATION
```

Do not accept "looks premium", "feels polished", a source-code review, or a score without observations as evidence.

## 12. Exception contract

An exception must contain:

```yaml
rule_id: string
severity: P1-P|P2
context: string
evidence: [path-or-url]
reason_the_rule_does_not_fit: string
user_or_business_impact: string
mitigation: string
owner: external-name-or-role
review_or_expiry: date-or-milestone
decision: ACCEPTED|REJECTED
```

- The AI cannot grant itself exceptions for P0 or P1-N.
- A P1-P exception requires external ownership; without it the status remains `NOT PRODUCTION READY`.
- A taste advisory may be retained when evidence shows brand/product meaning, but the rationale and test must be recorded.
- "The user asked for premium", "Awwwards style", or "it looks cool" is not an exception rationale.

## 13. Objective production gates

Creative scores never compensate for these gates:

1. **Truth and rights:** public claims are sourced; asset provenance/rights and required disclosures are known.
2. **Primary journey:** the main action and essential comprehension work in the rendered product.
3. **Evidence coverage:** every changed surface and material risk maps to a tested artifact or an explicit open defect.
4. **Accessibility:** semantics, keyboard, focus, labels, contrast, zoom/reflow, and reduced-motion behavior meet the applicable WCAG 2.2 AA requirements.
5. **Responsive integrity:** content order, controls, crop, overflow, orientation, and breakpoint transitions preserve meaning.
6. **Runtime resilience:** essential content/actions survive missing media and animation/runtime failure; error/loading/empty states remain understandable where applicable.
7. **Performance fitness:** the approved budget and delivery strategy are measured in a labeled environment; lab data is not presented as field data.
8. **Defect authority:** no P0 or P1-N remains; every retained P1-P has a valid external exception.

When all objective gates are met, report `PRODUCTION GATE MET`. Prepare rendered artifacts for an independent creative review. Only after that package is complete may the AI report `CREATIVE REVIEW READY`.
