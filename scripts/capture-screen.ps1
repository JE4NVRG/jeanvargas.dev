# capture-screen.ps1
# Capture a region of DISPLAY2 (where Chrome is) and save as PNG.
# Crops browser chrome (top tab bar + address bar ~88px).
#
# Usage: powershell -File capture-screen.ps1 -OutPath C:\path\out.png [-CropTop 88]

param(
    [Parameter(Mandatory = $true)][string]$OutPath,
    [int]$CropTop = 88
)

Add-Type -AssemblyName System.Windows.Forms, System.Drawing

# Resolve DISPLAY2 (Chrome lives there in this setup)
$screen = [System.Windows.Forms.Screen]::AllScreens | Where-Object { -not $_.Primary } | Select-Object -First 1
if (-not $screen) {
    Write-Error "No secondary monitor found"
    exit 1
}
$b = $screen.Bounds

$captureWidth  = $b.Width
$captureHeight = $b.Height - $CropTop

$bmp = New-Object System.Drawing.Bitmap $captureWidth, $captureHeight
$g   = [System.Drawing.Graphics]::FromImage($bmp)
$g.CopyFromScreen($b.X, $b.Y + $CropTop, 0, 0, [System.Drawing.Size]::new($captureWidth, $captureHeight))
$bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

"OK -> $OutPath ($captureWidth x $captureHeight)"
