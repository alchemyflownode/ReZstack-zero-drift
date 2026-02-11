@echo off 
chcp 65001 >nul 
cls 
echo ═══════════════════════════════════════════════════════════ 
echo     ⚗️  REZSTACK CONSTITUTIONAL DISTILLATION 
echo ═══════════════════════════════════════════════════════════ 
echo. 
echo 🔍 Scanning workspace... 
echo ⏳ This may take several minutes... 
echo. 
python "G:\okiru-pure\rezsparse-trainer\..\src\rezstack_distiller_v2.py" 
echo. 
echo ✅ Distillation complete! 
echo 📊 Check 'models\distilled\reports' for results 
pause 
