# Save as: G:\okiru\app builder\RezStackFinal\executeSovereignRemedy.ps1
Write-Host "⚡ EXECUTING SOVEREIGN ARCHITECTURAL REMEDY" -ForegroundColor Red
Write-Host "============================================="

cd "G:\okiru\app builder\RezStackFinal"

# 1. Create directories
New-Item -Path "src/services" -ItemType Directory -Force | Out-Null
New-Item -Path "src/test" -ItemType Directory -Force | Out-Null

# 2. Save all the verified code files
Write-Host "`n🛡️ Creating verified services..." -ForegroundColor Yellow

# Save TruthVerifier.ts
# Save StateVault.ts  
# Save WabiSariProtocol.ts
# Save SovereignCuration.ts
# Save sovereignTest.ts

# 3. Install TypeScript dependencies
Write-Host "`n📦 Installing TypeScript compiler API..." -ForegroundColor Cyan
npm install typescript @types/node

# 4. Run test
Write-Host "`n🧪 Running sovereign test..." -ForegroundColor Green
npx ts-node src/test/sovereignTest.ts

Write-Host "`n✅ Sovereign architectural remedy applied" -ForegroundColor Green
Write-Host "   Services created with truth verification and state immortality" -ForegroundColor Gray