# Archetype: Finance and billing

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: get paid, pay, know where money is, control spend, close books that reconcile to the unit.

Actors: paying customer (rare visits, anxious when a payment fails); AR/AP clerk (daily, dense lists, bulk actions); approver (short, often on a phone); accountant (month-end reconciliation); wallet holder (mobile, frequent balance checks).

Signals: plans, invoices, payments, payouts, balances, transfers, expenses, approvals, ledgers, reconciliation, tax.

Neighbors:
- **Commerce / merchant ops**: work ends when goods ship, not when money settles.
- **Analytics / monitoring**: revenue is only charted, never posted or matched.
- **Devtools / cloud console**: owns usage meters; this file owns the invoice behind them.

## Shell and topology

- **Finance operations app** (default): left sidebar (Home, Transactions, Invoices, Customers, Subscriptions, Expenses, Reconciliation, Reports, Settings) + top bar with **entity switcher**, search by amount or reference, create, notifications. Shell rules: [../cross/app-shell-navigation.md](../cross/app-shell-navigation.md).
- **In-product billing**: a Billing section in Settings (Plan, Usage, Payment methods, Invoices, Billing details).
- **Consumer wallet**: mobile bottom navigation (Home, Transfer, Activity, Cards, Account); balance and transfer above the fold.

With several legal entities or currencies, the entity switcher is top-level; consolidated views are read-only and state the conversion basis ("All entities, VND at 28/09/2026 rates").

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| Billing overview | See plan and what is owed | Plan, next charge date + amount, usage, payment method, recent invoices | Trial ending, past due, canceling at period end |
| Change plan | Upgrade or downgrade | Plans, interval, proration preview (today, next invoice), effective date, confirm | Downgrade blocked by usage |
| Payment methods | Keep payments working | List, default marker, expiry, add, remove | Expiring, removing the only method |
| Invoices | Track receivables | Filters, rows (number, customer, issued, due, amount, status), bulk send/export | Overdue, retrying, partially paid |
| Invoice detail / create | Bill correctly | Number, dates, parties + tax IDs, lines, tax, totals, payments, activity | Draft, finalized locked, void, credited |
| Transactions | Find any movement | Search, filters, date-grouped rows, pending section, export | Pending vs posted, reversed, disputed |
| Transaction detail | Explain one movement | Amount + direction, status timeline, counterparty, fees, FX, IDs | Refund pending, dispute deadline |
| Transfer / payout | Move money out | Amount, recipient, source, reference → review → step-up → result | Insufficient funds, name mismatch, cutoff passed |
| Expenses and approvals | Spend within policy | Submit (receipt, amount, category); flagged queue; approval chain | Policy violation, missing receipt |
| Reconciliation | Match bank to books | Statement lines, book entries, suggestions, difference counter, period lock | Unmatched after close, duplicate import |

## Signature patterns

**1. Money formatting and precision.** Store integer minor units; the currency sets the exponent (Stripe treats JPY-style currencies as zero-decimal and USD as two-decimal). Show the ISO code when several currencies can appear or the symbol is shared (`$`). Fixed decimals per currency. Negatives carry a minus sign (or accounting parentheses, chosen once) plus a direction (In/Out, Debit/Credit); color only supplements. Lines must sum to the displayed total; show any rounding remainder as a line. Label totals tax-inclusive or exclusive. FX shows both amounts, rate, and rate time.

**2. Irreversible actions: review, confirm, receipt.** Before money leaves, a review screen (GOV.UK "check answers") lists amount, fee, total debited, bank-resolved recipient name, source, reference, expected arrival, each with Change returning to review. The button names action and amount ("Chuyển 1.250.000 ₫", "Pay 49.00 USD"). Step-up above policy thresholds. On submit, disable with visible progress and send an idempotency key. Result: Pending, Completed, or Failed with reference ID, time, receipt. Offer cancel only before a real, displayed cutoff.

**3. Subscriptions and dunning.** Upgrades apply now with a proration preview; downgrades and cancels default to period end, stating what stops when (Stripe customer portal). Statuses: Trialing, Active, Past due, Unpaid, Canceled. A failed charge shows a banner: plain reason, next retry date, Update payment method. Retries follow a schedule (Stripe recommends 8 tries within 2 weeks); hard declines such as lost card wait for a new method. The final outcome (cancel, unpaid, or stay past due) is stated before it happens.

**4. Invoice lifecycle.** Draft (editable, deletable) → Open (finalized, numbered, mostly immutable) → Paid, Void (kept for the paper trail), or Uncollectible (bad debt) (Stripe). Corrections use a credit note or replacement invoice, never edits. Overdue and Retrying are derived badges that explain themselves. Numbering is sequential per entity.

**5. Transactions list.** Date-grouped rows; pending above posted. Columns: date, counterparty, category, status, signed amount (right); running balance only in ledger views. Search matches amounts however typed (`1250000`, `1.250.000`); filter by date, type, status, amount range. Exports respect and state active filters. Detail opens in a drawer ([../cross/detail-views-overlays.md](../cross/detail-views-overlays.md)); tables follow [../cross/data-tables-collections.md](../cross/data-tables-collections.md).

**6. Expenses and approvals.** Submit from the phone camera; OCR-filled values stay marked "Check these values" until confirmed. Policy violations show inline. The queue shows amount, requester, flags, age; bulk approve applies only to unflagged items; rejection needs a reason; every decision is audited ([../cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md)).

**7. Reconciliation and ledger.** Bank lines beside book entries, with suggested matches and their reason (same amount, close date, invoice number in reference). Actions: match, split, create entry, exclude. A difference counter trends to zero. Closing a period locks it; later changes are reversing entries. Ledger rows are append-only.

**8. Statements and exports.** Period, account, format (PDF for people, CSV/XLSX for systems), cutoff time and timezone. Large exports run in the background. Issued statements never change. Machine exports: dot decimals, no grouping, ISO dates and currency codes.

## Density, data, and type calibration

- Amounts right-aligned in tabular figures; columns fit the largest value; never truncate an amount.
- Money dates are absolute (due 05/10/2026); "due in 3 days" only beside the date.
- Balances show "as of" time; pending and available shown apart.
- Payment statuses: Pending, Completed, Failed, Refunded, Disputed.
- Color: red for failed and overdue only, amber for needs attention; negative amounts are not automatically red.
- Compact rows for ops tables, comfortable for wallets (convention).

## Localization notes

- **VND** has no minor unit; never show `,00`. Format `1.250.000 ₫`. Pick one of `₫`, `đ`, `VND` per product; use `VND` in exports and multi-currency tables. Abbreviations (`1,25 tr`, `1,2 tỷ`) only in charts, never on confirm, invoice, or receipt.
- **VietQR bank transfer**: the QR carries bank, account, amount, and transfer content; the content reconciles payment to order (VietQR). Screen: QR; copyable bank, account number, holder name, amount, and transfer content (short ASCII code, since banking apps may strip diacritics: convention); expiry countdown if stock is held; "Waiting for payment" updated by bank notification or polling; later, a "Paid but not confirmed?" path. Wrong amount or missing content is a manual-review state, not a failure.
- **E-invoice (hóa đơn điện tử)**: companies need tax code (MST), legal name, address; collect behind "Request company invoice" at checkout. Issued e-invoices carry a lookup code and are corrected by adjustment or replacement, not edits. Show VAT per line. Verify current rules locally.
- dd/mm/yyyy; MoMo, ZaloPay, COD beside cards; phone number is the consumer identity. Labels run ~20–35% longer: labels wrap, amount columns keep width.

## Study pointers

- **Stripe Invoicing**: finalization freezes the record; corrections are new documents.
- **Stripe customer portal**: self-serve cancel with explicit "now" vs "end of period".
- **GOV.UK check answers**: review every answer with Change links before commit.
- **AWS Cloudscape delete patterns**: friction scales with the cost of undoing.
- **VietQR / NAPAS 247**: the transfer memo is the reconciliation key.

## Archetype anti-patterns

- **Float money or lines that don't sum**: audits fail. P1.
- **Bare `$` in a multi-currency product**: ambiguous amount. P1.
- **VND with decimals or abbreviated on confirm**: hides the real amount. P1.
- **Confirm labeled OK or Submit**: amount and action unnamed. P1.
- **Double submit possible**: duplicate transfers. P0 with live money.
- **Editing a finalized invoice or posted entry**: breaks the paper trail. P1.
- **Hidden proration or fees**: surprises become disputes. P1.
- **Balance without "as of" or pending split**: users spend money they lack. P1.
- **Revenue hero-number wall**: banned template; finance needs tables that reconcile. P2.

## Coverage additions

- [ ] Amounts in 0- and 2-decimal currencies, negative style, ISO code rule, lines sum to total.
- [ ] Transfer: review with Change links, step-up, single submit, Pending/Completed/Failed results.
- [ ] Proration preview; cancel now vs period end; every subscription status rendered.
- [ ] Failed payment: reason, next retry, hard-decline path, final outcome stated.
- [ ] Invoice statuses and credit note; finalized fields locked.
- [ ] Transactions: pending vs posted, amount search, filtered export.
- [ ] Bulk approve skips flagged items; rejection needs a reason.
- [ ] Reconciliation reaches zero difference; locked period offers reversal only.
- [ ] VietQR: copy fields, waiting, expired, wrong amount, missing memo.
- [ ] E-invoice fields captured; VND formatted `1.250.000 ₫`.

## Sources

- https://docs.stripe.com/invoicing/overview (accessed 2026-09-28)
- https://docs.stripe.com/billing/revenue-recovery/smart-retries (accessed 2026-09-28)
- https://docs.stripe.com/customer-management (accessed 2026-09-28)
- https://docs.stripe.com/currencies (accessed 2026-09-28)
- https://design-system.service.gov.uk/patterns/check-answers/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/resource-management/delete/ (accessed 2026-09-28)
- https://www.vietqr.io/ (accessed 2026-09-28)
- Practitioner knowledge: append-only ledger and reversing entries, reconciliation workspace, expense OCR review, VND display, e-invoice fields (Decree 123/2020/NĐ-CP), ASCII transfer content.
