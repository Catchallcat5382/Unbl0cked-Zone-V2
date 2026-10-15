param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[0-9a-fA-F]{7,40}$')]
  [string]$Revision
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)
$sourcePath = Join-Path $root 'assets\index.html'
$outputPath = Join-Path $root 'unblocked zone v2.html'
$html = [IO.File]::ReadAllText($sourcePath, $utf8)

$baseHref = 'https://cdn.jsdelivr.net/gh/Catchallcat5382/Unbl0cked-Zone-V2@cdn/assets/'
$head = '<head$1>' + [Environment]::NewLine + ('  <base href="{0}">' -f $baseHref) + [Environment]::NewLine + ("  <script>window.UZ_BUILD_REVISION = '{0}';</script>" -f $Revision)
$headPattern = [regex]::new('<head([^>]*)>')
$html = $headPattern.Replace($html, $head, 1)

$css = [IO.File]::ReadAllText((Join-Path $root 'assets\community\community.css'), $utf8).Replace('</style', '<\/style')
$cssReplacement = '<style id="community-inline-css">' + $css + '</style>'
$cssPattern = [regex]::new('<link\s+rel=["'']stylesheet["'']\s+href=["'']community/community\.css["'']\s*>')
$html = $cssPattern.Replace(
  $html,
  [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $cssReplacement },
  1
)

$vendorFiles = @('firebase-app-compat.js', 'firebase-auth-compat.js', 'firebase-firestore-compat.js')
foreach ($name in $vendorFiles) {
  $code = [IO.File]::ReadAllText((Join-Path $root ('assets\vendor\' + $name)), $utf8).Replace('</script', '<\/script')
  $pattern = [regex]::new('<script\s+src=["'']vendor/' + [regex]::Escape($name) + '["'']\s*></script>')
  $replacement = '<script data-inline="vendor/' + $name + '">' + $code + '</script>'
  $html = $pattern.Replace(
    $html,
    [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $replacement },
    1
  )
}

$logoBytes = [IO.File]::ReadAllBytes((Join-Path $root 'assets\logo.png'))
$logoUri = 'data:image/png;base64,' + [Convert]::ToBase64String($logoBytes)
$html = $html.Replace('logo.png', $logoUri)
$titlePattern = [regex]::new('<title>[^<]*</title>')
$html = $titlePattern.Replace($html, '<title>New Tab</title>', 1)

[IO.File]::WriteAllText($outputPath, $html, $utf8)
Write-Output "Built self-contained download: $outputPath"
