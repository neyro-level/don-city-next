[CmdletBinding()]
param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot '..\.sourcecraft\ci.yaml')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$config = Get-Content -LiteralPath $ConfigPath -Raw
$requiredFragments = @(
    'on:',
    'push:',
    'branches: []',
    'merge-standard:',
    'merge-risky:',
    'expected_commit_sha:',
    'required: true',
    'EXPECTED_COMMIT_SHA: ${{ inputs.expected_commit_sha }}',
    'sh scripts/verify-sourcecraft-gate.sh'
)

foreach ($fragment in $requiredFragments) {
    if (-not $config.Contains($fragment)) {
        throw "SourceCraft CI contract is missing: $fragment"
    }
}

if ($config -match '(?m)^\s*pull_request\s*:') {
    throw 'Pull-request trigger is forbidden for the zero-CI policy.'
}

if ($config -notmatch '(?ms)push:\s*\r?\n\s*-\s*workflows:.*?\r?\n\s*filter:\s*\r?\n\s*branches:\s*\[\]') {
    throw 'Push trigger must be explicitly disabled with an empty branch filter.'
}

Write-Output 'SourceCraft manual-gate contract: PASS'
