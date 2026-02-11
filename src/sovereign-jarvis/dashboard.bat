@echo off
chcp 65001 >nul 2>&1
title Sovereign JARVIS - dashboard.py interactive
color 0F

set "JARVIS_DIR=%~dp0"
set "PYTHON_EXE=python"

cd /d "%JARVIS_DIR%"

echo ========================================
echo      SOVEREIGN JARVIS - DASHBOARD.PY INTERACTIVE
echo ========================================
echo.

%PYTHON_EXE% "dashboard.py interactive"

echo.
echo ========================================
echo Command completed. Press any key to exit...
pause >nul
