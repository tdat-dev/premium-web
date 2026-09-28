# Archetype: Analytics and monitoring

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: answer "how are we doing", "what changed", "why", and "is something broken now", then decide or react. Two modes (NN/g): **analytical** (periodic, long exploration) and **operational** (continuous refresh, urgent, short sessions).

Actors: executive viewer (weekly, fixed dashboards); analyst or PM (daily, long query sessions); on-call operator (alert-driven, often on a phone at night); report recipient (emailed snapshot); admin (sources, definitions, access).

Signals: KPIs, funnels, cohorts, reports, alerts, uptime, SLOs, incidents, status pages; the numbers are the product, not a home widget.

Neighbors:
- **Admin / back-office**: the output is an edited record, not a decision drawn from aggregates.
- **Devtools / cloud console**: the product also deploys and configures what it observes; load this file as a secondary for alerts and incidents.
- **Finance / billing**: the numbers are ledger money that must reconcile to the unit.

## Shell and topology

Default: left sidebar (Home, Dashboards, Explore, Reports, Alerts, Incidents, Settings) + top bar (workspace switcher, search over dashboards and metrics, create, notifications, account) + canvas. Time range and filters live in the **dashboard header**; their scope is the dashboard. Shell rules: [../cross/app-shell-navigation.md](../cross/app-shell-navigation.md).

Alternatives:
- **More than ~30 dashboards** (convention): Dashboards becomes a browser with folders, tags, owner, starred; Home shows starred + recently viewed.
- **Wall display / NOC**: kiosk mode, no chrome, auto-refresh, larger marks; theme from the room's light (craft-rules scene sentence).
- **Embedded analytics**: no shell; inherit the host's tenant and filters; expose view, drill, export only.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| Home | Resume and triage | Firing alerts, starred dashboards, recent views, freshness notice | No source connected |
| Dashboard view | Answer one question | Title + question, time range + comparison, filters, stat row, trends, breakdowns, detail table | Partial period, stale source, one tile failed, no data for range |
| Dashboard edit | Compose tiles | Query picker, drag/resize grid, tile settings, save/discard | Unsaved layout, concurrent edit |
| Explore | Ad-hoc question | Measure, aggregation, filters, breakdown, compare, chart + table, save | Running with Cancel, too many series, sampled, timeout |
| Metric catalog | Shared definitions | Name, formula, unit, owner, source, good direction | Deprecated but still used |
| Alert rules | Decide when to page | Query, condition, interval, pending duration, severity, routing, runbook, history preview | Would have fired N times last week |
| Alert / incident detail | Respond | Status, owner + acknowledge, timeline, chart at trigger, runbook | Flapping, no data, evaluation error, silenced |
| Status page (public) | Tell customers | Overall status, components, incident updates, uptime history, subscribe | Scheduled maintenance |
| Schedules and shares | Deliver reports | Recipients, channel, cadence + timezone, format, condition, last result | Delivery failed, recipient lacks access |

## Signature patterns

**1. Overview to drill-down.** One dashboard answers one question (Grafana), stated in its description. Order: compact stat row (value, unit, delta vs a named comparison, sparkline, freshness) → trends → breakdowns → detail table. Every tile drills to Explore with the same range, filters, and grouping. Use variables (environment, region) instead of copies. Never mix static and user-configurable layouts on one dashboard (Cloudscape). This is not the banned hero-metric template: scan-sized values, delta and window adjacent.

**2. Time range and comparison.** Anatomy (EUI super date picker): quick ranges, recently used, relative and absolute tabs, timezone label, Apply, refresh interval, shift back/forward, zoom out. Quick picks apply at once; typed edits wait for Apply so half-typed ranges never query. Drag-select on a time chart zooms the dashboard. Comparison: previous period or same period last year, named beside every delta ("vs previous 7 days"). The incomplete current bucket is drawn as partial (dashed or hatched), never as a drop. Range, comparison, and filters live in the URL.

**3. Filter scope.** Dashboard filters show which tiles they affect; a tile with a local override shows it in its header. Applied filters are removable chips with one reset; drill-through carries them. Mechanics: [../cross/filters-search-command.md](../cross/filters-search-command.md).

**4. Chart per question.** Prefer position and length over area and angle (NN/g); avoid gauges, donuts, 3D.

| Question | Form |
| --- | --- |
| How did it change? | Line |
| Which category is biggest? | Sorted horizontal bar |
| Share of a whole (≤5 parts)? | Stacked or 100% bar |
| How is it distributed? | Histogram or box plot |
| How fast are we? | p50/p95/p99 lines, never the mean alone |
| Where do users drop? | Funnel bars with step conversion |
| Do they come back? | Cohort table with sequential shading |
| Current value vs threshold? | Stat with threshold band |

Encoding, legends, and accessibility follow the dataviz guidance and the chart section of [../../dashboard-product-contract.md](../../dashboard-product-contract.md). Normalize axes (percent, per-request rates) before comparing (Grafana).

**5. Explore grammar.** Measure → aggregation → filters → group by → compare → visualization. High-cardinality breakdowns show top N + "Other", with N stated. The result header shows duration, sampling, and row limits; long queries offer Cancel. Saving keeps the definition, not a picture.

**6. Annotations.** Deploys, incidents, campaigns, and pipeline gaps appear as markers or shaded regions on every time chart in range; manual (click a point, add a note) or from a feed, filterable by tag (Grafana). Details open on hover and focus; the same events are listed below the chart.

**7. Alerts and incidents.** States: Normal, Pending, Firing, Resolved, plus No data and Error as distinct states, never folded into Normal. Silences cover one-off windows, mute timings recurring ones, and neither stops evaluation (Grafana). Related firings group into one notification. Incident detail leads with owner and Acknowledge, then timeline, then the chart at trigger time.

**8. Sharing and scheduling.** Share offers "exact time range" or "keep relative" and checks recipient access first. Exports (CSV rows, PNG/PDF view) are stamped with range, timezone, filters, generation time. Schedules show cadence in the recipient's timezone, an optional condition, and last delivery result.

## Density, data, and type calibration

- 12-column grid, whole-column tiles, 3–6 values per stat row (convention). Tabular figures; right-aligned numeric columns.
- Abbreviate in tiles (1.2M); exact value on hover, focus, and in the table.
- Label percent change and percentage-point change distinctly. Delta color follows the metric's good direction: errors, latency, cost, churn rising is bad; never hardcode green for up.
- Axes and alert times absolute with timezone; "Updated 2 min ago" relative with absolute in `<time datetime>` and tooltip (Cloudscape). Operational views show seconds.
- Status vocabulary: Normal/Pending/Firing/Resolved/No data/Error; public status: Operational, Degraded performance, Partial outage, Major outage, Under maintenance (convention).
- Color budget: one categorical palette, one sequential ramp, status colors reserved for status and never used as series colors.

## Localization notes

- Vietnamese: `1.234.567` grouping, decimal comma (`12,5%`). Pick `N / Tr / Tỷ` or `K / M / B` per audience and use one set everywhere.
- dd/mm/yyyy; weeks start Monday; ICT is UTC+7 with no DST. Weekly buckets follow the locale week.
- Vietnamese legend and axis labels run ~20–35% longer: wrap legends or move them below the chart before truncating.
- Generic: DST days have 23 or 25 hours; hourly charts must not show a fake spike or gap.

## Study pointers

- **Grafana**: one dashboard, one question; variables prevent sprawl.
- **AWS Cloudscape service dashboard**: static or configurable per dashboard, never both.
- **Elastic EUI super date picker**: quick picks apply immediately, typed ranges wait for Apply.
- **NN/g**: separate operational from analytical needs; favor position and length.
- **Public status pages (Statuspage class)**: component-level status with a timestamped update trail.

## Archetype anti-patterns

- **Hero-number wall**: oversized KPIs with no comparison or freshness. P1.
- **Delta without a window**: "+12%" vs nothing. P1.
- **Gauges and donuts for comparison**: angle and area hide the difference. P2.
- **Mean latency only**: hides the tail. P1 on operational surfaces.
- **Auto-refresh that reflows**: loses scroll, tooltip, focus. P1.
- **Range not in the URL**: shared links mislead. P1.
- **Green means up**: color tied to direction, not to good or bad. P1.
- **Partial period drawn as a drop**: today reads as a crash. P1.
- **No data rendered as zero**: a dead pipeline looks like a quiet day. P1.

## Coverage additions

- [ ] Each dashboard states its question; tiles drill with range and filters preserved.
- [ ] Time range: quick pick, typed absolute and relative, timezone, Apply, refresh, URL round-trip.
- [ ] Comparison window beside every delta; partial bucket marked.
- [ ] Filter scope visible per tile; reset restores defaults.
- [ ] No data, stale, partial tile failure, sampled, timeout, too-many-series states rendered.
- [ ] Annotations reachable by hover, focus, and list.
- [ ] Alert states incl. No data and Error rendered; silence and acknowledge flows complete.
- [ ] Auto-refresh preserves scroll, focus, open tooltip, selection.
- [ ] Share (exact vs relative), export stamps, scheduled delivery success and failure.
- [ ] Vietnamese number, week-start, and long-legend cases tested.

## Sources

- https://cloudscape.design/patterns/general/service-dashboard/ (accessed 2026-09-28)
- https://cloudscape.design/patterns/general/timestamps/ (accessed 2026-09-28)
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/ (accessed 2026-09-28)
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/annotate-visualizations/ (accessed 2026-09-28)
- https://grafana.com/docs/grafana/latest/alerting/fundamentals/ (accessed 2026-09-28)
- https://eui.elastic.co/docs/components/forms/date-and-time/super-date-picker/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/dashboards-preattentive/ (accessed 2026-09-28)
- Practitioner knowledge: chart-per-question table, percentile latency, status-page vocabulary, Vietnamese number and week conventions.
