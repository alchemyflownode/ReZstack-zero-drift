cd "G:\okiru\app builder\RezStackFinal"

# Function to write files without BOM
function Write-FileNoBOM {
    param(
        [string]$Path,
        [string]$Content
    )
    $encoding = [System.Text.UTF8Encoding]::new($false) # $false = no BOM
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

# Fix all config files
Write-Host "🔧 Fixing all config files without BOM..." -ForegroundColor Yellow

# Fix package.json
$packageJson = @'
{
  "name": "rezstack-zero-drift",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "serve": "node server.js",
    "start": "npm run dev",
    "dev:all": "concurrently \"npm run serve\" \"npm run dev\""
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^4.4.7",
    "lucide-react": "^0.309.0",
    "react-hot-toast": "^2.4.1",
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "@types/express": "^4.17.21",
    "@types/ws": "^8.5.10",
    "@types/cors": "^2.8.17",
    "concurrently": "^8.2.2",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
'@

Write-FileNoBOM -Path "package.json" -Content $packageJson
Write-Host "✅ Fixed package.json (no BOM)" -ForegroundColor Green

# Fix vite.config.ts
$viteConfig = @'
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@stores": path.resolve(__dirname, "src/stores"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@types": path.resolve(__dirname, "src/types")
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      },
      "/ws": {
        target: "ws://localhost:3001",
        ws: true
      }
    }
  },
  build: {
    outDir: "dist",
    sourcemap: true
  },
  esbuild: {
    target: "es2022"
  }
})
'@

Write-FileNoBOM -Path "vite.config.ts" -Content $viteConfig
Write-Host "✅ Fixed vite.config.ts" -ForegroundColor Green

# Fix tsconfig.json
$tsconfig = @'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@stores/*": ["src/stores/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
'@

Write-FileNoBOM -Path "tsconfig.json" -Content $tsconfig
Write-Host "✅ Fixed tsconfig.json" -ForegroundColor Green

# Fix tsconfig.node.json
$tsconfigNode = @'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts", "server.js"]
}
'@

Write-FileNoBOM -Path "tsconfig.node.json" -Content $tsconfigNode
Write-Host "✅ Fixed tsconfig.node.json" -ForegroundColor Green

# Fix postcss.config.js as ESM
$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@

Write-FileNoBOM -Path "postcss.config.js" -Content $postcssConfig
Write-Host "✅ Fixed postcss.config.js" -ForegroundColor Green

# Fix tailwind.config.js as ESM
$tailwindConfig = @'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        }
      }
    },
  },
  plugins: [],
}
'@

Write-FileNoBOM -Path "tailwind.config.js" -Content $tailwindConfig
Write-Host "✅ Fixed tailwind.config.js" -ForegroundColor Green

# Fix index.css if it exists
if (Test-Path "src/index.css") {
    $indexCss = @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}
'@
    Write-FileNoBOM -Path "src/index.css" -Content $indexCss
    Write-Host "✅ Fixed src/index.css" -ForegroundColor Green
}

# Now remove node_modules and do a clean install
Write-Host "`n🧹 Cleaning up and reinstalling..." -ForegroundColor Cyan

# Remove node_modules if exists
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Removed old node_modules" -ForegroundColor Green
}

# Install dependencies
Write-Host "📦 Installing fresh dependencies..." -ForegroundColor Magenta
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
    
    # Test if TypeScript compiles
    Write-Host "🔧 Testing TypeScript compilation..." -ForegroundColor Yellow
    npx tsc --noEmit
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ TypeScript compilation successful!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  TypeScript has some issues, but continuing..." -ForegroundColor Yellow
    }
    
    # Launch the app
    Write-Host "`n🚀 LAUNCHING REZSTACK ZERO-DRIFT..." -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Yellow
    
    # Start API server in background
    Write-Host "🔥 Starting API Server (port 3001)..." -ForegroundColor Green
    $apiJob = Start-Job -Name "RezStack-API" -ScriptBlock {
        cd "G:\okiru\app builder\RezStackFinal"
        node server.js
    }
    
    Start-Sleep -Seconds 2
    
    # Start frontend dev server
    Write-Host "🎨 Starting Frontend Dev Server (port 3000)..." -ForegroundColor Green
    Write-Host "🌐 Opening http://localhost:3000" -ForegroundColor White
    
    # Run vite dev server
    npx vite
    
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    Write-Host "Trying with --force flag..." -ForegroundColor Yellow
    npm install --force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed with --force" -ForegroundColor Green
        Write-Host "`n🚀 Now run: npx vite" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Still failed. Manual troubleshooting needed." -ForegroundColor Red
        Write-Host "Try:" -ForegroundColor White
        Write-Host "1. Delete node_modules folder" -ForegroundColor Gray
        Write-Host "2. Delete package-lock.json" -ForegroundColor Gray
        Write-Host "3. Run: npm cache clean --force" -ForegroundColor Gray
        Write-Host "4. Run: npm install" -ForegroundColor Gray
    }
}