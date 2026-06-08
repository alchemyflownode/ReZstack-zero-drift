@echo off
chcp 65001 >nul
title RezStack Sovereign Control Panel
color 0A

:MAIN_MENU
cls
echo ========================================
echo    REZSTACK SOVEREIGN CONTROL PANEL
echo ========================================
echo.
echo    [1] Start All Services
echo    [2] Stop All Services
echo    [3] Check Service Status
echo    [4] Restart Specific Service
echo    [5] View Logs
echo    [6] Open in Browser
echo    [7] Exit
echo.
echo ========================================
set /p choice="Select option (1-7): "

if "%choice%"=="1" goto START_ALL
if "%choice%"=="2" goto STOP_ALL
if "%choice%"=="3" goto CHECK_STATUS
if "%choice%"=="4" goto RESTART_SERVICE
if "%choice%"=="5" goto VIEW_LOGS
if "%choice%"=="6" goto OPEN_BROWSER
if "%choice%"=="7" goto EXIT

echo Invalid choice. Press any key to continue...
pause >nul
goto MAIN_MENU

:START_ALL
cls
echo ========================================
echo    STARTING ALL SERVICES
echo ========================================
echo.

echo [1/3] Starting React dev server...
if exist "node_modules" (
    start "RezStack - React (3000)" cmd /c "title RezStack - React && npm run dev"
) else (
    echo ERROR: node_modules not found! Run 'npm install' first.
    pause
    goto MAIN_MENU
)

timeout /t 3 /nobreak >nul

echo [2/3] Starting API + Sovereign server...
if exist "apps\api\terminal-server.js" (
    start "RezStack - API (3001)" cmd /c "title RezStack - API && node apps/api/terminal-server.js"
) else (
    echo WARNING: terminal-server.js not found, skipping...
)

timeout /t 3 /nobreak >nul

echo [3/3] Starting Sovereign monitor...
if exist "scripts\sovereign-monitor.js" (
    start "RezStack - Monitor" cmd /c "title RezStack - Monitor && node scripts/sovereign-monitor.js"
) else (
    echo WARNING: sovereign-monitor.js not found, skipping...
)

echo.
echo ========================================
echo    SERVICES STARTED
echo ========================================
echo.
echo    React App:      http://localhost:3000
echo    API Server:     http://localhost:3001
echo    Health Check:   http://localhost:3001/api/health
echo    Sovereign API:  http://localhost:3001/api/sovereign/state
echo    WebSocket:      ws://localhost:3001/sovereign
echo.
echo ========================================
echo Press any key to return to main menu...
pause >nul
goto MAIN_MENU

:STOP_ALL
cls
echo ========================================
echo    STOPPING ALL SERVICES
echo ========================================
echo.

echo Stopping React dev server...
taskkill /FI "WINDOWTITLE eq RezStack - React*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Dev*" /F >nul 2>&1

echo Stopping API server...
taskkill /FI "WINDOWTITLE eq RezStack - API*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq API Server*" /F >nul 2>&1

echo Stopping Sovereign monitor...
taskkill /FI "WINDOWTITLE eq RezStack - Monitor*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Sovereign Monitor*" /F >nul 2>&1

echo.
echo All services stopped successfully.
echo.
echo Press any key to return to main menu...
pause >nul
goto MAIN_MENU

:CHECK_STATUS
cls
echo ========================================
echo    SERVICE STATUS
echo ========================================
echo.

echo Checking React dev server (port 3000)...
netstat -an | find ":3000" | find "LISTENING" >nul
if errorlevel 1 (
    echo ❌ React: NOT RUNNING
) else (
    echo ✅ React: RUNNING (http://localhost:3000)
)

echo.
echo Checking API server (port 3001)...
netstat -an | find ":3001" | find "LISTENING" >nul
if errorlevel 1 (
    echo ❌ API: NOT RUNNING
) else (
    echo ✅ API: RUNNING (http://localhost:3001)
)

echo.
echo Checking process status...
tasklist /FI "WINDOWTITLE eq RezStack*" 2>nul | find "cmd.exe" >nul
if errorlevel 1 (
    echo ⚠ No RezStack processes found by window title
) else (
    echo ℹ RezStack processes are running
)

echo.
echo ========================================
echo Press any key to return to main menu...
pause >nul
goto MAIN_MENU

:RESTART_SERVICE
cls
echo ========================================
echo    RESTART SERVICE
echo ========================================
echo.
echo    [1] React Dev Server (3000)
echo    [2] API Server (3001)
echo    [3] Sovereign Monitor
echo    [4] Back to Main Menu
echo.
set /p service="Select service to restart (1-4): "

if "%service%"=="1" goto RESTART_REACT
if "%service%"=="2" goto RESTART_API
if "%service%"=="3" goto RESTART_MONITOR
if "%service%"=="4" goto MAIN_MENU

goto RESTART_SERVICE

:RESTART_REACT
echo Stopping React...
taskkill /FI "WINDOWTITLE eq RezStack - React*" /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting React...
start "RezStack - React (3000)" cmd /c "title RezStack - React && npm run dev"
echo React restarted.
timeout /t 3 /nobreak >nul
goto MAIN_MENU

:RESTART_API
echo Stopping API...
taskkill /FI "WINDOWTITLE eq RezStack - API*" /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting API...
start "RezStack - API (3001)" cmd /c "title RezStack - API && node apps/api/terminal-server.js"
echo API restarted.
timeout /t 3 /nobreak >nul
goto MAIN_MENU

:RESTART_MONITOR
echo Stopping Monitor...
taskkill /FI "WINDOWTITLE eq RezStack - Monitor*" /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo Starting Monitor...
start "RezStack - Monitor" cmd /c "title RezStack - Monitor && node scripts/sovereign-monitor.js"
echo Monitor restarted.
timeout /t 3 /nobreak >nul
goto MAIN_MENU

:VIEW_LOGS
cls
echo ========================================
echo    VIEW LOGS
echo ========================================
echo.
echo    [1] View .rezstack directory
echo    [2] Check npm error logs
echo    [3] Back to Main Menu
echo.
set /p logchoice="Select option (1-3): "

if "%logchoice%"=="1" goto VIEW_RESONANCE_DIR
if "%logchoice%"=="2" goto VIEW_NPM_LOGS
if "%logchoice%"=="3" goto MAIN_MENU

goto VIEW_LOGS

:VIEW_RESONANCE_DIR
cls
echo ========================================
echo    .rezstack DIRECTORY CONTENTS
echo ========================================
echo.
if exist ".rezstack" (
    dir .rezstack
    echo.
    echo File contents:
    echo ===============
    for %%f in (.rezstack\*.json) do (
        echo.
        echo [%%~nxf]
        echo ----------
        type "%%f" 2>nul || echo (File empty or cannot read)
    )
) else (
    echo .rezstack directory does not exist.
)
echo.
echo Press any key to continue...
pause >nul
goto VIEW_LOGS

:VIEW_NPM_LOGS
cls
echo ========================================
echo    NPM / NODE LOGS
echo ========================================
echo.
echo Recent process output:
echo ---------------------
tasklist /FI "IMAGENAME eq node.exe" /FO TABLE
echo.
echo Press any key to continue...
pause >nul
goto VIEW_LOGS

:OPEN_BROWSER
cls
echo ========================================
echo    OPEN IN BROWSER
echo ========================================
echo.
echo    [1] Open React App (localhost:3000)
echo    [2] Open API Health Check (localhost:3001/api/health)
echo    [3] Open Sovereign State (localhost:3001/api/sovereign/state)
echo    [4] Back to Main Menu
echo.
set /p browser="Select option (1-4): "

if "%browser%"=="1" (
    start http://localhost:3000
    goto MAIN_MENU
)
if "%browser%"=="2" (
    start http://localhost:3001/api/health
    goto MAIN_MENU
)
if "%browser%"=="3" (
    start http://localhost:3001/api/sovereign/state
    goto MAIN_MENU
)
if "%browser%"=="4" goto MAIN_MENU

goto OPEN_BROWSER

:EXIT
cls
echo ========================================
echo    SHUTDOWN SEQUENCE
echo ========================================
echo.
echo Stopping all services...

taskkill /FI "WINDOWTITLE eq RezStack*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Dev*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq API Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Sovereign Monitor*" /F >nul 2>&1

timeout /t 2 /nobreak >nul

echo.
echo ✅ All services stopped.
echo.
echo Goodbye!
echo.
pause
exit /b 0