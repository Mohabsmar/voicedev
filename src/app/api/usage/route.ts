import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default-user'
  
  // Get usage stats
  const sessions = await db.session.count({ where: { userId } })
  const totalCost = await db.cost.aggregate({
    _sum: { cost: true, inputTokens: true, outputTokens: true },
  })
  const events = await db.event.count()
  
  return NextResponse.json({
    usage: {
      sessions,
      events,
      totalCost: totalCost._sum.cost || 0,
      totalTokens: (totalCost._sum.inputTokens || 0) + (totalCost._sum.outputTokens || 0),
      inputTokens: totalCost._sum.inputTokens || 0,
      outputTokens: totalCost._sum.outputTokens || 0,
    },
    limits: {
      sessions: -1, // Pro limits
      events: -1,
    },
  })
}
