param(
  [ValidateSet('Inventory', 'Retire', 'Verify')]
  [string]$Action = 'Inventory',
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' })
)

$ErrorActionPreference = 'Stop'

function Get-SecretMap {
  param(
    [string]$Helper,
    [string]$ProjectId,
    [string]$SecretPath
  )

  try {
    $rows = & $Helper `
      -ProjectName 'DonCity Server' `
      -ProjectId $ProjectId `
      -Environment 'prod' `
      -SecretPath $SecretPath `
      -ShowValues
  } catch {
    if ($_.Exception.Message -notmatch 'SecretPathNotFound|Folder with path') {
      throw
    }
    $rows = @()
  }
  $map = @{}
  foreach ($row in $rows) {
    $map[[string]$row.secretKey] = [string]$row.secretValue
  }
  $map
}

function Invoke-TimewebApi {
  param(
    [ValidateSet('Get', 'Delete')]
    [string]$Method,
    [string]$Path,
    [hashtable]$Headers
  )

  $parameters = @{
    Method = $Method
    Uri = "https://api.timeweb.cloud/api/$($Path.TrimStart('/'))"
    Headers = $Headers
    TimeoutSec = 30
  }
  Invoke-RestMethod @parameters
}

function Get-CloudState {
  param(
    [hashtable]$Headers,
    [string]$ProductionDatabaseName,
    [string]$StagingDatabaseName,
    [string]$ProductionBucketName,
    [string]$StagingBucketName
  )

  $clusters = @((Invoke-TimewebApi -Method Get -Path '/v1/databases' -Headers $Headers).dbs)
  $instances = foreach ($cluster in $clusters) {
    $rows = @((Invoke-TimewebApi -Method Get -Path "/v1/databases/$($cluster.id)/instances" -Headers $Headers).instances)
    foreach ($instance in $rows) {
      [pscustomobject]@{
        clusterId = [string]$cluster.id
        clusterStatus = [string]$cluster.status
        id = [string]$instance.id
        name = [string]$instance.name
        status = [string]$instance.status
      }
    }
  }
  $buckets = @((Invoke-TimewebApi -Method Get -Path '/v1/storages/buckets' -Headers $Headers).buckets)

  [pscustomobject]@{
    clusters = $clusters
    instances = @($instances)
    productionDatabases = @($instances | Where-Object { $_.name -eq $ProductionDatabaseName })
    stagingDatabases = @($instances | Where-Object { $_.name -eq $StagingDatabaseName })
    buckets = $buckets
    productionBuckets = @($buckets | Where-Object { $_.name -eq $ProductionBucketName })
    stagingBuckets = @($buckets | Where-Object { $_.name -eq $StagingBucketName })
  }
}

$secretHelper = Join-Path $CodexHome 'infisical\Get-InfisicalSecrets.ps1'
$project = @(& $secretHelper -ListProjects) |
  Where-Object { $_.name -eq 'DonCity Server' } |
  Select-Object -First 1
if (-not $project) {
  throw 'Secret Master project DonCity Server was not found.'
}

$root = Get-SecretMap -Helper $secretHelper -ProjectId ([string]$project.id) -SecretPath '/'
$production = Get-SecretMap -Helper $secretHelper -ProjectId ([string]$project.id) -SecretPath '/production'
$staging = if ($Action -eq 'Verify') {
  @{}
} else {
  Get-SecretMap -Helper $secretHelper -ProjectId ([string]$project.id) -SecretPath '/staging'
}
$required = @(
  @{ map = $root; key = 'TIMEWEB_API_TOKEN' },
  @{ map = $root; key = 'DONCITY_DATABASE_NAME' },
  @{ map = $production; key = 'S3_BUCKET' }
)
if ($Action -ne 'Verify') {
  $required += @(
    @{ map = $staging; key = 'STAGING_DATABASE_NAME' },
    @{ map = $staging; key = 'S3_BUCKET' }
  )
}
foreach ($item in $required) {
  if ([string]::IsNullOrWhiteSpace($item.map[$item.key])) {
    throw "Required Secret Master key is missing: $($item.key)"
  }
}

$headers = @{ Authorization = "Bearer $($root.TIMEWEB_API_TOKEN)" }
$state = Get-CloudState `
  -Headers $headers `
  -ProductionDatabaseName $root.DONCITY_DATABASE_NAME `
  -StagingDatabaseName $(if ($staging.STAGING_DATABASE_NAME) { $staging.STAGING_DATABASE_NAME } else { '__retired_staging_database__' }) `
  -ProductionBucketName $production.S3_BUCKET `
  -StagingBucketName $(if ($staging.S3_BUCKET) { $staging.S3_BUCKET } else { '__retired_staging_bucket__' })

if ($Action -eq 'Inventory') {
  [pscustomobject]@{
    databaseClusterCount = $state.clusters.Count
    databaseInstanceCount = $state.instances.Count
    productionDatabaseMatches = $state.productionDatabases.Count
    stagingDatabaseMatches = $state.stagingDatabases.Count
    databasesAreDistinct = $state.productionDatabases.Count -eq 1 -and
      $state.stagingDatabases.Count -eq 1 -and
      $state.productionDatabases[0].id -ne $state.stagingDatabases[0].id
    databaseClusterIsShared = $state.productionDatabases.Count -eq 1 -and
      $state.stagingDatabases.Count -eq 1 -and
      $state.productionDatabases[0].clusterId -eq $state.stagingDatabases[0].clusterId
    bucketCount = $state.buckets.Count
    productionBucketMatches = $state.productionBuckets.Count
    stagingBucketMatches = $state.stagingBuckets.Count
    bucketsAreDistinct = $state.productionBuckets.Count -eq 1 -and
      $state.stagingBuckets.Count -eq 1 -and
      [string]$state.productionBuckets[0].id -ne [string]$state.stagingBuckets[0].id
    stagingBucketObjectCount = if ($state.stagingBuckets.Count -eq 1) {
      [int]$state.stagingBuckets[0].object_amount
    } else {
      $null
    }
  }
}

if ($Action -eq 'Retire') {
  if ($state.clusters.Count -ne 1) { throw 'Refusing: expected exactly one managed database cluster.' }
  if ($state.productionDatabases.Count -ne 1) { throw 'Refusing: production database identity is ambiguous.' }
  if ($state.stagingDatabases.Count -ne 1) { throw 'Refusing: staging database identity is ambiguous.' }
  if ($state.productionDatabases[0].id -eq $state.stagingDatabases[0].id) { throw 'Refusing: database identities are not distinct.' }
  if ($state.productionDatabases[0].clusterId -ne $state.stagingDatabases[0].clusterId) { throw 'Refusing: unexpected database topology.' }
  if ($state.productionBuckets.Count -ne 1) { throw 'Refusing: production bucket identity is ambiguous.' }
  if ($state.stagingBuckets.Count -ne 1) { throw 'Refusing: staging bucket identity is ambiguous.' }
  if ([string]$state.productionBuckets[0].id -eq [string]$state.stagingBuckets[0].id) { throw 'Refusing: bucket identities are not distinct.' }
  if ([int]$state.stagingBuckets[0].object_amount -ne 0) { throw 'Refusing: staging bucket is not empty.' }

  $stagingDatabase = $state.stagingDatabases[0]
  $stagingBucket = $state.stagingBuckets[0]
  $null = Invoke-TimewebApi `
    -Method Delete `
    -Path "/v1/databases/$($stagingDatabase.clusterId)/instances/$($stagingDatabase.id)" `
    -Headers $headers
  $null = Invoke-TimewebApi `
    -Method Delete `
    -Path "/v1/storages/buckets/$($stagingBucket.id)" `
    -Headers $headers

  $finalState = $null
  for ($attempt = 1; $attempt -le 20; $attempt++) {
    Start-Sleep -Seconds 2
    $finalState = Get-CloudState `
      -Headers $headers `
      -ProductionDatabaseName $root.DONCITY_DATABASE_NAME `
      -StagingDatabaseName $staging.STAGING_DATABASE_NAME `
      -ProductionBucketName $production.S3_BUCKET `
      -StagingBucketName $staging.S3_BUCKET
    if ($finalState.stagingDatabases.Count -eq 0 -and $finalState.stagingBuckets.Count -eq 0) {
      break
    }
  }

  if ($finalState.stagingDatabases.Count -ne 0) { throw 'Staging database deletion did not complete within the verification window.' }
  if ($finalState.stagingBuckets.Count -ne 0) { throw 'Staging bucket deletion did not complete within the verification window.' }
  if ($finalState.productionDatabases.Count -ne 1) { throw 'Production database proof failed after staging deletion.' }
  if ($finalState.productionBuckets.Count -ne 1) { throw 'Production bucket proof failed after staging deletion.' }
  [pscustomobject]@{
    stagingDatabase = 'absent'
    stagingBucket = 'absent'
    productionDatabaseMatches = $finalState.productionDatabases.Count
    productionBucketMatches = $finalState.productionBuckets.Count
    databaseClusterCount = $finalState.clusters.Count
    databaseInstanceCount = $finalState.instances.Count
    bucketCount = $finalState.buckets.Count
  }
}

if ($Action -eq 'Verify') {
  if ($state.stagingDatabases.Count -ne 0) { throw 'Staging database is still present.' }
  if ($state.stagingBuckets.Count -ne 0) { throw 'Staging bucket is still present.' }
  if ($state.productionDatabases.Count -ne 1) { throw 'Production database proof failed.' }
  if ($state.productionBuckets.Count -ne 1) { throw 'Production bucket proof failed.' }
  if ($state.instances.Count -ne 1) { throw 'Unexpected additional logical database remains.' }
  if ($state.buckets.Count -ne 1) { throw 'Unexpected additional storage bucket remains.' }
  [pscustomobject]@{
    stagingDatabase = 'absent'
    stagingBucket = 'absent'
    productionDatabaseMatches = $state.productionDatabases.Count
    productionBucketMatches = $state.productionBuckets.Count
    databaseClusterCount = $state.clusters.Count
    databaseInstanceCount = $state.instances.Count
    bucketCount = $state.buckets.Count
  }
}

$headers.Clear()
$root.Clear()
$production.Clear()
$staging.Clear()
