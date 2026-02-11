@echo off 
chcp 65001 >nul 
cls 
echo ═══════════════════════════════════════════════════════════ 
echo     🚀 REZSTACK CONSTITUTIONAL SUITE - QUICK START 
echo ═══════════════════════════════════════════════════════════ 
echo. 
echo Please select an option: 
echo. 
echo [1] 🏛️  Launch Elite Desktop UI 
echo [2] ⚗️  Run Constitutional Distillation 
echo [3] 🔬 Monitor Distillation Progress 
echo [4] 🌐 Open Web Dashboard 
echo [5] 📊 Generate Analysis Report 
echo [6] ❌ Exit 
echo. 
set /p choice="Enter choice (1-6): " 
 
if "%choice%"=="1" goto elite 
if "%choice%"=="2" goto distill 
if "%choice%"=="3" goto monitor 
if "%choice%"=="4" goto web 
if "%choice%"=="5" goto report 
if "%choice%"=="6" goto exit 
goto invalid 
 
:elite 
call bin\start_elite.bat 
goto end 
 
:distill 
call bin\start_distillation.bat 
goto end 
 
:monitor 
call bin\monitor_progress.bat 
goto end 
 
:web 
call bin\web_interface.bat 
goto end 
 
:report 
echo 📊 Generating analysis report... 
python src\generate_report.py 
pause 
goto end 
 
:invalid 
echo ❌ Invalid choice! Please select 1-6 
timeout /t 3 /nobreak >nul 
goto :eof 
 
:exit 
echo 👋 Goodbye! 
timeout /t 2 /nobreak >nul 
exit /b 0 
 
:end 
exit /b 0 
