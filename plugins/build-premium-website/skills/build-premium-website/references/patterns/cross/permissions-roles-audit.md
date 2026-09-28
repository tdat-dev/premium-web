# Pattern family: Permissions, roles, and audit

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Scope

In: roles list and editor (permission matrix, custom roles), role assignment to members and groups, resource sharing (share dialog, link access, inheritance), denied and read-only rendering, request access, impersonation ("view as"), audit log, approvals (four-eyes).

Elsewhere: members table, invites, and ownership transfer → [auth-onboarding-account.md](auth-onboarding-account.md). Table mechanics for the audit log → [data-tables-collections.md](data-tables-collections.md). Audit filters and query syntax → [filters-search-command.md](filters-search-command.md). Event detail drawer → [detail-views-overlays.md](detail-views-overlays.md). Share notifications and presence → [collaboration-realtime.md](collaboration-realtime.md). Permission-state coverage is required by [dashboard-product-contract.md](../../dashboard-product-contract.md); this file defines the rendering.

## Choose the variant

| Observable predicate | Access model UI |
|---|---|
| 2–5 fixed roles, permissions are a strict ladder | Role picker with one-line description per role; no editor |
| Customers ask for "X but without Y" | Custom roles cloned from a base role, edited in a permission matrix |
| Access varies per object (files, projects, dashboards) | Share dialog per resource plus inherited workspace role |
| Many members share one function (support, finance) | Groups/teams hold roles; members inherit |

| Observable predicate | Denied action rendering |
|---|---|
| User will never have the capability (billing for a viewer, admin area for a contractor) | Hide the control and the nav item |
| User could get it by asking, or peers visibly have it | Show enabled; on activation explain and offer "Request access" |
| Capability is blocked by state, not role (locked record, plan limit) | Disabled with adjacent reason text, or enabled with explanation on use |
| Whole screen is read-only for this user | Render fields as text, not disabled inputs; banner states why and who can edit |

## Anatomy

**Roles list.** Table: name → Built-in/Custom → member count (links to filtered members) → description → row menu (Duplicate; Edit/Delete for custom). "Create role" top right.

**Role editor.** Name and description → "Start from" base role (prefills matrix) → permission matrix grouped by resource: rows are permissions ("View invoices", "Refund payments"), columns are access levels or a single checkbox, group header with tri-state "select all in group" → dependency hints inline ("Requires View invoices") → sticky footer: summary "14 of 52 permissions" + "Save role". Dangerous permissions (delete workspace, export all data, manage billing) carry a text marker "Sensitive", not only a color.

**Assign role.** Role cell in the members table is a select; confirm only when it lowers your own access. Bulk assign from selection. Show effective role with source: "Editor (from Finance team)".

**Share dialog.** Title "Share <resource name>" → add-people combobox (people, groups, email) with role select beside it and "Notify people" checkbox + optional message → people-with-access list: avatar, name, email, role select, "Inherited from <parent>" label with link, remove action → General access: Restricted / Anyone in <workspace> / Anyone with the link, each with its role → "Copy link" → "Done". Owner shown first, not removable.

**Denied page.** Heading "You don't have access to <resource name>" (name only if the user may know it exists; otherwise generic "This page isn't available") → who controls access ("Owned by Lan Nguyen") → "Request access" with optional note → "Switch account" when signed in as a different identity → link back to a safe parent.

**Request-access inbox (owner).** Row: requester, resource, requested role, note, time → "Approve as <role>" / "Deny" → requester notified.

**Impersonation / view as.** Start: admin picks user → reason field (required, logged) → confirm. During: full-width non-dismissable banner above the shell in a reserved color: "Viewing as Minh Tran (minh@shop.vn). Actions are logged as you." + "Stop viewing". Default read-only; write mode needs an extra explicit toggle. End: return to the admin screen the session started from.

**Audit log.** Filter bar (actor, action, target, date range, IP/country) → table: time (absolute, with timezone) → actor (avatar, name, "via API token <name>" or "as impersonator <name>") → action in plain words ("Changed role") plus machine name `member.role_update` in secondary text → target (linked if it still exists, plain name + "deleted" if not) → source IP/location → row opens detail drawer: full metadata, before/after diff (field, old value, new value), request ID, user agent, raw JSON toggle → "Export CSV/JSON" scoped to current filter. Read-only; no edit or delete actions exist on audit entries.

**Approval (four-eyes).** Requester: action form ends in "Submit for approval" (not "Save") → pending state on the object ("Waiting for approval from Finance admins", submitted time, "Cancel request"). Approver: queue list → detail showing exactly what will change (diff) + requester + reason → "Approve" / "Reject" with comment (required on reject) → outcome notifies requester and writes audit entries for both steps.

## Behavior and states

- Effective permission = union of role, group, and resource grants; highest grant wins (GitHub model). Show the source of each grant so users can explain their access.
- Inheritance: inherited entries show locked with a parent link; edit them on the parent. "Stop inheriting" is explicit and confirmed with consequences.
- Link access changes show impact before saving: "Anyone with the link can view. 3 people have opened this link."
- Lowering your own access: confirm with "You'll lose access to <resource> immediately".
- Last-admin guard: block removal or demotion of the last admin with reason, not a disabled button without text.
- Deleting a role in use requires a replacement role.
- Access lost mid-session: the next request shows the denied page; unsaved work is preserved, never silently dropped.
- Hide vs explain stays consistent across list, detail, and command palette; a hidden command must not run from its shortcut.
- Self-approval blocked where policy says so; say "You can't approve your own request" on the approve button's reason text.
- Pending approvals expire on a stated date; expired shows "Request expired, submit again".
- Audit log: newest first, absolute timestamps; repeated events group with a count and expand, never vanish. State retention on screen ("Showing the last 180 days").

## Keyboard and accessibility

- Permission matrix: small matrices use a native `<table>` with checkboxes (Tab order is fine). Large matrices (over ~30 cells) follow the WAI-ARIA APG Grid pattern: one tab stop, arrow keys between cells, Home/End, Ctrl+Home/End, Space toggles. Group "select all" exposes `aria-checked="mixed"`.
- Share dialog follows APG Dialog (Modal); the add-people field follows APG Combobox with listbox popup (`aria-activedescendant`, Enter selects, Escape closes the popup before the dialog).
- Impersonation banner is a labeled `role="region"` placed first in DOM order, so "Stop viewing" is the first Tab stop on every page.
- Read-only fields are text or `readonly` inputs, not `disabled`: focusable and copyable.
- Denied reasons associated to controls via `aria-describedby`.
- Diff: "Before"/"After" text labels, not red/green alone.

## Responsive transformation

- Permission matrix: phones show one resource group at a time as a list of toggles; column-heavy matrices become per-level select per row.
- Share dialog: modal → full-screen sheet; role select stays inline with each person.
- Audit log: time, actor, action stay; target and IP move to a second line; diff opens full screen.
- Impersonation banner stays visible at every width; it never collapses into an icon.

## Defaults

- Built-in roles: Owner, Admin, Member, Viewer (convention); add Billing or Guest only when a real actor needs them.
- New members default to the lowest role that lets them do the job invited for (least privilege, GitHub guidance).
- Impersonation session: time-boxed, e.g. 30-minute maximum with 10-minute idle timeout (Clerk defaults).
- Audit retention shown in UI; GitHub organizations keep 180 days and show 3 months by default.
- Link-access default: Restricted (convention).
- Approval request expiry 7 days (convention).

## Anti-patterns

- **Disabled button with no reason** — users cannot tell whether it is broken, pending, or forbidden — P1.
- **Hiding a control users know exists** — reads as a bug — P2.
- **Read-only screens made of greyed disabled inputs** — low contrast, unfocusable, uncopyable — P2.
- **Ungrouped permission matrix without dependency hints** — P2.
- **Impersonation without persistent banner or logged reason** — accidental actions, no accountability — P1.
- **Editable audit entries, or entries missing actor type (user, token, system, impersonator)** — P1.
- **Audit log with relative timestamps only** — unusable for incident timelines — P1.
- **Link-access change without impact preview** — accidental exposure — P1.
- **Approver cannot see the exact diff** — rubber-stamping — P1.
- **Denied page that confirms existence of a private resource by name** — information leak — P1.

## Coverage additions

- [ ] Each role × each primary journey: allowed, hidden, explained, read-only.
- [ ] Access lost or granted mid-session.
- [ ] Inherited vs direct grant; stop inheriting; group removal cascades.
- [ ] Last admin / self-demotion guard.
- [ ] Request access: sent, approved, denied, duplicate request.
- [ ] Impersonation start, read-only enforcement, write-mode toggle, timeout, stop; audit shows impersonator.
- [ ] Audit: filtered empty, deleted target, token actor, system actor, export scope.
- [ ] Approval: pending, approved, rejected with comment, self-approval blocked, expired.
- [ ] Vietnamese: role names and permission labels translated consistently; long labels in matrix columns.

## Sources

- https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization (accessed 2026-09-28)
- https://docs.github.com/en/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/reviewing-the-audit-log-for-your-organization (accessed 2026-09-28)
- https://docs.github.com/en/actions/managing-workflow-runs-and-deployments/managing-deployments/reviewing-deployments (accessed 2026-09-28)
- https://support.google.com/drive/answer/2494822?hl=en (accessed 2026-09-28)
- https://clerk.com/docs/guides/users/impersonation (accessed 2026-09-28)
- https://www.nngroup.com/articles/permission-requests/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/combobox/ (accessed 2026-09-28)
- https://primer.style/product/ui-patterns/saving (accessed 2026-09-28)
- Practitioner knowledge: hide vs explain decision, read-only rendering, inheritance display, four-eyes anatomy, audit diff drawer.
