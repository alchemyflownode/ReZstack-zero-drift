# Recovery script for rezsparse-sovereign-ai training files
# Run this in PowerShell

Write-Host "Recovering training files from git..." -ForegroundColor Yellow

# Create backup of current trainer if it exists
if (Test-Path "trainer") {
    Rename-Item "trainer" "trainer_backup_20260127_120033"
}

# Clone just the trainer files from your repo
 = "temp_recovery"
if (Test-Path ) { Remove-Item  -Recurse -Force }

git clone --depth 1 git@github.com:alchemyflownode/rezsparse-sovereign-ai.git 

# Copy back the training files
if (Test-Path "/trainer") {
    Copy-Item "/trainer/*" "trainer/" -Recurse -Force
    Write-Host "✅ Recovered trainer files" -ForegroundColor Green
}

# Copy any other missing files
 = @(
    "constitutional_core.py",
    "sovereign_trainer.py", 
    "constitutional_judge.py",
    "training_data",
    "models"
)

foreach (constitutional_trainer.py in ) {
    if (Test-Path "/constitutional_trainer.py") {
        Copy-Item "/constitutional_trainer.py" "." -Recurse -Force
        Write-Host "✅ Recovered constitutional_trainer.py" -ForegroundColor Green
    }
}

# Cleanup
Remove-Item  -Recurse -Force

Write-Host "
🎯 RECOVERY COMPLETE!" -ForegroundColor Cyan
Write-Host "Check your trainer/ directory now." -ForegroundColor Green
