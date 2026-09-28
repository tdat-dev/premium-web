# Archetype: Docs / knowledge / CMS

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: write and restructure long-form content, find answers, and move structured content from draft through review to a live channel on a date. Actors: writers/editors, reviewers, readers (usually the majority, often read-only), space admins, developers who define content models. Readers visit briefly via search; writers stay 20–90 minutes (convention). Signals: "wiki", "page tree", "block editor", "content types", "entries", "draft/publish", "schedule", "locales".

Two sub-shapes: **doc workspace** (free-form pages in a tree) and **structured CMS** (typed entries from a content model, rendered by a channel). Record which leads.

Neighbors:
- **Admin / back-office**: a CMS-lite with no draft/published divergence, review, or scheduling is admin.
- **Work management**: a unit with assignee and status, not prose or content fields.
- **landing/docs-developer-portal.md**: owns the public reader site; authoring and content ops live here.

## Shell and topology

Default (doc workspace): left sidebar with space switcher, search, page tree, favorites/recent; content column with breadcrumb, title, editor; right rail on demand for comments, page info, history. Create sits at the sidebar top and as `+` on tree rows. Design for 3–5 visible tree levels (convention).

Default (structured CMS): left nav of content types or saved views; entry collection table; entry editor with a sticky status bar (status, locale, publish) and a side panel for references, workflow, schedule, versions.

Alternatives:
- If readers outnumber writers and most visits are one page, render a reader view without editor chrome and put Edit behind one control.
- If content feeds several channels (web, app, email), add a preview-target switcher and side-by-side preview.

Shell rules: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md).

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| Page | Read and edit | Breadcrumb, title, meta (owner, updated, restriction marker), body, comments, child pages | Read-only, view- vs edit-restricted, archived, co-editing, offline edits pending |
| Page tree | Browse, restructure | Space header, tree rows with expand, drag handle, `+`, row menu | 500+ siblings, deep nesting, invisible restricted child |
| Search | Find an answer | Query, scope, filters (type, author, updated), results with snippet and path | Zero results with suggestion, permission-filtered, archived excluded |
| Content model | Define types | Type list, fields with type and validation, reference targets, localized flag | Editing a field used by entries; deleting a type with entries |
| Entry list | Operate in bulk | View switcher, status, locale, updated by, scheduled date, bulk actions | Mixed statuses selected; entries failing validation |
| Entry editor | Write one entry | Status bar, locale switcher, fields in model order, references, side panel | Draft, Changed, Published, Scheduled, Archived, locked by release |
| Review queue | Approve content | Items awaiting me, diff vs live, approve / request changes, comment | Approver is author; reviewer cannot publish |
| Releases | Ship changes together | Release list, contents, time with timezone, validation summary | Invalid entry blocks release; time in past |
| Media library | Reuse assets | Grid/list, filters, usage count, alt text, focal point, replace | In-use asset delete; missing alt; partial batch upload failure |
| History / trash | Compare, restore | Version timeline, diff, restore; trash with retention | Restore when parent is gone |
| Space permissions | Control access | Members/groups, space role, default access, restriction list | Last admin removal; public link on |

## Signature patterns

1. **Block editor with slash menu.** `/` opens a filtered command list at the caret: block types, embeds, actions (delete, duplicate, turn into). Line-start shortcuts (`#`, `-`, `[]`, `>`) convert blocks; a hover handle drags and nests with a drop indicator; "turn into" changes type keeping text. Edge cases: rich paste keeps structure, strips styling; block move has a keyboard/menu path. Toolbars and menus follow APG toolbar and menu patterns.
2. **Page tree as the IA.** Drag to reorder or nest with a visible drop target, plus "Move to…" with a searchable picker (APG tree view). Moves keep stable IDs so links survive, update breadcrumbs, and toast with undo. Restricted children are absent for users who cannot view them.
3. **Draft and published as separate versions.** The live version keeps serving while a draft diverges. Minimum statuses: Draft (never published), Changed (published with unpublished edits), Published. Offer "View live", "Discard changes", and on unpublish ask whether to keep draft edits. Publishing with references to unpublished entries warns and lists them.
4. **Review with a diff.** Draft → In review → Approved → Published, each transition role-gated. Reviewers see a diff against live, not the whole page. Request changes requires a comment. Show who holds the item.
5. **Scheduling and releases.** Arm a schedule in two steps: pick a time, then confirm Schedule. Show timezone beside every scheduled time. A release groups entries that go live together; entries in an armed release are locked or visibly marked. Validate it ahead of time and alert the owner on failure.
6. **Per-field localization.** The model marks fields localized or shared. A locale switcher near the title persists across entries; each locale has its own status; "fill from another locale" seeds values. Missing translation is a visible per-locale state, and the fallback is named ("falls back to Tiếng Việt").
7. **Two-level permissions.** Space role sets the baseline; page restrictions narrow view or edit. View restrictions cascade to children, edit restrictions may not; the UI says which. A restriction marker sits on the page and an access panel lists who can view/edit and why. Denied rendering: [cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md).
8. **History, trash, restore.** Periodic snapshots while editing, a diff viewer, restore that is itself undoable. Delete moves the page and its children to trash with stated retention; restore returns to the original parent or asks where.

Co-editing, comments, presence: [cross/collaboration-realtime.md](../cross/collaboration-realtime.md). Search and command palette: [cross/filters-search-command.md](../cross/filters-search-command.md). Entry lists: [cross/data-tables-collections.md](../cross/data-tables-collections.md).

## Density, data, and type calibration

- Reading column 65–75ch (craft-rules); editor chrome never narrows it.
- Long-read body text one step larger than product UI text (convention).
- Entry list rows 36–40px (convention). Status as a word plus shape, never color alone.
- Timestamps relative in lists and meta ("Updated 3 hours ago") with absolute on hover/focus; scheduled times absolute with timezone.
- One status vocabulary across list, editor, and API: Draft, Changed, In review, Scheduled, Published, Archived.
- Color budget: one hue for live, one for needs-attention, neutral for draft. Restrictions use an icon.

## Localization notes

- Search matches with and without diacritics ("huong dan" finds "hướng dẫn"). Slugs are ASCII; display titles keep full diacritics.
- Sort titles and authors with Vietnamese collation (đ after d, tones secondary), not code points.
- Meta dates dd/mm/yyyy; schedule pickers 24-hour with GMT+7 shown.
- Vietnamese labels run 20–35% longer: status chips and the publish group must fit "Đã lên lịch" and "Có thay đổi chưa xuất bản" without truncation.
- Locale switcher shows language names ("Tiếng Việt"), not only codes. If the model allows RTL locales, test tree and handle mirroring.

## Study pointers

- **Notion**: structural actions reachable from both slash menu and block handle give one mental model.
- **Confluence**: stating that view restrictions cascade and edit restrictions do not makes access predictable.
- **Sanity Studio**: stacking published, draft, and release versions lets editors preview a future date.
- **Strapi**: a locale choice that persists across content types keeps translation in one flow.

## Archetype anti-patterns

- **Publish button with no status**: users cannot tell whether live differs from what they see. P1.
- **Schedule that arms on date pick, or shows no timezone**: content ships at the wrong time or not at all. P1.
- **Drag-only tree and block reorder**: keyboard and screen-reader users cannot restructure. P1.
- **Hidden restriction state**: a page is shared wider or narrower than the author believes. P1.
- **Unpublish that silently drops the draft**: hours of edits lost. P1.
- **Search ignoring diacritics or permissions**: misses Vietnamese queries or leaks restricted titles. P1.
- **Delete with no trash**: one click destroys a subtree. P1.
- **Card-grid home of identical page tiles**: hides hierarchy a wiki depends on. P2.

## Coverage additions

- [ ] Slash menu: open, filter, keyboard select, Escape, no match.
- [ ] Block convert, move (drag and keyboard), nest; undo as one step.
- [ ] Tree: move with undo, deep nesting, restricted child absent, link survives move.
- [ ] Status words identical in list and editor; publish with unpublished references warns; unpublish asks about draft; discard.
- [ ] Review: diff, request changes with comment, role-blocked transition.
- [ ] Schedule: two-step arm, timezone shown, past time rejected, release validation alert.
- [ ] Locale: switch persists, per-locale status, missing translation, fill from locale, fallback named.
- [ ] Permissions: view vs edit restriction, access panel explains why, direct link to restricted page.
- [ ] History diff and restore with undo; trash retention; restore to missing parent.
- [ ] Search: diacritic-insensitive, scoped, permission-filtered.

## Sources

- https://docs.strapi.io/cms/features/draft-and-publish (accessed 2026-09-28)
- https://docs.strapi.io/cms/features/internationalization (accessed 2026-09-28)
- https://www.notion.com/help/writing-and-editing-basics (accessed 2026-09-28)
- https://www.notion.com/help/duplicate-delete-and-restore-content (accessed 2026-09-28)
- https://www.sanity.io/docs/studio/content-releases (accessed 2026-09-28)
- https://support.atlassian.com/confluence-cloud/docs/add-or-remove-page-restrictions/ (accessed 2026-09-28)
- Contentful model/workflow points, APG pattern mapping, Vietnamese collation and search: practitioner knowledge (Contentful help returned HTTP 429).
