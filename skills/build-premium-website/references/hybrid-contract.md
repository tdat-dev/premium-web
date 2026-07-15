# Hybrid contract

Apply this contract only when the scoped journey materially crosses `LANDING_BRAND` and `DASHBOARD_PRODUCT`. Load and satisfy both route contracts first. Do not average their rules into a single generic visual system.

## Separate evidence, shared journey

Maintain two evidence tracks:

```yaml
landing_brand:
  audience:
  offer:
  message_and_proof:
  primary_cta:
  art_direction_and_media:
dashboard_product:
  actor_and_role:
  promised_capability:
  entry_state:
  primary_journey:
  data_and_system_states:
```

Then map the cross-surface handoff:

- public claim to real product capability and source;
- CTA label and destination to the exact product or authentication route;
- campaign, plan, configuration, locale, and referral state that must survive;
- authentication, onboarding, consent, payment, and permission boundaries;
- cancellation, failure, back, and return paths;
- post-signup or post-purchase continuation into the promised state.

A public promise may not describe a capability more strongly than the product evidence supports. Product screenshots and demos must use truthful states and safe data.

## Resolve, do not blur, brand/product differences

Shared tokens may cover brand color, core type family, icon language, radii, and voice. They do not require identical composition, density, navigation, motion, or type scale.

Preserve these distinctions:

| Landing/brand need | Dashboard/product need | Required resolution |
| --- | --- | --- |
| expressive opening and campaign rhythm | predictable navigation and task sequence | confine expressive topology to public surfaces; make the handoff clear rather than carrying it into repeated tasks |
| distinctive display typography | scan-efficient UI/data typography | share family or contrast logic when useful; define separate display, UI, label, and numeric roles |
| narrative motion or commissioned spectacle | immediate feedback and uninterrupted input | stop narrative motion before task entry; retain only causal product motion |
| atmospheric or evidentiary media | task and data priority | use media in product UI only when it explains state, object, or workflow |
| generous public whitespace | operational density | keep common spacing tokens but permit route-specific density scales |
| conversion CTA | persistent task action | preserve intent and label continuity without styling every product action as a campaign CTA |

Do not force a dashboard into editorial asymmetry, oversized display type, sticky scroll scenes, or media-heavy composition to claim brand consistency. Do not flatten a brand site into app cards and utility typography merely because the product uses them.

## Conflict ledger

Complete [hybrid-conflict-ledger.template.md](../assets/hybrid-conflict-ledger.template.md) for every material conflict. Required examples include:

- expressive navigation versus predictable application wayfinding;
- campaign motion versus product input latency;
- display typography versus data legibility;
- public media delivery versus authenticated application performance;
- conversion simplification versus accurate capability/price explanation;
- shared theme behavior versus route-specific contrast or chart requirements.

Each decision needs evidence, tradeoff, fallback, owner, and review condition. An unresolved conflict affecting truth, rights, primary action, or primary journey is P0. An unresolved accessibility or operation defect is P1-N.

## Cross-surface identity and content

- Keep naming, plan labels, capability names, prices, currencies, and entitlement language consistent with product sources.
- Preserve recognizable identity without requiring identical layout anatomy.
- Define route-specific content density and voice: persuasive public copy cannot become ambiguous control labels; terse product labels cannot replace necessary public explanation.
- A landing theme may be singular while a product supports multiple themes. The handoff must avoid illegible flashes and preserve user choice when theme state is shared.
- If public and application navigation coexist on one route, distinguish destinations, current context, authentication state, and exit behavior.

## Performance and runtime boundaries

Set separate budgets and failure plans for public media and application runtime. Public video, WebGL, fonts, analytics, or campaign scripts may not delay product authentication, navigation, or task input. Lazy-load or terminate public effects before the product surface when necessary.

Verify:

- slow public media followed by CTA activation;
- authentication redirect and return;
- stale or missing campaign state;
- product runtime without public animation dependencies;
- reduced motion across the handoff;
- mobile memory and CPU across route transition;
- analytics/consent failure without blocking the journey.

## HYBRID CROSS-SURFACE GATE

Report `HYBRID CROSS-SURFACE GATE: MET` only when rendered evidence proves all applicable conditions:

1. `LANDING_BRAND GATE: MET` and `DASHBOARD_PRODUCT GATE: MET`.
2. Every material public capability, plan, price, metric, and proof claim maps to a current product or approved source.
3. The primary CTA reaches the promised product state or an honest authentication/onboarding/payment boundary and preserves required intent.
4. Authentication, permission, consent, cancellation, failure, return, and continuation paths are covered where applicable.
5. Shared identity remains recognizable while product navigation, density, data typography, controls, and motion obey the product contract.
6. Public media and narrative runtime do not degrade product task performance or become product dependencies.
7. Every material brand/product conflict is resolved or retained only as an externally owned P1-P with mitigation and review condition.
8. No cross-surface P0 or P1-N remains.

Otherwise report `HYBRID CROSS-SURFACE GATE: NOT MET`, list the failed numbered conditions, and apply the overall status from the anti-slop enforcement contract.
