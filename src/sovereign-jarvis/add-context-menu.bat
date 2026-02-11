@echo off
chcp 65001 >nul 2>&1
title Add Sovereign JARVIS to Context Menu
color 0E

echo ========================================
echo   ADD SOVEREIGN JARVIS TO CONTEXT MENU
echo ========================================
echo.
echo This will add "Scan with JARVIS" to your
echo right-click context menu for folders.
echo.
echo WARNING: This requires administrator privileges.
echo.

:: Check admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [ERROR] Please run as Administrator!
    echo Right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

set "JARVIS_DIR=%~dp0"
set "JARVIS_BAT=%JARVIS_DIR%jarvis.bat"

:: Create registry entries
echo Adding context menu entries...

:: For directories
reg add "HKCR\Directory\shell\SovereignJARVIS" /ve /d "Scan with JARVIS" /f
reg add "HKCR\Directory\shell\SovereignJARVIS\command" /ve /d "\"%JARVIS_BAT%\" \"%%1\"" /f

:: For drive root
reg add "HKCR\Drive\shell\SovereignJARVIS" /ve /d "Scan with JARVIS" /f
reg add "HKCR\Drive\shell\SovereignJARVIS\command" /ve /d "\"%JARVIS_BAT%\" \"%%1\"" /f

echo.
echo [SUCCESS] Context menu added!
echo.
echo Now you can right-click any folder and select
echo "Scan with JARVIS" to run security checks.
echo.
echo To remove, run: remove-context-menu.bat
echo.
echo Press any key to exit...
pause >nul
