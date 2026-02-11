# Sovereign JARVIS Windows Installer
Write-Host "SOVEREIGN JARVIS INSTALLER" -ForegroundColor Cyan
Write-Host "=" -Repeat 50

# Step 1: Verify Python
try {
     = python --version 2>&1
    Write-Host "✅ Python found: "
} catch {
    Write-Host "❌ Python not found. Install Python 3.8+ from https://python.org" -ForegroundColor Red
    exit 1
}

# Step 2: Install dependencies
Write-Host "
📦 Installing dependencies..." -ForegroundColor Yellow
pip install GitPython -q
if (1 -ne 0) {
    Write-Host "❌ Dependency installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed"

# Step 3: Add to PATH (user scope)
 = (Resolve-Path "\bin").Path
 = [System.Environment]::GetEnvironmentVariable("PATH", "User")
if (-not .Contains()) {
    [System.Environment]::SetEnvironmentVariable("PATH", ";", "User")
    Write-Host "✅ Added to user PATH: " -ForegroundColor Green
    Write-Host "⚠️  RESTART YOUR TERMINAL to use 'jarvis' command" -ForegroundColor Yellow
} else {
    Write-Host "✅ Already in PATH" -ForegroundColor Green
}

Write-Host "
🎉 Sovereign JARVIS installed successfully!" -ForegroundColor Green
Write-Host "
Next steps:"
Write-Host "  1. Open a NEW PowerShell window"
Write-Host "  2. cd to your Git project"
Write-Host "  3. jarvis init"
Write-Host "  4. jarvis constitution  # Verify rules loaded"
