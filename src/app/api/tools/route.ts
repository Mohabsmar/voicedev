import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const toolCall = await db.toolCall.create({
    data: {
      sessionId: body.sessionId,
      name: body.name,
      input: JSON.stringify(body.input),
      status: 'pending',
    },
  })
  return NextResponse.json({ toolCall })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const toolCall = await db.toolCall.update({
    where: { id: body.id },
    data: {
      output: body.output ? JSON.stringify(body.output) : null,
      status: body.status,
      error: body.error,
      duration: body.duration,
      tokensUsed: body.tokensUsed || 0,
      completedAt: new Date(),
    },
  })
  return NextResponse.json({ toolCall })
}
