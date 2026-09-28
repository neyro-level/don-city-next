param(
  [ValidateSet('Inventory', 'ProductionContract', 'ProductionPreflight', 'OperationalProof', 'CleanupFailedTransport', 'CleanupFailedRelease')]
  [string]$Action = 'Inventory',
  [ValidatePattern('^[0-9a-f]{12}$')]
  [string]$ReleaseShortSha,
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

  # PowerShell here-strings use Windows CRLF. Normalize before passing a
  # multi-line command to the Linux host; otherwise Bash receives literal CR
  # bytes in control-flow tokens (for example `do\r`) and refuses the command.
  $RemoteCommand = $RemoteCommand -replace "`r`n", "`n"

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
  sudo -n docker inspect --format '{{.Name}}|{{index .Config.Labels "com.docker.compose.project"}}|{{index .Config.Labels "com.docker.compose.project.working_dir"}}|{{index .Config.Labels "com.docker.compose.project.config_files"}}|{{index .Config.Labels "com.docker.compose.service"}}|{{.Image}}|{{index .Config.Labels "org.opencontainers.image.revision"}}' "$container_id"
done
printf 'staging_container_count=%s\n' "$(sudo -n docker ps -aq --filter 'name=^/doncity-staging-app$' | wc -l)"
if sudo -n test -d /srv/doncity/staging; then printf 'staging_runtime_directory=present\n'; else printf 'staging_runtime_directory=absent\n'; fi
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'ProductionContract') {
  $remoteCommand = @'
set -eu
production_dir='/srv/doncity/production'
compose_file="${production_dir}/compose.yml"
[ "$(readlink -f "$production_dir")" = "$production_dir" ] || { echo 'production_directory=invalid'; exit 11; }
sudo -n test -f "$compose_file" || { echo 'production_compose=missing'; exit 12; }
printf 'compose_project=production\n'
printf 'compose_service_count=%s\n' "$(sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" config --services | wc -l)"
printf 'compose_services=%s\n' "$(sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" config --services | paste -sd, -)"
printf 'compose_images=%s\n' "$(sudo -n docker compose --project-name production --project-directory "$production_dir" -f "$compose_file" config --images | paste -sd, -)"
printf 'env_file_present=%s\n' "$(if sudo -n test -f "${production_dir}/.env"; then echo yes; else echo no; fi)"
'@
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'ProductionPreflight') {
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

if ($Action -eq 'CleanupFailedTransport') {
  if (-not $ReleaseShortSha) {
    throw 'CleanupFailedTransport requires ReleaseShortSha.'
  }
  $remoteCommand = @'
set -eu
rm -f '/tmp/doncity-release-__SHORT__.tar' '/tmp/doncity-release-__SHORT__.tar.gz'
printf 'failed_transport=absent\n'
'@.Replace('__SHORT__', $ReleaseShortSha)
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

if ($Action -eq 'CleanupFailedRelease') {
  if (-not $ReleaseShortSha) {
    throw 'CleanupFailedRelease requires ReleaseShortSha.'
  }
  $remoteCommand = @'
set -eu
docker_cmd='sudo -n docker'
target_image='don-city-next:production-__SHORT__'
backup='/srv/doncity/production/compose.before-__SHORT__.yml'
running_id=$($docker_cmd ps -q --filter 'name=^/doncity-production-app$')
[ -n "$running_id" ] || { echo 'production_runtime=missing'; exit 61; }
running_image=$($docker_cmd inspect --format '{{.Config.Image}}' "$running_id")
[ "$running_image" != "$target_image" ] || { echo 'cleanup_refused=release-is-running'; exit 62; }
rm -f '/tmp/doncity-release-__SHORT__.tar' '/tmp/doncity-release-__SHORT__.tar.gz'
sudo -n rm -f "$backup"
if $docker_cmd image inspect "$target_image" >/dev/null 2>&1; then
  [ "$($docker_cmd ps -aq --filter "ancestor=${target_image}" | wc -l)" -eq 0 ] || { echo 'cleanup_refused=image-in-use'; exit 63; }
  $docker_cmd image rm "$target_image" >/dev/null
fi
printf 'failed_release_artifacts=absent\n'
printf 'production_image=%s\n' "$running_image"
'@.Replace('__SHORT__', $ReleaseShortSha)
  Invoke-SshCommand `
    -HostName $secrets.DONCITY_SERVER_SSH_HOST `
    -UserName $secrets.DONCITY_DEPLOY_USER `
    -PrivateKey $secrets.DONCITY_DEPLOY_SSH_KEY `
    -RemoteCommand $remoteCommand
}

$secrets.Clear()
