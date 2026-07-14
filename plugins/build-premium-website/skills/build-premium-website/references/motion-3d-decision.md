# Motion and 3D decision guide

Use this file after the visual thesis is approved and before adding an animation or rendering dependency.

## Decide from intrinsic value

Ask what the user understands, feels, or can do because of the technique. Choose the lowest-complexity option that preserves that value.

| Need | Default choice | Do not escalate when |
| --- | --- | --- |
| hover, press, focus, small reveal, state change | CSS transitions/keyframes or Web Animations | a short local effect needs no shared timeline |
| coordinated sequence, pinned narrative, complex SVG, scroll choreography | GSAP | native CSS/WAAPI remains clear and maintainable |
| spatial exploration, meaningful camera, depth-dependent product behavior, light/material as content | Three.js | 3D is only decoration or can be a still/SVG/video |
| stable reading, utility, reduced distraction | no motion | motion adds no hierarchy, feedback, narrative, or comprehension |

## Approve Three.js only when all are true

- Spatial depth is central to the product, story, data, or interaction.
- A static 2D treatment or prerecorded video would materially weaken the concept.
- Input, orientation, and camera behavior remain understandable on touch and keyboard-adjacent paths.
- A mobile performance budget and lower-fidelity fallback are defined.
- A static/reduced-motion fallback preserves essential content and actions.
- The team can own asset pipelines, loading, WebGL context failure, and maintenance.

Prefer model compression, bounded texture sizes, controlled device pixel ratio, lazy initialization, render-on-demand where possible, and explicit disposal. Test slow devices and lost/unsupported WebGL contexts. Never force Three.js because a site is expected to feel expensive.

## Approve GSAP when choreography is the feature

Use GSAP for timelines, precise multi-element sequencing, scroll-linked scenes, SVG morph/draw work, and stateful choreography that becomes brittle in scattered CSS. Keep animation state deterministic and restorable. Scope selectors, clean up instances, and prevent duplicate timelines during navigation or hot reload.

Do not hide complete sections with `opacity: 0` or `autoAlpha: 0` awaiting a trigger. Essential content must render visible if JavaScript, intersection observation, or the animation runtime fails. For entrances, favor transform-only offsets or scale with the visible final content already present.

## Use CSS or Web Animations for local motion

Prefer native motion for hover/focus/press feedback, simple accordions, menus, local transforms, progress, and short one-component transitions. Animate transform and opacity sparingly; avoid layout-thrashing properties. Do not create a dependency for a handful of simple effects.

## Allow no motion

No motion is a premium choice when typography, editorial pacing, grid, color, content, and media already carry the experience. If the user declines image, video, and 3D, develop distinction with:

- expressive but readable type scale and variable-font axes;
- editorial asymmetry held by a strict grid;
- disciplined color fields and borders;
- SVG marks, diagrams, masks, or procedural 2D graphics;
- content-driven rhythm and responsive composition;
- restrained micro-interactions for feedback only.

## Define motion tokens

Create a small shared vocabulary:

- durations for instant, local, and narrative motion;
- easing families for enter, exit, emphasis, and direct manipulation;
- distance/scale limits;
- stagger rules;
- reduced-motion substitutions;
- interruption, reversal, navigation, and failure behavior.

Avoid mixing unrelated easing styles, every-element parallax, scroll hijacking, cursor followers, magnetic controls, gratuitous 3D tilt, and motion that competes with reading.

## Verify

Test motion with keyboard navigation, touch, resize, route transitions, back/forward navigation, slow CPU, slow network, missing assets, reduced motion, and runtime failure. Check that focus is never moved visually away from its DOM position and that animation never blocks the primary action.
