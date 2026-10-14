param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[0-9a-fA-F]{7,40}$')]
  [string]$Revision
)

$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

$launcherPath = Join-Path $repo 'unblocked zone v2.html'
$launcher = [IO.File]::ReadAllText($launcherPath)
$launcherUpdated = [regex]::Replace(
  $launcher,
  'var buildRevision = ''[^'']+'';',
  "var buildRevision = '$Revision';",
  1
)
if ($launcherUpdated -eq $launcher) { throw 'Could not update unblocked zone v2.html.' }
[IO.File]::WriteAllText($launcherPath, $launcherUpdated, $utf8)

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
