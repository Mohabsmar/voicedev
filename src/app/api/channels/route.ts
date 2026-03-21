import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const channels = await db.channel.findMany({
    include: { 
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true } } } },
      _count: { select: { messages: true, members: true } }
    },
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json({ channels })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const channel = await db.channel.create({
    data: {
      name: body.name,
      description: body.description,
      type: body.type || 'public',
      ownerId: 'default-user',
    }
  })
  return NextResponse.json({ channel })
}
