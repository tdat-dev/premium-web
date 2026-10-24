# Pattern library index: archetypes and cross-cutting patterns

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

The route contracts say *what must be proven*. This library says *what a good product of this kind is made of*: the shell, the screen set, the signature patterns a generic "dashboard" build misses, the density and data conventions, and the archetype-specific failure modes. It is plain text and self-contained; no external reference tool is required to use it.

Authority order is unchanged: [anti-slop-enforcement.md](../anti-slop-enforcement.md) and the route contracts decide status and gates; [craft-rules.md](../craft-rules.md) decides type, color, and motion floors. Pattern files supply defaults and checks: a pattern default never overrides a verified product fact, and a deviation from a default is a recorded decision, not a defect by itself.

## Step 1: Classify the archetype (DASHBOARD_PRODUCT and the product side of HYBRID)

Record one primary archetype and at most two secondary archetypes in the decision record. Pick by the user's **primary repeated job**, not by the industry.

| Primary repeated job | Archetype | File |
| --- | --- | --- |
| Staff work through business records or queues: CRUD, approve, fix exceptions, configure (admin panel, internal tool, back-office, ops console, moderation, CMS-lite) | Admin / back-office | [archetypes/admin-backoffice.md](archetypes/admin-backoffice.md) |
| Manage employees: directory, time, leave, shifts, payroll, reviews | People / HR ops | [archetypes/people-hr-ops.md](archetypes/people-hr-ops.md) |
| Place things in time: calendars, availability, bookings, resource rosters | Scheduling / booking | [archetypes/scheduling-booking.md](archetypes/scheduling-booking.md) |
| Read numbers to decide or react: KPIs, reports, exploration, monitoring, alerts | Analytics / monitoring | [archetypes/analytics-monitoring.md](archetypes/analytics-monitoring.md) |
| Operate software infrastructure: deploys, logs, keys, usage, environments | Devtools / cloud console | [archetypes/devtools-cloud-console.md](archetypes/devtools-cloud-console.md) |
| Move or account for money: billing, invoices, expenses, ledgers, wallets | Finance / billing | [archetypes/finance-billing.md](archetypes/finance-billing.md) |
| Manage relationships and deals: contacts, pipeline, activities, forecast | CRM / sales | [archetypes/crm-sales.md](archetypes/crm-sales.md) |
| Answer people across channels: helpdesk, shared inbox, team messaging | Support inbox / messaging | [archetypes/support-inbox-messaging.md](archetypes/support-inbox-messaging.md) |
| Plan and track work items: tasks, issues, boards, sprints, timelines | Work management | [archetypes/work-management.md](archetypes/work-management.md) |
| Write, organize, and publish content: wiki, doc editor, headless CMS | Docs / knowledge / CMS | [archetypes/docs-knowledge-cms.md](archetypes/docs-knowledge-cms.md) |
| Manipulate objects directly on a surface: design, whiteboard, media editing, site builders | Creative editor / canvas | [archetypes/creative-editor-canvas.md](archetypes/creative-editor-canvas.md) |
| Converse with or supervise an AI assistant or agent; embedded copilots | AI chat / agent | [archetypes/ai-chat-agent.md](archetypes/ai-chat-agent.md) |
| Run a shop: products, inventory, orders, fulfillment, POS, checkout | Commerce / merchant ops | [archetypes/commerce-merchant-ops.md](archetypes/commerce-merchant-ops.md) |
| Consume, browse, or trade as an individual: feeds, media, marketplaces, travel search | Consumer web app | [archetypes/consumer-web-app.md](archetypes/consumer-web-app.md) |
| Teach and learn: catalog, course player, quizzes, grading, cohorts | Learning / LMS | [archetypes/learning-lms.md](archetypes/learning-lms.md) |

Classification rules:

- **Industry is not an archetype.** A logistics dispatcher panel is admin/back-office (queues + exceptions); it takes scheduling as a secondary only if dispatchers book time slots. A clinic reception tool is scheduling primary. Add a secondary only when a screen in scope performs that archetype's job.
- **Most real products are one primary plus secondaries.** A helpdesk with an order sidebar is support-inbox primary, commerce secondary. Load the primary file in full. From each secondary, read only `Core screen set`, `Signature patterns`, and `Archetype anti-patterns`, and apply only the rows for screens in scope; do not read further archetype files to be thorough.
- **No row fits**: pick the nearest archetype by shell and job, record `archetype: CUSTOM (nearest: <name>)`, and state which signature patterns transfer and which are replaced.
- **Admin is the fallback, not the default.** Choose it because the job is record/queue work, not because the brief says "panel".

## Step 2: Load the cross-cutting files the scope touches

Every archetype file links to these; load the ones whose surfaces are changed.

| Surface in scope | File |
| --- | --- |
| App frame, sidebars, top bar, workspace/tenant switching, breadcrumbs, mobile nav | [cross/app-shell-navigation.md](cross/app-shell-navigation.md) |
| Tables, lists, card grids, boards, bulk actions, saved views | [cross/data-tables-collections.md](cross/data-tables-collections.md) |
| Filters, search, command palette, keyboard shortcuts | [cross/filters-search-command.md](cross/filters-search-command.md) |
| Record detail, drawers, split panes, modals, popovers | [cross/detail-views-overlays.md](cross/detail-views-overlays.md) |
| Forms, wizards, inline edit, settings pages | [cross/forms-wizards-settings.md](cross/forms-wizards-settings.md) |
| Empty/loading/error states, toasts, banners, notification center, background jobs | [cross/feedback-states-notifications.md](cross/feedback-states-notifications.md) |
| Sign-in, signup, onboarding, workspace setup, account and members | [cross/auth-onboarding-account.md](cross/auth-onboarding-account.md) |
| Roles, sharing, permission-denied rendering, impersonation, audit log, approvals | [cross/permissions-roles-audit.md](cross/permissions-roles-audit.md) |
| Presence, comments, mentions, activity, version history, conflicts | [cross/collaboration-realtime.md](cross/collaboration-realtime.md) |

## Step 3: Landing-side page types (LANDING_BRAND and the public side of HYBRID)

The macrostructure and ambition choice stay in [structure-catalog.md](../structure-catalog.md) and [ambition-gates.md](../ambition-gates.md). These files define what each *page type* must contain and how it behaves, not its look.

| Page type in scope | File |
| --- | --- |
| Pricing, feature, solutions, customers, integrations, changelog, about/careers, contact/demo, blog, legal/trust, status, 404, site nav and footer | [landing/marketing-site-pages.md](landing/marketing-site-pages.md) |
| Docs sites, API reference, developer portals, quickstarts | [landing/docs-developer-portal.md](landing/docs-developer-portal.md) |
| Shop front: product lists, search, product pages, cart, checkout, order confirmation and tracking for buyers | [landing/storefront-checkout.md](landing/storefront-checkout.md) |

## Step 4: Turn the files into commitments

In the decision record, fill the `Archetype and pattern defaults` section:

1. primary and secondary archetypes with the classification sentence;
2. the shell chosen from the archetype's `Shell and topology` (default or keyed alternative, with the predicate that selected it);
3. the screen set in scope, taken from `Core screen set`, with screens deliberately excluded;
4. each `Signature pattern` marked `ADOPTED`, `ADAPTED (how)`, or `NOT APPLICABLE (why)`;
5. deviations from pattern defaults with the product fact that justifies them.

Then copy the archetype's and each loaded cross file's `Coverage additions` into the coverage matrix and the product journey/state matrix. An adopted signature pattern with no rendered evidence is an open `P1-N` under the dashboard gate (a changed surface without rendered evidence); an archetype anti-pattern present in the build is graded at the severity hint its file gives unless the enforcement contract grades it higher.

Pattern files give severity hints as `P0`, `P1`, or `P2`. A bare `P1` hint is `P1-N` when the defect breaks the primary journey, an accessibility floor, or truth, and `P1-P` otherwise; record the resolved label in the ledger.

## Output shape

- Record pattern decisions as the Step 4 tables; do not restate pattern-file prose in plans or deliverables. The plan states what this product does, not what the archetype generally needs.
- Pattern files are not a current source for third-party policy or law (platform messaging windows, tax and e-invoice rules, address schemes, payment rails). Carry such items into the fact map as `verify against current official source`; never cite the pattern file as the authority.

## Fast path

For `LOCAL_CHANGE` work, skip Step 1's recording: open only the cross file for the touched surface and the archetype file's anti-patterns section, and apply their coverage additions to the changed component.
