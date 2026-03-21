import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { messages, model = 'gpt-5.4', provider = 'openai', apiKey } = body

  // Validate API key
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API key is required. Please configure your API key in Settings.' },
      { status: 400 }
    )
  }

  try {
    // Use z-ai-web-dev-sdk for the chat
    const zai = await ZAI.create()
    
    const completion = await zai.chat.completions.create({
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      model,
    })

    const response = completion.choices[0]?.message?.content || ''
    const usage = completion.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }

    return NextResponse.json({
      response,
      usage,
      model,
      provider,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Chat failed'
    
    // Provide helpful error messages
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your API key in Settings.' },
        { status: 401 }
      )
    }
    
    if (errorMessage.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      )
    }
    
    return NextResponse.json(
      { error: `Error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
