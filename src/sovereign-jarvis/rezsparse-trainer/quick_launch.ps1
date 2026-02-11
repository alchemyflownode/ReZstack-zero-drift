# quick_launch.ps1
# One-click launch for Rezstack Constitutional Suite

Write-Host "🚀 REZSTACK CONSTITUTIONAL SUITE - QUICK LAUNCH" -ForegroundColor Cyan
Write-Host "=" * 70

# Check Ollama
Write-Host "`n🤖 Checking Ollama..." -ForegroundColor Yellow
$ollamaRunning = Test-NetConnection -ComputerName localhost -Port 11434 -WarningAction SilentlyContinue

if (-not $ollamaRunning.TcpTestSucceeded) {
    Write-Host "⚠️  Ollama server not running. Starting..." -ForegroundColor Yellow
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden
    Start-Sleep -Seconds 5
    Write-Host "✅ Ollama server started" -ForegroundColor Green
} else {
    Write-Host "✅ Ollama server is running" -ForegroundColor Green
}

# Show menu
Write-Host "`n🎯 SELECT LAUNCH OPTION:" -ForegroundColor Magenta
Write-Host "   1. 🏛️  Elite Desktop UI" -ForegroundColor Cyan
Write-Host "   2. 📊 Constitutional Dashboard" -ForegroundColor Cyan
Write-Host "   3. 🤖 Ollama Analysis" -ForegroundColor Cyan
Write-Host "   4. 📦 Git Auto-Commit" -ForegroundColor Cyan
Write-Host "   5. 🚀 Launch ALL (Recommended)" -ForegroundColor Green
Write-Host "   6. ❌ Exit" -ForegroundColor Red

$choice = Read-Host "`nEnter choice (1-6)"

switch ($choice) {
    '1' {
        Write-Host "`n🏛️ Launching Elite Desktop UI..." -ForegroundColor Yellow
        Start-Process -FilePath "python" -ArgumentList "elite_production_ui.py"
    }
    '2' {
        Write-Host "`n📊 Launching Constitutional Dashboard..." -ForegroundColor Yellow
        Start-Process -FilePath "http://localhost:8050"
        Start-Process -FilePath "python" -ArgumentList "constitutional_dashboard.py"
    }
    '3' {
        Write-Host "`n🤖 Running Ollama Constitutional Analysis..." -ForegroundColor Yellow
        Start-Process -FilePath "python" -ArgumentList "ollama_constitutional_enhanced.py"
    }
    '4' {
        Write-Host "`n📦 Running Git Auto-Commit..." -ForegroundColor Yellow
        .\git_auto.bat
    }
    '5' {
        Write-Host "`n🚀 LAUNCHING ALL COMPONENTS..." -ForegroundColor Green -BackgroundColor DarkBlue
        
        # Start Ollama analysis in background
        Write-Host "   🤖 Starting Ollama analysis..." -ForegroundColor Gray
        Start-Job -ScriptBlock {
            python ollama_constitutional_enhanced.py
        } | Out-Null
        
        # Start dashboard
        Write-Host "   📊 Starting dashboard..." -ForegroundColor Gray
        Start-Process -FilePath "python" -ArgumentList "constitutional_dashboard.py" -WindowStyle Hidden
        
        # Open browser
        Write-Host "   🌐 Opening browser..." -ForegroundColor Gray
        Start-Sleep -Seconds 3
        Start-Process -FilePath "http://localhost:8050"
        
        # Start Elite UI
        Write-Host "   🏛️ Starting Elite UI..." -ForegroundColor Gray
        Start-Sleep -Seconds 2
        Start-Process -FilePath "python" -ArgumentList "elite_production_ui.py"
        
        Write-Host "`n✅ ALL SYSTEMS LAUNCHED!" -ForegroundColor Green
        Write-Host "   Dashboard: http://localhost:8050" -ForegroundColor Cyan
        Write-Host "   Elite UI: Running in new window" -ForegroundColor Cyan
        Write-Host "   Ollama Analysis: Running in background" -ForegroundColor Cyan
    }
    '6' {
        Write-Host "`n👋 Goodbye!" -ForegroundColor Gray
    }
    default {
        Write-Host "`n❌ Invalid choice!" -ForegroundColor Red
    }
}
