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

[![Tools](https://img.shields.io/badge/Tools-250-orange?style=flat-square)](src/tools/)
[![Skills](https://img.shields.io/badge/Skills-100-blue?style=flat-square)](src/skills/)
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
- **100+ Real Skills** - Multi-tool workflows for complex tasks
- **15 AI Providers** - OpenAI, Anthropic, Google, Z.ai, Moonshot, MiniMax, Groq, DeepSeek, Mistral, xAI, Cohere, Replicate, Together AI, ElevenLabs, Qwen
- **6 Messaging Channels** - Telegram, WhatsApp, Discord, Slack, Email, MCP
- **Voice Support** - TTS, ASR, Voice Cloning with newest models
- **Remote Computer Control** - SSH, RDP, VNC, Wake-on-LAN
- **Security Tools** - Port scanning, vulnerability testing, password tools
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

## 🖥️ Setup Wizard

VoiceDev includes an interactive setup wizard that runs on first launch:

1. **API Key Setup** - Configure your AI provider keys
2. **Channel Setup** - Connect Telegram, WhatsApp, Discord, etc.
3. **Voice Setup** - Select TTS/ASR preferences
4. **Security Setup** - Configure permissions and limits

---

## 🎛️ Features

### 🔧 250 Real Tools

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
| **Remote** | 10 | SSH, RDP, VNC, Wake-on-LAN |
| **Pentest** | 15 | Nmap, DNS enum, SQL injection, XSS test |

### 🎨 100 Real Skills

Skills combine multiple tools for complex workflows:

| Category | Count | Examples |
|----------|-------|----------|
| **Development** | 20 | Project init, API test, git workflow |
| **Data** | 15 | JSON transform, CSV convert, aggregation |
| **Automation** | 15 | Batch rename, cleanup, sync |
| **Security** | 15 | Port scan, SSL check, audit |
| **Voice** | 10 | TTS speak, ASR transcribe |
| **Channels** | 10 | Send messages, notifications |
| **Remote** | 10 | SSH exec, file transfer |
| **Browser** | 5 | Web scraping, screenshots |

---

## 🤖 15 AI Providers with Newest Models (2025)

### Large Language Models (LLMs)

| Provider | Newest Models |
|----------|--------------|
| **OpenAI** | GPT-4o, o1, o1-mini, o1-pro |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3.5 Haiku, Claude Sonnet 4 |
| **Google** | Gemini 2.0 Flash, Gemini 2.0 Pro, Gemma 3 |
| **Z.ai** | Z-1 Large, Z-1 Standard, Z-1 Fast |
| **Moonshot AI** | Kimi Latest, Moonshot V1 128K |
| **MiniMax** | ABAB 6.5 Chat, ABAB 6.5G |
| **Groq** | Llama 3.3 70B, Mixtral 8x7B |
| **DeepSeek** | DeepSeek R1 (Reasoner), DeepSeek Chat |
| **Mistral** | Mistral Large, Codestral, Pixtral 12B |
| **xAI** | Grok 2, Grok 2 Vision |
| **Cohere** | Command R+, Embed V4 |
| **Replicate** | Llama 3.3 70B, DeepSeek R1 |
| **Together AI** | Llama 3.3 70B Turbo, Qwen 2.5 72B |
| **Qwen** | Qwen Max, Qwen Long (10M context) |

### Voice Models (TTS/ASR)

| Provider | TTS Models | ASR Models |
|----------|-----------|------------|
| **OpenAI** | TTS-1, TTS-1 HD, GPT-4o Mini TTS | Whisper-1 |
| **ElevenLabs** | Multilingual V2, Turbo V2.5, Flash V2.5 | Scribe V1 |
| **MiniMax** | Speech-01 Turbo, Speech-01 Emotional | - |
| **Groq** | - | Whisper Large V3 Turbo |
| **Qwen** | - | Qwen Audio Turbo |

### Image Generation

| Provider | Models |
|----------|--------|
| **OpenAI** | DALL-E 3 |
| **Replicate** | Flux Schnell, Flux Dev, SDXL |

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

### Generic MCP API
```typescript
await executeTool('mcp_call', {
  config: {
    baseUrl: 'https://api.example.com',
    headers: { 'Authorization': 'Bearer TOKEN' }
  },
  endpoint: '/v1/resource',
  method: 'GET'
});
```

---

## 🎤 Voice Support

### Text-to-Speech (TTS)
```typescript
// OpenAI TTS
await executeTool('tts_speak', {
  text: 'Hello, World!',
  provider: 'openai',
  voice: 'alloy'
});

// ElevenLabs TTS
await executeTool('tts_speak', {
  text: 'Hello, World!',
  provider: 'elevenlabs',
  voice: 'rachel'
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
// Whisper (OpenAI or Groq)
await executeTool('asr_transcribe', {
  audioPath: '/path/to/audio.mp3',
  provider: 'openai'  // or 'groq' for ultra-fast
});

// ElevenLabs Scribe
await executeTool('asr_transcribe', {
  audioPath: '/path/to/audio.mp3',
  provider: 'elevenlabs'
});
```

### Voice Cloning
```typescript
await executeTool('voice_clone', {
  audioPaths: ['/path/to/sample1.mp3', '/path/to/sample2.mp3'],
  name: 'My Voice',
  provider: 'elevenlabs'
});
```

---

## 🖥️ Remote Computer Control

### SSH
```typescript
await executeTool('ssh_exec', {
  host: '192.168.1.100',
  user: 'admin',
  command: 'ls -la'
});

await executeTool('ssh_copy_file', {
  host: '192.168.1.100',
  user: 'admin',
  source: '/local/file.txt',
  destination: '/remote/file.txt'
});
```

### RDP (Windows Remote Desktop)
```typescript
await executeTool('rdp_connect', {
  host: '192.168.1.100',
  user: 'admin',
  password: 'password'
});
```

### VNC
```typescript
await executeTool('vnc_connect', {
  host: '192.168.1.100',
  port: 5900
});
```

### Wake-on-LAN
```typescript
await executeTool('wake_on_lan', {
  mac: 'AA:BB:CC:DD:EE:FF',
  broadcastIp: '192.168.1.255'
});
```

---

## 🔒 Security & Penetration Testing

### Port Scanning
```typescript
// Quick port scan
await executeTool('port_scan', {
  host: 'example.com',
  ports: '22,80,443,3389'
});

// Nmap scan
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

// HTTP headers check
await executeTool('http_headers_check', {
  url: 'https://example.com'
});

// SSL check
await executeTool('ssl_check', {
  hostname: 'example.com'
});
```

### Password Tools
```typescript
// Identify hash type
await executeTool('hash_identify', {
  hash: '5f4dcc3b5aa765d61d8327deb882cf99'
});

// Generate password
await executeTool('generate_password', {
  length: 24,
  includeSymbols: true
});

// Check password strength
await executeTool('password_strength', {
  password: 'MyP@ssw0rd!'
});
```

---

## 🌐 Browser Automation Skill

VoiceDev includes a browser automation skill for web scraping and testing:

```typescript
await executeSkill('browser_navigate', {
  url: 'https://example.com'
});

await executeSkill('browser_screenshot', {
  selector: '.content',
  savePath: '/screenshots/page.png'
});

await executeSkill('browser_click', {
  selector: '#submit-button'
});

await executeSkill('browser_fill', {
  selector: '#email',
  value: 'test@example.com'
});
```

---

## 📦 Project Structure

```
voicedev/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React Components
│   ├── tools/            # 250 Real Tools
│   ├── skills/           # 100 Real Skills
│   ├── providers/        # 15 AI Providers
│   ├── channels/         # 6 Messaging Channels
│   ├── voice/            # TTS/ASR Support
│   ├── remote/           # Remote Control Tools
│   ├── pentest/          # Security Tools
│   ├── marketplace/      # Skill Marketplace
│   ├── security/         # 5 Security Layers
│   ├── wizard/           # Setup Wizard
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

### Tauri Features
- Native desktop experience
- System tray integration
- Auto-updater
- Native file dialogs
- System notifications
- Clipboard access
- Shell integration

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
# AI Providers
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
```

### Channels API
```
POST /api/channels/telegram/send
POST /api/channels/whatsapp/send
POST /api/channels/discord/send
POST /api/channels/slack/send
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

**250 Tools + 100 Skills + 15 AI Providers + 6 Channels**

</div>
