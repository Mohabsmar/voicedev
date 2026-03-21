#!/bin/bash
#
# VoiceDev One-Liner Installer
# curl -fsSL https://voicedev.dev/install.sh | bash
#
# Works on: Windows (WSL/Git Bash), Linux, macOS
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║     🎤 VoiceDev - Ultimate AI Agent Platform              ║"
echo "║     Built with 💜 by an 11-year-old developer             ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed!${NC}"
    echo ""
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    echo ""
    echo -e "${BLUE}Quick install:${NC}"
    echo "  • Windows/macOS: Download from https://nodejs.org/"
    echo "  • Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs"
    echo "  • macOS (brew): brew install node"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version must be 18 or higher. Current: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) found${NC}"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm $(npm -v) found${NC}"

# Check for git
if ! command -v git &> /dev/null; then
    echo -e "${RED}git is not installed!${NC}"
    echo "Please install git from: https://git-scm.com/"
    exit 1
fi

echo -e "${GREEN}✓ git found${NC}"
echo ""

# Clone or update
INSTALL_DIR="${INSTALL_DIR:-$HOME/voicedev}"

if [ -d "$INSTALL_DIR" ]; then
    echo -e "${BLUE}Updating existing installation...${NC}"
    cd "$INSTALL_DIR"
    git pull
else
    echo -e "${BLUE}Cloning VoiceDev...${NC}"
    git clone https://github.com/Mohabsmar/voicedev.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}Setting up database...${NC}"
npm run db:setup

echo ""
echo -e "${GREEN}✓ Installation complete!${NC}"
echo ""

# Create .env file if not exists
if [ ! -f ".env" ]; then
    echo -e "${BLUE}Creating .env file...${NC}"
    cat > .env << 'EOF'
# VoiceDev Environment Configuration
# Add your API keys below

# LLM Providers
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
ZAI_API_KEY=your-zai-api-key
MOONSHOT_API_KEY=your-moonshot-api-key
MINIMAX_API_KEY=your-minimax-api-key
GROQ_API_KEY=your-groq-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
MISTRAL_API_KEY=your-mistral-api-key
XAI_API_KEY=your-xai-api-key
COHERE_API_KEY=your-cohere-api-key
REPLICATE_API_TOKEN=your-replicate-token
TOGETHER_API_KEY=your-together-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
QWEN_API_KEY=your-qwen-api-key

# Messaging Channels
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
WHATSAPP_ACCESS_TOKEN=your-whatsapp-access-token
DISCORD_WEBHOOK_URL=your-discord-webhook-url
SLACK_WEBHOOK_URL=your-slack-webhook-url

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EOF
    echo -e "${GREEN}✓ Created .env file - Add your API keys!${NC}"
fi

echo ""
echo -e "${PURPLE}══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🎉 VoiceDev is ready!${NC}"
echo ""
echo -e "${BLUE}To start:${NC}"
echo "  cd $INSTALL_DIR"
echo "  npm run dev"
echo ""
echo -e "${BLUE}Then open:${NC} http://localhost:3000"
echo ""
echo -e "${BLUE}Edit API keys:${NC} $INSTALL_DIR/.env"
echo ""
echo -e "${PURPLE}══════════════════════════════════════════════════════════${NC}"
