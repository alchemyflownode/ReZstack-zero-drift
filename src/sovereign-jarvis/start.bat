@echo off
cd /d "G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis"
:menu
cls
echo ========================================
echo     SOVEREIGN JARVIS - MAIN MENU
echo ========================================
echo.
echo [1] Security Scan
echo [2] View Constitution
echo [3] Check Status
echo [4] View Audit
echo [5] Exit
echo.
set /p choice="Choose (1-5): "

if "%choice%"=="1" goto scan
if "%choice%"=="2" goto constitution
if "%choice%"=="3" goto status
if "%choice%"=="4" goto audit
if "%choice%"=="5" goto end
echo Invalid choice!
pause
goto menu

:scan
python jarvis.py scan
pause
goto menu

:constitution
python jarvis.py constitution
pause
goto menu

:status
python jarvis.py status
pause
goto menu

:audit
python jarvis.py audit
pause
goto menu

:end
echo Goodbye!
timeout /t 2 >nul
