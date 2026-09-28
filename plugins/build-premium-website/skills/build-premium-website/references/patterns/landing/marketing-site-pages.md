# Pattern family: Marketing site pages

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: SaaS/product marketing pages other than the homepage (pricing, feature, solutions, customers and case studies, integrations, changelog, about/careers, contact/demo, blog index and article, legal/trust/security, status, 404), plus site nav, footer IA, and signup/login entry points.

Elsewhere: skeleton and ambition → [structure-catalog.md](../../structure-catalog.md), [ambition-gates.md](../../ambition-gates.md); CTA truth, proof sourcing, media → [landing-brand-contract.md](../../landing-brand-contract.md); words → [copy-voice.md](../../copy-voice.md); after the signup click → [cross/auth-onboarding-account.md](../cross/auth-onboarding-account.md), [hybrid-contract.md](../../hybrid-contract.md); docs and API changelog → [docs-developer-portal.md](docs-developer-portal.md).

This lists what each page type owes the visitor, not a layout. Flagship pages (pricing, launch feature) get their own macrostructure; repeated types (case study, article, integration) share one carefully designed template each.

## Choose the variant

| Observable predicate | Choice |
|---|---|
| ≤ 6 top-level destinations, none with more than ~4 children | Flat header links; children on index pages |
| Product or Solutions hold many destinations that need a one-line descriptor to tell apart | Mega menu for those items only (NN/g) |
| Fixed self-serve plan prices | Tier columns + comparison table |
| Price scales with a metered unit (seats, events, GB) | Tiers + calculator with the unit as typed input |
| Deals genuinely negotiated | "From" prices, ranges, or a worked typical-scenario price; never only "Contact us" (NN/g: hidden B2B prices read as evasive) |
| Sales call precedes access | Demo form routing into an inline scheduler after qualification |
| More than ~12 case studies, integrations, or posts (convention) | Filterable, searchable index; fewer → curated list |

## Anatomy

**Header.** Skip link → logo → primary destinations → utility links (Docs) → "Log in" text link → one primary CTA naming the outcome ("Start free trial", "Book a demo"). Signed-in visitors see "Open app" instead. Never two filled buttons.

**Mega menu panel.** Groups by user mental model, labels leading with the information-carrying word → items with one-line descriptors → at most one featured slot (a real launch or story) → link to the full index. No widgets; each item once (NN/g).

**Footer.** Groups in visitor language (Product, Resources, Company, Legal) → locale/currency switcher → status link → contact → legal row (entity, registration where required, privacy, terms, cookie settings). Curated, not a sitemap dump.

| Page | Job | Required parts, in order | Type-specific states |
|---|---|---|---|
| Pricing | Pick a plan, know the real cost | Interval control → currency control → plans (name, who it is for, price with unit and interval, billed total, CTA, included limits) → recommended plan with a reason → calculator if metered → enterprise route and what it adds → comparison table grouped by capability → billing FAQ (trial, card needed, cancellation, refunds, overages, VAT/invoices) | Interval/currency switched; calculator past top tier; promo with end date; plan unavailable in region |
| Feature | Prove one capability | Outcome in audience words → real product capture doing the job → how it works → limits and plan availability → related features → CTA | Beta label explained; plan-gated note |
| Solutions / industry | Product seen through one segment's problem | Segment's own vocabulary → workflow mapped to capabilities → segment-specific sourced proof → relevant integrations → CTA | No proof yet: omit block, never borrow another segment's |
| Customers / case study | Find someone like me; one customer's evidence | Index: filters (industry, size, use case) → cards with one sourced outcome. Study: customer, size, industry → problem → setup → measured outcome with source ID and approval → attributed quote → products used → CTA | Zero matches: clear filters; anonymized study labeled |
| Integrations | "Does it work with my stack" | Search → category filter → entries with logo, job, built-by badge (first-party/partner/community) → detail: sync direction, setup, data and permissions shared, plan needed, docs link | No result: "Request an integration" with query prefilled |
| Changelog | What changed, product alive | Dated reverse-chronological entries → area and type tags → anchor per entry → media only when it shows the change → subscribe | Breaking change flagged, linked to migration docs |
| About / careers | Who builds it, who they hire | Real team, founding facts, locations → roles from the ATS with team, location, remote policy → hiring steps → concrete benefits | No open roles: say so, offer talent pool |
| Contact / demo | Reach the right person | Routes split (sales, support, press, partners) → short form → consent → success stating who replies, by when, on which channel → scheduler if qualified → other channels | Duplicate submit blocked; no slots → "we'll email times" |
| Blog index / article | Browse; read one piece | Index: topics, search, list with title, date, author, summary, URL-state pagination. Article: title → author with real bio → published and updated dates → TOC when long → body 65–75ch → one inline and one end CTA → related | Outdated-behavior notice on old posts |
| Legal / trust / security | Procurement and privacy answers | Last updated + change history → TOC → plain summary above legal text → subprocessors → certifications and how to request reports → disclosure contact, `security.txt` | Pending change with effective date |
| Status | Health now and before | Overall line → components with own status → active incident with timestamped updates → history → subscribe | Degraded, partial outage, scheduled maintenance |
| 404 | Recover | "Page not found" → likely cause (mistyped or moved link) → search → 3–5 top destinations → contact (GOV.UK: no "oops", no jargon, no red warnings) | Known moved URL redirects instead |

## Behavior and states

- **Billing toggle.** Two labeled options with the saving in real numbers. Switching updates every price, billed total, and calculator result at once with no layout shift. A yearly price shown per month states the billed total ("billed 1.200.000 ₫ yearly"). Interval, plan, currency, and campaign params carry into the signup URL.
- **Currency and tax.** Detect locale, allow override, persist. Label each price tax-inclusive or exclusive; some jurisdictions require inclusive consumer prices, so take the rule from the client's legal source.
- **Calculator.** Typed input, slider optional; tier boundaries visible; the result shows its math ("12 seats × 150.000 ₫"); past the top tier it becomes a sales route, not a fake number.
- **Comparison table.** Sticky plan header; grouped collapsible rows; "Show differences only" when rows exceed a screen (NN/g); jargon defined inline.
- **Mega menu.** Click/tap always opens it; hover is an enhancement with intent delay. Top-level items also link to a real index page.
- **Signup handoff.** Destinations are exact and labeled truthfully (signup with state, scheduler, waitlist). Signed-in visitors skip signup; the chosen plan or trial is visible in the product afterwards.
- **Forms.** Only fields routing needs; rest per [forms-wizards-settings.md](../cross/forms-wizards-settings.md).
- **Proof.** Logos, quotes, outcomes, certifications, counts each carry a source ID and approval. No source, no block.

## Keyboard and accessibility

- Site nav: APG **Disclosure Navigation Menu**, buttons with `aria-expanded`, Escape closes, `aria-current="page"`. Not `role="menu"` (APG).
- Billing interval: labeled radio group (APG Radio Group); one polite live announcement when prices change.
- Mobile plan switcher: APG **Tabs**. FAQ: APG **Accordion** with real heading levels.
- Comparison: native `<table>`, `<th scope>`, marks with text ("Included", "Not included").
- Status pairs color with a word; scheduler embeds keep a plain-link fallback.

## Responsive transformation

- Mega menu → full-screen drill-down disclosure lists with a back control; no hover.
- Plans → stacked or tab switcher, desktop order kept; comparison → two plans side by side with pickers (NN/g), never only a wide horizontal-scroll table.
- Footer groups → collapsible; legal row stays open.
- Index filters → sheet with applied count on the trigger; URL state kept.

## Defaults

- Mega menu: about 0.5 s hover intent, then show within 0.1 s; close only after the pointer has left trigger and panel for 0.5 s (NN/g).
- Public plans 3–4 (convention); comparison columns ≤ 5 (NN/g).
- Demo form ≤ 5 required fields (convention); promise a reply time only if staffed for it.
- Status history 90 days (convention); timestamps UTC plus visitor local.
- VND: no minor unit, `1.250.000 ₫`, dd/mm/yyyy; state VAT and whether a VAT invoice (hóa đơn VAT) is issued; offer phone/Zalo contact for VN audiences; test nav and plan labels at +20–35% Vietnamese length.

## Anti-patterns

- **"Contact us" as the only price when prices exist** — buyers compare elsewhere (NN/g) — P1.
- **Per-month yearly price without billed total** — misleads on the charge — P1.
- **Hover-only or widget-stuffed mega menu** — unreachable by keyboard/touch — P1-N.
- **Solutions pages with swapped nouns** — fails competitor-swap — P2.
- **Borrowed or unsourced logos, quotes, certifications** — fabricated proof — P0.
- **CTA label that lies about its destination** ("Start free" → sales form) — P1.
- **Status page hard-coded green or hosted with the product it monitors** — fails during the outage — P1.
- **Dead-end or joke-only 404; undated legal pages** — no recovery, no verification — P2.

## Coverage additions

- [ ] Nav variant chosen by predicate; mega menu keyboard, touch, Escape verified
- [ ] Pricing: interval, currency, tax label, calculator overflow, enterprise route, sticky comparison, mobile compare
- [ ] Each CTA's destination and preserved state (plan, interval, currency, UTM, referral) tested into signup
- [ ] "Open app" for signed-in visitors; "Log in" reachable at every width
- [ ] Every proof block mapped to a source ID and approval
- [ ] Index zero results and URL state; form duplicate submit; 404, incident, breaking changelog, "no open roles" rendered
- [ ] Vietnamese length and VND/VAT formatting on pricing and nav

## Sources

- https://www.nngroup.com/articles/mega-menus-work-well/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/comparison-tables/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/show-price/ (accessed 2026-09-28)
- https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/ (accessed 2026-09-28)
- https://design-system.service.gov.uk/components/service-navigation/ (accessed 2026-09-28)
- https://design-system.service.gov.uk/patterns/page-not-found-pages/ (accessed 2026-09-28)
- Practitioner knowledge: status-page hosting, changelog anatomy, careers/ATS, integration directories, security.txt, VN VAT invoices.
