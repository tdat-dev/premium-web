# Archetype: Admin and back-office

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: find a record, fix it, work a queue, change many records at once, configure the system, answer "who changed this". Actors: ops agents (all-day sessions), leads (assign, override), admins (config, roles, flags), auditors (read-only, export).

Signals: business entities (orders, shipments, users, SKUs, merchants) plus verbs like approve, refund, reassign, suspend, resolve, import; words like internal, ops, CMS, moderation, exceptions, feature flags.

Neighbors: `commerce-merchant-ops` when the actor is a merchant running their own store. `support-inbox-messaging` when the unit of work is a customer conversation. `analytics-monitoring` when users watch rather than mutate. `devtools-cloud-console` when entities are infrastructure. If the core loop is "open record, change state, next", it is this file.

## Shell and topology

Default: left sidebar (entities grouped by domain) + slim top bar (global jump search by ID/email/phone, environment or tenant badge, account) + content. Depth: list → record → tab; breadcrumbs beyond that. Create lives on each list, not in a global floating button.

Alternatives:
- More than ~12 entities or several user groups: collapsible domain groups, each role sees only its groups (convention).
- Triage is most of the day: three-pane (queues | list | record) so the next item opens in place. See [cross/detail-views-overlays.md](../cross/detail-views-overlays.md).
- Operators switch tenant or environment: persistent switcher, context in the page title; production looks unlike staging.

Shell mechanics: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md).

### Object model to navigation

Derive IA from the data model, not the feature list.

1. List entities and relationships (Order has many Shipments, belongs to Customer). Tag each primary (work starts here), secondary (reached through a parent), or config.
2. Primary entities become sidebar items. Queues (saved filtered views, e.g. "Shipments stuck over 24h") sit under their entity or in a Queues group.
3. Secondary entities become tabs or related lists on the parent (Order → Shipments, Payments, Notes, History).
4. Many-to-many relations: related list with "Add existing" on both sides.
5. Config entities go under Settings, grouped by owning team.
6. Every entity has a stable `/entity/:id` URL and every reference renders as a link.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Entity index | Find and act on records | Title + count, create, saved views, search + filters, filter chips, selectable table, pagination | Zero matches; bulk job running on this set |
| Queue | Work items by priority | Queue definition + SLA, Mine/Unassigned/All, list with age and reason, claim | Queue empty; claimed by someone else; SLA breached |
| Record detail | Understand and change one record | Header (ID, status, key facts, valid actions, overflow), tabs, main column, side panel (owner, dates, links), activity | Locked by process; archived; deleted tombstone; partial related data |
| Create / edit | Add or change a record | One page up to ~15 fields, wizard beyond (Cloudscape); sticky save bar when dirty | Duplicate detected; immutable fields flagged before submit |
| Bulk review | Confirm a mass change | Count and scope, parameters, affected vs skipped preview, confirm | Ineligible records; over limit |
| Job / import status | Track long operations | Job list, progress, ok/failed/skipped counts, error CSV, retry failed | Partial failure; cancelled; stuck |
| Audit log | Who did what | Time, actor, action, target, before/after, source (UI/API/system), filters, export | Deleted actor; system actor |
| Users and roles | Control access | Member table, role, invite, permission matrix | Last admin cannot be removed; invite expired |
| Settings | Change system behavior | Sections, per-section or immediate save, change history | Needs approval; wrong environment |
| Home | Start of shift | My queues with counts, assigned to me, recent records, notices | Nothing assigned |

Tables: [cross/data-tables-collections.md](../cross/data-tables-collections.md). Forms: [cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md). Roles and audit: [cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md).

## Signature patterns

**Queue and triage.** A queue is a saved, shareable filter with an owner, a sort (oldest or SLA-due first), and a visible definition ("Carrier exception, no update in 24h"). Rows show age, reason, assignee, next action. Claiming is explicit; others see the claimer and cannot double-work it. "Save and next" opens the next item and keeps list position. Live updates never reorder rows under the cursor.

**Bulk operations as jobs.** PatternFly selection semantics: select page vs select all matching ("Select all 4,218 matching"), indeterminate header checkbox, persistent count. Beyond one page it runs as a job: review (what changes, what skips and why) → submit → toast linking the job → job page with progress, per-record results, "Download failed rows" and "Retry failed". Never lock the UI during a job; never call a job done when rows failed.

**State machine in the header.** Status is a named state (Pending → Picked → Shipped → Delivered / Exception). The header offers only transitions valid from the current state; blocked ones show the reason. Show time in state and who moved it.

**Dangerous-action safety.** Scale friction to severity and recreation cost (Cloudscape delete pattern): one click plus undo for cheap items; a confirm naming the record and consequence for costly ones; typed confirmation (record ID or name) for irreversible, cascading, bulk, money, or access changes. Prefer archive with restore; hard deletes leave an audit entry. Destructive actions never share style or adjacency with the primary action. The confirm dialog repeats the environment.

**Audit trail.** Each record's activity tab merges notes and system events: actor, action, field before → after, absolute time, source. A global log adds actor/action/target/date filters and export. Impersonation is audited and shows a persistent banner.

**Collision before action.** Rows show who is viewing or has selected an item before anyone claims it (avatar or initials in the row), so two operators see the overlap before they act. Claim and assign re-check ownership at submit and name the other person on conflict.

**Soft limits with accountable overrides.** Capacity, credit, or quota limits warn at the threshold and block at the limit; crossing needs an override with a reason code, logged to the audit trail. A repeated Enter is never an override.

**Detachable spatial panes.** For all-day desks with maps or live boards, let the pane open in its own window with selection synced both ways, so a second monitor holds context while the queue keeps the main one.

**Reason codes.** Refund, suspend, override require a reason from a list plus optional note, so the change is reportable.

**Keyboard speed.** `/` search, `j/k` rows, `Enter` open, `Esc` back to the row just left, `?` shortcut sheet (convention). Search jumps straight to an exact ID, email, or phone match.

### Internal tool quality bar

No hero banners, illustrations, or marketing copy in the app. The table sits above the fold at 1366×768. Filters live in the URL. IDs, emails, and tracking numbers have copy buttons. A record header renders first if the rest is slow (target under ~1s, convention). Errors name the record and the next step.

## Density, data, and type calibration

- Rows 36–40px compact default, 48px comfortable option, persisted (convention).
- Tabular figures on numeric columns; amounts and counts right-aligned; IDs in a tabular or mono face.
- Relative time in queues ("overdue 3h") because age drives priority; absolute time with zone on detail and audit.
- One word per state, identical in list, detail, filter, and export. Status is not severity (PatternFly): "Exception" is a state, "Critical" a priority.
- Color: neutrals, one accent, four semantic colors always paired with text or icon.

## Localization notes

- VND has no minor unit: `1.250.000 ₫`. Dates `dd/mm/yyyy`, 24h; store UTC, display Asia/Ho_Chi_Minh unless the record belongs elsewhere.
- Search matches with or without diacritics ("nguyen van an" finds "Nguyễn Văn An"); sort with Vietnamese collation; avatars use the given name (last word), per W3C name guidance.
- Phone is a primary identifier (Zalo-first): normalize `+84` and leading `0`.
- Vietnamese labels run ~20–35% longer: sidebar items and column headers wrap or truncate with full text on focus.
- Statuses and reason codes are translation keys because they reach exports.

## Study pointers

- AWS Cloudscape resource management: friction scales with severity and recreation cost.
- PatternFly bulk selection: selection scope is explicit and survives pagination.
- GitHub organization audit log: one queryable log beats per-screen history.
- Shopify Polaris admin: a contextual save bar keeps edits honest.
- Linear: keyboard list navigation with a "next item" flow.

## Archetype anti-patterns

- **Feature-list navigation**: sidebar mirrors the backlog, not the data model, so staff cannot guess where records live. P1.
- **KPI-card home for operators**: metrics push the queue below the fold. P2.
- **Silent partial bulk failure**: "Done" while 40 rows failed destroys trust in data. P1.
- **Same confirm for everything**: trivial and irreversible actions look alike, users click through. P1.
- **Dead IDs**: references that are not links force copy-paste searching. P2.
- **Lost list context**: back from a record resets filters, scroll, or focus. P1.
- **Production looks like staging**: real data mutated by mistake. P1.
- **Free-text-only overrides**: no reporting, no accountability. P2.

## Coverage additions

- [ ] Entity → navigation map (primary / secondary / config) matches the sidebar.
- [ ] Each queue: definition, sort rule, owner filter, empty state, claim collision.
- [ ] Bulk: page vs all-matching, ineligible rows, job progress, partial failure, retry, error file.
- [ ] Each destructive action classed one-click+undo / confirm / typed, with reason.
- [ ] Record states: archived, deleted tombstone, locked, permission-limited fields.
- [ ] Audit: field before/after, system and API actors, impersonation banner.
- [ ] List context restored after record round-trip.
- [ ] Environment/tenant visible on every screen and in destructive confirms.
- [ ] Keyboard path search → open → act → next without a mouse.

## Sources

- https://cloudscape.design/patterns/resource-management/view/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/create/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/edit/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/delete/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/general/unsaved-changes/ (accessed 2026-09-28)
- https://www.patternfly.org/patterns/bulk-selection/ (accessed 2026-09-28)
- https://www.patternfly.org/patterns/status-and-severity/ (accessed 2026-09-28)
- https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization (accessed 2026-09-28)
- https://www.w3.org/International/questions/qa-personal-names (accessed 2026-09-28)
- Practitioner knowledge: queue/claim mechanics, keyboard conventions, density values, object-model mapping, Polaris/Retool/Linear principles (not fetched this session).
