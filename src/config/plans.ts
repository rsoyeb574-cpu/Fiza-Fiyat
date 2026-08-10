export type PlanTier = 'free' | 'medium' | 'pro';

export const MEDIA_COSTS = {
  IMAGE_STANDARD_COST: 1,
  IMAGE_HD_COST: 1,
  IMAGE_4K_COST: 2,
  VIDEO_STANDARD_COST: 1,
  VIDEO_AUDIO_COST: 2,
};

export interface PlanLimits {
  aiQuestionsLimit: number; // Daily
  estimatesLimit: number;   // Monthly
  boqLimit: number;         // Monthly
  conceptsLimit: number;     // Monthly
  imageGenerationsLimit: number; // Monthly
  videoGenerationsLimit: number; // Monthly
  allow4kImage: boolean;
  allowVideoAudio: boolean;
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
      conceptsLimit: 2,      // 2/month
      imageGenerationsLimit: 2, // 2/month
      videoGenerationsLimit: 0, // 0/month
      allow4kImage: false,
      allowVideoAudio: false
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
      'AI Images: 2 / month',
      'AI Video: 0 / month',
      'Construction Estimates: 2 / month',
      'BOQ Generator: 1 / month',
      'AI Concept Generation: 2 / month',
      'PDF Export: Disabled',
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
      conceptsLimit: 20,     // 20/month
      imageGenerationsLimit: 20, // 20/month
      videoGenerationsLimit: 3,  // 3/month
      allow4kImage: false,
      allowVideoAudio: false
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
      'AI Images: 20 / month',
      'AI Video: 3 / month',
      'Construction Estimates: 20 / month',
      'BOQ Generator: 10 / month',
      'AI Concept Generation: 20 / month',
      'PDF Export: Enabled',
      'Advanced Engineering Reports: Enabled',
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
      conceptsLimit: 100,    // 100/month
      imageGenerationsLimit: 100, // 100/month
      videoGenerationsLimit: 15,  // 15/month
      allow4kImage: true,
      allowVideoAudio: true
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
      'AI Images: 100 / month (4K allowed)',
      'AI Video: 15 / month (Audio allowed)',
      'Construction Estimates: 100 / month',
      'BOQ Generator: 50 / month',
      'AI Concept Generation: 100 / month',
      'PDF Export & Advanced Reports',
      'Priority AI Queue & Ad-Free'
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
