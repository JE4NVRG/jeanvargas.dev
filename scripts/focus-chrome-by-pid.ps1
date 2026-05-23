param([Parameter(Mandatory)][int]$Pid)

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
}
'@ -ErrorAction SilentlyContinue

# Minimize Codex/Claude/Notepad first
foreach ($name in @("Codex","claude","Notepad")) {
    Get-Process -Name $name -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | ForEach-Object {
        [Win32]::ShowWindow($_.MainWindowHandle, [Win32]::SW_MINIMIZE) | Out-Null
    }
}
Start-Sleep -Milliseconds 200

$proc = Get-Process -Id $Pid -ErrorAction SilentlyContinue
if (-not $proc -or $proc.MainWindowHandle -eq 0) { Write-Error "Bad PID or no window"; exit 1 }
$h = $proc.MainWindowHandle
[Win32]::ShowWindowAsync($h, [Win32]::SW_RESTORE) | Out-Null
[Win32]::SwitchToThisWindow($h, $true) | Out-Null
[Win32]::SetForegroundWindow($h) | Out-Null
[Win32]::BringWindowToTop($h) | Out-Null
Start-Sleep -Milliseconds 800

$front = [Win32]::GetForegroundWindow()
$frontProc = Get-Process | Where-Object { $_.MainWindowHandle -eq $front }
"Target PID=$Pid '$($proc.MainWindowTitle)'. Frontmost: PID=$($frontProc.Id) '$($frontProc.MainWindowTitle)'"
