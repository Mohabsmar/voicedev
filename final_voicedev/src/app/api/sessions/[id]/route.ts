import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await db.session.findUnique({
    where: { id },
    include: {
      events: { orderBy: { order: 'asc' } },
      toolCalls: { orderBy: { createdAt: 'asc' } },
      memories: true,
      costs: { orderBy: { createdAt: 'desc' } },
      errors: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json({ session })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await db.session.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const session = await db.session.update({
    where: { id },
    data: body,
  })
  return NextResponse.json({ session })
}
