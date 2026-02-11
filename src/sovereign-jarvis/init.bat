@echo off
chcp 65001 >nul 2>&1
title Sovereign JARVIS - init
color 0F

set "JARVIS_DIR=%~dp0"
set "PYTHON_EXE=python"

cd /d "%JARVIS_DIR%"

echo ========================================
echo      SOVEREIGN JARVIS - INIT
echo ========================================
echo.

%PYTHON_EXE% "init"

echo.
echo ========================================
echo Command completed. Press any key to exit...
pause >nul
