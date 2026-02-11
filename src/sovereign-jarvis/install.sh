#!/bin/bash
# Sovereign JARVIS Installation Script

set -e

echo "🚀 Installing Sovereign JARVIS..."

# Configuration
INSTALL_DIR="${HOME}/.sovereign-jarvis"
BIN_DIR="${INSTALL_DIR}/bin"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
echo "📋 Checking dependencies..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is required but not installed${NC}"
    exit 1
fi

PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
echo "✅ Python ${PYTHON_VERSION}"

# Check Git
if ! command -v git &> /dev/null; then
    echo -e "${RED}❌ Git is required but not installed${NC}"
    exit 1
fi
echo "✅ Git"

# Check for Ollama (optional)
if command -v ollama &> /dev/null; then
    echo "✅ Ollama detected"
    OLLAMA_AVAILABLE=true
else
    echo -e "${YELLOW}⚠️  Ollama not found (optional - install for LLM features)${NC}"
    OLLAMA_AVAILABLE=false
fi

# Create installation directory
echo ""
echo "📁 Creating installation directory..."
mkdir -p "${INSTALL_DIR}"
mkdir -p "${BIN_DIR}"
mkdir -p "${INSTALL_DIR}/memory"

# Copy files
echo "📦 Installing files..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

cp -r "${SCRIPT_DIR}/constitution" "${INSTALL_DIR}/"
cp -r "${SCRIPT_DIR}/memory" "${INSTALL_DIR}/"
cp -r "${SCRIPT_DIR}/agents" "${INSTALL_DIR}/"
cp "${SCRIPT_DIR}/jarvis.py" "${INSTALL_DIR}/"
cp "${SCRIPT_DIR}/__init__.py" "${INSTALL_DIR}/"
cp "${SCRIPT_DIR}/bin/jarvis" "${BIN_DIR}/"

# Make executable
chmod +x "${BIN_DIR}/jarvis"
chmod +x "${INSTALL_DIR}/jarvis.py"

# Update shell configuration
echo ""
echo "🔧 Updating shell configuration..."

SHELL_CONFIG=""
if [[ "$SHELL" == *"zsh"* ]]; then
    SHELL_CONFIG="${HOME}/.zshrc"
elif [[ "$SHELL" == *"bash"* ]]; then
    SHELL_CONFIG="${HOME}/.bashrc"
else
    SHELL_CONFIG="${HOME}/.profile"
fi

# Add to PATH if not already present
if ! grep -q "sovereign-jarvis/bin" "${SHELL_CONFIG}" 2>/dev/null; then
    echo "" >> "${SHELL_CONFIG}"
    echo "# Sovereign JARVIS" >> "${SHELL_CONFIG}"
    echo 'export PATH="${HOME}/.sovereign-jarvis/bin:${PATH}"' >> "${SHELL_CONFIG}"
    echo -e "${GREEN}✅ Added to ${SHELL_CONFIG}${NC}"
else
    echo "✅ PATH already configured"
fi

# Create requirements file
cat > "${INSTALL_DIR}/requirements.txt" << EOF
requests>=2.28.0
EOF

# Install Python dependencies
echo ""
echo "📚 Installing Python dependencies..."
pip3 install -q -r "${INSTALL_DIR}/requirements.txt" 2>/dev/null || pip install -q -r "${INSTALL_DIR}/requirements.txt"

# Pull Ollama model if available
if [ "$OLLAMA_AVAILABLE" = true ]; then
    echo ""
    echo "🤖 Pulling Ollama model (llama3.2:1b)..."
    ollama pull llama3.2:1b 2>/dev/null || echo -e "${YELLOW}⚠️  Could not pull model - you can do this manually later${NC}"
fi

# Create audit log
touch "${INSTALL_DIR}/audit.log"

# Installation complete
echo ""
echo -e "${GREEN}✅ Sovereign JARVIS installed successfully!${NC}"
echo ""
echo "📍 Installation directory: ${INSTALL_DIR}"
echo ""
echo "🚀 Quick start:"
echo "   1. Restart your terminal or run: source ${SHELL_CONFIG}"
echo "   2. Navigate to a Git repository"
echo "   3. Run: jarvis init"
echo "   4. Run: jarvis status"
echo ""
echo "📖 Documentation:"
echo "   jarvis --help"
echo ""

if [ "$OLLAMA_AVAILABLE" = false ]; then
    echo -e "${YELLOW}💡 Tip: Install Ollama for LLM-powered features:${NC}"
    echo "   curl -fsSL https://ollama.com/install.sh | sh"
    echo "   ollama pull llama3.2:1b"
    echo ""
fi
