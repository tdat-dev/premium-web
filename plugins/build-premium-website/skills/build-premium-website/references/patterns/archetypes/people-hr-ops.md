# Archetype: People and HR operations

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: find a colleague, request and approve leave, record and approve hours, publish rosters, run payroll, onboard and offboard, run reviews. Three actors:

- **Employee**: short, infrequent visits (check balance, request leave, see payslip, clock in), often on a phone.
- **Manager**: weekly approval bursts (timesheets, leave, swaps).
- **HR / payroll admin**: long, deadline-driven sessions (payroll, policy setup, imports).

Signals: leave, timesheet, attendance, shift, roster, payroll, payslip, onboarding, probation, review cycle, org chart.

Neighbors: `scheduling-booking` when the calendar books customers or rooms; here it assigns employees to work. `finance-billing` when money flows to vendors or customers; payroll stays here because it is driven by people records. `admin-backoffice` when employees are just a user table inside another product.

## Shell and topology

Default: role-aware left sidebar + top bar (people search, notifications, account) + content. The sidebar changes with role: employees see Me (profile, time off, pay, documents), Directory, Calendar; managers add My team and Approvals with a count; admins add People, Time, Payroll, Onboarding, Reviews, Settings, Reports.

Alternatives:
- Most users are hourly or frontline (shops, restaurants, warehouses): mobile-first employee app with bottom tabs (Schedule, Clock, Time off, Pay) and a separate desktop admin.
- Multi-entity or multi-country employer: legal-entity switcher in the top bar for admins; policies, holidays, currency, and payroll scoped per entity.

Shell and permissions: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md), [cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md).

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Home (per role) | Next thing to do | Employee: balances, upcoming shifts/leave, open tasks. Manager: approvals waiting, who is out this week. Admin: payroll deadline, onboarding in flight | Nothing pending; payroll deadline passed |
| Directory | Find a person | Search (name, team, phone), filters, list with photo, title, team, out-today status | Former employee hidden by default; field hidden by privacy setting |
| Profile | One person's record | Header (name, title, team, manager, contact), tabs: Personal, Job, Time off, Pay, Documents, History | Viewer sees only permitted tabs; pending change awaiting approval; terminated |
| Org chart | Reporting lines | Tree from a chosen root, expand/collapse, search-to-focus, link to profile | Vacant position; dotted-line manager; very wide spans |
| Time off request | Ask for leave | Type, dates, half-day options, working days counted, balance before/after, note, approver shown | Insufficient balance; overlaps holiday; team member already out |
| Approvals inbox | Approve fast | Grouped by type, each with requester, dates, balance impact, team coverage, approve/deny with note | Delegated approver; request changed after approval; bulk approve |
| Timesheet | Record and approve hours | Week grid (days × projects or clock entries), totals, overtime flags, submit; manager approve/return | Missing punch; over threshold; locked after payroll |
| Roster | Assign shifts | Week grid by person or role, open-shift row, coverage per slot, draft vs published, publish | Conflict with leave; unpublished changes; understaffed slot |
| Payroll run | Pay people correctly | Stepper: period and scope → inputs (hours, bonuses, deductions) → review totals and variance → approve → submit → payslips | Missing inputs; variance vs last run; past cutoff; partial rerun |
| Onboarding | Get a hire ready | Per-hire task list grouped by owner (HR, IT, manager, hire), due dates relative to start date, status | Blocked task; start date moved; hire withdrew |
| Review cycle | Run performance reviews | Setup, participants, phase (self, peer, manager, calibration), progress per team | Late reviews; reviewer left company |

Tables: [cross/data-tables-collections.md](../cross/data-tables-collections.md). Forms and wizards: [cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md).

## Signature patterns

**Role-scoped visibility.** Salary, national ID, bank details, health reasons for leave, and review content are field-level permissions. The same profile renders differently for self, manager, HR, and peer. Hidden fields are absent, not blurred. Admin views of sensitive fields are audited.

**Balance-aware leave requests.** The form computes working days after weekends and public holidays and shows balance now, after this request, and projected at the request date if accruals apply. Only approved requests deduct from balance; pending requests show as pending on calendars. Each type carries rules (documents required, half days, negative balance). Leave, attendance, and payroll must agree: a change in one shows its effect in the others.

**Approval chains with coverage.** Approvers see who else on the team is out on those dates before deciding. Chains support multiple steps, auto-approve rules per leave type, a substitute who accepts first, and delegation while the approver is away. Decisions record who, when, and note.

**Roster: draft, publish, change.** Shifts are drafts until published (Odoo marks unpublished shifts with a distinct pattern, not only color). Open shifts can be claimed first-come or with approval; swaps require qualification checks and manager approval. After publishing, changes are highlighted until re-published. Conflicts with approved leave, rest-period rules, or maximum hours are flagged on the shift itself.

**Payroll run as a guarded pipeline.** Steps are fixed and visible; each validates inputs and shows variance against the previous run (hires, leavers, pay changes, unusual overtime). The review step shows totals the admin must reconcile (gross, deductions, employer costs, net, bank withdrawal) with drill-down per employee. Submission states the cutoff time and funding requirement and is typed-confirmation level. After submission, the run is read-only; corrections are an off-cycle run, not an edit.

**Onboarding as a task list.** Use the GOV.UK task-list shape: grouped tasks with a status per task (Not started, In progress, Completed, Cannot start yet, There is a problem), each assigned to an owner and dated relative to start day. The hire sees only their tasks.

**Effective-dated changes.** Job, pay, manager, and team changes carry an effective date and optional approval. Profiles show current values, a History tab, and future changes as "Changes on 01/10/2026".

## Density, data, and type calibration

- Employee screens comfortable and mobile-sized; admin tables compact (40px rows, convention).
- Hours: choose decimal (7.5 h) or hh:mm (7:30) per company and never mix. Days vs hours for leave follows policy and is labeled on every balance.
- Money: tabular figures, right-aligned, currency once per column header.
- Dates absolute on requests, payslips, and payroll; relative only in activity ("approved 2h ago").
- Status words: Draft, Pending, Approved, Denied, Cancelled, Withdrawn for requests; Draft, Published for shifts; Draft, In review, Approved, Submitted, Paid for payroll.
- Color: leave types may use a small categorical set on calendars, always with a text label or pattern; semantic red is reserved for errors and conflicts.

## Localization notes

- Vietnamese names are family-middle-given (Nguyễn Văn An). Store full name as entered plus the name people use; greet and build avatar initials from the given name; sort with Vietnamese collation. Avoid "first/last name" labels (W3C).
- Search works without diacritics (staff type unaccented on mobile).
- VND: `12.500.000 ₫`, no decimals; payslips list social, health, and unemployment insurance and personal income tax as separate lines. Confirm the current rates and rules with the client; do not hardcode.
- Tết spans several days and moves yearly: holiday calendars are editable per year.
- Frontline staff live on phone and Zalo: support phone login and phone in the directory.
- Labels grow ~20–35% in Vietnamese; approval buttons and headers must fit them.

## Study pointers

- Odoo Time Off and Planning (public docs): accrual rules and draft/published shift states are first-class data, not styling.
- Frappe HR Payroll Entry: payroll is a batch document with explicit steps, not a single button.
- GOV.UK task list pattern: honest per-task status beats a percentage bar for multi-session setup.
- W3C personal names guidance: model names for the people you actually employ.
- BambooHR time-off help: pending and approved amounts are shown separately against balance.

## Archetype anti-patterns

- **One view for all roles** — employees see admin clutter, managers lack approvals — P1.
- **Sensitive fields blurred instead of absent** — data still ships to the client — P1.
- **Leave form without balance impact** — people guess and get denied — P1.
- **Approving without coverage context** — the whole team ends up out together — P2.
- **Editable submitted payroll** — silent changes to paid amounts break reconciliation — P1.
- **Color-only leave or shift types** — fails color-blind users — P2.
- **Progress bar as onboarding** — hides which task is blocked and who owns it — P2.
- **Hardcoded tax or insurance rates** — wrong the day rules change — P1.

## Coverage additions

- [ ] Each screen verified as employee, manager, HR admin, and peer; hidden fields absent from payload.
- [ ] Leave: holiday overlap, half day, insufficient balance, cancel after approval, balance refresh.
- [ ] Approvals: delegation, substitute acceptance, multi-step chain, bulk approve.
- [ ] Timesheet: missing punch, overtime flag, return for correction, lock after payroll.
- [ ] Roster: draft vs published, conflict with leave, open shift claim, swap approval.
- [ ] Payroll: variance review, missing inputs, cutoff passed, off-cycle correction, read-only after submit.
- [ ] Profile: effective-dated future change, terminated employee, former manager links.
- [ ] Vietnamese name display, sorting, unaccented search, VND payslip formatting.

## Sources

- https://www.odoo.com/documentation/18.0/applications/hr/time_off.html (accessed 2026-09-28)
- https://www.odoo.com/documentation/18.0/applications/services/planning.html (accessed 2026-09-28)
- https://docs.frappe.io/hr/payroll-entry (accessed 2026-09-28)
- https://design-system.service.gov.uk/patterns/complete-multiple-tasks/ (accessed 2026-09-28)
- https://www.w3.org/International/questions/qa-personal-names (accessed 2026-09-28)
- Seen only as search summaries (fetch blocked 403/401): Gusto payroll, BambooHR time off, Personio approvals, Deputy shifts. Treated as practitioner knowledge.
- Practitioner knowledge: role-scoped views, effective dating, Vietnamese payroll lines, density values.
