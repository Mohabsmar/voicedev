import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const event = await db.event.create({
    data: {
      sessionId: body.sessionId,
      type: body.type,
      content: JSON.stringify(body.content),
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      duration: body.duration || 0,
      order: body.order || 0,
    },
  })
  return NextResponse.json({ event })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  const events = await db.event.findMany({
    where: { sessionId },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json({ events })
}
