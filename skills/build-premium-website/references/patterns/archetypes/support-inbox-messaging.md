# Archetype: Support inbox and messaging

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: answer every customer within target, never reply twice or not at all, hand off cleanly, see customer context without leaving the thread. Actors: agents (full shifts, hundreds of conversations, keyboard-heavy), leads (queue health, reassignment), admins (channels, routing, SLA, macros), customers (outside the app: email, widget, Messenger, Zalo). Team chat variant: every employee, all day, ambient.

Signals: ticket, inbox, queue, SLA, macro, CSAT, omnichannel, Messenger, Zalo OA, "trả lời khách", "chưa ai nhận"; team chat: channels, threads, mentions, unread.

Neighbors: `crm-sales` when the core object is a deal with amount and stage. `ai-chat-agent` when one user talks to a bot. `work-management` when "tickets" are internal work items planned in sprints. Predicate: an external person waits for a human reply with a clock running (support), or peers exchange messages in shared channels (team chat).

## Shell and topology

Default for support: three panes plus context. Left rail: views with counts (Mine, Unassigned, Team, Mentions, Snoozed, All; then channel and custom views). Middle: conversation list. Right: conversation with composer at the bottom. Fourth column: customer context sidebar, collapsible. Top bar: global search (phone, email, name, ticket number) and Active/Away status. Mechanics: [cross/detail-views-overlays.md](../cross/detail-views-overlays.md).

Alternatives:
- Email-heavy support with many ticket fields: ticket table + full-page ticket with a field panel.
- Below ~1280px (convention): context sidebar becomes a toggled drawer; below tablet: list → conversation → context sheet, one pane at a time, with back preserving list scroll and filter.
- Team chat: channel/DM sidebar + message stream + thread pane that opens to the right without replacing the stream.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Inbox | Pick the next conversation | View rail with counts, list (customer, channel, snippet, time, SLA badge, assignee), sort by SLA or age | View empty ("Không còn tin chờ"); new messages arrived while scrolled |
| Conversation | Resolve one request | Header (customer, channel, status, assignee, priority, tags), message stream with day separators, composer, context sidebar | Someone else viewing/typing; reply window closed; customer replied during draft |
| Customer profile | Know the person | Identity and linked channels, orders/deals, past conversations, notes, tags | Two profiles for one person; unknown sender |
| Macros | Reuse answers | Library by folder, preview of text and field changes | Macro references a deleted field |
| Routing and SLA | Set rules | Assignment method per team, business hours, holidays, SLA targets by priority | Holiday calendar missing |
| Channels | Connect sources | Email, chat widget, Facebook page, Zalo OA; connection health | Token expired; page permission revoked |
| Reports | Judge service | First reply, resolution, SLA attainment, CSAT, volume by channel and hour | Business-hours vs calendar metric mismatch |
| Team chat channel | Talk in the open | Header (name, topic, members), stream, composer, thread pane | Joined late (history boundary); archived channel |

## Signature patterns

**Ownership and assignment.** States: unassigned, assigned to a person, assigned to a team only. Assignment stamps an owner but keeps the conversation visible in the shared view. Methods: manual (shortcut plus picker), round robin, balanced load; teammates set to Away leave the automatic pool. Every assignment change appears in the stream as a system event naming its rule. Replying to an unassigned conversation offers "Nhận xử lý" in the same action (convention).

**SLA timers.** Badge shows the next target and time remaining ("Phản hồi trong 25 phút"), escalating to warning then breached; the exact due time is on focus. Targets: first reply, next reply, resolution, measured in business or calendar hours by priority. A pending-on-customer status pauses the clock; the badge says "Tạm dừng". Update per minute; announce state changes, not ticks. Sort views by time to breach. A ticket without a priority may carry no SLA: show that absence, never a blank.

**Collision detection.** Presence avatars in the list row and conversation header: viewing, typing, and draft present. If a new customer message or a teammate's reply lands after you opened the composer, sending stops with "Có tin mới từ khách. Xem trước khi gửi?" and offers Review or Send anyway. Field edits merge where safe (tags), warn where not (status). Mechanics: [cross/collaboration-realtime.md](../cross/collaboration-realtime.md).

**Public reply vs internal note.** Two composer modes, switchable by tab and shortcut. The note mode changes the whole composer surface to a distinct tint with a label ("Ghi chú nội bộ, khách không thấy"), not a stripe. The send button names the outcome: "Gửi cho khách" vs "Lưu ghi chú". Drafts are kept per mode. @mentions work only in notes. Notes render in the stream with the same tint.

**Channel constraints in the composer.** Each channel declares its limits: Messenger's standard reply window is 24 hours (human-agent tag extends to 7 days); Zalo OA consultation messages depend on the user's last interaction, with templates for other message types; email has no window. Show time left in the composer, switch to "Cần dùng mẫu tin" when closed, and never let Send fail silently.

**Macros and canned replies.** Trigger with `/`, fuzzy search, preview inserted text and field changes (status, tags, assignee). Placeholders fill from the customer and ticket; unfilled placeholders block send and are highlighted. Multiple macros can apply; composer undo reverts the insertion.

**Customer context sidebar.** Identity, linked channels, open orders or deals, recent conversations, tags, notes. When two profiles look like one person (same phone on Zalo and Messenger), suggest a merge with the match reason; merge follows [crm-sales.md](crm-sales.md) rules. Never auto-merge on display name alone; names on Facebook and Zalo are nicknames. Order lookups run on a short timeout; on failure the sidebar says what failed and offers retry while the composer keeps working.

**Status, snooze, merge, CSAT.** Status vocabulary: New, Open, Pending, Snoozed, Solved, Closed; define which ones stop SLA and which reopen on customer reply. Snooze until a time or until the customer replies; the item returns to the top of its view with a "Hết hẹn" marker. Merge picks a primary, moves messages, links the closed secondary, and states whether the customer is notified. CSAT asks after solve; a low score routes to a lead.

**Team chat unread model.** Separate "has unread" (bold channel name) from "needs you" (mention/DM count badge). Opening a channel draws a "Tin mới" line at the last-read point and scrolls there, not to the bottom. Thread replies you follow count toward a Threads view, not the channel. Provide mark unread, mark-all-read with undo, mute. Older history loads without moving the scroll anchor; new messages while scrolled up show "jump to latest" instead of yanking the view.

## Density, data, and type calibration

- List rows: 2–3 lines (customer + time; snippet; channel icon, SLA badge, assignee), 64–76px (convention). Unread rows use weight, not color.
- Time: relative in lists ("5 phút"), absolute with day separators in the stream, exact on focus. SLA shows remaining time, never an elapsed clock.
- Priority as text plus icon (Khẩn, Cao, Thường, Thấp); channel icons monochrome with accessible names.
- Color budget: SLA warning and breach, internal-note tint, presence. Tags stay neutral.
- Message stream follows the WAI-ARIA feed pattern; new-message announcements go through a polite live region, throttled.

## Localization notes

- Enter-to-send must ignore IME composition (`event.isComposing`); Vietnamese Telex/VNI input otherwise sends half-typed words. Single-letter shortcuts fire only outside text fields.
- Mass replies to customers are out of scope by default: platform messaging policies restrict unsolicited and bulk sends. Bulk actions cover status, tag, and assignment only.
- Customers arrive as Facebook/Zalo display names (nicknames, emoji); real name and phone come later. Search both, diacritic-insensitive.
- Macro placeholders for address terms: never guess gender; default to "anh/chị" unless the profile states it.
- Business hours in Asia/Ho_Chi_Minh (UTC+7); holiday calendars must include Tết and other lunar-dated holidays, which move every year.
- Vietnamese status labels run ~20–35% longer; view rail counts stay right-aligned with labels truncating, full text on focus. VND `1.250.000 ₫` in order context; dates dd/mm/yyyy.

## Study pointers

- Zendesk (help center, Garden): an SLA badge that shows time to the next target lets agents prioritize without math.
- Front: assignment marks an owner without removing the conversation from the shared inbox; drafts are visible to teammates.
- Intercom: away status removes a teammate from round robin, so availability and routing are one control.
- Slack Unreads: unread and mention are separate signals; mark-all-read comes with undo.
- Linear triage: accept, decline, duplicate, snooze as single keys keeps a queue moving.

## Archetype anti-patterns

- **No collision guard** — two agents reply, the customer gets conflicting answers — P1.
- **Note and reply look alike** — internal text sent to the customer — P1.
- **SLA as elapsed time** — agents compute deadlines themselves and pick the wrong ticket — P1.
- **Send fails after the channel window closed** — typed reply lost, customer waits — P1.
- **Assignment hides the item from the team** — nobody covers when the owner is away — P1.
- **Enter sends during IME composition** — broken Vietnamese messages — P1.
- **Auto-scroll to bottom on new message** — agent loses reading position — P2.
- **One badge for all unread** — mentions drown in channel noise — P2.

## Coverage additions

- [ ] Views: counts, sort by time to breach, empty and "new items arrived" states.
- [ ] Ownership: unassigned, person, team-only, away, reassignment events with rule name.
- [ ] SLA: each target, paused, warning, breached, no-priority, business hours with holidays.
- [ ] Collision: viewing, typing, new message before send, simultaneous field edit.
- [ ] Composer: reply vs note surface and button labels, per-mode drafts, channel window and template states, IME-safe Enter.
- [ ] Macros: preview of field changes, unfilled placeholder block, undo.
- [ ] Status lifecycle: reopen on reply, snooze return, merge result, CSAT routing.
- [ ] Team chat: last-read line, mention vs unread, threads, scroll anchoring, mute.

## Sources

- https://support.zendesk.com/hc/en-us/articles/5600997516058-About-SLA-policies-and-how-they-work (accessed 2026-09-28)
- https://support.zendesk.com/hc/en-us/articles/9186264597146-Avoiding-agent-collision (accessed 2026-09-28)
- https://support.zendesk.com/hc/en-us/articles/4408828489370-Adding-comments-to-tickets (accessed 2026-09-28)
- https://support.zendesk.com/hc/en-us/articles/4408887656602-Using-macros-to-update-tickets (accessed 2026-09-28)
- https://help.front.com/en/articles/2403 (accessed 2026-09-28)
- https://www.intercom.com/help/en/articles/6561699-assign-conversations-to-teammates-and-teams (accessed 2026-09-28)
- https://www.intercom.com/help/en/articles/6522874-manage-teammate-inbox-status (accessed 2026-09-28)
- https://slack.com/help/articles/226410907-View-all-your-unread-messages (accessed 2026-09-28)
- https://linear.app/docs/triage (accessed 2026-09-28)
- https://developers.facebook.com/docs/messenger-platform/policy/policy-overview/ (accessed 2026-09-28)
- https://oa.zalo.me/home/documents/guides/tong-quan-cac-loai-tin-nhan-tren-zalo-official-account-_3651713298729094511 (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/feed/ (accessed 2026-09-28)
- Practitioner knowledge: pane breakpoints, row heights, send-guard copy, IME composition handling, snooze/merge mechanics, Vietnamese pronoun placeholders.
