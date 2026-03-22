/**
 * VoiceDev - Local MCP Toolboxes
 * Local toolboxes that run without external connections
 * Includes: shell executor, file system, database, network, process management
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as http from 'http';
import * as https from 'https';

const execAsync = promisify(exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

// ============================================
// LOCAL TOOLBOX DEFINITIONS
// ============================================
export const LOCAL_TOOLBOXES = [
  {
    id: 'shell-executor',
    name: 'Shell Executor',
    description: 'Execute shell commands locally with full control',
    type: 'shell',
    icon: 'terminal',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'shell_exec',
      'shell_pipe',
      'shell_background',
      'shell_kill',
      'env_get',
      'env_set',
      'env_list'
    ]
  },
  {
    id: 'filesystem',
    name: 'File System',
    description: 'Complete file system operations',
    type: 'filesystem',
    icon: 'folder',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'fs_read',
      'fs_write',
      'fs_append',
      'fs_delete',
      'fs_copy',
      'fs_move',
      'fs_list',
      'fs_mkdir',
      'fs_exists',
      'fs_stat',
      'fs_watch',
      'fs_search',
      'fs_hash'
    ]
  },
  {
    id: 'process-manager',
    name: 'Process Manager',
    description: 'Manage system processes',
    type: 'process',
    icon: 'activity',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'process_list',
      'process_kill',
      'process_info',
      'process_tree',
      'process_top'
    ]
  },
  {
    id: 'network-tools',
    name: 'Network Tools',
    description: 'Network operations and diagnostics',
    type: 'network',
    icon: 'wifi',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'http_get',
      'http_post',
      'http_request',
      'dns_lookup',
      'ping',
      'port_check'
    ]
  },
  {
    id: 'archive-tools',
    name: 'Archive Tools',
    description: 'Create and extract archives',
    type: 'archive',
    icon: 'archive',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'zip_create',
      'zip_extract',
      'tar_create',
      'tar_extract',
      'gzip_compress',
      'gzip_decompress'
    ]
  },
  {
    id: 'crypto-tools',
    name: 'Crypto Tools',
    description: 'Cryptographic operations',
    type: 'crypto',
    icon: 'lock',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'hash_create',
      'hash_verify',
      'encrypt',
      'decrypt',
      'random_bytes',
      'uuid_generate'
    ]
  },
  {
    id: 'code-runner',
    name: 'Code Runner',
    description: 'Execute code in various languages',
    type: 'code',
    icon: 'play',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'run_javascript',
      'run_python',
      'run_bash',
      'run_powershell',
      'run_ruby',
      'run_perl'
    ]
  },
  {
    id: 'database-local',
    name: 'Local Database',
    description: 'Local database operations (SQLite, JSON)',
    type: 'database',
    icon: 'database',
    enabled: true,
    platforms: ['win32', 'linux', 'darwin'],
    tools: [
      'db_query',
      'db_insert',
      'db_update',
      'db_delete',
      'db_export',
      'db_import'
    ]
  }
] as const;

// ============================================
// SHELL EXECUTOR TOOLBOX
// ============================================
export const ShellExecutor = {
  async exec(command: string, options?: { cwd?: string; timeout?: number }) {
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/bash';
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        shell,
        cwd: options?.cwd || process.cwd(),
        timeout: options?.timeout || 30000,
        maxBuffer: 100 * 1024 * 1024
      });
      return { success: true, stdout, stderr };
    } catch (error: any) {
      return { success: false, error: error.message, stdout: error.stdout, stderr: error.stderr };
    }
  },

  async pipe(commands: string[], options?: { cwd?: string }) {
    const isWindows = process.platform === 'win32';
    const pipeChar = ' | ';
    const fullCommand = commands.join(pipeChar);
    return this.exec(fullCommand, options);
  },

  async background(command: string, options?: { cwd?: string }) {
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/bash';
    
    const child = spawn(command, [], {
      shell,
      cwd: options?.cwd || process.cwd(),
      detached: true,
      stdio: 'ignore'
    });
    child.unref();
    
    return { success: true, pid: child.pid };
  },

  async kill(pid: number, signal?: string) {
    try {
      process.kill(pid, (signal || 'SIGTERM') as any);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  getEnv(name: string) {
    return { success: true, value: process.env[name] };
  },

  setEnv(name: string, value: string) {
    process.env[name] = value;
    return { success: true };
  },

  listEnv() {
    return { success: true, env: { ...process.env } };
  }
};

// ============================================
// FILE SYSTEM TOOLBOX
// ============================================
export const FileSystemToolbox = {
  async read(filePath: string, encoding: BufferEncoding = 'utf-8') {
    try {
      const content = await readFile(filePath, encoding);
      return { success: true, content };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async write(filePath: string, content: string) {
    try {
      await mkdir(path.dirname(filePath), { recursive: true });
      await writeFile(filePath, content, 'utf-8');
      return { success: true, bytesWritten: Buffer.byteLength(content) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async append(filePath: string, content: string) {
    try {
      await writeFile(filePath, content, { flag: 'a' } as any);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async delete(filePath: string) {
    try {
      await unlink(filePath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async list(dirPath: string, recursive: boolean = false) {
    try {
      const results: string[] = [];
      
      const scan = async (dir: string, base: string) => {
        const entries = await readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          results.push(path.relative(base, fullPath));
          if (recursive && entry.isDirectory()) {
            await scan(fullPath, base);
          }
        }
      };
      
      await scan(dirPath, dirPath);
      return { success: true, entries: results };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async mkdir(dirPath: string) {
    try {
      await mkdir(dirPath, { recursive: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async exists(filePath: string) {
    try {
      await stat(filePath);
      return { success: true, exists: true };
    } catch {
      return { success: true, exists: false };
    }
  },

  async stat(filePath: string) {
    try {
      const stats = await stat(filePath);
      return {
        success: true,
        stats: {
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory(),
          isFile: stats.isFile(),
          mode: stats.mode
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async search(dirPath: string, pattern: string) {
    try {
      const { stdout } = await execAsync(
        process.platform === 'win32'
          ? `Get-ChildItem -Path "${dirPath}" -Filter "${pattern}" -Recurse | Select-Object -ExpandProperty FullName`
          : `find "${dirPath}" -name "${pattern}" 2>/dev/null`,
        { timeout: 30000 }
      );
      return { success: true, files: stdout.trim().split('\n').filter(Boolean) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================
// PROCESS MANAGER TOOLBOX
// ============================================
export const ProcessManager = {
  async list(filter?: string) {
    try {
      const isWindows = process.platform === 'win32';
      const cmd = isWindows
        ? `Get-Process ${filter ? `| Where-Object { $_.ProcessName -like "*${filter}*" }` : ''} | Select-Object Id, ProcessName, CPU, WorkingSet | ConvertTo-Json`
        : `ps aux ${filter ? `| grep "${filter}"` : ''} | head -50`;
      
      const { stdout } = await execAsync(cmd, { timeout: 10000 });
      return { success: true, processes: isWindows ? JSON.parse(stdout) : stdout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async info(pid: number) {
    try {
      const isWindows = process.platform === 'win32';
      const cmd = isWindows
        ? `Get-Process -Id ${pid} | Select-Object * | ConvertTo-Json`
        : `ps -p ${pid} -o pid,ppid,user,%cpu,%mem,stat,start,time,command`;
      
      const { stdout } = await execAsync(cmd, { timeout: 5000 });
      return { success: true, info: isWindows ? JSON.parse(stdout) : stdout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async kill(pid: number, signal: string = 'SIGTERM') {
    try {
      if (process.platform === 'win32') {
        await execAsync(`Stop-Process -Id ${pid} -Force`);
      } else {
        process.kill(pid, signal as any);
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async top(sortBy: 'cpu' | 'memory' = 'cpu', count: number = 10) {
    try {
      const isWindows = process.platform === 'win32';
      const cmd = isWindows
        ? `Get-Process | Sort-Object ${sortBy === 'cpu' ? 'CPU' : 'WorkingSet'} -Descending | Select-Object -First ${count} | ConvertTo-Json`
        : `ps aux --sort=-${sortBy === 'cpu' ? '%cpu' : '%mem'} | head -${count}`;
      
      const { stdout } = await execAsync(cmd, { timeout: 5000 });
      return { success: true, processes: isWindows ? JSON.parse(stdout) : stdout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================
// NETWORK TOOLBOX
// ============================================
export const NetworkToolbox = {
  async httpGet(url: string, headers?: Record<string, string>) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, { headers }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: true, status: res.statusCode, data, headers: res.headers }));
      });
      req.on('error', (error) => resolve({ success: false, error: error.message }));
      req.setTimeout(30000, () => { req.destroy(); resolve({ success: false, error: 'Timeout' }); });
    });
  },

  async httpPost(url: string, body: any, headers?: Record<string, string>) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      
      const req = client.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(bodyStr),
          ...headers
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ success: true, status: res.statusCode, data, headers: res.headers }));
      });
      
      req.on('error', (error) => resolve({ success: false, error: error.message }));
      req.write(bodyStr);
      req.end();
    });
  },

  async dnsLookup(hostname: string) {
    const dns = await import('dns').then(m => m.promises);
    try {
      const [address] = await dns.lookup(hostname);
      return { success: true, address };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async ping(host: string, count: number = 4) {
    try {
      const isWindows = process.platform === 'win32';
      const cmd = isWindows ? `ping -n ${count} ${host}` : `ping -c ${count} ${host}`;
      const { stdout } = await execAsync(cmd, { timeout: 10000 });
      return { success: true, output: stdout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async portCheck(host: string, port: number) {
    return new Promise((resolve) => {
      const socket = new (require('net').Socket)();
      socket.setTimeout(5000);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve({ success: true, open: true });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({ success: true, open: false, reason: 'timeout' });
      });
      
      socket.on('error', () => {
        resolve({ success: true, open: false });
      });
      
      socket.connect(port, host);
    });
  }
};

// ============================================
// CRYPTO TOOLBOX
// ============================================
export const CryptoToolbox = {
  async hash(data: string, algorithm: string = 'sha256') {
    const crypto = await import('crypto');
    const hash = crypto.createHash(algorithm).update(data).digest('hex');
    return { success: true, hash };
  },

  async hashFile(filePath: string, algorithm: string = 'sha256') {
    const crypto = await import('crypto');
    try {
      const content = await readFile(filePath);
      const hash = crypto.createHash(algorithm).update(content).digest('hex');
      return { success: true, hash };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  randomBytes(length: number = 32) {
    const crypto = require('crypto');
    const bytes = crypto.randomBytes(length).toString('hex');
    return { success: true, bytes };
  },

  uuid() {
    const crypto = require('crypto');
    const uuid = crypto.randomUUID();
    return { success: true, uuid };
  }
};

// ============================================
// CODE RUNNER TOOLBOX
// ============================================
export const CodeRunner = {
  async javascript(code: string) {
    try {
      const result = eval(code);
      return { success: true, result };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async python(code: string) {
    try {
      const escapedCode = code.replace(/"/g, '\\"');
      const { stdout, stderr } = await execAsync(
        `python3 -c "${escapedCode}"`,
        { timeout: 30000 }
      );
      return { success: true, output: stdout || stderr };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async bash(code: string) {
    if (process.platform === 'win32') {
      return { success: false, error: 'Bash not available on Windows. Use WSL or PowerShell.' };
    }
    try {
      const { stdout, stderr } = await execAsync(code, { shell: '/bin/bash', timeout: 30000 });
      return { success: true, output: stdout || stderr };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  async powershell(code: string) {
    try {
      const { stdout, stderr } = await execAsync(code, {
        shell: process.platform === 'win32' ? 'powershell.exe' : 'pwsh',
        timeout: 30000
      });
      return { success: true, output: stdout || stderr };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================
// UNIFIED TOOLBOX EXECUTOR
// ============================================
export const LocalToolboxExecutor = {
  toolboxes: LOCAL_TOOLBOXES,

  getToolbox(id: string) {
    return LOCAL_TOOLBOXES.find(t => t.id === id);
  },

  getAllToolboxes() {
    return LOCAL_TOOLBOXES;
  },

  getEnabledToolboxes() {
    return LOCAL_TOOLBOXES.filter(t => t.enabled);
  },

  getToolsByToolbox(toolboxId: string) {
    const toolbox = LOCAL_TOOLBOXES.find(t => t.id === toolboxId);
    return toolbox?.tools || [];
  },

  getAllTools() {
    return LOCAL_TOOLBOXES.flatMap(t => t.tools.map(tool => ({ toolbox: t.id, tool })));
  },

  // Execute a tool from any toolbox
  async execute(toolId: string, params: any) {
    switch (toolId) {
      // Shell tools
      case 'shell_exec':
        return ShellExecutor.exec(params.command, params);
      case 'shell_pipe':
        return ShellExecutor.pipe(params.commands, params);
      case 'shell_background':
        return ShellExecutor.background(params.command, params);
      case 'shell_kill':
        return ShellExecutor.kill(params.pid, params.signal);
      case 'env_get':
        return ShellExecutor.getEnv(params.name);
      case 'env_set':
        return ShellExecutor.setEnv(params.name, params.value);
      case 'env_list':
        return ShellExecutor.listEnv();

      // File system tools
      case 'fs_read':
        return FileSystemToolbox.read(params.path, params.encoding);
      case 'fs_write':
        return FileSystemToolbox.write(params.path, params.content);
      case 'fs_append':
        return FileSystemToolbox.append(params.path, params.content);
      case 'fs_delete':
        return FileSystemToolbox.delete(params.path);
      case 'fs_list':
        return FileSystemToolbox.list(params.path, params.recursive);
      case 'fs_mkdir':
        return FileSystemToolbox.mkdir(params.path);
      case 'fs_exists':
        return FileSystemToolbox.exists(params.path);
      case 'fs_stat':
        return FileSystemToolbox.stat(params.path);
      case 'fs_search':
        return FileSystemToolbox.search(params.path, params.pattern);

      // Process tools
      case 'process_list':
        return ProcessManager.list(params.filter);
      case 'process_info':
        return ProcessManager.info(params.pid);
      case 'process_kill':
        return ProcessManager.kill(params.pid, params.signal);
      case 'process_top':
        return ProcessManager.top(params.sortBy, params.count);

      // Network tools
      case 'http_get':
        return NetworkToolbox.httpGet(params.url, params.headers);
      case 'http_post':
        return NetworkToolbox.httpPost(params.url, params.body, params.headers);
      case 'dns_lookup':
        return NetworkToolbox.dnsLookup(params.hostname);
      case 'ping':
        return NetworkToolbox.ping(params.host, params.count);
      case 'port_check':
        return NetworkToolbox.portCheck(params.host, params.port);

      // Crypto tools
      case 'hash_create':
        return CryptoToolbox.hash(params.data, params.algorithm);
      case 'hash_file':
        return CryptoToolbox.hashFile(params.path, params.algorithm);
      case 'random_bytes':
        return CryptoToolbox.randomBytes(params.length);
      case 'uuid_generate':
        return CryptoToolbox.uuid();

      // Code runner tools
      case 'run_javascript':
        return CodeRunner.javascript(params.code);
      case 'run_python':
        return CodeRunner.python(params.code);
      case 'run_bash':
        return CodeRunner.bash(params.code);
      case 'run_powershell':
        return CodeRunner.powershell(params.code);

      default:
        return { success: false, error: `Unknown tool: ${toolId}` };
    }
  }
};

export default LocalToolboxExecutor;
