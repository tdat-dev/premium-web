# Human factors: how people see, think, decide, and act

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

[craft-rules.md](craft-rules.md) says what a surface must measure. [copy-voice.md](copy-voice.md) says how its words must sound. This file says **why people succeed or fail with it**: perception, attention, memory, decisions, trust, motivation, and the hand on the mouse or the thumb on the glass. Load it before designing any surface and run its two passes (section 11 and section 12) in every critique.

A good-looking interface that ignores these limits still fails: the person cannot find the action, forgets what they typed two steps ago, distrusts the payment step, or misses the target with their thumb. Each rule below is written as **principle → rule → observable check**. A failed check is a defect graded by the user consequence, using the hints given here unless the enforcement contract grades it higher.

Evidence labels: rules marked **(contested)** rest on findings that failed replication or have narrow conditions. Use them as hypotheses, never as justification for a hard limit, and never cite them to the client as proof.

## 0. Before designing a surface, write four lines

1. **Who** uses it, where, on what device, under what pressure (a cashier mid-queue, a parent on a phone at night, an accountant at month end).
2. **The one job** of this view: the decision or action it exists for.
3. **What they already know**: the products they use daily that set their expectations (Shopee, Zalo, Facebook, banking apps, Excel, Gmail). This is their mental model; Jakob's law says it wins.
4. **What makes them quit**: the moment of doubt, effort, or fear on this view (hidden cost, long form, unclear next step, fear of losing work).

Every layout decision below should trace back to one of these lines. If it traces to "looks premium", it is decoration.

## 1. Perception: what belongs together

| Principle | Rule | Observable check |
| --- | --- | --- |
| Proximity | Space inside a group is clearly smaller than space between groups (at least 1:2). A label sits closer to its own field than to the field above. | Measure gaps in the screenshot. A heading equidistant between two sections, or a label floating between fields, fails. |
| Similarity | Same function, same look; different function, visibly different. Links, buttons, tags, and static badges must not share one style. | List every pill-shaped element: can you tell from appearance alone which ones act? |
| Common region | A border or background groups; use it only where proximity cannot. Do not box what spacing already groups. | Remove each container in your head. If grouping survives, the box is noise (see the nested-box ban). |
| Uniform connectedness | Lines and connectors claim a relationship. Decorative connectors between unrelated items lie. | Every drawn connector maps to a real flow or dependency. |
| Figure-ground / Prägnanz | One clear foreground per view. Text never sits on busy media without a solid treatment. | Blur the screenshot about 8px: groups and the primary action are still identifiable. |

**Squint test (required once per surface):** blur the screenshot (ImageMagick `magick shot.png -blur 0x8 blur.png`, ffmpeg `-vf boxblur=8`, or a CSS `filter: blur(8px)` capture) and look at it: does it show the intended first, second, third read? If the blur shows five equal blobs, hierarchy failed. With no way to blur, record `squint: unavailable (reason)`; never mark it passed.

## 2. Attention and scanning

People scan; they read only when committed. NN/g eyetracking describes the patterns: **layer-cake** (eyes jump heading to heading, the most effective pattern), **spotted** (eyes jump to links, numbers, distinctive words), **F-pattern** (the default when nothing guides the eye, and a sign the page failed to guide), **commitment** (motivated readers read everything).

Rules:

- **Front-load.** Headings, links, list items, and buttons carry their meaning in the first two words. "Phí giao hàng: miễn phí từ 300k", not "Về chính sách giao hàng của chúng tôi".
- **Descriptive links.** Link text names its destination. "Xem bảng giá sỉ", never "bấm vào đây" or "xem thêm" repeated five times.
- **Key point first.** The first two sentences of any section state its point; supporting detail follows.
- **Headings every screenful** on long content, specific enough that reading only headings tells the story.
- **The first screen earns the scroll, it does not hold everything.** NN/g's 2018 study (1920x1080) found 57% of viewing time above the fold and 74% within the first two screenfuls. Put the job and the primary action on screen one; make it obvious that more follows (no "false floor" where a full-bleed block looks like the end).
- **Banner blindness.** Anything shaped like an ad gets ignored: right rails, boxed promos, stock-photo banners, auto-rotating carousels, flashy colored strips. On one tested site the right rail drew 1 of 132 fixations. Never put essential content or the primary action in an ad-shaped container.
- **Von Restorff, sparingly.** The one different element is remembered. Emphasize one thing per view; when everything is highlighted nothing is. Never signal by color alone.
- **Motion steals attention.** Nothing moves near text the user is reading or a form they are filling. Auto-advancing carousels are attention theft and an accessibility failure unless pausable (WCAG 2.2.2).

Check: **five-second read.** Give a fresh-eyes subagent the screenshot and ask it to answer from first impression, without studying details: what is the page for, and what would you do next? (A model cannot be timed; this tests what the page presents first, not human memory.) The answer must match the surface's job line. Severity: a wrong answer on the hero or a primary task view is `P1-P`.

## 3. Cognitive load

Separate **intrinsic** load (the task is genuinely complex) from **extraneous** load (the interface adds work). Remove the second, support the first.

- **Hick's law.** Decision time grows with the number and complexity of choices. One primary action per view. Group long option lists, mark a recommended option with the reason, and move rare options behind disclosure. Do not hide the options people use daily to make the screen look calm.
- **Chunking.** Format long strings the way people read them: `0912 345 678`, card numbers in groups of four, `1.250.000 ₫`. Split long forms into fieldsets with legends and long pages into headed sections.
- **Do not make people carry information between screens.** If step 3 needs a number from step 1, show it at step 3. Never cite "7 plus or minus 2" to cap a menu: lawsofux itself warns it is an average that varies by person and was never a design limit.
- **Progressive disclosure, two levels at most.** NN/g finds designs with more than two disclosure levels typically have low usability. Split by frequency of use (from analytics or task analysis), not by the designer's guess. A collapsed "Nâng cao" section says how many values differ from defaults.
- **Tesler's law.** Complexity cannot be removed, only moved. Move it to the system: smart defaults, autofill (`autocomplete` tokens), remembered choices, computed values.
- **Postel's law.** Accept messy input, store clean output: phone numbers with spaces or `+84`, dates typed several ways, amounts pasted with grouping. Rejecting a valid answer for its format is a defect (`P1-P` on a primary form).

Check: list every element on the view and tag it `task`, `orientation`, or `decoration`. Decoration that competes with the task (same size, color, or motion as the primary action) is a `P2` at least, `P1-P` on a primary task view.

## 4. Mental models and conventions

- **Jakob's law.** Users spend most of their time on other sites, so they expect yours to work the same way. Logo top-left goes home; search looks like a field with a magnifier; cart or account sits top-right; underlined or clearly colored text is a link; standard form controls behave natively. Spend originality on content, composition, and the signature moment ([ambition-gates.md](ambition-gates.md)), never on basic controls.
- **Speak the user's words** (heuristic 2). Use the vocabulary the audience uses for their own work: "đơn hàng", "tồn kho", "công nợ", "ca làm", not internal system names or translated SaaS jargon.
- **Paradox of the active user.** People skip instructions and start clicking. The interface must teach while used: inline hints at the point of need, empty states that show the first action, no mandatory tour before value.
- **Signifiers.** Clickable things look clickable before hover; non-clickable things do not. A card with a hover lift but no link is a false affordance (`P2`; `P1-P` if it hides the real action). Icons without text labels only for the few universal ones (search, close, menu, play); everything else gets a label. NN/g: label icons with text.
- **Consistency.** The same action has the same name, icon, and position everywhere in the product (WCAG 3.2.3 and 3.2.4 make navigation and identification consistency an AA requirement).

## 5. Memory: recognition over recall

- **Show, do not make them remember.** Visible options, recent items, saved filters, autocomplete, persistent labels, format examples next to the field, breadcrumbs, visible selected state.
- **Placeholders are not labels.** They vanish on input, look like filled data, and are unreliably announced. `render-check` counts them as `placeholder_labels`; each is a defect (`P1-N` on the primary journey, else `P1-P`, the same grading as [accessibility-inclusive.md](accessibility-inclusive.md)).
- **Serial position.** People remember the first and last items best. Put the most important navigation items at the ends of a nav bar and the least important in the middle.
- **Peak-end rule.** People judge an experience by its most intense moment and its ending. Design the hardest moment (an error, a long wait, a payment) and the final moment (confirmation, receipt, success state) on purpose. A success page that is a dead end wastes the ending: say what happens next, when, and how to get help.
- **Resume, do not restart.** Save drafts and offer "tiếp tục chỗ đang làm". The tendency to resume interrupted tasks holds up in research; the memory advantage claimed for unfinished tasks (Zeigarnik) did not replicate in a 2025 meta-analysis **(contested)**, so do not justify nagging or fake incomplete-profile meters with it.

## 6. Decisions and choice architecture

- **Defaults decide for most people.** The default must be the option that is best for most users and honest about cost. Pre-checked marketing consent, add-ons, insurance, or auto-renew upgrades are the deceptive pattern "preselection".
- **Fewer choices when the choice is hard (contested).** The famous jam study (30% bought from 6 jams vs 3% from 24) did not hold up as a general rule: a 50-experiment meta-analysis found a mean effect near zero. Reduce options when options are complex, preferences unclear, or the decision is difficult; otherwise support comparison (filters, side-by-side tables, a recommended option with its reason).
- **Anchoring is robust.** The first number frames every later one. Show the real total, including shipping and fees, before the final step. A total that grows at checkout breaks trust and matches the "hidden costs" pattern.
- **Decoy pricing and "losses loom twice as large" are contested.** The decoy effect largely disappears with realistic product displays, and the 2x loss-aversion figure is an upper-end estimate. Do not design pricing pages around them; design them around honest comparison.
- **Neutral framing on consequential choices.** Cancel, delete, privacy, and consent screens state outcomes plainly, with "no" given the same class of prominence as "yes".
- **Social proof only when real and sourced** (see the fact map rule). It can also backfire: a message that "many people do the bad thing" spreads the bad thing.

**Deceptive patterns are banned outright.** The deceptive.design catalog lists 18 types: sneaking, forced action, hard to cancel, preselection, obstruction, hidden subscription, hidden costs, trick wording, visual interference, fake social proof, fake urgency, nagging, fake scarcity, disguised ads, confirmshaming, comparison prevention, addictive design, currency confusion. Any of them in a build is `P0` when it touches money, consent, or personal data, and `P1-N` otherwise. They are also legal exposure: EU DSA Article 25 prohibits interfaces that deceive or manipulate, consent must be freely given under GDPR, and the FTC enforces under ROSCA and the FTC Act. Record local consumer-protection law in the fact map as `verify against current official source`. Symmetry test: cancelling, unsubscribing, or opting out takes no more steps than signing up.

## 7. Emotion and trust

- **Aesthetic-usability effect.** People rate attractive interfaces as easier to use and forgive their problems; the same polish hides problems in testing. Beauty never substitutes for completing the task in a browser.
- **Credibility (Stanford Web Credibility guidelines, as checks):** the claims can be verified; a real organization is visible (legal name, address, tax code where local practice expects it); real people and expertise are shown; contact is easy and real; the design fits the purpose; content shows when it was last updated; promotion is restrained; there are no errors of any size (typos and broken links count).
- **Reassure at the moments of risk.** At payment, personal data entry, and destructive actions, say exactly what happens next, show the return or refund policy near the action, and use only security cues that are true.
- **Forgiveness beats warning.** Prefer undo over "Are you sure?". Confirm only irreversible actions, and name the consequence in the dialog ("Xoá 12 đơn nháp. Không khôi phục được.").
- **Errors never blame.** Say what happened and how to fix it in the user's words (see the microcopy section of [copy-voice.md](copy-voice.md)).

## 8. Motivation and habits

- **Diagnose with B = MAP.** A behavior happens when Motivation, Ability, and a Prompt meet at the same moment (Fogg). When users do not take the action, find which one is missing. Fix ability first (fewer fields, fewer steps, clearer next action); it is cheaper and more honest than pumping motivation.
- **Show progress on multi-step tasks** (goal gradient). Step indicators state the real number of steps; never pre-fill progress the user did not make.
- **Respect the expert.** Frequent tasks get faster with use (heuristic 7): keyboard shortcuts, bulk actions, remembered filters, recent items.
- **Protect flow.** No modal, newsletter popup, or chat bubble interrupts a task in progress or a first visit before the visitor has seen value.
- **No engineered compulsion.** Streak guilt, variable-reward feeds aimed at children, and endless autoplay are the "addictive design" pattern above.

## 9. Motor: pointing, touch, and reach

- **Fitts's law.** Time to hit a target grows with distance and shrinks with size (Shannon form: ID = log2(D/W + 1)). Make primary actions large and close to where attention already is; keep destructive actions away from frequent ones; on desktop, screen edges and corners are effectively infinite targets.
- **Target size floors.** `render-check` enforces the WCAG 2.5.8 floor: 24x24 CSS px, or enough spacing that a 24px circle on the target touches nothing else (inline links in running text are exempt). Touch-first surfaces design to a higher default: 44x44 pt is Apple's default control size, Android guidance asks for at least 48dp with 8dp spacing, NN/g recommends about 1cm x 1cm physical. An icon can stay small visually if its hit area meets the size.
- **Reach on phones.** Primary actions in one-handed flows sit in the lower half or a sticky bottom bar, not only in a top corner (practitioner guidance; published thumb-zone maps are not well evidenced, so test with the real device).
- **Alternatives for hard gestures.** Every drag has a single-pointer alternative (2.5.7), every path or multi-finger gesture has a simple one (2.5.1), and nothing is revealed only on hover.
- **Pointer cancellation.** Actions fire on release, so a slip can be dragged off (2.5.2). Generous spacing and no time pressure help people with tremor, people on a moving bus, and everyone in a hurry.

## 10. Time and feedback

- **Response limits (NN/g):** under 0.1s feels instant; under 1s keeps the flow of thought (show a subtle busy state if it may exceed this); 10s is the limit of attention, so anything longer shows percent done and a cancel option. Aim interactive responses under 400ms (Doherty threshold).
- **Status is always visible** (heuristic 1): saving and saved, syncing, offline, background jobs, who else is editing.
- **Match the wait to the indicator.** Skeletons when the layout is known; optimistic updates for safe, reversible actions; a progress bar with real progress for long jobs; never a bare spinner past ten seconds.

## 11. Human-factors pass (run on rendered screenshots in every critique)

Fill these rows in the critique ledger. `PRESENT` rows become defects.

| ID | Check | Default severity |
| --- | --- | --- |
| HF-01 | Five-second read does not match the surface's job line | `P1-P` hero or primary view, else `P2` |
| HF-02 | Squint test: primary action not identifiable when blurred; groups unclear | `P1-P` |
| HF-03 | Grouping lies: gaps inside groups equal or exceed gaps between groups; labels closer to the wrong field | `P2`, `P1-P` on forms |
| HF-04 | Look-alike elements with different behavior (static badge styled as button, link styled as text) | `P1-P` |
| HF-05 | Essential content or the primary action inside an ad-shaped container or auto-rotating carousel | `P1-P` |
| HF-06 | More than one competing primary action in a view; recommended option without a reason | `P2`, `P1-P` on decision views |
| HF-07 | User must recall information from an earlier step or screen; placeholder used as label | `P1-N` on the primary journey, else `P1-P` |
| HF-08 | Convention broken on a basic control (logo, search, cart, links, native inputs) without a recorded reason | `P1-P` |
| HF-09 | Hidden cost, preselected add-on or consent, asymmetric cancel, confirmshaming, fake urgency or scarcity | `P0` money/consent/data, else `P1-N` |
| HF-10 | Irreversible action without a named consequence, or reversible action without undo | `P1-P` |
| HF-11 | Touch targets under floor (`small_targets` > 0), hover-only reveals, drag without alternative | `P1-N` on the primary journey, else `P1-P` |
| HF-12 | Wait over 1s without status, over 10s without progress and cancel; status of saves or sync invisible | `P1-P` |
| HF-13 | Success or end state is a dead end (no next step, timing, or help) | `P2`, `P1-P` on checkout or booking |
| HF-14 | Interface vocabulary differs from the audience's own words; unlabeled non-universal icons | `P2`, `P1-P` on primary navigation |

## 12. Heuristic evaluation (Nielsen's 10 usability heuristics)

Walk the primary journey in the browser and log violations per heuristic. Each finding names the screen, the observed problem, and the heuristic. Map NN/g's 0-4 severity scale onto this skill's severities: 4 (usability catastrophe) is `P0` on the primary journey, otherwise `P1-N`; 3 (major) is `P1-P`; 2 (minor) and 1 (cosmetic) are `P2`.

| # | Heuristic | What to look for in the build |
| --- | --- | --- |
| 1 | Visibility of system status | Current location, selection, loading, saving, sync, and job state are visible without asking. |
| 2 | Match between system and the real world | User vocabulary, real-world order (address order, date format dd/mm/yyyy, VND formatting), familiar metaphors. |
| 3 | User control and freedom | Undo, cancel, back, close, and exit from every flow and overlay; no traps. |
| 4 | Consistency and standards | One name and one look per action across the product; platform conventions followed. |
| 5 | Error prevention | Constraints, good defaults, confirmations for destructive actions, input formats accepted rather than rejected. |
| 6 | Recognition rather than recall | Options visible, recent items, labels persist, help at the point of need. |
| 7 | Flexibility and efficiency of use | Shortcuts, bulk actions, saved views for frequent users without burdening new ones. |
| 8 | Aesthetic and minimalist design | Every element serves the task; nothing competes with the primary action. |
| 9 | Help users recognize, diagnose, and recover from errors | Plain-language errors next to the cause, saying what happened and how to fix it; input preserved. |
| 10 | Help and documentation | Contextual help where questions arise; consistent help location across pages (WCAG 3.2.6). |

## 13. Myths and weak evidence to reject

Do not let these drive a design decision or appear as a rationale in the decision record:

- "Everything within 3 clicks." Click count matters less than whether each click feels like progress.
- "People don't scroll." They scroll when the first screen promises more (the 74% two-screenful figure above).
- "Menus must have 7 plus or minus 2 items." Misuse of Miller's law.
- "Icons make it easier." Unlabeled icons are often slower to recognize than words.
- "Stock photos improve the experience" and "white space is wasted space."
- "People can tell you what they want" and "you are like your users." Observe behavior; you are not the user.
- "If it works for Amazon, it works for you." Context and audience differ.
- "Usability testing is expensive." Five users in one afternoon find most major problems in a qualitative round (see [ux-research-validation.md](ux-research-validation.md)).
- Contested, use only as hypotheses: choice overload as a universal rule, decoy pricing, a fixed 2x loss aversion, the Zeigarnik memory effect, goal gradient beyond progress display.

## Sources (accessed 2026-10-24)

- Laws of UX: https://lawsofux.com/ (Doherty, Miller, Fitts, Hick, Jakob, Gestalt laws, peak-end, serial position, Von Restorff, Tesler, Postel)
- NN/g: https://www.nngroup.com/articles/ten-usability-heuristics/ ; https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/ ; https://www.nngroup.com/articles/scrolling-and-attention/ ; https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/ ; https://www.nngroup.com/articles/recognition-and-recall/ ; https://www.nngroup.com/articles/progressive-disclosure/ ; https://www.nngroup.com/articles/response-times-3-important-limits/ ; https://www.nngroup.com/articles/touch-target-size/ ; https://www.nngroup.com/articles/form-design-placeholders/
- The Decision Lab: https://thedecisionlab.com/biases ; choice overload meta-analysis (Scheibehenne et al. 2010): https://ideas.repec.org/a/oup/jconrs/v37y2010i3p409-425.html ; decoy limits: https://marketing.wharton.upenn.edu/wp-content/uploads/2016/10/The-Limits-of-Attraction.pdf ; Zeigarnik meta-analysis 2025: https://ideas.repec.org/a/pal/palcom/v12y2025i1d10.1057_s41599-025-05000-w.html
- Deceptive patterns: https://www.deceptive.design/types ; FTC staff report: https://www.ftc.gov/reports/bringing-dark-patterns-light
- Fogg Behavior Model: https://behaviormodel.org/ ; Stanford Web Credibility: https://credibility.stanford.edu/guidelines/index.html
- WCAG 2.2 target size and gestures: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html ; Apple HIG accessibility table; Android touch target guidance: https://support.google.com/accessibility/android/answer/7101858
