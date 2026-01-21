Write-Host "⚡ Starting RezStack Sovereign..." -ForegroundColor Cyan
Write-Host ""

# Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting dev server on http://localhost:3000..." -ForegroundColor Green
npx vite --host
