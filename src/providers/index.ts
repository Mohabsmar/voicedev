/**
 * VoiceDev - 15 AI Providers with Newest Models (March 2026)
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
// 15 AI PROVIDERS WITH NEWEST MODELS (MARCH 2026)
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
      // LLMs - Newest March 2026
      { id: 'gpt-4.5-turbo', name: 'GPT-4.5 Turbo', category: 'llm', contextWindow: 256000, features: ['vision', 'function_calling', 'reasoning'], releaseDate: '2026-02-15' },
      { id: 'gpt-4.5', name: 'GPT-4.5', category: 'llm', contextWindow: 256000, features: ['vision', 'function_calling', 'advanced_reasoning'], releaseDate: '2026-01-20' },
      { id: 'gpt-4o', name: 'GPT-4o', category: 'llm', contextWindow: 128000, features: ['vision', 'function_calling'], releaseDate: '2024-05-13' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', category: 'llm', contextWindow: 128000, features: ['vision', 'function_calling', 'fast'], releaseDate: '2024-07-18' },
      // Reasoning Models
      { id: 'o3-mini', name: 'o3-mini', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'efficient'], releaseDate: '2026-01-31' },
      { id: 'o3', name: 'o3', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'advanced'], releaseDate: '2026-02-28' },
      { id: 'o4-mini', name: 'o4-mini', category: 'reasoning', contextWindow: 256000, features: ['reasoning', 'next_gen'], releaseDate: '2026-03-15' },
      // Voice - TTS
      { id: 'tts-1', name: 'TTS-1', category: 'tts', features: ['realistic', 'fast'] },
      { id: 'tts-1-hd', name: 'TTS-1 HD', category: 'tts', features: ['high_quality'] },
      { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', category: 'tts', features: ['newest', 'expressive'], releaseDate: '2025-12-01' },
      { id: 'tts-2', name: 'TTS-2', category: 'tts', features: ['ultra_realistic', 'emotional'], releaseDate: '2026-02-10' },
      // Voice - ASR (Whisper)
      { id: 'whisper-1', name: 'Whisper', category: 'asr', features: ['multilingual', 'accurate'] },
      { id: 'whisper-2', name: 'Whisper 2', category: 'asr', features: ['multilingual', 'accurate', 'faster'], releaseDate: '2026-01-15' },
      // Embeddings
      { id: 'text-embedding-3-small', name: 'Embedding Small', category: 'embedding', features: ['efficient'] },
      { id: 'text-embedding-3-large', name: 'Embedding Large', category: 'embedding', features: ['high_dimensional'] },
      { id: 'text-embedding-4', name: 'Embedding 4', category: 'embedding', features: ['multimodal', 'efficient'], releaseDate: '2026-03-01' },
      // Image
      { id: 'dall-e-3', name: 'DALL-E 3', category: 'image', features: ['photorealistic', 'prompt_adherence'] },
      { id: 'dall-e-4', name: 'DALL-E 4', category: 'image', features: ['ultra_realistic', '4k'], releaseDate: '2026-02-20' },
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
      { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', category: 'llm', contextWindow: 200000, features: ['vision', 'artifacts', 'computer_use', 'extended_thinking'], releaseDate: '2026-02-24' },
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', category: 'llm', contextWindow: 200000, features: ['vision', 'artifacts', 'computer_use'] },
      { id: 'claude-3.5-haiku', name: 'Claude 3.5 Haiku', category: 'llm', contextWindow: 200000, features: ['fast', 'efficient'] },
      { id: 'claude-4-opus', name: 'Claude 4 Opus', category: 'llm', contextWindow: 200000, features: ['vision', 'powerful', 'reasoning'], releaseDate: '2026-03-10' },
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', category: 'llm', contextWindow: 200000, features: ['vision', 'balanced'], releaseDate: '2026-03-10' },
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
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'reasoning', 'multimodal'], releaseDate: '2026-02-15' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', category: 'llm', contextWindow: 1000000, features: ['fast', 'multimodal', 'streaming'], releaseDate: '2026-02-15' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', category: 'llm', contextWindow: 1000000, features: ['fast', 'multimodal', 'streaming'] },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'reasoning'] },
      { id: 'gemma-3-27b', name: 'Gemma 3 27B', category: 'llm', contextWindow: 128000, features: ['open', 'efficient'] },
      { id: 'gemma-3-8b', name: 'Gemma 3 8B', category: 'llm', contextWindow: 32000, features: ['open', 'small'], releaseDate: '2026-01-20' },
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
      { id: 'z-2-ultra', name: 'Z-2 Ultra', category: 'llm', contextWindow: 256000, features: ['powerful', 'reasoning', 'vision'], releaseDate: '2026-03-01' },
      { id: 'z-2-pro', name: 'Z-2 Pro', category: 'llm', contextWindow: 128000, features: ['balanced', 'fast'], releaseDate: '2026-03-01' },
      { id: 'z-2-mini', name: 'Z-2 Mini', category: 'llm', contextWindow: 64000, features: ['efficient', 'fast'], releaseDate: '2026-03-01' },
      { id: 'z-1-large', name: 'Z-1 Large', category: 'llm', contextWindow: 128000, features: ['powerful', 'reasoning'] },
      { id: 'z-1-standard', name: 'Z-1 Standard', category: 'llm', contextWindow: 64000, features: ['balanced'] },
      { id: 'z-1-fast', name: 'Z-1 Fast', category: 'llm', contextWindow: 32000, features: ['fast', 'efficient'] },
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
      { id: 'kimi-k2', name: 'Kimi K2', category: 'llm', contextWindow: 400000, features: ['newest', 'multimodal', 'reasoning'], releaseDate: '2026-02-28' },
      { id: 'kimi-latest', name: 'Kimi Latest', category: 'llm', contextWindow: 200000, features: ['multimodal'] },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', category: 'llm', contextWindow: 128000, features: ['long_context'] },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K', category: 'llm', contextWindow: 32000, features: ['balanced'] },
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
      { id: 'abab7-chat', name: 'ABAB 7 Chat', category: 'llm', contextWindow: 320000, features: ['powerful', 'multilingual', 'reasoning'], releaseDate: '2026-03-05' },
      { id: 'abab6.5-chat', name: 'ABAB 6.5 Chat', category: 'llm', contextWindow: 245000, features: ['powerful', 'multilingual'] },
      { id: 'abab6.5s-chat', name: 'ABAB 6.5S Chat', category: 'llm', contextWindow: 128000, features: ['fast'] },
      // Voice - TTS
      { id: 'speech-02-turbo', name: 'Speech-02 Turbo', category: 'tts', features: ['fast', 'natural', 'emotional'], releaseDate: '2026-01-10' },
      { id: 'speech-01-turbo', name: 'Speech-01 Turbo', category: 'tts', features: ['fast', 'natural'] },
      { id: 'speech-01-emo', name: 'Speech-01 Emotional', category: 'tts', features: ['emotional', 'expressive'] },
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
      { id: 'llama-4-70b', name: 'Llama 4 70B', category: 'llm', contextWindow: 128000, features: ['fast', 'powerful'], releaseDate: '2026-02-20' },
      { id: 'llama-4-8b', name: 'Llama 4 8B', category: 'llm', contextWindow: 32000, features: ['ultra_fast', 'efficient'], releaseDate: '2026-02-20' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', category: 'llm', contextWindow: 128000, features: ['fast', 'versatile'] },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', category: 'llm', contextWindow: 128000, features: ['fastest', 'cheap'] },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', category: 'llm', contextWindow: 32768, features: ['moe', 'efficient'] },
      // Whisper on Groq
      { id: 'whisper-large-v3-turbo', name: 'Whisper Large V3 Turbo', category: 'asr', features: ['ultra_fast', 'accurate'] },
      { id: 'whisper-large-v3', name: 'Whisper Large V3', category: 'asr', features: ['accurate', 'multilingual'] },
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
      { id: 'deepseek-r2', name: 'DeepSeek R2', category: 'reasoning', contextWindow: 256000, features: ['reasoning', 'deep_thinking', 'advanced'], releaseDate: '2026-03-08' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)', category: 'reasoning', contextWindow: 128000, features: ['reasoning', 'deep_thinking'] },
      { id: 'deepseek-v3', name: 'DeepSeek V3', category: 'llm', contextWindow: 128000, features: ['chat', 'coding', 'balanced'], releaseDate: '2026-01-15' },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', category: 'llm', contextWindow: 64000, features: ['chat', 'coding'] },
      { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2', category: 'llm', contextWindow: 128000, features: ['coding', 'specialized'], releaseDate: '2026-02-01' },
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
      { id: 'mistral-large-2', name: 'Mistral Large 2', category: 'llm', contextWindow: 256000, features: ['powerful', 'multilingual', 'reasoning'], releaseDate: '2026-02-15' },
      { id: 'mistral-large-latest', name: 'Mistral Large', category: 'llm', contextWindow: 128000, features: ['powerful', 'multilingual'] },
      { id: 'mistral-small-latest', name: 'Mistral Small', category: 'llm', contextWindow: 32000, features: ['fast', 'efficient'] },
      { id: 'codestral-latest', name: 'Codestral', category: 'llm', contextWindow: 32000, features: ['coding', 'fast'] },
      { id: 'pixtral-12b-2409', name: 'Pixtral 12B', category: 'vision', contextWindow: 128000, features: ['vision', 'multimodal'] },
      { id: 'mistral-embed', name: 'Mistral Embed', category: 'embedding', features: ['efficient'] },
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
      { id: 'grok-3', name: 'Grok 3', category: 'llm', contextWindow: 256000, features: ['witty', 'real_time', 'reasoning'], releaseDate: '2026-03-01' },
      { id: 'grok-3-mini', name: 'Grok 3 Mini', category: 'llm', contextWindow: 128000, features: ['witty', 'fast'], releaseDate: '2026-03-01' },
      { id: 'grok-2-1212', name: 'Grok 2', category: 'llm', contextWindow: 131072, features: ['witty', 'real_time', 'uncensored'] },
      { id: 'grok-2-vision-1212', name: 'Grok 2 Vision', category: 'vision', contextWindow: 32768, features: ['vision', 'witty'] },
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
      { id: 'command-r-plus', name: 'Command R+', category: 'llm', contextWindow: 128000, features: ['rag', 'function_calling'] },
      { id: 'command-r', name: 'Command R', category: 'llm', contextWindow: 128000, features: ['rag', 'efficient'] },
      { id: 'command', name: 'Command', category: 'llm', contextWindow: 4096, features: ['instruction'] },
      { id: 'embed-v4.0', name: 'Embed V4', category: 'embedding', features: ['multilingual', 'efficient'] },
      { id: 'rerank-v3.5', name: 'Rerank V3.5', category: 'embedding', features: ['reranking'] },
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
      { id: 'meta/llama-4-70b-instruct', name: 'Llama 4 70B', category: 'llm', features: ['open', 'powerful'], releaseDate: '2026-02-20' },
      { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', category: 'llm', features: ['open', 'powerful'] },
      { id: 'deepseek-ai/deepseek-r2', name: 'DeepSeek R2', category: 'llm', features: ['reasoning'], releaseDate: '2026-03-08' },
      { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell', category: 'image', features: ['fast', 'quality'] },
      { id: 'black-forest-labs/flux-dev', name: 'Flux Dev', category: 'image', features: ['high_quality'] },
      { id: 'flux-2', name: 'Flux 2', category: 'image', features: ['ultra_quality', '4k'], releaseDate: '2026-01-25' },
      { id: 'stability-ai/sdxl', name: 'SDXL', category: 'image', features: ['photorealistic'] },
      { id: 'minimax/speech-02', name: 'MiniMax Speech 02', category: 'tts', features: ['natural', 'fast'], releaseDate: '2026-01-10' },
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
      { id: 'meta-llama/Llama-4-70B-Instruct-Turbo', name: 'Llama 4 70B Turbo', category: 'llm', features: ['fast', 'open'], releaseDate: '2026-02-20' },
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', category: 'llm', features: ['fast', 'open'] },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', category: 'llm', features: ['multilingual', 'coding'] },
      { id: 'deepseek-ai/DeepSeek-R2', name: 'DeepSeek R2', category: 'llm', features: ['reasoning'], releaseDate: '2026-03-08' },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', category: 'llm', features: ['moe'] },
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
      { id: 'eleven_v3', name: 'Eleven V3', category: 'tts', features: ['ultra_realistic', 'emotional', 'multilingual'], releaseDate: '2026-02-15' },
      { id: 'eleven_multilingual_v2', name: 'Multilingual V2', category: 'tts', features: ['multilingual', 'natural'] },
      { id: 'eleven_turbo_v2_5', name: 'Turbo V2.5', category: 'tts', features: ['fast', 'quality'] },
      { id: 'eleven_flash_v2.5', name: 'Flash V2.5', category: 'tts', features: ['ultra_fast', 'streaming'] },
      // ASR
      { id: 'scribe_v2', name: 'Scribe V2', category: 'asr', features: ['accurate', 'multilingual', 'diarization'], releaseDate: '2026-01-20' },
      { id: 'scribe_v1', name: 'Scribe V1', category: 'asr', features: ['accurate', 'multilingual'] },
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
      { id: 'qwen-3-max', name: 'Qwen 3 Max', category: 'llm', contextWindow: 128000, features: ['powerful', 'multilingual', 'reasoning'], releaseDate: '2026-02-28' },
      { id: 'qwen-3-plus', name: 'Qwen 3 Plus', category: 'llm', contextWindow: 128000, features: ['balanced', 'efficient'], releaseDate: '2026-02-28' },
      { id: 'qwen-max', name: 'Qwen Max', category: 'llm', contextWindow: 32000, features: ['powerful', 'multilingual'] },
      { id: 'qwen-plus', name: 'Qwen Plus', category: 'llm', contextWindow: 128000, features: ['balanced'] },
      { id: 'qwen-turbo', name: 'Qwen Turbo', category: 'llm', contextWindow: 128000, features: ['fast'] },
      { id: 'qwen-vl-max', name: 'Qwen VL Max', category: 'vision', features: ['vision', 'ocr'] },
      { id: 'qwen-audio-turbo', name: 'Qwen Audio Turbo', category: 'asr', features: ['audio_understanding'] },
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

// Get newest 5 models (March 2026)
export function getNewestModels(count: number = 5): Model[] {
  const newestIds = [
    'gpt-4.5-turbo',
    'claude-4-opus',
    'o4-mini',
    'gemini-2.5-pro',
    'deepseek-r2',
    'grok-3',
    'qwen-3-max',
    'kimi-k2',
    'z-2-ultra',
    'abab7-chat',
    'llama-4-70b',
    'mistral-large-2',
    'eleven_v3',
    'dall-e-4',
    'flux-2',
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
