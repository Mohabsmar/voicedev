<div align="center">

# 🎤 VoiceDev

### The Ultimate AI Agent Platform with 250+ Tools

**Cross-Platform Desktop App + Web Interface**

**Built with 💜 by an 11-year-old developer**

[![Built by 11 yo Developer](https://img.shields.io/badge/Built%20by-11%20yo%20Developer-purple?style=for-the-badge)](https://github.com/Mohabsmar/voicedev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square&logo=tauri)](https://tauri.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![Tools](https://img.shields.io/badge/Tools-250+-orange?style=flat-square)](src/tools/)
[![Skills](https://img.shields.io/badge/Skills-50+-blue?style=flat-square)](src/skills/)
[![Providers](https://img.shields.io/badge/AI_Providers-15-informational?style=flat-square)](src/providers/)
[![Models](https://img.shields.io/badge/AI_Models-92+-success?style=flat-square)](src/providers/)

</div>

---

## ⚡ One-Liner Install

**Linux/macOS:**
```bash
curl -fsSL https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.sh | bash
```

**Windows PowerShell:**
```powershell
irm https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.ps1 | iex
```

---

## 🎯 What is VoiceDev?

VoiceDev is a comprehensive AI Agent Platform that includes:

| Feature | Description |
|---------|-------------|
| **250+ Tools** | FileSystem, Shell, Git, NPM, HTTP, Crypto, Archives, Process Management |
| **50+ Skills** | Multi-tool workflows for development, data, automation |
| **15 AI Providers** | OpenAI, Anthropic, Google, Z.ai, Moonshot, MiniMax, Groq, DeepSeek, Mistral, xAI, Cohere, Replicate, Together, ElevenLabs, Qwen |
| **92+ AI Models** | Newest March 2026 models including GPT-5.2, Claude 4.6, Gemini 3.1 |
| **Remote Control** | SSH, RDP, VNC, WinRM, Wake-on-LAN |
| **6 Channels** | Telegram, WhatsApp, Discord, Slack, Email, MCP |
| **Voice Support** | TTS-3, Whisper 3, ElevenLabs V3 |
| **Browser Automation** | Navigate, screenshot, extract, automate |
| **Security Tools** | Port scanning, vulnerability testing, password tools |
| **Setup Wizard** | Interactive first-time configuration |
| **Cross-Platform** | Windows (PowerShell) + Linux + macOS |
| **Desktop App** | Tauri v2 native application |

---

## 🤖 15 AI Providers with Newest Models (March 21, 2026)

### Latest Flagship Models

| Provider | Newest Model | Key Features |
|----------|--------------|--------------|
| **OpenAI** | GPT-5.2 Pro | 512K context, agentic, reasoning |
| **Anthropic** | Claude Opus 4.6 | Coding, computer use, 200K context |
| **Google** | Gemini 3.1 Pro | 2M context, multimodal, agentic |
| **DeepSeek** | DeepSeek V4 | Trillion-param MoE, open weights |
| **xAI** | Grok 4 | Real-time X integration, witty |
| **Meta** | Llama 4 Behemoth | Open weights, powerful |
| **Mistral** | Mistral Large 3 | 41B active params, efficient |
| **Qwen** | Qwen 3 235B | MoE, multilingual, reasoning |
| **Moonshot** | Kimi K3 | 1M context, multimodal |
| **Z.ai** | Z-3 Ultra | Agentic, vision, reasoning |
| **MiniMax** | ABAB 8 Chat | Multilingual, voice support |

### Voice Models (TTS/ASR) - March 2026

| Provider | TTS Models | ASR Models |
|----------|-----------|------------|
| **OpenAI** | TTS-3, GPT-5 TTS | Whisper 3 |
| **ElevenLabs** | Eleven V3 ⭐ | Scribe V3 |
| **MiniMax** | Speech-03 Turbo | - |
| **Groq** | - | Whisper 3 Turbo (ultra-fast) |

### Image Generation

| Provider | Models |
|----------|--------|
| **OpenAI** | DALL-E 4, Sora (video) |
| **Replicate** | Flux 3, Flux Schnell |
| **xAI** | Grok Aurora |

### Reasoning Models

| Provider | Models |
|----------|--------|
| **OpenAI** | o4, o4-mini |
| **DeepSeek** | R3, R2 |
| **Google** | Gemini 3 Deep Think |

---

## 📁 Project Structure

```
voicedev/
├── src/
│   ├── app/              # Next.js App Router (15 API routes)
│   ├── components/       # React Components + Setup Wizard
│   ├── tools/            # 174+ Core Tools (2019 lines)
│   ├── skills/           # 50+ Skills + Browser Automation
│   ├── providers/        # 15 AI Providers, 92+ Models
│   ├── channels/         # 6 Messaging Channels
│   ├── voice/            # TTS/ASR Support
│   ├── remote/           # Remote Control Tools
│   ├── pentest/          # Security Tools
│   ├── marketplace/      # Skill Marketplace
│   ├── security/         # 5 Security Layers
│   └── lib/              # Utilities + Billing
├── src-tauri/            # Tauri Desktop App
│   └── src/main.rs       # Rust Backend
├── prisma/               # Database Schema
├── install.sh            # Linux/macOS Installer
├── install.ps1           # Windows Installer
└── README.md
```

---

## 🛠️ 250+ Tools by Category

| Category | Count | Examples |
|----------|-------|----------|
| **FileSystem** | 40+ | read, write, copy, move, hash, watch, lock |
| **Shell** | 30+ | exec, pipe, background, kill, python, node |
| **Git** | 30+ | clone, commit, push, merge, rebase, stash |
| **NPM/Package** | 25+ | init, install, build, test, publish |
| **HTTP/Web** | 20+ | GET, POST, DNS, webhook, JWT |
| **Archive** | 10+ | zip, tar, gzip, extract |
| **Remote** | 25+ | SSH, RDP, VNC, WinRM, Wake-on-LAN |
| **Channel** | 15+ | Telegram, WhatsApp, Discord, Slack |
| **Voice** | 10+ | TTS speak, ASR transcribe, voice clone |
| **Browser** | 13 | navigate, screenshot, extract, click, type |
| **Security** | 25+ | nmap, port scan, SQL injection, XSS test |

---

## 🎨 50+ Skills by Category

| Category | Count | Examples |
|----------|-------|----------|
| **Development** | 20+ | project init, API test, git workflow, build |
| **Data** | 15+ | JSON transform, CSV convert, aggregation |
| **Automation** | 10+ | batch rename, cleanup, sync, schedule |
| **Security** | 10+ | port scan, SSL check, audit |
| **Voice** | 5+ | TTS speak, ASR transcribe |
| **Remote** | 5+ | SSH exec, file transfer |
| **Browser** | 5+ | navigate, screenshot, extract |

---

## 🌐 Browser Automation

```typescript
// Navigate
await executeTool('browser_navigate', { url: 'https://example.com' });

// Screenshot
await executeTool('browser_screenshot', { 
  url: 'https://example.com',
  outputPath: '/screenshots/page.png'
});

// Extract data
await executeTool('browser_extract', {
  url: 'https://example.com',
  selectors: { title: 'h1', links: 'a' }
});

// Web search
await executeTool('browser_search', { 
  query: 'VoiceDev AI',
  engine: 'google'
});
```

**Available:** navigate, screenshot, extract, click, type, scroll, wait, evaluate, fill_form, get_content, get_text, download, search

---

## 🖥️ Remote Computer Control

```typescript
// SSH
await executeTool('ssh_exec', { host: '192.168.1.100', user: 'admin', command: 'ls -la' });
await executeTool('ssh_tunnel', { host: '192.168.1.100', localPort: 8080, remotePort: 80 });
await executeTool('ssh_copy_file', { source: '/file', destination: '/remote' });

// RDP (Windows)
await executeTool('rdp_connect', { host: '192.168.1.100', user: 'admin' });
await executeTool('rdp_enable', {});

// VNC
await executeTool('vnc_connect', { host: '192.168.1.100' });
await executeTool('vnc_server_start', { display: 1 });

// Monitoring
await executeTool('ping', { host: 'example.com' });
await executeTool('port_scan', { host: '192.168.1.100' });
await executeTool('remote_shutdown', { host: '192.168.1.100', action: 'restart' });
await executeTool('wake_on_lan', { mac: 'AA:BB:CC:DD:EE:FF' });
```

---

## 📱 Messaging Channels

```typescript
// Telegram
await executeTool('telegram_send_message', { 
  botToken: 'TOKEN', chatId: 'ID', message: 'Hello!' 
});

// WhatsApp
await executeTool('whatsapp_send_message', { 
  accessToken: 'TOKEN', phoneNumberId: 'ID', to: '+123456', message: 'Hello!' 
});

// Discord
await executeTool('discord_send_embed', { 
  webhookUrl: 'URL', title: 'Alert', description: 'Done!' 
});

// Slack
await executeTool('slack_send_message', { 
  webhookUrl: 'URL', text: 'Build completed!' 
});

// MCP (Generic)
await executeTool('mcp_call', { 
  config: { baseUrl: 'https://api.example.com', headers: {} },
  endpoint: '/messages',
  method: 'POST',
  body: { text: 'Hello' }
});
```

---

## 🎤 Voice Support

```typescript
// TTS - OpenAI TTS-3
await executeTool('tts_speak', { 
  text: 'Hello!', provider: 'openai', model: 'tts-3', voice: 'alloy' 
});

// TTS - ElevenLabs V3 (Newest!)
await executeTool('tts_speak', { 
  text: 'Hello!', provider: 'elevenlabs', model: 'eleven_v3', voice: 'rachel' 
});

// ASR - Whisper 3
await executeTool('asr_transcribe', { 
  audioPath: '/audio.mp3', provider: 'openai', model: 'whisper-3' 
});

// ASR - Groq Whisper (Ultra-fast)
await executeTool('asr_transcribe', { 
  audioPath: '/audio.mp3', provider: 'groq' 
});
```

---

## 🔒 Security & Penetration Testing

```typescript
// Port scanning
await executeTool('nmap_scan', { target: '192.168.1.0/24', scanType: '-sV' });
await executeTool('port_scan', { host: 'example.com', ports: '22,80,443' });

// Vulnerability testing
await executeTool('sql_injection_test', { url: 'https://site.com/search?q={param}', param: 'q' });
await executeTool('xss_test', { url: 'https://site.com/search?q={param}', param: 'q' });
await executeTool('ssl_check', { hostname: 'example.com' });
await executeTool('http_headers_check', { url: 'https://example.com' });

// Password tools
await executeTool('hash_identify', { hash: '5f4dcc3b5aa765d61d8327deb882cf99' });
await executeTool('generate_password', { length: 24, includeSymbols: true });
await executeTool('password_strength', { password: 'MyP@ssw0rd!' });
```

---

## 🖥️ Desktop App (Tauri v2)

```bash
# Development
npm run tauri:dev

# Build for production
npm run tauri:build
```

Creates native installers:
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

# Channels
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

## 🚀 Quick Start

### Option 1: One-Liner
```bash
curl -fsSL https://raw.githubusercontent.com/Mohabsmar/voicedev/main/install.sh | bash
```

### Option 2: Manual
```bash
git clone https://github.com/Mohabsmar/voicedev.git
cd voicedev
npm install
npm run dev
```

### Option 3: Desktop App
```bash
npm run tauri:dev
```

---

## 📚 API Reference

```
POST /api/tools/execute    # Execute a tool
POST /api/skills/execute   # Execute a skill
GET  /api/providers        # List providers
GET  /api/models?category=llm  # List models by category
GET  /api/models/newest    # Get newest models
```

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License

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

**250+ Tools • 50+ Skills • 15 Providers • 92+ Models • 6 Channels**

**Updated March 21, 2026: GPT-5.2, Claude 4.6, Gemini 3.1, DeepSeek V4, Llama 4, Grok 4!**

</div>
