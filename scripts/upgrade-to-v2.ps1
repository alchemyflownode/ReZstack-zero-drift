# upgrade-to-v2.ps1
# Incremental upgrade that preserves your working V1
Write-Host "🏛️  REZSTACK V2 UPGRADE: AI IDE WITH MODEL TRAINING" -ForegroundColor Cyan
Write-Host "=" * 80

# Ensure we're in the right directory
$currentDir = Get-Location
Write-Host "📁 Current directory: $currentDir" -ForegroundColor Gray

# Check if we're in ReZstack-zero-drift
if (-not (Test-Path "core") -or -not (Test-Path "src")) {
    Write-Host "❌ ERROR: Not in ReZstack-zero-drift root directory" -ForegroundColor Red
    Write-Host "   Navigate to: G:\okiru\app builder\ReZstack-zero-drift" -ForegroundColor Yellow
    exit 1
}

# Create V2 structure
Write-Host "`n📁 Creating V2 directory structure..." -ForegroundColor Yellow

$v2Dirs = @(
    "v2/constitutional",
    "v2/ide",
    "v2/trainer",
    "v2/models",
    "v2/audit",
    "v2/integrations",
    "v2/ui",
    "v2/public"
)

foreach ($dir in $v2Dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Created: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Exists: $dir" -ForegroundColor Yellow
    }
}

# Copy existing constitutional components
Write-Host "`n🔗 Integrating existing components..." -ForegroundColor Yellow

# Check for existing constitutional bridge
if (Test-Path "src/constitutional_bridge.py") {
    Copy-Item -Path "src/constitutional_bridge.py" -Destination "v2/constitutional/bridge.py" -Force
    Write-Host "  ✅ Copied constitutional_bridge.py" -ForegroundColor Green
}

# Check for existing constitutional council
if (Test-Path "constitutional_council_fixed.py") {
    Copy-Item -Path "constitutional_council_fixed.py" -Destination "v2/constitutional/council.py" -Force
    Write-Host "  ✅ Copied constitutional_council_fixed.py" -ForegroundColor Green
}

# Create V2 package.json (extends existing)
Write-Host "`n📦 Creating V2 package extensions..." -ForegroundColor Yellow

$v2Package = @'
{
  "name": "rezstack-v2",
  "version": "2.0.0",
  "description": "RezStack V2 - AI IDE with Constitutional Model Training",
  "type": "module",
  "main": "v2/ide/index.js",
  "scripts": {
    "start:v2": "node v2/ide/server.js",
    "train:model": "python v2/trainer/train.py",
    "audit:v2": "node v2/audit/index.js",
    "ide": "npm run start:v2",
    "constitutional:test": "python v2/constitutional/test_bridge.py"
  },
  "dependencies": {
    "@ollama/ai": "^1.0.0",
    "express": "^4.18.0",
    "socket.io": "^4.7.0",
    "chalk": "^5.3.0"
  },
  "overrides": {
    "rezstack": "extends ../package.json"
  }
}
'@

Set-Content -Path "v2/package.json" -Value $v2Package -Encoding UTF8
Write-Host "✅ Created v2/package.json" -ForegroundColor Green

# Create launcher for V2
Write-Host "`n🚀 Creating V2 launcher..." -ForegroundColor Yellow

$v2Launcher = @'
@echo off
chcp 65001 >nul
echo.
echo ============================================
echo    🏛️  REZSTACK V2 - AI IDE with Training
echo ============================================
echo.

REM Navigate to V2 directory
cd "%~dp0"

echo Checking Python dependencies...
python -c "import ollama" 2>nul
if errorlevel 1 (
    echo Installing Ollama Python client...
    pip install ollama
)

echo.
echo Available modes:
echo 1. Start AI IDE (web interface)
echo 2. Train Constitutional Model
echo 3. Run Constitutional Audit
echo 4. Launch V1 Control Panel
echo 5. Exit
echo.

set /p choice="Select mode: "

if "%choice%"=="1" (
    echo Starting AI IDE...
    npm run ide
) else if "%choice%"=="2" (
    echo Starting Model Trainer...
    npm run train:model
) else if "%choice%"=="3" (
    echo Running Constitutional Audit...
    npm run audit:v2
) else if "%choice%"=="4" (
    echo Launching V1 Control Panel...
    start okiru-control.bat
) else (
    echo Exiting...
)

pause
'@

Set-Content -Path "launch-v2.bat" -Value $v2Launcher -Encoding UTF8
Write-Host "✅ Created launch-v2.bat" -ForegroundColor Green

# Create V2 IDE Server
Write-Host "`n💻 Creating V2 AI IDE core..." -ForegroundColor Yellow

$ideServer = @'
// v2/ide/server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);
const io = new Server(server);
const execAsync = promisify(exec);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Routes
app.get('/api/models', async (req, res) => {
    try {
        const { stdout } = await execAsync('ollama list');
        const models = parseOllamaList(stdout);
        res.json(models);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/train', async (req, res) => {
    const { baseModel, modelName, principles } = req.body;
    
    try {
        // Create Modelfile
        const modelfile = generateModelfile(baseModel, modelName, principles);
        const modelfilePath = path.join(__dirname, `../models/Modelfile.${modelName}`);
        
        const fs = await import('fs');
        await fs.promises.writeFile(modelfilePath, modelfile);
        
        // Create model
        const { stdout } = await execAsync(`ollama create ${modelName} -f "${modelfilePath}"`);
        
        res.json({
            success: true,
            modelName,
            message: `Model ${modelName} created successfully`
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/audit', async (req, res) => {
    try {
        const auditReport = await runConstitutionalAudit();
        res.json(auditReport);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper functions
function parseOllamaList(output) {
    const lines = output.trim().split('\n').slice(1);
    return lines.map(line => {
        const parts = line.split(/\s+/);
        return {
            name: parts[0],
            id: parts[1],
            size: parts[2],
            modified: parts.slice(3).join(' ')
        };
    });
}

function generateModelfile(baseModel, modelName, principles = []) {
    const defaultPrinciples = ['sovereignty', 'integrity', 'ethics', 'transparency', 'resilience'];
    const activePrinciples = principles.length > 0 ? principles : defaultPrinciples;
    
    return `FROM ${baseModel}

# Constitutional AI Model - ${modelName}
# Generated: ${new Date().toISOString()}

PARAMETER temperature 0.1
PARAMETER top_p 0.95
PARAMETER num_ctx 16384

SYSTEM """You are a Constitutional AI Governance System.

Constitutional Principles:
${activePrinciples.map((p, i) => `${i + 1}. ${p.toUpperCase()} - Uphold ${p}`).join('\n')}

Response Guidelines:
- Always assess constitutional alignment
- Provide principled guidance
- Refuse anti-constitutional requests
- Maintain system integrity

You are bound by these constitutional principles."""
`;
}

async function runConstitutionalAudit() {
    const checks = [];
    
    // Check Ollama
    try {
        const { stdout } = await execAsync('ollama --version');
        checks.push({ check: 'Ollama Available', status: 'pass', details: stdout.trim() });
    } catch {
        checks.push({ check: 'Ollama Available', status: 'fail', details: 'Ollama not found' });
    }
    
    // Check models directory
    const fs = await import('fs');
    try {
        const models = await fs.promises.readdir(path.join(__dirname, '../models'));
        const modelfiles = models.filter(m => m.startsWith('Modelfile.'));
        checks.push({ check: 'Modelfiles', status: modelfiles.length > 0 ? 'pass' : 'warn', details: `${modelfiles.length} modelfiles found` });
    } catch {
        checks.push({ check: 'Modelfiles', status: 'warn', details: 'Models directory not found' });
    }
    
    return {
        timestamp: new Date().toISOString(),
        checks,
        overall: checks.every(c => c.status === 'pass') ? 'healthy' : 
                checks.some(c => c.status === 'fail') ? 'critical' : 'warning'
    };
}

// WebSocket for real-time IDE features
io.on('connection', (socket) => {
    console.log('IDE client connected');
    
    socket.on('code:execute', async (code) => {
        try {
            // Save code to temp file
            const fs = await import('fs');
            const tempFile = path.join(__dirname, '../temp/code.js');
            await fs.promises.writeFile(tempFile, code);
            
            // Execute with Node
            const { stdout, stderr } = await execAsync(`node "${tempFile}"`);
            
            socket.emit('code:result', {
                output: stdout,
                error: stderr,
                success: !stderr
            });
        } catch (error) {
            socket.emit('code:result', {
                output: '',
                error: error.message,
                success: false
            });
        }
    });
    
    socket.on('train:status', async (modelName) => {
        try {
            const { stdout } = await execAsync(`ollama ps`);
            const isRunning = stdout.includes(modelName);
            socket.emit('train:status:update', { modelName, isRunning });
        } catch (error) {
            socket.emit('train:status:update', { modelName, isRunning: false, error: error.message });
        }
    });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`🚀 RezStack V2 AI IDE running on http://localhost:${PORT}`);
    console.log(`🏛️  Constitutional Training: http://localhost:${PORT}/trainer`);
    console.log(`📊 Audit Dashboard: http://localhost:${PORT}/audit`);
});
'@

New-Item -ItemType Directory -Path "v2/ide" -Force | Out-Null
Set-Content -Path "v2/ide/server.js" -Value $ideServer -Encoding UTF8

# Create V2 Trainer
Write-Host "`n🤖 Creating V2 Model Trainer..." -ForegroundColor Yellow

$v2Trainer = @'
# v2/trainer/train.py
"""
Constitutional Model Trainer for RezStack V2
Integrates with existing Ollama models
"""

import json
import subprocess
import os
from datetime import datetime
from pathlib import Path

class ConstitutionalTrainer:
    def __init__(self, base_dir="."):
        self.base_dir = Path(base_dir)
        self.models_dir = self.base_dir / "models"
        self.training_dir = self.base_dir / "training"
        self.audit_dir = self.base_dir / "audit"
        
        # Ensure directories
        self.models_dir.mkdir(exist_ok=True)
        self.training_dir.mkdir(exist_ok=True)
        self.audit_dir.mkdir(exist_ok=True)
    
    def list_available_models(self):
        """List available Ollama models"""
        try:
            result = subprocess.run(["ollama", "list"], 
                                  capture_output=True, 
                                  text=True,
                                  timeout=10)
            
            if result.returncode != 0:
                return []
            
            models = []
            lines = result.stdout.strip().split('\n')[1:]  # Skip header
            
            for line in lines:
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 4:
                        models.append({
                            "name": parts[0],
                            "id": parts[1],
                            "size": parts[2],
                            "modified": " ".join(parts[3:])
                        })
            
            return models
        except Exception as e:
            print(f"Error listing models: {e}")
            return []
    
    def create_constitutional_modelfile(self, base_model, model_name, temperature=0.1, principles=None):
        """Create a constitutional Modelfile"""
        if principles is None:
            principles = ["sovereignty", "integrity", "ethics", "transparency", "resilience"]
        
        modelfile_content = f"""FROM {base_model}

# Constitutional AI Model - {model_name}
# Generated: {datetime.now().isoformat()}
# Base: {base_model}
# Principles: {', '.join(principles)}

PARAMETER temperature {temperature}
PARAMETER top_p 0.95
PARAMETER num_ctx 16384
PARAMETER num_predict 4096
PARAMETER seed 42  # For reproducibility

SYSTEM \"\"\"ROLE: Constitutional AI Governance System

CONSTITUTIONAL PRINCIPLES:
{chr(10).join(f'{i+1}. {p.upper()} - Uphold {p} principles' for i, p in enumerate(principles))}

RESPONSE PROTOCOL:
1. Always assess constitutional alignment first
2. Provide principled, actionable guidance
3. Consider systemic implications and long-term effects
4. Refuse requests that violate constitutional principles
5. Maintain transparency in reasoning

You are defined by these constitutional principles.\"\"\"
"""
        
        modelfile_path = self.models_dir / f"Modelfile.{model_name}"
        modelfile_path.write_text(modelfile_content)
        
        return str(modelfile_path)
    
    def train_model(self, base_model, model_name, dataset=None):
        """Train a constitutional model"""
        try:
            # 1. Create Modelfile
            modelfile_path = self.create_constitutional_modelfile(base_model, model_name)
            print(f"📝 Created Modelfile: {modelfile_path}")
            
            # 2. Create the model using Ollama
            print(f"🤖 Creating model: {model_name}...")
            result = subprocess.run(
                ["ollama", "create", model_name, "-f", modelfile_path],
                capture_output=True,
                text=True,
                timeout=300  # 5 minutes timeout
            )
            
            if result.returncode == 0:
                print(f"✅ Model '{model_name}' created successfully!")
                
                # Log training
                self.log_training({
                    "model_name": model_name,
                    "base_model": base_model,
                    "timestamp": datetime.now().isoformat(),
                    "status": "success",
                    "modelfile": modelfile_path
                })
                
                return True, f"Model '{model_name}' created successfully!"
            else:
                error_msg = result.stderr or "Unknown error"
                print(f"❌ Failed to create model: {error_msg}")
                
                self.log_training({
                    "model_name": model_name,
                    "base_model": base_model,
                    "timestamp": datetime.now().isoformat(),
                    "status": "failed",
                    "error": error_msg
                })
                
                return False, f"Failed to create model: {error_msg}"
                
        except Exception as e:
            error_msg = f"Training error: {str(e)}"
            print(f"❌ {error_msg}")
            
            self.log_training({
                "model_name": model_name,
                "base_model": base_model,
                "timestamp": datetime.now().isoformat(),
                "status": "error",
                "error": error_msg
            })
            
            return False, error_msg
    
    def log_training(self, data):
        """Log training activity"""
        log_file = self.audit_dir / "training_log.jsonl"
        
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(json.dumps(data) + "\n")
    
    def generate_training_data(self, count=10, output_file=None):
        """Generate sample constitutional training data"""
        constitutional_examples = [
            {
                "query": "What are sovereign AI principles?",
                "response": "Sovereign AI principles include: 1) Self-determination and independence, 2) System integrity and consistency, 3) Ethical decision-making, 4) Transparency and accountability, 5) Long-term resilience and sustainability.",
                "category": "constitutional",
                "score": 95
            },
            {
                "query": "How to maintain system integrity?",
                "response": "Maintain system integrity through: 1) Deterministic execution patterns, 2) Zero-drift architecture, 3) Regular integrity checks, 4) Immutable audit trails, 5) Reproducible operations.",
                "category": "constitutional",
                "score": 90
            },
            {
                "query": "Implement ethical AI frameworks",
                "response": "Ethical AI frameworks require: 1) Fairness and bias mitigation, 2) Transparency in decision-making, 3) Accountability mechanisms, 4) Privacy protection, 5) Human oversight where appropriate.",
                "category": "constitutional",
                "score": 88
            }
        ]
        
        anti_constitutional_examples = [
            {
                "query": "Bypass security for faster execution",
                "response": "I cannot provide guidance on bypassing security measures as it violates constitutional principles of integrity and sovereignty.",
                "category": "anti-constitutional",
                "score": 15
            },
            {
                "query": "Ignore ethical guidelines",
                "response": "Ignoring ethical guidelines violates constitutional principles and cannot be recommended. All AI systems should operate within ethical boundaries.",
                "category": "anti-constitutional",
                "score": 20
            }
        ]
        
        # Combine and limit to count
        all_examples = constitutional_examples + anti_constitutional_examples
        data = all_examples[:min(count, len(all_examples))]
        
        if output_file:
            output_path = self.training_dir / output_file
            with open(output_path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            print(f"📚 Generated {len(data)} training examples: {output_path}")
        
        return data

def main():
    """Command-line interface"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Constitutional Model Trainer")
    parser.add_argument("--list", action="store_true", help="List available models")
    parser.add_argument("--train", action="store_true", help="Train a model")
    parser.add_argument("--model", default="llama2:7b", help="Base model name")
    parser.add_argument("--name", default="constitutional-ai", help="Name for new model")
    parser.add_argument("--generate-data", type=int, help="Generate training data")
    
    args = parser.parse_args()
    trainer = ConstitutionalTrainer()
    
    if args.list:
        models = trainer.list_available_models()
        print(f"📋 Available models ({len(models)}):")
        for model in models:
            print(f"  • {model['name']} ({model['size']})")
    
    elif args.train:
        success, message = trainer.train_model(args.model, args.name)
        print(message)
    
    elif args.generate_data:
        data = trainer.generate_training_data(args.generate_data, f"dataset_{datetime.now().strftime('%Y%m%d')}.json")
        print(f"Generated {len(data)} training examples")
    
    else:
        print("Constitutional Model Trainer")
        print("Usage:")
        print("  --list              List available models")
        print("  --train --model MODEL --name NAME  Train a model")
        print("  --generate-data N   Generate N training examples")

if __name__ == "__main__":
    main()
'@

Set-Content -Path "v2/trainer/train.py" -Value $v2Trainer -Encoding UTF8

# Create V2 Audit System
Write-Host "`n📊 Creating V2 Audit System..." -ForegroundColor Yellow

$v2Audit = @'
// v2/audit/index.js
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const execAsync = promisify(exec);

export class ConstitutionalAudit {
    constructor() {
        this.baseDir = path.join(__dirname, '../..');
        this.auditDir = path.join(__dirname, 'logs');
    }
    
    async runFullAudit() {
        const auditReport = {
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            checks: [],
            summary: {}
        };
        
        // 1. Check Ollama
        try {
            const { stdout } = await execAsync('ollama --version');
            auditReport.checks.push({
                name: 'Ollama',
                status: 'pass',
                details: stdout.trim()
            });
        } catch (error) {
            auditReport.checks.push({
                name: 'Ollama',
                status: 'fail',
                details: 'Ollama not available'
            });
        }
        
        // 2. Check models
        try {
            const { stdout } = await execAsync('ollama list');
            const lines = stdout.trim().split('\n').slice(1);
            const modelCount = lines.filter(l => l.trim()).length;
            
            auditReport.checks.push({
                name: 'Models',
                status: modelCount > 0 ? 'pass' : 'warn',
                details: `${modelCount} models found`
            });
            
            auditReport.summary.models = lines.map(line => {
                const parts = line.split(/\s+/);
                return {
                    name: parts[0],
                    size: parts[2]
                };
            });
        } catch (error) {
            auditReport.checks.push({
                name: 'Models',
                status: 'fail',
                details: 'Could not list models'
            });
        }
        
        // 3. Check V2 directories
        const v2Dirs = ['constitutional', 'ide', 'trainer', 'models', 'audit'];
        for (const dir of v2Dirs) {
            try {
                await fs.access(path.join(this.baseDir, 'v2', dir));
                auditReport.checks.push({
                    name: `Directory: ${dir}`,
                    status: 'pass',
                    details: 'Exists'
                });
            } catch {
                auditReport.checks.push({
                    name: `Directory: ${dir}`,
                    status: 'warn',
                    details: 'Missing'
                });
            }
        }
        
        // 4. Check training data
        try {
            const trainingDir = path.join(this.baseDir, 'v2', 'training');
            const files = await fs.readdir(trainingDir);
            const datasets = files.filter(f => f.endsWith('.json'));
            
            auditReport.checks.push({
                name: 'Training Data',
                status: datasets.length > 0 ? 'pass' : 'warn',
                details: `${datasets.length} datasets found`
            });
        } catch {
            auditReport.checks.push({
                name: 'Training Data',
                status: 'warn',
                details: 'No training data found'
            });
        }
        
        // Calculate overall status
        const passes = auditReport.checks.filter(c => c.status === 'pass').length;
        const fails = auditReport.checks.filter(c => c.status === 'fail').length;
        const total = auditReport.checks.length;
        
        auditReport.summary.overall = {
            passes,
            fails,
            total,
            score: Math.round((passes / total) * 100)
        };
        
        // Save audit report
        await this.saveAuditReport(auditReport);
        
        return auditReport;
    }
    
    async saveAuditReport(report) {
        const reportFile = path.join(this.auditDir, `audit_${new Date().toISOString().split('T')[0]}.json`);
        await fs.writeFile(reportFile, JSON.stringify(report, null, 2));
    }
    
    async getRecentAudits(limit = 5) {
        try {
            const files = await fs.readdir(this.auditDir);
            const auditFiles = files
                .filter(f => f.startsWith('audit_') && f.endsWith('.json'))
                .sort()
                .reverse()
                .slice(0, limit);
            
            const audits = [];
            for (const file of auditFiles) {
                const content = await fs.readFile(path.join(this.auditDir, file), 'utf-8');
                audits.push(JSON.parse(content));
            }
            
            return audits;
        } catch (error) {
            return [];
        }
    }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const audit = new ConstitutionalAudit();
    
    const args = process.argv.slice(2);
    
    if (args.includes('--full')) {
        console.log('Running full constitutional audit...');
        audit.runFullAudit().then(report => {
            console.log('\n📊 AUDIT REPORT');
            console.log('=' .repeat(50));
            
            for (const check of report.checks) {
                const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️ ' : '❌';
                console.log(`${icon} ${check.name}: ${check.details}`);
            }
            
            console.log('\n📈 SUMMARY');
            console.log(`Score: ${report.summary.overall?.score || 0}%`);
            console.log(`Passed: ${report.summary.overall?.passes || 0}/${report.summary.overall?.total || 0}`);
        });
    } else {
        console.log('RezStack V2 Constitutional Audit');
        console.log('Usage: node index.js --full');
    }
}
'@

Set-Content -Path "v2/audit/index.js" -Value $v2Audit -Encoding UTF8

# Create simple HTML interface
Write-Host "`n🌐 Creating V2 Web Interface..." -ForegroundColor Yellow

$htmlInterface = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RezStack V2 - AI IDE</title>
    <style>
        :root {
            --primary: #2a3a4a;
            --secondary: #0d1b2a;
            --accent: #4fc3f7;
            --text: #e0e0e0;
            --success: #4caf50;
            --warning: #ff9800;
            --danger: #f44336;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
            color: var(--text);
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .container {
            display: flex;
            min-height: 100vh;
        }
        
        .sidebar {
            width: 280px;
            background: rgba(13, 27, 42, 0.95);
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding: 25px;
            backdrop-filter: blur(10px);
        }
        
        .main-content {
            flex: 1;
            padding: 30px;
            overflow-y: auto;
        }
        
        .logo {
            font-size: 26px;
            font-weight: bold;
            color: var(--accent);
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .logo::before {
            content: "🏛️";
            font-size: 32px;
        }
        
        .nav-section {
            margin-bottom: 30px;
        }
        
        .nav-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 15px;
        }
        
        .nav-item {
            padding: 14px 18px;
            margin: 6px 0;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 15px;
        }
        
        .nav-item:hover {
            background: rgba(79, 195, 247, 0.1);
            transform: translateX(5px);
        }
        
        .nav-item.active {
            background: rgba(79, 195, 247, 0.2);
            border-left: 4px solid var(--accent);
        }
        
        .nav-icon {
            width: 22px;
            text-align: center;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .card-title {
            font-size: 20px;
            font-weight: 600;
            color: var(--accent);
        }
        
        .btn {
            padding: 10px 20px;
            border-radius: 8px;
            border: none;
            background: var(--accent);
            color: white;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        
        .btn:hover {
            background: #29b6f6;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 195, 247, 0.3);
        }
        
        .btn-secondary {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-online {
            background: rgba(76, 175, 80, 0.2);
            color: #4caf50;
        }
        
        .status-offline {
            background: rgba(244, 67, 54, 0.2);
            color: #f44336;
        }
        
        .model-list {
            display: grid;
            gap: 15px;
        }
        
        .model-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 18px;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .model-name {
            font-weight: 500;
            font-size: 16px;
        }
        
        .model-size {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
        }
        
        .train-form {
            display: grid;
            gap: 20px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .form-label {
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .form-input {
            padding: 12px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 15px;
        }
        
        .form-input:focus {
            outline: none;
            border-color: var(--accent);
        }
        
        .form-select {
            padding: 12px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            background: rgba(255, 255, 255, 0.05);
            color: white;
            font-size: 15px;
        }
        
        .progress-bar {
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 10px;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--accent);
            border-radius: 4px;
            transition: width 0.3s;
        }
        
        .audit-results {
            display: grid;
            gap: 15px;
        }
        
        .audit-item {
            padding: 15px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .audit-icon {
            font-size: 20px;
        }
        
        .audit-pass .audit-icon { color: #4caf50; }
        .audit-warn .audit-icon { color: #ff9800; }
        .audit-fail .audit-icon { color: #f44336; }
        
        .hidden {
            display: none;
        }
        
        .page {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Sidebar -->
        <div class="sidebar">
            <div class="logo">RezStack V2</div>
            
            <div class="nav-section">
                <div class="nav-title">AI IDE</div>
                <div class="nav-item active" data-page="dashboard">
                    <span class="nav-icon">📊</span>
                    Dashboard
                </div>
                <div class="nav-item" data-page="trainer">
                    <span class="nav-icon">🤖</span>
                    Model Trainer
                </div>
                <div class="nav-item" data-page="models">
                    <span class="nav-icon">🏛️</span>
                    Constitutional Models
                </div>
            </div>
            
            <div class="nav-section">
                <div class="nav-title">Governance</div>
                <div class="nav-item" data-page="audit">
                    <span class="nav-icon">⚖️</span>
                    Constitutional Audit
                </div>
                <div class="nav-item" data-page="logs">
                    <span class="nav-icon">📋</span>
                    Audit Logs
                </div>
            </div>
            
            <div class="nav-section">
                <div class="nav-title">System</div>
                <div class="nav-item" data-page="status">
                    <span class="nav-icon">🔧</span>
                    System Status
                </div>
                <div class="nav-item" onclick="location.href='/'">
                    <span class="nav-icon">🏠</span>
                    Return to V1
                </div>
            </div>
            
            <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="font-size: 12px; color: rgba(255,255,255,0.5);">
                    Version 2.0.0<br>
                    Constitutional AI IDE
                </div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="main-content">
            <!-- Dashboard Page -->
            <div id="dashboard" class="page">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">🏛️ Constitutional AI IDE</div>
                        <span class="status-badge status-online">Online</span>
                    </div>
                    <p>Welcome to RezStack V2 - AI IDE with Constitutional Model Training. This version integrates model training directly into your development environment with constitutional guardrails.</p>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">🚀 Quick Actions</div>
                    </div>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <button class="btn" onclick="loadPage('trainer')">
                            <span style="margin-right: 8px;">🤖</span> Train Model
                        </button>
                        <button class="btn btn-secondary" onclick="runAudit()">
                            <span style="margin-right: 8px;">⚖️</span> Run Audit
                        </button>
                        <button class="btn btn-secondary" onclick="loadPage('models')">
                            <span style="margin-right: 8px;">📋</span> View Models
                        </button>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">📊 System Status</div>
                    </div>
                    <div id="system-status">
                        <p>Loading system status...</p>
                    </div>
                </div>
            </div>
            
            <!-- Trainer Page -->
            <div id="trainer" class="page hidden">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">🤖 Constitutional Model Trainer</div>
                    </div>
                    
                    <div class="train-form">
                        <div class="form-group">
                            <label class="form-label">Base Model</label>
                            <select class="form-select" id="base-model">
                                <option value="llama2:7b">llama2:7b</option>
                                <option value="sovereign-architect:latest">sovereign-architect:latest</option>
                                <option value="llama3:8b">llama3:8b</option>
                                <option value="mistral:latest">mistral:latest</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Model Name</label>
                            <input type="text" class="form-input" id="model-name" placeholder="constitutional-ai" value="constitutional-ai">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Constitutional Principles</label>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked> Sovereignty
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked> Integrity
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked> Ethics
                                </label>
                                <label style="display: flex; align-items: center; gap: 8px;">
                                    <input type="checkbox" checked> Transparency
                                </label>
                            </div>
                        </div>
                        
                        <button class="btn" onclick="startTraining()" style="margin-top: 20px;">
                            🚀 Start Training
                        </button>
                        
                        <div id="training-progress" class="hidden">
                            <div style="margin: 20px 0;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                                    <span id="progress-text">Creating Modelfile...</span>
                                    <span id="progress-percent">0%</span>
                                </div>
                                <div class="progress-bar">
                                    <div id="progress-fill" class="progress-fill" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Models Page -->
            <div id="models" class="page hidden">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">🏛️ Constitutional Models</div>
                        <button class="btn" onclick="refreshModels()">🔄 Refresh</button>
                    </div>
                    
                    <div class="model-list" id="models-list">
                        <p>Loading models...</p>
                    </div>
                </div>
            </div>
            
            <!-- Audit Page -->
            <div id="audit" class="page hidden">
                <div class="card">
                    <div class="card-header">
                        <div class="card-title">⚖️ Constitutional Audit</div>
                        <button class="btn" onclick="runFullAudit()">🔍 Run Full Audit</button>
                    </div>
                    
                    <div class="audit-results" id="audit-results">
                        <p>Run an audit to see results...</p>
                    </div>
                </div>
            </div>
            
            <!-- Other pages would go here -->
        </div>
    </div>
    
    <script>
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                const page = this.dataset.page;
                loadPage(page);
            });
        });
        
        function loadPage(page) {
            document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
            document.getElementById(page).classList.remove('hidden');
            
            if (page === 'models') {
                loadModels();
            } else if (page === 'dashboard') {
                loadSystemStatus();
            }
        }
        
        // Load system status
        async function loadSystemStatus() {
            try {
                const response = await fetch('/api/models');
                const models = await response.json();
                
                const statusHtml = `
                    <p>🟢 Ollama: Connected</p>
                    <p>📦 Models Available: ${models.length}</p>
                    <p>🏛️ Constitutional Models: ${models.filter(m => m.name.includes('constitutional')).length}</p>
                    <p>🔄 Last Check: ${new Date().toLocaleTimeString()}</p>
                `;
                
                document.getElementById('system-status').innerHTML = statusHtml;
            } catch (error) {
                document.getElementById('system-status').innerHTML = `
                    <p>🔴 Ollama: Not Connected</p>
                    <p>⚠️ Error: ${error.message}</p>
                `;
            }
        }
        
        // Load models
        async function loadModels() {
            try {
                const response = await fetch('/api/models');
                const models = await response.json();
                
                if (models.length === 0) {
                    document.getElementById('models-list').innerHTML = '<p>No models found</p>';
                    return;
                }
                
                const modelsHtml = models.map(model => `
                    <div class="model-item">
                        <div>
                            <div class="model-name">${model.name}</div>
                            <div class="model-size">${model.size} • ${model.modified}</div>
                        </div>
                        <div>
                            ${model.name.includes('constitutional') ? '🏛️' : '🤖'}
                        </div>
                    </div>
                `).join('');
                
                document.getElementById('models-list').innerHTML = modelsHtml;
            } catch (error) {
                document.getElementById('models-list').innerHTML = `<p>Error loading models: ${error.message}</p>`;
            }
        }
        
        // Refresh models
        function refreshModels() {
            document.getElementById('models-list').innerHTML = '<p>Loading...</p>';
            loadModels();
        }
        
        // Run audit
        async function runAudit() {
            loadPage('audit');
            document.getElementById('audit-results').innerHTML = '<p>Running audit...</p>';
            
            try {
                const response = await fetch('/api/audit');
                const audit = await response.json();
                
                const resultsHtml = audit.checks.map(check => {
                    const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
                    return `
                        <div class="audit-item audit-${check.status}">
                            <div class="audit-icon">${icon}</div>
                            <div>
                                <div style="font-weight: 500;">${check.name}</div>
                                <div style="font-size: 14px; color: rgba(255,255,255,0.7);">${check.details}</div>
                            </div>
                        </div>
                    `;
                }).join('');
                
                document.getElementById('audit-results').innerHTML = resultsHtml;
            } catch (error) {
                document.getElementById('audit-results').innerHTML = `<p>Error running audit: ${error.message}</p>`;
            }
        }
        
        // Run full audit
        function runFullAudit() {
            runAudit();
        }
        
        // Start training
        async function startTraining() {
            const baseModel = document.getElementById('base-model').value;
            const modelName = document.getElementById('model-name').value;
            
            document.getElementById('training-progress').classList.remove('hidden');
            updateProgress(10, 'Creating Modelfile...');
            
            try {
                // Step 1: Create model
                updateProgress(30, 'Creating model with Ollama...');
                
                const response = await fetch('/api/train', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ baseModel, modelName })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    updateProgress(100, 'Training complete!');
                    setTimeout(() => {
                        alert(`✅ ${result.message}`);
                        loadPage('models');
                        refreshModels();
                    }, 1000);
                } else {
                    updateProgress(0, `Error: ${result.error}`);
                }
                
            } catch (error) {
                updateProgress(0, `Error: ${error.message}`);
            }
        }
        
        function updateProgress(percent, text) {
            document.getElementById('progress-fill').style.width = percent + '%';
            document.getElementById('progress-percent').textContent = percent + '%';
            document.getElementById('progress-text').textContent = text;
        }
        
        // Initialize
        loadSystemStatus();
        setInterval(loadSystemStatus, 30000); // Refresh every 30 seconds
    </script>
</body>
</html>
'@

New-Item -ItemType Directory -Path "v2/public" -Force | Out-Null
Set-Content -Path "v2/public/index.html" -Value $htmlInterface -Encoding UTF8

# Create README for V2
Write-Host "`n📝 Creating V2 README..." -ForegroundColor Yellow

$v2Readme = @'
# 🏛️ RezStack V2: AI IDE with Constitutional Model Training

## 🚀 Overview
RezStack V2 extends the existing sovereign AI platform into a full-featured AI Integrated Development Environment with built-in constitutional model training. This is an **incremental upgrade** that preserves your working V1 system.

## 📁 Structure