/**
 * VoiceDev - 15 AI Providers with Newest Models (2025)
 * Categories: LLM, Voice (TTS/ASR), Vision, Embedding
 */

// ============================================
// PROVIDER CONFIGURATION
// ============================================
export type ModelCategory = 'llm' | 'tts' | 'asr' | 'vision' | 'embedding' | 'image';

export interface Model {
  id: string;
  name: string;
  category: ModelCategory;
  contextWindow?: number;
  pricing?: { input: number; output: number };
  features?: string[];
  deprecated?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  models: Model[];
  features: string[];
}

// ============================================
// 15 AI PROVIDERS WITH NEWEST MODELS
// ============================================
export const providers: Provider[] = [
  // 1. OpenAI
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnv: 'OPENAI_API_KEY',
    features: ['chat', 'streaming', 'function_calling', 'vision', 'tts', 'whisper'],
    models: [
      // LLMs - Newest 2025
      { id: 'gpt-4o', name: 'GPT-4o', category: 'llm', contextWindow: 128000, features: ['vision', 'function_calling'] },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', category: 'llm', contextWindow: 128000, features: ['vision', 'function_calling'] },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', category: 'llm', contextWindow: 128000, features: ['vision', 'function_calling'] },
      { id: 'o1', name: 'o1', category: 'llm', contextWindow: 200000, features: ['reasoning'] },
      { id: 'o1-mini', name: 'o1-mini', category: 'llm', contextWindow: 128000, features: ['reasoning'] },
      { id: 'o1-pro', name: 'o1 Pro', category: 'llm', contextWindow: 200000, features: ['reasoning', 'pro'] },
      // Voice - TTS
      { id: 'tts-1', name: 'TTS-1', category: 'tts', features: ['realistic', 'fast'] },
      { id: 'tts-1-hd', name: 'TTS-1 HD', category: 'tts', features: ['high_quality'] },
      { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', category: 'tts', features: ['newest', 'expressive'] },
      // Voice - ASR (Whisper)
      { id: 'whisper-1', name: 'Whisper', category: 'asr', features: ['multilingual', 'accurate'] },
      // Embeddings
      { id: 'text-embedding-3-small', name: 'Embedding Small', category: 'embedding', features: ['efficient'] },
      { id: 'text-embedding-3-large', name: 'Embedding Large', category: 'embedding', features: ['high_dimensional'] },
      // Image
      { id: 'dall-e-3', name: 'DALL-E 3', category: 'image', features: ['photorealistic', 'prompt_adherence'] },
    ]
  },

  // 2. Anthropic
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    features: ['chat', 'streaming', 'vision', 'artifacts', 'computer_use'],
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', category: 'llm', contextWindow: 200000, features: ['vision', 'artifacts', 'computer_use'] },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', category: 'llm', contextWindow: 200000, features: ['fast', 'efficient'] },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', category: 'llm', contextWindow: 200000, features: ['vision', 'powerful'] },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', category: 'llm', contextWindow: 200000, features: ['newest', 'extended_thinking'] },
    ]
  },

  // 3. Google AI
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyEnv: 'GOOGLE_API_KEY',
    features: ['chat', 'vision', 'long_context', 'multimodal'],
    models: [
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', category: 'llm', contextWindow: 1000000, features: ['fast', 'multimodal', 'streaming'] },
      { id: 'gemini-2.0-pro', name: 'Gemini 2.0 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'reasoning'] },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', category: 'llm', contextWindow: 2000000, features: ['long_context', 'vision'] },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', category: 'llm', contextWindow: 1000000, features: ['fast', 'efficient'] },
      { id: 'gemma-3-27b', name: 'Gemma 3 27B', category: 'llm', contextWindow: 128000, features: ['open', 'efficient'] },
    ]
  },

  // 4. Z.ai (New provider)
  {
    id: 'zai',
    name: 'Z.ai',
    baseUrl: 'https://api.z.ai/v1',
    apiKeyEnv: 'ZAI_API_KEY',
    features: ['chat', 'streaming', 'function_calling'],
    models: [
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
    features: ['chat', 'long_context', 'streaming'],
    models: [
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', category: 'llm', contextWindow: 128000, features: ['long_context'] },
      { id: 'moonshot-v1-32k', name: 'Moonshot V1 32K', category: 'llm', contextWindow: 32000, features: ['balanced'] },
      { id: 'moonshot-v1-8k', name: 'Moonshot V1 8K', category: 'llm', contextWindow: 8000, features: ['fast'] },
      { id: 'kimi-latest', name: 'Kimi Latest', category: 'llm', contextWindow: 200000, features: ['newest', 'multimodal'] },
    ]
  },

  // 6. MiniMax
  {
    id: 'minimax',
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    apiKeyEnv: 'MINIMAX_API_KEY',
    features: ['chat', 'voice', 'video', 'streaming'],
    models: [
      { id: 'abab6.5-chat', name: 'ABAB 6.5 Chat', category: 'llm', contextWindow: 245000, features: ['powerful', 'multilingual'] },
      { id: 'abab6.5s-chat', name: 'ABAB 6.5S Chat', category: 'llm', contextWindow: 128000, features: ['fast'] },
      { id: 'abab6.5g-chat', name: 'ABAB 6.5G Chat', category: 'llm', contextWindow: 320000, features: ['long_context'] },
      // Voice - TTS
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
    features: ['chat', 'ultra_fast', 'streaming'],
    models: [
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', category: 'llm', contextWindow: 128000, features: ['fast', 'versatile'] },
      { id: 'llama-3.3-70b-specdec', name: 'Llama 3.3 70B SpecDec', category: 'llm', contextWindow: 8192, features: ['ultra_fast'] },
      { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', category: 'llm', contextWindow: 128000, features: ['fastest', 'cheap'] },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', category: 'llm', contextWindow: 32768, features: ['moe', 'efficient'] },
      { id: 'gemma2-9b-it', name: 'Gemma 2 9B', category: 'llm', contextWindow: 8192, features: ['small', 'fast'] },
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
    features: ['chat', 'reasoning', 'coding', 'streaming'],
    models: [
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner (R1)', category: 'llm', contextWindow: 128000, features: ['reasoning', 'deep_thinking'] },
      { id: 'deepseek-chat', name: 'DeepSeek Chat', category: 'llm', contextWindow: 64000, features: ['chat', 'coding'] },
      { id: 'deepseek-coder', name: 'DeepSeek Coder', category: 'llm', contextWindow: 64000, features: ['coding', 'specialized'] },
    ]
  },

  // 9. Mistral AI
  {
    id: 'mistral',
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    apiKeyEnv: 'MISTRAL_API_KEY',
    features: ['chat', 'function_calling', 'embeddings', 'streaming'],
    models: [
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
    features: ['chat', 'real_time', 'streaming', 'humor'],
    models: [
      { id: 'grok-2-1212', name: 'Grok 2', category: 'llm', contextWindow: 131072, features: ['witty', 'real_time', 'uncensored'] },
      { id: 'grok-2-vision-1212', name: 'Grok 2 Vision', category: 'vision', contextWindow: 32768, features: ['vision', 'witty'] },
      { id: 'grok-beta', name: 'Grok Beta', category: 'llm', contextWindow: 131072, features: ['beta', 'experimental'] },
    ]
  },

  // 11. Cohere
  {
    id: 'cohere',
    name: 'Cohere',
    baseUrl: 'https://api.cohere.ai/v1',
    apiKeyEnv: 'COHERE_API_KEY',
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
    features: ['chat', 'image', 'video', 'music', 'voice'],
    models: [
      { id: 'meta/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', category: 'llm', features: ['open', 'powerful'] },
      { id: 'deepseek-ai/deepseek-r1', name: 'DeepSeek R1', category: 'llm', features: ['reasoning'] },
      { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell', category: 'image', features: ['fast', 'quality'] },
      { id: 'black-forest-labs/flux-dev', name: 'Flux Dev', category: 'image', features: ['high_quality'] },
      { id: 'stability-ai/sdxl', name: 'SDXL', category: 'image', features: ['photorealistic'] },
      { id: 'minimax/speech-01', name: 'MiniMax Speech', category: 'tts', features: ['natural', 'fast'] },
      { id: 'vaibhavs10/incredibly-fast-whisper', name: 'Fast Whisper', category: 'asr', features: ['ultra_fast'] },
    ]
  },

  // 13. Together AI
  {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    apiKeyEnv: 'TOGETHER_API_KEY',
    features: ['chat', 'open_models', 'streaming'],
    models: [
      { id: 'meta-llama/Llama-3.3-70B-Instruct-Turbo', name: 'Llama 3.3 70B Turbo', category: 'llm', features: ['fast', 'open'] },
      { id: 'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo', name: 'Llama 3.2 90B Vision', category: 'vision', features: ['vision', 'powerful'] },
      { id: 'Qwen/Qwen2.5-72B-Instruct-Turbo', name: 'Qwen 2.5 72B', category: 'llm', features: ['multilingual', 'coding'] },
      { id: 'deepseek-ai/DeepSeek-R1', name: 'DeepSeek R1', category: 'llm', features: ['reasoning'] },
      { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', category: 'llm', features: ['moe'] },
    ]
  },

  // 14. ElevenLabs (Voice specialist)
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    baseUrl: 'https://api.elevenlabs.io/v1',
    apiKeyEnv: 'ELEVENLABS_API_KEY',
    features: ['tts', 'voice_cloning', 'asr', 'dubbing'],
    models: [
      { id: 'eleven_multilingual_v2', name: 'Multilingual V2', category: 'tts', features: ['multilingual', 'natural'] },
      { id: 'eleven_turbo_v2_5', name: 'Turbo V2.5', category: 'tts', features: ['fast', 'quality'] },
      { id: 'eleven_turbo_v2', name: 'Turbo V2', category: 'tts', features: ['fastest'] },
      { id: 'eleven_monolingual_v1', name: 'Monolingual V1', category: 'tts', features: ['english', 'high_quality'] },
      { id: 'eleven_flash_v2.5', name: 'Flash V2.5', category: 'tts', features: ['ultra_fast', 'streaming'] },
      // ASR
      { id: 'scribe_v1', name: 'Scribe V1', category: 'asr', features: ['accurate', 'multilingual'] },
    ]
  },

  // 15. Alibaba Qwen
  {
    id: 'qwen',
    name: 'Alibaba Qwen',
    baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
    apiKeyEnv: 'QWEN_API_KEY',
    features: ['chat', 'vision', 'long_context', 'multimodal'],
    models: [
      { id: 'qwen-max', name: 'Qwen Max', category: 'llm', contextWindow: 32000, features: ['powerful', 'multilingual'] },
      { id: 'qwen-plus', name: 'Qwen Plus', category: 'llm', contextWindow: 128000, features: ['balanced'] },
      { id: 'qwen-turbo', name: 'Qwen Turbo', category: 'llm', contextWindow: 128000, features: ['fast'] },
      { id: 'qwen-vl-max', name: 'Qwen VL Max', category: 'vision', features: ['vision', 'ocr'] },
      { id: 'qwen-vl-plus', name: 'Qwen VL Plus', category: 'vision', features: ['vision', 'efficient'] },
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

export function getNewestModels(count: number = 5): Model[] {
  // Return the most recently added/updated models
  const newestIds = [
    'claude-sonnet-4-20250514',
    'gpt-4o-mini-tts',
    'o1-pro',
    'gemini-2.0-flash',
    'deepseek-reasoner',
  ];
  
  return providers
    .flatMap(p => p.models)
    .filter(m => newestIds.includes(m.id))
    .slice(0, count);
}

export default providers;
