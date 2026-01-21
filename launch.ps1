Write-Host "🚀 LAUNCHING REZSTACK ZERO-DRIFT..." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Yellow

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Magenta
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔥 Starting API Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WindowStyle Normal

Start-Sleep -Seconds 2

Write-Host "🎨 Starting Frontend Dev Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "✅ RezStack Zero-Drift is launching!" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   API: http://localhost:3001" -ForegroundColor White
Write-Host "   WebSocket: ws://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Test Zero-Drift immediately:" -ForegroundColor Yellow
Write-Host "   1. Go to http://localhost:3000" -ForegroundColor White
Write-Host "   2. Send: `"Write code with any types and lodash cloneDeep`"" -ForegroundColor White
Write-Host "   3. Watch violations appear!" -ForegroundColor White
Write-Host ""
Write-Host "🛡️  Zero-Drift Features Active:" -ForegroundColor Green
Write-Host "   - Type safety enforcement (no 'any')" -ForegroundColor White
Write-Host "   - Production-ready code (no console.log)" -ForegroundColor White
Write-Host "   - Code quality (no TODO/FIXME)" -ForegroundColor White
Write-Host "   - Real-time WebSocket analysis" -ForegroundColor White
Write-Host "   - RAW mode toggle & [NO_FIX] bypass" -ForegroundColor White
