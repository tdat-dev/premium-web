# Landing and brand contract

Apply this contract to `LANDING_BRAND` and to the landing/brand side of `HYBRID`. The primary outcome is comprehension, trust, conversion, or recall. Expressive composition is allowed only when message, action, rights, accessibility, and runtime resilience remain intact.

## Conversion and message lock

Complete [landing-conversion-map.template.md](../assets/landing-conversion-map.template.md) before locking a direction.

The map must identify:

- one primary audience and the vocabulary they use for the problem;
- the concrete offer, outcome, or belief the page must establish;
- the primary message, sourced proof, primary CTA, and actual CTA destination;
- objections and the section sequence that answers them;
- the intended five-second first read at wide and narrow viewports;
- the role of every planned media asset and narrative interaction.

The opening must communicate audience, offer or outcome, and next action without depending on animation. A campaign may intentionally withhold detail for narrative effect only when the primary audience and action remain understandable and the decision record explains why delayed disclosure improves the approved strategy.

Every CTA must:

- describe the resulting action or destination;
- work in the rendered experience;
- preserve campaign/query state when required;
- expose keyboard focus and an equivalent touch target;
- have a truthful destination, including honest authentication, waitlist, purchase, or contact boundaries.

Metrics, testimonials, customer logos, awards, comparisons, guarantees, and superiority claims require fact/source IDs. Visual prominence cannot exceed source confidence.

## Direction divergence and art direction

For `BUILD`, `REDESIGN` with high uncertainty, or `GREENFIELD`, compare two or three directions that differ in all of these dimensions:

- opening topology and focal order;
- section rhythm and narrative density;
- media behavior or explicit no-media system;
- typographic roles and color function;
- interaction model and static/reduced-motion reading;
- conversion risks, asset risks, and implementation cost.

Changing only fonts, colors, radii, or effects does not create another direction. Each retained design device must trace to brand history, audience behavior, product material, content genre, place, process, or another project fact.

Landing/brand exceptions that do not transfer to product UI:

- editorial asymmetry may reorder visual emphasis if DOM and assistive reading order remain coherent;
- a distinctive display face may carry campaign voice, but body and control typography must remain readable and language-complete;
- narrative pacing may use large quiet fields or dense editorial sequences, but it cannot obscure the CTA or proof;
- commissioned spectacle may be an explicit campaign objective, but it still needs fallbacks, performance ownership, and input parity.

Do not apply these exceptions to dashboard navigation, data entry, repeated controls, or operational data surfaces.

## Section contract

For every section record:

```yaml
job:
question_or_objection_answered:
fact_and_claim_ids:
intended_first_read:
primary_action:
media_role:
responsive_recomposition:
motion_or_static_behavior:
missing_media_behavior:
```

Remove or merge a section when it cannot name a distinct job. Do not preserve a centered heading, paragraph, and card grid merely to complete a template rhythm.

## Media contract

Media is mandatory only when the approved direction assigns it a necessary job. Once approved, required media may not be replaced with gradients, blobs, empty devices, fabricated UI, or unrelated stock.

Every image, video, illustration, audio file, 3D model, or product capture must have:

- source and rights or provenance;
- a narrative or evidence role;
- intended placement and responsive crop/focal behavior;
- dimensions, aspect ratio, format, and delivery budget;
- alt text or a documented decorative role;
- poster, caption/transcript, reduced-data, and failure behavior when applicable;
- rendered evidence at the risky crops and loading states.

Use the asset-swap test: if unrelated premium stock can replace the media without changing the message, mark the asset or concept defective. When a required asset is unavailable, generate and integrate it with an available tool or issue the exact asset request from the media contract and report `BLOCKED ON ASSETS`.

Product screenshots and demos must show truthful, legible states using safe data. Campaign framing does not permit fabricated controls, impossible capabilities, or unreadable fake UI.

## Landing navigation and conversion behavior

Test applicable behaviors:

- skip link and first meaningful focus;
- header visibility and contrast over changing media;
- anchor offset, active state, and history behavior;
- mobile menu open, close, escape, outside interaction, focus containment, and focus return;
- CTA path from first view, proof sections, pricing, footer, and error recovery;
- form labels, validation, submission, success, error, privacy/consent, and duplicate-submit prevention;
- checkout or commerce price/currency truth, inventory/availability claims, and return from payment failure.

A sticky CTA is allowed only when it does not cover content, duplicate focus confusingly, or compete with a higher-priority action.

## Motion and 3D

Narrative motion must reveal hierarchy, causality, continuity, material, or story. It may not be added merely to make the page feel expensive.

- Essential copy and CTA render visible before motion initializes.
- Scroll choreography must not hijack reading, trap input, or make content unreachable on resize or route replay.
- Reduced motion preserves message order, action, and the intended static composition.
- Runtime failure, slow CPU, slow network, and interrupted navigation preserve essential content.
- Repeated entrance presets across sections are a defect unless the restrained continuity is explicitly approved.

Three.js is allowed only when spatial depth, camera, material, light, or manipulation carries the story and a still, SVG, or video would materially weaken it. Approval requires touch behavior, bounded device-pixel ratio, lazy or render-on-demand strategy, mobile budget, reduced-motion/static fallback, WebGL context-loss handling, and a written explanation of why 2D is insufficient.

## Responsive and theme rules

Narrow layouts must recompose section order, crop, controls, typography, and motion; do not shrink the desktop composition. Verify the first read, CTA visibility, long/localized copy, intermediate breakpoints, landscape, zoom, and text reflow.

Ship one deliberate theme unless the brief explicitly requires more. Automatic OS theme switching is not a premium feature by itself. Every supported theme needs verified contrast, focus, controls, media treatment, metadata color, and persistence.

## LANDING_BRAND GATE

Report `LANDING_BRAND GATE: MET` only when rendered evidence proves all applicable conditions:

1. A representative user can identify the audience, offer or outcome, and primary action from the first view within the declared five-second test.
2. The primary CTA and important secondary CTAs reach their truthful destinations and preserve required state.
3. All public proof and prominent claims map to approved source IDs.
4. Required media is actually rendered with known rights/provenance, correct crop, loading strategy, accessible alternative, and failure fallback.
5. Narrative hierarchy remains intelligible with reduced motion and animation/runtime failure.
6. The mobile conversion path preserves message, proof, action, consent, and form/commerce recovery where applicable.
7. Landing navigation, keyboard focus, touch behavior, contrast, zoom/reflow, and breakpoint transitions have evidence.
8. No route-specific P0 or P1-N remains and every retained P1-P has external ownership.

Otherwise report `LANDING_BRAND GATE: NOT MET`, list the failed numbered conditions, and apply the overall status from the anti-slop enforcement contract.
