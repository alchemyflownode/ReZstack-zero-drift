@echo off
chcp 65001 >nul 2>&1
title Sovereign JARVIS - Constitutional AI Co-Worker
color 0F

:: Set paths
set "JARVIS_DIR=%~dp0"
set "PYTHON_EXE=python"
set "JARVIS_SCRIPT=%JARVIS_DIR%jarvis.py"

:menu
cls
echo ========================================
echo      SOVEREIGN JARVIS - MAIN MENU
echo ========================================
echo.
echo [1] Run Security Scan
echo [2] Interactive Dashboard
echo [3] View Constitution
echo [4] View Audit Trail
echo [5] Execute Task
echo [6] Initialize Workspace
echo [7] Web Dashboard
echo [8] Help / About
echo [9] Exit
echo.
echo ========================================

set /p choice="Select option (1-9): "

if "%choice%"=="1" goto scan
if "%choice%"=="2" goto dashboard
if "%choice%"=="3" goto constitution
if "%choice%"=="4" goto audit
if "%choice%"=="5" goto execute
if "%choice%"=="6" goto init
if "%choice%"=="7" goto webdashboard
if "%choice%"=="8" goto help
if "%choice%"=="9" goto end

echo Invalid choice! Press any key to try again...
pause >nul
goto menu

:scan
cls
echo ========================================
echo        RUNNING SECURITY SCAN
echo ========================================
echo.
%PYTHON_EXE% "%JARVIS_SCRIPT%" scan
echo.
echo ========================================
echo Scan complete. Press any key to continue...
pause >nul
goto menu

:dashboard
cls
echo ========================================
echo     INTERACTIVE DASHBOARD MODE
echo ========================================
echo.
%PYTHON_EXE% "%JARVIS_DIR%dashboard.py" interactive
echo.
echo Dashboard closed. Press any key to continue...
pause >nul
goto menu

:constitution
cls
echo ========================================
echo        CONSTITUTIONAL RULES
echo ========================================
echo.
%PYTHON_EXE% "%JARVIS_SCRIPT%" constitution
echo.
echo Press any key to continue...
pause >nul
goto menu

:audit
cls
echo ========================================
echo          AUDIT TRAIL VIEW
echo ========================================
echo.
%PYTHON_EXE% "%JARVIS_SCRIPT%" audit
echo.
echo Press any key to continue...
pause >nul
goto menu

:execute
cls
echo ========================================
echo       EXECUTE SOVEREIGN TASK
echo ========================================
echo.
echo This will execute a constitutional task.
echo.
set /p TARGET="Enter target file: "
set /p ACTION="Enter action (modify/create): "
set /p CONTENT="Enter content (or leave empty for multi-line): "
set /p TASK_ID="Enter task ID (optional): "

if "%TASK_ID%"=="" set "TASK_ID=manual_task"

if "%CONTENT%"=="" (
    echo.
    echo Enter content (press Ctrl+Z then Enter when done):
    set "CONTENT="
    setlocal enabledelayedexpansion
    for /f "delims=" %%a in ('more') do (
        if "!CONTENT!"=="" (
            set "CONTENT=%%a"
        ) else (
            set "CONTENT=!CONTENT!&echo.&%%a"
        )
    )
    endlocal
)

echo.
echo Executing task...
%PYTHON_EXE% "%JARVIS_SCRIPT%" execute --task-id "%TASK_ID%" --action "%ACTION%" --target "%TARGET%" --content "%CONTENT%"
echo.
echo Press any key to continue...
pause >nul
goto menu

:init
cls
echo ========================================
echo     INITIALIZE SOVEREIGN WORKSPACE
echo ========================================
echo.
echo This will initialize Sovereign JARVIS in current directory.
echo Make sure you're in a Git repository!
echo.
pause
%PYTHON_EXE% "%JARVIS_SCRIPT%" init
echo.
echo Press any key to continue...
pause >nul
goto menu

:webdashboard
cls
echo ========================================
echo      STARTING WEB DASHBOARD
echo ========================================
echo.
echo Starting web dashboard on http://localhost:3000
echo Press Ctrl+C in this window to stop the server.
echo.
cd /d "%JARVIS_DIR%web-dashboard"
%PYTHON_EXE% server.py
echo.
echo Web dashboard stopped. Press any key to continue...
pause >nul
goto menu

:help
cls
echo ========================================
echo        SOVEREIGN JARVIS - HELP
echo ========================================
echo.
echo WHAT IS SOVEREIGN JARVIS?
echo - Constitutional AI co-worker that scans your code
echo - Finds security issues (passwords, API keys, etc.)
echo - Respects boundaries (only scans Git-tracked files)
echo - Requires human approval for changes
echo.
echo QUICK START:
echo 1. Navigate to your project folder
echo 2. Run jarvis.bat
echo 3. Select [6] Initialize Workspace
echo 4. From now on, every git commit is security-checked!
echo.
echo COMMANDS:
echo - jarvis scan          : Security scan
echo - jarvis dashboard     : Interactive terminal UI
echo - jarvis web           : Web dashboard
echo - jarvis init          : Initialize in current folder
echo.
echo Press any key to continue...
pause >nul
goto menu

:end
cls
echo ========================================
echo    Thank you for using Sovereign JARVIS
echo      Your AI Co-Worker is standing by
echo ========================================
echo.
timeout /t 2 /nobreak >nul
exit
