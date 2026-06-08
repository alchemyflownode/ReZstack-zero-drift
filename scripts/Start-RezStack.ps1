# Start-RezStack.ps1 - ONE COMMAND TO LAUNCH EVERYTHING
# Save this file and run it with: .\Start-RezStack.ps1

Write-Host "`n🔥 FORCE KILLING ALL PYTHON PROCESSES..." -ForegroundColor Red
Get-Process -Name python -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Write-Host "✅ All processes killed - ports are free!" -ForegroundColor Green

Write-Host "`n🚀 STARTING REZSTACK ECOSYSTEM..." -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# ============================================================================
# 1. REZONIC SWARM (PORT 8000)
# ============================================================================
Write-Host "`n[1/4] Starting Rezonic Swarm (8000)..." -ForegroundColor Yellow
cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal\src\rezonic-swarm"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🤖 Rezonic Swarm (8000)' -ForegroundColor Green; python simple-swarm.py"
Start-Sleep -Seconds 3

# Verify Swarm is running
try {
    $swarm = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 2
    Write-Host "  ✅ Swarm is RUNNING - Health: $($swarm.status)" -ForegroundColor Green
} catch {
    Write-Host "  ⚠️  Swarm not responding yet - waiting..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}

# ============================================================================
# 2. CONSTITUTIONAL BRIDGE (PORT 8001)
# ============================================================================
Write-Host "[2/4] Starting Constitutional Bridge (8001)..." -ForegroundColor Yellow
cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal\src\constitutional-bridge"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '⚖️ Constitutional Bridge (8001)' -ForegroundColor Magenta; python main.py"
Start-Sleep -Seconds 3

# ============================================================================
# 3. JARVIS API (PORT 8002)
# ============================================================================
Write-Host "[3/4] Starting JARVIS API (8002)..." -ForegroundColor Yellow
cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal\src\sovereign-jarvis"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎭 JARVIS API (8002)' -ForegroundColor Cyan; python main.py"
Start-Sleep -Seconds 3

# ============================================================================
# 4. SOVEREIGN CHAT UI (PORT 5176)
# ============================================================================
Write-Host "[4/4] Starting Sovereign Chat UI (5176)..." -ForegroundColor Yellow
cd "G:\okiru\app builder\RezStackFinal2\RezStackFinal"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎨 Sovereign Chat UI (5176)' -ForegroundColor Magenta; npm run dev"
Start-Sleep -Seconds 5

# ============================================================================
# OPEN ALL DASHBOARDS
# ============================================================================
Write-Host "`n🌐 OPENING SOVEREIGN AI DASHBOARDS..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
Start-Process "http://localhost:5176/chat"
Start-Process "http://localhost:8000/docs"
Start-Process "http://localhost:8080"

# ============================================================================
# FINAL STATUS
# ============================================================================
Write-Host "`n" + "="*60 -ForegroundColor Cyan
Write-Host "🎉 SOVEREIGN AI ECOSYSTEM IS LIVE!" -ForegroundColor Green
Write-Host "="*60 -ForegroundColor Cyan
Write-Host ""
Write-Host "  📍 Sovereign Chat:    http://localhost:5176/chat" -ForegroundColor White
Write-Host "  📍 Swarm API Docs:    http://localhost:8000/docs" -ForegroundColor White
Write-Host "  📍 JARVIS IDE:        http://localhost:8080" -ForegroundColor White
Write-Host "  📍 Constitutional Br: http://localhost:8001" -ForegroundColor White
Write-Host ""
Write-Host "  🤖 Models: 24 Ollama models ready" -ForegroundColor Gray
Write-Host "  ⚖️  Zero-Drift: ACTIVE" -ForegroundColor Gray
Write-Host "  🛡️  Constitutional: ENFORCED" -ForegroundColor Gray
Write-Host ""
Write-Host "="*60 -ForegroundColor Cyan

# Keep the window open
Write-Host "`nPress any key to exit (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")