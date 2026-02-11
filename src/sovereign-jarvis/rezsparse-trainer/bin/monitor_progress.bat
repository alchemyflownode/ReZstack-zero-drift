@echo off 
chcp 65001 >nul 
cls 
echo ═══════════════════════════════════════════════════════════ 
echo     🔬 REZSTACK DISTILLATION MONITOR 
echo ═══════════════════════════════════════════════════════════ 
echo. 
echo 📈 Monitoring distillation progress... 
echo 🔄 Updates every 5 seconds (Ctrl+C to stop) 
echo. 
python "G:\okiru-pure\rezsparse-trainer\..\src\simple_monitor.py" 
pause 
