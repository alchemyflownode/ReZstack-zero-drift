:: launch_advanced.bat
@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════════════
echo    🤖 REZSTACK ADVANCED CONSTITUTIONAL ANALYZER
echo ════════════════════════════════════════════════════════════════
echo.

echo 🔍 Checking system status...
ollama --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Ollama not running. Starting Ollama...
    start /B ollama serve
    timeout /t 10 /nobreak >nul
)

echo ✅ Ollama ready
echo 📚 Available models:
ollama list | findstr /i "model"

echo.
echo 🎯 Select analysis mode:
echo.
echo [1] 🔬 Quick Analysis (1 model)
echo [2] 📊 Comprehensive Suite (5 models)
echo [3] 🏢 Enterprise Analysis (10+ models)
echo [4] 🎨 Specialized Analysis (Choose models)
echo [5] ❌ Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto quick
if "%choice%"=="2" goto comprehensive
if "%choice%"=="3" goto enterprise
if "%choice%"=="4" goto specialized
if "%choice%"=="5" goto exit

:quick
echo 🚀 Running quick analysis...
python ollama_constitutional_enhanced.py --mode quick
pause
goto :eof

:comprehensive
echo 📊 Running comprehensive analysis suite...
python ollama_constitutional_enhanced.py --mode comprehensive
pause
goto :eof

:enterprise
echo 🏢 Running enterprise-grade analysis...
echo ⚠️  This will take 15-30 minutes...
python ollama_constitutional_enhanced.py --mode enterprise
pause
goto :eof

:specialized
echo 🎨 Available specialized models:
echo.
ollama list | findstr /i "sovereign\|architect\|deepseek\|mistral"
echo.
set /p model="Enter model name (e.g., sovereign-architect:latest): "
echo 🔍 Analyzing with %model%...
python ollama_constitutional_enhanced.py --model "%model%"
pause
goto :eof

:exit
echo 👋 Goodbye!
timeout /t 2 /nobreak >nul