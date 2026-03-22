/**
 * VoiceDev - Real Multi-Provider AI Client
 * Makes actual API calls to each provider
 */

// Provider configurations
const PROVIDERS = {
  openai: {
    baseUrl: 'https://api.openai.com/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'OPENAI_API_KEY',
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com/v1/messages',
    authHeader: 'x-api-key',
    authPrefix: '',
    envKey: 'ANTHROPIC_API_KEY',
  },
  google: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
    authHeader: 'x-goog-api-key',
    authPrefix: '',
    envKey: 'GOOGLE_API_KEY',
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'DEEPSEEK_API_KEY',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'GROQ_API_KEY',
  },
  mistral: {
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'MISTRAL_API_KEY',
  },
  xai: {
    baseUrl: 'https://api.x.ai/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'XAI_API_KEY',
  },
  cohere: {
    baseUrl: 'https://api.cohere.ai/v2/chat',
    authHeader: 'Authorization',
    authPrefix: 'bearer ',
    envKey: 'COHERE_API_KEY',
  },
  moonshot: {
    baseUrl: 'https://api.moonshot.cn/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'MOONSHOT_API_KEY',
  },
  minimax: {
    baseUrl: 'https://api.minimax.chat/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'MINIMAX_API_KEY',
  },
  qwen: {
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'QWEN_API_KEY',
  },
  glm: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'GLM_API_KEY',
  },
  together: {
    baseUrl: 'https://api.together.xyz/v1/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'TOGETHER_API_KEY',
  },
  replicate: {
    baseUrl: 'https://api.replicate.com/v1/predictions',
    authHeader: 'Authorization',
    authPrefix: 'Token ',
    envKey: 'REPLICATE_API_TOKEN',
  },
  elevenlabs: {
    baseUrl: 'https://api.elevenlabs.io/v1',
    authHeader: 'xi-api-key',
    authPrefix: '',
    envKey: 'ELEVENLABS_API_KEY',
  },
  zai: {
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    envKey: 'ZAI_API_KEY',
  },
};

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface ChatOptions {
  provider: string;
  model: string;
  messages: ChatMessage[];
  apiKey?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: any[];
  toolChoice?: any;
}

export interface ChatResponse {
  content: string | null;
  toolCalls?: ToolCall[];
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: string;
  finishReason?: string;
}

/**
 * Make a real API call to OpenAI
 */
async function callOpenAI(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OpenAI API key required');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
      tool_choice: options.toolChoice,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'openai',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Anthropic
 */
async function callAnthropic(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Anthropic API key required');

  // Extract system message
  const systemMessage = options.messages.find(m => m.role === 'system');
  const otherMessages = options.messages.filter(m => m.role !== 'system');

  // Map tools to Anthropic format
  const anthropicTools = options.tools?.map(t => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters
  }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: options.model,
      max_tokens: options.maxTokens ?? 4096,
      system: systemMessage?.content,
      messages: otherMessages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      tools: anthropicTools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Anthropic API error: ${response.status}`);
  }

  const data = await response.json();
  const textContent = data.content.find((c: any) => c.type === 'text')?.text || null;
  const toolUseBlocks = data.content.filter((c: any) => c.type === 'tool_use');

  const toolCalls: ToolCall[] = toolUseBlocks.map((b: any) => ({
    id: b.id,
    type: 'function',
    function: {
      name: b.name,
      arguments: JSON.stringify(b.input)
    }
  }));

  return {
    content: textContent,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    usage: {
      promptTokens: data.usage?.input_tokens || 0,
      completionTokens: data.usage?.output_tokens || 0,
      totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
    },
    model: options.model,
    provider: 'anthropic',
    finishReason: data.stop_reason,
  };
}

/**
 * Make a real API call to Google AI (Gemini)
 */
async function callGoogle(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error('Google API key required');

  // Convert messages to Gemini format
  const contents = options.messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: m.content ? [{ text: m.content }] : [],
    }));

  const systemInstruction = options.messages.find(m => m.role === 'system');

  // Map tools to Gemini format
  const geminiTools = options.tools ? [{
    function_declarations: options.tools.map(t => ({
      name: t.function.name,
      description: t.function.description,
      parameters: t.function.parameters
    }))
  }] : undefined;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${options.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        tools: geminiTools,
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction.content }] } : undefined,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Google API error: ${response.status}`);
  }

  const data = await response.json();
  const candidate = data.candidates[0];
  const parts = candidate?.content?.parts || [];

  const textPart = parts.find((p: any) => p.text);
  const callParts = parts.filter((p: any) => p.functionCall);

  const toolCalls: ToolCall[] = callParts.map((p: any) => ({
    id: `call_${Math.random().toString(36).substr(2, 9)}`,
    type: 'function',
    function: {
      name: p.functionCall.name,
      arguments: JSON.stringify(p.functionCall.args)
    }
  }));

  return {
    content: textPart?.text || null,
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    usage: {
      promptTokens: data.usageMetadata?.promptTokenCount || 0,
      completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: data.usageMetadata?.totalTokenCount || 0,
    },
    model: options.model,
    provider: 'google',
    finishReason: candidate?.finishReason,
  };
}

/**
 * Make a real API call to DeepSeek
 */
async function callDeepSeek(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('DeepSeek API key required');

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `DeepSeek API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'deepseek',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Groq
 */
async function callGroq(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq API key required');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Groq API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'groq',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Mistral
 */
async function callMistral(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('Mistral API key required');

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Mistral API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'mistral',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to xAI (Grok)
 */
async function callXAI(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.XAI_API_KEY;
  if (!apiKey) throw new Error('xAI API key required');

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `xAI API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'xai',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Moonshot (Kimi)
 */
async function callMoonshot(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.MOONSHOT_API_KEY;
  if (!apiKey) throw new Error('Moonshot API key required');

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Moonshot API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'moonshot',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to MiniMax
 */
async function callMiniMax(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.MINIMAX_API_KEY;
  if (!apiKey) throw new Error('MiniMax API key required');

  const response = await fetch('https://api.minimax.chat/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `MiniMax API error: ${response.status}`);
  }

  const data = await response.json();
  const message = data.choices[0]?.message;

  return {
    content: message?.content || null,
    toolCalls: message?.tool_calls,
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'minimax',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Cohere
 */
async function callCohere(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error('Cohere API key required');

  // Convert messages to Cohere format
  const lastUserMessage = options.messages.filter(m => m.role === 'user').pop();
  const chatHistory = options.messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'CHATBOT' : 'USER',
    message: m.content,
  }));

  const response = await fetch('https://api.cohere.ai/v2/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      message: lastUserMessage?.content || '',
      chat_history: chatHistory,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
      tools: options.tools,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Cohere API error: ${response.status}`);
  }

  const data = await response.json();

  const toolCalls: ToolCall[] = data.tool_calls?.map((tc: any) => ({
    id: tc.id,
    type: 'function',
    function: {
      name: tc.function.name,
      arguments: tc.function.arguments
    }
  }));

  return {
    content: data.text || null,
    toolCalls: toolCalls?.length > 0 ? toolCalls : undefined,
    usage: {
      promptTokens: data.meta?.tokens?.input_tokens || 0,
      completionTokens: data.meta?.tokens?.output_tokens || 0,
      totalTokens: (data.meta?.tokens?.input_tokens || 0) + (data.meta?.tokens?.output_tokens || 0),
    },
    model: options.model,
    provider: 'cohere',
    finishReason: data.finish_reason,
  };
}

/**
 * Make a real API call to Together AI
 */
async function callTogether(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.TOGETHER_API_KEY;
  if (!apiKey) throw new Error('Together API key required');

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Together API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'together',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Make a real API call to Z.ai / GLM (Zhipu AI) - they're the same!
 */
async function callZAI(options: ChatOptions): Promise<ChatResponse> {
  const apiKey = options.apiKey || process.env.ZAI_API_KEY || process.env.GLM_API_KEY;
  if (!apiKey) throw new Error('Z.ai/GLM API key required (set ZAI_API_KEY or GLM_API_KEY)');

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Z.ai/GLM API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0]?.message?.content || '',
    usage: {
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
    },
    model: options.model,
    provider: 'zai',
    finishReason: data.choices[0]?.finish_reason,
  };
}

/**
 * Main function to call any provider
 */
export async function callAI(options: ChatOptions): Promise<ChatResponse> {
  const provider = options.provider.toLowerCase();

  switch (provider) {
    case 'openai':
      return callOpenAI(options);
    case 'anthropic':
      return callAnthropic(options);
    case 'google':
    case 'gemini':
      return callGoogle(options);
    case 'deepseek':
      return callDeepSeek(options);
    case 'groq':
      return callGroq(options);
    case 'mistral':
      return callMistral(options);
    case 'xai':
    case 'grok':
      return callXAI(options);
    case 'glm':
    case 'zhipu':
    case 'zai':
      return callZAI(options);
    case 'moonshot':
    case 'kimi':
      return callMoonshot(options);
    case 'minimax':
      return callMiniMax(options);
    case 'cohere':
      return callCohere(options);
    case 'together':
      return callTogether(options);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

export { PROVIDERS };
