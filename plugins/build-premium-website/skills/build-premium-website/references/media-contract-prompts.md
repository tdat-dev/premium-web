# Media contract and prompt templates

Use this file before approving a media-led layout and whenever an image, video, 3D, audio, or illustration slot lacks a production asset.

## Asset-required contract

If the approved concept calls for media, the final implementation must use the supplied or generated asset in its intended section. A filename in the repository is not evidence of use; verify the rendered page, crop, loading behavior, and fallback.

For every asset, maintain:

| Field | Required value |
| --- | --- |
| ID and role | stable name and narrative/interface purpose |
| State | `READY`, `GENERATE`, `REQUEST`, `OPTIONAL`, or `REMOVE` |
| Source | supplied, generated, licensed library, commissioned, or owned archive |
| Rights | owner/license and usage constraints |
| Placement | page, section, layer, and breakpoint behavior |
| Technical spec | dimensions, aspect ratio, format, file-size budget; duration/fps/codecs when relevant |
| Content handling | focal point, crop, safe area, poster, captions/transcript, alt text |
| Delivery | preload/lazy strategy, responsive variants, fallback, reduced-data behavior |

If the user supplies media, inspect it before choosing layout. Do not stretch, upscale beyond defensible quality, crop out the subject, conceal logos/text, or autoplay disruptive audio.

## Missing required assets

1. Use an available image/video/media generation tool and save the output in the project with traceable provenance.
2. Integrate the asset in the approved placement.
3. Verify it in a real browser at desktop and mobile sizes.
4. If no generation/media tool exists, emit the complete request below and mark the affected section `BLOCKED ON ASSETS`.
5. Do not substitute a gradient, blob, empty frame, random stock photo, or fake preview and then claim completion.

## Exact image request template

```text
ASSET REQUEST - IMAGE [ID]
Purpose: [why this image exists]
Placement: [page > section > layer/component]
Prompt: [subject], [action/pose], [environment], [composition and camera], [lighting], [color relationship to brand], [surface/detail], [art direction], [realistic production constraints]
Shot list / variants:
1. [wide establishing]
2. [medium/content crop]
3. [mobile-safe or detail crop]
Dimensions: [pixel width x height]
Aspect ratio: [e.g. 16:9]
Safe area / focal point: [coordinates or descriptive area]
Negative prompt: [unwanted objects, styles, text, watermarks, anatomy/artifacts, brand conflicts]
Output: [AVIF/WebP/PNG/JPEG], [quality/transparency/color profile]
Alt text: [concise functional description, or empty alt if decorative]
Loading: [preload/eager/lazy], responsive srcset [breakpoints]
Fallback: [static/local fallback and behavior]
Rights/provenance: [tool/source, owner, license/usage record]
STATUS: BLOCKED ON ASSETS until delivered and rendered.
```

## Exact video request template

```text
ASSET REQUEST - VIDEO [ID]
Purpose: [why motion footage is necessary]
Placement: [page > section > layer/component]
Prompt: [subject], [action], [environment], [camera move/lens/framing], [lighting], [pace], [color], [art direction], [start and end frame continuity]
Shot list:
1. [shot, framing, action, seconds]
2. [shot, framing, action, seconds]
3. [mobile/alternate shot if needed]
Duration: [seconds] | Frame rate: [fps] | Loop: [yes/no and seam behavior]
Dimensions: [pixel width x height] | Aspect ratio: [e.g. 16:9]
Negative prompt: [flicker, warping, unstable text/logos, unwanted objects/styles, unsafe content]
Delivery: MP4/H.264 [profile] plus WebM [codec], muted [yes/no], audio [spec or none]
Poster: [image ID, frame/timecode, crop]
Captions/transcript: [file/required text, or reason not applicable]
Autoplay/loading: [policy, playsinline, preload, lazy strategy, reduced-data behavior]
Reduced-motion fallback: [poster/static alternate]
Failure fallback: [what appears if video cannot load]
Rights/provenance: [tool/source, owner, license/usage record]
STATUS: BLOCKED ON ASSETS until delivered and rendered.
```

## Prompt quality rules

- Write prompts for the approved brand and placement, not for a generic mood board.
- Describe composition, camera, light, color, material, motion, and safe areas precisely.
- Include negatives that prevent text artifacts, watermarks, deformed subjects, unstable frames, and visual cliches.
- Request only deliverables the implementation can serve efficiently.
- Never imply that an AI-generated result carries a license automatically; record the tool and applicable terms.

## Media acceptance check

Accept an asset only when its content fits the brief, rights are known, resolution survives the intended crop, responsive variants exist or can be derived, accessibility text is ready, loading does not break the page, and the rendered result was checked. Otherwise keep it blocked.
