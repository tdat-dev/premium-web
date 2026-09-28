# Pattern family: Feedback, states, and notifications

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: empty-state anatomy, loading indicators, message surfaces, undo, notification center, digests, badges, background jobs, system banners.

That each state must exist is already required ("System states and recovery" in [dashboard-product-contract.md](../../dashboard-product-contract.md)); this file adds anatomy and choice rules. Validation → [forms-wizards-settings.md](forms-wizards-settings.md). Confirmations → [detail-views-overlays.md](detail-views-overlays.md). Bell placement → [app-shell-navigation.md](app-shell-navigation.md). Mentions → [collaboration-realtime.md](collaboration-realtime.md). Copy → [copy-voice.md](../../copy-voice.md).

## Choose the variant

**Loading indicator** (thresholds from NN/g)

| Wait and context | Indicator |
|---|---|
| Under ~1s | None; the pressed control changes state immediately |
| 1–10s, page or region with known structure, first load | Skeleton matching the final layout |
| 1–10s, one module or one action | Inline spinner in the region or button; button keeps its width and reads "Saving…" |
| Over ~10s, or a countable quantity | Determinate progress with a count: "Importing 340 of 1.200 rows" |
| Minutes, or the user should not wait | Background job (below) |
| Refreshing data already on screen | Keep the old data, show "Updating…" then "Updated 2 min ago"; no skeleton |

**Message surface**

| Situation | Surface |
|---|---|
| The user's own action succeeded, and the result is visible anyway | Toast |
| Reversible destructive action | Toast with Undo |
| An action on a record or region failed | Inline alert in that region, persistent until resolved or dismissed |
| Several operation results on one page (created, failed, in progress) | Page alert stack at the top of content (Cloudscape flashbar) |
| System-wide condition: outage, maintenance, read-only mode, trial ending | Global banner, one at a time |
| Data loss or a decision is required before continuing | Alert dialog |
| Event not caused by the user just now: mention, assignment, job done while away | Notification center entry, plus a toast only if the user is present and it is time-sensitive (PatternFly) |
| Passive status: unread, sync state, new items | Badge or indicator; no message (NN/g) |

## Anatomy

**Empty states** (types from PatternFly and Cloudscape):

| Type | Heading | Body | Action |
|---|---|---|---|
| First use | Names what will live here: "No invoices yet" | One sentence on what to do or why it matters | Primary: same label as the page's create button (Cloudscape). Secondary: import, sample data, or help link |
| No results | "No matches" | Echo the query and active filters | "Clear filters"; filter bar stays visible |
| Cleared / done | "You're all caught up" | Optional: when new items arrive | None, or a link to the next useful place |
| No permission | "You don't have access to billing" | Who can grant it, by name or role | "Request access"; never a create button |
| Needs setup | "Connect a payment provider first" | The blocking step | Link to that setting |
| Load failed | Not an empty state: use an inline error with Retry, keep last known data (Cloudscape) | | |
| Empty field value | "–" (en dash, never the em-dash) with accessible name "Not set" | | Inline action if editable |

Compact in cards, tables, modals; large for a full page (PatternFly).

**Toast**: status icon + message (1–2 lines) → at most one action (Undo, View) → close button. Newest on top, at most 3 visible (convention; Atlassian stacks newest first). One consistent corner.

**Inline alert / banner**: severity icon + title + body → up to 2 actions (Atlassian caps flags at two) → dismiss only if non-critical. Severity carried by icon and wording, not a colored side stripe (craft ban).

**Undo**: the action applies optimistically and commits after the window, or soft-deletes to a Trash/Archive with Restore. The toast states scope ("3 conversations archived · Undo"). After the toast leaves, a persistent recovery path remains. Ctrl/Cmd+Z works where the app keeps an undo stack.

**Notification center**: bell in the top bar with an unread badge → panel or inbox page: header (title, All / Unread / Mentions filter, "Mark all as read", settings link) → groups by time (Today, Earlier) → item: actor avatar, sentence ("Lan assigned you INV-204"), relative time, unread dot plus bold text, optional inline action (Approve, Reply) → empty state "You're all caught up". Collapse repeats ("Lan and 4 others commented on…"). Clicking deep-links to the object with the item highlighted and marks it read (PatternFly).

**Notification preferences**: a matrix of event types × channels (in-app, email, push; Zalo/SMS where the product uses them), sensible defaults, per-thread mute.

**Digest email**: subject carries count and top item → items grouped by project or record → each item deep-links → one-click unsubscribe per category.

**Background job row**: name and scope ("Export 12.480 orders, CSV") → state → progress with count → started by/at → actions: Cancel, Retry failed, Download, View errors.

**Global banner**: icon + one sentence + time/scope + one action (status page, "Save your work"). Pushes content down rather than covering it (Atlassian).

## Behavior and states

- **Toast timing.** Auto-dismiss only success and info whose outcome stays visible elsewhere. Errors and warnings never auto-dismiss (Atlassian). Pause the timer on hover and focus. APG warns that auto-disappearing alerts can fail WCAG 2.2.3, so nothing essential lives only in a toast.
- **Channel routing.** Immediate: direct and personal (mention, assignment, approval, security). Digest: ambient, daily at local time. Delay email and skip items already read in-app (convention). Push only time-sensitive personal events, outside quiet hours.
- **Badges and counts.** Counts only for items the user owns or must act on; a dot for "new". Define "seen" (panel opened, clears badge) vs "read" (item opened, clears bold). Nav counts match the list they open; refresh on window focus.
- **Jobs.** Starting returns at once with a server-side job ID: "Export started. We'll let you know when it's ready." States: queued, running, paused, failed, partially succeeded, done, canceled. Progress survives reload, tab close, and sign-out; uploads resume from the last chunk. Partial failure offers a downloadable list of failed rows with reasons and retries only those (idempotent). Completion notifies via the center, a toast if present, email if it ran long. No blocking progress modal unless waiting is the task. ETA only when reliable.
- **Global banner priority**: outage > maintenance in progress (read-only) > scheduled maintenance > billing/trial > announcements. Scheduled maintenance gives local time, timezone, duration. In read-only mode write controls stay visible with the reason. Offline: "You're offline. Changes will sync when you're back." Critical banners are not dismissible and clear when resolved (Atlassian); info banners stay dismissed once closed.

## Keyboard and accessibility

- APG Alert: `role="alert"` for errors; it does not move focus; avoid alerts that disappear on their own; limit frequency.
- Success toasts: a polite live region (`role="status"`). Blocking decisions: APG Alert Dialog.
- Toast actions must be keyboard-reachable: a documented shortcut to focus the toast region (F6 is a common convention) and a timer that pauses on focus.
- Notification panel: non-modal dialog or disclosure region; Esc closes and returns focus to the bell. Bell accessible name includes the count: "Notifications, 3 unread".
- Progress: `role="progressbar"` with `aria-valuetext` ("340 of 1.200 rows"). Announce milestones and completion, not every percent.
- Skeleton regions set `aria-busy="true"`; skeleton shapes are hidden from assistive tech; announce "24 results loaded".

## Responsive transformation

- Toasts: full width at the bottom above bottom nav and safe areas, one at a time.
- Notification panel → full-screen inbox page with back. Jobs tray → jobs list page.
- Banners wrap instead of truncating (Atlassian); actions move below the text.
- Empty states drop illustrations first, never the action.

## Defaults

- Loading thresholds ~1s and ~10s (NN/g).
- Toast ~5s success/info, ~8–10s with Undo, errors persistent; max 3 visible; badge cap "99+" (convention).
- Skeleton shows after ~300ms; spinner stays at least ~500ms once shown, to avoid flicker (convention).
- Notification retention ~90 days; email-after-unread delay ~5–15 min (convention).

## Anti-patterns

- **Error toast that auto-dismisses**: failure and recovery missed. P1.
- **One generic empty state for first use, no results, and no permission**: wrong action offered. P1.
- **Spinner for a multi-minute job, or progress lost on reload**. P1.
- **Text-only "Loading…" with no structure**. P2 (NN/g).
- **Confirm dialog where undo would do**: habituation. P2.
- **Badge counts that disagree with the list**. P2.
- **Email for everything, no per-category unsubscribe**: users mute the channel. P2.
- **Stacked global banners, or marketing in the system banner slot**. P2.
- **Celebratory illustration and exclamation on routine empty states**: copy-voice. P2.

## Coverage additions

- [ ] Distinct first-use, no-results, no-permission, needs-setup, load-failed renders per collection.
- [ ] Loading indicator matches the wait class; background refresh keeps old data.
- [ ] Messages routed by the surface table; no error auto-dismisses; undo with a persistent restore path.
- [ ] Notification center: unread/read, mark all, grouping, deep link, empty, preferences matrix.
- [ ] Long jobs: queued, running, partial failure, canceled, done, survives reload.
- [ ] Global banner priority, maintenance, read-only, offline, reconnect.

## Sources

All URLs accessed 2026-09-28.

- https://www.nngroup.com/articles/progress-indicators/
- https://www.nngroup.com/articles/skeleton-screens/
- https://www.nngroup.com/articles/indicators-validations-notifications/
- https://www.nngroup.com/articles/confirmation-dialog/
- https://cloudscape.design/patterns/general/empty-states/
- https://cloudscape.design/components/flashbar/
- https://www.patternfly.org/components/empty-state/design-guidelines
- https://www.patternfly.org/components/notification-drawer/design-guidelines
- https://atlassian.design/components/flag/usage
- https://atlassian.design/components/banner/usage
- https://www.w3.org/WAI/ARIA/apg/patterns/alert/
- https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- Practitioner knowledge: job resumability, digest routing, badge seen/read split, banner priority order.
