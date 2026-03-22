/**
 * VoiceDev Ultimate - 250 Real Working Tools
 * Cross-platform: Windows (PowerShell) + Linux/macOS (Bash)
 * All tools have actual implementations
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';
import * as os from 'os';

const execAsync = promisify(exec);
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const accessAsync = promisify(fs.access);
const mkdirAsync = promisify(fs.mkdir);
const readdirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rmdir);
const renameAsync = promisify(fs.rename);
const copyFileAsync = promisify(fs.copyFile);

export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

// ============================================
// CROSS-PLATFORM UTILITIES
// ============================================

// Detect if running on Windows
const isWindows = process.platform === 'win32';

// Get temp directory cross-platform
const getTempDir = () => os.tmpdir();

// Get home directory cross-platform
const getHomeDir = () => os.homedir();

// Execute command cross-platform
async function execCrossPlatform(command: string, options?: any): Promise<{ stdout: string; stderr: string }> {
  const execOptions = {
    ...options,
    shell: isWindows ? 'powershell.exe' : '/bin/bash',
    cwd: options?.cwd || process.cwd(),
    env: { ...process.env, ...options?.env },
    timeout: options?.timeout || 30000,
    maxBuffer: 100 * 1024 * 1024,
    encoding: 'utf8'
  };
  
  const result = await execAsync(command, execOptions);
  return result as unknown as { stdout: string; stderr: string };
}

// Cross-platform command wrappers
const shellCommands = {
  // File operations
  deleteFile: (filePath: string) => isWindows 
    ? `Remove-Item -Path "${filePath}" -Force` 
    : `rm -f "${filePath}"`,
  
  deleteDir: (dirPath: string, force: boolean = false) => isWindows 
    ? `Remove-Item -Path "${dirPath}" ${force ? '-Recurse -Force' : ''}` 
    : `rm ${force ? '-rf' : '-r'} "${dirPath}"`,
  
  copyDir: (src: string, dest: string) => isWindows 
    ? `Copy-Item -Path "${src}" -Destination "${dest}" -Recurse -Force` 
    : `cp -r "${src}" "${dest}"`,
  
  listDir: (dirPath: string) => isWindows 
    ? `Get-ChildItem -Path "${dirPath}" -Name` 
    : `ls -1 "${dirPath}"`,
  
  findFiles: (dirPath: string, pattern: string) => isWindows 
    ? `Get-ChildItem -Path "${dirPath}" -Filter "${pattern}" -Recurse | Select-Object -ExpandProperty FullName` 
    : `find "${dirPath}" -name "${pattern}" 2>/dev/null`,
  
  grepContent: (dirPath: string, pattern: string) => isWindows 
    ? `Select-String -Path "${dirPath}\\*" -Pattern "${pattern}" -Recurse | Select-Object -First 50` 
    : `grep -r "${pattern}" "${dirPath}" 2>/dev/null | head -50`,
  
  // Directory tree
  dirTree: (dirPath: string, maxDepth: number = 5) => isWindows 
    ? `Get-ChildItem -Path "${dirPath}" -Recurse -Depth ${maxDepth} | Select-Object -First 100 | Select-Object FullName` 
    : `find "${dirPath}" -maxdepth ${maxDepth} 2>/dev/null | head -100`,
  
  // Directory size
  dirSize: (dirPath: string) => isWindows 
    ? `(Get-ChildItem -Path "${dirPath}" -Recurse | Measure-Object -Property Length -Sum).Sum` 
    : `du -sb "${dirPath}" 2>/dev/null | cut -f1`,
  
  // Archive operations
  zipCreate: (source: string, dest: string) => isWindows 
    ? `Compress-Archive -Path "${source}" -DestinationPath "${dest}" -Force` 
    : `zip -r "${dest}" "${source}"`,
  
  zipExtract: (source: string, dest: string) => isWindows 
    ? `Expand-Archive -Path "${source}" -DestinationPath "${dest}" -Force` 
    : `unzip -o "${source}" -d "${dest}"`,
  
  // File head/tail
  head: (filePath: string, lines: number) => isWindows 
    ? `Get-Content -Path "${filePath}" -TotalCount ${lines}` 
    : `head -n ${lines} "${filePath}"`,
  
  tail: (filePath: string, lines: number) => isWindows 
    ? `Get-Content -Path "${filePath}" -Tail ${lines}` 
    : `tail -n ${lines} "${filePath}"`,
  
  // Line count
  countLines: (filePath: string) => isWindows 
    ? `(Get-Content -Path "${filePath}").Count` 
    : `wc -l "${filePath}"`,
  
  // Sort
  sort: (filePath: string, reverse: boolean = false) => isWindows 
    ? `Get-Content -Path "${filePath}" | Sort-Object ${reverse ? '-Descending' : ''}` 
    : `sort ${reverse ? '-r' : ''} "${filePath}"`,
  
  // Unique
  unique: (filePath: string) => isWindows 
    ? `Get-Content -Path "${filePath}" | Sort-Object | Get-Unique` 
    : `sort "${filePath}" | uniq`,
  
  // Process management
  listProcesses: (filter?: string) => isWindows 
    ? `Get-Process ${filter ? `| Where-Object { $_.ProcessName -like "*${filter}*" }` : ''} | Select-Object -First 50 Id, ProcessName, CPU, WorkingSet`
    : `ps aux ${filter ? `| grep "${filter}"` : ''} | head -50`,
  
  topProcesses: (sortBy: string = 'cpu', count: number = 10) => isWindows 
    ? `Get-Process | Sort-Object ${sortBy === 'cpu' ? 'CPU' : 'WorkingSet'} -Descending | Select-Object -First ${count}`
    : `ps aux --sort=-${sortBy === 'cpu' ? '%cpu' : '%mem'} | head -${count}`,
  
  killProcess: (pid: number) => isWindows 
    ? `Stop-Process -Id ${pid} -Force` 
    : `kill -9 ${pid}`,
  
  // System info
  uptime: () => isWindows 
    ? `(Get-CimInstance Win32_OperatingSystem).LastBootUpTime` 
    : `uptime`,
  
  diskUsage: (dirPath: string = '/') => isWindows 
    ? `Get-PSDrive -PSProvider FileSystem | Format-Table -AutoSize` 
    : `df -h ${dirPath}`,
  
  memoryUsage: () => isWindows 
    ? `Get-CimInstance Win32_OperatingSystem | Select-Object TotalVisibleMemorySize, FreePhysicalMemory` 
    : `free -h`,
  
  cpuInfo: () => isWindows 
    ? `Get-CimInstance Win32_Processor | Select-Object Name, NumberOfCores, NumberOfLogicalProcessors` 
    : `lscpu`,
  
  whoami: () => isWindows 
    ? `$env:USERNAME` 
    : `whoami`,
  
  // File diff
  diff: (file1: string, file2: string) => isWindows 
    ? `Compare-Object (Get-Content "${file1}") (Get-Content "${file2}")` 
    : `diff "${file1}" "${file2}"`,
  
  // Environment variables
  envGet: (name: string) => isWindows 
    ? `$env:${name}` 
    : `echo $${name}`,
  
  // Find empty directories
  findEmptyDirs: (dirPath: string) => isWindows 
    ? `Get-ChildItem -Path "${dirPath}" -Directory -Recurse | Where-Object { $_.GetFiles().Count -eq 0 } | Select-Object FullName` 
    : `find "${dirPath}" -type d -empty 2>/dev/null`,
  
  // Service management (Windows)
  serviceStatus: (service: string) => isWindows 
    ? `Get-Service -Name "${service}" 2>$null | Select-Object Name, Status` 
    : `systemctl status ${service} 2>/dev/null || echo "Service not found"`,
  
  serviceStart: (service: string) => isWindows 
    ? `Start-Service -Name "${service}"` 
    : `sudo systemctl start ${service}`,
  
  serviceStop: (service: string) => isWindows 
    ? `Stop-Service -Name "${service}"` 
    : `sudo systemctl stop ${service}`,
  
  // Scheduled tasks (Windows) / Cron (Linux)
  scheduledTaskList: () => isWindows 
    ? `Get-ScheduledTask | Select-Object TaskName, State` 
    : `crontab -l 2>/dev/null || echo "No cron jobs"`,
  
  // Which command
  which: (command: string) => isWindows 
    ? `Get-Command ${command} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source` 
    : `which ${command}`,
  
  // Symlink
  createSymlink: (target: string, link: string) => isWindows 
    ? `New-Item -ItemType SymbolicLink -Path "${link}" -Target "${target}"` 
    : `ln -s "${target}" "${link}"`,
};

// Helper for generating tool definitions
function createTool(name: string, description: string, params: Record<string, string>, execFn: Function) {
  return { name, description, parameters: params, execute: execFn };
}

// ============================================
// FILE SYSTEM TOOLS (50 tools)
// ============================================
export const fileSystemTools: Record<string, any> = {
  file_read: createTool('file_read', 'Read file contents', { path: 'string', encoding: 'string?' },
    async (p: { path: string; encoding?: string }) => {
      try {
        const content = await readFileAsync(p.path, (p.encoding || 'utf-8') as BufferEncoding);
        return { success: true, data: content };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_write: createTool('file_write', 'Write content to file', { path: 'string', content: 'string' },
    async (p: { path: string; content: string }) => {
      try {
        await mkdirAsync(path.dirname(p.path), { recursive: true });
        await writeFileAsync(p.path, p.content, 'utf-8');
        return { success: true, metadata: { bytesWritten: p.content.length } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_append: createTool('file_append', 'Append content to file', { path: 'string', content: 'string' },
    async (p: { path: string; content: string }) => {
      try {
        await writeFileAsync(p.path, p.content, { flag: 'a' } as any);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_delete: createTool('file_delete', 'Delete file', { path: 'string' },
    async (p: { path: string }) => {
      try { await unlinkAsync(p.path); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_copy: createTool('file_copy', 'Copy file', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(path.dirname(p.destination), { recursive: true });
        await copyFileAsync(p.source, p.destination);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_move: createTool('file_move', 'Move file', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(path.dirname(p.destination), { recursive: true });
        await renameAsync(p.source, p.destination);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_rename: createTool('file_rename', 'Rename file', { path: 'string', newName: 'string' },
    async (p: { path: string; newName: string }) => {
      try {
        const newPath = path.join(path.dirname(p.path), p.newName);
        await renameAsync(p.path, newPath);
        return { success: true, metadata: { newPath } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_exists: createTool('file_exists', 'Check if file exists', { path: 'string' },
    async (p: { path: string }) => {
      try {
        await accessAsync(p.path, fs.constants.F_OK);
        return { success: true, data: true };
      } catch { return { success: true, data: false }; }
    }),

  file_stats: createTool('file_stats', 'Get file statistics', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const stats = await statAsync(p.path);
        return { success: true, data: { size: stats.size, created: stats.birthtime, modified: stats.mtime, isDirectory: stats.isDirectory(), isFile: stats.isFile() } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_hash: createTool('file_hash', 'Calculate file hash', { path: 'string', algorithm: 'string?' },
    async (p: { path: string; algorithm?: string }) => {
      try {
        const content = await readFileAsync(p.path);
        const hash = crypto.createHash(p.algorithm || 'sha256').update(content).digest('hex');
        return { success: true, data: hash };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_touch: createTool('file_touch', 'Create empty file or update timestamp', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const now = new Date();
        if (fs.existsSync(p.path)) {
          fs.utimesSync(p.path, now, now);
        } else {
          await writeFileAsync(p.path, '');
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_truncate: createTool('file_truncate', 'Truncate file to specified length', { path: 'string', length: 'number' },
    async (p: { path: string; length: number }) => {
      try {
        await promisify(fs.truncate)(p.path, p.length);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_chmod: createTool('file_chmod', 'Change file permissions (Unix only)', { path: 'string', mode: 'string' },
    async (p: { path: string; mode: string }) => {
      if (isWindows) {
        return { success: false, error: 'chmod is not available on Windows. Use icacls instead.' };
      }
      try {
        await execAsync(`chmod ${p.mode} "${p.path}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_chown: createTool('file_chown', 'Change file owner (Unix only)', { path: 'string', owner: 'string', group: 'string' },
    async (p: { path: string; owner: string; group: string }) => {
      if (isWindows) {
        return { success: false, error: 'chown is not available on Windows. Use icacls instead.' };
      }
      try {
        await execAsync(`chown ${p.owner}:${p.group} "${p.path}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_diff: createTool('file_diff', 'Compare two files', { file1: 'string', file2: 'string' },
    async (p: { file1: string; file2: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.diff(p.file1, p.file2));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message, data: e.stdout || '' }; }
    }),

  file_backup: createTool('file_backup', 'Create backup of file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const backupPath = `${p.path}.backup-${Date.now()}`;
        await copyFileAsync(p.path, backupPath);
        return { success: true, data: backupPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_restore: createTool('file_restore', 'Restore file from backup', { backupPath: 'string', targetPath: 'string' },
    async (p: { backupPath: string; targetPath: string }) => {
      try {
        await copyFileAsync(p.backupPath, p.targetPath);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_watch: createTool('file_watch', 'Watch file for changes', { path: 'string', duration: 'number?' },
    async (p: { path: string; duration?: number }) => {
      try {
        const changes: string[] = [];
        const watcher = fs.watch(p.path, (eventType) => changes.push(eventType));
        await new Promise(r => setTimeout(r, p.duration || 5000));
        watcher.close();
        return { success: true, data: changes };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_lock: createTool('file_lock', 'Lock file for exclusive access', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const lockPath = `${p.path}.lock`;
        await writeFileAsync(lockPath, `${process.pid}:${Date.now()}`);
        return { success: true, data: lockPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_unlock: createTool('file_unlock', 'Unlock file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        await unlinkAsync(`${p.path}.lock`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_create: createTool('dir_create', 'Create directory', { path: 'string' },
    async (p: { path: string }) => {
      try { await mkdirAsync(p.path, { recursive: true }); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_list: createTool('dir_list', 'List directory contents', { path: 'string', recursive: 'boolean?' },
    async (p: { path: string; recursive?: boolean }) => {
      try {
        const results: string[] = [];
        const list = async (dir: string, base: string) => {
          const entries = await readdirAsync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            results.push(path.relative(base, fullPath));
            if (p.recursive && entry.isDirectory()) await list(fullPath, base);
          }
        };
        await list(p.path, p.path);
        return { success: true, data: results };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_delete: createTool('dir_delete', 'Delete directory', { path: 'string', force: 'boolean?' },
    async (p: { path: string; force?: boolean }) => {
      try {
        if (p.force) {
          // Cross-platform recursive delete
          if (isWindows) {
            await execCrossPlatform(shellCommands.deleteDir(p.path, true));
          } else {
            await execAsync(`rm -rf "${p.path}"`);
          }
        } else {
          await rmdirAsync(p.path);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_copy: createTool('dir_copy', 'Copy directory', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await execCrossPlatform(shellCommands.copyDir(p.source, p.destination));
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_tree: createTool('dir_tree', 'Generate directory tree', { path: 'string', maxDepth: 'number?' },
    async (p: { path: string; maxDepth?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.dirTree(p.path, p.maxDepth || 5));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_size: createTool('dir_size', 'Calculate directory size', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.dirSize(p.path));
        const size = isWindows ? parseInt(stdout.trim()) : parseInt(stdout.trim().split('\t')[0]);
        return { success: true, data: size };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_find_empty: createTool('dir_find_empty', 'Find empty directories', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.findEmptyDirs(p.path));
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  symlink_create: createTool('symlink_create', 'Create symbolic link', { target: 'string', link: 'string' },
    async (p: { target: string; link: string }) => {
      try {
        if (isWindows) {
          // Windows requires admin privileges for symlinks, or Developer Mode enabled
          await execCrossPlatform(shellCommands.createSymlink(p.target, p.link));
        } else {
          await execAsync(`ln -s "${p.target}" "${p.link}"`);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  symlink_read: createTool('symlink_read', 'Read symbolic link target', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const target = fs.readlinkSync(p.path);
        return { success: true, data: target };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  temp_create: createTool('temp_create', 'Create temporary file', { prefix: 'string?', suffix: 'string?' },
    async (p: { prefix?: string; suffix?: string }) => {
      try {
        const tempPath = path.join(getTempDir(), `${p.prefix || 'voicedev-'}${Date.now()}${p.suffix || '.tmp'}`);
        await writeFileAsync(tempPath, '');
        return { success: true, data: tempPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  temp_dir: createTool('temp_dir', 'Create temporary directory', { prefix: 'string?' },
    async (p: { prefix?: string }) => {
      try {
        const tempPath = path.join(getTempDir(), `${p.prefix || 'voicedev-'}${Date.now()}`);
        await mkdirAsync(tempPath, { recursive: true });
        return { success: true, data: tempPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  zip_create: createTool('zip_create', 'Create ZIP archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await execCrossPlatform(shellCommands.zipCreate(p.source, p.destination));
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  zip_extract: createTool('zip_extract', 'Extract ZIP archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(p.destination, { recursive: true });
        await execCrossPlatform(shellCommands.zipExtract(p.source, p.destination));
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  tar_create: createTool('tar_create', 'Create TAR archive', { source: 'string', destination: 'string', gzip: 'boolean?' },
    async (p: { source: string; destination: string; gzip?: boolean }) => {
      if (isWindows) {
        // Windows doesn't have native tar in older versions, use PowerShell
        try {
          if (p.gzip) {
            await execCrossPlatform(`Compress-Archive -Path "${p.source}" -DestinationPath "${p.destination}" -Force`);
          } else {
            await execCrossPlatform(`tar -cf "${p.destination}" "${p.source}"`);
          }
          return { success: true };
        } catch (e: any) { return { success: false, error: e.message }; }
      }
      try {
        await execAsync(`tar -${p.gzip ? 'czf' : 'cf'} "${p.destination}" "${p.source}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  tar_extract: createTool('tar_extract', 'Extract TAR archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(p.destination, { recursive: true });
        if (isWindows) {
          // Windows 10+ has built-in tar
          await execCrossPlatform(`tar -xf "${p.source}" -C "${p.destination}"`);
        } else {
          await execAsync(`tar -xf "${p.source}" -C "${p.destination}"`);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gzip_compress: createTool('gzip_compress', 'Compress file with gzip', { path: 'string' },
    async (p: { path: string }) => {
      if (isWindows) {
        try {
          // Use PowerShell to compress
          await execCrossPlatform(`Compress-Archive -Path "${p.path}" -DestinationPath "${p.path}.gz" -Force`);
          return { success: true, data: `${p.path}.gz` };
        } catch (e: any) { return { success: false, error: e.message }; }
      }
      try {
        await execAsync(`gzip "${p.path}"`);
        return { success: true, data: `${p.path}.gz` };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gzip_decompress: createTool('gzip_decompress', 'Decompress gzip file', { path: 'string' },
    async (p: { path: string }) => {
      if (isWindows) {
        try {
          await execCrossPlatform(`Expand-Archive -Path "${p.path}" -DestinationPath "${p.path.replace('.gz', '')}" -Force`);
          return { success: true, data: p.path.replace('.gz', '') };
        } catch (e: any) { return { success: false, error: e.message }; }
      }
      try {
        await execAsync(`gunzip "${p.path}"`);
        return { success: true, data: p.path.replace('.gz', '') };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_search: createTool('file_search', 'Search files by pattern', { path: 'string', pattern: 'string' },
    async (p: { path: string; pattern: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.findFiles(p.path, p.pattern));
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_grep: createTool('file_grep', 'Search content in files', { path: 'string', pattern: 'string' },
    async (p: { path: string; pattern: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.grepContent(p.path, p.pattern));
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_replace: createTool('file_replace', 'Replace text in file', { path: 'string', search: 'string', replace: 'string' },
    async (p: { path: string; search: string; replace: string }) => {
      try {
        const content = await readFileAsync(p.path, 'utf-8');
        const newContent = content.replace(new RegExp(p.search, 'g'), p.replace);
        await writeFileAsync(p.path, newContent);
        return { success: true, metadata: { replacements: (content.match(new RegExp(p.search, 'g')) || []).length } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_head: createTool('file_head', 'Read first lines of file', { path: 'string', lines: 'number?' },
    async (p: { path: string; lines?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.head(p.path, p.lines || 10));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_tail: createTool('file_tail', 'Read last lines of file', { path: 'string', lines: 'number?' },
    async (p: { path: string; lines?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.tail(p.path, p.lines || 10));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_count_lines: createTool('file_count_lines', 'Count lines in file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.countLines(p.path));
        const count = isWindows ? parseInt(stdout.trim()) : parseInt(stdout.trim().split(' ')[0]);
        return { success: true, data: count };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_sort: createTool('file_sort', 'Sort file contents', { path: 'string', reverse: 'boolean?' },
    async (p: { path: string; reverse?: boolean }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.sort(p.path, p.reverse));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_unique: createTool('file_unique', 'Get unique lines from file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.unique(p.path));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  path_resolve: createTool('path_resolve', 'Resolve path to absolute', { path: 'string' },
    async (p: { path: string }) => {
      try { return { success: true, data: path.resolve(p.path) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  path_relative: createTool('path_relative', 'Get relative path', { from: 'string', to: 'string' },
    async (p: { from: string; to: string }) => {
      try { return { success: true, data: path.relative(p.from, p.to) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  path_join: createTool('path_join', 'Join path segments', { segments: 'array' },
    async (p: { segments: string[] }) => {
      try { return { success: true, data: path.join(...p.segments) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  path_parse: createTool('path_parse', 'Parse path into components', { path: 'string' },
    async (p: { path: string }) => {
      try { return { success: true, data: path.parse(p.path) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// SHELL TOOLS (40 tools) - Cross-platform
// ============================================
export const shellTools: Record<string, any> = {
  shell_exec: createTool('shell_exec', 'Execute shell command (cross-platform)', { command: 'string', cwd: 'string?', timeout: 'number?' },
    async (p: { command: string; cwd?: string; timeout?: number }) => {
      try {
        const { stdout, stderr } = await execCrossPlatform(p.command, { cwd: p.cwd, timeout: p.timeout || 30000 });
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message, data: { stdout: e.stdout || '', stderr: e.stderr || '' } }; }
    }),

  shell_pipe: createTool('shell_pipe', 'Execute piped commands', { commands: 'array' },
    async (p: { commands: string[] }) => {
      try {
        const pipeChar = isWindows ? ' | ' : ' | ';
        const { stdout } = await execCrossPlatform(p.commands.join(pipeChar));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_background: createTool('shell_background', 'Run command in background', { command: 'string', cwd: 'string?' },
    async (p: { command: string; cwd?: string }) => {
      try {
        const shell = isWindows ? 'powershell.exe' : '/bin/bash';
        const child = spawn(p.command, [], { cwd: p.cwd || process.cwd(), shell, detached: true, stdio: 'ignore' });
        child.unref();
        return { success: true, data: child.pid };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_kill: createTool('shell_kill', 'Kill process', { pid: 'number', signal: 'string?' },
    async (p: { pid: number; signal?: string }) => {
      try {
        if (isWindows) {
          await execCrossPlatform(`Stop-Process -Id ${p.pid} -Force`);
        } else {
          process.kill(p.pid, (p.signal || 'SIGTERM') as any);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_list_processes: createTool('shell_list_processes', 'List running processes', { filter: 'string?' },
    async (p: { filter?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.listProcesses(p.filter));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_top: createTool('shell_top', 'Get top processes by resource usage', { sortBy: 'string?', count: 'number?' },
    async (p: { sortBy?: string; count?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.topProcesses(p.sortBy || 'cpu', p.count || 10));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  env_get: createTool('env_get', 'Get environment variable', { name: 'string' },
    async (p: { name: string }) => {
      return { success: true, data: process.env[p.name] };
    }),

  env_set: createTool('env_set', 'Set environment variable', { name: 'string', value: 'string' },
    async (p: { name: string; value: string }) => {
      process.env[p.name] = p.value;
      return { success: true };
    }),

  env_list: createTool('env_list', 'List all environment variables', {},
    async () => {
      return { success: true, data: { ...process.env } };
    }),

  env_unset: createTool('env_unset', 'Unset environment variable', { name: 'string' },
    async (p: { name: string }) => {
      delete process.env[p.name];
      return { success: true };
    }),

  python_exec: createTool('python_exec', 'Execute Python code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const pythonCmd = isWindows ? 'python' : 'python3';
        const escapedCode = p.code.replace(/"/g, '\\"');
        const { stdout, stderr } = await execCrossPlatform(`${pythonCmd} -c "${escapedCode}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  python_script: createTool('python_script', 'Execute Python script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const pythonCmd = isWindows ? 'python' : 'python3';
        const { stdout, stderr } = await execCrossPlatform(`${pythonCmd} "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  node_exec: createTool('node_exec', 'Execute Node.js code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const escapedCode = p.code.replace(/"/g, '\\"');
        const { stdout, stderr } = await execCrossPlatform(`node -e "${escapedCode}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  node_script: createTool('node_script', 'Execute Node.js script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const { stdout, stderr } = await execCrossPlatform(`node "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  bash_exec: createTool('bash_exec', 'Execute bash command (Unix only)', { command: 'string' },
    async (p: { command: string }) => {
      if (isWindows) {
        return { success: false, error: 'bash_exec is not available on Windows. Use shell_exec instead or enable WSL.' };
      }
      try {
        const { stdout } = await execAsync(`bash -c "${p.command.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  bash_script: createTool('bash_script', 'Execute bash script file (Unix only)', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      if (isWindows) {
        return { success: false, error: 'bash_script is not available on Windows. Use shell_exec instead or enable WSL.' };
      }
      try {
        const { stdout, stderr } = await execAsync(`bash "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  powershell_exec: createTool('powershell_exec', 'Execute PowerShell command', { command: 'string' },
    async (p: { command: string }) => {
      try {
        if (isWindows) {
          const { stdout, stderr } = await execAsync(p.command, { shell: 'powershell.exe' });
          return { success: true, data: stdout || stderr };
        } else {
          // Try pwsh (PowerShell Core) on Unix
          const { stdout, stderr } = await execAsync(p.command, { shell: 'pwsh' });
          return { success: true, data: stdout || stderr };
        }
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  powershell_script: createTool('powershell_script', 'Execute PowerShell script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const shell = isWindows ? 'powershell.exe' : 'pwsh';
        const { stdout, stderr } = await execAsync(`& "${p.path}" ${(p.args || []).join(' ')}`, { shell });
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ruby_exec: createTool('ruby_exec', 'Execute Ruby code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const escapedCode = p.code.replace(/"/g, '\\"');
        const { stdout, stderr } = await execCrossPlatform(`ruby -e "${escapedCode}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  perl_exec: createTool('perl_exec', 'Execute Perl code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const escapedCode = p.code.replace(/"/g, '\\"');
        const { stdout, stderr } = await execCrossPlatform(`perl -e "${escapedCode}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  task_schedule: createTool('task_schedule', 'Schedule a task (cross-platform)', { name: 'string', command: 'string', schedule: 'string' },
    async (p: { name: string; command: string; schedule: string }) => {
      try {
        if (isWindows) {
          // Windows Task Scheduler
          await execCrossPlatform(`
            $action = New-ScheduledTaskAction -Execute "${p.command}"
            $trigger = New-ScheduledTaskTrigger -Once -At "${p.schedule}"
            Register-ScheduledTask -TaskName "${p.name}" -Action $action -Trigger $trigger
          `);
        } else {
          // Unix cron
          await execAsync(`(crontab -l 2>/dev/null; echo "${p.schedule} ${p.command}") | crontab -`);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  task_list: createTool('task_list', 'List scheduled tasks', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.scheduledTaskList());
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  task_remove: createTool('task_remove', 'Remove scheduled task', { name: 'string' },
    async (p: { name: string }) => {
      try {
        if (isWindows) {
          await execCrossPlatform(`Unregister-ScheduledTask -TaskName "${p.name}" -Confirm:$false`);
        } else {
          const { stdout } = await execAsync('crontab -l 2>/dev/null');
          const lines = stdout.split('\n').filter(l => !l.includes(p.name));
          await execAsync(`echo "${lines.join('\n')}" | crontab -`);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  service_status: createTool('service_status', 'Get service status', { service: 'string' },
    async (p: { service: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.serviceStatus(p.service));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  service_start: createTool('service_start', 'Start service', { service: 'string' },
    async (p: { service: string }) => {
      try {
        await execCrossPlatform(shellCommands.serviceStart(p.service));
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  service_stop: createTool('service_stop', 'Stop service', { service: 'string' },
    async (p: { service: string }) => {
      try {
        await execCrossPlatform(shellCommands.serviceStop(p.service));
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  service_restart: createTool('service_restart', 'Restart service', { service: 'string' },
    async (p: { service: string }) => {
      try {
        if (isWindows) {
          await execCrossPlatform(`Restart-Service -Name "${p.service}"`);
        } else {
          await execAsync(`sudo systemctl restart ${p.service}`);
        }
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_ps: createTool('docker_ps', 'List Docker containers', { all: 'boolean?' },
    async (p: { all?: boolean }) => {
      try {
        const { stdout } = await execCrossPlatform(`docker ps ${p.all ? '-a' : ''}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_images: createTool('docker_images', 'List Docker images', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform('docker images');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_run: createTool('docker_run', 'Run Docker container', { image: 'string', name: 'string?', ports: 'array?', env: 'object?' },
    async (p: { image: string; name?: string; ports?: string[]; env?: Record<string, string> }) => {
      try {
        const nameFlag = p.name ? `--name ${p.name}` : '';
        const portFlags = (p.ports || []).map(port => `-p ${port}`).join(' ');
        const envFlags = Object.entries(p.env || {}).map(([k, v]) => `-e ${k}=${v}`).join(' ');
        const { stdout } = await execCrossPlatform(`docker run -d ${nameFlag} ${portFlags} ${envFlags} ${p.image}`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_stop: createTool('docker_stop', 'Stop Docker container', { container: 'string' },
    async (p: { container: string }) => {
      try {
        await execCrossPlatform(`docker stop ${p.container}`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_rm: createTool('docker_rm', 'Remove Docker container', { container: 'string' },
    async (p: { container: string }) => {
      try {
        await execCrossPlatform(`docker rm ${p.container}`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_exec: createTool('docker_exec', 'Execute command in Docker container', { container: 'string', command: 'string' },
    async (p: { container: string; command: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`docker exec ${p.container} ${p.command}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_logs: createTool('docker_logs', 'Get Docker container logs', { container: 'string', tail: 'number?' },
    async (p: { container: string; tail?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(`docker logs --tail ${p.tail || 100} ${p.container}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  which: createTool('which', 'Find command location', { command: 'string' },
    async (p: { command: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.which(p.command));
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  uptime: createTool('uptime', 'Get system uptime', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.uptime());
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  disk_usage: createTool('disk_usage', 'Get disk usage', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.diskUsage(p.path || (isWindows ? '' : '/')));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  memory_usage: createTool('memory_usage', 'Get memory usage', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.memoryUsage());
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cpu_info: createTool('cpu_info', 'Get CPU information', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.cpuInfo());
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  hostname: createTool('hostname', 'Get system hostname', {},
    async () => {
      return { success: true, data: os.hostname() };
    }),

  whoami: createTool('whoami', 'Get current user', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform(shellCommands.whoami());
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  os_info: createTool('os_info', 'Get operating system information', {},
    async () => {
      return {
        success: true,
        data: {
          platform: process.platform,
          arch: process.arch,
          type: os.type(),
          release: os.release(),
          version: os.version ? os.version() : 'N/A',
          hostname: os.hostname(),
          homedir: os.homedir(),
          tmpdir: os.tmpdir(),
          cpus: os.cpus().length,
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          isWindows,
          shell: isWindows ? 'powershell' : 'bash'
        }
      };
    }),

  security_generate_password: createTool('security_generate_password', 'Generate secure random password', { length: 'number?', includeSpecial: 'boolean?' },
    async (p: { length?: number; includeSpecial?: boolean }) => {
      const length = p.length || 16;
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (p.includeSpecial ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '');
      let password = '';
      for (let i = 0; i < length; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
      return { success: true, data: password };
    }),

  security_generate_keypair: createTool('security_generate_keypair', 'Generate RSA key pair', { bits: 'number?' },
    async (p: { bits?: number }) => {
      try {
        const { stdout } = await execCrossPlatform(`ssh-keygen -t rsa -b ${p.bits || 2048} -f /tmp/id_rsa -N "" && cat /tmp/id_rsa && echo "---SEPARATOR---" && cat /tmp/id_rsa.pub`);
        const [privateKey, publicKey] = stdout.split('---SEPARATOR---');
        return { success: true, data: { privateKey: privateKey.trim(), publicKey: publicKey.trim() } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_encrypt: createTool('security_encrypt', 'Encrypt data using AES-256-CBC with PBKDF2', { data: 'string', key: 'string', salt: 'string?' },
    async (p: { data: string; key: string; salt?: string }) => {
      try {
        const salt = p.salt ? Buffer.from(p.salt, 'hex') : crypto.randomBytes(16);
        const derivedKey = crypto.pbkdf2Sync(p.key, salt, 100000, 32, 'sha256');
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', derivedKey, iv);
        let encrypted = cipher.update(p.data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return {
          success: true,
          data: {
            encrypted,
            iv: iv.toString('hex'),
            salt: salt.toString('hex')
          }
        };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_decrypt: createTool('security_decrypt', 'Decrypt data using AES-256-CBC with PBKDF2', { encrypted: 'string', iv: 'string', key: 'string', salt: 'string' },
    async (p: { encrypted: string; iv: string; key: string; salt: string }) => {
      try {
        const salt = Buffer.from(p.salt, 'hex');
        const iv = Buffer.from(p.iv, 'hex');
        const derivedKey = crypto.pbkdf2Sync(p.key, salt, 100000, 32, 'sha256');
        const decipher = crypto.createDecipheriv('aes-256-cbc', derivedKey, iv);
        let decrypted = decipher.update(p.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return { success: true, data: decrypted };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_jwt_create: createTool('security_jwt_create', 'Create signed JWT token', { payload: 'object', secret: 'string' },
    async (p: { payload: any; secret: string }) => {
      try {
        const header = { alg: 'HS256', typ: 'JWT' };
        const b64 = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');
        const unsigned = b64(header) + '.' + b64(p.payload);
        const signature = crypto.createHmac('sha256', p.secret).update(unsigned).digest('base64url');
        return { success: true, data: unsigned + '.' + signature };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_jwt_verify: createTool('security_jwt_verify', 'Verify JWT token', { token: 'string', secret: 'string' },
    async (p: { token: string; secret: string }) => {
      try {
        const [h, pl, s] = p.token.split('.');
        const signature = crypto.createHmac('sha256', p.secret).update(h + '.' + pl).digest('base64url');
        if (signature !== s) return { success: false, error: 'Invalid signature' };
        const payload = JSON.parse(Buffer.from(pl, 'base64url').toString());
        return { success: true, data: payload };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_scan_vulnerabilities: createTool('security_scan_vulnerabilities', 'Scan for known vulnerabilities in a project', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm audit --json', { cwd: p.path });
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_check_secrets: createTool('security_check_secrets', 'Check for exposed secrets in a directory', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const cmd = isWindows
          ? `Get-ChildItem -Path "${p.path}" -Recurse | Select-String -Pattern "sk-[a-zA-Z0-9]{32}|AIza[a-zA-Z0-9_-]{35}"`
          : `grep -rE "sk-[a-zA-Z0-9]{32}|AIza[a-zA-Z0-9_-]{35}" "${p.path}"`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_firewall_status: createTool('security_firewall_status', 'Check system firewall status', {},
    async () => {
      try {
        const cmd = isWindows ? 'netsh advfirewall show allprofiles' : 'ufw status || iptables -L';
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_log_analysis: createTool('security_log_analysis', 'Analyze system logs for security events', { logPath: 'string?', lines: 'number?' },
    async (p: { logPath?: string; lines?: number }) => {
      try {
        const path = p.logPath || (isWindows ? 'C:\\Windows\\System32\\winevt\\Logs\\Security.evtx' : '/var/log/auth.log');
        const count = p.lines || 100;
        const cmd = isWindows ? `Get-WinEvent -LogName Security -MaxEvents ${count}` : `tail -n ${count} ${path}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_sign: createTool('security_sign', 'Sign data using a private key', { data: 'string', privateKey: 'string' },
    async (p: { data: string; privateKey: string }) => {
      try {
        const sign = crypto.createSign('SHA256');
        sign.update(p.data);
        const signature = sign.sign(p.privateKey, 'hex');
        return { success: true, data: signature };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  sqlite_query: createTool('sqlite_query', 'Execute SQLite query', { database: 'string', query: 'string' },
    async (p: { database: string; query: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`sqlite3 ${p.database} "${p.query}" -json`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_get: createTool('redis_get', 'Get Redis key value', { key: 'string', host: 'string?' },
    async (p: { key: string; host?: string }) => {
      try {
        const host = p.host || 'localhost';
        const { stdout } = await execCrossPlatform(`redis-cli -h ${host} GET ${p.key}`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_keys: createTool('redis_keys', 'List Redis keys', { pattern: 'string?', host: 'string?' },
    async (p: { pattern?: string; host?: string }) => {
      try {
        const host = p.host || 'localhost';
        const { stdout } = await execCrossPlatform(`redis-cli -h ${host} KEYS "${p.pattern || '*'}"`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  postgres_query: createTool('postgres_query', 'Execute PostgreSQL query', { query: 'string', database: 'string?', host: 'string?' },
    async (p: { query: string; database?: string; host?: string }) => {
      try {
        const db = p.database || 'postgres';
        const host = p.host || 'localhost';
        const { stdout } = await execCrossPlatform(`psql -h ${host} -d ${db} -c "${p.query}" -t --no-align`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  postgres_tables: createTool('postgres_tables', 'List PostgreSQL tables', { database: 'string?', host: 'string?' },
    async (p: { database?: string; host?: string }) => {
      try {
        const db = p.database || 'postgres';
        const host = p.host || 'localhost';
        const { stdout } = await execCrossPlatform(`psql -h ${host} -d ${db} -c "\\dt" -t --no-align`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mongo_query: createTool('mongo_query', 'Execute MongoDB query', { database: 'string', collection: 'string', query: 'string', host: 'string?' },
    async (p: { database: string; collection: string; query: string; host?: string }) => {
      try {
        const host = p.host || 'localhost';
        const { stdout } = await execCrossPlatform(`mongosh --host ${host} ${p.database} --eval 'db.${p.collection}.find(${p.query})' --quiet`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  elastic_search: createTool('elastic_search', 'Search Elasticsearch index', { index: 'string', query: 'string', host: 'string?' },
    async (p: { index: string; query: string; host?: string }) => {
      try {
        const host = p.host || 'localhost:9200';
        const { stdout } = await execCrossPlatform(`curl -s -X GET "${host}/${p.index}/_search" -H 'Content-Type: application/json' -d '${p.query}'`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  regex_match: createTool('regex_match', 'Find regex matches in text', { text: 'string', pattern: 'string' },
    async (p: { text: string; pattern: string }) => {
      try {
        const regex = new RegExp(p.pattern, 'g');
        const matches = p.text.match(regex);
        return { success: true, data: matches || [] };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  json_parse: createTool('json_parse', 'Parse JSON string', { json: 'string' },
    async (p: { json: string }) => {
      try {
        return { success: true, data: JSON.parse(p.json) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  json_stringify: createTool('json_stringify', 'Stringify JSON object', { value: 'any', pretty: 'boolean?' },
    async (p: { value: any; pretty?: boolean }) => {
      try {
        return { success: true, data: JSON.stringify(p.value, null, p.pretty ? 2 : 0) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  json_path: createTool('json_path', 'Query JSON using simple path', { json: 'any', path: 'string' },
    async (p: { json: any; path: string }) => {
      try {
        const parts = p.path.split('.');
        let current = p.json;
        for (const part of parts) {
          if (current === undefined || current === null) break;
          current = current[part];
        }
        return { success: true, data: current };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cron_add: createTool('cron_add', 'Add a cron job (Unix only)', { schedule: 'string', command: 'string' },
    async (p: { schedule: string; command: string }) => {
      if (isWindows) return { success: false, error: 'cron is not available on Windows. Use task_schedule instead.' };
      try {
        await execAsync(`(crontab -l 2>/dev/null; echo "${p.schedule} ${p.command}") | crontab -`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cron_list: createTool('cron_list', 'List cron jobs (Unix only)', {},
    async () => {
      if (isWindows) return { success: false, error: 'cron is not available on Windows.' };
      try {
        const { stdout } = await execAsync('crontab -l');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash_list: createTool('git_stash_list', 'List stashed changes', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git stash list', { cwd: p.path });
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ip_lookup: createTool('ip_lookup', 'Get geolocation info for an IP address', { ip: 'string' },
    async (p: { ip: string }) => {
      return new Promise((resolve) => {
        https.get(`https://ipapi.co/${p.ip}/json/`, (res: any) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ success: true, data: JSON.parse(data) }));
        }).on('error', (e: any) => resolve({ success: false, error: e.message }));
      });
    }),

  dns_reverse: createTool('dns_reverse', 'Perform reverse DNS lookup', { ip: 'string' },
    async (p: { ip: string }) => {
      const dns = require('dns');
      return new Promise((resolve) => {
        dns.reverse(p.ip, (err: any, hostnames: string[]) => {
          if (err) resolve({ success: false, error: err.message });
          else resolve({ success: true, data: hostnames });
        });
      });
    }),

  ssl_check: createTool('ssl_check', 'Check SSL certificate info', { domain: 'string' },
    async (p: { domain: string }) => {
      const tls = require('tls');
      return new Promise((resolve) => {
        try {
          const socket = tls.connect(443, p.domain, { servername: p.domain }, () => {
            const cert = socket.getPeerCertificate();
            resolve({ success: true, data: cert });
            socket.end();
          });
          socket.on('error', (e: any) => resolve({ success: false, error: e.message }));
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  ping: createTool('ping', 'Ping a host', { host: 'string', count: 'number?' },
    async (p: { host: string; count?: number }) => {
      try {
        const cmd = isWindows ? `ping -n ${p.count || 4} ${p.host}` : `ping -c ${p.count || 4} ${p.host}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_scan_ports: createTool('security_scan_ports', 'Scan ports on a host', { host: 'string', ports: 'string?' },
    async (p: { host: string; ports?: string }) => {
      try {
        const ports = p.ports || '22,80,443,3389,8080';
        const results: string[] = [];
        for (const port of ports.split(',')) {
          const cmd = isWindows
            ? `powershell -Command "(Test-NetConnection -ComputerName ${p.host} -Port ${port.trim()}).TcpTestSucceeded"`
            : `nc -zv ${p.host} ${port.trim()} 2>&1 || echo "closed"`;
          const { stdout } = await execCrossPlatform(cmd);
          if (stdout.includes('True') || stdout.includes('succeeded') || stdout.includes('open')) {
            results.push(`Port ${port}: OPEN`);
          } else {
            results.push(`Port ${port}: CLOSED`);
          }
        }
        return { success: true, data: results };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// WEB & HTTP TOOLS (50 tools)
// ============================================
export const webTools: Record<string, any> = {
  http_get: createTool('http_get', 'HTTP GET request', { url: 'string', headers: 'object?', timeout: 'number?' },
    async (p: { url: string; headers?: Record<string, string>; timeout?: number }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: p.headers || {}
          };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ success: true, data, metadata: { statusCode: res.statusCode, headers: res.headers } }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.setTimeout(p.timeout || 30000, () => req.destroy());
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  http_post: createTool('http_post', 'HTTP POST request', { url: 'string', body: 'any', headers: 'object?' },
    async (p: { url: string; body: any; headers?: Record<string, string> }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const bodyData = typeof p.body === 'string' ? p.body : JSON.stringify(p.body);
          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData), ...p.headers }
          };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ success: true, data, metadata: { statusCode: res.statusCode } }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.write(bodyData);
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  http_put: createTool('http_put', 'HTTP PUT request', { url: 'string', body: 'any', headers: 'object?' },
    async (p: { url: string; body: any; headers?: Record<string, string> }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const bodyData = typeof p.body === 'string' ? p.body : JSON.stringify(p.body);
          const options = {
            hostname: urlObj.hostname, port: urlObj.port || 443, path: urlObj.pathname, method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData), ...p.headers }
          };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ success: true, data, metadata: { statusCode: res.statusCode } }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.write(bodyData); req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  http_delete: createTool('http_delete', 'HTTP DELETE request', { url: 'string', headers: 'object?' },
    async (p: { url: string; headers?: Record<string, string> }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const options = { hostname: urlObj.hostname, port: 443, path: urlObj.pathname, method: 'DELETE', headers: p.headers || {} };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ success: true, data, metadata: { statusCode: res.statusCode } }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  http_head: createTool('http_head', 'HTTP HEAD request', { url: 'string' },
    async (p: { url: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const options = { hostname: urlObj.hostname, port: 443, path: urlObj.pathname, method: 'HEAD' };
          const req = lib.request(options, (res) => {
            resolve({ success: true, data: res.headers, metadata: { statusCode: res.statusCode } });
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  http_patch: createTool('http_patch', 'HTTP PATCH request', { url: 'string', body: 'any', headers: 'object?' },
    async (p: { url: string; body: any; headers?: Record<string, string> }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const bodyData = typeof p.body === 'string' ? p.body : JSON.stringify(p.body);
          const options = { hostname: urlObj.hostname, port: 443, path: urlObj.pathname, method: 'PATCH',
            headers: { 'Content-Type': 'application/json', ...p.headers } };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ success: true, data, metadata: { statusCode: res.statusCode } }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.write(bodyData); req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  curl: createTool('curl', 'Execute curl-like request (cross-platform)', { url: 'string', method: 'string?', headers: 'object?', body: 'any?', timeout: 'number?' },
    async (p: { url: string; method?: string; headers?: Record<string, string>; body?: any; timeout?: number }) => {
      try {
        const urlObj = new URL(p.url);
        const lib = urlObj.protocol === 'https:' ? https : http;
        const bodyData = p.body ? (typeof p.body === 'string' ? p.body : JSON.stringify(p.body)) : '';
        
        return new Promise((resolve) => {
          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: p.method || 'GET',
            headers: p.headers || {}
          };
          
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ 
              success: true, 
              data, 
              metadata: { 
                statusCode: res.statusCode, 
                headers: res.headers 
              } 
            }));
          });
          
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.setTimeout(p.timeout || 30000, () => { req.destroy(); resolve({ success: false, error: 'Timeout' }); });
          
          if (bodyData) req.write(bodyData);
          req.end();
        });
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dns_lookup: createTool('dns_lookup', 'DNS lookup', { hostname: 'string' },
    async (p: { hostname: string }) => {
      const dns = require('dns');
      return new Promise((resolve) => {
        dns.lookup(p.hostname, (err: any, address: string, family: number) => {
          if (err) resolve({ success: false, error: err.message });
          else resolve({ success: true, data: { address, family } });
        });
      });
    }),

  dns_resolve: createTool('dns_resolve', 'Resolve DNS records', { hostname: 'string', recordType: 'string?' },
    async (p: { hostname: string; recordType?: string }) => {
      const dns = require('dns');
      const resolver = new dns.promises.Resolver();
      try {
        const rtype = p.recordType?.toUpperCase() || 'A';
        const records = await resolver.resolve(p.hostname, rtype);
        return { success: true, data: records };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  url_parse: createTool('url_parse', 'Parse URL into components', { url: 'string' },
    async (p: { url: string }) => {
      try {
        const urlObj = new URL(p.url);
        return {
          success: true,
          data: {
            href: urlObj.href,
            origin: urlObj.origin,
            protocol: urlObj.protocol,
            username: urlObj.username,
            password: urlObj.password,
            host: urlObj.host,
            hostname: urlObj.hostname,
            port: urlObj.port,
            pathname: urlObj.pathname,
            search: urlObj.search,
            searchParams: Object.fromEntries(urlObj.searchParams),
            hash: urlObj.hash
          }
        };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  url_build: createTool('url_build', 'Build URL from components', { components: 'object' },
    async (p: { components: { protocol?: string; hostname?: string; port?: string; pathname?: string; query?: Record<string, string>; hash?: string } }) => {
      try {
        const { protocol = 'https:', hostname = 'localhost', port, pathname = '/', query = {}, hash } = p.components;
        const url = new URL(`${protocol}//${hostname}${port ? `:${port}` : ''}${pathname}`);
        Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
        if (hash) url.hash = hash;
        return { success: true, data: url.href };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  webhook_test: createTool('webhook_test', 'Test webhook endpoint', { url: 'string', payload: 'any', method: 'string?' },
    async (p: { url: string; payload: any; method?: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const bodyData = typeof p.payload === 'string' ? p.payload : JSON.stringify(p.payload);
          const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: p.method || 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(bodyData) }
          };
          const startTime = Date.now();
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({
              success: true,
              data: { response: data, statusCode: res.statusCode, duration: Date.now() - startTime }
            }));
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.write(bodyData);
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  health_check: createTool('health_check', 'Check health of a URL', { url: 'string', timeout: 'number?' },
    async (p: { url: string; timeout?: number }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const startTime = Date.now();
          const options = { hostname: urlObj.hostname, port: urlObj.port || 443, path: urlObj.pathname, method: 'HEAD', timeout: p.timeout || 5000 };
          const req = lib.request(options, (res) => {
            resolve({
              success: true,
              data: {
                healthy: res.statusCode && res.statusCode < 400,
                statusCode: res.statusCode,
                responseTime: Date.now() - startTime,
                headers: res.headers
              }
            });
          });
          req.on('error', (e) => resolve({ success: false, data: { healthy: false, error: e.message }, error: e.message }));
          req.on('timeout', () => { req.destroy(); resolve({ success: false, data: { healthy: false, error: 'Timeout' }, error: 'Timeout' }); });
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  json_fetch: createTool('json_fetch', 'Fetch JSON from URL', { url: 'string', headers: 'object?' },
    async (p: { url: string; headers?: Record<string, string> }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const options = { hostname: urlObj.hostname, port: urlObj.port || 443, path: urlObj.pathname + urlObj.search, method: 'GET', headers: { 'Accept': 'application/json', ...p.headers } };
          const req = lib.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              try {
                const json = JSON.parse(data);
                resolve({ success: true, data: json, metadata: { statusCode: res.statusCode } });
              } catch (e: any) {
                resolve({ success: false, error: 'Invalid JSON response', data });
              }
            });
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  security_check_headers: createTool('security_check_headers', 'Check HTTP security headers', { url: 'string' },
    async (p: { url: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const req = lib.request({ hostname: urlObj.hostname, port: urlObj.port || 443, path: urlObj.pathname, method: 'HEAD' }, (res: any) => {
            const h = res.headers;
            const securityHeaders = {
              'Strict-Transport-Security': h['strict-transport-security'],
              'Content-Security-Policy': h['content-security-policy'],
              'X-Frame-Options': h['x-frame-options'],
              'X-XSS-Protection': h['x-xss-protection'],
              'X-Content-Type-Options': h['x-content-type-options'],
            };
            resolve({ success: true, data: securityHeaders });
          });
          req.on('error', (e: any) => resolve({ success: false, error: e.message }));
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  download_file: createTool('download_file', 'Download file from URL', { url: 'string', destination: 'string' },
    async (p: { url: string; destination: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const file = fs.createWriteStream(p.destination);
          lib.get(urlObj.href, (res) => {
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
              file.close();
              fs.unlinkSync(p.destination);
              resolve({ success: false, error: `Redirect to ${res.headers.location}` });
              return;
            }
            res.pipe(file);
            file.on('finish', () => {
              file.close();
              resolve({ success: true, metadata: { statusCode: res.statusCode } });
            });
          }).on('error', (e) => {
            file.close();
            fs.unlinkSync(p.destination);
            resolve({ success: false, error: e.message });
          });
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  // Additional web tools continue...
  jwt_decode: createTool('jwt_decode', 'Decode JWT token', { token: 'string' },
    async (p: { token: string }) => {
      try {
        const parts = p.token.split('.');
        if (parts.length !== 3) return { success: false, error: 'Invalid JWT format' };
        const decode = (str: string) => JSON.parse(Buffer.from(str, 'base64').toString());
        return { success: true, data: { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  base64_encode: createTool('base64_encode', 'Encode string to Base64', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: Buffer.from(p.data).toString('base64') };
    }),

  base64_decode: createTool('base64_decode', 'Decode Base64 string', { data: 'string' },
    async (p: { data: string }) => {
      try {
        return { success: true, data: Buffer.from(p.data, 'base64').toString() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  url_encode: createTool('url_encode', 'URL encode string', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: encodeURIComponent(p.data) };
    }),

  url_decode: createTool('url_decode', 'URL decode string', { data: 'string' },
    async (p: { data: string }) => {
      try {
        return { success: true, data: decodeURIComponent(p.data) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  html_escape: createTool('html_escape', 'Escape HTML special characters', { data: 'string' },
    async (p: { data: string }) => {
      const escaped = p.data
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
      return { success: true, data: escaped };
    }),

  html_unescape: createTool('html_unescape', 'Unescape HTML entities', { data: 'string' },
    async (p: { data: string }) => {
      const unescaped = p.data
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      return { success: true, data: unescaped };
    }),
};

// ============================================
// GIT TOOLS (30 tools)
// ============================================
export const gitTools: Record<string, any> = {
  git_status: createTool('git_status', 'Get git repository status', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git status', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_init: createTool('git_init', 'Initialize git repository', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git init', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_clone: createTool('git_clone', 'Clone git repository', { url: 'string', destination: 'string?' },
    async (p: { url: string; destination?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git clone ${p.url}${p.destination ? ` "${p.destination}"` : ''}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_add: createTool('git_add', 'Stage files for commit', { files: 'array', path: 'string?' },
    async (p: { files: string[]; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git add ${p.files.map(f => `"${f}"`).join(' ')}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_commit: createTool('git_commit', 'Create git commit', { message: 'string', path: 'string?' },
    async (p: { message: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git commit -m "${p.message}"`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_push: createTool('git_push', 'Push to remote', { branch: 'string?', path: 'string?' },
    async (p: { branch?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git push${p.branch ? ` origin ${p.branch}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_pull: createTool('git_pull', 'Pull from remote', { branch: 'string?', path: 'string?' },
    async (p: { branch?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git pull${p.branch ? ` origin ${p.branch}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_branch: createTool('git_branch', 'List or create branches', { name: 'string?', path: 'string?' },
    async (p: { name?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git branch${p.name ? ` ${p.name}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_checkout: createTool('git_checkout', 'Switch branches', { branch: 'string', path: 'string?' },
    async (p: { branch: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git checkout ${p.branch}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_merge: createTool('git_merge', 'Merge branch', { branch: 'string', path: 'string?' },
    async (p: { branch: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git merge ${p.branch}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_rebase: createTool('git_rebase', 'Rebase current branch', { branch: 'string', path: 'string?' },
    async (p: { branch: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git rebase ${p.branch}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash: createTool('git_stash', 'Stash changes', { message: 'string?', path: 'string?' },
    async (p: { message?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git stash${p.message ? ` -m "${p.message}"` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash_pop: createTool('git_stash_pop', 'Apply stashed changes', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git stash pop', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_log: createTool('git_log', 'View commit history', { count: 'number?', path: 'string?' },
    async (p: { count?: number; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git log --oneline -n ${p.count || 10}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_diff: createTool('git_diff', 'Show changes', { path: 'string?', staged: 'boolean?' },
    async (p: { path?: string; staged?: boolean }) => {
      try {
        const { stdout } = await execCrossPlatform(`git diff${p.staged ? ' --staged' : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_remote: createTool('git_remote', 'Manage remotes', { action: 'string', name: 'string?', url: 'string?', path: 'string?' },
    async (p: { action: string; name?: string; url?: string; path?: string }) => {
      try {
        let cmd = 'git remote';
        if (p.action === 'add' && p.name && p.url) cmd += ` add ${p.name} ${p.url}`;
        else if (p.action === 'remove' && p.name) cmd += ` remove ${p.name}`;
        else if (p.action === 'list') cmd += ' -v';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_tag: createTool('git_tag', 'Create or list tags', { name: 'string?', message: 'string?', path: 'string?' },
    async (p: { name?: string; message?: string; path?: string }) => {
      try {
        let cmd = 'git tag';
        if (p.name && p.message) cmd += ` -a ${p.name} -m "${p.message}"`;
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_reset: createTool('git_reset', 'Reset to commit', { mode: 'string?', commit: 'string?', path: 'string?' },
    async (p: { mode?: string; commit?: string; path?: string }) => {
      try {
        const mode = p.mode || 'soft';
        const { stdout } = await execCrossPlatform(`git reset --${mode} ${p.commit || 'HEAD~1'}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_fetch: createTool('git_fetch', 'Fetch from remote', { remote: 'string?', path: 'string?' },
    async (p: { remote?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git fetch${p.remote ? ` ${p.remote}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_show: createTool('git_show', 'Show commit details', { commit: 'string?', path: 'string?' },
    async (p: { commit?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git show ${p.commit || 'HEAD'}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_blame: createTool('git_blame', 'Show file blame', { file: 'string', path: 'string?' },
    async (p: { file: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git blame "${p.file}"`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_clean: createTool('git_clean', 'Remove untracked files', { force: 'boolean?', path: 'string?' },
    async (p: { force?: boolean; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git clean${p.force ? ' -fd' : ' -n'}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_config: createTool('git_config', 'Get or set git config', { key: 'string?', value: 'string?', global: 'boolean?' },
    async (p: { key?: string; value?: string; global?: boolean }) => {
      try {
        let cmd = 'git config';
        if (p.global) cmd += ' --global';
        if (p.key && p.value) cmd += ` ${p.key} "${p.value}"`;
        else if (p.key) cmd += ` --get ${p.key}`;
        const { stdout } = await execCrossPlatform(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_cherry_pick: createTool('git_cherry_pick', 'Cherry-pick commit', { commit: 'string', path: 'string?' },
    async (p: { commit: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git cherry-pick ${p.commit}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_revert: createTool('git_revert', 'Revert commit', { commit: 'string', path: 'string?' },
    async (p: { commit: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git revert ${p.commit}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_ls_files: createTool('git_ls_files', 'List tracked files', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git ls-files', { cwd: p.path });
        return { success: true, data: stdout.trim().split('\n') };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_archive: createTool('git_archive', 'Create archive from repository', { output: 'string', format: 'string?', path: 'string?' },
    async (p: { output: string; format?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git archive --format=${p.format || 'zip'} --output="${p.output}" HEAD`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_submodule: createTool('git_submodule', 'Manage submodules', { action: 'string', url: 'string?', path: 'string?' },
    async (p: { action: string; url?: string; path?: string }) => {
      try {
        let cmd = 'git submodule';
        if (p.action === 'add' && p.url) cmd += ` add ${p.url}`;
        else if (p.action === 'update') cmd += ' update --init --recursive';
        else if (p.action === 'list') cmd += ' status';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_describe: createTool('git_describe', 'Describe current commit', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('git describe --tags --always', { cwd: p.path });
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_rev_parse: createTool('git_rev_parse', 'Parse revision', { arg: 'string?', path: 'string?' },
    async (p: { arg?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`git rev-parse ${p.arg || 'HEAD'}`, { cwd: p.path });
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// NPM TOOLS (30 tools)
// ============================================
export const npmTools: Record<string, any> = {
  npm_init: createTool('npm_init', 'Initialize npm project', { name: 'string?', path: 'string?' },
    async (p: { name?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm init -y${p.name ? ` --name ${p.name}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_install: createTool('npm_install', 'Install npm packages', { packages: 'array?', dev: 'boolean?', global: 'boolean?', path: 'string?' },
    async (p: { packages?: string[]; dev?: boolean; global?: boolean; path?: string }) => {
      try {
        let cmd = 'npm install';
        if (p.global) cmd += ' -g';
        if (p.dev) cmd += ' --save-dev';
        if (p.packages?.length) cmd += ' ' + p.packages.join(' ');
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_uninstall: createTool('npm_uninstall', 'Uninstall npm packages', { packages: 'array', global: 'boolean?', path: 'string?' },
    async (p: { packages: string[]; global?: boolean; path?: string }) => {
      try {
        let cmd = `npm uninstall ${p.packages.join(' ')}`;
        if (p.global) cmd += ' -g';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_run: createTool('npm_run', 'Run npm script', { script: 'string', args: 'array?', path: 'string?' },
    async (p: { script: string; args?: string[]; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm run ${p.script}${p.args?.length ? ' ' + p.args.join(' ') : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_test: createTool('npm_test', 'Run npm test', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm test', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_build: createTool('npm_build', 'Run npm build', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm run build', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_start: createTool('npm_start', 'Run npm start', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm start', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_list: createTool('npm_list', 'List installed packages', { global: 'boolean?', depth: 'number?', path: 'string?' },
    async (p: { global?: boolean; depth?: number; path?: string }) => {
      try {
        let cmd = 'npm list';
        if (p.global) cmd += ' -g';
        if (p.depth !== undefined) cmd += ` --depth=${p.depth}`;
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_outdated: createTool('npm_outdated', 'Check for outdated packages', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm outdated', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message, data: e.stdout }; }
    }),

  npm_update: createTool('npm_update', 'Update npm packages', { packages: 'array?', global: 'boolean?', path: 'string?' },
    async (p: { packages?: string[]; global?: boolean; path?: string }) => {
      try {
        let cmd = 'npm update';
        if (p.global) cmd += ' -g';
        if (p.packages?.length) cmd += ' ' + p.packages.join(' ');
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_cache_clean: createTool('npm_cache_clean', 'Clean npm cache', {},
    async () => {
      try {
        const { stdout } = await execCrossPlatform('npm cache clean --force');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_audit: createTool('npm_audit', 'Run npm audit', { fix: 'boolean?', path: 'string?' },
    async (p: { fix?: boolean; path?: string }) => {
      try {
        let cmd = 'npm audit';
        if (p.fix) cmd += ' fix';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_publish: createTool('npm_publish', 'Publish npm package', { path: 'string?', access: 'string?' },
    async (p: { path?: string; access?: string }) => {
      try {
        let cmd = 'npm publish';
        if (p.access) cmd += ` --access ${p.access}`;
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_version: createTool('npm_version', 'Bump package version', { version: 'string', path: 'string?' },
    async (p: { version: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm version ${p.version}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_deprecate: createTool('npm_deprecate', 'Deprecate npm package', { package: 'string', message: 'string' },
    async (p: { package: string; message: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm deprecate ${p.package} "${p.message}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_info: createTool('npm_info', 'Get package info', { package: 'string' },
    async (p: { package: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm info ${p.package} --json`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_search: createTool('npm_search', 'Search npm packages', { query: 'string' },
    async (p: { query: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm search ${p.query} --json`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_pack: createTool('npm_pack', 'Create tarball from package', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm pack', { cwd: p.path });
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_link: createTool('npm_link', 'Link npm package', { package: 'string?', path: 'string?' },
    async (p: { package?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm link${p.package ? ` ${p.package}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_unlink: createTool('npm_unlink', 'Unlink npm package', { package: 'string?', path: 'string?' },
    async (p: { package?: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm unlink${p.package ? ` ${p.package}` : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_ci: createTool('npm_ci', 'Clean install from lock file', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('npm ci', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_run_script: createTool('npm_run_script', 'Run custom npm script', { script: 'string', path: 'string?' },
    async (p: { script: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm run ${p.script}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npx_run: createTool('npx_run', 'Run npx command', { command: 'string', args: 'array?', path: 'string?' },
    async (p: { command: string; args?: string[]; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npx ${p.command}${p.args?.length ? ' ' + p.args.join(' ') : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_exec: createTool('npm_exec', 'Run npm exec', { command: 'string', args: 'array?', path: 'string?' },
    async (p: { command: string; args?: string[]; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`npm exec -- ${p.command}${p.args?.length ? ' ' + p.args.join(' ') : ''}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_install: createTool('yarn_install', 'Install with yarn', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('yarn install', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_add: createTool('yarn_add', 'Add package with yarn', { packages: 'array', dev: 'boolean?', path: 'string?' },
    async (p: { packages: string[]; dev?: boolean; path?: string }) => {
      try {
        let cmd = `yarn add ${p.packages.join(' ')}`;
        if (p.dev) cmd += ' --dev';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_run: createTool('yarn_run', 'Run yarn script', { script: 'string', path: 'string?' },
    async (p: { script: string; path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform(`yarn ${p.script}`, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pnpm_install: createTool('pnpm_install', 'Install with pnpm', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execCrossPlatform('pnpm install', { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pnpm_add: createTool('pnpm_add', 'Add package with pnpm', { packages: 'array', dev: 'boolean?', path: 'string?' },
    async (p: { packages: string[]; dev?: boolean; path?: string }) => {
      try {
        let cmd = `pnpm add ${p.packages.join(' ')}`;
        if (p.dev) cmd += ' --save-dev';
        const { stdout } = await execCrossPlatform(cmd, { cwd: p.path });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  package_json_read: createTool('package_json_read', 'Read package.json', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const pkgPath = p.path ? path.join(p.path, 'package.json') : 'package.json';
        const content = await readFileAsync(pkgPath, 'utf-8');
        return { success: true, data: JSON.parse(content) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// COMBINE ALL TOOLS
// ============================================
export const allTools: Record<string, any> = {
  ...fileSystemTools,
  ...shellTools,
  ...webTools,
  ...gitTools,
  ...npmTools,
};

// Export helper functions
export { isWindows, getTempDir, getHomeDir, execCrossPlatform };

// Execute tool by name
export async function executeTool(toolName: string, params: any): Promise<ToolResult> {
  const tool = allTools[toolName];
  if (!tool) {
    return { success: false, error: `Tool '${toolName}' not found` };
  }
  try {
    return await tool.execute(params);
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export default allTools;
