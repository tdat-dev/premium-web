# Structure catalog: named macrostructures and the diversification rule

Copyright (c) 2026 tdat-dev. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

A macrostructure is the page's skeleton — the hero form, section rhythm, and density profile — chosen **before** color or type. Load this file for every `LANDING_BRAND` or `HYBRID` build/redesign with visual freedom. Pick one named macrostructure (or record a deliberate custom hybrid of two), write it into the decision record, and obey the diversification rule below via [run-log.md](run-log.md).

Choosing no macrostructure means defaulting to "centered hero, three feature cards, zig-zag rail, CTA band" — the single most saturated AI page shape. That default is ban-level: it may only ship if the decision record shows it was chosen against named alternatives for cause.

## Catalog

| # | Name | Skeleton | Reach for it when |
|---|------|----------|-------------------|
| 1 | Marquee Hero | Full-viewport statement hero (type, image, or motion), compact proof sections after | One dominant message or visual carries the brand |
| 2 | Split Manifesto | Persistent split: fixed thesis/nav column + scrolling evidence column | Opinionated brands, studios, manifesto-led products |
| 3 | Editorial Scroll | Single readable column, long-form, inline media, generous margins | Story-first launches, essays, case studies |
| 4 | Bento Board | One dense composed grid of unequal tiles as the primary surface | Many heterogeneous proof points, feature breadth |
| 5 | Product Stage | The live product UI (real screens/demo) is the hero and recurring anchor | The product's own interface is the best proof |
| 6 | Narrative Scroll | Scroll-driven scenes; each viewport advances one beat of a story | Guided storytelling, launches with real motion budget |
| 7 | Poster Wall | Oversized display type as image; sections read as consecutive posters | Type-led identities, campaigns, events |
| 8 | Ledger Index | Dense list/table-first: rows, columns, hairline structure, high info density | Catalogs, archives, portfolios with many items |
| 9 | Specimen Sheet | Type-specimen aesthetics: scale contrast, metrics visible, grid exposed | Explicitly editorial/typographic briefs only — currently saturated, never a default |
| 10 | Gallery First | Imagery leads; text is caption-scale; masonry or filmstrip flow | Photography, fashion, food, architecture, art |
| 11 | Dialogue Page | Question-and-answer or conversational blocks structure the whole page | Docs-adjacent products, consulting, FAQ-shaped decisions |
| 12 | Data Canvas | Real charts/live numbers are the hero and the argument | Analytics, finance, infrastructure with real data to show |
| 13 | Immersive Canvas | 3D/WebGL or generative scene as spatial anchor, UI floats above | Only when the concept intrinsically earns 3D (see motion-3d-decision.md) |
| 14 | Zen Column | One narrow centered column, extreme restraint, few sections | Single-purpose pages: waitlists, invites, announcements |
| 15 | Magazine Grid | Multi-column mixed-density front page; features, briefs, and asides coexist | Content-heavy brands, media, multi-story homepages |
| 16 | Ticker Frame | Persistent kinetic edge elements (marquee, status bar) frame calm content | Live-feeling brands: markets, communities, events |

Names are internal vocabulary for decision records and logs — never render them in shipped copy.

## Diversification rule

Structural variety is enforced across runs, not within one page:

1. Before locking a direction, read `.premium-web/log.json` per [run-log.md](run-log.md).
2. The chosen macrostructure must differ from the last **3** logged runs (any project). If the brief genuinely demands a repeat, record the collision and justification in the decision record — silent repeats are a defect.
3. Additionally differ from the **most recent** run on at least one of: palette family, display-type family, accent-hue band.
4. Two structures differing only in color and font are the same structure. "Different" means a different hero form, section rhythm, or density profile.

## Component-scope bypass

When `work_mode` scope is a single component or section (`LOCAL_CHANGE` modifier), skip the catalog and diversification — the page skeleton is not in play. Apply [craft-rules.md](craft-rules.md) and the route contract's relevant gates only.
