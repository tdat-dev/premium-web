# UX research and validation: what the agent can check, and what only people can

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

Good UX is finally proven by the people who use the product, not by the builder and not by a model. This file sets out which questions an agent can answer itself, how to run those checks so they mean something, and how to hand the rest to the owner as a ready research plan. Load it when choosing evidence for the critique, when the brief asks for UX research or testing, and before writing any claim about usability in a deliverable.

Two rules carry over from the enforcement contract and are absolute: **never invent research** (participants, quotes, findings, scores, analytics) and **never present simulated evaluation as user research.** Both are `P0` truth defects.

## 1. Label every UX claim with its evidence level

| Level | Meaning | Example wording in the deliverable |
| --- | --- | --- |
| `MEASURED` | A script measured it on the rendered build | "render-check: small_targets=0, focus_obscured=0" |
| `OBSERVED` | The agent did it in a real browser | "Checkout completed by keyboard in 9 steps, no trap" |
| `SIMULATED` | A fresh-eyes model reviewer judged screenshots or labels | "SIMULATED first-click: 4 of 5 tasks clicked the intended target" |
| `USER-TESTED` | Real participants from the audience, with n and date | "Tested with 5 shop owners on 2026-11-02; 3 of 5 missed the shipping fee" |
| `ANALYTICS` | Field data from the live product, with source and period | "Clarity, 1-30 Oct: 41% rage clicks on the size selector" |
| `ASSUMED` | Not verified | "Assumed: most buyers order from phones (to confirm with sales data)" |

A deliverable that says "users will find it easy" without one of these labels is making an unsourced claim.

## 2. Pick the method from the question

NN/g describes research methods on three dimensions: **attitudinal vs behavioral** (what people say vs what they do), **qualitative vs quantitative** (why and how to fix vs how many and how much), and **context of use** (natural, scripted, limited, none). For usability, behavior beats self-report.

| Question | Method | Who can run it here | Minimum |
| --- | --- | --- | --- |
| Does the interface break known usability principles? | Heuristic evaluation ([human-factors.md](human-factors.md) section 12) | Agent | Primary journey, every screen in scope |
| Can a first-time user work out each step? | Cognitive walkthrough (below) | Agent | Every step of the primary journey |
| Does it work end to end? | Task-script walkthrough in a browser | Agent | 3-5 realistic tasks |
| Is the page's purpose clear at a glance? | Five-second test | Agent (`SIMULATED`), people for proof | One per key surface |
| Do people start the task in the right place? | First-click test | Agent (`SIMULATED`), people for proof | One per primary task |
| Do the navigation labels match how people think? | Tree test (labels only), card sort | Agent can pre-screen; people needed (card sorting about 15 per group) | Top two levels of navigation |
| Can real users complete the tasks, and where do they struggle? | Moderated usability test | People | 4-8 per round, repeated rounds |
| How usable is it compared with before or a competitor? | Benchmark with SUS, SEQ, task success, time | People | 20+ per group for rough estimates |
| What do people need, in their own context? | Interviews, field visits, diary studies | People | 5-8 per segment to start |
| Which of two versions converts better on live traffic? | A/B test | Live product with traffic | Enough traffic for the effect size; never declared from a day of data |
| Where do live users get stuck? | Funnel analytics, heatmaps, session recordings (Microsoft Clarity, Hotjar, Fullstory) | Live product | A full business cycle of data |

## 3. Evaluations the agent runs on every build

### Heuristic evaluation
Walk the primary journey and log violations of Nielsen's 10 heuristics with screen, observation, heuristic, and severity, as specified in [human-factors.md](human-factors.md).

### Cognitive walkthrough
For each step of each primary task, answer four questions from the point of view of a first-time member of the audience (from the surface's "who" line). Any "no" is a defect at that step.

1. Will they be trying to do the right thing at this point (do they know this step is needed)?
2. Will they notice that the correct control is available?
3. Will they connect that control with what they want to achieve (does the label say it in their words)?
4. After acting, will they see that they made progress toward the goal?

### Task-script walkthrough
Write 3-5 tasks in the audience's words from the job lines, with a clear end state ("Đặt 2 túi cà phê xay sẵn giao tới Quận 3, trả bằng chuyển khoản"). Perform each in the browser at mobile and desktop widths. Record success, number of steps, dead ends, backtracks, and any moment you had to guess. A task that cannot be completed is `P0` on the primary journey.

### Fresh-eyes simulated tests (subagent or second model)
Give a fresh reviewer only what a visitor would have; never the brief, the decision record, or your intent.

- **Five-second test:** one screenshot, then ask: what is this page for, who is it for, what would you do first, what do you remember? Record the answers verbatim.
- **First-click test:** one screenshot and a task ("You want to change the delivery address. Where do you click first?"). Compare with the intended target. Repeat for each primary task.
- **Tree test:** only the navigation labels as an indented text tree, plus tasks. Ask where they would look. Wrong branches point at labels that do not match the user's words.
- **Label and icon comprehension:** a list of icons or terms without context; ask what each means. Anything misread gets a text label or a plainer word.

Limits to state with every `SIMULATED` result: a model is not the audience. It knows interface conventions, reads every word, has no time pressure, no stakes, and no low-end phone. It finds obvious failures; it cannot prove success. When the simulated result and a real user disagree, the real user wins.

### Readability check on copy
Sentences above 25 words are split; paragraphs above five sentences are split (GOV.UK). Headings and buttons are front-loaded. This complements [copy-voice.md](copy-voice.md).

## 4. What only people can answer, and how to hand it over

When the brief, the risk, or the money at stake needs real evidence, give the owner a research plan they can run in a week instead of pretending. Template:

```yaml
research_plan:
  goal: what decision this research will inform
  questions: 3-5 questions the research must answer
  method: moderated usability test | interviews | survey | A/B | analytics review
  participants:
    who: the real audience segment (e.g. owners of small online shops selling on Facebook and Shopee)
    how_many: 4-8 per round for usability tests and interviews (GOV.UK); 20+ for any number you want to compare
    include: at least one person with an access need or assistive technology when the audience is broad
    recruit_from: existing customers, the owner's Zalo or Facebook groups, a recruiting service
    incentive: what each participant receives
  setup: their own phone and network where possible; remote or in person
  tasks: the task scripts from section 3
  measures: task success, SEQ after each task, SUS at the end, observed problems with severity
  schedule: one round, fix, next round (GOV.UK runs a round at least every two weeks)
  observers: the whole team watches sessions (GOV.UK: at least two hours every six weeks)
  output: problem list with severity and recommended fix, linked to the critique ledger
```

Session script for a moderated usability test: short welcome and consent (including recording); ask them to think aloud; one task at a time in their words, without hinting at labels on screen; after each task ask the Single Ease Question (1-7: "Overall, how easy or difficult was this task?") and probe any answer below 5; after all tasks the 10-item SUS; open debrief ("what was most frustrating?"). Watch what they do, not what they say they would do.

How many participants: the classic NN/g model estimates that 5 users find about 85% of the problems in a qualitative round when each problem affects about 31% of users. The lesson is to run several small rounds and fix between them, not that five people are always enough. Distinct user groups need 3-5 each; quantitative claims need far more.

## 5. Metrics and benchmarks (MeasuringU)

| Measure | What it is | Reference point |
| --- | --- | --- |
| Task success | Share of participants who complete the task | Average 78% across 1,189 tasks; top quartile above 92%, bottom quartile below 49% |
| SEQ | One 7-point question after each task | Average about 5.3-5.6 |
| SUS | 10-item questionnaire, scored 0-100 | Average 68 (grade C); 80.8+ is A; below 51.7 is F |
| UMUX-Lite | 2-item short form, correlates with SUS (r about .83) | Convert to the SUS scale before comparing |
| Precision | Margin of error on a completion rate | About ±20% at n=20, ±10% at n=65, ±5% at n=268 |

Rules: report the sample size and margin with every number; never compare two versions on samples too small to separate them; lab performance numbers (Lighthouse) are diagnostics, not field data, exactly as the enforcement contract says.

## 6. Live-product evidence

When the product is live, read field data before redesigning: funnel drop-off by step, form-field abandonment, search terms with no results, rage clicks and dead clicks, heatmaps, and a sample of session recordings. Free options exist (Microsoft Clarity); paid ones add depth (Hotjar, Fullstory). Record the source and period, and mask personal data in recordings. A redesign that ignores available field data must say why.

## Sources (accessed 2026-10-24)

- NN/g research methods landscape: https://www.nngroup.com/articles/which-ux-research-methods/
- NN/g sample sizes: https://www.nngroup.com/articles/why-you-only-need-to-test-with-5-users/ ; https://www.nngroup.com/articles/how-many-test-users/
- GOV.UK user research: https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service ; research with disabled people: https://www.gov.uk/service-manual/user-research/running-research-sessions-with-people-with-disabilities
- GOV.UK clear language: https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
- MeasuringU: https://measuringu.com/sus/ ; https://measuringu.com/interpret-sus-score/ ; https://measuringu.com/seq10/ ; https://measuringu.com/task-completion/ ; https://measuringu.com/sample-size-recommendations/ ; https://measuringu.com/umux-lite/
- Cognitive walkthrough: Wharton, Rieman, Lewis, Polson (1994), the four-question form as taught by NN/g and the Interaction Design Foundation.
