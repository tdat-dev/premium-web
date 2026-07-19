# Dashboard and product contract

Apply this contract to `DASHBOARD_PRODUCT` and to the dashboard/product side of `HYBRID`. The primary outcome is completing a repeatable task, navigating an application, manipulating data, configuring a system, or monitoring operational state. Task continuity, state legibility, and predictable controls outrank spectacle.

## Journey, actor, and state lock

Complete [product-journey-state-matrix.template.md](../assets/product-journey-state-matrix.template.md) for every changed primary journey. Complete [dashboard-data-contract.template.md](../assets/dashboard-data-contract.template.md) for every changed table, chart, KPI, data-driven control, or operational summary.

Record:

- actor roles and permissions;
- entry routes, required context, deep links, and exit/success conditions;
- steps, controls, resulting states, validation, feedback, and recovery;
- keyboard and touch paths;
- data source, freshness, units, formatting, aggregation, uncertainty, and missing-data meaning;
- loading, empty, zero-result, partial, stale, error, offline, permission, success, and destructive states.

Do not style fabricated data into credibility. Product metrics, chart values, customer data, permissions, and capabilities must trace to a repository, product, user, or approved fixture source.

## Information architecture and navigation

Classify navigation as primary, secondary, contextual, or utility. For every changed navigation surface verify:

- current route and selected state;
- deep-link load and reload;
- browser back/forward and in-product back behavior;
- breadcrumbs or another parent-context mechanism where hierarchy is material;
- sidebar expanded, collapsed, and persistence behavior;
- mobile drawer/sheet open, close, escape, focus containment, and focus return;
- unsaved-change exits;
- authentication expiry and re-entry;
- permission-restricted, missing, and deleted resources;
- long labels, localization, zoom, and narrow widths.

Visual order, DOM order, and focus order must agree. Do not replace recognizable application navigation with experimental scrolling, cursor gestures, or hidden hover-only wayfinding.

## Tables and collections

Use a semantic table when rows and columns express relationships. Use a list or cards only when the content is not truly tabular.

For each table or collection specify and test:

- column meaning, units, formatting, priority, and source;
- default sort, user sort, direction, and announced state;
- search, filters, applied-filter visibility, reset, and URL/state persistence;
- pagination, infinite loading, or virtualization boundaries;
- row selection, select-all scope, bulk actions, and partial selection;
- row action discoverability for mouse, touch, and keyboard;
- sticky header/column behavior and overlap at zoom;
- compact/comfortable density when supported;
- loading, empty dataset, zero filtered results, partial, stale, error, and retry states;
- long values, missing values, extreme values, and localization.

On narrow screens preserve essential relationships through explicit column priority, labeled horizontal scrolling with visible cues, or a designed detail view. Do not automatically turn every row into a card. Hidden columns require an accessible way to reach the data.

Sorting, filtering, pagination, selection, and bulk results must expose state programmatically and preserve focus after updates.

## Forms and settings

Every input needs a persistent accessible name. Placeholder text is not a label. Define:

- required versus optional status;
- description, format, units, constraints, and defaults;
- validation timing and whether validation is local, server-side, or both;
- field error association and error summary behavior;
- pristine, dirty, validating, invalid, submitting, success, server error, offline, permission failure, and optimistic rollback states;
- unsaved changes, cancel, reset, destructive confirmation, and recovery;
- focus placement after validation, dialogs, submission, and dynamic field insertion;
- duplicate-submit prevention without making status unknowable.

Do not use a disabled control as the only explanation of unmet requirements. Preserve the control label and expose the reason or next action. Destructive actions must identify scope and consequence, prevent accidental activation, and return focus predictably.

Settings need explicit save semantics: immediate, per-section, or page-level. Do not mix them without visible state and recovery.

## Charts, KPIs, and analytics

For each visualization record:

- user decision or question it supports;
- source, freshness, timezone, units, aggregation, and comparison period;
- domain, baseline, scale, missing data, uncertainty, and threshold meaning;
- color semantics shared with the rest of the product;
- accessible summary or equivalent data table.

Legends and status encoding may not depend on color alone. Hover-only values require touch and keyboard access or an equivalent adjacent representation. Tooltips must remain reachable, dismissible, bounded by the viewport, and associated with the triggering datum.

Test loading, empty, all-zero, partial, stale, error, extreme values, negative values, dense labels, long legends, narrow width, zoom, theme changes, and responsive resizing. Do not truncate material values without access to the full value. Decorative chart animation must not delay comprehension or distort the represented quantity.

## System states and recovery

Mark each state `REQUIRED`, `NOT APPLICABLE` with reason, or `COVERED` with evidence:

- first-run onboarding and returning user;
- initial loading and background refresh;
- empty dataset and zero filtered results;
- partial and stale data;
- recoverable and terminal error;
- offline and reconnect;
- authentication expiry;
- permission denied and read-only access;
- success, undo, and optimistic rollback;
- destructive action and deleted-resource navigation;
- concurrent edit or conflict when the product supports collaboration.

Skeletons must approximate the final structure and cannot hide indefinite waits. Empty states distinguish no data, no results, missing permission, and failed loading. Error states state what happened, what remains safe, and the available recovery action without exposing sensitive implementation details.

## Accessibility and input parity

The primary journey must complete with keyboard and touch where those inputs are supported. Verify:

- semantic landmarks, headings, names, roles, and states;
- visible focus and focus order;
- focus containment and restoration for dialogs, drawers, popovers, and menus;
- announcements for asynchronous validation, loading completion, errors, saves, selection changes, and destructive outcomes;
- contrast across default, hover, focus, selected, disabled, error, success, and chart states;
- zoom and reflow at 200 percent and text scaling where applicable;
- no essential information available only on hover, pointer position, or color;
- target size and spacing for repeated controls.

If a complex widget is introduced, follow its established keyboard pattern rather than inventing a novel one.

## Responsive behavior and density

Responsive product design preserves task priority and data meaning, not desktop geometry. For each topology change define:

- navigation transformation;
- control priority and relocation;
- table/chart strategy;
- action persistence;
- dialog, drawer, and popover behavior;
- long/localized value behavior;
- orientation and virtual-keyboard effects.

Do not silently remove an essential action, state, or datum on mobile. Avoid sticky regions that consume the usable viewport or cover focused controls. Test intermediate transitions, not only one desktop and one phone capture.

## Motion and themes

Product motion must communicate feedback, continuity, hierarchy, direct manipulation, or causality. Prefer CSS or Web Animations for local state changes. Use GSAP only when a real multi-element product sequence cannot remain deterministic and maintainable with native motion.

- Motion may not delay input, validation, navigation, or data comprehension.
- Essential content starts visible and remains usable when the animation runtime fails.
- Focus must not appear visually displaced from its DOM position.
- Reduced motion replaces spatial travel with immediate state change or restrained emphasis.
- Scroll choreography, cursor followers, magnetic controls, decorative parallax, and decorative WebGL do not belong in repeated task surfaces.

Three.js is allowed only when spatial manipulation or depth is the product task itself, such as model inspection, spatial configuration, mapping, or simulation. A decorative scene in an app shell is not an exception.

Ship one deliberate theme unless multiple themes are a product requirement. Every supported theme needs complete semantic tokens for surfaces, text, borders, focus, controls, disabled/error/success states, overlays, charts, media, and system status. Verify contrast, persistence, initial load, chart distinction, and user override. Do not add automatic OS switching without an approved behavior and tested persistence.

Product-specific rules that differ from landing/brand work:

- predictable navigation outranks expressive wayfinding;
- stable control placement outranks editorial asymmetry;
- UI and data typography prioritize scan, language coverage, and tabular alignment over display personality;
- microcopy (labels, buttons, empty/error/success states, tooltips) follows [copy-voice.md](copy-voice.md): plain human words the user controls and recognizes, no AI filler ("seamless", "powerful", "giải pháp toàn diện"), no marketing tone on operational surfaces;
- media is not mandatory and may not displace tasks or data merely to create atmosphere;
- repeated component anatomy is correct when it supports genuinely comparable controls or records;
- dense information is acceptable when hierarchy, grouping, and responsive access remain legible.

## DASHBOARD_PRODUCT GATE

Report `DASHBOARD_PRODUCT GATE: MET` only when rendered evidence proves all applicable conditions:

1. Every changed primary journey completes for applicable roles using keyboard and touch, including validation, success, and recovery.
2. Current route, deep links, reload, back/forward, parent context, mobile navigation, auth expiry, and permission boundaries behave correctly where applicable.
3. Changed tables cover sorting, filtering, selection/actions, pagination/loading, narrow layout, and required data states.
4. Changed forms cover labels, constraints, validation, submission, errors, success, unsaved changes, destructive actions, and focus behavior.
5. Changed charts/KPIs have truthful data contracts, units, freshness, non-color meaning, accessible alternatives, interaction parity, and extreme/error state evidence.
6. Required loading, empty, zero-result, partial, stale, offline, permission, success, undo/rollback, and destructive states are covered or explicitly not applicable with reasons.
7. Responsive layouts preserve essential tasks, actions, relationships, and data across topology changes, zoom, localization, and virtual-keyboard conditions where applicable.
8. Motion does not delay tasks and reduced-motion/runtime-failure behavior preserves operation; every supported theme has complete state and contrast evidence.
9. No route-specific P0 or P1-N remains and every retained P1-P has external ownership.

Otherwise report `DASHBOARD_PRODUCT GATE: NOT MET`, list the failed numbered conditions, and apply the overall status from the anti-slop enforcement contract.
