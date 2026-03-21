# VoiceDev One-Liner Installer for Windows PowerShell
# irm https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.ps1 | iex

Write-Host ""
Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
Write-Host "║                                                           ║" -ForegroundColor Magenta
Write-Host "║     🎤 VoiceDev - Ultimate AI Agent Platform              ║" -ForegroundColor Magenta
Write-Host "║     Built with 💜 by an 11-year-old developer             ║" -ForegroundColor Magenta
Write-Host "║                                                           ║" -ForegroundColor Magenta
Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
Write-Host ""

# Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Blue
    exit 1
}

$nodeVersion = (node -v) -replace 'v', '' -split '\.' | Select-Object -First 1
if ([int]$nodeVersion -lt 18) {
    Write-Host "Node.js version must be 18 or higher. Current: $(node -v)" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Node.js $(node -v) found" -ForegroundColor Green
Write-Host "✓ npm $(npm -v) found" -ForegroundColor Green

# Check Git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "git is not installed!" -ForegroundColor Red
    Write-Host "Please install from: https://git-scm.com/" -ForegroundColor Blue
    exit 1
}

Write-Host "✓ git found" -ForegroundColor Green
Write-Host ""

# Install directory
$installDir = if ($env:INSTALL_DIR) { $env:INSTALL_DIR } else { Join-Path $env:USERPROFILE "voicedev" }

if (Test-Path $installDir) {
    Write-Host "Updating existing installation..." -ForegroundColor Blue
    Set-Location $installDir
    git fetch origin
    git reset --hard origin/main
} else {
    Write-Host "Cloning VoiceDev..." -ForegroundColor Blue
    git clone https://github.com/Mohabsmar/voicedev.git $installDir
    Set-Location $installDir
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Blue
npm install

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Blue
npx prisma generate
npx prisma db push

Write-Host ""
Write-Host "✓ Installation complete!" -ForegroundColor Green
Write-Host ""

# Create .env if not exists
$envFile = Join-Path $installDir ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env file..." -ForegroundColor Blue
    
    $envContent = @"
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
"@
    
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✓ Created .env file - Add your API keys!" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
Write-Host ""
Write-Host "🎉 VoiceDev is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "To start:" -ForegroundColor Blue
Write-Host "  cd $installDir"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "The Setup Wizard will guide you through configuration!" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Magenta
