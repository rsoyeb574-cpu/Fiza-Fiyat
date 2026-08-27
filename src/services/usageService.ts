import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { UserProfile, UserUsage } from '../types/userProfile';
import { PlanTier, getPlanLimits } from '../config/plans';

const LOCAL_PROFILE_KEY = 'fh_user_profile_cache';

export function getDefaultUsage(): UserUsage {
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

export function normalizeUsageWithReset(usage?: Partial<UserUsage>): UserUsage {
  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.substring(0, 7);
  const def = getDefaultUsage();

  const current = { ...def, ...(usage || {}) };

  // Daily AI questions reset
  if (current.aiQuestionsLastResetDate !== today) {
    current.aiQuestionsUsed = 0;
    current.aiQuestionsLastResetDate = today;
  }

  // Monthly estimates reset
  if (current.estimatesLastResetMonth !== currentMonth) {
    current.estimatesUsed = 0;
    current.estimatesLastResetMonth = currentMonth;
  }

  // Monthly BOQ reset
  if (current.boqLastResetMonth !== currentMonth) {
    current.boqUsed = 0;
    current.boqLastResetMonth = currentMonth;
  }

  // Monthly concepts reset
  if (current.conceptsLastResetMonth !== currentMonth) {
    current.conceptsUsed = 0;
    current.conceptsLastResetMonth = currentMonth;
  }

  // Monthly Image Generations reset
  if (current.imageGenerationsLastResetMonth !== currentMonth) {
    current.imageGenerationsUsed = 0;
    current.imageGenerationsLastResetMonth = currentMonth;
  }

  // Monthly Video Generations reset
  if (current.videoGenerationsLastResetMonth !== currentMonth) {
    current.videoGenerationsUsed = 0;
    current.videoGenerationsLastResetMonth = currentMonth;
  }

  return current;
}

export function getLocalCachedProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw) as UserProfile;
    profile.usage = normalizeUsageWithReset(profile.usage);
    return profile;
  } catch (e) {
    return null;
  }
}

export function setLocalCachedProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {}
}

/**
 * Fetch or initialize User Profile from Firestore
 */
export async function fetchOrCreateUserProfile(uid: string, email: string, displayName?: string): Promise<UserProfile> {
  const defaultProfile: UserProfile = {
    uid,
    email,
    displayName: displayName || email.split('@')[0],
    plan: 'free',
    subscriptionStatus: 'active',
    usage: getDefaultUsage(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // If user is not authenticated or is a guest session, use local cache/state directly
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== uid) {
    const cached = getLocalCachedProfile();
    if (cached && cached.uid === uid) return cached;
    setLocalCachedProfile(defaultProfile);
    return defaultProfile;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      const plan: PlanTier = data.plan && ['free', 'medium', 'pro'].includes(data.plan) ? data.plan : 'free';
      const normalizedUsage = normalizeUsageWithReset(data.usage);

      const existingProfile: UserProfile = {
        uid,
        email: data.email || email,
        displayName: data.displayName || displayName || email.split('@')[0],
        plan,
        subscriptionStatus: data.subscriptionStatus || 'active',
        usage: normalizedUsage,
        createdAt: data.createdAt || defaultProfile.createdAt,
        updatedAt: new Date().toISOString()
      };

      // If usage needed reset, save update back
      if (JSON.stringify(normalizedUsage) !== JSON.stringify(data.usage || {})) {
        await updateDoc(userRef, {
          usage: normalizedUsage,
          updatedAt: new Date().toISOString()
        }).catch(() => {});
      }

      setLocalCachedProfile(existingProfile);
      return existingProfile;
    } else {
      // Create new user profile document
      await setDoc(userRef, defaultProfile, { merge: true }).catch(err => {
        console.warn('Firestore set user profile error:', err);
      });
      setLocalCachedProfile(defaultProfile);
      return defaultProfile;
    }
  } catch (err) {
    console.warn('Network issue fetching user profile, using fallback:', err);
    const cached = getLocalCachedProfile();
    if (cached && cached.uid === uid) return cached;
    setLocalCachedProfile(defaultProfile);
    return defaultProfile;
  }
}

/**
 * Update plan in Firestore and local state
 */
export async function updateUserPlanInDb(uid: string, newPlan: PlanTier): Promise<UserProfile> {
  const cached = getLocalCachedProfile();
  const baseProfile = cached && cached.uid === uid ? cached : {
    uid,
    email: 'user@fizahayatresearch.com',
    plan: 'free' as PlanTier,
    subscriptionStatus: 'active' as const,
    usage: getDefaultUsage()
  };

  const updatedProfile: UserProfile = {
    ...baseProfile,
    plan: newPlan,
    subscriptionStatus: 'active',
    updatedAt: new Date().toISOString()
  };

  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await setDoc(userRef, {
        plan: newPlan,
        subscriptionStatus: 'active',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Error updating plan in DB:', err);
      }
    }
  }

  setLocalCachedProfile(updatedProfile);
  return updatedProfile;
}

/**
 * Check if a usage increment is allowed for a user
 */
export function checkActionAllowed(profile: UserProfile | null, actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept'): {
  allowed: boolean;
  used: number;
  limit: number;
  plan: PlanTier;
} {
  const plan: PlanTier = profile?.plan || 'free';
  const limits = getPlanLimits(plan);
  const usage = normalizeUsageWithReset(profile?.usage);

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

  return {
    allowed: used < limit,
    used,
    limit,
    plan
  };
}

/**
 * Client-side trigger to increment usage after successful operation
 */
export async function incrementClientUsage(uid: string, actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept'): Promise<UserProfile | null> {
  const cached = getLocalCachedProfile();
  if (!cached || cached.uid !== uid) return null;

  const usage = normalizeUsageWithReset(cached.usage);

  if (actionType === 'ai_chat') usage.aiQuestionsUsed += 1;
  else if (actionType === 'estimate') usage.estimatesUsed += 1;
  else if (actionType === 'boq') usage.boqUsed += 1;
  else if (actionType === 'concept') usage.conceptsUsed += 1;

  const updatedProfile: UserProfile = {
    ...cached,
    usage,
    updatedAt: new Date().toISOString()
  };

  setLocalCachedProfile(updatedProfile);

  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        usage,
        updatedAt: new Date().toISOString()
      });
    } catch (err: any) {
      if (err?.code !== 'permission-denied') {
        console.warn('Firestore update usage error:', err);
      }
    }
  }

  return updatedProfile;
}
