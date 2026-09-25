[CmdletBinding()]
param(
    [string]$ConfigPath = (Join-Path $PSScriptRoot '..\.sourcecraft\ci.yaml')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$config = Get-Content -LiteralPath $ConfigPath -Raw
$requiredFragments = @(
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

if ($config -match '(?m)^\s*(on|push|pull_request|schedule)\s*:') {
    throw 'Automatic SourceCraft triggers are forbidden for the manual exact-head policy.'
}

Write-Output 'SourceCraft manual-gate contract: PASS'
