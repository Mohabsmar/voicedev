import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Ensure default user exists
async function ensureDefaultUser() {
  let user = await db.user.findUnique({
    where: { id: 'default-user' }
  })
  
  if (!user) {
    user = await db.user.create({
      data: {
        id: 'default-user',
        email: 'default@voicedev.local',
        name: 'Default User',
      }
    })
  }
  
  return user
}

export async function GET() {
  try {
    await ensureDefaultUser()
    
    const sessions = await db.session.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { events: true, toolCalls: true, errors: true } },
        tags: { include: { tag: true } },
      },
    })
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json({ sessions: [], error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDefaultUser()
    
    const body = await request.json()
    const session = await db.session.create({
      data: {
        name: body.name || `Session ${Date.now()}`,
        description: body.description,
        userId: 'default-user',
      },
    })
    return NextResponse.json({ session })
  } catch (error) {
    console.error('Failed to create session:', error)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
