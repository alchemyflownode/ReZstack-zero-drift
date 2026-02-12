@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

title 🤖 REZONIC SWARM v2.0 - SOVEREIGN AI ENGINE
color 0C

:: ============================================================================
:: REZONIC SWARM - SOVEREIGN AI BACKEND
:: With Constitutional AI, Smart Router, and JARVIS Auto-Healer Integration
:: ============================================================================

:init
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                    🤖 REZONIC SWARM v2.0                                 ║
echo ║                    SOVEREIGN AI ENGINE                                   ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo [SYSTEM] Constitutional AI • ACTIVE
echo [SYSTEM] Zero-Drift Engine • ENABLED
echo [SYSTEM] Smart Router • 24 Models
echo [SYSTEM] JARVIS Auto-Healer • INTEGRATED
echo.

:: ============================================================================
:: CONFIGURATION - EDIT THESE PATHS
:: ============================================================================
set REZSTACK_ROOT=G:\okiru\app builder\RezStackFinal2\RezStackFinal
set SWARM_ROOT=%REZSTACK_ROOT%\src\rezonic-swarm
set BRIDGE_ROOT=%REZSTACK_ROOT%\src\constitutional-bridge
set JARVIS_ROOT=%REZSTACK_ROOT%\src\sovereign-jarvis
set AUTO_HEALER=%JARVIS_ROOT%\jarvis-auto-heal.py

:: ============================================================================
:: MAIN MENU
:: ============================================================================
:menu
echo.
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                         REZONIC SWARM CONTROL PANEL                       ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo  [1] 🚀 START SWARM     - Launch Rezonic Swarm (port 8000)
echo  [2] ⚖️  START BRIDGE   - Launch Constitutional Bridge (port 8001)
echo  [3] 🔗 START ALL       - Launch Swarm + Bridge + JARVIS
echo  [4] 🔍 SWARM HEALTH    - Check Swarm API status
echo  [5] 📊 MODEL STATUS   - List available Ollama models
echo  [6] 🛠️  AUTO-HEAL     - Scan + Fix Swarm codebase
echo  [7] 💾 AUTO-COMMIT    - Scan + Fix + Commit Swarm fixes
echo  [8] 📤 AUTO-PUSH      - Scan + Fix + Commit + Push to GitHub
echo  [9] 📋 VIEW LOGS      - Show recent Swarm logs
echo  [10] 🔄 RESTART ALL   - Restart all services
echo  [11] 🧹 CLEAN CACHE   - Clear Vite/Python cache
echo  [0] EXIT
echo.
set /p choice="🤖 Swarm ready. Select command: "

if "%choice%"=="1" goto start_swarm
if "%choice%"=="2" goto start_bridge
if "%choice%"=="3" goto start_all
if "%choice%"=="4" goto swarm_health
if "%choice%"=="5" goto model_status
if "%choice%"=="6" goto auto_heal_swarm
if "%choice%"=="7" goto auto_commit_swarm
if "%choice%"=="8" goto auto_push_swarm
if "%choice%"=="9" goto view_logs
if "%choice%"=="10" goto restart_all
if "%choice%"=="11" goto clean_cache
if "%choice%"=="0" goto exit
goto menu

:: ============================================================================
:: START REZONIC SWARM (PORT 8000)
:: ============================================================================
:start_swarm
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        🚀 STARTING REZONIC SWARM                         ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo [1/2] Checking Ollama connection...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo   ⚠️  Ollama not running! Starting Ollama...
    start "" "C:\Users\Zphoenix\AppData\Local\Programs\Ollama\Ollama.exe"
    timeout /t 5 /nobreak >nul
) else (
    echo   ✅ Ollama connected
)

echo [2/2] Launching Swarm on port 8000...
echo.
cd /d "%SWARM_ROOT%"
start "🤖 Rezonic Swarm (8000)" /MIN cmd /k "python simple-swarm.py"
timeout /t 3 /nobreak >nul

:: Verify Swarm is running
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ Swarm is RUNNING on http://localhost:8000
    echo   📚 API Docs: http://localhost:8000/docs
) else (
    echo   ❌ Swarm failed to start
)
pause
goto menu

:: ============================================================================
:: START CONSTITUTIONAL BRIDGE (PORT 8001)
:: ============================================================================
:start_bridge
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                     ⚖️  STARTING CONSTITUTIONAL BRIDGE                  ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
cd /d "%BRIDGE_ROOT%"
start "⚖️ Constitutional Bridge (8001)" /MIN cmd /k "python main.py"
timeout /t 3 /nobreak >nul

:: Verify Bridge is running
curl -s http://localhost:8001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✅ Constitutional Bridge is RUNNING on http://localhost:8001
) else (
    echo   ❌ Bridge failed to start
)
pause
goto menu

:: ============================================================================
:: START ALL SERVICES (Swarm + Bridge + JARVIS)
:: ============================================================================
:start_all
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                    🔗 STARTING COMPLETE ECOSYSTEM                        ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.

:: Start Ollama if not running
echo [1/4] Checking Ollama...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo   🚀 Starting Ollama...
    start "" "C:\Users\Zphoenix\AppData\Local\Programs\Ollama\Ollama.exe"
    timeout /t 5 /nobreak >nul
) else (
    echo   ✅ Ollama already running
)

:: Start Swarm
echo [2/4] Launching Rezonic Swarm (8000)...
cd /d "%SWARM_ROOT%"
start "🤖 Rezonic Swarm" /MIN cmd /k "python simple-swarm.py"
timeout /t 3 /nobreak >nul

:: Start Bridge
echo [3/4] Launching Constitutional Bridge (8001)...
cd /d "%BRIDGE_ROOT%"
start "⚖️ Constitutional Bridge" /MIN cmd /k "python main.py"
timeout /t 3 /nobreak >nul

:: Start JARVIS API
echo [4/4] Launching JARVIS API (8002)...
cd /d "%JARVIS_ROOT%"
start "🎭 JARVIS API" /MIN cmd /k "python main.py"
timeout /t 3 /nobreak >nul

echo.
echo ✅ ALL SERVICES STARTED
echo.
echo   🤖 Swarm:  http://localhost:8000  | Docs: http://localhost:8000/docs
echo   ⚖️ Bridge: http://localhost:8001
echo   🎭 JARVIS: http://localhost:8002  | UI: http://localhost:8002/ui
echo.
pause
goto menu

:: ============================================================================
:: CHECK SWARM HEALTH
:: ============================================================================
:swarm_health
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        🔍 SWARM HEALTH CHECK                            ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
curl -s http://localhost:8000/health
if %errorlevel% neq 0 (
    echo.
    echo ❌ Swarm is NOT responding
) else (
    echo.
    echo ✅ Swarm is healthy
)
echo.
pause
goto menu

:: ============================================================================
:: CHECK OLLAMA MODEL STATUS
:: ============================================================================
:model_status
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        📊 OLLAMA MODEL STATUS                           ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo Fetching available models...
echo.
ollama list
echo.
pause
goto menu

:: ============================================================================
:: AUTO-HEAL SWARM CODEBASE (Scan + Fix + Report)
:: ============================================================================
:auto_heal_swarm
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                    🛠️  AUTO-HEALING SWARM CODEBASE                      ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo ⚕️  JARVIS Auto-Healer engaged...
echo.
if exist "%AUTO_HEALER%" (
    python "%AUTO_HEALER%" "%SWARM_ROOT%" --no-commit --no-push
) else (
    echo ❌ JARVIS Auto-Healer not found at: %AUTO_HEALER%
)
pause
goto menu

:: ============================================================================
:: AUTO-COMMIT SWARM FIXES (Scan + Fix + Commit)
:: ============================================================================
:auto_commit_swarm
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                    💾 AUTO-COMMITTING SWARM FIXES                       ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
if exist "%AUTO_HEALER%" (
    python "%AUTO_HEALER%" "%SWARM_ROOT%" --no-push
) else (
    echo ❌ JARVIS Auto-Healer not found
)
pause
goto menu

:: ============================================================================
:: AUTO-PUSH SWARM FIXES (Scan + Fix + Commit + Push)
:: ============================================================================
:auto_push_swarm
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                    📤 AUTO-PUSHING SWARM FIXES                          ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
if exist "%AUTO_HEALER%" (
    python "%AUTO_HEALER%" "%SWARM_ROOT%"
) else (
    echo ❌ JARVIS Auto-Healer not found
)
pause
goto menu

:: ============================================================================
:: VIEW SWARM LOGS
:: ============================================================================
:view_logs
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        📋 RECENT SWARM LOGS                             ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
set LOG_DIR=%REZSTACK_ROOT%\logs
if exist "%LOG_DIR%" (
    dir /b /o-d "%LOG_DIR%\swarm-*.log" 2>nul
    echo.
    set /p logfile="📄 Enter log filename (or 0 to cancel): "
    if not "!logfile!"=="0" (
        if exist "%LOG_DIR%\!logfile!" (
            type "%LOG_DIR%\!logfile!" | more
        ) else (
            echo ❌ Log file not found
        )
    )
) else (
    echo 📭 No logs found
)
pause
goto menu

:: ============================================================================
:: RESTART ALL SERVICES
:: ============================================================================
:restart_all
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        🔄 RESTARTING ALL SERVICES                       ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo Stopping all Python processes...
taskkill /f /im python.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo ✅ All services stopped
echo.
goto start_all

:: ============================================================================
:: CLEAN CACHE
:: ============================================================================
:clean_cache
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                        🧹 CLEANING CACHE FILES                          ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
echo.
echo [1/2] Cleaning Python cache...
cd /d "%SWARM_ROOT%"
rmdir /s /q __pycache__ 2>nul
echo   ✅ Python cache cleared

echo [2/2] Cleaning Vite cache...
cd /d "%REZSTACK_ROOT%"
rmdir /s /q node_modules\.vite 2>nul
echo   ✅ Vite cache cleared

echo.
echo ✅ Cache cleanup complete
pause
goto menu

:: ============================================================================
:: EXIT
:: ============================================================================
:exit
cls
echo ╔═══════════════════════════════════════════════════════════════════════════╗
echo ║                 🤖 Rezonic Swarm disengaged.                            ║
echo ║                    Zero-Drift Engine • STANDBY                          ║
echo ╚═══════════════════════════════════════════════════════════════════════════╝
timeout /t 2 /nobreak >nul
exit /b