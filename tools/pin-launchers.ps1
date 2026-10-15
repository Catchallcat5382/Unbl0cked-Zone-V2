param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[0-9a-fA-F]{7,40}$')]
  [string]$Revision
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'build-download.ps1') -Revision $Revision
if ($LASTEXITCODE -ne 0) { throw 'Could not build the self-contained download.' }

$classPath = Join-Path $repo 'assets\class.html'
$classPage = [IO.File]::ReadAllText($classPath)
$classUpdated = [regex]::Replace(
  $classPage,
  'var _revision = "[^"]+";',
  "var _revision = `"$Revision`";",
  1
)
if ($classUpdated -eq $classPage) { throw 'Could not update assets/class.html.' }
[IO.File]::WriteAllText($classPath, $classUpdated, $utf8)

Write-Output "Pinned launchers to $Revision."
