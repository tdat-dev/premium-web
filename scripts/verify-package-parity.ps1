[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$SkillName = 'build-premium-website'
$Source = Join-Path $RepoRoot "skills\$SkillName"
$Payload = Join-Path $RepoRoot "plugins\$SkillName\skills\$SkillName"

function Get-Manifest {
    param([Parameter(Mandatory)][string]$Root)

    if (-not (Test-Path -LiteralPath $Root)) {
        throw "Directory does not exist: $Root"
    }

    $resolved = (Resolve-Path -LiteralPath $Root).Path.TrimEnd('\')
    $prefix = "$resolved\"
    $manifest = @{}

    foreach ($file in Get-ChildItem -LiteralPath $resolved -Recurse -File) {
        $relative = $file.FullName.Substring($prefix.Length).Replace('\', '/')
        $manifest[$relative] = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash
    }

    return $manifest
}

$sourceManifest = Get-Manifest $Source
$payloadManifest = Get-Manifest $Payload
$allPaths = @($sourceManifest.Keys + $payloadManifest.Keys | Sort-Object -Unique)
$failures = @()

foreach ($relative in $allPaths) {
    if (-not $sourceManifest.ContainsKey($relative)) {
        $failures += "Payload-only file: $relative"
        continue
    }
    if (-not $payloadManifest.ContainsKey($relative)) {
        $failures += "Missing payload file: $relative"
        continue
    }
    if ($sourceManifest[$relative] -ne $payloadManifest[$relative]) {
        $failures += "Hash mismatch: $relative"
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output "PASS: payload matches canonical source ($($sourceManifest.Count) files, SHA-256)."
