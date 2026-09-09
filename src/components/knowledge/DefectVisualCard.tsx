import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Search, Wrench, ShieldAlert, Sparkles } from 'lucide-react';
import { DefectAnalysis } from '../../types/visualKnowledge';

interface DefectVisualCardProps {
  defect: DefectAnalysis;
}

export const DefectVisualCard: React.FC<DefectVisualCardProps> = ({ defect }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'investigation'>('visual');

  const severityColor = {
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  }[defect.severity];

  return (
    <div className="space-y-6 rounded-3xl bg-[#0F172A]/90 border border-rose-500/30 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-rose-400">
              Material Failure Analysis • MS & Sheet Metal
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${severityColor}`}>
              {defect.severity} Severity
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-white">
            {defect.defectName}
          </h3>
          <p className="text-xs text-neutral-400">
            Material: <span className="text-violet-300 font-semibold">{defect.material}</span>
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Normal vs Damaged
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'investigation'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Causes & Prevention
          </button>
        </div>
      </div>

      {/* NORMAL vs DAMAGED VISUAL COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Normal Image */}
        <div className="space-y-2 rounded-2xl bg-neutral-950 border border-emerald-500/30 p-3.5">
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img
              src={defect.normalImage}
              alt="Normal Sound Condition"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-emerald-950/90 text-emerald-300 text-xs font-bold border border-emerald-500/50 flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              NORMAL (Acceptable Baseline)
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 px-1">
            Sound weld root fusion, uniform surface profile, and protective mill scale coating.
          </p>
        </div>

        {/* Damaged Image */}
        <div className="space-y-2 rounded-2xl bg-neutral-950 border border-rose-500/30 p-3.5">
          <div className="relative h-64 rounded-xl overflow-hidden group">
            <img
              src={defect.damagedImage}
              alt="Damaged Defect Condition"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <span className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-rose-950/90 text-rose-300 text-xs font-bold border border-rose-500/50 flex items-center gap-1.5 shadow-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              DAMAGED (Defective Condition)
            </span>
          </div>
          <p className="text-[11px] text-rose-300/80 px-1 font-medium">
            Structural notch defect, gas porosity pockets, and reduction of effective load-bearing area.
          </p>
        </div>
      </div>

      {/* WHAT HAPPENED */}
      <div className="p-4 rounded-2xl bg-neutral-950/80 border border-white/10 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
          <InfoIcon className="w-4 h-4" />
          What Happened?
        </span>
        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
          {defect.whatHappened}
        </p>
      </div>

      {/* 4-QUADRANT ENGINEERING INVESTIGATION MATRIX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Possible Causes */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            Possible Causes
          </span>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {defect.possibleCauses.map((c, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-rose-400 font-bold">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What To Check */}
        <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            What to Check
          </span>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {defect.whatToCheck.map((chk, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-blue-400 font-bold">•</span>
                <span>{chk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Corrective Action */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            Corrective Action
          </span>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {defect.correctiveActions.map((act, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-amber-400 font-bold">•</span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prevention */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
            Prevention Tips
          </span>
          <ul className="space-y-1.5 text-xs text-neutral-300">
            {defect.preventionTips.map((prev, i) => (
              <li key={i} className="flex items-start gap-1.5 leading-snug">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{prev}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
