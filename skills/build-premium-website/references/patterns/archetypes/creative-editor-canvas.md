# Archetype: Creative editor / canvas

Copyright (c) 2026 ByteWaker. Part of the `build-premium-website` skill. See LICENSE and NOTICE at the repository root.

## Recognize it

Jobs: create and arrange objects on a spatial surface by direct manipulation, then export or hand off the result. Covers design tools, whiteboards, diagram editors, photo/video editors, slide and site builders. Actors: makers (long sessions, heavy shortcut use), reviewers (view and comment), viewers, library admins. Sessions run from minutes to hours (convention). Signals: "canvas", "drag and drop editor", "layers", "inspector", "zoom", "snap", "frames/artboards", "export", "whiteboard", "timeline", "builder".

Neighbors:
- **Docs / knowledge / CMS**: a block editor flows content in one column; free 2D position with overlap is canvas.
- **Work management**: a kanban board snaps items to status columns; that is a collection, not a canvas.
- **Analytics**: a dashboard builder on a fixed widget grid stays analytics; free placement and layering make it canvas.

## Shell and topology

Default: full-bleed canvas with panels docked or floating around it. Tool bar top or bottom (select, frame, shape, text, pen, hand, comment); left panel for pages, layers, assets; right panel for the properties inspector of the current selection; zoom control, presence, share, export at top right. The canvas owns all remaining space and chrome never scrolls with it. Depth is shallow: file browser → file → page → canvas.

Alternatives:
- If the medium is time-based (video, animation, audio), dock a timeline under the canvas with playhead, tracks, and its own zoom; the inspector edits the clip or keyframe under selection.
- If users are mostly non-experts assembling from templates, replace the free tool bar with an insert panel of ready blocks and collapse layers by default.
- If viewers far outnumber editors, open files in view mode (comment, inspect) with an explicit switch to edit.

File browser, teams, account: [cross/app-shell-navigation.md](../cross/app-shell-navigation.md), [cross/data-tables-collections.md](../cross/data-tables-collections.md).

## Core screen set

| Screen | Job | Required anatomy (in order) | Archetype-specific states |
| --- | --- | --- | --- |
| File browser | Find, start files | Recent, projects, templates entry, thumbnail grid/list, owner, updated | Thumbnail rendering; file too large to preview |
| New from template | Skip the blank page | Categories, real-size preview, Use template, blank option | Template needs missing fonts or paid assets |
| Editor | Make things | Tool bar, canvas, layers, inspector, zoom, presence, share | Empty page, 10k+ objects, view only, reconnecting, font missing |
| Layers / pages | Structure, find | Page list, layer tree with type icons, lock/hide, search | Deep nesting; hidden-but-selected; rename in place |
| Inspector | Precise edits | Position/size, alignment, layout, fill/stroke, text, effects, export | Nothing selected (document props); mixed values |
| Assets / library | Reuse | Search, library source, drag to canvas, update notice | Breaking library update; detached instance |
| Comments | Review in place | Canvas pins, thread panel, resolve, open/resolved filter | Pin on deleted object |
| Version history | Recover | Named and auto versions, preview, restore as copy or in place | Restore while others are in the file |
| Share | Grant access | Invite, role (view/comment/edit), link access, copy link | Public link; external domain |
| Export | Get output out | Format, scale, selection vs page, size preview, progress | Long render; failure; unsupported effect |

## Signature patterns

1. **Selection model.** Click selects the top-most object in the current context; double-click or a modifier drills into groups; Shift adds/removes; drag on empty canvas draws a marquee; Escape selects the parent, then clears. Hover outlines before click. Canvas and layers selection stay in sync. Edge cases: locked objects (skip on canvas, selectable in layers), hidden objects, objects underneath (offer "select layer under cursor"), mixed-type multi-select.
2. **Direct manipulation with a numeric twin.** Drag moves; handles resize and rotate; arrows nudge a small step, Shift+arrow a large one (common defaults 1 and 10 units). Every drag has inspector fields (X, Y, W, H, rotation) that accept math (`+10`, `*2`) and label scrubbing. Aspect lock is a toggle plus a temporary modifier. Mixed values read "Mixed" and accept one value for all.
3. **Snapping and guides.** Snap to neighbor edges, centers, and equal gaps, to grid and guides. While dragging, draw alignment lines and gap measurements; clear them on release. Measure the threshold in screen pixels so it feels the same at every zoom (tldraw defaults to 8). A modifier suspends snapping; a setting turns it off.
4. **Zoom and pan.** Pinch and Ctrl/Cmd+wheel zoom about the cursor; wheel or two-finger drag pans; Space+drag or the hand tool pans with a mouse. Shortcuts for fit, selection, and 100%; a typed zoom level. Handles, outlines, and strokes keep constant screen size.
5. **Undo as a contract.** One gesture equals one undo step, including a whole drag or multi-property change; text groups by pause. In multiplayer, undo only your own changes. Undo restores the selection of that moment. Batch compound operations into one transaction.
6. **Multiplayer presence.** Named, colored cursors; collaborators' selections outlined in their color; avatars that start follow mode, which ends on any own input. Routine conflicts resolve per property without dialogs; if someone deletes what you are editing, show it. See [cross/collaboration-realtime.md](../cross/collaboration-realtime.md).
7. **Keyboard density.** Single-key tool shortcuts that do not fire while editing text; standard chords (copy, paste, duplicate, group, reorder); a searchable command palette and a shortcut sheet on `?` or Ctrl/Cmd+/. Avoid collisions with browser and screen-reader keys.
8. **Performance budget.** Cull off-screen objects, keep drag feedback within one frame, reduce detail while zooming or panning fast. Large files render the visible page first. Export runs off the main thread with progress and cancel.

## Density, data, and type calibration

- Dense chrome: inspector rows and icon buttons 28–32px on desktop (convention); on touch, 44px targets and secondary panels as sheets.
- Numeric fields use tabular figures, show units (px, %, °, ms), accept typed units.
- Neutral, quiet canvas so user content carries color. Product accent is reserved for selection and focus, one hue, distinct from common content colors or outlined.
- Save status in the top bar: "Saved", "Saving…", "Offline. Changes are kept on this device", "Reconnecting…", "View only".
- Version history timestamps absolute; comments relative.

## Localization notes

- Text objects must render stacked Vietnamese tone marks (ẫ, ự) without clipping when boxes auto-size.
- Font menus flag fonts lacking Vietnamese coverage before they are applied.
- Numeric fields accept decimal comma and point; display per locale.
- Inspector labels run 20–35% longer in Vietnamese; let label rows wrap rather than truncate silently.
- Telex/VNI input methods capture keystrokes: suspend single-key shortcuts during IME composition and bind by key code so non-US layouts work.

## Study pointers

- **Figma**: every canvas gesture has a numeric equivalent, so speed and precision never compete.
- **tldraw**: screen-pixel snap thresholds and batched history transactions keep feel consistent at any zoom.
- **Excalidraw**: a small tool set with single-key shortcuts stays approachable without hiding power.
- **Adobe Spectrum**: dense desktop controls can meet accessibility when tokens scale targets by platform.
- **Webflow**: a layers tree that mirrors real output structure keeps visual editing honest.

## Archetype anti-patterns

- **Drag without a numeric twin**: no exact size or position; pro users leave. P1.
- **Pointer-only object access**: layers panel not keyboard navigable, selection not announced. P1.
- **Undo that splits one gesture or reverts a collaborator's work**: breaks trust in editing. P1.
- **Chrome that scrolls or reflows with the canvas**: tools move while working. P1.
- **Single-key shortcuts firing in text or IME composition**: typing corrupts the document. P1.
- **Silent save**: no Saved/Offline state; users cannot tell if work is safe. P1.
- **Snap threshold in canvas units**: sticky zoomed out, useless zoomed in. P2.
- **Accent equal to a default fill**: selection vanishes on user content. P2.
- **Blocking modal export**: long renders freeze the editor with no cancel. P2.

## Coverage additions

- [ ] Selection: click, deep select, Shift, marquee, Escape to parent, locked/hidden, layers sync.
- [ ] Every drag has an inspector equivalent; mixed values; math in fields.
- [ ] Snapping: edges, centers, gaps, guides; modifier override; constant screen threshold.
- [ ] Zoom/pan: pinch, wheel, Space+drag, fit, selection, 100%, typed level.
- [ ] Undo/redo: one step per gesture, per-user in multiplayer, selection restored.
- [ ] Presence: cursors, selections, follow and exit.
- [ ] Save states rendered: Saving, Saved, Offline, Reconnecting, View only.
- [ ] Keyboard-only path: create, select via layers, move, resize, export.
- [ ] Shortcuts suppressed during text editing and IME composition.
- [ ] Large file load, drag frame budget, export progress and cancel.
- [ ] Vietnamese diacritic clipping; font coverage warning.

## Sources

- https://help.figma.com/hc/en-us/articles/360039956914-Adjust-alignment-rotation-position-and-dimensions (accessed 2026-09-28)
- https://help.figma.com/hc/en-us/articles/360039831974-View-layers-in-the-Layers-panel (accessed 2026-09-28)
- https://help.figma.com/hc/en-us/articles/360039959014-Select-layers-and-objects (accessed 2026-09-28)
- https://tldraw.dev/docs/editor (accessed 2026-09-28)
- https://tldraw.dev/sdk-features/snapping (accessed 2026-09-28)
- https://tldraw.dev/docs/collaboration (accessed 2026-09-28)
- Selection gestures, Excalidraw, Spectrum, Webflow, IME conflicts, density values: practitioner knowledge.
