@echo off
chcp 65001 >nul
title 🛡️ ZERO-DRIFT SOVEREIGN LAUNCHER
color 0A

echo ========================================
echo    🛡️  ZERO-DRIFT SOVEREIGN SYSTEM
echo ========================================
echo    Auto-correcting AI coding assistant
echo    Violation detection: any, lodash, console.log
echo    Real-time curation with audit trail
echo ========================================
echo.

:MAIN_MENU
cls
echo ========================================
echo    ZERO-DRIFT CONTROL PANEL
echo ========================================
echo.
echo    [1] 🚀 Full Launch (Frontend + API)
echo    [2] 🔧 Development Mode
echo    [3] 🌐 API Server Only
echo    [4] 📊 System Status
echo    [5] 🧪 Test Zero-Drift
echo    [6] ❌ Exit
echo.
set /p choice="Choose option (1-6): "

if "%choice%"=="1" goto FULL_LAUNCH
if "%choice%"=="2" goto DEV_MODE
if "%choice%"=="3" goto API_ONLY
if "%choice%"=="4" goto CHECK_STATUS
if "%choice%"=="5" goto TEST_ZERO_DRIFT
if "%choice%"=="6" goto EXIT

echo Invalid choice. Press any key...
pause >nul
goto MAIN_MENU

:TEST_ZERO_DRIFT
cls
echo ========================================
echo    🧪 ZERO-DRIFT TEST SUITE
echo ========================================
echo.
echo Test these prompts after launching:
echo.
echo [1] Test violation detection:
echo     Write code with 'any' types and lodash
echo.
echo [2] Test RAW mode (toggle Protocol: OFF):
echo     Write messy JavaScript
echo.
echo [3] Test auto-correction:
echo     function process(data: any) { return data; }
echo.
echo [4] Test refine button:
echo     Send any code, click "Refine with Zero-Drift"
echo.
echo.
echo Press any key to launch and test...
pause >nul
goto FULL_LAUNCH

:FULL_LAUNCH
cls
echo ========================================
echo    🚀 LAUNCHING ZERO-DRIFT SYSTEM
echo ========================================
echo.

echo [1/3] Starting React dev server (port 3000)...
start "Zero-Drift Frontend" cmd /c "title Zero-Drift Frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo [2/3] Starting Sovereign API (port 3001)...
start "Zero-Drift API" cmd /c "title Zero-Drift API && node robust-server.mjs"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser to Chat interface...
start http://localhost:3000/#/chat

echo.
echo ========================================
echo    🎯 ZERO-DRIFT ACTIVE
echo ========================================
echo.
echo    Frontend:  http://localhost:3000
echo    API:       http://localhost:3001
echo    Chat:      http://localhost:3000/#/chat
echo    IDE:       http://localhost:3000/#/ide
echo.
echo    Test with: 'Write code with any types'
echo.
echo Press any key to return to menu...
pause >nul
goto MAIN_MENU

:: ... rest of your existing launcher code ...