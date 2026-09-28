# Pattern family: Filters, search, and command

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: filter bars, facets, chips and tokens, query builders, saved filters, collection and global search, result pages, zero results, command palette, shortcut systems.

Elsewhere: base filter requirements are in [dashboard-product-contract.md](../../dashboard-product-contract.md) "Tables and collections". Saved views as table state: [data-tables-collections.md](data-tables-collections.md). Where the search trigger sits in the shell: [app-shell-navigation.md](app-shell-navigation.md). Empty-state visuals: [feedback-states-notifications.md](feedback-states-notifications.md).

## Choose the variant

| Observable predicate | Pattern |
|---|---|
| 2–3 attributes cover most filtering, dataset fits one list | Filter bar: search field + 2–3 promoted filter dropdowns + "More filters" |
| Many attributes (6+), users explore without a fixed goal, value counts help | Faceted panel beside results, with counts |
| Power users combine property + operator + value, including "is not" and "is empty" | Token filter: one input that builds `Property operator value` tokens |
| Nested AND/OR logic, reused as a named segment (audiences, alert rules) | Query builder with condition rows and groups |
| Users find records inside one collection by name or ID | Collection search in the toolbar, scoped to that collection |
| Users find anything across object types | Global search with grouped, scoped results and a full results page |
| Frequent users move and act by name, keyboard-first, across many commands | Command palette |

Apply mode: live results when they return in under a second and users explore on desktop. Batch apply ("Show 42 orders") on mobile, for slow queries, or when users arrive with several criteria.

## Anatomy

**Filter bar (in order)**: search field labelled for the collection ("Search orders"); promoted filter dropdowns showing state ("Status: 2"); "More filters"; sort if not in headers; applied row of chips, "Clear all", result count.

**Chip**: `Category: value, value`. One chip per category (OR within, AND across). Click to edit; remove button named "Remove filter Status: Paid". Ambiguous values carry context ("High risk", not "High").

**Faceted panel**: headed groups, values with counts, "Show more" after 5, in-facet search at 10+ values, collapsible. Groups ordered general to specialized; values ordered logically (sizes by size), not alphabetically by default.

**Token filter**: typing suggests properties, then operators (`is`, `is not`, `contains`, `>`, `<`, `is empty`), then values from the data. Free text becomes a text token.

**Query builder**: condition rows (field, operator, value, remove), "Add condition", "Add group", AND/OR per group, max 2 levels deep (convention), live match count, plain-language summary ("Customers in Hà Nội who ordered in the last 30 days").

**Saved filter**: name and visibility (only me, team), changed state, "Update" vs "Save as new", shown as view tabs above the collection.

**Global search overlay**: removable scope chip ("In: Acme Store"), recent searches and records before typing, then results grouped by type, 3–5 each with "See all 23 customers", and a "Search everything for 'nguyen'" row to the results page.

**Results page**: editable query, type tabs or facets with counts, sort (relevance, newest); each result shows type, title with matches emphasized, parent path, snippet, metadata. Paginated.

**Command palette**: modal dialog with a combobox input ("Type a command or search"), sections (Recent, Go to, Actions, Records), items with icon, label, context, shortcut hint; visible scope; footer of key hints. A `>` prefix limits to commands.

**Shortcut sheet**: opened by `?` and from help/account menus, grouped by area, showing the platform's modifier, linking to the setting that turns single-key shortcuts off.

## Behavior and states

- Filters, query, sort, and page live in the URL; back restores them, shared links reproduce them.
- Search debounces, cancels stale requests, shows progress in the field, and keeps old results dimmed until new ones arrive instead of flashing a spinner.
- The result count updates in a polite live region after the debounce.
- Keep scroll position when filtering beside results; scroll to top only when results shrink to one screen.
- Show value counts to steer users away from zero-result combinations. Zero-count values are either de-emphasized or hidden; one rule per product.
- The query becomes a chip too; "Clear all" removes query and filters but keeps the view.
- Counts and suggestions never reveal records the user can't access.
- Vietnamese: match accent-insensitively ("nguyen" finds "Nguyễn", "d" finds "đ"), display original diacritics, sort with Vietnamese collation.

**Zero results** (distinct from an empty dataset):
- Say what returned nothing: "No orders match 'nguyen' with Status: Paid." Keep the query editable.
- Offer the cheapest relaxation with its payoff: "Remove Status: Paid to see 42 orders", then "Clear all filters".
- Offer corrections and other scopes: "No customers found. 3 orders mention 'nguyen'."
- Offer creation when likely intended: "Create customer 'Nguyễn Văn An'". No jokes.

**Command palette**:
- Local commands and recents render instantly; remote records stream in below without moving the highlighted row.
- Rank exact prefix, then recent use, then fuzzy. On a record page, that record's actions come first.
- Enter runs; modifier + Enter opens navigation results in a new tab. Tab narrows scope on a scoped result; Backspace in an empty input widens it.
- Destructive commands open their normal confirmation; the palette never bypasses safeguards.
- Commands without permission are hidden unless discovery matters, then shown with the reason.
- Escape closes and returns focus.

**Shortcut system**:
- Modifier combos for global actions (modifier + K), sequences for go-to (`g` then `o` for Orders), single keys (`j`, `k`, `x`) only while focus is in the list.
- Nothing fires while typing in a text input except modifier combos meant for it. Never override browser or OS reserved combos.
- Every shortcut has a non-keyboard path and is shown in tooltips, menus, the palette, and the `?` sheet.
- Single-character shortcuts can be turned off or remapped (WCAG 2.1.4).

## Keyboard and accessibility

- Search, token, and palette inputs follow APG Combobox: DOM focus stays in the input, `aria-activedescendant` tracks the option, `aria-expanded`/`aria-controls` reference the popup, Up/Down move, Enter accepts, Escape closes then clears.
- Palette and mobile filter sheet follow APG Dialog (Modal): focus in, Tab contained, Escape closes, focus returns to the trigger.
- Checkbox filter dropdowns: button + popup with a labelled checkbox group; the trigger announces the selected count.
- Token field: Backspace in an empty input focuses the last token, a second press removes and announces it.
- Shortcuts and Enter-to-submit ignore keystrokes during IME composition (`event.isComposing`, or `keyCode 229` on older engines). Vietnamese Telex/VNI, Chinese, and Japanese input otherwise fire commands mid-word. Test with a real IME, not synthetic key events.
- Result groups are labelled ("Customers, 3 results"). Match highlighting uses `mark` or weight, not color alone.

## Responsive transformation

- **Filter bar** → "Filters (3)" button opening a full-height sheet with batch apply labelled by outcome ("Show 42 orders") and reset in the header. Chips stay as a scrolling row above results.
- **Faceted panel** → the same sheet with collapsible facets.
- **Token filter, query builder** → stacked condition rows, native selects for operators.
- **Global search** → top-bar icon opening a full-screen search view with recents.
- **Command palette** → not needed on touch; everything in it must already be in menus. Hide shortcut hints on touch.

## Defaults

- Promoted filters: 2–3 (Polaris).
- Typeahead inside a select at 10+ values (PatternFly). Facet "Show more" after 5 values (convention).
- Live results must return in under 1 second, else batch (NN/g).
- Search debounce 200–300ms; start searching at 1 character for IDs, 2 for text (convention).
- Global search overlay: 3–5 results per group, 5 recent items (convention).
- Palette: 560–640px wide, ~15vh from top, 8–10 visible rows, opens under 100ms (convention).

## Anti-patterns

- **Applied filters hidden in a closed panel**: data misread as complete. P1.
- **Filter state not in the URL**: back and share lose it. P1.
- **Empty dataset and zero results share one message**: users think data is gone. P1.
- **Accent-sensitive search for Vietnamese**: "nguyen" finds nothing. P1.
- **Palette as the only path to an action**: undiscoverable for touch and new users. P1.
- **Single-key shortcuts with no off switch**: speech-input users trigger commands by dictating. P1.
- **Jump to top after each filter click**: disorients, causes misclicks. P2.
- **Jargon or internal codes as filter labels**: values unpredictable. P2.
- **Query builder for a two-filter need**: cost without payoff. P2.
- **Humorous zero-results art**: reads as mocking. P2.

## Coverage additions

- [ ] Filter variant and predicate; live vs batch per breakpoint.
- [ ] Chip grammar (merge, OR/AND, edit, remove names); URL state restored on back.
- [ ] Zero-results screen: query shown, editable, relaxation with counts, cross-scope and create options.
- [ ] Accent-insensitive matching and Vietnamese collation verified with real names.
- [ ] Global search: scope chip, grouped results, "see all", results page.
- [ ] Palette: sections, ranking, context commands, permission handling, focus return.
- [ ] Shortcut map, `?` sheet, input-focus suppression, single-key off switch.
- [ ] Mobile filter sheet with outcome-labelled apply button.

## Sources

- Shopify Polaris, Filters: https://raw.githubusercontent.com/Shopify/polaris/main/polaris.shopify.com/content/components/selection-and-input/filters.mdx (accessed 2026-09-28)
- PatternFly, Filters design guidelines: https://www.patternfly.org/patterns/filters/design-guidelines (accessed 2026-09-28)
- PatternFly, Toolbar design guidelines: https://www.patternfly.org/components/toolbar/design-guidelines (accessed 2026-09-28)
- Carbon, Search usage: https://raw.githubusercontent.com/carbon-design-system/carbon-website/main/src/pages/components/search/usage.mdx (accessed 2026-09-28)
- NN/g, Applying filters (batch vs interactive): https://www.nngroup.com/articles/applying-filters/ (accessed 2026-09-28)
- NN/g, Filter categories and values: https://www.nngroup.com/articles/filter-categories-values/ (accessed 2026-09-28)
- NN/g, Zero-results search pages: https://www.nngroup.com/articles/search-no-results-serp/ (accessed 2026-09-28)
- GitHub Docs, Command palette: https://docs.github.com/en/get-started/accessibility/github-command-palette (accessed 2026-09-28)
- GitHub Docs, Keyboard shortcuts: https://docs.github.com/en/get-started/accessibility/keyboard-shortcuts (accessed 2026-09-28)
- WAI-ARIA APG, Combobox: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (accessed 2026-09-28)
- WAI-ARIA APG, Dialog (Modal): https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ (accessed 2026-09-28)
- WCAG 2.2 Understanding 2.1.4 Character Key Shortcuts: https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html (accessed 2026-09-28)
- Practitioner knowledge: token filter, query builder, palette ranking, accent folding, values marked convention.
