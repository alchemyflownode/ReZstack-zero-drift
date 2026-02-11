@echo off
chcp 65001 >nul 2>&1
title Remove Sovereign JARVIS from Context Menu
color 0C

echo ========================================
echo   REMOVE SOVEREIGN JARVIS FROM CONTEXT
echo ========================================
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

echo Removing context menu entries...

:: Remove registry entries
reg delete "HKCR\Directory\shell\SovereignJARVIS" /f >nul 2>&1
reg delete "HKCR\Drive\shell\SovereignJARVIS" /f >nul 2>&1

echo.
echo [SUCCESS] Context menu removed!
echo.
echo Press any key to exit...
pause >nul
