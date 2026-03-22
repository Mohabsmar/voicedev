/**
 * VoiceDev - Extreme Core 20 Tools
 * Pre-installed essential tools for every AI agent
 * These are always available without any installation
 */

// ============================================
// EXTREME CORE 20 TOOLS DEFINITION
// ============================================
export const EXTREME_CORE_20 = [
  // === AI & LLM (4 tools) ===
  {
    id: 'ai_chat',
    name: 'AI Chat',
    description: 'Send messages to AI models and get responses',
    category: 'ai',
    icon: 'message-square',
    priority: 1,
    enabled: true,
    parameters: {
      message: { type: 'string', required: true, description: 'Message to send' },
      model: { type: 'string', required: false, default: 'gpt-4', description: 'Model to use' },
      system: { type: 'string', required: false, description: 'System prompt' }
    }
  },
  {
    id: 'ai_embed',
    name: 'AI Embed',
    description: 'Generate embeddings for text',
    category: 'ai',
    icon: 'hash',
    priority: 2,
    enabled: true,
    parameters: {
      text: { type: 'string', required: true, description: 'Text to embed' },
      model: { type: 'string', required: false, default: 'text-embedding-3-small' }
    }
  },
  {
    id: 'ai_complete',
    name: 'AI Complete',
    description: 'Text completion with AI',
    category: 'ai',
    icon: 'sparkles',
    priority: 3,
    enabled: true,
    parameters: {
      prompt: { type: 'string', required: true },
      maxTokens: { type: 'number', required: false, default: 1000 }
    }
  },
  {
    id: 'ai_vision',
    name: 'AI Vision',
    description: 'Analyze images with AI',
    category: 'ai',
    icon: 'eye',
    priority: 4,
    enabled: true,
    parameters: {
      image: { type: 'string', required: true, description: 'Image URL or base64' },
      prompt: { type: 'string', required: false, description: 'What to analyze' }
    }
  },

  // === FILE SYSTEM (5 tools) ===
  {
    id: 'fs_read',
    name: 'File Read',
    description: 'Read file contents',
    category: 'filesystem',
    icon: 'file-text',
    priority: 5,
    enabled: true,
    parameters: {
      path: { type: 'string', required: true, description: 'File path' },
      encoding: { type: 'string', required: false, default: 'utf-8' }
    }
  },
  {
    id: 'fs_write',
    name: 'File Write',
    description: 'Write content to file',
    category: 'filesystem',
    icon: 'save',
    priority: 6,
    enabled: true,
    parameters: {
      path: { type: 'string', required: true },
      content: { type: 'string', required: true }
    }
  },
  {
    id: 'fs_list',
    name: 'Directory List',
    description: 'List directory contents',
    category: 'filesystem',
    icon: 'folder-open',
    priority: 7,
    enabled: true,
    parameters: {
      path: { type: 'string', required: true },
      recursive: { type: 'boolean', required: false, default: false }
    }
  },
  {
    id: 'fs_delete',
    name: 'File Delete',
    description: 'Delete files or directories',
    category: 'filesystem',
    icon: 'trash-2',
    priority: 8,
    enabled: true,
    parameters: {
      path: { type: 'string', required: true },
      force: { type: 'boolean', required: false, default: false }
    }
  },
  {
    id: 'fs_copy',
    name: 'File Copy',
    description: 'Copy files or directories',
    category: 'filesystem',
    icon: 'copy',
    priority: 9,
    enabled: true,
    parameters: {
      source: { type: 'string', required: true },
      destination: { type: 'string', required: true }
    }
  },

  // === SHELL & PROCESS (3 tools) ===
  {
    id: 'shell_exec',
    name: 'Shell Execute',
    description: 'Execute shell commands',
    category: 'shell',
    icon: 'terminal',
    priority: 10,
    enabled: true,
    parameters: {
      command: { type: 'string', required: true },
      cwd: { type: 'string', required: false },
      timeout: { type: 'number', required: false, default: 30000 }
    }
  },
  {
    id: 'process_list',
    name: 'Process List',
    description: 'List running processes',
    category: 'shell',
    icon: 'activity',
    priority: 11,
    enabled: true,
    parameters: {
      filter: { type: 'string', required: false }
    }
  },
  {
    id: 'process_kill',
    name: 'Process Kill',
    description: 'Kill a process by PID',
    category: 'shell',
    icon: 'x-circle',
    priority: 12,
    enabled: true,
    parameters: {
      pid: { type: 'number', required: true },
      signal: { type: 'string', required: false, default: 'SIGTERM' }
    }
  },

  // === WEB & HTTP (3 tools) ===
  {
    id: 'http_get',
    name: 'HTTP GET',
    description: 'Make HTTP GET request',
    category: 'web',
    icon: 'download',
    priority: 13,
    enabled: true,
    parameters: {
      url: { type: 'string', required: true },
      headers: { type: 'object', required: false }
    }
  },
  {
    id: 'http_post',
    name: 'HTTP POST',
    description: 'Make HTTP POST request',
    category: 'web',
    icon: 'upload',
    priority: 14,
    enabled: true,
    parameters: {
      url: { type: 'string', required: true },
      body: { type: 'object', required: false },
      headers: { type: 'object', required: false }
    }
  },
  {
    id: 'web_scrape',
    name: 'Web Scrape',
    description: 'Scrape content from webpage',
    category: 'web',
    icon: 'globe',
    priority: 15,
    enabled: true,
    parameters: {
      url: { type: 'string', required: true },
      selector: { type: 'string', required: false }
    }
  },

  // === DATA & JSON (3 tools) ===
  {
    id: 'json_parse',
    name: 'JSON Parse',
    description: 'Parse JSON string to object',
    category: 'data',
    icon: 'braces',
    priority: 16,
    enabled: true,
    parameters: {
      json: { type: 'string', required: true }
    }
  },
  {
    id: 'json_stringify',
    name: 'JSON Stringify',
    description: 'Convert object to JSON string',
    category: 'data',
    icon: 'file-json',
    priority: 17,
    enabled: true,
    parameters: {
      value: { type: 'any', required: true },
      pretty: { type: 'boolean', required: false, default: true }
    }
  },
  {
    id: 'data_transform',
    name: 'Data Transform',
    description: 'Transform data with operations',
    category: 'data',
    icon: 'git-branch',
    priority: 18,
    enabled: true,
    parameters: {
      input: { type: 'any', required: true },
      operations: { type: 'array', required: true, description: 'List of transformation operations' }
    }
  },

  // === CODE (2 tools) ===
  {
    id: 'code_exec',
    name: 'Code Execute',
    description: 'Execute code in sandbox',
    category: 'code',
    icon: 'play',
    priority: 19,
    enabled: true,
    parameters: {
      code: { type: 'string', required: true },
      language: { type: 'string', required: false, default: 'javascript' }
    }
  },
  {
    id: 'code_format',
    name: 'Code Format',
    description: 'Format code with prettier',
    category: 'code',
    icon: 'align-left',
    priority: 20,
    enabled: true,
    parameters: {
      code: { type: 'string', required: true },
      language: { type: 'string', required: false, default: 'javascript' }
    }
  }
] as const;

// ============================================
// TOOL CATEGORIES
// ============================================
export const CORE_CATEGORIES = [
  { id: 'ai', name: 'AI & LLM', icon: 'brain', count: 4 },
  { id: 'filesystem', name: 'File System', icon: 'folder', count: 5 },
  { id: 'shell', name: 'Shell & Process', icon: 'terminal', count: 3 },
  { id: 'web', name: 'Web & HTTP', icon: 'globe', count: 3 },
  { id: 'data', name: 'Data & JSON', icon: 'database', count: 3 },
  { id: 'code', name: 'Code', icon: 'code', count: 2 }
] as const;

// ============================================
// TOOL EXECUTOR
// ============================================
export const CoreToolsExecutor = {
  /**
   * Check if tool is a core tool
   */
  isCoreTool(toolId: string): boolean {
    return EXTREME_CORE_20.some(t => t.id === toolId);
  },

  /**
   * Get tool definition
   */
  getTool(toolId: string) {
    return EXTREME_CORE_20.find(t => t.id === toolId);
  },

  /**
   * Get all core tools
   */
  getAllTools() {
    return EXTREME_CORE_20;
  },

  /**
   * Get tools by category
   */
  getToolsByCategory(category: string) {
    return EXTREME_CORE_20.filter(t => t.category === category);
  },

  /**
   * Get tool count
   */
  getToolCount() {
    return EXTREME_CORE_20.length;
  },

  /**
   * Get enabled tools
   */
  getEnabledTools() {
    return EXTREME_CORE_20.filter(t => t.enabled);
  },

  /**
   * Export as OpenAI function format
   */
  toOpenAIFunctions() {
    return EXTREME_CORE_20.map(tool => ({
      type: 'function' as const,
      function: {
        name: tool.id,
        description: tool.description,
        parameters: {
          type: 'object',
          properties: tool.parameters,
          required: Object.entries(tool.parameters)
            .filter(([, config]) => config.required)
            .map(([name]) => name)
        }
      }
    }));
  },

  /**
   * Export as Anthropic tool format
   */
  toAnthropicTools() {
    return EXTREME_CORE_20.map(tool => ({
      name: tool.id,
      description: tool.description,
      input_schema: {
        type: 'object',
        properties: tool.parameters,
        required: Object.entries(tool.parameters)
          .filter(([, config]) => config.required)
          .map(([name]) => name)
      }
    }));
  }
};

export default EXTREME_CORE_20;
