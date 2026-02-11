:: CLEANUP.bat - Clean distillation outputs
@echo off
chcp 65001 >nul
cls

echo ════════════════════════════════════════════════════════════════
echo    🧹 REZSTACK DISTILLATION CLEANUP
echo ════════════════════════════════════════════════════════════════
echo.

set BASE_PATH=G:\okiru-pure\rezsparse-trainer

echo 📊 This will clean distillation outputs but keep original models.
echo.
echo 📁 Target directories:
echo   1. %BASE_PATH%\models\distilled\*
echo   2. %BASE_PATH%\models\distilled\reports\*
echo   3. %BASE_PATH%\models\distilled\audits\*
echo   4. %BASE_PATH%\models\distilled\models\*
echo.
echo ⚠️  This will NOT delete:
echo   • Original models in %BASE_PATH%\models\
echo   • Constitutional predictor: production_constitutional_predictor.pkl
echo   • Any files outside the 'distilled' directory
echo.
set /p confirm="Type 'CLEAN' to proceed: "

if not "%confirm%"=="CLEAN" (
    echo 🚫 Cleanup cancelled
    timeout /t 2 /nobreak >nul
    exit /b 0
)

echo.
echo 🗑️  Starting cleanup...
echo.

:: Create backup of reports first
set BACKUP_DIR=%BASE_PATH%\models\backup_%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%
mkdir "%BACKUP_DIR%" >nul 2>&1

echo 📦 Backing up reports to: %BACKUP_DIR%
xcopy "%BASE_PATH%\models\distilled\reports\*" "%BACKUP_DIR%\reports\" /E /I /Y >nul
xcopy "%BASE_PATH%\models\distilled\audits\*" "%BACKUP_DIR%\audits\" /E /I /Y >nul

:: Clean distilled directories
echo 🧹 Cleaning distilled models...
if exist "%BASE_PATH%\models\distilled\models" (
    rmdir /s /q "%BASE_PATH%\models\distilled\models"
    mkdir "%BASE_PATH%\models\distilled\models"
)

echo 🧹 Cleaning audit files...
if exist "%BASE_PATH%\models\distilled\audits" (
    rmdir /s /q "%BASE_PATH%\models\distilled\audits"
    mkdir "%BASE_PATH%\models\distilled\audits"
)

echo 🧹 Cleaning reports (keeping latest)...
if exist "%BASE_PATH%\models\distilled\reports" (
    :: Keep only the 5 most recent reports
    for /f "skip=5 delims=" %%F in ('dir "%BASE_PATH%\models\distilled\reports\*.json" /b /o-d 2^>nul') do (
        del "%BASE_PATH%\models\distilled\reports\%%F"
    )
    for /f "skip=5 delims=" %%F in ('dir "%BASE_PATH%\models\distilled\reports\*.txt" /b /o-d 2^>nul') do (
        del "%BASE_PATH%\models\distilled\reports\%%F"
    )
)

echo 🧹 Cleaning logs...
if exist "logs" (
    for /f "skip=30 delims=" %%F in ('dir "logs\*.log" /b /o-d 2^>nul') do (
        del "logs\%%F"
    )
)

echo.
echo ✅ Cleanup complete!
echo 📦 Backup saved to: %BACKUP_DIR%
echo 🆕 Ready for fresh distillation run
echo.
echo 🚀 Run 'bin\start_distillation.bat' to begin
echo.
pause