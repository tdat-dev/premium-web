# Archetype: Learning and LMS

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: pick a course, work through lessons in order, practice and get assessed, submit work, get grades and feedback, earn a certificate; teachers build courses, grade, and watch who is falling behind; admins enroll people and report completion. Actors: learner, teacher/instructor, teaching assistant (grades, cannot edit course), admin/training manager, parent or manager (read-only progress). Learners come back in 10–40 minute sessions (convention) spread over weeks; teachers grade in long batches before deadlines.

Signals: khóa học, bài học, chương, tiến độ, bài kiểm tra, nộp bài, chấm điểm, rubric, lớp, học viên, chứng chỉ, deadline, completion, cohort.

Neighbors: `docs-knowledge-cms.md` (content without progress, order, or assessment), `consumer-web-app.md` (media consumption without a curriculum or grade), `people-hr-ops.md` (compliance training as an HR record; if the brief is mostly assign-and-report, the admin side belongs there). Predicate: there is a sequence the learner is expected to complete, and someone evaluates the result.

## Shell and topology

Default for learners: top bar (logo, My learning, catalog, search, notifications, avatar) + dashboard content. Inside a course, switch to the course shell: left outline of chapters and lessons with completion marks, content in the center, optional right panel for notes or transcript; a bottom bar with previous/next and "Đánh dấu hoàn thành" when completion is manual.

Default for teachers/admins: left sidebar per course (Home, Modules, Assignments, Quizzes, Grades, People, Analytics, Settings) with a course switcher at the top.

Alternatives:
- **Focus mode player** (outline collapsed, content full width) when lessons are mostly video or long reading; outline returns via a toggle and keyboard shortcut.
- **Cohort home** (calendar-first: this week's sessions, due items, live class link) when learning is scheduled in cohorts rather than self-paced.

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
|---|---|---|---|
| Learner dashboard | Continue where I left off | Resume card for the last lesson, due soon list with dates, enrolled courses with progress, recent grades/feedback | No enrollments; everything overdue; course ended |
| Catalog | Choose a course | Search, filters (topic, level, length, language, price), course cards (title, teacher, length, level, rating with count) | Enrolled already; prerequisites unmet; seats full |
| Course overview | Decide and orient | What you will learn, syllabus with durations, requirements, teacher, schedule or self-paced, enroll/continue | Locked until start date; waitlist |
| Course player | Learn one lesson | Outline, lesson title, content (video/text/embed), transcript, resources, notes, prev/next, completion | Locked lesson with the unmet condition; video failed; offline |
| Quiz attempt | Be assessed | Header (time left, attempt n of m), question navigator, question, answer controls, save state, submit with review of unanswered | Time expired; connection lost mid-attempt; resumed attempt |
| Quiz result/review | Learn from the attempt | Score and pass threshold, per-question correctness and feedback as allowed by review settings, retake rule | Feedback hidden until close date; manual grading pending |
| Assignment | Submit work | Instructions, rubric preview, due date with timezone, submission type (file, text, link), history of submissions | Late, missing, excused, resubmission allowed |
| Grading (teacher) | Grade fast and fairly | Student switcher, submission viewer with annotation, rubric/score panel, comment composer, post/hide control | Anonymous grading; unsubmitted; group submission |
| Gradebook | See everyone at once | Students × assignments grid, sticky name column, totals, filters (section, status), export | Hidden grades; weighted categories; dropped lowest |
| People/cohort | Manage the class | Roster with role, section, last active, progress; enroll, message, remove | Invitation pending; learner inactive for N days |
| Certificate | Prove completion | Name, course, date, issuer, verification ID/URL, download/share | Revoked; name change requested |
| Admin reports | Show completion | Completion by course/group, overdue list, time spent, export with date range | Partial data from external content |

Tables, forms, and filters: follow [../cross/data-tables-collections.md](../cross/data-tables-collections.md), [../cross/forms-wizards-settings.md](../cross/forms-wizards-settings.md), [../cross/filters-search-command.md](../cross/filters-search-command.md); roles in [../cross/permissions-roles-audit.md](../cross/permissions-roles-audit.md).

## Signature patterns

**1. Completion rules made visible.** Completion is manual (learner marks it) or automatic on conditions: viewed, scored at least X, passed (Moodle activity completion). Show the rule next to each item ("Hoàn thành khi đạt từ 8/10"), not only a checkmark after the fact. Locked items name the unmet prerequisite and link to it. Course progress = completed required items / required items; optional items never lower the percentage.

**2. Resume and progress.** The dashboard's first action resumes the exact lesson and video timestamp. Outline marks: not started, in progress, completed, locked, each distinct by shape plus text, not color alone. Progress bars show the fraction ("12/30 bài"), not just a bar.

**3. Quiz attempt integrity.** Settings drive UI: open/close dates, time limit and what happens at expiry (auto-submit, grace period), attempts allowed and grading method (highest, average, first, last), navigation free or sequential, feedback deferred or immediate, what the review shows and when (Moodle quiz settings). Save each answer on change with a visible "Đã lưu" state; recover the attempt after reload or connection loss; warn at fixed thresholds (convention: 5 minutes and 1 minute) via a polite live region; the submit dialog lists unanswered and flagged questions. A timer never hides behind scroll on phones.

**4. Grading workspace.** One screen: student switcher (with status: submitted, late, missing, graded), the submission with annotation, rubric or score panel, comment composer (text; audio/video where supported), next/previous student. Anonymous grading hides names and shuffles order; grades stay hidden until the teacher posts them when the posting policy is manual (Canvas SpeedGrader behavior). Keyboard: next/previous student, focus rubric, save.

**5. Gradebook grid.** Sticky student column and header row, cell states (graded, needs grading, late, missing, excused, hidden) by icon plus text, category weights shown in the total column header, per-cell history. Bulk actions: post grades, set default grade for missing, message students who scored under X. Follow the APG grid pattern for cell navigation.

**6. Deadlines and time zones.** Every due date shows the date, time, and timezone; relative hint for near deadlines ("Còn 2 ngày"). Late policy stated on the assignment. Extensions per student show as their own due date with a label.

**7. Transcripts and notes.** Transcript on the lesson page, interactive: current phrase highlighted, click to seek, searchable (W3C WAI). Notes attach to a timestamp or text position and export per course.

**8. Certificates you can verify.** Issuer, date, and a public verification URL; the learner's name editable only through a request when certificates are formal.

## Density, data, and type calibration

- Learner surfaces: comfortable density, reading measure 65–75ch for text lessons (craft rules).
- Teacher gradebook: compact rows 32–36px (convention), tabular figures, scores as `8,5/10` or percentage, one format per course.
- Dates absolute on assignments and gradebook; relative only as a hint beside them.
- Status vocabulary: not started, in progress, completed, locked; submitted, late, missing, excused, graded, posted.
- Color budget: success for completed/passed, attention for due soon/late, critical for missing/failed; each paired with icon and word.

## Localization notes

- Vietnamese grading uses a 10-point scale with one decimal and comma separator (`8,5`); letter grades are uncommon. Make the scale a course setting.
- Dates `dd/mm/yyyy`, 24-hour times, Asia/Ho_Chi_Minh on deadlines.
- Rosters sort by given name (last word) in Vietnamese school convention; offer family-name sort too, and keep full diacritics in names and certificates.
- Parents often follow progress through Zalo or SMS; notifications need a phone channel and a per-child view.
- Labels run ~20–35% longer ("Đánh dấu hoàn thành"); the lesson footer bar must wrap without hiding next/previous.
- Certificates print in Vietnamese and optionally English; check diacritics in the PDF font.

## Study pointers

- **Moodle docs (activity completion, quiz settings)**: every rule the teacher sets needs a visible counterpart on the learner side.
- **Canvas SpeedGrader guides**: grading is a single workspace with next-student flow and explicit post/hide.
- **W3C WAI media accessibility**: transcripts sit with the media and double as navigation.
- **Coursera / Khan Academy public learner flows**: resume beats browse on the learner home.
- **NN/g e-learning and form research**: assessments are forms under time pressure; save state and error recovery matter more than styling.
- **GOV.UK Design System (question pages)**: one question per page suits high-stakes or low-literacy assessments.

## Archetype anti-patterns

- **Checkmark without rule**: learners cannot tell why an item is incomplete. P1.
- **Silent lock**: locked lesson without naming the prerequisite. P1.
- **Answers lost on reload**: quiz without autosave or attempt recovery. P1.
- **Timer only in color**: red countdown without text or announcement. P1.
- **Grades visible before posting**: breaks teacher's release control. P1.
- **Gamified leaderboard by default**: public ranking shames low performers; opt-in only. P2.
- **Progress bar with no fraction**: no sense of remaining work. P2.
- **Due date without timezone**: missed deadlines for remote learners. P2.
- **Hero-stat course dashboard for teachers**: lead with "needs grading" and "at risk", not totals. P2.

## Coverage additions

- [ ] Every activity shows its completion rule; locked items name the prerequisite.
- [ ] Resume goes to the last lesson and timestamp.
- [ ] Quiz: autosave, reload recovery, connection loss, time warnings announced, expiry behavior, unanswered review before submit.
- [ ] Review visibility matches settings (hidden until close, manual grading pending).
- [ ] Grading: status per student, anonymous mode, post/hide, keyboard next/previous.
- [ ] Gradebook: sticky axes, cell states with text, weighted total, export.
- [ ] Assignment: late, missing, excused, extension, resubmission.
- [ ] Certificate verification URL, name diacritics in PDF.
- [ ] Role views: learner, TA, teacher, admin, parent/manager read-only.

## Sources

- https://docs.moodle.org/en/Quiz_settings (accessed 2026-09-28)
- https://docs.moodle.org/en/Activity_completion (accessed 2026-09-28)
- https://teachwell.auckland.ac.nz/canvas/speedgrader/ (accessed 2026-09-28)
- https://community.canvaslms.com/t5/Instructor-Guide/How-do-I-hide-or-post-assignment-grades-in-SpeedGrader/ta-p/1000 (search summary) (accessed 2026-09-28)
- https://www.w3.org/WAI/media/av/transcripts/ (accessed 2026-09-28)
- https://www.w3.org/WAI/ARIA/apg/patterns/slider/ (accessed 2026-09-28)
- Practitioner knowledge: VN 10-point grading, roster sorting, parent notification via Zalo, gradebook conventions, APG grid pattern.
