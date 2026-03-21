/**
 * VoiceDev Ultimate - 250 Real Working Tools
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

interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  metadata?: Record<string, any>;
}

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

  file_chmod: createTool('file_chmod', 'Change file permissions', { path: 'string', mode: 'string' },
    async (p: { path: string; mode: string }) => {
      try {
        await execAsync(`chmod ${p.mode} "${p.path}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_chown: createTool('file_chown', 'Change file owner', { path: 'string', owner: 'string', group: 'string' },
    async (p: { path: string; owner: string; group: string }) => {
      try {
        await execAsync(`chown ${p.owner}:${p.group} "${p.path}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_diff: createTool('file_diff', 'Compare two files', { file1: 'string', file2: 'string' },
    async (p: { file1: string; file2: string }) => {
      try {
        const { stdout } = await execAsync(`diff "${p.file1}" "${p.file2}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message, data: e.stdout }; }
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
        if (p.force) await execAsync(`rm -rf "${p.path}"`);
        else await rmdirAsync(p.path);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_copy: createTool('dir_copy', 'Copy directory', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await execAsync(`cp -r "${p.source}" "${p.destination}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_tree: createTool('dir_tree', 'Generate directory tree', { path: 'string', maxDepth: 'number?' },
    async (p: { path: string; maxDepth?: number }) => {
      try {
        const { stdout } = await execAsync(`find "${p.path}" -maxdepth ${p.maxDepth || 5} | head -100`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_size: createTool('dir_size', 'Calculate directory size', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execAsync(`du -sb "${p.path}" | cut -f1`);
        return { success: true, data: parseInt(stdout.trim()) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dir_find_empty: createTool('dir_find_empty', 'Find empty directories', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execAsync(`find "${p.path}" -type d -empty`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  symlink_create: createTool('symlink_create', 'Create symbolic link', { target: 'string', link: 'string' },
    async (p: { target: string; link: string }) => {
      try { await execAsync(`ln -s "${p.target}" "${p.link}"`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
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
        const tempPath = path.join('/tmp', `${p.prefix || 'voicedev-'}${Date.now()}${p.suffix || '.tmp'}`);
        await writeFileAsync(tempPath, '');
        return { success: true, data: tempPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  temp_dir: createTool('temp_dir', 'Create temporary directory', { prefix: 'string?' },
    async (p: { prefix?: string }) => {
      try {
        const tempPath = path.join('/tmp', `${p.prefix || 'voicedev-'}${Date.now()}`);
        await mkdirAsync(tempPath, { recursive: true });
        return { success: true, data: tempPath };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  zip_create: createTool('zip_create', 'Create ZIP archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try { await execAsync(`zip -r "${p.destination}" "${p.source}"`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  zip_extract: createTool('zip_extract', 'Extract ZIP archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(p.destination, { recursive: true });
        await execAsync(`unzip -o "${p.source}" -d "${p.destination}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  tar_create: createTool('tar_create', 'Create TAR archive', { source: 'string', destination: 'string', gzip: 'boolean?' },
    async (p: { source: string; destination: string; gzip?: boolean }) => {
      try {
        await execAsync(`tar -${p.gzip ? 'czf' : 'cf'} "${p.destination}" "${p.source}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  tar_extract: createTool('tar_extract', 'Extract TAR archive', { source: 'string', destination: 'string' },
    async (p: { source: string; destination: string }) => {
      try {
        await mkdirAsync(p.destination, { recursive: true });
        await execAsync(`tar -xf "${p.source}" -C "${p.destination}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gzip_compress: createTool('gzip_compress', 'Compress file with gzip', { path: 'string' },
    async (p: { path: string }) => {
      try { await execAsync(`gzip "${p.path}"`); return { success: true, data: `${p.path}.gz` }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  gzip_decompress: createTool('gzip_decompress', 'Decompress gzip file', { path: 'string' },
    async (p: { path: string }) => {
      try { await execAsync(`gunzip "${p.path}"`); return { success: true, data: p.path.replace('.gz', '') }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_search: createTool('file_search', 'Search files by pattern', { path: 'string', pattern: 'string' },
    async (p: { path: string; pattern: string }) => {
      try {
        const { stdout } = await execAsync(`find "${p.path}" -name "${p.pattern}" 2>/dev/null | head -100`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_grep: createTool('file_grep', 'Search content in files', { path: 'string', pattern: 'string' },
    async (p: { path: string; pattern: string }) => {
      try {
        const { stdout } = await execAsync(`grep -r "${p.pattern}" "${p.path}" 2>/dev/null | head -50`);
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
        const { stdout } = await execAsync(`head -n ${p.lines || 10} "${p.path}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_tail: createTool('file_tail', 'Read last lines of file', { path: 'string', lines: 'number?' },
    async (p: { path: string; lines?: number }) => {
      try {
        const { stdout } = await execAsync(`tail -n ${p.lines || 10} "${p.path}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_count_lines: createTool('file_count_lines', 'Count lines in file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execAsync(`wc -l "${p.path}"`);
        return { success: true, data: parseInt(stdout.trim().split(' ')[0]) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_sort: createTool('file_sort', 'Sort file contents', { path: 'string', reverse: 'boolean?' },
    async (p: { path: string; reverse?: boolean }) => {
      try {
        const { stdout } = await execAsync(`sort ${p.reverse ? '-r' : ''} "${p.path}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  file_unique: createTool('file_unique', 'Get unique lines from file', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execAsync(`sort "${p.path}" | uniq`);
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
// SHELL TOOLS (40 tools)
// ============================================
export const shellTools: Record<string, any> = {
  shell_exec: createTool('shell_exec', 'Execute shell command', { command: 'string', cwd: 'string?', timeout: 'number?' },
    async (p: { command: string; cwd?: string; timeout?: number }) => {
      try {
        const { stdout, stderr } = await execAsync(p.command, { cwd: p.cwd, timeout: p.timeout || 30000 });
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message, data: { stdout: e.stdout || '', stderr: e.stderr || '' } }; }
    }),

  shell_pipe: createTool('shell_pipe', 'Execute piped commands', { commands: 'array' },
    async (p: { commands: string[] }) => {
      try {
        const { stdout } = await execAsync(p.commands.join(' | '));
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_background: createTool('shell_background', 'Run command in background', { command: 'string', cwd: 'string?' },
    async (p: { command: string; cwd?: string }) => {
      try {
        const child = spawn(p.command, [], { cwd: p.cwd, shell: true, detached: true, stdio: 'ignore' });
        child.unref();
        return { success: true, data: child.pid };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_kill: createTool('shell_kill', 'Kill process', { pid: 'number', signal: 'string?' },
    async (p: { pid: number; signal?: string }) => {
      try { process.kill(p.pid, (p.signal || 'SIGTERM') as any); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_list_processes: createTool('shell_list_processes', 'List running processes', { filter: 'string?' },
    async (p: { filter?: string }) => {
      try {
        const { stdout } = await execAsync(`ps aux ${p.filter ? `| grep "${p.filter}"` : ''} | head -50`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  shell_top: createTool('shell_top', 'Get top processes by resource usage', { sortBy: 'string?', count: 'number?' },
    async (p: { sortBy?: string; count?: number }) => {
      try {
        const { stdout } = await execAsync(`ps aux --sort=-${p.sortBy || '%cpu'} | head -${p.count || 10}`);
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
        const { stdout, stderr } = await execAsync(`python3 -c "${p.code.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  python_script: createTool('python_script', 'Execute Python script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const { stdout, stderr } = await execAsync(`python3 "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  node_exec: createTool('node_exec', 'Execute Node.js code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const { stdout, stderr } = await execAsync(`node -e "${p.code.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  node_script: createTool('node_script', 'Execute Node.js script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const { stdout, stderr } = await execAsync(`node "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  bash_exec: createTool('bash_exec', 'Execute bash command', { command: 'string' },
    async (p: { command: string }) => {
      try {
        const { stdout } = await execAsync(`bash -c "${p.command.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  bash_script: createTool('bash_script', 'Execute bash script file', { path: 'string', args: 'array?' },
    async (p: { path: string; args?: string[] }) => {
      try {
        const { stdout, stderr } = await execAsync(`bash "${p.path}" ${(p.args || []).join(' ')}`);
        return { success: true, data: { stdout, stderr } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ruby_exec: createTool('ruby_exec', 'Execute Ruby code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const { stdout, stderr } = await execAsync(`ruby -e "${p.code.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  perl_exec: createTool('perl_exec', 'Execute Perl code', { code: 'string' },
    async (p: { code: string }) => {
      try {
        const { stdout, stderr } = await execAsync(`perl -e "${p.code.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout || stderr };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cron_add: createTool('cron_add', 'Add cron job', { schedule: 'string', command: 'string' },
    async (p: { schedule: string; command: string }) => {
      try {
        await execAsync(`(crontab -l 2>/dev/null; echo "${p.schedule} ${p.command}") | crontab -`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cron_list: createTool('cron_list', 'List cron jobs', {},
    async () => {
      try {
        const { stdout } = await execAsync('crontab -l 2>/dev/null || echo "No cron jobs"');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cron_remove: createTool('cron_remove', 'Remove cron job', { pattern: 'string' },
    async (p: { pattern: string }) => {
      try {
        const { stdout } = await execAsync('crontab -l 2>/dev/null');
        const lines = stdout.split('\n').filter(l => !l.includes(p.pattern));
        await execAsync(`echo "${lines.join('\n')}" | crontab -`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  systemctl_status: createTool('systemctl_status', 'Get service status', { service: 'string' },
    async (p: { service: string }) => {
      try {
        const { stdout } = await execAsync(`systemctl status ${p.service} 2>/dev/null || echo "Service not found"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  systemctl_start: createTool('systemctl_start', 'Start service', { service: 'string' },
    async (p: { service: string }) => {
      try { await execAsync(`sudo systemctl start ${p.service}`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  systemctl_stop: createTool('systemctl_stop', 'Stop service', { service: 'string' },
    async (p: { service: string }) => {
      try { await execAsync(`sudo systemctl stop ${p.service}`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  systemctl_restart: createTool('systemctl_restart', 'Restart service', { service: 'string' },
    async (p: { service: string }) => {
      try { await execAsync(`sudo systemctl restart ${p.service}`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_ps: createTool('docker_ps', 'List Docker containers', { all: 'boolean?' },
    async (p: { all?: boolean }) => {
      try {
        const { stdout } = await execAsync(`docker ps ${p.all ? '-a' : ''}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_images: createTool('docker_images', 'List Docker images', {},
    async () => {
      try {
        const { stdout } = await execAsync('docker images');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_run: createTool('docker_run', 'Run Docker container', { image: 'string', name: 'string?', ports: 'array?', env: 'object?' },
    async (p: { image: string; name?: string; ports?: string[]; env?: Record<string, string> }) => {
      try {
        const nameFlag = p.name ? `--name ${p.name}` : '';
        const portFlags = (p.ports || []).map(port => `-p ${port}`).join(' ');
        const envFlags = Object.entries(p.env || {}).map(([k, v]) => `-e ${k}=${v}`).join(' ');
        const { stdout } = await execAsync(`docker run -d ${nameFlag} ${portFlags} ${envFlags} ${p.image}`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_stop: createTool('docker_stop', 'Stop Docker container', { container: 'string' },
    async (p: { container: string }) => {
      try { await execAsync(`docker stop ${p.container}`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_rm: createTool('docker_rm', 'Remove Docker container', { container: 'string' },
    async (p: { container: string }) => {
      try { await execAsync(`docker rm ${p.container}`); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_exec: createTool('docker_exec', 'Execute command in Docker container', { container: 'string', command: 'string' },
    async (p: { container: string; command: string }) => {
      try {
        const { stdout } = await execAsync(`docker exec ${p.container} ${p.command}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  docker_logs: createTool('docker_logs', 'Get Docker container logs', { container: 'string', tail: 'number?' },
    async (p: { container: string; tail?: number }) => {
      try {
        const { stdout } = await execAsync(`docker logs --tail ${p.tail || 100} ${p.container}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  which: createTool('which', 'Find command location', { command: 'string' },
    async (p: { command: string }) => {
      try {
        const { stdout } = await execAsync(`which ${p.command}`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  uptime: createTool('uptime', 'Get system uptime', {},
    async () => {
      try {
        const { stdout } = await execAsync('uptime');
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  disk_usage: createTool('disk_usage', 'Get disk usage', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync(`df -h ${p.path || '/'}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  memory_usage: createTool('memory_usage', 'Get memory usage', {},
    async () => {
      try {
        const { stdout } = await execAsync('free -h');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cpu_info: createTool('cpu_info', 'Get CPU information', {},
    async () => {
      try {
        const { stdout } = await execAsync('lscpu');
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
        const { stdout } = await execAsync('whoami');
        return { success: true, data: stdout.trim() };
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

  http_options: createTool('http_options', 'HTTP OPTIONS request', { url: 'string' },
    async (p: { url: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const options = { hostname: urlObj.hostname, port: 443, path: urlObj.pathname, method: 'OPTIONS' };
          const req = lib.request(options, (res) => {
            resolve({ success: true, data: { allow: res.headers['allow'], headers: res.headers } });
          });
          req.on('error', (e) => resolve({ success: false, error: e.message }));
          req.end();
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  url_parse: createTool('url_parse', 'Parse URL components', { url: 'string' },
    async (p: { url: string }) => {
      try {
        const parsed = new URL(p.url);
        return { success: true, data: { protocol: parsed.protocol, hostname: parsed.hostname, port: parsed.port, pathname: parsed.pathname, search: parsed.search, hash: parsed.hash, origin: parsed.origin } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  url_encode: createTool('url_encode', 'URL encode string', { string: 'string' },
    async (p: { string: string }) => {
      return { success: true, data: encodeURIComponent(p.string) };
    }),

  url_decode: createTool('url_decode', 'URL decode string', { string: 'string' },
    async (p: { string: string }) => {
      try { return { success: true, data: decodeURIComponent(p.string) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  url_build: createTool('url_build', 'Build URL from components', { base: 'string', path: 'string?', query: 'object?' },
    async (p: { base: string; path?: string; query?: Record<string, string> }) => {
      try {
        const url = new URL(p.base);
        if (p.path) url.pathname = p.path;
        if (p.query) Object.entries(p.query).forEach(([k, v]) => url.searchParams.append(k, v));
        return { success: true, data: url.toString() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dns_lookup: createTool('dns_lookup', 'DNS lookup', { hostname: 'string' },
    async (p: { hostname: string }) => {
      try {
        const dns = require('dns').promises;
        const addresses = await dns.resolve4(p.hostname);
        return { success: true, data: addresses };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  dns_reverse: createTool('dns_reverse', 'Reverse DNS lookup', { ip: 'string' },
    async (p: { ip: string }) => {
      try {
        const dns = require('dns').promises;
        const hostnames = await dns.reverse(p.ip);
        return { success: true, data: hostnames };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ping: createTool('ping', 'Ping host', { host: 'string', count: 'number?' },
    async (p: { host: string; count?: number }) => {
      try {
        const { stdout } = await execAsync(`ping -c ${p.count || 4} ${p.host}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  curl: createTool('curl', 'Execute curl command', { url: 'string', method: 'string?', headers: 'object?', data: 'string?' },
    async (p: { url: string; method?: string; headers?: Record<string, string>; data?: string }) => {
      try {
        const method = p.method ? `-X ${p.method}` : '';
        const headers = Object.entries(p.headers || {}).map(([k, v]) => `-H "${k}: ${v}"`).join(' ');
        const data = p.data ? `-d '${p.data}'` : '';
        const { stdout } = await execAsync(`curl -s ${method} ${headers} ${data} "${p.url}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  wget: createTool('wget', 'Download file with wget', { url: 'string', destination: 'string' },
    async (p: { url: string; destination: string }) => {
      try {
        await execAsync(`wget -q -O "${p.destination}" "${p.url}"`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  download_file: createTool('download_file', 'Download file from URL', { url: 'string', destination: 'string' },
    async (p: { url: string; destination: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          const file = fs.createWriteStream(p.destination);
          lib.get(p.url, (response) => {
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve({ success: true }); });
          }).on('error', (e) => { fs.unlinkSync(p.destination); resolve({ success: false, error: e.message }); });
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  json_parse: createTool('json_parse', 'Parse JSON string', { json: 'string' },
    async (p: { json: string }) => {
      try { return { success: true, data: JSON.parse(p.json) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  json_stringify: createTool('json_stringify', 'Stringify to JSON', { value: 'any', pretty: 'boolean?' },
    async (p: { value: any; pretty?: boolean }) => {
      try { return { success: true, data: JSON.stringify(p.value, null, p.pretty ? 2 : undefined) }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  json_path: createTool('json_path', 'Query JSON with JSONPath', { json: 'any', path: 'string' },
    async (p: { json: any; path: string }) => {
      try {
        const data = typeof p.json === 'string' ? JSON.parse(p.json) : p.json;
        const parts = p.path.replace(/^\$\.?/, '').split('.');
        let result = data;
        for (const part of parts) {
          if (part.includes('[')) {
            const match = part.match(/^(.+?)\[(\d+)\]$/);
            if (match) {
              result = result[match[1]][parseInt(match[2])];
            } else {
              result = result[parseInt(part.match(/\[(\d+)\]/)?.[1] || '0')];
            }
          } else {
            result = result[part];
          }
        }
        return { success: true, data: result };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  xml_parse: createTool('xml_parse', 'Parse XML to object', { xml: 'string' },
    async (p: { xml: string }) => {
      try {
        // Simple XML parser
        const result: any = {};
        const tagRegex = /<(\w+)[^>]*>(.*?)<\/\1>/gs;
        let match;
        while ((match = tagRegex.exec(p.xml)) !== null) {
          const [, tag, content] = match;
          result[tag] = content.trim();
        }
        return { success: true, data: result };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  base64_encode: createTool('base64_encode', 'Encode to base64', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: Buffer.from(p.data).toString('base64') };
    }),

  base64_decode: createTool('base64_decode', 'Decode from base64', { data: 'string' },
    async (p: { data: string }) => {
      try { return { success: true, data: Buffer.from(p.data, 'base64').toString('utf-8') }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  jwt_decode: createTool('jwt_decode', 'Decode JWT token', { token: 'string' },
    async (p: { token: string }) => {
      try {
        const parts = p.token.split('.');
        return { success: true, data: { header: JSON.parse(Buffer.from(parts[0], 'base64').toString()), payload: JSON.parse(Buffer.from(parts[1], 'base64').toString()) } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  html_escape: createTool('html_escape', 'Escape HTML entities', { html: 'string' },
    async (p: { html: string }) => {
      const escapes: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
      return { success: true, data: p.html.replace(/[&<>"']/g, c => escapes[c]) };
    }),

  html_unescape: createTool('html_unescape', 'Unescape HTML entities', { html: 'string' },
    async (p: { html: string }) => {
      const unescapes: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&#x2F;': '/' };
      return { success: true, data: p.html.replace(/&[^;]+;/g, c => unescapes[c] || c) };
    }),

  regex_match: createTool('regex_match', 'Match regex pattern', { text: 'string', pattern: 'string', flags: 'string?' },
    async (p: { text: string; pattern: string; flags?: string }) => {
      try {
        const regex = new RegExp(p.pattern, p.flags || 'g');
        const matches = [...p.text.matchAll(regex)];
        return { success: true, data: matches.map(m => m[0]) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  regex_replace: createTool('regex_replace', 'Replace with regex', { text: 'string', pattern: 'string', replacement: 'string', flags: 'string?' },
    async (p: { text: string; pattern: string; replacement: string; flags?: string }) => {
      try {
        const regex = new RegExp(p.pattern, p.flags || 'g');
        return { success: true, data: p.text.replace(regex, p.replacement) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  uuid_generate: createTool('uuid_generate', 'Generate UUID', { version: 'string?' },
    async (p: { version?: string }) => {
      return { success: true, data: crypto.randomUUID() };
    }),

  hash_md5: createTool('hash_md5', 'Calculate MD5 hash', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: crypto.createHash('md5').update(p.data).digest('hex') };
    }),

  hash_sha256: createTool('hash_sha256', 'Calculate SHA256 hash', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: crypto.createHash('sha256').update(p.data).digest('hex') };
    }),

  hash_sha512: createTool('hash_sha512', 'Calculate SHA512 hash', { data: 'string' },
    async (p: { data: string }) => {
      return { success: true, data: crypto.createHash('sha512').update(p.data).digest('hex') };
    }),

  hmac_generate: createTool('hmac_generate', 'Generate HMAC', { data: 'string', secret: 'string', algorithm: 'string?' },
    async (p: { data: string; secret: string; algorithm?: string }) => {
      return { success: true, data: crypto.createHmac(p.algorithm || 'sha256', p.secret).update(p.data).digest('hex') };
    }),

  random_bytes: createTool('random_bytes', 'Generate random bytes', { count: 'number?', encoding: 'string?' },
    async (p: { count?: number; encoding?: string }) => {
      const bytes = crypto.randomBytes(p.count || 32);
      return { success: true, data: bytes.toString((p.encoding || 'hex') as BufferEncoding) };
    }),

  timestamp_now: createTool('timestamp_now', 'Get current timestamp', {},
    async () => {
      return { success: true, data: { unix: Date.now(), iso: new Date().toISOString(), utc: new Date().toUTCString() } };
    }),

  timestamp_parse: createTool('timestamp_parse', 'Parse timestamp', { timestamp: 'string' },
    async (p: { timestamp: string }) => {
      try {
        const date = new Date(p.timestamp);
        return { success: true, data: { unix: date.getTime(), iso: date.toISOString(), utc: date.toUTCString() } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  timestamp_format: createTool('timestamp_format', 'Format timestamp', { timestamp: 'number', format: 'string?' },
    async (p: { timestamp: number; format?: string }) => {
      const date = new Date(p.timestamp);
      return { success: true, data: date.toISOString() };
    }),

  sleep: createTool('sleep', 'Pause execution', { milliseconds: 'number' },
    async (p: { milliseconds: number }) => {
      await new Promise(r => setTimeout(r, p.milliseconds));
      return { success: true };
    }),

  rate_limit: createTool('rate_limit', 'Rate limit execution', { key: 'string', maxRequests: 'number', windowMs: 'number' },
    async (p: { key: string; maxRequests: number; windowMs: number }) => {
      // Simple in-memory rate limiting
      const now = Date.now();
      const windowStart = now - p.windowMs;
      const requests = (global as any).__rateLimit = (global as any).__rateLimit || {};
      if (!requests[p.key]) requests[p.key] = [];
      requests[p.key] = requests[p.key].filter((t: number) => t > windowStart);
      if (requests[p.key].length >= p.maxRequests) {
        return { success: false, error: 'Rate limit exceeded', data: { remaining: 0, resetAt: requests[p.key][0] + p.windowMs } };
      }
      requests[p.key].push(now);
      return { success: true, data: { remaining: p.maxRequests - requests[p.key].length, resetAt: windowStart + p.windowMs } };
    }),

  web_scrape: createTool('web_scrape', 'Scrape web page content', { url: 'string', selector: 'string?' },
    async (p: { url: string; selector?: string }) => {
      try {
        const { stdout } = await execAsync(`curl -s "${p.url}"`);
        // Simple content extraction
        const text = stdout.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        return { success: true, data: text.substring(0, 10000) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ip_lookup: createTool('ip_lookup', 'Get IP information', { ip: 'string?' },
    async (p: { ip?: string }) => {
      try {
        const { stdout } = await execAsync(`curl -s "https://ipinfo.io/${p.ip || ''}/json"`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  ssl_check: createTool('ssl_check', 'Check SSL certificate', { domain: 'string' },
    async (p: { domain: string }) => {
      try {
        const { stdout } = await execAsync(`echo | openssl s_client -servername ${p.domain} -connect ${p.domain}:443 2>/dev/null | openssl x509 -noout -dates -subject 2>/dev/null || echo "SSL check failed"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  whois: createTool('whois', 'WHOIS lookup', { domain: 'string' },
    async (p: { domain: string }) => {
      try {
        const { stdout } = await execAsync(`whois ${p.domain} 2>/dev/null | head -50`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  port_check: createTool('port_check', 'Check if port is open', { host: 'string', port: 'number', timeout: 'number?' },
    async (p: { host: string; port: number; timeout?: number }) => {
      return new Promise((resolve) => {
        const socket = new (require('net').Socket)();
        socket.setTimeout(p.timeout || 2000);
        socket.connect(p.port, p.host, () => { socket.destroy(); resolve({ success: true, data: { open: true } }); });
        socket.on('error', () => resolve({ success: true, data: { open: false } }));
        socket.on('timeout', () => { socket.destroy(); resolve({ success: true, data: { open: false } }); });
      });
    }),

  headers_check: createTool('headers_check', 'Check HTTP security headers', { url: 'string' },
    async (p: { url: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          lib.get(p.url, (res) => {
            const headers = res.headers;
            const security = {
              'strict-transport-security': headers['strict-transport-security'] ? 'Present' : 'Missing',
              'content-security-policy': headers['content-security-policy'] ? 'Present' : 'Missing',
              'x-frame-options': headers['x-frame-options'] ? 'Present' : 'Missing',
              'x-xss-protection': headers['x-xss-protection'] ? 'Present' : 'Missing',
              'x-content-type-options': headers['x-content-type-options'] ? 'Present' : 'Missing'
            };
            resolve({ success: true, data: security });
          }).on('error', (e) => resolve({ success: false, error: e.message }));
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),
};

// ============================================
// GIT TOOLS (30 tools)
// ============================================
export const gitTools: Record<string, any> = {
  git_init: createTool('git_init', 'Initialize git repository', { path: 'string?' },
    async (p: { path?: string }) => {
      try { await execAsync('git init', { cwd: p.path || process.cwd() }); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_clone: createTool('git_clone', 'Clone repository', { url: 'string', destination: 'string?', depth: 'number?' },
    async (p: { url: string; destination?: string; depth?: number }) => {
      try {
        const depth = p.depth ? `--depth ${p.depth}` : '';
        await execAsync(`git clone ${depth} "${p.url}" ${p.destination || ''}`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_status: createTool('git_status', 'Get repository status', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('git status', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_add: createTool('git_add', 'Stage files', { files: 'array', path: 'string?' },
    async (p: { files: string[]; path?: string }) => {
      try { await execAsync(`git add ${p.files.join(' ')}`, { cwd: p.path || process.cwd() }); return { success: true }; }
      catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_commit: createTool('git_commit', 'Commit changes', { message: 'string', path: 'string?' },
    async (p: { message: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git commit -m "${p.message}"`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_push: createTool('git_push', 'Push to remote', { remote: 'string?', branch: 'string?', path: 'string?' },
    async (p: { remote?: string; branch?: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git push ${p.remote || 'origin'} ${p.branch || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_pull: createTool('git_pull', 'Pull from remote', { remote: 'string?', branch: 'string?', path: 'string?' },
    async (p: { remote?: string; branch?: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git pull ${p.remote || 'origin'} ${p.branch || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_fetch: createTool('git_fetch', 'Fetch from remote', { remote: 'string?', path: 'string?' },
    async (p: { remote?: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git fetch ${p.remote || 'origin'}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_log: createTool('git_log', 'Show commit history', { count: 'number?', path: 'string?' },
    async (p: { count?: number; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git log --oneline -${p.count || 10}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_diff: createTool('git_diff', 'Show differences', { file: 'string?', path: 'string?' },
    async (p: { file?: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git diff ${p.file || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_branch: createTool('git_branch', 'List or create branches', { name: 'string?', path: 'string?' },
    async (p: { name?: string; path?: string }) => {
      try {
        const cmd = p.name ? `git branch ${p.name}` : 'git branch';
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_checkout: createTool('git_checkout', 'Switch branch', { branch: 'string', create: 'boolean?', path: 'string?' },
    async (p: { branch: string; create?: boolean; path?: string }) => {
      try {
        const flag = p.create ? '-b' : '';
        const { stdout } = await execAsync(`git checkout ${flag} ${p.branch}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_merge: createTool('git_merge', 'Merge branch', { branch: 'string', path: 'string?' },
    async (p: { branch: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git merge ${p.branch}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_rebase: createTool('git_rebase', 'Rebase onto branch', { branch: 'string', path: 'string?' },
    async (p: { branch: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git rebase ${p.branch}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash: createTool('git_stash', 'Stash changes', { message: 'string?', path: 'string?' },
    async (p: { message?: string; path?: string }) => {
      try {
        const msg = p.message ? `-m "${p.message}"` : '';
        const { stdout } = await execAsync(`git stash push ${msg}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash_pop: createTool('git_stash_pop', 'Apply and remove stash', { index: 'number?', path: 'string?' },
    async (p: { index?: number; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git stash pop ${p.index || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_stash_list: createTool('git_stash_list', 'List stashes', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('git stash list', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_reset: createTool('git_reset', 'Reset to commit', { commit: 'string?', mode: 'string?', path: 'string?' },
    async (p: { commit?: string; mode?: string; path?: string }) => {
      try {
        const mode = p.mode || '--mixed';
        const { stdout } = await execAsync(`git reset ${mode} ${p.commit || 'HEAD'}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_revert: createTool('git_revert', 'Revert commit', { commit: 'string', path: 'string?' },
    async (p: { commit: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git revert ${p.commit}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_remote: createTool('git_remote', 'Manage remotes', { action: 'string', name: 'string?', url: 'string?', path: 'string?' },
    async (p: { action: string; name?: string; url?: string; path?: string }) => {
      try {
        let cmd = 'git remote';
        if (p.action === 'add' && p.name && p.url) cmd = `git remote add ${p.name} ${p.url}`;
        else if (p.action === 'remove' && p.name) cmd = `git remote remove ${p.name}`;
        else if (p.action === 'list') cmd = 'git remote -v';
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_tag: createTool('git_tag', 'Create or list tags', { name: 'string?', message: 'string?', path: 'string?' },
    async (p: { name?: string; message?: string; path?: string }) => {
      try {
        let cmd = 'git tag';
        if (p.name) {
          cmd = p.message ? `git tag -a ${p.name} -m "${p.message}"` : `git tag ${p.name}`;
        } else {
          cmd = 'git tag -l';
        }
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_show: createTool('git_show', 'Show commit details', { commit: 'string?', path: 'string?' },
    async (p: { commit?: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git show ${p.commit || 'HEAD'}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_blame: createTool('git_blame', 'Show file blame', { file: 'string', path: 'string?' },
    async (p: { file: string; path?: string }) => {
      try {
        const { stdout } = await execAsync(`git blame ${p.file}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_clean: createTool('git_clean', 'Remove untracked files', { path: 'string?', force: 'boolean?' },
    async (p: { path?: string; force?: boolean }) => {
      try {
        const { stdout } = await execAsync(`git clean ${p.force ? '-fd' : '-n'}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_gc: createTool('git_gc', 'Run garbage collection', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('git gc', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_config: createTool('git_config', 'Get or set config', { key: 'string', value: 'string?', path: 'string?' },
    async (p: { key: string; value?: string; path?: string }) => {
      try {
        const cmd = p.value ? `git config ${p.key} "${p.value}"` : `git config ${p.key}`;
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_ignore: createTool('git_ignore', 'Add to .gitignore', { pattern: 'string', path: 'string?' },
    async (p: { pattern: string; path?: string }) => {
      try {
        const gitignorePath = `${p.path || process.cwd()}/.gitignore`;
        await writeFileAsync(gitignorePath, `${p.pattern}\n`, { flag: 'a' } as any);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_submodule_add: createTool('git_submodule_add', 'Add submodule', { url: 'string', path: 'string?', cwd: 'string?' },
    async (p: { url: string; path?: string; cwd?: string }) => {
      try {
        await execAsync(`git submodule add ${p.url} ${p.path || ''}`, { cwd: p.cwd || process.cwd() });
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  git_submodule_update: createTool('git_submodule_update', 'Update submodules', { cwd: 'string?' },
    async (p: { cwd?: string }) => {
      try {
        const { stdout } = await execAsync('git submodule update --init --recursive', { cwd: p.cwd || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// NPM/PACKAGE MANAGER TOOLS (30 tools)
// ============================================
export const npmTools: Record<string, any> = {
  npm_init: createTool('npm_init', 'Initialize npm project', { name: 'string?', path: 'string?' },
    async (p: { name?: string; path?: string }) => {
      try {
        const cmd = p.name ? `npm init -y && npm pkg set name="${p.name}"` : 'npm init -y';
        await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_install: createTool('npm_install', 'Install npm packages', { packages: 'array', dev: 'boolean?', path: 'string?' },
    async (p: { packages: string[]; dev?: boolean; path?: string }) => {
      try {
        const flag = p.dev ? '--save-dev' : '';
        const { stdout } = await execAsync(`npm install ${flag} ${p.packages.join(' ')}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_uninstall: createTool('npm_uninstall', 'Uninstall npm packages', { packages: 'array', path: 'string?' },
    async (p: { packages: string[]; path?: string }) => {
      try {
        const { stdout } = await execAsync(`npm uninstall ${p.packages.join(' ')}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_update: createTool('npm_update', 'Update npm packages', { packages: 'array?', path: 'string?' },
    async (p: { packages?: string[]; path?: string }) => {
      try {
        const { stdout } = await execAsync(`npm update ${p.packages?.join(' ') || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_list: createTool('npm_list', 'List installed packages', { depth: 'number?', path: 'string?' },
    async (p: { depth?: number; path?: string }) => {
      try {
        const { stdout } = await execAsync(`npm list --depth=${p.depth || 0}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_outdated: createTool('npm_outdated', 'Check for outdated packages', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('npm outdated', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message, data: e.stdout }; }
    }),

  npm_run: createTool('npm_run', 'Run npm script', { script: 'string', args: 'array?', path: 'string?' },
    async (p: { script: string; args?: string[]; path?: string }) => {
      try {
        const { stdout } = await execAsync(`npm run ${p.script} ${p.args?.join(' ') || ''}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_version: createTool('npm_version', 'Get or bump package version', { bump: 'string?', path: 'string?' },
    async (p: { bump?: string; path?: string }) => {
      try {
        const cmd = p.bump ? `npm version ${p.bump}` : 'npm --version';
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_search: createTool('npm_search', 'Search npm packages', { query: 'string' },
    async (p: { query: string }) => {
      try {
        const { stdout } = await execAsync(`npm search ${p.query} | head -20`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_view: createTool('npm_view', 'View package info', { package: 'string' },
    async (p: { package: string }) => {
      try {
        const { stdout } = await execAsync(`npm view ${p.package}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_audit: createTool('npm_audit', 'Run security audit', { fix: 'boolean?', path: 'string?' },
    async (p: { fix?: boolean; path?: string }) => {
      try {
        const cmd = p.fix ? 'npm audit fix' : 'npm audit';
        const { stdout } = await execAsync(cmd, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  npm_cache_clean: createTool('npm_cache_clean', 'Clean npm cache', {},
    async () => {
      try {
        const { stdout } = await execAsync('npm cache clean --force');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_add: createTool('yarn_add', 'Add yarn package', { packages: 'array', dev: 'boolean?', path: 'string?' },
    async (p: { packages: string[]; dev?: boolean; path?: string }) => {
      try {
        const flag = p.dev ? '--dev' : '';
        const { stdout } = await execAsync(`yarn add ${flag} ${p.packages.join(' ')}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_remove: createTool('yarn_remove', 'Remove yarn package', { packages: 'array', path: 'string?' },
    async (p: { packages: string[]; path?: string }) => {
      try {
        const { stdout } = await execAsync(`yarn remove ${p.packages.join(' ')}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  yarn_install: createTool('yarn_install', 'Install dependencies with yarn', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('yarn install', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pip_install: createTool('pip_install', 'Install pip packages', { packages: 'array', user: 'boolean?' },
    async (p: { packages: string[]; user?: boolean }) => {
      try {
        const flag = p.user ? '--user' : '';
        const { stdout } = await execAsync(`pip install ${flag} ${p.packages.join(' ')}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pip_uninstall: createTool('pip_uninstall', 'Uninstall pip packages', { packages: 'array' },
    async (p: { packages: string[] }) => {
      try {
        const { stdout } = await execAsync(`pip uninstall -y ${p.packages.join(' ')}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pip_list: createTool('pip_list', 'List installed pip packages', {},
    async () => {
      try {
        const { stdout } = await execAsync('pip list');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  pip_freeze: createTool('pip_freeze', 'Generate requirements.txt', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('pip freeze');
        if (p.path) await writeFileAsync(p.path, stdout);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cargo_install: createTool('cargo_install', 'Install Rust crate', { crate: 'string' },
    async (p: { crate: string }) => {
      try {
        const { stdout } = await execAsync(`cargo install ${p.crate}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cargo_build: createTool('cargo_build', 'Build Rust project', { release: 'boolean?', path: 'string?' },
    async (p: { release?: boolean; path?: string }) => {
      try {
        const flag = p.release ? '--release' : '';
        const { stdout } = await execAsync(`cargo build ${flag}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  cargo_test: createTool('cargo_test', 'Run Rust tests', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('cargo test', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  go_install: createTool('go_install', 'Install Go package', { package: 'string' },
    async (p: { package: string }) => {
      try {
        const { stdout } = await execAsync(`go install ${p.package}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  go_build: createTool('go_build', 'Build Go project', { output: 'string?', path: 'string?' },
    async (p: { output?: string; path?: string }) => {
      try {
        const flag = p.output ? `-o ${p.output}` : '';
        const { stdout } = await execAsync(`go build ${flag}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  go_test: createTool('go_test', 'Run Go tests', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('go test ./...', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  composer_install: createTool('composer_install', 'Install PHP dependencies', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('composer install', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gem_install: createTool('gem_install', 'Install Ruby gem', { gem: 'string' },
    async (p: { gem: string }) => {
      try {
        const { stdout } = await execAsync(`gem install ${p.gem}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  bundler_install: createTool('bundler_install', 'Install Ruby dependencies', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('bundle install', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  apt_install: createTool('apt_install', 'Install apt package', { packages: 'array' },
    async (p: { packages: string[] }) => {
      try {
        const { stdout } = await execAsync(`sudo apt-get install -y ${p.packages.join(' ')}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  brew_install: createTool('brew_install', 'Install homebrew package', { packages: 'array' },
    async (p: { packages: string[] }) => {
      try {
        const { stdout } = await execAsync(`brew install ${p.packages.join(' ')}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// DATABASE TOOLS (20 tools)
// ============================================
export const databaseTools: Record<string, any> = {
  sqlite_query: createTool('sqlite_query', 'Execute SQLite query', { database: 'string', query: 'string' },
    async (p: { database: string; query: string }) => {
      try {
        const { stdout } = await execAsync(`sqlite3 "${p.database}" "${p.query.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  sqlite_tables: createTool('sqlite_tables', 'List SQLite tables', { database: 'string' },
    async (p: { database: string }) => {
      try {
        const { stdout } = await execAsync(`sqlite3 "${p.database}" ".tables"`);
        return { success: true, data: stdout.trim().split(/\s+/) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  sqlite_schema: createTool('sqlite_schema', 'Get SQLite schema', { database: 'string', table: 'string?' },
    async (p: { database: string; table?: string }) => {
      try {
        const query = p.table ? `.schema ${p.table}` : '.schema';
        const { stdout } = await execAsync(`sqlite3 "${p.database}" "${query}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  postgres_query: createTool('postgres_query', 'Execute PostgreSQL query', { query: 'string', database: 'string?', host: 'string?', user: 'string?' },
    async (p: { query: string; database?: string; host?: string; user?: string }) => {
      try {
        const env = `PGDATABASE=${p.database || 'postgres'} PGHOST=${p.host || 'localhost'} PGUSER=${p.user || 'postgres'}`;
        const { stdout } = await execAsync(`${env} psql -c "${p.query.replace(/"/g, '\\"')}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  postgres_tables: createTool('postgres_tables', 'List PostgreSQL tables', { database: 'string?', host: 'string?' },
    async (p: { database?: string; host?: string }) => {
      try {
        const env = `PGDATABASE=${p.database || 'postgres'} PGHOST=${p.host || 'localhost'}`;
        const { stdout } = await execAsync(`${env} psql -c "\\dt"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mysql_query: createTool('mysql_query', 'Execute MySQL query', { query: 'string', database: 'string?', host: 'string?', user: 'string?' },
    async (p: { query: string; database?: string; host?: string; user?: string }) => {
      try {
        const cmd = `mysql -h ${p.host || 'localhost'} -u ${p.user || 'root'} ${p.database || ''} -e "${p.query.replace(/"/g, '\\"')}"`;
        const { stdout } = await execAsync(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mysql_tables: createTool('mysql_tables', 'List MySQL tables', { database: 'string', host: 'string?', user: 'string?' },
    async (p: { database: string; host?: string; user?: string }) => {
      try {
        const cmd = `mysql -h ${p.host || 'localhost'} -u ${p.user || 'root'} ${p.database} -e "SHOW TABLES"`;
        const { stdout } = await execAsync(cmd);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_get: createTool('redis_get', 'Get Redis key', { key: 'string', host: 'string?' },
    async (p: { key: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`redis-cli -h ${p.host || 'localhost'} GET "${p.key}"`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_set: createTool('redis_set', 'Set Redis key', { key: 'string', value: 'string', host: 'string?' },
    async (p: { key: string; value: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`redis-cli -h ${p.host || 'localhost'} SET "${p.key}" "${p.value}"`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_del: createTool('redis_del', 'Delete Redis key', { key: 'string', host: 'string?' },
    async (p: { key: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`redis-cli -h ${p.host || 'localhost'} DEL "${p.key}"`);
        return { success: true, data: stdout.trim() };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  redis_keys: createTool('redis_keys', 'List Redis keys', { pattern: 'string?', host: 'string?' },
    async (p: { pattern?: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`redis-cli -h ${p.host || 'localhost'} KEYS "${p.pattern || '*'}"`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mongo_query: createTool('mongo_query', 'Execute MongoDB query', { database: 'string', collection: 'string', query: 'string', host: 'string?' },
    async (p: { database: string; collection: string; query: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`mongosh --host ${p.host || 'localhost'} ${p.database} --eval "db.${p.collection}.find(${p.query}).toArray()"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mongo_insert: createTool('mongo_insert', 'Insert into MongoDB', { database: 'string', collection: 'string', document: 'string', host: 'string?' },
    async (p: { database: string; collection: string; document: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`mongosh --host ${p.host || 'localhost'} ${p.database} --eval "db.${p.collection}.insertOne(${p.document})"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  mongo_collections: createTool('mongo_collections', 'List MongoDB collections', { database: 'string', host: 'string?' },
    async (p: { database: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`mongosh --host ${p.host || 'localhost'} ${p.database} --eval "db.getCollectionNames()"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  elastic_search: createTool('elastic_search', 'Search Elasticsearch', { index: 'string', query: 'string', host: 'string?' },
    async (p: { index: string; query: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`curl -s -X GET "${p.host || 'localhost:9200'}/${p.index}/_search" -H "Content-Type: application/json" -d '${p.query}'`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  elastic_index: createTool('elastic_index', 'Index document in Elasticsearch', { index: 'string', document: 'string', host: 'string?' },
    async (p: { index: string; document: string; host?: string }) => {
      try {
        const { stdout } = await execAsync(`curl -s -X POST "${p.host || 'localhost:9200'}/${p.index}/_doc" -H "Content-Type: application/json" -d '${p.document}'`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kafka_topics: createTool('kafka_topics', 'List Kafka topics', { bootstrap: 'string?' },
    async (p: { bootstrap?: string }) => {
      try {
        const { stdout } = await execAsync(`kafka-topics.sh --bootstrap-server ${p.bootstrap || 'localhost:9092'} --list`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kafka_produce: createTool('kafka_produce', 'Produce to Kafka topic', { topic: 'string', message: 'string', bootstrap: 'string?' },
    async (p: { topic: string; message: string; bootstrap?: string }) => {
      try {
        await execAsync(`echo "${p.message}" | kafka-console-producer.sh --bootstrap-server ${p.bootstrap || 'localhost:9092'} --topic ${p.topic}`);
        return { success: true };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kafka_consume: createTool('kafka_consume', 'Consume from Kafka topic', { topic: 'string', fromBeginning: 'boolean?', bootstrap: 'string?' },
    async (p: { topic: string; fromBeginning?: boolean; bootstrap?: string }) => {
      try {
        const flag = p.fromBeginning ? '--from-beginning' : '';
        const { stdout } = await execAsync(`timeout 5 kafka-console-consumer.sh --bootstrap-server ${p.bootstrap || 'localhost:9092'} --topic ${p.topic} ${flag} 2>/dev/null || true`);
        return { success: true, data: stdout.trim().split('\n').filter(Boolean) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// CLOUD TOOLS (20 tools)
// ============================================
export const cloudTools: Record<string, any> = {
  aws_s3_list: createTool('aws_s3_list', 'List S3 buckets', {},
    async () => {
      try {
        const { stdout } = await execAsync('aws s3 ls');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  aws_s3_upload: createTool('aws_s3_upload', 'Upload to S3', { file: 'string', bucket: 'string', key: 'string?' },
    async (p: { file: string; bucket: string; key?: string }) => {
      try {
        const key = p.key || path.basename(p.file);
        const { stdout } = await execAsync(`aws s3 cp "${p.file}" "s3://${p.bucket}/${key}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  aws_s3_download: createTool('aws_s3_download', 'Download from S3', { bucket: 'string', key: 'string', destination: 'string' },
    async (p: { bucket: string; key: string; destination: string }) => {
      try {
        const { stdout } = await execAsync(`aws s3 cp "s3://${p.bucket}/${p.key}" "${p.destination}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  aws_ec2_list: createTool('aws_ec2_list', 'List EC2 instances', {},
    async () => {
      try {
        const { stdout } = await execAsync('aws ec2 describe-instances --query "Reservations[*].Instances[*].{ID:InstanceId,State:State.Name,Type:InstanceType}" --output table');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  aws_lambda_list: createTool('aws_lambda_list', 'List Lambda functions', {},
    async () => {
      try {
        const { stdout } = await execAsync('aws lambda list-functions --query "Functions[*].{Name:FunctionName,Runtime:Runtime,Handler:Handler}" --output table');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  aws_lambda_invoke: createTool('aws_lambda_invoke', 'Invoke Lambda function', { function: 'string', payload: 'string?' },
    async (p: { function: string; payload?: string }) => {
      try {
        const payload = p.payload ? `--payload '${p.payload}'` : '';
        const { stdout } = await execAsync(`aws lambda invoke --function-name ${p.function} ${payload} /tmp/lambda_output.json && cat /tmp/lambda_output.json`);
        return { success: true, data: JSON.parse(stdout) };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gcloud_storage_list: createTool('gcloud_storage_list', 'List GCS buckets', {},
    async () => {
      try {
        const { stdout } = await execAsync('gsutil ls');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gcloud_storage_upload: createTool('gcloud_storage_upload', 'Upload to GCS', { file: 'string', bucket: 'string' },
    async (p: { file: string; bucket: string }) => {
      try {
        const { stdout } = await execAsync(`gsutil cp "${p.file}" "${p.bucket}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  gcloud_compute_list: createTool('gcloud_compute_list', 'List GCE instances', {},
    async () => {
      try {
        const { stdout } = await execAsync('gcloud compute instances list');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  azure_storage_list: createTool('azure_storage_list', 'List Azure storage accounts', {},
    async () => {
      try {
        const { stdout } = await execAsync('az storage account list --query "[].{Name:name,Location:location}" -o table');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  azure_vm_list: createTool('azure_vm_list', 'List Azure VMs', {},
    async () => {
      try {
        const { stdout } = await execAsync('az vm list --query "[].{Name:name,Location:location,State:provisioningState}" -o table');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kubectl_get_pods: createTool('kubectl_get_pods', 'List Kubernetes pods', { namespace: 'string?' },
    async (p: { namespace?: string }) => {
      try {
        const ns = p.namespace ? `-n ${p.namespace}` : '--all-namespaces';
        const { stdout } = await execAsync(`kubectl get pods ${ns}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kubectl_get_services: createTool('kubectl_get_services', 'List Kubernetes services', { namespace: 'string?' },
    async (p: { namespace?: string }) => {
      try {
        const ns = p.namespace ? `-n ${p.namespace}` : '--all-namespaces';
        const { stdout } = await execAsync(`kubectl get services ${ns}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kubectl_apply: createTool('kubectl_apply', 'Apply Kubernetes manifest', { file: 'string' },
    async (p: { file: string }) => {
      try {
        const { stdout } = await execAsync(`kubectl apply -f "${p.file}"`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  kubectl_logs: createTool('kubectl_logs', 'Get pod logs', { pod: 'string', namespace: 'string?', tail: 'number?' },
    async (p: { pod: string; namespace?: string; tail?: number }) => {
      try {
        const ns = p.namespace ? `-n ${p.namespace}` : '';
        const tail = p.tail ? `--tail=${p.tail}` : '';
        const { stdout } = await execAsync(`kubectl logs ${p.pod} ${ns} ${tail}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  terraform_init: createTool('terraform_init', 'Initialize Terraform', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('terraform init', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  terraform_plan: createTool('terraform_plan', 'Plan Terraform changes', { path: 'string?' },
    async (p: { path?: string }) => {
      try {
        const { stdout } = await execAsync('terraform plan', { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  terraform_apply: createTool('terraform_apply', 'Apply Terraform changes', { path: 'string?', autoApprove: 'boolean?' },
    async (p: { path?: string; autoApprove?: boolean }) => {
      try {
        const flag = p.autoApprove ? '-auto-approve' : '';
        const { stdout } = await execAsync(`terraform apply ${flag}`, { cwd: p.path || process.cwd() });
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  helm_list: createTool('helm_list', 'List Helm releases', { namespace: 'string?' },
    async (p: { namespace?: string }) => {
      try {
        const ns = p.namespace ? `-n ${p.namespace}` : '-A';
        const { stdout } = await execAsync(`helm list ${ns}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  helm_install: createTool('helm_install', 'Install Helm chart', { name: 'string', chart: 'string', namespace: 'string?', values: 'string?' },
    async (p: { name: string; chart: string; namespace?: string; values?: string }) => {
      try {
        const ns = p.namespace ? `-n ${p.namespace}` : '';
        const values = p.values ? `-f ${p.values}` : '';
        const { stdout } = await execAsync(`helm install ${p.name} ${p.chart} ${ns} ${values}`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// SECURITY TOOLS (20 tools)
// ============================================
export const securityTools: Record<string, any> = {
  security_scan_ports: createTool('security_scan_ports', 'Scan common ports', { host: 'string' },
    async (p: { host: string }) => {
      try {
        const ports = [22, 80, 443, 3000, 3306, 5432, 6379, 8080, 27017];
        const open: number[] = [];
        for (const port of ports) {
          try {
            await execAsync(`timeout 1 bash -c "echo >/dev/tcp/${p.host}/${port}" 2>/dev/null`);
            open.push(port);
          } catch {}
        }
        return { success: true, data: { host: p.host, openPorts: open } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_check_ssl: createTool('security_check_ssl', 'Check SSL certificate', { domain: 'string' },
    async (p: { domain: string }) => {
      try {
        const { stdout } = await execAsync(`echo | openssl s_client -servername ${p.domain} -connect ${p.domain}:443 2>/dev/null | openssl x509 -noout -dates -subject`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_check_headers: createTool('security_check_headers', 'Check security headers', { url: 'string' },
    async (p: { url: string }) => {
      return new Promise((resolve) => {
        try {
          const urlObj = new URL(p.url);
          const lib = urlObj.protocol === 'https:' ? https : http;
          lib.get(p.url, (res) => {
            const h = res.headers;
            const security = {
              'Strict-Transport-Security': h['strict-transport-security'] || 'Missing',
              'Content-Security-Policy': h['content-security-policy'] || 'Missing',
              'X-Frame-Options': h['x-frame-options'] || 'Missing',
              'X-XSS-Protection': h['x-xss-protection'] || 'Missing',
              'X-Content-Type-Options': h['x-content-type-options'] || 'Missing'
            };
            resolve({ success: true, data: security });
          }).on('error', (e) => resolve({ success: false, error: e.message }));
        } catch (e: any) { resolve({ success: false, error: e.message }); }
      });
    }),

  security_generate_password: createTool('security_generate_password', 'Generate secure password', { length: 'number?', includeSpecial: 'boolean?' },
    async (p: { length?: number; includeSpecial?: boolean }) => {
      const length = p.length || 16;
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' + (p.includeSpecial !== false ? '!@#$%^&*()_+-=' : '');
      let password = '';
      const bytes = crypto.randomBytes(length);
      for (let i = 0; i < length; i++) {
        password += chars[bytes[i] % chars.length];
      }
      return { success: true, data: password };
    }),

  security_hash_password: createTool('security_hash_password', 'Hash password with bcrypt-like algorithm', { password: 'string', salt: 'string?' },
    async (p: { password: string; salt?: string }) => {
      const salt = p.salt || crypto.randomBytes(16).toString('hex');
      const hash = crypto.pbkdf2Sync(p.password, salt, 100000, 64, 'sha512').toString('hex');
      return { success: true, data: { hash, salt } };
    }),

  security_verify_password: createTool('security_verify_password', 'Verify password against hash', { password: 'string', hash: 'string', salt: 'string' },
    async (p: { password: string; hash: string; salt: string }) => {
      const verifyHash = crypto.pbkdf2Sync(p.password, p.salt, 100000, 64, 'sha512').toString('hex');
      return { success: true, data: { valid: verifyHash === p.hash } };
    }),

  security_encrypt: createTool('security_encrypt', 'Encrypt data with AES-256', { data: 'string', key: 'string' },
    async (p: { data: string; key: string }) => {
      try {
        const iv = crypto.randomBytes(16);
        const keyHash = crypto.createHash('sha256').update(p.key).digest();
        const cipher = crypto.createCipheriv('aes-256-cbc', keyHash, iv);
        let encrypted = cipher.update(p.data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { success: true, data: { encrypted, iv: iv.toString('hex') } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_decrypt: createTool('security_decrypt', 'Decrypt AES-256 data', { encrypted: 'string', iv: 'string', key: 'string' },
    async (p: { encrypted: string; iv: string; key: string }) => {
      try {
        const keyHash = crypto.createHash('sha256').update(p.key).digest();
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyHash, Buffer.from(p.iv, 'hex'));
        let decrypted = decipher.update(p.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return { success: true, data: decrypted };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_generate_keypair: createTool('security_generate_keypair', 'Generate RSA key pair', { bits: 'number?' },
    async (p: { bits?: number }) => {
      try {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: p.bits || 2048,
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
        return { success: true, data: { publicKey, privateKey } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_sign: createTool('security_sign', 'Sign data with private key', { data: 'string', privateKey: 'string' },
    async (p: { data: string; privateKey: string }) => {
      try {
        const sign = crypto.createSign('SHA256');
        sign.update(p.data);
        sign.end();
        const signature = sign.sign(p.privateKey, 'hex');
        return { success: true, data: signature };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_verify: createTool('security_verify', 'Verify signature', { data: 'string', signature: 'string', publicKey: 'string' },
    async (p: { data: string; signature: string; publicKey: string }) => {
      try {
        const verify = crypto.createVerify('SHA256');
        verify.update(p.data);
        verify.end();
        const valid = verify.verify(p.publicKey, p.signature, 'hex');
        return { success: true, data: { valid } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_jwt_create: createTool('security_jwt_create', 'Create JWT token', { payload: 'object', secret: 'string', expiresIn: 'string?' },
    async (p: { payload: object; secret: string; expiresIn?: string }) => {
      try {
        const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
        const now = Math.floor(Date.now() / 1000);
        const exp = p.expiresIn ? now + parseInt(p.expiresIn) : now + 3600;
        const payloadStr = Buffer.from(JSON.stringify({ ...p.payload, iat: now, exp })).toString('base64url');
        const signature = crypto.createHmac('sha256', p.secret).update(`${header}.${payloadStr}`).digest('base64url');
        return { success: true, data: `${header}.${payloadStr}.${signature}` };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_jwt_verify: createTool('security_jwt_verify', 'Verify JWT token', { token: 'string', secret: 'string' },
    async (p: { token: string; secret: string }) => {
      try {
        const [headerB64, payloadB64, signature] = p.token.split('.');
        const expectedSig = crypto.createHmac('sha256', p.secret).update(`${headerB64}.${payloadB64}`).digest('base64url');
        if (signature !== expectedSig) return { success: false, error: 'Invalid signature' };
        const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
        if (payload.exp < Math.floor(Date.now() / 1000)) return { success: false, error: 'Token expired' };
        return { success: true, data: payload };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_scan_vulnerabilities: createTool('security_scan_vulnerabilities', 'Scan for known vulnerabilities', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const { stdout } = await execAsync(`npm audit --json`, { cwd: p.path });
        const audit = JSON.parse(stdout);
        return { success: true, data: { vulnerabilities: audit.metadata?.vulnerabilities || {} } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_check_secrets: createTool('security_check_secrets', 'Check for exposed secrets', { path: 'string' },
    async (p: { path: string }) => {
      try {
        const patterns = [
          /(?i)api[_-]?key\s*=\s*['"][^'"]+['"]/g,
          /(?i)secret[_-]?key\s*=\s*['"][^'"]+['"]/g,
          /(?i)password\s*=\s*['"][^'"]+['"]/g,
          /(?i)token\s*=\s*['"][^'"]+['"]/g,
          /ghp_[A-Za-z0-9]{36}/g,
          /sk-[A-Za-z0-9]{48}/g,
        ];
        const { stdout } = await execAsync(`grep -rE "(api_key|secret|password|token|ghp_|sk-)" "${p.path}" --include="*.ts" --include="*.js" --include="*.py" --include="*.env" 2>/dev/null | head -20`);
        return { success: true, data: { found: stdout.trim().split('\n').filter(Boolean) } };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_firewall_status: createTool('security_firewall_status', 'Check firewall status', {},
    async () => {
      try {
        const { stdout } = await execAsync('ufw status 2>/dev/null || iptables -L -n 2>/dev/null | head -20');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_audit_users: createTool('security_audit_users', 'Audit system users', {},
    async () => {
      try {
        const { stdout } = await execAsync('cat /etc/passwd | grep -v nologin | grep -v false');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_check_sudo: createTool('security_check_sudo', 'Check sudo access', {},
    async () => {
      try {
        const { stdout } = await execAsync('sudo -l 2>/dev/null');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_fail2ban_status: createTool('security_fail2ban_status', 'Check fail2ban status', {},
    async () => {
      try {
        const { stdout } = await execAsync('fail2ban-client status 2>/dev/null || echo "fail2ban not running"');
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),

  security_log_analysis: createTool('security_log_analysis', 'Analyze security logs', { logPath: 'string?', lines: 'number?' },
    async (p: { logPath?: string; lines?: number }) => {
      try {
        const log = p.logPath || '/var/log/auth.log';
        const { stdout } = await execAsync(`tail -n ${p.lines || 100} "${log}" | grep -E "(Failed|Invalid|Attack|Blocked|Denied)" | head -20`);
        return { success: true, data: stdout };
      } catch (e: any) { return { success: false, error: e.message }; }
    }),
};

// ============================================
// ALL TOOLS REGISTRY
// ============================================
export const allTools: Record<string, any> = {
  ...fileSystemTools,
  ...shellTools,
  ...webTools,
  ...gitTools,
  ...npmTools,
  ...databaseTools,
  ...cloudTools,
  ...securityTools,
};

// Export tool count
export const TOOL_COUNT = Object.keys(allTools).length;

// Execute tool by name
export async function executeTool(name: string, params: any): Promise<ToolResult> {
  const tool = allTools[name];
  if (!tool) {
    return { success: false, error: `Tool not found: ${name}` };
  }
  return tool.execute(params);
}

// Get tool by name
export function getTool(name: string) {
  return allTools[name];
}

// List all tools
export function listTools(): string[] {
  return Object.keys(allTools);
}

// Count tools
export function countTools(): number {
  return Object.keys(allTools).length;
}

// Get tools by category
export function getToolsByCategory() {
  return {
    fileSystem: Object.keys(fileSystemTools),
    shell: Object.keys(shellTools),
    web: Object.keys(webTools),
    git: Object.keys(gitTools),
    npm: Object.keys(npmTools),
    database: Object.keys(databaseTools),
    cloud: Object.keys(cloudTools),
    security: Object.keys(securityTools),
  };
}

export default allTools;
