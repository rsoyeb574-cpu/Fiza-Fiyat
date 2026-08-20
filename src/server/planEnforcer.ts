import { doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PLANS, getPlanLimits, PlanTier } from '../config/plans';

export interface UserServerUsage {
  aiQuestionsUsed: number;
  aiQuestionsLastResetDate: string; // YYYY-MM-DD
  estimatesUsed: number;
  estimatesLastResetMonth: string;  // YYYY-MM
  boqUsed: number;
  boqLastResetMonth: string;        // YYYY-MM
  conceptsUsed: number;
  conceptsLastResetMonth: string;   // YYYY-MM
  imageGenerationsUsed: number;
  imageGenerationsLastResetMonth: string; // YYYY-MM
  videoGenerationsUsed: number;
  videoGenerationsLastResetMonth: string; // YYYY-MM
}

export interface UserServerProfile {
  uid: string;
  email: string;
  plan: PlanTier;
  subscriptionStatus: string;
  usage: UserServerUsage;
}

function getDefaultServerUsage(): UserServerUsage {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);
  return {
    aiQuestionsUsed: 0,
    aiQuestionsLastResetDate: today,
    estimatesUsed: 0,
    estimatesLastResetMonth: currentMonth,
    boqUsed: 0,
    boqLastResetMonth: currentMonth,
    conceptsUsed: 0,
    conceptsLastResetMonth: currentMonth,
    imageGenerationsUsed: 0,
    imageGenerationsLastResetMonth: currentMonth,
    videoGenerationsUsed: 0,
    videoGenerationsLastResetMonth: currentMonth
  };
}

function normalizeServerUsage(usage?: Partial<UserServerUsage>): UserServerUsage {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);
  const def = getDefaultServerUsage();

  const current = { ...def, ...(usage || {}) };

  if (current.aiQuestionsLastResetDate !== today) {
    current.aiQuestionsUsed = 0;
    current.aiQuestionsLastResetDate = today;
  }

  if (current.estimatesLastResetMonth !== currentMonth) {
    current.estimatesUsed = 0;
    current.estimatesLastResetMonth = currentMonth;
  }

  if (current.boqLastResetMonth !== currentMonth) {
    current.boqUsed = 0;
    current.boqLastResetMonth = currentMonth;
  }

  if (current.conceptsLastResetMonth !== currentMonth) {
    current.conceptsUsed = 0;
    current.conceptsLastResetMonth = currentMonth;
  }

  if (current.imageGenerationsLastResetMonth !== currentMonth) {
    current.imageGenerationsUsed = 0;
    current.imageGenerationsLastResetMonth = currentMonth;
  }

  if (current.videoGenerationsLastResetMonth !== currentMonth) {
    current.videoGenerationsUsed = 0;
    current.videoGenerationsLastResetMonth = currentMonth;
  }

  return current;
}

// Server-authoritative in-memory profile and usage cache
const serverMemoryUserStore = new Map<string, UserServerProfile>();

export async function setUserServerPlan(userId: string, userEmail: string | null, plan: PlanTier): Promise<UserServerProfile> {
  const profile = await getUserServerProfile(userId, userEmail);
  profile.plan = plan;
  serverMemoryUserStore.set(profile.uid, profile);
  return profile;
}

export async function getUserServerProfile(userId: string | null, userEmail: string | null): Promise<UserServerProfile> {
  const uid = userId && userId.trim() ? userId.trim() : 'anonymous_guest_user';
  const email = userEmail || 'guest@fizahayatresearch.com';

  // Check cached server profile
  let cached = serverMemoryUserStore.get(uid);
  if (!cached) {
    cached = {
      uid,
      email,
      plan: 'free',
      subscriptionStatus: 'active',
      usage: getDefaultServerUsage()
    };
    serverMemoryUserStore.set(uid, cached);
  }
  cached.usage = normalizeServerUsage(cached.usage);

  if (!userId || userId === 'anonymous_guest_user') {
    return cached;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const plan: PlanTier = data.plan && ['free', 'medium', 'pro'].includes(data.plan) ? data.plan : 'free';
      const normalizedUsage = normalizeServerUsage(data.usage);

      cached = {
        uid,
        email: data.email || email,
        plan,
        subscriptionStatus: data.subscriptionStatus || 'active',
        usage: normalizedUsage
      };
      serverMemoryUserStore.set(uid, cached);

      // Save reset back if changed
      if (JSON.stringify(normalizedUsage) !== JSON.stringify(data.usage || {})) {
        await updateDoc(userRef, { usage: normalizedUsage, updatedAt: new Date().toISOString() }).catch(() => {});
      }

      return cached;
    }
  } catch (err: any) {
    // Expected when server Node process calls client Firestore without user token
    if (err?.code !== 'permission-denied' && !err?.message?.includes('insufficient permissions')) {
      console.warn('Firestore profile sync info (using cached server store):', err?.message || err);
    }
  }

  return cached;
}

export type ActionType = 'ai_chat' | 'estimate' | 'boq' | 'concept';

export async function verifyAndIncrementServerUsage(
  userId: string | null,
  userEmail: string | null,
  actionType: ActionType
): Promise<{ allowed: boolean; profile: UserServerProfile; currentUsage: number; limit: number; errorResponse?: any }> {
  const profile = await getUserServerProfile(userId, userEmail);
  const limits = getPlanLimits(profile.plan);
  const usage = profile.usage;

  let used = 0;
  let limit = 0;

  switch (actionType) {
    case 'ai_chat':
      used = usage.aiQuestionsUsed;
      limit = limits.aiQuestionsLimit;
      break;
    case 'estimate':
      used = usage.estimatesUsed;
      limit = limits.estimatesLimit;
      break;
    case 'boq':
      used = usage.boqUsed;
      limit = limits.boqLimit;
      break;
    case 'concept':
      used = usage.conceptsUsed;
      limit = limits.conceptsLimit;
      break;
  }

  if (used >= limit) {
    const planName = profile.plan.toUpperCase();
    return {
      allowed: false,
      profile,
      currentUsage: used,
      limit,
      errorResponse: {
        status: 'error',
        error: 'LIMIT_REACHED',
        code: 'LIMIT_REACHED',
        message: `Your ${planName} plan limit has been reached (${used}/${limit} used for ${actionType}). Upgrade your plan to continue.`,
        actionType,
        currentUsage: used,
        limit,
        plan: profile.plan
      }
    };
  }

  // Atomically increment server-side usage
  if (actionType === 'ai_chat') usage.aiQuestionsUsed += 1;
  else if (actionType === 'estimate') usage.estimatesUsed += 1;
  else if (actionType === 'boq') usage.boqUsed += 1;
  else if (actionType === 'concept') usage.conceptsUsed += 1;

  profile.usage = usage;
  serverMemoryUserStore.set(profile.uid, profile);

  // Sync to Firestore if authenticated/permitted
  if (profile.uid && profile.uid !== 'anonymous_guest_user') {
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { usage, updatedAt: new Date().toISOString() }).catch(() => {});
    } catch (_) {}
  }

  return {
    allowed: true,
    profile,
    currentUsage: used + 1,
    limit
  };
}

export async function checkServerMediaLimit(
  userId: string | null,
  userEmail: string | null,
  mediaType: 'image' | 'video',
  options?: { resolution?: string; includeAudio?: boolean }
): Promise<{ allowed: boolean; profile: UserServerProfile; currentUsage: number; limit: number; errorResponse?: any }> {
  const profile = await getUserServerProfile(userId, userEmail);
  const limits = getPlanLimits(profile.plan);
  const usage = profile.usage;

  const used = mediaType === 'image' ? usage.imageGenerationsUsed : usage.videoGenerationsUsed;
  const limit = mediaType === 'image' ? limits.imageGenerationsLimit : limits.videoGenerationsLimit;

  // Check 4K requirement
  if (mediaType === 'image' && options?.resolution === '4K' && !limits.allow4kImage) {
    return {
      allowed: false,
      profile,
      currentUsage: used,
      limit,
      errorResponse: {
        status: 'error',
        error: 'FEATURE_NOT_ALLOWED',
        code: 'LIMIT_REACHED',
        message: '4K Image Generation is available on the PRO plan. Upgrade your plan to generate 4K images.',
        plan: profile.plan
      }
    };
  }

  // Check audio requirement
  if (mediaType === 'video' && options?.includeAudio && !limits.allowVideoAudio) {
    return {
      allowed: false,
      profile,
      currentUsage: used,
      limit,
      errorResponse: {
        status: 'error',
        error: 'FEATURE_NOT_ALLOWED',
        code: 'LIMIT_REACHED',
        message: 'AI Video Audio generation is available on the PRO plan. Upgrade your plan to generate video audio.',
        plan: profile.plan
      }
    };
  }

  if (used >= limit) {
    return {
      allowed: false,
      profile,
      currentUsage: used,
      limit,
      errorResponse: {
        status: 'error',
        error: 'LIMIT_REACHED',
        code: 'LIMIT_REACHED',
        message: `You have reached your AI generation limit. Upgrade your plan to continue. (${used}/${limit} used for AI ${mediaType}s).`,
        currentUsage: used,
        limit,
        plan: profile.plan
      }
    };
  }

  return {
    allowed: true,
    profile,
    currentUsage: used,
    limit
  };
}

export async function incrementServerMediaUsage(
  userId: string | null,
  userEmail: string | null,
  mediaType: 'image' | 'video'
): Promise<void> {
  const profile = await getUserServerProfile(userId, userEmail);
  const usage = profile.usage;

  if (mediaType === 'image') {
    usage.imageGenerationsUsed += 1;
  } else {
    usage.videoGenerationsUsed += 1;
  }

  profile.usage = usage;
  serverMemoryUserStore.set(profile.uid, profile);

  if (profile.uid && profile.uid !== 'anonymous_guest_user') {
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { usage, updatedAt: new Date().toISOString() }).catch(() => {});
    } catch (_) {}
  }
}

