@echo off 
chcp 65001 >nul 
cls 
echo ═══════════════════════════════════════════════════════════ 
echo     🗑️  REZSTACK CONSTITUTIONAL SUITE UNINSTALLER 
echo ═══════════════════════════════════════════════════════════ 
echo. 
echo ⚠️  WARNING: This will remove the Rezstack Suite files 
echo           but will NOT touch your models or data. 
echo. 
set /p confirm="Type 'UNINSTALL' to confirm: " 
 
if not "%confirm%"=="UNINSTALL" goto cancel 
 
echo 🗑️  Removing files... 
timeout /t 1 /nobreak >nul 
 
if exist bin ( 
  rmdir /s /q bin 
  echo ✅ Removed: bin\ 
) 
 
if exist src ( 
  rmdir /s /q src 
  echo ✅ Removed: src\ 
) 
 
if exist web ( 
  rmdir /s /q web 
  echo ✅ Removed: web\ 
) 
 
if exist logs ( 
  rmdir /s /q logs 
  echo ✅ Removed: logs\ 
) 
 
if exist exports ( 
  rmdir /s /q exports 
  echo ✅ Removed: exports\ 
) 
 
del QUICK_START.bat 2>nul 
del INSTALL.bat 2>nul 
del UNINSTALL.bat 2>nul 
 
echo. 
echo ✅ Uninstallation complete! 
echo 📁 Your models and data remain untouched at: 
echo    G:\okiru-pure\rezsparse-trainer\models\ 
pause 
goto end 
 
:cancel 
echo 🚫 Uninstallation cancelled 
timeout /t 2 /nobreak >nul 
:end 
exit /b 0 
