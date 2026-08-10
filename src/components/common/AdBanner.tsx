import React from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';
import { usePlan } from '../../context/PlanContext';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const { hasFeature, openUpgradeModal, plan } = usePlan();

  // If ads are disabled (Medium or Pro plan), do not render
  if (!hasFeature('adsEnabled')) {
    return null;
  }

  return (
    <div className={`rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border border-purple-500/20 shadow-md relative overflow-hidden ${className}`}>
      {/* Sponsor badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/10">
          Sponsored Partner
        </span>
        <button
          onClick={() => openUpgradeModal('Remove ads and increase AI limits by upgrading to Medium or Pro.')}
          className="text-[10px] text-purple-300 hover:text-purple-200 underline font-medium flex items-center gap-1"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          Remove Ads with Pro
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1">
              Ultratech & Tata Tiscon Direct Building Supply
            </div>
            <p className="text-[11px] text-slate-300">
              Get certified IS-grade TMT steel bars & OPC cement directly to your construction site at wholesale regional rates.
            </p>
          </div>
        </div>

        <a
          href="https://fizahayatresearch.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 transition-all shrink-0 flex items-center justify-center gap-1.5"
        >
          Inquire Now <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
