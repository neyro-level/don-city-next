param(
  [ValidateSet('Inventory', 'RetireRuntime', 'VerifyRuntime', 'OperationalProof')]
  [string]$Action = 'Inventory',
  [string]$CodexHome = $(if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' })
)

$ErrorActionPreference = 'Stop'

function Get-SecretMap {
  param(
    [string]$Helper,
    [string]$ProjectId
  )

  $rows = & $Helper `
    -ProjectName 'DonCity Server' `
    -ProjectId $ProjectId `
    -Environment 'prod' `
    -SecretPath '/' `
    -ShowValues

  $map = @{}
  foreach ($row in $rows) {
    $map[[string]$row.secretKey] = [string]$row.secretValue
  }
  $map
}

function Invoke-SshCommand {
  param(
    [string]$HostName,
    [string]$UserName,
    [string]$PrivateKey,
    [string]$RemoteCommand
  )

  $tempRoot = [System.IO.Path]::GetFullPath([System.IO.Path]::GetTempPath())
  $keyPath = Join-Path $tempRoot ("doncity-codex-{0}.key" -f [guid]::NewGuid().ToString('N'))
  if (-not $keyPath.StartsWith($tempRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw 'Refusing to create an SSH key outside the system temporary directory.'
  }

  try {
    [System.IO.File]::WriteAllText($keyPath, $PrivateKey, [System.Text.UTF8Encoding]::new($false))
    & icacls.exe $keyPath /inheritance:r /grant:r "$($env:USERNAME):(F)" | Out-Null
    if ($LASTEXITCODE -ne 0) {
      throw 'Unable to restrict the temporary SSH key ACL.'
    }

    $start = [System.Diagnostics.ProcessStartInfo]::new()
    $start.FileName = 'ssh.exe'
    $start.UseShellExecute = $false
    $start.RedirectStandardOutput = $true
    $start.RedirectStandardError = $true
    foreach ($argument in @(
      '-i', $keyPath,
      '-o', 'BatchMode=yes',
      '-o', 'IdentitiesOnly=yes',
      '-o', 'StrictHostKeyChecking=accept-new',
      '-o', 'ConnectTimeout=15',
      "$UserName@$HostName",
      $RemoteCommand
    )) {
      [void]$start.ArgumentList.Add($argument)
    }

    $process = [System.Diagnostics.Process]::Start($start)
    $stdout = $process.StandardOutput.ReadToEnd()
    $stderr = $process.StandardError.ReadToEnd()
    $process.WaitForExit()
    if ($process.ExitCode -ne 0) {
      throw "SSH command failed with exit code $($process.ExitCode): $stderr"
    }
    $stdout
  } finally {
    if (Test-Path -LiteralPath $keyPath) {
      Remove-Item -LiteralPath $keyPath -Force
    }
    $PrivateKey = $null
  }
}

$secretHelper = Join-Path $CodexHome 'infisical\Get-InfisicalSecrets.ps1'
$project = @(& $secretHelper -ListProjects) |
  Where-Object { $_.name -eq 'DonCity Server' } |
  Select-Object -First 1
if (-not $project) {
  throw 'Secret Master project DonCity Server was not found.'
}

$secrets = Get-SecretMap -Helper $secretHelper -ProjectId ([string]$project.id)
$required = @(
  'DONCITY_SERVER_SSH_HOST',
  'DONCITY_DEPLOY_USER',
  'DONCITY_DEPLOY_SSH_KEY'
)
foreach ($key in $required) {
  if ([string]::IsNullOrWhiteSpace($secrets[$key])) {
    throw "Required Secret Master key is missing: $key"
  }
}

if ($Action -eq 'Inventory') {
  $remoteCommand = @'
set -eu
printf 'host=%s\n' "$(hostname)"
printf 'user=%s\n' "$(id -un)"
sudo -n docker ps -a --format '{{.ID}}|{{.Names}}|{{.Image}}|{{.Status}}'
for container_id in $(sudo -n docker ps -aq); do
  sudo -n docker inspect --format '{{.Name}}|{{index .Config.Labels "com.docker.compose.project"}}|{{index .Config.Labels "com.docker.compose.project.working_dir"}}|{{index .Config.Labels "com.docker.compose.project.config_files"}}|{{index .Config.Labels "com.docker.compose.service"}}' "$container_id"
done
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'RetireRuntime') {
  $remoteCommand = @'
set -eu
docker_cmd='sudo -n docker'
staging_name='doncity-staging-app'
production_name='doncity-production-app'
staging_dir='/srv/doncity/staging'
staging_compose='/srv/doncity/staging/compose.yml'

staging_count=$($docker_cmd ps -aq --filter "name=^/${staging_name}$" | wc -l)
production_count=$($docker_cmd ps -aq --filter "name=^/${production_name}$" | wc -l)
[ "$staging_count" -eq 1 ] || { echo 'refused: expected exactly one staging container' >&2; exit 21; }
[ "$production_count" -eq 1 ] || { echo 'refused: expected exactly one production container' >&2; exit 22; }

staging_id=$($docker_cmd ps -aq --filter "name=^/${staging_name}$")
production_id=$($docker_cmd ps -aq --filter "name=^/${production_name}$")
actual_project=$($docker_cmd inspect --format '{{index .Config.Labels "com.docker.compose.project"}}' "$staging_id")
actual_dir=$($docker_cmd inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' "$staging_id")
actual_compose=$($docker_cmd inspect --format '{{index .Config.Labels "com.docker.compose.project.config_files"}}' "$staging_id")
production_dir=$($docker_cmd inspect --format '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' "$production_id")
staging_image=$($docker_cmd inspect --format '{{.Config.Image}}' "$staging_id")

[ "$actual_project" = 'staging' ] || { echo 'refused: staging Compose project mismatch' >&2; exit 23; }
[ "$actual_dir" = "$staging_dir" ] || { echo 'refused: staging working directory mismatch' >&2; exit 24; }
[ "$actual_compose" = "$staging_compose" ] || { echo 'refused: staging Compose file mismatch' >&2; exit 25; }
[ "$production_dir" = '/srv/doncity/production' ] || { echo 'refused: production working directory mismatch' >&2; exit 26; }
[ "$actual_dir" != "$production_dir" ] || { echo 'refused: shared runtime directory' >&2; exit 27; }
[ "$(readlink -f "$staging_dir")" = "$staging_dir" ] || { echo 'refused: staging path is not canonical' >&2; exit 28; }
[ -f "$staging_compose" ] || { echo 'refused: staging Compose file missing' >&2; exit 29; }

sudo -n docker compose --project-name staging --project-directory "$staging_dir" -f "$staging_compose" down --volumes --remove-orphans
[ -z "$($docker_cmd ps -aq --filter "name=^/${staging_name}$")" ] || { echo 'staging container remains' >&2; exit 30; }

image_users=$($docker_cmd ps -aq --filter "ancestor=${staging_image}" | wc -l)
if [ "$image_users" -eq 0 ]; then
  $docker_cmd image rm "$staging_image" >/dev/null
fi

sudo -n find "$staging_dir" -xdev -mindepth 1 -depth -delete
sudo -n rmdir "$staging_dir"

production_running=$($docker_cmd inspect --format '{{.State.Running}}' "$production_id")
production_health=$($docker_cmd inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}not-configured{{end}}' "$production_id")
[ "$production_running" = 'true' ] || { echo 'production is not running' >&2; exit 31; }
[ "$production_health" = 'healthy' ] || { echo 'production is not healthy' >&2; exit 32; }
printf 'staging_runtime=absent\n'
printf 'staging_runtime_directory=absent\n'
printf 'staging_image_users=%s\n' "$image_users"
printf 'production_runtime=running\n'
printf 'production_health=%s\n' "$production_health"
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'VerifyRuntime') {
  $remoteCommand = @'
set -eu
docker_cmd='sudo -n docker'
[ -z "$($docker_cmd ps -aq --filter 'name=^/doncity-staging-app$')" ] || { echo 'staging_runtime=present'; exit 41; }
[ ! -e '/srv/doncity/staging' ] || { echo 'staging_runtime_directory=present'; exit 42; }
production_id=$($docker_cmd ps -aq --filter 'name=^/doncity-production-app$')
[ "$(printf '%s\n' "$production_id" | sed '/^$/d' | wc -l)" -eq 1 ] || { echo 'production_runtime_count=invalid'; exit 43; }
production_running=$($docker_cmd inspect --format '{{.State.Running}}' "$production_id")
production_health=$($docker_cmd inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}not-configured{{end}}' "$production_id")
[ "$production_running" = 'true' ] || { echo 'production_runtime=stopped'; exit 44; }
[ "$production_health" = 'healthy' ] || { echo 'production_health=unhealthy'; exit 45; }
printf 'staging_runtime=absent\n'
printf 'staging_runtime_directory=absent\n'
printf 'production_runtime_count=1\n'
printf 'production_runtime=running\n'
printf 'production_health=%s\n' "$production_health"
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'OperationalProof') {
  $remoteCommand = @'
set -eu
docker_cmd='sudo -n docker'
running_ids=$($docker_cmd ps -q)
jobs_owner_count=0
jobs_owner_name=''
for container_id in $running_ids; do
  if $docker_cmd inspect --format '{{range .Config.Env}}{{println .}}{{end}}' "$container_id" | grep -qx 'JOBS_AUTORUN=true'; then
    jobs_owner_count=$((jobs_owner_count + 1))
    jobs_owner_name=$($docker_cmd inspect --format '{{.Name}}' "$container_id" | sed 's#^/##')
  fi
done
[ "$jobs_owner_count" -eq 1 ] || { echo "jobs_owner_count=$jobs_owner_count"; exit 51; }
[ "$jobs_owner_name" = 'doncity-production-app' ] || { echo 'jobs_owner=unexpected'; exit 52; }

timer_enabled=$(sudo -n systemctl is-enabled doncity-backup.timer)
timer_active=$(sudo -n systemctl is-active doncity-backup.timer)
service_result=$(sudo -n systemctl show doncity-backup.service --property=Result --value)
service_status=$(sudo -n systemctl show doncity-backup.service --property=ExecMainStatus --value)
[ "$timer_enabled" = 'enabled' ] || { echo "backup_timer_enabled=$timer_enabled"; exit 53; }
[ "$timer_active" = 'active' ] || { echo "backup_timer_active=$timer_active"; exit 54; }
[ "$service_result" = 'success' ] || { echo "backup_service_result=$service_result"; exit 55; }
[ "$service_status" = '0' ] || { echo "backup_service_status=$service_status"; exit 56; }

printf 'running_container_count=%s\n' "$(printf '%s\n' "$running_ids" | sed '/^$/d' | wc -l)"
printf 'jobs_owner_count=%s\n' "$jobs_owner_count"
printf 'jobs_owner=production\n'
printf 'backup_timer_enabled=%s\n' "$timer_enabled"
printf 'backup_timer_active=%s\n' "$timer_active"
printf 'backup_service_result=%s\n' "$service_result"
printf 'backup_service_status=%s\n' "$service_status"
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

$secrets.Clear()
