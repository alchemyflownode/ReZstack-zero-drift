# start_all_silent.ps1
# Start Rezstack without any Git nonsense

Write-Host "🚀 STARTING REZSTACK CONSTITUTIONAL SUITE" -ForegroundColor Cyan
Write-Host "=" * 60

# Check Ollama
Write-Host "`n🤖 Checking Ollama..." -ForegroundColor Yellow
try {
    $ollamaCheck = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "✅ Ollama ready: $(@($ollamaCheck.models).Count) models available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Ollama not running or not installed" -ForegroundColor Yellow
    Write-Host "   Run 'ollama serve' in another terminal if needed" -ForegroundColor Gray
}

# Start dashboard in background
Write-Host "`n📊 Starting Constitutional Dashboard..." -ForegroundColor Yellow
if (Test-Path "constitutional_dashboard.py") {
    $dashboardJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        python constitutional_dashboard.py
    }
    Start-Sleep -Seconds 3
    Write-Host "✅ Dashboard started: http://localhost:8050" -ForegroundColor Green
    
    # Open browser
    Start-Process "http://localhost:8050"
} else {
    Write-Host "❌ constitutional_dashboard.py not found" -ForegroundColor Red
}

# Offer Elite UI
Write-Host "`n🏛️ Elite Desktop UI available:" -ForegroundColor Yellow
Write-Host "   Run: python elite_production_ui.py" -ForegroundColor Gray

# Offer Quick Launch
Write-Host "`n🎮 Quick Launch Menu available:" -ForegroundColor Yellow
Write-Host "   Run: .\quick_launch.ps1" -ForegroundColor Gray

Write-Host "`n🎯 REZSTACK READY!" -ForegroundColor Green -BackgroundColor DarkBlue
Write-Host "📊 Dashboard: http://localhost:8050" -ForegroundColor Cyan
Write-Host "💻 Press Ctrl+C to stop dashboard" -ForegroundColor Gray

# Keep script running
try {
    while ($true) {
        Write-Host "." -NoNewline -ForegroundColor DarkGray
        Start-Sleep -Seconds 10
    }
} catch {
    Write-Host "`n👋 Stopping Rezstack..." -ForegroundColor Yellow
    if ($dashboardJob) {
        Stop-Job $dashboardJob
        Remove-Job $dashboardJob
    }
}
