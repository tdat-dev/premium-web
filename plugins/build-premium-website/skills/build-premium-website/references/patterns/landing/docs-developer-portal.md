# Pattern family: Docs sites and developer portals

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: public docs and developer portals: IA, sidebar, on-page TOC, search, code samples, API reference, quickstarts, versioning, API changelog, feedback, AI-readable output.

Elsewhere: in-app knowledge bases and authoring/CMS surfaces → [archetypes/docs-knowledge-cms.md](../archetypes/docs-knowledge-cms.md); API keys, webhooks, and usage inside the console → [archetypes/devtools-cloud-console.md](../archetypes/devtools-cloud-console.md); sign-in to reveal personal keys → [cross/auth-onboarding-account.md](../cross/auth-onboarding-account.md); command palette and result ranking → [cross/filters-search-command.md](../cross/filters-search-command.md); the marketing changelog and site header → [marketing-site-pages.md](marketing-site-pages.md).

Docs are read for long sessions next to an editor. Only the docs home takes a macrostructure from [structure-catalog.md](../../structure-catalog.md) (Dialogue Page or Ledger Index usually fit). Inner pages follow this anatomy and [craft-rules.md](../../craft-rules.md) floors; ambition gates do not apply to reference pages.

## Choose the variant

**Content type first (Diátaxis compass).** Ask two questions of every page: does it inform action or cognition, and does it serve acquisition (learning) or application (working)?

| Answer | Type | Page promise | Title shape |
|---|---|---|---|
| Action + acquisition | Tutorial | A guaranteed result for a newcomer, one path, no choices | "Build your first checkout" |
| Action + application | How-to guide | Steps to reach a goal the reader already has | "Refund a partial payment" |
| Cognition + application | Reference | Complete, consistent, lookup-shaped facts | "Refunds API", "Error codes" |
| Cognition + acquisition | Explanation | Why and how it fits together | "How idempotency works" |

A page that serves two quadrants splits into two linked pages.

**Portal shape.**

| Observable predicate | Shape |
|---|---|
| One product, < ~150 pages (convention) | Header + sidebar + content + on-page TOC |
| Several products or APIs with separate audiences | Header product switcher; each product owns its sidebar; shared search with product filter |
| Public HTTP API | Separate API reference: per-resource pages, prose column plus a code column pinned beside it on wide screens |
| SDK with generated symbol docs | Generated reference per language, linked from guides, not mixed into their sidebar |

**Versioning.**

| Observable predicate | Choice |
|---|---|
| Hosted API with dated versions, one live product | No site version picker; version noted on reference, upgrade guides per version |
| Installed package with several supported major lines | Version dropdown in header, banner on unreleased and unmaintained versions, fewer than 10 versions (Docusaurus) |
| Docs rarely change between releases | Do not version (Docusaurus) |

## Anatomy

**Header.** Logo → docs home → product switcher (if multi-product) → search trigger showing its shortcut → version picker (only if versioned) → API reference, Changelog, Status, Support → "Sign in" / "Dashboard".

**Sidebar tree.** Groups in reader order (Get started → guides by task → reference) → task labels for how-tos, noun labels for reference → one current item, ancestor path expanded (Primer TreeView) → depth ≤ 3 (convention).

**Content page.** Breadcrumb → H1 → one-sentence summary of what the reader will get → prerequisites (versions, keys, permissions) → body → "Next steps" links → feedback widget → last-updated date, "Edit this page" when the source is public → previous/next.

**On-page TOC.** "On this page" → H2/H3 only → scroll-linked current section → optional "Copy page as Markdown". Hidden under 3 headings (convention).

**Code block.** Filename or context caption → language/package-manager tabs → code with highlighted lines → copy button. Copy excludes prompts (`$`), line numbers, and output. Placeholders are visibly marked (`sk_test_...`); signed-in readers may get their own test key (Stripe does this). Never live secrets.

**API endpoint section.** Method + path + one-line purpose → auth and required scopes → parameters grouped as path, query, body, each: name, type, required/optional, default, constraints or enum values, description → nested children collapsed behind "Show child parameters" (Stripe collapses nested fields by default) → request example in the selected language → response example plus the returned object link → endpoint-specific errors → rate-limit, idempotency, and pagination notes where they apply → "Try it" when offered.

**Object page.** Fields with types, nullability, expandable relations → example JSON → endpoints returning it.

**Quickstart.** Goal and finished result → time and prerequisites → numbered steps (a real sequence, so numbers are earned), each ending with a check the reader can verify ("You should see `200 OK`") → inline "get your test key" step → complete working code → next steps by goal.

**API changelog.** Dated entries → version → type (Added, Changed, Deprecated, Removed), breaking flagged → affected endpoints → migration guide and deprecation dates → subscribe.

**Feedback widget.** "Was this page helpful?" Yes / No → on No, reasons (missing info, wrong, hard to follow, code failed) plus optional text → thanks. No login. Plus a "Report an issue" link.

**AI-readable output.** `/llms.txt` at the docs root: H1 name, blockquote summary, H2 sections of annotated links, an `Optional` section for skippable material (llmstxt.org). A Markdown twin of every page (`.md` URL). Optionally `llms-full.txt` with all pages concatenated (Mintlify generates both).

## Behavior and states

- **Language choice is global.** Picking Python switches every block and persists across pages. A block lacking that language says so and offers the nearest; no silent fallback.
- **Search.** Opens with "/" or Ctrl/⌘+K unless focus is in a text field. Results grouped by type (Guide, Reference, Changelog) with section path; endpoint and error-code queries match exactly. Zero results: spelling suggestion, top pages, support link. An "Ask AI" answer cites its pages and sits beside ranked results, never replacing them.
- **Anchors.** Every heading and parameter has a copyable link; anchor scrolling offsets for the sticky header; renamed pages redirect with anchors intact.
- **Version states.** Banner on old versions ("You are reading 2.x docs, latest is 3.x") with a link to the same page in latest, or to its index if it no longer exists. Unreleased versions carry a preview banner.
- **Lifecycle badges.** Beta, preview, deprecated, and removed are labels with a linked explanation and dates, on sidebar items and endpoint headers alike.
- **Try it console.** Sandbox/test mode by default; shows the equivalent `curl`; redacts keys in shared output; renders the real status and body; auth and network failures explain the fix.
- **Signed-in state.** Personal keys and account-specific hints appear after sign-in; anonymous readers still get the full docs.
- **Code correctness.** Samples run against the documented version; partial snippets are labeled.

## Keyboard and accessibility

- Language tabs: APG **Tabs**, automatic activation (panels are instant); arrow keys between tabs, `aria-selected` synced.
- Sidebar: a `nav` landmark labeled "Docs" with nested lists and disclosure buttons (APG Disclosure). Use `role="tree"` only if the full APG TreeView keyboard model is implemented.
- On-page TOC: `nav` labeled "On this page"; `aria-current` on the section in view.
- Search: APG **Combobox** inside a modal dialog; focus returns to the trigger on close.
- Code blocks that scroll horizontally get `tabindex="0"` and a label so keyboard users can scroll them. Syntax colors meet 4.5:1 on the code background in each supported theme. The copy button announces "Copied" through a live region.
- Theme: one deliberate default; a reader toggle is acceptable in docs if the choice persists and loads without a flash of the other theme.

## Responsive transformation

- Below ~1200 px (convention): TOC collapses into an "On this page" disclosure under the H1.
- Below ~768 px: sidebar becomes a drawer opened from a bar that shows the current section path; drawer opens scrolled to the current item.
- API reference: the pinned code column stacks beneath each endpoint section; the language picker moves to the top of each stacked sample and stays global.
- Tab overflow scrolls with a visible edge; Try it becomes a full-screen sheet; long identifiers wrap in prose, never inside code.

## Defaults

- Prose measure 65–75ch ([craft-rules.md](../../craft-rules.md)); code blocks may run wider than prose.
- Sidebar 240–300 px, TOC 200–240 px (convention).
- Sidebar depth ≤ 3; TOC H2–H3 only (convention).
- Maintained versions < 10 (Docusaurus).
- Copy confirmation visible ~2 s (convention); search debounce 100–200 ms (convention).
- `llms.txt` stays an index, not a dump; large sites split it by section (Mintlify caps a single file at 100,000 characters).
- Vietnamese docs: keep code identifiers, parameter names, and error codes in English; translate prose around them; dates dd/mm/yyyy in prose, ISO 8601 in code and changelog.

## Anti-patterns

- **Tutorial and reference on one page**: newcomers drown, experts cannot scan (Diátaxis). P2.
- **Language tabs that reset per block or per page**: readers re-pick constantly. P2.
- **Copy button that grabs `$`, line numbers, or output**: pasted commands fail. P1.
- **Try it pointed at live mode by default**: real charges or data changes from a docs page. P0.
- **Unversioned docs for a multi-version package**: readers on old versions follow wrong instructions. P1.
- **Login wall on public docs**: blocks evaluation and search indexing. P1.
- **Marketing hero or scroll animation on reference pages**: slows lookup. P2.
- **Content only in screenshots or JS-only tabs**: invisible to search, assistive tech, AI readers. P1-N.
- **Samples that do not run**: destroys trust in every other page. P1.

## Coverage additions

- [ ] Each page tagged with one Diátaxis type; mixed pages split
- [ ] Sidebar current path, drawer on narrow widths, keyboard disclosure
- [ ] Search: shortcut, grouped results, exact endpoint/error match, zero results
- [ ] Code: global language persistence, missing-language state, clean copy, key placeholder vs signed-in test key
- [ ] Endpoint: params with type/required/default, nested collapse, errors, response, Try it in sandbox with failure states
- [ ] Version banner, deprecated/beta badges, redirects with anchors
- [ ] Feedback widget, last-updated date, `/llms.txt`, per-page Markdown, anonymous access

## Sources

- https://diataxis.fr/ (accessed 2026-09-28)
- https://diataxis.fr/compass/ (accessed 2026-09-28)
- https://docs.stripe.com/api (accessed 2026-09-28)
- https://docusaurus.io/docs/versioning (accessed 2026-09-28)
- https://llmstxt.org/ (accessed 2026-09-28)
- https://www.mintlify.com/docs/ai/llmstxt (accessed 2026-09-28)
- https://primer.style/product/components/tree-view/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/ (accessed 2026-09-28)
- Practitioner knowledge: search grouping, Try it console behavior, feedback widget reasons, code-sample testing, responsive breakpoints.
