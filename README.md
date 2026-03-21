<div align="center">

# 🎤 VoiceDev

### The Ultimate AI Agent Debugger Platform

**Built with 💜 by an 11-year-old developer**

[![Built by 11 yo Developer](https://img.shields.io/badge/Built%20by-11%20yo%20Developer-purple?style=for-the-badge)](https://github.com/Mohabsmar/voicedev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Tools](https://img.shields.io/badge/Tools-250-orange?style=flat-square)](src/tools/)
[![Skills](https://img.shields.io/badge/Skills-100-blue?style=flat-square)](src/skills/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux%20%7C%20macOS-informational?style=flat-square)](https://github.com/Mohabsmar/voicedev)

[Getting Started](#-getting-started) • [Documentation](#-documentation) • [Windows Setup](#-windows-setup) • [Tools](#-tools-250-real-implementations) • [Skills](#-skills-100-real-implementations) • [Marketplace](#-marketplace) • [Contributing](#-contributing)

</div>

---

## 📖 Table of Contents

1. [What is VoiceDev?](#-what-is-voicedev)
2. [Features Overview](#-features-overview)
3. [Getting Started](#-getting-started)
4. [Windows Setup](#-windows-setup)
5. [Linux/macOS Setup](#-linuxmacos-setup)
6. [Cross-Platform Support](#-cross-platform-support)
7. [Tools: 250 Real Implementations](#-tools-250-real-implementations)
8. [Skills: 100 Real Implementations](#-skills-100-real-implementations)
9. [5-Layer Security System](#-5-layer-security-system)
10. [Marketplace](#-marketplace)
11. [How to Edit This Project](#-how-to-edit-this-project)
12. [How to Add New Tools](#-how-to-add-new-tools)
13. [How to Add New Skills](#-how-to-add-new-skills)
14. [How to Use the Marketplace](#-how-to-use-the-marketplace)
15. [How to Rate Tools and Skills](#-how-to-rate-tools-and-skills)
16. [How to Debug Issues](#-how-to-debug-issues)
17. [API Reference](#-api-reference)
18. [Architecture](#-architecture)
19. [Testing](#-testing)
20. [Contributing](#-contributing)
21. [License](#-license)

---

## 🎯 What is VoiceDev?

VoiceDev is an **AI Agent Debugger Platform** that helps developers understand, debug, and control their AI agents. It provides a visual interface for monitoring AI agent behavior, tracking tool calls, analyzing costs, and managing sessions.

### The Story

This entire project was **vibecoded by an 11-year-old** who wanted to build something cool. Every feature, every tool, every skill - all built with determination, curiosity, and way too much screen time (thanks, parents!).

### What Makes It Special

- **250 Real Working Tools** - Not stubs or placeholders. Every tool has a real `execute()` function that actually works.
- **100 Real Working Skills** - Skills that combine multiple tools for complex workflows.
- **5-Layer Security System** - Enterprise-grade protection for safe execution.
- **Built-in Marketplace** - Discover, install, rate, and publish tools and skills.
- **Cross-Platform Support** - Works on Windows (PowerShell), Linux, and macOS (Bash).
- **Visual Debugging** - Timeline view, tool calls, memory viewer, cost analytics, and session replay.

---

## ✨ Features Overview

### Simple Mode
Perfect for quick debugging sessions:
- ⚡ **Timeline** - Visual timeline of all events
- 🔧 **Tool Calls** - Every tool call with input/output
- 📋 **Logs** - Real-time log viewer

### Advanced Mode
Full power for power users:
- 💾 **Memory Viewer** - Inspect agent memory state
- 💰 **Cost Analytics** - Track spending by provider
- 🐛 **Error Tracking** - Detailed error analysis
- 🔄 **Session Replay** - Replay any session step-by-step
- ⚙️ **Provider Settings** - Configure AI providers
- 📊 **Statistics** - Usage statistics and insights

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 18.0 or higher ([Download](https://nodejs.org/))
- **npm** 9.0 or higher (comes with Node.js)
- **Git** for cloning the repository ([Download](https://git-scm.com/))

### Quick Install

```bash
# Clone the repository
git clone https://github.com/Mohabsmar/voicedev.git

# Navigate to project
cd voicedev

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🪟 Windows Setup

VoiceDev fully supports Windows with PowerShell! Here's a detailed setup guide:

### Step 1: Install Prerequisites

#### Install Node.js
1. Go to [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer with default options
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

#### Install Git
1. Go to [git-scm.com](https://git-scm.com/download/win)
2. Download the Windows installer
3. Run installer (recommended: select "Git from the command line")
4. Verify installation:
   ```powershell
   git --version
   ```

### Step 2: Clone and Setup

Open **PowerShell** or **Command Prompt**:

```powershell
# Navigate to your projects folder
cd C:\Users\YourName\Projects

# Clone the repository
git clone https://github.com/Mohabsmar/voicedev.git

# Navigate to project
cd voicedev

# Install dependencies
npm install
```

### Step 3: Run the Application

```powershell
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

### Windows-Specific Notes

1. **PowerShell Execution Policy**: If you get script execution errors, run:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Windows Defender**: You might need to allow Node.js through Windows Defender Firewall.

3. **Long Path Names**: If you encounter path length issues, enable long paths:
   - Open Registry Editor (`regedit`)
   - Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
   - Set `LongPathsEnabled` to `1`

4. **Admin Privileges**: Some tools (like symlink creation) require Administrator privileges on Windows.

### Windows PowerShell Tools

VoiceDev includes PowerShell equivalents for all shell commands:

```typescript
// These work on both Windows and Linux/Mac
await executeTool('shell_exec', { command: 'Get-Process' });  // Windows
await executeTool('shell_exec', { command: 'ps aux' });       // Linux/Mac

// Dedicated PowerShell tool
await executeTool('powershell_exec', { 
  command: 'Get-ChildItem -Path "C:\\Users" -Recurse' 
});

// Cross-platform file operations
await executeTool('dir_list', { path: 'C:\\Projects' });  // Windows
await executeTool('dir_list', { path: '/home/user' });    // Linux
```

---

## 🐧 Linux/macOS Setup

### Step 1: Install Prerequisites

#### Ubuntu/Debian
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt-get install -y git
```

#### macOS (with Homebrew)
```bash
# Install Node.js
brew install node

# Install Git
brew install git
```

### Step 2: Clone and Setup

```bash
# Clone the repository
git clone https://github.com/Mohabsmar/voicedev.git

# Navigate to project
cd voicedev

# Install dependencies
npm install
```

### Step 3: Run the Application

```bash
# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🖥️ Cross-Platform Support

VoiceDev automatically detects your operating system and uses the appropriate commands:

| Feature | Windows | Linux/macOS |
|---------|---------|-------------|
| **Shell** | PowerShell | Bash |
| **File Operations** | Native + PowerShell | Native + Bash |
| **Process Management** | `Get-Process`, `Stop-Process` | `ps`, `kill` |
| **Service Management** | `Get-Service`, `Start-Service` | `systemctl` |
| **Archive Operations** | `Compress-Archive`, `Expand-Archive` | `zip`, `tar` |
| **Scheduled Tasks** | Task Scheduler | Cron |
| **Disk Usage** | `Get-PSDrive` | `df -h` |
| **Memory Info** | `Get-CimInstance` | `free -h` |

### Cross-Platform Tool Examples

```typescript
// These work on ALL platforms!
await executeTool('os_info', {});
// Returns: { platform: 'win32' | 'linux' | 'darwin', ... }

await executeTool('shell_exec', { command: 'echo "Hello World"' });
// Uses PowerShell on Windows, Bash on Linux/Mac

await executeTool('file_search', { path: '.', pattern: '*.ts' });
// Uses Get-ChildItem on Windows, find on Linux/Mac

await executeTool('dir_size', { path: './src' });
// Uses PowerShell on Windows, du on Linux/Mac
```

### Platform Detection

```typescript
import { isWindows, getTempDir, getHomeDir } from './tools';

if (isWindows) {
  console.log('Running on Windows');
  console.log('Temp dir:', getTempDir()); // C:\Users\...\AppData\Local\Temp
} else {
  console.log('Running on Linux/macOS');
  console.log('Temp dir:', getTempDir()); // /tmp
}
```

---

## 🔧 Tools: 250 Real Implementations

### Overview

Every tool in VoiceDev has a **real working implementation** that works on **Windows, Linux, and macOS**.

### Tool Categories

| Category | Count | Description |
|----------|-------|-------------|
| **FileSystem** | 50 | Read, write, delete, copy, move, compress files |
| **Shell** | 40 | Execute commands, manage processes (PowerShell + Bash) |
| **Web/HTTP** | 50 | HTTP requests, DNS, webhooks, API testing |
| **Git** | 30 | Clone, commit, push, merge, branch management |
| **NPM/Packages** | 30 | Install, build, test, publish packages |
| **Database** | 20 | SQLite, PostgreSQL, MySQL, Redis, MongoDB |
| **Cloud** | 20 | AWS, GCP, Azure, Kubernetes, Terraform |
| **Security** | 20 | Encrypt, decrypt, hash, JWT, SSL |

### Using Tools

```typescript
import { executeTool } from './tools';

// Read a file (cross-platform)
const result = await executeTool('file_read', { path: '/data/file.txt' });
// On Windows: C:\data\file.txt
// On Linux: /data/file.txt

// Write a file (cross-platform)
await executeTool('file_write', { 
  path: '/output.txt', 
  content: 'Hello, World!' 
});

// Execute shell command (cross-platform)
const { stdout, stderr } = await executeTool('shell_exec', { 
  command: 'echo "Hello"'  // Works on PowerShell and Bash
});

// PowerShell-specific command
await executeTool('powershell_exec', { 
  command: 'Get-Process | Sort-Object CPU -Descending | Select-Object -First 10' 
});

// Git operations (cross-platform)
await executeTool('git_commit', { 
  message: 'Add new feature',
  path: '/path/to/repo' 
});

// Get OS information
const osInfo = await executeTool('os_info', {});
// { platform: 'win32', arch: 'x64', cpus: 8, ... }
```

### Tool Result Format

```typescript
interface ToolResult<T = any> {
  success: boolean;      // Did the operation succeed?
  data?: T;              // The result data
  error?: string;        // Error message if failed
  metadata?: {           // Additional information
    duration?: number;   // Execution time in ms
    platform?: string;   // 'win32' | 'linux' | 'darwin'
    [key: string]: any;
  };
}
```

---

## 🎨 Skills: 100 Real Implementations

### What are Skills?

Skills combine multiple tools to perform complex workflows. They're higher-level abstractions that make it easier to accomplish common tasks.

### Skill Categories

| Category | Count | Examples |
|----------|-------|----------|
| **Development** | 20 | project-init, api-test, git-workflow, backup-project |
| **Data** | 15 | json-transform, csv-to-json, data-validate, aggregate-data |
| **Automation** | 15 | batch-rename, cleanup-temp, schedule-task, sync-directories |
| **Security** | 15 | port-scan, ssl-check, security-audit, encrypt-files |
| **File** | 10 | find-duplicates, archive-project, compare-files |
| **Web** | 10 | health-check, webhook-test, crawl-website |
| **Git** | 10 | quick-commit, branch-manager, stash-manager |
| **Database** | 5 | export-database, backup-database, search-database |

### Using Skills

```typescript
import { executeSkill } from './skills';

// Initialize a new project (cross-platform)
const result = await executeSkill('project-init', {
  name: 'my-awesome-app',
  type: 'node'
});
// Creates: src/, tests/, docs/, package.json

// Test an API endpoint
const apiResult = await executeSkill('api-test', {
  url: 'https://api.example.com/users',
  method: 'GET'
});

// Complete git workflow
await executeSkill('git-workflow', {
  message: 'Fix bug in authentication',
  branch: 'main'
});
// Performs: git status -> git add -> git commit -> git push
```

---

## 🛡️ 5-Layer Security System

VoiceDev implements enterprise-grade security with 5 independent layers:

### Layer 1: Static Code Analysis
Scans code for dangerous patterns before execution.

### Layer 2: Sandboxed Execution
Runs untrusted code in isolation with timeouts and memory limits.

### Layer 3: Permission System
Granular permissions for each tool.

### Layer 4: Rate Limiting
Prevent abuse with configurable limits.

### Layer 5: Audit Logging
Complete audit trail of all operations.

---

## 🏪 Marketplace

The built-in marketplace lets you discover, install, and rate tools and skills.

### Browsing the Marketplace

```typescript
import { marketplace } from './marketplace';

// Search for items
const results = marketplace.search('file', {
  type: 'tool',
  minRating: 4.0
});

// Install an item
await marketplace.install('file_read', 'user-123');

// Add a review
marketplace.addReview('file_read', 'user-123', 5, 'Works great!');
```

---

## ✏️ How to Edit This Project

### Project Structure

```
voicedev/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   │
│   ├── components/             # React Components
│   │   └── ui/                 # shadcn/ui components
│   │
│   ├── tools/                  # 250 Tools (cross-platform)
│   │   └── index.ts
│   │
│   ├── skills/                 # 100 Skills
│   │   └── index.ts
│   │
│   ├── security/               # 5 Security Layers
│   │   └── index.ts
│   │
│   └── marketplace/            # Marketplace System
│       └── index.ts
│
├── prisma/                     # Database Schema
├── package.json
└── tsconfig.json
```

### Editing Components

1. Find the component in `src/components/`
2. Make your changes
3. Test with `npm run dev`
4. Build with `npm run build`

---

## 🔨 How to Add New Tools

### Step 1: Define Your Tool

Open `src/tools/index.ts` and add your tool:

```typescript
my_tool: createTool(
  'my_tool',
  'Brief description of what the tool does',
  {
    required_param: 'string',
    optional_param: 'number?',
  },
  async (p: { required_param: string; optional_param?: number }) => {
    try {
      // Your implementation here
      const result = await someOperation(p.required_param);
      
      return { 
        success: true, 
        data: result,
        metadata: {
          platform: process.platform  // Include platform info
        }
      };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
),
```

### Step 2: Make It Cross-Platform

Use the built-in utilities for cross-platform support:

```typescript
import { isWindows, execCrossPlatform, shellCommands } from './tools';

my_crossplatform_tool: createTool(
  'my_crossplatform_tool',
  'A tool that works everywhere',
  { path: 'string' },
  async (p: { path: string }) => {
    try {
      // Use execCrossPlatform instead of execAsync
      const { stdout } = await execCrossPlatform(
        isWindows 
          ? `Get-ChildItem "${p.path}"` 
          : `ls -la "${p.path}"`
      );
      
      return { success: true, data: stdout };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }
),
```

---

## 🎯 How to Add New Skills

Open `src/skills/index.ts` and add your skill:

```typescript
'my_skill': {
  name: 'My Skill Name',
  description: 'What this skill does',
  category: 'development',
  tools: ['tool_one', 'tool_two'],
  execute: async (params: { path: string }): Promise<SkillResult> => {
    const steps: SkillResult['steps'] = [];
    
    // Step 1
    const step1 = await runTool('tool_one', { path: params.path });
    steps.push({ tool: 'tool_one', result: step1 });
    
    if (!step1.success) {
      return { success: false, error: step1.error, steps };
    }
    
    // Step 2
    const step2 = await runTool('tool_two', { data: step1.data });
    steps.push({ tool: 'tool_two', result: step2 });
    
    return {
      success: true,
      data: step2.data,
      steps
    };
  }
},
```

---

## 🛒 How to Use the Marketplace

### Searching

```typescript
const results = marketplace.search('database', {
  type: 'skill',
  category: 'database',
  minRating: 4.0,
  sortBy: 'downloads'
});
```

### Installing

```typescript
const result = await marketplace.install('postgres_query', 'user-123');
```

### Publishing

```typescript
const result = await marketplace.publishItem({
  name: 'My Custom Tool',
  description: 'Does something awesome',
  type: 'tool',
  category: 'utility',
  author: 'your-username',
  version: '1.0.0',
  price: 'free',
  tags: ['custom', 'utility'],
  dependencies: []
});
```

---

## ⭐ How to Rate Tools and Skills

```typescript
// Add a review
marketplace.addReview(
  'file_read',           // Item ID
  'user-123',            // Your user ID
  5,                     // Rating (1-5 stars)
  'This tool is amazing! Works perfectly on Windows.'
);

// Get reviews
const reviews = marketplace.getReviews('file_read', 20);
```

---

## 🐛 How to Debug Issues

### Enable Debug Mode

```bash
# Windows PowerShell
$env:DEBUG="voicedev:*"
npm run dev

# Linux/macOS
DEBUG=voicedev:* npm run dev
```

### Common Windows Issues

#### PowerShell Execution Policy
```powershell
# Error: "running scripts is disabled on this system"
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Long Path Names
```powershell
# Enable long paths in Windows
# Run as Administrator in PowerShell:
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" `
  -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

#### Permission Denied
```powershell
# Run PowerShell as Administrator for:
# - Symlink creation
# - Service management
# - System file operations
```

### Common Linux/macOS Issues

#### Permission Denied
```bash
# Make scripts executable
chmod +x script.sh

# Use sudo for system operations
sudo npm install -g some-package
```

#### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Check OS Information

```typescript
const osInfo = await executeTool('os_info', {});
console.log(osInfo);
// {
//   platform: 'win32',
//   arch: 'x64',
//   type: 'Windows_NT',
//   release: '10.0.19045',
//   cpus: 8,
//   totalMemory: 17179869184,
//   freeMemory: 8589934592,
//   isWindows: true,
//   shell: 'powershell'
// }
```

---

## 📚 API Reference

### Tools API

```
POST /api/tools/execute
Execute a tool with parameters

Request:
{
  "tool": "file_read",
  "params": { "path": "/data/file.txt" }
}

Response:
{
  "success": true,
  "data": "file contents..."
}
```

### Skills API

```
POST /api/skills/execute
Execute a skill with parameters

Request:
{
  "skill": "project-init",
  "params": { "name": "my-project" }
}
```

### OS Info API

```
POST /api/tools/execute
Get operating system information

Request:
{
  "tool": "os_info",
  "params": {}
}

Response:
{
  "success": true,
  "data": {
    "platform": "win32",
    "isWindows": true,
    "shell": "powershell",
    ...
  }
}
```

---

## 🏗️ Architecture

### Cross-Platform Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VoiceDev Application                 │
├─────────────────────────────────────────────────────────┤
│                     Tool Layer                          │
│  ┌─────────────────┐    ┌─────────────────┐            │
│  │  Cross-Platform │    │   Platform      │            │
│  │     Utils       │    │   Detection     │            │
│  └────────┬────────┘    └────────┬────────┘            │
│           │                      │                      │
│           ▼                      ▼                      │
│  ┌─────────────────────────────────────────┐           │
│  │          Platform-Specific              │           │
│  │            Commands                     │           │
│  │  ┌──────────────┐  ┌──────────────┐    │           │
│  │  │  PowerShell  │  │    Bash      │    │           │
│  │  │  (Windows)   │  │ (Linux/Mac)  │    │           │
│  │  └──────────────┘  └──────────────┘    │           │
│  └─────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Cross-Platform Testing

```typescript
describe('file operations', () => {
  it('should work on all platforms', async () => {
    const result = await executeTool('file_write', {
      path: path.join(os.tmpdir(), 'test.txt'),
      content: 'Hello World'
    });
    expect(result.success).toBe(true);
  });
});
```

---

## 🤝 Contributing

We welcome contributions!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- **Cross-Platform**: Ensure code works on Windows, Linux, and macOS
- **Tests**: Add tests for new functionality
- **Documentation**: Update README for new features
- **Security**: Consider security implications

---

## 📄 License

MIT License - Use it however you want!

---

## 🙏 Special Thanks

- My parents for the screen time (and snacks)
- The AI that helped me learn
- Hot chocolate (just kidding, I'm 11 - more screen time!)
- Everyone who believes young devs can build cool stuff
- The open-source community

---

## 💬 Connect

- **GitHub**: [@Mohabsmar](https://github.com/Mohabsmar)
- **Project**: [VoiceDev](https://github.com/Mohabsmar/voicedev)
- **Issues**: [Report a Bug](https://github.com/Mohabsmar/voicedev/issues)

---

<div align="center">

**Made with 💜 by an 11-year-old who loves coding**

### ⭐ Star this repo if you think it's cool! ⭐

**Works on Windows (PowerShell) + Linux + macOS!**

**All 250 tools + 100 skills have REAL working implementations!**

</div>
