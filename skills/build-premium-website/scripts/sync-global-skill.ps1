# Copyright (c) 2026 tdat-dev. Licensed under Apache-2.0.
# Part of build-premium-website — https://github.com/tdat-dev/premium-web
# Redistribution must retain this notice, LICENSE, and NOTICE.
[CmdletBinding()]
param(
    [switch]$DryRun,
    [string]$SourcePath
)

$ErrorActionPreference = 'Stop'
$skillName = 'build-premium-website'

if ([string]::IsNullOrWhiteSpace($SourcePath)) {
    $SourcePath = Split-Path -Parent $PSCommandPath
    $SourcePath = Split-Path -Parent $SourcePath
}

$resolvedSource = (Resolve-Path -LiteralPath $SourcePath).Path

if ((Split-Path -Leaf $resolvedSource) -ne $skillName) {
    throw "Source folder must be named '$skillName': $resolvedSource"
}

$skillFile = Join-Path $resolvedSource 'SKILL.md'
if (-not (Test-Path -LiteralPath $skillFile -PathType Leaf)) {
    throw "Source is missing SKILL.md: $skillFile"
}

$frontmatter = Get-Content -LiteralPath $skillFile -TotalCount 8
if (-not ($frontmatter -match '^name:\s*build-premium-website\s*$')) {
    throw "SKILL.md name does not match '$skillName'."
}

$relativeRoots = @(
    '.codex\skills',
    '.claude\skills',
    '.gemini\skills',
    '.gemini\antigravity\skills',
    '.gemini\antigravity-cli\skills',
    '.gemini\antigravity-ide\skills',
    '.cline\skills',
    '.roo\skills',
    '.grok\skills'
)

foreach ($relativeRoot in $relativeRoots) {
    $root = [System.IO.Path]::GetFullPath((Join-Path $HOME $relativeRoot))
    $destination = Join-Path $root $skillName

    if ($DryRun) {
        Write-Output "[DRY-RUN] COPY '$resolvedSource' -> '$destination'"
        continue
    }

    [System.IO.Directory]::CreateDirectory($root) | Out-Null
    $token = [Guid]::NewGuid().ToString('N')
    $staging = Join-Path $root (".$skillName.sync-$token")
    $backup = Join-Path $root (".$skillName.backup-$token")
    $destinationMoved = $false

    try {
        [System.IO.Directory]::CreateDirectory($staging) | Out-Null
        Get-ChildItem -LiteralPath $resolvedSource -Force | Copy-Item -Destination $staging -Recurse -Force

        if (Test-Path -LiteralPath $destination) {
            Move-Item -LiteralPath $destination -Destination $backup
            $destinationMoved = $true
        }

        Move-Item -LiteralPath $staging -Destination $destination

        if ($destinationMoved -and (Test-Path -LiteralPath $backup)) {
            Remove-Item -LiteralPath $backup -Recurse -Force
        }

        Write-Output "[INSTALLED] $destination"
    }
    catch {
        if (Test-Path -LiteralPath $staging) {
            Remove-Item -LiteralPath $staging -Recurse -Force
        }

        if ($destinationMoved -and (Test-Path -LiteralPath $backup) -and -not (Test-Path -LiteralPath $destination)) {
            Move-Item -LiteralPath $backup -Destination $destination
        }

        throw
    }
}
