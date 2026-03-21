import { NextRequest, NextResponse } from 'next/server'
import { callAI, ChatMessage } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      messages, 
      model = 'gpt-4o', 
      provider = 'openai', 
      apiKey,
      temperature = 0.7,
      maxTokens = 4096 
    } = body

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Validate API key (check env or provided key)
    const envKey = getEnvKeyForProvider(provider)
    const effectiveApiKey = apiKey || envKey
    
    if (!effectiveApiKey) {
      return NextResponse.json(
        { error: `API key required for ${provider}. Set ${getEnvKeyName(provider)} or provide apiKey parameter.` },
        { status: 400 }
      )
    }

    // Make the real API call
    const response = await callAI({
      provider,
      model,
      messages: messages as ChatMessage[],
      apiKey: effectiveApiKey,
      temperature,
      maxTokens,
    })

    return NextResponse.json({
      success: true,
      content: response.content,
      usage: response.usage,
      model: response.model,
      provider: response.provider,
      finishReason: response.finishReason,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Chat API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Chat failed'
    
    // Handle specific error types
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 401 }
      )
    }
    
    if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait and try again.' },
        { status: 429 }
      )
    }
    
    if (errorMessage.includes('Unknown provider')) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// GET endpoint to list supported providers
export async function GET() {
  return NextResponse.json({
    providers: [
      { id: 'openai', name: 'OpenAI', models: ['gpt-5.4', 'gpt-5.4-mini', 'gpt-4o', 'o4', 'o4-mini'] },
      { id: 'anthropic', name: 'Anthropic', models: ['claude-sonnet-4.6', 'claude-opus-4.6', 'claude-4-sonnet'] },
      { id: 'google', name: 'Google AI', models: ['gemini-3.1-pro', 'gemini-3-pro', 'gemini-2.5-pro'] },
      { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-v3.2-exp', 'deepseek-v3.1', 'deepseek-r1-0528'] },
      { id: 'groq', name: 'Groq', models: ['llama-4-maverick', 'llama-4-scout', 'whisper-large-v3-turbo'] },
      { id: 'mistral', name: 'Mistral AI', models: ['mistral-small-4', 'mistral-large-3', 'codestral-latest'] },
      { id: 'xai', name: 'xAI (Grok)', models: ['grok-4.20-beta', 'grok-4.1', 'grok-4-vision'] },
      { id: 'zai', name: 'Z.ai (GLM)', models: ['glm-5', 'glm-4.7', 'glm-4.7-flash'], note: 'Z.ai = GLM = Zhipu AI' },
      { id: 'moonshot', name: 'Moonshot (Kimi)', models: ['kimi-k2.5', 'kimi-k2', 'moonshot-v1-128k'] },
      { id: 'minimax', name: 'MiniMax', models: ['minimax-m2.7', 'minimax-m2.5', 'speech-2.6-turbo'] },
      { id: 'cohere', name: 'Cohere', models: ['command-r3', 'command-r-plus', 'embed-v4'] },
      { id: 'together', name: 'Together AI', models: ['meta-llama/Llama-4-Maverick-Turbo', 'Qwen/Qwen3.5-397B-A17B'] },
    ],
    note: 'All API calls are REAL - they make actual HTTP requests to each provider.',
  })
}

function getEnvKeyForProvider(provider: string): string | undefined {
  const keyMap: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    google: process.env.GOOGLE_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    groq: process.env.GROQ_API_KEY,
    mistral: process.env.MISTRAL_API_KEY,
    xai: process.env.XAI_API_KEY,
    glm: process.env.GLM_API_KEY,
    moonshot: process.env.MOONSHOT_API_KEY,
    minimax: process.env.MINIMAX_API_KEY,
    cohere: process.env.COHERE_API_KEY,
    together: process.env.TOGETHER_API_KEY,
    zai: process.env.ZAI_API_KEY,
  }
  return keyMap[provider.toLowerCase()]
}

function getEnvKeyName(provider: string): string {
  const nameMap: Record<string, string> = {
    openai: 'OPENAI_API_KEY',
    anthropic: 'ANTHROPIC_API_KEY',
    google: 'GOOGLE_API_KEY',
    deepseek: 'DEEPSEEK_API_KEY',
    groq: 'GROQ_API_KEY',
    mistral: 'MISTRAL_API_KEY',
    xai: 'XAI_API_KEY',
    glm: 'GLM_API_KEY',
    moonshot: 'MOONSHOT_API_KEY',
    minimax: 'MINIMAX_API_KEY',
    cohere: 'COHERE_API_KEY',
    together: 'TOGETHER_API_KEY',
    zai: 'ZAI_API_KEY',
  }
  return nameMap[provider.toLowerCase()] || 'API_KEY'
}
