# Pattern family: Forms, wizards, and settings

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: form shape, field layout, control choice, complex inputs, wizard anatomy, settings architecture, autosave vs explicit save.

Not restated: labels, required status, validation states, unsaved changes, focus, duplicate submit, save semantics ("Forms and settings" in [dashboard-product-contract.md](../../dashboard-product-contract.md)). Forms in overlays → [detail-views-overlays.md](detail-views-overlays.md). Toasts, undo → [feedback-states-notifications.md](feedback-states-notifications.md). Sign-up, profile → [auth-onboarding-account.md](auth-onboarding-account.md). Role-gated settings → [permissions-roles-audit.md](permissions-roles-audit.md).

## Choose the variant

| Observable predicate | Shape |
|---|---|
| Up to ~10 fields, one sitting, no branching (convention) | Single-page form |
| Choices in one step change later steps, distinct groups of fields, or a review is needed before an irreversible or paid create | Wizard, 3–5 steps, 7 max (Cloudscape) |
| One attribute changes on an existing record | Inline edit |
| Most users never touch a group of options | Progressive disclosure: collapsed "Advanced" section that shows how many values differ from defaults |
| Infrequent, high-stakes, broad or low-confidence audience (public service, first purchase, KYC) | One question per page with a check-answers page (GOV.UK) |
| Quick create from a list, up to ~5 fields (convention) | Modal or drawer form; more fields → page |
| Many fields of an existing record edited together | Edit page or edit mode of the detail page |

## Anatomy

**Page form**: title naming the task → optional intro → fieldset groups with legends → fields → action row.

**Field**: label → hint (one short sentence, no links; GOV.UK) → input sized to the expected answer → inline error. Labels above inputs by default: they survive long Vietnamese labels, zoom, and narrow widths. Left-aligned labels only for dense, read-mostly admin forms. Mark the minority: tag optional fields "(optional)", no asterisks (GOV.UK). Two inputs share a row only when they are one concept (start/end, amount/currency); a Vietnamese full name is one field.

**Action row**: one primary. Page forms: bottom-left, aligned with fields (Primer, GOV.UK). Dialogs: bottom-right. Inline edit: beside the input. Submit stays enabled (Primer, Cloudscape).

**Validation timing (delta)**: nothing on first load; on blur after input or when a required field is left; once errored, re-validate per keystroke so the error clears as it's fixed; on submit, validate all, show the error summary linking each field, focus it, prefix the page title "Error: " (GOV.UK, Cloudscape). Summary text matches inline text. Non-field errors go in an alert above the action row.

**Control choice**

| Situation | Control |
|---|---|
| 2–5 exclusive options the user should compare | Radio group, all visible |
| 2–4 options that switch a mode or view immediately | Segmented control (saves on change) |
| ~6–15 options, or tight space (convention) | Select |
| Long known list: province, bank, country, user | Combobox with type-ahead (APG Combobox) |
| Binary that takes effect immediately | Switch |
| Binary submitted with the form | Checkbox |
| Multi-select, up to ~7 options (convention) | Checkbox group; more → multi-select combobox with removable chips |
| Precise number in a range | Number input; a slider only alongside a typed input (GOV.UK) |
| Familiar data like birth year | Typed input, not a dropdown (NN/g) |

**Repeater / key-value editor**: rows of labeled fields (key, value, remove) → "Add row" under the last row → optional "Paste as text" accepting `KEY=value` lines. Adding focuses the new row; removing focuses the next row or Add. Duplicate keys error inline. State the row cap up front. Reorder by drag plus "Move up/down" buttons. Secrets masked with a reveal toggle.

**File upload**: a button (the accessible path) plus drop zone → types and max size stated before selection → per-file row: name, size, progress, cancel, retry, remove, image preview. Validate per file. The form stays editable during upload; submit waits and says why. Errors elsewhere never discard uploaded files.

**Date, time, range**: memorable dates use day/month/year fields or one text field with the format shown (dd/mm/yyyy in Vietnam). Scheduling: calendar plus typable field, never a calendar alone (GOV.UK). Show timezone when users cross zones. Ranges: two inputs plus presets ("Last 7 days"); end before start errors inline.

**Currency**: amount input with the currency as a visible adornment, not placeholder text. Accept raw digits and pasted grouping; format on blur. VND has no minor unit: `1.250.000 ₫`, no decimals, `.` grouping. Store integers; show the currency code when more than one currency exists. `inputmode="numeric"` or `"decimal"`.

**Phone**: one field, `type="tel"`, `autocomplete="tel"`; accept spaces and dashes. Country code picker only when international. Vietnam: accept both `09xx xxx xxx` and `+84 9xx…`, normalize on save, display grouped.

**Wizard**: task title → step list (vertical, left on desktop) → step heading → step content → footer: Cancel, Back, Next; the final button names the outcome ("Create workspace"), not "Finish" (PatternFly). Review step lists answers in step order, each section with an Edit link (Cloudscape).

**Settings page**: scope label in the header ("Workspace settings · Acme") → category nav → sections, each with heading, one-line description, fields, and its own save when saving per section → danger zone last.

## Behavior and states

- **Wizard navigation.** Visited steps clickable, later ones not (PatternFly). Validate the step on Next; Back preserves data; branching adds or removes steps visibly. Edit from review returns to the step, whose Continue goes back to review after any newly triggered questions (GOV.UK). Exit prompts only when there is input (Cloudscape). Long wizards keep a server-side draft. On finish, show progress if slow, then land on the created record.
- **Modal wizard** only for up to ~3 short steps (convention); otherwise in-page so prerequisites can be done elsewhere (PatternFly).
- **Inline edit.** Value or edit button → input with Save/Cancel beside it; Enter saves, Esc cancels; one field at a time; "Saving…" then "Saved"; on failure stay in edit mode with the value kept. Read-only users get no edit affordance and a stated reason.
- **Autosave vs explicit** (Primer). Autosave imperative controls: switches, segmented controls, custom single selects. Explicit save for text, checkboxes, radios, multi-selects. Never both in one form; if a page needs both, give autosave controls their own section.
- **Explicit save on long pages.** Sticky bar when dirty: "Unsaved changes · Discard · Save".
- **Autosave.** Debounce text and save on blur. Inline per-control status. On failure keep the value with an inline error and Retry; never a silent revert.
- **Settings architecture.** Separate personal, workspace, and per-resource settings in nav and titles. Up to ~7 categories: one page with anchors; more: grouped secondary nav (General, Members, Billing, Integrations, Security, Advanced); past ~30 settings add search (conventions). Inherited values read "Set by your organization" with a link. Delayed-effect settings (DNS, billing cycle) say when they apply.
- **Danger zone.** Last section, plain heading ("Delete or transfer"). Each row: what it does, what is lost (with counts), destructive button. Offer archive or transfer first. Irreversible deletes require typing the name (NN/g). The heading and button carry the signal, not a red card.

## Keyboard and accessibility

- APG patterns: Radio Group (arrows move and select), Combobox, Listbox, Switch, Tabs, Disclosure for "Advanced".
- `fieldset`/`legend` for related inputs; date parts share one legend.
- Enter submits single-line forms, never inside a textarea; Ctrl/Cmd+Enter submits multiline composers.
- Wizard step change focuses the new step heading and updates the page title ("Step 2 of 4: Network").
- Autocomplete tokens on identity fields (`name`, `email`, `tel`, `one-time-code`).

## Responsive transformation

- Wizard step list → "Step 2 of 4 · Network" header with a step menu; footer sticky above the virtual keyboard.
- Paired fields stack; repeater rows stack key above value, each labeled.
- Settings nav → category list page that drills in, with back.
- Sticky save bar and error summary never cover the focused input.

## Defaults

- Form column max width ~560–640px; input widths in `ch` (convention).
- Wizard 3–5 steps, max 7 (Cloudscape).
- Autosave debounce ~800–1000ms; "Saved" ~2s, then "Saved just now" (convention).
- Group gap larger than field gap, e.g. 32px vs 16–20px (convention).

## Anti-patterns

- **Placeholder as label or hint**: vanishes on typing, hides format during error recovery (NN/g). P1.
- **Mixed autosave and explicit save in one form**: users cannot tell what persisted. P1.
- **Calendar-only date input**: blocks keyboard and assistive tech. P1.
- **Wizard for a 6-field form, or a modal wizard over 3 steps**. P2.
- **Multi-column layout for unrelated fields**: breaks scan order and zoom. P2.
- **Dropdown for 2–3 options or birth year**: hides choices, slows entry. P2.
- **Danger zone as a red side-stripe card**: craft ban. P2.
- **Validating on first load, or a generic "Fix all errors" summary**. P2.

## Coverage additions

- [ ] Form shape and each choice control justified by the predicates above.
- [ ] Complex inputs cover paste, format-on-blur, VND/phone normalization, timezone.
- [ ] Wizard: back preserves data, edit-from-review returns to review, exit prompts only when dirty, draft persists.
- [ ] Settings: scope labeled, per-section save declared, inherited values explained, danger zone with counts and typed confirmation.
- [ ] Autosave failure and offline states rendered.

## Sources

All URLs accessed 2026-09-28.

- https://design-system.service.gov.uk/patterns/question-pages/
- https://design-system.service.gov.uk/components/error-summary/
- https://design-system.service.gov.uk/patterns/check-answers/
- https://design-system.service.gov.uk/patterns/dates/
- https://cloudscape.design/patterns/resource-management/create/multi-page-create/
- https://cloudscape.design/patterns/general/errors/validation/
- https://cloudscape.design/patterns/general/unsaved-changes/
- https://www.patternfly.org/components/wizard/design-guidelines
- https://primer.style/product/ui-patterns/saving/
- https://www.nngroup.com/articles/form-design-placeholders/
- https://www.nngroup.com/articles/drop-down-menus/
- https://www.nngroup.com/articles/confirmation-dialog/
- Practitioner knowledge: control-choice option counts, repeater focus rules, VND/phone normalization, settings nav thresholds.
