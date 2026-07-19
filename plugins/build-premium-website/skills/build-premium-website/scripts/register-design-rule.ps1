# Copyright (c) 2026 ByteWaker. Licensed under Apache-2.0.
# Part of build-premium-website — https://github.com/tdat-dev/premium-web
# Redistribution must retain this notice, LICENSE, and NOTICE.
#
# Registers a design-routing rule into each installed AI's rule file so the
# agent defaults to build-premium-website for website/UI work. Idempotent:
# single-file rules get a managed marker block (re-run replaces it); rule
# DIRECTORIES get a standalone build-premium-website.md. -Remove uninstalls.
[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Remove
)

$ErrorActionPreference = 'Stop'
$beginMark = '<!-- premium-web:auto-rule BEGIN (managed by premium-web installer — edits between markers are overwritten on re-install) -->'
$endMark   = '<!-- premium-web:auto-rule END -->'

$ruleBody = @'
## Định tuyến thiết kế web — build-premium-website (mặc định)

Mọi task xây / redesign / audit / polish một website, landing page, dashboard, admin/quản lý,
product UI, hay component: **đi qua skill `build-premium-website` TRƯỚC khi viết UI.** Skill này tự
chọn tuyến (LANDING_BRAND / DASHBOARD_PRODUCT / HYBRID), áp craft-rules + ambition-gates (chống
AI-slop, luật font/màu, media thật bằng tool tạo ảnh), và nghiệm thu bằng gate — rồi ủy quyền phần
dựng chi tiết cho các skill design sẵn có (frontend-design / impeccable / ui-ux-pro-max) khi cần.

- Nếu agent KHÔNG gọi được skill (không có Skill tool): đọc và làm theo `build-premium-website/SKILL.md`
  trong thư mục skills của tool này.
- Ưu tiên: user instructions > rule/CLAUDE.md của project > rule này > default behavior của tool.
'@

# The managed block as it appears inside a single-file rule.
$block = "$beginMark`r`n`r`n$ruleBody`r`n`r`n$endMark"

# Standalone file content for directory-style rule roots.
$standalone = "# build-premium-website — định tuyến thiết kế (managed by premium-web installer)`r`n`r`n$ruleBody`r`n"

# Rule files that hold a managed block (only touched if they already exist).
$singleFiles = @(
    '.claude\CLAUDE.md',
    '.codex\AGENTS.md',
    '.gemini\GEMINI.md',
    '.grok\GROK.md',
    '.config\opencode\AGENTS.md'
)

# Rule DIRECTORIES that take a standalone file (only touched if the dir exists).
$ruleDirs = @(
    '.cline\rules',
    '.roo\rules'
)

function Set-ManagedBlock([string]$path) {
    $full = [System.IO.Path]::GetFullPath((Join-Path $HOME $path))
    if (-not (Test-Path -LiteralPath $full -PathType Leaf)) {
        Write-Output "  skip (absent)   $full"
        return
    }
    $raw = Get-Content -LiteralPath $full -Raw -Encoding UTF8
    $hasBlock = $raw -match [regex]::Escape($beginMark)

    if ($Remove) {
        if (-not $hasBlock) { Write-Output "  no rule         $full"; return }
        $pattern = "(\r?\n)*" + [regex]::Escape($beginMark) + "[\s\S]*?" + [regex]::Escape($endMark)
        $new = [regex]::Replace($raw, $pattern, '')
        if ($DryRun) { Write-Output "  [DRY] remove    $full"; return }
        [System.IO.File]::WriteAllText($full, $new.TrimEnd() + "`r`n", (New-Object System.Text.UTF8Encoding($false)))
        Write-Output "  removed         $full"
        return
    }

    if ($hasBlock) {
        $pattern = [regex]::Escape($beginMark) + "[\s\S]*?" + [regex]::Escape($endMark)
        # MatchEvaluator so `$` inside $block is inserted literally, not as a group ref.
        $new = [regex]::Replace($raw, $pattern, { param($m) $block })
        $verb = '  updated block   '
    } else {
        $new = $raw.TrimEnd() + "`r`n`r`n" + $block + "`r`n"
        $verb = '  added block     '
    }
    if ($DryRun) { Write-Output "  [DRY]$($verb.Trim()) $full"; return }
    [System.IO.File]::WriteAllText($full, $new, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "$verb$full"
}

function Set-StandaloneFile([string]$dir) {
    $fullDir = [System.IO.Path]::GetFullPath((Join-Path $HOME $dir))
    if (-not (Test-Path -LiteralPath $fullDir -PathType Container)) {
        Write-Output "  skip (absent)   $fullDir"
        return
    }
    $file = Join-Path $fullDir 'build-premium-website.md'
    if ($Remove) {
        if (Test-Path -LiteralPath $file) {
            if ($DryRun) { Write-Output "  [DRY] remove    $file"; return }
            Remove-Item -LiteralPath $file -Force
            Write-Output "  removed         $file"
        } else {
            Write-Output "  no rule         $file"
        }
        return
    }
    if ($DryRun) { Write-Output "  [DRY] write     $file"; return }
    [System.IO.File]::WriteAllText($file, $standalone, (New-Object System.Text.UTF8Encoding($false)))
    Write-Output "  wrote           $file"
}

Write-Output ($(if ($Remove) { 'Removing' } else { 'Registering' }) + ' build-premium-website design-routing rule:')
foreach ($f in $singleFiles) { Set-ManagedBlock $f }
foreach ($d in $ruleDirs) { Set-StandaloneFile $d }
Write-Output 'Done. Restart / reload each agent for the rule to take effect.'
