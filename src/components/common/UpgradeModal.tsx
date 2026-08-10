import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, X, ShieldAlert, ArrowRight, Zap, Star, Loader2, AlertCircle } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';
import { PLANS, PlanTier } from '../../config/plans';
import { initiateRazorpayCheckout } from '../../services/razorpayClient';

interface UpgradeModalProps {
  onNavigateToPricing?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onNavigateToPricing }) => {
  const { isUpgradeModalOpen, upgradeModalReason, closeUpgradeModal, plan: currentPlan, changePlan, userProfile, refreshProfile } = usePlan();
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  if (!isUpgradeModalOpen) return null;

  const handleSelectPlan = async (newPlan: PlanTier) => {
    if (newPlan === currentPlan) return;
    setModalError(null);

    if (newPlan === 'free') {
      setUpgradingTier('free');
      await changePlan('free');
      setUpgradingTier(null);
      closeUpgradeModal();
      return;
    }

    await initiateRazorpayCheckout({
      planTier: newPlan,
      userProfile,
      onStartLoading: () => setUpgradingTier(newPlan),
      onEndLoading: () => setUpgradingTier(null),
      onSuccess: async () => {
        await refreshProfile();
        closeUpgradeModal();
      },
      onError: (errMsg) => {
        setModalError(errMsg);
      }
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            onClick={closeUpgradeModal}
            className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="text-center max-w-xl mx-auto mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Plan Limit Reached
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Unlock Higher Limits with <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">Fiza-Fiyat Pro</span>
            </h2>
            <p className="text-sm text-slate-300">
              {upgradeModalReason || 'Your current plan limit has been reached. Choose a plan below to upgrade instantly.'}
            </p>
          </div>

          {modalError && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{modalError}</span>
            </div>
          )}

          {/* Quick Plan Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {(Object.keys(PLANS) as PlanTier[]).map((tierKey) => {
              const p = PLANS[tierKey];
              const isCurrent = currentPlan === tierKey;
              const isPopular = p.highlight;

              return (
                <div
                  key={tierKey}
                  className={`relative rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : isPopular
                      ? 'bg-purple-950/40 border-purple-500/50 shadow-lg shadow-purple-500/10'
                      : 'bg-slate-950/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md">
                      {p.badge}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white uppercase tracking-wider">{p.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                          Current Plan
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-white font-mono">
                        ₹{p.priceINR}
                        <span className="text-xs text-slate-400 font-sans font-normal"> / month</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>

                    <div className="space-y-2 mb-6 border-t border-white/10 pt-4 text-xs text-slate-300">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>AI Chat: <strong className="text-white">{p.limits.aiQuestionsLimit}/day</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Estimates: <strong className="text-white">{p.limits.estimatesLimit}/mo</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>BOQ Generator: <strong className="text-white">{p.limits.boqLimit}/mo</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>AI Concepts: <strong className="text-white">{p.limits.conceptsLimit}/mo</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.features.pdfExportAllowed ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                        <span className={p.features.pdfExportAllowed ? 'text-white' : 'text-slate-500'}>
                          PDF Export
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(tierKey)}
                    disabled={isCurrent || upgradingTier === tierKey}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isCurrent
                        ? 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed'
                        : isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-600/20'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    {upgradingTier === tierKey ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                        <span>Opening Razorpay...</span>
                      </>
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : tierKey === 'medium' ? (
                      'Upgrade to Medium'
                    ) : tierKey === 'pro' ? (
                      'Upgrade to Pro'
                    ) : (
                      'Switch to FREE'
                    )}
                    {!isCurrent && upgradingTier !== tierKey && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Bottom Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400">
            <span>No credit card required for FREE tier. Instant activation.</span>
            {onNavigateToPricing && (
              <button
                onClick={() => {
                  closeUpgradeModal();
                  onNavigateToPricing();
                }}
                className="text-purple-400 hover:text-purple-300 font-medium underline flex items-center gap-1"
              >
                View Full Pricing & Feature Comparison Matrix <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
