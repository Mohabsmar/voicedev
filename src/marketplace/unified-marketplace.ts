/**
 * VoiceDev - Unified Marketplace Integration
 * Combines Smithery (MCP Tools) + ClawHub (Skills) with unified commands
 * Commands: search, list, vet, install
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// ============================================
// TYPES
// ============================================
export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  source: 'smithery' | 'clawhub';
  type: 'mcp-server' | 'tool' | 'skill';
  author?: string;
  version?: string;
  downloads?: number;
  stars?: number;
  verified?: boolean;
  installed?: boolean;
  securityStatus?: 'verified' | 'warning' | 'dangerous' | 'unverified';
}

export interface VetResult {
  itemId: string;
  status: 'safe' | 'low-risk' | 'medium-risk' | 'high-risk' | 'critical';
  score: number;
  findings: string[];
  recommendations: string[];
  scannedAt: Date;
}

export interface InstallResult {
  success: boolean;
  message: string;
  item?: MarketplaceItem;
}

// ============================================
// SMITHERY INTEGRATION (MCP Tools)
// ============================================
export const SmitheryMarketplace = {
  /**
   * Search Smithery for MCP servers
   */
  async search(query: string): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx @smithery/cli mcp search "${query}" --json`, {
        timeout: 30000
      });
      const results = JSON.parse(stdout);
      return (results.servers || results || []).map((item: any) => ({
        id: item.id || item.name,
        name: item.name || item.displayName,
        description: item.description || '',
        source: 'smithery' as const,
        type: 'mcp-server' as const,
        author: item.author || item.owner,
        version: item.version,
        downloads: item.downloads || item.installCount,
        stars: item.stars || item.starCount,
        verified: item.verified || item.isVerified
      }));
    } catch (error: any) {
      console.error('Smithery search error:', error.message);
      return [];
    }
  },

  /**
   * List installed Smithery MCP servers
   */
  async list(): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx @smithery/cli mcp list --json`, {
        timeout: 30000
      });
      const results = JSON.parse(stdout);
      return (results.connections || results || []).map((item: any) => ({
        id: item.id,
        name: item.name || item.serverName,
        description: item.description || '',
        source: 'smithery' as const,
        type: 'mcp-server' as const,
        installed: true
      }));
    } catch (error: any) {
      console.error('Smithery list error:', error.message);
      return [];
    }
  },

  /**
   * Install MCP server from Smithery
   */
  async install(serverId: string): Promise<InstallResult> {
    try {
      const { stdout, stderr } = await execAsync(`npx @smithery/cli mcp add "${serverId}"`, {
        timeout: 60000
      });
      return {
        success: true,
        message: `Successfully installed ${serverId} from Smithery`,
        item: { id: serverId, name: serverId, description: '', source: 'smithery', type: 'mcp-server', installed: true }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to install ${serverId}: ${error.message}`
      };
    }
  },

  /**
   * Remove MCP server
   */
  async remove(serverId: string): Promise<boolean> {
    try {
      await execAsync(`npx @smithery/cli mcp remove "${serverId}"`, { timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * List tools from a specific MCP connection
   */
  async listTools(connectionId: string): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx @smithery/cli tool list "${connectionId}" --json`, {
        timeout: 30000
      });
      const results = JSON.parse(stdout);
      return (results.tools || results || []).map((tool: any) => ({
        id: tool.name || tool.id,
        name: tool.name,
        description: tool.description || '',
        source: 'smithery' as const,
        type: 'tool' as const
      }));
    } catch (error: any) {
      console.error('Smithery list tools error:', error.message);
      return [];
    }
  },

  /**
   * Call a tool from Smithery MCP
   */
  async callTool(connectionId: string, toolName: string, args: any): Promise<any> {
    try {
      const argsStr = JSON.stringify(args).replace(/"/g, '\\"');
      const { stdout } = await execAsync(
        `npx @smithery/cli tool call "${connectionId}" "${toolName}" '${argsStr}' --json`,
        { timeout: 60000 }
      );
      return JSON.parse(stdout);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

// ============================================
// CLAWHUB INTEGRATION (Skills)
// ============================================
export const ClawHubMarketplace = {
  /**
   * Search ClawHub for skills
   */
  async search(query: string): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx clawhub search "${query}" --json 2>/dev/null || npx clawhub search "${query}"`, {
        timeout: 30000
      });
      // ClawHub might not have JSON output, parse text output
      const lines = stdout.split('\n').filter(l => l.trim());
      const items: MarketplaceItem[] = [];
      
      // Try JSON parse first
      try {
        const json = JSON.parse(stdout);
        return (json.skills || json || []).map((item: any) => ({
          id: item.slug || item.id,
          name: item.name || item.displayName,
          description: item.description || '',
          source: 'clawhub' as const,
          type: 'skill' as const,
          author: item.author || item.owner,
          version: item.version,
          downloads: item.downloads || item.installCount,
          stars: item.stars || item.starCount
        }));
      } catch {
        // Parse text output
        for (const line of lines) {
          if (line.includes('•') || line.includes('-')) {
            const parts = line.split(/[•-]/).map(p => p.trim()).filter(Boolean);
            if (parts.length >= 1) {
              items.push({
                id: parts[0].toLowerCase().replace(/\s+/g, '-'),
                name: parts[0],
                description: parts[1] || '',
                source: 'clawhub' as const,
                type: 'skill' as const
              });
            }
          }
        }
      }
      return items;
    } catch (error: any) {
      console.error('ClawHub search error:', error.message);
      return [];
    }
  },

  /**
   * List installed ClawHub skills
   */
  async list(): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx clawhub list`, { timeout: 30000 });
      const lines = stdout.split('\n').filter(l => l.trim());
      const items: MarketplaceItem[] = [];
      
      for (const line of lines) {
        if (line.includes('•') || line.includes('-') || line.includes('@')) {
          const parts = line.split(/[@•-]/).map(p => p.trim()).filter(Boolean);
          if (parts.length >= 1) {
            items.push({
              id: parts[0].toLowerCase().replace(/\s+/g, '-'),
              name: parts[0],
              description: parts[1] || `v${parts[1] || '1.0.0'}`,
              source: 'clawhub' as const,
              type: 'skill' as const,
              installed: true
            });
          }
        }
      }
      return items;
    } catch (error: any) {
      console.error('ClawHub list error:', error.message);
      return [];
    }
  },

  /**
   * Explore latest skills on ClawHub
   */
  async explore(): Promise<MarketplaceItem[]> {
    try {
      const { stdout } = await execAsync(`npx clawhub explore`, { timeout: 30000 });
      // Parse explore output similar to search
      return this.parseTextOutput(stdout);
    } catch (error: any) {
      console.error('ClawHub explore error:', error.message);
      return [];
    }
  },

  /**
   * Install skill from ClawHub
   */
  async install(slug: string, targetDir?: string): Promise<InstallResult> {
    try {
      const dir = targetDir ? `--dir ${targetDir}` : '';
      const { stdout, stderr } = await execAsync(`npx clawhub install ${dir} "${slug}"`, {
        timeout: 120000
      });
      return {
        success: true,
        message: `Successfully installed ${slug} from ClawHub`,
        item: { id: slug, name: slug, description: '', source: 'clawhub', type: 'skill', installed: true }
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to install ${slug}: ${error.message}`
      };
    }
  },

  /**
   * Uninstall skill
   */
  async uninstall(slug: string): Promise<boolean> {
    try {
      await execAsync(`npx clawhub uninstall "${slug}"`, { timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Update installed skills
   */
  async update(slug?: string): Promise<boolean> {
    try {
      const cmd = slug ? `npx clawhub update "${slug}"` : 'npx clawhub update';
      await execAsync(cmd, { timeout: 120000 });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Inspect skill details
   */
  async inspect(slug: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`npx clawhub inspect "${slug}"`, { timeout: 30000 });
      return { success: true, data: stdout };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  },

  /**
   * Parse text output from ClawHub CLI
   */
  parseTextOutput(text: string): MarketplaceItem[] {
    const lines = text.split('\n').filter(l => l.trim());
    const items: MarketplaceItem[] = [];
    
    for (const line of lines) {
      // Match patterns like "skill-name - Description here" or "• skill-name: Description"
      const match = line.match(/^[\s•]*([a-zA-Z0-9_-]+)[\s:-]+(.+)$/);
      if (match) {
        items.push({
          id: match[1].toLowerCase(),
          name: match[1],
          description: match[2].trim(),
          source: 'clawhub' as const,
          type: 'skill' as const
        });
      }
    }
    return items;
  }
};

// ============================================
// UNIFIED MARKETPLACE API
// ============================================
export const UnifiedMarketplace = {
  /**
   * Search both Smithery and ClawHub
   */
  async search(query: string, filters?: {
    source?: 'smithery' | 'clawhub' | 'all';
    type?: 'mcp-server' | 'tool' | 'skill' | 'all';
  }): Promise<MarketplaceItem[]> {
    const source = filters?.source || 'all';
    const results: MarketplaceItem[] = [];

    if (source === 'all' || source === 'smithery') {
      const smitheryResults = await SmitheryMarketplace.search(query);
      results.push(...smitheryResults);
    }

    if (source === 'all' || source === 'clawhub') {
      const clawhubResults = await ClawHubMarketplace.search(query);
      results.push(...clawhubResults);
    }

    // Filter by type if specified
    if (filters?.type && filters.type !== 'all') {
      return results.filter(item => item.type === filters.type);
    }

    return results;
  },

  /**
   * List all installed items from both marketplaces
   */
  async listInstalled(): Promise<MarketplaceItem[]> {
    const [smitheryItems, clawhubItems] = await Promise.all([
      SmitheryMarketplace.list(),
      ClawHubMarketplace.list()
    ]);
    return [...smitheryItems, ...clawhubItems];
  },

  /**
   * Install item from either marketplace
   */
  async install(itemId: string, source: 'smithery' | 'clawhub', options?: {
    targetDir?: string;
  }): Promise<InstallResult> {
    if (source === 'smithery') {
      return SmitheryMarketplace.install(itemId);
    } else {
      return ClawHubMarketplace.install(itemId, options?.targetDir);
    }
  },

  /**
   * Get featured/trending items from both
   */
  async getFeatured(): Promise<{ smithery: MarketplaceItem[]; clawhub: MarketplaceItem[] }> {
    const [smithery, clawhub] = await Promise.all([
      SmitheryMarketplace.search('featured'),
      ClawHubMarketplace.explore()
    ]);
    return { smithery, clawhub };
  }
};

// ============================================
// VET SCANNER - Security Analysis
// ============================================
export const VetScanner = {
  /**
   * Scan an item for security issues (comprehensive malware detection)
   */
  async scan(itemId: string, source: 'smithery' | 'clawhub'): Promise<VetResult> {
    const findings: string[] = [];
    const recommendations: string[] = [];
    let score = 100;

    try {
      // Get item details
      let itemData: any = {};
      if (source === 'smithery') {
        const { stdout } = await execAsync(`npx @smithery/cli mcp get "${itemId}" --json 2>/dev/null || echo "{}"`, { timeout: 30000 });
        itemData = JSON.parse(stdout);
      } else {
        const result = await ClawHubMarketplace.inspect(itemId);
        itemData = result.data || {};
      }

      // Security checks
      const textToAnalyze = JSON.stringify(itemData).toLowerCase();

      // 1. Check for dangerous patterns
      const dangerousPatterns = [
        { pattern: /eval\s*\(/, finding: 'Uses eval() - potential code injection risk', score: -30 },
        { pattern: /exec\s*\(/, finding: 'Uses exec() - command injection risk', score: -25 },
        { pattern: /child_process/, finding: 'Spawns child processes', score: -20 },
        { pattern: /rm\s+-rf/, finding: 'Contains destructive file operations', score: -40 },
        { pattern: /sudo\s+/, finding: 'Requires sudo privileges', score: -15 },
        { pattern: /curl.*\|.*sh/, finding: 'Remote code execution pattern', score: -50 },
        { pattern: /wget.*\|.*bash/, finding: 'Remote code execution pattern', score: -50 },
        { pattern: /\.\.\/\.\.\//, finding: 'Path traversal vulnerability', score: -35 },
        { pattern: /password\s*=/, finding: 'May contain hardcoded passwords', score: -25 },
        { pattern: /api[_-]?key\s*=/, finding: 'May contain hardcoded API keys', score: -20 },
        { pattern: /secret\s*=/, finding: 'May contain hardcoded secrets', score: -20 },
        { pattern: /token\s*=/, finding: 'May contain hardcoded tokens', score: -20 },
        { pattern: /process\.env/, finding: 'Accesses environment variables', score: -5 },
        { pattern: /fs\.readFile/, finding: 'Reads files from system', score: -10 },
        { pattern: /fs\.writeFile/, finding: 'Writes files to system', score: -10 },
        { pattern: /network|http|fetch/, finding: 'Makes network requests', score: -5 },
        { pattern: /crypto/, finding: 'Uses cryptographic functions', score: -5 },
        { pattern: /shell|bash|powershell/, finding: 'Shell command execution', score: -15 }
      ];

      for (const { pattern, finding, score: penalty } of dangerousPatterns) {
        if (pattern.test(textToAnalyze)) {
          findings.push(finding);
          score += penalty;
        }
      }

      // 2. Check for suspicious dependencies
      const suspiciousDeps = ['keylogger', 'screen-capture', 'clipboard', 'credential', 'stealer'];
      for (const dep of suspiciousDeps) {
        if (textToAnalyze.includes(dep)) {
          findings.push(`Suspicious dependency detected: ${dep}`);
          score -= 30;
        }
      }

      // 3. Check verification status
      if (itemData.verified === false) {
        findings.push('Item is not verified by marketplace');
        score -= 10;
        recommendations.push('Verify item authenticity before use');
      }

      // 4. Check for obfuscated code indicators
      if (/\\x[0-9a-f]{2}/i.test(textToAnalyze) || /atob\(|btoa\(/.test(textToAnalyze)) {
        findings.push('Possible obfuscated code detected');
        score -= 25;
        recommendations.push('Review source code manually before using');
      }

      // 5. Determine risk status
      let status: VetResult['status'];
      if (score >= 90) status = 'safe';
      else if (score >= 70) status = 'low-risk';
      else if (score >= 50) status = 'medium-risk';
      else if (score >= 30) status = 'high-risk';
      else status = 'critical';

      // 6. Add general recommendations
      if (findings.length > 0) {
        recommendations.push('Review all permissions before granting access');
        recommendations.push('Test in a sandboxed environment first');
      }
      if (score < 70) {
        recommendations.push('Consider alternatives with better security scores');
      }

      return {
        itemId,
        status,
        score: Math.max(0, Math.min(100, score)),
        findings,
        recommendations,
        scannedAt: new Date()
      };
    } catch (error: any) {
      return {
        itemId,
        status: 'medium-risk',
        score: 50,
        findings: [`Scan error: ${error.message}`],
        recommendations: ['Manual review recommended'],
        scannedAt: new Date()
      };
    }
  },

  /**
   * Quick scan - just basic checks
   */
  async quickScan(itemId: string, source: 'smithery' | 'clawhub'): Promise<{ safe: boolean; score: number }> {
    const result = await this.scan(itemId, source);
    return {
      safe: result.score >= 70,
      score: result.score
    };
  }
};

// ============================================
// EXPORTS
// ============================================
export default {
  SmitheryMarketplace,
  ClawHubMarketplace,
  UnifiedMarketplace,
  VetScanner
};
