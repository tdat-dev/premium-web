# Source library: where to look, for which question

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

The skill is self-contained: the rules distilled from these sources already live in [human-factors.md](human-factors.md), [accessibility-inclusive.md](accessibility-inclusive.md), [ux-research-validation.md](ux-research-validation.md), [copy-voice.md](copy-voice.md), [craft-rules.md](craft-rules.md), and the pattern library. This file is the map back to the originals, for three jobs: **verifying** a rule or number before it goes into a client deliverable, **going deeper** on a problem the distilled rules do not cover, and **researching references** in step 2 of the workflow.

Rules for using it:

- **Authority comes from the source, not from memory.** When a deliverable cites a number or guideline, open the page, record the URL and access date in the fact map, and quote the figure the page gives today. Figures shift between editions (Baymard's checkout averages differ between its 2024 and 2025 pages).
- **Research sites tell you why; galleries show you what.** Rules and severity come from the research tier. Galleries supply flows and visual ideas, never proof that something works, and fall under the originality boundary in [anti-slop-enforcement.md](anti-slop-enforcement.md).
- **When browsing is unavailable,** use the distilled files and mark the citation as `not re-verified this session`.

## Tier 1: the foundation (start here)

| Source | Authoritative for |
| --- | --- |
| Nielsen Norman Group, https://www.nngroup.com/articles/ | Behavior research: scanning, navigation, forms, search, mobile, heuristics, research methods, AI UX. The first stop for "how do people actually use X?" |
| Laws of UX, https://lawsofux.com/ | Named psychology principles (Fitts, Hick, Jakob, Gestalt, Doherty, peak-end) with short explanations |
| W3C WAI and WCAG 2.2, https://www.w3.org/WAI/ and https://www.w3.org/TR/WCAG22/ | Accessibility requirements, the Understanding documents, tutorials, ARIA Authoring Practices |
| Baymard Institute, https://baymard.com/blog | E-commerce: product pages, search, filters, cart, checkout, forms, with large benchmark data |
| GOV.UK Design System and Service Manual, https://design-system.service.gov.uk/ and https://www.gov.uk/service-manual | Forms, question pages, error messages, plain-English writing, user research practice |
| Material Design 3, https://m3.material.io/ | Adaptive layout, navigation patterns, motion, Android conventions |

## Tier 2: by question

### How people perceive, decide, and behave
- Interaction Design Foundation, https://www.interaction-design.org/ : HCI foundations and long-form courses.
- The Decision Lab, https://thedecisionlab.com/biases : cognitive biases with research context (check replication notes; several famous effects are contested).
- MeasuringU, https://measuringu.com/ : UX measurement, SUS, SEQ, benchmarks, sample sizes.
- UX Myths, https://uxmyths.com/ : misconceptions to reject.
- UXmatters https://uxmatters.com/ , UX Movement https://uxmovement.com/ , UX Collective https://uxdesign.cc/ , UX Principles https://uxprinciples.design/ , UXPA https://www.uxpa.org/ : practitioner writing; useful ideas, lower evidential weight than Tier 1.
- Deceptive patterns catalog, https://www.deceptive.design/ : the patterns banned in human-factors section 6.
- Stanford Web Credibility guidelines, https://credibility.stanford.edu/guidelines/ : trust signals.

### User research
- GOV.UK user research, https://www.gov.uk/service-manual/user-research : planning, recruiting, sessions, analysis.
- NN/g research methods, https://www.nngroup.com/articles/which-ux-research-methods/ : choosing a method.
- IDEO Design Kit, https://www.designkit.org/ : human-centered design methods.
- Maze guides, https://maze.co/guides/ : prototype testing and interview guides.
- Tools: Optimal Workshop (card sorting, tree testing), Lyssna (preference and five-second tests), Dovetail (synthesis), User Interviews (recruiting), Lookback and UserTesting (sessions), Hotjar, Microsoft Clarity, and Fullstory (heatmaps, recordings, frustration signals).

### Accessibility and inclusion
- WebAIM, https://webaim.org/ : practical guidance, the WebAIM Million report, contrast checker https://webaim.org/resources/contrastchecker/ , WAVE https://wave.webaim.org/ .
- The A11Y Project, https://www.a11yproject.com/ : developer checklists.
- axe by Deque, https://www.deque.com/axe/ : automated testing engine.
- Microsoft Inclusive Design, https://inclusive.microsoft.design/ : persona spectrum and toolkit.
- Inclusive Design Toolkit (Cambridge), https://www.inclusivedesigntoolkit.com/ : capability and exclusion estimates.
- Stark, https://www.getstark.co/ : accessibility checks inside design tools.

### UX writing
- GOV.UK writing for user interfaces, https://www.gov.uk/service-manual/design/writing-for-user-interfaces , and its error message and button guidance.
- Microsoft Writing Style Guide, https://learn.microsoft.com/en-us/style-guide/welcome/ : product voice, top-10 tips.
- Atlassian content design, https://atlassian.design/foundations/content/voice-tone : voice, tone by situation.
- Plain language (now on digital.gov), https://digital.gov/guides/plain-language : principles.
- Content Design London, https://contentdesign.london/ : content design practice and readability guidance.
- NN/g writing for the web, https://www.nngroup.com/topic/writing-web/ .

### AI products
- Google People + AI Guidebook, https://pair.withgoogle.com/guidebook-v2/ : user needs, mental models, explainability and trust, feedback and control, errors.
- Microsoft HAX Toolkit and the 18 Guidelines for Human-AI Interaction, https://www.microsoft.com/en-us/haxtoolkit/ .
- IBM Carbon for AI, https://carbondesignsystem.com/guidelines/carbon-for-ai/ : AI labels, explainability popovers, revert-to-AI.
- NN/g AI articles, https://www.nngroup.com/topic/ai/ .

## Design systems: which one to read for which component

Read the system whose users resemble yours. Borrow behavior and reasoning, never the visual identity.

| Need | Strongest reference |
| --- | --- |
| Forms, question pages, error summary, check-answers, dates, names, addresses | GOV.UK Design System; USWDS https://designsystem.digital.gov/ |
| Data tables, enterprise forms, data visualization, AI labels | IBM Carbon https://carbondesignsystem.com/ |
| Messaging (banners, flags, inline messages), inline edit, drag and drop, voice and tone | Atlassian https://atlassian.design/ |
| Developer tools: saving, loading, empty states, progressive disclosure, degraded states | GitHub Primer https://primer.style/ |
| Accessible behavior for complex widgets (date pickers, comboboxes, drag and drop, i18n) | Adobe Spectrum and React Aria https://react-aria.adobe.com/ |
| Commerce admin, merchant surfaces, POS | Shopify Polaris https://polaris.shopify.com/ |
| Enterprise admin panels in React, dense forms and pickers | Ant Design https://ant.design/ |
| Cross-platform productivity apps, Windows conventions | Microsoft Fluent 2 https://fluent2.microsoft.design/ |
| iOS, macOS, visionOS conventions, touch targets, platform feedback | Apple Human Interface Guidelines https://developer.apple.com/design/human-interface-guidelines/ |
| Adaptive layouts across window sizes, Android conventions | Material Design 3 https://m3.material.io/ |
| Finding other systems | Design Systems Directory https://designsystem.cc/ ; https://github.com/saadeghi/design-systems |

## Component libraries for implementation

A library speeds up building and often brings accessible behavior; it never decides the UX.

| Library | Use when |
| --- | --- |
| shadcn/ui https://ui.shadcn.com/ | React projects that want owned, editable component source (built on Radix) |
| Radix UI https://www.radix-ui.com/ | Unstyled accessible React primitives |
| Headless UI https://headlessui.com/ | Unstyled accessible components for React or Vue with Tailwind |
| React Aria https://react-spectrum.adobe.com/react-aria/ | The most thorough accessible behavior and internationalization hooks |
| MUI https://mui.com/ , Chakra UI https://chakra-ui.com/ , Mantine https://mantine.dev/ | Full styled React kits when speed matters more than a distinct look (restyle before shipping a brand surface) |
| daisyUI https://daisyui.com/ , HyperUI https://www.hyperui.dev/ | Tailwind component classes and blocks for prototypes; rework before production brand work |
| Storybook https://storybook.js.org/ | Building, testing, and documenting components in isolation, including state coverage |

Libraries' default looks are exactly the template look the reflex registry flags. Restyle to the decision record's tokens.

## Galleries and flow libraries (reference research)

Checked 2026-10-24 and viewed by the owner. Start with the free curated set; the paid flow libraries are better for real product UI, which free sources cover thinly.

**Free and hand-curated**

| Library | Best for |
| --- | --- |
| Recent https://recent.design/websites (successor to Godly) | Current websites filtered by AI, SaaS, ecommerce, portfolio; also app store screenshots https://recent.design/app-store-screenshots |
| Siteinspire https://www.siteinspire.com/websites | Agency, studio, and brand sites, filterable by style and subject |
| Minimal Gallery https://minimal.gallery/ | Restrained editorial and portfolio sites, updated almost daily |
| SaaS Landing Page https://www.saaslandingpage.com/ | 800+ SaaS landing pages by category (B2B, AI, fintech, dev tools); undated, some old |
| SaaSUI https://www.saasui.design/ | Real SaaS product screens (sign-in, onboarding, dashboards) from about 150 products; the main free source for app UI |
| Component Gallery https://component.gallery/ | How 95 design systems build each component (buttons, tables, menus) |
| Navbar Gallery https://navbar.gallery/ , Footer Design https://www.footer.design/ | Navigation bars, mega menus, footers |
| Awwwards https://www.awwwards.com/websites/ | Jury-judged ambitious visual and motion work; see [awwwards-evidence-rubric.md](awwwards-evidence-rubric.md) |

**Mostly paid or limited free tiers**

| Library | Best for |
| --- | --- |
| Mobbin https://mobbin.com/ | Real app and web screens and full flows; the free plan has no search or flows, and agent access needs a paid plan |
| Page Flows https://pageflows.com/ , Refero https://refero.design/ | Recorded user flows and screens searchable by function |
| SaaSFrame https://saasframe.io/ , Nicely Done https://nicelydone.club/ | SaaS dashboards, settings, onboarding |
| Land-book https://www.land-book.com/ , Lapa Ninja https://www.lapa.ninja/ , One Page Love https://onepagelove.com/ | Landing pages (also the best place to see what is overused); free tiers limited or unverified |
| Dribbble https://dribbble.com/ , Behance https://www.behance.net/ | Visual concepts; many are unbuilt and untested, never evidence of usability |

Avoid as references: open screenshot dumps sorted without curation (dated captures, no quality bar) and galleries of unattributed or AI-generated "templates".

Use flows (Mobbin, Page Flows, Refero, SaaSUI) to learn how a task is usually structured; use visual galleries for direction and for spotting reflexes to avoid.

## Color, type, icons, and tools

- Color: Coolors https://coolors.co/ , Adobe Color https://color.adobe.com/ , Realtime Colors https://www.realtimecolors.com/ , Happy Hues https://www.happyhues.co/ . Craft-rules decide; check every pairing against contrast.
- Type: Google Fonts https://fonts.google.com/ (filter for Vietnamese subset), Fontpair https://www.fontpair.co/ , Typescale https://typescale.com/ . The craft-rules reflex-reject list still applies.
- Icons: Lucide https://lucide.dev/ , Iconify https://iconify.design/ , Heroicons https://heroicons.com/ . One family per product, labeled unless universal.
- Design and prototyping: Figma https://www.figma.com/ , Penpot https://penpot.app/ .

## Directories for finding more

Design Hub https://designrefs.com/en/ ; Made by Resources https://madebyresources.io/ ; Awesome Inspiration https://github.com/SHSFWork/awesome-inspiration .

## Learning order for the human-factors layer

When a person (or a new agent profile) wants to learn this field rather than apply the rules, this order builds each topic on the last: visual perception, attention, cognitive load, mental models, memory and recognition, decision making, emotion and trust, motivation and habits, motor skills, accessibility, usability testing, design systems. Each maps to a section of [human-factors.md](human-factors.md), [accessibility-inclusive.md](accessibility-inclusive.md), or [ux-research-validation.md](ux-research-validation.md).

All URLs accessed or listed 2026-10-24.
