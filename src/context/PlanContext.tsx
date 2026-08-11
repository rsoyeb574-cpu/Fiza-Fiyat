import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import { PlanTier, PlanDefinition, PlanFeatures, getPlanConfig, hasFeatureAccess } from '../config/plans';
import { UserProfile, UserUsage } from '../types/userProfile';
import { 
  fetchOrCreateUserProfile, 
  updateUserPlanInDb, 
  checkActionAllowed, 
  incrementClientUsage, 
  getLocalCachedProfile, 
  setLocalCachedProfile,
  getDefaultUsage,
  normalizeUsageWithReset
} from '../services/usageService';

interface PlanContextType {
  plan: PlanTier;
  planConfig: PlanDefinition;
  userProfile: UserProfile | null;
  usage: UserUsage;
  loading: boolean;
  changePlan: (newPlan: PlanTier) => Promise<void>;
  hasFeature: (featureKey: keyof PlanFeatures) => boolean;
  checkUsage: (actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept') => { allowed: boolean; used: number; limit: number; plan: PlanTier };
  incrementUsage: (actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept') => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshPlan: () => Promise<void>;
  isUpgradeModalOpen: boolean;
  upgradeModalReason: string;
  openUpgradeModal: (reason?: string) => void;
  closeUpgradeModal: () => void;
}

const PlanContext = createContext<PlanContextType>({
  plan: 'free',
  planConfig: getPlanConfig('free'),
  userProfile: null,
  usage: getDefaultUsage(),
  loading: true,
  changePlan: async () => {},
  hasFeature: () => false,
  checkUsage: () => ({ allowed: true, used: 0, limit: 10, plan: 'free' }),
  incrementUsage: async () => {},
  refreshProfile: async () => {},
  refreshPlan: async () => {},
  isUpgradeModalOpen: false,
  upgradeModalReason: '',
  openUpgradeModal: () => {},
  closeUpgradeModal: () => {}
});

export const PlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => getLocalCachedProfile());
  const [loading, setLoading] = useState<boolean>(true);

  // Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<string>('');

  const loadProfile = useCallback(async () => {
    setLoading(true);
    if (user && user.uid) {
      const profile = await fetchOrCreateUserProfile(user.uid, user.email || 'user@fizahayatresearch.com', user.displayName || undefined);
      setUserProfile(profile);
    } else {
      // Guest or offline fallback user profile
      const guestId = 'guest_anonymous_session';
      const guestProfile: UserProfile = {
        uid: guestId,
        email: 'guest@fizahayatresearch.com',
        displayName: 'Guest Architect',
        plan: 'free',
        subscriptionStatus: 'active',
        usage: normalizeUsageWithReset(getLocalCachedProfile()?.usage || getDefaultUsage())
      };
      setUserProfile(guestProfile);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (user && user.uid) {
      // Initialize profile first
      fetchOrCreateUserProfile(user.uid, user.email || 'user@fizahayatresearch.com', user.displayName || undefined)
        .then((profile) => {
          setUserProfile(profile);
          setLoading(false);
        })
        .catch((err) => {
          console.warn('Error fetching user profile initially:', err);
          setLoading(false);
        });

      // Attach real-time snapshot listener on Firestore user document
      const userRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(
        userRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const updatedProfile: UserProfile = {
              uid: user.uid,
              email: data.email || user.email || '',
              displayName: data.displayName || user.displayName || 'Architect User',
              plan: (data.plan as PlanTier) || 'free',
              subscriptionStatus: data.subscriptionStatus || 'active',
              razorpaySubscriptionId: data.razorpaySubscriptionId,
              razorpayPaymentId: data.razorpayPaymentId,
              usage: normalizeUsageWithReset(data.usage),
              createdAt: data.createdAt,
              updatedAt: data.updatedAt
            };
            setUserProfile(updatedProfile);
            setLocalCachedProfile(updatedProfile);
          }
        },
        (error) => {
          console.warn('Firestore onSnapshot subscription listener error:', error);
        }
      );
    } else {
      loadProfile();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, loadProfile]);

  const plan: PlanTier = userProfile?.plan || 'free';
  const planConfig = getPlanConfig(plan);
  const usage = normalizeUsageWithReset(userProfile?.usage);

  const changePlan = async (newPlan: PlanTier) => {
    const uid = userProfile?.uid || user?.uid || 'guest_anonymous_session';
    const updated = await updateUserPlanInDb(uid, newPlan);
    setUserProfile(updated);
  };

  const hasFeature = (featureKey: keyof PlanFeatures): boolean => {
    return hasFeatureAccess(plan, featureKey);
  };

  const checkUsage = (actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept') => {
    return checkActionAllowed(userProfile, actionType);
  };

  const incrementUsage = async (actionType: 'ai_chat' | 'estimate' | 'boq' | 'concept') => {
    const uid = userProfile?.uid || user?.uid || 'guest_anonymous_session';
    const updated = await incrementClientUsage(uid, actionType);
    if (updated) {
      setUserProfile(updated);
    }
  };

  const openUpgradeModal = (reason?: string) => {
    setUpgradeModalReason(reason || 'You have reached your current plan limit. Upgrade your plan to continue using this feature.');
    setIsUpgradeModalOpen(true);
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setUpgradeModalReason('');
  };

  return (
    <PlanContext.Provider value={{
      plan,
      planConfig,
      userProfile,
      usage,
      loading,
      changePlan,
      hasFeature,
      checkUsage,
      incrementUsage,
      refreshProfile: loadProfile,
      refreshPlan: loadProfile,
      isUpgradeModalOpen,
      upgradeModalReason,
      openUpgradeModal,
      closeUpgradeModal
    }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => useContext(PlanContext);
