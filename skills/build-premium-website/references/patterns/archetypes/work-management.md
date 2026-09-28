# Archetype: Work management

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: capture work fast, decide what is next, see who is doing what and what is blocked, ship on a date. Actors: contributors (daily, short keyboard-heavy bursts, mostly "my issues"), leads/PMs (weekly planning, grooming, triage), stakeholders (read-only, timeline and status), admins (workflows, fields, automation).

Signals: tasks, issues, tickets-as-work, projects, board, backlog, sprint/cycle, epic, roadmap, Gantt, assignee, due date, "giao việc", "tiến độ", "trễ hạn".

Neighbors: `crm-sales` when cards carry customers and money. `support-inbox-messaging` when an external requester waits under an SLA. `docs-knowledge-cms` when the unit is a page, not an item with status. `scheduling-booking` when the calendar holds appointments with attendees and resources. Predicate: items have status, assignee, and a place in a plan.

## Shell and topology

Default: left sidebar (Inbox/notifications, My issues, teams or projects with their views, saved views) + view header (title, layout switcher List / Board / Timeline / Calendar, filter bar, display options) + content. An item opens in a side peek from lists and boards; a direct link opens the full page. Command palette (Ctrl/Cmd+K) reaches every action. Mechanics: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md), [cross/filters-search-command.md](../cross/filters-search-command.md), [cross/detail-views-overlays.md](../cross/detail-views-overlays.md).

Alternatives:
- Non-technical teams or heavy custom fields: spreadsheet-style table as the default layout.
- Many projects rolled into programs: add a portfolio level (projects as rows with health, lead, target date) above team views.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| My issues / inbox | Know what needs me | Notifications (assigned, mentioned, status changed), my items grouped by status | Inbox zero; notification about a deleted item |
| List | Scan and bulk-edit | Filter bar, grouped rows (ID, title, status, priority, assignee, labels, due), inline create per group | Group collapsed; filtered-out count |
| Board | See flow | Columns = statuses with count and WIP limit, optional swimlanes, cards | Over WIP limit; drop not allowed by workflow |
| Timeline | Plan in time | Item tree, date scale, bars, dependency lines, today line, milestones, unscheduled tray | Missing dates; dependency conflict |
| Calendar | See due dates | Month/week grid, items on due date, unscheduled tray | Day overflow ("+4") |
| Item detail | Understand and change one item | Title, description, properties rail, sub-items with progress, relations, attachments, activity | Blocked; duplicate of; archived; no permission to edit |
| Backlog / planning | Rank and commit | Ranked list, sprint containers with estimate totals vs capacity | Over capacity; unestimated items |
| Cycle / sprint | Track the time box | Progress (scope, started, done), burn-up, items by status, scope changes | Rolled-over items; ended cycle |
| Triage | Accept incoming work | Queue of new items from forms/integrations, accept / decline / duplicate / snooze | Empty; duplicate suggested |
| Workflow settings | Shape the process | Statuses by category, transitions, required fields | Status in use cannot delete without remap |
| Automation | Remove busywork | Rule list with last run, builder, run log | Rule failing; loop detected |

## Signature patterns

**One dataset, many views.** A view is query + layout + grouping + sort + visible properties. Switching layout keeps filters. Views save per user, with an explicit "Save for everyone" by owners; the URL encodes the view. Display options hide properties; filters hide items; never blur the two. Items lacking the field a layout needs (no dates on Timeline/Calendar, no status in a group) go to a visible "Unscheduled"/"No value" tray, never disappear.

**Statuses and workflows.** Custom statuses map to fixed categories (Backlog, To do, In progress, Done, Canceled); reports and progress use categories. Board columns are statuses. Transitions may be restricted: a disallowed column shows as unavailable while dragging with the reason on focus, and a transition with required fields opens a small form.

**Board behavior.** Column header: status, count, WIP limit ("5/4" turns warning). Optional swimlanes; collapsible columns. Drag handle, 2px drop line, and auto-scroll per Atlassian drag-and-drop guidance; multi-select drag moves all selected. Keyboard and touch parity: "Move to…" menu with status and position. When the view is sorted by a field (priority, due), manual rank is off and the UI says why instead of letting a drop jump back.

**Item detail.** Title and description edit in place (rich text, @mentions, auto-linked item references). Properties rail: status, assignee, priority, labels, estimate, cycle, project, dates; each settable by a single-key shortcut from the list. Sub-items with an "x of y done" bar. Relations: blocked by, blocking, related, duplicate of, each clickable, with blocked state surfaced on cards and rows. Activity merges comments with a compacted history ("Lan đổi trạng thái 3 lần").

**Keyboard-first triage and bulk edit.** `j`/`k` move, `x` selects, Shift extends, `Enter` opens, `Esc` closes the peek; property keys (for example `s` status, `a` assignee, `p` priority, `l` labels) open a filtered picker (convention; publish the map in a `?` sheet). Triage actions are single keys: accept, decline with reason, mark duplicate (merges into the chosen item), snooze until a date or new activity. Bulk bar shows the count and scope ("50 đang hiển thị" vs "Chọn cả 312 kết quả"), applies with an undo toast, and reports partial failures. Selection rules: [cross/data-tables-collections.md](../cross/data-tables-collections.md).

**Cycles, sprints, backlog.** Backlog is ranked by drag; sprint containers show estimate sum against capacity (capacity from past velocity, labeled as an estimate). Unfinished items roll into the next cycle automatically and are marked "chuyển từ kỳ trước". Scope added after start is marked on the item and in the burn-up.

**Timeline / Gantt.** Rows are the item tree (project → epic → item); bars from start to target, drag to move and edge-drag to resize, with the date change announced and undoable. Dependency lines; a dependent starting before its blocker ends shows a conflict marker, not a silent overlap. Today line, milestone markers, zoom week / month / quarter, non-working days shaded. Keyboard users edit dates in the properties rail; the chart is not the only editor.

**Automation rules.** Builder of trigger → conditions → actions, echoed as one plain sentence ("Khi chuyển sang Xong, gán nhãn Đã phát hành"). Before enabling, show how many current items match. Run log per rule with item, outcome, error. Rule actions appear in item history as "Automation", not as the rule author. Loop guard stops a rule re-triggering itself and says so.

## Density, data, and type calibration

- List rows 32–36px, compact by default (convention); cards 2–4 lines: ID, title, then property icons.
- IDs (`WEB-142`) in tabular figures; estimates right-aligned; progress as "x/y", not only a bar.
- Dates: absolute for due and target (dd/mm, year only when not current), relative for updated/created; overdue is the only red date.
- Status: icon shape plus color plus label; priority: icon plus text. Never color alone.
- Color budget: status categories, overdue, blocked. Labels use muted tints; do not give every label a saturated hue.

## Localization notes

- Single-key shortcuts must not fire in text fields or during IME composition (`event.isComposing`); Telex/VNI typing uses letters and will otherwise set statuses mid-word.
- Week starts Monday; dates dd/mm/yyyy. Non-working-day calendars include Tết and other lunar holidays, which move yearly, plus company make-up days.
- Vietnamese status and column names run ~20–35% longer; board columns wrap headers to two lines before truncating, full name on focus.
- Names: avatar initials from the given name (last word), `vi` collation for assignee pickers, diacritic-insensitive search ("tien do" finds "tiến độ").
- Budget/cost fields in VND `1.250.000 ₫`, no minor unit.

## Study pointers

- Linear (docs and Method): opinionated defaults and keyboard speed beat unlimited configuration; triage is a first-class queue.
- Jira workflows: custom statuses under fixed categories let teams vary process while reports stay comparable.
- GitHub Projects: table, board, and roadmap are layouts of one saved view over the same items.
- Atlassian drag-and-drop guidelines: every drag needs a menu-based equivalent and a precise drop indicator.

## Archetype anti-patterns

- **Views that drop items silently**: undated or unstatused work vanishes from Timeline/Board. P1.
- **Drag-only reordering and status change**: no keyboard or touch path. P1.
- **Free-form statuses with no categories**: progress and reports become meaningless. P1.
- **Shortcuts firing while typing**: Vietnamese input corrupts item properties. P1.
- **Silent rank snap-back on sorted views**: users think drag is broken. P2.
- **Gantt overlap without conflict marker**: schedules look feasible when they are not. P2.
- **Bulk edit without scope or undo**: hundreds of items changed by accident. P1.

## Coverage additions

- [ ] Each layout: filter persistence, grouping, "no value"/unscheduled tray, URL state.
- [ ] Workflow: categories, restricted transitions while dragging, required-field transition form, status delete remap.
- [ ] Board: WIP limit, swimlanes, move-to menu, multi-drag, sorted-view rank rule.
- [ ] Item: relations and blocked state on cards, sub-item progress, compacted history.
- [ ] Keyboard: navigation, property keys, `?` sheet, IME-safe handling.
- [ ] Bulk: visible vs all-matching scope, undo, partial failure.
- [ ] Cycle: capacity estimate, rollover marker, scope change, cooldown.
- [ ] Timeline: dependency conflict, non-working days, date edit outside the chart.
- [ ] Automation: plain-sentence summary, match preview, run log, loop guard.

## Sources

- https://linear.app/docs/triage (accessed 2026-09-28)
- https://linear.app/docs/use-cycles (accessed 2026-09-28)
- https://linear.app/docs/display-options (accessed 2026-09-28)
- https://linear.app/docs/issue-relations (accessed 2026-09-28)
- https://linear.app/method/introduction (accessed 2026-09-28)
- https://support.atlassian.com/jira-cloud-administration/docs/work-with-issue-workflows/ (accessed 2026-09-28)
- https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines (accessed 2026-09-28)
- https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/changing-the-layout-of-a-view (accessed 2026-09-28)
- Practitioner knowledge: Backlog/Canceled categories beyond Jira's three, keyboard map, WIP limits, Gantt conflict marking, automation run log and loop guard, density values, Vietnamese calendar and IME notes.
