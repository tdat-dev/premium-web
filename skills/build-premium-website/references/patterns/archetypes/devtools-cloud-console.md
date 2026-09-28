# Archetype: Devtools and cloud console

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: ship code, see what it does, fix it when it breaks, hand out credentials safely, keep usage inside limits.

Actors: developer (daily, keyboard-first, also uses CLI and API); owner/admin (members, billing, policy); on-call engineer (needs logs and rollback fast); security reviewer (audit, key hygiene).

Signals: projects, environments, deployments, logs, regions, API keys, secrets, webhooks, usage, quotas.

Neighbors:
- **Analytics / monitoring**: the product only observes systems it cannot change. Predicate: can the user change the running system from here? Yes → this file.
- **Admin / back-office**: objects are business records, not infrastructure or credentials.
- **Finance / billing**: secondary for usage invoices and payment methods.

## Shell and topology

Default: top bar with a breadcrumb **scope switcher** (organization → project → environment), command palette over resources by name and ID, create, notifications, docs, account; left sidebar (Overview, Deployments, Logs, Observability, Storage, Domains, Settings); content with an optional help panel. Environment (production/preview, live/sandbox) is visible on every screen as text, not color alone. Shell rules: [../cross/app-shell-navigation.md](../cross/app-shell-navigation.md).

Alternatives:
- **Many service types across regions**: service catalog menu, per-service sidebar, region selector in the top bar.
- **Single-product API** (one project per account): drop the project level; sidebar is Overview, Logs, Keys, Webhooks, Usage, Settings.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| Projects | Pick where to work | Search, rows (name, runtime, production status, last deploy, repo), create | None yet: quickstart CLI command |
| Project overview | Health at a glance | Production deployment (commit, age, status, domains), recent deploys, activity, usage | Rolled back, main failing |
| Deployments | History and promotion | Filters (environment, branch, status), rows (status, commit, author, duration, age), row actions | Queued behind concurrency limit |
| Deployment detail | Understand one build | Step timeline with durations, source, streaming build log, outputs, domains | Building, Error anchored to first failing line, Canceled |
| Logs | Find what happened | Range + Live, search, field filters, volume histogram, rows, detail panel | Live paused, retention boundary, empty |
| Create resource | Provision right first time | Fields with defaults, immutable flags, cost estimate, CLI equivalent, review | Name taken, quota reached, region unavailable |
| Environment variables | Configure per environment | Key, masked value, environments, branch scope, sensitive flag | Changed, not yet redeployed |
| API keys | Grant access | Rows (name, type, prefix, scopes, created, last used, expires), create, rotate, expire | Reveal-once moment, rotation countdown |
| Webhooks | Push events out | Endpoints (URL, events, health), deliveries, signing secret, test | Failing, auto-disabled |
| Usage and quotas | Stay within limits | Meters per dimension, projection, reset date, spend alerts, per-project breakdown | Soft limit passed, hard limit hit |

## Signature patterns

**1. Scope and environment safety.** The switcher shows the full path (Team / Project / Production); switching project keeps the current section; URLs encode all three levels. Live and sandbox are separate worlds whose objects are not shared (Stripe); empty lists say so ("No live webhooks. Sandbox has 2."). Sandbox shows a persistent banner; production confirms name the environment.

**2. Deploys and rollback.** Vocabulary: Queued, Building, Deploying, Ready, Error, Canceled. Detail is a step timeline with durations; logs stream with auto-follow that pauses on scroll-up, with "Jump to latest". On Error, anchor to the first error line. Rollback is a review dialog listing what moves (domains) and what does not (environment variables, external data), then Confirm; afterward the production tile states "Rolled back: new pushes won't go live" with Undo rollback (Vercel). Environment variable edits reach new deployments only; say so on save and offer Redeploy.

**3. Logs viewer.** Range with Live toggle; free-text search on message; field filters (level, status, route, host, environment, branch, deployment, request ID); stacked volume histogram by level; virtualized rows: timestamp with milliseconds, level as text + icon, source, one-line monospace message. Wrap toggle, row expand, detail panel, copy line or JSON. Live mode pauses while the user hovers, selects, or scrolls up; "38 new lines" resumes. The URL holds query, range, and selected entry, so a link shares the exact view (Vercel). The range picker states retention ("Logs kept 1 day on this plan").

**4. API keys and secrets: reveal once, rotate with overlap.** Create: name, scopes (prefer restricted over full-access keys), optional expiry and access policy, step-up verification for live keys, then a reveal screen with full value, Copy, "You won't see this key again", and a note for where it is stored (Stripe). Afterward show prefix + last four, created, last used, expiry. Rotate sets an expiry for the old key (Stripe allows up to 7 days of overlap, or now) and shows a countdown on the old row. Sensitive variables are write-only after save. Secrets never appear in URLs, logs, toasts, or activity text.

**5. Webhooks.** Endpoints show URL, events, success rate. Deliveries: event type, status (Delivered, Pending, Failed), HTTP code, attempts, next retry; Resend per event; Send test event. Signing secret: reveal on click, Roll with optional overlap (Stripe: up to 24 hours). If failures auto-disable an endpoint, notify the owner and show why on the endpoint (convention).

**6. Usage and quotas.** Per metered dimension: used / included, unit, bar, projected period-end value, reset date. State the limit behavior: throttled, blocked, or overage at a stated rate. User-set spend alerts. Breakdown by project links to the invoice in [finance-billing.md](finance-billing.md).

**7. CLI and API parity, docs in context.** Forms offer "Copy as CLI" or the equivalent API request; every ID has a copy button; empty states show the real quickstart command; a help panel opens contextual docs without covering the primary action.

**8. Creation and deletion friction.** Single page for up to ~15 primary fields; wizard for 16+ fields or 5+ settings groups, validating per step with a review step (Cloudscape). Label fields that are fixed after creation ("Can't be changed later"). After create, land on detail showing provisioning status. Deletion friction scales with recreation cost: one click for trivial, confirm dialog for moderate, typed resource name for production data (Cloudscape). Forms: [../cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md).

## Density, data, and type calibration

- Monospace only for IDs, hashes, keys, commands, log messages.
- Long IDs truncate in the middle (`dpl_8fK2…x2Qa`) with copy and the full value on hover and focus.
- Lists: relative time with absolute timestamp + timezone in `<time datetime>` and tooltip (Cloudscape). Logs: absolute with milliseconds, UTC by default with a local toggle, zone printed in the header.
- Durations `1m 32s`; GB vs GiB stated once.
- Resource status: Provisioning, Healthy, Degraded, Unavailable. Status color always paired with text and icon; environment tags stay neutral.
- Deployments and logs default to compact density (convention). Tables: [../cross/data-tables-collections.md](../cross/data-tables-collections.md).

## Localization notes

- Vietnamese UIs keep technical tokens (deploy, build, log, webhook, commit) in English and translate the sentences around them. Labels grow ~20–35%: sidebar items wrap, never clip.
- Vietnam is UTC+7 year-round: offer local time in logs and show deploy times locally on overviews.
- VND has no minor unit (`1.250.000 ₫`), yet per-unit usage rates may need decimals; round only the invoice total.
- Step-up by SMS or Zalo OTP is common; accept either in one flow.
- Never localize IDs, error codes, CLI flags.

## Study pointers

- **Vercel**: rollback states consequences before and after (auto-promotion paused, Undo rollback).
- **Stripe keys and webhooks**: reveal once, record where the key lives, rotate with overlap.
- **AWS Cloudscape**: create-flow choice by field count; deletion friction by recreation cost.
- **GitHub fine-grained tokens**: expiry and minimum scope are part of creation.

## Archetype anti-patterns

- **Secret shown again or placed in a URL**: the UI becomes a leak. P1 (P0 for live credentials).
- **Production looks like sandbox**: work lands in the wrong world. P1.
- **Log auto-scroll that yanks**: new lines steal the line being read. P1.
- **Logs without timezone**: timelines can't be correlated. P1.
- **Env var save implying it's live**: users debug undeployed values. P1.
- **Production delete behind a plain OK**: friction below recreation cost. P1.
- **IDs cut at the end or not copyable**: the distinguishing tail is lost. P2.
- **Decorative fake terminal chrome**: banned re-drawn chrome; show real commands in plain code blocks. P2.

## Coverage additions

- [ ] Scope in URL, section kept on switch, sandbox banner.
- [ ] Deploy states rendered; error anchors to first failing line.
- [ ] Rollback dialog lists what changes and what doesn't; rolled-back state and Undo rendered.
- [ ] Env var edit shows "applies to next deployment" with Redeploy.
- [ ] Logs: live pause/resume, wrap, field filters, retention boundary, share link reopens same entry.
- [ ] Keys: step-up, reveal once, masked afterward, last used, rotation countdown.
- [ ] Webhooks: delivery statuses, resend, test event, secret roll, disabled endpoint.
- [ ] Usage: projection, reset date, soft and hard limit messaging.
- [ ] Create: immutable fields flagged, CLI equivalent, provisioning status; delete friction matches risk.

## Sources

- https://docs.stripe.com/keys (accessed 2026-09-28)
- https://docs.stripe.com/webhooks (accessed 2026-09-28)
- https://vercel.com/docs/logs/runtime (accessed 2026-09-28)
- https://vercel.com/docs/environment-variables (accessed 2026-09-28)
- https://vercel.com/docs/instant-rollback (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/create/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/delete/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/general/timestamps/ (accessed 2026-09-28)
- Practitioner knowledge: live-log pause, middle truncation of IDs, webhook auto-disable, status vocabulary, GitHub and log-view principles, Vietnamese OTP and localization.
