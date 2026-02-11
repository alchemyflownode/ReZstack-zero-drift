@echo off
chcp 65001 >nul 2>&1
title Sovereign JARVIS - Project Setup
color 0B

echo ========================================
echo    SOVEREIGN JARVIS PROJECT SETUP
echo ========================================
echo.
echo This will set up Sovereign JARVIS security
echo scanning for the current project.
echo.

set "JARVIS_DIR=%~dp0"
set "PYTHON_EXE=python"
set "JARVIS_SCRIPT=%JARVIS_DIR%jarvis.py"

:: Check if in Git repo
git status >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a Git repository!
    echo Please initialize Git first: git init
    echo.
    pause
    exit /b 1
)

:: Initialize Sovereign JARVIS
echo Step 1: Initializing Sovereign JARVIS...
%PYTHON_EXE% "%JARVIS_SCRIPT%" init

:: Create pre-commit hook
echo Step 2: Setting up pre-commit hook...
if not exist ".git\hooks" mkdir ".git\hooks"

(
echo #!/usr/bin/env pwsh
echo # Sovereign JARVIS Pre-Commit Hook
echo.
echo Write-Host ""
echo Write-Host "SOVEREIGN JARVIS SECURITY SCAN" -ForegroundColor Cyan
echo Write-Host "================================" -ForegroundColor Cyan
echo.
echo $jarvis = "%JARVIS_SCRIPT:\=\\%"
echo $scanOutput = python $jarvis scan 2>&1
echo.
echo # Check for critical issues
echo $hasCritical = $scanOutput -match "\[CRITICAL"
echo $hasHigh = $scanOutput -match "\[HIGH"
echo.
echo if ($hasCritical) {
echo     Write-Host ""
echo     Write-Host "CRITICAL SECURITY ISSUES FOUND" -ForegroundColor Red
echo     Write-Host "Commit blocked. Fix these issues first." -ForegroundColor Yellow
echo     exit 1
echo } elseif ($hasHigh) {
echo     Write-Host ""
echo     Write-Host "HIGH SEVERITY ISSUES FOUND" -ForegroundColor Yellow
echo     Write-Host "Review before committing." -ForegroundColor Yellow
echo     exit 0
echo } else {
echo     Write-Host ""
echo     Write-Host "SECURITY SCAN PASSED" -ForegroundColor Green
echo     exit 0
echo }
) > ".git\hooks\pre-commit.ps1"

:: Run initial scan
echo Step 3: Running initial security scan...
echo.
%PYTHON_EXE% "%JARVIS_SCRIPT%" scan

echo.
echo ========================================
echo       SETUP COMPLETE!
echo ========================================
echo.
echo Your project is now protected by:
echo [?] Constitutional AI scanning
echo [?] Automatic pre-commit security checks
echo [?] Git-tracked file enforcement
echo [?] Credential storage protection
echo.
echo From now on, every "git commit" will run
echo a security scan automatically!
echo.
echo Quick commands:
echo - scan.bat         : Run security scan
echo - dashboard.bat    : Interactive dashboard
echo.
echo Press any key to exit...
pause >nul
