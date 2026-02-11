@echo off
echo.
echo ========================================
echo   CONSTITUTIONAL AI ROUTER - FRIENDLY UI
echo ========================================
echo.
echo Starting Constitutional AI Router UI...
echo.
echo ?? Web Interface: http://localhost:5000
echo ?? API Endpoint: http://localhost:5000/api/analyze
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "G:\okiru\app builder\RezStackFinal\src\constitutional_bridge"

python constitutional_ui.py

pause
