# Run log: cross-run memory against self-repetition

Copyright (c) 2026 tdat-dev. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

AI design repeats itself across sessions because each session starts blind. The run log gives the skill memory: a small JSON file recording what was shipped before, read before diverging and written after delivering. It powers the diversification rule in [structure-catalog.md](structure-catalog.md).

## Location and shape

Store at `.premium-web/log.json` in the **user's home directory** (global, so variety is enforced across projects). If home is not writable in the current harness, fall back to the project root and say so in the readiness package.

```json
{
  "version": 1,
  "runs": [
    {
      "date": "2026-07-18",
      "project": "gcare-landing",
      "surface_route": "LANDING_BRAND",
      "macrostructure": "Split Manifesto",
      "palette_family": "committed-indigo",
      "display_family": "grotesque",
      "accent_hue_band": "violet-blue"
    }
  ]
}
```

Field vocabulary (keep values comparable across runs):

- `macrostructure`: a name from the structure catalog, or `custom:<short-label>`.
- `palette_family`: `<strategy>-<dominant-hue>` using the craft-rules color strategies, e.g. `restrained-neutral`, `committed-oxblood`, `drenched-cobalt`.
- `display_family`: one of `serif-old-style`, `serif-didone`, `slab`, `grotesque`, `geometric-sans`, `humanist-sans`, `mono`, `display-decorative`.
- `accent_hue_band`: coarse hue bucket, e.g. `red-orange`, `yellow-amber`, `green`, `teal-cyan`, `violet-blue`, `magenta-pink`, `achromatic`.

Keep the newest 20 runs; drop older entries when appending.

## Protocol

**Read — during step 3 (diverge).** Before locking any direction on a `LANDING_BRAND` or `HYBRID` build/redesign with visual freedom, read the log and apply the diversification rule. A missing file means no constraint (first run); create it at write time. Never fabricate log history.

**Write — during delivery.** After the readiness package is produced for a build/redesign that locked a direction, append one entry. Audits, polish passes, and `LOCAL_CHANGE` work do not write entries.

**Cross-AI fallback.** In a harness without file access, ask the user what the last shipped directions were, apply the rule against their answer, and note the manual step in the readiness package. Do not silently skip diversification.

The log records *choices*, not client-confidential content. If the user objects to a global file, keep a per-project log and note the reduced scope.
