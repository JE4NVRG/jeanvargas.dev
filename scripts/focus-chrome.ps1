# focus-chrome.ps1
# Minimize known top-stealers (Codex, Claude, Notepad) then bring Chrome to foreground.
# Workaround: Codex Electron window steals focus repeatedly on this machine.

Add-Type @'
using System;
using System.Runtime.InteropServices;
public static class Win32 {
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool SwitchToThisWindow(IntPtr hWnd, bool fAltTab);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    public const int SW_RESTORE = 9;
    public const int SW_MINIMIZE = 6;
    public const int SW_SHOW = 5;
}
'@ -ErrorAction SilentlyContinue

# Minimize known focus-stealers
$stealers = @("Codex", "claude", "Notepad")
foreach ($name in $stealers) {
    $procs = Get-Process -Name $name -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 }
    foreach ($p in $procs) {
        [Win32]::ShowWindow($p.MainWindowHandle, [Win32]::SW_MINIMIZE) | Out-Null
    }
}
Start-Sleep -Milliseconds 200

# Now bring Chrome to front
$chrome = Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Sort-Object { $_.MainWindowTitle.Length } -Descending | Select-Object -First 1
if (-not $chrome) {
    Write-Error "No Chrome window found"
    exit 1
}

$h = $chrome.MainWindowHandle
[Win32]::ShowWindowAsync($h, [Win32]::SW_RESTORE) | Out-Null
[Win32]::SwitchToThisWindow($h, $true) | Out-Null
[Win32]::SetForegroundWindow($h) | Out-Null
[Win32]::BringWindowToTop($h) | Out-Null
Start-Sleep -Milliseconds 800

$front = [Win32]::GetForegroundWindow()
$frontProc = Get-Process | Where-Object { $_.MainWindowHandle -eq $front }
"Chrome PID=$($chrome.Id) - '$($chrome.MainWindowTitle)'. Frontmost now: '$($frontProc.MainWindowTitle)' (PID=$($frontProc.Id))"
