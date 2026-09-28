# Pattern family: Collaboration and realtime

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: presence (avatars, cursors, selections), live updates without layout shift, conflict handling (optimistic, last-write-wins, locking, merge), comments and threads, @mentions, reactions, activity feed and history, version history and restore, followers/watchers, sharing notifications.

Elsewhere: who may comment, edit, or share → [permissions-roles-audit.md](permissions-roles-audit.md). Toasts, inbox, and notification preferences → [feedback-states-notifications.md](feedback-states-notifications.md). Comment side panels and drawers → [detail-views-overlays.md](detail-views-overlays.md). Canvas-specific multiplayer → [creative-editor-canvas.md](../archetypes/creative-editor-canvas.md). Document editors → [docs-knowledge-cms.md](../archetypes/docs-knowledge-cms.md). The contract already requires a concurrent-edit state; this file defines its rendering.

## Choose the variant

| Observable predicate | Concurrency strategy |
|---|---|
| Records edited by one person at a time, rare overlap (CRM contact, settings) | Optimistic save + version check on write; on mismatch show conflict panel |
| Many people edit different properties of shared objects (boards, canvases, spreadsheets) | Field-level last-write-wins, server-ordered; live propagation |
| Free text co-edited at the same time (docs, notes) | Character-level merge (CRDT/OT) with live cursors |
| Edits are expensive or regulated (invoice, contract, config deploy) | Explicit lock: "Editing by Hoa, since 10:42" with request/force-unlock by admin |
| Data changes from other users or systems but users only read (monitoring, queue) | Live updates buffered behind "N new items" control |

| Observable predicate | Presence level |
|---|---|
| Async work, collaborators rarely overlap | None, or "Last edited by" line |
| Same record often open by 2+ people (support ticket, CRM deal) | Avatar stack in header + "Also viewing" collision notice before replying/saving |
| Real-time co-editing | Avatar stack + live cursors/selections with name labels + follow mode |

## Anatomy

**Presence stack.** Header, right of the title: up to 3–5 avatars (initials fallback, full-diacritic initials for Vietnamese names), overflow "+N" opening a list of names with status (viewing / editing) → click a person to jump to their location or follow them. Current user is not shown in the stack.

**Live cursor / selection.** Pointer or caret in the collaborator's assigned color + name label that fades to a small tag after inactivity; selection highlight at low opacity so text stays readable.

**Collision notice.** Inline above the composer or save bar: "Linh is also replying" / "Tuan changed this record 1 minute ago. Review changes", shown before the user commits, not after.

**Conflict panel.** Triggered by a failed version check: heading "This record changed while you were editing" → per-field rows: field name, "Their version" (who, when), "Your version" → per-field choice or "Keep mine for all" / "Use theirs for all" → "Save". The user's input is never discarded without a copy.

**Lock banner.** "Hoa is editing this invoice (since 10:42)" → "Request edit" → admin-only "Take over" with consequence text. Lock auto-releases after idle timeout; banner updates live.

**Comment thread.** Anchor (highlighted text, pinned point, or record-level) → thread card: author avatar, name, absolute-on-hover relative time, body, reactions row, "Reply" → replies indented one level only → thread actions: Resolve, Copy link, Follow/Unfollow, Edit/Delete own comment. Composer: multiline field, @mention and attachments, "Comment" button, Ctrl/Cmd+Enter submits. Filter: Open / Resolved / Mentions me.

**@mention picker.** Triggered by `@` inside the composer: list of people (avatar, name, email or role), groups, and "Notify everyone here" only if permitted → people without access flagged "No access. Share and mention?" before sending.

**Reactions.** Existing reactions as chips with count and "you reacted" state → add-reaction button → small curated set first, full picker behind "More". Hover/long-press shows who reacted.

**Activity feed.** Reverse-chronological, grouped by day → each entry: actor, verb, target, time, optional inline diff snippet ("Status: In review → Done") → consecutive edits by the same actor collapse ("Mai made 6 edits") with expand → filter: All / Comments / Changes.

**Version history.** Side panel: versions grouped by session/day, each with time, authors, optional name → selecting a version previews it read-only with changes highlighted → "Restore this version" (creates a new version; nothing is erased) → "Name this version" → "Make a copy".

**Watch/follow control.** Header button "Follow" / "Following" with a menu: All activity / Mentions and assignments only / Unfollow. Auto-follow on create, assign, mention, comment (stated in the menu).

**Share notification.** Email/in-app: "<Sharer> shared <resource> with you" + their optional message + role granted + "Open".

## Behavior and states

- Optimistic UI: apply local edits immediately, mark pending subtly (no spinner per keystroke), reconcile on ack. On reject, roll back with a visible message that keeps the rejected value retrievable.
- Incoming remote changes to a value the user is currently editing do not overwrite the input; hold them and resolve on blur or save (the principle Figma describes: discard server echoes that conflict with unacknowledged local edits).
- No layout shift from live data: insert new list items above the viewport only behind a "3 new updates" pill; never move the row under the pointer or the focused row. Animate count and value changes in place; reserve space for presence and badges.
- Deleted while viewing: freeze the view, show "Nhung deleted this task" with "Restore" (if permitted) and a way back to the list.
- Permission revoked while viewing: see [permissions-roles-audit.md](permissions-roles-audit.md); preserve unsent comment drafts.
- Offline/reconnect: show "Offline. Changes saved on this device" then "Syncing…" then quiet; a conflict on reconnect uses the conflict panel.
- Comments on deleted anchors become "orphaned": keep them in the panel under "Comment on removed content" with the quoted original text.
- Resolved threads collapse, stay searchable, reopen on reply.
- Edited comments show "edited"; deleted comments with replies leave a "Comment deleted" placeholder so the thread still reads.
- Batch notifications: one person's edits within a window become one.
- Presence goes idle on inactivity and clears shortly after disconnect; no ghosts from closed tabs.

## Keyboard and accessibility

- Mention picker: WAI-ARIA APG Combobox with listbox popup; focus stays in the composer, `aria-activedescendant` tracks the option, Enter inserts, Escape closes the picker only.
- Activity feed and long comment lists that load more on scroll: APG Feed pattern (`role="feed"`, `article`, `aria-busy` during loads, Page Up/Down between entries).
- Live changes: announce summarized events through a polite live region ("2 new comments"), never every keystroke or cursor move. Remote cursors are `aria-hidden`.
- Presence stack: a button labeled "4 people viewing" that opens the list; avatars carry names.
- Reactions: toggle buttons with `aria-pressed` and label "Thumbs up, 3 people, including you".
- Version preview and conflict panel: dialog or complementary region with a heading; "Restore" confirm follows APG Dialog.
- Shortcuts (convention): Ctrl/Cmd+Enter submit comment, Ctrl/Cmd+Alt+M add comment unless it clashes with editor shortcuts, Escape cancel edit.

## Responsive transformation

- Presence stack: collapse to one avatar + count on narrow headers.
- Live cursors: hidden on touch-only small screens; presence list remains.
- Comments: side panel → bottom sheet or full-screen thread view; anchor highlight remains visible when opened from the document.
- Version history: side panel → full-screen list → preview → restore.
- Conflict panel: per-field rows stack Their/Yours vertically with labels.

## Defaults

- Visible avatars before overflow: 3–5 (convention).
- Presence idle after 60 s of inactivity, removed 30 s after disconnect (convention).
- Cursor label fades after 3–5 s idle (convention).
- Notification batching window 5–15 minutes (convention).
- Lock auto-release after 15–30 minutes idle (convention).
- Reply depth: 1 level (convention).
- Google Docs caps named versions at 40 per document; treat named versions as a limited, deliberate action.

## Anti-patterns

- **Silent last-write-wins on forms**: the second saver erases the first without either knowing. P1.
- **Live list inserts that push content under the cursor**: misclicks on the wrong row. P1.
- **Restore that deletes later versions**: irreversible data loss. P1.
- **Presence as decoration on single-user objects**: noise, costs connection budget. P2.
- **Mentions that notify people who can't open the resource**: dead-end notifications, possible leak of titles. P1.
- **Deeply nested reply trees**: unreadable on mobile, hard to follow. P2.
- **Announcing every remote change to screen readers**: unusable noise. P1.
- **Activity feed of raw event names (`task.field_updated`)**. P2.
- **Cursor colors as the only way to identify collaborators**: fails color-vision users. P2.
- **Auto-follow with no visible unfollow**: notification fatigue, users mute everything. P2.

## Coverage additions

- [ ] Two sessions edit the same field; two edit different fields; one deletes while other edits.
- [ ] Offline edit → reconnect with and without conflict.
- [ ] Lock held, requested, taken over, auto-released.
- [ ] Comment: create, edit, delete with replies, resolve, reopen, orphaned anchor.
- [ ] Mention: user with access, without access, group, self.
- [ ] Live insert while user is scrolled/focused mid-list: no shift, pill shows count.
- [ ] Version: preview, restore (new version created), name, copy.
- [ ] Follow/unfollow; batched notifications; share notification with and without message.
- [ ] Screen reader: live region summaries only.
- [ ] Vietnamese: initials from full-diacritic names (e.g. "Đặng Thu Hà" → "ĐH" or "H" per chosen rule, applied consistently); relative time strings translated ("2 phút trước").

## Sources

- https://www.figma.com/blog/how-figmas-multiplayer-technology-works/ (accessed 2026-09-28)
- https://primer.style/product/ui-patterns/saving (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/feed/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (accessed 2026-09-28)
- https://support.google.com/docs/answer/190843?hl=en (accessed 2026-09-28)
- https://liveblocks.io/docs/ready-made-features/comments (accessed 2026-09-28)
- https://support.google.com/drive/answer/2494822?hl=en (accessed 2026-09-28)
- Practitioner knowledge: concurrency strategy selection, collision notices, lock banners, layout-stable live updates, notification batching, presence timing.
