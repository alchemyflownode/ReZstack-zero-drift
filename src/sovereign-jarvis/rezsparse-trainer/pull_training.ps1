# Pull your training files from git
 = "../rezsparse-backup-20260127_120049"
git clone git@github.com:alchemyflownode/rezsparse-sovereign-ai.git 

# Check what training files exist
if (Test-Path "/trainer") {
    Write-Host "Found trainer directory with:" -ForegroundColor Yellow
    Get-ChildItem "/trainer" -File
    
    # Copy them over
    Copy-Item "/trainer/*" "trainer/" -Recurse -Force
    Write-Host "
✅ Copied training files!" -ForegroundColor Green
}

Write-Host "
Your training files should now be in trainer/" -ForegroundColor Cyan
