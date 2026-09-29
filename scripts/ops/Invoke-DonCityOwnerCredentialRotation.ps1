param(
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' }),
  [string]$SshProxyJump = ''
)

$ErrorActionPreference = 'Stop'
$projectId = 'ed72b1f6-f3dc-4393-9655-c873e60d8c72'
$secretPath = '/production'

function ConvertTo-PlainText([securestring]$SecureString) {
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
  try { [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr) }
  finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

function Invoke-InfisicalJson {
  param([string]$Method, [string]$Uri, [hashtable]$Headers, [object]$Body)
  $arguments = @{ Method = $Method; Uri = $Uri; Headers = $Headers; TimeoutSec = 30 }
  if ($null -ne $Body) {
    $arguments.ContentType = 'application/json'
    $arguments.Body = $Body | ConvertTo-Json -Depth 10
  }
  Invoke-RestMethod @arguments
}

function Set-SecretValue {
  param(
    [string]$BaseUrl,
    [hashtable]$Headers,
    [string]$Name,
    [string]$Value
  )
  $uri = "$BaseUrl/v3/secrets/raw/$Name"
  $body = @{
    workspaceId = $projectId
    environment = 'prod'
    secretPath = $secretPath
    type = 'shared'
    secretValue = $Value
    secretComment = 'Owner-authorized production credential rotation.'
  }
  try {
    Invoke-InfisicalJson -Method Post -Uri $uri -Headers $Headers -Body $body | Out-Null
  } catch {
    $status = [int]$_.Exception.Response.StatusCode
    if ($status -notin @(400, 409)) { throw }
    Invoke-InfisicalJson -Method Patch -Uri $uri -Headers $Headers -Body $body | Out-Null
  }
}

function Invoke-Psql {
  param([string]$Connection, [string]$Sql, [switch]$TuplesOnly)
  $arguments = @('-w', $Connection, '-v', 'ON_ERROR_STOP=1')
  if ($TuplesOnly) { $arguments += @('-At', '-F', "`t") }
  $arguments += @('-c', $Sql)
  $output = & psql @arguments
  if ($LASTEXITCODE -ne 0) { throw 'Production database operation failed.' }
  $output
}

$helper = Join-Path $CodexHome 'infisical\Get-InfisicalSecrets.ps1'
$rows = @(& $helper -ProjectId $projectId -Environment prod -SecretPath / -Recursive -ShowValues)
$secrets = @{}
foreach ($row in $rows) { $secrets[[string]$row.secretKey] = [string]$row.secretValue }
foreach ($name in @('DONCITY_SERVER_PRIVATE_IP', 'DONCITY_DEPLOY_USER', 'DONCITY_DEPLOY_SSH_KEY', 'DATABASE_URI')) {
  if ([string]::IsNullOrWhiteSpace($secrets[$name])) { throw "Missing required Secret Master key: $name" }
}

$ownerPassword = 'Dc!' + [Guid]::NewGuid().ToString('N') + '9a'
$env:DONCITY_TEMP_OWNER_PASSWORD = $ownerPassword
try {
  $hashJson = & node --input-type=module -e "import {generatePasswordSaltHash} from './node_modules/payload/dist/auth/strategies/local/generatePasswordSaltHash.js'; const value=await generatePasswordSaltHash({password:process.env.DONCITY_TEMP_OWNER_PASSWORD,isPasswordAuthenticated:true}); process.stdout.write(JSON.stringify(value));"
} finally {
  Remove-Item Env:DONCITY_TEMP_OWNER_PASSWORD -ErrorAction SilentlyContinue
}
$passwordHash = $hashJson | ConvertFrom-Json

$databaseUri = [Uri]$secrets.DATABASE_URI
$databaseUserInfo = $databaseUri.UserInfo.Split(':', 2)
$databaseUser = [Uri]::UnescapeDataString($databaseUserInfo[0])
$databasePassword = [Uri]::UnescapeDataString($databaseUserInfo[1])
$databaseName = $databaseUri.AbsolutePath.TrimStart('/')
$databasePort = if ($databaseUri.Port -gt 0) { $databaseUri.Port } else { 5432 }

$listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
$listener.Start()
$localPort = ([Net.IPEndPoint]$listener.LocalEndpoint).Port
$listener.Stop()

$tempRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$keyPath = Join-Path $tempRoot ("doncity-owner-{0}.key" -f [Guid]::NewGuid().ToString('N'))
if (-not $keyPath.StartsWith($tempRoot, [StringComparison]::OrdinalIgnoreCase)) {
  throw 'Unsafe temporary SSH key path.'
}

$ssh = $null
$ownerChanged = $false
$ownerId = $null
$oldHash = $null
$oldSalt = $null
$connection = "sslmode=require host=127.0.0.1 port=$localPort user=$databaseUser dbname=$databaseName"
try {
  $env:PGPASSWORD = $databasePassword
  $env:PGCONNECT_TIMEOUT = '10'
  $directConnection = "sslmode=require host=$($databaseUri.Host) port=$databasePort user=$databaseUser dbname=$databaseName"
  & psql -w $directConnection -At -c 'select 1;' 2>$null | Out-Null
  if ($LASTEXITCODE -eq 0) {
    $connection = $directConnection
  } else {
    [IO.File]::WriteAllText($keyPath, $secrets.DONCITY_DEPLOY_SSH_KEY, [Text.UTF8Encoding]::new($false))
    & icacls.exe $keyPath /inheritance:r /grant:r "$($env:USERNAME):(F)" | Out-Null
    if ($LASTEXITCODE -ne 0) { throw 'Unable to restrict temporary SSH key ACL.' }

    $start = [Diagnostics.ProcessStartInfo]::new()
    $start.FileName = 'ssh.exe'
    $start.UseShellExecute = $false
    $start.RedirectStandardError = $true
    $sshArguments = @()
    if (-not [string]::IsNullOrWhiteSpace($SshProxyJump)) {
      $sshArguments += @('-J', $SshProxyJump)
    }
    $sshArguments += @(
      '-i', $keyPath, '-N', '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes',
      '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ExitOnForwardFailure=yes',
      '-o', 'ConnectTimeout=15', '-L',
      "127.0.0.1:${localPort}:$($databaseUri.Host):${databasePort}",
      "$($secrets.DONCITY_DEPLOY_USER)@$($secrets.DONCITY_SERVER_SSH_HOST)"
    )
    foreach ($argument in $sshArguments) { [void]$start.ArgumentList.Add($argument) }
    $ssh = [Diagnostics.Process]::Start($start)
    $tunnelReady = $false
    for ($attempt = 1; $attempt -le 20; $attempt++) {
      if ($ssh.HasExited) { throw 'SSH database tunnel failed.' }
      $probe = [Net.Sockets.TcpClient]::new()
      try {
        $probe.Connect('127.0.0.1', $localPort)
        $tunnelReady = $true
        break
      } catch {
        Start-Sleep -Milliseconds 500
      } finally {
        $probe.Dispose()
      }
    }
    if (-not $tunnelReady) { throw 'SSH database tunnel did not become ready.' }
  }

  $record = @(Invoke-Psql -Connection $connection -TuplesOnly -Sql "select u.id,u.email,u.hash,u.salt from users u join users_roles r on r.parent_id=u.id where r.value='owner';")
  $record = @($record | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
  if ($record.Count -ne 1) { throw "Expected exactly one production owner, found $($record.Count)." }
  $parts = $record[0].Split("`t")
  if ($parts.Count -lt 4) { throw 'Unexpected owner record shape.' }
  $ownerId = [int]$parts[0]
  $ownerEmail = $parts[1]
  $oldHash = $parts[2]
  $oldSalt = $parts[3]

  Invoke-Psql -Connection $connection -Sql "begin; update users set hash='$($passwordHash.hash)',salt='$($passwordHash.salt)',login_attempts=0,lock_until=null,reset_password_token=null,reset_password_expiration=null,reset_password_requested_at=null,updated_at=now() where id=$ownerId; delete from users_sessions where _parent_id=$ownerId; commit;" | Out-Null
  $ownerChanged = $true

  $session = [Microsoft.PowerShell.Commands.WebRequestSession]::new()
  $login = Invoke-WebRequest -Uri 'https://doncity-home.ru/api/users/login' -Method Post `
    -ContentType 'application/json' -Headers @{ Origin = 'https://doncity-home.ru' } `
    -Body (@{ email = $ownerEmail; password = $ownerPassword } | ConvertTo-Json -Compress) `
    -WebSession $session -SkipHttpErrorCheck -TimeoutSec 30
  if ([int]$login.StatusCode -ne 200) { throw "Payload owner login failed with HTTP $([int]$login.StatusCode)." }

  $me = Invoke-WebRequest -Uri 'https://doncity-home.ru/api/users/me' `
    -Headers @{ Origin = 'https://doncity-home.ru' } -WebSession $session `
    -SkipHttpErrorCheck -TimeoutSec 30
  if ([int]$me.StatusCode -ne 200) { throw "Authenticated owner check failed with HTTP $([int]$me.StatusCode)." }
  $authenticated = $me.Content | ConvertFrom-Json
  if ('owner' -notin @($authenticated.user.roles)) { throw 'Authenticated account does not have the owner role.' }

  $config = Get-Content (Join-Path $CodexHome 'infisical\projects.json') -Raw | ConvertFrom-Json
  $credential = Import-Clixml (Join-Path $CodexHome 'infisical\codex-cursor-ai.credential.xml')
  $clientSecret = ConvertTo-PlainText $credential.Password
  $baseUrl = ([string]$config.baseUrl).TrimEnd('/')
  if ($baseUrl -notmatch '/api$') { $baseUrl += '/api' }
  try {
    $auth = Invoke-InfisicalJson -Method Post -Uri "$baseUrl/v1/auth/universal-auth/login" `
      -Headers @{} -Body @{ clientId = $credential.UserName; clientSecret = $clientSecret }
  } finally { $clientSecret = $null }
  $headers = @{ Authorization = "Bearer $($auth.accessToken)" }
  Set-SecretValue -BaseUrl $baseUrl -Headers $headers -Name 'PAYLOAD_OWNER_EMAIL' -Value $ownerEmail
  Set-SecretValue -BaseUrl $baseUrl -Headers $headers -Name 'PAYLOAD_OWNER_PASSWORD' -Value $ownerPassword

  $names = @(& $helper -ProjectId $projectId -Environment prod -SecretPath $secretPath -NamesOnly)
  if ('PAYLOAD_OWNER_EMAIL' -notin $names -or 'PAYLOAD_OWNER_PASSWORD' -notin $names) {
    throw 'Secret Master owner credential verification failed.'
  }

  [pscustomobject]@{
    owner_login = 'PASS'
    owner_role = 'PASS'
    secret_master = 'PASS'
    secret_path = $secretPath
    values_exposed = $false
    production_auth_mutation = 'owner-authorized'
  } | ConvertTo-Json -Compress
} catch {
  if ($ownerChanged -and $ownerId -and $oldHash -and $oldSalt) {
    try {
      $env:PGPASSWORD = $databasePassword
      Invoke-Psql -Connection $connection -Sql "update users set hash='$oldHash',salt='$oldSalt',login_attempts=0,lock_until=null,updated_at=now() where id=$ownerId;" | Out-Null
    } catch { }
  }
  throw
} finally {
  Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
  Remove-Item Env:PGCONNECT_TIMEOUT -ErrorAction SilentlyContinue
  if ($ssh -and -not $ssh.HasExited) { $ssh.Kill(); $ssh.WaitForExit() }
  if (Test-Path -LiteralPath $keyPath) { Remove-Item -LiteralPath $keyPath -Force }
  $ownerPassword = $null
  $databasePassword = $null
  $secrets = $null
}
