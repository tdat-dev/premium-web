# Archetype: AI chat / agent

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: ask, refine over turns, delegate multi-step work to an agent and supervise it, carry results into real work. Actors: end users, admins (models, tools, retention), approvers. Agent runs may last hours and are checked on later (convention). Signals: "assistant", "copilot", "agent", "streaming", "sources", "approve actions", "artifacts", "memory".

Two sub-shapes: **standalone assistant/agent workspace** and **embedded AI** (copilot panel or inline suggestions inside another archetype, which owns the shell).

Neighbors:
- **Support inbox**: humans answering humans, even with AI drafts, is support inbox with embedded AI.
- **Docs / CMS, creative canvas**: if output is edited at length as a document or design, that editor is primary.
- **Devtools**: an agent that deploys is this archetype for runs and approvals only.

## Shell and topology

Default (standalone): left sidebar with New chat, search, projects, and history grouped by recency; centered conversation column with the composer pinned to the bottom; account, settings, usage in the sidebar footer.

Alternatives:
- If outputs are documents, code, or visuals the user iterates on, add a resizable artifact panel right of the conversation with its own versions; on narrow screens it opens full-screen with a back control.
- If agents run long or in parallel, add a runs list (status, owner, pending approvals) and a run page with a step timeline.
- Embedded: one entry point reachable from every page, a right panel that keeps the host visible and knows the current selection, plus inline suggestions in host editors.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| New conversation | Start well | What it can and cannot do, optional suggestions, composer | First run; tools disabled by admin; quota reached |
| Conversation | Ask, read, refine | Messages, per-message actions, sources, step blocks, composer | Streaming, stopped, error mid-stream, branched, context too long |
| Composer | Say what you need | Input, attach, tool/mode selector, model selector if offered, send/stop | Uploading; unsupported or oversized file; offline |
| History | Return to work | Search, grouped list, rename, pin, delete, move to project | Shared; project removed |
| Artifact panel | Iterate on output | Title, version switcher, view/edit, copy, download, close | Updating while streaming; conflict with user edits |
| Agent run | Supervise | Goal, plan, step timeline, pending approvals, outputs, stop | Waiting for you, blocked by permission, partially failed, resumed |
| Approval | Allow or deny | Action in plain words, target, exact payload or diff, consequence, allow once / always / deny | Expired; approver lacks right; action changed since request |
| Memory | Control what it keeps | Remembered facts, edit/delete, on/off, temporary chat | Memory full; disabled by admin |
| Admin settings | Govern | Models, tools, connectors, retention, usage | Connector auth expired |

## Signature patterns

1. **Composer with honest limits.** Input grows to a cap then scrolls. Enter sends, Shift+Enter adds a line. Attachments are removable chips with type and size. Tool/model selectors beside send show the current choice as text. During streaming, Send becomes Stop in the same place. Show file and length limits before the user hits them.
2. **Streaming response.** Do not autoscroll past the start of a new answer; keep its first line in view and offer "Jump to latest". Announce completion once to assistive tech, not every token. A stopped answer keeps its partial text, marked Stopped, with Continue and Regenerate.
3. **Citations.** Put the citation next to the claim, styled apart from body text, labeled with the source title, linking to the exact section. End with a source list. Flag sources that could not be retrieved instead of hiding them. Near the composer, say plainly that answers can be wrong.
4. **Tool calls and agent steps.** Each step shows a plain label ("Searched orders for 'refund'"), status, duration, and expandable inputs/outputs. Completed steps collapse into one summary line. Generated reasoning is not proof of how the answer was made; actions and sources are the evidence.
5. **Approvals matched to risk.** Reads and drafts run freely. Sending, paying, deleting, publishing, or moving data outside the workspace needs approval showing the exact action, target, and payload (diff for edits, full text for messages). Offer Allow once, Always allow for this tool (reversible in settings), Deny with optional reason. If approvals are turned off, show that persistently. For long tasks, show the plan first and let the user edit it; flag any departure from the plan during execution. Audit: [cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md).
6. **Correction and recovery.** Assistant messages offer copy, regenerate, feedback (thumbs with optional reason). User messages offer edit and resend, creating branches the user can switch between. Errors name the cause and keep the prompt: "The connection dropped before the answer finished. Your message is saved. Try again." Rate limits say when to retry; the draft stays.
7. **Memory and context.** A visible context area lists what is in use now: attached files, connected sources, remembered facts. Each item can be removed. Stored memories can be viewed and deleted; a temporary chat is not remembered. When the conversation changes memory, say so inline with undo.
8. **Disclosure and embedded AI.** Mark generated content where it lands with a small AI label whose popover explains what produced it and how to report a problem; after user edits, the label shows it was edited. Inline suggestions are a distinct preview that changes nothing until accepted: Tab or Accept applies, Escape dismisses, continued typing ignores. Never suggest mid-word.

States and background jobs: [cross/feedback-states-notifications.md](../cross/feedback-states-notifications.md). History search: [cross/filters-search-command.md](../cross/filters-search-command.md).

## Density, data, and type calibration

- Prose 65–75ch (craft-rules); code and tables scroll horizontally inside their block, never the page.
- Turns separate more than paragraphs; user messages differ by alignment or a light surface, not loud color.
- Timestamps hidden per message, shown on hover/focus; history relative ("Yesterday"); runs show absolute start and elapsed time.
- Step statuses: Queued, Running, Waiting for you, Done, Failed, Skipped, Stopped. Approval outcomes: Allowed, Denied, Expired.
- One accent for primary action and focus; warning hue only for pending approvals and destructive payloads. Identify AI with a consistent icon and label, not gradients or glow (gradient text is banned).
- Usage in tabular figures with period and reset time.

## Localization notes

- Telex/VNI input: Enter must not send during IME composition (check `isComposing`), or half-typed words go out.
- Answer in the question's language by default; users can pin it.
- Vietnamese error and limit messages are longer; toasts and inline errors must wrap to two lines.
- VND has no minor unit (`1.250.000 ₫`); dates dd/mm/yyyy; scheduled runs in 24-hour time with GMT+7.
- History search is diacritic-insensitive. Where the platform supports Vietnamese dictation, voice input shows an editable transcript before send.

## Study pointers

- **Microsoft HAX guidelines**: design four moments separately: at start, during interaction, when wrong, over time.
- **Google PAIR Guidebook**: explain capabilities and limits at the point of use to calibrate trust.
- **Shape of AI**: named governors (action plan, verification, citations, memory) help pick the control each risk needs.
- **IBM Carbon for AI**: one AI label with an explanation popover and edited state gives disclosure without decoration.
- **NN/g on AI chatbots**: one entry point, capabilities in the first message, no autoscroll to the end.

## Human-AI interaction checklist

Microsoft's 18 Guidelines for Human-AI Interaction (Amershi et al., CHI 2019), grouped by moment. Review the build against each and record `MET`, `PARTIAL`, or `N/A` in the decision record; a `PARTIAL` on G1, G2, G8, G9, or G11 for a primary flow is a `P1-P`; a missing way to dismiss or correct the AI on the primary flow (G8, G9) is `P1-N`.

| Moment | Guidelines |
| --- | --- |
| Initially | G1 make clear what the system can do; G2 make clear how well it can do it |
| During interaction | G3 time services based on context; G4 show contextually relevant information; G5 match relevant social norms; G6 mitigate social biases |
| When wrong | G7 support efficient invocation; G8 support efficient dismissal; G9 support efficient correction; G10 scope services when in doubt; G11 make clear why the system did what it did |
| Over time | G12 remember recent interactions; G13 learn from user behavior; G14 update and adapt cautiously; G15 encourage granular feedback; G16 convey the consequences of user actions; G17 provide global controls; G18 notify users about changes |

Google's People + AI Guidebook adds the questions to settle before designing screens: does AI add value over a rule here (user needs); what mental model the product sets and how onboarding stages it; how confidence and data sources are shown so users calibrate trust (explain for understanding, not completeness, and show confidence only when it changes what the user does); how feedback reaches the model and when the user sees its effect; how control returns to the user when automation fails; and what an error means from the user's point of view, with a path forward that keeps their work.

## Archetype anti-patterns

- **Agent acts without a reviewable payload**: sends, deletes, or pays blind. P1.
- **Error or rate limit clears the prompt**: long prompts retyped. P1.
- **Citations as bare numbers far from claims, broken links hidden**: false confidence. P1.
- **Enter sends during IME composition**: Vietnamese users send half-typed text. P1.
- **Silent memory**: facts stored or used with no visible trace or delete path. P1.
- **Approval on every trivial step**: fatigue produces blind approval. P2.
- **Autoscroll to the end of streaming answers**: start of the answer lost. P2.
- **Prompt-card grid as home screen**: buries the composer. P2.
- **Sparkle glyph as the AI marker**: the ✨/four-point star is the category reflex for "AI"; mark assistant content with the product's own name, avatar, or a neutral label. P1.
- **Anthropomorphic copy** ("I'm so happy to help!"): inflates capability, breaks copy-voice. P2.

## Coverage additions

- [ ] Composer: Enter/Shift+Enter, IME-safe send, attach add/remove/fail, limits before hit, Stop replaces Send.
- [ ] Streaming: start stays in view, jump to latest, completion announced once, stopped partial with Continue/Regenerate.
- [ ] Citations adjacent and titled, deep link, unavailable source flagged, source list.
- [ ] Steps: statuses, expandable detail, collapsed summary.
- [ ] Approval: exact payload/diff, allow once/always/deny, expired, approvals-off indicator, out-of-page notice.
- [ ] Recovery with prompt preserved: network drop mid-stream, rate limit with retry time, context too long, connector auth expired.
- [ ] Branches from edit-and-resend; feedback reason; memory view/delete, temporary chat, change notice with undo.
- [ ] AI label with popover and edited state; inline suggestion accept, dismiss, ignore-by-typing.
- [ ] Copy message and code, export conversation, share scope and revoke.

## Sources

- https://www.microsoft.com/en-us/haxtoolkit/library/ (accessed 2026-09-28)
- https://www.shapeof.ai/ (accessed 2026-09-28)
- https://www.shapeof.ai/patterns/action-plan (accessed 2026-09-28)
- https://www.shapeof.ai/patterns/citations (accessed 2026-09-28)
- https://www.shapeof.ai/patterns/verification (accessed 2026-09-28)
- https://www.nngroup.com/articles/ai-chatbots-design-guidelines/ (accessed 2026-09-28)
- https://www.nngroup.com/articles/explainable-ai/ (accessed 2026-09-28)
- https://www.microsoft.com/en-us/research/blog/guidelines-for-human-ai-interaction-design/ (accessed 2026-10-24)
- https://pair.withgoogle.com/guidebook-v2/ and its six chapter pages (accessed 2026-10-24)
- https://carbondesignsystem.com/guidelines/carbon-for-ai/ (accessed 2026-10-24)
- Copilot inline suggestions, `isComposing`, live-region streaming: practitioner knowledge.
