@echo off
cls
echo ========================================
echo   CREATE DESKTOP SHORTCUT - SIMPLE
echo ========================================
echo.
echo This will create a desktop shortcut for
echo Sovereign JARVIS AI Co-Worker.
echo.

set "JARVIS_PATH=G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis"
set "SHORTCUT_FILE=%USERPROFILE%\Desktop\JARVIS AI Security.bat"

echo Creating shortcut: %SHORTCUT_FILE%
echo.

:: Create a batch file shortcut on desktop
(
echo @echo off
echo echo SOVEREIGN JARVIS - AI Security Co-Worker
echo echo ========================================
echo echo.
echo echo This shortcut launches from: %JARVIS_PATH%
echo echo.
echo echo Usage:
echo echo   1. First navigate to your Git project folder
echo echo   2. Then run the commands below
echo echo.
echo echo Commands:
echo echo   "%JARVIS_PATH%\jarvis.py" scan
echo echo   "%JARVIS_PATH%\jarvis.py" init
echo echo   "%JARVIS_PATH%\jarvis.py" constitution
echo echo.
echo pause
echo exit
) > "%SHORTCUT_FILE%"

:: Also create a simple launcher
set "LAUNCHER_FILE=%USERPROFILE%\Desktop\Launch JARVIS.bat"
(
echo @echo off
echo cd /d "%JARVIS_PATH%"
echo start.bat
) > "%LAUNCHER_FILE%"

if exist "%SHORTCUT_FILE%" (
    echo SUCCESS! Created 2 shortcuts on your desktop:
    echo   1. "JARVIS AI Security.bat" - Instructions
    echo   2. "Launch JARVIS.bat" - Quick launcher
    echo.
    echo Double-click "Launch JARVIS.bat" to start!
) else (
    echo FAILED to create shortcut.
)

echo.
echo ========================================
pause
