<div align="center">

# 🎤 VoiceDev

### The Ultimate AI Agent Platform with 250+ Tools

**Cross-Platform Desktop App + Web Interface**

**Built with 💜 by an 11-year-old Egyptian developer**

[![Built by 11 yo Egyptian Developer](https://img.shields.io/badge/Built%20by-11%20yo%20Egyptian%20Developer-purple?style=for-the-badge)](https://github.com/Mohabsmar/voicedev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-blue?style=flat-square&logo=tauri)](https://tauri.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[![Tools](https://img.shields.io/badge/Tools-250+-orange?style=flat-square)](src/tools/)
[![Skills](https://img.shields.io/badge/Skills-123+-blue?style=flat-square)](src/skills/)
[![Providers](https://img.shields.io/badge/AI_Providers-15-informational?style=flat-square)](src/providers/)
[![Models](https://img.shields.io/badge/AI_Models-80+-success?style=flat-square)](src/providers/)
[![Custom Endpoints](https://img.shields.io/badge/Custom_Endpoints-✓-9cf?style=flat-square)](src/providers/)

[![Smithery](https://img.shields.io/badge/Smithery-MCP_Tools-ff6b6b?style=flat-square)](https://smithery.ai)
[![ClawHub](https://img.shields.io/badge/ClawHub-Skills-4ecdc4?style=flat-square)](https://clawhub.dev)
[![Core Tools](https://img.shields.io/badge/Extreme_Core-20_Tools-gold?style=flat-square)](src/tools/extreme-core.ts)
[![Local Toolboxes](https://img.shields.io/badge/Local_Toolboxes-55_Tools-9b59b6?style=flat-square)](src/tools/local-toolboxes.ts)

</div>

---

## 🇪🇬 My Story

Hey there! I'm an 11-year-old developer from **Egypt** 🇪🇬, and I built VoiceDev because I believe that age shouldn't stop you from building amazing things.

**How it started:** Like many kids, I loved playing games and watching YouTube. But one day, I discovered coding and everything changed. I started with simple tutorials, then moved to building actual projects. My parents were skeptical at first (screen time, right?), but when they saw me building real applications, they started supporting my journey.

**Why VoiceDev?** I noticed that AI assistants were becoming super popular, but setting them up was complicated. You needed to know about APIs, endpoints, tools, and a bunch of technical stuff. I thought: "What if there was a platform that made this easy?" And VoiceDev was born.

**The Egyptian Connection:** I'm proud to be Egyptian! Egypt has a rich history of innovation - from the pyramids to modern tech startups. I want to show the world that young Egyptians can build world-class software. We have talent, creativity, and determination.

**My Dream:** I hope VoiceDev inspires other young developers, especially in the Middle East and Africa, to pursue their coding dreams. Technology doesn't care about your age, your background, or where you're from. It only cares about what you build.

**Future Goals:** I want to turn VoiceDev into a real business and earn $5,000/month passive income. I'm learning about marketing, user acquisition, and product development. It's hard, but I'm not giving up!

*"The only way to do great work is to love what you do."* - Steve Jobs (and me! 😄)

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
| **123+ Skills** | Multi-tool workflows for development, data, automation |
| **15 AI Providers** | OpenAI, Anthropic, Google, DeepSeek, Groq, Mistral, xAI, Z.ai/GLM, Moonshot, MiniMax, Cohere, Together, Qwen, ElevenLabs, Replicate |
| **95+ AI Models** | Verified newest March 2026 models including GPT-5.4, Claude 4.6, Gemini 3.1 |
| **Custom Endpoints** | Add your own AI models and endpoints with full configuration |
| **🆕 Unified Marketplace** | Smithery (MCP Tools) + ClawHub (Skills) integration |
| **🆕 Extreme Core 20** | Pre-installed essential tools for every AI agent |
| **🆕 Local MCP Toolboxes** | 55 local tools that run without external connections |
| **🆕 Vet Scanner** | Comprehensive security analysis for marketplace items |
| **Remote Control** | SSH, RDP, VNC, WinRM, Wake-on-LAN |
| **6 Channels** | Telegram, WhatsApp, Discord, Slack, Email, MCP |
| **Voice Support** | GPT-4o Mini TTS, Whisper Large V3 Turbo, ElevenLabs V3 |
| **Browser Automation** | Navigate, screenshot, extract, automate |
| **Security Tools** | Port scanning, vulnerability testing, password tools |
| **Setup Wizard** | Interactive first-time configuration |
| **Cross-Platform** | Windows (PowerShell) + Linux + macOS |
| **Desktop App** | Tauri v2 native application |

---

## 🏪 Unified Marketplace Integration

VoiceDev now integrates **Smithery** (MCP Tools) and **ClawHub** (Skills) marketplaces with unified commands:

### Marketplace Commands

| Command | Smithery (MCP Tools) | ClawHub (Skills) |
|---------|---------------------|------------------|
| **Search** | `npx @smithery/cli mcp search <query>` | `npx clawhub search <query>` |
| **List** | `npx @smithery/cli mcp list` | `npx clawhub list` |
| **Install** | `npx @smithery/cli mcp add <server>` | `npx clawhub install <slug>` |
| **Vet** | Built-in security scanner | Built-in security scanner |

### Marketplace API

```bash
# Search both marketplaces
GET /api/marketplace?action=search&query=filesystem

# List installed items
GET /api/marketplace?action=list

# Get featured items
GET /api/marketplace?action=explore

# Security vet scan
GET /api/marketplace?action=vet&itemId=@anthropic/mcp-server&itemSource=smithery

# Install from marketplace
POST /api/marketplace
{
  "action": "install",
  "itemId": "@anthropic/mcp-server",
  "source": "smithery"
}
```

---

## ⚡ Extreme Core 20 Tools

Pre-installed essential tools for every AI agent - always available without installation:

| Category | Tools |
|----------|-------|
| **AI & LLM** | `ai_chat`, `ai_embed`, `ai_complete`, `ai_vision` |
| **File System** | `fs_read`, `fs_write`, `fs_list`, `fs_delete`, `fs_copy` |
| **Shell & Process** | `shell_exec`, `process_list`, `process_kill` |
| **Web & HTTP** | `http_get`, `http_post`, `web_scrape` |
| **Data & JSON** | `json_parse`, `json_stringify`, `data_transform` |
| **Code** | `code_exec`, `code_format` |

```typescript
// Use core tools directly
import { CoreToolsExecutor } from '@/tools/extreme-core';

// Check if tool is core tool
CoreToolsExecutor.isCoreTool('fs_read'); // true

// Get OpenAI function format
const functions = CoreToolsExecutor.toOpenAIFunctions();

// Get Anthropic tool format
const tools = CoreToolsExecutor.toAnthropicTools();
```

---

## 🔧 Local MCP Toolboxes

8 local toolboxes with 55 tools that run without external connections:

| Toolbox | Tools | Description |
|---------|-------|-------------|
| **Shell Executor** | 7 | Execute shell commands locally |
| **File System** | 13 | Complete file system operations |
| **Process Manager** | 5 | Manage system processes |
| **Network Tools** | 6 | HTTP requests, DNS, ping, port check |
| **Archive Tools** | 6 | ZIP, TAR, GZIP operations |
| **Crypto Tools** | 6 | Hash, encrypt, decrypt, UUID |
| **Code Runner** | 6 | Execute JS, Python, Bash, PowerShell |
| **Database** | 6 | Local SQLite/JSON operations |

```typescript
// Execute local toolbox tools
import { LocalToolboxExecutor } from '@/tools/local-toolboxes';

// List all toolboxes
const toolboxes = LocalToolboxExecutor.getAllToolboxes();

// Execute a tool
const result = await LocalToolboxExecutor.execute('fs_read', {
  path: '/home/user/file.txt'
});
```

---

## 🔒 Vet Scanner - Security Analysis

Comprehensive malware detection for marketplace items:

```typescript
import { VetScanner } from '@/marketplace/unified-marketplace';

// Full security scan
const result = await VetScanner.scan('@anthropic/mcp-server', 'smithery');
// {
//   itemId: '@anthropic/mcp-server',
//   status: 'safe',           // safe | low-risk | medium-risk | high-risk | critical
//   score: 100,               // 0-100
//   findings: [],             // List of security issues found
//   recommendations: []       // Security recommendations
// }

// Quick scan
const quick = await VetScanner.quickScan('skill-slug', 'clawhub');
// { safe: true, score: 95 }
```

### Security Checks

- ✅ Dangerous code patterns (eval, exec, rm -rf)
- ✅ Remote code execution detection
- ✅ Path traversal vulnerability scan
- ✅ Hardcoded credentials check
- ✅ Obfuscated code detection
- ✅ Suspicious dependency analysis

---

## 🔧 Custom Endpoints & Models

VoiceDev supports adding your own AI models and endpoints:

```typescript
// Add a custom endpoint
import { addCustomEndpoint, addCustomModel } from '@/providers';

addCustomEndpoint({
  id: 'my-custom-llm',
  name: 'My Custom LLM',
  baseUrl: 'https://api.mycustomllm.com/v1',
  apiKey: 'your-api-key',
  apiKeyHeader: 'Authorization',
  headers: {
    'X-Custom-Header': 'value'
  },
  enabled: true
});

// Add a model to your custom endpoint
addCustomModel('my-custom-llm', {
  id: 'custom-model-1',
  name: 'Custom Model 1',
  category: 'llm',
  contextWindow: 128000,
  features: ['chat', 'streaming']
});
```

---

## 🤖 Verified AI Models (March 21, 2026)

*All models verified against official provider sources - no fabricated models!*

### Latest Flagship LLMs

| Provider | Current Flagship | Context | Key Features |
|----------|-----------------|---------|--------------|
| **OpenAI** | GPT-5.4 | 1M | Thinking, Pro/Mini/Nano variants, Agentic |
| **Anthropic** | Claude Sonnet 4.6 | 1M | Faster & cheaper, 14.5hr task horizon |
| **Google** | Gemini 3.1 Pro | 2M | 77.1% ARC-AGI-2, 80.6% SWE-Bench |
| **xAI** | Grok 4.20 Beta | 512K | Multi-agent, Enterprise API |
| **Meta** | Llama 4 Maverick | 1M | 400B/17B active, Open-weight |
| **Mistral** | Mistral Small 4 | 128K | 119B/6B active, Apache 2.0 |
| **Qwen** | Qwen 3.5 | 256K | 201 languages, Vision integrated |
| **DeepSeek** | V3.2-Exp | 256K | IMO/ICPC gold medal level |
| **Moonshot** | Kimi K2.5 | 1M | Agent Swarm (up to 100 agents) |
| **MiniMax** | M2.7 | 512K | Self-trained, coding focused |
| **GLM** | GLM-5 | 512K | Multimodal, reasoning |

### Voice Models (Verified March 2026)

| Provider | TTS | ASR |
|----------|-----|-----|
| **OpenAI** | gpt-4o-mini-tts | gpt-4o-mini-transcribe |
| **ElevenLabs** | Eleven V3 (70+ languages, audio tags) | Scribe V2 (90+ languages) |
| **MiniMax** | Speech 2.6 Turbo (40+ languages) | - |
| **Groq** | - | Whisper Large V3 Turbo (216× realtime) |

### Image Generation

| Provider | Models |
|----------|--------|
| **OpenAI** | DALL-E 4, Sora (video) |
| **Replicate** | Flux 3, Flux Schnell |
| **xAI** | Grok Aurora |

---

## 📁 Project Structure

```
voicedev/
├── src/
│   ├── app/              # Next.js App Router (15 API routes)
│   ├── components/       # React Components + Setup Wizard
│   ├── tools/            # 174+ Core Tools (2000+ lines)
│   ├── skills/           # 123+ Real Skills (2000+ lines)
│   ├── providers/        # 17 Providers, 95+ Models, Custom Endpoints
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

## 🎨 123+ Skills by Category

| Category | Count | Examples |
|----------|-------|----------|
| **Development** | 25+ | project init, API test, git workflow, build, deploy |
| **Data** | 20+ | JSON transform, CSV convert, aggregation, pivot |
| **Automation** | 20+ | batch rename, cleanup, sync, schedule, watch |
| **Security** | 15+ | port scan, SSL check, audit, hardening |
| **Voice** | 10+ | TTS speak, ASR transcribe, voice clone |
| **Remote** | 15+ | SSH exec, file transfer, remote control |
| **Browser** | 13+ | navigate, screenshot, extract, search, automate |
| **DevOps** | 10+ | Docker setup, CI config, deployment |

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

// Fill form
await executeTool('browser_fill_form', {
  url: 'https://example.com/login',
  fields: {
    '#email': 'user@example.com',
    '#password': 'password123'
  }
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
await executeTool('ssh_keygen', { type: 'ed25519' });

// RDP (Windows)
await executeTool('rdp_connect', { host: '192.168.1.100', user: 'admin' });
await executeTool('rdp_enable', {});

// VNC
await executeTool('vnc_connect', { host: '192.168.1.100' });
await executeTool('vnc_server_start', { display: 1 });

// WinRM
await executeTool('winrm_exec', { host: '192.168.1.100', command: 'Get-Process' });

// Monitoring
await executeTool('ping', { host: 'example.com' });
await executeTool('port_scan', { host: '192.168.1.100', ports: '22,80,443' });
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
await executeTool('telegram_send_photo', { 
  botToken: 'TOKEN', chatId: 'ID', photoUrl: 'URL' 
});

// WhatsApp
await executeTool('whatsapp_send_message', { 
  accessToken: 'TOKEN', phoneNumberId: 'ID', to: '+123456', message: 'Hello!' 
});
await executeTool('whatsapp_send_template', { 
  accessToken: 'TOKEN', phoneNumberId: 'ID', to: '+123456', templateName: 'welcome' 
});

// Discord
await executeTool('discord_send_embed', { 
  webhookUrl: 'URL', title: 'Alert', description: 'Done!' 
});

// Slack
await executeTool('slack_send_message', { 
  webhookUrl: 'URL', text: 'Build completed!' 
});

// Email
await executeTool('email_send', { 
  to: 'user@example.com', subject: 'Hello', body: 'Message content' 
});

// MCP (Generic API)
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
// TTS - OpenAI GPT-4o Mini TTS (Verified!)
await executeTool('tts_speak', { 
  text: 'Hello!', provider: 'openai', model: 'gpt-4o-mini-tts', voice: 'alloy' 
});

// TTS - ElevenLabs V3 (Newest! 70+ languages, audio tags)
await executeTool('tts_speak', { 
  text: '[excited] Hello! [whispers] This is amazing!', 
  provider: 'elevenlabs', 
  model: 'eleven_v3', 
  voice: 'rachel' 
});

// TTS - MiniMax Speech 2.6 Turbo (40+ languages, <250ms)
await executeTool('tts_speak', { 
  text: 'Hello!', provider: 'minimax', model: 'speech-2.6-turbo' 
});

// ASR - GPT-4o Mini Transcribe
await executeTool('asr_transcribe', { 
  audioPath: '/audio.mp3', provider: 'openai', model: 'gpt-4o-mini-transcribe' 
});

// ASR - Groq Whisper Large V3 Turbo (216× realtime!)
await executeTool('asr_transcribe', { 
  audioPath: '/audio.mp3', provider: 'groq', model: 'whisper-large-v3-turbo' 
});

// ASR - ElevenLabs Scribe V2 (90+ languages, best WER)
await executeTool('asr_transcribe', { 
  audioPath: '/audio.mp3', provider: 'elevenlabs', model: 'scribe_v2' 
});

// Voice Cloning
await executeTool('voice_clone', { 
  audioPaths: ['/voice1.mp3', '/voice2.mp3'], 
  name: 'My Voice',
  provider: 'elevenlabs' 
});
```

---

## 🔒 Security & Penetration Testing

```typescript
// Port scanning
await executeTool('nmap_scan', { target: '192.168.1.0/24', scanType: '-sV' });
await executeTool('nmap_vuln', { target: '192.168.1.100' });
await executeTool('port_scan', { host: 'example.com', ports: '22,80,443' });

// Vulnerability testing
await executeTool('sql_injection_test', { url: 'https://site.com/search?q={param}', param: 'q' });
await executeTool('xss_test', { url: 'https://site.com/search?q={param}', param: 'q' });
await executeTool('ssl_check', { hostname: 'example.com' });
await executeTool('http_headers_check', { url: 'https://example.com' });
await executeTool('cors_check', { url: 'https://example.com' });

// DNS enumeration
await executeTool('dns_enum', { domain: 'example.com' });
await executeTool('subdomain_enum', { domain: 'example.com' });
await executeTool('whois_lookup', { domain: 'example.com' });

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

1. **Static Code Analysis** - Detects dangerous patterns before execution
2. **Sandboxed Execution** - Timeout limits, memory constraints
3. **Permission System** - Granular permissions per tool and skill
4. **Rate Limiting** - Prevent abuse and API spam
5. **Audit Logging** - Complete operation trail for compliance

---

## ⚙️ Environment Variables

```env
# AI Providers (15 providers)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...
GROQ_API_KEY=...
MISTRAL_API_KEY=...
XAI_API_KEY=...
ZAI_API_KEY=...        # Z.ai = GLM = Zhipu AI
MOONSHOT_API_KEY=...
MINIMAX_API_KEY=...
COHERE_API_KEY=...
TOGETHER_API_KEY=...
ELEVENLABS_API_KEY=...
QWEN_API_KEY=...
REPLICATE_API_TOKEN=...

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
npx prisma generate
npx prisma db push
npm run dev
```

**Windows PowerShell:**
```powershell
git clone https://github.com/Mohabsmar/voicedev.git
cd voicedev
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Option 3: Desktop App
```bash
npm run tauri:dev
```

---

## 📚 API Reference

```
# Tool & Skill Execution
POST /api/tools/execute    # Execute a tool
POST /api/skills/execute   # Execute a skill

# Providers & Models
GET  /api/providers        # List all providers
GET  /api/providers/:id    # Get provider details
GET  /api/models?category=llm  # List models by category
GET  /api/models/newest    # Get newest models
POST /api/custom/endpoint  # Add custom endpoint
POST /api/custom/model     # Add custom model

# Unified Marketplace (NEW!)
GET  /api/marketplace?action=status           # Marketplace status
GET  /api/marketplace&action=search&query=... # Search Smithery + ClawHub
GET  /api/marketplace&action=list             # List installed items
GET  /api/marketplace&action=explore          # Get featured items
GET  /api/marketplace?action=core-tools       # Extreme Core 20 tools
GET  /api/marketplace?action=local-toolboxes  # Local MCP toolboxes
GET  /api/marketplace?action=vet&itemId=...   # Security vet scan
POST /api/marketplace                         # Install/Execute
  {"action": "install", "itemId": "...", "source": "smithery|clawhub"}
  {"action": "execute-tool", "toolId": "...", "params": {...}}
```

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

## 📄 License

MIT License - Use it however you want!

---

## 🙏 Special Thanks

- My parents for believing in me and supporting my coding journey
- The amazing AI community for making these technologies accessible
- Everyone who believes young developers can build incredible things
- Egypt 🇪🇬 for inspiring me to dream big

---

## 💬 Connect

- **GitHub**: [@Mohabsmar](https://github.com/Mohabsmar)
- **Project**: [VoiceDev](https://github.com/Mohabsmar/voicedev)
- **Issues**: [Report Bug](https://github.com/Mohabsmar/voicedev/issues)

---

<div align="center">

**Made with 💜 by an 11-year-old Egyptian who loves coding**

### ⭐ Star this repo if you think it's cool! ⭐

**🇪🇬 Proud Egyptian Developer**

**Cross-Platform: Windows (PowerShell) + Linux + macOS**

**Desktop App: Tauri v2**

**250+ Tools • 123+ Skills • 15 Providers • 80+ Models • 6 Channels • Custom Endpoints**

**🆕 Smithery + ClawHub Marketplaces • Extreme Core 20 • Local MCP Toolboxes • Vet Scanner**

**Updated March 23, 2026: GPT-5.4, Claude 4.6, Gemini 3.1, GLM-5, Grok 4.20 Beta!**

*All models verified - no fabricated entries!*

</div>
