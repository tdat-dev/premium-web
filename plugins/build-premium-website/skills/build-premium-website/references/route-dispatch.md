# Route dispatch

Use this decision before research, concepts, layout, or implementation. Record one `surface_route` and one independent `work_mode` in the decision record.

```yaml
surface_route: LANDING_BRAND | DASHBOARD_PRODUCT | HYBRID
work_mode: BUILD | REDESIGN | AUDIT | POLISH
```

## Choose the surface route from the primary outcome

Choose `LANDING_BRAND` when success is public comprehension, trust, conversion, inquiry, purchase intent, subscription, campaign participation, or brand recall. Campaigns, portfolios, editorial stories, public product pages, and public charts used as proof belong here.

Choose `DASHBOARD_PRODUCT` when success is completing a repeatable task, navigating an application, manipulating data, configuring a system, monitoring operational state, or completing an authenticated commerce workflow. Admin panels, analytics workspaces, onboarding flows, settings, tables, forms, and operational charts belong here.

Choose `HYBRID` only when the scoped journey materially crosses both surfaces and neither contract alone can verify success. A repository containing a marketing site and an application is not enough. Examples include a campaign CTA that must preserve intent through authentication into a configured product state, or a public configurator whose result continues inside an application.

Edge rules:

- A public chart supporting a narrative is `LANDING_BRAND`; an interactive chart used to decide or act is `DASHBOARD_PRODUCT`.
- A promotional panel inside an application follows `DASHBOARD_PRODUCT` if it participates in a task.
- A product screenshot on a landing page follows `LANDING_BRAND`, but its claims and depicted state must remain truthful.
- If the requested change touches only one side of a larger hybrid system, route the bounded change to that side and record the other surface as an integration risk.
- If the primary outcome remains ambiguous, compare the first successful user action under each route. Select the route whose gate can actually prove that success and record the rejected route.

## Choose the work mode independently

| Work mode | Use when | Mandatory behavior |
| --- | --- | --- |
| `BUILD` | The requested surface or journey does not exist | Establish route evidence, compare structurally different directions when uncertainty is high, then implement. |
| `REDESIGN` | The surface exists and the user authorizes material change | Preserve verified content, product, data, framework, and brand constraints; record what changes and what remains invariant. |
| `AUDIT` | The user requests diagnosis or review | Inspect rendered outcomes, issue evidence-linked defects, and do not implement without separate authorization. |
| `POLISH` | The direction is established and changes are bounded | Preserve topology and workflows unless an observed defect requires a structural correction. |

Do not use `AUDIT`, `POLISH`, `CONSTRAINED`, or `LOCAL_CHANGE` to avoid evidence or route-specific testing.

## Mandatory contract and artifact matrix

| Route | Contracts to load | Required route artifacts | Required sub-gates |
| --- | --- | --- | --- |
| `LANDING_BRAND` | `landing-brand-contract.md` | decision record, landing conversion map, coverage matrix, critique ledger, media manifest when applicable | `LANDING_BRAND GATE` |
| `DASHBOARD_PRODUCT` | `dashboard-product-contract.md` | decision record, product journey/state matrix, dashboard data contract for data surfaces, coverage matrix, critique ledger | `DASHBOARD_PRODUCT GATE` |
| `HYBRID` | both route contracts plus `hybrid-contract.md` | all applicable artifacts plus hybrid conflict ledger | both sub-gates and `HYBRID CROSS-SURFACE GATE` |

Templates:

- [landing-conversion-map.template.md](../assets/landing-conversion-map.template.md)
- [product-journey-state-matrix.template.md](../assets/product-journey-state-matrix.template.md)
- [dashboard-data-contract.template.md](../assets/dashboard-data-contract.template.md)
- [hybrid-conflict-ledger.template.md](../assets/hybrid-conflict-ledger.template.md)

## Re-dispatch conditions

Revisit the route when rendered evidence shows any of these:

- the primary action has become an application workflow rather than a conversion action;
- an apparently decorative data surface is actually used for decisions;
- a landing CTA must preserve state through authentication or onboarding;
- a requested polish changes navigation, roles, permissions, or data behavior;
- the scoped work no longer crosses both sides of a claimed `HYBRID` journey.

Record the route change, evidence, affected artifacts, and tests. Do not silently switch contracts after implementation.

## Gate aggregation

Route gates are subordinate to the anti-slop enforcement status system. A met route gate cannot compensate for a P0, P1-N, or unresolved P1-P. Report route gates separately, then calculate the overall status:

```text
LANDING_BRAND GATE: MET | NOT MET | NOT APPLICABLE
DASHBOARD_PRODUCT GATE: MET | NOT MET | NOT APPLICABLE
HYBRID CROSS-SURFACE GATE: MET | NOT MET | NOT APPLICABLE
OVERALL STATUS: use the exact anti-slop enforcement status
```
