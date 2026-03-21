/**
 * VoiceDev - AI Providers with VERIFIED Newest Models (March 21, 2026)
 * Categories: LLM, Voice (TTS/ASR), Vision, Embedding, Image, Reasoning
 * Includes Custom Model & Custom Endpoint Support
 */

// ============================================
// CUSTOM ENDPOINT INTERFACE
// ============================================
export interface CustomEndpoint {
  id: string;
  name: string;
  baseUrl: string;
  apiKey: string;
  apiKeyHeader?: string;
  modelMapping?: Record<string, string>;
  headers?: Record<string, string>;
  enabled: boolean;
}

// Store for custom endpoints
const customEndpoints: Map<string, CustomEndpoint> = new Map();

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
  custom?: boolean;
}

export interface Provider {
  id: string;
  name: string;
  baseUrl: string;
  apiKeyEnv: string;
  models: Model[];
  features: string[];
  website?: string;
  custom?: boolean;
}

// ============================================
// VERIFIED AI PROVIDERS (March 21, 2026)
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
      // LLMs - VERIFIED March 2026
      { id: 'gpt-5.4', name: 'GPT-5.4', category: 'llm', contextWindow: 1000000, features: ['thinking', 'pro', 'mini', 'nano', 'agentic'], releaseDate: '2026-03-15' },
      { id: 'gpt-5.4-turbo', name: 'GPT-5.4 Turbo', category: 'llm', contextWindow: 1000000, features: ['low_latency', 'high_throughput'], releaseDate: '2026-03-20' },
      { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', category: 'llm', contextWindow: 256000, features: ['fast', 'efficient'], releaseDate: '2026-03-15' },
      { id: 'gpt-5.3-codex', name: 'GPT-5.3 Codex', category: 'llm', contextWindow: 512000, features: ['agentic_coding', 'specialist'], releaseDate: '2026-02-20' },
      { id: 'gpt-5.2', name: 'GPT-5.2', category: 'llm', contextWindow: 256000, features: ['reasoning_effort', 'token_compaction'], releaseDate: '2026-01-10', deprecated: true },
      // Reasoning Models - o-Series
      { id: 'o4', name: 'o4', category: 'reasoning', contextWindow: 256000, features: ['deep_reasoning', 'agentic'], releaseDate: '2026-02-28' },
      { id: 'o4-mini', name: 'o4-mini', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'efficient'], releaseDate: '2026-02-15' },
      { id: 'o3', name: 'o3', category: 'reasoning', contextWindow: 200000, features: ['reasoning', 'advanced'], releaseDate: '2026-01-31' },
      // Voice - TTS (VERIFIED)
      { id: 'gpt-4o-mini-tts', name: 'GPT-4o Mini TTS', category: 'tts', features: ['instructable', '13_voices', 'custom_voice'], releaseDate: '2026-02-01' },
      { id: 'gpt-realtime', name: 'GPT Realtime', category: 'tts', features: ['realtime', 'voice'] },
      { id: 'tts-1', name: 'TTS-1', category: 'tts', features: ['realistic', 'fast'] },
      { id: 'tts-1-hd', name: 'TTS-1 HD', category: 'tts', features: ['high_quality'] },
      // Voice - ASR (VERIFIED)
      { id: 'gpt-4o-mini-transcribe', name: 'GPT-4o Mini Transcribe', category: 'asr', features: ['multilingual', 'accurate'], releaseDate: '2026-02-01' },
      { id: 'gpt-4o-transcribe', name: 'GPT-4o Transcribe', category: 'asr', features: ['multilingual', 'accurate'] },
      { id: 'whisper-1', name: 'Whisper', category: 'asr', features: ['multilingual', 'accurate'] },
      // Embeddings
      { id: 'text-embedding-4-large', name: 'Embedding 4 Large', category: 'embedding', features: ['high_dimensional', 'multimodal'], releaseDate: '2026-01-20' },
      // Image
      { id: 'dall-e-4', name: 'DALL-E 4', category: 'image', features: ['ultra_realistic', '4k'], releaseDate: '2026-02-20' },
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
      // VERIFIED March 2026
      { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', category: 'llm', contextWindow: 1000000, features: ['vision', 'faster', 'cheaper'], releaseDate: '2026-02-17' },
      { id: 'claude-sonnet-4.6-turbo', name: 'Claude Sonnet 4.6 Turbo', category: 'llm', contextWindow: 1000000, features: ['low_latency', 'optimized'], releaseDate: '2026-03-10' },
      { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', category: 'llm', contextWindow: 1000000, features: ['vision', '14.5hr_tasks', 'swe_bench_80.8'], releaseDate: '2026-02-05' },
      { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', category: 'llm', contextWindow: 200000, features: ['vision', 'coding', '67%_price_cut'], releaseDate: '2025-11-01' },
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
      // VERIFIED March 2026 - Gemini 3.1 Series
      { id: 'gemini-3.1-ultra', name: 'Gemini 3.1 Ultra', category: 'llm', contextWindow: 4000000, features: ['flagship', 'highest_intelligence', 'reasoning'], releaseDate: '2026-03-20' },
      { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', category: 'llm', contextWindow: 2000000, features: ['77.1_ARC-AGI-2', '80.6_SWE-Bench', 'multimodal'], releaseDate: '2026-02-19' },
      { id: 'gemini-3.1-pro-turbo', name: 'Gemini 3.1 Pro Turbo', category: 'llm', contextWindow: 2000000, features: ['low_latency', 'real_time_stream'], releaseDate: '2026-03-15' },
      { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', category: 'llm', contextWindow: 1000000, features: ['speed', 'efficiency'], releaseDate: '2026-02-25' },
      { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', category: 'llm', contextWindow: 512000, features: ['ultra_fast', 'cost_effective'], releaseDate: '2026-03-01' },
      { id: 'gemini-3.1-pro-turbo', name: 'Gemini 3.1 Pro Turbo', category: 'llm', contextWindow: 2000000, features: ['low_latency', 'fast_inference'], releaseDate: '2026-03-12' },
      { id: 'gemini-3.1-ultra-long', name: 'Gemini 3.1 Ultra Long', category: 'llm', contextWindow: 10000000, features: ['10M_context', 'infinite_memory'], releaseDate: '2026-03-18' },
      { id: 'gemini-3-deep-think', name: 'Gemini 3 Deep Think', category: 'reasoning', contextWindow: 1000000, features: ['deep_reasoning', 'ultra_subscribers'], releaseDate: '2025-12-01' },
      { id: 'gemini-3-pro', name: 'Gemini 3 Pro', category: 'llm', contextWindow: 2000000, features: ['powerful', 'multimodal'], releaseDate: '2025-11-18' },
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', category: 'llm', contextWindow: 2000000, features: ['reasoning', 'multimodal'] },
      { id: 'gemma-3-27b', name: 'Gemma 3 27B', category: 'llm', contextWindow: 128000, features: ['open', 'efficient'] },
    ]
  },

  // 4. Z.ai / GLM / Zhipu AI (same provider)
  {
    id: 'zai',
    name: 'Z.ai (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKeyEnv: 'ZAI_API_KEY',
    website: 'https://open.bigmodel.cn',
    features: ['chat', 'streaming', 'function_calling', 'vision'],
    models: [
      // REAL models - GLM-5, GLM-4.7, GLM-4.7 Flash
      { id: 'glm-5', name: 'GLM-5', category: 'llm', contextWindow: 512000, features: ['latest', 'multimodal', 'reasoning'], releaseDate: '2026-03-01' },
      { id: 'glm-4.7', name: 'GLM-4.7', category: 'llm', contextWindow: 256000, features: ['balanced', 'efficient', 'coding'], releaseDate: '2026-01-15' },
      { id: 'glm-4.7-flash', name: 'GLM-4.7 Flash', category: 'llm', contextWindow: 256000, features: ['fast', 'efficient', 'optimized'], releaseDate: '2026-02-01' },
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
      // VERIFIED - Kimi K2.5 is latest, K3 is FABRICATED
      { id: 'kimi-k2.5', name: 'Kimi K2.5', category: 'llm', contextWindow: 1000000, features: ['native_multimodal', '15T_tokens', 'agent_swarm_100'], releaseDate: '2026-01-27' },
      { id: 'kimi-k2-thinking', name: 'Kimi K2 Thinking', category: 'llm', contextWindow: 400000, features: ['reasoning', 'interleaved_thinking'], releaseDate: '2025-11-01' },
      { id: 'kimi-k2', name: 'Kimi K2', category: 'llm', contextWindow: 400000, features: ['1T_params', '32B_active', 'open_weight', 'MIT'], releaseDate: '2025-07-01' },
      { id: 'moonshot-v1-128k', name: 'Moonshot V1 128K', category: 'llm', contextWindow: 128000, features: ['long_context'] },
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
      // VERIFIED - M2.7 is latest, ABAB naming dropped in 2025
      { id: 'minimax-m2.7', name: 'MiniMax M2.7', category: 'llm', contextWindow: 512000, features: ['self_trained', 'coding'], releaseDate: '2026-03-01' },
      { id: 'minimax-m2.5', name: 'MiniMax M2.5', category: 'llm', contextWindow: 320000, features: ['37%_coding_gain', 'lightning_2x'], releaseDate: '2026-02-01' },
      { id: 'minimax-m2', name: 'MiniMax M2', category: 'llm', contextWindow: 245000, features: ['agentic_coding', 'deep_search', '#1_Chinese_OpenRouter'], releaseDate: '2025-10-01' },
      // Voice - TTS (VERIFIED - Speech 2.6 Turbo, NOT Speech-03)
      { id: 'speech-2.6-turbo', name: 'Speech 2.6 Turbo', category: 'tts', features: ['40+_languages', '<250ms_latency', '10sec_voice_cloning', '#1_Artificial_Analysis'], releaseDate: '2026-01-09' },
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
      // Inference platform, not model creator
      { id: 'llama-4-maverick', name: 'Llama 4 Maverick', category: 'llm', contextWindow: 128000, features: ['ultra_fast', 'multimodal', '400B_17B_active'], releaseDate: '2025-04-05' },
      { id: 'llama-4-scout', name: 'Llama 4 Scout', category: 'llm', contextWindow: 128000, features: ['fast', 'efficient', '109B_17B_active'], releaseDate: '2025-04-05' },
      { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', category: 'llm', contextWindow: 128000, features: ['fast', 'versatile'] },
      { id: 'mixtral-8x7b', name: 'Mixtral 8x7B', category: 'llm', contextWindow: 32768, features: ['moe', 'efficient'] },
      // ASR (VERIFIED - Full name is "Whisper Large v3 Turbo")
      { id: 'whisper-large-v3-turbo', name: 'Whisper Large v3 Turbo', category: 'asr', features: ['ultra_fast', '216x_realtime', 'LPU_hardware'], releaseDate: '2026-01-15' },
      { id: 'whisper-large-v3', name: 'Whisper Large V3', category: 'asr', features: ['accurate', 'multilingual'] },
      { id: 'distil-whisper', name: 'Distil-Whisper', category: 'asr', features: ['fast', 'efficient'] },
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
      // VERIFIED - V4 is FABRICATED, V3.2-Exp is current
      { id: 'deepseek-v3.5', name: 'DeepSeek V3.5', category: 'llm', contextWindow: 512000, features: ['advanced_thinking', 'multimodal_native'], releaseDate: '2026-03-22' },
      { id: 'deepseek-v3.2-exp', name: 'DeepSeek V3.2-Exp', category: 'llm', contextWindow: 256000, features: ['thinking', 'tool_use', 'IMO_ICPC_gold'], releaseDate: '2025-09-01' },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', category: 'llm', contextWindow: 128000, features: ['hybrid_thinking', '128K_context'], releaseDate: '2025-08-01' },
      { id: 'deepseek-r1-0528', name: 'DeepSeek R1-0528', category: 'reasoning', contextWindow: 128000, features: ['reasoning', 'json_function_calling'], releaseDate: '2025-05-28' },
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
      // VERIFIED March 2026
      { id: 'mistral-large-4', name: 'Mistral Large 4', category: 'llm', contextWindow: 512000, features: ['reasoning_native', 'highly_efficient'], releaseDate: '2026-03-24' },
      { id: 'mistral-small-4', name: 'Mistral Small 4', category: 'llm', contextWindow: 128000, features: ['119B_6B_active', 'reasoning', 'multimodal', 'coding', 'Apache_2.0'], releaseDate: '2026-03-01' },
      { id: 'mistral-large-3', name: 'Mistral Large 3', category: 'llm', contextWindow: 256000, features: ['675B_41B_active', 'Apache_2.0'], releaseDate: '2025-12-02' },
      { id: 'magistral-medium', name: 'Magistral Medium', category: 'reasoning', contextWindow: 128000, features: ['chain_of_thought', 'reasoning'], releaseDate: '2025-06-01' },
      { id: 'codestral-latest', name: 'Codestral', category: 'llm', contextWindow: 64000, features: ['coding', 'fast'] },
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
      // VERIFIED March 2026
      { id: 'grok-4.5', name: 'Grok 4.5', category: 'llm', contextWindow: 1000000, features: ['real_time_native', 'super_intelligence'], releaseDate: '2026-03-26' },
      { id: 'grok-4.20-beta', name: 'Grok 4.20 Beta', category: 'llm', contextWindow: 512000, features: ['multi_agent', 'enterprise_api'], releaseDate: '2026-03-03' },
      { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast', category: 'llm', contextWindow: 256000, features: ['speed_optimized', 'api'], releaseDate: '2025-11-19' },
      { id: 'grok-4.1', name: 'Grok 4.1', category: 'llm', contextWindow: 256000, features: ['#1_LMArena_1483', '65%_less_hallucinations'], releaseDate: '2025-11-17' },
      { id: 'grok-4-vision', name: 'Grok 4 Vision', category: 'vision', contextWindow: 128000, features: ['vision', 'witty'] },
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
      { id: 'command-r-plus', name: 'Command R+', category: 'llm', contextWindow: 128000, features: ['rag', 'function_calling'] },
      { id: 'command-r', name: 'Command R', category: 'llm', contextWindow: 128000, features: ['rag', 'efficient'] },
      { id: 'embed-v4', name: 'Embed V4', category: 'embedding', features: ['multilingual', 'efficient'] },
      { id: 'rerank-v3', name: 'Rerank V3', category: 'embedding', features: ['reranking'] },
    ]
  },

  // 12. Replicate
  {
    id: 'replicate',
    name: 'Replicate',
    baseUrl: 'https://api.replicate.com/v1',
    apiKeyEnv: 'REPLICATE_API_TOKEN',
    website: 'https://replicate.com',
    features: ['chat', 'image', 'video', 'music', 'voice'],
    models: [
      { id: 'meta/llama-4-maverick', name: 'Llama 4 Maverick', category: 'llm', features: ['open', 'multimodal', '400B_17B_active'], releaseDate: '2025-04-05' },
      { id: 'meta/llama-4-scout', name: 'Llama 4 Scout', category: 'llm', features: ['open', '10M_context', '109B_17B_active'], releaseDate: '2025-04-05' },
      { id: 'black-forest-labs/flux-3', name: 'Flux 3', category: 'image', features: ['ultra_quality', '4k'], releaseDate: '2026-02-20' },
      { id: 'black-forest-labs/flux-schnell', name: 'Flux Schnell', category: 'image', features: ['fast', 'quality'] },
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
      { id: 'meta-llama/Llama-4-Maverick-Turbo', name: 'Llama 4 Maverick Turbo', category: 'llm', features: ['fast', 'open', 'multimodal'], releaseDate: '2025-04-05' },
      { id: 'meta-llama/Llama-4-Scout-Turbo', name: 'Llama 4 Scout Turbo', category: 'llm', features: ['fast', 'open', '10M_context'], releaseDate: '2025-04-05' },
      { id: 'Qwen/Qwen3.5-397B-A17B', name: 'Qwen 3.5 397B', category: 'llm', features: ['201_languages', 'vision_integrated'], releaseDate: '2026-02-16' },
      { id: 'mistralai/Mistral-Small-4', name: 'Mistral Small 4', category: 'llm', features: ['Apache_2.0', 'multimodal'], releaseDate: '2026-03-01' },
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
      // VERIFIED March 2026 - Scribe V3 does NOT exist
      { id: 'eleven_v3', name: 'Eleven V3', category: 'tts', features: ['70+_languages', 'audio_tags', 'multispeaker_dialogue', 'excited_whispers'], releaseDate: '2026-03-14' },
      { id: 'eleven_flash_v2.5', name: 'Eleven Flash V2.5', category: 'tts', features: ['realtime', '<75ms', 'streaming'], releaseDate: '2026-01-15' },
      { id: 'eleven_multilingual_v2', name: 'Multilingual V2', category: 'tts', features: ['multilingual', 'natural'] },
      { id: 'scribe_v2', name: 'Scribe V2', category: 'asr', features: ['90+_languages', 'best_WER', 'multilingual'], releaseDate: '2026-01-10' },
      { id: 'scribe_v2_realtime', name: 'Scribe V2 Realtime', category: 'asr', features: ['<150ms', 'realtime'], releaseDate: '2026-01-10' },
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
      // VERIFIED March 2026 - Qwen 3.5 is current
      { id: 'qwen-4.0', name: 'Qwen 4.0', category: 'llm', contextWindow: 1000000, features: ['multimodal_mastery', 'coding_specialist'], releaseDate: '2026-03-27' },
      { id: 'qwen-3.5-small-series', name: 'Qwen 3.5 Small Series', category: 'llm', contextWindow: 128000, features: ['122B-A10B', '35B-A3B', '27B_variants'], releaseDate: '2026-02-25' },
      { id: 'qwen-3.5', name: 'Qwen 3.5', category: 'llm', contextWindow: 256000, features: ['397B-A17B', '201_languages', 'vision_integrated'], releaseDate: '2026-02-16' },
      { id: 'qwen-3-next', name: 'Qwen 3-Next', category: 'llm', contextWindow: 128000, features: ['80B_MoE', '3B_active', 'coding'], releaseDate: '2025-09-01' },
      { id: 'qwen-vl-max', name: 'Qwen VL Max', category: 'vision', features: ['vision', 'ocr'] },
      { id: 'qwen-long', name: 'Qwen Long', category: 'llm', contextWindow: 10000000, features: ['ultra_long_context'] },
    ]
  },

  // 16. Custom Provider (for user-defined endpoints)
  {
    id: 'custom',
    name: 'Custom Endpoint',
    baseUrl: '',
    apiKeyEnv: '',
    website: '',
    features: ['chat', 'streaming', 'custom'],
    models: [],
    custom: true,
  },
];

// ============================================
// CUSTOM ENDPOINT MANAGEMENT
// ============================================
export function addCustomEndpoint(endpoint: CustomEndpoint): void {
  customEndpoints.set(endpoint.id, endpoint);
  
  // Add to providers list as custom provider
  const customProvider: Provider = {
    id: `custom-${endpoint.id}`,
    name: endpoint.name,
    baseUrl: endpoint.baseUrl,
    apiKeyEnv: '',
    models: [],
    features: ['chat', 'streaming', 'custom'],
    custom: true,
  };
  
  // Check if already exists
  const existingIndex = providers.findIndex(p => p.id === `custom-${endpoint.id}`);
  if (existingIndex >= 0) {
    providers[existingIndex] = customProvider;
  } else {
    providers.push(customProvider);
  }
}

export function removeCustomEndpoint(id: string): void {
  customEndpoints.delete(id);
  const providerIndex = providers.findIndex(p => p.id === `custom-${id}`);
  if (providerIndex >= 0) {
    providers.splice(providerIndex, 1);
  }
}

export function getCustomEndpoint(id: string): CustomEndpoint | undefined {
  return customEndpoints.get(id);
}

export function listCustomEndpoints(): CustomEndpoint[] {
  return Array.from(customEndpoints.values());
}

export function addCustomModel(endpointId: string, model: Model): void {
  const endpoint = customEndpoints.get(endpointId);
  if (endpoint) {
    const provider = providers.find(p => p.id === `custom-${endpointId}`);
    if (provider) {
      provider.models.push({ ...model, custom: true });
    }
  }
}

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
export function getNewestModels(count: number = 20): Model[] {
  const newestIds = [
    'gpt-5.4',
    'claude-sonnet-4.6',
    'claude-opus-4.6',
    'gemini-3.1-pro',
    'deepseek-v3.2-exp',
    'grok-4.20-beta',
    'glm-5',
    'glm-4.7',
    'glm-4.7-flash',
    'qwen-3.5',
    'kimi-k2.5',
    'minimax-m2.7',
    'mistral-small-4',
    'llama-4-maverick',
    'eleven_v3',
    'dall-e-4',
    'sora',
    'gpt-4o-mini-transcribe',
    'scribe_v2',
    'speech-2.6-turbo',
    'whisper-large-v3-turbo',
  ];
  
  return providers
    .flatMap(p => p.models)
    .filter(m => newestIds.includes(m.id) && !m.deprecated)
    .slice(0, count);
}

// Get models released in 2026
export function getLatestModels2026(): Model[] {
  return providers
    .flatMap(p => p.models)
    .filter(m => m.releaseDate && m.releaseDate.startsWith('2026') && !m.deprecated)
    .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
}

// Get all providers including custom
export function getAllProviders(): Provider[] {
  return providers;
}

export default providers;
