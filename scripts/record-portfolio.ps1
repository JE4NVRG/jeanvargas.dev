# record-portfolio.ps1
# Records the entire desktop (or a specific monitor) for `Duration` seconds to MP4.
# Wraps ffmpeg gdigrab. Use it to capture localhost:3015 portfolio scrolled by hand,
# the Hermes Workspace logged in, or any product demo.
#
# Usage:
#   .\scripts\record-portfolio.ps1                       # 30s default to portfolio-demo.mp4
#   .\scripts\record-portfolio.ps1 -Duration 60          # 60s
#   .\scripts\record-portfolio.ps1 -Out my-demo.mp4
#   .\scripts\record-portfolio.ps1 -Monitor 2            # secondary monitor (DISPLAY2)
#
# Tips:
#   - Open Chrome on the monitor you want to record, navigate to the page, then run this.
#   - Once started, you have ~3 seconds to switch to the page before recording starts.
#   - Saves to public/videos/ so it can be embedded directly in the portfolio.

param(
    [int]$Duration = 30,
    [string]$Out = "portfolio-demo.mp4",
    [int]$Monitor = 1,
    [int]$Fps = 30
)

$ffmpeg = (Get-Command ffmpeg -ErrorAction SilentlyContinue).Source
if (-not $ffmpeg) {
    Write-Error "ffmpeg not found in PATH. Install via: winget install Gyan.FFmpeg"
    exit 1
}

# Resolve monitor coords
Add-Type -AssemblyName System.Windows.Forms
$screens = [System.Windows.Forms.Screen]::AllScreens
if ($Monitor -gt $screens.Count -or $Monitor -lt 1) {
    Write-Error "Invalid monitor $Monitor. Available: 1..$($screens.Count)"
    exit 1
}
$screen = $screens[$Monitor - 1]
$x = $screen.Bounds.X
$y = $screen.Bounds.Y
$w = $screen.Bounds.Width
$h = $screen.Bounds.Height

# Even dimensions required by libx264
if ($w % 2 -ne 0) { $w-- }
if ($h % 2 -ne 0) { $h-- }

# Output path
$outDir = "C:\Users\jeanc\ProjetoJean\Porfolio-Jean\public\videos"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }
$outPath = Join-Path $outDir $Out

"Recording monitor $Monitor ($($screen.DeviceName)): ${w}x${h} at +${x}+${y}"
"Duration: ${Duration}s @ ${Fps}fps"
"Output: $outPath"
"3 second countdown — switch to the page you want to record!"
3..1 | ForEach-Object { Write-Host "  $_..."; Start-Sleep 1 }
"Recording NOW. Scroll the page like you would for a portfolio video."

& $ffmpeg -y -f gdigrab -framerate $Fps -offset_x $x -offset_y $y -video_size "${w}x${h}" -i desktop `
    -t $Duration -c:v libx264 -preset fast -crf 23 -pix_fmt yuv420p `
    -movflags +faststart $outPath 2>$null

if (Test-Path $outPath) {
    $size = [math]::Round((Get-Item $outPath).Length / 1MB, 2)
    "DONE. $outPath ($size MB)"
} else {
    "FAILED"
}
