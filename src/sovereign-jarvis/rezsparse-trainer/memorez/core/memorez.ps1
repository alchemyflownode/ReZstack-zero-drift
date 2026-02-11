Write-Host "`n" + "=" * 80
Write-Host "🏛️  MEMOREZ - Persistent RezStack Consciousness" -ForegroundColor Magenta
Write-Host "🔒 Version 1.0 - Drift-Proof, Self-Learning" -ForegroundColor Cyan
Write-Host "=" * 80

# Initialize
$SCRIPT_ROOT = $PSScriptRoot
$MEMOREZ_ROOT = Split-Path $SCRIPT_ROOT -Parent
$PROJECT_ROOT = "G:\okiru-pure\rezsparse-trainer"

Write-Host "📍 Project: $PROJECT_ROOT" -ForegroundColor Green
Write-Host "📁 MEMOREZ: $MEMOREZ_ROOT" -ForegroundColor Green

# Load configuration
$configPath = "$MEMOREZ_ROOT\state\config.json"
if (Test-Path $configPath) {
    $config = Get-Content $configPath -Raw | ConvertFrom-Json
    Write-Host "📋 Config v$($config.version) loaded" -ForegroundColor Green
} else {
    Write-Host "❌ Config not found! Run setup first." -ForegroundColor Red
    exit 1
}

# Ensure project root exists
if (-not (Test-Path $PROJECT_ROOT)) {
    Write-Host "❌ Project root not found: $PROJECT_ROOT" -ForegroundColor Red
    exit 1
}

Set-Location $PROJECT_ROOT

# Quick check of essential directories
$essentials = @("models", "data", "trainer", "api")
$missing = @()
foreach ($dir in $essentials) {
    if (-not (Test-Path $dir)) {
        $missing += $dir
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "📁 Created: $dir" -ForegroundColor Yellow
    }
}

if ($missing.Count -gt 0) {
    Write-Host "⚠️  Created $($missing.Count) missing directories" -ForegroundColor Yellow
}

# Check for training data
$trainingData = "data\minimal_training_data.pkl"
if (Test-Path $trainingData) {
    $sizeMB = [math]::Round((Get-Item $trainingData).Length / 1MB, 2)
    Write-Host "📊 Training data: $sizeMB MB" -ForegroundColor Green
} else {
    Write-Host "⚠️  No training data found" -ForegroundColor Yellow
}

# Check checkpoints
$checkpointDir = "models\checkpoints"
if (Test-Path $checkpointDir) {
    $checkpoints = Get-ChildItem $checkpointDir -Filter "*.pth" -File
    Write-Host "💾 Checkpoints: $($checkpoints.Count) found" -ForegroundColor Green
    if ($checkpoints.Count -gt 0) {
        $latest = $checkpoints | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        $age = [math]::Round(((Get-Date) - $latest.LastWriteTime).TotalHours, 1)
        Write-Host "   Latest: $($latest.Name) ($age hours old)" -ForegroundColor Gray
    }
} else {
    Write-Host "💾 No checkpoints directory" -ForegroundColor Yellow
}

Write-Host "`n🚀 MEMOREZ is ready!" -ForegroundColor Green
Write-Host "`nQuick commands:" -ForegroundColor Cyan
Write-Host "1. Train: python trainer\constitutional_trainer.py" -ForegroundColor White
Write-Host "2. Verify: python -c `"import torch; print(f'GPU: {torch.cuda.is_available()}')`"" -ForegroundColor White
Write-Host "3. Check memory: Get-Content memorez\state\lessons.json | ConvertFrom-Json" -ForegroundColor White
