export type PlanTier = 'free' | 'medium' | 'pro';

export interface PlanLimits {
  aiQuestionsLimit: number; // Daily
  estimatesLimit: number;   // Monthly
  boqLimit: number;         // Monthly
  conceptsLimit: number;     // Monthly
}

export interface PlanFeatures {
  pdfExportAllowed: boolean;
  advancedReportsAllowed: boolean;
  premiumTemplatesAllowed: boolean;
  priorityAiAllowed: boolean;
  adsEnabled: boolean;
}

export interface PlanDefinition {
  id: PlanTier;
  name: string;
  priceINR: number;
  period: string; // e.g. "month"
  badge?: string;
  description: string;
  limits: PlanLimits;
  features: PlanFeatures;
  featureList: string[];
  highlight?: boolean;
}

export const PLANS: Record<PlanTier, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'FREE',
    priceINR: 0,
    period: 'month',
    badge: 'Starter',
    description: 'Essential architectural guidance and basic AI tools for individual exploration.',
    limits: {
      aiQuestionsLimit: 10,  // 10 questions/day
      estimatesLimit: 2,     // 2/month
      boqLimit: 1,           // 1/month
      conceptsLimit: 2       // 2/month
    },
    features: {
      pdfExportAllowed: false,
      advancedReportsAllowed: false,
      premiumTemplatesAllowed: false,
      priorityAiAllowed: false,
      adsEnabled: true
    },
    featureList: [
      'AI Chat: 10 questions / day',
      'Construction Estimates: 2 / month',
      'BOQ Generator: 1 / month',
      'AI Concept Generation: 2 / month',
      'PDF Export: Disabled',
      'Advanced Engineering Reports: Disabled',
      'Basic Project Templates',
      'Sponsor Ads Enabled'
    ],
    highlight: false
  },
  medium: {
    id: 'medium',
    name: 'MEDIUM',
    priceINR: 199,
    period: 'month',
    badge: 'Most Popular',
    description: 'Expanded capacity for homeowners, architects, and site engineers needing frequent calculations.',
    limits: {
      aiQuestionsLimit: 100, // 100 questions/day
      estimatesLimit: 20,    // 20/month
      boqLimit: 10,          // 10/month
      conceptsLimit: 20      // 20/month
    },
    features: {
      pdfExportAllowed: true,
      advancedReportsAllowed: true,
      premiumTemplatesAllowed: true,
      priorityAiAllowed: false,
      adsEnabled: false
    },
    featureList: [
      'AI Chat: 100 questions / day',
      'Construction Estimates: 20 / month',
      'BOQ Generator: 10 / month',
      'AI Concept Generation: 20 / month',
      'PDF Export: Enabled',
      'Advanced Engineering Reports: Enabled',
      'Premium Project & Plan Templates',
      'Ad-Free Experience'
    ],
    highlight: true
  },
  pro: {
    id: 'pro',
    name: 'PRO',
    priceINR: 499,
    period: 'month',
    badge: 'Professional & Studio',
    description: 'Maximum performance for civil consultants, real estate developers, and architectural studios.',
    limits: {
      aiQuestionsLimit: 300, // 300 questions/day (fair-use protected)
      estimatesLimit: 100,   // 100/month
      boqLimit: 50,          // 50/month
      conceptsLimit: 100     // 100/month
    },
    features: {
      pdfExportAllowed: true,
      advancedReportsAllowed: true,
      premiumTemplatesAllowed: true,
      priorityAiAllowed: true,
      adsEnabled: false
    },
    featureList: [
      'AI Chat: 300 questions / day',
      'Construction Estimates: 100 / month',
      'BOQ Generator: 50 / month',
      'AI Concept Generation: 100 / month',
      'PDF Export: Enabled',
      'Advanced Engineering Reports: Enabled',
      'Premium Templates & Priority AI',
      'Dedicated Priority Queue & Ad-Free'
    ],
    highlight: false
  }
};

export function getPlanConfig(planId: string | undefined | null): PlanDefinition {
  if (planId === 'medium') return PLANS.medium;
  if (planId === 'pro') return PLANS.pro;
  return PLANS.free;
}

export function getPlanLimits(planId: string | undefined | null): PlanLimits {
  return getPlanConfig(planId).limits;
}

export function hasFeatureAccess(planId: string | undefined | null, featureKey: keyof PlanFeatures): boolean {
  return getPlanConfig(planId).features[featureKey];
}
