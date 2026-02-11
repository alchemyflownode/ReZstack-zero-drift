@echo off
chcp 65001 >nul
cls

echo ????????????????????????????????????????????????????????????????
echo    ?? REZSTACK OLLAMA INTEGRATION
echo ????????????????????????????????????????????????????????????????
echo.

echo ?? Checking Ollama installation...
ollama --version >nul 2>&1
if errorlevel 1 (
    echo ? Ollama not found! Please install from:
    echo    https://ollama.com/download
    pause
    exit /b 1
)

:: Get Ollama version
for /f "tokens=3" %%I in ('ollama --version 2^>^&1') do set "OLLAMA_VERSION=%%I"
echo ? Ollama %OLLAMA_VERSION% detected

:: Check if Ollama is running
echo ?? Checking Ollama server...
curl http://localhost:11434/api/tags --silent >nul 2>&1
if errorlevel 1 (
    echo ??  Ollama server not running. Starting...
    start /B ollama serve
    timeout /t 5 /nobreak >nul
    echo ? Ollama server started
) else (
    echo ? Ollama server is running
)

:: Show available models
echo ?? Available models:
ollama list

echo.
echo ?? Please select an option:
echo.
echo [1] ?? Run Ollama constitutional analysis
echo [2] ?? Launch constitutional dashboard
echo [3] ??? Start Elite Desktop UI
echo [4] ?? Run quick model analysis
echo [5] ? Exit
echo.
set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto run_analysis
if "%choice%"=="2" goto launch_dashboard
if "%choice%"=="3" goto start_elite
if "%choice%"=="4" goto quick_analysis
if "%choice%"=="5" goto exit

:run_analysis
echo ?? Running comprehensive constitutional analysis...
echo ? This may take several minutes depending on model count...
python ollama_constitutional_enhanced.py
pause
goto :eof

:launch_dashboard
echo ?? Launching constitutional dashboard...
echo ?? Opening browser at: http://localhost:8050
start http://localhost:8050
python constitutional_dashboard.py
goto :eof

:start_elite
echo ??? Starting Elite Desktop UI...
python elite_production_ui.py
goto :eof

:quick_analysis
echo ?? Running quick analysis on top 3 models...
python -c "
from pathlib import Path
import json

manifest_path = Path(r'G:\okiru-pure\rezsparse-trainer\models\distilled\reports\full_distillation_manifest.json')
if manifest_path.exists():
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    top_models = [m for m in manifest if m.get('category') in ['Models', 'Patterns']][:3]
    print(f'Found {len(top_models)} models for quick analysis')
else:
    print('Manifest not found. Run scanning first.')
"
pause
goto :eof

:exit
echo ?? Goodbye!
timeout /t 2 /nobreak >nul
