import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { messages, model = 'gpt-4o', sessionId } = body

  try {
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
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Chat failed' },
      { status: 500 }
    )
  }
}
