# Pattern family: Storefront, product pages, cart, and checkout

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: the shopper side of a shop: product listing and filters, on-site search, product detail pages, cart, checkout, order confirmation, and order tracking for buyers. Applies to brand shops on `LANDING_BRAND`, shops that are `HYBRID`, and the consumer side of the `COMMERCE` modifier.

Elsewhere: merchant admin, orders, inventory, POS, refunds → [archetypes/commerce-merchant-ops.md](../archetypes/commerce-merchant-ops.md); marketplace-style browsing → [archetypes/consumer-web-app.md](../archetypes/consumer-web-app.md); field-level form behavior → [cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md); why these rules work → [human-factors.md](../../human-factors.md) (anchoring, hidden costs, trust); words → [copy-voice.md](../../copy-voice.md).

The evidence base is Baymard Institute's large-scale e-commerce benchmarks. Percentages below are the share of benchmarked sites that fail a guideline, quoted from the dated page in Sources; re-verify before citing to a client.

## Why shoppers leave (Baymard, cart abandonment list, updated 2025-09-22)

Average documented cart abandonment is about 70%. Excluding people who were only browsing, the leading reasons during checkout among US online shoppers (the survey sample; local shoppers may weigh delivery and COD differently) are: extra costs too high (40%), delivery too slow (20%), did not trust the site with card details (19%), forced account creation (18%), checkout too long or complicated (17%), site errors (17%), unsatisfactory returns policy (13%), could not see the total cost up front (12%), card declined (10%), too few payment methods (9%). Nearly every rule below answers one of these.

## Choose the variant

| Observable predicate | Choice |
| --- | --- |
| Under ~30 products, browsed by story or collection | Curated collection pages; filters optional |
| Catalog where shoppers compare attributes (size, color, price, specs) | List with filters and sort; product comparison for spec-heavy goods |
| Repeat buyers of the same items | Reorder from order history; saved lists without login |
| Buyers in Vietnam paying on delivery or by transfer | COD and VietQR as first-class payment options, fees shown before the final step |
| Wearables, furniture, or anything where size matters | Size guidance with in-scale and on-model images |

## Anatomy

**Product list.** Filters for the attributes shoppers actually decide on, at least price, rating, color, size, and brand where they apply (51% of sites miss some of these). Multiple values selectable within one filter (14% fail). Applied filters shown together with one-tap removal (20% fail). Result counts beside filter options. Sorting by price, rating, best-selling, and newest (69% fail to offer all four). Several thumbnails per item where variants differ (80% fail). Explain jargon filter names.

**Search.** The field is visible, not hidden behind an icon on desktop. Autocomplete shows about 10 suggestions on desktop and 4-8 on mobile, highlights the predicted completion rather than what was typed, supports arrow keys with a visible active row, styles scoped suggestions ("in Cà phê hạt") differently, and avoids inner scrollbars. Only 19% of sites get all of this right. No-results pages suggest spelling fixes, related categories, and contact.

**Product page.** Price includes known fees, or a total-cost estimate sits near the buy button (67% fail). Unit price for multi-quantity products (81% fail). Variants (size, color) as visible buttons, not dropdowns (57% fail), with unavailable options marked, not hidden. Images: several angles, one in scale against a familiar object (37% fail), on a person for wearables (23% fail), zoomable. Specifications in one column, labels left, units on every value, grouped under headings when long, jargon explained. Delivery date or range for the shopper's location, not only "standard shipping". Returns policy linked from the main content (44% fail; 60% of users look for it here). Real reviews with distribution, filters, and negative reviews visible. "Save for later" works without an account (89% fail).

**Cart.** Line items with image, variant, unit price, quantity buttons (97% of sites lack quantity buttons), remove with undo, subtotal, shipping estimate, and total. Coupon field collapsed behind a link (visible coupon fields send shoppers off to hunt for codes). Free-shipping threshold progress only if the threshold is real. The checkout button is the clear primary action.

**Checkout.**
- Guest checkout is the most prominent option, labeled with the word "guest", as a button above sign-in (62% fail). Offer account creation on the confirmation page, where it costs nothing.
- About 8 visible fields is achievable for most stores (Baymard's 2024 average was 11.3). One "Full name" field (42% of testers typed their full name into "First name" on split forms). Address line 2 behind a link. Billing address defaults to shipping, with a checkbox to differ. Address autocomplete where reliable.
- Mark both required and optional fields (61% fail; marking only optional fields made 32% of testers miss a required one). This is the consumer-checkout exception to the "mark the minority" default in [cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md).
- Explain why a phone number is needed (49% fail; most shoppers hesitate to give one). In Vietnam the phone is usually required for the courier: say so in the hint.
- Delivery options all visible in one selector with dates or date ranges, not only speeds (48% fail to show dates).
- Password rules, when an account is created, stay simple (65% impose complex rules).
- Order summary with the final total stays visible through every step.

**Payment.** Card number accepts spaces and auto-formats in groups (4-4-4-4; Amex 4-6-5); no length or character restriction that blocks valid cards; card data is kept after a validation error elsewhere on the page. Trust cues near the payment fields are true and specific. Payment methods the audience uses (in Vietnam: COD, bank transfer or VietQR, e-wallets, cards) with any fee shown before the final click.

**Validation.** Inline validation on blur, not on the first keystroke; errors clear as soon as the input is fixed; a positive check on valid fields; error text specific to the problem ("Số thẻ còn thiếu 4 chữ số", not "Không hợp lệ"); submit-time validation as a backstop (94% fail to adapt error messages to the specific problem).

**Confirmation and tracking.** Order number, what was bought, total paid or due on delivery, delivery estimate, what happens next and when, how to change or cancel, and a contact route. Tracking shows carrier status with its age and a clear path when delivery fails. This is the peak-end moment: never a dead end.

## Anti-patterns

- Shipping, COD, or service fees first revealed at the last step: hidden-cost deceptive pattern. `P0` when it affects the amount charged, otherwise `P1-N` (human-factors HF-09).
- Forced account creation before payment. `P1-P`.
- Pre-checked add-ons, insurance, or newsletter consent. `P0` (consent and money).
- Fake low-stock or countdown timers not backed by real data. `P0`.
- Coupon field shown open at checkout with no codes available publicly. `P2`.
- Variant chosen through a dropdown that hides unavailable options. `P2`.
- Form cleared after a server error. `P1-N` on checkout.
- Phone, email, or address requested without a stated reason. `P2`.
- Search icon only, no visible field, on a catalog site. `P2`.

## Coverage additions

- [ ] Product list: filters with multi-select, applied-filter chips, sort, no-results state, slow-loading list.
- [ ] Search: autocomplete keyboard use, scoped suggestion, misspelling, no results.
- [ ] Product page: variant out of stock, price with fees, delivery estimate, returns link, reviews with negatives.
- [ ] Cart: quantity change, remove with undo, coupon valid and invalid, empty cart.
- [ ] Checkout: guest path, signed-in path, address autocomplete off, required field missed, server error keeps input, mid-flow price or stock change.
- [ ] Payment: card formatting, declined card, COD and transfer pending, VietQR timeout.
- [ ] Confirmation: content complete; tracking with stale carrier data and failed delivery.

## Sources

- https://baymard.com/lists/cart-abandonment-rate (updated 2025-09-22, accessed 2026-10-24)
- https://baymard.com/blog/checkout-flow-average-form-fields (accessed 2026-10-24)
- https://baymard.com/research-articles/current-state-of-checkout-ux (accessed 2026-10-24)
- https://baymard.com/research-articles/make-guest-checkout-prominent (accessed 2026-10-24)
- https://baymard.com/blog/inline-form-validation (accessed 2026-10-24)
- https://baymard.com/blog/credit-card-field-auto-format-spaces (accessed 2026-10-24)
- https://baymard.com/blog/checkout-usability-apply-buttons (accessed 2026-10-24)
- https://baymard.com/blog/current-state-ecommerce-product-page-ux (updated 2026-03-18, accessed 2026-10-24)
- https://baymard.com/blog/autocomplete-design (accessed 2026-10-24)
- https://baymard.com/blog/current-state-product-list-and-filtering (updated 2025-09-09, accessed 2026-10-24)
