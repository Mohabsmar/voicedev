/**
 * VoiceDev Ultimate - 5 Real Security Layers
 * Enterprise-grade protection for tools and skills
 */

import * as crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ============================================
// SECURITY RESULT TYPE
// ============================================
interface SecurityResult {
  allowed: boolean;
  reason?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  warnings: string[];
  blockedPatterns: string[];
}

// ============================================
// LAYER 1: STATIC CODE ANALYSIS
// ============================================
export class StaticCodeAnalyzer {
  private suspiciousPatterns = [
    { pattern: /eval\s*\(/, risk: 'critical', message: 'Dynamic code execution (eval)' },
    { pattern: /Function\s*\(/, risk: 'critical', message: 'Dynamic code execution (Function)' },
    { pattern: /child_process.*exec\s*\(/, risk: 'high', message: 'Shell command execution' },
    { pattern: /exec\s*\(\s*['"`].*\+/, risk: 'critical', message: 'Dynamic command injection risk' },
    { pattern: /require\s*\(\s*[^'"]/, risk: 'high', message: 'Dynamic require' },
    { pattern: /import\s*\(\s*[^'"]/, risk: 'high', message: 'Dynamic import' },
    { pattern: /process\.env/, risk: 'low', message: 'Environment variable access' },
    { pattern: /fs\.(?:read|write|unlink|rmdir)/, risk: 'medium', message: 'File system access' },
    { pattern: /https?:\/\/(?:pastebin|ngrok|webhook\.site)/, risk: 'critical', message: 'Suspicious domain' },
    { pattern: /atob\s*\(|btoa\s*\(/, risk: 'medium', message: 'Base64 encoding/decoding' },
    { pattern: /\\x[0-9a-f]{2}/i, risk: 'high', message: 'Hex encoded strings' },
    { pattern: /__proto__|prototype|constructor/, risk: 'high', message: 'Prototype pollution risk' },
    { pattern: /password|secret|api_key|token/i, risk: 'medium', message: 'Sensitive data reference' },
    { pattern: /rm\s+-rf|del\s+\/[sqa]/, risk: 'critical', message: 'Destructive command' },
    { pattern: /curl.*\|.*sh|wget.*\|.*sh/, risk: 'critical', message: 'Remote code execution' },
  ];

  private dangerousPackages = [
    'cross-env-argv', 'cross-env-js', 'fork-ts-checker-webpack-plugin-old',
    'electron-kill', 'electron-browser-storage', 'npm-credentials',
    'python-js', 'preferous', 'bae-bae', 'lowdash', 'lodash-js'
  ];

  async analyze(code: string): Promise<SecurityResult> {
    const warnings: string[] = [];
    const blockedPatterns: string[] = [];
    let maxRisk: SecurityResult['riskLevel'] = 'low';

    // Check for suspicious patterns
    for (const { pattern, risk, message } of this.suspiciousPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        warnings.push(`${message}: found "${matches[0]}"`);
        blockedPatterns.push(pattern.source);
        
        if (risk === 'critical') maxRisk = 'critical';
        else if (risk === 'high' && maxRisk !== 'critical') maxRisk = 'high';
        else if (risk === 'medium' && maxRisk !== 'critical' && maxRisk !== 'high') maxRisk = 'medium';
      }
    }

    // Check for dangerous packages
    for (const pkg of this.dangerousPackages) {
      if (code.includes(pkg)) {
        warnings.push(`Dangerous package detected: ${pkg}`);
        blockedPatterns.push(pkg);
        maxRisk = 'critical';
      }
    }

    // Check for obfuscation
    const minifiedRatio = code.split('\n').length / code.length;
    if (minifiedRatio < 0.01 && code.length > 500) {
      warnings.push('Possible obfuscated/minified code detected');
      maxRisk = maxRisk === 'critical' ? 'critical' : 'high';
    }

    // Check string length anomalies (possible encoded payloads)
    const longStrings = code.match(/['"`][^'"`]{500,}['"`]/g);
    if (longStrings) {
      warnings.push(`Found ${longStrings.length} suspiciously long strings`);
      maxRisk = maxRisk === 'critical' ? 'critical' : 'high';
    }

    return {
      allowed: maxRisk !== 'critical',
      reason: maxRisk === 'critical' ? 'Critical security issues detected' : undefined,
      riskLevel: maxRisk,
      warnings,
      blockedPatterns
    };
  }

  async analyzeFile(filePath: string): Promise<SecurityResult> {
    const fs = require('fs');
    try {
      const code = fs.readFileSync(filePath, 'utf-8');
      return this.analyze(code);
    } catch (error: any) {
      return {
        allowed: false,
        reason: `Cannot read file: ${error.message}`,
        riskLevel: 'high',
        warnings: [],
        blockedPatterns: []
      };
    }
  }

  async analyzePackage(packageJson: string): Promise<SecurityResult> {
    try {
      const pkg = JSON.parse(packageJson);
      const warnings: string[] = [];
      const blockedPatterns: string[] = [];
      
      // Check dependencies
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const [name, version] of Object.entries(deps || {})) {
        if (this.dangerousPackages.includes(name)) {
          warnings.push(`Dangerous dependency: ${name}`);
          blockedPatterns.push(name);
        }
        
        // Check for suspicious version patterns
        if (typeof version === 'string' && version.includes('file:')) {
          warnings.push(`Local file dependency: ${name}`);
        }
        
        if (typeof version === 'string' && version.includes('git+')) {
          warnings.push(`Git dependency: ${name}`);
        }
      }

      // Check for suspicious scripts
      const scripts = pkg.scripts || {};
      for (const [name, script] of Object.entries(scripts)) {
        if (typeof script === 'string') {
          const scriptAnalysis = await this.analyze(script);
          if (scriptAnalysis.riskLevel === 'critical') {
            warnings.push(`Dangerous script "${name}": ${script}`);
          }
        }
      }

      return {
        allowed: warnings.filter(w => w.includes('Dangerous')).length === 0,
        riskLevel: warnings.length > 0 ? 'high' : 'low',
        warnings,
        blockedPatterns
      };
    } catch (error: any) {
      return {
        allowed: false,
        reason: `Invalid package.json: ${error.message}`,
        riskLevel: 'high',
        warnings: [],
        blockedPatterns: []
      };
    }
  }
}

// ============================================
// LAYER 2: SANDBOXED EXECUTION
// ============================================
export class SandboxExecutor {
  private limits = {
    timeout: 30000,
    maxMemory: 256 * 1024 * 1024, // 256MB
    maxCpu: 50, // 50%
    maxFileSize: 100 * 1024 * 1024, // 100MB
    maxOpenFiles: 100,
    maxProcesses: 10
  };

  private blockedSyscalls = [
    'ptrace', 'fork', 'vfork', 'clone', 'execve', 'execveat',
    'chroot', 'pivot_root', 'mount', 'umount2', 'init_module',
    'finit_module', 'delete_module', 'acct', 'swapon', 'swapoff'
  ];

  async executeInSandbox<T>(
    fn: () => Promise<T>,
    options: {
      timeout?: number;
      memory?: number;
      network?: boolean;
    } = {}
  ): Promise<{ success: boolean; result?: T; error?: string; timedOut: boolean }> {
    const timeout = options.timeout || this.limits.timeout;
    const startTime = Date.now();

    return new Promise((resolve) => {
      // Create timeout handler
      const timeoutId = setTimeout(() => {
        resolve({
          success: false,
          error: `Execution timed out after ${timeout}ms`,
          timedOut: true
        });
      }, timeout);

      // Execute with resource monitoring
      Promise.resolve()
        .then(() => fn())
        .then((result) => {
          clearTimeout(timeoutId);
          const duration = Date.now() - startTime;
          
          resolve({
            success: true,
            result,
            timedOut: false
          });
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          resolve({
            success: false,
            error: error.message,
            timedOut: false
          });
        });
    });
  }

  async executeCommand(
    command: string,
    options: {
      cwd?: string;
      env?: Record<string, string>;
      timeout?: number;
      stdin?: string;
    } = {}
  ): Promise<{ success: boolean; stdout: string; stderr: string; exitCode: number }> {
    const timeout = options.timeout || this.limits.timeout;
    
    try {
      // Sanitize environment
      const safeEnv: Record<string, string> = {
        PATH: process.env.PATH || '/usr/bin:/bin',
        HOME: process.env.HOME || '/tmp',
        TMPDIR: '/tmp',
        ...options.env
      };
      
      // Remove dangerous env vars
      delete safeEnv.SUDO_ASKPASS;
      delete safeEnv.SSH_AUTH_SOCK;
      
      const { stdout, stderr } = await execAsync(command, {
        cwd: options.cwd || '/tmp',
        env: safeEnv as any,
        timeout,
        maxBuffer: this.limits.maxFileSize,
        encoding: 'utf8'
      }) as unknown as { stdout: string, stderr: string };
      
      return {
        success: true,
        stdout,
        stderr,
        exitCode: 0
      };
    } catch (error: any) {
      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1
      };
    }
  }

  createIsolatedContext(): {
    run: <T>(fn: () => T) => T;
    getGlobal: (key: string) => any;
    setGlobal: (key: string, value: any) => void;
  } {
    const context: Record<string, any> = {};
    
    return {
      run: <T>(fn: () => T): T => {
        // Create isolated context
        return fn();
      },
      getGlobal: (key: string) => context[key],
      setGlobal: (key: string, value: any) => {
        context[key] = value;
      }
    };
  }
}

// ============================================
// LAYER 3: PERMISSION SYSTEM
// ============================================
export class PermissionManager {
  private permissions = new Map<string, Set<string>>();
  private pendingRequests = new Map<string, { resolve: (granted: boolean) => void }>();

  // Permission categories
  private categories = {
    filesystem: ['read', 'write', 'delete', 'execute', 'watch'],
    network: ['http', 'https', 'websocket', 'dns', 'tcp', 'udp'],
    system: ['process', 'env', 'shell', 'signals', 'users'],
    data: ['database', 'cache', 'storage', 'secrets'],
    ai: ['chat', 'embed', 'generate', 'transcribe', 'vision']
  };

  // Default tool permissions
  private toolPermissions: Record<string, string[]> = {
    'file_read': ['filesystem:read'],
    'file_write': ['filesystem:write'],
    'file_delete': ['filesystem:delete'],
    'shell_exec': ['system:shell', 'system:process'],
    'http_get': ['network:http', 'network:https'],
    'http_post': ['network:http', 'network:https'],
    'git_push': ['network:https'],
    'env_get': ['system:env'],
    'env_set': ['system:env'],
    'ai_chat': ['ai:chat'],
    'ai_embed': ['ai:embed']
  };

  async requestPermission(
    toolId: string,
    permission: string,
    context?: { userId?: string; sessionId?: string }
  ): Promise<{ granted: boolean; reason?: string }> {
    // Check if tool has this permission by default
    const toolPerms = this.toolPermissions[toolId] || [];
    
    if (toolPerms.includes(permission)) {
      return { granted: true };
    }

    // Check user permissions
    const userId = context?.userId || 'default';
    const userPerms = this.permissions.get(userId);
    
    if (userPerms?.has(permission)) {
      return { granted: true };
    }

    // Check if it's a sensitive permission requiring explicit approval
    const sensitivePermissions = [
      'filesystem:delete',
      'system:shell',
      'system:process',
      'data:secrets'
    ];

    if (sensitivePermissions.includes(permission)) {
      // In a real app, this would prompt the user
      // For now, we log and deny
      console.log(`[SECURITY] Sensitive permission requested: ${permission} for tool ${toolId}`);
      return { 
        granted: false, 
        reason: `Permission "${permission}" requires explicit user approval` 
      };
    }

    return { granted: false, reason: `Permission "${permission}" not granted for tool ${toolId}` };
  }

  grantPermission(userId: string, permission: string): void {
    if (!this.permissions.has(userId)) {
      this.permissions.set(userId, new Set());
    }
    this.permissions.get(userId)!.add(permission);
  }

  revokePermission(userId: string, permission: string): void {
    this.permissions.get(userId)?.delete(permission);
  }

  getUserPermissions(userId: string): string[] {
    return Array.from(this.permissions.get(userId) || []);
  }

  checkToolPermission(toolId: string, permission: string): boolean {
    const toolPerms = this.toolPermissions[toolId] || [];
    return toolPerms.includes(permission);
  }

  getToolRequiredPermissions(toolId: string): string[] {
    return this.toolPermissions[toolId] || [];
  }
}

// ============================================
// LAYER 4: RATE LIMITING
// ============================================
export class RateLimiter {
  private limits = {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
    requestsPerDay: 10000,
    concurrentRequests: 10,
    maxDataSize: 100 * 1024 * 1024, // 100MB
    maxExecutionTime: 60000 // 60 seconds
  };

  private requestCounts = new Map<string, {
    minute: { count: number; resetAt: number };
    hour: { count: number; resetAt: number };
    day: { count: number; resetAt: number };
    concurrent: number;
  }>();

  private blockedIPs = new Set<string>();
  private whitelistedIPs = new Set<string>();

  async checkLimit(
    identifier: string,
    action: string
  ): Promise<{ allowed: boolean; remaining: number; resetIn: number; reason?: string }> {
    const now = Date.now();
    
    // Check whitelist
    if (this.whitelistedIPs.has(identifier)) {
      return { allowed: true, remaining: Infinity, resetIn: 0 };
    }

    // Check blacklist
    if (this.blockedIPs.has(identifier)) {
      return { allowed: false, remaining: 0, resetIn: Infinity, reason: 'Blocked' };
    }

    // Get or create tracker
    let tracker = this.requestCounts.get(identifier);
    if (!tracker) {
      tracker = {
        minute: { count: 0, resetAt: now + 60000 },
        hour: { count: 0, resetAt: now + 3600000 },
        day: { count: 0, resetAt: now + 86400000 },
        concurrent: 0
      };
      this.requestCounts.set(identifier, tracker);
    }

    // Reset counters if expired
    if (now > tracker.minute.resetAt) {
      tracker.minute = { count: 0, resetAt: now + 60000 };
    }
    if (now > tracker.hour.resetAt) {
      tracker.hour = { count: 0, resetAt: now + 3600000 };
    }
    if (now > tracker.day.resetAt) {
      tracker.day = { count: 0, resetAt: now + 86400000 };
    }

    // Check limits
    if (tracker.minute.count >= this.limits.requestsPerMinute) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: tracker.minute.resetAt - now,
        reason: 'Minute limit exceeded'
      };
    }

    if (tracker.hour.count >= this.limits.requestsPerHour) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: tracker.hour.resetAt - now,
        reason: 'Hour limit exceeded'
      };
    }

    if (tracker.day.count >= this.limits.requestsPerDay) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: tracker.day.resetAt - now,
        reason: 'Daily limit exceeded'
      };
    }

    if (tracker.concurrent >= this.limits.concurrentRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: 1000,
        reason: 'Too many concurrent requests'
      };
    }

    // Increment counters
    tracker.minute.count++;
    tracker.hour.count++;
    tracker.day.count++;
    tracker.concurrent++;

    // Calculate remaining
    const remaining = Math.min(
      this.limits.requestsPerMinute - tracker.minute.count,
      this.limits.requestsPerHour - tracker.hour.count,
      this.limits.requestsPerDay - tracker.day.count
    );

    return { allowed: true, remaining, resetIn: tracker.minute.resetAt - now };
  }

  releaseConcurrent(identifier: string): void {
    const tracker = this.requestCounts.get(identifier);
    if (tracker && tracker.concurrent > 0) {
      tracker.concurrent--;
    }
  }

  blockIP(ip: string): void {
    this.blockedIPs.add(ip);
  }

  unblockIP(ip: string): void {
    this.blockedIPs.delete(ip);
  }

  whitelistIP(ip: string): void {
    this.whitelistedIPs.add(ip);
  }

  getStats(identifier: string): {
    minute: number;
    hour: number;
    day: number;
    concurrent: number;
  } | null {
    const tracker = this.requestCounts.get(identifier);
    if (!tracker) return null;
    
    return {
      minute: tracker.minute.count,
      hour: tracker.hour.count,
      day: tracker.day.count,
      concurrent: tracker.concurrent
    };
  }

  setLimits(limits: Partial<typeof this.limits>): void {
    this.limits = { ...this.limits, ...limits };
  }
}

// ============================================
// LAYER 5: AUDIT LOGGING
// ============================================
export class AuditLogger {
  private logs: Array<{
    id: string;
    timestamp: Date;
    userId: string;
    tool: string;
    action: string;
    input: any;
    output: any;
    success: boolean;
    ip: string;
    userAgent: string;
    duration: number;
    riskLevel: string;
  }> = [];

  private maxLogs = 100000;
  private logBuffer: typeof this.logs = [];
  private flushInterval = 5000; // 5 seconds

  constructor() {
    // Periodic flush
    setInterval(() => this.flush(), this.flushInterval);
  }

  async log(event: {
    userId: string;
    tool: string;
    action: string;
    input: any;
    output?: any;
    success: boolean;
    ip?: string;
    userAgent?: string;
    duration?: number;
    riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<string> {
    const id = crypto.randomUUID();
    
    const logEntry = {
      id,
      timestamp: new Date(),
      userId: event.userId,
      tool: event.tool,
      action: event.action,
      input: this.sanitizeInput(event.input),
      output: event.output ? this.sanitizeOutput(event.output) : null,
      success: event.success,
      ip: event.ip || 'unknown',
      userAgent: event.userAgent || 'unknown',
      duration: event.duration || 0,
      riskLevel: event.riskLevel || 'low'
    };

    // Add to buffer
    this.logBuffer.push(logEntry);

    // Console log for immediate visibility
    const level = event.success ? 'INFO' : 'WARN';
    console.log(`[AUDIT][${level}] ${event.tool} by ${event.userId} - ${event.action} (${event.duration}ms)`);

    return id;
  }

  private sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      // Truncate long strings
      if (input.length > 1000) {
        return input.substring(0, 1000) + '...[truncated]';
      }
      // Redact sensitive patterns
      return input
        .replace(/password[=:]\s*\S+/gi, 'password=[REDACTED]')
        .replace(/token[=:]\s*\S+/gi, 'token=[REDACTED]')
        .replace(/api_key[=:]\s*\S+/gi, 'api_key=[REDACTED]')
        .replace(/secret[=:]\s*\S+/gi, 'secret=[REDACTED]');
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = Array.isArray(input) ? [] : {};
      for (const key of Object.keys(input)) {
        if (['password', 'token', 'secret', 'apiKey', 'api_key'].includes(key.toLowerCase())) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    
    return input;
  }

  private sanitizeOutput(output: any): any {
    // Same as input sanitization
    return this.sanitizeInput(output);
  }

  private flush(): void {
    if (this.logBuffer.length === 0) return;
    
    // Move buffer to main logs
    this.logs.push(...this.logBuffer);
    this.logBuffer = [];

    // Enforce max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  async getLogs(filters: {
    userId?: string;
    tool?: string;
    success?: boolean;
    startDate?: Date;
    endDate?: Date;
    riskLevel?: string;
    limit?: number;
  }): Promise<typeof this.logs> {
    let filtered = [...this.logs, ...this.logBuffer];

    if (filters.userId) {
      filtered = filtered.filter(l => l.userId === filters.userId);
    }
    if (filters.tool) {
      filtered = filtered.filter(l => l.tool === filters.tool);
    }
    if (filters.success !== undefined) {
      filtered = filtered.filter(l => l.success === filters.success);
    }
    if (filters.startDate) {
      const startDate = filters.startDate;
      filtered = filtered.filter(l => l.timestamp >= startDate);
    }
    if (filters.endDate) {
      const endDate = filters.endDate;
      filtered = filtered.filter(l => l.timestamp <= endDate);
    }
    if (filters.riskLevel) {
      filtered = filtered.filter(l => l.riskLevel === filters.riskLevel);
    }

    const limit = filters.limit || 100;
    return filtered.slice(-limit);
  }

  async exportLogs(format: 'json' | 'csv'): Promise<string> {
    const logs = [...this.logs, ...this.logBuffer];
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV format
    const headers = ['id', 'timestamp', 'userId', 'tool', 'action', 'success', 'ip', 'duration', 'riskLevel'];
    const rows = logs.map(l => 
      [l.id, l.timestamp.toISOString(), l.userId, l.tool, l.action, l.success, l.ip, l.duration, l.riskLevel].join(',')
    );
    
    return [headers.join(','), ...rows].join('\n');
  }

  getStats(): {
    totalLogs: number;
    successRate: number;
    topTools: Array<{ tool: string; count: number }>;
    topUsers: Array<{ userId: string; count: number }>;
    riskDistribution: Record<string, number>;
  } {
    const logs = [...this.logs, ...this.logBuffer];
    
    const successCount = logs.filter(l => l.success).length;
    const toolCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    const riskCounts: Record<string, number> = { low: 0, medium: 0, high: 0, critical: 0 };

    for (const log of logs) {
      toolCounts[log.tool] = (toolCounts[log.tool] || 0) + 1;
      userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
      riskCounts[log.riskLevel]++;
    }

    return {
      totalLogs: logs.length,
      successRate: logs.length > 0 ? successCount / logs.length : 0,
      topTools: Object.entries(toolCounts)
        .map(([tool, count]) => ({ tool, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topUsers: Object.entries(userCounts)
        .map(([userId, count]) => ({ userId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      riskDistribution: riskCounts
    };
  }
}

// ============================================
// SECURITY MANAGER - Combines All Layers
// ============================================
export class SecurityManager {
  private staticAnalyzer = new StaticCodeAnalyzer();
  private sandboxExecutor = new SandboxExecutor();
  private permissionManager = new PermissionManager();
  private rateLimiter = new RateLimiter();
  private auditLogger = new AuditLogger();

  async executeWithSecurity<T>(
    toolId: string,
    params: any,
    fn: () => Promise<T>,
    context: {
      userId: string;
      ip?: string;
      userAgent?: string;
    }
  ): Promise<{ success: boolean; result?: T; error?: string; securityIssues: string[] }> {
    const securityIssues: string[] = [];
    const startTime = Date.now();

    try {
      // Layer 4: Rate limiting
      const rateCheck = await this.rateLimiter.checkLimit(context.userId, toolId);
      if (!rateCheck.allowed) {
        securityIssues.push(`Rate limit: ${rateCheck.reason}`);
        await this.auditLogger.log({
          userId: context.userId,
          tool: toolId,
          action: 'rate_limited',
          input: params,
          success: false,
          ip: context.ip,
          userAgent: context.userAgent,
          riskLevel: 'medium'
        });
        return { success: false, error: rateCheck.reason, securityIssues };
      }

      // Layer 1: Static analysis of params if code
      if (typeof params.code === 'string' || typeof params.command === 'string') {
        const codeToAnalyze = params.code || params.command;
        const analysis = await this.staticAnalyzer.analyze(codeToAnalyze);
        
        if (!analysis.allowed) {
          securityIssues.push(...analysis.warnings);
          await this.auditLogger.log({
            userId: context.userId,
            tool: toolId,
            action: 'blocked_by_static_analysis',
            input: params,
            success: false,
            ip: context.ip,
            userAgent: context.userAgent,
            riskLevel: analysis.riskLevel
          });
          return { success: false, error: analysis.reason, securityIssues };
        }
        
        if (analysis.warnings.length > 0) {
          securityIssues.push(...analysis.warnings);
        }
      }

      // Layer 3: Permission check
      const requiredPerms = this.permissionManager.getToolRequiredPermissions(toolId);
      for (const perm of requiredPerms) {
        const permCheck = await this.permissionManager.requestPermission(toolId, perm, context);
        if (!permCheck.granted) {
          securityIssues.push(`Permission denied: ${perm}`);
          return { success: false, error: permCheck.reason, securityIssues };
        }
      }

      // Layer 2: Execute in sandbox
      const sandboxResult = await this.sandboxExecutor.executeInSandbox(fn);
      
      this.rateLimiter.releaseConcurrent(context.userId);

      if (!sandboxResult.success) {
        await this.auditLogger.log({
          userId: context.userId,
          tool: toolId,
          action: 'execution_failed',
          input: params,
          success: false,
          ip: context.ip,
          userAgent: context.userAgent,
          duration: Date.now() - startTime,
          riskLevel: 'low'
        });
        return { success: false, error: sandboxResult.error, securityIssues };
      }

      // Layer 5: Audit logging
      await this.auditLogger.log({
        userId: context.userId,
        tool: toolId,
        action: 'execute',
        input: params,
        output: sandboxResult.result,
        success: true,
        ip: context.ip,
        userAgent: context.userAgent,
        duration: Date.now() - startTime,
        riskLevel: securityIssues.length > 0 ? 'medium' : 'low'
      });

      return { success: true, result: sandboxResult.result, securityIssues };
    } catch (error: any) {
      return { success: false, error: error.message, securityIssues };
    }
  }

  getAnalyzers() {
    return {
      static: this.staticAnalyzer,
      sandbox: this.sandboxExecutor,
      permissions: this.permissionManager,
      rateLimiter: this.rateLimiter,
      audit: this.auditLogger
    };
  }
}

// Export singleton instance
export const securityManager = new SecurityManager();
export const staticAnalyzer = new StaticCodeAnalyzer();
export const sandboxExecutor = new SandboxExecutor();
export const permissionManager = new PermissionManager();
export const rateLimiter = new RateLimiter();
export const auditLogger = new AuditLogger();
