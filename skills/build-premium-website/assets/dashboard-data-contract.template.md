# Dashboard data contract

## Data identity

- Surface/component:
- User decision or task supported:
- Data source and locator:
- Owner:
- Freshness and update behavior:
- Timezone:
- Units and formatting:
- Aggregation/comparison period:
- Missing data meaning:
- Uncertainty or threshold meaning:
- Permissions/privacy constraints:

## Representation

- Representation: `TABLE | CHART | KPI | COLLECTION | DATA_CONTROL`
- Default sort/domain/baseline:
- Color and status semantics:
- Accessible summary or equivalent table:
- Full-value access when truncated:
- Export/share behavior:

## Interaction contract

| Interaction | Default/current state | Keyboard/touch behavior | Announcement/focus | Persistence | Evidence/defect |
| --- | --- | --- | --- | --- | --- |
| Sort |  |  |  |  |  |
| Search/filter/reset |  |  |  |  |  |
| Pagination/load more |  |  |  |  |  |
| Selection/bulk action |  |  |  |  |  |
| Tooltip/detail disclosure |  |  |  |  |  |
| Retry/refresh |  |  |  |  |  |

## Data states

Use `REQUIRED`, `NOT_APPLICABLE`, or `COVERED`.

| State | Applicability | Representation and action | Accessible communication | Evidence/defect |
| --- | --- | --- | --- | --- |
| Loading |  |  |  |  |
| Empty dataset |  |  |  |  |
| All zero |  |  |  |  |
| Zero filtered results |  |  |  |  |
| Partial |  |  |  |  |
| Stale |  |  |  |  |
| Error/retry |  |  |  |  |
| Offline |  |  |  |  |
| Permission denied |  |  |  |  |
| Extreme/negative values |  |  |  |  |
| Dense/long labels |  |  |  |  |

## Responsive and theme behavior

| Condition | Essential relationship/data | Transformation | Contrast/distinction result | Evidence/defect |
| --- | --- | --- | --- | --- |
| Narrow |  |  |  |  |
| Zoom/reflow |  |  |  |  |
| Supported themes |  |  |  |  |
