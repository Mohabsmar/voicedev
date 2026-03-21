/**
 * VoiceDev - 15 AI Providers with NEWEST Models (March 21, 2026)
 * Categories: LLM, Voice (TTS/ASR), Vision, Embedding, Image, Reasoning
 */

// ============================================
// PROVIDER CONFIGURATION
// ============================================
export type ModelCategory = 'llm' | 'tts' | 'asr' | 'vision' | 'embedding' | 'image' | 'reasoning';

export interface Model {
  id: string;
  name: string;
  category: ModelCategory;
  contextWindow?: number;
  pricing?: { input: number; output: number };
  features?: string[];
  releaseDate?: string;
  deprecated?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  models: Model[];
  features: string[];
  website?: string;
}

// ============================================
// 15 AI PROVIDERS WITH NEWEST MODELS (MARCH 21, 2026)
// ============================================
export const providers: Provider[] = [
  // 1. OpenAI
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    website: 'https://platform.openai.com',
    features: ['chat', 'streaming', 'function_calling', 'vision', 'tts', 'whisper', 'reasoning'],
    models: [
      // LLMs - GPT-5 Series (March 2026)
      { id: 'gpt-5.2', name: 'GPT-5.2', category: 'llm', contextWindow: 512000, features: ['vision', 'function_calling', 'reasoning', 'agentic'], releaseDate: '2026-03-01' },
      { id: 'gpt-5.2-pro', name: 'GPT-5.2 Pro', category: 'llm', contextWindow: 512000, features: ['vision', 'function_calling', 'advanced_reasoning', 'enterprise'], releaseDate: '2026-03-01' },
      { id: 'gpt-5.1', name: 'GPT-5.1', category: 'llm', contextWindow: 256000, features: ['vision', 'function_calling', 'reasoning'], releaseDate: '2026-01-15' },
      { id: 'gpt-5.1-mini', name: 'GPT-5.1 Mini', category: 'llm', contextWindow: 128000, features: ['fast', 'efficient', 'vision'], releaseDate: '2026-01-15' },
      { id: 'gpt-5.1-nano', name: 'GPT-5.1 Nano', category: 'llm', contextWindow: 64000, features: ['ultra_fast', 'edge'], releaseDate: '2026-01-15' },
      // Reasoning Models - o-Series
      { id: 'o4', name: 'o4', category: 'reasoning', contextWindow: 256000, features: ['deep_reasoning', 'agentic'], releaseDate: '2026-02-28' },
      { id: 'o4-mini', name: 'o4-mini', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'efficient'], releaseDate: '2026-02-15' },
      { id: 'o3', name: 'o3', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'advanced'], releaseDate: '2026-01-31' },
      // Open Models
      { id: 'gpt-oss-120b', name: 'GPT-OSS-120B', category: 'llm', contextWindow: 128000, features: ['open_weights', 'customizable'], releaseDate: '2026-02-20' },
      // Voice - TTS
      { id: 'tts-3', name: 'TTS-3', category: 'tts', features: ['ultra_realistic', 'emotional', 'multilingual'], releaseDate: '2026-02-10' },
      { id: 'gpt-5-tts', name: 'GPT-5 TTS', category: 'tts', features: ['expressive', 'natural'], releaseDate: '2026-03-05' },
      { id: 'tts-2', name: 'TTS-2', category: 'tts', features: ['realistic', 'emotional'] },
      // Voice - ASR (Whisper)
      { id: 'whisper-3', name: 'Whisper 3', category: 'asr', features: ['multilingual', 'accurate', 'diarization'], releaseDate: '2026-02-01' },
      { id: 'whisper-2', name: 'Whisper 2', category: 'asr', features: ['multilingual', 'accurate', 'faster'] },
      // Embeddings
      { id: 'text-embedding-4-large', name: 'Embedding 4 Large', category: 'embedding', features: ['high_dimensional', 'multimodal'], releaseDate: '2026-01-20' },
      // Image
      { id: 'dall-e-4', name: 'DALL-E 4', category: 'image', features: ['ultra_realistic', '4k', 'video'], releaseDate: '2026-02-20' },
      { id: 'sora', name: 'Sora', category: 'image', features: ['video_generation', 'hd'], releaseDate: '2026-01-10' },
    ]
  },

  // 2. Anthropic
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    website: 'https://console.anthropic.com',
    features: ['chat', 'streaming', 'vision', 'artifacts', 'computer_use', 'extended_thinking'],
    models: [
      { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', category: 'llm', contextWindow: 200000, features: ['vision', 'artifacts', 'computer_use', 'coding'], releaseDate: '2026-02-05' },
      { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', category: 'llm', contextWindow: 200000, features: ['vision', 'artifacts', 'balanced'], releaseDate: '2026-02-17' },
      { id: 'claude-4-opus', name: 'Claude 4 Opus', category: 'llm', contextWindow: 200000, features: ['vision', 'powerful', 'reasoning'], releaseDate: '2025-05-22' },
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', category: 'llm', contextWindow: 200000, features: ['vision', 'balanced'] },
      { id: 'claude-4-haiku', name: 'Claude 4 Haiku', category: 'llm', contextWindow: 200000, features: ['fast', 'efficient'] },
    ]
  },

  // 3. Google AI
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY',
    website: 'https://ai.google.dev',
    features: ['chat', 'vision', 'long_context', 'multimodal', 'code_execution'],
    models: [
      { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'reasoning', 'multimodal', 'agentic'], releaseDate: '2026-02-19' },
      { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', category: 'llm', contextWindow: 1000000, features: ['fast', 'multimodal', 'streaming'], releaseDate: '2026-02-19' },
      { id: 'gemini-3-deep-think', name: 'Gemini 3 Deep Think', category: 'reasoning', contextWindow: 1000000, features: ['deep_reasoning', 'science', 'math'], releaseDate: '2026-02-12' },
      { id: 'gemini-3-pro', name: 'Gemini 3 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'multimodal'], releaseDate: '2026-01-15' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'llm', contextWindow: 2000000, features: ['reasoning', 'multimodal'] },
      { id: 'gemma-3-27b', name: 'Gemma 3 27B', category: 'llm', contextWindow: 128000, features: ['open', 'efficient'] },
    ]
  },

  // 4. Z.ai
  {
    id: 'zai',
    name: 'Z.ai',
    baseUrl: 'https://api.z.ai/v1',
    apiKeyEnv: 'ZAI_API_KEY',
    website: 'https://z.ai',
    features: ['chat', 'streaming', 'function_calling', 'vision'],
    models: [
      { id: 'z-3-ultra', name: 'Z-3 Ultra', category: 'llm', contextWindow: 512000, features: ['powerful', 'reasoning', 'vision', 'agentic'], releaseDate: '2026-03-10' },
      { id: 'z-3-pro', name: 'Z-3 Pro', category: 'llm', contextWindow: 256000, features: ['balanced', 'fast', 'vision'], releaseDate: '2026-03-10' },
      { id: 'z-3-mini', name: 'Z-3 Mini', category: 'llm', contextWindow: 128000, features: ['efficient', 'fast'], releaseDate: '2026-03-10' },
      { id: 'z-2-ultra', name: 'Z-2 Ultra', category: 'llm', contextWindow: 256000, features: ['powerful', 'reasoning', 'vision'] },
      { id: 'z-2-pro', name: 'Z-2 Pro', category: 'llm', contextWindow: 128000, features: ['balanced', 'fast'] },
    ]
  },

  // 5. Moonshot AI
  {
    id: 'moonshot',
    name: 'Moonshot AI',
    baseUrl: 'https://api.moonshot.cn/v1',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    website: 'https://moonshot.cn',
    features: ['chat', 'long_context', 'streaming', 'vision'],
    models: [
      { id: 'kimi-k3', name: 'Kimi K3', category: 'llm', contextWindow: 1000000, features: ['newest', 'multimodal', 'reasoning', 'agentic'], releaseDate: '2026-03-15' },
      { id: 'kimi-k2', name: 'Kimi K2', category: 'llm', contextWindow: 400000, features: ['multimodal', 'reasoning'], releaseDate: '2026-02-28' },
      { id: 'moonshot-v2-128k', name: 'Moonshot V2 128K', category: 'llm', contextWindow: 128000, features: ['long_context'] },
      { id: 'moonshot-v2-32k', name: 'Moonshot V2 32K', category: 'llm', contextWindow: 32000, features: ['balanced'] },
    ]
  },

  // 6. MiniMax
  {
    id: 'minimax',
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKeyEnv: 'MINIMAX_API_KEY',
    website: 'https://minimax.chat',
    features: ['chat', 'voice', 'video', 'streaming', 'multimodal'],
    models: [
      { id: 'abab8-chat', name: 'ABAB 8 Chat', category: 'llm', contextWindow: 512000, features: ['powerful', 'multilingual', 'reasoning', 'agentic'], releaseDate: '2026-03-10' },
      { id: 'abab7-chat', name: 'ABAB 7 Chat', category: 'llm', contextWindow: 320000, features: ['powerful', 'multilingual'], releaseDate: '2026-03-05' },
      { id: 'abab6.5-chat', name: 'ABAB 6.5 Chat', category: 'llm', contextWindow: 245000, features: ['powerful', 'multilingual'] },
      // Voice - TTS
      { id: 'speech-03-turbo', name: 'Speech-03 Turbo', category: 'tts', features: ['fast', 'natural', 'emotional', 'multilingual'], releaseDate: '2026-02-15' },
      { id: 'speech-02-turbo', name: 'Speech-02 Turbo', category: 'tts', features: ['fast', 'natural'] },
    ]
  },

  // 7. Groq (Fastest inference)
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    apiKeyEnv: 'GROQ_API_KEY',
    website: 'https://console.groq.com',
    features: ['chat', 'ultra_fast', 'streaming'],
    models: [
      { id: 'llama-4-behemoth', name: 'Llama 4 Behemoth', category: 'llm', contextWindow: 256000, features: ['ultra_fast', 'powerful', 'reasoning'], releaseDate: '2026-03-15' },
      { id: 'llama-4-maverick', name: 'Llama 4 Maverick', category: 'llm', contextWindow: 128000, features: ['ultra_fast', 'multimodal'], releaseDate: '2025-04-05' },
      { id: 'llama-4-scout', name: 'Llama 4 Scout', category: 'llm', contextWindow: 128000, features: ['fast', 'efficient'], releaseDate: '2025-04-05' },
      { id: 'llama-4-8b', name: 'Llama 4 8B', category: 'llm', contextWindow: 32000, features: ['ultra_fast', 'efficient'], releaseDate: '2026-02-20' },
      // Whisper on Groq
      { id: 'whisper-3-turbo', name: 'Whisper 3 Turbo', category: 'asr', features: ['ultra_fast', 'accurate', 'multilingual'], releaseDate: '2026-02-10' },
      { id: 'whisper-large-v3-turbo', name: 'Whisper Large V3 Turbo', category: 'asr', features: ['ultra_fast', 'accurate'] },
    ]
  },

  // 8. DeepSeek
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    website: 'https://platform.deepseek.com',
    features: ['chat', 'reasoning', 'coding', 'streaming'],
    models: [
      { id: 'deepseek-v4', name: 'DeepSeek V4', category: 'llm', contextWindow: 512000, features: ['trillion_params', 'moe', 'open_weights', 'reasoning'], releaseDate: '2026-03-15' },
      { id: 'deepseek-r3', name: 'DeepSeek R3', category: 'reasoning', contextWindow: 256000, features: ['reasoning', 'deep_thinking', 'advanced'], releaseDate: '2026-03-08' },
      { id: 'deepseek-r2', name: 'DeepSeek R2', category: 'reasoning', contextWindow: 256000, features: ['reasoning', 'deep_thinking'], releaseDate: '2026-03-08' },
      { id: 'deepseek-v3.2', name: 'DeepSeek V3.2', category: 'llm', contextWindow: 128000, features: ['chat', 'coding', 'balanced'] },
      { id: 'deepseek-coder-v3', name: 'DeepSeek Coder V3', category: 'llm', contextWindow: 128000, features: ['coding', 'specialized'], releaseDate: '2026-02-01' },
    ]
  },

  // 9. Mistral AI
  {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    website: 'https://console.mistral.ai',
    features: ['chat', 'function_calling', 'embeddings', 'streaming'],
    models: [
      { id: 'mistral-large-3', name: 'Mistral Large 3', category: 'llm', contextWindow: 256000, features: ['powerful', 'multilingual', 'reasoning', '41B_active'], releaseDate: '2026-03-15' },
      { id: 'mistral-medium-3', name: 'Mistral Medium 3', category: 'llm', contextWindow: 128000, features: ['balanced', 'efficient'], releaseDate: '2026-03-10' },
      { id: 'mistral-small-4', name: 'Mistral Small 4', category: 'llm', contextWindow: 64000, features: ['fast', 'efficient', 'edge'], releaseDate: '2026-03-16' },
      { id: 'codestral-v2', name: 'Codestral V2', category: 'llm', contextWindow: 64000, features: ['coding', 'fast'], releaseDate: '2026-02-15' },
      { id: 'pixtral-large', name: 'Pixtral Large', category: 'vision', contextWindow: 128000, features: ['vision', 'multimodal'], releaseDate: '2026-02-01' },
      { id: 'mistral-embed-v2', name: 'Mistral Embed V2', category: 'embedding', features: ['efficient', 'multilingual'], releaseDate: '2026-01-20' },
    ]
  },

  // 10. xAI (Grok)
  {
    id: 'xai',
    name: 'xAI',
    baseUrl: 'https://api.x.ai/v1',
    apiKeyEnv: 'XAI_API_KEY',
    website: 'https://x.ai',
    features: ['chat', 'real_time', 'streaming', 'humor', 'uncensored'],
    models: [
      { id: 'grok-4', name: 'Grok 4', category: 'llm', contextWindow: 512000, features: ['witty', 'real_time', 'reasoning', 'agentic'], releaseDate: '2026-03-01' },
      { id: 'grok-4-fast', name: 'Grok 4 Fast', category: 'llm', contextWindow: 256000, features: ['witty', 'ultra_fast'], releaseDate: '2025-09-23' },
      { id: 'grok-4-vision', name: 'Grok 4 Vision', category: 'vision', contextWindow: 128000, features: ['vision', 'witty'], releaseDate: '2026-02-15' },
      { id: 'grok-aurora', name: 'Grok Aurora', category: 'image', features: ['image_generation', 'autoregressive'], releaseDate: '2025-12-09' },
    ]
  },

  // 11. Cohere
  {
    id: 'cohere',
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'COHERE_API_KEY',
    website: 'https://cohere.com',
    features: ['chat', 'embeddings', 'rerank', 'streaming'],
    models: [
      { id: 'command-r3', name: 'Command R3', category: 'llm', contextWindow: 256000, features: ['rag', 'function_calling', 'agentic'], releaseDate: '2026-02-15' },
      { id: 'command-r2-plus', name: 'Command R2+', category: 'llm', contextWindow: 128000, features: ['rag', 'function_calling'] },
      { id: 'command-r2', name: 'Command R2', category: 'llm', contextWindow: 128000, features: ['rag', 'efficient'] },
      { id: 'embed-v5', name: 'Embed V5', category: 'embedding', features: ['multilingual', 'efficient', 'high_dim'], releaseDate: '2026-01-15' },
      { id: 'rerank-v4', name: 'Rerank V4', category: 'embedding', features: ['reranking', 'multilingual'], releaseDate: '2026-01-20' },
    ]
  },

  // 12. Replicate (Multiple open models)
  {
    id: 'replicate',
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1',
    apiKeyEnv: 'REPLICATE_API_TOKEN',
    website: 'https://replicate.com',
    features: ['chat', 'image', 'video', 'music', 'voice'],
    models: [
      { id: 'meta/llama-4-behemoth', name: 'Llama 4 Behemoth', category: 'llm', features: ['open', 'powerful', 'reasoning'], releaseDate: '2026-03-15' },
      { id: 'meta/llama-4-maverick', name: 'Llama 4 Maverick', category: 'llm', features: ['open', 'multimodal'], releaseDate: '2025-04-05' },
      { id: 'deepseek-ai/deepseek-v4', name: 'DeepSeek V4', category: 'llm', features: ['open', 'reasoning'], releaseDate: '2026-03-15' },
      { id: 'black-forest-labs/flux-3', name: 'Flux 3', category: 'image', features: ['ultra_quality', '4k', 'video'], releaseDate: '2026-02-20' },
      { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell', category: 'image', features: ['fast', 'quality'] },
      { id: 'minimax/speech-03', name: 'MiniMax Speech 03', category: 'tts', features: ['natural', 'fast', 'emotional'], releaseDate: '2026-02-15' },
    ]
  },

  // 13. Together AI
  {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    apiKeyEnv: 'TOGETHER_API_KEY',
    website: 'https://together.ai',
    features: ['chat', 'open_models', 'streaming'],
    models: [
      { id: 'meta-llama/Llama-4-Behemoth-Turbo', name: 'Llama 4 Behemoth Turbo', category: 'llm', features: ['fast', 'open', 'reasoning'], releaseDate: '2026-03-15' },
      { id: 'meta-llama/Llama-4-Maverick-Turbo', name: 'Llama 4 Maverick Turbo', category: 'llm', features: ['fast', 'open', 'multimodal'] },
      { id: 'Qwen/Qwen3-235B-A22B', name: 'Qwen 3 235B', category: 'llm', features: ['multilingual', 'coding', 'powerful'], releaseDate: '2026-02-28' },
      { id: 'deepseek-ai/DeepSeek-V4', name: 'DeepSeek V4', category: 'llm', features: ['reasoning', 'open'], releaseDate: '2026-03-15' },
      { id: 'mistralai/Mistral-Large-3', name: 'Mistral Large 3', category: 'llm', features: ['powerful', 'multilingual'], releaseDate: '2026-03-15' },
    ]
  },

  // 14. ElevenLabs (Voice specialist)
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    baseUrl: 'https://api.elevenlabs.io/v1',
    apiKeyEnv: 'ELEVENLABS_API_KEY',
    website: 'https://elevenlabs.io',
    features: ['tts', 'voice_cloning', 'asr', 'dubbing'],
    models: [
      { id: 'eleven_v3', name: 'Eleven V3', category: 'tts', features: ['ultra_realistic', 'emotional', 'multilingual', 'dialogue_mode', 'audio_tags'], releaseDate: '2026-03-14' },
      { id: 'eleven_v3_lightning', name: 'Eleven V3 Lightning', category: 'tts', features: ['ultra_fast', 'quality', 'streaming'], releaseDate: '2026-02-23' },
      { id: 'eleven_multilingual_v3', name: 'Multilingual V3', category: 'tts', features: ['multilingual', 'natural', '70_languages'], releaseDate: '2026-01-15' },
      { id: 'eleven_turbo_v3', name: 'Turbo V3', category: 'tts', features: ['fast', 'quality'] },
      // ASR
      { id: 'scribe_v3', name: 'Scribe V3', category: 'asr', features: ['accurate', 'multilingual', 'diarization', 'speaker_id'], releaseDate: '2026-02-10' },
      { id: 'scribe_v2', name: 'Scribe V2', category: 'asr', features: ['accurate', 'multilingual'] },
    ]
  },

  // 15. Alibaba Qwen
  {
    id: 'qwen',
    name: 'Alibaba Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    apiKeyEnv: 'QWEN_API_KEY',
    website: 'https://qwenlm.github.io',
    features: ['chat', 'vision', 'long_context', 'multimodal'],
    models: [
      { id: 'qwen-3-235b', name: 'Qwen 3 235B', category: 'llm', contextWindow: 256000, features: ['powerful', 'multilingual', 'reasoning', 'moe'], releaseDate: '2026-02-28' },
      { id: 'qwen-3-max', name: 'Qwen 3 Max', category: 'llm', contextWindow: 128000, features: ['powerful', 'multilingual', 'reasoning'], releaseDate: '2026-02-28' },
      { id: 'qwen-3-plus', name: 'Qwen 3 Plus', category: 'llm', contextWindow: 128000, features: ['balanced', 'efficient'], releaseDate: '2026-02-28' },
      { id: 'qwen-3-turbo', name: 'Qwen 3 Turbo', category: 'llm', contextWindow: 128000, features: ['fast', 'efficient'], releaseDate: '2026-02-28' },
      { id: 'qwen-vl-3', name: 'Qwen VL 3', category: 'vision', features: ['vision', 'ocr', 'video'], releaseDate: '2026-02-15' },
      { id: 'qwen-audio-2', name: 'Qwen Audio 2', category: 'asr', features: ['audio_understanding', 'multilingual'], releaseDate: '2026-01-20' },
      { id: 'qwen-long', name: 'Qwen Long', category: 'llm', contextWindow: 10000000, features: ['ultra_long_context'] },
    ]
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getProviderById(id: string): Provider | undefined {
  return providers.find(p => p.id === id);
}

export function getModelsByCategory(category: ModelCategory): Model[] {
  return providers.flatMap(p => p.models.filter(m => m.category === category));
}

export function getModelsByProvider(providerId: string): Model[] {
  const provider = getProviderById(providerId);
  return provider?.models || [];
}

export function getChatModels(): Model[] {
  return getModelsByCategory('llm');
}

export function getTTSModels(): Model[] {
  return getModelsByCategory('tts');
}

export function getASRModels(): Model[] {
  return getModelsByCategory('asr');
}

export function getVisionModels(): Model[] {
  return getModelsByCategory('vision');
}

export function getImageModels(): Model[] {
  return getModelsByCategory('image');
}

export function getEmbeddingModels(): Model[] {
  return getModelsByCategory('embedding');
}

export function getReasoningModels(): Model[] {
  return getModelsByCategory('reasoning');
}

// Get newest models (March 2026)
export function getNewestModels(count: number = 15): Model[] {
  const newestIds = [
    'gpt-5.2-pro',
    'claude-opus-4.6',
    'gemini-3.1-pro',
    'deepseek-v4',
    'o4',
    'grok-4',
    'qwen-3-235b',
    'kimi-k3',
    'z-3-ultra',
    'abab8-chat',
    'llama-4-behemoth',
    'mistral-large-3',
    'eleven_v3',
    'dall-e-4',
    'flux-3',
    'whisper-3',
    'scribe_v3',
  ];
  
  return providers
    .flatMap(p => p.models)
    .filter(m => newestIds.includes(m.id))
    .slice(0, count);
}

// Get models released in 2026
export function getLatestModels2026(): Model[] {
  return providers
    .flatMap(p => p.models)
    .filter(m => m.releaseDate && m.releaseDate.startsWith('2026'))
    .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
}

export default providers;
