@echo off
echo Creating desktop shortcut...
echo.

set "TARGET=G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis\start.bat"
set "DESKTOP=%USERPROFILE%\Desktop"
set "SHORTCUT=%DESKTOP%\JARVIS.lnk"

powershell -Command "
$ws = New-Object -ComObject WScript.Shell; 
$sc = $ws.CreateShortcut('%SHORTCUT%'); 
$sc.TargetPath = '%TARGET%'; 
$sc.WorkingDirectory = 'G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis'; 
$sc.Description = 'Sovereign JARVIS Security Scanner'; 
$sc.IconLocation = '%SystemRoot%\System32\SHELL32.dll,15'; 
$sc.Save()"

if exist "%SHORTCUT%" (
    echo Success! Shortcut created on desktop.
) else (
    echo Failed to create shortcut.
)

pause
