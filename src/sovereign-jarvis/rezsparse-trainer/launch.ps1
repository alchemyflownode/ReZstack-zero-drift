# launch.ps1 - PowerShell launcher (always works)

Write-Host "🏛️ REZSTACK CONSTITUTIONAL SUITE v2.0" -ForegroundColor Cyan
Write-Host "=" * 60

# Find Python files
$pythonFiles = Get-ChildItem -Path . -Filter "*.py" -File | Where-Object { 
    $_.Name -notmatch "^test_" -and $_.Name -notmatch "^setup"
} | Sort-Object Name

Write-Host "`n📦 AVAILABLE COMPONENTS:" -ForegroundColor Green

$menuItems = @()
foreach ($file in $pythonFiles) {
    $description = switch -Wildcard ($file.Name) {
        "*distiller*" { "⚗️  Constitutional Distiller" }
        "*elite*" { "🏛️  Elite Desktop UI" }
        "*dashboard*" { "📊 Constitutional Dashboard" }
        "*ollama*" { "🤖 Ollama Analysis" }
        "*trainer*" { "🎓 Model Trainer" }
        default { "📝 $($file.BaseName)" }
    }
    
    Write-Host "  $($menuItems.Count + 1). $description" -ForegroundColor Yellow
    $menuItems += @{File=$file; Desc=$description}
}

Write-Host "  $($menuItems.Count + 1). 🔧 System Diagnostics" -ForegroundColor Yellow
Write-Host "  $($menuItems.Count + 2). ❌ Exit" -ForegroundColor Yellow

$choice = Read-Host "`nEnter choice (1-$($menuItems.Count + 2))"

if ($choice -match "^\d+$") {
    $choiceNum = [int]$choice
    
    if ($choiceNum -le $menuItems.Count) {
        $item = $menuItems[$choiceNum - 1]
        Write-Host "`n🚀 Launching: $($item.Desc)" -ForegroundColor Green
        python $($item.File.Name)
    }
    elseif ($choiceNum -eq $menuItems.Count + 1) {
        Write-Host "`n🔧 Running Diagnostics..." -ForegroundColor Cyan
        
        # Python info
        Write-Host "`n🐍 Python:" -ForegroundColor Yellow
        python --version
        
        # File counts
        Write-Host "`n📁 File Counts:" -ForegroundColor Yellow
        $pyCount = (Get-ChildItem -Path . -Filter "*.py" -File).Count
        $psCount = (Get-ChildItem -Path . -Filter "*.ps1" -File).Count
        $dataCount = (Get-ChildItem -Path "data\" -File -Recurse -ErrorAction SilentlyContinue).Count
        $modelCount = (Get-ChildItem -Path "models\" -File -Recurse -ErrorAction SilentlyContinue).Count
        
        Write-Host "  Python scripts: $pyCount" -ForegroundColor Gray
        Write-Host "  PowerShell scripts: $psCount" -ForegroundColor Gray
        Write-Host "  Data files: $dataCount" -ForegroundColor Gray
        Write-Host "  Model files: $modelCount" -ForegroundColor Gray
        
        # Check Ollama
        Write-Host "`n🤖 Ollama:" -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -TimeoutSec 2
            Write-Host "  ✅ Connected ($($response.models.Count) models)" -ForegroundColor Green
        } catch {
            Write-Host "  ⚠️  Not running (run 'ollama serve' if needed)" -ForegroundColor Yellow
        }
    }
    elseif ($choiceNum -eq $menuItems.Count + 2) {
        Write-Host "`n👋 Goodbye!" -ForegroundColor Gray
    }
    else {
        Write-Host "`n❌ Invalid choice!" -ForegroundColor Red
    }
} else {
    Write-Host "`n❌ Please enter a number!" -ForegroundColor Red
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
