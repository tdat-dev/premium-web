# Cross-AI compatibility and installation

Use this file when installing, syncing, or adapting the skill outside its canonical folder.

## Portable core

Keep `SKILL.md` frontmatter limited to:

```yaml
---
name: build-premium-website
description: ...
---
```

Do not add vendor-only frontmatter. Keep all common instructions and references in Markdown. `agents/openai.yaml` is Codex UI metadata; other agents can ignore it while still reading the shared package.

## Canonical source

Use this folder as the source of truth:

`~/.agents/skills/build-premium-website`

Edit the canonical package, validate it, then copy the complete named folder. Do not independently edit installed copies, because the next sync replaces them.

## Verified copy roots

The installer copies to:

- `~/.codex/skills`
- `~/.claude/skills`
- `~/.gemini/skills`
- `~/.gemini/antigravity/skills`
- `~/.gemini/antigravity-cli/skills`
- `~/.gemini/antigravity-ide/skills`
- `~/.cline/skills`
- `~/.roo/skills`
- `~/.grok/skills`

Never target `~/.antigravity/skills`; it is not part of this installation contract.

Run a no-write preview first:

```powershell
rtk powershell -NoProfile -File "$HOME\.agents\skills\build-premium-website\scripts\sync-global-skill.ps1" -DryRun
```

Then install or sync:

```powershell
rtk powershell -NoProfile -File "$HOME\.agents\skills\build-premium-website\scripts\sync-global-skill.ps1"
```

The script validates the canonical folder name and `SKILL.md`, stages a full copy inside each target root, and replaces only the named `build-premium-website` destination.

## Discovery limits

Copying a skill into a root does not guarantee that every version of every AI product automatically discovers it. Product conventions and feature support change. Restart or reload the relevant agent, then verify discovery with a harmless prompt that explicitly names the skill.

For an unknown AI, do not invent an install path and do not claim universal autodiscovery. Use one of these adapters:

1. Paste or attach `SKILL.md` and only the referenced files needed for the task.
2. Add an `AGENTS.md` instruction that tells the agent to read the canonical `SKILL.md` for premium website tasks.
3. Put the package in the product's documented custom-instruction/skill directory after verifying current vendor documentation.

## Manual invocation

Use a direct prompt such as:

```text
Read and follow build-premium-website/SKILL.md. Build this site from a brief, inventory real media, choose Three.js/GSAP/CSS/no motion based on intrinsic value, iterate from real browser screenshots, and finish with both readiness gates. Do not promise monetary value or awards.
```

If the agent cannot access files, provide the common `SKILL.md` plus the relevant one-level reference files in context. Media creation still depends on the tools actually available in that agent; when unavailable, the skill requires exact prompts and `BLOCKED ON ASSETS` rather than fake placeholders.
