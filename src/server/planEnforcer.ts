import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
    conceptsLastResetMonth: currentMonth
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

  return current;
}

// In-memory fallback tracking for anonymous/guest server requests
const guestMemoryUsageStore = new Map<string, { plan: PlanTier; usage: UserServerUsage }>();

export async function getUserServerProfile(userId: string | null, userEmail: string | null): Promise<UserServerProfile> {
  const uid = userId || 'anonymous_guest_user';
  const email = userEmail || 'guest@fizahayatresearch.com';

  if (!userId || userId === 'anonymous_guest_user') {
    let memoryEntry = guestMemoryUsageStore.get(uid);
    if (!memoryEntry) {
      memoryEntry = { plan: 'free', usage: getDefaultServerUsage() };
      guestMemoryUsageStore.set(uid, memoryEntry);
    }
    memoryEntry.usage = normalizeServerUsage(memoryEntry.usage);
    return {
      uid,
      email,
      plan: memoryEntry.plan,
      subscriptionStatus: 'active',
      usage: memoryEntry.usage
    };
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const plan: PlanTier = data.plan && ['free', 'medium', 'pro'].includes(data.plan) ? data.plan : 'free';
      const normalizedUsage = normalizeServerUsage(data.usage);

      // Save reset back if changed
      if (JSON.stringify(normalizedUsage) !== JSON.stringify(data.usage || {})) {
        await updateDoc(userRef, { usage: normalizedUsage, updatedAt: new Date().toISOString() }).catch(() => {});
      }

      return {
        uid,
        email: data.email || email,
        plan,
        subscriptionStatus: data.subscriptionStatus || 'active',
        usage: normalizedUsage
      };
    } else {
      const defaultProfile: UserServerProfile = {
        uid,
        email,
        plan: 'free',
        subscriptionStatus: 'active',
        usage: getDefaultServerUsage()
      };

      await setDoc(userRef, {
        uid,
        email,
        plan: 'free',
        subscriptionStatus: 'active',
        usage: defaultProfile.usage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});

      return defaultProfile;
    }
  } catch (err) {
    console.warn('Server error reading Firestore profile, using guest store:', err);
    let memoryEntry = guestMemoryUsageStore.get(uid);
    if (!memoryEntry) {
      memoryEntry = { plan: 'free', usage: getDefaultServerUsage() };
      guestMemoryUsageStore.set(uid, memoryEntry);
    }
    memoryEntry.usage = normalizeServerUsage(memoryEntry.usage);
    return {
      uid,
      email,
      plan: memoryEntry.plan,
      subscriptionStatus: 'active',
      usage: memoryEntry.usage
    };
  }
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

  // Increment usage
  if (actionType === 'ai_chat') usage.aiQuestionsUsed += 1;
  else if (actionType === 'estimate') usage.estimatesUsed += 1;
  else if (actionType === 'boq') usage.boqUsed += 1;
  else if (actionType === 'concept') usage.conceptsUsed += 1;

  // Persist updated usage
  if (profile.uid && profile.uid !== 'anonymous_guest_user') {
    try {
      const userRef = doc(db, 'users', profile.uid);
      await updateDoc(userRef, { usage, updatedAt: new Date().toISOString() }).catch(() => {});
    } catch (e) {}
  } else {
    guestMemoryUsageStore.set(profile.uid, { plan: profile.plan, usage });
  }

  return {
    allowed: true,
    profile,
    currentUsage: used + 1,
    limit
  };
}
