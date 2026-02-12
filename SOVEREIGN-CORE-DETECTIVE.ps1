# ============================================================================
# SOVEREIGN-CORE-DETECTIVE.ps1 - FIND EVERY CRITICAL FILE (ASCII SAFE)
# ============================================================================

$REZSTACK_ROOT = "G:\okiru\app builder\RezStackFinal2\RezStackFinal"
$REZ_ACCEL = "G:\Rez-Acceleration"
$COMFYUI_ROOT = "D:\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable"
$TRAINER_ROOT = "G:\okiru-pure\rezsparse-trainer"

Write-Host "="*70 -ForegroundColor Cyan
Write-Host "SOVEREIGN AI - CORE FILE DETECTIVE" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan
Write-Host ""
Write-Host "SCANNING FOR FILES THAT ACTUALLY MAKE YOUR AI RUN..." -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# SECTION 1: UNIFIED BACKEND
# ============================================================================
Write-Host "[BACKEND] UNIFIED API GATEWAY" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta

# Check if sovereign_api.py exists
if (Test-Path "$REZSTACK_ROOT\sovereign_api.py") {
    $file = Get-Item "$REZSTACK_ROOT\sovereign_api.py"
    Write-Host "  [OK] sovereign_api.py - UNIFIED BACKEND (PORT 8000)" -ForegroundColor Green
    Write-Host "       Size: $($file.Length) bytes | Modified: $($file.LastWriteTime)" -ForegroundColor Gray
} else {
    Write-Host "  [MISSING] sovereign_api.py - This is your primary backend!" -ForegroundColor Red
}

# Check for legacy backends
$legacyBackends = @(
    "src\rezonic-swarm\simple-swarm.py",
    "src\constitutional_bridge\main.py", 
    "src\sovereign-jarvis\main.py"
)

foreach ($backend in $legacyBackends) {
    $path = Join-Path $REZSTACK_ROOT $backend
    if (Test-Path $path) {
        Write-Host "  [LEGACY] $backend (replace with sovereign_api.py)" -ForegroundColor Yellow
    }
}
Write-Host ""

# ============================================================================
# SECTION 2: CONSTITUTIONAL COUNCIL
# ============================================================================
Write-Host "[COUNCIL] CONSTITUTIONAL AI SERVICES" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta

$serviceFiles = @(
    @{Name = "Constitutional Council"; Path = "src\services\constitutional_council.py"},
    @{Name = "Rezflow Artifact"; Path = "src\services\rezflow_artifact.py"},
    @{Name = "RTX 3060 Optimizer"; Path = "src\services\rtx3060_optimizer.py"},
    @{Name = "Constitutional Judge"; Path = "src\services\constitutional_judge.py"}
)

foreach ($service in $serviceFiles) {
    $path = Join-Path $REZSTACK_ROOT $service.Path
    if (Test-Path $path) {
        $file = Get-Item $path
        Write-Host "  [OK] $($service.Name) - $($file.Length) bytes" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $($service.Name) - at $($service.Path)" -ForegroundColor Red
    }
}

# Check Rez-Acceleration source
Write-Host ""
Write-Host "  SOURCE REPOSITORY (Rez-Acceleration):" -ForegroundColor Gray
$rezAccelFiles = @(
    "constitutional_council_fixed.py",
    "rezflow_artifact.py",
    "rtx3060_optimizer.py"
)

foreach ($file in $rezAccelFiles) {
    $path = Join-Path $REZ_ACCEL $file
    if (Test-Path $path) {
        Write-Host "    [SOURCE] $file" -ForegroundColor Gray
    }
}
Write-Host ""

# ============================================================================
# SECTION 3: UNIFIED FRONTEND
# ============================================================================
Write-Host "[FRONTEND] SOVEREIGN DASHBOARD" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta

if (Test-Path "$REZSTACK_ROOT\sovereign_dashboard.py") {
    $file = Get-Item "$REZSTACK_ROOT\sovereign_dashboard.py"
    Write-Host "  [OK] sovereign_dashboard.py - UNIFIED FRONTEND (PORT 8501)" -ForegroundColor Green
    Write-Host "       Size: $($file.Length) bytes | Modified: $($file.LastWriteTime)" -ForegroundColor Gray
} else {
    Write-Host "  [MISSING] sovereign_dashboard.py - This is your primary UI!" -ForegroundColor Red
}

# Check legacy frontends
$legacyFrontends = @(
    "index.html",
    "src\App.tsx",
    "src\views\ChatView.tsx",
    "src\views\GenerativeIDE.tsx"
)

foreach ($frontend in $legacyFrontends) {
    $path = Join-Path $REZSTACK_ROOT $frontend
    if (Test-Path $path) {
        Write-Host "  [LEGACY] $frontend (replace with sovereign_dashboard.py)" -ForegroundColor Yellow
    }
}
Write-Host ""

# ============================================================================
# SECTION 4: MASTER LAUNCHER
# ============================================================================
Write-Host "[LAUNCHER] MASTER CONTROL" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta

if (Test-Path "$REZSTACK_ROOT\SOVEREIGN.bat") {
    $file = Get-Item "$REZSTACK_ROOT\SOVEREIGN.bat"
    Write-Host "  [OK] SOVEREIGN.bat - ONE COMMAND LAUNCHER" -ForegroundColor Green
} else {
    Write-Host "  [MISSING] SOVEREIGN.bat - Your one-command launcher!" -ForegroundColor Red
}
Write-Host ""

# ============================================================================
# SECTION 5: OPTIONAL COMPONENTS
# ============================================================================
Write-Host "[OPTIONAL] COMFYUI & REZTRAINER" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta

# ComfyUI
if (Test-Path "$COMFYUI_ROOT\run_nvidia_gpu.bat") {
    Write-Host "  [OK] ComfyUI - AVAILABLE" -ForegroundColor Green
    Write-Host "       Path: $COMFYUI_ROOT" -ForegroundColor Gray
} else {
    Write-Host "  [INFO] ComfyUI - NOT FOUND (optional)" -ForegroundColor Yellow
}

# RezTrainer
if (Test-Path "$TRAINER_ROOT\elite_production_ui.py") {
    Write-Host "  [OK] RezTrainer - AVAILABLE" -ForegroundColor Green
    Write-Host "       Path: $TRAINER_ROOT" -ForegroundColor Gray
} else {
    Write-Host "  [INFO] RezTrainer - NOT FOUND (optional)" -ForegroundColor Yellow
}
Write-Host ""

# ============================================================================
# SECTION 6: CRITICAL FILE MANIFEST
# ============================================================================
Write-Host "[MANIFEST] CRITICAL FILES - MUST HAVE" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Cyan
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
        Write-Host "  [OK] $($item.File)" -ForegroundColor Green
    } else {
        Write-Host "  [MISSING] $($item.File)" -ForegroundColor Red
        $allPresent = $false
    }
}

Write-Host ""
if ($allPresent) {
    Write-Host "  [READY] ALL 6 CRITICAL FILES PRESENT" -ForegroundColor Green
} else {
    Write-Host "  [ERROR] CRITICAL FILES MISSING - SYSTEM INCOMPLETE" -ForegroundColor Red
}
Write-Host ""

# ============================================================================
# SECTION 7: LEGACY FILES TO ARCHIVE
# ============================================================================
Write-Host "[ARCHIVE] FILES TO MOVE TO ARCHIVE" -ForegroundColor Magenta
Write-Host "-"*60 -ForegroundColor Magenta
Write-Host ""

$legacyFiles = @(
    "REZ-THE-STACK.bat",
    "REZPAWN.bat",
    "rezstack-master.bat",
    "rezstack-unified.bat",
    "start-rezstackos.bat",
    "start-rezstackos-full.bat",
    "launch-sovereign.bat",
    "launch-all.ps1",
    "Deploy-RezStack.ps1",
    "Update-RezStack.ps1",
    "SOVEREIGN-AI-MASTER.ps1",
    "SOVEREIGN-AI-UPGRADE.ps1",
    "SOVEREIGN-CONNECTION-MONITOR.ps1",
    "SOVEREIGN-IMAGE-FACTORY.bat",
    "SOVEREIGN-KAIZEN.bat"
)

$archiveCount = 0
foreach ($file in $legacyFiles) {
    $path = Join-Path $REZSTACK_ROOT $file
    if (Test-Path $path) {
        Write-Host "  [LEGACY] $file" -ForegroundColor Gray
        $archiveCount++
    }
}

Write-Host ""
Write-Host "  Total legacy files to archive: $archiveCount" -ForegroundColor Yellow
Write-Host "  Use SOVEREIGN-CLEANUP.ps1 to archive these files" -ForegroundColor Yellow
Write-Host ""

# ============================================================================
# SECTION 8: SYSTEM MAP
# ============================================================================
Write-Host "[SYSTEM] COMPLETE ARCHITECTURE MAP" -ForegroundColor Cyan
Write-Host "-"*60 -ForegroundColor Cyan
Write-Host ""

@"
SOVEREIGN AI v3.0 - CRITICAL FILE DEPENDENCIES
═══════════════════════════════════════════════════════════════════════════

1. UNIFIED BACKEND (PORT 8000)
    └── sovereign_api.py
        ├── src/services/constitutional_council.py
        ├── src/services/rezflow_artifact.py
        └── src/services/rtx3060_optimizer.py

2. UNIFIED FRONTEND (PORT 8501)
    └── sovereign_dashboard.py
        └── (communicates with sovereign_api.py)

3. MASTER LAUNCHER
    └── SOVEREIGN.bat

4. OPTIONAL COMPONENTS
    ├── ComfyUI - D:\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable
    └── RezTrainer - G:\okiru-pure\rezsparse-trainer

5. SOURCE REPOSITORY
    └── G:\Rez-Acceleration\

═══════════════════════════════════════════════════════════════════════════
TOTAL CRITICAL FILES: 6 (1 backend + 3 services + 1 frontend + 1 launcher)
ALL OTHER FILES ARE NON-CRITICAL AND CAN BE ARCHIVED
"@
Write-Host ""

# ============================================================================
# SECTION 9: ACTION SUMMARY
# ============================================================================
Write-Host "[ACTION] NEXT STEPS" -ForegroundColor Green
Write-Host "-"*60 -ForegroundColor Green
Write-Host ""

if ($allPresent) {
    Write-Host "  [READY] Your Sovereign AI is complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  1. Archive legacy files:" -ForegroundColor Yellow
    Write-Host "     .\SOVEREIGN-CLEANUP.ps1" -ForegroundColor White
    Write-Host ""
    Write-Host "  2. Launch your LEAN ecosystem:" -ForegroundColor Yellow
    Write-Host "     .\SOVEREIGN.bat" -ForegroundColor White
    Write-Host ""
    Write-Host "  3. Open your unified dashboard:" -ForegroundColor Yellow
    Write-Host "     http://localhost:8501" -ForegroundColor White
    Write-Host ""
    Write-Host "  STATISTICS:" -ForegroundColor Cyan
    Write-Host "  • Critical files: 6" -ForegroundColor Gray
    Write-Host "  • Legacy files to archive: $archiveCount" -ForegroundColor Gray
    Write-Host "  • Reduction: 90%+" -ForegroundColor Gray
} else {
    Write-Host "  [ERROR] Missing critical files - restore from Rez-Acceleration:" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Copy-Item 'G:\Rez-Acceleration\constitutional_council_fixed.py' -Destination 'src\services\constitutional_council.py'" -ForegroundColor Yellow
    Write-Host "  Copy-Item 'G:\Rez-Acceleration\rezflow_artifact.py' -Destination 'src\services\rezflow_artifact.py'" -ForegroundColor Yellow
    Write-Host "  Copy-Item 'G:\Rez-Acceleration\rtx3060_optimizer.py' -Destination 'src\services\rtx3060_optimizer.py'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "="*70 -ForegroundColor Cyan
Write-Host "SCAN COMPLETE" -ForegroundColor Cyan
Write-Host "="*70 -ForegroundColor Cyan