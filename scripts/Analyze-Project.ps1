# RezStack Project Analyzer - Main Orchestrator
param(
    [string]$RootPath = "G:\okiru\app builder\rezstack",
    [switch]$NoOpen = $false
)

Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "      REZSTACK PROJECT ANALYZER" -ForegroundColor Magenta
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "Project: $RootPath" -ForegroundColor Cyan
Write-Host ""

# Clean up old reports
$reports = @("project-analysis.md", "dependencies.md", "src-analysis.md")
foreach ($report in $reports) {
    if (Test-Path $report) {
        Remove-Item $report -ErrorAction SilentlyContinue
        Write-Host "Cleaned up: $report" -ForegroundColor Gray
    }
}

# Check if we're in the right directory
if (-not (Test-Path $RootPath)) {
    Write-Host "ERROR: Project path not found: $RootPath" -ForegroundColor Red
    exit 1
}

Write-Host "Running analyses..." -ForegroundColor Yellow

# Define script paths
$scriptDir = "scripts"
$scanTreeScript = Join-Path $scriptDir "Scan-ProjectTree.ps1"
$srcContentScript = Join-Path $scriptDir "Analyze-SrcContent.ps1"
$depGraphScript = Join-Path $scriptDir "Generate-DependencyGraph.ps1"

# Check which scripts exist
$availableScripts = @()
if (Test-Path $scanTreeScript) { $availableScripts += $scanTreeScript }
if (Test-Path $srcContentScript) { $availableScripts += $srcContentScript }
if (Test-Path $depGraphScript) { $availableScripts += $depGraphScript }

if ($availableScripts.Count -eq 0) {
    Write-Host "ERROR: No analysis scripts found in $scriptDir" -ForegroundColor Red
    exit 1
}

# Run available scripts
foreach ($script in $availableScripts) {
    $scriptName = Split-Path $script -Leaf
    Write-Host "  Running $scriptName..." -ForegroundColor Gray
    
    try {
        if ($scriptName -eq "Scan-ProjectTree.ps1") {
            & $script -RootPath $RootPath -OutputPath "project-analysis.md"
        }
        elseif ($scriptName -eq "Analyze-SrcContent.ps1") {
            & $script -SrcPath "$RootPath\src"
        }
        elseif ($scriptName -eq "Generate-DependencyGraph.ps1") {
            & $script -SrcPath "$RootPath\src" -OutputFile "dependencies.md"
        }
    }
    catch {
        Write-Host "  Warning: $scriptName failed: $_" -ForegroundColor Yellow
    }
}

# Quick summary
Write-Host ""
Write-Host "ANALYSIS COMPLETE" -ForegroundColor Green
Write-Host "-----------------" -ForegroundColor Green

# Display package info if available
$packageJson = Join-Path $RootPath "package.json"
if (Test-Path $packageJson) {
    try {
        $content = Get-Content $packageJson -Raw -ErrorAction Stop
        if ($content -match '"name"\s*:\s*"([^"]+)"') {
            $name = $matches[1]
            Write-Host "Package: $name" -ForegroundColor Yellow
        }
        if ($content -match '"version"\s*:\s*"([^"]+)"') {
            $version = $matches[1]
            Write-Host "Version: $version" -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Could not read package.json" -ForegroundColor Yellow
    }
}

# Count files
$srcPath = "$RootPath\src"
if (Test-Path $srcPath) {
    $allFiles = Get-ChildItem $srcPath -Recurse -File -ErrorAction SilentlyContinue
    $sourceFiles = $allFiles | Where-Object { $_.Name -notmatch '\.(map|d\.ts|backup|bak)$' }
    $dirs = Get-ChildItem $srcPath -Recurse -Directory -ErrorAction SilentlyContinue | Measure-Object
    
    Write-Host ""
    Write-Host "Source Statistics:" -ForegroundColor Yellow
    Write-Host "  Files: $($sourceFiles.Count) (excluding .map/.d.ts)" -ForegroundColor Cyan
    Write-Host "  Directories: $($dirs.Count)" -ForegroundColor Cyan
}

# Show generated reports
Write-Host ""
Write-Host "Generated Reports:" -ForegroundColor Yellow
Get-ChildItem . -Filter "*.md" | Where-Object { $_.Name -match '^(project-analysis|dependencies|src-analysis)\.md$' } | ForEach-Object {
    $size = [math]::Round($_.Length/1KB, 1)
    Write-Host "  $($_.Name) (${size}KB)" -ForegroundColor Green
}

Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Magenta
Write-Host "  1. Open project-analysis.md for full structure" -ForegroundColor Gray
Write-Host "  2. Review dependencies.md for import relationships" -ForegroundColor Gray
Write-Host "  3. Copy diagrams to your documentation" -ForegroundColor Gray

# Open report if requested
if (-not $NoOpen) {
    Write-Host ""
    $openReport = Read-Host "Open project-analysis.md? (y/n)"
    if ($openReport -eq 'y') {
        if (Test-Path "project-analysis.md") {
            Invoke-Item "project-analysis.md"
        }
        else {
            Write-Host "project-analysis.md not found!" -ForegroundColor Red
        }
    }
}