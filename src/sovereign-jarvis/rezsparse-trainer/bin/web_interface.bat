@echo off 
chcp 65001 >nul 
cls 
echo ═══════════════════════════════════════════════════════════ 
echo     🌐 REZSTACK WEB DASHBOARD 
echo ═══════════════════════════════════════════════════════════ 
echo. 
echo 🌍 Opening web dashboard in default browser... 
echo 📁 Server will start at: http://localhost:8080 
echo. 
start http://localhost:8080 
python "G:\okiru-pure\rezsparse-trainer\..\src\web_server.py" 
pause 
