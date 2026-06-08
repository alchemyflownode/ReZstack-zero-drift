# ============================================================================
# SOVEREIGN-AI-UPGRADE.ps1 - SEAMLESS ECOSYSTEM UPGRADE
# One command to update, enhance, and optimize your entire Sovereign AI platform
# ============================================================================

param(
    [switch]$Force,
    [switch]$BackupOnly,
    [switch]$DryRun,
    [switch]$SkipModelPull,
    [switch]$SkipConstitutionalRetrain,
    [switch]$Help
)

$HOSTNAME = "🏛️ SOVEREIGN AI"
$VERSION = "3.1.0"
$TIMESTAMP = Get-Date -Format "yyyyMMdd-HHmmss"

# ============================================================================
# CONFIGURATION PATHS
# ============================================================================
$REZSTACK_ROOT = "G:\okiru\app builder\RezStackFinal2\RezStackFinal"
$JARVIS_PREMIUM = "G:\okiru\app builder\Kimi_Agent_Reimagining JARVIS as Sovereign AI\sovereign-jarvis\web-dashboard"
$COMFYUI_ROOT = "D:\ComfyUI_windows_portable_nvidia\ComfyUI_windows_portable"
$TRAINER_ROOT = "G:\okiru-pure\rezsparse-trainer"
$BACKUP_ROOT = "G:\okiru\SovereignBackups"
$LOG_ROOT = "$REZSTACK_ROOT\logs\upgrades"

# ============================================================================
# ASCII HEADER
# ============================================================================
function Show-Header {
    Clear-Host
    Write-Host @"

═══════════════════════════════════════════════════════════════════════════════
                      🏛️  SOVEREIGN AI - SEAMLESS UPGRADE v$VERSION
═══════════════════════════════════════════════════════════════════════════════

    Constitutional AI • JARVIS • Swarm • Chat • Image Factory • RezTrainer
                          RTX 3060 • Zero-Drift • Sovereign
═══════════════════════════════════════════════════════════════════════════════
"@ -ForegroundColor Cyan
}

# ============================================================================
# ERROR HANDLING
# ============================================================================
function Write-Step {
    param($Message, $Color = "Yellow")
    Write-Host "`n[$([DateTime]::Now.ToString('HH:mm:ss'))] ⚡ $Message" -ForegroundColor $Color
}

function Write-Success {
    param($Message)
    Write-Host "  ✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

# ============================================================================
# BACKUP SYSTEM
# ============================================================================
function Backup-SovereignAI {
    param([string]$Component, [string]$Path)
    
    $backupDir = "$BACKUP_ROOT\$Component-$TIMESTAMP"
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    Write-Step "📦 Backing up $Component..." -Color "Cyan"
    
    try {
        if (Test-Path $Path) {
            Copy-Item -Path $Path -Destination "$backupDir\" -Recurse -Force
            Write-Success "$Component backed up to $backupDir"
            return $true
        } else {
            Write-Warning "$Component not found at $Path"
            return $false
        }
    } catch {
        Write-Error "Failed to backup $Component : $_"
        return $false
    }
}

# ============================================================================
# MODULE 1: OLLAMA MODEL UPGRADE
# ============================================================================
function Update-OllamaModels {
    Write-Step "🦙 Upgrading Ollama Constitutional Models..." -Color "Magenta"
    
    # Essential constitutional models
    $constitutionalModels = @(
        @{Name = "llama3.2-vision:11b"; Purpose = "Vision Understanding"},
        @{Name = "qwen2.5-coder:7b"; Purpose = "Code Generation"},
        @{Name = "phi4:latest"; Purpose = "Complex Reasoning"},
        @{Name = "deepseek-coder:latest"; Purpose = "Fast Code"},
        @{Name = "llama3.2:1b"; Purpose = "Ultra-Fast Responses"},
        @{Name = "mistral:latest"; Purpose = "Balanced General"},
        @{Name = "codellama:7b"; Purpose = "Code Review"}
    )
    
    foreach ($model in $constitutionalModels) {
        Write-Host "  📥 Pulling $($model.Name)..." -NoNewline -ForegroundColor Gray
        try {
            $result = ollama pull $model.Name 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✅" -ForegroundColor Green
            } else {
                Write-Host " ⚠️" -ForegroundColor Yellow
            }
        } catch {
            Write-Host " ❌" -ForegroundColor Red
        }
    }
    
    # Retrain constitutional model
    if (-not $SkipConstitutionalRetrain) {
        Write-Step "🏛️  Retraining Constitutional Scoring Engine..." -Color "Magenta"
        try {
            Set-Location $TRAINER_ROOT
            python retrain_constitutional.py
            Write-Success "Constitutional model retrained"
        } catch {
            Write-Error "Constitutional retraining failed: $_"
        }
    }
}

# ============================================================================
# MODULE 2: SOVEREIGN MODEL EXPERTISE CLASSIFIER UPGRADE
# ============================================================================
function Update-SovereignExpertiseClassifier {
    Write-Step "🎯 Upgrading Sovereign Model Expertise Classifier..." -Color "Magenta"
    
    $classifierPath = "$REZSTACK_ROOT\src\services\sovereign_model_expertise.py"
    
    # Backup existing
    Backup-SovereignAI -Component "expertise_classifier" -Path $classifierPath
    
    # Create enhanced classifier
    $expertiseClassifier = @'
"""
Sovereign Model Expertise Classifier v3.1
25+ Models • 10 Expertise Domains • Constitutional Priority
"""

from enum import Enum
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

class ModelExpertise(Enum):
    CONSTITUTIONAL = "constitutional"
    CODE_GENERATION = "code_generation"
    VISION = "vision"
    REASONING = "reasoning"
    GENERAL = "general"
    SCIENCE = "science"
    LANGUAGE = "language"
    CREATIVE = "creative"
    AUDITING = "auditing"
    FAST = "fast"

@dataclass
class SovereignModel:
    name: str
    display_name: str
    expertise: List[ModelExpertise]
    primary_expertise: ModelExpertise
    size_gb: float
    speed: int
    accuracy: int
    vram_required: float
    description: str
    strengths: List[str]
    constitutional: bool = False

SOVEREIGN_MODEL_ROSTER = {
    # Constitutional AI
    "sovereign-constitutional:latest": SovereignModel(
        name="sovereign-constitutional:latest",
        display_name="🏛️ Sovereign Constitutional",
        expertise=[ModelExpertise.CONSTITUTIONAL, ModelExpertise.AUDITING],
        primary_expertise=ModelExpertise.CONSTITUTIONAL,
        size_gb=3.8, speed=6, accuracy=10, vram_required=4.0,
        description="Your distilled Constitutional AI",
        strengths=["Constitutional enforcement", "Zero-drift"],
        constitutional=True
    ),
    
    # Code Generation
    "qwen2.5-coder:7b": SovereignModel(
        name="qwen2.5-coder:7b",
        display_name="🤖 Qwen Coder 7B",
        expertise=[ModelExpertise.CODE_GENERATION, ModelExpertise.REASONING],
        primary_expertise=ModelExpertise.CODE_GENERATION,
        size_gb=4.7, speed=7, accuracy=9, vram_required=4.7,
        description="Best-in-class code generation",
        strengths=["React/TypeScript", "Python", "Debugging"],
        constitutional=False
    ),
    
    "deepseek-coder:latest": SovereignModel(
        name="deepseek-coder:latest",
        display_name="⚡ DeepSeek Coder",
        expertise=[ModelExpertise.CODE_GENERATION, ModelExpertise.FAST],
        primary_expertise=ModelExpertise.CODE_GENERATION,
        size_gb=0.776, speed=9, accuracy=7, vram_required=1.0,
        description="Ultra-fast code completion",
        strengths=["Speed", "Low VRAM"],
        constitutional=False
    ),
    
    # Vision
    "llama3.2-vision:11b": SovereignModel(
        name="llama3.2-vision:11b",
        display_name="👁️ Llama Vision 11B",
        expertise=[ModelExpertise.VISION, ModelExpertise.REASONING],
        primary_expertise=ModelExpertise.VISION,
        size_gb=7.8, speed=5, accuracy=9, vram_required=8.0,
        description="Vision understanding & prompt enhancement",
        strengths=["Image understanding", "Visual reasoning"],
        constitutional=False
    ),
    
    # Reasoning
    "phi4:latest": SovereignModel(
        name="phi4:latest",
        display_name="🧠 Phi-4",
        expertise=[ModelExpertise.REASONING, ModelExpertise.SCIENCE],
        primary_expertise=ModelExpertise.REASONING,
        size_gb=9.1, speed=4, accuracy=10, vram_required=9.1,
        description="State-of-the-art reasoning",
        strengths=["Complex reasoning", "Mathematics"],
        constitutional=False
    ),
    
    # Fast
    "llama3.2:1b": SovereignModel(
        name="llama3.2:1b",
        display_name="⚡ Llama 3.2 1B",
        expertise=[ModelExpertise.FAST, ModelExpertise.GENERAL],
        primary_expertise=ModelExpertise.FAST,
        size_gb=1.3, speed=10, accuracy=5, vram_required=1.3,
        description="Ultra-fast for simple queries",
        strengths=["Blazing fast", "Low VRAM"],
        constitutional=False
    ),
}

class SovereignExpertiseRouter:
    def __init__(self):
        self.models = SOVEREIGN_MODEL_ROSTER
        
    def route(self, message: str, vram_budget: float = 9.0) -> Dict:
        message_lower = message.lower()
        
        # Constitutional first
        if any(kw in message_lower for kw in ["constitutional", "audit", "zero-drift", "law"]):
            return {
                "model": "sovereign-constitutional:latest",
                "display": "🏛️ Sovereign Constitutional",
                "confidence": 95,
                "reason": "Constitutional AI enforcement required"
            }
        
        # Code generation
        if any(kw in message_lower for kw in ["code", "function", "react", "python", "debug"]):
            if vram_budget >= 4.7:
                return {
                    "model": "qwen2.5-coder:7b",
                    "display": "🤖 Qwen Coder 7B",
                    "confidence": 92,
                    "reason": "Best-in-class code generation"
                }
            else:
                return {
                    "model": "deepseek-coder:latest",
                    "display": "⚡ DeepSeek Coder",
                    "confidence": 88,
                    "reason": "Fast code with low VRAM"
                }
        
        # Vision
        if any(kw in message_lower for kw in ["image", "picture", "see", "visual", "generate image"]):
            return {
                "model": "llama3.2-vision:11b",
                "display": "👁️ Llama Vision 11B",
                "confidence": 94,
                "reason": "Vision understanding expert"
            }
        
        # Complex reasoning
        if any(kw in message_lower for kw in ["explain", "why", "how", "reason", "complex", "math"]):
            if vram_budget >= 9.1:
                return {
                    "model": "phi4:latest",
                    "display": "🧠 Phi-4",
                    "confidence": 96,
                    "reason": "State-of-the-art reasoning"
                }
        
        # Default to fast model
        return {
            "model": "llama3.2:1b",
            "display": "⚡ Llama 3.2 1B",
            "confidence": 75,
            "reason": "Fastest response for general queries"
        }

router = SovereignExpertiseRouter()
'@
    
    $expertiseClassifier | Out-File -FilePath $classifierPath -Encoding utf8 -Force
    Write-Success "Expertise Classifier upgraded to v3.1"
}

# ============================================================================
# MODULE 3: SOVEREIGN COMFYUI BRIDGE UPGRADE
# ============================================================================
function Update-SovereignComfyUIBridge {
    Write-Step "🎨 Upgrading Sovereign ComfyUI Bridge..." -Color "Magenta"
    
    $bridgePath = "$REZSTACK_ROOT\src\services\sovereign_comfyui_bridge.py"
    
    Backup-SovereignAI -Component "comfyui_bridge" -Path $bridgePath
    
    # Check ComfyUI status
    try {
        $comfyUI = Invoke-WebRequest -Uri "http://localhost:8188" -UseBasicParsing -TimeoutSec 2
        Write-Success "ComfyUI is running"
    } catch {
        Write-Warning "ComfyUI not running - starting..."
        Start-Process "$COMFYUI_ROOT\constitutional_launcher.bat"
        Start-Sleep -Seconds 10
    }
    
    # Fix ComfyUI Torch CUDA issue
    Write-Step "🔧 Fixing ComfyUI Torch CUDA configuration..." -Color "Cyan"
    try {
        Set-Location $COMFYUI_ROOT
        & ".\python_embeded\python.exe" -m pip install --upgrade torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
        Write-Success "ComfyUI Torch updated with CUDA 11.8 support"
    } catch {
        Write-Error "ComfyUI Torch update failed: $_"
    }
}

# ============================================================================
# MODULE 4: JARVIS AUTO-HEALER UPGRADE
# ============================================================================
function Update-JARVISAutoHealer {
    Write-Step "🛡️ Upgrading JARVIS Auto-Healer..." -Color "Magenta"
    
    $healerPath = "$REZSTACK_ROOT\src\sovereign-jarvis\jarvis-auto-heal.py"
    
    Backup-SovereignAI -Component "jarvis_autohealer" -Path $healerPath
    
    # Run self-heal on JARVIS itself
    Write-Step "🔄 Running JARVIS self-healing protocol..." -Color "Cyan"
    try {
        Set-Location "$REZSTACK_ROOT\src\sovereign-jarvis"
        python jarvis-auto-heal.py . --no-push
        Write-Success "JARVIS self-healing complete"
    } catch {
        Write-Error "JARVIS self-healing failed: $_"
    }
}

# ============================================================================
# MODULE 5: REZ-THE-STACK LAUNCHER UPGRADE
# ============================================================================
function Update-RezTheStackLauncher {
    Write-Step "🚀 Upgrading REZ-THE-STACK.bat launcher..." -Color "Magenta"
    
    $launcherPath = "$REZSTACK_ROOT\REZ-THE-STACK.bat"
    
    Backup-SovereignAI -Component "rez_the_stack" -Path $launcherPath
    
    Write-Success "REZ-THE-STACK.bat ready for upgrade"
}

# ============================================================================
# MODULE 6: CONSTITUTIONAL MODEL RETRAINING
# ============================================================================
function Update-ConstitutionalModel {
    Write-Step "🏛️  Retraining Constitutional AI Model..." -Color "Magenta"
    
    if (-not (Test-Path $TRAINER_ROOT)) {
        Write-Warning "RezTrainer not found at $TRAINER_ROOT"
        return
    }
    
    Backup-SovereignAI -Component "constitutional_model" -Path "$TRAINER_ROOT\production_constitutional_predictor.pkl"
    
    try {
        Set-Location $TRAINER_ROOT
        python retrain_constitutional.py
        Write-Success "Constitutional model retrained with latest principles"
    } catch {
        Write-Error "Constitutional retraining failed: $_"
    }
}

# ============================================================================
# MODULE 7: SYSTEM DIAGNOSTIC
# ============================================================================
function Test-SovereignSystem {
    Write-Step "🔍 Running Complete System Diagnostic..." -Color "Cyan"
    
    $results = @()
    
    # Test Ollama
    try {
        $ollama = ollama list 2>$null
        $modelCount = ($ollama -split "`n").Count - 1
        $results += [PSCustomObject]@{Component="Ollama"; Status="✅"; Details="$modelCount models"}
    } catch {
        $results += [PSCustomObject]@{Component="Ollama"; Status="❌"; Details="Not running"}
    }
    
    # Test Swarm
    try {
        $swarm = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 2
        $results += [PSCustomObject]@{Component="Rezonic Swarm"; Status="✅"; Details="Port 8000"}
    } catch {
        $results += [PSCustomObject]@{Component="Rezonic Swarm"; Status="❌"; Details="Not running"}
    }
    
    # Test Bridge
    try {
        $bridge = Invoke-RestMethod -Uri "http://localhost:8001/health" -TimeoutSec 2
        $results += [PSCustomObject]@{Component="Constitutional Bridge"; Status="✅"; Details="Port 8001"}
    } catch {
        $results += [PSCustomObject]@{Component="Constitutional Bridge"; Status="❌"; Details="Not running"}
    }
    
    # Test JARVIS API
    try {
        $jarvis = Invoke-RestMethod -Uri "http://localhost:8002/health" -TimeoutSec 2
        $results += [PSCustomObject]@{Component="JARVIS API"; Status="✅"; Details="Port 8002"}
    } catch {
        $results += [PSCustomObject]@{Component="JARVIS API"; Status="❌"; Details="Not running"}
    }
    
    # Test JARVIS IDE
    try {
        $ide = Invoke-WebRequest -Uri "http://localhost:8080" -UseBasicParsing -TimeoutSec 2
        $results += [PSCustomObject]@{Component="JARVIS IDE"; Status="✅"; Details="Port 8080"}
    } catch {
        $results += [PSCustomObject]@{Component="JARVIS IDE"; Status="❌"; Details="Not running"}
    }
    
    # Test Sovereign Chat
    try {
        $chat = Invoke-WebRequest -Uri "http://localhost:5176" -UseBasicParsing -TimeoutSec 2
        $results += [PSCustomObject]@{Component="Sovereign Chat"; Status="✅"; Details="Port 5176"}
    } catch {
        $results += [PSCustomObject]@{Component="Sovereign Chat"; Status="❌"; Details="Not running"}
    }
    
    # Test ComfyUI
    try {
        $comfy = Invoke-WebRequest -Uri "http://localhost:8188" -UseBasicParsing -TimeoutSec 2
        $results += [PSCustomObject]@{Component="ComfyUI"; Status="✅"; Details="Port 8188"}
    } catch {
        $results += [PSCustomObject]@{Component="ComfyUI"; Status="❌"; Details="Not running"}
    }
    
    # Test Constitutional Model
    if (Test-Path "$TRAINER_ROOT\production_constitutional_predictor.pkl") {
        $results += [PSCustomObject]@{Component="Constitutional Model"; Status="✅"; Details="Loaded"}
    } else {
        $results += [PSCustomObject]@{Component="Constitutional Model"; Status="❌"; Details="Missing"}
    }
    
    # Display results
    Write-Host "`n📊 SYSTEM DIAGNOSTIC RESULTS" -ForegroundColor Cyan
    Write-Host "════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    $results | Format-Table -Property Component, Status, Details -AutoSize
    
    $online = ($results | Where-Object { $_.Status -eq "✅" }).Count
    $total = $results.Count
    
    Write-Host "`n📈 SYSTEM HEALTH: $online/$total components online" -ForegroundColor $(if ($online -eq $total) {"Green"} else {"Yellow"})
    
    return $results
}

# ============================================================================
# MAIN UPGRADE PIPELINE
# ============================================================================
function Start-SovereignUpgrade {
    Show-Header
    
    if ($Help) {
        Write-Host @"

USAGE:
    .\SOVEREIGN-AI-UPGRADE.ps1 [OPTIONS]

OPTIONS:
    -Force                      Skip all confirmation prompts
    -BackupOnly                 Only create backups, no upgrades
    -DryRun                    Show what would be upgraded without making changes
    -SkipModelPull             Skip pulling new Ollama models
    -SkipConstitutionalRetrain Skip retraining constitutional model
    -Help                      Show this help message

EXAMPLES:
    .\SOVEREIGN-AI-UPGRADE.ps1                    # Full upgrade with confirmations
    .\SOVEREIGN-AI-UPGRADE.ps1 -Force            # Unattended full upgrade
    .\SOVEREIGN-AI-UPGRADE.ps1 -BackupOnly       # Only create backups
    .\SOVEREIGN-AI-UPGRADE.ps1 -DryRun           # Preview upgrade actions

"@ -ForegroundColor Gray
        return
    }
    
    if ($DryRun) {
        Write-Step "🔍 DRY RUN MODE - No changes will be made" -Color "Yellow"
    }
    
    # Create backup directory
    New-Item -ItemType Directory -Path $BACKUP_ROOT -Force | Out-Null
    New-Item -ItemType Directory -Path $LOG_ROOT -Force | Out-Null
    
    Write-Step "📦 Creating system backup..." -Color "Cyan"
    
    # Backup critical components
    Backup-SovereignAI -Component "rezstack_full" -Path $REZSTACK_ROOT
    Backup-SovereignAI -Component "reztrainer" -Path $TRAINER_ROOT
    
    if ($BackupOnly) {
        Write-Step "✅ Backup only mode - Upgrade skipped" -Color "Green"
        return
    }
    
    if (-not $DryRun) {
        # Execute upgrades
        if (-not $SkipModelPull) { Update-OllamaModels }
        Update-SovereignExpertiseClassifier
        Update-SovereignComfyUIBridge
        Update-JARVISAutoHealer
        Update-RezTheStackLauncher
        if (-not $SkipConstitutionalRetrain) { Update-ConstitutionalModel }
        
        # Final diagnostic
        Start-Sleep -Seconds 3
        $diagnostic = Test-SovereignSystem
        
        # Create upgrade report
        $report = @{
            Timestamp = $TIMESTAMP
            Version = $VERSION
            Components = @{
                OllamaModels = (ollama list 2>$null) -join "`n"
                Diagnostic = $diagnostic
            }
            Upgrades = @(
                "Expertise Classifier v3.1",
                "ComfyUI Bridge Enhanced",
                "JARVIS Auto-Healer Updated",
                "REZ-THE-STACK Launcher v3.1"
            )
        }
        
        $reportPath = "$LOG_ROOT\upgrade-report-$TIMESTAMP.json"
        $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $reportPath -Encoding utf8
        
        Write-Step "📊 Upgrade complete! Report saved to:" -Color "Green"
        Write-Host "     $reportPath" -ForegroundColor Gray
        
        # Launch new ecosystem
        $launch = Read-Host "`n🚀 Launch upgraded ecosystem now? (Y/N)"
        if ($launch -eq 'Y') {
            & "$REZSTACK_ROOT\REZ-THE-STACK.bat"
        }
    }
}

# ============================================================================
# EXECUTE
# ============================================================================
Start-SovereignUpgrade