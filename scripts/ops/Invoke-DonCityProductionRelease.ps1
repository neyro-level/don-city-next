param(
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' })
)

$ErrorActionPreference = 'Stop'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..'))
Set-Location -LiteralPath $repoRoot

function Invoke-NativeProcess {
  param([string]$FileName, [string[]]$Arguments, [string]$StandardInput)
  $start = [System.Diagnostics.ProcessStartInfo]::new()
  $start.FileName = $FileName
  $start.UseShellExecute = $false
  $start.RedirectStandardOutput = $true
  $start.RedirectStandardError = $true
  if ($null -ne $StandardInput) { $start.RedirectStandardInput = $true }
  foreach ($argument in $Arguments) { [void]$start.ArgumentList.Add($argument) }
  $process = [System.Diagnostics.Process]::Start($start)
  if ($null -ne $StandardInput) {
    $process.StandardInput.Write($StandardInput)
    $process.StandardInput.Close()
  }
  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()
  if ($process.ExitCode -ne 0) { throw "$FileName failed with exit code $($process.ExitCode): $stderr" }
  $stdout
}

function Invoke-Ssh {
  param([string]$HostName, [string]$UserName, [string]$KeyPath, [string]$Command, [string]$StandardInput)
  $normalized = $Command -replace "`r`n", "`n"
  Invoke-NativeProcess -FileName 'ssh.exe' -Arguments @(
    '-i', $KeyPath, '-o', 'BatchMode=yes', '-o', 'IdentitiesOnly=yes',
    '-o', 'StrictHostKeyChecking=accept-new', '-o', 'ConnectTimeout=15',
    "$UserName@$HostName", $normalized
  ) -StandardInput $StandardInput
}

function Assert-HttpStatus {
  param([string]$Url, [int[]]$Allowed)
  $response = $null
  for ($attempt = 1; $attempt -le 10; $attempt += 1) {
    $response = Invoke-WebRequest -Uri $Url -MaximumRedirection 0 -TimeoutSec 20 -SkipHttpErrorCheck
    if ($Allowed -contains [int]$response.StatusCode) {
      return $response
    }
    if ([int]$response.StatusCode -notin @(502, 503, 504) -or $attempt -eq 10) {
      break
    }
    Start-Sleep -Seconds 3
  }
  throw "Unexpected HTTP $($response.StatusCode) for $Url after bounded release retries"
}

$branch = (& git branch --show-current).Trim()
$head = (& git rev-parse HEAD).Trim()
& git fetch --quiet origin main
$originMain = (& git rev-parse origin/main).Trim()
$status = (& git status --short)
if ($branch -ne 'main' -or $head -ne $originMain -or $status) {
  throw 'Production release requires a clean canonical main equal to origin/main.'
}

$short = $head.Substring(0, 12)
$imageRepository = 'pkg.sourcecraft.tech/cr/integrator-p/cn1h8kfcah4l5sn4enbm/don-city-next'
$image = "${imageRepository}:$head"
$migrationImage = "${imageRepository}:migration-$head"
$tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
$keyPath = Join-Path $tempRoot ("doncity-release-{0}.key" -f [guid]::NewGuid().ToString('N'))
if (-not $keyPath.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'Refusing to place release files outside the system temporary directory.'
}

$secretHelper = Join-Path $CodexHome 'infisical\Get-InfisicalSecrets.ps1'
$project = @(& $secretHelper -ListProjects) | Where-Object { $_.name -eq 'DonCity Server' } | Select-Object -First 1
if (-not $project) { throw 'Secret Master project DonCity Server was not found.' }
$rows = & $secretHelper -ProjectName 'DonCity Server' -ProjectId ([string]$project.id) -Environment prod -SecretPath '/' -ShowValues
$secrets = @{}
foreach ($row in $rows) { $secrets[[string]$row.secretKey] = [string]$row.secretValue }
foreach ($name in @('DONCITY_SERVER_SSH_HOST', 'DONCITY_DEPLOY_USER', 'DONCITY_DEPLOY_SSH_KEY', 'DONCITY_SOURCECRAFT_REGISTRY_TOKEN')) {
  if ([string]::IsNullOrWhiteSpace($secrets[$name])) { throw "Required Secret Master key is missing: $name" }
}

$remoteBackup = "/srv/doncity/production/compose.before-$short.yml"
$remoteAuthDir = "/tmp/doncity-registry-auth-$short"
$deployed = $false
try {
  [System.IO.File]::WriteAllText($keyPath, $secrets.DONCITY_DEPLOY_SSH_KEY, [System.Text.UTF8Encoding]::new($false))
  & icacls.exe $keyPath /inheritance:r /grant:r "$($env:USERNAME):(F)" | Out-Null
  if ($LASTEXITCODE -ne 0) { throw 'Unable to restrict the temporary SSH key ACL.' }

  node scripts/release-manifest.mjs
  if ($LASTEXITCODE -ne 0) { throw 'Release manifest failed.' }

  $registryLoginCommand = "set -eu; sudo -n rm -rf '$remoteAuthDir'; sudo -n install -d -m 700 '$remoteAuthDir'; sudo -n docker --config '$remoteAuthDir' login --username iam --password-stdin pkg.sourcecraft.tech >/dev/null"
  Invoke-Ssh -HostName $secrets.DONCITY_SERVER_SSH_HOST -UserName $secrets.DONCITY_DEPLOY_USER -KeyPath $keyPath -Command $registryLoginCommand -StandardInput $secrets.DONCITY_SOURCECRAFT_REGISTRY_TOKEN | Out-Null

  $deployCommand = @'
set -eu
production_dir='/srv/doncity/production'
compose_file="${production_dir}/compose.yml"
new_image='__IMAGE__'
migration_image='__MIGRATION_IMAGE__'
expected_revision='__REVISION__'
backup='__BACKUP__'
auth_dir='__AUTH_DIR__'
docker_cmd='sudo -n docker'
registry_docker="sudo -n docker --config $auth_dir"

cleanup_registry_auth() {
  $registry_docker logout pkg.sourcecraft.tech >/dev/null 2>&1 || true
  sudo -n rm -rf "$auth_dir"
}
trap cleanup_registry_auth EXIT

[ -z "$($docker_cmd ps -aq --filter 'name=^/doncity-staging-app$')" ] || { echo 'staging_runtime=present'; exit 22; }
[ ! -e '/srv/doncity/staging' ] || { echo 'staging_directory=present'; exit 23; }
production_id=$($docker_cmd ps -aq --filter 'name=^/doncity-production-app$')
[ "$(printf '%s\n' "$production_id" | sed '/^$/d' | wc -l)" -eq 1 ] || { echo 'production_runtime_count=invalid'; exit 24; }
previous_image=$($docker_cmd inspect --format '{{.Config.Image}}' "$production_id")
previous_health=$($docker_cmd inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}not-configured{{end}}' "$production_id")
[ "$previous_health" = 'healthy' ] || { echo 'production_preflight=unhealthy'; exit 25; }
sudo -n test -f "$compose_file" || { echo 'production_compose=missing'; exit 26; }
sudo -n test -f "${production_dir}/.env" || { echo 'production_env=missing'; exit 27; }
sudo -n test ! -e "$backup" || { echo 'rollback_point=already-exists'; exit 28; }

sudo -n systemctl start doncity-backup.service
backup_result=$(sudo -n systemctl show doncity-backup.service --property=Result --value)
backup_status=$(sudo -n systemctl show doncity-backup.service --property=ExecMainStatus --value)
[ "$backup_result" = 'success' ] || { echo "backup_service_result=$backup_result"; exit 29; }
[ "$backup_status" = '0' ] || { echo "backup_service_status=$backup_status"; exit 30; }

$registry_docker pull "$new_image" >/dev/null
$registry_docker pull "$migration_image" >/dev/null
loaded_revision=$($docker_cmd image inspect "$new_image" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')
[ "$loaded_revision" = "$expected_revision" ] || { echo 'loaded_revision=mismatch'; exit 31; }
migration_revision=$($docker_cmd image inspect "$migration_image" --format '{{index .Config.Labels "org.opencontainers.image.revision"}}')
[ "$migration_revision" = "$expected_revision" ] || { echo 'migration_revision=mismatch'; exit 38; }
new_digest=$($docker_cmd image inspect "$new_image" --format '{{index .RepoDigests 0}}')
migration_digest=$($docker_cmd image inspect "$migration_image" --format '{{index .RepoDigests 0}}')
[ -n "$new_digest" ] || { echo 'runtime_digest=missing'; exit 39; }
[ -n "$migration_digest" ] || { echo 'migration_digest=missing'; exit 40; }
migration_log="/tmp/doncity-migrate-$(printf '%s' "$expected_revision" | cut -c1-12).log"
if ! $docker_cmd run --rm --network host --read-only \
  --tmpfs '/tmp:rw,nosuid,size=128m,uid=1001,gid=1001,mode=1777' \
  --env-file "${production_dir}/.env" --env JOBS_AUTORUN=false \
  "$migration_digest" \
  >"$migration_log" 2>&1; then
  rm -f "$migration_log"
  echo 'migrations=failed'
  exit 32
fi
rm -f "$migration_log"
$docker_cmd image rm "$migration_image" "$migration_digest" >/dev/null 2>&1 || true
sudo -n cp "$compose_file" "$backup"
sudo -n sed -i "s|${previous_image}|${new_digest}|" "$compose_file"
sudo -n grep -Fq "$new_digest" "$compose_file" || { echo 'compose_image_update=failed'; exit 33; }
sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" up -d --no-deps app-production >/dev/null

healthy='false'
for attempt in $(seq 1 20); do
  current_id=$($docker_cmd ps -aq --filter 'name=^/doncity-production-app$')
  current_health=$($docker_cmd inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}not-configured{{end}}' "$current_id")
  if [ "$current_health" = 'healthy' ]; then healthy='true'; break; fi
  sleep 3
done
if [ "$healthy" != 'true' ]; then
  sudo -n cp "$backup" "$compose_file"
  sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" up -d --no-deps app-production >/dev/null
  echo 'rollback=executed'
  exit 34
fi

current_id=$($docker_cmd ps -q --filter 'name=^/doncity-production-app$')
current_image=$($docker_cmd inspect --format '{{.Config.Image}}' "$current_id")
current_revision=$($docker_cmd inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$current_id")
[ "$current_image" = "$new_digest" ] || { echo 'running_image=mismatch'; exit 35; }
[ "$current_revision" = "$expected_revision" ] || { echo 'running_revision=mismatch'; exit 36; }
jobs_owner_count=0
for container_id in $($docker_cmd ps -q); do
  if $docker_cmd inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$container_id" | grep -qx 'JOBS_AUTORUN=true'; then
    jobs_owner_count=$((jobs_owner_count + 1))
  fi
done
[ "$jobs_owner_count" -eq 1 ] || { echo "jobs_owner_count=$jobs_owner_count"; exit 37; }
printf 'backup_service_result=%s\n' "$backup_result"
printf 'migrations=success\n'
printf 'previous_image=%s\n' "$previous_image"
printf 'running_image=%s\n' "$current_image"
printf 'runtime_digest=%s\n' "$new_digest"
printf 'running_revision=%s\n' "$current_revision"
printf 'jobs_owner_count=%s\n' "$jobs_owner_count"
printf 'rollback_compose=%s\n' "$backup"
'@
  $deployCommand = $deployCommand.Replace('__IMAGE__', $image).Replace('__MIGRATION_IMAGE__', $migrationImage).Replace('__REVISION__', $head).Replace('__BACKUP__', $remoteBackup).Replace('__AUTH_DIR__', $remoteAuthDir)
  $deployOutput = Invoke-Ssh -HostName $secrets.DONCITY_SERVER_SSH_HOST -UserName $secrets.DONCITY_DEPLOY_USER -KeyPath $keyPath -Command $deployCommand
  $deployed = $true
  $deployOutput.Trim()

  $homeResponse = Assert-HttpStatus -Url 'https://doncity-home.ru/' -Allowed @(200)
  if ($homeResponse.Headers['X-Robots-Tag']) { throw 'Canonical homepage unexpectedly has a global X-Robots-Tag header.' }
  $robots = Assert-HttpStatus -Url 'https://doncity-home.ru/robots.txt' -Allowed @(200)
  if ($robots.Content -match '(?im)^Disallow:\s*/\s*$') { throw 'Production robots.txt still denies the entire site.' }
  $sitemap = Assert-HttpStatus -Url 'https://doncity-home.ru/sitemap.xml' -Allowed @(200)
  Assert-HttpStatus -Url 'https://doncity-home.ru/donetsk/' -Allowed @(200) | Out-Null
  foreach ($route in @('makeevka/', 'makeevka/kvartiry/', 'makeevka/doma/', 'makeevka/uchastki/')) {
    Assert-HttpStatus -Url "https://doncity-home.ru/$route" -Allowed @(200, 404) | Out-Null
  }
  Assert-HttpStatus -Url 'https://doncity-home.ru/makeevka/kommercheskaya/' -Allowed @(404) | Out-Null
  $propertyUrl = [regex]::Match($sitemap.Content, 'https://doncity-home\.ru/obekty/[^<]+').Value
  if ($propertyUrl) { Assert-HttpStatus -Url $propertyUrl -Allowed @(200) | Out-Null }

  "release_sha=$head"
  "registry_image=$image"
  'bounded_public_smoke=PASS'
} catch {
  if ($deployed) {
    $rollbackCommand = @'
set -eu
production_dir='/srv/doncity/production'
compose_file="${production_dir}/compose.yml"
backup='__BACKUP__'
sudo -n test -f "$backup"
sudo -n cp "$backup" "$compose_file"
sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" up -d --no-deps app-production >/dev/null
printf 'rollback=executed-after-smoke-failure\n'
'@
    $rollbackCommand = $rollbackCommand.Replace('__BACKUP__', $remoteBackup)
    Invoke-Ssh -HostName $secrets.DONCITY_SERVER_SSH_HOST -UserName $secrets.DONCITY_DEPLOY_USER -KeyPath $keyPath -Command $rollbackCommand
  }
  throw
} finally {
  if (Test-Path -LiteralPath $keyPath) {
    try {
      Invoke-Ssh -HostName $secrets.DONCITY_SERVER_SSH_HOST -UserName $secrets.DONCITY_DEPLOY_USER -KeyPath $keyPath -Command "sudo -n docker --config '$remoteAuthDir' logout pkg.sourcecraft.tech >/dev/null 2>&1 || true; sudo -n rm -rf '$remoteAuthDir'" | Out-Null
    } catch {
      Write-Warning 'Unable to confirm remote registry auth cleanup; inspect the bounded temporary auth directory.'
    }
  }
  if (Test-Path -LiteralPath $keyPath) { Remove-Item -LiteralPath $keyPath -Force }
  $secrets.Clear()
}
