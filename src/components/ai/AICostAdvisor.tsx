import React, { useState } from 'react';
import { DollarSign, AlertTriangle, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const AICostAdvisor: React.FC = () => {
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState(1800);
  const [tier, setTier] = useState<'Economy' | 'Standard' | 'Premium' | 'Luxury'>('Standard');

  const rates = {
    Economy: { rate: 1650, matPct: 55, laborPct: 25, finishPct: 12, interiorPct: 5, contingencyPct: 3 },
    Standard: { rate: 2150, matPct: 50, laborPct: 22, finishPct: 15, interiorPct: 8, contingencyPct: 5 },
    Premium: { rate: 2950, matPct: 45, laborPct: 20, finishPct: 18, interiorPct: 12, contingencyPct: 5 },
    Luxury: { rate: 4200, matPct: 40, laborPct: 18, finishPct: 22, interiorPct: 15, contingencyPct: 5 }
  };

  const current = rates[tier];
  const totalCost = builtUpAreaSqFt * current.rate;

  const matCost = (totalCost * current.matPct) / 100;
  const laborCost = (totalCost * current.laborPct) / 100;
  const finishCost = (totalCost * current.finishPct) / 100;
  const interiorCost = (totalCost * current.interiorPct) / 100;
  const contingencyCost = (totalCost * current.contingencyPct) / 100;

  return (
    <div className="space-y-6 text-xs">
      <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>AI Budget & Turnkey Cost Advisor</span>
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">
            Comparative budget calculator: Economy, Standard, Premium & Luxury tier distribution.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-sm">
          Estimated Total: ₹{(totalCost / 100000).toFixed(2)} Lakhs
        </div>
      </div>

      {/* DISCLAIMER */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-slate-300 text-[11px] leading-relaxed">
          <strong className="text-amber-300 block font-bold">Informational Estimate Notice:</strong>
          All values displayed are indicative estimates based on current regional construction indices. Actual costs may vary depending on soil condition, site accessibility, market steel/cement price fluctuations, and customized architectural selections.
        </div>
      </div>

      {/* INPUTS & TIER SELECTOR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Area & Grade Inputs</h3>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Built-up Area (Sq.Ft)</label>
            <input 
              type="number" 
              value={builtUpAreaSqFt} 
              onChange={e => setBuiltUpAreaSqFt(Number(e.target.value))} 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-sm" 
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">Construction Quality Tier</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Economy', 'Standard', 'Premium', 'Luxury'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    tier === t ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-950 text-slate-400 border border-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-slate-400 text-[11px] space-y-1">
            <div className="text-white font-bold">Selected Tier Rate:</div>
            <div className="text-emerald-400 font-mono font-bold text-sm">₹{current.rate} / sq.ft</div>
            <p>Includes complete turnkey execution from foundation excavation to final key handover.</p>
          </div>
        </div>

        {/* DETAILED BREAKDOWN */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900 border border-white/10 space-y-6">
          <h3 className="font-bold text-white text-sm border-b border-white/10 pb-3">Itemized Budget Distribution ({tier} Grade)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Civil Raw Materials ({current.matPct}%)</span>
              <div className="text-emerald-400 font-mono font-bold text-base">₹{matCost.toLocaleString()}</div>
              <p className="text-slate-400 text-[10px]">Cement, steel rebar, bricks, sand, aggregate & water</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Labor & Execution ({current.laborPct}%)</span>
              <div className="text-emerald-400 font-mono font-bold text-base">₹{laborCost.toLocaleString()}</div>
              <p className="text-slate-400 text-[10px]">Masons, carpenters, bar-benders, plumbers & electricians</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Finishing & Fixtures ({current.finishPct}%)</span>
              <div className="text-emerald-400 font-mono font-bold text-base">₹{finishCost.toLocaleString()}</div>
              <p className="text-slate-400 text-[10px]">Vitrified flooring, sanitaryware, doors, windows & paint</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Interior Modular Work ({current.interiorPct}%)</span>
              <div className="text-emerald-400 font-mono font-bold text-base">₹{interiorCost.toLocaleString()}</div>
              <p className="text-slate-400 text-[10px]">Modular kitchen, wardrobes, false ceiling & lighting</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center text-[11px]">
            <div>
              <span className="text-white font-bold block">Contingency Buffer ({current.contingencyPct}%):</span>
              <span className="text-slate-300">Reserved for unforeseen site conditions or design changes.</span>
            </div>
            <span className="text-emerald-300 font-mono font-bold text-sm">₹{contingencyCost.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
