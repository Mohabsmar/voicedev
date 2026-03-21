// Stripe billing configuration for monetization

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '5 sessions/month',
      '1,000 events/month',
      'Basic timeline',
      'Community support',
    ],
    limits: {
      sessions: 5,
      events: 1000,
      teamMembers: 1,
      exports: 10,
      apiCalls: 100,
    },
  },
  pro: {
    name: 'Pro',
    price: 19,
    priceId: 'price_pro_monthly',
    features: [
      'Unlimited sessions',
      '50,000 events/month',
      'Advanced timeline & replay',
      'Memory inspector',
      'Cost analytics',
      'Priority support',
      'API access',
    ],
    limits: {
      sessions: -1,
      events: 50000,
      teamMembers: 5,
      exports: -1,
      apiCalls: 10000,
    },
  },
  team: {
    name: 'Team',
    price: 49,
    priceId: 'price_team_monthly',
    features: [
      'Everything in Pro',
      'Unlimited events',
      'Team collaboration',
      'Shared sessions',
      'Role-based access',
      'SSO/SAML',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      sessions: -1,
      events: -1,
      teamMembers: -1,
      exports: -1,
      apiCalls: -1,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    priceId: null,
    features: [
      'Everything in Team',
      'Self-hosted option',
      'Custom SLA',
      'Dedicated account manager',
      'On-premise deployment',
      'Custom model support',
      'Advanced security',
    ],
    limits: {
      sessions: -1,
      events: -1,
      teamMembers: -1,
      exports: -1,
      apiCalls: -1,
    },
  },
} as const

export type PlanKey = keyof typeof PLANS

export function getPlan(key: PlanKey) {
  return PLANS[key]
}

export function canUseFeature(plan: PlanKey, feature: string, currentUsage: number): boolean {
  const planData = PLANS[plan]
  const limit = planData.limits[feature as keyof typeof planData.limits]
  return limit === -1 || currentUsage < limit
}

export function getUpgradeMessage(plan: PlanKey, feature: string): string {
  const planOrder: PlanKey[] = ['free', 'pro', 'team', 'enterprise']
  const currentIndex = planOrder.indexOf(plan)
  const nextPlan = planOrder[Math.min(currentIndex + 1, planOrder.length - 1)]
  return `Upgrade to ${PLANS[nextPlan].name} for more ${feature}`
}
