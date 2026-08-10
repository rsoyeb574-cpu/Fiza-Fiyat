import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  X, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  Building2, 
  FileText, 
  Calculator, 
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Star,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { PLANS, PlanTier, PlanDefinition } from '../config/plans';
import { initiateRazorpayCheckout } from '../services/razorpayClient';

interface PricingPageProps {
  onNavigate?: (page: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const { plan: currentPlan, usage, changePlan, planConfig, userProfile, refreshProfile } = usePlan();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [upgradingTier, setUpgradingTier] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePlanSelect = async (tier: PlanTier) => {
    if (tier === currentPlan) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (tier === 'free') {
      setUpgradingTier('free');
      await changePlan('free');
      setUpgradingTier(null);
      setSuccessMessage('Successfully switched to FREE plan.');
      setTimeout(() => setSuccessMessage(null), 6000);
      return;
    }

    // Razorpay Subscription flow for MEDIUM or PRO
    await initiateRazorpayCheckout({
      planTier: tier,
      userProfile,
      onStartLoading: () => setUpgradingTier(tier),
      onEndLoading: () => setUpgradingTier(null),
      onSuccess: async (newPlan) => {
        await refreshProfile();
        setSuccessMessage(`🎉 Payment verified! Your subscription is active on the ${newPlan.toUpperCase()} plan.`);
        setTimeout(() => setSuccessMessage(null), 8000);
      },
      onError: (errMsg) => {
        setErrorMessage(errMsg);
        setTimeout(() => setErrorMessage(null), 10000);
      }
    });
  };

  const faqs = [
    {
      q: 'How do daily and monthly usage limits work?',
      a: 'AI Chat questions reset every 24 hours at midnight. Construction Estimates, BOQ Generators, and AI Concept Generations reset on the 1st of every calendar month.'
    },
    {
      q: 'How do monthly Razorpay subscriptions work?',
      a: 'When upgrading to Medium or Pro, a recurring monthly Razorpay test subscription is initiated. Payments are verified server-side via HMAC signatures before updating your account entitlements.'
    },
    {
      q: 'Can I cancel or change my plan anytime?',
      a: 'Yes, you can downgrade back to the FREE tier or switch between plans anytime from the Pricing page. Your active subscription status is instantly synchronized in Firestore.'
    },
    {
      q: 'What happens when I reach my limit on the Free plan?',
      a: 'When you hit a limit, you will see a notification prompting you to upgrade to Medium or Pro. You can also wait for the daily/monthly reset.'
    },
    {
      q: 'Is my construction data safe and confidential?',
      a: 'Yes, all project estimates, BOQ data, and custom floor plans are stored securely in encrypted cloud infrastructure with strict security rules.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#020408] text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-purple-300 bg-purple-500/10 border border-purple-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Fiza-Fiyat SaaS Platform Plans
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Predictable Pricing for <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">Architectural & Engineering AI</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select the perfect subscription tier for your construction studio or individual site planning needs. Upgrade anytime for higher AI quotas and advanced reports.
          </p>
        </div>

        {/* Notifications Banners */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="max-w-3xl mx-auto mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="flex-1">{successMessage}</span>
          </div>
        )}

        {/* Current Active Plan Usage Dashboard Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 mb-12 border border-purple-500/30 bg-gradient-to-r from-slate-900/90 via-purple-950/30 to-slate-900/90 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Active Subscription</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {currentPlan.toUpperCase()} TIER
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Current Usage & Plan Entitlements</h2>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('construction-intelligence')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-all flex items-center gap-2"
              >
                Go to Construction Tools <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* AI Chat Questions */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">AI Chat Questions</div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold text-white font-mono">{usage.aiQuestionsUsed}</span>
                <span className="text-xs font-mono text-slate-400">/ {planConfig.limits.aiQuestionsLimit} per day</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (usage.aiQuestionsUsed / planConfig.limits.aiQuestionsLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Construction Estimates */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Estimates Generated</div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold text-cyan-300 font-mono">{usage.estimatesUsed}</span>
                <span className="text-xs font-mono text-slate-400">/ {planConfig.limits.estimatesLimit} per month</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-cyan-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (usage.estimatesUsed / planConfig.limits.estimatesLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* BOQ Generator */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">BOQ Documents</div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold text-blue-400 font-mono">{usage.boqUsed}</span>
                <span className="text-xs font-mono text-slate-400">/ {planConfig.limits.boqLimit} per month</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (usage.boqUsed / planConfig.limits.boqLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* AI Concepts */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">AI Concept Renders</div>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold text-amber-400 font-mono">{usage.conceptsUsed}</span>
                <span className="text-xs font-mono text-slate-400">/ {planConfig.limits.conceptsLimit} per month</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (usage.conceptsUsed / planConfig.limits.conceptsLimit) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {(Object.keys(PLANS) as PlanTier[]).map((tierKey) => {
            const p: PlanDefinition = PLANS[tierKey];
            const isCurrent = currentPlan === tierKey;
            const isPopular = p.highlight;

            return (
              <motion.div
                key={tierKey}
                whileHover={{ y: -5 }}
                className={`relative rounded-3xl p-8 border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-gradient-to-b from-blue-950/50 via-slate-900/90 to-slate-950/90 border-blue-500/60 shadow-2xl shadow-blue-500/10'
                    : isPopular
                    ? 'bg-gradient-to-b from-purple-950/50 via-slate-900/90 to-slate-950/90 border-purple-500/60 shadow-2xl shadow-purple-500/20'
                    : 'bg-slate-900/80 border-white/10 hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {p.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">{p.name}</h3>
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 mb-6 min-h-[36px]">{p.description}</p>

                  <div className="mb-8 pb-6 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-bold text-white font-mono">₹{p.priceINR}</span>
                      <span className="text-sm text-slate-400">/ month</span>
                    </div>
                  </div>

                  {/* Limits summary list */}
                  <div className="space-y-3 mb-8 text-sm text-slate-200">
                    {p.featureList.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePlanSelect(tierKey)}
                  disabled={isCurrent || upgradingTier === tierKey}
                  className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isCurrent
                      ? 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed'
                      : isPopular
                      ? 'bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-xl shadow-purple-600/25'
                      : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                  }`}
                >
                  {upgradingTier === tierKey ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                      <span>Initiating Razorpay...</span>
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
                  {!isCurrent && upgradingTier !== tierKey && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Detailed Feature Comparison Table */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 mb-16 border border-white/10 bg-slate-900/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Detailed Plan Comparison Matrix</h2>
            <p className="text-xs text-slate-400">Compare quotas, features, and engineering capabilities across all tiers.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white/5">
                  <th className="p-4 rounded-l-2xl">Features & Quotas</th>
                  <th className="p-4 text-center">FREE</th>
                  <th className="p-4 text-center text-purple-300">MEDIUM (₹199)</th>
                  <th className="p-4 text-center text-cyan-300 rounded-r-2xl">PRO (₹499)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-4 font-medium text-white">AI Questions Daily Quota</td>
                  <td className="p-4 text-center font-mono">10 / day</td>
                  <td className="p-4 text-center font-mono text-purple-300 font-bold">100 / day</td>
                  <td className="p-4 text-center font-mono text-cyan-300 font-bold">300 / day</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Construction Estimates Quota</td>
                  <td className="p-4 text-center font-mono">2 / month</td>
                  <td className="p-4 text-center font-mono text-purple-300 font-bold">20 / month</td>
                  <td className="p-4 text-center font-mono text-cyan-300 font-bold">100 / month</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">BOQ Generator Quota</td>
                  <td className="p-4 text-center font-mono">1 / month</td>
                  <td className="p-4 text-center font-mono text-purple-300 font-bold">10 / month</td>
                  <td className="p-4 text-center font-mono text-cyan-300 font-bold">50 / month</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">AI Concept Renders</td>
                  <td className="p-4 text-center font-mono">2 / month</td>
                  <td className="p-4 text-center font-mono text-purple-300 font-bold">20 / month</td>
                  <td className="p-4 text-center font-mono text-cyan-300 font-bold">100 / month</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">PDF Export & High-Res Printing</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 mx-auto text-rose-500" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Advanced Engineering & IS Standard Reports</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 mx-auto text-rose-500" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Premium Project Templates</td>
                  <td className="p-4 text-center text-xs text-slate-400">Limited</td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Priority AI Processing Queue</td>
                  <td className="p-4 text-center"><X className="w-5 h-5 mx-auto text-rose-500" /></td>
                  <td className="p-4 text-center"><X className="w-5 h-5 mx-auto text-rose-500" /></td>
                  <td className="p-4 text-center"><Check className="w-5 h-5 mx-auto text-emerald-400" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-white">Sponsor Advertisements</td>
                  <td className="p-4 text-center text-xs text-amber-400 font-semibold">Enabled</td>
                  <td className="p-4 text-center text-xs text-emerald-400 font-semibold">Ad-Free</td>
                  <td className="p-4 text-center text-xs text-emerald-400 font-semibold">Ad-Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 bg-slate-900/80 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-400">Everything you need to know about Fiza-Fiyat SaaS subscription plans.</p>
            </div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-slate-950/60 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
