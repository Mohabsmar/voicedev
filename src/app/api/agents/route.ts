import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const agents = await db.agent.findMany({
    include: { tools: true, _count: { select: { runs: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ agents })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const agent = await db.agent.create({
    data: {
      name: body.name,
      description: body.description,
      provider: body.provider || 'openai',
      model: body.model || 'gpt-4o',
      systemPrompt: body.systemPrompt,
      temperature: body.temperature || 0.7,
      maxTokens: body.maxTokens || 4096,
      config: body.config ? JSON.stringify(body.config) : null,
      userId: 'default-user',
    }
  })
  return NextResponse.json({ agent })
}
