import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const webhooks = await db.webhook.findMany({
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json({ webhooks })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const webhook = await db.webhook.create({
    data: {
      name: body.name,
      url: body.url,
      events: JSON.stringify(body.events || []),
      secret: body.secret,
      userId: 'default-user',
    }
  })
  return NextResponse.json({ webhook })
}
