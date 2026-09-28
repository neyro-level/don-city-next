param(
  [ValidateSet('Inventory', 'Retire', 'Verify')]
  [string]$Action = 'Inventory',
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' })
)

$ErrorActionPreference = 'Stop'

function ConvertTo-PlainText([securestring]$SecureString) {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
  try {
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

function Join-ApiUrl([string]$BaseUrl, [string]$Path) {
  $base = $BaseUrl.TrimEnd('/')
  if ($base -notmatch '/api$') {
    $base = "$base/api"
  }
  "$base/$($Path.TrimStart('/'))"
}

function Invoke-InfisicalApi {
  param(
    [ValidateSet('Get', 'Post', 'Delete')]
    [string]$Method,
    [string]$BaseUrl,
    [string]$Path,
    [hashtable]$Headers,
    [object]$Body,
    [hashtable]$Query
  )

  $uriBuilder = [System.UriBuilder](Join-ApiUrl $BaseUrl $Path)
  if ($Query -and $Query.Count -gt 0) {
    $pairs = foreach ($key in $Query.Keys) {
      if ($null -ne $Query[$key] -and "$($Query[$key])" -ne '') {
        '{0}={1}' -f [uri]::EscapeDataString($key), [uri]::EscapeDataString("$($Query[$key])")
      }
    }
    $uriBuilder.Query = $pairs -join '&'
  }

  $parameters = @{
    Method = $Method
    Uri = $uriBuilder.Uri.AbsoluteUri
    Headers = $Headers
    TimeoutSec = 30
  }
  if ($null -ne $Body) {
    $parameters.ContentType = 'application/json'
    $parameters.Body = $Body | ConvertTo-Json -Depth 20
  }
  Invoke-RestMethod @parameters
}

function Get-Secrets {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers,
    [string]$ProjectId,
    [string]$SecretPath
  )

  try {
    $response = Invoke-InfisicalApi `
      -Method Get `
      -BaseUrl $BaseUrl `
      -Path '/v3/secrets/raw' `
      -Headers $Headers `
      -Body $null `
      -Query @{
        workspaceId = $ProjectId
        environment = 'prod'
        secretPath = $SecretPath
        recursive = 'false'
        include_imports = 'false'
        viewSecretValue = 'false'
      }
  } catch {
    if ($_.Exception.Message -notmatch 'SecretPathNotFound|Folder with path') {
      throw
    }
    return @()
  }
  @($response.secrets)
}

function Get-RootFolders {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers,
    [string]$ProjectId
  )

  $response = Invoke-InfisicalApi `
    -Method Get `
    -BaseUrl $BaseUrl `
    -Path '/v1/folders' `
    -Headers $Headers `
    -Body $null `
    -Query @{
      workspaceId = $ProjectId
      environment = 'prod'
      path = '/'
      recursive = 'false'
    }
  @($response.folders)
}

$root = Join-Path $CodexHome 'infisical'
$configPath = Join-Path $root 'projects.json'
$config = Get-Content -LiteralPath $configPath -Raw | ConvertFrom-Json
$baseUrl = [string]$config.baseUrl
$credentialName = if ($config.defaultCredential) { [string]$config.defaultCredential } else { 'codex-cursor-ai' }
$credentialPath = Join-Path $root "$credentialName.credential.xml"
$credential = Import-Clixml -LiteralPath $credentialPath

if ($credential.UserName -eq 'infisical-cli-user-token') {
  $accessToken = ConvertTo-PlainText $credential.Password
} else {
  $clientSecret = ConvertTo-PlainText $credential.Password
  try {
    $login = Invoke-InfisicalApi `
      -Method Post `
      -BaseUrl $baseUrl `
      -Path '/v1/auth/universal-auth/login' `
      -Headers @{} `
      -Body @{ clientId = [string]$credential.UserName; clientSecret = $clientSecret } `
      -Query @{}
    $accessToken = [string]$login.accessToken
  } finally {
    $clientSecret = $null
  }
}
if ([string]::IsNullOrWhiteSpace($accessToken)) {
  throw 'Infisical authentication did not return an access token.'
}

$headers = @{ Authorization = "Bearer $accessToken" }
$projectCandidates = @('/v1/workspace', '/v2/workspace', '/v1/workspaces', '/v2/workspaces')
$projectId = $null
foreach ($path in $projectCandidates) {
  try {
    $response = Invoke-InfisicalApi -Method Get -BaseUrl $baseUrl -Path $path -Headers $headers -Body $null -Query @{}
    $items = if ($response.workspaces) { @($response.workspaces) }
      elseif ($response.projects) { @($response.projects) }
      elseif ($response.workspace) { @($response.workspace) }
      elseif ($response -is [array]) { @($response) }
      else { @() }
    $project = @($items | Where-Object { $_.name -eq 'DonCity Server' }) | Select-Object -First 1
    if ($project) {
      $projectId = if ($project.id) { [string]$project.id }
        elseif ($project.workspaceId) { [string]$project.workspaceId }
        elseif ($project.projectId) { [string]$project.projectId }
        else { [string]$project._id }
      break
    }
  } catch {
    continue
  }
}
if ([string]::IsNullOrWhiteSpace($projectId)) {
  throw 'Secret Master project DonCity Server was not found.'
}

$stagingSecrets = if ($Action -eq 'Verify') {
  @()
} else {
  Get-Secrets -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId -SecretPath '/staging'
}
$productionSecrets = Get-Secrets -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId -SecretPath '/production'
$rootFolders = Get-RootFolders -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId
$stagingFolders = @($rootFolders | Where-Object { $_.name -eq 'staging' })
$productionFolders = @($rootFolders | Where-Object { $_.name -eq 'production' })

if ($Action -eq 'Inventory') {
  [pscustomobject]@{
    stagingSecretCount = $stagingSecrets.Count
    productionSecretCount = $productionSecrets.Count
    stagingFolderCount = $stagingFolders.Count
    productionFolderCount = $productionFolders.Count
  }
}

if ($Action -eq 'Retire') {
  if ($stagingSecrets.Count -lt 1) { throw 'Refusing: staging secrets are already absent or unreadable.' }
  if ($productionSecrets.Count -lt 1) { throw 'Refusing: production secrets are absent or unreadable.' }
  if ($stagingFolders.Count -ne 1) { throw 'Refusing: staging folder identity is ambiguous.' }
  if ($productionFolders.Count -ne 1) { throw 'Refusing: production folder identity is ambiguous.' }

  $deleteRows = @($stagingSecrets | ForEach-Object {
    @{
      secretKey = [string]$_.secretKey
      type = if ($_.type) { [string]$_.type } else { 'shared' }
    }
  })
  $null = Invoke-InfisicalApi `
    -Method Delete `
    -BaseUrl $baseUrl `
    -Path '/v3/secrets/batch/raw' `
    -Headers $headers `
    -Body @{
      workspaceId = $projectId
      environment = 'prod'
      secretPath = '/staging'
      secrets = $deleteRows
    } `
    -Query @{}

  $remainingSecrets = Get-Secrets -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId -SecretPath '/staging'
  if ($remainingSecrets.Count -ne 0) { throw 'Staging secrets remain after batch deletion.' }

  $null = Invoke-InfisicalApi `
    -Method Delete `
    -BaseUrl $baseUrl `
    -Path "/v1/folders/$([uri]::EscapeDataString([string]$stagingFolders[0].id))" `
    -Headers $headers `
    -Body @{ workspaceId = $projectId; environment = 'prod'; path = '/' } `
    -Query @{}

  $finalFolders = Get-RootFolders -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId
  $finalProductionSecrets = Get-Secrets -BaseUrl $baseUrl -Headers $headers -ProjectId $projectId -SecretPath '/production'
  if (@($finalFolders | Where-Object { $_.name -eq 'staging' }).Count -ne 0) { throw 'Staging Secret Master folder remains.' }
  if ($finalProductionSecrets.Count -ne $productionSecrets.Count) { throw 'Production Secret Master proof failed.' }
  [pscustomobject]@{
    stagingSecrets = 'absent'
    stagingFolder = 'absent'
    deletedSecretCount = $deleteRows.Count
    productionSecretCount = $finalProductionSecrets.Count
    productionFolderCount = @($finalFolders | Where-Object { $_.name -eq 'production' }).Count
  }
}

if ($Action -eq 'Verify') {
  if ($stagingSecrets.Count -ne 0) { throw 'Staging secrets are still present.' }
  if ($stagingFolders.Count -ne 0) { throw 'Staging Secret Master folder is still present.' }
  if ($productionSecrets.Count -lt 1) { throw 'Production Secret Master proof failed.' }
  if ($productionFolders.Count -ne 1) { throw 'Production Secret Master folder proof failed.' }
  [pscustomobject]@{
    stagingSecrets = 'absent'
    stagingFolder = 'absent'
    productionSecretCount = $productionSecrets.Count
    productionFolderCount = $productionFolders.Count
  }
}

$accessToken = $null
$headers.Clear()
