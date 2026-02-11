:: LAUNCH_ALL.bat - Launch everything at once!
@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════════════
echo    🚀 REZSTACK CONSTITUTIONAL SUITE - FULL LAUNCH
echo ════════════════════════════════════════════════════════════════
echo.

:: Check if already running
tasklist | find /i "python.exe" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Python processes detected. Close them first? (Y/N)
    set /p choice=
    if /i "%choice%"=="Y" (
        taskkill /f /im python.exe >nul 2>&1
        echo ✅ Stopped existing Python processes
        timeout /t 2 /nobreak >nul
    )
)

echo 📊 Starting full suite...
echo.

:: Launch Elite UI
start "Rezstack Elite UI" /MIN cmd /c "bin\start_elite.bat"

timeout /t 3 /nobreak >nul

:: Launch Web Dashboard
start "Rezstack Web Dashboard" /MIN cmd /c "bin\web_interface.bat"

timeout /t 3 /nobreak >nul

:: Launch Monitor
start "Rezstack Monitor" /MIN cmd /c "bin\monitor_progress.bat"

echo.
echo ✅ All components launched!
echo.
echo 📋 Components running:
echo   1. 🏛️  Elite Desktop UI
echo   2. 🌐 Web Dashboard (http://localhost:8080)
echo   3. 🔬 Progress Monitor
echo.
echo ⚗️  To start distillation, use the Elite UI or run:
echo    bin\start_distillation.bat
echo.
echo Press any key to open documentation...
pause >nul

start README.txt

echo 👋 Suite launched successfully!
timeout /t 5 /nobreak >nul