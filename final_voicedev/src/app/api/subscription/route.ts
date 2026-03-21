import { NextRequest, NextResponse } from 'next/server'
import { PLANS } from '@/lib/billing/stripe'

export async function GET() {
  // Return available plans
  return NextResponse.json({ plans: PLANS })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { planId, userId } = body
  
  const plan = PLANS[planId as keyof typeof PLANS]
  if (!plan) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }
  
  // In production, create Stripe checkout session
  // For now, return mock checkout URL
  if (plan.price === 0) {
    return NextResponse.json({ 
      success: true, 
      message: 'Free plan activated',
      plan: planId 
    })
  }
  
  return NextResponse.json({
    checkoutUrl: `https://checkout.stripe.com/mock/${plan.priceId}`,
    plan: planId,
    price: plan.price,
  })
}
