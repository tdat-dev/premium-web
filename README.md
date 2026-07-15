# Premium Web

`premium-web` distributes the `build-premium-website` skill for Codex, Claude Code, and agents supported by the `skills` CLI. The skill treats premium and Awwwards-caliber quality as an evidence-backed production standard, never a monetary valuation or award guarantee.

Public repository: https://github.com/tdat-dev/premium-web

## Design scope

The skill routes each request to the contract that matches the work:

- **Landing and brand websites:** conversion journeys, portfolios, editorial sites, campaigns, real media, animation, GSAP, and Three.js/WebGL when the concept earns it.
- **Dashboards and product UI:** applications, admin and operational interfaces, tables, forms, charts, navigation, permissions, data semantics, and loading, empty, error, partial, stale, and success states.
- **Hybrid journeys:** websites that move from acquisition or storytelling into signup, onboarding, authenticated product work, account, or billing without letting visual spectacle damage product clarity.

All three routes retain the same anti-template, accessibility, responsive, browser-evidence, performance, and independent creative-review gates.

## Repository layout

- `skills/build-premium-website/` is the canonical source of truth.
- `plugins/build-premium-website/skills/build-premium-website/` is generated plugin payload.
- `.agents/plugins/marketplace.json` is the Codex marketplace.
- `.claude-plugin/marketplace.json` is the Claude Code marketplace.
- `scripts/sync-plugin-payload.ps1` regenerates payload safely.
- `scripts/verify-package-parity.ps1` verifies exact SHA-256 parity.

## Install locally with the skills CLI

```powershell
npx skills@latest add .
```

Install the skill globally for every agent supported by the current `skills` CLI:

```powershell
npx skills@latest add . --skill build-premium-website --global --agent '*' --yes
```

`'*'` means every agent supported by the current `skills` CLI, not literally every AI. Grok is not currently listed and still requires the native/manual fallback described below.

Install directly from the public GitHub repository:

```powershell
npx skills@latest add tdat-dev/premium-web
```

To install the future GitHub source globally for every currently supported agent:

```powershell
npx skills@latest add tdat-dev/premium-web --skill build-premium-website --global --agent '*' --yes
```

Repository source: https://github.com/tdat-dev/premium-web

## Install locally in Codex

```powershell
codex plugin marketplace add .
codex plugin add build-premium-website@premium-web
```

After publication:

```powershell
codex plugin marketplace add https://github.com/tdat-dev/premium-web
codex plugin add build-premium-website@premium-web
```

## Install locally in Claude Code

CLI:

```powershell
claude plugin marketplace add .
claude plugin install build-premium-website@premium-web --scope user
```

Interactive `/plugin` flow:

1. Run `/plugin` in Claude Code.
2. Open **Marketplaces**, then choose **Add Marketplace**.
3. Enter the absolute path to this local checkout.
4. Install `build-premium-website` from `premium-web` at user scope.

After publication, use the GitHub repository identifier in either flow:

```powershell
claude plugin marketplace add tdat-dev/premium-web
claude plugin install build-premium-website@premium-web --scope user
```

In Claude Code's interactive UI, run `/plugin`, add marketplace `tdat-dev/premium-web`, then install `build-premium-website` at user scope.

## Sync and verify the generated plugin payload

Preview without writing:

```powershell
powershell -NoProfile -File .\scripts\sync-plugin-payload.ps1 -DryRun
```

Regenerate and verify:

```powershell
powershell -NoProfile -File .\scripts\sync-plugin-payload.ps1
powershell -NoProfile -File .\scripts\verify-package-parity.ps1
```

## Grok and unsupported agents

Grok is not listed by the current `skills` CLI discovery command in this package's validation environment. Use Grok's native user skill directory (`~/.grok/skills/build-premium-website/`) or manually provide `skills/build-premium-website/SKILL.md` and its bundled resources. For any unverified agent, use the native skill directory or a manual prompt adapter instead of claiming universal auto-discovery.

## License boundary

No license has been selected or granted for this repository. Public visibility does not grant permission to copy, modify, or redistribute its contents.
