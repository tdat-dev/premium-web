# Archetype: CRM and sales

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: know the customer, remember what was said, never miss the next step, close deals, predict the period's revenue. Actors: reps (many short sessions a day, between calls, often on a phone), managers (weekly pipeline review, forecast, coaching), sales ops/admins (pipelines, fields, assignment, imports), marketing (lists, sequences).

Signals: contacts/leads, companies, deals, pipeline, stage, follow-up, quota, forecast, "chăm sóc khách", "khách tiềm năng", "nhắc gọi lại"; a board whose cards carry money.

Neighbors: `support-inbox-messaging` when the core object is a conversation with an SLA. `commerce-merchant-ops` when the "deal" is an order with fulfillment. `work-management` when board cards have no customer or amount. `admin-backoffice` when records have no pipeline, quota, or activity history. Predicate: records carry an owner, a stage with probability, and a next activity.

## Shell and topology

Default: left sidebar (Today, Contacts, Companies, Deals, Tasks, Conversations, Reports) + top bar (global search accepting phone, email, name; quick create with "Log call" first-class; notifications for assignments and mentions) + content. Records are full pages with stable URLs; index rows open a preview drawer. Depth: index → record → related list. Mechanics: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md), [cross/detail-views-overlays.md](../cross/detail-views-overlays.md).

Alternatives:
- Reps work mostly from phones (field sales, VN SMB): bottom tabs (Today, Customers, Deals, Search), Today queue as home, tap-to-call and tap-to-Zalo on every contact row.
- More than ~8 objects including custom ones (convention): an "Objects" sidebar group with pinning; the core objects stay fixed on top.
- Several pipelines: switcher in the board header, not extra sidebar items.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Today | Do the next right thing | Overdue tasks, due today, meetings, stalled deals, new assigned leads | Nothing due (show pipeline gaps); rep on leave |
| Contacts index | Find and segment people | Saved views, search, filters, table (name, phone, owner, last activity, lifecycle), bulk assign/enroll | Duplicate flag in row; unassigned view |
| Contact / company record | Everything about one customer | Highlights, activity composer, timeline, related lists | Merged-from notice; opted out per channel; no phone |
| Deals board | Move and inspect pipeline | Pipeline switcher, filters, stage columns with totals, cards | Stage-gate dialog; won/lost drop strip |
| Deal record | Advance one deal | Stage path, highlights (amount, close date, probability, owner), next step, timeline, contact roles, products | Closed (read-mostly, reopen); close date passed |
| Forecast | Predict the period | Period, rollup, goal, closed won, gap, weighted and total pipeline, submitted number | Period locked; rep not submitted |
| Sequences | Automate follow-up | List with enrolled/replied counts, step editor, enrollment table | Unenrolled on reply; daily cap reached |
| Import | Bring data in | Upload, map columns, mode, match key, preview errors, run, result | Unmapped required field; partial success |
| Duplicates | Clean identity | Candidate pairs with match reason, side-by-side compare, merge | Irreversible confirm; conflicting owners |
| Settings | Shape the model | Pipelines/stages (probability, required fields), custom fields/objects, assignment rules, channels | Stage deleted with deals in it; field used by reports |

## Signature patterns

**Record page.** Highlights strip (name, 4–6 admin-chosen fields, owner, actions: Call, Email, Zalo, Log activity; convention) → stage path (deals) → two columns: composer + timeline (wide), related lists with counts and "View all" (narrow). Highlights never exceed one row at desktop. Every related record is a link.

**Activity timeline and logging.** Composer tabs: Note, Call, Email, Task, Meeting, one per messaging channel. Order: "Upcoming and overdue" pinned first, then past newest-first grouped by month. Entry: type icon plus text label, actor, summary, timestamp, expand for body; filter by type and person. Logging a call asks outcome (connected, no answer, busy, wrong number), duration, notes, then offers a pre-filled follow-up task; a missed call logs in two taps. Messenger/Zalo threads appear as one collapsed entry linking to the conversation, not one entry per message. Infinite timelines use the WAI-ARIA feed pattern.

**Pipeline board with stage totals.** Column header: stage, count, total amount, weighted amount (total × stage probability). Card: deal, company, amount, close date, owner, days in stage; only an overdue close date is red. Dropping into a stage with required fields opens a dialog asking only for those; Cancel returns the card. Lost requires a reason. Totals update optimistically and snap back with a message on failure. Keyboard/touch path: "Move to stage" menu per card, per Atlassian drag-and-drop guidance. Won/Lost can be a drop strip so open stages keep width.

**Stage path.** Stages show complete, current, incomplete, won, lost. "Mark stage complete" commits; an expandable panel shows the stage's key fields and playbook. Narrow widths abbreviate names and scroll; the current stage stays visible.

**Forecasting.** One period (month or quarter, company timezone). Show closed won, goal, gap, weighted pipeline, total pipeline, and the submitted number side by side. Submissions are timestamped snapshots; live pipeline moves underneath. Never blend them in one unlabeled total.

**Assignment and ownership.** Owner visible on rows, cards, records. Rules (round robin, source, region) name themselves on the timeline event. An "Unassigned" view exists and cannot go silently empty because a rule failed. Reassignment asks whether open tasks move too.

**Dedupe, merge, import.** Detect on normalized phone, email, domain, tax code; show the match reason. Merge: pick primary, choose per field side by side, preview combined timeline and associations, confirm with "cannot be undone" when the backend cannot unmerge. Import: map columns (or "Don't import"), choose create / update / both and the match key, fix or skip per-row errors, finish on created / updated / skipped counts with a downloadable error file.

**Custom fields, objects, sequences.** Fields declare type, required-at-stage, role visibility, and whether they appear in highlights, cards, filters; deleting one lists dependent views, reports, sequences first ([cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md), [cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md)). Sequence steps: email, call task, message task, wait in business days; each contact shows why it left (replied, meeting booked, bounced, opted out).

## Density, data, and type calibration

- Tables follow [cross/data-tables-collections.md](../cross/data-tables-collections.md); 36–40px rows (convention). Board cards 3–5 lines, 240–280px wide (convention).
- Money: tabular figures, right-aligned; headers may abbreviate ("1,2 tỷ") only if the full value is reachable on focus and by screen readers. Never sum mixed currencies without a stated rate date.
- Time: relative in timelines for 7 days, absolute after, exact on focus. Close dates are dates, not times.
- Keep lifecycle stage, lead status, and deal stage as three fields; merging them is the classic CRM modeling bug.
- Color budget: won, lost, overdue, at-risk. Stages stay neutral; position shows progress.

## Localization notes

- Phone is identity: normalize to E.164 (`0912…` → `+84912…`), display local format, dedupe on the normalized value. Many SMB contacts have no email.
- A Facebook page-scoped ID and a Zalo user ID are not phone numbers; link them to a contact explicitly and list linked channels in highlights.
- Reply windows are channel rules (Messenger standard window 24 hours, human-agent tag up to 7 days; Zalo OA consultation depends on the user's last interaction). Show "Còn 3 giờ để trả lời qua Messenger" instead of failing on send.
- Names: full diacritics; initials from the given name (last word); `vi` collation with optional sort by given name; diacritic-insensitive search ("nguyen" finds "Nguyễn").
- VND `1.250.000 ₫`, no minor unit; dd/mm/yyyy; labels ~20–35% longer, so board headers wrap or truncate with the full label reachable.
- Administrative units were reorganized in 2025: address lists stay data-driven. For B2B, tax code (mã số thuế) beats domain as company key.

## Study pointers

- Salesforce Lightning Design System (Path, Activity Timeline): stage progress and guidance live on the record, next to the work.
- HubSpot deal board: probability-weighted stage totals turn a board into a forecast input.
- HubSpot merge: when merge is irreversible, the primary-record choice must be explicit.
- Pipedrive: every open deal should have a scheduled next activity (practitioner knowledge).

## Archetype anti-patterns

- **Board without totals**: managers export to a spreadsheet to size a stage. P1.
- **Drag that skips stage rules**: required fields bypassed, reports wrong. P1.
- **Timeline mixes future and past**: overdue tasks buried under yesterday's email. P1.
- **Raw phone storage**: one customer exists three times, channel matching fails. P1.
- **One-click merge**: irreversible loss of owner, fields, history. P1.
- **Submitted and live forecast blended**: numbers shift after sign-off. P1.
- **KPI hero as rep home**: quota cards push today's calls below the fold. P2.
- **Rainbow stages**: color spent on position, none left for risk. P2.

## Coverage additions

- [ ] Objects mapped to nav and related lists, including custom objects.
- [ ] Board: totals, weighted totals, stage gate, lost reason, keyboard move, optimistic rollback.
- [ ] Record: highlights config, path, upcoming/overdue section, two-tap call log.
- [ ] Identity: phone normalization, channel ID linking, match reasons, merge preview.
- [ ] Import: mapping, mode, match key, per-row errors, result with error file.
- [ ] Forecast: period, timezone, snapshot vs live, drill-down.
- [ ] Assignment rule shown on event; unassigned view; open tasks on reassignment.
- [ ] Channel reply windows and per-channel opt-out on contact.

## Sources

- http://v1.lightningdesignsystem.com/components/activity-timeline/ (accessed 2026-09-28)
- http://v1.lightningdesignsystem.com/components/path/ (accessed 2026-09-28)
- https://knowledge.hubspot.com/object-settings/set-up-and-customize-pipelines (accessed 2026-09-28)
- https://knowledge.hubspot.com/records/deduplication-of-records (accessed 2026-09-28)
- https://knowledge.hubspot.com/records/merge-records (accessed 2026-09-28)
- https://knowledge.hubspot.com/import-and-export/import-objects (accessed 2026-09-28)
- https://knowledge.hubspot.com/forecast/use-the-forecast-tool (accessed 2026-09-28)
- https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines (accessed 2026-09-28)
- https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/ (accessed 2026-09-28)
- https://oa.zalo.me/home/documents/guides/tong-quan-cac-loai-tin-nhan-tren-zalo-official-account-_3651713298729094511 (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/feed/ (accessed 2026-09-28)
- Practitioner knowledge: usage rhythms, lifecycle/status/stage separation, call logging, sequences, density values, Pipedrive principle, 2025 VN administrative reorganization.
