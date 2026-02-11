# silent_workflow.ps1
# No popups, no notifications, just work

Write-Host "🔇 SILENT WORKFLOW ACTIVATED" -ForegroundColor Cyan
Write-Host "=" * 50

# Set environment to prevent all prompts
$env:GIT_TERMINAL_PROMPT = "0"
$env:GCM_INTERACTIVE = "Never"
$env:GIT_ASKPASS = "echo"
$env:GIT_TRACE = "0"
$env:GIT_CURL_VERBOSE = "0"

Write-Host "`n📁 Checking Git status (silently)..." -ForegroundColor Yellow
.\git-silent.bat status --porcelain

Write-Host "`n🏛️ REZSTACK STATUS:" -ForegroundColor Green
Write-Host "Code files: $(Get-ChildItem *.py, *.ps1, *.md, *.json, *.yaml -Recurse -File | Measure-Object).Count" -ForegroundColor Cyan
Write-Host "Data files: $(Get-ChildItem data\ -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count" -ForegroundColor Cyan
Write-Host "Model files: $(Get-ChildItem models\ -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count" -ForegroundColor Cyan

Write-Host "`n🚀 READY TO LAUNCH:" -ForegroundColor Magenta
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Quick Launch Menu (recommended)" -ForegroundColor Gray
Write-Host "2. Elite Desktop UI" -ForegroundColor Gray
Write-Host "3. Constitutional Dashboard" -ForegroundColor Gray
Write-Host "4. Ollama Analysis" -ForegroundColor Gray
Write-Host "5. Exit" -ForegroundColor Gray

$choice = Read-Host "`nEnter choice (1-5)"

switch ($choice) {
    '1' { 
        Write-Host "Launching Quick Launch..." -ForegroundColor Green
        if (Test-Path "quick_launch.ps1") {
            .\quick_launch.ps1
        } else {
            Write-Host "quick_launch.ps1 not found" -ForegroundColor Red
        }
    }
    '2' { 
        Write-Host "Launching Elite UI..." -ForegroundColor Green
        if (Test-Path "elite_production_ui.py") {
            python elite_production_ui.py
        } else {
            Write-Host "elite_production_ui.py not found" -ForegroundColor Red
        }
    }
    '3' { 
        Write-Host "Launching Dashboard..." -ForegroundColor Green
        if (Test-Path "constitutional_dashboard.py") {
            Start-Process "http://localhost:8050"
            python constitutional_dashboard.py
        } else {
            Write-Host "constitutional_dashboard.py not found" -ForegroundColor Red
        }
    }
    '4' { 
        Write-Host "Running Ollama Analysis..." -ForegroundColor Green
        if (Test-Path "ollama_constitutional_enhanced.py") {
            python ollama_constitutional_enhanced.py
        } else {
            Write-Host "ollama_constitutional_enhanced.py not found" -ForegroundColor Red
        }
    }
    '5' { 
        Write-Host "Exiting..." -ForegroundColor Gray
    }
    default {
        Write-Host "Invalid choice" -ForegroundColor Red
    }
}
