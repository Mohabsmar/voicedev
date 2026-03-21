import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { sessionId, isPublic = true } = body
  
  const shareToken = crypto.randomUUID().replace(/-/g, '').substring(0, 16)
  
  const replay = await db.replay.create({
    data: {
      sessionId,
      name: `Shared Session`,
      events: '[]',
      isPublic,
      shareToken,
    },
  })
  
  return NextResponse.json({
    shareToken,
    shareUrl: `/share/${shareToken}`,
    replay,
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const shareToken = searchParams.get('token')
  
  if (!shareToken) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }
  
  const replay = await db.replay.findUnique({
    where: { shareToken },
    include: {
      session: {
        include: {
          events: { orderBy: { order: 'asc' } },
          toolCalls: true,
        },
      },
    },
  })
  
  if (!replay || !replay.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  // Increment playback count
  await db.replay.update({
    where: { id: replay.id },
    data: { playbackCount: { increment: 1 } },
  })
  
  return NextResponse.json({ replay, session: replay.session })
}
