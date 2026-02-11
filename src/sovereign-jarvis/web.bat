@echo off
chcp 65001 >nul 2>&1
title Sovereign JARVIS - web-dashboard\server.py
color 0F

set "JARVIS_DIR=%~dp0"
set "PYTHON_EXE=python"

cd /d "%JARVIS_DIR%"

echo ========================================
echo      SOVEREIGN JARVIS - WEB-DASHBOARD\SERVER.PY
echo ========================================
echo.

%PYTHON_EXE% "web-dashboard\server.py"

echo.
echo ========================================
echo Command completed. Press any key to exit...
pause >nul
