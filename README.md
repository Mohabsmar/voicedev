<div align="center">

# 🎤 VoiceDev

### The Ultimate AI Agent Debugger Platform

**Cross-Platform Desktop App + Web Interface**

**Built with 💜 by an 11-year-old developer**

[![Built by 11 yo Developer](https://img.shields.io/badge/Built%20by-11%20yo%20Developer-purple?style=for-the-badge)](https://github.com/Mohabsmar/voicedev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square&logo=tauri)](https://tauri.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![Tools](https://img.shields.io/badge/Tools-250+-orange?style=flat-square)](src/tools/)
[![Skills](https://img.shields.io/badge/Skills-105+-blue?style=flat-square)](src/skills/)
[![Providers](https://img.shields.io/badge/AI_Providers-15-informational?style=flat-square)](src/providers/)
[![Channels](https://img.shields.io/badge/Channels-6-success?style=flat-square)](src/channels/)

</div>

---

## ⚡ One-Liner Install (Recommended)

```bash
curl -fsSL https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.sh | bash
```

**Or on Windows PowerShell:**
```powershell
irm https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.ps1 | iex
```

---

## 🎯 What is VoiceDev?

VoiceDev is a comprehensive AI Agent Debugger Platform that combines:

- **250+ Real Working Tools** - File system, shell, web, git, npm, database, cloud, security
- **105+ Real Skills** - Multi-tool workflows for complex tasks including Browser Automation
- **15 AI Providers** - OpenAI, Anthropic, Google, Z.ai, Moonshot, MiniMax, Groq, DeepSeek, Mistral, xAI, Cohere, Replicate, Together AI, ElevenLabs, Qwen
- **6 Messaging Channels** - Telegram, WhatsApp, Discord, Slack, Email, MCP
- **Voice Support** - TTS, ASR, Voice Cloning with newest 2026 models
- **Remote Computer Control** - SSH, RDP, VNC, WinRM, Wake-on-LAN
- **Browser Use Skill** - Web automation, scraping, screenshots
- **Security Tools** - Port scanning, vulnerability testing, password tools
- **Setup Wizard** - Interactive first-time setup experience
- **Cross-Platform** - Windows (PowerShell), Linux, macOS (Bash)
- **Desktop App** - Tauri-based native app

---

## 🚀 Quick Start

### Option 1: One-Liner (Recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.sh | bash
```

### Option 2: Manual Install
```bash
git clone https://github.com/Mohabsmar/voicedev.git
cd voicedev
npm install
npm run dev
```

### Option 3: Desktop App
```bash
npm run tauri:dev    # Development
npm run tauri:build  # Build desktop app
```

---

## 🖥️ Setup Wizard (NEW!)

VoiceDev includes an interactive setup wizard that runs on first launch:

1. **Welcome** - Introduction to VoiceDev features
2. **AI Providers** - Select and configure your AI providers
3. **API Keys** - Enter and validate your API keys
4. **Features** - Enable Voice, Remote Control, Browser Use
5. **Channels** - Configure Telegram, WhatsApp, Discord
6. **Install** - Automated dependency installation

The wizard guides you through the entire setup process with a beautiful UI!

---

## 🤖 15 AI Providers with Newest Models (March 21, 2026)

### Large Language Models (LLMs)

| Provider | Newest Models (March 2026) |
|----------|---------------------------|
| **OpenAI** | GPT-4.5 Turbo ⭐, GPT-4.5, o3, o4-mini ⭐ |
| **Anthropic** | Claude 4 Opus ⭐, Claude 4 Sonnet, Claude 3.7 Sonnet |
| **Google** | Gemini 2.5 Pro ⭐, Gemini 2.5 Flash ⭐, Gemma 3 |
| **Z.ai** | Z-2 Ultra ⭐, Z-2 Pro, Z-2 Mini |
| **Moonshot AI** | Kimi K2 ⭐, Moonshot V1 128K |
| **MiniMax** | ABAB 7 Chat ⭐, ABAB 6.5 Chat |
| **Groq** | Llama 4 70B ⭐, Llama 4 8B ⭐ |
| **DeepSeek** | DeepSeek R2 ⭐, DeepSeek V3 |
| **Mistral** | Mistral Large 2 ⭐, Codestral |
| **xAI** | Grok 3 ⭐, Grok 3 Mini ⭐ |
| **Cohere** | Command R+, Embed V4 |
| **Replicate** | Llama 4 70B ⭐, Flux 2 ⭐ |
| **Together AI** | Llama 4 70B Turbo ⭐ |
| **Qwen** | Qwen 3 Max ⭐, Qwen Long (10M context) |

⭐ = Released in 2026

### Voice Models (TTS/ASR) - March 2026

| Provider | TTS Models | ASR Models |
|----------|-----------|------------|
| **OpenAI** | TTS-2 ⭐, GPT-4o Mini TTS | Whisper 2 ⭐ |
| **ElevenLabs** | Eleven V3 ⭐, Multilingual V2 | Scribe V2 ⭐ |
| **MiniMax** | Speech-02 Turbo ⭐ | - |
| **Groq** | - | Whisper Large V3 Turbo |
| **Qwen** | - | Qwen Audio Turbo |

### Image Generation

| Provider | Models |
|----------|--------|
| **OpenAI** | DALL-E 4 ⭐, DALL-E 3 |
| **Replicate** | Flux 2 ⭐, Flux Schnell, SDXL |

### Reasoning Models

| Provider | Models |
|----------|--------|
| **OpenAI** | o4-mini ⭐, o3 ⭐, o3-mini |
| **DeepSeek** | DeepSeek R2 ⭐ |

---

## 🎛️ Features

### 🔧 250+ Real Tools

| Category | Count | Examples |
|----------|-------|----------|
| **FileSystem** | 50 | Read, write, copy, move, compress, hash |
| **Shell** | 40 | Execute commands, manage processes |
| **Web/HTTP** | 50 | GET, POST, DNS, webhooks, JWT |
| **Git** | 30 | Clone, commit, push, merge, rebase |
| **NPM/Packages** | 30 | Install, build, test, publish |
| **Database** | 20 | SQLite, PostgreSQL, MySQL, Redis, MongoDB |
| **Cloud** | 20 | Docker, Kubernetes, AWS, GCP, Azure |
| **Security** | 20 | Encrypt, hash, port scan, vulnerability test |
| **Remote** | 25 | SSH, RDP, VNC, WinRM, Wake-on-LAN |
| **Browser** | 13 | Navigate, screenshot, extract, automate |
| **Pentest** | 15 | Nmap, DNS enum, SQL injection, XSS test |

### 🎨 105+ Real Skills

Skills combine multiple tools for complex workflows:

| Category | Count | Examples |
|----------|-------|----------|
| **Development** | 20 | Project init, API test, git workflow |
| **Data** | 15 | JSON transform, CSV convert, aggregation |
| **Automation** | 15 | Batch rename, cleanup, sync |
| **Security** | 15 | Port scan, SSL check, audit |
| **Voice** | 10 | TTS speak, ASR transcribe |
| **Channels** | 10 | Send messages, notifications |
| **Remote** | 15 | SSH exec, file transfer, remote control |
| **Browser** | 5 | Navigate, screenshot, extract, search, automate |

---

## 🌐 Browser Use Skill (NEW!)

VoiceDev includes a powerful browser automation skill for web scraping and testing:

### Navigate to URLs
```typescript
await executeSkill('browser-navigate', {
  url: 'https://example.com'
});
```

### Take Screenshots
```typescript
await executeSkill('browser-screenshot', {
  url: 'https://example.com',
  outputPath: '/screenshots/page.png'
});
```

### Extract Data
```typescript
await executeSkill('browser-extract', {
  url: 'https://example.com',
  selectors: {
    title: 'h1',
    description: '.description',
    links: 'a[href]'
  }
});
```

### Web Search
```typescript
await executeSkill('browser-search', {
  query: 'VoiceDev AI platform',
  engine: 'google'  // or 'bing', 'duckduckgo'
});
```

### Full Browser Automation
```typescript
await executeSkill('browser-automate', {
  url: 'https://example.com/login',
  actions: [
    { type: 'type', selector: '#email', value: 'user@example.com' },
    { type: 'type', selector: '#password', value: 'password123' },
    { type: 'click', selector: '#submit' }
  ]
});
```

### Available Browser Tools

| Tool | Description |
|------|-------------|
| `browser_navigate` | Open a URL in browser |
| `browser_screenshot` | Take full page screenshot |
| `browser_extract` | Extract data with CSS selectors |
| `browser_click` | Click elements |
| `browser_type` | Type into input fields |
| `browser_scroll` | Scroll page (up/down/top/bottom) |
| `browser_wait` | Wait for element |
| `browser_evaluate` | Execute JavaScript |
| `browser_fill_form` | Fill multiple form fields |
| `browser_get_content` | Get full HTML |
| `browser_get_text` | Get visible text |
| `browser_download` | Download files |
| `browser_search` | Web search |

---

## 🖥️ Remote Computer Control (ENHANCED!)

### SSH Tools
```typescript
// Execute command
await executeTool('ssh_exec', {
  host: '192.168.1.100',
  user: 'admin',
  command: 'ls -la'
});

// Copy files via SCP
await executeTool('ssh_copy_file', {
  source: '/local/file.txt',
  destination: '/remote/file.txt',
  direction: 'upload'
});

// Create SSH tunnel
await executeTool('ssh_tunnel', {
  host: '192.168.1.100',
  user: 'admin',
  localPort: 8080,
  remotePort: 80
});

// Generate SSH keys
await executeTool('ssh_keygen', {
  type: 'ed25519',
  path: '~/.ssh/my_key'
});
```

### RDP (Windows Remote Desktop)
```typescript
// Connect to RDP
await executeTool('rdp_connect', {
  host: '192.168.1.100',
  user: 'admin',
  password: 'password'
});

// List RDP sessions
await executeTool('rdp_session_list', {
  server: '192.168.1.100'
});

// Enable RDP
await executeTool('rdp_enable', {});
```

### VNC
```typescript
// Connect to VNC
await executeTool('vnc_connect', {
  host: '192.168.1.100',
  port: 5900
});

// Start VNC server (Linux)
await executeTool('vnc_server_start', {
  display: 1,
  geometry: '1920x1080'
});
```

### WinRM (Windows Remote Management)
```typescript
await executeTool('winrm_exec', {
  host: '192.168.1.100',
  user: 'admin',
  password: 'password',
  command: 'Get-Process'
});
```

### Remote Monitoring
```typescript
// Ping
await executeTool('ping', { host: 'example.com', count: 10 });

// Port scan
await executeTool('port_scan', { 
  host: '192.168.1.100',
  ports: '22,80,443,3389,5900'
});

// DNS lookup
await executeTool('dns_lookup', { 
  host: 'example.com',
  type: 'MX'
});

// HTTP check
await executeTool('http_check', { url: 'https://example.com' });

// Remote shutdown
await executeTool('remote_shutdown', {
  host: '192.168.1.100',
  action: 'restart',
  message: 'System maintenance',
  timeout: 60
});

// Wake-on-LAN
await executeTool('wake_on_lan', {
  mac: 'AA:BB:CC:DD:EE:FF'
});
```

---

## 📱 Messaging Channels (MCP)

VoiceDev supports multiple messaging platforms:

### Telegram
```typescript
await executeTool('telegram_send_message', {
  botToken: 'YOUR_BOT_TOKEN',
  chatId: 'CHAT_ID',
  message: 'Hello from VoiceDev!'
});
```

### WhatsApp Business API
```typescript
await executeTool('whatsapp_send_message', {
  accessToken: 'YOUR_TOKEN',
  phoneNumberId: 'YOUR_PHONE_ID',
  to: '+1234567890',
  message: 'Hello!'
});
```

### Discord
```typescript
await executeTool('discord_send_embed', {
  webhookUrl: 'YOUR_WEBHOOK',
  title: 'Alert',
  description: 'Task completed!'
});
```

### Slack
```typescript
await executeTool('slack_send_message', {
  webhookUrl: 'YOUR_WEBHOOK',
  text: 'Build completed!'
});
```

---

## 🎤 Voice Support

### Text-to-Speech (TTS)
```typescript
// OpenAI TTS-2 (New!)
await executeTool('tts_speak', {
  text: 'Hello, World!',
  provider: 'openai',
  voice: 'alloy',
  model: 'tts-2'
});

// ElevenLabs V3 (New!)
await executeTool('tts_speak', {
  text: 'Hello, World!',
  provider: 'elevenlabs',
  voice: 'rachel',
  model: 'eleven_v3'
});

// MiniMax TTS
await executeTool('tts_speak', {
  text: '你好世界',
  provider: 'minimax',
  voice: 'female-shaonv'
});
```

### Speech-to-Text (ASR)
```typescript
// OpenAI Whisper 2 (New!)
await executeTool('asr_transcribe', {
  audioPath: '/path/to/audio.mp3',
  provider: 'openai',
  model: 'whisper-2'
});

// Groq Whisper (Ultra-fast)
await executeTool('asr_transcribe', {
  audioPath: '/path/to/audio.mp3',
  provider: 'groq'
});

// ElevenLabs Scribe V2 (New!)
await executeTool('asr_transcribe', {
  audioPath: '/path/to/audio.mp3',
  provider: 'elevenlabs',
  model: 'scribe_v2'
});
```

---

## 🔒 Security & Penetration Testing

### Port Scanning
```typescript
await executeTool('port_scan', {
  host: 'example.com',
  ports: '22,80,443,3389'
});

await executeTool('nmap_scan', {
  target: '192.168.1.0/24',
  scanType: '-sV'
});
```

### Vulnerability Testing
```typescript
// SQL Injection test
await executeTool('sql_injection_test', {
  url: 'https://example.com/search?q={param}',
  param: 'q'
});

// XSS test
await executeTool('xss_test', {
  url: 'https://example.com/search?q={param}',
  param: 'q'
});

// SSL check
await executeTool('ssl_check', {
  hostname: 'example.com'
});
```

---

## 📦 Project Structure

```
voicedev/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components
│   │   └── SetupWizard.tsx  # Setup Wizard Component
│   ├── tools/            # 250+ Real Tools
│   ├── skills/           # 105+ Real Skills
│   │   └── browser-use.ts   # Browser Automation Skill
│   ├── providers/        # 15 AI Providers (March 2026)
│   ├── channels/         # 6 Messaging Channels
│   ├── voice/            # TTS/ASR Support
│   ├── remote/           # Remote Control Tools
│   ├── pentest/          # Security Tools
│   ├── marketplace/      # Skill Marketplace
│   ├── security/         # 5 Security Layers
│   └── lib/              # Utilities
├── src-tauri/            # Tauri Desktop App
│   └── src/
│       └── main.rs       # Rust Backend
├── prisma/               # Database Schema
├── install.sh            # Linux/macOS Installer
├── install.ps1           # Windows Installer
└── README.md
```

---

## 🖥️ Desktop App (Tauri)

### Development
```bash
npm run tauri:dev
```

### Build for Production
```bash
npm run tauri:build
```

This creates native installers:
- **Windows**: `.msi` and `.exe`
- **macOS**: `.dmg` and `.app`
- **Linux**: `.deb`, `.rpm`, `.AppImage`

---

## 🛡️ 5-Layer Security

1. **Static Code Analysis** - Detects dangerous patterns
2. **Sandboxed Execution** - Timeout, memory limits
3. **Permission System** - Granular permissions per tool
4. **Rate Limiting** - Prevent abuse
5. **Audit Logging** - Complete operation trail

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
# AI Providers (March 2026)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
ZAI_API_KEY=...
MOONSHOT_API_KEY=...
MINIMAX_API_KEY=...
GROQ_API_KEY=...
DEEPSEEK_API_KEY=...
MISTRAL_API_KEY=...
XAI_API_KEY=...
COHERE_API_KEY=...
REPLICATE_API_TOKEN=...
TOGETHER_API_KEY=...
ELEVENLABS_API_KEY=...
QWEN_API_KEY=...

# Messaging Channels
TELEGRAM_BOT_TOKEN=...
WHATSAPP_ACCESS_TOKEN=...
DISCORD_WEBHOOK_URL=...
SLACK_WEBHOOK_URL=...

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 📚 API Reference

### Tools API
```
POST /api/tools/execute
Body: { "tool": "tool_name", "params": {...} }
```

### Skills API
```
POST /api/skills/execute
Body: { "skill": "skill_name", "params": {...} }
```

### Providers API
```
GET /api/providers          # List all providers
GET /api/providers/:id      # Get provider details
GET /api/models?category=llm  # List models by category
GET /api/models/newest      # Get newest 2026 models
```

---

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License - Use it however you want!

---

## 🙏 Special Thanks

- My parents for screen time
- The AI that helped me learn
- Everyone who believes young devs can build cool stuff

---

## 💬 Connect

- **GitHub**: [@Mohabsmar](https://github.com/Mohabsmar)
- **Project**: [VoiceDev](https://github.com/Mohabsmar/voicedev)
- **Issues**: [Report Bug](https://github.com/Mohabsmar/voicedev/issues)

---

<div align="center">

**Made with 💜 by an 11-year-old who loves coding**

### ⭐ Star this repo if you think it's cool! ⭐

**Cross-Platform: Windows (PowerShell) + Linux + macOS**

**Desktop App: Tauri v2**

**250+ Tools + 105+ Skills + 15 AI Providers + 6 Channels**

**New in March 2026 (Updated March 21): GPT-4.5 Turbo, Claude 4 Opus, o4-mini, Gemini 2.5, DeepSeek R2, Browser Use, Setup Wizard!**

</div>
