import Razorpay from 'razorpay';
import crypto from 'crypto';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PlanTier } from '../config/plans';

// In-memory cache for auto-created plan IDs if not set in environment variables
const createdPlanIdsCache: Record<string, string> = {};

export function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing or invalid.');
  }

  return new Razorpay({
    key_id,
    key_secret
  });
}

/**
 * Ensures or retrieves a Razorpay Plan ID for the specified tier
 */
export async function getOrCreatePlanId(planTier: 'medium' | 'pro'): Promise<string> {
  const envPlanId = planTier === 'medium' 
    ? process.env.RAZORPAY_MEDIUM_PLAN_ID 
    : process.env.RAZORPAY_PRO_PLAN_ID;

  if (envPlanId && envPlanId.trim().length > 0) {
    return envPlanId.trim();
  }

  if (createdPlanIdsCache[planTier]) {
    return createdPlanIdsCache[planTier];
  }

  const razorpay = getRazorpayClient();
  const amountInPaise = planTier === 'pro' ? 49900 : 19900; // ₹499 or ₹199
  const planName = planTier === 'pro' ? 'Fiza-Fiyat Pro Plan' : 'Fiza-Fiyat Medium Plan';

  try {
    const createdPlan = await razorpay.plans.create({
      period: 'monthly',
      interval: 1,
      item: {
        name: planName,
        amount: amountInPaise,
        currency: 'INR',
        description: `Fiza-Fiyat ${planTier.toUpperCase()} SaaS Monthly Subscription`
      }
    });

    if (createdPlan && createdPlan.id) {
      createdPlanIdsCache[planTier] = createdPlan.id;
      return createdPlan.id;
    }
    throw new Error('Failed to obtain plan ID from Razorpay API response.');
  } catch (err: any) {
    console.error(`Error creating/getting Razorpay plan for ${planTier}:`, err);
    throw err;
  }
}

/**
 * Creates a Razorpay Subscription for Medium or Pro tier
 */
export async function createRazorpaySubscription(
  planTier: 'medium' | 'pro',
  userId: string,
  userEmail: string
) {
  // Verify user's current plan in Firestore if userId is available
  if (userId && userId !== 'anonymous_guest_user') {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.plan === planTier && userData.subscriptionStatus === 'active') {
          throw new Error(`You are already subscribed to the active ${planTier.toUpperCase()} plan.`);
        }
      }
    } catch (err: any) {
      if (err.message && err.message.includes('already subscribed')) {
        throw err;
      }
      console.warn('Could not verify current user plan in Firestore, proceeding with subscription creation:', err.message);
    }
  }

  const razorpay = getRazorpayClient();
  const planId = await getOrCreatePlanId(planTier);

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId: userId || 'anonymous',
      userEmail: userEmail || '',
      planTier
    }
  });

  return {
    subscriptionId: subscription.id,
    planTier,
    keyId: process.env.RAZORPAY_KEY_ID,
    amount: planTier === 'pro' ? 49900 : 19900,
    currency: 'INR'
  };
}

/**
 * Verifies the Razorpay subscription signature server-side and updates user profile in Firestore
 */
export async function verifySubscriptionPayment(params: {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
  planTier: 'medium' | 'pro';
  userId: string;
  userEmail?: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('RAZORPAY_KEY_SECRET missing on server.');
  }

  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planTier, userId, userEmail } = params;

  // Razorpay HMAC signature verification formula for subscriptions:
  // HMAC-SHA256(razorpay_payment_id + "|" + razorpay_subscription_id, secret)
  const body = `${razorpay_payment_id}|${razorpay_subscription_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    console.error('Invalid Razorpay signature mismatch:', { expectedSignature, razorpay_signature });
    throw new Error('Invalid payment signature. Subscription verification failed.');
  }

  // Update Firestore user document
  if (userId && userId !== 'anonymous_guest_user') {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      plan: planTier,
      subscriptionStatus: 'active',
      razorpaySubscriptionId: razorpay_subscription_id,
      razorpayPaymentId: razorpay_payment_id,
      planUpdatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  return {
    verified: true,
    plan: planTier,
    subscriptionId: razorpay_subscription_id,
    paymentId: razorpay_payment_id
  };
}

/**
 * Verifies Razorpay Webhook signature and updates Firestore accordingly
 */
export async function processRazorpayWebhook(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error('No webhook secret or Razorpay key secret configured.');
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature.');
  }

  const event = JSON.parse(rawBody);
  const eventType = event.event;
  const payload = event.payload;

  console.log(`Razorpay Webhook received event: ${eventType}`);

  const subscriptionEntity = payload?.subscription?.entity;
  const paymentEntity = payload?.payment?.entity;
  
  const notes = subscriptionEntity?.notes || paymentEntity?.notes || {};
  const userId = notes.userId;
  const planTier = (notes.planTier as PlanTier) || 'medium';
  const subId = subscriptionEntity?.id || paymentEntity?.subscription_id;

  if (userId && userId !== 'anonymous_guest_user') {
    const userRef = doc(db, 'users', userId);

    switch (eventType) {
      case 'subscription.authenticated':
      case 'subscription.activated':
      case 'subscription.charged':
        await updateDoc(userRef, {
          plan: planTier,
          subscriptionStatus: 'active',
          razorpaySubscriptionId: subId || '',
          planUpdatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }).catch(() => {});
        break;

      case 'subscription.cancelled':
      case 'subscription.completed':
        await updateDoc(userRef, {
          subscriptionStatus: 'canceled',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
        break;

      case 'subscription.halted':
      case 'subscription.pending':
        await updateDoc(userRef, {
          subscriptionStatus: 'past_due',
          updatedAt: new Date().toISOString()
        }).catch(() => {});
        break;

      default:
        console.log(`Unhandled Razorpay event: ${eventType}`);
    }
  }

  return { processed: true, eventType };
}
