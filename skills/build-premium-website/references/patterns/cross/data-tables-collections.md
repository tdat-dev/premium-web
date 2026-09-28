# Pattern family: Data tables and collections

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: collection form choice, column design, density, inline edit, row and bulk actions, selection scope, paging strategy, saved views, column chooser, grouping, totals, export, narrow screens.

Elsewhere: the base table checklist is in [dashboard-product-contract.md](../../dashboard-product-contract.md) "Tables and collections"; this file adds only the delta. Search, filter bars, and chips: [filters-search-command.md](filters-search-command.md). Opening a record in a drawer, split pane, or page: [detail-views-overlays.md](detail-views-overlays.md). Loading, empty, and bulk-job progress visuals: [feedback-states-notifications.md](feedback-states-notifications.md).

## Choose the variant

| Observable predicate | Collection |
|---|---|
| Records share attributes users compare, sort, or scan in columns | Table |
| The table exists to act on records (open, assign, fulfill) | Index table: row opens detail, bulk actions, saved views |
| The table exists to analyze numbers across rows | Analytic table: totals, grouping, multi-sort, no row navigation required |
| Users edit many cells in place, spreadsheet-style | Data grid (APG Grid, cell focus) |
| Records are read by 1–2 attributes and the main action is open | List (title, meta line, status, trailing action) |
| Identity is visual (photos, files, designs, templates) | Card grid or gallery |
| Records move through stages, each stage holds tens not thousands, and the main action is changing stage | Board, always paired with a list/table view of the same data |
| Records nest (parent/child, account/sub-account) | Tree table or expandable rows |

A board without a list view fails keyboard, bulk, and sort needs.

## Anatomy

**Index table (in order)**
1. Header: collection name, record count, primary action ("New order").
2. Saved-view tabs: "All", system views, user views, "+ Save view".
3. Toolbar: select-all, search and filters, sort (if not in headers), view options (density, columns), export, pagination summary.
4. Sticky column header row.
5. Rows: checkbox, identifier (human-readable, a real link), attributes, status, numbers, row actions last.
6. Footer: totals, pagination, "1–50 of 1,284" in the user's locale format.
7. On selection the bulk bar replaces the toolbar: "12 selected", 2–3 promoted actions, overflow, "Clear selection".

**Board column**: stage name, count, optional sum or limit, cards (title, 2–3 attributes, owner, status), "Add" at the foot.

**Card**: media, title, 2–3 attributes, status, checkbox in a fixed corner, overflow actions. The card is one link; inner controls stop propagation.

**Column design**
- First column is the human-readable identifier; generated IDs get their own column if users search by them.
- Order by task importance, related fields adjacent.
- Text left, numbers right in tabular figures, headers aligned with their cells. Units in the header ("Amount (₫)").
- Status is a text label, never color alone.
- Fixed widths for status, dates, numbers; the identifier takes the rest. Headers wrap to two lines, then truncate with full text available.
- One consistent null glyph with an accessible label ("No value"), distinct from zero.
- 5–8 visible columns by default; the rest via the column chooser.

**Density**: compact, default, comfortable; header row matches body. Compact for all-day operational queues, default for occasional admin. Zebra for 5+ columns, horizontal scroll, or virtualization.

## Behavior and states

**Row click**: with a primary link, the whole row opens it; checkboxes, inline controls, and menus do not. The identifier is a real anchor so modifier-click opens a new tab.

**Row actions**: fewer than three inline as labeled icon buttons, else an overflow menu in the last column. Visible on touch; hover-reveal is a pointer enhancement only. Disabled while the bulk bar is active.

**Selection scope**
- The header checkbox selects the visible page, indeterminate when partial.
- Then offer the wider scope explicitly: "All 50 on this page are selected. Select all 1,284 orders" (or "matching these filters").
- State whether selection survives paging and filter changes; if a filter drops selected rows, say how many.
- Destructive bulk confirms with count and scope in the button ("Delete 1,284 orders").
- Long bulk jobs run in the background with progress and a partial-failure report ("1,270 updated. 14 failed. View failed items") opening the failed set as a filtered view.

**Inline edit**: only low-risk fields without side effects (name, tag, owner). Enter or F2 starts, Escape cancels, Enter or blur saves with a visible saving state, errors stay in the cell. Fields touching money, notifications, or state transitions open a form.

**Sorting**: one column by default; multi-sort only in analytic tables, shown numbered. Sort, filters, page, and view live in the URL.

**Loading strategy**
- Paginate above 50 rows; page sizes 25/50/100. Unknown totals get cursor paging ("Previous", "Next"), never a fake page count.
- "Load more" for mobile lists where footer access matters. Infinite scroll only for goal-less feeds, never where users compare or return to a position.
- Virtualize client-side grids above a few hundred rows with stable row height.
- Returning from detail restores page, scroll, and focus on the opened row.
- Background refresh never reorders rows under the pointer: show "8 new orders. Show them".

**Saved views**: store filters, sort, columns, column order, density, grouping. Edits mark the view changed with "Save", "Save as new view", "Discard changes". Views have an owner and visibility (only me, team); system views can't be deleted.

**Column chooser**: checkbox list, reorder by drag plus "Move up/Move down" buttons, identifier locked, "Reset to default", persisted per user per view.

**Grouping**: collapsible group header with label, count, aggregates, sticky while its rows scroll.

**Totals**: a footer row naming its scope ("Total for this page" vs "Total for 1,284 filtered orders"). A page sum is never a grand total.

**Export**: ask scope (selected, filtered, all) and columns (visible, all). Large exports run as a job and notify. Filename carries collection and date. CSV holds raw values; formatting belongs to XLSX.

## Keyboard and accessibility

- Read-only data: native `table`, `th scope`, caption, `aria-sort` on the sorted header, sort buttons inside headers.
- Editable or cell-navigable data: APG Grid. One tab stop, arrows between cells, Ctrl+Home/End to extremes, Enter or F2 to edit, Escape back to navigation, Shift+Space selects a row.
- Virtualized rows set `aria-rowcount` and `aria-rowindex`.
- Selection and bulk results announce in a polite live region ("12 selected").
- Boards offer a "Move to…" menu per card; drag-only fails.
- List shortcuts (j/k, x) follow [filters-search-command.md](filters-search-command.md).

## Responsive transformation

- **Column priority**: keep identifier, status, 1–2 key attributes; the rest move to an expandable row or the detail view.
- **Horizontal scroll** when cross-column comparison is the job: frozen identifier, sticky actions column, a cut-off column as the cue.
- **Stacked label-value rows** only when records are read one at a time.
- **Bulk on small screens**: a "Select" button or long-press enters selection mode, bulk bar pinned bottom.
- **Toolbar**: filters collapse to "Filters (3)"; view options and export go to overflow.
- **Card grid** auto-fits to one column. **Board** shows one stage at a time with a stage switcher and counts.

## Defaults

- Row heights: compact 32px, default 40px, comfortable 48px (convention). Header row matches body.
- Paginate above 50 items (Polaris). Page sizes 25/50/100 (convention).
- Inline row actions: fewer than three, else overflow (Carbon). Toolbar surfaces at most 2 buttons, rest in overflow (PatternFly).
- Zebra for 5+ columns, horizontal scroll, or virtualization (PatternFly).
- "X more" overflow for multi-value cells: popover up to 7 items, searchable dialog for 8+ (PatternFly).
- Hide bulk actions below 490px only when non-essential (Polaris).
- Default visible columns 5–8 (convention).

## Anti-patterns

- **Every row becomes a card on mobile**: comparison dies and scroll length explodes. P1.
- **Hover-only row actions**: invisible on touch, unreachable by keyboard. P1.
- **Select-all silently means all pages**: users bulk-delete what they never saw. P1.
- **Page total labeled as grand total**: false numbers. P1.
- **Infinite scroll on an index table**: lost position on back, no footer, no "row 800". P1.
- **Generated IDs as the first column**: nothing to scan by. P2.
- **Centered or left-aligned numbers without tabular figures**: magnitudes can't be compared. P2.
- **Inline edit on fields with side effects**: a blur triggers a charge or email. P1.
- **Board with no list view**: no sort, bulk, or keyboard path. P1.
- **Background refresh reorders rows under the cursor**: misclicks on the wrong record. P1.

## Coverage additions

- [ ] Collection variant recorded with its predicate; board has a paired list view.
- [ ] Identifier column, priority order, header units, null glyph, numeric alignment, density.
- [ ] Selection scope messages: page, all matching, cleared-by-filter count.
- [ ] Bulk bar, destructive bulk confirmation with count, partial-failure report.
- [ ] Inline edit fields listed with save/cancel/error states, or "none".
- [ ] Paging strategy with justification; position and focus restored on return.
- [ ] Saved views: stored properties, changed state, visibility.
- [ ] Column chooser keyboard reorder; totals scope label; export scope and job flow.
- [ ] Narrow-screen strategy per table: priority, frozen column, or stacked.

## Sources

- Carbon, Data table usage: https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/data-table/usage.mdx (accessed 2026-09-28)
- PatternFly, Table design guidelines: https://www.patternfly.org/components/table/design-guidelines (accessed 2026-09-28)
- PatternFly, Toolbar design guidelines: https://www.patternfly.org/components/toolbar/design-guidelines (accessed 2026-09-28)
- Shopify Polaris, Index table: https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/tables/index-table.mdx (accessed 2026-09-28)
- NN/g, Data tables: https://www.nngroup.com/articles/data-tables/ (accessed 2026-09-28)
- NN/g, Mobile tables: https://www.nngroup.com/articles/mobile-tables/ (accessed 2026-09-28)
- NN/g, Infinite scrolling tips: https://www.nngroup.com/articles/infinite-scrolling-tips/ (accessed 2026-09-28)
- WAI-ARIA APG, Grid pattern: https://www.w3.org/WAI/ARIA/apg/patterns/grid/ (accessed 2026-09-28)
- Practitioner knowledge: saved views, totals and export scope, refresh insertion, values marked convention.
