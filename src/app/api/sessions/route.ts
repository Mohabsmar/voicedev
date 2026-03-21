import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const sessions = await db.session.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { events: true, toolCalls: true, errors: true } },
      tags: { include: { tag: true } },
    },
  })
  return NextResponse.json({ sessions })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const session = await db.session.create({
    data: {
      name: body.name || `Session ${Date.now()}`,
      description: body.description,
      userId: 'default-user',
    },
  })
  return NextResponse.json({ session })
}
