import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  const memories = await db.memory.findMany({
    where: { sessionId },
  })
  return NextResponse.json({ memories: memories.map(m => ({
    ...m,
    value: JSON.parse(m.value),
  })) })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const memory = await db.memory.upsert({
    where: {
      sessionId_key: {
        sessionId: body.sessionId,
        key: body.key,
      },
    },
    update: {
      value: JSON.stringify(body.value),
      type: body.type || 'string',
    },
    create: {
      sessionId: body.sessionId,
      key: body.key,
      value: JSON.stringify(body.value),
      type: body.type || 'string',
      scope: body.scope || 'session',
    },
  })
  return NextResponse.json({ memory })
}

export async function DELETE(request: NextRequest) {
  const body = await request.json()
  await db.memory.delete({
    where: {
      sessionId_key: {
        sessionId: body.sessionId,
        key: body.key,
      },
    },
  })
  return NextResponse.json({ success: true })
}
