[CmdletBinding()]
param(
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillName = 'build-premium-website'
$Source = Join-Path $RepoRoot "skills\$SkillName"
$PluginRoot = Join-Path $RepoRoot "plugins\$SkillName"
$Destination = Join-Path $PluginRoot "skills\$SkillName"

function Get-NormalizedPath {
    param([Parameter(Mandatory)][string]$Path)
    return [System.IO.Path]::GetFullPath($Path).TrimEnd('\')
}

$repoPath = Get-NormalizedPath $RepoRoot
$sourcePath = Get-NormalizedPath $Source
$pluginPath = Get-NormalizedPath $PluginRoot
$destinationPath = Get-NormalizedPath $Destination

if (-not (Test-Path -LiteralPath (Join-Path $sourcePath 'SKILL.md'))) {
    throw "Canonical skill is missing SKILL.md: $sourcePath"
}

if (-not $sourcePath.StartsWith("$repoPath\", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Canonical skill resolved outside the repository: $sourcePath"
}

if (-not $destinationPath.StartsWith("$pluginPath\", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Payload destination resolved outside the plugin: $destinationPath"
}

$sourceFiles = @(Get-ChildItem -LiteralPath $sourcePath -Recurse -File)

if ($DryRun) {
    Write-Output "DRY RUN: would replace generated payload"
    Write-Output "Source: $sourcePath"
    Write-Output "Destination: $destinationPath"
    Write-Output "Files: $($sourceFiles.Count)"
    return
}

$stagePath = Join-Path $pluginPath ".$SkillName.stage.$PID"
$backupPath = Join-Path $pluginPath ".$SkillName.backup.$PID"
$completed = $false

try {
    if (Test-Path -LiteralPath $stagePath) {
        Remove-Item -LiteralPath $stagePath -Recurse -Force
    }
    if (Test-Path -LiteralPath $backupPath) {
        Remove-Item -LiteralPath $backupPath -Recurse -Force
    }

    New-Item -ItemType Directory -Path $stagePath | Out-Null
    Copy-Item -Path (Join-Path $sourcePath '*') -Destination $stagePath -Recurse -Force

    if (-not (Test-Path -LiteralPath (Join-Path $stagePath 'SKILL.md'))) {
        throw 'Staged payload is missing SKILL.md.'
    }

    if (Test-Path -LiteralPath $destinationPath) {
        Move-Item -LiteralPath $destinationPath -Destination $backupPath
    }

    Move-Item -LiteralPath $stagePath -Destination $destinationPath
    $completed = $true

    if (Test-Path -LiteralPath $backupPath) {
        Remove-Item -LiteralPath $backupPath -Recurse -Force
    }

    Write-Output "Synced $($sourceFiles.Count) files to $destinationPath"
}
catch {
    if (-not (Test-Path -LiteralPath $destinationPath) -and (Test-Path -LiteralPath $backupPath)) {
        Move-Item -LiteralPath $backupPath -Destination $destinationPath
    }
    throw
}
finally {
    if (Test-Path -LiteralPath $stagePath) {
        Remove-Item -LiteralPath $stagePath -Recurse -Force
    }
    if ($completed -and (Test-Path -LiteralPath $backupPath)) {
        Remove-Item -LiteralPath $backupPath -Recurse -Force
    }
}
