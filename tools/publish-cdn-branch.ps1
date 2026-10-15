param(
  [string]$Branch = 'cdn'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$paths = @(
  'index.html',
  'unblocked zone v2.html',
  'assets/class.html',
  'assets/index.html',
  'assets/community/community.css',
  'assets/community/config.js',
  'assets/community/community.js',
  'assets/community/auth-gate.js',
  'assets/logo.png',
  'assets/vendor/firebase-app-compat.js',
  'assets/vendor/firebase-auth-compat.js',
  'assets/vendor/firebase-firestore-compat.js'
)

Push-Location $root
$oldIndex = $env:GIT_INDEX_FILE
$indexPath = Join-Path $env:TEMP ('uz-cdn-index-' + [guid]::NewGuid().ToString('N'))
try {
  $env:GIT_INDEX_FILE = $indexPath
  & git read-tree --empty
  if ($LASTEXITCODE -ne 0) { throw 'Could not initialize the CDN branch index.' }

  & git add -- @paths
  if ($LASTEXITCODE -ne 0) { throw 'Could not stage the CDN shell files.' }

  $tree = (& git write-tree).Trim()
  if ($LASTEXITCODE -ne 0 -or -not $tree) { throw 'Could not create the CDN branch tree.' }

  $parent = ''
  $remoteOutput = @(& git ls-remote --heads origin ('refs/heads/' + $Branch))
  $remoteLine = ($remoteOutput -join "`n").Trim()
  if ($LASTEXITCODE -ne 0) { throw 'Could not inspect the remote CDN branch.' }
  if ($remoteLine) {
    & git fetch --quiet origin ('refs/heads/' + $Branch + ':refs/remotes/origin/' + $Branch)
    if ($LASTEXITCODE -ne 0) { throw 'Could not fetch the existing CDN branch.' }
    $parent = (& git rev-parse ('refs/remotes/origin/' + $Branch)).Trim()
    $parentTree = (& git rev-parse ($parent + '^{tree}')).Trim()
    if ($parentTree -eq $tree) {
      Write-Host "CDN branch is already current at $parent."
      exit 0
    }
  }

  $args = @('commit-tree', $tree)
  if ($parent) { $args += @('-p', $parent) }
  $message = 'Publish lightweight CDN shell'
  $commit = ($message | & git @args).Trim()
  if ($LASTEXITCODE -ne 0 -or -not $commit) { throw 'Could not create the CDN branch commit.' }

  & git push origin ($commit + ':refs/heads/' + $Branch)
  if ($LASTEXITCODE -ne 0) { throw 'Could not push the CDN branch.' }
  Write-Host "Published lightweight CDN branch at $commit."
} finally {
  if ($null -eq $oldIndex) { Remove-Item Env:GIT_INDEX_FILE -ErrorAction SilentlyContinue } else { $env:GIT_INDEX_FILE = $oldIndex }
  Remove-Item -LiteralPath $indexPath -Force -ErrorAction SilentlyContinue
  Pop-Location
}
