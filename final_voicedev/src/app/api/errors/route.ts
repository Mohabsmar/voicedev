import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId required' }, { status: 400 })
  }
  
  const errors = await db.error.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json({ errors })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const error = await db.error.create({
    data: {
      sessionId: body.sessionId,
      type: body.type,
      message: body.message,
      stack: body.stack,
      context: body.context ? JSON.stringify(body.context) : null,
    }
  })
  
  return NextResponse.json({ error })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  
  const error = await db.error.update({
    where: { id: body.id },
    data: {
      resolved: body.resolved,
      resolution: body.resolution,
      resolvedAt: body.resolved ? new Date() : null,
    }
  })
  
  return NextResponse.json({ error })
}
