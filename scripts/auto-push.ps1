param(
  [int]$DebounceSeconds = 8,
  [string]$Branch = "main"
)

$root = (Get-Location).Path

# Initialize file system watcher
$fsw = New-Object System.IO.FileSystemWatcher $root, '*'
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

# Ignore noisy or unwanted paths
$ignorePatterns = @(
  '\\.git\\',
  '\\node_modules\\',
  '\\dist\\',
  '\\.cache\\',
  '\\.vite\\'
)

$script:pending = $false
$script:lastChange = Get-Date

function Should-Ignore($path) {
  foreach ($pat in $ignorePatterns) {
    if ($path -match $pat) { return $true }
  }
  return $false
}

Register-ObjectEvent $fsw Changed -Action {
  if (Should-Ignore $EventArgs.FullPath) { return }
  $script:pending = $true
  $script:lastChange = Get-Date
} | Out-Null

Register-ObjectEvent $fsw Created -Action {
  if (Should-Ignore $EventArgs.FullPath) { return }
  $script:pending = $true
  $script:lastChange = Get-Date
} | Out-Null

Register-ObjectEvent $fsw Deleted -Action {
  if (Should-Ignore $EventArgs.FullPath) { return }
  $script:pending = $true
  $script:lastChange = Get-Date
} | Out-Null

Register-ObjectEvent $fsw Renamed -Action {
  if (Should-Ignore $EventArgs.FullPath) { return }
  $script:pending = $true
  $script:lastChange = Get-Date
} | Out-Null

Write-Host "Auto-push watcher started in $root"
Write-Host "Debounce window: $DebounceSeconds s | Branch: $Branch"
Write-Host "Press Ctrl+C in this terminal to stop."

while ($true) {
  Start-Sleep -Seconds 2

  if ($script:pending -and ((Get-Date) - $script:lastChange).TotalSeconds -ge $DebounceSeconds) {
    $script:pending = $false

    try {
      $status = git status --porcelain
      if (-not [string]::IsNullOrWhiteSpace($status)) {
        git add -A | Out-Null
        $msg = "auto: save $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        git commit -m $msg | Out-Null
        git push -u origin $Branch
        Write-Host "Pushed changes: $msg"
      } else {
        Write-Host "No changes to commit."
      }
    } catch {
      Write-Host "Auto-push error: $($_.Exception.Message)" -ForegroundColor Red
    }
  }
}