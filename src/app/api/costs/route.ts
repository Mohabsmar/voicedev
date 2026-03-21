import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  
  const costs = await db.cost.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json({ costs })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const cost = await db.cost.create({
    data: {
      sessionId: body.sessionId,
      provider: body.provider,
      model: body.model,
      inputTokens: body.inputTokens || 0,
      outputTokens: body.outputTokens || 0,
      cost: body.cost || 0,
      currency: body.currency || 'USD',
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
    }
  })
  
  return NextResponse.json({ cost })
}
