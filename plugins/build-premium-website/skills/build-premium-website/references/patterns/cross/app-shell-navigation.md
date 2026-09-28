# Pattern family: App shell and navigation

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: shell topology, workspace/tenant/app switchers, breadcrumbs, tabs as navigation, secondary nav, collapsed rail, mobile bottom bar vs drawer, global utility placement, nav IA sizing.

Elsewhere: the base navigation checklist is in [dashboard-product-contract.md](../../dashboard-product-contract.md) "Information architecture and navigation" and is not restated. Search overlay and command palette internals: [filters-search-command.md](filters-search-command.md). Split panes and drawers for records: [detail-views-overlays.md](detail-views-overlays.md). Notification panel content: [feedback-states-notifications.md](feedback-states-notifications.md). Org creation and sign-in: [auth-onboarding-account.md](auth-onboarding-account.md). Role-gated nav visibility: [permissions-roles-audit.md](permissions-roles-audit.md).

## Choose the variant

| Observable predicate | Shell |
|---|---|
| Fewer than 5 primary destinations, no second level, IA stable | Top nav only; secondary sections as underline nav below the header |
| 5+ primary destinations, any second level, or IA expected to grow | Left sidebar + slim top bar (default for product work) |
| User processes a queue: pick item, read it, act, next | Three-pane: nav, list, detail |
| User keeps several objects open and switches between them in one session | Workspace with document tabs above content |
| The work surface is a canvas, editor, or map | Minimal top bar, collapsible tool panels; primary nav leaves the canvas (a back-to-home control or a drawer) |
| Users belong to more than one org, tenant, or workspace | Scope switcher at the very top of the sidebar or top-left of the top bar, always showing the current scope |
| One account spans several products | App switcher in the top bar outer edge |

Secondary navigation:

- Sub-sections of one object with their own URLs: link tabs (underline nav). Same-data perspectives without a URL change: panel tabs or a segmented control.
- Sidebar depth max two tiers; a third level becomes link tabs in the page.
- Breadcrumbs when hierarchy is 3+ levels and users land deep from search, links, or notifications. Skip on flat products.
- Icon rail only for daily tools whose icons users have learned.
- Mobile: 3–5 frequent peer destinations switched within a session → bottom bar. More, or browse-mostly → drawer. Never both for the same items.

## Anatomy

**Sidebar shell (in DOM order)**
1. Skip link to main.
2. Top bar. Start: menu toggle (narrow widths only), product mark linking home, scope switcher if not in sidebar. Middle or start-adjacent: search trigger with shortcut hint. End, right to left from the edge: account menu, notifications, help, then product-specific utilities, then create. An app switcher, when present, takes the outermost slot so it never shifts.
3. Sidebar: scope switcher, primary groups (optional non-interactive group labels), pinned or recent items if the product has them, bottom zone with settings and the collapse toggle.
4. Main: breadcrumbs, page header (title, status, primary action, secondary actions in an overflow menu), link tabs, content.
5. Optional aside panel (help, properties, activity), resizable and closable.

**Top-nav shell**: product mark, 3–5 section links, utility cluster at the end, then secondary underline nav as a second row inside main.

**Three-pane**: nav (often a rail), list pane (scope title, count, filter, list), detail pane (record header with actions, body), keyboard-operable resizers.

**Workspace tabs**: tab strip (title, unsaved dot, close), overflow menu of open tabs with "Reopen closed tab". Tabs survive reload.

**Scope switcher**: trigger shows current name, initials, chevron, and is named "Switch workspace". Menu: search once past 7 entries, check on current, role or plan as secondary text, then "Create workspace", "Manage workspaces".

**Account menu**: name and email, current org, profile, preferences, keyboard shortcuts, sign out last.

**Mobile bottom bar**: 3–5 items, icon plus visible label, "More" last when needed.

**IA sizing rules**
- 5–9 primary items visible without scrolling at 768px viewport height (convention). Past 9, group under labels; past ~15, fix the IA (split admin out, merge objects).
- Labels are 1–2 word nouns, keyword first. Verbs belong on the create button.
- Settings, billing, admin go in the sidebar bottom zone or account menu, not among work objects.
- One global create entry; page-level primary actions live in the page header.

## Behavior and states

- Exactly one current item, marked `aria-current="page"`. Detail pages keep their parent section current; a group containing the current page loads expanded.
- One expansion mechanism per level (expand, flyout, or drilldown), never mixed among siblings.
- Persist sidebar state and panel widths per user.
- Scope switch re-scopes every screen: land on the same page in the new scope if it exists, else its home. Never carry a record ID across tenants. Scope goes in the URL and document title. Guard unsaved changes. One tenant's data under another tenant's name is a P0.
- Nav badges only for actionable queues, capped at "99+".
- The bell opens a panel (unread/all, mark all read, link to full inbox), not a page.
- Create: one type opens directly; several open a menu ("New order", "New customer").
- Items the role can never reach are hidden; items reachable by upgrade or access request stay visible with a reason.
- The shell renders immediately and never skeletons its nav; only counts and switcher lists load async.
- Long labels wrap to two lines in expanded nav; rail truncates with a tooltip. Vietnamese labels run 20–35% longer than English.
- After client-side route change, move focus to the page `h1` and update the document title.

## Keyboard and accessibility

- Landmarks: `header`, `nav` with distinct labels ("Main", "Order sections"), `main`, `aside`, in DOM order matching visual order.
- Nav is a list of links, never `role="menu"`. Expandable groups follow APG Disclosure; account, create, and switcher menus follow APG Menu Button.
- Panel tabs follow APG Tabs; link tabs are links with `aria-current`.
- The mobile drawer follows APG Dialog (Modal): focus in, Tab contained, Escape closes, focus returns to the menu button.
- Rail icons have accessible names and show tooltips on focus too.
- Shortcuts: modifier + K for search/palette, `g` + letter go-to sequences, `?` for the list; single-key shortcuts must be disableable (WCAG 2.1.4). See [filters-search-command.md](filters-search-command.md).

## Responsive transformation

| Width | Sidebar shell | Three-pane | Utilities |
|---|---|---|---|
| 1280px+ | Sidebar expanded, aside inline | All three panes | Full cluster |
| 1024–1279px | Sidebar may collapse to rail; aside becomes an overlay | Nav as rail, list + detail | Full cluster |
| 768–1023px | Sidebar becomes an off-canvas drawer from the top-bar menu button | List + detail; nav in drawer | Help moves into account menu |
| Under 768px | Top bar: menu, page title, search icon, account. Bottom bar if the predicate above holds | Single stack: list, then detail with a back link to the list | Notifications and account stay visible |

- Breadcrumbs collapse to one parent link ("‹ Orders"); never wrap. Link tabs overflow into "More" or scroll with a cut-off tab as the cue. Workspace tabs become a switcher list. The scope switcher stays reachable, at least at the top of the drawer.

## Defaults

- Top bar height 48–56px (convention).
- Sidebar 240–280px expanded, rail 56–64px (convention). Resizable range 200–400px (convention).
- Nav item height 32–36px on pointer layouts, 44px+ where touch is primary (convention; WCAG 2.5.8 sets a 24px minimum target).
- Primary nav items 5–9 before grouping (convention). Horizontal top nav under 5 items (PatternFly).
- Sidebar depth max two tiers (Carbon).
- Bottom bar max 5 items (NN/g).
- Switcher search above 7 entries (convention). Badge cap "99+" (convention).
- Drawer open/close 200–250ms ease-out, instant under reduced motion (convention).

## Anti-patterns

- **Stub navigation**: nav items labelled "Coming soon", "Chưa có", or greyed-out placeholders to fill a sidebar in a single-screen build. Show only destinations derived from the product's object model; items outside scope render as normal links recorded as out-of-scope, or are omitted. P1.
- **Icon-only rail for occasional users**: every visit pays a decoding cost. P1.
- **Hamburger hiding primary nav on desktop**: out of sight, out of mind. P1.
- **Panel tabs for distinct sections**: no deep link or back. P1.
- **`role="menu"` on the main nav**: wrong keyboard model. P1.
- **Hover-only flyouts**: unreachable by touch and keyboard. P1.
- **Ambiguous current scope**: user acts in the wrong tenant; P0 if another tenant's data renders.
- **Same links in top bar and sidebar**: doubles scanning. P2.
- **20+ ungrouped sidebar items, settings among work objects**: an IA problem styled as layout. P2.
- **Decorative chrome** (glass sidebar, gradient active pill, side-stripe active item): banned by [craft-rules.md](../../craft-rules.md). P1.

## Coverage additions

- [ ] Shell variant recorded with the predicate that selected it.
- [ ] Primary item count, group labels, and depth (≤ 2 tiers) listed.
- [ ] Utility cluster order and the location of search, create, notifications, help, account at each breakpoint.
- [ ] Scope switch: landing rule, URL/title scope, unsaved-change guard, no cross-tenant ID carryover.
- [ ] Active state for index, detail, and nested pages.
- [ ] Link vs panel tabs per tab set; breadcrumb depth and narrow collapse.
- [ ] Focus and title update after client-side route change.
- [ ] Long/Vietnamese labels in expanded nav, rail, and bottom bar.

## Sources

- PatternFly, Navigation design guidelines: https://www.patternfly.org/components/navigation/design-guidelines (accessed 2026-09-28)
- Carbon, UI shell header usage: https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/UI-shell-header/usage.mdx (accessed 2026-09-28)
- Carbon, UI shell left panel usage: https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/UI-shell-left-panel/usage.mdx (accessed 2026-09-28)
- Atlassian, Navigation system layout: https://atlassian.design/components/navigation-system/layout/usage (accessed 2026-09-28)
- Primer, Navigation UI pattern: https://primer.style/product/ui-patterns/navigation/ (accessed 2026-09-28)
- NN/g, Left-side vertical navigation: https://www.nngroup.com/articles/vertical-nav/ (accessed 2026-09-28)
- NN/g, Mobile navigation patterns: https://www.nngroup.com/articles/mobile-navigation-patterns/ (accessed 2026-09-28)
- NN/g, Breadcrumbs: https://www.nngroup.com/articles/breadcrumbs/ (accessed 2026-09-28)
- WAI-ARIA APG, Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (accessed 2026-09-28)
- WCAG 2.2 Understanding 2.1.4 Character Key Shortcuts: https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html (accessed 2026-09-28)
- Practitioner knowledge: scope-switch rules, IA thresholds, sizes marked convention, APG pattern mapping.
