# ============================================================================
# RESTORE-CRITICAL-FILES.ps1 - RUN THIS NOW!
# ============================================================================

$REZSTACK_ROOT = "G:\okiru\app builder\RezStackFinal2\RezStackFinal"
$REZ_ACCEL = "G:\Rez-Acceleration"

Write-Host "="*70 -ForegroundColor Cyan
Write-Host "RESTORING SOVEREIGN AI CRITICAL FILES" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# 1. CREATE SERVICES DIRECTORY IF MISSING
# ============================================================================
New-Item -ItemType Directory -Path "$REZSTACK_ROOT\src\services" -Force | Out-Null
Write-Host "[1/4] Creating services directory..." -ForegroundColor Yellow
Write-Host "  OK - $REZSTACK_ROOT\src\services" -ForegroundColor Green
Write-Host ""

# ============================================================================
# 2. COPY CONSTITUTIONAL COUNCIL
# ============================================================================
Write-Host "[2/4] Restoring Constitutional Council..." -ForegroundColor Yellow
Copy-Item "$REZ_ACCEL\constitutional_council_fixed.py" -Destination "$REZSTACK_ROOT\src\services\constitutional_council.py" -Force
Write-Host "  OK - constitutional_council.py restored" -ForegroundColor Green
$file = Get-Item "$REZSTACK_ROOT\src\services\constitutional_council.py"
Write-Host "       Size: $($file.Length) bytes" -ForegroundColor Gray
Write-Host ""

# ============================================================================
# 3. COPY REZFLOW ARTIFACT
# ============================================================================
Write-Host "[3/4] Restoring Rezflow Artifact..." -ForegroundColor Yellow
Copy-Item "$REZ_ACCEL\rezflow_artifact.py" -Destination "$REZSTACK_ROOT\src\services\rezflow_artifact.py" -Force
Write-Host "  OK - rezflow_artifact.py restored" -ForegroundColor Green
$file = Get-Item "$REZSTACK_ROOT\src\services\rezflow_artifact.py"
Write-Host "       Size: $($file.Length) bytes" -ForegroundColor Gray
Write-Host ""

# ============================================================================
# 4. COPY RTX 3060 OPTIMIZER
# ============================================================================
Write-Host "[4/4] Restoring RTX 3060 Optimizer..." -ForegroundColor Yellow
Copy-Item "$REZ_ACCEL\rtx3060_optimizer.py" -Destination "$REZSTACK_ROOT\src\services\rtx3060_optimizer.py" -Force
Write-Host "  OK - rtx3060_optimizer.py restored" -ForegroundColor Green
$file = Get-Item "$REZSTACK_ROOT\src\services\rtx3060_optimizer.py"
Write-Host "       Size: $($file.Length) bytes" -ForegroundColor Gray
Write-Host ""

# ============================================================================
# 5. CREATE SOVEREIGN.BAT
# ============================================================================
Write-Host "[5/4] Creating SOVEREIGN.bat master launcher..." -ForegroundColor Yellow

@'
@echo off
chcp 437 >nul
title SOVEREIGN AI
color 0A

:: ============================================================================
:: SOVEREIGN.bat - ONE COMMAND TO LAUNCH YOUR CONSTITUTIONAL AI
:: ============================================================================

cls
echo ===============================================================================
echo                          SOVEREIGN AI v3.0
echo                    Unified Backend + Unified Frontend
echo ===============================================================================
echo.

:: Kill existing processes
echo [1/4] Cleaning processes...
taskkill /f /im python.exe >nul 2>&1
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im ollama.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo   OK - Ports cleared
echo.

:: Start Ollama
echo [2/4] Starting Ollama...
start "" "C:\Users\Zphoenix\AppData\Local\Programs\Ollama\Ollama.exe"
timeout /t 5 /nobreak >nul
echo   OK - Ollama ready
echo.

:: Start Sovereign API
echo [3/4] Starting Sovereign API Gateway...
start "Sovereign API" cmd /c "cd /d "G:\okiru\app builder\RezStackFinal2\RezStackFinal" && python sovereign_api.py"
timeout /t 5 /nobreak >nul
echo   OK - API: http://localhost:8000/docs
echo.

:: Start Sovereign Dashboard
echo [4/4] Starting Sovereign Dashboard...
start "Sovereign Dashboard" cmd /c "cd /d "G:\okiru\app builder\RezStackFinal2\RezStackFinal" && python -m streamlit run sovereign_dashboard.py"
timeout /t 8 /nobreak >nul
echo   OK - Dashboard: http://localhost:8501
echo.

echo ===============================================================================
echo READY: http://localhost:8501
echo ===============================================================================
echo.
'@ | Out-File -FilePath "$REZSTACK_ROOT\SOVEREIGN.bat" -Encoding ascii -Force

Write-Host "  OK - SOVEREIGN.bat created" -ForegroundColor Green
Write-Host ""

# ============================================================================
# VERIFY ALL FILES
# ============================================================================
Write-Host "="*70 -ForegroundColor Cyan
Write-Host "VERIFYING ALL CRITICAL FILES" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""

$manifest = @(
    @{File = "sovereign_api.py"; Path = "$REZSTACK_ROOT\sovereign_api.py"},
    @{File = "sovereign_dashboard.py"; Path = "$REZSTACK_ROOT\sovereign_dashboard.py"},
    @{File = "SOVEREIGN.bat"; Path = "$REZSTACK_ROOT\SOVEREIGN.bat"},
    @{File = "constitutional_council.py"; Path = "$REZSTACK_ROOT\src\services\constitutional_council.py"},
    @{File = "rezflow_artifact.py"; Path = "$REZSTACK_ROOT\src\services\rezflow_artifact.py"},
    @{File = "rtx3060_optimizer.py"; Path = "$REZSTACK_ROOT\src\services\rtx3060_optimizer.py"}
)

$allPresent = $true
foreach ($item in $manifest) {
    if (Test-Path $item.Path) {
        $file = Get-Item $item.Path
        Write-Host "  [OK] $($item.File) - $($file.Length) bytes" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $($item.File)" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""
if ($allPresent) {
    Write-Host "✅ ALL 6 CRITICAL FILES PRESENT - SYSTEM READY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Launch your Sovereign AI ecosystem:" -ForegroundColor Yellow
    Write-Host "   .\SOVEREIGN.bat" -ForegroundColor White
    Write-Host ""
    Write-Host "🌐 Open your unified dashboard:" -ForegroundColor Yellow
    Write-Host "   http://localhost:8501" -ForegroundColor White
} else {
    Write-Host "❌ CRITICAL FILES STILL MISSING - RESTORE FAILED" -ForegroundColor Red
}

Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan
Write-Host "RESTORE COMPLETE" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan