import { PlanTier } from '../config/plans';

export interface UserUsage {
  aiQuestionsUsed: number;
  aiQuestionsLastResetDate: string; // YYYY-MM-DD
  estimatesUsed: number;
  estimatesLastResetMonth: string;  // YYYY-MM
  boqUsed: number;
  boqLastResetMonth: string;        // YYYY-MM
  conceptsUsed: number;
  conceptsLastResetMonth: string;   // YYYY-MM
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  plan: PlanTier;
  subscriptionStatus: 'active' | 'canceled' | 'past_due';
  razorpaySubscriptionId?: string;
  razorpayPaymentId?: string;
  planUpdatedAt?: string;
  usage: UserUsage;
  createdAt?: string;
  updatedAt?: string;
}
