# Accessibility and inclusive design: WCAG 2.2 AA in practice

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

Production gate 4 in [anti-slop-enforcement.md](anti-slop-enforcement.md) requires WCAG 2.2 AA. This file turns that requirement into an automated floor, a manual test script, and a complete checklist. It also covers what WCAG does not: situational limits, cognitive load, older users, and Vietnamese-language specifics. Load it for every build, redesign, audit, and polish task.

## Standard and status

- **Target WCAG 2.2 Level AA** (W3C Recommendation, current edition 12 December 2024). 2.2 adds nine success criteria over 2.1 and removes 4.1.1 Parsing.
- **Do not design to WCAG 3 yet.** The latest Working Draft (10 September 2026) says it must not be cited as other than work in progress and that its contrast algorithm is not decided. APCA is not part of it. Use the WCAG 2.x contrast ratios.
- **Legal context (record in the fact map, verify for the project's market):** the European Accessibility Act applies from 28 June 2025 and points to EN 301 549 (V3.2.1 is built on WCAG 2.1 AA; V4.1.1, adopted in 2026, moves to WCAG 2.2 AA once cited in the Official Journal). Other markets have their own laws; never claim legal compliance, claim only the tested WCAG level.

## Why this is not optional

The WebAIM Million 2026 report found detectable WCAG failures on **95.9%** of the top million home pages, averaging 56.1 errors per page. The six most common failures are the ones agents also produce:

| Failure (share of home pages) | Where this skill catches it |
| --- | --- |
| Low contrast text (83.9%) | `render-check` `contrast_failures`; craft-rules contrast floor |
| Missing image alt text (53.1%) | `render-check` `img_missing_alt` |
| Missing form input labels (51%) | `render-check` `unnamed_controls`, `placeholder_labels` |
| Empty links (46.3%) | `render-check` `unnamed_controls` |
| Empty buttons (30.6%) | `render-check` `unnamed_controls` |
| Missing document language (13.5%) | `render-check` `doc_basics` |

**Automation finds only part of the problems.** Deque reports that axe found 57% of issues by volume in its own audits (a vendor study). The UK Government Digital Service tested ten tools on a page with 143 planted failures: the best single tool found about 40%, all ten together 71%. A clean automated report is therefore the floor, never the pass. The manual script below is required for `PRODUCTION GATE MET`.

## 1. Automated floor (render-check 1.4 and above)

| `render-check` count | WCAG | Accepted disposition |
| --- | --- | --- |
| `contrast_failures` | 1.4.3 | none for real text; text over media is checked by eye and recorded |
| `small_targets` | 2.5.8 | an equivalent full-size control for the same function on the page, named in the ledger |
| `unnamed_controls` | 1.1.1, 2.4.4, 4.1.2 | none |
| `placeholder_labels` | 1.3.1, 3.3.2 | none |
| `img_missing_alt` | 1.1.1 | none (decorative images take `alt=""`) |
| `doc_basics` | 2.4.2, 3.1.1, 1.4.4 | a deliberate single-heading layout may use a visually hidden h1 |
| `focus_invisible` | 2.4.7 | focus style drawn on an ancestor three or more levels up, verified in a screenshot |
| `focus_obscured` | 2.4.11 | none |
| `focus_hidden` | 2.4.3, 2.4.7 | none: closed menus and drawers must be `inert`, `hidden`, or `display:none` |
| `focus_stops` = 0 with controls on the page | 2.1.1 | none |
| `overflow_mobile` | 1.4.10 | content that needs two dimensions (maps, data tables with their own scroller) |

Running axe or WAVE in addition is welcome and its findings are dispositioned the same way; neither replaces the manual script.

## 2. Manual test script (required, record results in the coverage matrix)

1. **Keyboard only.** Unplug the mouse mentally. Complete the primary journey with Tab, Shift+Tab, Enter, Space, arrows, and Escape. Check: a skip link appears first on pages with repeated navigation; focus order follows the visual order; every action is reachable; menus, dialogs, and popovers open, trap focus only while open, close on Escape, and return focus to their trigger; no keyboard trap anywhere.
2. **Zoom and reflow.** Browser zoom 200%: nothing clipped or overlapping. Viewport 320 CSS px wide (equal to 1280px at 400%): one-direction scrolling only, nothing lost.
3. **Text spacing.** Apply line-height 1.5, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em (a bookmarklet or devtools style): no text is cut off or overlaps.
4. **Screen reader smoke test.** NVDA with Chrome or Firefox on Windows, VoiceOver with Safari on macOS or iOS, TalkBack on Android: pick the one closest to the audience. Check the headings list reads as an outline of the page, landmarks exist (header, nav, main, footer), every field announces its label and error, every button and link announces its purpose, status messages (saved, added to cart, errors after submit) are announced without moving focus (4.1.3).
5. **Color and contrast by eye.** View a grayscale screenshot: no information is carried by color alone (1.4.1). Borders of inputs, focus rings, chart lines, and icon-only controls reach 3:1 against neighbors (1.4.11). Check text over images or gradients that `render-check` skips.
6. **Motion and timing.** With `prefers-reduced-motion: reduce`, non-essential motion stops. Anything moving, blinking, or auto-updating for more than five seconds can be paused (2.2.2). Nothing flashes more than three times a second (2.3.1). Time limits can be turned off, adjusted, or extended (2.2.1).
7. **Hover and focus content.** Tooltips and popovers can be dismissed with Escape without moving the pointer, can be hovered themselves, and stay until dismissed (1.4.13).
8. **Forms and authentication.** Errors are identified in text and suggest the fix (3.3.1, 3.3.3); legal, financial, and data-deleting submissions are reversible, checked, or confirmed (3.3.4); data already entered in the same process is not asked again (3.3.7); login allows paste and password managers and does not require a puzzle or memory test without an alternative (3.3.8); fields collecting personal data have correct `autocomplete` tokens (1.3.5).
9. **Media.** Prerecorded video has captions; audio-only content has a transcript; video that carries information only visually has audio description or a text alternative.
10. **Forced colors.** Windows high-contrast mode (or `forced-colors: active` emulation): controls, focus, and icons remain visible.

## 3. WCAG 2.2 A and AA checklist

★ marks criteria new in 2.2. Default severity when failed on the primary journey: `P1-N`. Elsewhere `P1-P` unless the failure blocks a user group from content entirely, which stays `P1-N`.

**Perceivable**

| SC | Level | Requirement in one line |
| --- | --- | --- |
| 1.1.1 Non-text Content | A | Every meaningful image, icon, and control has a text alternative; decoration is hidden from assistive tech. |
| 1.2.1 Audio-only and Video-only | A | Transcript for audio-only; text or audio alternative for silent video. |
| 1.2.2 Captions (Prerecorded) | A | Prerecorded video with sound has captions. |
| 1.2.3 Audio Description or Media Alternative | A | Visual-only information in video is described or has a text alternative. |
| 1.2.4 Captions (Live) | AA | Live video has captions. |
| 1.2.5 Audio Description (Prerecorded) | AA | Prerecorded video has audio description where visuals carry meaning. |
| 1.3.1 Info and Relationships | A | Structure shown visually (headings, lists, tables, labels, groups) exists in markup. |
| 1.3.2 Meaningful Sequence | A | Reading order in the DOM matches the meaningful visual order. |
| 1.3.3 Sensory Characteristics | A | Instructions do not rely only on shape, position, color, or sound ("the round button on the right"). |
| 1.3.4 Orientation | AA | Works in portrait and landscape unless one is essential. |
| 1.3.5 Identify Input Purpose | AA | Personal-data fields carry the right `autocomplete` token. |
| 1.4.1 Use of Color | A | Color is never the only way to convey information or state. |
| 1.4.2 Audio Control | A | Audio playing over 3 seconds can be paused or muted. |
| 1.4.3 Contrast (Minimum) | AA | Text 4.5:1; large text (24px, or about 18.66px bold) 3:1. |
| 1.4.4 Resize Text | AA | Text resizes to 200% without loss; zoom is never blocked. |
| 1.4.5 Images of Text | AA | Real text instead of text baked into images, except logos. |
| 1.4.10 Reflow | AA | No two-direction scrolling at 320 CSS px width. |
| 1.4.11 Non-text Contrast | AA | UI component boundaries, states, and meaningful graphics 3:1 against neighbors. |
| 1.4.12 Text Spacing | AA | Survives line-height 1.5, paragraph 2x, letter 0.12em, word 0.16em. |
| 1.4.13 Content on Hover or Focus | AA | Dismissible, hoverable, persistent. |

**Operable**

| SC | Level | Requirement in one line |
| --- | --- | --- |
| 2.1.1 Keyboard | A | Everything works from a keyboard. |
| 2.1.2 No Keyboard Trap | A | Focus can always move away. |
| 2.1.4 Character Key Shortcuts | A | Single-key shortcuts can be turned off or remapped, or work only on focus. |
| 2.2.1 Timing Adjustable | A | Time limits can be turned off, adjusted (10x), or extended (warning plus 20s, at least 10 times). |
| 2.2.2 Pause, Stop, Hide | A | Moving, blinking, scrolling, or auto-updating content can be paused. |
| 2.3.1 Three Flashes or Below Threshold | A | Nothing flashes more than three times per second. |
| 2.4.1 Bypass Blocks | A | A skip link or landmarks let users bypass repeated blocks. |
| 2.4.2 Page Titled | A | Each page has a unique, descriptive title. |
| 2.4.3 Focus Order | A | Focus moves in an order that preserves meaning. |
| 2.4.4 Link Purpose (In Context) | A | Each link's purpose is clear from its text or context. |
| 2.4.5 Multiple Ways | AA | More than one way to find a page (nav, search, sitemap), except steps in a process. |
| 2.4.6 Headings and Labels | AA | Headings and labels describe their topic or purpose. |
| 2.4.7 Focus Visible | AA | Keyboard focus is always visible. |
| ★ 2.4.11 Focus Not Obscured (Minimum) | AA | The focused element is never entirely hidden by sticky headers, footers, banners, or chat widgets. |
| 2.5.1 Pointer Gestures | A | Multi-point or path gestures have a single-pointer alternative. |
| 2.5.2 Pointer Cancellation | A | Actions fire on release and can be aborted. |
| 2.5.3 Label in Name | A | The accessible name contains the visible label text. |
| 2.5.4 Motion Actuation | A | Shake or tilt actions have a UI alternative and can be disabled. |
| ★ 2.5.7 Dragging Movements | AA | Every drag has a single-pointer, non-drag alternative (buttons, menus, move-to). |
| ★ 2.5.8 Target Size (Minimum) | AA | Targets at least 24x24 CSS px, or spaced so a 24px circle touches no other target; inline links exempt. |

**Understandable**

| SC | Level | Requirement in one line |
| --- | --- | --- |
| 3.1.1 Language of Page | A | `<html lang>` is set (`vi` for Vietnamese). |
| 3.1.2 Language of Parts | AA | Passages in another language carry their own `lang`. |
| 3.2.1 On Focus | A | Focusing an element never triggers a change of context. |
| 3.2.2 On Input | A | Changing a setting never changes context unexpectedly (no auto-submit on select without warning). |
| 3.2.3 Consistent Navigation | AA | Repeated navigation keeps the same order across pages. |
| 3.2.4 Consistent Identification | AA | Same function, same name and icon everywhere. |
| ★ 3.2.6 Consistent Help | A | Help (contact details, contact form, self-help, chatbot) sits in the same relative place on every page that has it. |
| 3.3.1 Error Identification | A | Errors are identified and described in text. |
| 3.3.2 Labels or Instructions | A | Fields have visible labels or instructions. |
| 3.3.3 Error Suggestion | AA | Errors suggest a fix when one is known. |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Such submissions are reversible, checked, or confirmed. |
| ★ 3.3.7 Redundant Entry | A | Information already given in the process is filled in or selectable, not asked again. |
| ★ 3.3.8 Accessible Authentication (Minimum) | AA | No memory or puzzle test to log in unless there is an alternative, paste and password managers work, or the test is object recognition. |

**Robust**

| SC | Level | Requirement in one line |
| --- | --- | --- |
| 4.1.2 Name, Role, Value | A | Custom controls expose name, role, state, and value to assistive tech. |
| 4.1.3 Status Messages | AA | Status messages are announced without moving focus (`role="status"`, `aria-live`). |

AAA criteria worth adopting as design defaults where cheap: 2.5.5 Target Size (Enhanced) 44x44 px for touch-first products; 2.4.13 Focus Appearance (indicator at least a 2px perimeter with 3:1 change).

## 4. Build accessible components from proven primitives

- **Native HTML first.** `<button>`, `<a href>`, `<label for>`, `<fieldset>`/`<legend>`, `<details>`, `<dialog>`, native inputs. Each comes with keyboard behavior and semantics for free.
- **Complex widgets** (combobox, menu, tabs, tree, grid, date picker, drag and drop) follow the WAI-ARIA Authoring Practices patterns, or come from a library that implements them: React Aria, Radix UI, Headless UI, or the host design system. A hand-rolled `div` dropdown is a common source of `P1-N` keyboard failures.
- **ARIA corrects, it does not decorate.** No `role="button"` on a `div` when a `<button>` works; no `aria-label` that contradicts the visible text (2.5.3); no `aria-hidden` on focusable content.
- **Closed means removed.** Off-canvas menus, collapsed panels, and inactive tabs are `hidden`, `inert`, or `display:none`, so focus cannot land in them (`render-check` `focus_hidden`).

## 5. Inclusive design beyond the checklist

Microsoft's Inclusive Design principles: **recognize exclusion** (it happens when we design from our own bias), **learn from diversity** (people who adapt every day are the experts), **solve for one, extend to many**. Its persona spectrum shows one limitation in three forms: permanent (a person with one arm), temporary (an arm injury), situational (a parent holding a baby). Designing for the permanent case serves the much larger temporary and situational groups.

Situational checks that WCAG does not phrase directly:

| Situation | Design response |
| --- | --- |
| Phone in bright sunlight | Contrast above the floor for body text and primary actions; no light-gray essentials |
| Noisy shop or silent office | Captions on video; no audio-only cues |
| One hand busy (holding a child, a bag, a bus rail) | Primary actions in thumb reach; large targets; no two-handed gestures |
| Slow or metered mobile data | Core content and actions work before heavy media loads; images sized for the viewport |
| Interrupted mid-task | Drafts saved; progress kept; session timeouts warn and extend |
| Older users | Body text never below the craft floor; strong contrast; visible labels and borders; no hover-only or gesture-only controls; no time pressure; familiar words |
| Low literacy or reading in a second language | Plain language, short sentences, one idea per sentence, icons always paired with words |

**Cognitive accessibility.** The W3C COGA guidance ("Making Content Usable for People with Cognitive and Learning Disabilities") sets eight objectives; treat each as a review question on the primary journey: help users understand what things are and how to use them; help users find what they need; use clear and understandable content; help users avoid mistakes and know how to correct them; help users focus; ensure processes do not rely on memory; provide help and support; support adaptation and personalization.

## 6. Vietnamese-language specifics

- `<html lang="vi">` so screen readers choose a Vietnamese voice and the browser hyphenates and spell-checks correctly. Mixed English passages take `lang="en"`.
- **Diacritic coverage.** The chosen font must render every Vietnamese glyph, including stacked tone marks (ặ, ẫ, ỡ, ự). A font missing glyphs falls back mid-word and looks broken. Check a sample string such as "Trường Sơn, Đắk Lắk, Quảng Ngãi, tiếng Việt, những ước mơ" at every weight used.
- **Line height and caps.** Stacked diacritics need room: keep body line-height at 1.5 or more and check that tight display headings do not clip marks. Avoid all-caps for long Vietnamese headings; tone marks on capitals collide with the line above and slow reading.
- **Typing.** Vietnamese is typed through Telex or VNI input methods that rewrite characters as the user types. Input masks or handlers that reformat the value on every keystroke, or search that fires on each `keydown`, break this typing. Format on blur, respect `event.isComposing`, and test by typing "Nguyễn Thị Hương" into every text field.
- **Formats.** Dates `dd/mm/yyyy`, money `1.250.000 ₫` (dot grouping, no decimals), phone numbers accepted as `09xx xxx xxx` or `+84 9xx xxx xxx`.

## Sources (accessed 2026-10-24)

- WCAG 2.2: https://www.w3.org/TR/WCAG22/ ; What's new in 2.2: https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/ ; Understanding documents: https://www.w3.org/WAI/WCAG22/Understanding/
- WCAG 3.0 Working Draft: https://www.w3.org/TR/wcag-3.0/
- WebAIM Million 2026: https://webaim.org/projects/million/
- Deque automated coverage study: https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues
- GDS tool audit: https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/
- Microsoft Inclusive Design: https://inclusive.microsoft.design/
- W3C COGA: https://www.w3.org/TR/coga-usable/
- WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/
- European Accessibility Act and EN 301 549: https://commission.europa.eu/news-and-media/news/eu-becomes-more-accessible-all-2025-07-31_en ; https://www.dwt.com/insights/2026/09/european-accessibility-act-ict-standards-update
