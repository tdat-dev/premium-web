# Archetype: Consumer web app

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: follow people or topics, consume media, find and buy or book from other people, message a counterpart, keep a profile, react to notifications. Actors: member, creator/seller/host, guest (logged-out preview), moderator (back office, see `admin-backoffice.md`). Sessions are short and frequent, mostly on phones; many users never read help or settings.

Signals: feed, follow, like, save, playlist, library, listing, seller, host, "nhắn tin cho người bán", đánh giá, đặt phòng, bản đồ, thông báo, hồ sơ.

Neighbors: `commerce-merchant-ops.md` (the seller's back office; this file is the buyer's side of a many-seller market), `scheduling-booking.md` (slot booking for one business; here, search across many hosts with maps and trust signals), `support-inbox-messaging.md` (agents answering many customers; here, peer-to-peer threads tied to a listing). Predicate: the user is a private person spending their own time or money, and content comes from other users.

## Shell and topology

Default: top bar (logo, search, create/sell, notifications, avatar menu) + content; on phones a bottom tab bar of 4–5 destinations (convention) replaces the top links, and search moves to its own tab or screen. Content width capped; feeds use a single column with an optional side rail on wide screens. Media apps add a persistent player bar docked above the bottom tabs that survives navigation.

Alternatives:
- **Left rail + content + right rail** when the product has many destinations and desktop is a real share of use (social, video libraries).
- **Search-first split (list + map)** for travel, rentals, and local listings where location decides the choice.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Home/feed | See what's new | Feed switch (following / for you) when both exist, items, end marker or load more | New account with no follows; caught up; blocked content |
| Search results | Find a thing | Query + applied filters as chips, result count, sort, results (list or list+map), pagination or load more | Zero results with relaxation hints; typo; location denied |
| Listing/item detail | Decide | Media gallery, title, price incl. known fees, availability, seller/host with trust signals, key facts, reviews summary, primary action, similar items | Sold/unavailable; price changed; own listing (edit instead of buy) |
| Media player | Consume | Title and creator, controls, seek bar with time, queue/up next, captions/transcript, save/share | Buffering; offline; region-locked; ended with autoplay countdown |
| Library | Return to saved | Tabs (saved, playlists, history, downloads), sort, items with progress | Empty; download expired; item removed by creator |
| Messages | Talk to a counterpart | Thread list (listing thumbnail, name, last message, unread), thread with listing context header, composer, safety notice | Counterpart blocked/deleted; off-platform payment warning |
| Profile | Show and manage self | Header (avatar, name, bio), stats that matter to the audience, content tabs, edit | Private profile; blocked viewer; deactivated |
| Notifications | Catch up | Grouped items by day, actor + action + object, mark read, settings link | Zero; object deleted; grouped overflow ("và 12 người khác") |
| Create/post | Publish | Media, text, audience, preview, post; drafts | Upload failing; draft recovered; moderation hold |
| Checkout/booking | Commit | Summary with dates or items, full price breakdown, payment, policy (cancel/refund) | Price or availability changed; payment pending |
| Settings | Control | Account, privacy, notifications per type and channel, blocked users, data export, delete account | Delete account with a grace period |

Collections and filters: follow [../cross/data-tables-collections.md](../cross/data-tables-collections.md) and [../cross/filters-search-command.md](../cross/filters-search-command.md); auth and onboarding in [../cross/auth-onboarding-account.md](../cross/auth-onboarding-account.md); notification surfaces in [../cross/feedback-states-notifications.md](../cross/feedback-states-notifications.md).

## Signature patterns

**1. Feed with an end.** Infinite scroll suits homogeneous browsing with no target; search and comparison need pagination or load more (NN/g). Whichever is chosen: restore scroll position on back, show "Bạn đã xem hết bài mới" when caught up, keep the footer reachable (load more, not infinite, if the footer matters), announce newly loaded items politely, and insert new posts behind a "12 bài mới" pill instead of shifting content under the reader.

**2. Card anatomy for listings.** Image (fixed ratio, blur-up placeholder), title, one price line with unit ("/đêm", "/tháng"), one or two decision facts (distance, rating with count, condition), save toggle with an accessible name. Rating always shows its count: "4,8 (126)". A listing without reviews says "Chưa có đánh giá", never a blank star row.

**3. List + map search.** On phones default to the list and put the map behind a toggle; NN/g found users choose confidently when distance is listed, and full-width maps trap scroll gestures. On desktop split list and map; hovering a card highlights its pin and the reverse; panning the map offers "Tìm trong khu vực này" rather than refetching on every move. Pins carry the price, not a generic dot.

**4. Detail page as a decision page.** Price includes every known fee before checkout (NN/g product-page guidance; hidden costs are a named deceptive pattern). Availability per variant or date before the action. Reviews: summary distribution, filters (rating, with photos, recent), reviewer context, both positive and negative visible. Seller/host block: joined date, response time, verified identity where real.

**5. Buyer-seller messaging.** Thread is bound to a listing; header shows listing thumbnail, price, status. Quick replies for common questions. Detect phone numbers or bank details only to show a neutral safety note, not to block normal talk. Read receipts optional per user. Report and block reachable from the thread header.

**6. Media player.** Persistent mini-player; seek bar is a slider with `aria-valuetext` in minutes and seconds (WAI-ARIA APG); arrow keys seek, space toggles play. Captions on/off remembered. Transcript on the same page below the media, interactive when possible: highlight the current phrase, click to seek (W3C WAI). Autoplay-next shows a cancelable countdown and respects a global off switch.

**7. Notifications that earn attention.** Group bursts into one item; per-type and per-channel controls inside the app, not only in OS settings; ask for push permission after the user has seen value, with a plain explanation of what will be sent (NN/g). Every item deep-links to the object and handles deleted objects.

**8. Engagement without dark patterns.** Allowed: streaks the user can pause, reminders the user sets, honest counts. Not allowed: fake urgency or scarcity, confirmshaming on unsubscribe ("Không, tôi không muốn tiết kiệm"), preselected add-ons, hard-to-cancel subscriptions, disguised ads, nagging permission prompts, virtual currency that hides real price (deceptive.design catalog). Sponsored items carry a visible "Được tài trợ" label in the same position every time.

## Density, data, and type calibration

- Comfortable density; tap targets ≥ 44px (convention). Content leads, chrome recedes.
- Counts abbreviated past thousands ("1,2 N", "3,4 Tr" in Vietnamese; "1.2K" in English) with exact value in the accessible name.
- Time: relative for recent ("5 phút"), absolute date past ~7 days (convention); media durations `m:ss` / `h:mm:ss`.
- Prices: tabular figures in lists; show unit and whether fees are included.
- Status vocabulary for listings: available, reserved, sold, hidden; for bookings: requested, confirmed, canceled, completed.
- Color budget: one accent for primary action and selected state; like/save states need a shape change, not only color.

## Localization notes

- VND `1.250.000 ₫`; per-night or per-month units always explicit.
- Dates `dd/mm/yyyy`; date-range pickers start weeks on Monday.
- Phone/Zalo-first sign-in; "Nhắn Zalo" may be the expected contact action for local sellers; say when a link leaves the app.
- Full-diacritic names in avatars and search; search must match with and without diacritics ("pho" finds "phở").
- Vietnamese labels run ~20–35% longer; bottom-tab labels must fit at 320px or use shorter synonyms tested with users.
- Addresses and distances in metric; place names in Vietnamese with optional English.

## Study pointers

- **deceptive.design**: use the pattern types as a review checklist on every growth feature.
- **NN/g infinite scroll and pagination research**: pick loading by user goal, not by engagement target.
- **NN/g mobile maps research**: list first on phones; distance beats a map for choosing.
- **W3C WAI media accessibility**: transcripts live beside the media, not behind a link.
- **Airbnb / Etsy public design writing**: trust signals (reviews, identity, response time) sit next to the action they support.
- **Material Design (navigation bar, bottom sheets)**: phone navigation is a small fixed set of destinations.

## Archetype anti-patterns

- **Infinite scroll on search results** — users cannot refind or compare; back loses position — P1.
- **Scroll position lost on back** — punishes every detail visit — P1.
- **Price without fees** — hidden-cost pattern; trust breaks at checkout — P1.
- **Star rating without count** — 5.0 from one review reads as proof — P2.
- **Push permission on first visit** — denied forever, channel lost — P2.
- **Confirmshaming or hard cancel** — deceptive pattern, legal and trust risk — P1.
- **Full-width map on phone results** — scroll trapped by pan — P2.
- **Unlabeled sponsored items** — disguised ads — P1.
- **Autoplay without off switch** — data and attention cost users did not choose — P2.

## Coverage additions

- [ ] Feed: first-run empty, caught up, new-items pill, back restores position, reduced motion.
- [ ] Search: zero results with relaxation, diacritic-insensitive match, location denied, list/map sync.
- [ ] Detail: sold/unavailable, own listing, price change before commit, reviews empty.
- [ ] Messages: blocked or deleted counterpart, safety note, report/block path.
- [ ] Player: buffering, offline, captions, transcript, keyboard seek, autoplay cancel.
- [ ] Notifications: grouped, deleted target, in-app per-type settings, permission prime.
- [ ] Dark-pattern review against the deceptive.design types for every monetization or retention surface.
- [ ] Account deletion and data export reachable in settings.

## Sources

- https://www.deceptive.design/types — accessed 2026-09-28
- https://www.nngroup.com/articles/infinite-scrolling-tips/ — accessed 2026-09-28
- https://www.nngroup.com/articles/push-notification/ — accessed 2026-09-28
- https://www.nngroup.com/articles/mobile-maps-locations/ — accessed 2026-09-28
- https://www.nngroup.com/articles/ecommerce-product-pages/ — accessed 2026-09-28
- https://www.w3.org/WAI/media/av/transcripts/ — accessed 2026-09-28
- https://www.w3.org/WAI/ARIA/apg/patterns/slider/ — accessed 2026-09-28
- Practitioner knowledge: marketplace messaging, listing cards, feed insertion, VN phone/Zalo identity, Material navigation bar.
