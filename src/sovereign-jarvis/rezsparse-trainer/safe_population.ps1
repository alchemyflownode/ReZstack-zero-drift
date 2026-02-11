# safe_population.ps1
# Population WITH quarantine protocol

Write-Host "🔒 SAFE POPULATION WITH QUARANTINE" -ForegroundColor Cyan
Write-Host "=" * 60

# Create quarantine directories FIRST
Write-Host "
🏥 CREATING QUARANTINE ZONES:" -ForegroundColor Yellow

$quarantineDirs = @(
    "data\quarantine",
    "models\quarantine", 
    "config\quarantine",
    "trainer\quarantine"
)

foreach ($dir in $quarantineDirs) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "  📁 $dir" -ForegroundColor DarkGray
}

# QUARANTINE FUNCTION
function Invoke-SafeQuarantine {
    param(
        [string]$SourcePath,
        [string]$ArtifactType,  # "model", "data", "config"
        [string]$Description
    )
    
    Write-Host "
🔍 $Description" -ForegroundColor Cyan
    
    if (-not (Test-Path $SourcePath)) {
        Write-Host "  ❌ Source not found" -ForegroundColor Red
        return $null
    }
    
    # Determine quarantine path
    $quarantineRoot = switch ($ArtifactType) {
        "model" { "models\quarantine" }
        "data" { "data\quarantine" }
        "config" { "config\quarantine" }
        default { "quarantine\unknown" }
    }
    
    # Create dated quarantine directory
    $dateStamp = Get-Date -Format "yyyyMMdd"
    $quarantineDir = Join-Path $quarantineRoot $dateStamp
    New-Item -ItemType Directory -Path $quarantineDir -Force | Out-Null
    
    # Find and quarantine artifacts
    $patterns = switch ($ArtifactType) {
        "model" { @("*.pt", "*.pth", "*.bin", "*.safetensors") }
        "data" { @("*.pkl", "*.json", "*.csv", "*.txt") }
        "config" { @("*.json", "*.yaml", "*.yml", "*.config") }
    }
    
    $quarantined = @()
    
    foreach ($pattern in $patterns) {
        $files = Get-ChildItem -Path $SourcePath -Filter $pattern -Recurse -File -ErrorAction SilentlyContinue | Select-Object -First 3
        
        foreach ($file in $files) {
            $targetPath = Join-Path $quarantineDir $file.Name
            
            # Create quarantine metadata
            $metadata = @{
                source = $SourcePath
                original_path = $file.FullName
                artifact_type = $ArtifactType
                quarantined_date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                status = "UNTRUSTED - Requires re-distillation"
                policy_reference = "Foreign Artifact Policy v1.0"
                verification_required = @(
                    "Constitutional alignment check",
                    "Re-training under RezStack constraints",
                    "First principles validation"
                )
            }
            
            # Copy file
            Copy-Item $file.FullName $targetPath -Force
            
            # Save metadata
            $metadataPath = $targetPath -replace $file.Extension, "_metadata.json"
            $metadata | ConvertTo-Json -Depth 3 | Out-File -FilePath $metadataPath -Encoding UTF8
            
            $quarantined += @{
                file = $file.Name
                quarantine_path = $targetPath
                metadata = $metadataPath
            }
            
            Write-Host "  ⚠️  Quarantined: $($file.Name)" -ForegroundColor Yellow
        }
    }
    
    if ($quarantined.Count -gt 0) {
        Write-Host "  🏥 $($quarantined.Count) artifacts quarantined to $quarantineDir" -ForegroundColor Magenta
    } else {
        Write-Host "  ℹ️  No $ArtifactType artifacts found" -ForegroundColor DarkGray
    }
    
    return $quarantined
}

# EXECUTE SAFE POPULATION
Write-Host "
🧪 EXECUTING SAFE POPULATION:" -ForegroundColor Green

# 1. Quarantine models (SUSPECTED INTELLIGENCE)
$models = Invoke-SafeQuarantine 
    -SourcePath "D:\AI\Ollama_Models" 
    -ArtifactType "model" 
    -Description "Quarantining external models (suspected intelligence)"

# 2. Quarantine data (ORE, NOT METAL)
$data = Invoke-SafeQuarantine 
    -SourcePath "D:\AI\Ollama_Models" 
    -ArtifactType "data" 
    -Description "Quarantining external data (ore, not metal)"

# 3. Quarantine configs (FOREIGN CONSTRAINTS)
$configs = Invoke-SafeQuarantine 
    -SourcePath "G:\okiru-pure\rezsparse-sovereign-ai" 
    -ArtifactType "config" 
    -Description "Quarantining external configs (foreign constraints)"
