/**
 * VoiceDev Ultimate - 100 Real Working Skills
 * Skills combine tools for higher-level functionality
 */

import { executeTool, ToolResult } from '../tools';

// ============================================
// SKILL TYPES
// ============================================
interface SkillResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  steps: Array<{ tool: string; result: ToolResult }>;
}

interface Skill {
  name: string;
  description: string;
  category: string;
  tools: string[];
  execute: (params: any) => Promise<SkillResult>;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
async function runTool(tool: string, params: any): Promise<ToolResult> {
  return executeTool(tool, params);
}

// ============================================
// DEVELOPMENT SKILLS (20 skills)
// ============================================
export const developmentSkills: Record<string, Skill> = {
  'project-init': {
    name: 'Project Init',
    description: 'Initialize a new project with standard structure',
    category: 'development',
    tools: ['dir_create', 'file_write', 'shell_exec'],
    execute: async (params: { name: string; type: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      await runTool('dir_create', { path: params.name });
      const subdirs = ['src', 'tests', 'docs'];
      for (const dir of subdirs) {
        const result = await runTool('dir_create', { path: `${params.name}/${dir}` });
        steps.push({ tool: 'dir_create', result });
      }
      const packageJson = { name: params.name, version: '1.0.0', main: 'src/index.js' };
      const writeResult = await runTool('file_write', { path: `${params.name}/package.json`, content: JSON.stringify(packageJson, null, 2) });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, data: { path: params.name }, steps };
    }
  },

  'api-test': {
    name: 'API Test',
    description: 'Test an API endpoint and return results',
    category: 'development',
    tools: ['http_get', 'http_post', 'json_parse'],
    execute: async (params: { url: string; method: string; body?: any }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      let result;
      if (params.method === 'GET') {
        result = await runTool('http_get', { url: params.url });
      } else {
        result = await runTool('http_post', { url: params.url, body: params.body });
      }
      steps.push({ tool: `http_${params.method.toLowerCase()}`, result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'git-workflow': {
    name: 'Git Workflow',
    description: 'Complete git workflow: add, commit, push',
    category: 'development',
    tools: ['git_status', 'git_add', 'git_commit', 'git_push'],
    execute: async (params: { message: string; branch?: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const statusResult = await runTool('git_status', { path: params.path });
      steps.push({ tool: 'git_status', result: statusResult });
      const addResult = await runTool('git_add', { files: ['.'], path: params.path });
      steps.push({ tool: 'git_add', result: addResult });
      const commitResult = await runTool('git_commit', { message: params.message, path: params.path });
      steps.push({ tool: 'git_commit', result: commitResult });
      const pushResult = await runTool('git_push', { branch: params.branch, path: params.path });
      steps.push({ tool: 'git_push', result: pushResult });
      return { success: pushResult.success, steps };
    }
  },

  'backup-project': {
    name: 'Backup Project',
    description: 'Create backup archive of project',
    category: 'development',
    tools: ['tar_create', 'file_hash'],
    execute: async (params: { source: string; destination?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const dest = params.destination || `${params.source}-backup-${Date.now()}.tar.gz`;
      const tarResult = await runTool('tar_create', { source: params.source, destination: dest, gzip: true });
      steps.push({ tool: 'tar_create', result: tarResult });
      const hashResult = await runTool('file_hash', { path: dest, algorithm: 'sha256' });
      steps.push({ tool: 'file_hash', result: hashResult });
      return { success: true, data: { backupPath: dest, hash: hashResult.data }, steps };
    }
  },

  'env-setup': {
    name: 'Environment Setup',
    description: 'Setup environment variables from .env file',
    category: 'development',
    tools: ['file_read', 'env_set'],
    execute: async (params: { path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const readResult = await runTool('file_read', { path: params.path });
      steps.push({ tool: 'file_read', result: readResult });
      if (!readResult.success) return { success: false, error: readResult.error, steps };
      const lines = readResult.data.split('\n');
      const envVars: Record<string, string> = {};
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key) {
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            await runTool('env_set', { name: key, value });
            envVars[key] = value;
          }
        }
      }
      return { success: true, data: { variables: envVars, count: Object.keys(envVars).length }, steps };
    }
  },

  'npm-setup': {
    name: 'NPM Setup',
    description: 'Initialize npm project and install dependencies',
    category: 'development',
    tools: ['npm_init', 'npm_install'],
    execute: async (params: { name: string; packages: string[]; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const initResult = await runTool('npm_init', { name: params.name, path: params.path });
      steps.push({ tool: 'npm_init', result: initResult });
      const installResult = await runTool('npm_install', { packages: params.packages, path: params.path });
      steps.push({ tool: 'npm_install', result: installResult });
      return { success: installResult.success, steps };
    }
  },

  'code-format': {
    name: 'Code Format',
    description: 'Format code files using prettier/eslint',
    category: 'development',
    tools: ['shell_exec', 'file_write'],
    execute: async (params: { files: string[]; formatter?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const formatter = params.formatter || 'prettier';
      const result = await runTool('shell_exec', { command: `${formatter} --write ${params.files.join(' ')}` });
      steps.push({ tool: 'shell_exec', result });
      return { success: result.success, steps };
    }
  },

  'run-tests': {
    name: 'Run Tests',
    description: 'Run project tests',
    category: 'development',
    tools: ['shell_exec', 'npm_run'],
    execute: async (params: { path?: string; command?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const cmd = params.command || 'test';
      const result = await runTool('npm_run', { script: cmd, path: params.path });
      steps.push({ tool: 'npm_run', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'build-project': {
    name: 'Build Project',
    description: 'Build the project',
    category: 'development',
    tools: ['npm_run', 'shell_exec'],
    execute: async (params: { path?: string; command?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const cmd = params.command || 'build';
      const result = await runTool('npm_run', { script: cmd, path: params.path });
      steps.push({ tool: 'npm_run', result });
      return { success: result.success, steps };
    }
  },

  'create-component': {
    name: 'Create Component',
    description: 'Create a new component file with boilerplate',
    category: 'development',
    tools: ['file_write', 'dir_create'],
    execute: async (params: { name: string; path: string; type?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const type = params.type || 'react';
      const dir = params.path;
      await runTool('dir_create', { path: dir });
      let content = '';
      if (type === 'react') {
        content = `import React from 'react';\n\nexport const ${params.name} = () => {\n  return <div>${params.name}</div>;\n};\n`;
      } else if (type === 'vue') {
        content = `<template>\n  <div>${params.name}</div>\n</template>\n\n<script>\nexport default { name: '${params.name}' }\n</script>\n`;
      }
      const writeResult = await runTool('file_write', { path: `${dir}/${params.name}.${type === 'vue' ? 'vue' : 'tsx'}`, content });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'setup-linting': {
    name: 'Setup Linting',
    description: 'Configure ESLint and Prettier',
    category: 'development',
    tools: ['npm_install', 'file_write'],
    execute: async (params: { path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const installResult = await runTool('npm_install', { packages: ['eslint', 'prettier'], dev: true, path: params.path });
      steps.push({ tool: 'npm_install', result: installResult });
      const eslintConfig = { extends: ['eslint:recommended'], parserOptions: { ecmaVersion: 2022, sourceType: 'module' } };
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/.eslintrc.json`, content: JSON.stringify(eslintConfig, null, 2) });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'setup-typescript': {
    name: 'Setup TypeScript',
    description: 'Configure TypeScript for project',
    category: 'development',
    tools: ['npm_install', 'file_write'],
    execute: async (params: { path?: string; strict?: boolean }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const installResult = await runTool('npm_install', { packages: ['typescript', '@types/node'], dev: true, path: params.path });
      steps.push({ tool: 'npm_install', result: installResult });
      const tsConfig = { compilerOptions: { target: 'ES2022', module: 'commonjs', strict: params.strict !== false, esModuleInterop: true } };
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/tsconfig.json`, content: JSON.stringify(tsConfig, null, 2) });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'create-readme': {
    name: 'Create README',
    description: 'Generate README.md for project',
    category: 'development',
    tools: ['file_write', 'file_read'],
    execute: async (params: { name: string; description: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const content = `# ${params.name}\n\n${params.description}\n\n## Installation\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nnpm start\n\`\`\`\n\n## License\n\nMIT\n`;
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/README.md`, content });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'setup-ci': {
    name: 'Setup CI',
    description: 'Create CI configuration',
    category: 'development',
    tools: ['file_write', 'dir_create'],
    execute: async (params: { provider?: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const provider = params.provider || 'github';
      await runTool('dir_create', { path: `${params.path || '.'}/.github/workflows` });
      const content = `name: CI\non: [push, pull_request]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n      - run: npm ci\n      - run: npm test\n`;
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/.github/workflows/ci.yml`, content });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'deploy-static': {
    name: 'Deploy Static',
    description: 'Deploy static site to hosting',
    category: 'development',
    tools: ['shell_exec', 'npm_run'],
    execute: async (params: { path: string; provider?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const provider = params.provider || 'netlify';
      const result = await runTool('shell_exec', { command: `${provider} deploy --prod`, cwd: params.path });
      steps.push({ tool: 'shell_exec', result });
      return { success: result.success, steps };
    }
  },

  'generate-docs': {
    name: 'Generate Docs',
    description: 'Generate API documentation',
    category: 'development',
    tools: ['shell_exec', 'file_write'],
    execute: async (params: { path: string; output?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('shell_exec', { command: `npx typedoc --out ${params.output || 'docs'} src`, cwd: params.path });
      steps.push({ tool: 'shell_exec', result });
      return { success: result.success, steps };
    }
  },

  'setup-husky': {
    name: 'Setup Husky',
    description: 'Configure Git hooks with Husky',
    category: 'development',
    tools: ['npm_install', 'shell_exec', 'file_write'],
    execute: async (params: { path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const installResult = await runTool('npm_install', { packages: ['husky', 'lint-staged'], dev: true, path: params.path });
      steps.push({ tool: 'npm_install', result: installResult });
      const execResult = await runTool('shell_exec', { command: 'npx husky install && npx husky add .husky/pre-commit "npx lint-staged"', cwd: params.path });
      steps.push({ tool: 'shell_exec', result: execResult });
      return { success: execResult.success, steps };
    }
  },

  'setup-docker': {
    name: 'Setup Docker',
    description: 'Create Dockerfile for project',
    category: 'development',
    tools: ['file_write'],
    execute: async (params: { path?: string; port?: number; nodeVersion?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const content = `FROM node:${params.nodeVersion || '18-alpine'}\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE ${params.port || 3000}\nCMD ["npm", "start"]\n`;
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/Dockerfile`, content });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'create-api-route': {
    name: 'Create API Route',
    description: 'Create API route file',
    category: 'development',
    tools: ['file_write', 'dir_create'],
    execute: async (params: { name: string; path: string; methods?: string[] }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const methods = params.methods || ['GET', 'POST'];
      await runTool('dir_create', { path: `${params.path}/api/${params.name}` });
      const handlers = methods.map(m => `${m.toLowerCase()}: async (req, res) => { res.json({ message: '${params.name} ${m}' }); }`).join(',\n  ');
      const content = `export default {\n  ${handlers}\n};\n`;
      const writeResult = await runTool('file_write', { path: `${params.path}/api/${params.name}/route.js`, content });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },

  'setup-testing': {
    name: 'Setup Testing',
    description: 'Configure testing framework',
    category: 'development',
    tools: ['npm_install', 'file_write'],
    execute: async (params: { path?: string; framework?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const framework = params.framework || 'jest';
      const installResult = await runTool('npm_install', { packages: [framework, '@testing-library/react', '@testing-library/jest-dom'], dev: true, path: params.path });
      steps.push({ tool: 'npm_install', result: installResult });
      const config = { testEnvironment: 'jsdom', setupFilesAfterEnv: ['<rootDir>/jest.setup.js'] };
      const writeResult = await runTool('file_write', { path: `${params.path || '.'}/jest.config.json`, content: JSON.stringify(config, null, 2) });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },
};

// ============================================
// DATA SKILLS (15 skills)
// ============================================
export const dataSkills: Record<string, Skill> = {
  'json-transform': {
    name: 'JSON Transform',
    description: 'Transform JSON data with operations',
    category: 'data',
    tools: ['json_parse', 'json_stringify'],
    execute: async (params: { input: string; operations: Array<{ type: string; path?: string; value?: any }> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      let data = parseResult.data;
      for (const op of params.operations) {
        if (op.type === 'set' && op.path) {
          const parts = op.path.split('.');
          let current = data;
          for (let i = 0; i < parts.length - 1; i++) current = current[parts[i]];
          current[parts[parts.length - 1]] = op.value;
        }
      }
      const stringifyResult = await runTool('json_stringify', { value: data, pretty: true });
      steps.push({ tool: 'json_stringify', result: stringifyResult });
      return { success: true, data: stringifyResult.data, steps };
    }
  },

  'csv-to-json': {
    name: 'CSV to JSON',
    description: 'Convert CSV data to JSON',
    category: 'data',
    tools: ['file_read', 'json_stringify'],
    execute: async (params: { path: string; delimiter?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const readResult = await runTool('file_read', { path: params.path });
      steps.push({ tool: 'file_read', result: readResult });
      if (!readResult.success) return { success: false, error: readResult.error, steps };
      const delimiter = params.delimiter || ',';
      const lines = readResult.data.split('\n').filter((l: string) => l.trim());
      const headers = lines[0].split(delimiter).map((h: string) => h.trim());
      const records = lines.slice(1).map((line: string) => {
        const values = line.split(delimiter);
        const record: Record<string, string> = {};
        headers.forEach((header: string, i: number) => { record[header] = values[i]?.trim() || ''; });
        return record;
      });
      return { success: true, data: records, steps };
    }
  },

  'data-validate': {
    name: 'Data Validate',
    description: 'Validate data against schema',
    category: 'data',
    tools: ['json_parse'],
    execute: async (params: { data: any; schema: Record<string, { type: string; required?: boolean }> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const errors: string[] = [];
      const data = typeof params.data === 'string' ? JSON.parse(params.data) : params.data;
      for (const [key, rules] of Object.entries(params.schema)) {
        const value = data[key];
        if (rules.required && value === undefined) { errors.push(`Missing required field: ${key}`); continue; }
        if (value !== undefined) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rules.type) errors.push(`Field ${key} should be ${rules.type}, got ${actualType}`);
        }
      }
      return { success: errors.length === 0, data: { valid: errors.length === 0, errors }, steps };
    }
  },

  'extract-data': {
    name: 'Extract Data',
    description: 'Extract data from structured text',
    category: 'data',
    tools: ['regex_match'],
    execute: async (params: { text: string; patterns: Record<string, string> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const extracted: Record<string, string[]> = {};
      for (const [name, pattern] of Object.entries(params.patterns)) {
        const result = await runTool('regex_match', { text: params.text, pattern });
        steps.push({ tool: 'regex_match', result });
        extracted[name] = result.data || [];
      }
      return { success: true, data: extracted, steps };
    }
  },

  'merge-json': {
    name: 'Merge JSON',
    description: 'Merge multiple JSON objects',
    category: 'data',
    tools: ['json_parse', 'json_stringify'],
    execute: async (params: { objects: string[]; strategy?: 'deep' | 'shallow' }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parsed: any[] = [];
      for (const obj of params.objects) {
        const result = await runTool('json_parse', { json: obj });
        steps.push({ tool: 'json_parse', result });
        if (result.success) parsed.push(result.data);
      }
      const merged = params.strategy === 'deep' ? parsed.reduce((acc, obj) => deepMerge(acc, obj), {}) : Object.assign({}, ...parsed);
      return { success: true, data: merged, steps };
    }
  },

  'flatten-json': {
    name: 'Flatten JSON',
    description: 'Flatten nested JSON structure',
    category: 'data',
    tools: ['json_parse', 'json_stringify'],
    execute: async (params: { input: string; separator?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      const separator = params.separator || '.';
      const flatten = (obj: any, prefix = ''): Record<string, any> => {
        const result: Record<string, any> = {};
        for (const [key, value] of Object.entries(obj)) {
          const newKey = prefix ? `${prefix}${separator}${key}` : key;
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            Object.assign(result, flatten(value, newKey));
          } else {
            result[newKey] = value;
          }
        }
        return result;
      };
      const flattened = flatten(parseResult.data);
      return { success: true, data: flattened, steps };
    }
  },

  'query-json': {
    name: 'Query JSON',
    description: 'Query JSON with simple path syntax',
    category: 'data',
    tools: ['json_parse', 'json_path'],
    execute: async (params: { input: string; path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const queryResult = await runTool('json_path', { json: parseResult.data, path: params.path });
      steps.push({ tool: 'json_path', result: queryResult });
      return { success: queryResult.success, data: queryResult.data, steps };
    }
  },

  'generate-mock-data': {
    name: 'Generate Mock Data',
    description: 'Generate mock data based on schema',
    category: 'data',
    tools: ['json_stringify'],
    execute: async (params: { schema: Record<string, string>; count?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const count = params.count || 10;
      const generate = (type: string): any => {
        switch (type) {
          case 'string': return Math.random().toString(36).substring(7);
          case 'number': return Math.floor(Math.random() * 1000);
          case 'boolean': return Math.random() > 0.5;
          case 'date': return new Date().toISOString();
          case 'email': return `user${Math.random().toString(36).substring(7)}@example.com`;
          case 'uuid': return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36);
          default: return null;
        }
      };
      const records = Array.from({ length: count }, () => {
        const record: Record<string, any> = {};
        for (const [key, type] of Object.entries(params.schema)) record[key] = generate(type);
        return record;
      });
      return { success: true, data: records, steps };
    }
  },

  'sort-data': {
    name: 'Sort Data',
    description: 'Sort array of objects by key',
    category: 'data',
    tools: ['json_parse', 'json_stringify'],
    execute: async (params: { input: string; key: string; order?: 'asc' | 'desc' }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const sorted = [...parseResult.data].sort((a: any, b: any) => {
        const aVal = a[params.key]; const bVal = b[params.key];
        const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return params.order === 'desc' ? -cmp : cmp;
      });
      return { success: true, data: sorted, steps };
    }
  },

  'filter-data': {
    name: 'Filter Data',
    description: 'Filter array by condition',
    category: 'data',
    tools: ['json_parse', 'json_stringify'],
    execute: async (params: { input: string; key: string; operator: string; value: any }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const filtered = parseResult.data.filter((item: any) => {
        const val = item[params.key];
        switch (params.operator) {
          case 'eq': return val === params.value;
          case 'ne': return val !== params.value;
          case 'gt': return val > params.value;
          case 'lt': return val < params.value;
          case 'gte': return val >= params.value;
          case 'lte': return val <= params.value;
          case 'contains': return String(val).includes(params.value);
          default: return true;
        }
      });
      return { success: true, data: filtered, steps };
    }
  },

  'aggregate-data': {
    name: 'Aggregate Data',
    description: 'Aggregate array data',
    category: 'data',
    tools: ['json_parse'],
    execute: async (params: { input: string; key: string; operation: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const values = parseResult.data.map((item: any) => item[params.key]).filter((v: any) => typeof v === 'number');
      let result: number;
      switch (params.operation) {
        case 'sum': result = values.reduce((a: number, b: number) => a + b, 0); break;
        case 'avg': result = values.reduce((a: number, b: number) => a + b, 0) / values.length; break;
        case 'min': result = Math.min(...values); break;
        case 'max': result = Math.max(...values); break;
        case 'count': result = values.length; break;
        default: result = 0;
      }
      return { success: true, data: { operation: params.operation, key: params.key, result }, steps };
    }
  },

  'group-data': {
    name: 'Group Data',
    description: 'Group array by key',
    category: 'data',
    tools: ['json_parse'],
    execute: async (params: { input: string; key: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const grouped: Record<string, any[]> = {};
      for (const item of parseResult.data) {
        const groupKey = String(item[params.key]);
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(item);
      }
      return { success: true, data: grouped, steps };
    }
  },

  'pivot-data': {
    name: 'Pivot Data',
    description: 'Pivot array data',
    category: 'data',
    tools: ['json_parse'],
    execute: async (params: { input: string; rowKey: string; colKey: string; valueKey: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.input });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const pivoted: Record<string, Record<string, any>> = {};
      for (const item of parseResult.data) {
        const row = item[params.rowKey]; const col = item[params.colKey]; const val = item[params.valueKey];
        if (!pivoted[row]) pivoted[row] = {};
        pivoted[row][col] = val;
      }
      return { success: true, data: pivoted, steps };
    }
  },

  'validate-json-schema': {
    name: 'Validate JSON Schema',
    description: 'Validate JSON against JSON Schema',
    category: 'data',
    tools: ['json_parse'],
    execute: async (params: { data: string; schema: any }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.data });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const errors: string[] = [];
      const data = parseResult.data;
      if (params.schema.type) {
        const actualType = Array.isArray(data) ? 'array' : typeof data;
        if (actualType !== params.schema.type) errors.push(`Expected ${params.schema.type}, got ${actualType}`);
      }
      if (params.schema.required) {
        for (const field of params.schema.required) {
          if (data[field] === undefined) errors.push(`Missing required field: ${field}`);
        }
      }
      return { success: errors.length === 0, data: { valid: errors.length === 0, errors }, steps };
    }
  },

  'export-csv': {
    name: 'Export CSV',
    description: 'Export JSON data as CSV',
    category: 'data',
    tools: ['json_parse', 'file_write'],
    execute: async (params: { data: string; path: string; delimiter?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('json_parse', { json: params.data });
      steps.push({ tool: 'json_parse', result: parseResult });
      if (!parseResult.success) return { success: false, error: parseResult.error, steps };
      const delimiter = params.delimiter || ',';
      const arr = Array.isArray(parseResult.data) ? parseResult.data : [parseResult.data];
      const headers = Object.keys(arr[0] || {});
      const lines = [headers.join(delimiter)];
      for (const item of arr) {
        const values = headers.map(h => String(item[h] ?? ''));
        lines.push(values.join(delimiter));
      }
      const writeResult = await runTool('file_write', { path: params.path, content: lines.join('\n') });
      steps.push({ tool: 'file_write', result: writeResult });
      return { success: true, steps };
    }
  },
};

// Helper for deep merge
function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

// ============================================
// AUTOMATION SKILLS (15 skills)
// ============================================
export const automationSkills: Record<string, Skill> = {
  'batch-rename': {
    name: 'Batch Rename',
    description: 'Rename multiple files with pattern',
    category: 'automation',
    tools: ['dir_list', 'file_rename'],
    execute: async (params: { directory: string; pattern: string; replacement: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      if (!listResult.success) return { success: false, error: listResult.error, steps };
      const renamed: string[] = [];
      for (const file of listResult.data) {
        if (file.includes(params.pattern)) {
          const newName = file.replace(params.pattern, params.replacement);
          const renameResult = await runTool('file_rename', { path: `${params.directory}/${file}`, newName });
          steps.push({ tool: 'file_rename', result: renameResult });
          if (renameResult.success) renamed.push(`${file} -> ${newName}`);
        }
      }
      return { success: true, data: { renamed, count: renamed.length }, steps };
    }
  },

  'cleanup-temp': {
    name: 'Cleanup Temp',
    description: 'Clean temporary files',
    category: 'automation',
    tools: ['file_search', 'file_delete'],
    execute: async (params: { directory: string; olderThanDays?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const patterns = ['*.tmp', '*.temp', '*.log', '*.bak'];
      const allFiles: string[] = [];
      for (const pattern of patterns) {
        const searchResult = await runTool('file_search', { path: params.directory, pattern });
        steps.push({ tool: 'file_search', result: searchResult });
        if (searchResult.success) allFiles.push(...searchResult.data);
      }
      const deleted: string[] = [];
      for (const file of allFiles) {
        const deleteResult = await runTool('file_delete', { path: file });
        steps.push({ tool: 'file_delete', result: deleteResult });
        if (deleteResult.success) deleted.push(file);
      }
      return { success: true, data: { deletedCount: deleted.length, files: deleted }, steps };
    }
  },

  'schedule-task': {
    name: 'Schedule Task',
    description: 'Schedule a task with cron',
    category: 'automation',
    tools: ['cron_add', 'cron_list'],
    execute: async (params: { schedule: string; command: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const addResult = await runTool('cron_add', { schedule: params.schedule, command: params.command });
      steps.push({ tool: 'cron_add', result: addResult });
      if (!addResult.success) return { success: false, error: addResult.error, steps };
      const listResult = await runTool('cron_list', {});
      steps.push({ tool: 'cron_list', result: listResult });
      return { success: true, data: { schedule: params.schedule, command: params.command, crontab: listResult.data }, steps };
    }
  },

  'watch-directory': {
    name: 'Watch Directory',
    description: 'Watch directory for changes',
    category: 'automation',
    tools: ['file_watch'],
    execute: async (params: { path: string; duration?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('file_watch', { path: params.path, duration: params.duration || 60000 });
      steps.push({ tool: 'file_watch', result });
      return { success: true, data: { changes: result.data }, steps };
    }
  },

  'sync-directories': {
    name: 'Sync Directories',
    description: 'Sync files between two directories',
    category: 'automation',
    tools: ['dir_list', 'file_copy', 'file_exists'],
    execute: async (params: { source: string; destination: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const sourceListResult = await runTool('dir_list', { path: params.source, recursive: true });
      steps.push({ tool: 'dir_list', result: sourceListResult });
      if (!sourceListResult.success) return { success: false, error: sourceListResult.error, steps };
      const copied: string[] = [];
      for (const file of sourceListResult.data) {
        const sourcePath = `${params.source}/${file}`;
        const destPath = `${params.destination}/${file}`;
        const existsResult = await runTool('file_exists', { path: destPath });
        if (!existsResult.data) {
          const copyResult = await runTool('file_copy', { source: sourcePath, destination: destPath });
          steps.push({ tool: 'file_copy', result: copyResult });
          copied.push(file);
        }
      }
      return { success: true, data: { copied, count: copied.length }, steps };
    }
  },

  'batch-convert': {
    name: 'Batch Convert',
    description: 'Convert multiple files',
    category: 'automation',
    tools: ['dir_list', 'shell_exec'],
    execute: async (params: { directory: string; fromExt: string; toExt: string; command: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      if (!listResult.success) return { success: false, error: listResult.error, steps };
      const converted: string[] = [];
      for (const file of listResult.data) {
        if (file.endsWith(params.fromExt)) {
          const inputFile = `${params.directory}/${file}`;
          const outputFile = file.replace(params.fromExt, params.toExt);
          const cmd = params.command.replace('{input}', inputFile).replace('{output}', `${params.directory}/${outputFile}`);
          const execResult = await runTool('shell_exec', { command: cmd });
          steps.push({ tool: 'shell_exec', result: execResult });
          if (execResult.success) converted.push(file);
        }
      }
      return { success: true, data: { converted, count: converted.length }, steps };
    }
  },

  'batch-resize-images': {
    name: 'Batch Resize Images',
    description: 'Resize multiple images',
    category: 'automation',
    tools: ['dir_list', 'shell_exec'],
    execute: async (params: { directory: string; width: number; height?: number; outputDir?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      const images = listResult.data?.filter((f: string) => /\.(jpg|jpeg|png|gif|webp)$/i.test(f)) || [];
      const resized: string[] = [];
      for (const img of images) {
        const input = `${params.directory}/${img}`;
        const output = `${params.outputDir || params.directory}/resized_${img}`;
        const size = params.height ? `${params.width}x${params.height}` : `${params.width}`;
        const execResult = await runTool('shell_exec', { command: `convert "${input}" -resize ${size} "${output}"` });
        steps.push({ tool: 'shell_exec', result: execResult });
        if (execResult.success) resized.push(img);
      }
      return { success: true, data: { resized, count: resized.length }, steps };
    }
  },

  'batch-compress': {
    name: 'Batch Compress',
    description: 'Compress multiple files',
    category: 'automation',
    tools: ['dir_list', 'gzip_compress'],
    execute: async (params: { directory: string; pattern?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      const files = listResult.data?.filter((f: string) => !params.pattern || f.includes(params.pattern)) || [];
      const compressed: string[] = [];
      for (const file of files) {
        const result = await runTool('gzip_compress', { path: `${params.directory}/${file}` });
        steps.push({ tool: 'gzip_compress', result });
        if (result.success) compressed.push(file);
      }
      return { success: true, data: { compressed, count: compressed.length }, steps };
    }
  },

  'automated-backup': {
    name: 'Automated Backup',
    description: 'Create automated backup with rotation',
    category: 'automation',
    tools: ['tar_create', 'file_delete', 'dir_list'],
    execute: async (params: { source: string; destination: string; keepCount?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `${params.destination}/backup-${timestamp}.tar.gz`;
      const tarResult = await runTool('tar_create', { source: params.source, destination: backupFile, gzip: true });
      steps.push({ tool: 'tar_create', result: tarResult });
      // Rotation - delete old backups
      const listResult = await runTool('dir_list', { path: params.destination });
      steps.push({ tool: 'dir_list', result: listResult });
      const backups = listResult.data?.filter((f: string) => f.startsWith('backup-') && f.endsWith('.tar.gz')).sort().reverse() || [];
      const toDelete = backups.slice(params.keepCount || 5);
      for (const old of toDelete) {
        const delResult = await runTool('file_delete', { path: `${params.destination}/${old}` });
        steps.push({ tool: 'file_delete', result: delResult });
      }
      return { success: true, data: { backupFile, deletedCount: toDelete.length }, steps };
    }
  },

  'parallel-execute': {
    name: 'Parallel Execute',
    description: 'Execute multiple commands in parallel',
    category: 'automation',
    tools: ['shell_exec'],
    execute: async (params: { commands: string[]; cwd?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const promises = params.commands.map(cmd => runTool('shell_exec', { command: cmd, cwd: params.cwd }));
      const results = await Promise.all(promises);
      results.forEach((result, i) => steps.push({ tool: 'shell_exec', result }));
      return { success: results.every(r => r.success), data: { results }, steps };
    }
  },

  'retry-command': {
    name: 'Retry Command',
    description: 'Execute command with retries',
    category: 'automation',
    tools: ['shell_exec'],
    execute: async (params: { command: string; retries?: number; delay?: number; cwd?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const retries = params.retries || 3;
      const delay = params.delay || 1000;
      let result: ToolResult | undefined;
      for (let i = 0; i < retries; i++) {
        result = await runTool('shell_exec', { command: params.command, cwd: params.cwd });
        steps.push({ tool: 'shell_exec', result });
        if (result.success) break;
        if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
      }
      return { success: result?.success || false, data: result?.data, steps };
    }
  },

  'monitor-process': {
    name: 'Monitor Process',
    description: 'Monitor a process status',
    category: 'automation',
    tools: ['shell_list_processes', 'shell_exec'],
    execute: async (params: { processName: string; interval?: number; count?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const interval = params.interval || 5000;
      const count = params.count || 3;
      const snapshots: any[] = [];
      for (let i = 0; i < count; i++) {
        const result = await runTool('shell_list_processes', { filter: params.processName });
        steps.push({ tool: 'shell_list_processes', result });
        snapshots.push({ time: new Date().toISOString(), output: result.data });
        if (i < count - 1) await new Promise(r => setTimeout(r, interval));
      }
      return { success: true, data: { snapshots }, steps };
    }
  },

  'file-organizer': {
    name: 'File Organizer',
    description: 'Organize files by extension',
    category: 'automation',
    tools: ['dir_list', 'dir_create', 'file_move'],
    execute: async (params: { directory: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      const moved: string[] = [];
      for (const file of listResult.data || []) {
        const ext = file.split('.').pop()?.toLowerCase() || 'other';
        const targetDir = `${params.directory}/${ext}`;
        await runTool('dir_create', { path: targetDir });
        const moveResult = await runTool('file_move', { source: `${params.directory}/${file}`, destination: `${targetDir}/${file}` });
        steps.push({ tool: 'file_move', result: moveResult });
        if (moveResult.success) moved.push(file);
      }
      return { success: true, data: { moved, count: moved.length }, steps };
    }
  },

  'log-rotator': {
    name: 'Log Rotator',
    description: 'Rotate and compress log files',
    category: 'automation',
    tools: ['dir_list', 'gzip_compress', 'file_delete'],
    execute: async (params: { directory: string; pattern?: string; keepCount?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory });
      steps.push({ tool: 'dir_list', result: listResult });
      const logs = listResult.data?.filter((f: string) => f.endsWith('.log') && (!params.pattern || f.includes(params.pattern))) || [];
      const compressed: string[] = [];
      for (const log of logs) {
        const result = await runTool('gzip_compress', { path: `${params.directory}/${log}` });
        steps.push({ tool: 'gzip_compress', result });
        if (result.success) compressed.push(log);
      }
      return { success: true, data: { compressed, count: compressed.length }, steps };
    }
  },

  'download-batch': {
    name: 'Download Batch',
    description: 'Download multiple files',
    category: 'automation',
    tools: ['download_file'],
    execute: async (params: { urls: string[]; destination: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const downloaded: string[] = [];
      for (const url of params.urls) {
        const filename = url.split('/').pop() || `file-${Date.now()}`;
        const result = await runTool('download_file', { url, destination: `${params.destination}/${filename}` });
        steps.push({ tool: 'download_file', result });
        if (result.success) downloaded.push(filename);
      }
      return { success: true, data: { downloaded, count: downloaded.length }, steps };
    }
  },
};

// ============================================
// SECURITY SKILLS (15 skills)
// ============================================
export const securitySkills: Record<string, Skill> = {
  'scan-ports': {
    name: 'Scan Ports',
    description: 'Scan ports on a host',
    category: 'security',
    tools: ['security_scan_ports'],
    execute: async (params: { host: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_scan_ports', { host: params.host });
      steps.push({ tool: 'security_scan_ports', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'check-ssl': {
    name: 'Check SSL',
    description: 'Check SSL certificate for domain',
    category: 'security',
    tools: ['security_check_ssl'],
    execute: async (params: { domain: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_check_ssl', { domain: params.domain });
      steps.push({ tool: 'security_check_ssl', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'hash-files': {
    name: 'Hash Files',
    description: 'Generate hashes for all files in directory',
    category: 'security',
    tools: ['dir_list', 'file_hash'],
    execute: async (params: { directory: string; algorithm?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory, recursive: true });
      steps.push({ tool: 'dir_list', result: listResult });
      if (!listResult.success) return { success: false, error: listResult.error, steps };
      const hashes: Record<string, string> = {};
      for (const file of listResult.data) {
        const fullPath = `${params.directory}/${file}`;
        const hashResult = await runTool('file_hash', { path: fullPath, algorithm: params.algorithm || 'sha256' });
        steps.push({ tool: 'file_hash', result: hashResult });
        if (hashResult.success) hashes[file] = hashResult.data;
      }
      return { success: true, data: hashes, steps };
    }
  },

  'security-audit': {
    name: 'Security Audit',
    description: 'Run comprehensive security audit',
    category: 'security',
    tools: ['security_scan_ports', 'security_check_headers', 'security_check_ssl'],
    execute: async (params: { host: string; url?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const portsResult = await runTool('security_scan_ports', { host: params.host });
      steps.push({ tool: 'security_scan_ports', result: portsResult });
      let headersResult;
      if (params.url) {
        headersResult = await runTool('security_check_headers', { url: params.url });
        steps.push({ tool: 'security_check_headers', result: headersResult });
      }
      return { success: true, data: { ports: portsResult.data, headers: headersResult?.data }, steps };
    }
  },

  'generate-credentials': {
    name: 'Generate Credentials',
    description: 'Generate secure credentials',
    category: 'security',
    tools: ['security_generate_password', 'security_generate_keypair'],
    execute: async (params: { passwordLength?: number; keyBits?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const pwdResult = await runTool('security_generate_password', { length: params.passwordLength || 32, includeSpecial: true });
      steps.push({ tool: 'security_generate_password', result: pwdResult });
      const keyResult = await runTool('security_generate_keypair', { bits: params.keyBits || 2048 });
      steps.push({ tool: 'security_generate_keypair', result: keyResult });
      return { success: true, data: { password: pwdResult.data, keys: keyResult.data }, steps };
    }
  },

  'encrypt-data': {
    name: 'Encrypt Data',
    description: 'Encrypt sensitive data',
    category: 'security',
    tools: ['security_encrypt'],
    execute: async (params: { data: string; key: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_encrypt', { data: params.data, key: params.key });
      steps.push({ tool: 'security_encrypt', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'decrypt-data': {
    name: 'Decrypt Data',
    description: 'Decrypt encrypted data',
    category: 'security',
    tools: ['security_decrypt'],
    execute: async (params: { encrypted: string; iv: string; key: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_decrypt', { encrypted: params.encrypted, iv: params.iv, key: params.key });
      steps.push({ tool: 'security_decrypt', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'create-jwt': {
    name: 'Create JWT',
    description: 'Create JWT token',
    category: 'security',
    tools: ['security_jwt_create'],
    execute: async (params: { payload: object; secret: string; expiresIn?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_jwt_create', { payload: params.payload, secret: params.secret, expiresIn: params.expiresIn });
      steps.push({ tool: 'security_jwt_create', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'verify-jwt': {
    name: 'Verify JWT',
    description: 'Verify JWT token',
    category: 'security',
    tools: ['security_jwt_verify'],
    execute: async (params: { token: string; secret: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_jwt_verify', { token: params.token, secret: params.secret });
      steps.push({ tool: 'security_jwt_verify', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'scan-vulnerabilities': {
    name: 'Scan Vulnerabilities',
    description: 'Scan for known vulnerabilities',
    category: 'security',
    tools: ['security_scan_vulnerabilities'],
    execute: async (params: { path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_scan_vulnerabilities', { path: params.path });
      steps.push({ tool: 'security_scan_vulnerabilities', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'check-secrets': {
    name: 'Check Secrets',
    description: 'Check for exposed secrets',
    category: 'security',
    tools: ['security_check_secrets'],
    execute: async (params: { path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_check_secrets', { path: params.path });
      steps.push({ tool: 'security_check_secrets', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'audit-permissions': {
    name: 'Audit Permissions',
    description: 'Audit file permissions',
    category: 'security',
    tools: ['dir_list', 'file_stats'],
    execute: async (params: { path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.path, recursive: true });
      steps.push({ tool: 'dir_list', result: listResult });
      const issues: string[] = [];
      for (const file of listResult.data || []) {
        const statsResult = await runTool('file_stats', { path: `${params.path}/${file}` });
        steps.push({ tool: 'file_stats', result: statsResult });
        // Check for world-writable files
        if (statsResult.data?.mode && (statsResult.data.mode & 0o002)) {
          issues.push(`World-writable: ${file}`);
        }
      }
      return { success: true, data: { issues, count: issues.length }, steps };
    }
  },

  'firewall-check': {
    name: 'Firewall Check',
    description: 'Check firewall status',
    category: 'security',
    tools: ['security_firewall_status'],
    execute: async (): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_firewall_status', {});
      steps.push({ tool: 'security_firewall_status', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'log-analysis': {
    name: 'Log Analysis',
    description: 'Analyze security logs',
    category: 'security',
    tools: ['security_log_analysis'],
    execute: async (params: { logPath?: string; lines?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('security_log_analysis', { logPath: params.logPath, lines: params.lines });
      steps.push({ tool: 'security_log_analysis', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'sign-data': {
    name: 'Sign Data',
    description: 'Sign data with private key',
    category: 'security',
    tools: ['security_sign', 'security_verify'],
    execute: async (params: { data: string; privateKey: string; publicKey?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const signResult = await runTool('security_sign', { data: params.data, privateKey: params.privateKey });
      steps.push({ tool: 'security_sign', result: signResult });
      return { success: signResult.success, data: signResult.data, steps };
    }
  },
};

// ============================================
// FILE SKILLS (10 skills)
// ============================================
export const fileSkills: Record<string, Skill> = {
  'find-duplicates': {
    name: 'Find Duplicates',
    description: 'Find duplicate files by hash',
    category: 'file',
    tools: ['dir_list', 'file_hash'],
    execute: async (params: { directory: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.directory, recursive: true });
      steps.push({ tool: 'dir_list', result: listResult });
      if (!listResult.success) return { success: false, error: listResult.error, steps };
      const hashMap: Record<string, string[]> = {};
      for (const file of listResult.data) {
        const hashResult = await runTool('file_hash', { path: `${params.directory}/${file}` });
        steps.push({ tool: 'file_hash', result: hashResult });
        if (hashResult.success) {
          if (!hashMap[hashResult.data]) hashMap[hashResult.data] = [];
          hashMap[hashResult.data].push(file);
        }
      }
      const duplicates = Object.entries(hashMap).filter(([_, files]) => files.length > 1).map(([hash, files]) => ({ hash, files }));
      return { success: true, data: { duplicateCount: duplicates.length, duplicates }, steps };
    }
  },

  'file-search': {
    name: 'File Search',
    description: 'Search files by content or name',
    category: 'file',
    tools: ['file_search', 'file_grep'],
    execute: async (params: { directory: string; pattern: string; type?: 'name' | 'content' }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = params.type === 'content'
        ? await runTool('file_grep', { path: params.directory, pattern: params.pattern })
        : await runTool('file_search', { path: params.directory, pattern: params.pattern });
      steps.push({ tool: params.type === 'content' ? 'file_grep' : 'file_search', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'directory-info': {
    name: 'Directory Info',
    description: 'Get comprehensive directory information',
    category: 'file',
    tools: ['dir_list', 'dir_size', 'dir_tree'],
    execute: async (params: { path: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('dir_list', { path: params.path, recursive: true });
      steps.push({ tool: 'dir_list', result: listResult });
      const sizeResult = await runTool('dir_size', { path: params.path });
      steps.push({ tool: 'dir_size', result: sizeResult });
      const treeResult = await runTool('dir_tree', { path: params.path, maxDepth: 3 });
      steps.push({ tool: 'dir_tree', result: treeResult });
      return { success: true, data: { fileCount: listResult.data?.length || 0, size: sizeResult.data, tree: treeResult.data }, steps };
    }
  },

  'archive-create': {
    name: 'Archive Create',
    description: 'Create archive from files',
    category: 'file',
    tools: ['zip_create', 'tar_create'],
    execute: async (params: { source: string; destination: string; format?: 'zip' | 'tar' | 'tar.gz' }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const format = params.format || 'zip';
      let result;
      if (format === 'zip') {
        result = await runTool('zip_create', { source: params.source, destination: params.destination });
      } else {
        result = await runTool('tar_create', { source: params.source, destination: params.destination, gzip: format === 'tar.gz' });
      }
      steps.push({ tool: format === 'zip' ? 'zip_create' : 'tar_create', result });
      return { success: result.success, steps };
    }
  },

  'archive-extract': {
    name: 'Archive Extract',
    description: 'Extract archive',
    category: 'file',
    tools: ['zip_extract', 'tar_extract'],
    execute: async (params: { source: string; destination: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const isZip = params.source.endsWith('.zip');
      const result = isZip
        ? await runTool('zip_extract', { source: params.source, destination: params.destination })
        : await runTool('tar_extract', { source: params.source, destination: params.destination });
      steps.push({ tool: isZip ? 'zip_extract' : 'tar_extract', result });
      return { success: result.success, steps };
    }
  },

  'file-compare': {
    name: 'File Compare',
    description: 'Compare two files',
    category: 'file',
    tools: ['file_diff', 'file_hash'],
    execute: async (params: { file1: string; file2: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const hash1Result = await runTool('file_hash', { path: params.file1 });
      steps.push({ tool: 'file_hash', result: hash1Result });
      const hash2Result = await runTool('file_hash', { path: params.file2 });
      steps.push({ tool: 'file_hash', result: hash2Result });
      const identical = hash1Result.data === hash2Result.data;
      let diffResult;
      if (!identical) {
        diffResult = await runTool('file_diff', { file1: params.file1, file2: params.file2 });
        steps.push({ tool: 'file_diff', result: diffResult });
      }
      return { success: true, data: { identical, diff: diffResult?.data }, steps };
    }
  },

  'batch-copy': {
    name: 'Batch Copy',
    description: 'Copy multiple files',
    category: 'file',
    tools: ['file_copy'],
    execute: async (params: { files: Array<{ source: string; destination: string }> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const copied: string[] = [];
      const failed: string[] = [];
      for (const { source, destination } of params.files) {
        const result = await runTool('file_copy', { source, destination });
        steps.push({ tool: 'file_copy', result });
        if (result.success) copied.push(source);
        else failed.push(source);
      }
      return { success: failed.length === 0, data: { copied, failed }, steps };
    }
  },

  'batch-move': {
    name: 'Batch Move',
    description: 'Move multiple files',
    category: 'file',
    tools: ['file_move'],
    execute: async (params: { files: Array<{ source: string; destination: string }> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const moved: string[] = [];
      const failed: string[] = [];
      for (const { source, destination } of params.files) {
        const result = await runTool('file_move', { source, destination });
        steps.push({ tool: 'file_move', result });
        if (result.success) moved.push(source);
        else failed.push(source);
      }
      return { success: failed.length === 0, data: { moved, failed }, steps };
    }
  },

  'batch-delete': {
    name: 'Batch Delete',
    description: 'Delete multiple files',
    category: 'file',
    tools: ['file_delete'],
    execute: async (params: { files: string[] }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const deleted: string[] = [];
      const failed: string[] = [];
      for (const file of params.files) {
        const result = await runTool('file_delete', { path: file });
        steps.push({ tool: 'file_delete', result });
        if (result.success) deleted.push(file);
        else failed.push(file);
      }
      return { success: failed.length === 0, data: { deleted, failed }, steps };
    }
  },

  'create-structure': {
    name: 'Create Structure',
    description: 'Create directory structure from template',
    category: 'file',
    tools: ['dir_create', 'file_write'],
    execute: async (params: { base: string; structure: Record<string, any> }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const created: string[] = [];
      const createStructure = async (base: string, struct: Record<string, any>) => {
        for (const [name, content] of Object.entries(struct)) {
          const fullPath = `${base}/${name}`;
          if (typeof content === 'string') {
            const result = await runTool('file_write', { path: fullPath, content });
            steps.push({ tool: 'file_write', result });
            created.push(fullPath);
          } else {
            await runTool('dir_create', { path: fullPath });
            await createStructure(fullPath, content);
            created.push(fullPath + '/');
          }
        }
      };
      await createStructure(params.base, params.structure);
      return { success: true, data: { created, count: created.length }, steps };
    }
  },
};

// ============================================
// WEB SKILLS (10 skills)
// ============================================
export const webSkills: Record<string, Skill> = {
  'api-health-check': {
    name: 'API Health Check',
    description: 'Check API health status',
    category: 'web',
    tools: ['http_get', 'http_head'],
    execute: async (params: { url: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('http_get', { url: params.url });
      steps.push({ tool: 'http_get', result });
      return { success: result.success, data: { status: result.metadata?.statusCode, healthy: result.success }, steps };
    }
  },

  'webhook-test': {
    name: 'Webhook Test',
    description: 'Test webhook endpoint',
    category: 'web',
    tools: ['http_post'],
    execute: async (params: { url: string; payload: any }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('http_post', { url: params.url, body: params.payload });
      steps.push({ tool: 'http_post', result });
      return { success: result.success, data: { statusCode: result.metadata?.statusCode, response: result.data }, steps };
    }
  },

  'crawl-page': {
    name: 'Crawl Page',
    description: 'Crawl web page content',
    category: 'web',
    tools: ['http_get', 'regex_match'],
    execute: async (params: { url: string; selectors?: string[] }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('http_get', { url: params.url });
      steps.push({ tool: 'http_get', result });
      if (!result.success) return { success: false, error: result.error, steps };
      const links = result.data?.match(/href="([^"]+)"/g) || [];
      return { success: true, data: { links: links.slice(0, 20), contentLength: result.data?.length }, steps };
    }
  },

  'api-benchmark': {
    name: 'API Benchmark',
    description: 'Benchmark API response time',
    category: 'web',
    tools: ['http_get'],
    execute: async (params: { url: string; iterations?: number }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const iterations = params.iterations || 5;
      const times: number[] = [];
      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        const result = await runTool('http_get', { url: params.url });
        times.push(Date.now() - start);
        steps.push({ tool: 'http_get', result });
      }
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      return { success: true, data: { times, average: avg, min: Math.min(...times), max: Math.max(...times) }, steps };
    }
  },

  'check-availability': {
    name: 'Check Availability',
    description: 'Check website availability',
    category: 'web',
    tools: ['http_head', 'ping'],
    execute: async (params: { host: string; url: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const headResult = await runTool('http_head', { url: params.url });
      steps.push({ tool: 'http_head', result: headResult });
      const pingResult = await runTool('ping', { host: params.host, count: 2 });
      steps.push({ tool: 'ping', result: pingResult });
      return { success: headResult.success, data: { http: headResult.success, ping: pingResult.success }, steps };
    }
  },

  'dns-check': {
    name: 'DNS Check',
    description: 'Check DNS configuration',
    category: 'web',
    tools: ['dns_lookup', 'dns_reverse'],
    execute: async (params: { domain: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const lookupResult = await runTool('dns_lookup', { hostname: params.domain });
      steps.push({ tool: 'dns_lookup', result: lookupResult });
      return { success: lookupResult.success, data: { addresses: lookupResult.data }, steps };
    }
  },

  'ssl-verify': {
    name: 'SSL Verify',
    description: 'Verify SSL certificate',
    category: 'web',
    tools: ['ssl_check', 'security_check_ssl'],
    execute: async (params: { domain: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('ssl_check', { domain: params.domain });
      steps.push({ tool: 'ssl_check', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'http-debug': {
    name: 'HTTP Debug',
    description: 'Debug HTTP request/response',
    category: 'web',
    tools: ['http_get', 'http_head', 'curl'],
    execute: async (params: { url: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const getResult = await runTool('http_get', { url: params.url });
      steps.push({ tool: 'http_get', result: getResult });
      const headResult = await runTool('http_head', { url: params.url });
      steps.push({ tool: 'http_head', result: headResult });
      return { success: true, data: { statusCode: getResult.metadata?.statusCode, headers: headResult.data, bodyLength: getResult.data?.length }, steps };
    }
  },

  'url-info': {
    name: 'URL Info',
    description: 'Get URL information',
    category: 'web',
    tools: ['url_parse', 'dns_lookup', 'ip_lookup'],
    execute: async (params: { url: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const parseResult = await runTool('url_parse', { url: params.url });
      steps.push({ tool: 'url_parse', result: parseResult });
      if (parseResult.success && parseResult.data?.hostname) {
        const dnsResult = await runTool('dns_lookup', { hostname: parseResult.data.hostname });
        steps.push({ tool: 'dns_lookup', result: dnsResult });
      }
      return { success: true, data: parseResult.data, steps };
    }
  },

  'download-file': {
    name: 'Download File',
    description: 'Download file from URL',
    category: 'web',
    tools: ['download_file', 'file_hash'],
    execute: async (params: { url: string; destination: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const downloadResult = await runTool('download_file', { url: params.url, destination: params.destination });
      steps.push({ tool: 'download_file', result: downloadResult });
      if (downloadResult.success) {
        const hashResult = await runTool('file_hash', { path: params.destination });
        steps.push({ tool: 'file_hash', result: hashResult });
        return { success: true, data: { path: params.destination, hash: hashResult.data }, steps };
      }
      return { success: false, error: downloadResult.error, steps };
    }
  },
};

// ============================================
// GIT SKILLS (10 skills)
// ============================================
export const gitSkills: Record<string, Skill> = {
  'git-quick-commit': {
    name: 'Git Quick Commit',
    description: 'Quick add, commit, and push',
    category: 'git',
    tools: ['git_add', 'git_commit', 'git_push'],
    execute: async (params: { message: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      await runTool('git_add', { files: ['.'], path: params.path });
      const commitResult = await runTool('git_commit', { message: params.message, path: params.path });
      steps.push({ tool: 'git_commit', result: commitResult });
      const pushResult = await runTool('git_push', { path: params.path });
      steps.push({ tool: 'git_push', result: pushResult });
      return { success: pushResult.success, steps };
    }
  },

  'git-create-branch': {
    name: 'Git Create Branch',
    description: 'Create and switch to new branch',
    category: 'git',
    tools: ['git_branch', 'git_checkout'],
    execute: async (params: { name: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const branchResult = await runTool('git_branch', { name: params.name, path: params.path });
      steps.push({ tool: 'git_branch', result: branchResult });
      const checkoutResult = await runTool('git_checkout', { branch: params.name, path: params.path });
      steps.push({ tool: 'git_checkout', result: checkoutResult });
      return { success: checkoutResult.success, steps };
    }
  },

  'git-sync': {
    name: 'Git Sync',
    description: 'Fetch and pull latest changes',
    category: 'git',
    tools: ['git_fetch', 'git_pull'],
    execute: async (params: { path?: string; remote?: string; branch?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const fetchResult = await runTool('git_fetch', { remote: params.remote, path: params.path });
      steps.push({ tool: 'git_fetch', result: fetchResult });
      const pullResult = await runTool('git_pull', { remote: params.remote, branch: params.branch, path: params.path });
      steps.push({ tool: 'git_pull', result: pullResult });
      return { success: pullResult.success, steps };
    }
  },

  'git-tag-release': {
    name: 'Git Tag Release',
    description: 'Create release tag',
    category: 'git',
    tools: ['git_tag', 'git_push'],
    execute: async (params: { version: string; message: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const tagResult = await runTool('git_tag', { name: params.version, message: params.message, path: params.path });
      steps.push({ tool: 'git_tag', result: tagResult });
      const pushResult = await runTool('git_push', { remote: 'origin', branch: `--tags`, path: params.path });
      steps.push({ tool: 'git_push', result: pushResult });
      return { success: pushResult.success, steps };
    }
  },

  'git-status-report': {
    name: 'Git Status Report',
    description: 'Get detailed repository status',
    category: 'git',
    tools: ['git_status', 'git_log', 'git_branch'],
    execute: async (params: { path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const statusResult = await runTool('git_status', { path: params.path });
      steps.push({ tool: 'git_status', result: statusResult });
      const logResult = await runTool('git_log', { count: 5, path: params.path });
      steps.push({ tool: 'git_log', result: logResult });
      const branchResult = await runTool('git_branch', { path: params.path });
      steps.push({ tool: 'git_branch', result: branchResult });
      return { success: true, data: { status: statusResult.data, recentCommits: logResult.data, branches: branchResult.data }, steps };
    }
  },

  'git-undo-commit': {
    name: 'Git Undo Commit',
    description: 'Undo last commit',
    category: 'git',
    tools: ['git_reset'],
    execute: async (params: { soft?: boolean; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const mode = params.soft ? '--soft' : '--mixed';
      const result = await runTool('git_reset', { commit: 'HEAD~1', mode, path: params.path });
      steps.push({ tool: 'git_reset', result });
      return { success: result.success, steps };
    }
  },

  'git-stash-work': {
    name: 'Git Stash Work',
    description: 'Stash current work',
    category: 'git',
    tools: ['git_stash', 'git_status'],
    execute: async (params: { message?: string; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const stashResult = await runTool('git_stash', { message: params.message, path: params.path });
      steps.push({ tool: 'git_stash', result: stashResult });
      return { success: stashResult.success, steps };
    }
  },

  'git-apply-stash': {
    name: 'Git Apply Stash',
    description: 'Apply stashed changes',
    category: 'git',
    tools: ['git_stash_list', 'git_stash_pop'],
    execute: async (params: { index?: number; path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const listResult = await runTool('git_stash_list', { path: params.path });
      steps.push({ tool: 'git_stash_list', result: listResult });
      const popResult = await runTool('git_stash_pop', { index: params.index, path: params.path });
      steps.push({ tool: 'git_stash_pop', result: popResult });
      return { success: popResult.success, steps };
    }
  },

  'git-clean-branches': {
    name: 'Git Clean Branches',
    description: 'Clean up merged branches',
    category: 'git',
    tools: ['git_branch', 'shell_exec'],
    execute: async (params: { path?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('shell_exec', { command: 'git branch --merged main | grep -v main | xargs git branch -d', cwd: params.path });
      steps.push({ tool: 'shell_exec', result });
      return { success: result.success, steps };
    }
  },

  'git-clone-setup': {
    name: 'Git Clone Setup',
    description: 'Clone and setup repository',
    category: 'git',
    tools: ['git_clone', 'npm_install'],
    execute: async (params: { url: string; destination?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const dest = params.destination || params.url.split('/').pop()?.replace('.git', '') || 'repo';
      const cloneResult = await runTool('git_clone', { url: params.url, destination: dest });
      steps.push({ tool: 'git_clone', result: cloneResult });
      const installResult = await runTool('npm_install', { packages: [], path: dest });
      steps.push({ tool: 'npm_install', result: installResult });
      return { success: true, data: { path: dest }, steps };
    }
  },
};

// ============================================
// DATABASE SKILLS (5 skills)
// ============================================
export const databaseSkills: Record<string, Skill> = {
  'sqlite-export': {
    name: 'SQLite Export',
    description: 'Export SQLite table to JSON',
    category: 'database',
    tools: ['sqlite_query', 'json_stringify'],
    execute: async (params: { database: string; table: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('sqlite_query', { database: params.database, query: `SELECT * FROM ${params.table}` });
      steps.push({ tool: 'sqlite_query', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'redis-backup': {
    name: 'Redis Backup',
    description: 'Backup Redis keys',
    category: 'database',
    tools: ['redis_keys', 'redis_get', 'json_stringify'],
    execute: async (params: { pattern?: string; host?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const keysResult = await runTool('redis_keys', { pattern: params.pattern || '*', host: params.host });
      steps.push({ tool: 'redis_keys', result: keysResult });
      const backup: Record<string, string> = {};
      for (const key of keysResult.data || []) {
        const valueResult = await runTool('redis_get', { key, host: params.host });
        backup[key] = valueResult.data || '';
      }
      return { success: true, data: backup, steps };
    }
  },

  'postgres-info': {
    name: 'Postgres Info',
    description: 'Get PostgreSQL database info',
    category: 'database',
    tools: ['postgres_tables', 'postgres_query'],
    execute: async (params: { database?: string; host?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const tablesResult = await runTool('postgres_tables', { database: params.database, host: params.host });
      steps.push({ tool: 'postgres_tables', result: tablesResult });
      const sizeResult = await runTool('postgres_query', { query: "SELECT pg_size_pretty(pg_database_size(current_database()))", database: params.database, host: params.host });
      steps.push({ tool: 'postgres_query', result: sizeResult });
      return { success: true, data: { tables: tablesResult.data, size: sizeResult.data }, steps };
    }
  },

  'mongo-export': {
    name: 'Mongo Export',
    description: 'Export MongoDB collection',
    category: 'database',
    tools: ['mongo_query'],
    execute: async (params: { database: string; collection: string; query?: string; host?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('mongo_query', { database: params.database, collection: params.collection, query: params.query || '{}', host: params.host });
      steps.push({ tool: 'mongo_query', result });
      return { success: result.success, data: result.data, steps };
    }
  },

  'elastic-search': {
    name: 'Elastic Search',
    description: 'Search Elasticsearch index',
    category: 'database',
    tools: ['elastic_search'],
    execute: async (params: { index: string; query: string; host?: string }): Promise<SkillResult> => {
      const steps: SkillResult['steps'] = [];
      const result = await runTool('elastic_search', { index: params.index, query: params.query, host: params.host });
      steps.push({ tool: 'elastic_search', result });
      return { success: result.success, data: result.data, steps };
    }
  },
};

// ============================================
// ALL SKILLS REGISTRY
// ============================================
export const allSkills: Record<string, Skill> = {
  ...developmentSkills,
  ...dataSkills,
  ...automationSkills,
  ...securitySkills,
  ...fileSkills,
  ...webSkills,
  ...gitSkills,
  ...databaseSkills,
};

// Skill count
export const SKILL_COUNT = Object.keys(allSkills).length;

// Get skill by name
export function getSkill(name: string): Skill | undefined {
  return allSkills[name];
}

// Execute skill by name
export async function executeSkill(name: string, params: any): Promise<SkillResult> {
  const skill = getSkill(name);
  if (!skill) {
    return { success: false, error: `Skill not found: ${name}`, steps: [] };
  }
  return skill.execute(params);
}

// List all skills
export function listSkills(): string[] {
  return Object.keys(allSkills);
}

// Count skills
export function countSkills(): number {
  return Object.keys(allSkills).length;
}

// Get skills by category
export function getSkillsByCategory() {
  return {
    development: Object.keys(developmentSkills),
    data: Object.keys(dataSkills),
    automation: Object.keys(automationSkills),
    security: Object.keys(securitySkills),
    file: Object.keys(fileSkills),
    web: Object.keys(webSkills),
    git: Object.keys(gitSkills),
    database: Object.keys(databaseSkills),
  };
}

export default allSkills;
