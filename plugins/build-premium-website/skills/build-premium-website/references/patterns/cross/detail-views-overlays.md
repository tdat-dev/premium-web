# Pattern family: Detail views and overlays

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: record presentation variants, detail page anatomy, modality, overlay stacking, confirmation dialogs, overlay URLs.

Elsewhere: launching list → [data-tables-collections.md](data-tables-collections.md); shell, breadcrumbs → [app-shell-navigation.md](app-shell-navigation.md); edit forms, inline edit → [forms-wizards-settings.md](forms-wizards-settings.md); toasts, undo → [feedback-states-notifications.md](feedback-states-notifications.md); presence, comments → [collaboration-realtime.md](collaboration-realtime.md); audit log → [permissions-roles-audit.md](permissions-roles-audit.md). Focus containment and restoration: [dashboard-product-contract.md](../../dashboard-product-contract.md).

## Choose the variant

| Observable predicate | Variant |
|---|---|
| Record has its own sub-navigation (related collections, settings), is linked, shared, bookmarked, or worked on for minutes | Full page (canonical) |
| User triages a list: open, glance, act, next record; throughput is the metric; desktop width | Split pane (list + detail) |
| User checks a record occasionally and returns to the list within seconds | Drawer / side sheet |
| Supporting context while the primary task stays on the page (log line, user card, help) | Inline (non-modal) drawer |
| Short task that must finish before the page behind can change: confirm, 1–5 field quick create, pick one | Modal |
| Referenced entity inside text or a cell (mention, ID, avatar) needs a glance | Peek popover (read-only) |
| A row has a few extra attributes worth comparing with neighbors (under ~10 lines) | Inline expand |
| Two or more records compared | Split pane with multi-select summary, or a compare page; never two modals |

Split pane position: bottom when the table needs 5+ columns, side when 5 or fewer matter (Cloudscape). A split pane or drawer shows a subset; it never replaces the full page. Every lightweight variant carries an "Open full page" route.

## Anatomy

**Full detail page**, top to bottom:
1. Parent context: breadcrumb or back link that returns to the list with filters, sort, and scroll intact.
2. Header: identity (name, copyable ID, type icon or avatar), status (text + icon, color as reinforcement only), meta line (owner, updated time, 2–4 key attributes), one primary action, up to two secondary actions, overflow menu with destructive items last and separated.
3. Record-state alert slot: archived, read-only, sync failed, pending approval. Empty when nothing applies.
4. Body. Use stacked sections when content reads top to bottom and fits in about three screens; add an in-page section index past four sections. Use tabs when groups are independent, actionable tasks or related collections (Cloudscape "details with tabs" and "details as hub"). Overview first. Tab counts only on collection tabs.
5. Properties sidebar (right): key/value list, status and ownership first, dates next, then custom fields. Unset values read "Not set" with an inline action when editable.
6. Activity timeline: each entry = actor + verb + object + time (relative, absolute on focus). Declare the order: newest first for audit-style feeds, oldest first for conversations, with the composer at the end the reader reaches last. Group by day. Collapse runs of system events ("8 field changes"). Filter: All / Comments / Changes.

**Drawer / side sheet**: header (title + status, prev/next when launched from a list, "Open full page", close), scrollable body with the summary subset, sticky footer only when the drawer edits.

**Split pane**: list (selection highlighted, own scroll) | splitter | detail pane with the full-page header minus breadcrumb. No selection: one line telling the user to select a row. Multi-selection: an aggregate (status counts, side-by-side attributes for up to 5 records, per Cloudscape). Do not repeat header actions from the list in the pane.

**Modal**: title as verb + object ("Invite members"), body, footer with secondary then primary on the right; the primary label repeats the title verb (Atlassian). Close button always visible.

**Confirmation dialog**: title names the action and scope ("Delete 3 invoices?"); body states consequence, what remains safe, and whether it can be undone; buttons name outcomes ("Delete invoices" / "Keep invoices"), never Yes/No (NN/g). For irreversible, wide-blast actions add type-the-name confirmation; reserve it for rare actions or it stops working.

**Peek popover**: identity, 3–5 attributes, "Open" link. No forms, no destructive actions.

**Inline expand**: disclosure button in the row, expanded region directly below spanning all columns.

## Behavior and states

- **Stacking policy.** Allowed depth: page → drawer or split pane → one modal. No modal opened from a modal (Atlassian). If a modal needs a sub-task, promote the flow to a page or wizard, or swap the modal body in place with a Back control. Menus and popovers close when a modal opens. Toasts sit above modals on the z-index scale in [craft-rules.md](../../craft-rules.md).
- **Modal vs non-modal.** Modal only when the page behind must not change while the user decides. Context drawers are non-modal: no scrim, no focus trap, the page stays usable. Inline drawers push content; overlay drawers cover it and suit narrow widths only. Set `aria-modal="true"` only when the outside is truly inert.
- **URL addressability.** Full page: canonical path. Drawer and split selection: selected ID in the query (`?selected=INV-204`) so reload, share, and back restore the view; back closes the drawer rather than leaving the list (NN/g). Tabs: path or query. Confirmations and transient quick-create modals are not addressable and never push history.
- **Dirty overlays.** Esc, scrim click, or close with unsaved input prompts before discarding (Cloudscape).
- **Prev/next.** Follows current list order and filters. If an edit drops the record from the filtered list, keep it open with "No longer matches your filters".
- **Loading.** Render the header from list data immediately; skeleton only the body.
- **Missing or deleted.** Drawer: "This record was deleted" + close. Page: not-found with a link to the list. Read-only: a visible header indicator, not silently missing buttons.
- **Stale while open.** Non-blocking notice ("Lan updated this 1 min ago · Reload").
- **Focus after delete.** Next row, or the list heading if none remains.

## Keyboard and accessibility

- Modal and confirmation: WAI-ARIA APG Dialog (Modal) and Alert Dialog. Tab cycles inside, Esc closes, focus returns to the invoker or a logical successor. Confirmations use `role="alertdialog"` with `aria-describedby` on the consequence text, and initial focus on the least destructive action (APG).
- Long modal content: focus the title (tabindex="-1") instead of an interactive element far down (APG).
- Non-modal drawer or split pane: a labeled `region` or `complementary`; on open, move focus to its heading; Esc closes and returns to the row; provide a shortcut to move between list and pane (F6 is a common convention).
- Detail tabs: APG Tabs; use manual activation when a tab panel fetches data.
- Inline expand: APG Disclosure (`aria-expanded` on the button).
- Peek popover: opens on focus as well as hover, dismissible with Esc, hoverable, and persistent until dismissed (WCAG 1.4.13).
- Shortcuts (convention): Enter opens, Esc closes, J/K next/previous, Ctrl/Cmd+Enter submits; never the only path.

## Responsive transformation

- Split pane → list only; selecting pushes a full-screen detail route with a back control.
- Side drawer → full-width sheet with sticky header and close (GitLab uses full viewport width at small breakpoints). Bottom sheets only for short action lists.
- Modal → full-screen dialog when content exceeds about half the viewport; footer stays above the virtual keyboard.
- Properties sidebar → a "Details" disclosure above the body, or its own tab.
- Header actions → primary stays visible; the rest move to overflow. Never drop an action.
- Peek popover → tap navigates straight to the record.

## Defaults

- Context drawer 400px (GitLab); editable drawer 480–640px (convention). Splitter only when needed (PatternFly); remember size and position per user (convention).
- Modal widths ~400 / ~600 / ~800–960px for confirm / form / large; body scrolls, max height ~90vh (convention).
- Split pane minimums: list ~360px, detail ~400px (convention). Compare cap: 5 records (Cloudscape).
- Motion: drawer slide ~200ms (GitLab), modal 150–200ms ease-out (convention); reduced motion is instant.
- Hover peek ~300–500ms open, ~200ms close delay (convention).
- Header: 1 primary + up to 2 visible secondary actions; timeline shows latest 20, then "Show older" (convention).

## Anti-patterns

- **Record detail in a modal** — cannot be shared, bookmarked, or kept beside the list — P1.
- **Modal on modal** — focus and escape order break — P1.
- **Returning from detail resets list filters or scroll** — P1.
- **Scrim click discards a dirty form** — silent data loss — P1.
- **Hover-only peek** — unreachable by keyboard and touch — P1.
- **Yes/No confirmations, or confirming every reversible action** — habituation; prefer undo — P2.
- **Drawer without "Open full page"** — dead end — P2.
- **Tabs for two short sections, or primary facts hidden behind a tab** — P2.
- **Properties sidebar as nested cards** — craft ban — P2.

## Coverage additions

- [ ] Variant chosen per record type with the predicate recorded.
- [ ] Page and drawer/split selection deep links restore on reload and back/forward.
- [ ] Overlay depth never exceeds page → drawer → one modal; dirty close prompts on Esc, scrim, close, route change.
- [ ] Confirmations name scope and outcome, focus the safe action, return focus to a logical successor.
- [ ] Prev/next, deleted-while-open, read-only, stale-while-open rendered.
- [ ] Narrow width: split → push route, drawer → full sheet, modal → full screen, no dropped action.

## Sources

All URLs accessed 2026-09-28.

- https://cloudscape.design/patterns/resource-management/details/
- https://cloudscape.design/patterns/resource-management/view/split-view/
- https://cloudscape.design/patterns/general/unsaved-changes/
- https://www.patternfly.org/components/drawer/design-guidelines
- https://design.gitlab.com/components/drawer
- https://atlassian.design/components/modal-dialog/usage
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- https://www.nngroup.com/articles/modal-nonmodal-dialog/
- https://www.nngroup.com/articles/overuse-of-overlays/
- https://www.nngroup.com/articles/confirmation-dialog/
- Practitioner knowledge: timeline ordering, prev/next behavior, shortcut conventions, WCAG 1.4.13 application to peeks.
