# Start Swarm
cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal\src\rezonic-swarm"
Start-Process powershell -ArgumentList "-NoExit", "python simple-swarm.py"

# Start Bridge
cd "..\constitutional-bridge"
Start-Process powershell -ArgumentList "-NoExit", "python main.py"

# Start JARVIS
cd "..\sovereign-jarvis"
Start-Process powershell -ArgumentList "-NoExit", "python main.py"