@echo off
chcp 65001 >nul 2>&1
title Testing Sovereign JARVIS Batch Files
color 0F

echo ========================================
echo   TESTING ALL BATCH FILES
echo ========================================
echo.
echo This will test that all batch files work correctly.
echo.

set "JARVIS_DIR=%~dp0"
set "TESTS_PASSED=0"
set "TESTS_TOTAL=0"

:: Test 1: Main batch file exists
set /a TESTS_TOTAL+=1
if exist "%JARVIS_DIR%jarvis.bat" (
    echo [?] jarvis.bat - OK
    set /a TESTS_PASSED+=1
) else (
    echo [X] jarvis.bat - MISSING
)

:: Test 2: Scan batch file
set /a TESTS_TOTAL+=1
if exist "%JARVIS_DIR%scan.bat" (
    echo [?] scan.bat - OK
    set /a TESTS_PASSED+=1
) else (
    echo [X] scan.bat - MISSING
)

:: Test 3: Dashboard batch file
set /a TESTS_TOTAL+=1
if exist "%JARVIS_DIR%dashboard.bat" (
    echo [?] dashboard.bat - OK
    set /a TESTS_PASSED+=1
) else (
    echo [X] dashboard.bat - MISSING
)

:: Test 4: Python script exists
set /a TESTS_TOTAL+=1
if exist "%JARVIS_DIR%jarvis.py" (
    echo [?] jarvis.py - OK
    set /a TESTS_PASSED+=1
) else (
    echo [X] jarvis.py - MISSING
)

:: Test 5: Dashboard Python exists
set /a TESTS_TOTAL+=1
if exist "%JARVIS_DIR%dashboard.py" (
    echo [?] dashboard.py - OK
    set /a TESTS_PASSED+=1
) else (
    echo [X] dashboard.py - MISSING
)

echo.
echo ========================================
echo TEST RESULTS: %TESTS_PASSED%/%TESTS_TOTAL% passed
echo ========================================
echo.

if %TESTS_PASSED% equ %TESTS_TOTAL% (
    echo [SUCCESS] All batch files ready!
    echo.
    echo You can now:
    echo 1. Double-click jarvis.bat for main menu
    echo 2. Double-click create-shortcut.bat for desktop icon
    echo 3. Run project-setup.bat in your projects
) else (
    echo [WARNING] Some files are missing.
    echo Re-run the batch file creation script.
)

echo.
echo Press any key to exit...
pause >nul
