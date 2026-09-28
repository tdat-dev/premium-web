# Archetype: Scheduling and booking

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: publish when a person or resource can be booked; let someone pick a slot and confirm; see the day; move, cancel, fill gaps; cut no-shows. Actors:

- **Booker** (customer, patient, colleague): one short visit, usually on a phone from a Zalo or email link.
- **Provider** (stylist, doctor, tutor, salesperson): checks today's list between appointments, edits availability weekly.
- **Front desk**: all day on a resource timeline; walk-ins, check-in, phone reschedules.
- **Owner**: services, prices, staff, rules, reports.

Signals: appointment, booking, slot, availability, reservation, class, room, check-in, no-show, waitlist, reminder.

Neighbors: `people-hr-ops` when the calendar assigns employees to shifts (rosters) rather than customers to providers. `work-management` when the timeline shows tasks and dependencies, not time-bound appointments. `commerce-merchant-ops` when the product is sold and time is incidental.

## Shell and topology

Two surfaces with separate shells:

- **Booking page (public)**: no app chrome. Provider identity, then service → date → time → details → confirm, on one page or a short stepper. Deep-linkable per service and per provider.
- **Provider console**: left sidebar (Calendar, Bookings, Availability, Services, Staff/Resources, Customers, Settings) + top bar (date navigation, view switch, location switcher, New booking) + calendar as the main surface.

Alternatives:
- Front desk with more than ~3 resources: resource timeline (rows = staff/rooms, columns = time) as the default view, with day view per resource as secondary.
- Solo provider, mostly mobile: agenda list as default, calendar grid as secondary; bottom tabs Today, Calendar, Bookings, Settings.

See [cross/app-shell-navigation.md](../cross/app-shell-navigation.md).

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Calendar (day/week) | See and change the schedule | Date nav (today, prev/next, picker), view switch, resource filter, time gutter with now line, events sized by duration, non-bookable hours shaded | Overlapping events; all-day items; DST day; empty day |
| Month view | Orientation | Grid, first items + "N more", today marker | Overflowing days |
| Resource timeline | Dispatch across staff/rooms | Resource rows with name and capacity, time columns, drag to create/move/resize, unassigned lane | Resource off today; double-booking attempt; capacity reached |
| Agenda / today list | Work the day | Time-ordered list: time, customer, service, status, check-in action | Late arrival; no-show; gap to fill |
| Availability editor | Define when bookable | Weekly hours per day (multiple ranges), time zone, date overrides list, rules: buffers, minimum notice, booking window, daily limits, slot increment | Overlapping ranges; override on a holiday; no hours at all |
| Service / event type | Define what is bookable | Name, duration, price, location type, assigned staff/resources, questions, rules, visibility | Hidden but linkable; no assigned provider |
| Public booking page | Book a slot | Provider + service summary, date picker with available days, time slots in booker's zone, form, confirm | No availability in range; slot taken during checkout; outside booking window |
| Confirmation / manage | Know it's done, change it | What, when (with zone), where, add to calendar, reschedule, cancel, policy | Cancelled; within cancellation cutoff; rescheduled |
| Booking detail (provider) | Handle one booking | Status, time, customer, service, notes, history, actions (check in, move, cancel, mark no-show) | Recurring series member; payment pending |
| Waitlist | Fill cancellations | Queue per slot/class with order, offer action, expiry of offers | Offer expired; spot filled by someone else |

Tables for bookings and customers: [cross/data-tables-collections.md](../cross/data-tables-collections.md). Detail drawers: [cross/detail-views-overlays.md](../cross/detail-views-overlays.md).

## Signature patterns

**Calendar grid mechanics.** Choose the view by task: month for orientation, week for planning, day or resource timeline for execution, agenda for "what's next" (convention). Events are positioned and sized by real start and duration; overlapping events split the column width side by side, never stack on top. Show a now line and shade non-bookable time. Clicking empty time creates a draft at that slot; dragging moves or resizes with snap to the slot increment and a live time label. Every drag has a keyboard and form equivalent. Short events keep start time and title visible. Date pickers follow the WAI-ARIA APG date picker dialog (gridcells, roving tabindex, arrows, Page Up/Down by month); allow typing for distant dates (NN/g). Slots are buttons with full names ("09:30, Thứ Tư 02/10, 45 phút").

**Availability as layered rules.** Available slots = weekly hours, minus date overrides (a whole day off or custom hours on a date), minus existing bookings and connected-calendar busy time, minus buffers before/after, filtered by minimum notice, booking window, and daily/weekly limits, stepped by the start-time increment. The editor previews the result: "Next available: Thứ Tư 02/10, 09:00". When zero slots result, say which rule removed them.

**Time zones, explicitly.** Store UTC plus the event's zone. The booking page detects the booker's zone and shows it next to the slots with a way to change it. In-person appointments lock to the location's zone. Confirmations, reminders, and the provider view show the zone when it differs from the viewer's. Test DST transitions and all-day events (dates, not instants).

**Booking flow integrity.** Only offer slots that are truly free; re-check at submit. If a slot was taken meanwhile, keep the form data and show the nearest alternatives. Hold a slot briefly while payment runs (convention: a few minutes, shown as a countdown). The confirmation repeats what, when with zone, where, how to change, and the cancellation policy, and offers an .ics/add-to-calendar link.

**Recurring events.** Recurrence rule with end (never, on date, after N). Editing or cancelling one occurrence asks: this event, this and following, or all. Conflicts are checked for every generated occurrence and listed before saving.

**Conflicts and double booking.** Detect on create, move, and resource assignment. Show the conflict inline (which booking, which resource) and offer allowed resolutions; overbooking beyond capacity requires an explicit override with a reason, logged.

**Reminders, no-shows, check-in.** Configurable reminders (for example 24h and 2h before, convention) by SMS, email, or Zalo, each with a manage link. Front desk checks people in from the agenda; late and no-show statuses are one tap and feed reports. Cancellation frees the slot and offers it to the waitlist in order, with an expiring offer.

## Density, data, and type calibration

- Week view hour rows about 48px, 15-minute snap for most services (convention); resource timeline rows 40–56px depending on event labels.
- 24h time in Vietnam, 12h only where local; one format per locale. Durations as "45 phút" / "1 h 30", not decimals.
- Absolute times everywhere in scheduling; relative only for "in 20 min" on today's agenda.
- Status words: Pending, Confirmed, Checked in, Completed, No-show, Cancelled, Rescheduled. Keep cancelled-by-customer and by-provider distinct.
- Event color encodes one dimension only (service, staff, or status), declared in a legend; status also shown as text or icon. Tentative or unpublished uses a pattern, not just a lighter tint.

## Localization notes

- Week starts Monday in Vietnam; weekday labels "Th 2 … CN" are short; full "Thứ Hai" in headings. Dates `dd/mm/yyyy` or "Thứ Tư, 02/10".
- Tết and lunar dates move closures and demand yearly: support date overrides for them; lunar dates optional.
- Booker identity is phone-first; confirmation and reminders often go over Zalo or SMS. Collect phone before email.
- Prices in VND without decimals (`350.000 ₫`); support an optional deposit.
- For international bookers spell month names to avoid 02/10 vs 10/02 (NN/g).

## Study pointers

- Cal.com: date overrides are a layer on top of a weekly schedule, not a second schedule.
- Calendly: every availability rule is a separate, named control the provider can reason about.
- Google Calendar: time zone is visible, per event, and changeable, not implicit.
- Odoo Calendar: one calendar model serves meetings and shared availability.
- NN/g date input: picker for near dates, typing for distant ones.

## Archetype anti-patterns

- **Showing slots that are not bookable**: the booker fails at submit and leaves. P1.
- **Implicit time zone**: remote bookers show up an hour off. P1.
- **Stacked overlapping events**: hidden bookings get double-booked. P1.
- **Drag-only rescheduling**: no keyboard or touch path. P1.
- **Month view as the provider default**: cannot see durations or gaps. P2.
- **Series edit without scope choice**: one change silently rewrites every occurrence. P1.
- **Confirmation without change/cancel link**: bookers phone the front desk or no-show. P2.
- **Availability editor without preview**: providers cannot tell why nothing is bookable. P2.

## Coverage additions

- [ ] Slot calculation verified against weekly hours, overrides, buffers, notice, window, limits, increment.
- [ ] Time zone: booker abroad, in-person locked zone, DST transition day, all-day event.
- [ ] Race: slot taken between view and submit; payment hold expiry.
- [ ] Recurring: edit/cancel this, following, all; conflict per occurrence.
- [ ] Overlap layout at 2, 3, and 6 concurrent events; very short events.
- [ ] Drag create/move/resize has keyboard and form equivalents; date picker APG keyboard.
- [ ] Reminder, reschedule, cancel within cutoff, no-show, check-in, waitlist offer expiry.
- [ ] Phone-first booker flow on a narrow screen from a Zalo link.

## Sources

- https://calendly.com/help/how-to-fine-tune-your-availability-settings (accessed 2026-09-28)
- https://cal.com/docs/core-features/availability/date-overrides (accessed 2026-09-28)
- https://support.google.com/calendar/answer/37064?hl=en (accessed 2026-09-28)
- https://www.odoo.com/documentation/18.0/applications/productivity/calendar.html (accessed 2026-09-28)
- https://www.nngroup.com/articles/date-input/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ (accessed 2026-09-28)
- Practitioner knowledge: view-by-task heuristic, overlap layout, slot hold, reminder timings, lunar-calendar and Zalo notes, density values.
