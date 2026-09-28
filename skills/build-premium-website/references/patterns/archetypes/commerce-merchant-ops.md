# Archetype: Commerce merchant ops

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: price products, keep stock true per location, turn orders into shipped parcels, handle returns and refunds, sell in person, let buyers pay and track. Actors: owner, packer, cashier, accountant, buyer. Staff work the order list in short bursts all day; owners check daily; cashiers run POS whole shifts.

Signals: SKU, variant, tồn kho, đơn hàng, COD, vận đơn, in phiếu, đối soát, trả hàng/hoàn tiền, thu ngân, Shopee/TikTok Shop/Lazada.

Neighbors: `admin-backoffice.md` (generic records), `finance-billing.md` (invoices, subscriptions), `crm-sales.md` (pipeline before the sale). Predicate: if one record moves stock and money at the same time, it is this archetype.

## Shell and topology

Default: left sidebar (Home, Orders, Products, Inventory, Customers, Discounts, Analytics, Channels, Settings) + top bar with global search (order number, phone, SKU, tracking code), location switcher, notifications. Index pages full width; detail pages two columns: primary holds what defines the record, secondary holds status, customer, notes, tags (Shopify's admin layout guidance). Edit forms use a save bar that appears only when dirty.

Alternatives:
- **POS mode** when a cashier sells in person: full screen, no sidebar, catalog/scan region + cart region, large targets, connection and shift indicator always visible. A separate surface, not a sidebar page.
- **Location/channel switcher** once the merchant has more than one branch or marketplace shop; every stock or order page states its scope.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Home | What needs me today | To-do counts (unfulfilled, COD unreconciled, returns waiting, low stock, sync errors) linking to filtered lists; sales summary with period + timezone | Zero orders; channel disconnected |
| Orders index | Triage, batch work | Saved-view tabs, search, filters (payment, fulfillment, channel, carrier, date), table, bulk bar (print labels, create shipments) | Selection across pages; batch partially failed |
| Order detail | Resolve one order | Header (number, channel, badges per axis), items grouped by fulfillment, payment summary, timeline; aside: customer, address, notes | Edited after payment; partially fulfilled; COD delivery failed |
| Product edit | Define what is sold | Title, media, pricing (price, compare-at, cost), variants table, stock per location; aside: status, channels | Variant limit; upload failing; leave with unsaved changes |
| Inventory | Keep counts true | Location picker, SKU × state table, inline adjust with reason, history | Negative available; stale channel sync |
| Customers | Know the buyer | Search by name/phone, table (orders, spend, last order), detail with history, addresses, consent | Duplicates across channels |
| Discounts | Price rules | Type, code or automatic, eligibility, limits, schedule, plain-language summary | Overlap; expired; limit reached |
| Return/refund | Undo a sale safely | Item + quantity picker, reason, restock per item, refund calculator, method | Exceeds collected; refund on COD order |
| POS sell | Ring up fast | Catalog/scan, cart, customer, discount, tender, receipt | Offline; declined; drawer closed |
| Checkout (buyer) | Pay with confidence | Contact, delivery, payment, review; summary always visible | Price/stock changed mid-flow; payment pending |
| Order tracking (buyer) | Where is my parcel | Step list, carrier + tracking code, items, address, help/return entry | Carrier silent; failed delivery |

Tables, filters, overlays: follow [../cross/data-tables-collections.md](../cross/data-tables-collections.md), [../cross/filters-search-command.md](../cross/filters-search-command.md), [../cross/detail-views-overlays.md](../cross/detail-views-overlays.md); deltas below.

## Signature patterns

**1. Independent status axes.** Order (open, archived, canceled), payment (pending, authorized, paid, partially paid, partially refunded, refunded, voided), fulfillment (unfulfilled, in progress, on hold, partially fulfilled, fulfilled); Shopify documents them as separate badges. Never merge into one status column: packers filter by fulfillment, accountants by payment. For COD add a collection axis: chưa thu, đã thu, đã đối soát, hoàn về.

**2. Order timeline.** System events (paid, label bought, picked up, delivered, refunded) and staff notes in one list, composer on top; each entry: actor, event, linked object, time. Carrier updates show their age ("GHN cập nhật 3 giờ trước"). Failed events stay with retry.

**3. Split shipments.** A fulfillment is a subset of line items from one location in one parcel; the detail page groups items per fulfillment (Chưa xử lý, Kiện 1 · GHTK, Kiện 2). Create shipment: items and quantities, location, carrier and service, weight/size, COD amount (defaults to balance, editable), who pays shipping, buy/print label. Batch print yields one PDF plus a per-order failure list.

**4. Inventory states.** On hand (physically there), committed (held by unfulfilled orders), unavailable (damaged, QC, safety stock), incoming (in transfer), available (sellable), per Shopify's state model. Show available; expand for the rest. Every adjustment takes a reason and writes history. Channel sync pushes available minus a per-channel buffer and shows last push and errors per channel.

**5. Refund calculator.** Pick items and quantities, restock per item and location, shipping refund yes/no, then a live summary (items, discounts reversed, shipping, total, method). Cap at what was collected and say why. Returns run requested → approved → in transit → received → restocked → refunded or exchanged; an exchange creates a linked new order.

**6. POS tender and offline.** Methods: tiền mặt, VietQR, card, e-wallet, split. Cash: keypad, quick-amount chips, change due in large figures. VietQR: dynamic QR with amount and order code, waiting state until the bank notification arrives, manual confirm with the staff name when no webhook exists. Offline: persistent banner with time left to upload stored payments (Square documents a countdown and a 72-hour ceiling for offline card payments), queue count, post-reconnect decline list. Receipt: print, Zalo/SMS, none.

**7. Checkout without surprises.** Shipping and COD fee visible before payment; coupon behind a link; billing defaults to shipping; guest checkout, account offered after purchase (Baymard favors fewer visible fields and deferred account creation). Pending transfers land on an order page that keeps checking and says what happens if the buyer leaves.

**8. Channel sync surface.** Per connected shop (Shopee, TikTok Shop, Lazada): health, token expiry, last order import, last stock push, errors. Channel orders carry a channel chip and marketplace code; actions the marketplace owns show locked with the reason or link out.

## Density, data, and type calibration

- Order/inventory rows 36–40px (convention); POS targets ≥ 48px (convention).
- Money and quantities in tabular figures, right-aligned; adjustments signed (`+12`, `−3`); never round what the ledger stores exactly.
- Relative time in lists with absolute on hover; absolute in timelines and exports.
- Status words match the platform per axis. Color budget: neutral (open, draft, fulfilled), attention (unpaid, on hold, low stock), critical (payment failed, sync error), success (paid, delivered). Done is not a celebration.
- Order number is the scan key: tabular, copyable.

## Localization notes

- VND has no minor unit: `1.250.000 ₫` (dot grouping, symbol after a space); inputs accept `1250000`, `1.250.000`, `1,25tr` and normalize; reject decimals.
- `dd/mm/yyyy`, 24-hour time, Asia/Ho_Chi_Minh stated on reports.
- Addresses: tỉnh/thành → phường/xã → street. Carrier data (GHN, GHTK, Viettel Post) may still carry pre-2025 three-level codes with quận/huyện; map both, warn on mismatch. Phone is the customer identity; search by trailing digits.
- COD amount is a first-class shipment field; đối soát (expected vs received per carrier payout) is its own list.
- Payment chips: COD, VietQR, MoMo, ZaloPay, card, cash. VietQR (NAPAS standard) carries account, amount, message; put the order code in the message and match on it.
- Diacritic-aware collation; avatar initial from the given name (last word).
- Labels run ~20–35% longer ("Chưa thực hiện" vs "Unfulfilled"); badges wrap or abbreviate with a tooltip.

## Study pointers

- **Shopify admin/Polaris**: one badge per status axis keeps each role's filter one click away.
- **Shopify help center**: define lifecycle vocabulary (orders, returns, inventory states) before drawing screens.
- **Square POS help**: offline is a designed state with explicit limits, not an error screen.
- **Baymard Institute checkout research**: every visible field costs attention; hide the optional ones.
- **Sapo / KiotViet / Haravan**: branch and channel scope must be visible wherever stock or orders appear.
- **GHN / GHTK merchant portals**: parcel status and COD payout are separate truths; show both.

## Archetype anti-patterns

- **Single status column** — payment and fulfillment mixed, every role misfilters — P1.
- **Revenue hero home** — a big number does not tell staff what to do; lead with to-do counts — P2.
- **Stock as one integer** — oversells when committed/unavailable are hidden — P1.
- **Free-text refund amount** — invites over-refunding — P1.
- **Silent batch failure** — one bad address kills or vanishes from a label batch — P1.
- **Fees revealed at the last step** — hidden-cost dark pattern — P1.
- **POS that assumes network** — no queue, no countdown, cashier stuck — P1.
- **Unbacked scarcity** ("chỉ còn 2") — fake urgency on the storefront — P1.
- **Channel orders editable as local** — the marketplace overwrites or rejects — P2.

## Coverage additions

- [ ] Order detail covers every payment × fulfillment combination the store uses, plus COD collection states.
- [ ] Split shipment, partial fulfillment, failed label purchase with recovery.
- [ ] Inventory adjust requires a reason, writes history, handles negative available.
- [ ] Refund caps at collected amount with explanation; restock per item.
- [ ] Batch actions report per-record results.
- [ ] POS: offline banner, queue, post-reconnect declines, VietQR waiting/confirmed/timeout, cash change.
- [ ] Checkout: mid-flow price/stock change, payment pending/failed, guest vs signed in.
- [ ] Buyer tracking: stale carrier data, failed delivery, return entry.
- [ ] Channel sync: disconnected, token expired, per-item push error.
- [ ] VND input normalization, address cascade with legacy codes, phone search.

## Sources

- https://shopify.dev/docs/apps/design/layout — accessed 2026-09-28
- https://shopify.dev/docs/api/app-home/patterns/templates/details — accessed 2026-09-28
- https://help.shopify.com/en/manual/fulfillment/managing-orders/order-status — accessed 2026-09-28
- https://help.shopify.com/en/manual/fulfillment/managing-orders/returns — accessed 2026-09-28
- https://help.shopify.com/en/manual/products/inventory/fundamentals/inventory-states (search summary) — accessed 2026-09-28
- https://squareup.com/help/us/en/article/7777-process-card-payments-with-offline-mode — accessed 2026-09-28
- https://baymard.com/blog/checkout-flow-average-form-fields — accessed 2026-09-28
- https://napas.com.vn/dich-vu-chuyen-tien-nhanh-napas-247 (search summary) — accessed 2026-09-28
- Practitioner knowledge: VN carriers (GHN, GHTK, Viettel Post), COD reconciliation, marketplace sync, VN retail POS, 2025 administrative-unit merger.
